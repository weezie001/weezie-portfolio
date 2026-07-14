import { characters } from '../data.js'

const openBrief = () => window.dispatchEvent(new CustomEvent('weezie:open-brief'))

export default function CollabCTA() {
  return (
    <section className="dark-band relative overflow-hidden px-6 pt-20 pb-0 md:min-h-[620px] md:px-10 md:pt-24">
      {/* avatar — in flow on mobile, big & base-anchored on desktop */}
      <img
        src={characters.showing}
        alt="Weezie presenting with open hands"
        className="relative z-[5] mx-auto block h-72 w-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)] sm:h-80 md:pointer-events-none md:absolute md:bottom-0 md:left-1/2 md:mx-0 md:h-[580px] md:-translate-x-1/2"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 pb-20 md:min-h-[620px] md:grid-cols-2 md:pb-24">
        {/* LEFT */}
        <div className="reveal from-left order-2 text-center md:order-1 md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">// got an idea?</p>
          <h2 className="display mt-4 text-4xl leading-tight text-white md:text-5xl">
            Show me<br />what you&rsquo;ve got.
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/75 md:mx-0">
            Bring the vision — I&rsquo;ll bring the design and the build. Let&rsquo;s turn it into something people remember.
          </p>
        </div>

        {/* RIGHT */}
        <div className="reveal from-right order-3 text-center md:text-right">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">// or beat me first</p>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Feeling lucky? Win our game and take 30% off your first project.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-end">
            <button
              type="button"
              onClick={openBrief}
              className="btn-gradient rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Start a Project
            </button>
            <a
              href="#play"
              className="rounded-full bg-white/95 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-ink transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Play the Game
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
