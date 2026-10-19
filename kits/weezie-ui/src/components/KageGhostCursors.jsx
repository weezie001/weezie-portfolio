"use client";
import { useState, useEffect } from 'react'

/**
 * KageGhostCursors — Weezie UI (Inspired by Kage Design)
 * Multi-user simulated presence avatars gliding smoothly across the UI,
 * targeting interactive elements with glowing cursor tails and presence badges.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function KageGhostCursors({
  activeUsers = [
    { id: 'u1', name: 'Elena (Lead UX)', color: 'bg-violet-500', border: 'border-violet-400', text: 'text-violet-300' },
    { id: 'u2', name: 'Marcus (Frontend)', color: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-300' },
    { id: 'u3', name: 'Demo Assistant', color: 'bg-[#7898bf]', border: 'border-emerald-400', text: 'text-emerald-300' },
  ],
  title = "Live Collaborative Canvas",
  subtitle = "Simulated real-time multiplayer presence with cursor coordinates.",
  className = "",
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [cursors, setCursors] = useState([
    { id: 'u1', x: 25, y: 35, clicking: false },
    { id: 'u2', x: 68, y: 55, clicking: false },
    { id: 'u3', x: 45, y: 78, clicking: false },
  ])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCursors((prev) =>
        prev.map((c) => {
          // Semi-random targeted walk within bounds (10% to 85%)
          const dx = (Math.random() - 0.5) * 28
          const dy = (Math.random() - 0.5) * 28
          const newX = Math.min(85, Math.max(12, c.x + dx))
          const newY = Math.min(85, Math.max(15, c.y + dy))
          const clicking = Math.random() > 0.75

          return { ...c, x: newX, y: newY, clicking }
        })
      )
    }, 1800)

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className={`[font-family:Arial,Helvetica,sans-serif] relative w-full overflow-hidden rounded-[18px] border border-white/10 bg-[#171a20] p-6 sm:p-8 ${className}`}>
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 motion-safe:animate-ping" />
            <h3 className="text-base font-medium text-white">{title}</h3>
          </div>
          <p className="mt-0.5 text-xs text-zinc-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Active online user avatars */}
          <div className="flex -space-x-2">
            {activeUsers.map((u) => (
              <div
                key={u.id}
                title={u.name}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-950 ${u.color} text-[10px] font-medium text-white shadow-sm`}
              >
                {u.name.charAt(0)}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
          >
            {isPlaying ? '⏸ Pause Simulation' : '▶ Resume Motion'}
          </button>
        </div>
      </div>

      {/* Interactive Mock Canvas with Simulated Cursors */}
      <div className="relative mt-6 h-72 w-full rounded-2xl border border-dashed border-white/15 bg-gradient-to-br from-zinc-900/50 to-zinc-950/80 p-6">
        {/* Mock UI Canvas Elements that cursors interact with */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/15">
            <div className="h-2 w-16 rounded bg-white/20" />
            <div className="mt-2 h-2 w-28 rounded bg-white/10" />
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/15">
            <div className="h-2 w-20 rounded bg-blue-500/30" />
            <div className="mt-2 h-2 w-24 rounded bg-white/10" />
          </div>
          <div className="hidden sm:block rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/15">
            <div className="h-2 w-14 rounded bg-[#7898bf]/30" />
            <div className="mt-2 h-2 w-20 rounded bg-white/10" />
          </div>
        </div>

        {/* Center Mock Button */}
        <div className="mt-8 flex justify-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-medium text-zinc-300">
            Target Action Component
          </div>
        </div>

        {/* Animated Ghost Cursors */}
        {cursors.map((cursor) => {
          const user = activeUsers.find((u) => u.id === cursor.id) || activeUsers[0]

          return (
            <div
              key={cursor.id}
              style={{
                left: `${cursor.x}%`,
                top: `${cursor.y}%`,
                transition: 'all 1.6s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="pointer-events-none absolute -translate-x-1 -translate-y-1 select-none"
            >
              {/* Click Ripple Indicator */}
              {cursor.clicking && (
                <span className={`absolute -inset-2 rounded-full ${user.color} opacity-40 motion-safe:animate-ping`} />
              )}

              {/* Cursor SVG Arrow */}
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 drop-shadow-md transition-transform duration-300 ${cursor.clicking ? 'scale-90' : ''}`}
                fill="currentColor"
              >
                <path
                  d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35z"
                  className={user.text}
                />
              </svg>

              {/* User Label Badge */}
              <div
                className={`mt-1 flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-[0_12px_40px_-24px_#10182080] backdrop-blur-md ${user.border} ${user.color}`}
              >
                <span>{user.name}</span>
                {cursor.clicking && <span className="text-[9px] opacity-75">· clicked</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>Sub-second cursor synchronization simulation</span>
        <span className="font-mono text-[11px] text-zinc-400">{activeUsers.length} collaborators online</span>
      </div>
    </div>
  )
}
