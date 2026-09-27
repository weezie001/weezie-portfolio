import { rateCard, gameConfig } from '../data.js'

// ---------------------------------------------------------------------------
// Turns project-brief answers into a ballpark range. This is an ESTIMATE, not
// a quote: it exists to set expectations and filter out mismatched budgets
// before a call, not to commit anyone to a number.
//
// Everything is derived from `rateCard` in data.js, so changing a price there
// changes the estimate too. Nothing is duplicated.
// ---------------------------------------------------------------------------

// Cheapest to most expensive. Must match the tier names in rateCard.
const TIER_ORDER = ['Landing Page', 'Business Website', 'Online Store', 'Web App / AI Build']

// Which tier a project STARTS from, based on what they say they need.
const TYPE_TIER = {
  Portfolio: 'Landing Page',
  'Business / Landing page': 'Business Website',
  'Blog / Content': 'Business Website',
  'E-commerce store': 'Online Store',
  'Booking platform': 'Web App / AI Build',
  'Web app / SaaS': 'Web App / AI Build',
  Other: 'Business Website',
}

// Features that raise the FLOOR, because they genuinely cannot be delivered
// inside a cheaper tier. Picking "Payment Processing" on a portfolio means
// you are building a store, whatever the dropdown said.
const FEATURE_FLOOR = {
  'Payment Processing': 'Online Store',
  'User Registration / Login': 'Online Store',
  'Admin Dashboard': 'Online Store',
  'Online Booking / Reservations': 'Web App / AI Build',
  'AI Chatbot': 'Web App / AI Build',
  'Mobile App (iOS/Android)': 'Web App / AI Build',
}

// Features already inside a tier's scope, so they cost nothing extra.
const INCLUDED = {
  'Landing Page': ['Gallery / Media'],
  'Business Website': ['Gallery / Media', 'Blog / News Section', 'Email Newsletter / Notifications'],
  'Online Store': [
    'Gallery / Media',
    'Blog / News Section',
    'Email Newsletter / Notifications',
    'Payment Processing',
    'Admin Dashboard',
    'User Registration / Login',
  ],
  // Everything is scoped by hand at this level, so nothing is billed as an extra.
  'Web App / AI Build': Object.keys(FEATURE_FLOOR).concat([
    'Gallery / Media',
    'Blog / News Section',
    'Email Newsletter / Notifications',
    'Live Chat / Support',
  ]),
}

// Rough ceiling of each stated budget band, in USD, for the mismatch warning.
const BUDGET_CEILING = {
  'Under $500': 500,
  '$500 – $1,000': 1000,
  '$1,000 – $3,000': 3000,
  '$3,000+': Infinity,
}

const EXTRA_FEATURE_RATE = 0.1 // each out-of-scope feature adds 10% of base
const BRANDING_RATE = 0.15 // building a brand from nothing
const EDITS_ONLY_RATE = 0.5 // edits to an existing site, not a rebuild
const SPREAD = 1.35 // top of the range vs the bottom

// '₦500,000' -> 500000 | 'from $3,500' -> 3500 | 'Let’s talk' -> 0
function toNumber(price) {
  return Number(String(price).replace(/[^0-9]/g, '')) || 0
}

function roundTo(n, step) {
  return Math.round(n / step) * step
}

function format(amount, currency) {
  const symbol = currency === 'NGN' ? '₦' : '$'
  const step = currency === 'NGN' ? 50000 : 50
  return symbol + roundTo(amount, step).toLocaleString('en-US')
}

/**
 * @param {FormData} data  the project-brief form
 * @param {string}   code  a won discount code, or '' for none
 * @returns {object|null}  null until they have picked a website type
 */
export function estimateFrom(data, code = '') {
  const type = data.get('website_type')
  if (!type) return null

  const features = data.getAll('features')
  const existing = data.get('existing_site')
  const brandKit = data.get('brand_kit')
  const budget = data.get('budget')

  // Start from the type, then let features raise the floor.
  let tierName = TYPE_TIER[type] || 'Business Website'
  for (const f of features) {
    const floor = FEATURE_FLOOR[f]
    if (floor && TIER_ORDER.indexOf(floor) > TIER_ORDER.indexOf(tierName)) tierName = floor
  }

  const tier = rateCard.tiers.find((t) => t.name === tierName)
  if (!tier) return null

  const included = INCLUDED[tierName] || []
  const extras = features.filter((f) => !included.includes(f) && f !== 'Other (describe below)')

  let multiplier = 1 + extras.length * EXTRA_FEATURE_RATE
  if (brandKit === 'No — I need branding help too') multiplier += BRANDING_RATE
  if (existing === 'Yes — just edits / additions') multiplier *= EDITS_ONLY_RATE

  const discount = code ? 1 - gameConfig.discountPct / 100 : 1
  const openEnded = tierName === 'Web App / AI Build'

  const range = {}
  for (const currency of rateCard.currencies) {
    const base = toNumber(tier.price[currency]) * multiplier * discount
    range[currency] = {
      low: format(base, currency),
      high: format(base * SPREAD, currency),
    }
  }

  // Compare against what they said they could spend (budget bands are USD).
  const ceiling = BUDGET_CEILING[budget]
  const lowUsd = toNumber(tier.price.USD) * multiplier * discount
  const overBudget = Boolean(ceiling) && ceiling !== Infinity && lowUsd > ceiling

  return {
    tier: tierName,
    timeline: tier.timeline,
    range,
    extras,
    openEnded,
    discounted: Boolean(code),
    overBudget,
    // Plain-text line attached to the submission, so the brief email carries
    // the same number the visitor was shown.
    summary: `${tierName} · ${range.USD.low} to ${range.USD.high} (${range.NGN.low} to ${range.NGN.high})${
      code ? ` · incl. ${gameConfig.discountPct}% code` : ''
    }`,
  }
}
