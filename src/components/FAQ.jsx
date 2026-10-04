import { faqs } from '../data.js'
import { DoodleScatter } from './Doodles.jsx'

// The same answers are published as FAQ structured data and in /llms.txt
// (seo/ai-search.js), so what visitors read is what AI assistants quote.
export default function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden bg-paper-2 px-6 py-24 md:px-10">
      <DoodleScatter variant="a" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-ink">// questions</p>
        <h2 className="reveal display mt-4 text-4xl text-ink md:text-6xl">
          Questions, <span className="text-gradient">answered.</span>
        </h2>

        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="reveal group rounded-[20px] bg-paper p-5 neu-sm md:p-6"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-ink md:text-lg [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-lg leading-none neu-sm transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-ink-soft md:text-base">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
