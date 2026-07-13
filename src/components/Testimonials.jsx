import { testimonials } from '../data.js'
import { DoodleScatter } from './Doodles.jsx'

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-paper-2 px-6 py-24 md:px-10">
      <DoodleScatter variant="c" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <h2 className="reveal display mx-auto max-w-3xl text-center text-4xl text-ink md:text-6xl">
          What Clients <span className="text-gradient">Are Saying</span>
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </section>
  )
}
