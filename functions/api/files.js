import { json, corsHeaders, isAuthorizedAdmin, ensureDb } from './_utils.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

// GET /api/files?key=xxx — serves any uploaded file with its original filename and MIME type
export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url)
    const key = url.searchParams.get('key')
    if (!key) {
      return json({ ok: false, error: 'Missing file key' }, 400)
    }

    // 1. Check Cloudflare R2 bucket if bound
    if (env?.PRODUCT_FILES) {
      const obj = await env.PRODUCT_FILES.get(key)
      if (obj) {
        const headers = new Headers(corsHeaders)
        obj.writeHttpMetadata(headers)
        headers.set('etag', obj.httpEtag)
        return new Response(obj.body, { headers })
      }
    }

    // 2. Check Cloudflare D1 uploaded_files table
    const db = await ensureDb(env)
    if (db) {
      const row = await db.prepare('SELECT * FROM uploaded_files WHERE file_key = ?').bind(key).first()
      if (row && row.base64_data) {
        const binaryString = atob(row.base64_data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        return new Response(bytes.buffer, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': row.mime_type || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${row.filename}"`,
          },
        })
      }
    }

    return json({ ok: false, error: 'File not found' }, 404)
  } catch (err) {
    return json({ ok: false, error: err.message || 'Download error' }, 500)
  }
}

// POST /api/files — Admin uploads any file type (.zip, .pdf, .fig, .mp4, .png, .csv, etc.)
export async function onRequestPost({ request, env }) {
  if (!isAuthorizedAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized' }, 401)
  }

  try {
    const body = await request.json()
    const filename = String(body.filename || `file-${Date.now()}`).trim()
    const mimeType = String(body.mime_type || 'application/octet-stream').trim()
    const rawBase64 = String(body.base64 || '').replace(/^data:[^;]+;base64,/, '')
    const sizeBytes = Number(body.size_bytes || Math.round((rawBase64.length * 3) / 4))

    if (!rawBase64) {
      return json({ ok: false, error: 'No file data provided.' }, 400)
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-')
    const fileKey = `${Date.now()}-${safeName}`

    // Store in R2 if bound
    if (env?.PRODUCT_FILES) {
      const binaryString = atob(rawBase64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      await env.PRODUCT_FILES.put(fileKey, bytes.buffer, {
        httpMetadata: {
          contentType: mimeType,
          contentDisposition: `attachment; filename="${safeName}"`,
        },
      })
    }

    // Also store in D1 uploaded_files so it works immediately without R2 setup
    const db = await ensureDb(env)
    if (db) {
      await db
        .prepare(
          `INSERT INTO uploaded_files (file_key, filename, mime_type, size_bytes, base64_data)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(fileKey, safeName, mimeType, sizeBytes, rawBase64)
        .run()
    }

    const downloadUrl = `/api/files?key=${encodeURIComponent(fileKey)}`
    return json({
      ok: true,
      fileKey,
      filename: safeName,
      mimeType,
      sizeBytes,
      downloadUrl,
    })
  } catch (err) {
    return json({ ok: false, error: err.message || 'File upload failed' }, 500)
  }
}
