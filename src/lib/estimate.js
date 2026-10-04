import { rateCard, gameConfig, briefFeatureGroups, briefPricing } from '../data.js'

// ---------------------------------------------------------------------------
// Prices the project brief live, as one number:
//
//   plan price for the website type  (straight from rateCard)
// + every add-on ticked              (briefFeatureGroups)
// + anything those add-ons depend on (their `requires`, counted automatically)
// + branding, if they have no brand kit
//
// Every priced option moves the total, and every option can be tagged with
// exactly what it adds, because the tags come from this same function.
// All figures live in data.js; this file holds rules only.
// ---------------------------------------------------------------------------

export const TIER_ORDER = ['Landing Page', 'Business Website', 'Online Store', 'Web App / AI Build']

// Website type -> the plan its base price comes from. Also the brief's dropdown
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

// Delivery window by total size (USD), once add-ons push past a plain plan.
const TIMELINES = [
  [600, '1 week'],
  [1200, '2 to 3 weeks'],
  [2500, '3 to 4 weeks'],
  [5000, '5 to 8 weeks'],
  [Infinity, '8 to 12 weeks, delivered in phases'],
]

// Fine-grained so a discount never visibly under-delivers what it advertises.
const DISCOUNT_STEP = { NGN: 5000, USD: 5 }

export const EMPTY_BRIEF = { type: '', features: [], brandKit: '', existing: '', maintenance: '', budget: '' }

const TYPE_PLAN = Object.fromEntries(WEBSITE_TYPES)
const BUDGET_CEILING = Object.fromEntries(BUDGETS)
const FEATURES = briefFeatureGroups.flatMap((g) => g.items)
const BY_LABEL = Object.fromEntries(FEATURES.map((f) => [f.label, f]))

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

function isIncluded(feature, plan) {
  if (!plan || !feature.includedFrom) return false
  return TIER_ORDER.indexOf(plan) >= TIER_ORDER.indexOf(feature.includedFrom)
}

// Picked features plus everything they depend on, recursively.
// Map of label -> null when picked directly, or the label that pulled it in.
function resolve(picked) {
  const out = new Map()
  picked.forEach((label) => out.set(label, null))
  const visit = (label, by) => {
    if (out.has(label)) return
    out.set(label, by)
    ;(BY_LABEL[label]?.requires || []).forEach((r) => visit(r, label))
  }
  picked.forEach((label) => (BY_LABEL[label]?.requires || []).forEach((r) => visit(r, label)))
  return out
}

function brandingFor(brandKit) {
  if (/^no/i.test(brandKit)) return briefPricing.branding.full
  if (/^partial/i.test(brandKit)) return briefPricing.branding.partial
  return null
}

/** Reads the brief form into a plain object the pricing functions accept. */
export function readBrief(formData) {
  return {
    type: formData.get('website_type') || '',
    features: formData.getAll('features'),
    brandKit: formData.get('brand_kit') || '',
    existing: formData.get('existing_site') || '',
    maintenance: formData.get('maintenance') || '',
    budget: formData.get('budget') || '',
  }
}

/**
 * Prices a brief.
 * @param {object} input  shape of EMPTY_BRIEF (see readBrief)
 * @param {string} code   a won game code, or '' for none
 */
