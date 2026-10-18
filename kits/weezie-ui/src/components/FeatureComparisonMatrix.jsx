"use client";
import { useState, Fragment } from 'react'

/**
 * FeatureComparisonMatrix — Weezie UI
 * Feature matrix table with sticky header, highlight tier badge, and checkmarks.
 * Pure React + Tailwind CSS. Zero dependencies.
 */
const DEFAULT_PLANS = [
  { id: 'starter', name: 'Starter', price: '$29', period: '/mo', description: 'For solo founders & side-projects' },
  { id: 'pro', name: 'Pro', price: '$79', period: '/mo', description: 'For growing teams & modern startups', isPopular: true },
  { id: 'enterprise', name: 'Enterprise', price: '$249', period: '/mo', description: 'Custom scale, dedicated infra & SLA' },
]

const DEFAULT_CATEGORIES = [
  {
    category: 'Core Platform',
    features: [
      { name: 'Active monthly users', starter: '10,000', pro: '100,000', enterprise: 'Unlimited' },
      { name: 'Team member seats', starter: '3 seats', pro: '15 seats', enterprise: 'Unlimited' },
      { name: 'Data retention', starter: '30 days', pro: '1 year', enterprise: 'Unlimited history' },
      { name: 'Custom domains', starter: true, pro: true, enterprise: true },
      { name: 'SSL & Global CDN', starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Security & Compliance',
    features: [
      { name: 'Role-based permissions (RBAC)', starter: false, pro: true, enterprise: true },
      { name: 'SAML / SSO Authentication', starter: false, pro: false, enterprise: true },
      { name: 'Custom audit trail logs', starter: false, pro: '90 days', enterprise: 'Permanent' },
      { name: 'SOC2 Type II certified', starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Developer & Integrations',
    features: [
      { name: 'REST & GraphQL API access', starter: true, pro: true, enterprise: true },
      { name: 'Real-time webhook triggers', starter: '5 hooks', pro: '50 hooks', enterprise: 'Unlimited' },
      { name: 'Dedicated Slack support channel', starter: false, pro: false, enterprise: true },
      { name: 'Custom uptime SLA', starter: false, pro: '99.9%', enterprise: '99.99%' },
    ],
  },
]

export default function FeatureComparisonMatrix({
  title = "Compare plans side by side",
  subtitle = "Every tier includes our core features. Upgrade whenever your scale demands it.",
  plans = DEFAULT_PLANS,
  categories = DEFAULT_CATEGORIES,
  onSelectPlan = () => {},
  className = "",
}) {
  const [activePlan, setActivePlan] = useState('pro')

  function renderValue(val) {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center text-zinc-600">
          —
        </span>
      )
    }
    return <span className="font-mono text-xs font-semibold text-zinc-200">{val}</span>
  }

  return (
    <section className={`bg-zinc-950 px-5 py-20 text-white sm:px-8 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
            Transparency
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            {subtitle}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 overflow-x-auto rounded-3xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl sm:p-8">
          <table className="w-full min-w-[640px] border-collapse text-left">
            {/* Table Header: Plans */}
            <thead>
              <tr className="border-b border-white/10">
                <th className="w-2/5 pb-8 pr-4 align-bottom">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Features & Specs
                  </span>
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="w-1/5 px-4 pb-8 align-bottom text-center">
                    {plan.isPopular && (
                      <span className="mb-2 inline-block rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline justify-center">
                      <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-xs text-zinc-400">{plan.period}</span>
                    </div>
                    <p className="mt-2 text-[11px] leading-tight text-zinc-400">
                      {plan.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePlan(plan.id)
                        onSelectPlan(plan)
                      }}
                      className={`mt-4 w-full rounded-full py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        plan.isPopular || activePlan === plan.id
                          ? 'bg-white text-zinc-950 hover:bg-zinc-200'
                          : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      Choose {plan.name}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body: Categories and Features */}
            <tbody>
              {categories.map((cat, catIdx) => (
                <Fragment key={cat.category}>
                  <tr key={`cat-${catIdx}`} className="border-b border-white/10 bg-white/[0.02]">
                    <td
                      colSpan={plans.length + 1}
                      className="py-4 text-xs font-bold uppercase tracking-wider text-blue-400"
                    >
                      {cat.category}
                    </td>
                  </tr>
                  {cat.features.map((feat, featIdx) => (
                    <tr
                      key={`feat-${catIdx}-${featIdx}`}
                      className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="py-3.5 pr-4 text-xs font-medium text-zinc-300">
                        {feat.name}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {renderValue(feat.starter)}
                      </td>
                      <td className="bg-white/[0.02] px-4 py-3.5 text-center">
                        {renderValue(feat.pro)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {renderValue(feat.enterprise)}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
