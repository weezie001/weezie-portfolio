import { rateCard, gameConfig, briefFeatureGroups, briefPricing } from '../data.js'

// ---------------------------------------------------------------------------
// Prices the project brief as a straight sum of what is ticked:
//
//   base build for the website type
// + the price of every ticked feature
// + branding, if they have no brand kit
//
// Picking a website type ticks the features its plan comes with, and the base
// build is the plan's rate-card price minus those. So with the plan's features
// still ticked the total equals the rate card, and every tick or untick after
// that moves it by exactly the price shown beside the feature.
// All figures live in data.js; this file holds rules only.
// ---------------------------------------------------------------------------

// Website type -> the plan its base build comes from. Also the brief's dropdown
// options, in display order, so the list and the pricing cannot drift apart.
export const WEBSITE_TYPES = [
  ['Business / Landing page', 'Business Website'],
  ['Portfolio', 'Landing Page'],
  ['Blog / Content', 'Business Website'],
  ['E-commerce store', 'Online Store'],
  ['Marketplace (multi-vendor)', 'Online Store'],
  ['Booking platform', 'Business Website'],
  ['Fintech / Investment platform', 'Web App / AI Build'],
  ['CRM / Business tool', 'Web App / AI Build'],
  ['Web app / SaaS', 'Web App / AI Build'],
  ['Other', 'Business Website'],
]

// Budget bands (USD) and their ceilings, for the "above your budget" note.
export const BUDGETS = [
  ['Under $500', 500],
  ['$500 – $1,000', 1000],
  ['$1,000 – $3,000', 3000],
  ['$3,000 – $7,000', 7000],
  ['$7,000+', Infinity],
  ['Not sure yet', null],
]

// Delivery window by total size (USD), once a brief moves off a plain plan.
const TIMELINES = [
  [600, '1 week'],
  [1200, '2 to 3 weeks'],
  [2500, '3 to 4 weeks'],
  [5000, '5 to 8 weeks'],
  [Infinity, '8 to 12 weeks, delivered in phases'],
]

// Fine-grained so a discount never visibly under-delivers what it advertises.
const DISCOUNT_STEP = { NGN: 5000, USD: 5 }

export const EMPTY_FIELDS = { type: '', brandKit: '', existing: '', maintenance: '', budget: '' }

const TYPE_PLAN = Object.fromEntries(WEBSITE_TYPES)
const BUDGET_CEILING = Object.fromEntries(BUDGETS)
const BY_LABEL = Object.fromEntries(briefFeatureGroups.flatMap((g) => g.items).map((f) => [f.label, f]))

// '₦500,000' -> 500000 | 'from $3,500' -> 3500
function toNumber(price) {
  return Number(String(price).replace(/[^0-9]/g, '')) || 0
}

export function fmt(amount, currency) {
  return (currency === 'NGN' ? '₦' : '$') + Math.round(amount).toLocaleString('en-US')
}

function both(fn) {
  return Object.fromEntries(rateCard.currencies.map((c) => [c, fn(c)]))
}

function brandingFor(brandKit) {
  if (/^no/i.test(brandKit)) return briefPricing.branding.full
  if (/^partial/i.test(brandKit)) return briefPricing.branding.partial
  return null
}

/** The features a website type starts with: its plan's, then its own. */
export function defaultsFor(type) {
  const plan = TYPE_PLAN[type]
  return [...new Set([...(briefPricing.planFeatures[plan] || []), ...(briefPricing.typeFeatures[type] || [])])]
}

/**
 * When the website type changes, swap the old type's starting features for the
 * new type's, keeping everything else the visitor ticked themselves.
 */
export function swapDefaults(picked, fromType, toType) {
  const drop = new Set(defaultsFor(fromType))
  return [...new Set([...picked.filter((f) => !drop.has(f)), ...defaultsFor(toType)])]
}

/**
 * Everything that gets charged: what was ticked plus whatever that needs,
 * recursively. Map of label -> null when ticked directly, or the label of the
 * feature that needs it.
 */
export function resolveFeatures(picked) {
  const out = new Map()
  const known = picked.filter((f) => BY_LABEL[f])
  known.forEach((f) => out.set(f, null))
  const visit = (label, by) => {
    if (out.has(label)) return
    out.set(label, by)
    ;(BY_LABEL[label]?.requires || []).forEach((r) => visit(r, label))
  }
  known.forEach((f) => (BY_LABEL[f].requires || []).forEach((r) => visit(r, f)))
  return out
}

/** Reads the non-feature answers. Features are tracked as state, not read here. */
export function readFields(formData) {
  return {
    type: formData.get('website_type') || '',
    brandKit: formData.get('brand_kit') || '',
    existing: formData.get('existing_site') || '',
    maintenance: formData.get('maintenance') || '',
    budget: formData.get('budget') || '',
  }
}

