/**
 * BentoFeatures — Weezie UI
 * Asymmetric bento grid with a cursor-following spotlight + glowing border.
 *
 * Requirements: React 18+, Tailwind CSS 3.4+ (or v4). No other dependencies.
 * Usage:
 *   import BentoFeatures from '@/components/ui/BentoFeatures'
 *   <BentoFeatures />                       // demo content
 *   <BentoFeatures features={myFeatures} accent="16 185 129" />
 */

const DEFAULT_FEATURES = [
  {
    title: 'Real-time analytics',
    description: 'Watch every signup, upgrade and churn event land the second it happens. No refresh, no lag.',
    icon: 'chart',
    visual: 'bars',
    size: 'large',
  },
  {
    title: 'Team presence',
    description: 'See who is editing what, live.',
    icon: 'users',
    visual: 'avatars',
    size: 'small',
  },
  {
    title: 'Ship from the API',
    description: 'Typed SDKs for every endpoint.',
    icon: 'code',
    visual: 'code',
    size: 'small',
  },
  {
    title: '99.99% uptime',
    description: 'Multi-region by default, with automatic failover.',
    icon: 'shield',
    visual: 'ring',
    size: 'small',
  },
  {
    title: 'Workflows that run themselves',
    description: 'Trigger emails, webhooks and Slack alerts from any event, with zero glue code.',
    icon: 'bolt',
    visual: 'flow',
    size: 'medium',
  },
]

// Static class map so Tailwind can see every class at build time.
const SIZE_CLASSES = {
  large: 'md:col-span-4 md:row-span-2',
  medium: 'md:col-span-4',
  small: 'md:col-span-2',
}

const ICONS = {
  chart: <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />,
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
}

function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {ICONS[name] || ICONS.bolt}
    </svg>
  )
}

/* ---------- Mini visuals (pure CSS / SVG) ---------- */

function BarsVisual({ accent }) {
  const heights = [38, 52, 44, 66, 58, 74, 62, 84, 70, 92, 80, 100]
  return (
    <div className="flex h-40 items-end gap-2 sm:h-52" aria-hidden="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 origin-bottom scale-y-[0.35] rounded-t-md transition-transform duration-700 ease-out group-hover:scale-y-100"
          style={{
            height: `${h}%`,
            transitionDelay: `${i * 35}ms`,
            background: `linear-gradient(to top, rgb(${accent} / 0.15), rgb(${accent} / 0.85))`,
          }}
        />
      ))}
    </div>
  )
}

function AvatarsVisual({ accent }) {
  const people = ['AO', 'MK', 'TS', 'JD', '+8']
  return (
    <div className="flex items-center" aria-hidden="true">
      {people.map((p, i) => (
        <div
          key={p}
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-950 text-[11px] font-semibold text-white transition-transform duration-300 first:ml-0 group-hover:-translate-y-1"
          style={{
            transitionDelay: `${i * 50}ms`,
            background: i === people.length - 1 ? 'rgb(39 39 42)' : `rgb(${accent} / ${0.9 - i * 0.15})`,
          }}
        >
          {p}
        </div>
      ))}
      <span className="ml-3 flex items-center gap-1.5 text-xs text-zinc-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        12 online
      </span>
    </div>
  )
}

function CodeVisual({ accent }) {
  return (
    <pre
      className="overflow-hidden rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-zinc-400"
      aria-hidden="true"
    >
      <span style={{ color: `rgb(${accent})` }}>const</span> user = <span className="text-zinc-200">await</span> api
      {'\n'}  .users.<span className="text-emerald-300">create</span>({'{'}
      {'\n'}    email: <span className="text-amber-200">'ada@acme.co'</span>
      {'\n'}  {'}'})
    </pre>
  )
}

function RingVisual({ accent }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-4" aria-hidden="true">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={`rgb(${accent})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          className="transition-[stroke-dashoffset] duration-1000 ease-out [stroke-dashoffset:60] group-hover:[stroke-dashoffset:2]"
        />
      </svg>
      <div>
        <p className="text-2xl font-semibold tabular-nums text-white">99.99%</p>
        <p className="text-xs text-zinc-500">last 90 days</p>
      </div>
    </div>
  )
}

function FlowVisual({ accent }) {
  const steps = ['Event', 'Filter', 'Email', 'Slack']
  return (
    <div className="flex flex-wrap items-center gap-2" aria-hidden="true">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors duration-300"
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className="relative block h-px w-6 overflow-hidden bg-white/10">
              <span
                className="absolute inset-y-0 left-0 w-full -translate-x-full transition-transform duration-500 group-hover:translate-x-0"
                style={{ background: `rgb(${accent})`, transitionDelay: `${i * 150}ms` }}
              />
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

const VISUALS = {
  bars: BarsVisual,
  avatars: AvatarsVisual,
  code: CodeVisual,
  ring: RingVisual,
  flow: FlowVisual,
}

/* ---------- Tile ---------- */

function BentoTile({ feature, accent }) {
  const Visual = VISUALS[feature.visual]

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <article
      onMouseMove={handleMove}
      className={`group relative rounded-3xl bg-white/[0.06] p-px ${SIZE_CLASSES[feature.size] || SIZE_CLASSES.small}`}
      style={{ '--x': '50%', '--y': '50%' }}
    >
      {/* glowing border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--x) var(--y), rgb(${accent} / 0.7), transparent 60%)`,
        }}
      />
      <div className="relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[23px] bg-zinc-950 p-6 sm:p-7">
        {/* inner spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at var(--x) var(--y), rgb(${accent} / 0.12), transparent 45%)`,
          }}
        />
        <div className="relative">
          <div
            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
            style={{ color: `rgb(${accent})` }}
          >
            <Icon name={feature.icon} />
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-white">{feature.title}</h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-400">{feature.description}</p>
        </div>
        {Visual && (
          <div className="relative">
            <Visual accent={accent} />
          </div>
        )}
      </div>
    </article>
  )
}

/* ---------- Section ---------- */

export default function BentoFeatures({
  eyebrow = 'Features',
  title = 'Everything you need to grow, nothing you don’t',
  subtitle = 'One platform for analytics, collaboration and automation, built to stay out of your way.',
  features = DEFAULT_FEATURES,
  accent = '129 140 248', // space-separated RGB, e.g. "16 185 129"
  className = '',
}) {
  return (
    <section className={`bg-zinc-950 px-5 py-20 text-white sm:px-8 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: `rgb(${accent})` }}
          >
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">{subtitle}</p>
        </div>

        <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-6">
          {features.map((f) => (
            <BentoTile key={f.title} feature={f} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  )
}
