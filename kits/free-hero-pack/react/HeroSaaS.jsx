export default function HeroSaaS() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 px-6 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <span className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
          ✦ Version 2.0 Live
        </span>
        <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight">
          Turn your web traffic into booked revenue.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
          High-performance website infrastructure with built-in instant quote calculators and automated client qualification.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="#brief" className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition">
            Start Your Build →
          </a>
          <a href="#work" className="rounded-full bg-zinc-900 border border-zinc-800 px-8 py-3.5 text-sm font-bold text-zinc-300 hover:text-white transition">
            Explore Work
          </a>
        </div>
      </div>
    </section>
  );
}