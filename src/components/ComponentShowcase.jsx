"use client";
import { useState, useMemo } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ProjectBrief from './ProjectBrief.jsx'
import catalog from '../data/componentCatalog.json'
import { storeProducts } from '../data.js'
import { StoreModal } from './StoreSection.jsx'
import PaymentStatusModal from './PaymentStatusModal.jsx'

const modules = import.meta.glob('./ui/*.jsx', { eager: true })
const sources = import.meta.glob('./ui/*.jsx', { eager: true, query: '?raw', import: 'default' })

const COMPONENTS = catalog.map(item => ({
  ...item,
  component: modules[`./ui/${item.fileName}`]?.default,
  source: sources[`./ui/${item.fileName}`] || '',
  code: `"use client";\nimport ${item.id} from './components/${item.id}'\n\nexport default function Example() {\n  return <${item.id} />\n}\n`,
}))

const CATEGORIES = [...new Set(catalog.map(item => item.category))]
const REFERENCES = [...new Set(catalog.map(item => item.reference))]
const UI_PACK_PRODUCT = storeProducts.find(p => p.slug === 'weezie-ui-components-bundle') || storeProducts[0]

/**
 * ComponentHorizontalCard — Renders a single component with:
 * 1. A 100% fluid, naturally responsive live canvas (NO fake mobile frame, NO rigid height cutoff)
 * 2. Horizontally arranged metadata and action buttons directly UNDER the component
 */
