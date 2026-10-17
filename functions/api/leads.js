import { json, corsHeaders, ensureDb, sendBrevoEmail } from './_utils.js'
import { storeProducts } from '../../src/data.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const name = String(body.name || 'Visitor').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '').trim()
    const source = String(body.source || 'contact').trim()
    const plan = String(body.plan || '').trim()
    const budget = String(body.budget || '').trim()
    const currency = String(body.currency || 'USD').trim()
    const estimatedTotal = String(body.estimated_total || '').trim()
    const discountCode = String(body.discount_code || '').trim()
    const message = String(body.message || '').trim()
    const productSlug = String(body.product_slug || '').trim()
    const briefJson = body.brief ? JSON.stringify(body.brief) : '{}'

    if (!email || !email.includes('@')) {
      return json({ ok: false, error: 'A valid email address is required.' }, 400)
    }

    const db = await ensureDb(env)
    let leadId = null
    let downloadUrl = ''
    let productTitle = ''

    if (source === 'freebie' && productSlug) {
      let prod = null
      if (db) {
        prod = await db.prepare('SELECT * FROM products WHERE slug = ?').bind(productSlug).first()
        if (prod) {
          await db.prepare('UPDATE products SET downloads_count = downloads_count + 1 WHERE id = ?').bind(prod.id).run()
        }
      }
      if (!prod) {
        prod = storeProducts.find((p) => p.slug === productSlug)
      }
      if (prod) {
        downloadUrl = prod.file_url || '/downloads/weezie-free-hero-pack.zip'
        productTitle = prod.title
      }
    }

    if (db) {
      const res = await db
        .prepare(
          `INSERT INTO leads
          (name, email, phone, source, status, plan, budget, currency, estimated_total, discount_code, message, brief_json, subscribed)
          VALUES (?, ?, ?, ?, 'New', ?, ?, ?, ?, ?, ?, ?, 1)`,
        )
        .bind(name, email, phone, source, plan, budget, currency, estimatedTotal, discountCode, message, briefJson)
        .run()
      leadId = res?.meta?.last_row_id || null

      if (source !== 'freebie') {
        await db
          .prepare(
            `INSERT INTO inbox_messages (mailbox, from_email, from_name, subject, body_text, is_read)
             VALUES ('enang@weezie.site', ?, ?, ?, ?, 0)`,
          )
          .bind(
            email,
            name,
            source === 'brief' ? `Project Brief: ${plan || 'Custom Build'} (${estimatedTotal || 'Quote'})` : `Website Inquiry from ${name}`,
            message || 'Submitted via weezie.site',
          )
          .run()
      }
    }

    // Send automated email to the visitor from hello@weezie.site
    if (source === 'freebie') {
      const mailBody = `Hi ${name},

Here is your free download from weezie.site:
📦 ${productTitle || 'Starter Pack'}
🔗 Download link: https://weezie.site${downloadUrl}

If you ever need a custom website, web app, e-commerce store, or AI automation built from scratch, just reply directly to this email!

Best,
Enang Weezie
https://weezie.site`

      await sendBrevoEmail(env, {
        fromEmail: 'hello@weezie.site',
        fromName: 'Enang Weezie Studio',
        toEmail: email,
        toName: name,
        subject: `Your free download: ${productTitle || 'Weezie Freebie Pack'} ⚡`,
        textContent: mailBody,
      })
    } else {
      const mailBody = `Hi ${name},

Thanks for reaching out on weezie.site! I have received your ${source === 'brief' ? `project brief${plan ? ` (${plan})` : ''}` : 'message'}${discountCode ? ` along with your discount code (${discountCode})` : ''}.

I review every inquiry personally and will reply within 24 hours from enang@weezie.site.

Best,
Enang Weezie
https://weezie.site`

      await sendBrevoEmail(env, {
        fromEmail: 'hello@weezie.site',
        fromName: 'Enang Weezie Studio',
        toEmail: email,
        toName: name,
        subject: 'Got your inquiry — Enang Weezie (weezie.site)',
        textContent: mailBody,
      })

      // Send READ-ONLY notification alert to Enang's main Gmail so he can log into weezie.site/admin and reply as enang@weezie.site
      const notifyTarget = env?.MAIN_ALERT_EMAIL || 'Wisdomemmanuelenang@gmail.com'
      await sendBrevoEmail(env, {
        fromEmail: 'hello@weezie.site',
        fromName: 'Weezie CRM Alert (Read-Only)',
        toEmail: notifyTarget,
        toName: 'Enang Weezie',
        subject: `📬 [READ-ONLY ALERT] New ${source.toUpperCase()} Lead: ${name} (${plan || email})`,
        textContent: `⚠️ READ-ONLY NOTIFICATION — DO NOT REPLY FROM GMAIL.\nLog in to https://weezie.site/admin to reply from enang@weezie.site!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSource: ${source}\nPlan: ${plan || 'N/A'}\nEstimate: ${estimatedTotal || 'N/A'}\nDiscount Code: ${discountCode || 'None'}\n\nMessage:\n${message}\n\n👉 Log in & Reply from enang@weezie.site: https://weezie.site/admin`,
      })
    }

    return json({
      ok: true,
      leadId,
      downloadUrl: downloadUrl || null,
      productTitle: productTitle || null,
    })
  } catch (err) {
    return json({ ok: false, error: err.message || 'Server error saving lead' }, 500)
  }
}
