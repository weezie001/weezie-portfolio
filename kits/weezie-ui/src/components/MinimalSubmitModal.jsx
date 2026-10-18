"use client";
import { useState, useEffect } from 'react'

/**
 * MinimalSubmitModal — Weezie UI (Inspired by Minimal Gallery)
 * Minimalist website submission dialog with live URL preview simulation,
 * category selector, and confirmation state.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function MinimalSubmitModal({
  isOpen = true,
  onClose = () => {},
  onSubmit = () => {},
  categories = ['SaaS', 'Agency', 'Portfolio', 'AI Tool', 'E-Commerce', 'Editorial'],
  className = "",
}) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [submitted, setSubmitted] = useState(false)

  // ESC to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Simulated live metadata extraction from URL
  function handleUrlChange(val) {
    setUrl(val)
    if (!title && val.includes('.')) {
      try {
        const hostname = val.replace(/^https?:\/\//i, '').split('/')[0]
        const cleanName = hostname.split('.')[0]
        if (cleanName) {
          setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1))
        }
      } catch {
        // ignore
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) return
    onSubmit({ url, title, category })
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl sm:p-8 ${className}`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">Submission Received!</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Thanks for submitting <strong className="text-white">{title || url}</strong>. We review new websites daily.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-white px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Curated Showcase
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                Submit a Website
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Found or built an exceptional modern web experience? Send it over for review.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Website URL Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Website URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:bg-white/[0.08]"
                />
              </div>

              {/* Title / Project Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Website Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Linear, Vercel, Stripe..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:bg-white/[0.08]"
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Live Card Preview Box */}
              {url && (
                <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Live Preview
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-[10px] text-zinc-500">
                      Thumbnail
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-white">{title || url}</p>
                      <p className="truncate text-[11px] text-zinc-400">{url}</p>
                      <span className="mt-1 inline-block rounded bg-blue-500/20 px-2 py-0.5 text-[9px] font-semibold text-blue-300">
                        {category}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-white py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.99]"
                >
                  Submit for Review →
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
