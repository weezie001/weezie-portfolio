import { json, corsHeaders, ensureDb } from './_utils.js'
import { storeProducts } from '../../src/data.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet({ env }) {
  try {
    const db = await ensureDb(env)
    if (!db) {
      return json({
        ok: true,
        products: storeProducts,
        paystackPublicKey: (env?.VITE_PAYSTACK_PUBLIC_KEY || '').trim(),
      })
    }

    const [productsRes, pubRow] = await Promise.all([
      db.prepare(
        "SELECT * FROM products WHERE active = 1 ORDER BY is_freebie ASC, (badge = 'Featured') DESC, (badge = 'Bestseller') DESC, id DESC",
      ).all(),
      db.prepare("SELECT value FROM app_settings WHERE key = 'paystack_public_key'").first().catch(() => null),
    ])

    const effectivePubKey = (env?.VITE_PAYSTACK_PUBLIC_KEY || pubRow?.value || '').trim()

    const products = (productsRes?.results || []).map((p) => ({
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

    return json({
      ok: true,
      products: products.length ? products : storeProducts,
      paystackPublicKey: effectivePubKey,
    })
  } catch {
    return json({
      ok: true,
      products: storeProducts,
      paystackPublicKey: (env?.VITE_PAYSTACK_PUBLIC_KEY || '').trim(),
    })
  }
}
