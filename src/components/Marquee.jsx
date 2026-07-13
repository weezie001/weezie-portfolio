import { skills } from '../data.js'

export default function Marquee() {
  const row = [...skills, ...skills]
  return (
    <section aria-label="Skills" className="overflow-hidden border-y border-line bg-paper py-6">
      <div className="animate-marquee flex w-max items-center gap-10">
        {row.map((s, idx) => (
          <span key={idx} className="flex items-center gap-10 whitespace-nowrap text-lg font-bold uppercase tracking-[0.05em] text-ink md:text-xl">
            {s}
            <span className="text-gradient text-xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  )
}
