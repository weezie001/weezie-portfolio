"use client";
import { useState, useRef } from 'react'

/**
 * MinimalFilterBar — Weezie UI (Inspired by Minimal Gallery)
 * Clean horizontal scrolling filter tag pills with counts, active selection,
 * and clear-all reset button.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
const DEFAULT_TAGS = [
  { id: 'all', label: 'All Sites', count: 184 },
  { id: 'saas', label: 'SaaS', count: 68 },
  { id: 'agency', label: 'Agency', count: 42 },
  { id: 'ai', label: 'AI & Machine Learning', count: 35 },
  { id: 'portfolio', label: 'Personal Portfolio', count: 29 },
  { id: 'ecommerce', label: 'E-Commerce', count: 24 },
  { id: 'fintech', label: 'Fintech', count: 19 },
  { id: 'typography', label: 'Editorial / Type', count: 16 },
  { id: '3d', label: '3D & WebGL', count: 12 },
]

export default function MinimalFilterBar({
  tags = DEFAULT_TAGS,
  initialActive = 'all',
  onChange = () => {},
  className = "",
}) {
  const [activeTag, setActiveTag] = useState(initialActive)
  const scrollRef = useRef(null)

  function handleSelect(id) {
    setActiveTag(id)
    onChange(id)
  }

  function handleClear() {
    setActiveTag('all')
    onChange('all')
  }

  return (
    <div className={`[font-family:Arial,Helvetica,sans-serif] flex items-center gap-2 overflow-hidden py-2 ${className}`}>
      {/* Scrollable Pills Container */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1"
      >
        {tags.map((tag) => {
          const isActive = activeTag === tag.id
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleSelect(tag.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                isActive
                  ? 'border-[#d2dcc3] bg-[#252a20] text-white shadow-md'
                  : 'border-[#e0e5d6] bg-[#e9eee0] text-[#88927a] hover:border-[#d8dfca] hover:text-[#272c22]'
              }`}
            >
              <span>{tag.label}</span>
              <span
                className={`font-mono text-[10px] ${
                  isActive ? 'text-[#83916d] font-bold' : 'text-[#929d83]'
                }`}
              >
                {tag.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Clear Button (appears when a filter is active) */}
      {activeTag !== 'all' && (
        <button
          type="button"
          onClick={handleClear}
          className="shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20"
        >
          Reset Filter ✕
        </button>
      )}
    </div>
  )
}
