import { useEffect, useMemo, useRef, useState } from 'react'
import { site, gameConfig, rateCard, briefFeatureGroups } from '../data.js'
import {
  quote,
  readFields,
  suggestedPlan,
  planFeatureSet,
  WEBSITE_TYPES,
  BUDGETS,
  EMPTY_FIELDS,
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

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-blue" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function Section({ title, children }) {
  return (
    <fieldset className="border-t border-line pt-6">
      <legend className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-blue">{title}</legend>
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  )
}

function Choice({ type, name, options, required }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o, i) => (
        <label key={o} className="neu-sm flex cursor-pointer items-center gap-3 rounded-xl bg-paper px-4 py-2.5">
          <input type={type} name={name} value={o} required={required && type === 'radio' && i === 0} className="h-4 w-4 shrink-0 accent-[color:var(--color-blue)]" />
          <span className="text-sm font-medium text-ink">{o}</span>
        </label>
      ))}
    </div>
  )
}

// The four rate-card plans, priced exactly as on the pricing section.
function PlanPicker({ plan, currency, onChoose }) {
  const tier = rateCard.tiers.find((t) => t.name === plan)
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Plan">
        {rateCard.tiers.map((t, i) => (
          <label
            key={t.name}
            className={`neu-sm flex cursor-pointer flex-col rounded-xl bg-paper px-3 py-3 ${plan === t.name ? 'ring-2 ring-blue' : ''}`}
          >
            <span className="flex items-start gap-2">
              <input
                type="radio"
                name="plan"
                value={t.name}
                required={i === 0}
                checked={plan === t.name}
                onChange={() => onChoose(t.name)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-blue)]"
              />
              <span className="text-[13px] font-bold leading-snug text-ink">{t.name}</span>
            </span>
            <span className="mt-1.5 pl-6 text-sm font-bold text-blue">{t.price[currency]}</span>
            <span className="pl-6 text-[11px] font-semibold text-ink-soft">{t.timeline}</span>
          </label>
        ))}
      </div>

      {tier && (
        <div className="rounded-xl bg-paper p-4 neu-inset">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink">Your {tier.name} plan includes</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {tier.includes.map((line) => (
              <li key={line} className="flex gap-2 text-[12px] font-medium leading-snug text-ink-soft">
                <Check />
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// No prices here, by design: the plan's features come ticked as one package,
// and extras only show up in the total. A box that something else needs is
// ticked and locked, with the reason under it.
function FeaturePicker({ plan, picked, extras, onToggle }) {
  const inPlan = planFeatureSet(plan)
  return (
    <div className="flex flex-col gap-5">
      {briefFeatureGroups.map((g) => (
        <div key={g.group}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">{g.group}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {g.items.map((f) => {
              const covered = inPlan.has(f.label)
              const neededFor = extras.get(f.label)
              const ticked = covered || extras.has(f.label)
              const locked = covered || Boolean(neededFor)
              const note = covered ? 'In your plan' : neededFor ? `Needed for ${neededFor}` : ''
              return (
                <label
                  key={f.label}
                  className={`neu-sm flex items-start gap-2.5 rounded-xl bg-paper px-3 py-2.5 ${locked ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <input
                    type="checkbox"
                    checked={ticked}
                    disabled={locked}
                    onChange={() => onToggle(f.label)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-blue)]"
                  />
                  <span className="flex-1 text-[13px] font-medium leading-snug text-ink">
                    {f.label}
                    {note && <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.06em] text-blue">{note}</span>}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      ))}
      <label className="neu-sm flex cursor-pointer items-start gap-2.5 rounded-xl bg-paper px-3 py-2.5">
        <input
          type="checkbox"
          checked={picked.includes(OTHER_FEATURE)}
          onChange={() => onToggle(OTHER_FEATURE)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-blue)]"
        />
        <span className="flex-1 text-[13px] font-medium leading-snug text-ink">Something else (describe below)</span>
      </label>
    </div>
  )
}

// Open from anywhere: window.dispatchEvent(new CustomEvent('weezie:open-brief'))
// A plan picked on the pricing section arrives as detail: { plan, currency }.
export default function ProjectBrief() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | ok | error
  const [code, setCode] = useState('')
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [picked, setPicked] = useState([])
  const [currency, setCurrency] = useState(rateCard.currencies[0])
  const firstRef = useRef(null)
  const formRef = useRef(null)

  const estimate = useMemo(() => quote(fields, picked, code), [fields, picked, code])
  const extras = estimate?.extras || new Map()
  const other = rateCard.currencies.find((c) => c !== currency)

  const plan = estimate?.plan
  useEffect(() => {
    if (plan) ev('brief_estimate', { plan })
  }, [plan])

  function recalc() {
    if (!formRef.current) return
    const next = readFields(new FormData(formRef.current))
    setFields((f) => {
      const merged = { ...f, ...next }
      // Choosing what they are building suggests a plan, but only until they
      // have picked one themselves; it never overrides their choice.
      if (!f.plan && next.type !== f.type && suggestedPlan(next.type)) merged.plan = suggestedPlan(next.type)
      return merged
    })
  }

  function choosePlan(name) {
    setFields((f) => ({ ...f, plan: name }))
  }

  function toggle(featureLabel) {
    setPicked((p) => (p.includes(featureLabel) ? p.filter((f) => f !== featureLabel) : [...p, featureLabel]))
  }

  useEffect(() => {
    const onOpen = (e) => {
      const detail = e.detail || {}
      setCode(readWonCode())
      setStatus('idle')
      setFields({ ...EMPTY_FIELDS, plan: rateCard.tiers.some((t) => t.name === detail.plan) ? detail.plan : '' })
      setPicked([])
      if (rateCard.currencies.includes(detail.currency)) setCurrency(detail.currency)
      setOpen(true)
    }
    window.addEventListener('weezie:open-brief', onOpen)
    return () => window.removeEventListener('weezie:open-brief', onOpen)
  }, [])

  // A shared link to /#brief opens the brief straight away. The hash is then
  // dropped, so closing the brief leaves a clean URL and the link works again.
  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash.toLowerCase() !== '#brief') return
      window.dispatchEvent(new CustomEvent('weezie:open-brief'))
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    // preventScroll keeps the modal at the top, so a plan chosen on the pricing
    // section is the first thing they see rather than scrolled past.
    const t = setTimeout(() => firstRef.current?.focus({ preventScroll: true }), 50)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; clearTimeout(t) }
  }, [open])

  async function submit(e) {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    if (code) data.set('discount_code', code)
    // Feature boxes are controlled (and locked ones are disabled, which the
    // browser leaves out of FormData), so attach the real lists explicitly.
    data.delete('features')
    const inPlan = [...planFeatureSet(fields.plan)]
    if (inPlan.length) data.set('features_in_plan', inPlan.join(', '))
    picked.filter((f) => !inPlan.includes(f)).forEach((f) => data.append('features', f))
    if (estimate?.autoAdded.length) data.set('features_auto_added', estimate.autoAdded.join(', '))
    // Send the same figure the visitor saw, so the brief email and the screen agree.
    data.set('estimate_shown', estimate ? estimate.summary : 'not calculated')
    data.set('_subject', `New project brief from ${data.get('name')}${fields.plan ? ` (${fields.plan})` : ''}`)

    if (!site.formEndpoint) {
      const body = encodeURIComponent([...data.entries()].filter(([k]) => !k.startsWith('_')).map(([k, v]) => `${k}: ${v}`).join('\n'))
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Project brief')}&body=${body}`
      setStatus('ok'); return
    }
    setStatus('sending')
    try {
      const res = await fetch(site.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (res.ok) {
        setStatus('ok')
        form.reset()
        setFields(EMPTY_FIELDS)
        setPicked([])
      } else setStatus('error')
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

            <Section title="📦 Your plan">
              <span className="-mb-1 text-[12px] font-medium text-ink-soft">
                Same prices as the pricing section. Not sure? Pick the closest and I&rsquo;ll confirm after reading your brief.
              </span>
              <PlanPicker plan={fields.plan} currency={currency} onChoose={choosePlan} />
            </Section>

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
                <Choice type="radio" name="existing_site" options={EXISTING} required />
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
                <span className={label}>
                  Features in your plan are already ticked. Tick anything else you need and your estimate updates.
                </span>
                <FeaturePicker plan={fields.plan} picked={picked} extras={extras} onToggle={toggle} />
              </div>
              <div>
                <label htmlFor="b-feat" className={label}>Any other features?</label>
                <textarea id="b-feat" name="other_features" rows="2" className={field} placeholder="Describe any specific features you have in mind…" />
              </div>
            </Section>

            <Section title="🎨 Design preferences">
              <div>
                <span className={label}>Do you have a brand kit? (logo, colours, fonts)</span>
                <Choice type="radio" name="brand_kit" options={BRANDKIT} />
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
                <Choice type="radio" name="maintenance" options={MAINTENANCE} />
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
                    <p className="text-[11px] font-semibold text-ink-soft">
                      {estimate.plan ? estimate.timeline : 'Choose a plan above to complete your estimate'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="display text-2xl leading-none text-ink">{estimate.total[currency]}</p>
                    {estimate.discounted && (
                      <p className="mt-1 text-[11px] font-semibold text-ink-soft line-through">{estimate.listed[currency]}</p>
                    )}
                    <p className="mt-1 text-[11px] font-semibold text-ink-soft">{estimate.total[other]}</p>
                  </div>
                </div>

                {estimate.planPart && estimate.extrasPart && (
                  <p className="mt-2 text-[11px] font-semibold text-ink">
                    Plan {estimate.planPart[currency]} + extras {estimate.extrasPart[currency]}
                  </p>
                )}
                {estimate.editsOnly && (
                  <p className="mt-1 text-[11px] font-semibold text-ink-soft">Edits to an existing site: half the plan price.</p>
                )}

                <div className="mt-3 flex gap-1 self-start rounded-full bg-paper p-1 neu-inset" role="group" aria-label="Currency" style={{ width: 'fit-content' }}>
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
