import { site, aboutStats, skills, socials } from '../data.js'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ProjectBrief from './ProjectBrief.jsx'

export default function AboutPage({ onNavigate }) {
  const TECH_STACK = [
    {
      category: 'Design & Prototyping',
      items: ['Figma', 'Design Systems', 'Micro-interactions', 'UI / UX Architecture', 'Brand Identity', 'Wireframing'],
    },
    {
      category: 'Frontend Engineering',
      items: ['React 19', 'Tailwind CSS v4', 'Vite', 'Next.js', 'JavaScript / ESNext', 'Accessible Semantics', 'Responsive Grid & Flex'],
    },
    {
      category: 'Backend, Cloud & DB',
      items: ['Cloudflare Workers', 'Cloudflare D1 SQL', 'Edge Functions', 'REST APIs', 'Node.js', 'Paystack & Stripe Integration'],
    },
    {
      category: 'AI & Automation Systems',
      items: ['AI Agents Architecture', 'LLM Prompt Engineering', 'Cold Outreach Engines', 'Workflow Automation', 'Lead Qualification Bots'],
    },
  ]

  const TIMELINE = [
    {
      year: '2026',
      title: 'Full-Stack Product & AI Engineer',
      description: 'Building commercial web platforms, automated business systems, AI lead qualification agents, and digital products for founders globally.',
    },
    {
      year: '2024 — 2025',
      title: 'Senior Web Designer & Frontend Developer',
      description: 'Engineered high-converting e-commerce storefronts, business operations platforms with role-based portals (PadUp Creations), and custom software.',
    },
    {
      year: '2023',
      title: 'UI/UX Designer & Brand Builder',
      description: 'Crafted digital brands, interactive landing pages, design tokens, and client identities from scratch.',
    },
  ]

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white">
      <Navbar onNavigate={onNavigate} currentPath="/about" />

      <main className="pt-24 pb-20 md:pt-32">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue">// about enang weezie</span>
              <h1 className="display mt-3 text-4xl text-ink sm:text-6xl md:text-7xl leading-[1.05]">
                A designer who <span className="text-gradient">actually builds.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-ink-soft">
                I am a web designer and full-stack developer based in Abuja, Nigeria, working with startups, agencies,
                and ambitious businesses worldwide. I take ideas from a blank repository to live, revenue-generating software.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
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
                  href={site.cv}
                  download
                  className="neu-hover inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-ink neu-sm"
                >
                  Download Résumé (PDF) ↗
                </a>
              </div>
            </div>

            {/* Portrait & Brand Badge */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <div className="relative aspect-square w-72 overflow-hidden rounded-[32px] bg-paper p-3 shadow-2xl neu md:w-88">
                  <img
                    src="/favicon.png"
                    alt="Enang Weezie Portrait"
                    className="h-full w-full rounded-[24px] object-cover bg-zinc-900 shadow-inner"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-2xl bg-zinc-950 p-4 text-white shadow-2xl border border-white/10 max-w-[200px]">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-blue">Verified Identity</p>
                  <p className="mt-0.5 text-xs font-bold">Enang Wisdom (Weezie)</p>
                  <p className="text-[11px] text-zinc-400">Designer &amp; Full-Stack Dev</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="mt-20 border-y border-line bg-paper-2 py-12">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center sm:text-left">
              {aboutStats.map((s) => (
                <div key={s.label} className="border-l-0 sm:border-l-2 border-blue/30 sm:pl-6">
                  <span className="display text-5xl text-ink md:text-6xl">{s.value}</span>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-ink-soft">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Philosophy Section */}
        <section className="mx-auto mt-24 max-w-5xl px-6 md:px-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// the way i work</span>
          <h2 className="display mt-2 text-3xl text-ink md:text-5xl">Design and engineering belong together.</h2>
          <div className="mt-8 space-y-6 text-base font-medium leading-relaxed text-ink-soft">
            <p>
              Most projects suffer because design and development are treated as separate assembly lines. A designer creates
              static Figma mockups that look great on a screen but fall apart in production, or an engineer builds a fast app
              that feels clunky and unintuitive.
            </p>
            <p>
              By mastering both craft disciplines, I eliminate the handoff gap. Every component is designed with real CSS
              constraints, accessibility semantics, edge-case states, and responsive layout dynamics in mind from minute one.
            </p>
            <p>
              Whether it is a custom role-based platform for PadUp Creations, an AI lead generation system for Maxi Innovation,
              or a drop-style storefront for ASH.CO, the goal is always the same: software that looks memorable and drives
              measurable business results.
            </p>
          </div>
        </section>

        {/* Tech Stack Matrix */}
        <section className="mx-auto mt-24 max-w-7xl px-6 md:px-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// tools &amp; capabilities</span>
          <h2 className="display mt-2 text-3xl text-ink md:text-5xl">Technical Stack</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TECH_STACK.map((group) => (
              <div key={group.category} className="rounded-3xl bg-paper p-6 neu-sm">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink border-b border-line pb-3">
                  {group.category}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((tech) => (
                    <li key={tech} className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Career Timeline */}
        <section className="mx-auto mt-24 max-w-5xl px-6 md:px-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// timeline</span>
          <h2 className="display mt-2 text-3xl text-ink md:text-5xl">Experience &amp; Background</h2>
          <div className="mt-10 space-y-8 border-l-2 border-blue/30 pl-6 sm:pl-8">
            {TIMELINE.map((item) => (
              <div key={item.year} className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-3.5 w-3.5 rounded-full bg-blue ring-4 ring-paper" />
                <span className="font-mono text-xs font-bold text-blue uppercase tracking-wider">{item.year}</span>
                <h3 className="display mt-1 text-xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink-soft">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Find Me Elsewhere */}
        <section className="mx-auto mt-24 max-w-5xl px-6 md:px-10">
          <div className="rounded-3xl bg-paper p-8 neu md:p-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// connect</span>
            <h2 className="display mt-2 text-2xl text-ink md:text-4xl">Find me across the web</h2>
            <div className="mt-6 flex flex-wrap gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="neu-hover flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-xs font-bold text-ink neu-sm"
                >
                  <span>{s.label}</span>
                  <span className="text-blue">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
      <ProjectBrief />
    </div>
  )
}
