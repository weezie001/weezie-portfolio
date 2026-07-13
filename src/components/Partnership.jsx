import { characters, partners } from '../data.js'

export default function Partnership() {
  return (
    <section id="partners" className="dark-band relative overflow-hidden px-6 pt-20 pb-0 md:min-h-[600px] md:px-10 md:pt-24">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-stretch">
        {/* LEFT — text + who I work with */}
        <div className="reveal from-left order-2 flex flex-col justify-center pb-16 text-center md:order-1 md:pb-24 md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">// partnerships</p>
          <h2 className="display mt-4 text-4xl leading-tight text-white md:text-5xl">
            Let&rsquo;s build,<br />together.
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/75 md:mx-0">
            I team up with agencies, startups and founders who care about doing it right — bringing design and code under one roof.
          </p>
          <a
            href="#contact"
            className="btn-gradient mt-7 self-center rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:self-start"
          >
            Partner Up
          </a>

          <div className="mt-9 grid gap-5 sm:grid-cols-3 md:gap-6">
            {partners.map((p, i) => (
              <div key={p.title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <h3 className="display text-lg text-white">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — handshake, base-anchored */}
        <div className="reveal from-right order-1 flex items-end justify-center md:order-2 md:justify-end">
          <img
            src={characters.partnership}
            alt="Weezie shaking hands with a client"
            className="relative z-[5] h-72 w-auto object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)] sm:h-80 md:h-[560px]"
          />
        </div>
      </div>
    </section>
  )
}