export function quote(input, code = '') {
  const { type, features, brandKit, existing, maintenance, budget } = { ...EMPTY_BRIEF, ...input }
  const plan = TYPE_PLAN[type] || null
  const tier = plan ? rateCard.tiers.find((t) => t.name === plan) : null
  const openEnded = Boolean(tier && /^from/i.test(String(tier.price.USD).trim()))
  const editsOnly = /just edits/i.test(existing)

  const lines = []
  const sum = both(() => 0)
  const add = (label, amount, note = '') => {
    lines.push({ label, note, amount })
    rateCard.currencies.forEach((c) => (sum[c] += amount[c]))
  }

  if (tier) {
    const rate = editsOnly ? briefPricing.editsOnlyRate : 1
    add(`${plan} plan`, both((c) => toNumber(tier.price[c]) * rate), editsOnly ? 'Edits to an existing site, half rate' : '')
  }

  const addons = []
  const autoAdded = []
  for (const [label, by] of resolve(features.filter((f) => BY_LABEL[f]))) {
    const feature = BY_LABEL[label]
    if (isIncluded(feature, plan)) continue
    add(label, feature.price, by ? `Needed for ${by}` : '')
    addons.push(label)
    if (by) autoAdded.push(label)
  }

  const brand = brandingFor(brandKit)
  if (brand) add(brand.label, brand.price)

  const discounted = Boolean(code)
  const total = both((c) =>
    discounted ? Math.round((sum[c] * (1 - gameConfig.discountPct / 100)) / DISCOUNT_STEP[c]) * DISCOUNT_STEP[c] : sum[c],
  )

  const prefix = openEnded ? 'from ' : ''
  const extraCount = addons.length + (brand ? 1 : 0)
  const timeline =
    tier && !extraCount && !editsOnly ? tier.timeline : TIMELINES.find(([max]) => sum.USD <= max)[1]

  const ceiling = BUDGET_CEILING[budget]
  const monthly = /^(yes|maybe)/i.test(maintenance) ? both((c) => fmt(briefPricing.maintenance.price[c], c)) : null

  const shown = both((c) => prefix + fmt(total[c], c))
  const label = plan ? `${plan}${extraCount ? ` + ${extraCount} add-on${extraCount > 1 ? 's' : ''}` : ''}` : 'Add-ons'

  return {
    plan,
    label,
    timeline,
    total: shown,
    listed: both((c) => prefix + fmt(sum[c], c)),
    saving: both((c) => '−' + fmt(sum[c] - total[c], c)),
    raw: sum, // undiscounted numbers, used for per-option tags
    lines: lines.map((l) => ({ ...l, amount: both((c) => fmt(l.amount[c], c)) })),
    autoAdded,
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

/**
 * The price tag beside each feature, for THIS brief, in one currency:
 *   included  the plan already covers it, so it adds nothing
 *   add       ticked: what it costs. Unticked: what ticking it would add to the
 *             total, including anything it needs that is not counted yet
 *             (worked out by re-pricing, so it always matches the total)
 *   required  not ticked, but something ticked needs it, so it is already
 *             counted; its price shows in the breakdown
 * @returns {Record<string, {kind: 'add'|'included'|'required', text: string}>}
 */
export function featureTags(input, currency) {
  const base = { ...EMPTY_BRIEF, ...input }
  const plan = TYPE_PLAN[base.type] || null
  const picked = new Set(base.features)
  const resolved = resolve([...picked].filter((f) => BY_LABEL[f]))
  const now = quote(base).raw[currency]

  const tags = {}
  for (const feature of FEATURES) {
    const { label } = feature
    if (isIncluded(feature, plan)) {
      tags[label] = { kind: 'included', text: 'Included' }
    } else if (picked.has(label)) {
      tags[label] = { kind: 'add', text: '+' + fmt(feature.price[currency], currency) }
    } else if (resolved.has(label)) {
      tags[label] = { kind: 'required', text: 'Auto-added' }
    } else {
      const delta = quote({ ...base, features: [...base.features, label] }).raw[currency] - now
      tags[label] = { kind: 'add', text: '+' + fmt(delta, currency) }
    }
  }
  return tags
}

// Tags for the priced radio answers.
export function brandingTag(option, currency) {
  const b = brandingFor(option)
  return b ? '+' + fmt(b.price[currency], currency) : ''
}

export function existingTag(option) {
  return /just edits/i.test(option) ? 'Half the plan price' : ''
}

export function maintenanceTag(option, currency) {
  return /^(yes|maybe)/i.test(option) ? `${fmt(briefPricing.maintenance.price[currency], currency)}/month` : ''
}
