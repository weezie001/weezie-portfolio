// Cloudflare Pages Function: /api/track
// Handles invisible 1x1 email open tracking pixel + Brevo open webhooks
import { corsHeaders, ensureDb, json } from './_utils.js'

// 43-byte 1x1 transparent GIF
const TRANSPARENT_GIF_BASE64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const GIF_BYTES = Uint8Array.from(atob(TRANSPARENT_GIF_BASE64), (c) => c.charCodeAt(0))

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const prospectId = url.searchParams.get('p')
  const email = url.searchParams.get('e')

  if (prospectId || email) {
    try {
      const db = await ensureDb(env)
      if (db) {
        if (prospectId && !isNaN(Number(prospectId))) {
          await db.prepare(`
            UPDATE cold_prospects
            SET
              status = CASE WHEN status IN ('Pending', 'Sent', 'Follow-up 1', 'Follow-up 2') THEN 'Opened' ELSE status END,
              open_count = COALESCE(open_count, 0) + 1,
              opened_at = CASE WHEN opened_at IS NULL OR opened_at = '' THEN datetime('now') ELSE opened_at END,
              last_opened_at = datetime('now')
            WHERE id = ?
          `).bind(Number(prospectId)).run()
        } else if (email) {
          await db.prepare(`
            UPDATE cold_prospects
            SET
              status = CASE WHEN status IN ('Pending', 'Sent', 'Follow-up 1', 'Follow-up 2') THEN 'Opened' ELSE status END,
              open_count = COALESCE(open_count, 0) + 1,
              opened_at = CASE WHEN opened_at IS NULL OR opened_at = '' THEN datetime('now') ELSE opened_at END,
              last_opened_at = datetime('now')
            WHERE LOWER(email) = LOWER(?)
          `).bind(email.trim()).run()
        }
      }
    } catch (err) {
      console.error('Tracking pixel error:', err)
    }
  }

  return new Response(GIF_BYTES, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export async function onRequestPost({ request, env }) {
  // Brevo Webhook support for email tracking events
  try {
    const data = await request.json().catch(() => null)
    if (data?.event && data?.email) {
      const db = await ensureDb(env)
      const isReadEvent = ['opened', 'unique_opened', 'click', 'first_opening'].includes(String(data.event).toLowerCase())
      if (db && isReadEvent) {
        await db.prepare(`
          UPDATE cold_prospects
          SET
            status = CASE WHEN status IN ('Pending', 'Sent', 'Follow-up 1', 'Follow-up 2') THEN 'Opened' ELSE status END,
            open_count = COALESCE(open_count, 0) + 1,
            opened_at = CASE WHEN opened_at IS NULL OR opened_at = '' THEN datetime('now') ELSE opened_at END,
            last_opened_at = datetime('now')
          WHERE LOWER(email) = LOWER(?)
        `).bind(String(data.email).trim()).run()
      }
    }
  } catch (err) {
    console.error('Webhook tracking error:', err)
  }

  return json({ ok: true })
}
