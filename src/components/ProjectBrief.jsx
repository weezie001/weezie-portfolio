import { useEffect, useMemo, useRef, useState } from 'react'
import { site, gameConfig, rateCard, briefFeatureGroups } from '../data.js'
import {
  quote,
  featureTags,
  readBrief,
  brandingTag,
  existingTag,
  maintenanceTag,
  WEBSITE_TYPES,
  BUDGETS,
  EMPTY_BRIEF,
} from '../lib/estimate.js'
import { ev } from '../lib/analytics.js'

const STYLES = ['Modern & minimal', 'Bold & colourful', 'Corporate / professional', 'Playful / fun', 'Luxury / elegant', 'Not sure — you decide']
const EXISTING = ['Yes — rebuild / redesign it', 'Yes — just edits / additions', 'No — starting from scratch']
const BRANDKIT = ["Yes — I'll provide it", 'Partial — I have a logo only', 'No — I need branding help too']
const MAINTENANCE = ['Yes — monthly retainer', "Maybe — let's discuss", 'No — one-time project only']
const OTHER_FEATURE = 'Other (describe below)'

function readWonCode() {
  try {
    const s = JSON.parse(localStorage.getItem('weezie_rps_v4') || '{}')
    return s.hasWon && s.code ? s.code : ''
  } catch { return '' }
}

const field = 'w-full rounded-xl bg-paper px-4 py-3 text-base font-medium text-ink placeholder-ink-soft/60 outline-none neu-inset focus:ring-2 focus:ring-blue/50'
const label = 'mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft'

// Colour of a price tag by what it means: costs money, already covered, or
// pulled in because something else they ticked needs it.
const TAG_TONE = {
  add: 'text-blue',
  included: 'text-ink-soft',
  required: 'text-ink-soft italic',
}

function Section({ title, children }) {
  return (
    <fieldset className="border-t border-line pt-6">
      <legend className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-blue">{title}</legend>
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  )
}

function Choice({ type, name, options, required, tag }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o, i) => {
        const t = tag?.(o)
        return (
          <label key={o} className="neu-sm flex cursor-pointer items-center gap-3 rounded-xl bg-paper px-4 py-2.5">
            <input type={type} name={name} value={o} required={required && type === 'radio' && i === 0} className="h-4 w-4 shrink-0 accent-[color:var(--color-blue)]" />
            <span className="flex-1 text-sm font-medium text-ink">{o}</span>
            {t && <span className="shrink-0 text-[11px] font-bold text-blue">{t}</span>}
          </label>
        )
      })}
    </div>
  )
}

// Every feature shows what it adds to THIS brief, so the total is never a mystery.
function FeaturePicker({ tags }) {
  return (
    <div className="flex flex-col gap-5">
      {briefFeatureGroups.map((g) => (
        <div key={g.group}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">{g.group}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {g.items.map((f) => {
              const t = tags[f.label]
              return (
                <label key={f.label} className="neu-sm flex cursor-pointer items-start gap-2.5 rounded-xl bg-paper px-3 py-2.5">
                  <input type="checkbox" name="features" value={f.label} className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-blue)]" />
                  <span className="flex-1 text-[13px] font-medium leading-snug text-ink">{f.label}</span>
                  {t && <span className={`shrink-0 text-[11px] font-bold ${TAG_TONE[t.kind]}`}>{t.text}</span>}
                </label>
              )
            })}
          </div>
        </div>
      ))}
      <label className="neu-sm flex cursor-pointer items-start gap-2.5 rounded-xl bg-paper px-3 py-2.5">
        <input type="checkbox" name="features" value={OTHER_FEATURE} className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-blue)]" />
        <span className="flex-1 text-[13px] font-medium leading-snug text-ink">Something else (describe below)</span>
        <span className="shrink-0 text-[11px] font-bold text-ink-soft">Quoted after we talk</span>
      </label>
    </div>
  )
}