function ComponentHorizontalCard({ item, globalTheme, onBuyPack }) {
  const [showCode, setShowCode] = useState(false)
  const [codeTab, setCodeTab] = useState('source') // 'source' | 'usage'
  const [copied, setCopied] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [previewClosed, setPreviewClosed] = useState(false)
  const [previewFeedback, setPreviewFeedback] = useState('')

  const Component = item.component

  async function handleCopy() {
    const textToCopy = codeTab === 'source' ? item.source : item.code
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  function handleReset() {
    setPreviewKey(k => k + 1)
    setPreviewClosed(false)
    setPreviewFeedback('')
  }

  return (
    <article
      id={`comp-${item.id}`}
      className="w-full overflow-hidden rounded-[30px] bg-paper border border-line neu shadow-sm transition-all duration-300 hover:shadow-md"
    >
      {/* 1. Live Interactive Component Canvas (Full Width & Naturally 100% Fluid Responsive) */}
      <div className="relative border-b border-line bg-zinc-950 p-4 sm:p-8 md:p-10 w-full">
        <div
          className={`w-full min-h-[220px] transition-colors duration-300 flex items-center justify-center overflow-x-auto ${
            globalTheme === 'light'
              ? 'component-light-canvas'
              : 'bg-zinc-950 text-white'
          }`}
        >
          {Component && !previewClosed ? (
            <div className="w-full flex justify-center py-2">
              <Component
                key={`${item.id}-${previewKey}`}
                theme={globalTheme}
                onClose={() => setPreviewClosed(true)}
                onSubmit={(val) => setPreviewFeedback(`Submitted: ${typeof val === 'object' ? JSON.stringify(val) : val}`)}
                onSelect={(val) => setPreviewFeedback(`Selected: ${typeof val === 'object' ? JSON.stringify(val) : val}`)}
                onApply={(val) => setPreviewFeedback(`Applied: ${typeof val === 'object' ? JSON.stringify(val) : val}`)}
                onComplete={() => setPreviewFeedback('Complete.')}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-xs text-zinc-400">Preview closed.</p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                Reset Preview ↺
              </button>
            </div>
          )}
        </div>

        {/* Micro Interaction Toast / Status Bar */}
        {previewFeedback && (
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-xs text-zinc-400">
            <span className="font-mono text-emerald-400">✓ {previewFeedback}</span>
            <button
              type="button"
              onClick={handleReset}
              className="text-zinc-500 hover:text-white underline text-[10px]"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* 2. Horizontally Arranged Details & Action Buttons Directly UNDER Component */}
      <div className="bg-paper p-5 sm:p-6 md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Left: Badges, Component Name, Description */}
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-blue">
                {item.category}
              </span>
              <span className="rounded-full bg-paper px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-soft neu-sm">
                Ref: {item.reference}
              </span>
              <span className="font-mono text-[10px] text-ink-soft opacity-75">
                {item.fileName}
              </span>
            </div>

            {/* NAME UNDER THE COMPONENT */}
            <h3 className="display text-xl font-bold text-ink sm:text-2xl">
              {item.name} <span className="font-mono text-xs font-normal text-ink-soft">({item.id})</span>
            </h3>

            <p className="text-xs font-medium leading-relaxed text-ink-soft">
              {item.description}
            </p>
          </div>

          {/* Right: Horizontally Arranged Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
            
            {/* PRIMARY: Buy Copy / Buy Pack Button (Triggers checkout modal) */}
            <button
              type="button"
              onClick={() => onBuyPack(item)}
              className="btn-gradient inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition hover:scale-102"
              title="Buy Component Pack ($29 / ₦35,000)"
            >
              <span>Get Pack ($29)</span>
              <span>→</span>
            </button>

            {/* View / Hide Code Toggle */}
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className={`rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                showCode ? 'bg-ink text-white' : 'bg-paper text-ink neu-sm hover:text-blue'
              }`}
            >
              {showCode ? '✕ Hide Code' : '💻 Code'}
            </button>

            {/* Quick Copy Snippet */}
            <button
              type="button"
              onClick={handleCopy}
              className="neu-hover rounded-full bg-paper px-4 py-2.5 text-xs font-bold text-ink neu-sm hover:text-blue"
              title="Copy Component Code"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="neu-hover rounded-full bg-paper px-3 py-2.5 text-xs font-bold text-ink-soft neu-sm hover:text-ink"
              title="Reset Component Demo"
            >
              ↺
            </button>
          </div>
        </div>

        {/* 3. Expandable Inline Code Drawer */}
        {showCode && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-line/50 bg-zinc-950 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-zinc-900/90 px-5 py-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCodeTab('source')}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    codeTab === 'source' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Component Source ({item.fileName})
                </button>
                <button
                  type="button"
                  onClick={() => setCodeTab('usage')}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    codeTab === 'usage' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Usage Example
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="font-mono text-xs text-blue-400 hover:text-blue-300 font-bold"
              >
                {copied ? '✓ Copied to clipboard' : 'Copy code ⎘'}
              </button>
            </div>

            <div className="p-4 font-mono text-xs leading-relaxed text-zinc-300">
              <pre className="max-h-[460px] overflow-auto rounded-xl bg-black/60 p-4">
                <code>{codeTab === 'source' ? item.source : item.code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export default function ComponentShowcase({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedReference, setSelectedReference] = useState('All')
  const [search, setSearch] = useState('')
  const [globalTheme, setGlobalTheme] = useState('dark') // 'dark' | 'light'
  const [currency, setCurrency] = useState('USD') // 'USD' | 'NGN'

  // Purchase & Payment Modal state
  const [buyingProduct, setBuyingProduct] = useState(null)
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    status: 'confirmed',
    order: {},
  })

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: catalog.length }
    catalog.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return counts
  }, [])

  // Filtered components stream
  const filtered = useMemo(() => {
    return COMPONENTS.filter((c) => {
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory
      const matchRef = selectedReference === 'All' || c.reference === selectedReference
      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.reference.toLowerCase().includes(q)
      return matchCat && matchRef && matchSearch
    })
  }, [selectedCategory, selectedReference, search])

  function handleTriggerBuy() {
    setBuyingProduct(UI_PACK_PRODUCT)
  }

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white">
      <Navbar onNavigate={onNavigate} currentPath="/components" />

      <main className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 md:px-10 md:pt-28">
        
        {/* Top Breadcrumb & Pack Stats */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <a
            href="/"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault()
                onNavigate('/')
              }
            }}
            className="neu-hover inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink neu-sm"
          >
            ← Back to Portfolio
          </a>

          <div className="flex items-center gap-2.5">
            {/* Currency switch */}
            <div className="flex items-center gap-1 rounded-full bg-paper p-1 neu-inset">
              {['USD', 'NGN'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                    currency === c ? 'btn-gradient text-white shadow' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <span className="rounded-full bg-blue/10 px-3.5 py-1 text-xs font-bold text-blue">
              {COMPONENTS.length} React 19 Blocks
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// Weezie UI · Component Library</p>
            <h1 className="display mt-2 text-4xl text-ink md:text-6xl">
              COPY-PASTE <span className="text-gradient">REACT BLOCKS</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base font-medium text-ink-soft">
              Original Tailwind CSS v4 &amp; React 19 interfaces. 100% fluid and responsive. Select categories on the left sidebar to filter instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleTriggerBuy}
              className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] shadow-lg transition hover:scale-102"
            >
              <span>Buy 35-Component Pack ({currency === 'USD' ? '$29' : '₦35,000'})</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Visual Hero Banner */}
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8 shadow-2xl">
          <img
            src="/images/ui-showcase-hero.png"
            alt="Weezie UI 3D Component Suite"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent" />

          <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                Fluid Responsive Components
              </span>
              <h2 className="display mt-2 text-xl font-bold text-white sm:text-2xl">
                High-Velocity UI for Founders Who Build.
              </h2>
              <p className="mt-1 text-xs text-zinc-300">
                All components are fluidly responsive and arranged horizontally below.
              </p>
            </div>

            {/* Global Theme Toggle */}
            <div className="flex items-center gap-2 self-start rounded-full bg-white/10 p-1.5 backdrop-blur-md md:self-auto">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Canvas Theme:</span>
              <button
                type="button"
                onClick={() => setGlobalTheme('dark')}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  globalTheme === 'dark' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                🌙 Dark
              </button>
              <button
                type="button"
                onClick={() => setGlobalTheme('light')}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  globalTheme === 'light' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                ☀️ Light
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TWO-COLUMN LAYOUT: Left Category Sidebar + Right Full-Width Feed */}
        {/* ============================================================== */}
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* ============================================================ */}
          {/* LEFT SIDEBAR: CATEGORIES SELECTION & SEARCH                  */}
          {/* ============================================================ */}
          <aside className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-24 space-y-6">
            
            {/* Quick Search Box */}
            <div className="rounded-2xl bg-paper p-4 neu-sm">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2">
                Quick Search
              </label>
              <div className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cards, bento, auth…"
                  className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset focus:ring-2 focus:ring-blue/50"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2.5 text-xs font-bold text-ink-soft hover:text-ink"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Categories Selection List on the Left Side */}
            <div className="rounded-3xl bg-paper p-5 neu">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink">
                  Categories
                </h3>
                <span className="font-mono text-[10px] text-ink-soft font-bold">
                  {COMPONENTS.length} total
                </span>
              </div>

              <nav className="mt-3 flex flex-col gap-1 max-h-[420px] overflow-y-auto pr-1">
                {/* 'All' Category Option */}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all text-left ${
                    selectedCategory === 'All'
                      ? 'bg-ink text-white shadow-sm'
                      : 'text-ink-soft hover:bg-paper neu-hover hover:text-ink'
                  }`}
                >
                  <span>All Components</span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                    selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-paper neu-inset text-ink-soft'
                  }`}>
                    {COMPONENTS.length}
                  </span>
                </button>

                {/* Individual Categories */}
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat
                  const count = categoryCounts[cat] || 0
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-left ${
                        isSelected
                          ? 'bg-ink text-white shadow-sm'
                          : 'text-ink-soft hover:bg-paper neu-hover hover:text-ink'
                      }`}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-paper neu-inset text-ink-soft'
                      }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Reference Collection Filter */}
            <div className="rounded-2xl bg-paper p-4 neu-sm">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2">
                Reference Style
              </label>
              <select
                value={selectedReference}
                onChange={(e) => setSelectedReference(e.target.value)}
                className="w-full rounded-xl bg-paper p-2.5 text-xs font-medium text-ink outline-none neu-inset"
              >
                <option value="All">All Collections ({COMPONENTS.length})</option>
                {REFERENCES.map((ref) => (
                  <option key={ref} value={ref}>
                    {ref}
                  </option>
                ))}
              </select>
            </div>

            {/* Sidebar Promo CTA (Triggers buy modal) */}
            <div className="rounded-3xl bg-paper p-5 neu-inset text-center">
              <span className="rounded-full bg-blue/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue">
                Commercial License
              </span>
              <h4 className="display mt-2 text-lg font-bold text-ink">
                Weezie UI Component Pack
              </h4>
              <p className="mt-1 text-[11px] text-ink-soft">
                All 35 React files + design tokens packaged in a single instant download.
              </p>
              <button
                type="button"
                onClick={handleTriggerBuy}
                className="btn-gradient mt-4 block w-full rounded-full py-3 text-center text-xs font-bold uppercase tracking-wider shadow"
              >
                Buy Pack ({currency === 'USD' ? '$29' : '₦35,000'}) →
              </button>
            </div>
          </aside>

          {/* ============================================================ */}
          {/* RIGHT MAIN FEED: HORIZONTALLY ARRANGED RESPONSIVE CARDS      */}
          {/* ============================================================ */}
          <div className="w-full min-w-0 flex-1 space-y-6">
            
            {/* Feed Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue">
                  {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                </span>
                <h2 className="display text-2xl font-bold text-ink sm:text-3xl">
                  {filtered.length} {filtered.length === 1 ? 'Component' : 'Components'} Available
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerBuy}
                  className="btn-gradient rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Buy Pack ({currency === 'USD' ? '$29' : '₦35k'})
                </button>

                {(selectedCategory !== 'All' || selectedReference !== 'All' || search) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All')
                      setSelectedReference('All')
                      setSearch('')
                    }}
                    className="rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-blue neu-sm hover:text-ink transition"
                  >
                    Reset ✕
                  </button>
                )}
              </div>
            </div>

            {/* Empty Search / Filter State */}
            {filtered.length === 0 && (
              <div className="rounded-3xl bg-paper p-12 text-center neu-inset">
                <span className="text-3xl">🔍</span>
                <h3 className="display mt-3 text-xl font-bold text-ink">No components found</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  Try adjusting your search terms or select "All Components" on the left sidebar.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All')
                    setSelectedReference('All')
                    setSearch('')
                  }}
                  className="btn-gradient mt-4 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                >
                  Show All 35 Components
                </button>
              </div>
            )}

            {/* ========================================================== */}
            {/* HORIZONTALLY ARRANGED RESPONSIVE CARDS (Full-width stream) */}
            {/* ========================================================== */}
            <div className="space-y-8 w-full">
              {filtered.map((item) => (
                <ComponentHorizontalCard
                  key={item.id}
                  item={item}
                  globalTheme={globalTheme}
                  onBuyPack={handleTriggerBuy}
                />
              ))}
            </div>

            {/* Bottom Feed Footer */}
            {filtered.length > 0 && (
              <div className="rounded-3xl bg-paper p-8 text-center neu-sm mt-8">
                <h4 className="display text-2xl font-bold text-ink">Ready to ship with these components?</h4>
                <p className="mt-2 text-xs font-medium text-ink-soft max-w-md mx-auto">
                  Download all 35 components with clean TypeScript/JSX definitions, motion presets, and commercial rights.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleTriggerBuy}
                    className="btn-gradient rounded-full px-7 py-3 text-xs font-bold uppercase tracking-[0.12em]"
                  >
                    Buy 35-Component Pack ({currency === 'USD' ? '$29' : '₦35,000'}) →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Checkout Modal (Opens right in /components when clicking Buy) */}
      {buyingProduct && (
        <StoreModal
          product={buyingProduct}
          currency={currency}
          onClose={() => setBuyingProduct(null)}
          onPaymentStatus={(statusData) => setPaymentModal(statusData)}
        />
      )}

      {/* Branded Payment Status Modal (Confirmed, Pending, Failed) */}
      <PaymentStatusModal
        isOpen={paymentModal.isOpen}
        status={paymentModal.status}
        order={paymentModal.order}
        onClose={() => setPaymentModal((prev) => ({ ...prev, isOpen: false }))}
        onRetry={() => {
          setPaymentModal((prev) => ({ ...prev, isOpen: false }))
          setBuyingProduct(UI_PACK_PRODUCT)
        }}
      />

      <Footer onNavigate={onNavigate} />
      <ProjectBrief />
    </div>
  )
}
