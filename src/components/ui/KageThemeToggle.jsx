"use client";
import { useState } from 'react'

/**
 * KageThemeToggle — Weezie UI (Inspired by Kage Design)
 * High-precision theme mode switcher (Dark / Light / System) with smooth sliding
 * indicator, rotating SVG icons, and tactile micro-interactions.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function KageThemeToggle({
  initialTheme = 'dark',
  onChange = () => {},
  className = "",
}) {
  const [theme, setTheme] = useState(initialTheme)

  const THEMES = [
    {
      id: 'dark',
      label: 'Dark',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
    {
      id: 'light',
      label: 'Light',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
    },
    {
      id: 'system',
      label: 'Auto',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
    },
  ]

  function handleSelect(id) {
    setTheme(id)
    onChange(id)
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Segmented Switcher Pill */}
      <div
        role="radiogroup"
        aria-label="Color theme selection"
        className="inline-flex rounded-full border border-white/10 bg-zinc-950/80 p-1 shadow-inner backdrop-blur-xl"
      >
        {THEMES.map((item) => {
          const isActive = theme === item.id

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => handleSelect(item.id)}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-white text-zinc-950 shadow-md scale-100'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`transition-transform duration-300 ${isActive ? 'rotate-12' : 'rotate-0'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Micro-preview Card Showing Active Theme Appearance */}
      <div className="w-full max-w-sm rounded-2xl border border-white/10 p-4 transition-all duration-500 bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-xs font-semibold text-white capitalize">{theme} Mode Active</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">CSS Theme Token</span>
        </div>
        <div className="mt-3 rounded-xl border border-white/5 bg-black/40 p-3 font-mono text-[11px] text-zinc-400">
          <code>
            {theme === 'dark' && `html { color-scheme: dark; background: #09090b; }`}
            {theme === 'light' && `html { color-scheme: light; background: #fafafa; }`}
            {theme === 'system' && `@media (prefers-color-scheme: dark) { ... }`}
          </code>
        </div>
      </div>
    </div>
  )
}