/** A feature's own price, formatted. */
export function featurePrice(label, currency) {
  const f = BY_LABEL[label]
  return f ? fmt(f.price[currency], currency) : ''
}

/**
 * Prices a brief. Returns null until there is something to price.
 * @param {object}   fields  shape of EMPTY_FIELDS (see readFields)
 * @param {string[]} picked  features the visitor has ticked
 * @param {string}   code    a won game code, or '' for none
 */
export function quote(fields, picked, code = '') {
  const { type, brandKit, existing, maintenance, budget } = { ...EMPTY_FIELDS, ...fields }
  const plan = TYPE_PLAN[type] || null
  const tier = plan ? rateCard.tiers.find((t) => t.name === plan) : null
  const counted = resolveFeatures(picked)
  if (!tier && !counted.size) return null

  const openEnded = Boolean(tier && /^from/i.test(String(tier.price.USD).trim()))
  const editsOnly = /just edits/i.test(existing)
  const starting = new Set(defaultsFor(type))
  const planFeatures = briefPricing.planFeatures[plan] || []

  const lines = []
  const sum = both(() => 0)
  const add = (label, amount, note = '') => {
    lines.push({ label, note, amount })
    rateCard.currencies.forEach((c) => (sum[c] += amount[c]))
  }

  if (tier) {
    const rate = editsOnly ? briefPricing.editsOnlyRate : 1
    // Never negative, even if feature prices are edited above the plan price.
    const base = both((c) =>
      Math.max(0, toNumber(tier.price[c]) - planFeatures.reduce((s, f) => s + (BY_LABEL[f]?.price[c] || 0), 0)) * rate,
    )
    add(`${plan} base build`, base, editsOnly ? 'Edits to an existing site, half rate' : '')
  }

  for (const [label, by] of counted) {
    const note = by ? `Needed for ${by}` : starting.has(label) ? `Comes with ${plan}` : ''
    add(label, BY_LABEL[label].price, note)
  }

  const brand = brandingFor(brandKit)
  if (brand) add(brand.label, brand.price)

  const discounted = Boolean(code)
  const total = both((c) =>
    discounted ? Math.round((sum[c] * (1 - gameConfig.discountPct / 100)) / DISCOUNT_STEP[c]) * DISCOUNT_STEP[c] : sum[c],
  )

  // How far the brief has moved off the plain plan, for the label and timeline.
  const added = [...counted.keys()].filter((f) => !starting.has(f)).length + (brand ? 1 : 0)
  const removed = [...starting].filter((f) => !counted.has(f)).length
  const label = plan
    ? plan + (added ? ` + ${added} add-on${added > 1 ? 's' : ''}` : '') + (removed ? `, ${removed} removed` : '')
    : 'Features only'
  const timeline =
    tier && !added && !removed && !editsOnly ? tier.timeline : TIMELINES.find(([max]) => sum.USD <= max)[1]

  const prefix = openEnded ? 'from ' : ''
  const shown = both((c) => prefix + fmt(total[c], c))
  const ceiling = BUDGET_CEILING[budget]
  const monthly = /^(yes|maybe)/i.test(maintenance) ? both((c) => fmt(briefPricing.maintenance.price[c], c)) : null
  const autoAdded = [...counted].filter(([, by]) => by).map(([l]) => l)

  return {
    plan,
    label,
    timeline,
    counted, // Map label -> needed-by, drives which boxes show ticked
    autoAdded,
    total: shown,
    listed: both((c) => prefix + fmt(sum[c], c)),
    saving: both((c) => '−' + fmt(sum[c] - total[c], c)),
    lines: lines.map((l) => ({ ...l, amount: both((c) => fmt(l.amount[c], c)) })),
    discounted,
    overBudget: typeof ceiling === 'number' && ceiling !== Infinity && total.USD > ceiling,
    monthly,
    // Attached to the submission, so the brief email carries what they saw.
    summary:
      `${label} · ${shown.USD} / ${shown.NGN}` +
      (discounted ? ` (incl. ${gameConfig.discountPct}% code)` : '') +
      (autoAdded.length ? ` · auto-added: ${autoAdded.join(', ')}` : '') +
      (monthly ? ` · plus ${monthly.USD}/month maintenance` : ''),
  }
}

// Tags for the priced radio answers.
export function brandingTag(option, currency) {
  const b = brandingFor(option)
  return b ? '+' + fmt(b.price[currency], currency) : ''
}

export function existingTag(option) {
  return /just edits/i.test(option) ? 'Half the base build' : ''
}

export function maintenanceTag(option, currency) {
  return /^(yes|maybe)/i.test(option) ? `${fmt(briefPricing.maintenance.price[currency], currency)}/month` : ''
}
