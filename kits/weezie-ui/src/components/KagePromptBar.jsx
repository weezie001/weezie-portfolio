"use client";
import { useState } from 'react'

/**
 * KagePromptBar — Weezie UI (Inspired by Kage Design)
 * Floating bottom AI prompt pill bar with model selector, 1-click prompt export
 * for Claude / Cursor, token counter badge, and responsive quick tags.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function KagePromptBar({
  defaultPrompt = "Recreate this component in pure React + Tailwind CSS. Use semantic HTML, responsive flex/grid, zero external icon or animation packages, accessible keyboard shortcuts, and dark glassmorphic styling.",
  models = [
    { id: 'claude', name: 'Claude', badge: 'Recommended' },
    { id: 'cursor', name: 'Cursor Agent', badge: 'IDE' },
    { id: 'chatgpt', name: 'ChatGPT', badge: 'Fast' },
    { id: 'codex', name: 'Codex', badge: 'Reasoning' },
  ],
  tags = ['#React', '#TailwindCSS', '#ZeroDeps', '#CopyPaste'],
  className = "",
}) {
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [isCopied, setIsCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [promptText, setPromptText] = useState(defaultPrompt)
  const [showModelPicker, setShowModelPicker] = useState(false)

  const activeModelObj = models.find((m) => m.id === selectedModel) || models[0]
  const estimatedTokens = Math.round(promptText.length / 4)

  async function handleCopy() {
    const formatted = `[Target Model: ${activeModelObj.name}]\n\n${promptText}`
    try {
      await navigator.clipboard.writeText(formatted)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2200)
    } catch {
      // fallback
    }
  }

  return (
    <div className={`w-full max-w-2xl mx-auto flex flex-col items-center gap-3 ${className}`}>
      {/* Expanded Prompt Editor Card */}
      {isExpanded && (
        <div className="w-full rounded-2xl border border-white/15 bg-zinc-900/90 p-4 shadow-2xl backdrop-blur-xl transition-all">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-semibold text-zinc-300">Prompt Instructions</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-zinc-500">~{estimatedTokens} tokens</span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={3}
            className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-zinc-200 placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
          />
        </div>
      )}

      {/* Main Floating Pill Bar */}
      <div className="relative flex w-full flex-wrap items-center justify-between gap-3 rounded-full border border-white/15 bg-zinc-950/80 p-2 shadow-xl backdrop-blur-2xl transition-all hover:border-white/25 sm:p-2.5">
        {/* Left: Model Trigger & Tags */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModelPicker((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              <span>{activeModelObj.name}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-zinc-400">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Model dropdown */}
            {showModelPicker && (
              <div className="absolute bottom-full left-0 mb-2 w-52 rounded-2xl border border-white/15 bg-zinc-900/95 p-1.5 shadow-2xl backdrop-blur-xl">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Select Target Model</div>
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(m.id)
                      setShowModelPicker(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-colors ${
                      selectedModel === m.id
                        ? 'bg-blue-600/20 text-blue-300 font-semibold'
                        : 'text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-zinc-400">{m.badge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tags (hidden on tiny screens) */}
          <div className="hidden items-center gap-1.5 md:flex">
            {tags.slice(0, 2).map((t) => (
              <span key={t} className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
            title="Inspect & edit full prompt"
          >
            <span>{isExpanded ? 'Collapse' : 'Edit Prompt'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all active:scale-95 ${
              isCopied
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:brightness-110'
            }`}
          >
            {isCopied ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Copied for {activeModelObj.name}!</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                <span>Copy for AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
