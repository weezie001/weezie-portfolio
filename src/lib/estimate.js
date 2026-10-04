import { rateCard, gameConfig, briefFeatureGroups, briefPricing } from '../data.js'

// ---------------------------------------------------------------------------
// Prices the project brief from the plan the visitor chose:
//
//   the plan's rate-card price
// + the prices of extra features ticked beyond the plan
//   (and anything those extras need that the plan does not already include)
// + branding, if they have no brand kit
//
// A plan with no extras costs exactly its rate-card price. Individual feature
// prices are used here to move the total but are never shown to visitors.
// All figures live in data.js; this file holds rules only.
// ---------------------------------------------------------------------------

// What the visitor is building -> the plan it usually needs. Also the brief's
// dropdown options, in display order. Only used to suggest a plan when none
// has been chosen yet; it never overrides a plan the visitor picked.
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

// Delivery window by total size (USD), once a brief goes beyond a plain plan.
const TIMELINES = [
  [600, '1 week'],
  [1200, '2 to 3 weeks'],
  [2500, '3 to 4 weeks'],
  [5000, '5 to 8 weeks'],
  [Infinity, '8 to 12 weeks, delivered in phases'],
]

// Fine-grained so a discount never visibly under-delivers what it advertises.
const DISCOUNT_STEP = { NGN: 5000, USD: 5 }

export const EMPTY_FIELDS = { plan: '', type: '', brandKit: '', existing: '', maintenance: '', budget: '' }

const TYPE_PLAN = Object.fromEntries(WEBSITE_TYPES)
const BUDGET_CEILING = Object.fromEntries(BUDGETS)
const BY_LABEL = Object.fromEntries(briefFeatureGroups.flatMap((g) => g.items).map((f) => [f.label, f]))

// '₦500,000' -> 500000 | 'from $3,500' -> 3500
function toNumber(price) {
  return Number(String(price).replace(/[^0-9]/g, '')) || 0
}

function fmt(amount, currency) {
  return (currency === 'NGN' ? '₦' : '$') + Math.round(amount).toLocaleString('en-US')
}

function both(fn) {
  return Object.fromEntries(rateCard.currencies.map((c) => [c, fn(c)]))
}

function tierOf(plan) {
  return rateCard.tiers.find((t) => t.name === plan) || null
}

function brandingFor(brandKit) {
  if (/^no/i.test(brandKit)) return briefPricing.branding.full
  if (/^partial/i.test(brandKit)) return briefPricing.branding.partial
  return null
}

/** The plan a website type usually needs, for suggesting one. */
export function suggestedPlan(type) {
  return TYPE_PLAN[type] || ''
}

/** Brief features a plan already includes (shown ticked and locked). */
export function planFeatureSet(plan) {
  return new Set(briefPricing.planFeatures[plan] || [])
}

/**
 * Extras that get charged: what was ticked beyond the plan, plus whatever
 * those need that the plan does not already include, recursively.
 * Map of label -> null when ticked directly, or the label that needs it.
 */
export function resolveExtras(picked, plan) {
  const covered = planFeatureSet(plan)
  const out = new Map()
  const known = picked.filter((f) => BY_LABEL[f] && !covered.has(f))
  known.forEach((f) => out.set(f, null))
  const visit = (label, by) => {
    if (out.has(label) || covered.has(label)) return
    out.set(label, by)
    ;(BY_LABEL[label]?.requires || []).forEach((r) => visit(r, label))
  }
  known.forEach((f) => (BY_LABEL[f].requires || []).forEach((r) => visit(r, f)))
  return out
}

/** Reads the answers that live in the form. Plan and features are state. */
export function readFields(formData) {
  return {
    type: formData.get('website_type') || '',
    brandKit: formData.get('brand_kit') || '',
    existing: formData.get('existing_site') || '',
    maintenance: formData.get('maintenance') || '',
    budget: formData.get('budget') || '',
  }
}

/**
 * Prices a brief. Returns null until there is something to price.
 * @param {object}   fields  shape of EMPTY_FIELDS
 * @param {string[]} picked  features the visitor ticked themselves
 * @param {string}   code    a won game code, or '' for none
 */
export function quote(fields, picked, code = '') {
  const { plan, brandKit, existing, maintenance, budget } = { ...EMPTY_FIELDS, ...fields }
  const tier = tierOf(plan)
  const extras = resolveExtras(picked, tier ? plan : '')
  const brand = brandingFor(brandKit)
  if (!tier && !extras.size) return null

  const openEnded = Boolean(tier && /^from/i.test(String(tier.price.USD).trim()))
  const editsOnly = Boolean(tier) && /just edits/i.test(existing)
  const rate = editsOnly ? briefPricing.editsOnlyRate : 1

  const planAmount = both((c) => (tier ? toNumber(tier.price[c]) * rate : 0))
  const extrasAmount = both(
    (c) => [...extras.keys()].reduce((s, f) => s + BY_LABEL[f].price[c], 0) + (brand ? brand.price[c] : 0),
  )
  const sum = both((c) => planAmount[c] + extrasAmount[c])

  const discounted = Boolean(code)
  const total = both((c) =>
    discounted ? Math.round((sum[c] * (1 - gameConfig.discountPct / 100)) / DISCOUNT_STEP[c]) * DISCOUNT_STEP[c] : sum[c],
  )

  const extraCount = extras.size + (brand ? 1 : 0)
  const label = tier
    ? `${plan} plan` + (extraCount ? ` + ${extraCount} extra${extraCount > 1 ? 's' : ''}` : '')
    : 'Extras only'
  const timeline =
    tier && !extraCount && !editsOnly ? tier.timeline : TIMELINES.find(([max]) => sum.USD <= max)[1]

  const prefix = openEnded ? 'from ' : ''
  const shown = both((c) => prefix + fmt(total[c], c))
  const ceiling = BUDGET_CEILING[budget]
  const monthly = /^(yes|maybe)/i.test(maintenance) ? both((c) => fmt(briefPricing.maintenance.price[c], c)) : null
  const autoAdded = [...extras].filter(([, by]) => by).map(([l]) => l)

  return {
    plan: tier ? plan : '',
    label,
    timeline,
    extras, // Map label -> needed-by: which boxes show ticked beyond the plan
    autoAdded,
    editsOnly,
    total: shown,
    listed: both((c) => prefix + fmt(sum[c], c)),
    // Two subtotals, never per feature: the plan, and everything added to it.
    planPart: tier ? both((c) => prefix + fmt(planAmount[c], c)) : null,
    extrasPart: extraCount ? both((c) => fmt(extrasAmount[c], c)) : null,
    discounted,
    overBudget: typeof ceiling === 'number' && ceiling !== Infinity && total.USD > ceiling,
    monthly,
    // Attached to the submission, so the brief email carries what they saw.
    summary:
      `${label} · ${shown.USD} / ${shown.NGN}` +
      (tier && extraCount ? ` (plan ${prefix}${fmt(planAmount.USD, 'USD')} + extras ${fmt(extrasAmount.USD, 'USD')})` : '') +
      (editsOnly ? ' · edits only, half plan rate' : '') +
      (discounted ? ` · incl. ${gameConfig.discountPct}% code` : '') +
      (autoAdded.length ? ` · auto-added: ${autoAdded.join(', ')}` : '') +
      (brand ? ` · ${brand.label}` : '') +
      (monthly ? ` · plus ${monthly.USD}/month maintenance` : ''),
  }
}
