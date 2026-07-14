import { useEffect, useRef, useState } from 'react'
import { site } from '../data.js'

const TYPES = ['Website', 'Web app', 'E-commerce', 'Redesign', 'Branding / identity', 'Other']
const BUDGETS = ['Under $500', '$500 – $1,000', '$1,000 – $3,000', '$3,000+', 'Not sure yet']
const TIMELINES = ['ASAP', '2 – 4 weeks', '1 – 2 months', 'Flexible']

function readWonCode() {
  try {
    const s = JSON.parse(localStorage.getItem('weezie_rps_v3') || '{}')
    return s.hasWon && s.code ? s.code : ''
  } catch { return '' }
}

// Open from anywhere with: window.dispatchEvent(new CustomEvent('weezie:open-brief'))
export default function ProjectBrief() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | ok | error
  const [code, setCode] = useState('')
  const firstRef = useRef(null)

  useEffect(() => {
    const onOpen = () => { setCode(readWonCode()); setStatus('idle'); setOpen(true) }
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
    data.set('_subject', `New project brief from ${data.get('name')}`)

    if (!site.formEndpoint) {
      const body = encodeURIComponent(
        [...data.entries()].filter(([k]) => !k.startsWith('_')).map(([k, v]) => `${k}: ${v}`).join('\n'),
      )
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Project brief')}&body=${body}`
      setStatus('ok')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(site.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (res.ok) { setStatus('ok'); form.reset() } else setStatus('error')
    } catch { setStatus('error') }
  }

  if (!open) return null

  const field = 'w-full rounded-xl bg-paper px-4 py-3 text-base font-medium text-ink placeholder-ink-soft/60 outline-none neu-inset focus:ring-2 focus:ring-blue/50'
  const label = 'mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft'

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Project brief">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-paper p-6 neu md:p-8">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="neu-hover absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
        </button>

        {status === 'ok' ? (
          <div className="py-6 text-center" aria-live="polite">
            <img src="/party.png" alt="" aria-hidden="true" className="mx-auto h-20 w-auto" />
            <h3 className="display mt-4 text-3xl text-ink">Brief sent!</h3>
            <p className="mt-3 text-base font-medium text-ink-soft">
              Thanks{code ? ' — your 30% code is attached' : ''}. I&rsquo;ll get back to you within 24 hours.
            </p>
            <button type="button" onClick={() => setOpen(false)} className="btn-gradient mt-6 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em]">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">Start a project</p>
              <h3 className="display mt-2 text-3xl text-ink">Tell me about it.</h3>
              {code && (
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-blue">🎉 Your 30% code {code} will be attached</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="b-name" className={label}>Name</label>
                <input ref={firstRef} id="b-name" name="name" type="text" required autoComplete="name" className={field} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="b-email" className={label}>Email</label>
                <input id="b-email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="b-type" className={label}>Project</label>
                <select id="b-type" name="project_type" required defaultValue="" className={field}>
                  <option value="" disabled>Select…</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="b-budget" className={label}>Budget</label>
                <select id="b-budget" name="budget" required defaultValue="" className={field}>
                  <option value="" disabled>Select…</option>
                  {BUDGETS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="b-time" className={label}>Timeline</label>
                <select id="b-time" name="timeline" required defaultValue="" className={field}>
                  <option value="" disabled>Select…</option>
                  {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="b-details" className={label}>Project details</label>
              <textarea id="b-details" name="details" required rows="4" className={field} placeholder="What are you building? Goals, pages, any references…" />
            </div>

            {/* honeypot */}
            <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-gradient mt-1 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send Brief'}
            </button>
            {status === 'error' && (
              <p role="alert" className="text-sm font-semibold text-ink">
                Something went wrong. Email me directly at <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
