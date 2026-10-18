"use client";
import { useState, useId } from 'react'

/**
 * BentoFeatures — Weezie UI (Flagship Edition)
 * Asymmetric bento grid with dynamic cursor-following spotlight,
 * multi-language code runner, live metric sparklines, interactive failover simulation,
 * and event pipeline photon beam animation.
 *
 * Requirements: React 18+, Tailwind CSS 3.4+ (or v4). Zero external dependencies.
 */

const ACCENT_PRESETS = [
  { name: 'Indigo', rgb: '129 140 248', hex: '#818cf8' },
  { name: 'Emerald', rgb: '16 185 129', hex: '#10b981' },
  { name: 'Cyan', rgb: '14 165 233', hex: '#0ea5e9' },
  { name: 'Amber', rgb: '245 158 11', hex: '#f59e0b' },
  { name: 'Rose', rgb: '244 63 94', hex: '#f43f5e' },
]

const TIMEFRAME_DATA = {
  '1H': {
    total: '$4,820',
    change: '+18.4%',
    bars: [24, 38, 45, 30, 62, 55, 78, 65, 84, 72, 90, 85],
    labels: ['10m', '15m', '20m', '25m', '30m', '35m', '40m', '45m', '50m', '55m', '60m', 'now'],
  },
  '24H': {
    total: '$28,490',
    change: '+24.1%',
    bars: [35, 48, 42, 60, 52, 70, 65, 82, 75, 94, 88, 100],
    labels: ['02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', 'now'],
  },
  '7D': {
    total: '$148,920',
    change: '+34.8%',
    bars: [45, 55, 50, 72, 68, 85, 78, 92, 84, 98, 92, 100],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Today'],
  },
  '30D': {
    total: '$592,400',
    change: '+42.6%',
    bars: [30, 42, 54, 48, 65, 72, 68, 84, 90, 88, 96, 100],
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'Now'],
  },
}

const CODE_SNIPPETS = {
  TypeScript: `import { WeezieClient } from '@weezie/sdk'

const client = new WeezieClient({
  apiKey: process.env.WEEZIE_KEY,
  region: 'auto-latency-mesh'
})

// Instant edge dispatch with full type safety
const stream = await client.workflows.trigger({
  event: 'payment.succeeded',
  customer: 'ada@acme.com',
  amount: 2400
})`,
  Python: `from weezie import WeezieClient
import os

client = WeezieClient(
    api_key=os.environ["WEEZIE_KEY"],
    region="auto-latency-mesh"
)

# Stream events with zero-lag edge routing
stream = client.workflows.trigger(
    event="payment.succeeded",
    customer="ada@acme.com",
    amount=2400
)`,
  cURL: `curl -X POST https://api.weezie.site/v1/workflows/trigger \\
  -H "Authorization: Bearer $WEEZIE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "payment.succeeded",
    "customer": "ada@acme.com",
    "amount": 2400
  }'`,
}

const TEAM_MEMBERS = [
  { id: 'en', name: 'Enang W.', role: 'Lead Architect', avatar: 'EW', status: 'Editing /checkout-v3.tsx', online: true },
  { id: 'al', name: 'Alex Rivera', role: 'Staff Designer', avatar: 'AR', status: 'Reviewing Bento UI Kit', online: true },
  { id: 'mk', name: 'Maya Kim', role: 'Infra Engineer', avatar: 'MK', status: 'Deploying edge worker', online: true },
  { id: 'jd', name: 'Jordan D.', role: 'Security Ops', avatar: 'JD', status: 'Auditing SOC2 logs', online: false },
]

