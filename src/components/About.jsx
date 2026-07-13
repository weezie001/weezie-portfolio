import { site, characters, aboutStats } from '../data.js'

export default function About() {
  return (
    <section id="about" className="dark-band relative overflow-hidden px-6 pt-20 pb-0 md:min-h-[660px] md:px-10 md:pt-24">
      {/* avatar — in flow on mobile, big & base-anchored on desktop */}
      <img
        src={characters.about}
        alt="Weezie, hand on heart"
        className="relative z-[5] mx-auto block h-72 w-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)] sm:h-80 md:pointer-events-none md:absolute md:bottom-0 md:left-1/2 md:mx-0 md:h-[620px] md:-translate-x-1/2"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 pb-20 md:min-h-[660px] md:grid-cols-2 md:pb-24">
        {/* LEFT */}
        <div className="reveal from-left order-2 text-center md:order-1 md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">// about me</p>
          <h2 className="display mt-4 text-4xl leading-tight text-white md:text-5xl">
            Hi, I&rsquo;m<br />Weezie.
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/75 md:mx-0">
            {site.aboutBlurb}
          </p>
          <a
            href="#contact"
            className="btn-gradient mt-7 inline-block rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Work With Me
          </a>
        </div>

        {/* RIGHT */}
        <div className="reveal from-right order-3 text-center md:text-right">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">// by the numbers</p>
          <dl className="mt-5 space-y-6">
            {aboutStats.map((s) => (
              <div key={s.label}>
                <dt className="display text-4xl text-white md:text-5xl">{s.value}</dt>
                <dd className="mt-1 text-sm font-medium uppercase tracking-[0.12em] text-white/60">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
