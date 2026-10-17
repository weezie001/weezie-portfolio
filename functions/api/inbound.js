import { json, corsHeaders, ensureDb, sendBrevoEmail } from './_utils.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

// POST /api/inbound — Receives incoming emails for enang@weezie.site and hello@weezie.site
// Saves message to D1 inbox_messages, marks matching cold prospect as "Replied",
// and sends a READ-ONLY notification alert to the user's main email so they can log in and reply from weezie.site/admin.
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const mailbox = String(body.to || body.mailbox || 'enang@weezie.site').trim().toLowerCase()
    const fromEmail = String(body.from_email || body.from || '').trim().toLowerCase()
    const fromName = String(body.from_name || '').trim()
    const subject = String(body.subject || '(No Subject)').trim()
    const bodyText = String(body.text || body.body_text || '').trim()

    if (!fromEmail) {
      return json({ ok: false, error: 'Missing sender email' }, 400)
    }

    const db = await ensureDb(env)
    if (db) {
      await db
        .prepare(
          `INSERT INTO inbox_messages (mailbox, from_email, from_name, subject, body_text, is_read)
           VALUES (?, ?, ?, ?, ?, 0)`,
        )
        .bind(mailbox, fromEmail, fromName, subject, bodyText)
        .run()

      // If this person was on our Cold Outreach list, automatically mark them as 'Replied'
      // (or 'Unsubscribed' if they replied "stop" or "unsubscribe")
      const isOptOut = /\b(stop|unsubscribe|remove me)\b/i.test(bodyText)
      await db
        .prepare(`UPDATE cold_prospects SET status = ? WHERE LOWER(email) = ?`)
        .bind(isOptOut ? 'Unsubscribed' : 'Replied', fromEmail)
        .run()

      await db
        .prepare(`UPDATE leads SET status = 'Contacted' WHERE LOWER(email) = ? AND status = 'New'`)
        .bind(fromEmail)
        .run()
    }

    // Send READ-ONLY notification alert to main personal email
    const notifyTarget = env?.MAIN_ALERT_EMAIL || 'Wisdomemmanuelenang@gmail.com'
    await sendBrevoEmail(env, {
      fromEmail: 'hello@weezie.site',
      fromName: 'Weezie Inbox Alert (Read-Only)',
      toEmail: notifyTarget,
      toName: 'Enang Weezie',
      subject: `📬 [READ-ONLY ALERT] New mail in ${mailbox} from ${fromName || fromEmail}`,
      textContent: `⚠️ READ-ONLY NOTIFICATION — DO NOT REPLY FROM GMAIL.\nLog in to https://weezie.site/admin to reply from ${mailbox}!\n\n----------------------------------------\nTo Mailbox: ${mailbox}\nFrom: ${fromName ? `${fromName} <${fromEmail}>` : fromEmail}\nSubject: ${subject}\n----------------------------------------\n\n${bodyText}\n\n----------------------------------------\n👉 Open your Inbox & Reply as ${mailbox}: https://weezie.site/admin`,
    })

    return json({ ok: true })
  } catch (err) {
    return json({ ok: false, error: err.message || 'Inbound webhook error' }, 500)
  }
}
