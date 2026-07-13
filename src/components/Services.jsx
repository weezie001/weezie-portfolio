import { services } from '../data.js'
import { DoodleScatter } from './Doodles.jsx'

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-paper-2 px-6 py-24 md:px-10">
      <DoodleScatter variant="a" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-ink">// what I do</p>
        <h2 className="reveal display mt-4 max-w-3xl text-4xl text-ink md:text-6xl">
          Services built to make you stand out.
        </h2>

        <ul className="mt-16">
          {services.map((s, i) => (
            <li
              key={s.n}
              className="reveal group flex flex-col gap-2 border-t border-line py-8 md:flex-row md:items-center md:gap-10"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <span className="display w-24 shrink-0 text-5xl text-ink/25 transition-colors group-hover:text-ink md:text-6xl">
                {s.n}
              </span>
              <h3 className="display shrink-0 text-2xl text-ink md:w-64 md:text-3xl">{s.title}</h3>
              <p className="max-w-xl text-base font-medium leading-relaxed text-ink-soft">{s.desc}</p>
            </li>
          ))}
          <li className="border-t border-line" aria-hidden="true" />
        </ul>
      </div>
    </section>
  )
}
