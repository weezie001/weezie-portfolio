import { useEffect, useState } from 'react'
import { site } from '../data.js'
import { DoodleScatter } from './Doodles.jsx'

const RPS_KEY = 'weezie_rps_v4'

function readWonCode() {
  try {
    const raw = localStorage.getItem(RPS_KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (s.hasWon && s.code) return s.code
    }
  } catch { /* ignore */ }
  return ''
}

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | ok | error | mailed
  const [code, setCode] = useState('')

  // Pull in the discount code from the game — on load and the moment it's won.
  useEffect(() => {
    setCode(readWonCode())
    const onCode = (e) => setCode(e.detail || readWonCode())
    window.addEventListener('weezie:code', onCode)
    return () => window.removeEventListener('weezie:code', onCode)
  }, [])

  function mailtoFallback(data) {
    const codeLine = code ? `\n\n🎉 Discount code: ${code} (30% off my first project)` : ''
    const subject = encodeURIComponent(
      code ? `Project inquiry from ${data.get('name')} — code ${code}` : `Project inquiry from ${data.get('name')}`,
    )
    const body = encodeURIComponent(`${data.get('message')}${codeLine}\n\n— ${data.get('name')} (${data.get('email')})`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setStatus('mailed')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    if (code) data.set('discount_code', code)
    data.set('_subject', `New project inquiry from ${data.get('name')}`)

    // No backend configured → open the visitor's mail app instead.
    if (!site.formEndpoint) return mailtoFallback(data)

    setStatus('sending')
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) { setStatus('ok'); form.reset() }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const inputCls =
    'w-full rounded-2xl bg-paper px-4 py-3.5 text-base font-medium text-ink placeholder-ink-soft/60 outline-none neu-inset focus:ring-2 focus:ring-blue/50'

  return (
    <section id="contact" className="relative overflow-hidden bg-paper px-6 py-24 md:px-10">
      <DoodleScatter variant="b" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <h2 className="reveal display text-6xl text-ink md:text-8xl">
          GET IN <span className="text-gradient">TOUCH</span>
        </h2>

        {/* project-brief callout — opens the on-page brief modal */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('weezie:open-brief'))}
          className="reveal neu-hover mt-8 flex w-full flex-col gap-1 rounded-2xl bg-paper p-5 text-left neu-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="block text-sm font-bold uppercase tracking-[0.12em] text-blue">Start a project</span>
            <span className="mt-1 block text-base font-medium text-ink-soft">
              Tell me everything about your website in a quick brief →
            </span>
          </span>
          <span className="btn-gradient mt-3 shrink-0 rounded-full px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] sm:mt-0">
            Open the brief
          </span>
        </button>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="reveal flex flex-col gap-4" aria-label="Contact form">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">Name</label>
              <input id="name" name="name" type="text" required autoComplete="name" className={inputCls} placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} placeholder="you@example.com" />
            </div>

            {/* auto-attached discount code from the game */}
            {code && (
              <div>
                <label htmlFor="code" className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-blue">
                  🎉 Your discount code — 30% off
                </label>
                <input id="code" name="code" type="text" readOnly value={code} className={`${inputCls} font-bold tracking-wider text-blue`} />
              </div>
            )}

            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">Message</label>
              <textarea id="message" name="message" required rows="4" className={inputCls} placeholder="Tell me about your project…" />
            </div>
            {/* honeypot (spam trap) — bots fill it, humans don't */}
            <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-gradient mt-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>

            {(status === 'ok' || status === 'mailed') && (
              <div role="status" className="rounded-2xl bg-paper p-4 neu-inset">
                <p className="text-sm font-semibold text-ink">
                  {status === 'ok'
                    ? `✅ Thanks — your message is on its way${code ? ' with your discount code' : ''}. I’ll reply within 24 hours.`
                    : `Your mail app should open with the message${code ? ' and your code' : ''} ready — just hit send.`}
                </p>
                <a
                  href="#play"
                  className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.12em] text-blue underline underline-offset-4 hover:text-ink"
                >
                  While you wait for my reply — play a game 🎮 →
                </a>
              </div>
            )}
            {status === 'error' && (
              <p role="alert" className="text-sm font-semibold text-ink">
                Something went wrong sending that. Please try again, or email me directly at{' '}
                <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
              </p>
            )}
          </form>

          <div className="reveal">
            <p className="text-lg font-medium leading-relaxed text-ink-soft">
              Prefer to reach out directly? I reply within 24 hours.
            </p>
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="display text-2xl text-ink underline decoration-2 underline-offset-4 hover:text-blue md:text-3xl">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Résumé</dt>
                <dd className="mt-1">
                  <a href={site.cv} target="_blank" rel="noreferrer" download className="text-lg font-bold text-ink underline underline-offset-4 hover:text-blue">
                    Download my CV (PDF) ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Location</dt>
                <dd className="mt-1 text-lg font-medium text-ink">{site.location}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
