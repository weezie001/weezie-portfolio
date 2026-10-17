import { json, corsHeaders, ensureDb, isAuthorizedInbound, sendReadOnlyInboxNotification } from './_utils.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

// POST /api/inbound — Receives incoming emails for enang@weezie.site and hello@weezie.site
// Saves message to D1 inbox_messages, marks matching cold prospect as "Replied",
// and sends a READ-ONLY notification alert to the user's main email so they can log in and reply from weezie.site/admin.
export async function onRequestPost({ request, env }) {
  try {
    if (!isAuthorizedInbound(request, env)) {
      return json({ ok: false, error: 'Unauthorized inbound email webhook.' }, 401)
    }

    const body = await request.json()
    const mailbox = String(body.to || body.mailbox || 'enang@weezie.site').trim().toLowerCase()
    const fromEmail = String(body.from_email || body.from || '').trim().toLowerCase()
    const fromName = String(body.from_name || '').trim()
    const subject = String(body.subject || '(No Subject)').trim()
    const bodyText = String(body.text || body.body_text || '').trim()

    if (!['enang@weezie.site', 'hello@weezie.site'].includes(mailbox)) {
      return json({ ok: false, error: 'Unsupported inbox address.' }, 400)
    }
    if (!fromEmail) {
      return json({ ok: false, error: 'Missing sender email' }, 400)
    }

    const db = await ensureDb(env)
    if (!db) return json({ ok: false, error: 'CRM database is unavailable.' }, 503)

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

    const notification = await sendReadOnlyInboxNotification(env, {
      title: `New email to ${mailbox}`,
      mailbox,
      fromName,
      fromEmail,
      subject,
      preview: bodyText,
    })
    if (!notification.ok) {
      console.error('Inbound email was saved, but the Gmail notification could not be sent:', notification.error || notification.reason)
    }

    return json({ ok: true, notificationSent: notification.ok })
  } catch (err) {
    console.error('Inbound email processing failed:', err)
    return json({ ok: false, error: err.message || 'Inbound webhook error' }, 500)
  }
}
