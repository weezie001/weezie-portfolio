"use client";
import { useState, useId } from 'react'

/**
 * UsagePricingSlider — Weezie UI
 * Real-time usage-based seat & event estimator with annual discount toggle.
 * Pure React + Tailwind CSS. Zero dependencies.
 */
export default function UsagePricingSlider({
  title = "Scale as you grow",
  subtitle = "Simple, transparent pricing based on the seats and events your team needs.",
  basePrice = 29,
  pricePerSeat = 12,
  pricePerThousandEvents = 0.05,
  annualDiscount = 0.2, // 20% off
  currencySymbol = "$",
  ctaLabel = "Start 14-day free trial",
  onSelectPlan = () => {},
  className = "",
}) {
  const [seats, setSeats] = useState(5)
  const [events, setEvents] = useState(50000)
  const [isAnnual, setIsAnnual] = useState(true)
  const seatsInputId = useId()
  const eventsInputId = useId()

  // Calculate monthly equivalent
  const monthlyRaw = basePrice + (seats * pricePerSeat) + ((events / 1000) * pricePerThousandEvents)
  const monthlyDiscounted = isAnnual ? monthlyRaw * (1 - annualDiscount) : monthlyRaw
  const finalMonthly = Math.round(monthlyDiscounted)
  const annualTotal = Math.round(finalMonthly * 12)
  const annualSavings = Math.round((monthlyRaw * 12) - annualTotal)

  const formatEvents = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${Math.round(num / 1000)}k`
    return num
  }

  return (
    <section className={`bg-zinc-950 px-5 py-20 text-white sm:px-8 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
            Usage-Based Calculator
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
            {subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                !isAnnual ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                isAnnual ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Annual billing
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Pricing Card */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl sm:p-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* Sliders Column */}
            <div className="flex flex-col justify-between space-y-8 lg:col-span-7">
              {/* Seats Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor={seatsInputId} className="text-sm font-medium text-zinc-300">
                    Team seats
                  </label>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-sm font-semibold text-white">
                    {seats} {seats === 1 ? 'seat' : 'seats'}
                  </span>
                </div>
                <input
                  id={seatsInputId}
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-blue-500 transition-all hover:bg-zinc-700"
                />
                <div className="flex justify-between text-[11px] font-medium text-zinc-500">
                  <span>1 seat</span>
                  <span>25 seats</span>
                  <span>50+ seats</span>
                </div>
              </div>

              {/* Monthly Events Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor={eventsInputId} className="text-sm font-medium text-zinc-300">
                    Monthly tracked events
                  </label>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-sm font-semibold text-white">
                    {formatEvents(events)} events
                  </span>
                </div>
                <input
                  id={eventsInputId}
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={events}
                  onChange={(e) => setEvents(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-blue-500 transition-all hover:bg-zinc-700"
                />
                <div className="flex justify-between text-[11px] font-medium text-zinc-500">
                  <span>10k</span>
                  <span>500k</span>
                  <span>1M+</span>
                </div>
              </div>

              {/* What's included checklist */}
              <div className="border-t border-white/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Always included:
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-300 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited projects
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    99.99% uptime SLA
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full API access
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Community support
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary Column */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:p-8 lg:col-span-5">
              <div>
                <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                  Custom Estimate
                </span>
                <div className="mt-6 flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-zinc-400">{currencySymbol}</span>
                  <span className="font-mono text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                    {finalMonthly}
                  </span>
                  <span className="text-sm font-medium text-zinc-400">/mo</span>
                </div>
                
                {isAnnual && annualSavings > 0 ? (
                  <p className="mt-2 text-xs font-medium text-emerald-400">
                    Billed annually ({currencySymbol}{annualTotal}/yr) · Save {currencySymbol}{annualSavings}
                  </p>
                ) : (
                  <p className="mt-2 text-xs font-medium text-zinc-500">
                    Billed monthly · Cancel anytime
                  </p>
                )}
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => onSelectPlan({ seats, events, isAnnual, finalMonthly })}
                  className="w-full rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.99]"
                >
                  {ctaLabel}
                </button>
                <p className="text-[11px] text-zinc-500">
                  No credit card required. Instant activation.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
