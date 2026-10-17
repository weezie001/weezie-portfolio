import { json, corsHeaders, ensureDb } from './_utils.js'
import { storeProducts } from '../../src/data.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet({ env }) {
  try {
    const db = await ensureDb(env)
    if (!db) {
      return json({ ok: true, products: storeProducts })
    }

    const { results } = await db
      .prepare('SELECT * FROM products WHERE active = 1 ORDER BY is_freebie ASC, id ASC')
      .all()

    const products = (results || []).map((p) => ({
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

    return json({ ok: true, products: products.length ? products : storeProducts })
  } catch {
    return json({ ok: true, products: storeProducts })
  }
}
