// Cloudflare Pages Function: /api/cron
// Automated drip outreach endpoint.
// Pulls 1 pending prospect, generates personalized pitch, sends via Brevo, and logs result.
import { json, corsHeaders, ensureDb, sendBrevoEmail } from './_utils.js'
import { outreachDraft } from '../../src/lib/outreachCopy.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet(context) {
  return handleDrip(context)
}

export async function onRequestPost(context) {
  return handleDrip(context)
}

async function handleDrip({ request, env }) {
  // Authorization check: Bearer token, X-Admin-Key, or URL query param ?key=
  const url = new URL(request.url)
  const queryKey = url.searchParams.get('key') || url.searchParams.get('token')
  const headerKey = request.headers.get('X-Admin-Key') || (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
  const provided = queryKey || headerKey
  const expected = env?.CRON_SECRET || env?.ADMIN_PASSWORD

  if (!expected || !provided || (provided !== env?.CRON_SECRET && provided !== env?.ADMIN_PASSWORD)) {
    return json({ ok: false, error: 'Unauthorized cron request.' }, 401)
  }

  const db = await ensureDb(env)
  if (!db) {
    return json({ ok: false, error: 'Database unavailable.' }, 503)
  }

  // Count pending prospects
  const countRow = await db.prepare("SELECT COUNT(*) as count FROM cold_prospects WHERE status = 'Pending'").first()
  const pendingCount = Number(countRow?.count || 0)

  if (pendingCount === 0) {
    return json({
      ok: true,
      sent: false,
      message: 'No pending prospects. All caught up! Upload a new CSV anytime to resume.',
      pendingCount: 0,
    })
  }

  // Pick the oldest pending prospect
  const prospect = await db.prepare("SELECT * FROM cold_prospects WHERE status = 'Pending' ORDER BY id ASC LIMIT 1").first()
  if (!prospect) {
    return json({ ok: true, sent: false, pendingCount: 0 })
  }

  // Extract clean first name (e.g. "John (Owner/Contact)" -> "John")
  const rawName = String(prospect.name || 'there').trim()
  const cleanName = rawName.split(/[\s(,/]/)[0] || 'there'
  const business = String(prospect.business || '').trim() || 'your business'
  const website = String(prospect.website || '').trim()
  const niche = String(prospect.niche || '').trim()

  // Build subject and body: use custom draft if saved, or generate fresh copy
  let subject = prospect.custom_subject
  let body = prospect.custom_opener

  if (!subject || !body) {
    const draft = outreachDraft({
      name: cleanName,
      business,
      website,
      niche,
    })
    subject = draft.subject
    body = draft.body
  } else {
    subject = subject.replace(/\{\{\s*name\s*\}\}/gi, cleanName).replace(/\{\{\s*business\s*\}\}/gi, business)
    body = body.replace(/\{\{\s*name\s*\}\}/gi, cleanName).replace(/\{\{\s*business\s*\}\}/gi, business)
  }

  const fromEmail = 'enang@weezie.site'
  const fromName = 'Enang Weezie'

  // Send via Brevo with anti-spam check and branded template
  const sendRes = await sendBrevoEmail(env, {
    fromEmail,
    fromName,
    toEmail: prospect.email,
    toName: cleanName,
    subject,
    textContent: body,
    isColdOrBroadcast: true,
  })

  if (sendRes.blockedBySpamGuard) {
    // If blocked by spam guard, flag prospect so it doesn't loop forever
    await db.prepare("UPDATE cold_prospects SET status = 'BlockedBySpamGuard' WHERE id = ?").bind(prospect.id).run()
    return json({
      ok: false,
      blocked: true,
      error: sendRes.error,
      prospect: { id: prospect.id, email: prospect.email },
      remainingPending: pendingCount - 1,
    })
  }

  // Mark prospect as Contacted/Sent
  await db.prepare("UPDATE cold_prospects SET status = 'Sent', followup_count = 0, last_contacted_at = datetime('now') WHERE id = ?").bind(prospect.id).run()

  // Log to emails table
  await db.prepare(`
    INSERT INTO emails (from_email, to_email, recipient_name, subject, body_text, email_type, status)
    VALUES (?, ?, ?, ?, ?, 'cold', ?)
  `).bind(fromEmail, prospect.email, cleanName, subject, body, sendRes.ok ? 'sent' : 'simulated').run()

  return json({
    ok: true,
    sent: sendRes.ok,
    simulated: Boolean(sendRes.simulated),
    sentTo: {
      id: prospect.id,
      name: cleanName,
      email: prospect.email,
      business,
      subject,
    },
    remainingPending: pendingCount - 1,
    nextRunInfo: 'Next email will be sent on the next scheduled cron tick.',
  })
}
