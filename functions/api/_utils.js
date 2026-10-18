import { renderBrandedEmail } from '../../src/lib/brandedEmail.js'
// Shared helpers for Cloudflare Pages Functions (/functions/api/*)
import { storeProducts } from '../../src/data.js'
import { analyzeSpamRisk, appendAntiSpamFooter } from '../../src/lib/spamGuard.js'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Key',
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders,
    },
  })
}

export function isAuthorizedAdmin(request, env) {
  const headerKey = (
    request.headers.get('X-Admin-Key') ||
    (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
  ).trim()
  if (!headerKey) return false

  const configured = (env?.ADMIN_PASSWORD || '').trim()
  if (configured && headerKey === configured) return true

  return false
}

export function isAuthorizedInbound(request, env) {
  const provided = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
  const expected = env?.INBOUND_EMAIL_TOKEN
  if (!expected || !provided || expected.length !== provided.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i)
  return diff === 0
}

// Automatically ensures D1 tables exist and seeds initial store products on first run
export async function ensureDb(env) {
  const db = env?.DB
  if (!db) return null

  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      source TEXT NOT NULL DEFAULT 'contact',
      status TEXT NOT NULL DEFAULT 'New',
      plan TEXT DEFAULT '',
      budget TEXT DEFAULT '',
      currency TEXT DEFAULT 'USD',
      estimated_total TEXT DEFAULT '',
      discount_code TEXT DEFAULT '',
      message TEXT DEFAULT '',
      brief_json TEXT DEFAULT '{}',
      subscribed INTEGER NOT NULL DEFAULT 1,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      price_ngn INTEGER NOT NULL DEFAULT 0,
      price_usd INTEGER NOT NULL DEFAULT 0,
      is_freebie INTEGER NOT NULL DEFAULT 0,
      badge TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      preview_url TEXT DEFAULT '',
      file_url TEXT DEFAULT '',
      features_json TEXT DEFAULT '[]',
      active INTEGER NOT NULL DEFAULT 1,
      downloads_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT NOT NULL UNIQUE,
      buyer_name TEXT NOT NULL,
      buyer_email TEXT NOT NULL,
      item_type TEXT NOT NULL DEFAULT 'product',
      item_id TEXT NOT NULL,
      item_title TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'NGN',
      amount INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'paid',
      download_url TEXT DEFAULT '',
      ai_run_id INTEGER DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER DEFAULT NULL,
      from_email TEXT NOT NULL,
      to_email TEXT NOT NULL,
      recipient_name TEXT DEFAULT '',
      subject TEXT NOT NULL,
      body_text TEXT NOT NULL,
      email_type TEXT NOT NULL DEFAULT 'direct',
      attachment_name TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'sent',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS inbox_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mailbox TEXT NOT NULL DEFAULT 'enang@weezie.site',
      from_email TEXT NOT NULL,
      from_name TEXT DEFAULT '',
      subject TEXT NOT NULL,
      body_text TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS cold_prospects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      business TEXT DEFAULT '',
      website TEXT DEFAULT '',
      niche TEXT DEFAULT '',
      custom_opener TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pending',
      followup_count INTEGER NOT NULL DEFAULT 0,
      last_contacted_at TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS uploaded_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_key TEXT NOT NULL UNIQUE,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
      size_bytes INTEGER NOT NULL DEFAULT 0,
      base64_data TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS ai_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool TEXT NOT NULL,
      visitor_email TEXT DEFAULT '',
      input_text TEXT NOT NULL,
      preview_json TEXT NOT NULL,
      full_report_md TEXT NOT NULL,
      unlocked INTEGER NOT NULL DEFAULT 0,
      order_reference TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
  ])

  const prospectColumns = await db.prepare('PRAGMA table_info(cold_prospects)').all()
  const existingCols = new Set((prospectColumns.results || []).map((column) => column.name))
  if (!existingCols.has('custom_subject')) {
    await db.prepare("ALTER TABLE cold_prospects ADD COLUMN custom_subject TEXT NOT NULL DEFAULT ''").run()
  }
  if (!existingCols.has('opened_at')) {
    await db.prepare("ALTER TABLE cold_prospects ADD COLUMN opened_at TEXT DEFAULT ''").run()
  }
  if (!existingCols.has('last_opened_at')) {
    await db.prepare("ALTER TABLE cold_prospects ADD COLUMN last_opened_at TEXT DEFAULT ''").run()
  }
  if (!existingCols.has('open_count')) {
    await db.prepare("ALTER TABLE cold_prospects ADD COLUMN open_count INTEGER NOT NULL DEFAULT 0").run()
  }
  if (!existingCols.has('followup_opened_at')) {
    await db.prepare("ALTER TABLE cold_prospects ADD COLUMN followup_opened_at TEXT DEFAULT ''").run()
  }
  if (!existingCols.has('followup_open_count')) {
    await db.prepare("ALTER TABLE cold_prospects ADD COLUMN followup_open_count INTEGER NOT NULL DEFAULT 0").run()
  }
  if (!existingCols.has('followup_sent_at')) {
    await db.prepare("ALTER TABLE cold_prospects ADD COLUMN followup_sent_at TEXT DEFAULT ''").run()
  }

  const inserts = storeProducts.map((p) =>
    db
      .prepare(
        `INSERT OR IGNORE INTO products
        (slug, title, category, tagline, description, price_ngn, price_usd, is_freebie, badge, cover_image, preview_url, file_url, features_json, active, downloads_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      )
      .bind(
        p.slug,
        p.title,
        p.category,
        p.tagline,
        p.description,
        p.price_ngn,
        p.price_usd,
        p.is_freebie ? 1 : 0,
        p.badge || '',
        p.cover_image || '',
        p.preview_url || '',
        p.file_url || '',
        JSON.stringify(p.features || []),
        p.downloads_count || 0,
      ),
  )
  if (inserts.length > 0) await db.batch(inserts)

  return db
}

export async function getSetting(db, key, fallback = '') {
  if (!db) return fallback
  try {
    const row = await db.prepare("SELECT value FROM app_settings WHERE key = ?").bind(key).first()
    return row?.value || fallback
  } catch {
    return fallback
  }
}

// Sends an email via Brevo transactional REST API (300/day free tier)
// Supports file attachments (any file type via base64 content) + anti-spam guard
export async function sendBrevoEmail(
  env,
  {
    fromEmail = 'hello@weezie.site',
    fromName = 'Enang Weezie',
    toEmail,
    toName = '',
    subject,
    textContent,
    htmlContent,
    replyTo,
    isColdOrBroadcast = false,
    attachment = null, // { name: 'file.pdf', content: 'base64...' }
    trackingPixelUrl = null,
  },
) {
  // Run anti-spam check on outbound cold/broadcast emails
  if (isColdOrBroadcast) {
    const check = analyzeSpamRisk(subject, textContent)
    if (!check.safe) {
      return {
        ok: false,
        blockedBySpamGuard: true,
        error: `Anti-Spam Guard blocked send (Score ${check.score}/100): ${check.issues.join(' ')}`,
      }
    }
  }

  const finalText = appendAntiSpamFooter(textContent, isColdOrBroadcast)
  const apiKey = env?.BREVO_API_KEY
  if (!apiKey) {
    return { ok: false, simulated: true, reason: 'BREVO_API_KEY not configured yet' }
  }

  // One visual wrapper for all CRM, outreach, store and automated emails.
  // Custom HTML is an internal content fragment, never a separate email shell.
  const html = renderBrandedEmail({
    body: textContent,
    outreach: isColdOrBroadcast && finalText !== textContent,
    contentHtml: htmlContent || '',
    trackingPixelUrl: trackingPixelUrl || '',
  })

  const payload = {
    sender: { email: fromEmail, name: fromName },
    to: [{ email: toEmail, name: toName || toEmail }],
    replyTo: replyTo ? { email: replyTo } : { email: fromEmail, name: fromName },
    subject,
    textContent: finalText,
    htmlContent: html,
  }

  if (attachment && attachment.name && attachment.content) {
    const cleanBase64 = String(attachment.content).replace(/^data:[^;]+;base64,/, '')
    payload.attachment = [{ name: attachment.name, content: cleanBase64 }]
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errText = await res.text()
    return { ok: false, error: errText }
  }
  return { ok: true }
}

export async function sendReadOnlyInboxNotification(
  env,
  { title, mailbox, fromName, fromEmail, subject, preview, details = [] },
) {
  const notifyTarget = env?.MAIN_ALERT_EMAIL || 'Wisdomemmanuelenang@gmail.com'
  const crmUrl = 'https://weezie.site/admin/'
  const sender = fromName ? `${fromName} <${fromEmail}>` : fromEmail
  const snippet = String(preview || '').trim().slice(0, 600)
  const rows = [
    ['Mailbox', mailbox],
    ['From', sender],
    ['Subject', subject],
    ...details,
  ]
  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  const textContent = [
    'READ-ONLY CRM NOTIFICATION — please reply from your CRM, not Gmail.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value || '—'}`),
    '',
    'Message preview:',
    snippet || '(No message text)',
    '',
    `Open your CRM inbox: ${crmUrl}`,
  ].join('\n')
  const htmlContent = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0c0d10">
    <p style="margin:0 0 8px;color:#2f6bff;font-size:12px;font-weight:700;letter-spacing:1.5px">READ-ONLY CRM NOTIFICATION</p>
    <h1 style="margin:0 0 18px;font-size:24px;line-height:1.3">${escapeHtml(title)}</h1>
    <p style="margin:0 0 18px;color:#3f434e;line-height:1.5">This message is saved in your CRM. Reply from there rather than from Gmail.</p>
    <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows.map(([label, value]) => `<tr><td style="padding:8px 10px 8px 0;color:#3f434e;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:8px 0;font-weight:600;overflow-wrap:anywhere">${escapeHtml(value || '—')}</td></tr>`).join('')}
    </table>
    <div style="margin-top:14px;padding:16px;background:#fff;border:1px solid #d3d7e0;border-radius:10px">
      <p style="margin:0 0 8px;color:#3f434e;font-size:12px;font-weight:700;text-transform:uppercase">Message preview</p>
      <p style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55">${escapeHtml(snippet || '(No message text)')}</p>
    </div>
    <p style="margin:24px 0;text-align:center"><a href="${crmUrl}" style="display:inline-block;padding:13px 22px;color:#fff;background:#2f6bff;border-radius:999px;text-decoration:none;font-weight:700">Open CRM Inbox</a></p>
    <p style="margin:0;color:#3f434e;font-size:12px;text-align:center">This is a notification only. Replies should be sent from the CRM.</p>
  </div>`

  try {
    return await sendBrevoEmail(env, {
      fromEmail: 'hello@weezie.site',
      fromName: 'Weezie CRM Notifications',
      toEmail: notifyTarget,
      toName: 'Enang Weezie',
      subject: `CRM notification: ${title}`,
      textContent,
      htmlContent,
      replyTo: 'no-reply@weezie.site',
    })
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}
