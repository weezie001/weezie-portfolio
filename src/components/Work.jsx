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

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {projects.map((p, i) => {
            const slug = SLUG_MAP[p.client]

            return (
              <article
                key={p.client}
                className="reveal neu-hover flex flex-col justify-between rounded-[28px] bg-paper p-4 neu-sm sm:p-6"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div>
                  {/* screenshot */}
                  <div className="overflow-hidden rounded-2xl bg-white neu-inset">
                    <img
                      src={p.image}
                      alt={`${p.client} — ${p.tag}`}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </div>

                  {/* meta */}
                  <div className="mt-5 flex items-start justify-between gap-4 px-1">
                    <div className="flex items-start gap-3">
                      <span className="display text-2xl text-ink/25">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="display text-xl text-ink">{p.client}</h3>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">{p.tag}</p>
                      </div>
                    </div>
                    {p.href && p.href !== '#' && (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => ev('work_live_click', { project: p.client })}
                        className="neu-hover shrink-0 rounded-full bg-paper px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                      >
                        Live ↗
                      </a>
                    )}
                  </div>
                  <p className="mt-3 px-1 text-sm font-medium leading-relaxed text-ink-soft">{p.desc}</p>
                </div>

                {slug && (
                  <div className="mt-5 border-t border-line pt-3 px-1 flex items-center justify-between">
                    <a
                      href={`/work/${slug}`}
                      onClick={(e) => {
                        if (onNavigate) {
                          e.preventDefault()
                          onNavigate(`/work/${slug}`)
                        }
                      }}
                      className="text-xs font-bold text-blue hover:underline underline-offset-4 flex items-center gap-1.5"
                    >
                      <span>Read Case Study, User Flow &amp; Site Map</span>
                      <span>→</span>
                    </a>
                  </div>
                )}
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