// Open from anywhere: window.dispatchEvent(new CustomEvent('weezie:open-brief'))
export default function ProjectBrief() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | ok | error
  const [code, setCode] = useState('')
  const [input, setInput] = useState(EMPTY_BRIEF)
  const [currency, setCurrency] = useState(rateCard.currencies[0])
  const [showBreakdown, setShowBreakdown] = useState(false)
  const firstRef = useRef(null)
  const formRef = useRef(null)

  // Derived, never stored: the total and every option's tag come from the same
  // pricing function, so they cannot disagree with each other.
  const estimate = useMemo(() => (input.type ? quote(input, code) : null), [input, code])
  const tags = useMemo(() => featureTags(input, currency), [input, currency])
  const other = rateCard.currencies.find((c) => c !== currency)

  const plan = estimate?.plan
  useEffect(() => {
    if (plan) ev('brief_estimate', { plan })
  }, [plan])

  function recalc() {
    if (formRef.current) setInput(readBrief(new FormData(formRef.current)))
  }

  useEffect(() => {
    const onOpen = () => {
      setCode(readWonCode())
      setStatus('idle')
      setInput(EMPTY_BRIEF)
      setShowBreakdown(false)
      setOpen(true)
    }
    window.addEventListener('weezie:open-brief', onOpen)
    return () => window.removeEventListener('weezie:open-brief', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => firstRef.current?.focus(), 50)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; clearTimeout(t) }
  }, [open])

  async function submit(e) {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    if (code) data.set('discount_code', code)
    // Send the same figure the visitor saw, so the brief email and the screen agree.
    data.set('estimate_shown', estimate ? estimate.summary : 'not calculated')
    if (estimate?.autoAdded.length) data.set('features_auto_added', estimate.autoAdded.join(', '))
    data.set('_subject', `New project brief from ${data.get('name')}`)

    if (!site.formEndpoint) {
      const body = encodeURIComponent([...data.entries()].filter(([k]) => !k.startsWith('_')).map(([k, v]) => `${k}: ${v}`).join('\n'))
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Project brief')}&body=${body}`
      setStatus('ok'); return
    }
    setStatus('sending')
    try {
      const res = await fetch(site.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (res.ok) { setStatus('ok'); form.reset(); setInput(EMPTY_BRIEF) } else setStatus('error')
    } catch { setStatus('error') }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Project brief">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-paper p-6 neu md:p-8">
        <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="neu-hover sticky left-full top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
        </button>

        {status === 'ok' ? (
          <div className="py-6 text-center" aria-live="polite">
            <img src="/party.png" alt="" aria-hidden="true" className="mx-auto h-20 w-auto" />
            <h3 className="display mt-4 text-3xl text-ink">Brief sent!</h3>
            <p className="mt-3 text-base font-medium text-ink-soft">
              I&rsquo;ll review your responses{code ? ` (with your ${gameConfig.discountPct}% code)` : ''} and get back to you within 24 hours. 🚀
            </p>
            <button type="button" onClick={() => setOpen(false)} className="btn-gradient mt-6 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em]">Done</button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={submit} onChange={recalc} className="-mt-6 flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">Start a project</p>
              <h3 className="display mt-2 text-3xl text-ink">Project brief.</h3>
              <p className="mt-2 text-sm font-medium text-ink-soft">The more you share, the sharper my first reply. Fields marked * are required.</p>
              {code && <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-blue">🎉 Your {gameConfig.discountPct}% code {code} will be attached</p>}
            </div>

            <Section title="👤 Personal & business info">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="b-name" className={label}>Full name *</label>
                  <input ref={firstRef} id="b-name" name="name" required autoComplete="name" className={field} placeholder="John Smith" />
                </div>
                <div>
                  <label htmlFor="b-biz" className={label}>Business / brand *</label>
                  <input id="b-biz" name="business" required className={field} placeholder="Acme Inc." />
                </div>
                <div>
                  <label htmlFor="b-email" className={label}>Email *</label>
                  <input id="b-email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@email.com" />
                </div>
                <div>
                  <label htmlFor="b-phone" className={label}>Phone / WhatsApp</label>
                  <input id="b-phone" name="phone" type="tel" autoComplete="tel" className={field} placeholder="+1 234 567 8900" />
                </div>
              </div>
              <div>
                <label htmlFor="b-industry" className={label}>Industry / niche *</label>
                <input id="b-industry" name="industry" required className={field} placeholder="e.g. SaaS, Fintech, Consulting, Real Estate, Healthcare" />
              </div>
            </Section>

            <Section title="🌐 Website details">
              <div>
                <span className={label}>Do you have an existing website?</span>
                <Choice type="radio" name="existing_site" options={EXISTING} required tag={existingTag} />
              </div>
              <div>
                <label htmlFor="b-url" className={label}>Existing website URL (if any)</label>
                <input id="b-url" name="existing_url" type="url" className={field} placeholder="https://yourwebsite.com" />
              </div>
              <div>
                <label htmlFor="b-type" className={label}>What type of website do you need? *</label>
                <select id="b-type" name="website_type" required defaultValue="" className={field}>
                  <option value="" disabled>— Select —</option>
                  {WEBSITE_TYPES.map(([t]) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="b-goal" className={label}>Main goal of the website *</label>
                <textarea id="b-goal" name="main_goal" required rows="3" className={field} placeholder="e.g. Generate qualified leads and let clients book consultations or request a quote online…" />
              </div>
            </Section>

            <Section title="⚙️ Features & functionality">
              <div>
                <span className={label}>Pick what you need. Each one shows what it adds to your estimate.</span>
                <FeaturePicker tags={tags} />
              </div>
              <div>
                <label htmlFor="b-feat" className={label}>Any other features?</label>
                <textarea id="b-feat" name="other_features" rows="2" className={field} placeholder="Describe any specific features you have in mind…" />
              </div>
            </Section>

            <Section title="🎨 Design preferences">
              <div>
                <span className={label}>Do you have a brand kit? (logo, colours, fonts)</span>
                <Choice type="radio" name="brand_kit" options={BRANDKIT} tag={(o) => brandingTag(o, currency)} />
              </div>
              <div>
                <label htmlFor="b-style" className={label}>Website style preference</label>
                <select id="b-style" name="style" defaultValue="" className={field}>
                  <option value="" disabled>— Select —</option>
                  {STYLES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="b-refs" className={label}>Reference websites you like</label>
                <textarea id="b-refs" name="references" rows="2" className={field} placeholder="Paste links to sites you like the look/feel of…" />
              </div>
            </Section>

            <Section title="🗓️ Timeline & budget">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="b-launch" className={label}>Desired launch date</label>
                  <input id="b-launch" name="launch_date" className={field} placeholder="e.g. 2 weeks, ASAP, No rush…" />
                </div>
                <div>
                  <label htmlFor="b-budget" className={label}>Budget range *</label>
                  <select id="b-budget" name="budget" required defaultValue="" className={field}>
                    <option value="" disabled>— Select —</option>
                    {BUDGETS.map(([t]) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <span className={label}>Ongoing maintenance after launch?</span>
                <Choice type="radio" name="maintenance" options={MAINTENANCE} tag={(o) => maintenanceTag(o, currency)} />
              </div>
            </Section>

            <Section title="📝 Additional notes">
              <div>
                <label htmlFor="b-notes" className={label}>Anything else I should know?</label>
                <textarea id="b-notes" name="notes" rows="3" className={field} placeholder="Any specific requirements, concerns, or details not covered above…" />
              </div>
            </Section>

            {/* honeypot */}
            <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />

            <button type="submit" disabled={status === 'sending'} className="btn-gradient rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] disabled:opacity-60">
              {status === 'sending' ? 'Sending…' : 'Submit Project Brief →'}
            </button>
            {status === 'error' && (
              <p role="alert" className="text-center text-sm font-semibold text-ink">
                Something went wrong. Email me at <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
              </p>
            )}
            <p className="text-center text-xs font-medium text-ink-soft">I&rsquo;ll review and get back to you within 24 hours. 🚀</p>

            {/* Pinned to the bottom of the modal so the number is on screen while
                they are still choosing: the form is ~3000px tall and only ~690px
                of it is visible at once. Sits last in the DOM so it never covers
                the submit button. */}
            {estimate && (
              <div className="sticky bottom-0 z-20 -mx-1 rounded-2xl bg-paper p-4 neu" aria-live="polite">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue">Your estimate</p>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft">{estimate.label}</p>
                    <p className="text-[11px] font-semibold text-ink-soft">{estimate.timeline}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="display text-2xl leading-none text-ink">{estimate.total[currency]}</p>
                    {estimate.discounted && (
                      <p className="mt-1 text-[11px] font-semibold text-ink-soft line-through">{estimate.listed[currency]}</p>
                    )}
                    <p className="mt-1 text-[11px] font-semibold text-ink-soft">{estimate.total[other]}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex gap-1 rounded-full bg-paper p-1 neu-inset" role="group" aria-label="Currency">
                    {rateCard.currencies.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={currency === c}
                        onClick={() => setCurrency(c)}
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                          currency === c ? 'bg-paper text-ink neu-sm' : 'text-ink-soft hover:text-ink'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-expanded={showBreakdown}
                    onClick={() => setShowBreakdown((v) => !v)}
                    className="text-[11px] font-bold uppercase tracking-[0.1em] text-blue underline underline-offset-4 hover:text-ink"
                  >
                    {showBreakdown ? 'Hide breakdown' : 'See breakdown'}
                  </button>
                </div>

                {showBreakdown && (
                  <ul className="mt-3 max-h-48 overflow-y-auto border-t border-line pt-2 pr-2">
                    {estimate.lines.map((l) => (
                      <li key={l.label} className="flex justify-between gap-3 py-1 text-[12px]">
                        <span className="font-medium text-ink">
                          {l.label}
                          {l.note && <span className="block text-[10px] text-ink-soft">{l.note}</span>}
                        </span>
                        <span className="shrink-0 font-bold text-ink">{l.amount[currency]}</span>
                      </li>
                    ))}
                    {estimate.discounted && (
                      <li className="flex justify-between gap-3 py-1 text-[12px]">
                        <span className="font-medium text-blue">{gameConfig.discountPct}% game code</span>
                        <span className="shrink-0 font-bold text-blue">{estimate.saving[currency]}</span>
                      </li>
                    )}
                  </ul>
                )}

                {estimate.monthly && (
                  <p className="mt-2 text-[11px] font-semibold text-ink">
                    Plus maintenance from {estimate.monthly[currency]} a month, billed separately.
                  </p>
                )}
                {estimate.discounted && (
                  <p className="mt-2 text-[11px] font-bold text-blue">🎉 Your {gameConfig.discountPct}% code is applied.</p>
                )}
                {estimate.overBudget && (
                  <p className="mt-2 text-[11px] font-semibold text-ink">
                    Above the budget you picked. Send it anyway: scope can be cut or phased.
                  </p>
                )}
                <p className="mt-2 text-[10px] font-medium leading-relaxed text-ink-soft">
                  An estimate, not a quote. Confirmed in writing before any work starts.
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
