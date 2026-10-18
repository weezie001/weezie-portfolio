"use client";
import { useState } from 'react'

/**
 * MinimalCard — Weezie UI (Inspired by Minimal Gallery)
 * Minimalist curation card with hover scale, photorealistic editorial imagery,
 * metadata chip badges, and an interactive bookmark with animated counter.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function MinimalCard({
  title = "Studio Arkitekter",
  category = "Spatial & Architecture",
  year = "2026",
  url = "https://example.com",
  imageUrl = "/images/minimal-card-mockup.png",
  initialBookmarks = 124,
  onBookmarkChange = () => {},
  className = "",
}) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarks)

  function toggleBookmark(e) {
    e.preventDefault()
    e.stopPropagation()
    const nextState = !isBookmarked
    setIsBookmarked(nextState)
    const newCount = nextState ? bookmarkCount + 1 : bookmarkCount - 1
    setBookmarkCount(newCount)
    onBookmarkChange(nextState, newCount)
  }

  return (
    <div
      className={`group relative flex flex-col rounded-3xl border border-white/10 bg-zinc-950 p-3.5 transition-all duration-500 hover:border-white/25 hover:shadow-2xl hover:shadow-blue-500/5 ${className}`}
    >
      {/* Editorial Image Frame */}
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-zinc-900">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Gradient Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

        {/* Top Floating Badge & Interactive Bookmark */}
        <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-200 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {category}
          </span>

          <button
            type="button"
            onClick={toggleBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this site"}
            className={`flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold backdrop-blur-md transition-all active:scale-90 ${
              isBookmarked
                ? "border-amber-400/50 bg-amber-400/25 text-amber-300 shadow-lg shadow-amber-400/20"
                : "border-white/20 bg-black/60 text-zinc-300 hover:border-white/40 hover:text-white"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-3.5 w-3.5 transition-transform duration-300 ${isBookmarked ? 'scale-110' : ''}`}
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className="font-mono text-[11px] tabular-nums">{bookmarkCount}</span>
          </button>
        </div>

        {/* Bottom hover bar reveal */}
        <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-lg bg-black/70 px-2 py-1 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
            Built with React &amp; Tailwind
          </span>
          <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase text-black">
            Explore ↗
          </span>
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="mt-4 flex items-center justify-between px-1.5 pb-1">
        <div>
          <h3 className="text-base font-bold tracking-tight text-white transition-colors group-hover:text-blue-400">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-400">
            {year} · Featured in Scandinavian Architecture Index
          </p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:scale-110 hover:border-white/30 hover:bg-white/15 hover:text-white"
          aria-label={`Visit ${title}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </div>
  )
}
