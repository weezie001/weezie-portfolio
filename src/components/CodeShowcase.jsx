import { githubRepos } from '../data.js'
import { DoodleScatter } from './Doodles.jsx'

/* --- small flat tech icons (hand-drawn, brand-accurate) --- */
const TECH = [
  {
    name: 'React',
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        <g fill="none" stroke="#61DAFB" strokeWidth="1.1">
          <ellipse cx="12" cy="12" rx="10" ry="4.3" />
          <ellipse cx="12" cy="12" rx="10" ry="4.3" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.3" transform="rotate(120 12 12)" />
        </g>
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <rect width="24" height="24" rx="3" fill="#3178C6" />
        <text x="12" y="17.5" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="10" fill="#fff">TS</text>
      </svg>
    ),
  },
  {
    name: 'JavaScript',
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <rect width="24" height="24" rx="3" fill="#F7DF1E" />
        <text x="12" y="17.5" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="10" fill="#111">JS</text>
      </svg>
    ),
  },
  {
    name: 'Tailwind',
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="#38BDF8">
        <path d="M12 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.56.89 2.29 1.62C13.67 10.62 15.03 12 18 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.56-.89-2.29-1.62C16.33 6.18 14.98 4.8 12 4.8ZM6 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.56.89 2.29 1.62C7.67 17.82 9.03 19.2 12 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.56-.89-2.29-1.62C10.33 13.38 8.98 12 6 12Z" />
      </svg>
    ),
  },
  {
    name: 'Vite',
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <path d="M13.2 2 4.5 12.6c-.3.4-.1 1 .4 1h4.4l-1.4 6.9c-.1.6.6 1 1 .5l8.7-10.6c.3-.4.1-1-.4-1h-4.4l1.4-6.9c.1-.6-.6-1-1-.5Z" fill="#FFD028" stroke="#BD34FE" strokeWidth="0.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Node.js',
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" fill="#539E43" />
        <text x="12" y="15.6" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="9" fill="#fff">N</text>
      </svg>
    ),
  },
  {
    name: 'HTML5',
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <path d="M4 2.5 5.5 20 12 21.8 18.5 20 20 2.5H4Z" fill="#E44D26" />
        <path d="M12 4v16.3l5.2-1.45L18.5 4H12Z" fill="#F16529" />
        <path d="M12 8.3H8.1l.13 1.6H12v1.6H7.9l.4 4.4 3.7 1.05v-1.68l-2.02-.55-.13-1.45H12V8.3Z" fill="#EBEBEB" />
        <path d="M12 8.3v1.6h3.9l-.15 1.6H12v1.6h3.6l-.34 3.05-3.26.94v1.67l3.72-1.03.86-9.43H12Z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'CSS3',
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <path d="M4 2.5 5.5 20 12 21.8 18.5 20 20 2.5H4Z" fill="#1572B6" />
        <path d="M12 4v16.3l5.2-1.45L18.5 4H12Z" fill="#33A9DC" />
        <path d="M12 8.3H8.1l.13 1.6H12v1.6H7.9l.4 4.4 3.7 1.05v-1.68l-2.02-.55-.13-1.45H12V8.3Z" fill="#EBEBEB" />
        <path d="M12 8.3v1.6h3.9l-.15 1.6H12v1.6h3.6l-.34 3.05-3.26.94v1.67l3.72-1.03.86-9.43H12Z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'Figma',
    icon: (
      <svg viewBox="0 0 54 80" className="h-full w-full">
        <path d="M13.3 80c7.4 0 13.4-6 13.4-13.3V53.3H13.3C6 53.3 0 59.3 0 66.7 0 74 6 80 13.3 80Z" fill="#0ACF83" />
        <path d="M0 40c0-7.4 6-13.3 13.3-13.3h13.4v26.6H13.3C6 53.3 0 47.4 0 40Z" fill="#A259FF" />
        <path d="M0 13.3C0 6 6 0 13.3 0h13.4v26.7H13.3C6 26.7 0 20.7 0 13.3Z" fill="#F24E1E" />
        <path d="M26.7 0H40c7.4 0 13.3 6 13.3 13.3 0 7.4-6 13.4-13.3 13.4H26.7V0Z" fill="#FF7262" />
        <path d="M53.3 40c0 7.4-6 13.3-13.3 13.3-7.4 0-13.3-6-13.3-13.3 0-7.4 6-13.3 13.3-13.3 7.4 0 13.3 6 13.3 13.3Z" fill="#1ABCFE" />
      </svg>
    ),
  },
  {
    name: 'Git',
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="#F05133" strokeWidth="1.8">
        <circle cx="6" cy="6" r="2.1" />
        <circle cx="6" cy="18" r="2.1" />
        <circle cx="18" cy="9" r="2.1" />
        <path d="M6 8.1v7.8M8 7.1 15.8 9.9M18 11.1c0 3.2-3.2 3.9-6 3.9-2.1 0-3.9.6-3.9 2.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Vercel',
    icon: (
      <svg viewBox="0 0 24 21" className="h-full w-full">
        <path d="M12 0 24 20.8H0z" fill="#0c0d10" />
      </svg>
    ),
  },
]

function CodeCard({ r, i }) {
  return (
    <article
      className="reveal neu-hover flex min-w-0 flex-col rounded-[24px] bg-paper p-3 neu-sm"
      style={{ transitionDelay: `${i * 60}ms` }}
    >
      {/* editor window */}
      <div className="min-w-0 overflow-hidden rounded-2xl bg-[#0d1117]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 truncate text-xs font-semibold text-white/60">{r.file}</span>
          <span className="ml-auto shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/70">
            {r.lang}
          </span>
        </div>
        <pre className="overflow-x-auto px-4 py-4 text-[11px] leading-relaxed text-[#c9d1d9] sm:text-xs">
          <code>{r.code}</code>
        </pre>
      </div>

      {/* meta */}
      <div className="flex items-center justify-between gap-3 px-2 pt-4">
        <h3 className="display text-lg text-ink">{r.title}</h3>
        <a
          href={r.repo}
          target="_blank"
          rel="noreferrer"
          className="neu-hover shrink-0 rounded-full bg-paper px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          View repo ↗
        </a>
      </div>
    </article>
  )
}

export default function CodeShowcase() {
  return (
    <section id="code" className="relative overflow-hidden bg-paper-2 px-6 py-24 md:px-10">
      <DoodleScatter variant="a" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-ink">// on github</p>
        <h2 className="reveal display mt-4 max-w-3xl text-4xl text-ink md:text-6xl">
          Straight from the codebase.
        </h2>
        <p className="reveal mt-5 max-w-xl text-lg font-medium leading-relaxed text-ink-soft">
          A peek at the real code behind the work — every project ships on GitHub.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {githubRepos.map((r, i) => (
            <CodeCard key={r.title} r={r} i={i} />
          ))}
        </div>

        {/* tech stack */}
        <div className="mt-20">
          <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-ink">// tech stack</p>
          <h3 className="reveal display mt-4 text-3xl text-ink md:text-4xl">Tools I build with.</h3>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            {TECH.map((t) => (
              <div key={t.name} className="neu-hover flex items-center gap-2.5 rounded-full bg-paper px-4 py-2.5 neu-sm">
                <span className="h-5 w-5 shrink-0">{t.icon}</span>
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-ink">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
