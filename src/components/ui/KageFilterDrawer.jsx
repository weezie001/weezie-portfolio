import { useState } from 'react'

/**
 * KageFilterDrawer — Weezie UI (Inspired by Kage Design)
 * Sliding glassmorphism filter drawer with collapsible facet sections,
 * multi-select tags, live filter counts, and instant reset controls.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function KageFilterDrawer({
  isOpen: initialOpen = true,
  onApply = () => {},
  onReset = () => {},
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [selectedTags, setSelectedTags] = useState(['React', 'Zero Bloat', 'Free & Pro'])
  const [collapsedSections, setCollapsedSections] = useState({})

  const FACETS = [
    {
      id: 'framework',
      title: 'Target Framework',
      items: [
        { id: 'React', label: 'React / Next.js', count: 30 },
        { id: 'Vue', label: 'Vue 3 / Nuxt', count: 18 },
        { id: 'Svelte', label: 'Svelte 5 / Kit', count: 12 },
        { id: 'HTML', label: 'Static HTML / Tailwind', count: 30 },
      ],
    },
    {
      id: 'style',
      title: 'Design Aesthetics',
      items: [
        { id: 'Zero Bloat', label: 'Zero Bloat / Clean CSS', count: 30 },
        { id: 'Dark Mode', label: 'Dark Midnight & Glass', count: 28 },
        { id: 'Minimal', label: 'Minimal Monochrome', count: 16 },
        { id: 'Bento', label: 'Asymmetric Bento', count: 8 },
      ],
    },
    {
      id: 'license',
      title: 'Access Tier',
      items: [
        { id: 'Free & Pro', label: 'Commercial Free Tier', count: 10 },
        { id: 'Lifetime Pro', label: 'Lifetime Commercial Bundle', count: 30 },
      ],
    },
  ]

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function toggleSection(sectionId) {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  function handleReset() {
    setSelectedTags([])
    onReset()
  }

  function handleApply() {
    onApply(selectedTags)
  }

  return (
    <div className={`w-full max-w-md mx-auto rounded-3xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-2xl ${className}`}>
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Filter Components</h3>
            <p className="text-[11px] text-zinc-400">Refine by framework & aesthetic</p>
          </div>
        </div>

        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Reset all ({selectedTags.length})
          </button>
        )}
      </div>

      {/* Facet Sections */}
      <div className="mt-4 space-y-4">
        {FACETS.map((facet) => {
          const isCollapsed = Boolean(collapsedSections[facet.id])

          return (
            <div key={facet.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
              <button
                type="button"
                onClick={() => toggleSection(facet.id)}
                className="flex w-full items-center justify-between text-xs font-bold text-zinc-200 hover:text-white"
              >
                <span>{facet.title}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {!isCollapsed && (
                <div className="mt-3 space-y-2">
                  {facet.items.map((item) => {
                    const isChecked = selectedTags.includes(item.id)

                    return (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTag(item.id)}
                            className="h-4 w-4 rounded border-white/20 bg-zinc-900 text-blue-600 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className={`text-xs ${isChecked ? 'font-semibold text-white' : 'text-zinc-400'}`}>
                            {item.label}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500">{item.count}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex items-center gap-3 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={handleReset}
          className="w-1/3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="w-2/3 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors active:scale-95"
        >
          Apply Filters ({selectedTags.length})
        </button>
      </div>
    </div>
  )
}
