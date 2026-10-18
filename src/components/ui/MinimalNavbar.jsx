import { useState } from 'react'

/**
 * MinimalNavbar — Weezie UI (Inspired by Minimal Gallery)
 * Floating split minimalist navbar with ⌘K search trigger, live bookmarks badge,
 * and responsive mobile drawer.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function MinimalNavbar({
  brandName = "Minimal Archive",
  bookmarksCount = 3,
  onOpenSearch = () => {},
  onOpenBookmarks = () => {},
  onSubmitClick = () => {},
  className = "",
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className={`sticky top-4 z-40 mx-auto w-full max-w-5xl px-4 ${className}`}>
      <nav className="flex h-14 items-center justify-between rounded-full border border-white/10 bg-zinc-950/85 px-4 shadow-xl backdrop-blur-xl sm:px-6">
        {/* Left Navigation */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2 text-sm font-bold tracking-tight text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-zinc-950 font-mono text-xs font-black">
              M
            </span>
            <span className="hidden sm:inline">{brandName}</span>
          </a>

          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-zinc-400">
            <a href="#websites" className="transition-colors hover:text-white">Websites</a>
            <a href="#templates" className="transition-colors hover:text-white">Templates</a>
            <a href="#tools" className="transition-colors hover:text-white">Tools</a>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ⌘K Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex h-8 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-xs text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300 sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* Bookmarks Counter Button */}
          <button
            type="button"
            onClick={onOpenBookmarks}
            className="flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className="hidden sm:inline">Bookmarks</span>
            {bookmarksCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 font-mono text-[10px] font-bold text-white">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Submit Button */}
          <button
            type="button"
            onClick={onSubmitClick}
            className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-950 transition-transform hover:bg-zinc-200 active:scale-95"
          >
            Submit
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 md:hidden"
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mt-2 rounded-2xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3 text-sm font-semibold text-zinc-300">
            <a href="#websites" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Websites</a>
            <a href="#templates" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Templates</a>
            <a href="#tools" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Tools</a>
          </div>
        </div>
      )}
    </header>
  )
}
