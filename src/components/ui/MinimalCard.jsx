import { useState } from 'react'

/**
 * MinimalCard — Weezie UI (Inspired by Minimal Gallery)
 * Minimalist curation card with hover scale, subtle metadata badge,
 * and an interactive bookmark icon button with animated counter.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function MinimalCard({
  title = "Studio Linear",
  category = "Design Agency",
  year = "2026",
  url = "https://linear.app",
  imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
  initialBookmarks = 142,
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
    <div className={`group relative flex flex-col rounded-2xl border border-white/10 bg-zinc-950 p-3 transition-all duration-300 hover:border-white/25 hover:shadow-2xl ${className}`}>
      {/* Image frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-900">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Hover overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Top Floating Badge & Bookmark Button */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 backdrop-blur-md">
            {category}
          </span>

          <button
            type="button"
            onClick={toggleBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this site"}
            className={`flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold backdrop-blur-md transition-all active:scale-95 ${
              isBookmarked
                ? "border-amber-400/40 bg-amber-400/20 text-amber-300"
                : "border-white/15 bg-black/60 text-zinc-300 hover:border-white/30 hover:text-white"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 transition-transform duration-200"
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
      </div>

      {/* Metadata Footer */}
      <div className="mt-3 flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-white transition-colors group-hover:text-blue-400">
            {title}
          </h3>
          <p className="text-[11px] text-zinc-500">{year} · {category}</p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
          aria-label={`Visit ${title}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </div>
  )
}
