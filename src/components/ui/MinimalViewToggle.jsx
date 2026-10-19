"use client";
import { useState } from 'react'

/**
 * MinimalViewToggle — Weezie UI (Inspired by Minimal Gallery)
 * Smooth segmented layout switcher (2-col, 3-col, compact list)
 * with animated active state.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function MinimalViewToggle({
  initialView = '3col',
  onViewChange = () => {},
  className = "",
}) {
  const [view, setView] = useState(initialView)

  function handleSwitch(newView) {
    setView(newView)
    onViewChange(newView)
  }

  return (
    <div className={`[font-family:Arial,Helvetica,sans-serif] inline-flex items-center gap-1 rounded-xl border border-[#e0e5d6] bg-[#f8f8f3] p-1 backdrop-blur-md ${className}`}>
      {/* 2-Column Grid Toggle */}
      <button
        type="button"
        onClick={() => handleSwitch('2col')}
        aria-label="2 columns view"
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
          view === '2col' ? 'bg-[#252a20] text-white shadow-sm' : 'text-[#929d83] hover:text-[#272c22]'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
          <rect x="3" y="3" width="7" height="18" rx="1.5" />
          <rect x="14" y="3" width="7" height="18" rx="1.5" />
        </svg>
      </button>

      {/* 3-Column Grid Toggle */}
      <button
        type="button"
        onClick={() => handleSwitch('3col')}
        aria-label="3 columns view"
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
          view === '3col' ? 'bg-[#252a20] text-white shadow-sm' : 'text-[#929d83] hover:text-[#272c22]'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
          <rect x="2" y="3" width="5" height="18" rx="1" />
          <rect x="9.5" y="3" width="5" height="18" rx="1" />
          <rect x="17" y="3" width="5" height="18" rx="1" />
        </svg>
      </button>

      {/* List / Dense View Toggle */}
      <button
        type="button"
        onClick={() => handleSwitch('list')}
        aria-label="List view"
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
          view === 'list' ? 'bg-[#252a20] text-white shadow-sm' : 'text-[#929d83] hover:text-[#272c22]'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
          <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
