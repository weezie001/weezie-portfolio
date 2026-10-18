import { outreachDraft } from '../../src/lib/outreachCopy.js'
import { json, corsHeaders, isAuthorizedAdmin, ensureDb, sendBrevoEmail } from './_utils.js'
import { storeProducts } from '../../src/data.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet({ request, env }) {
  if (!isAuthorizedAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized. Invalid admin password.' }, 401)
  }

  try {
    const db = await ensureDb(env)
    if (!db) {
      return json({
        ok: true,
        d1Connected: false,
        leads: [],
        products: storeProducts,
        orders: [],
        emails: [],
        inbox: [],
        coldProspects: [],
        uploadedFiles: [],
      })
    }

    const [leadsRes, productsRes, ordersRes, emailsRes, inboxRes, coldRes, filesRes] = await Promise.all([
      db.prepare('SELECT * FROM leads ORDER BY id DESC LIMIT 250').all(),
      db.prepare('SELECT * FROM products ORDER BY id DESC').all(),
      db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 200').all(),
      db.prepare('SELECT * FROM emails ORDER BY id DESC LIMIT 150').all(),
      db.prepare('SELECT * FROM inbox_messages ORDER BY id DESC LIMIT 200').all(),
      db.prepare('SELECT * FROM cold_prospects ORDER BY id DESC LIMIT 300').all(),
      db.prepare('SELECT id, file_key, filename, mime_type, size_bytes, created_at FROM uploaded_files ORDER BY id DESC LIMIT 100').all(),
    ])

    const products = (productsRes.results || []).map((p) => ({
      ...p,
      is_freebie: Boolean(p.is_freebie),
      active: Boolean(p.active),
      features: (() => {
        try {
          return JSON.parse(p.features_json || '[]')
        } catch {
          return []
        }
      })(),
    }))

    const secretRow = db ? await db.prepare("SELECT value FROM app_settings WHERE key = 'paystack_secret_key'").first() : null
    const pubRow = db ? await db.prepare("SELECT value FROM app_settings WHERE key = 'paystack_public_key'").first() : null
    const effectiveSecretKey = (env?.PAYSTACK_SECRET_KEY || secretRow?.value || '').trim()
    const effectivePubKey = (env?.VITE_PAYSTACK_PUBLIC_KEY || pubRow?.value || '').trim()

    return json({
      ok: true,
      d1Connected: true,
      brevoConfigured: Boolean(env?.BREVO_API_KEY),
      paystackConfigured: Boolean(effectiveSecretKey),
      paystackPublicKey: effectivePubKey,
      paystackSecretKeySet: Boolean(effectiveSecretKey),
      paystackIsTest: effectivePubKey.startsWith('pk_test_') || effectiveSecretKey.startsWith('sk_test_'),
      leads: leadsRes.results || [],
      products,
      orders: ordersRes.results || [],
      emails: emailsRes.results || [],
      inbox: inboxRes.results || [],
      coldProspects: coldRes.results || [],
      uploadedFiles: (filesRes.results || []).map((f) => ({
        ...f,
        downloadUrl: `/api/files?key=${encodeURIComponent(f.file_key)}`,
      })),
    })
  } catch (err) {
    return json({ ok: false, error: err.message || 'Failed to load CRM data' }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  if (!isAuthorizedAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized. Invalid admin password.' }, 401)
  }

  try {
    const body = await request.json()
    const action = String(body.action || '').trim()
    const db = await ensureDb(env)

    // 1. Update Lead Status or Notes
    if (action === 'update_lead') {
      if (db && body.id) {
        await db
          .prepare('UPDATE leads SET status = ?, notes = ? WHERE id = ?')
          .bind(String(body.status || 'New'), String(body.notes || ''), Number(body.id))
          .run()
      }
      return json({ ok: true })
    }

    // 2. Delete Lead
    if (action === 'delete_lead') {
      if (db && body.id) {
        await db.prepare('DELETE FROM leads WHERE id = ?').bind(Number(body.id)).run()
      }
      return json({ ok: true })
    }

    // 3. Mark Inbox Message Read / Delete Inbox Message
    if (action === 'mark_inbox_read') {
      if (db && body.id) {
        await db.prepare('UPDATE inbox_messages SET is_read = 1 WHERE id = ?').bind(Number(body.id)).run()
      }
      return json({ ok: true })
    }

    if (action === 'delete_inbox') {
      if (db && body.id) {
        await db.prepare('DELETE FROM inbox_messages WHERE id = ?').bind(Number(body.id)).run()
      }
      return json({ ok: true })
    }

    // 4. Send 1-on-1 Direct Email to a Client (supports file attachment + anti-spam check)
    if (action === 'send_email') {
      const fromEmail = String(body.from_email || 'enang@weezie.site').trim()
      const fromName = fromEmail.startsWith('hello@') ? 'Enang Weezie Studio' : 'Enang Weezie'
      const toEmail = String(body.to_email || '').trim()
      const toName = String(body.to_name || '').trim()
      const subject = String(body.subject || '').trim()
      const textContent = String(body.body || '').trim()
      const leadId = body.lead_id ? Number(body.lead_id) : null
      const attachment = body.attachment || null // { name, content (base64) }

      if (!toEmail || !subject || !textContent) {
        return json({ ok: false, error: 'Recipient, subject, and message body are required.' }, 400)
      }

      const trackingPixelUrl = body.is_cold
        ? `https://weezie.site/api/track?e=${encodeURIComponent(toEmail)}`
        : null

      const sendResult = await sendBrevoEmail(env, {
        fromEmail,
        fromName,
        toEmail,
        toName,
        subject,
        textContent,
        isColdOrBroadcast: Boolean(body.is_cold),
        attachment,
        trackingPixelUrl,
      })

      if (sendResult.blockedBySpamGuard) {
        return json({ ok: false, error: sendResult.error }, 400)
      }

      if (db) {
        await db
          .prepare(
            `INSERT INTO emails (lead_id, from_email, to_email, recipient_name, subject, body_text, email_type, attachment_name, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            leadId,
            fromEmail,
            toEmail,
            toName,
            subject,
            textContent,
            body.is_cold ? 'cold' : 'direct',
            attachment?.name || '',
            sendResult.ok ? 'sent' : 'simulated',
          )
          .run()

        if (leadId) {
          await db
            .prepare("UPDATE leads SET status = CASE WHEN status = 'New' THEN 'Contacted' ELSE status END WHERE id = ?")
            .bind(leadId)
            .run()
        }
      }

      return json({
        ok: true,
        delivered: sendResult.ok,
        simulated: Boolean(sendResult.simulated),
        note: sendResult.reason || null,
      })
    }

    // 5. Send Bulk / Broadcast Email to Leads / Freebie Downloaders
    if (action === 'send_broadcast') {
      const fromEmail = String(body.from_email || 'enang@weezie.site').trim()
      const fromName = fromEmail.startsWith('hello@') ? 'Enang Weezie Studio' : 'Enang Weezie'
      const audienceFilter = String(body.audience || 'all').trim()
      const subject = String(body.subject || '').trim()
      const templateBody = String(body.body || '').trim()
      const attachment = body.attachment || null

      if (!subject || !templateBody) {
        return json({ ok: false, error: 'Broadcast subject and message body are required.' }, 400)
      }

      let recipients = []
      if (db) {
        const query =
          audienceFilter === 'all'
            ? 'SELECT DISTINCT email, name FROM leads WHERE subscribed = 1'
            : 'SELECT DISTINCT email, name FROM leads WHERE subscribed = 1 AND source = ?'
        const stmt = audienceFilter === 'all' ? db.prepare(query) : db.prepare(query).bind(audienceFilter)
        const { results } = await stmt.all()
        recipients = results || []
      }
      if (!db && Array.isArray(body.fallback_recipients)) {
        recipients = body.fallback_recipients
      }

      // Restrict delivery to the recipients shown in the review screen.
      if (Array.isArray(body.reviewed_recipients)) {
        const reviewed = body.reviewed_recipients
        recipients = recipients.filter((recipient) => reviewed.some((item) =>
          item.email === recipient.email && (item.name || '') === (recipient.name || ''),
        ))
      }

      let sentCount = 0
      for (const r of recipients) {
        const personalized = templateBody.replace(/\{\{\s*name\s*\}\}/gi, r.name || 'there')
        const res = await sendBrevoEmail(env, {
          fromEmail,
          fromName,
          toEmail: r.email,
          toName: r.name,
          subject,
          textContent: personalized,
          isColdOrBroadcast: true,
          attachment,
        })
        if (res.blockedBySpamGuard) {
          return json({ ok: false, error: res.error }, 400)
        }
        sentCount += 1
        if (db) {
          await db
            .prepare(
              `INSERT INTO emails (from_email, to_email, recipient_name, subject, body_text, email_type, attachment_name, status)
               VALUES (?, ?, ?, ?, ?, 'broadcast', ?, ?)`,
            )
            .bind(fromEmail, r.email, r.name || '', subject, personalized, attachment?.name || '', res.ok ? 'sent' : 'simulated')
            .run()
        }
      }

      return json({ ok: true, sentCount })
    }

    // 6. Generate AI Cold Email Opener & Pitch (100% Free via Cloudflare Workers AI)
    if (action === 'generate_cold_opener') {
      const name = String(body.name || 'Founder').trim()
      const business = String(body.business || 'your company').trim()
      const website = String(body.website || '').trim()
      const niche = String(body.niche || 'business').trim()

      const initialDraft = outreachDraft({ name, business })
      let subject = initialDraft.subject
      let pitch = initialDraft.body

      // Keep the approved copy exact; personalize names through outreachDraft.
      return json({ ok: true, subject, pitch })
    }

    // 7. Import Cold Prospects (CSV / Bulk list)
    if (action === 'import_cold_prospects') {
      const list = Array.isArray(body.prospects) ? body.prospects : []
      if (list.length > 500) return json({ ok: false, error: 'Import up to 500 prospects at a time.' }, 400)
      let importedCount = 0
      if (db && list.length > 0) {
        const stmts = list
          .filter((p) => p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(p.email)))
          .map((p) =>
            db
              .prepare(
                `INSERT OR IGNORE INTO cold_prospects (name, email, business, website, niche, custom_opener, custom_subject, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
              )
              .bind(
                String(p.name || 'Founder').trim(),
                String(p.email).trim().toLowerCase(),
                String(p.business || '').trim(),
                String(p.website || '').trim(),
                String(p.niche || '').trim(),
                String(p.custom_opener || '').trim(),
                String(p.custom_subject || '').trim(),
              ),
          )
        if (stmts.length > 0) {
          const results = await db.batch(stmts)
          importedCount = results.filter((result) => result?.meta?.changes > 0).length
        }
      }
      return json({ ok: true, importedCount })
    }

    if (action === 'generate_cold_drafts') {
      if (!db) return json({ ok: false, error: 'CRM database is unavailable.' }, 503)
      const prospects = Array.isArray(body.prospects) ? body.prospects.slice(0, 10) : []
      if (!prospects.length) return json({ ok: false, error: 'Select pending prospects to draft.' }, 400)

      const cleanProspects = prospects
        .filter((prospect) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(prospect.email || '')))
        .map((prospect) => ({
          name: String(prospect.name || 'Founder').trim().slice(0, 100),
          email: String(prospect.email).trim().toLowerCase(),
          business: String(prospect.business || 'your business').trim().slice(0, 120),
          website: String(prospect.website || '').trim().slice(0, 200),
          niche: String(prospect.niche || 'their industry').trim().slice(0, 120),
        }))
      if (!cleanProspects.length) return json({ ok: false, error: 'No valid prospects were selected.' }, 400)

      let drafts = cleanProspects.map((prospect) => ({
        email: prospect.email,
        ...outreachDraft(prospect),
      }))

      const usedAi = false

      const updates = drafts.map((draft) =>
        db.prepare(
          `UPDATE cold_prospects SET custom_subject = ?, custom_opener = ?
           WHERE LOWER(email) = ? AND status = 'Pending'`,
        ).bind(draft.subject, draft.body, draft.email),
      )
      const updateResults = await db.batch(updates)
      const draftedCount = updateResults.filter((result) => result?.meta?.changes > 0).length
      return json({
        ok: true,
        draftedCount,
        usedAi,
        drafts: drafts.map(({ email, subject, body }) => ({ email, subject, body })),
      })
    }

    // 8. Send Cold Email or Follow-Up to Prospect(s)
    if (action === 'send_cold_campaign') {
      const fromEmail = String(body.from_email || 'enang@weezie.site').trim()
      const fromName = 'Enang Weezie'
      const subjectTpl = String(body.subject || 'Quick idea for {{business}}').trim()
      const bodyTpl = String(body.body || '').trim()
      const isFollowup = Boolean(body.is_followup)
      const attachment = body.attachment || null
      const targets = Array.isArray(body.targets) ? body.targets : []
      if (targets.length > 50) {
        return json({ ok: false, error: 'Send no more than 50 prospects per batch.' }, 400)
      }

      let sentCount = 0
      for (const t of targets) {
        if (!t.email || t.status === 'Unsubscribed') continue
        const personalizedDraft = !isFollowup && t.custom_opener
        const subj = (personalizedDraft ? t.custom_subject || subjectTpl : subjectTpl)
          .replace(/\{\{\s*name\s*\}\}/gi, t.name || 'there')
          .replace(/\{\{\s*business\s*\}\}/gi, t.business || 'your website')
        const msg = (personalizedDraft || bodyTpl)
          .replace(/\{\{\s*name\s*\}\}/gi, t.name || 'there')
          .replace(/\{\{\s*business\s*\}\}/gi, t.business || 'your company')
          .replace(/\{\{\s*website\s*\}\}/gi, t.website || 'your site')
          .replace(/\{\{\s*niche\s*\}\}/gi, t.niche || 'your industry')

        const trackingPixelUrl = `https://weezie.site/api/track?p=${t.id || ''}&e=${encodeURIComponent(t.email)}&type=${isFollowup ? 'followup' : 'initial'}`

        const sendRes = await sendBrevoEmail(env, {
          fromEmail,
          fromName,
          toEmail: t.email,
          toName: t.name,
          subject: subj,
          textContent: msg,
          isColdOrBroadcast: true,
          attachment,
          trackingPixelUrl,
        })

        if (sendRes.blockedBySpamGuard) {
          return json({ ok: false, error: sendRes.error }, 400)
        }

        sentCount += 1
        const nextStatus = isFollowup ? 'Follow-up Sent' : 'Sent'
        if (db) {
          await db
            .prepare(
              `UPDATE cold_prospects
               SET status = ?,
                   followup_count = followup_count + ?,
                   followup_sent_at = CASE WHEN ? = 1 THEN datetime('now') ELSE followup_sent_at END,
                   last_contacted_at = datetime('now')
               WHERE LOWER(email) = ?`,
            )
            .bind(nextStatus, isFollowup ? 1 : 0, isFollowup ? 1 : 0, String(t.email).toLowerCase())
            .run()

          await db
            .prepare(
              `INSERT INTO emails (from_email, to_email, recipient_name, subject, body_text, email_type, attachment_name, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            )
            .bind(
              fromEmail,
              t.email,
              t.name || '',
              subj,
              msg,
              isFollowup ? 'followup' : 'cold',
              attachment?.name || '',
              sendRes.ok ? 'sent' : 'simulated',
            )
            .run()
        }
      }

      return json({ ok: true, sentCount })
    }

    // 9. Delete Cold Prospect
    if (action === 'delete_cold_prospect') {
      if (db && body.id) {
        await db.prepare('DELETE FROM cold_prospects WHERE id = ?').bind(Number(body.id)).run()
      }
      return json({ ok: true })
    }

    // 10. Save (Create or Update) Store Product
    if (action === 'save_product') {
      const p = body.product || {}
      const title = String(p.title || '').trim()
      const slug =
        String(p.slug || '')
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-') || `item-${Date.now()}`
      const category = String(p.category || 'Landing Pages').trim()
      const tagline = String(p.tagline || '').trim()
      const description = String(p.description || '').trim()
      const priceNgn = Number(p.price_ngn || 0)
      const priceUsd = Number(p.price_usd || 0)
      const isFreebie = Boolean(p.is_freebie) || (priceNgn === 0 && priceUsd === 0)
      const badge = String(p.badge || '').trim()
      const coverImage = String(p.cover_image || '/projects/maxi.jpg').trim()
      const previewUrl = String(p.preview_url || '').trim()
      const fileUrl = String(p.file_url || '').trim()
      const features = Array.isArray(p.features)
        ? p.features
        : String(p.features || '')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)

      if (!title) {
        return json({ ok: false, error: 'Product title is required.' }, 400)
      }

      if (db) {
        if (p.id) {
          await db
            .prepare(
              `UPDATE products
               SET slug = ?, title = ?, category = ?, tagline = ?, description = ?, price_ngn = ?, price_usd = ?,
                   is_freebie = ?, badge = ?, cover_image = ?, preview_url = ?, file_url = ?, features_json = ?, active = ?
               WHERE id = ?`,
            )
            .bind(
              slug,
              title,
              category,
              tagline,
              description,
              priceNgn,
              priceUsd,
              isFreebie ? 1 : 0,
              badge,
              coverImage,
              previewUrl,
              fileUrl,
              JSON.stringify(features),
              p.active === false ? 0 : 1,
              Number(p.id),
            )
            .run()
        } else {
          await db
            .prepare(
              `INSERT INTO products
               (slug, title, category, tagline, description, price_ngn, price_usd, is_freebie, badge, cover_image, preview_url, file_url, features_json, active)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            )
            .bind(
              slug,
              title,
              category,
              tagline,
              description,
              priceNgn,
              priceUsd,
              isFreebie ? 1 : 0,
              badge,
              coverImage,
              previewUrl,
              fileUrl,
              JSON.stringify(features),
            )
            .run()
        }
      }

      return json({ ok: true })
    }

    // 11. Delete Store Product
    if (action === 'delete_product') {
      if (db && body.id) {
        await db.prepare('DELETE FROM products WHERE id = ?').bind(Number(body.id)).run()
      }
      return json({ ok: true })
    }

    // 12. Save Paystack Gateway Keys (Test or Live)
    if (action === 'save_paystack_keys') {
      const pubKey = String(body.publicKey || body.public_key || '').trim()
      const secKey = String(body.secretKey || body.secret_key || '').trim()
      if (db) {
        if (pubKey) {
          await db.prepare("INSERT OR REPLACE INTO app_settings (key, value, updated_at) VALUES ('paystack_public_key', ?, datetime('now'))").bind(pubKey).run()
        }
        if (secKey) {
          await db.prepare("INSERT OR REPLACE INTO app_settings (key, value, updated_at) VALUES ('paystack_secret_key', ?, datetime('now'))").bind(secKey).run()
        }
      }
      return json({ ok: true, isTest: pubKey.startsWith('pk_test_') || secKey.startsWith('sk_test_') })
    }

    return json({ ok: false, error: `Unknown admin action: ${action}` }, 400)
  } catch (err) {
    return json({ ok: false, error: err.message || 'Admin API error' }, 500)
  }
}
