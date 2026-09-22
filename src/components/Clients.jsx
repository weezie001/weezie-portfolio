import { clients, testimonials } from '../data.js'
import { DoodleScatter } from './Doodles.jsx'

export default function Clients() {
  return (
    <section id="clients" className="relative overflow-hidden bg-paper-2 px-6 py-24 md:px-10">
      <DoodleScatter variant="c" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-ink">// trusted by</p>
        <h2 className="reveal display mt-4 max-w-3xl text-4xl text-ink md:text-6xl">
          Businesses I&rsquo;ve <span className="text-gradient">built for.</span>
        </h2>
        <p className="reveal mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink-soft">
          Real companies, real launches. Every name here is a project I designed, built and shipped.
        </p>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {clients.map((c, i) => (
            <li
              key={c.name}
              className="reveal neu-hover rounded-[24px] bg-paper p-6 neu-sm"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <h3 className="display text-xl leading-tight text-ink">{c.name}</h3>
              <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-blue">{c.sector}</p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink-soft">{c.delivered}</p>
            </li>
          ))}
        </ul>

        {/* Renders only once real quotes land in data.js — see the note there. */}
        {testimonials.length > 0 && (
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className="reveal flex flex-col rounded-[24px] bg-paper p-7 neu-sm"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <blockquote className="text-base font-medium leading-relaxed text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundImage: 'linear-gradient(135deg, var(--color-blue), var(--color-brown))' }}
                    aria-hidden="true"
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">{t.name}</span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
