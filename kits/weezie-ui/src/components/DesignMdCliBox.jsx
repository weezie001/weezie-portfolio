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
    <div className={`mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] overflow-hidden rounded-[18px] border border-[#e0e5d6] bg-[#f8f8f3] p-6 text-[#272c22] shadow-[0_12px_40px_-24px_#35402540] sm:p-8 ${className}`}>
      {/* Top Bar with Package Managers and Flags */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e0e5d6] pb-5">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            ● Developer CLI
          </span>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-[#272c22]">
            Install Starter Package
          </h3>
        </div>

        {/* Manager Tabs */}
        <div className="flex rounded-full border border-[#e0e5d6] bg-[#fbfcf7] p-1">
          {['pnpm', 'npm', 'yarn', 'bun'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setManager(m)}
              className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all ${
                manager === m
                  ? 'bg-[#252a20] text-white shadow-md'
                  : 'text-[#88927a] hover:text-[#272c22]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Flag modifiers */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium text-[#929d83]">Flags:</span>
        {['--all', '--minimal', '--motion', '--typescript'].map((flag) => (
          <button
            key={flag}
            type="button"
            onClick={() => setSelectedFlag(flag)}
            className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-all ${
              selectedFlag === flag
                ? 'border-blue-500/50 bg-[#284cd8]/15 text-blue-300 font-bold'
                : 'border-[#e0e5d6] bg-[#e9eee0] text-[#88927a] hover:border-[#d8dfca] hover:text-[#272c22]'
            }`}
          >
            {flag}
          </button>
        ))}
      </div>

      {/* Realistic Terminal Window */}
      <div className="mt-5 overflow-hidden rounded-xl border border-[#e0e5d6] bg-black shadow-inner">
        {/* Window Chrome */}
        <div className="flex items-center justify-between border-b border-[#e0e5d6] bg-[#fbfcf7]/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-[#88927a]">bash — 80x24</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunSimulation}
              className="rounded-md border border-[#e0e5d6] bg-[#e9eee0] px-2.5 py-1 font-mono text-[10px] font-bold text-[#727b65] transition-all hover:bg-white/15 hover:text-[#272c22] active:scale-95 disabled:opacity-40"
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
            <div className="mt-4 space-y-1.5 border-t border-[#e0e5d6] pt-3 font-mono text-xs text-[#88927a]">
              {simulatedLogs.map((log, i) => (
                <p key={i} className={i === simulatedLogs.length - 1 ? 'font-bold text-emerald-300' : ''}>
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-[#929d83]">
        Run inside your React 18+ or Next.js project with Tailwind CSS configured.
      </p>
    </div>
  )
}
