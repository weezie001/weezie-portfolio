import { useState } from 'react'
import { rateCard } from '../data.js'
import { DoodleScatter } from './Doodles.jsx'
import { ev } from '../lib/analytics.js'

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-blue"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export default function RateCard() {
  const [currency, setCurrency] = useState(rateCard.currencies[0])

  return (
    <section id="pricing" className="relative overflow-hidden bg-paper px-6 py-24 md:px-10">
      <DoodleScatter variant="a" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-ink">// what it costs</p>

        <div className="reveal mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="display max-w-2xl text-4xl leading-none text-ink md:text-6xl">
            Straight <span className="text-gradient">pricing.</span>
          </h2>

          {/* Local and international rates are set independently in data.js,
              so this switches the figure shown, it does not convert it. */}
          <div
            className="flex shrink-0 items-center gap-1 self-start rounded-full bg-paper p-1.5 neu-inset"
            role="group"
            aria-label="Choose currency"
          >
            {rateCard.currencies.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={currency === c}
                onClick={() => {
                  setCurrency(c)
                  ev('pricing_currency', { currency: c })
                }}
                className={
                  currency === c
                    ? 'rounded-full bg-paper px-5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink neu-sm'
                    : 'rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-ink'
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="reveal mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink-soft">
          {rateCard.note}
        </p>

        {/* Swipeable on phones and tablets, a four-up grid from lg. */}
        <div className="reveal mt-12">
          <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-5 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {rateCard.tiers.map((t) => (
              <article
                key={t.name}
                className={`relative flex w-[82%] shrink-0 snap-center flex-col rounded-[28px] bg-paper p-7 neu-sm sm:w-[48%] lg:w-auto ${
                  t.popular ? 'ring-2 ring-blue' : ''
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-7 rounded-full bg-blue px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    Most popular
                  </span>
                )}

                <h3 className="display text-xl leading-tight text-ink">{t.name}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink-soft">{t.blurb}</p>

                <p className="display mt-6 text-3xl leading-none text-ink">{t.price[currency]}</p>
                {t.from && (
                  <p className="mt-2 text-xs font-semibold text-ink-soft">{t.from[currency]}</p>
                )}
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
                  {t.timeline}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-ink/10 pt-6">
                  {t.includes.map((line) => (
                    <li key={line} className="flex gap-2.5 text-sm font-medium leading-snug text-ink-soft">
                      <Check />
                      {line}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  onClick={() => ev('pricing_cta', { tier: t.name, currency })}
                  className={`mt-7 rounded-full px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue ${
                    t.popular
                      ? 'btn-gradient'
                      : 'neu-hover bg-paper text-ink'
                  }`}
                >
                  Start this
                </a>
              </article>
            ))}
          </div>

          <p className="mt-1 text-center text-xs font-bold uppercase tracking-[0.12em] text-ink-soft lg:hidden">
            Swipe to compare →
          </p>

          {/* Speed is sold, not given away. */}
          {rateCard.rush && (
            <p className="mt-8 rounded-2xl bg-paper p-4 text-center text-sm font-semibold text-ink neu-inset">
              ⚡ {rateCard.rush}
            </p>
          )}
        </div>

        <p className="reveal mt-10 text-center text-sm font-medium text-ink-soft">
          Not sure which fits?{' '}
          <button
            type="button"
            onClick={() => {
              ev('brief_open', { from: 'pricing' })
              window.dispatchEvent(new CustomEvent('weezie:open-brief'))
            }}
            className="font-bold text-blue underline underline-offset-4 hover:text-ink"
          >
            Fill the 2-minute brief
          </button>{' '}
          and I will tell you exactly what your project needs.
        </p>
      </div>
    </section>
  )
}