export default function BentoFeatures({
  eyebrow = 'Ultra-Engineered Architecture',
  title = 'Everything you need to ship, nothing you don’t',
  subtitle = 'Interactive, production-ready bento system with tactile physics, live telemetry simulation, and zero dependency bloat.',
  className = '',
}) {
  const [activeAccent, setActiveAccent] = useState(ACCENT_PRESETS[0])
  const [timeframe, setTimeframe] = useState('7D')
  const [hoveredBar, setHoveredBar] = useState(null)
  const [activeLang, setActiveLang] = useState('TypeScript')
  const [apiTesting, setApiTesting] = useState(false)
  const [apiSuccess, setApiSuccess] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [selectedMember, setSelectedMember] = useState(TEAM_MEMBERS[0])
  const [failoverActive, setFailoverActive] = useState(false)
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [activePipelineStep, setActivePipelineStep] = useState(-1)
  const [pingSent, setPingSent] = useState(false)

  const accentRgb = activeAccent.rgb
  const currentData = TIMEFRAME_DATA[timeframe]

  function handleTileMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(CODE_SNIPPETS[activeLang])
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    } catch {
      setCodeCopied(false)
    }
  }

  function handleTestApi() {
    if (apiTesting) return
    setApiTesting(true)
    setApiSuccess(false)
    setTimeout(() => {
      setApiTesting(false)
      setApiSuccess(true)
      setTimeout(() => setApiSuccess(false), 3500)
    }, 600)
  }

  function handleTriggerPipeline() {
    if (pipelineRunning) return
    setPipelineRunning(true)
    setActivePipelineStep(0)

    const steps = [0, 1, 2, 3]
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setActivePipelineStep(step)
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setPipelineRunning(false)
            setActivePipelineStep(4) // all complete
            setTimeout(() => setActivePipelineStep(-1), 2500)
          }, 800)
        }
      }, (idx + 1) * 600)
    })
  }

  function handlePingTeammate() {
    setPingSent(true)
    setTimeout(() => setPingSent(false), 2200)
  }

  return (
    <section className={`relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-5 text-white sm:p-10 ${className}`}>
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-3xl transition-colors duration-700"
        style={{ background: `radial-gradient(circle, rgb(${accentRgb}), transparent 70%)` }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header with Live Brand Accent Picker */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="max-w-xl">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              style={{ color: `rgb(${accentRgb})` }}
            >
              <span className="h-2 w-2 rounded-full animate-ping" style={{ background: `rgb(${accentRgb})` }} />
              {eyebrow}
            </span>
            <h2 className="display mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              {subtitle}
            </p>
          </div>

          {/* Interactive Accent Palette */}
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 p-3 backdrop-blur-md md:items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Interactive Theme Accent
            </span>
            <div className="flex items-center gap-2">
              {ACCENT_PRESETS.map((p) => {
                const isSelected = activeAccent.name === p.name
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setActiveAccent(p)}
                    className={`group relative flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                      isSelected ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={{ background: p.hex }}
                    title={`Switch accent to ${p.name}`}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-white shadow-sm" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 6-Column Responsive Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:gap-5">
          {/* ============================================================== */}
          {/* TILE 1: (Large 4x2) REAL-TIME CONVERSION PULSE & REVENUE CHART */}
          {/* ============================================================== */}
          <article
            onMouseMove={handleTileMove}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl md:col-span-4 md:row-span-2 sm:p-8"
            style={{ '--x': '50%', '--y': '50%' }}
          >
            {/* Spotlight & Glowing Radial Border */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(500px circle at var(--x) var(--y), rgb(${accentRgb} / 0.15), transparent 60%)`,
              }}
            />

            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm"
                      style={{ color: `rgb(${accentRgb})` }}
                    >
                      📈
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                      Live Telemetry &amp; Revenue Pulse
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    Real-time transaction stream with zero-latency aggregation.
                  </p>
                </div>

                {/* Timeframe Filter Tabs */}
                <div className="flex rounded-full border border-white/10 bg-black/40 p-1">
                  {['1H', '24H', '7D', '30D'].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                        timeframe === tf
                          ? 'bg-white text-black shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticker Stats */}
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="display text-4xl text-white sm:text-5xl">{currentData.total}</span>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{
                    background: `rgb(${accentRgb} / 0.15)`,
                    color: `rgb(${accentRgb})`,
                  }}
                >
                  ↑ {currentData.change}
                </span>
                <span className="text-xs text-zinc-500">vs previous period</span>
              </div>
            </div>

            {/* Interactive Dynamic Sparkline Bars */}
            <div className="relative mt-8 pt-8">
              {hoveredBar !== null && (
                <div
                  className="pointer-events-none absolute -top-2 flex -translate-x-1/2 flex-col items-center rounded-xl border border-white/15 bg-zinc-950 px-3 py-1.5 shadow-2xl transition-all"
                  style={{ left: `${((hoveredBar + 0.5) / currentData.bars.length) * 100}%` }}
                >
                  <span className="text-[10px] font-bold text-zinc-400">{currentData.labels[hoveredBar]}</span>
                  <span className="font-mono text-xs font-bold text-white">
                    ${Math.round(currentData.bars[hoveredBar] * 48.5).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex h-44 items-end gap-2 sm:h-52">
                {currentData.bars.map((h, i) => {
                  const isHovered = hoveredBar === i
                  return (
                    <div
                      key={`${timeframe}-${i}`}
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="group/bar relative flex-1 cursor-pointer"
                      style={{ height: '100%' }}
                    >
                      <div
                        className="absolute bottom-0 inset-x-0 rounded-t-lg transition-all duration-500 ease-out"
                        style={{
                          height: `${h}%`,
                          background: isHovered
                            ? '#ffffff'
                            : `linear-gradient(to top, rgb(${accentRgb} / 0.15), rgb(${accentRgb} / 0.85))`,
                          boxShadow: isHovered ? `0 0 20px rgb(${accentRgb})` : 'none',
                        }}
                      />
                    </div>
                  )
                })}
              </div>

              {/* X-Axis labels */}
              <div className="mt-3 flex justify-between px-1 text-[10px] font-mono text-zinc-500">
                <span>{currentData.labels[0]}</span>
                <span>{currentData.labels[Math.floor(currentData.labels.length / 2)]}</span>
                <span>{currentData.labels[currentData.labels.length - 1]}</span>
              </div>
            </div>
          </article>

          {/* ============================================================== */}
          {/* TILE 2: (2x1) COLLABORATIVE TEAM PRESENCE & FIGMA-SYNC */}
          {/* ============================================================== */}
          <article
            onMouseMove={handleTileMove}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl md:col-span-2 sm:p-7"
            style={{ '--x': '50%', '--y': '50%' }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(350px circle at var(--x) var(--y), rgb(${accentRgb} / 0.15), transparent 60%)`,
              }}
            />

            <div>
              <div className="flex items-center justify-between">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm"
                  style={{ color: `rgb(${accentRgb})` }}
                >
                  👥
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  3 Live Now
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Live Multi-User Sync</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Real-time CRDT presence. Click any teammate to inspect their active buffer.
              </p>
            </div>

            {/* Interactive Avatar Strip */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {TEAM_MEMBERS.map((m) => {
                    const isSelected = selectedMember.id === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMember(m)}
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'z-20 scale-110 border-white text-white shadow-lg'
                            : 'border-zinc-900 bg-zinc-800 text-zinc-300 hover:scale-105'
                        }`}
                        style={{
                          background: isSelected ? `rgb(${accentRgb})` : undefined,
                        }}
                      >
                        {m.avatar}
                        {m.online && (
                          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-zinc-900 bg-emerald-400" />
                        )}
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={handlePingTeammate}
                  className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  {pingSent ? '⚡ Pinged!' : 'Send Ping'}
                </button>
              </div>

              {/* Selected member inspector */}
              <div className="mt-3 border-t border-white/5 pt-2.5">
                <p className="text-xs font-bold text-white">{selectedMember.name} <span className="font-normal text-zinc-400">· {selectedMember.role}</span></p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-400">{selectedMember.status}</p>
              </div>
            </div>
          </article>

          {/* ============================================================== */}
          {/* TILE 3: (2x1) TYPED SDK & INTERACTIVE RUNTIME TERMINAL */}
          {/* ============================================================== */}
          <article
            onMouseMove={handleTileMove}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl md:col-span-2 sm:p-7"
            style={{ '--x': '50%', '--y': '50%' }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(350px circle at var(--x) var(--y), rgb(${accentRgb} / 0.15), transparent 60%)`,
              }}
            />

            <div>
              <div className="flex items-center justify-between">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm"
                  style={{ color: `rgb(${accentRgb})` }}
                >
                  ⚡
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  {codeCopied ? '✓ Copied' : 'Copy SDK'}
                </button>
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">Universal Typed SDK</h3>
              <p className="mt-1 text-xs text-zinc-400">
                End-to-end typed schema inference with Cloudflare Edge caching.
              </p>
            </div>

            {/* Language tabs & Test Run */}
            <div className="mt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex gap-1">
                  {['TypeScript', 'Python', 'cURL'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold transition-all ${
                        activeLang === lang
                          ? 'bg-white/15 text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={apiTesting}
                  onClick={handleTestApi}
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-all"
                  style={{
                    background: `rgb(${accentRgb})`,
                    color: '#000000',
                  }}
                >
                  {apiTesting ? 'Pinging…' : 'Run Query →'}
                </button>
              </div>

              {/* Terminal Code Display */}
              <div className="relative mt-2.5 overflow-hidden rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-[11px] text-zinc-300">
                {apiSuccess && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
                    <span className="font-bold text-emerald-400">✓ 200 OK · 14ms Edge Latency</span>
                  </div>
                )}
                <pre className="max-h-24 overflow-x-auto leading-relaxed">
                  <code>{CODE_SNIPPETS[activeLang]}</code>
                </pre>
              </div>
            </div>
          </article>

          {/* ============================================================== */}
          {/* TILE 4: (2x1) GLOBAL MESH & FAILOVER SIMULATOR */}
          {/* ============================================================== */}
          <article
            onMouseMove={handleTileMove}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl md:col-span-2 sm:p-7"
            style={{ '--x': '50%', '--y': '50%' }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(350px circle at var(--x) var(--y), rgb(${accentRgb} / 0.15), transparent 60%)`,
              }}
            />

            <div>
              <div className="flex items-center justify-between">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm"
                  style={{ color: `rgb(${accentRgb})` }}
                >
                  🌐
                </span>
                <button
                  type="button"
                  onClick={() => setFailoverActive(!failoverActive)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-all ${
                    failoverActive
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                      : 'border border-white/15 bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {failoverActive ? 'Failover Active' : 'Simulate Failover'}
                </button>
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">99.998% Global Mesh</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Anycast routing with sub-25ms origin propagation.
              </p>
            </div>

            {/* Region Mesh Grid */}
            <div className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-black/40 p-3.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${failoverActive ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  US-East (Primary)
                </span>
                <span className="font-bold">{failoverActive ? 'Rerouting...' : '11ms'}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  EU-Central (Frankfurt)
                </span>
                <span className="font-bold">18ms</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  AF-South (Lagos Edge)
                </span>
                <span className="font-bold">26ms</span>
              </div>
            </div>
          </article>

          {/* ============================================================== */}
          {/* TILE 5: (4x1) AUTONOMOUS EVENT PIPELINES & LASER BEAM */}
          {/* ============================================================== */}
          <article
            onMouseMove={handleTileMove}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl md:col-span-4 sm:p-7"
            style={{ '--x': '50%', '--y': '50%' }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(450px circle at var(--x) var(--y), rgb(${accentRgb} / 0.15), transparent 60%)`,
              }}
            />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm"
                    style={{ color: `rgb(${accentRgb})` }}
                  >
                    ⚡
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    Autonomous Event Pipelines
                  </h3>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Visual execution graph. Click below to fire a live photon event through the mesh.
                </p>
              </div>

              <button
                type="button"
                disabled={pipelineRunning}
                onClick={handleTriggerPipeline}
                className="rounded-full px-4 py-2 text-xs font-bold uppercase transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{
                  background: `rgb(${accentRgb})`,
                  color: '#000000',
                }}
              >
                {pipelineRunning ? 'Executing Pipeline…' : '▶ Fire Test Event'}
              </button>
            </div>

            {/* Interactive Connected Pipeline Visual */}
            <div className="relative mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
                {[
                  { step: 0, label: 'Stripe Webhook', icon: '💳', desc: 'payload received' },
                  { step: 1, label: 'AI Validation', icon: '🤖', desc: 'fraud score 0.02' },
                  { step: 2, label: 'Cloudflare D1', icon: '🗄️', desc: 'state persisted' },
                  { step: 3, label: 'Discord / SMS', icon: '📣', desc: 'dispatched 14ms' },
                ].map((node, i) => {
                  const isCurrent = activePipelineStep === node.step
                  const isCompleted = activePipelineStep > node.step || activePipelineStep === 4

                  return (
                    <div
                      key={node.label}
                      className={`relative flex flex-col justify-between rounded-xl border p-3 transition-all duration-300 ${
                        isCurrent
                          ? 'scale-105 border-white bg-zinc-800 shadow-xl'
                          : isCompleted
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : 'border-white/10 bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{node.icon}</span>
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                            isCompleted ? 'bg-emerald-400 text-black' : 'bg-white/10 text-zinc-400'
                          }`}
                        >
                          {isCompleted ? '✓' : i + 1}
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-bold text-white">{node.label}</p>
                        <p className="font-mono text-[10px] text-zinc-400">{node.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Connecting Laser Wire Indicator */}
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-zinc-400">
                <span>Pipeline Engine: Cloudflare Workers</span>
                <span style={{ color: `rgb(${accentRgb})` }}>
                  {pipelineRunning
                    ? `Photon at Node [${activePipelineStep + 1}/4]`
                    : activePipelineStep === 4
                      ? '⚡ Pipeline Finished: 24ms Total'
                      : 'Status: Idle & Armed'}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
