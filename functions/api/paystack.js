import { json, corsHeaders, ensureDb, sendBrevoEmail } from './_utils.js'
import { storeProducts } from '../../src/data.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet() {
  return json({
    ok: true,
    service: 'Weezie Paystack Gateway & Webhook Listener',
    status: 'active',
    webhookUrl: 'https://weezie.site/api/paystack',
    callbackUrl: 'https://weezie.site/store',
  })
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => ({}))

    const isWebhook = body?.event === 'charge.success' && Boolean(body?.data)
    const txData = isWebhook ? body.data : null

    const customFields = isWebhook
      ? (txData.metadata?.custom_fields || [])
      : (body.metadata?.custom_fields || [])

    const reference = String(
      (isWebhook ? txData.reference : body.reference) || `WZ-${Date.now()}`
    ).trim()

    const buyerName = String(
      (isWebhook
        ? customFields.find((f) => f.variable_name === 'buyer_name')?.value || txData.customer?.first_name || 'Customer'
        : body.name) || 'Customer'
    ).trim()

    const buyerEmail = String(
      (isWebhook ? txData.customer?.email : body.email) || ''
    ).trim().toLowerCase()

    const itemType = String(
      (isWebhook
        ? (customFields.find((f) => f.variable_name === 'ai_tool')?.value ? 'ai_unlock' : 'product')
        : body.item_type) || 'product'
    ).trim()

    const itemId = String(
      (isWebhook
        ? customFields.find((f) => f.variable_name === 'product_slug')?.value || 'digital-product'
        : body.item_id) || ''
    ).trim()

    const itemTitle = String(
      (isWebhook
        ? (itemType === 'ai_unlock' ? 'Full Deep-Dive AI Pack' : 'Digital Product')
        : body.item_title) || 'Digital Product'
    ).trim()

    const currency = String(
      (isWebhook ? txData.currency : body.currency) || 'NGN'
    ).trim()

    const amount = isWebhook ? Number(txData.amount || 0) / 100 : Number(body.amount || 0)
    const aiRunId = isWebhook ? null : (body.ai_run_id ? Number(body.ai_run_id) : null)

    if (!buyerEmail || !buyerEmail.includes('@')) {
      return json({ ok: false, error: 'Buyer email is required.' }, 400)
    }

    const db = await ensureDb(env)

    // If order already recorded, return success immediately
    if (db) {
      const existing = await db.prepare('SELECT id FROM orders WHERE reference = ?').bind(reference).first()
      if (existing) {
        return json({ ok: true, already_processed: true })
      }
    }

    let secretKey = (env?.PAYSTACK_SECRET_KEY || '').trim()
    if (!secretKey && db) {
      const row = await db.prepare("SELECT value FROM app_settings WHERE key = 'paystack_secret_key'").first()
      if (row?.value) secretKey = String(row.value).trim()
    }

    // Strict verification: no secret key = no orders.
    if (!secretKey) {
      return json({ ok: false, error: 'Payments are not enabled yet. Configure your Paystack Secret Key (sk_test_... or sk_live_...) in the Admin CRM under Orders & Keys.' }, 503)
    }

    // Work out the real price on the server (ignore the amount the browser sent).
    let expectedNgn = 0
    let expectedUsd = 0
    if (itemType === 'ai_unlock') {
      const { aiLabConfig } = await import('../../src/data.js')
      expectedNgn = aiLabConfig.unlockPrice.NGN
      expectedUsd = aiLabConfig.unlockPrice.USD
    } else {
      let p = db
        ? await db.prepare('SELECT price_ngn, price_usd FROM products WHERE slug = ? OR CAST(id AS TEXT) = ?').bind(itemId, itemId).first()
        : null
      if (!p) p = storeProducts.find((x) => x.slug === itemId || String(x.id) === itemId)
      if (!p) return json({ ok: false, error: 'Unknown product.' }, 400)
      expectedNgn = Number(p.price_ngn)
      expectedUsd = Number(p.price_usd)
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    })
    const verifyData = verifyRes.ok ? await verifyRes.json() : null
    const tx = verifyData?.data
    const txCurrency = String(tx?.currency || '').toUpperCase()

    // Accept payment if it satisfies either the NGN price or the USD price
    const paidOk =
      tx?.status === 'success' &&
      ((txCurrency === 'NGN' && Number(tx.amount) >= Math.round(expectedNgn * 100)) ||
       (txCurrency === 'USD' && Number(tx.amount) >= Math.round(expectedUsd * 100)))

    if (!paidOk) {
      const errMsg = verifyData?.message || (verifyRes.ok ? 'Payment verification failed: Amount or currency did not match.' : 'Could not verify payment with Paystack.')
      return json({ ok: false, error: errMsg }, 400)
    }

    // Block re-using the same payment reference for another item.
    if (db) {
      const existing = await db.prepare('SELECT item_id FROM orders WHERE reference = ?').bind(reference).first()
      if (existing && existing.item_id !== itemId) {
        return json({ ok: false, error: 'This payment reference was already used.' }, 400)
      }
    }

    let downloadUrl = ''
    let fullReportMd = ''

    if (itemType === 'product') {
      let prod = null
      if (db) {
        prod = await db.prepare('SELECT * FROM products WHERE slug = ? OR CAST(id AS TEXT) = ?').bind(itemId, itemId).first()
        if (prod) {
          await db.prepare('UPDATE products SET downloads_count = downloads_count + 1 WHERE id = ?').bind(prod.id).run()
        }
      }
      if (!prod) {
        prod = storeProducts.find((p) => p.slug === itemId || String(p.id) === itemId)
      }
      downloadUrl = prod?.file_url || `/downloads/${itemId}.zip`
    } else if (itemType === 'ai_unlock' && aiRunId && db) {
      await db
        .prepare('UPDATE ai_runs SET unlocked = 1, visitor_email = ?, order_reference = ? WHERE id = ?')
        .bind(buyerEmail, reference, aiRunId)
        .run()
      const runRow = await db.prepare('SELECT * FROM ai_runs WHERE id = ?').bind(aiRunId).first()
      if (runRow) {
        fullReportMd = runRow.full_report_md
      }
    }

    if (db) {
      await db
        .prepare(
          `INSERT OR REPLACE INTO orders
          (reference, buyer_name, buyer_email, item_type, item_id, item_title, currency, amount, status, download_url, ai_run_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'paid', ?, ?)`,
        )
        .bind(reference, buyerName, buyerEmail, itemType, itemId, itemTitle, currency, amount, downloadUrl, aiRunId)
        .run()

      // Also save buyer into CRM leads if not already present
      await db
        .prepare(
          `INSERT INTO leads (name, email, source, status, plan, currency, estimated_total, message, subscribed)
           VALUES (?, ?, ?, 'Won', ?, ?, ?, ?, 1)`,
        )
        .bind(
          buyerName,
          buyerEmail,
          itemType === 'ai_unlock' ? 'ai_tool' : 'store',
          itemTitle,
          currency,
          `${currency === 'NGN' ? '₦' : '$'}${amount.toLocaleString('en-US')}`,
          `Purchased ${itemTitle} (Ref: ${reference})`,
        )
        .run()
    }

    const finalDownloadUrl = downloadUrl
      ? (downloadUrl.startsWith('http') ? downloadUrl : `https://weezie.site${downloadUrl.startsWith('/') ? '' : '/'}${downloadUrl}`)
      : 'https://weezie.site/store'

    // Email receipt & download/report to customer from hello@weezie.site
    const mailBody =
      itemType === 'ai_unlock'
        ? `Hi ${buyerName},

Thank you for unlocking your Full Deep-Dive AI Pack (${itemTitle}) on weezie.site!

Order Reference: ${reference}
Amount Paid: ${currency === 'NGN' ? '₦' : '$'}${amount.toLocaleString('en-US')}

--- YOUR FULL DEEP-DIVE PACK ---

${fullReportMd || 'Your full report is now unlocked on your screen.'}

--------------------------------

Want me to design and build this for you end-to-end? Your ${currency === 'NGN' ? '₦5,000' : '$5'} unlock fee is 100% credited toward your build when you book a project with me. Just reply to this email!

Best,
Enang Weezie
https://weezie.site`
        : `Hi ${buyerName},

Thank you for your purchase on weezie.site!

📦 Product: ${itemTitle}
🧾 Reference: ${reference}
💳 Amount: ${currency === 'NGN' ? '₦' : '$'}${amount.toLocaleString('en-US')}
🔗 Download Link: ${finalDownloadUrl}

🎁 FREE BONUS INCLUDED:
As an extra thank-you, you also get our full Weezie UI Bundle (35 React & Tailwind Components) completely free!
🔗 Bonus Component Pack: https://weezie.site/downloads/weezie-ui-components.zip

Need help customizing this template for your brand or connecting your backend? Reply directly to this email and I'll take care of you.

Best,
Enang Weezie
https://weezie.site`

    await sendBrevoEmail(env, {
      fromEmail: 'hello@weezie.site',
      fromName: 'Enang Weezie Studio',
      toEmail: buyerEmail,
      toName: buyerName,
      subject: `Receipt & Download: ${itemTitle} (${reference})`,
      textContent: mailBody,
    })

    return json({
      ok: true,
      reference,
      downloadUrl: downloadUrl || null,
      fullReportMd: fullReportMd || null,
    })
  } catch (err) {
    return json({ ok: false, error: err.message || 'Payment verification error' }, 500)
  }
}
