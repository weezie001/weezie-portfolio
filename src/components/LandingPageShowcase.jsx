import { useState, useId } from 'react'
import { landingTemplates, templateCategories } from '../data/landingTemplatesData.js'
import { StoreModal } from './StoreSection.jsx'
import PaymentStatusModal from './PaymentStatusModal.jsx'

export default function LandingPageShowcase({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [activeDevice, setActiveDevice] = useState({}) // { [templateId]: 'desktop' | 'mobile' }
  const [expandedFiles, setExpandedFiles] = useState({}) // { [templateId]: boolean }
  const [activeBuyProduct, setActiveBuyProduct] = useState(null)
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, status: 'confirmed', order: {} })
  const searchInputId = useId()

  const filtered = landingTemplates.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory
    const q = search.trim().toLowerCase()
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.tagline.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  // Bundle product passed to StoreModal when buying the Landing Pages Suite
  const BUNDLE_PRODUCT = {
    id: 1,
    slug: 'high-end-landing-pages-pack',
    title: '10 High-End Landing Page Templates Suite',
    category: 'Landing Pages',
    tagline: '10 production-ready website templates with kinetic motion scroll, luxury branding & mobile architecture.',
    description:
      'The complete 10-in-1 Master Landing Page Suite. Includes Motion-Scroll Creative Studio, Beacon SaaS Platform, Sage Streetwear Drops, Scattered-Cards Editorial Magazine, Ochre Pitch Deck OS, Atelier Architecture, Vanguard Wealth Fintech, and more. 100% royalty-free commercial license. Plus FREE bonus Weezie UI (35 React & Tailwind Components) automatically included!',
    price_ngn: 45000,
    price_usd: 39,
    is_freebie: false,
    file_url: '/downloads/beacon-saas-starter.zip',
  }

  function handleTriggerBuy(item) {
    // If specific item, pass tailored title; otherwise bundle
    const product = item
      ? {
          ...BUNDLE_PRODUCT,
          title: `${item.name} (${item.category})`,
          file_url: `/downloads/${item.file_bundle}`,
        }
      : BUNDLE_PRODUCT
    setActiveBuyProduct(product)
  }

  function toggleDevice(id, device) {
    setActiveDevice((prev) => ({ ...prev, [id]: device }))
  }

  function toggleFiles(id) {
    setExpandedFiles((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/store')}
              className="neu-hover flex h-9 w-9 items-center justify-center rounded-full bg-paper text-sm font-bold text-ink neu-sm"
              title="Back to Store"
            >
              ←
            </button>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue">
                Weezie Studio · Templates
              </span>
              <h1 className="display text-lg font-bold text-ink sm:text-xl">
                10 High-End Landing Page Templates
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTriggerBuy(null)}
              className="btn-gradient rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition hover:scale-102"
            >
              Get Complete Suite ($39) →
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* ============================================================ */}
          {/* LEFT SIDEBAR: CATEGORIES & SEARCH                            */}
          {/* ============================================================ */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            
            {/* Search Input */}
            <div className="rounded-3xl bg-paper p-4 neu-inset">
              <label htmlFor={searchInputId} className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                Search Templates
              </label>
              <div className="relative">
                <input
                  id={searchInputId}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="SaaS, Agency, Streetwear…"
                  className="w-full rounded-2xl bg-paper px-4 py-2.5 text-xs font-bold text-ink outline-none neu-sm placeholder:text-ink-soft/60"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-2.5 text-xs font-bold text-ink-soft hover:text-ink"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills (Stacked List) */}
            <div className="rounded-3xl bg-paper p-4 neu-inset">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                  Categories ({templateCategories.length})
                </span>
                {selectedCategory !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="text-[10px] font-bold text-blue hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                {templateCategories.map((cat) => {
                  const count =
                    cat === 'All'
                      ? landingTemplates.length
                      : landingTemplates.filter((t) => t.category === cat).length
                  const active = selectedCategory === cat

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition-all ${
                        active
                          ? 'bg-ink text-white shadow-sm'
                          : 'bg-paper text-ink-soft neu-sm hover:text-ink'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                          active ? 'bg-white/20 text-white' : 'bg-paper neu-inset text-ink-soft'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Promo Callout (Includes Free Bonus) */}
            <div className="rounded-3xl bg-paper p-5 neu-inset text-center space-y-3">
              <span className="rounded-full bg-blue/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue">
                Commercial License
              </span>
              <h4 className="display text-lg font-bold text-ink">
                10-in-1 Master Landing Page Suite
              </h4>
              <p className="text-[11px] leading-relaxed text-ink-soft">
                Get all 10 responsive website templates, motion scroll code, and high-res imagery in one package.
              </p>
              
              <div className="rounded-2xl bg-blue/5 border border-blue/20 p-3 text-left">
                <p className="text-[11px] font-bold text-ink">🎁 Free Bonus Included:</p>
                <p className="text-[10px] text-ink-soft mt-0.5">
                  Every order automatically receives the full <strong>Weezie UI (35 Components, $29 value)</strong> free!
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleTriggerBuy(null)}
                className="btn-gradient block w-full rounded-full py-3 text-center text-xs font-bold uppercase tracking-wider shadow"
              >
                Get Suite ($39 · ₦45,000) →
              </button>
            </div>
          </aside>

          {/* ============================================================ */}
          {/* RIGHT MAIN STREAM: STACKED TEMPLATE CARDS                    */}
          {/* ============================================================ */}
          <div className="w-full min-w-0 flex-1 space-y-8">
            
            {/* Stream Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue">
                  {selectedCategory === 'All' ? 'All Template Archetypes' : selectedCategory}
                </span>
                <h2 className="display text-2xl font-bold text-ink sm:text-3xl">
                  {filtered.length} {filtered.length === 1 ? 'Template' : 'Templates'} Available
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTriggerBuy(null)}
                  className="btn-gradient rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Buy All 10 Templates ($39)
                </button>
              </div>
            </div>

            {/* Empty Search State */}
            {filtered.length === 0 && (
              <div className="rounded-3xl bg-paper p-12 text-center neu-inset">
                <span className="text-3xl">🔍</span>
                <h3 className="display mt-3 text-xl font-bold text-ink">No templates found</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  Try adjusting your search terms or select &quot;All&quot; on the left sidebar.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All')
                    setSearch('')
                  }}
                  className="btn-gradient mt-4 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                >
                  Show All 10 Templates
                </button>
              </div>
            )}

            {/* Stacked Template Cards Stream */}
            <div className="space-y-12 w-full">
              {filtered.map((item) => {
                const currentDevice = activeDevice[item.id] || 'desktop'
                const isMobile = currentDevice === 'mobile'
                const isFilesOpen = Boolean(expandedFiles[item.id])

                return (
                  <article
                    key={item.id}
                    className="w-full overflow-hidden rounded-[32px] bg-paper neu transition-all"
                  >
                    {/* 1. Header with Title & Viewport Switcher */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-ink-soft">
                          #{item.id}
                        </span>
                        <span className="rounded-full bg-blue/10 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-blue">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                            {item.badge}
                          </span>
                        )}
                        <h3 className="display text-lg font-bold text-ink sm:text-xl">
                          {item.name}
                        </h3>
                      </div>

                      {/* Viewport Switcher: Desktop vs Mobile (where supported) */}
                      {item.supports_mobile && (
                        <div className="flex items-center gap-1 rounded-full bg-paper p-1 neu-inset">
                          <button
                            type="button"
                            onClick={() => toggleDevice(item.id, 'desktop')}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase transition ${
                              !isMobile ? 'bg-ink text-white shadow-sm' : 'text-ink-soft hover:text-ink'
                            }`}
                          >
                            <span>🖥️</span>
                            <span>Desktop</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleDevice(item.id, 'mobile')}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase transition ${
                              isMobile ? 'bg-ink text-white shadow-sm' : 'text-ink-soft hover:text-ink'
                            }`}
                          >
                            <span>📱</span>
                            <span>Mobile</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. Interactive Live Preview Frame */}
                    <div className="relative w-full bg-zinc-950 p-4 sm:p-6 overflow-hidden flex justify-center">
                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          isMobile
                            ? 'w-[375px] h-[640px] rounded-[38px] border-[8px] border-zinc-800 shadow-2xl relative bg-zinc-950'
                            : 'w-full h-[520px] rounded-2xl border border-zinc-800 bg-zinc-950 shadow-inner'
                        }`}
                      >
                        {/* Mobile speaker notch indicator */}
                        {isMobile && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 h-4 w-28 rounded-full bg-zinc-900 border border-zinc-700/50" />
                        )}

                        <iframe
                          src={item.preview_url}
                          title={item.name}
                          className="w-full h-full border-none bg-zinc-950"
                          loading="lazy"
                          sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                      </div>
                    </div>

                    {/* 3. Details & Action Bar directly UNDER Preview */}
                    <div className="bg-paper p-6 sm:p-8">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        
                        {/* Left: Tagline, Description & Feature List */}
                        <div className="space-y-3 max-w-3xl">
                          <p className="text-sm font-bold text-ink">
                            {item.tagline}
                          </p>
                          <p className="text-xs font-medium leading-relaxed text-ink-soft">
                            {item.description}
                          </p>

                          {/* Features Grid */}
                          <div className="pt-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft mb-2">
                              Included Capabilities &amp; Design Specs
                            </p>
                            <ul className="grid gap-1.5 sm:grid-cols-2">
                              {item.features.map((feat) => (
                                <li key={feat} className="flex items-start gap-2 text-xs font-medium text-ink-soft">
                                  <span className="font-bold text-blue">✓</span>
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tech Stack Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft mr-1">
                              Stack:
                            </span>
                            {item.tech_stack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full bg-paper px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-soft neu-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0 self-start">
                          <button
                            type="button"
                            onClick={() => handleTriggerBuy(item)}
                            className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-sm transition hover:scale-102"
                          >
                            <span>Get Template Pack</span>
                            <span>→</span>
                          </button>

                          <a
                            href={item.preview_url}
                            target="_blank"
                            rel="noreferrer"
                            className="neu-hover inline-flex items-center justify-center gap-1.5 rounded-full bg-paper px-5 py-3 text-xs font-bold text-ink neu-sm"
                          >
                            <span>Open Fullscreen</span>
                            <span>↗</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => toggleFiles(item.id)}
                            className="neu-hover rounded-full bg-paper px-5 py-2.5 text-xs font-bold text-ink-soft neu-sm hover:text-ink text-center"
                          >
                            {isFilesOpen ? '▲ Hide Files' : '📁 Included Files'}
                          </button>
                        </div>
                      </div>

                      {/* Collapsible File Manifest Drawer */}
                      {isFilesOpen && (
                        <div className="mt-6 rounded-2xl bg-paper p-4 neu-inset text-xs font-mono text-ink-soft space-y-1.5 border border-line">
                          <div className="font-bold text-ink text-[11px] mb-2 uppercase tracking-wider">
                            📦 Package Contents ({item.file_bundle})
                          </div>
                          <div>├── index.html / {item.slug}.jsx (Complete template source)</div>
                          <div>├── components/ (Sections, navigation, modals, and forms)</div>
                          <div>├── images/ (WebP photography and retina assets)</div>
                          <div>├── tokens.css (Colors, elevation shadows &amp; typography)</div>
                          <div>├── README.md (3-step setup &amp; commercial license)</div>
                          <div className="pt-2 text-blue font-bold">
                            🎁 Plus: Weezie UI Bundle (35 React &amp; Tailwind Components) auto-included free!
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* In-page Paystack Buy Modal */}
      {activeBuyProduct && (
        <StoreModal
          product={activeBuyProduct}
          currency="USD"
          onClose={() => setActiveBuyProduct(null)}
          onPaymentStatus={(statusData) => setPaymentModal(statusData)}
        />
      )}

      {/* Payment Status Modal (Confirmed, Pending, Failed) */}
      <PaymentStatusModal
        isOpen={paymentModal.isOpen}
        status={paymentModal.status}
        order={paymentModal.order}
        onClose={() => setPaymentModal((prev) => ({ ...prev, isOpen: false }))}
        onRetry={() => {
          setPaymentModal((prev) => ({ ...prev, isOpen: false }))
        }}
      />
    </div>
  )
}
