import { CASE_STUDIES } from '../data/caseStudiesData.js'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ProjectBrief from './ProjectBrief.jsx'

export default function CaseStudyDetail({ slug, onNavigate }) {
  const currentIndex = CASE_STUDIES.findIndex((s) => s.slug === slug)
  const study = CASE_STUDIES[currentIndex] || CASE_STUDIES[0]

  const prevStudy = CASE_STUDIES[(currentIndex - 1 + CASE_STUDIES.length) % CASE_STUDIES.length]
  const nextStudy = CASE_STUDIES[(currentIndex + 1) % CASE_STUDIES.length]

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white">
      <Navbar onNavigate={onNavigate} currentPath="/work" />

      <main className="pt-24 pb-20 md:pt-32">
        {/* Back Link & Breadcrumb */}
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/work') : window.location.href = '/work'}
            className="neu-hover inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-ink neu-sm"
          >
            ← All Case Studies
          </button>
        </div>

        {/* Hero Banner */}
        <section className="mx-auto mt-6 max-w-5xl px-6 md:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              {study.category}
            </span>
            <span className="text-xs font-semibold text-ink-soft">· Case Study</span>
          </div>

          <h1 className="display mt-4 text-4xl text-ink sm:text-6xl md:text-7xl leading-[1.08]">
            {study.client}: <br />
            <span className="text-gradient">{study.tagline}</span>
          </h1>

          <p className="mt-6 text-lg font-medium leading-relaxed text-ink-soft">
            {study.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em]"
              >
                <span>Visit Live Project</span>
                <span>↗</span>
              </a>
            )}
            <a
              href="#user-flow"
              className="neu-hover inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-ink neu-sm"
            >
              View User Flow ↓
            </a>
          </div>

          {/* Hero Project Screenshot */}
          <div className="mt-12 overflow-hidden rounded-[32px] bg-zinc-900 p-2 shadow-2xl neu">
            <img
              src={study.image}
              alt={`${study.client} overview`}
              className="h-auto w-full rounded-[24px] object-cover object-top shadow-inner"
            />
          </div>
        </section>

        {/* Overview & Problem / Solution Grid */}
        <section className="mx-auto mt-20 max-w-5xl px-6 md:px-10">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="rounded-3xl bg-paper p-8 neu-sm">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// the challenge</span>
              <h2 className="display mt-2 text-2xl text-ink md:text-3xl">The Problem</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-ink-soft">{study.problem}</p>
            </div>

            <div className="rounded-3xl bg-paper p-8 neu-sm">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// the execution</span>
              <h2 className="display mt-2 text-2xl text-ink md:text-3xl">What I Built</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-ink-soft">{study.solution}</p>
            </div>
          </div>
        </section>

        {/* Interactive User Flow Diagram */}
        <section id="user-flow" className="mx-auto mt-24 max-w-5xl px-6 md:px-10">
          <div className="rounded-[36px] bg-zinc-950 p-8 text-white shadow-2xl md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue">
                  UX Architecture &amp; Logic
                </span>
                <h2 className="display mt-1 text-2xl text-white md:text-4xl">Interactive User Flow</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3.5 py-1 font-mono text-[11px] font-bold text-zinc-300">
                End-to-End Journey
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-zinc-400">
              The step-by-step user journey engineered to maximize conversion, reduce operational friction,
              and automate backend data flow.
            </p>

            {/* Stepper Flow Cards */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {study.userFlow.map((flow, idx) => (
                <div
                  key={flow.step}
                  className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-colors hover:border-blue/50"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue">{flow.step}</span>
                      {idx < study.userFlow.length - 1 && (
                        <span className="hidden font-mono text-xs text-zinc-600 lg:inline-block">→</span>
                      )}
                    </div>
                    <h3 className="mt-3 text-base font-bold text-white">{flow.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{flow.description}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-white/5 font-mono text-[10px] text-zinc-500">
                    Stage {idx + 1} of {study.userFlow.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Complete Site Map & Architecture */}
        <section className="mx-auto mt-24 max-w-5xl px-6 md:px-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// system hierarchy</span>
          <h2 className="display mt-2 text-3xl text-ink md:text-5xl">Site Map &amp; Architecture</h2>
          <p className="mt-3 text-base font-medium text-ink-soft">
            The full functional hierarchy across public-facing routes, authenticated portals, and backend endpoints.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {study.siteMap.map((node) => (
              <div key={node.section} className="rounded-3xl bg-paper p-6 neu-sm">
                <div className="flex items-center gap-2 border-b border-line pb-3">
                  <span className="h-2 w-2 rounded-full bg-blue" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink">{node.section}</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {node.routes.map((route) => (
                    <li key={route} className="flex items-start gap-2 text-xs font-mono text-ink-soft">
                      <span className="text-blue font-bold">↳</span>
                      <span>{route}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Deliverables & Business Impact */}
        <section className="mx-auto mt-24 max-w-5xl px-6 md:px-10">
          <div className="rounded-[32px] bg-paper p-8 neu md:p-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// deliverables &amp; results</span>
            <h2 className="display mt-2 text-2xl text-ink md:text-4xl">Measurable Business Impact</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ink-soft">{study.impact}</p>

            <div className="mt-8 border-t border-line pt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink">Delivered Capabilities</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {study.features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-xs font-bold text-ink neu-sm"
                  >
                    <span className="text-blue font-bold">✓</span>
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Next / Previous Project Navigation */}
        <section className="mx-auto mt-24 max-w-5xl px-6 md:px-10">
          <div className="flex flex-col items-center justify-between gap-6 border-t border-line pt-8 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate(`/work/${prevStudy.slug}`) : window.location.href = `/work/${prevStudy.slug}`}
              className="neu-hover flex items-center gap-3 rounded-2xl bg-paper p-4 text-left neu-sm"
            >
              <span className="text-base font-bold text-blue">←</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Previous Project</span>
                <p className="display text-base text-ink">{prevStudy.client}</p>
              </div>
            </button>

            <a
              href="/work"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/work')
                }
              }}
              className="text-xs font-bold uppercase tracking-wider text-blue hover:underline"
            >
              All Case Studies
            </a>

            <button
              type="button"
              onClick={() => onNavigate ? onNavigate(`/work/${nextStudy.slug}`) : window.location.href = `/work/${nextStudy.slug}`}
              className="neu-hover flex items-center gap-3 rounded-2xl bg-paper p-4 text-right neu-sm"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Next Project</span>
                <p className="display text-base text-ink">{nextStudy.client}</p>
              </div>
              <span className="text-base font-bold text-blue">→</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <ProjectBrief />
    </div>
  )
}
