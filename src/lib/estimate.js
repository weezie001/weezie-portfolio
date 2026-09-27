import { rateCard, gameConfig } from '../data.js'

// ---------------------------------------------------------------------------
// Matches project-brief answers to ONE plan from the rate card and shows that
// plan's price, unchanged. The number a visitor sees here is the same number
// on the pricing section, so the two can never disagree.
//
// All figures come from `rateCard` in data.js. Change a price there and this
// follows automatically.
// ---------------------------------------------------------------------------

// Cheapest to most expensive. Must match the tier names in rateCard.
const TIER_ORDER = ['Landing Page', 'Business Website', 'Online Store', 'Web App / AI Build']

// Which plan a project STARTS from, based on what they say they need.
const TYPE_TIER = {
  Portfolio: 'Landing Page',
  'Business / Landing page': 'Business Website',
  'Blog / Content': 'Business Website',
  'E-commerce store': 'Online Store',
  'Booking platform': 'Web App / AI Build',
  'Web app / SaaS': 'Web App / AI Build',
  Other: 'Business Website',
}

// Features that raise the floor, because they genuinely cannot be delivered
// inside a cheaper plan. Ticking "Payment Processing" on a portfolio means
// you are building a store, whatever the dropdown said.
const FEATURE_FLOOR = {
  'Payment Processing': 'Online Store',
  'User Registration / Login': 'Online Store',
  'Admin Dashboard': 'Online Store',
  'Online Booking / Reservations': 'Web App / AI Build',
  'AI Chatbot': 'Web App / AI Build',
  'Mobile App (iOS/Android)': 'Web App / AI Build',
}

// Rough ceiling of each stated budget band, in USD, for the mismatch note.
const BUDGET_CEILING = {
  'Under $500': 500,
  '$500 – $1,000': 1000,
  '$1,000 – $3,000': 3000,
  '$3,000+': Infinity,
}

// '₦500,000' -> 500000 | 'from $3,500' -> 3500 | 'Let’s talk' -> 0
function toNumber(price) {
  return Number(String(price).replace(/[^0-9]/g, '')) || 0
}

// Re-prints a listed price at a discount, keeping any 'from ' prefix.
function discountPrice(listed, currency) {
  const amount = toNumber(listed)
  if (!amount) return listed // 'Let’s talk' and friends stay as they are
  const symbol = currency === 'NGN' ? '₦' : '$'
  const step = currency === 'NGN' ? 50000 : 50
  const cut = amount * (1 - gameConfig.discountPct / 100)
  const rounded = Math.round(cut / step) * step
  const prefix = /^from/i.test(String(listed).trim()) ? 'from ' : ''
  return prefix + symbol + rounded.toLocaleString('en-US')
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
  const budget = data.get('budget')

  // Start from the type, then let features raise the floor.
  let tierName = TYPE_TIER[type] || 'Business Website'
  for (const f of features) {
    const floor = FEATURE_FLOOR[f]
    if (floor && TIER_ORDER.indexOf(floor) > TIER_ORDER.indexOf(tierName)) tierName = floor
  }

  const tier = rateCard.tiers.find((t) => t.name === tierName)
  if (!tier) return null

  const discounted = Boolean(code)
  const price = {}
  for (const currency of rateCard.currencies) {
    price[currency] = discounted ? discountPrice(tier.price[currency], currency) : tier.price[currency]
  }

  // Compare against what they said they could spend (budget bands are USD).
  const ceiling = BUDGET_CEILING[budget]
  const overBudget = Boolean(ceiling) && ceiling !== Infinity && toNumber(price.USD) > ceiling

  return {
    tier: tierName,
    timeline: tier.timeline,
    price, // what to show
    listed: tier.price, // the undiscounted plan price, for strike-through
    discounted,
    overBudget,
    // Plain-text line attached to the submission, so the brief email and the
    // screen carry the same figure.
    summary: `${tierName} · ${price.USD} / ${price.NGN}${discounted ? ` (incl. ${gameConfig.discountPct}% code)` : ''}`,
  }
}
