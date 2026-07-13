import { site, socials } from '../data.js'
import { Doodle } from './Doodles.jsx'

// Doodle marks from the Weezie brand art (replaces the old geometric shapes)
const FOOTER_DOODLES = [
  'crown', 'eye', 'star', 'x', 'ring', 'faceBlue',
  'arc', 'wave', 'ringRed', 'bee', 'faceGreen', 'dots',
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2 px-6 pt-20 pb-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* big name */}
        <p className="display text-[15vw] leading-[0.85] text-ink md:text-[10vw]">
          {site.wordmark.split(' ')[0]}<br />
          <span className="text-gradient">{site.wordmark.split(' ')[1]}</span>
        </p>

        {/* doodle-mark strip */}
        <div className="mt-10 flex flex-wrap items-center gap-5 md:gap-6">
          {FOOTER_DOODLES.map((name, i) => (
            <Doodle key={i} name={name} className="inline-block h-9 w-9 md:h-12 md:w-12" />
          ))}
        </div>

        {/* columns */}
        <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Social</p>
            <ul className="mt-4 space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="text-base font-bold text-ink transition-colors hover:text-blue"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Contact</p>
            <ul className="mt-4 space-y-2 text-base font-medium text-ink">
              <li><a href={`mailto:${site.email}`} className="hover:text-blue">{site.email}</a></li>
              <li>{site.location}</li>
            </ul>
          </div>
          <div className="md:col-span-2 md:text-right">
            <a
              href="#contact"
              className="btn-gradient inline-block rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.1em]"
            >
              Start a Project
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-xs font-semibold text-ink-soft">© 2026 {site.name} — Built with React</p>
          <a href="#home" className="text-xs font-bold uppercase tracking-[0.1em] text-ink-soft hover:text-ink">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
