import { projects } from '../data.js'
import { DoodleScatter } from './Doodles.jsx'
import { ev } from '../lib/analytics.js'

const SLUG_MAP = {
  'PadUp Creations': 'padup-creations',
  'ASH.CO': 'ash-co',
  'Maxi Innovation': 'maxi-innovation',
  'HEIS KITS': 'heis-kits',
  'SpagKing': 'spag-king',
  'B&D Renovations': 'b-d-renovations',
  'ESPEFAWIS': 'espefawis',
  'CertVerify': 'certverify',
}

export default function Work({ onNavigate }) {
  return (
    <section id="work" className="relative overflow-hidden bg-paper px-6 py-24 md:px-10">
      <DoodleScatter variant="b" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-ink">// selected work</p>
            <h2 className="reveal display mt-4 max-w-3xl text-4xl text-ink md:text-6xl">
              Work I&rsquo;ve designed &amp; built.
            </h2>
          </div>
          <a
            href="/work"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault()
                onNavigate('/work')
              }
            }}
            className="neu-hover inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink neu-sm"
          >
            All Case Studies &amp; Flows →
          </a>
        </div>

        <div className="mt-14 flex flex-col gap-12">
          {projects.map((p, i) => {
            const slug = SLUG_MAP[p.client]

            return (
              <article
                key={p.client}
                className="reveal neu-hover flex flex-col gap-8 rounded-[32px] bg-paper p-6 neu-sm lg:flex-row lg:items-center lg:p-8"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {/* Large Screenshot (Left on Desktop) */}
                <div className="overflow-hidden rounded-2xl bg-white neu-inset lg:w-7/12">
                  <a
                    href={slug ? `/work/${slug}` : p.href}
                    onClick={(e) => {
                      if (slug && onNavigate) {
                        e.preventDefault()
                        onNavigate(`/work/${slug}`)
                      }
                    }}
                    className="group block overflow-hidden"
                  >
                    <img
                      src={p.image}
                      alt={`${p.client} — ${p.tag}`}
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </a>
                </div>

                {/* Content Details (Right on Desktop) */}
                <div className="flex flex-col justify-between gap-6 lg:w-5/12 lg:py-2">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="display text-2xl text-blue/70">{String(i + 1).padStart(2, '0')}</span>
                        <span className="rounded-full bg-blue/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue">
                          {p.tag}
                        </span>
                      </div>
                      {p.href && p.href !== '#' && (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => ev('work_live_click', { project: p.client })}
                          className="neu-hover shrink-0 rounded-full bg-paper px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink neu-sm hover:text-blue"
                        >
                          Live ↗
                        </a>
                      )}
                    </div>

                    <h3 className="display mt-4 text-3xl text-ink md:text-4xl">{p.client}</h3>
                    <p className="mt-3 text-base font-medium leading-relaxed text-ink-soft">{p.desc}</p>
                  </div>

                  {slug && (
                    <div className="border-t border-line pt-4">
                      <a
                        href={`/work/${slug}`}
                        onClick={(e) => {
                          if (onNavigate) {
                            e.preventDefault()
                            onNavigate(`/work/${slug}`)
                          }
                        }}
                        className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em]"
                      >
                        <span>Case Study &amp; Flow</span>
                        <span>→</span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* Persuasive Bottom Callout */}
        <div className="reveal mt-12 flex flex-col items-center gap-4 rounded-[28px] bg-paper p-8 text-center neu-sm sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="display text-2xl text-ink md:text-3xl">Want one like these?</p>
            <p className="mt-1.5 text-sm font-medium text-ink-soft">
              Tell me what you are building. I reply within 24 hours.
            </p>
          </div>
          <a
            href="#contact"
            onClick={() => ev('work_cta', { target: 'contact' })}
            className="btn-gradient shrink-0 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
          >
            Start a Project
          </a>
        </div>
      </div>
    </section>
  )
}
