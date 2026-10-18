"use client";
import { useState } from 'react'

/**
 * DesignMdReader — Weezie UI (Inspired by DESIGN.md)
 * Interactive design system documentation reader with visual token inspector,
 * interactive motion testing, typography previewer, and 1-click markdown export.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function DesignMdReader({ className = '' }) {
  const [activeTab, setActiveTab] = useState('colors')
  const [viewMode, setViewMode] = useState('visual') // 'visual' | 'raw'
  const [copiedToken, setCopiedToken] = useState('')
  const [search, setSearch] = useState('')

  const COLOR_TOKENS = [
    { name: 'Canvas Dark', hex: '#09090b', role: 'Default body background' },
    { name: 'Surface Low', hex: '#18181b', role: 'Elevated card surface' },
    { name: 'Surface High', hex: '#27272a', role: 'Interactive modal surface' },
    { name: 'Brand Indigo', hex: '#6366f1', role: 'Primary focus & active states' },
    { name: 'Emerald Glow', hex: '#10b981', role: 'Success and operational status' },
    { name: 'Amber Pulse', hex: '#f59e0b', role: 'Warning and attention badges' },
  ]

  const TYPE_SCALE = [
    { token: 'display', size: '48px', weight: '800', sample: 'Unstoppable Momentum' },
    { token: 'heading', size: '24px', weight: '700', sample: 'Structured Architecture' },
    { token: 'body', size: '14px', weight: '400', sample: 'Engineered for high-performing engineering teams.' },
    { token: 'mono', size: '12px', weight: '600', sample: 'const stream = await edge.dispatch()' },
  ]

  async function copyToken(value) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedToken(value)
      setTimeout(() => setCopiedToken(''), 2000)
    } catch {
      setCopiedToken('')
    }
  }

  function downloadMarkdown() {
    const content = `# WEEZIE DESIGN SYSTEM SPEC (DESIGN.md)

## 1. Color Palette
${COLOR_TOKENS.map((c) => `- ${c.name}: ${c.hex} (${c.role})`).join('\n')}

## 2. Typography Scale
${TYPE_SCALE.map((t) => `- ${t.token}: ${t.size} / ${t.weight}`).join('\n')}

## 3. Motion Principles
- Transition: 300ms cubic-bezier(0.16, 1, 0.3, 1)
- Hover lift: translateY(-2px) scale(1.02)
- Haptic focus: 2px ring offset 2px
`
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'DESIGN.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl sm:p-8 ${className}`}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">
            ● Living Design Spec
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Design System Explorer (DESIGN.md)
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Production tokens, typography scales, and motion curves in one inspectable panel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <div className="flex rounded-full border border-white/10 bg-zinc-900 p-1">
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                viewMode === 'visual' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Visual Spec
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                viewMode === 'raw' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          <button
            type="button"
            onClick={downloadMarkdown}
            className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-zinc-200 transition-all hover:bg-white/15 hover:text-white"
          >
            Download .md ↓
          </button>
        </div>
      </div>

      {viewMode === 'raw' ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 p-5 font-mono text-xs leading-relaxed text-zinc-300">
          <pre className="overflow-x-auto whitespace-pre-wrap">
            {`# WEEZIE DESIGN SYSTEM SPEC (DESIGN.md)

## 1. Color Palette
${COLOR_TOKENS.map((c) => `- ${c.name}: ${c.hex} (${c.role})`).join('\n')}

## 2. Typography Scale
${TYPE_SCALE.map((t) => `- ${t.token}: ${t.size} / ${t.weight}`).join('\n')}

## 3. Motion Principles
- Transition: 300ms cubic-bezier(0.16, 1, 0.3, 1)
- Hover lift: translateY(-2px) scale(1.02)
- Haptic focus: 2px ring offset 2px`}
          </pre>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-12">
          {/* Left Navigation Tabs */}
          <div className="flex md:flex-col gap-1.5 md:col-span-3">
            {[
              { id: 'colors', label: 'Color Tokens', icon: '🎨' },
              { id: 'typography', label: 'Typography', icon: 'Aa' },
              { id: 'motion', label: 'Motion Curves', icon: '⚡' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'border border-white/15 bg-white/10 text-white shadow-md'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right Visual Inspector Content */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 md:col-span-9">
            {activeTab === 'colors' && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Click any token to copy its hex value
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {COLOR_TOKENS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => copyToken(c.hex)}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/60 p-3 text-left transition-all hover:border-white/30 hover:bg-zinc-900"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-9 w-9 rounded-lg border border-white/20 shadow-md transition-transform group-hover:scale-105"
                          style={{ background: c.hex }}
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{c.name}</p>
                          <p className="text-[10px] text-zinc-400">{c.role}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400 group-hover:text-white">
                        {copiedToken === c.hex ? '✓ Copied' : c.hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Modular Font Scale &amp; Contrast Spec
                </p>
                <div className="space-y-3">
                  {TYPE_SCALE.map((t) => (
                    <div
                      key={t.token}
                      className="rounded-xl border border-white/10 bg-zinc-900/40 p-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] font-mono text-zinc-400">
                        <span className="uppercase text-blue-400 font-bold">{t.token}</span>
                        <span>Size: {t.size} · Weight: {t.weight}</span>
                      </div>
                      <p
                        className="mt-2 text-white truncate"
                        style={{ fontSize: t.size, fontWeight: t.weight }}
                      >
                        {t.sample}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'motion' && (
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Tactile Spring &amp; Interpolation Presets
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { name: 'Smooth Spring', curve: 'cubic-bezier(0.16, 1, 0.3, 1)', desc: 'Card hover & modal entry' },
                    { name: 'Punchy Snap', curve: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Bookmark, toggle, button active' },
                    { name: 'Laser Beam', curve: 'linear', desc: 'Photon lines & infinite spinners' },
                    { name: 'Subtle Fade', curve: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Backdrop blur & overlay opacity' },
                  ].map((m) => (
                    <div
                      key={m.name}
                      className="group rounded-xl border border-white/10 bg-zinc-900/60 p-4 transition-all hover:border-white/30"
                    >
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <p className="font-mono text-[10px] text-zinc-400 mt-0.5">{m.curve}</p>
                      <p className="text-[11px] text-zinc-300 mt-2">{m.desc}</p>
                      <div className="mt-3 overflow-hidden rounded-full bg-white/10 h-1.5">
                        <div
                          className="h-full w-1/3 rounded-full bg-blue-500 transition-all duration-700 group-hover:w-full"
                          style={{ transitionTimingFunction: m.curve }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
