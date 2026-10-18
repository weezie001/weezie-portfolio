"use client";
import { useState } from 'react'

/**
 * DesignMdCliBox — Weezie UI (Inspired by DESIGN.md)
 * Luxury interactive developer CLI terminal widget with multi-package manager support,
 * realistic dependency resolver output, interactive flags, and 1-click clipboard copy.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function DesignMdCliBox({
  packageName = '@weezie/ui',
  version = '4.2.0',
  className = '',
}) {
  const [manager, setManager] = useState('pnpm')
  const [copied, setCopied] = useState(false)
  const [selectedFlag, setSelectedFlag] = useState('--all')
  const [isRunning, setIsRunning] = useState(false)
  const [simulatedLogs, setSimulatedLogs] = useState([])

  const COMMANDS = {
    pnpm: `pnpm add ${packageName} ${selectedFlag}`,
    npm: `npm install ${packageName} ${selectedFlag}`,
    yarn: `yarn add ${packageName} ${selectedFlag}`,
    bun: `bun add ${packageName} ${selectedFlag}`,
  }

  const activeCommand = COMMANDS[manager]

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(activeCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  function handleRunSimulation() {
    if (isRunning) return
    setIsRunning(true)
    setSimulatedLogs([])

    const logs = [
      `Fetching manifest for ${packageName}@${version}…`,
      `✓ Resolved 35 production React blocks (0 peer conflicts)`,
      `✓ Verified Tailwind CSS v4 design tokens`,
      `✨ Added 35 packages in 164ms. Ready to import.`,
    ]

    logs.forEach((log, index) => {
      setTimeout(() => {
        setSimulatedLogs((prev) => [...prev, log])
        if (index === logs.length - 1) {
          setIsRunning(false)
        }
      }, (index + 1) * 350)
    })
  }

  return (
    <div className={`mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl sm:p-8 ${className}`}>
      {/* Top Bar with Package Managers and Flags */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            ● Developer CLI
          </span>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-white">
            Install Starter Package
          </h3>
        </div>

        {/* Manager Tabs */}
        <div className="flex rounded-full border border-white/10 bg-zinc-900 p-1">
          {['pnpm', 'npm', 'yarn', 'bun'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setManager(m)}
              className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all ${
                manager === m
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Flag modifiers */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium text-zinc-500">Flags:</span>
        {['--all', '--minimal', '--motion', '--typescript'].map((flag) => (
          <button
            key={flag}
            type="button"
            onClick={() => setSelectedFlag(flag)}
            className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-all ${
              selectedFlag === flag
                ? 'border-blue-500/50 bg-blue-500/15 text-blue-300 font-bold'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
            }`}
          >
            {flag}
          </button>
        ))}
      </div>

      {/* Realistic Terminal Window */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-inner">
        {/* Window Chrome */}
        <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-zinc-400">bash — 80x24</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunSimulation}
              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold text-zinc-300 transition-all hover:bg-white/15 hover:text-white active:scale-95 disabled:opacity-40"
            >
              {isRunning ? 'Running…' : '▶ Simulate'}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md bg-white px-3 py-1 font-mono text-[10px] font-bold text-black transition-all hover:bg-zinc-200 active:scale-95"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Command line */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3 font-mono text-xs sm:text-sm">
            <span className="font-bold text-emerald-400">$</span>
            <code className="min-w-0 flex-1 overflow-x-auto text-zinc-100">{activeCommand}</code>
          </div>

          {/* Simulated Logs Output */}
          {simulatedLogs.length > 0 && (
            <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3 font-mono text-xs text-zinc-400">
              {simulatedLogs.map((log, i) => (
                <p key={i} className={i === simulatedLogs.length - 1 ? 'font-bold text-emerald-300' : ''}>
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-zinc-500">
        Run inside your React 18+ or Next.js project with Tailwind CSS configured.
      </p>
    </div>
  )
}
