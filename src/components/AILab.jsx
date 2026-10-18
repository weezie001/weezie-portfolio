import { useState } from 'react'
import { aiLabConfig } from '../data.js'
import { runAITool, launchPaystackPopup, verifyAndRecordOrder } from '../lib/crmStore.js'
import { ev } from '../lib/analytics.js'

export default function AILab() {
  const [activeTool, setActiveTool] = useState('audit') // 'audit' | 'architect'
  const [currency, setCurrency] = useState('USD')
  const [input, setInput] = useState('')
  const [context, setContext] = useState('')
  const [status, setStatus] = useState('idle') // idle | running | ready | unlocking | unlocked
  const [result, setResult] = useState(null)
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [unlockedMd, setUnlockedMd] = useState('')
  const [error, setError] = useState('')

  const unlockAmount = currency === 'NGN' ? aiLabConfig.unlockPrice.NGN : aiLabConfig.unlockPrice.USD
  const unlockLabel = currency === 'NGN' ? aiLabConfig.unlockPrice.displayNGN : aiLabConfig.unlockPrice.displayUSD

  async function handleRun(e) {
    e.preventDefault()
    setError('')
    if (!input.trim()) {
      setError(activeTool === 'audit' ? 'Enter a website URL to audit.' : 'Describe the project or app idea.')
      return
    }
    setStatus('running')
    setUnlockedMd('')
    ev('ai_tool_run', { tool: activeTool })

    const res = await runAITool({
      tool: activeTool,
      input: input.trim(),
      context: context.trim(),
    })

    if (res?.ok) {
      setResult(res)
      setStatus('ready')
    } else {
      setError(res?.error || 'Could not run AI analysis. Please try again.')
      setStatus('idle')
    }
  }

  function handleUnlockFullPack(e) {
    e.preventDefault()
    if (!buyerName.trim() || !buyerEmail.trim()) {
      setError('Enter your name and email so we can unlock and send your full pack.')
      return
    }
    setError('')
    setStatus('unlocking')
    const packTitle =
      activeTool === 'audit'
        ? `Full 10-Point Website Audit & Copy Pack (${input.trim().slice(0, 32)})`
        : `Full Technical PRD & SQL Schema Pack (${input.trim().slice(0, 32)})`

    launchPaystackPopup({
      email: buyerEmail.trim(),
      amount: unlockAmount,
      currency,
      metadata: {
        custom_fields: [
          { display_name: 'Customer', variable_name: 'buyer_name', value: buyerName.trim() },
          { display_name: 'AI Tool', variable_name: 'ai_tool', value: activeTool },
        ],
      },
      onSuccess: async ({ reference }) => {
        const verified = await verifyAndRecordOrder({
          reference,
          name: buyerName.trim(),
          email: buyerEmail.trim(),
          item_type: 'ai_unlock',
          item_id: `ai-${activeTool}-${result?.runId || Date.now()}`,
          item_title: packTitle,
          currency,
          amount: unlockAmount,
          ai_run_id: result?.runId,
        })
        if (!verified?.ok || !verified.fullReportMd) {
          setError(verified?.error || 'Payment could not be verified. Contact hello@weezie.site with your reference.')
          setStatus('ready')
          return
        }
        setUnlockedMd(verified.fullReportMd)
        setStatus('unlocked')
        ev('ai_tool_unlocked', { tool: activeTool, currency, amount: unlockAmount })
      },
      onCancel: () => {
        setStatus('ready')
      },
    })
  }

  function openBriefWithPlan(planName) {
    window.dispatchEvent(
      new CustomEvent('weezie:open-brief', {
        detail: { plan: planName || 'Business Website', currency },
      }),
    )
  }

  function downloadMarkdownReport() {
    if (!unlockedMd) return
    const blob = new Blob([unlockedMd], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weezie-ai-${activeTool}-blueprint.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section id="ai-lab" className="relative bg-paper px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// Interactive AI Tools · Powered by Cloudflare AI</p>
            <h2 className="display mt-2 text-5xl text-ink md:text-7xl">
              WEEZIE <span className="text-gradient">AI LAB</span>
            </h2>
            <p className="mt-3 max-w-2xl text-base font-medium text-ink-soft">
              Test your current website or scope your next startup idea in seconds. Free instant diagnosis — or unlock
              the complete Deep-Dive Copy &amp; Technical Blueprint.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full bg-paper p-1.5 neu-inset md:self-auto">
            {['USD', 'NGN'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                  currency === c ? 'btn-gradient text-white shadow' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {c === 'USD' ? '$ USD' : '₦ NGN'}
              </button>
            ))}
          </div>
        </div>

        {/* Tool selector tabs */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {aiLabConfig.tools.map((t) => {
            const active = activeTool === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTool(t.id)
                  setResult(null)
                  setStatus('idle')
                  setError('')
                }}
                className={`neu-hover flex flex-col items-start rounded-3xl bg-paper p-6 text-left transition ${
                  active ? 'ring-2 ring-blue neu' : 'neu-sm opacity-85 hover:opacity-100'
                }`}
              >
                <span className="rounded-full bg-blue/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue">
                  {t.badge}
                </span>
                <span className="display mt-3 text-2xl text-ink">{t.name}</span>
                <span className="mt-1.5 text-xs font-medium leading-relaxed text-ink-soft">{t.desc}</span>
              </button>
            )
          })}
        </div>

        {/* Input Card */}
        <div className="mt-8 rounded-[28px] bg-paper p-6 neu md:p-8">
          <form onSubmit={handleRun} className="grid gap-4 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">
                {activeTool === 'audit' ? 'Website URL or Brand Name *' : 'What do you want to build? *'}
              </label>
              <input
                type="text"
                required
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  activeTool === 'audit'
                    ? 'e.g. https://yourbusiness.com'
                    : 'e.g. A fintech savings & agro-investment web app with Paystack and user wallets'
                }
                className="w-full rounded-2xl bg-paper px-4 py-3.5 text-sm font-medium text-ink outline-none neu-inset focus:ring-2 focus:ring-blue/50"
              />
            </div>

            <div className="md:col-span-4">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">
                {activeTool === 'audit' ? 'Industry / Target Customer' : 'Target Audience / Market'}
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder={activeTool === 'audit' ? 'e.g. Real Estate, Fashion, SaaS' : 'e.g. Nigerian & diaspora investors'}
                className="w-full rounded-2xl bg-paper px-4 py-3.5 text-sm font-medium text-ink outline-none neu-inset focus:ring-2 focus:ring-blue/50"
              />
            </div>

            <div className="flex items-end md:col-span-2">
              <button
                type="submit"
                disabled={status === 'running'}
                className="btn-gradient w-full rounded-2xl px-5 py-3.5 text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-60"
              >
                {status === 'running' ? 'Analyzing…' : activeTool === 'audit' ? 'Audit Site ⚡' : 'Scope Idea ⚡'}
              </button>
            </div>
          </form>

          {error && <p className="mt-3 text-xs font-bold text-red-600">{error}</p>}

          {/* Results Area */}
          {result?.preview && (
            <div className="mt-8 border-t border-line pt-8">
              {activeTool === 'audit' ? (
                <div>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl bg-paper p-4 text-center neu-inset">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">Overall Score</span>
                      <p className="display mt-1 text-4xl text-blue">{result.preview.overallScore}/100</p>
                    </div>
                    <div className="rounded-2xl bg-paper p-4 text-center neu-sm">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">UI / UX Design</span>
                      <p className="display mt-1 text-3xl text-ink">{result.preview.scores?.uxDesign}/100</p>
                    </div>
                    <div className="rounded-2xl bg-paper p-4 text-center neu-sm">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">Conversion Flow</span>
                      <p className="display mt-1 text-3xl text-ink">{result.preview.scores?.conversion}/100</p>
                    </div>
                    <div className="rounded-2xl bg-paper p-4 text-center neu-sm">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">Speed &amp; AI SEO</span>
                      <p className="display mt-1 text-3xl text-ink">{result.preview.scores?.speedSeo}/100</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-paper p-5 neu-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Free Instant Diagnosis</p>
                    <p className="mt-2 text-base font-semibold text-ink">{result.preview.verdict}</p>
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Top 3 Quick Wins:</p>
                    <ul className="mt-2 space-y-2">
                      {(result.preview.quickWins || []).map((w, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-ink-soft">
                          <span className="font-bold text-blue">0{idx + 1}.</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-paper p-5 neu-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
                        Recommended Tier: {result.preview.recommendedPlan}
                      </span>
                      <h3 className="display mt-1 text-2xl text-ink">{result.preview.projectName}</h3>
                    </div>
                    <span className="rounded-full bg-paper px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-ink neu-inset">
                      Est. Timeline: {result.preview.estimatedTimeline}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-medium leading-relaxed text-ink-soft">{result.preview.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(result.preview.recommendedStack || []).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-ink neu-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Core V1 Modules:</p>
                  <ul className="mt-2 space-y-1.5">
                    {(result.preview.coreModules || []).map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm font-medium text-ink-soft">
                        <span className="font-bold text-blue">✓</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Unlocked Full Blueprint OR Freemium Paywall */}
              {status === 'unlocked' && unlockedMd ? (
                <div className="mt-6 rounded-2xl bg-paper p-6 neu-inset">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue">
                      🔓 Full Deep-Dive Pack Unlocked (Also Emailed to {buyerEmail})
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={downloadMarkdownReport}
                        className="neu-hover rounded-full bg-paper px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink neu-sm"
                      >
                        Download .MD Blueprint ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => openBriefWithPlan(result.preview.recommendedPlan)}
                        className="btn-gradient rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.1em]"
                      >
                        Hire Weezie to Build This →
                      </button>
                    </div>
                  </div>
                  <pre className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white/70 p-4 font-mono text-xs leading-relaxed text-ink">
                    {unlockedMd}
                  </pre>
                </div>
              ) : (
                <div className="mt-6 grid gap-6 rounded-3xl bg-paper p-6 neu-inset lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <span className="inline-block rounded-full bg-blue px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                      Pro Deep-Dive Pack · {unlockLabel}
                    </span>
                    <h4 className="display mt-2 text-2xl text-ink">
                      {activeTool === 'audit'
                        ? 'Unlock the Full 10-Point Audit + Rewritten Hero Copy Deck'
                        : 'Unlock the Complete Technical PRD, SQL Database Schema & API Spec'}
                    </h4>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-ink-soft">
                      Get the complete downloadable Markdown blueprint &amp; emailed copy. Best part: your{' '}
                      <strong>{unlockLabel}</strong> unlock is <strong>100% credited back</strong> if you hire Enang
                      Weezie to build your project.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openBriefWithPlan(result.preview.recommendedPlan)}
                        className="neu-hover rounded-full bg-paper px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink neu-sm"
                      >
                        Skip &amp; Hire Weezie Directly ({result.preview.recommendedPlan}) →
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleUnlockFullPack} className="flex flex-col gap-3 lg:col-span-5">
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-sm"
                    />
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="Email to receive full blueprint"
                      className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-sm"
                    />
                    <button
                      type="submit"
                      disabled={status === 'unlocking'}
                      className="btn-gradient rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em]"
                    >
                      {status === 'unlocking'
                        ? 'Opening Paystack…'
                        : `Unlock Full Blueprint (${unlockLabel}) →`}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
