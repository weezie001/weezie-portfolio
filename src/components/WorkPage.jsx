import { useState } from 'react'
import { CASE_STUDIES } from '../data/caseStudiesData.js'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ProjectBrief from './ProjectBrief.jsx'

export default function WorkPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const CATEGORIES = ['All', 'Commerce', 'SaaS & AI', 'Enterprise', 'Construction', 'Web3']

  const filteredStudies = selectedCategory === 'All'
    ? CASE_STUDIES
    : CASE_STUDIES.filter((item) =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        item.features.some((f) => f.toLowerCase().includes(selectedCategory.toLowerCase()))
      )

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white">
      <Navbar onNavigate={onNavigate} currentPath="/work" />

      <main className="pt-24 pb-20 md:pt-32">
        {/* Header */}
        <section className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue">// selected work</span>
            <h1 className="display mt-3 text-4xl text-ink sm:text-6xl md:text-7xl leading-[1.05]">
              Real products. <br /><span className="text-gradient">Real business systems.</span>
            </h1>
            <p className="mt-6 text-lg font-medium leading-relaxed text-ink-soft">
              Detailed case studies across e-commerce, automated SaaS engines, multi-portal business operations,
              and custom web apps. Each build includes the design problem, full user flow, and architecture site map.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-10 flex flex-wrap gap-2 border-b border-line pb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue text-white shadow-md'
                    : 'bg-paper text-ink-soft hover:text-ink neu-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Case Studies Grid */}
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {filteredStudies.map((study) => (
              <article
                key={study.slug}
                className="group flex flex-col justify-between overflow-hidden rounded-[28px] bg-paper p-6 neu transition-all duration-300 hover:shadow-2xl md:p-8"
              >
                <div>
                  {/* Image Frame */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-900 neu-inset">
                    <img
                      src={study.image}
                      alt={study.client}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        {study.category}
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <h2 className="display text-2xl text-ink md:text-3xl">{study.client}</h2>
                      <span className="text-xs font-bold text-blue">Case Study →</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-ink">{study.tagline}</p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-ink-soft">{study.description}</p>
                  </div>

                  {/* Deliverable Tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {study.features.slice(0, 4).map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-line bg-paper-2 px-2.5 py-1 text-[10px] font-semibold text-ink-soft"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                  <a
                    href={`/work/${study.slug}`}
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault()
                        onNavigate(`/work/${study.slug}`)
                      }
                    }}
                    className="btn-gradient inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em]"
                  >
                    <span>Read Case Study &amp; Flow</span>
                    <span>→</span>
                  </a>

                  {study.liveUrl && (
                    <a
                      href={study.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-hover flex items-center gap-1.5 rounded-full bg-paper px-4 py-2.5 text-xs font-bold text-ink neu-sm"
                    >
                      <span>Live Site</span>
                      <span className="text-blue">↗</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Global CTA Section */}
        <section className="mx-auto mt-28 max-w-5xl px-6 md:px-10">
          <div className="rounded-[32px] bg-zinc-950 p-8 text-center text-white shadow-2xl md:p-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue">// ready to ship</span>
            <h2 className="display mt-3 text-3xl text-white md:text-5xl">Have a project you want built right?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
              Let's talk through your business requirements, scope the architecture, and build a high-performance system.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  if (onNavigate) onNavigate('/#contact')
                }}
                className="btn-gradient rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.12em]"
              >
                Start a Conversation
              </a>
              <a
                href="/store"
                onClick={(e) => {
                  e.preventDefault()
                  if (onNavigate) onNavigate('/store')
                }}
                className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-white/10"
              >
                Browse Digital Store
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
      <ProjectBrief />
    </div>
  )
}
