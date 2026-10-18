"use client";
import { useState, useEffect, useRef } from 'react'

/**
 * KageCommandPalette — Weezie UI (Inspired by Kage Design)
 * Keyboard-driven ⌘K command menu with categorized sections, real-time filtering,
 * arrow-key navigation, shortcut pills, and smooth dark glassmorphism.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function KageCommandPalette({
  isOpen: controlledIsOpen,
  onClose,
  onSelect = () => {},
  className = "",
}) {
  const [internalOpen, setInternalOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalOpen

  const COMMAND_SECTIONS = [
    {
      category: 'Actions & Tools',
      items: [
        { id: 'new-file', label: 'Create New Component', shortcut: '⌘N', icon: '⚡', category: 'Actions' },
        { id: 'copy-prompt', label: 'Copy AI System Prompt', shortcut: '⌘⇧P', icon: '✨', category: 'Actions' },
        { id: 'export-figma', label: 'Export Tokens to Figma', shortcut: '⌥F', icon: '🎨', category: 'Actions' },
      ],
    },
    {
      category: 'Navigation',
      items: [
        { id: 'nav-components', label: 'Browse Component Library', shortcut: 'G C', icon: '📦', category: 'Navigation' },
        { id: 'nav-docs', label: 'API Reference & Guides', shortcut: 'G D', icon: '📖', category: 'Navigation' },
        { id: 'nav-store', label: 'Component Bundle & Store', shortcut: 'G S', icon: '🛍️', category: 'Navigation' },
      ],
    },
    {
      category: 'Preferences & Theme',
      items: [
        { id: 'theme-dark', label: 'Switch to Deep Midnight', shortcut: '⌘1', icon: '🌙', category: 'Preferences' },
        { id: 'theme-light', label: 'Switch to Studio Light', shortcut: '⌘2', icon: '☀️', category: 'Preferences' },
        { id: 'toggle-ghosts', label: 'Toggle Live Ghost Cursors', shortcut: '⌘G', icon: '👥', category: 'Preferences' },
      ],
    },
  ]

  // Flattened list for search and arrow navigation
  const allItems = COMMAND_SECTIONS.flatMap((s) => s.items)
  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.shortcut.toLowerCase().includes(query.toLowerCase())
      )
    : allItems

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isControlled && onClose) {
          // toggle if controlled
        } else {
          setInternalOpen((prev) => !prev)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isControlled, onClose])

  function handleKeyNav(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleClose()
    }
  }

  function handleSelectItem(item) {
    onSelect(item)
    if (!isControlled) {
      // keep open or close
    }
  }

  function handleClose() {
    if (isControlled && onClose) {
      onClose()
    } else {
      setInternalOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <button
          type="button"
          onClick={() => (isControlled && onClose ? onClose() : setInternalOpen(true))}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:border-white/20 hover:text-white"
        >
          <span>Open Command Palette</span>
          <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400">⌘K</kbd>
        </button>
      </div>
    )
  }

  return (
    <div className={`relative w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl backdrop-blur-2xl ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center border-b border-white/10 px-4 py-3.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3 h-5 w-5 text-zinc-400">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyNav}
          placeholder="Type a command or search actions..."
          className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Clear
          </button>
        )}
        <kbd className="ml-2 hidden rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:inline-block">
          ESC
        </kbd>
      </div>

      {/* Results List */}
      <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
        {filteredItems.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500">
            No matching commands found for <span className="text-zinc-300">"{query}"</span>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedIndex(idx)
                    handleSelectItem(item)
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-colors ${
                    isSelected
                      ? 'bg-blue-600/15 text-white border border-blue-500/30'
                      : 'text-zinc-400 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-sm">
                      {item.icon}
                    </span>
                    <span className={`font-medium ${isSelected ? 'text-blue-300' : 'text-zinc-200'}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600 group-hover:text-zinc-500">
                      {item.category}
                    </span>
                    <kbd className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                      {item.shortcut}
                    </kbd>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer Navigation Hints */}
      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-4 py-2 text-[11px] text-zinc-500">
        <div className="flex items-center gap-3">
          <span><kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px] text-zinc-300">↑↓</kbd> Navigate</span>
          <span><kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px] text-zinc-300">↵</kbd> Execute</span>
          <span><kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px] text-zinc-300">ESC</kbd> Close</span>
        </div>
        <span className="font-mono text-[10px] text-zinc-600">Kage Command System</span>
      </div>
    </div>
  )
}
