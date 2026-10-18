import { json, corsHeaders, ensureDb, sendBrevoEmail } from './_utils.js'
import { storeProducts } from '../../src/data.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const reference = String(body.reference || `WZ-${Date.now()}`).trim()
    const buyerName = String(body.name || 'Customer').trim()
    const buyerEmail = String(body.email || '').trim().toLowerCase()
    const itemType = String(body.item_type || 'product').trim() // 'product' | 'ai_unlock'
    const itemId = String(body.item_id || '').trim()
    const itemTitle = String(body.item_title || 'Digital Product').trim()
    const currency = String(body.currency || 'NGN').trim()
    const amount = Number(body.amount || 0)
    const aiRunId = body.ai_run_id ? Number(body.ai_run_id) : null

    if (!buyerEmail || !buyerEmail.includes('@')) {
      return json({ ok: false, error: 'Buyer email is required.' }, 400)
    }

    // Strict verification: no secret key = no orders. Never trust the browser.
    if (!env?.PAYSTACK_SECRET_KEY) {
      return json({ ok: false, error: 'Payments are not enabled yet.' }, 503)
    }

    // Work out the real price on the server (ignore the amount the browser sent).
    let expectedAmount = 0
    if (itemType === 'ai_unlock') {
      const { aiLabConfig } = await import('../../src/data.js')
      expectedAmount = currency === 'NGN' ? aiLabConfig.unlockPrice.NGN : aiLabConfig.unlockPrice.USD
    } else {
      const dbForPrice = await ensureDb(env)
      let p = dbForPrice
        ? await dbForPrice.prepare('SELECT price_ngn, price_usd FROM products WHERE slug = ? OR CAST(id AS TEXT) = ?').bind(itemId, itemId).first()
        : null
      if (!p) p = storeProducts.find((x) => x.slug === itemId || String(x.id) === itemId)
      if (!p) return json({ ok: false, error: 'Unknown product.' }, 400)
      expectedAmount = currency === 'NGN' ? Number(p.price_ngn) : Number(p.price_usd)
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    })
    const verifyData = verifyRes.ok ? await verifyRes.json() : null
    const tx = verifyData?.data
    const paidOk =
      tx?.status === 'success' &&
      String(tx.currency || '').toUpperCase() === currency.toUpperCase() &&
      Number(tx.amount) >= Math.round(expectedAmount * 100)
    if (!paidOk) {
      return json({ ok: false, error: 'Payment verification failed with Paystack.' }, 400)
    }

    // Block re-using the same payment reference for another item.
    const dbCheck = await ensureDb(env)
    if (dbCheck) {
      const existing = await dbCheck.prepare('SELECT item_id FROM orders WHERE reference = ?').bind(reference).first()
      if (existing && existing.item_id !== itemId) {
        return json({ ok: false, error: 'This payment reference was already used.' }, 400)
      }
    }

    const db = await ensureDb(env)
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
🔗 Download Link: https://weezie.site${downloadUrl}

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
