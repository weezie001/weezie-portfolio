"use client";
import { useState, useRef } from 'react'

const HOTSPOTS = [
  {
    id: 'box',
    x: 42,
    y: 28,
    badge: '00-studio',
    title: 'Studio OS Archival Box Set',
    desc: 'The master studio operating system: 3 sellable scope tiers (Starter, Standard, Full CIP), Figma canvas structure, client approval checklists, and naming rules.',
    highlight: 'Includes rate cards & contracts',
  },
  {
    id: 'book',
    x: 22,
    y: 54,
    badge: '04-guidelines',
    title: 'Client-Facing Brand Bible',
    desc: 'The definitive identity manual: logo clearspace, minimum sizes, "don\'ts", typography scales, grid rules, and a complete voice & tone framework.',
    highlight: 'HTML brand book + PDF ready',
  },
  {
    id: 'swatches',
    x: 44,
    y: 68,
    badge: '03-identity',
    title: 'Tactile Color System & Swatches',
    desc: 'Archival paper swatches with calibrated Hex, RGB, CMYK, and accessibility contrast scores for digital and luxury print finishes.',
    highlight: 'Soot, Forest, Brass, Birch',
  },
  {
    id: 'tokens',
    x: 82,
    y: 56,
    badge: '05-tokens',
    title: 'Frosted Acrylic Code Token Slab',
    desc: 'Machine-readable design tokens (tokens.css, design-tokens.json, tailwind.preset.js). Zero translation loss from Figma to production code.',
    highlight: 'Ready for Web & React builds',
  },
  {
    id: 'cards',
    x: 64,
    y: 78,
    badge: '07-applications',
    title: 'Stationery, Social & Email Suite',
    desc: 'Edge-painted business cards, invoice/letterhead templates, 1:1 & 9:16 social templates, and a table-formatted HTML email signature.',
    highlight: 'Pre-formatted Figma vectors',
  },
]

const SWATCHES = [
  { name: 'Soot Black', hex: '#0E1114', role: 'Primary Dark & Typography', bg: '#0E1114', text: '#ffffff' },
  { name: 'Forest Green', hex: '#3D5A45', role: 'Signature Studio Brand', bg: '#3D5A45', text: '#ffffff' },
  { name: 'Architectural Brass', hex: '#C9A227', role: 'Luxury Accent & Foil', bg: '#C9A227', text: '#0E1114' },
  { name: 'Nordic Birch', hex: '#E7E3D6', role: 'Paper Canvas & Background', bg: '#E7E3D6', text: '#0E1114' },
  { name: 'Baltic Pine Ply', hex: '#D9D3C3', role: 'Secondary Neu Mute', bg: '#D9D3C3', text: '#0E1114' },
]

const TIERS = [
  {
    name: 'Starter Tier',
    clientPriceNgn: 150000,
    clientPriceUsd: 200,
    timeToDeliver: '2–3 days',
    bestFor: 'Landing pages, creators, first-time founders',
    features: ['Mark + Wordmark lockups', 'Primary & accent palette', 'Type pairing stack', 'Favicon & social avatars', 'Email signature', 'tokens.css for dev'],
  },
  {
    name: 'Standard Tier (Recommended)',
    clientPriceNgn: 350000,
    clientPriceUsd: 450,
    timeToDeliver: '1–2 weeks',
    bestFor: 'Established businesses, e-commerce, studios',
    features: ['Everything in Starter', 'Full brand platform & voice chart', 'Stationery: cards & letterheads', 'Complete social template kit (1:1, 4:5, 9:16)', 'Slide deck master', 'Full guidelines & motion spec'],
  },
  {
    name: 'Full Corporate CIP',
    clientPriceNgn: 750000,
    clientPriceUsd: 950,
    timeToDeliver: '3–4 weeks',
    bestFor: 'Funded startups, retail, hospitality, physical presence',
    features: ['Everything in Standard', 'Packaging & box labels', 'Signage & wayfinding specs', 'Apparel & merchandise tech packs', 'Lanyard & ID badge suite', 'Walkthrough & IP transfer deed'],
  },
]

const SAMPLE_TOKENS_CSS = `:root {
  /* Weezie Brand Delivery Kit — Atelier North Sample */
  --soot: #0e1114;
  --forest: #3d5a45;
  --forest-dark: #2e4434;
  --brass: #c9a227;
  --birch: #e7e3d6;
  --ply: #d9d3c3;
  --rule: #c3bcae;
  
  /* Typography */
  --font-display: "Newsreader", serif;
  --font-sans: "IBM Plex Sans", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
}`

const SAMPLE_TOKENS_JSON = `{
  "brand": {
    "soot": { "value": "#0E1114", "type": "color" },
    "forest": { "value": "#3D5A45", "type": "color" },
    "brass": { "value": "#C9A227", "type": "color" },
    "birch": { "value": "#E7E3D6", "type": "color" }
  },
  "typography": {
    "display": { "fontFamily": "Newsreader", "fontWeight": "400" },
    "body": { "fontFamily": "IBM Plex Sans", "fontWeight": "400" }
  }
}`

export default function BrandKitInteractive({ onBuy = () => {}, onOpenBrandBook = () => {} }) {
  const [activeTab, setActiveTab] = useState('3d') // '3d' | 'swatches' | 'calculator' | 'brandbook'
  const [activeHotspot, setActiveHotspot] = useState(HOTSPOTS[0])
  const [copiedText, setCopiedText] = useState('')
  const [selectedTier, setSelectedTier] = useState(TIERS[1])
  const [codeType, setCodeType] = useState('css') // 'css' | 'json'
  
  // 3D Parallax State
  const cardRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  function handleMouseMove(e) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -7 // subtle tilt
    const rotateY = ((x - centerX) / centerX) * 7

    setRotate({ x: rotateX, y: rotateY })
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    })
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 })
    setGlare({ x: 50, y: 50, opacity: 0 })
  }

  async function copyToClipboard(text, label) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(''), 2200)
    } catch {
      setCopiedText('')
    }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] bg-paper p-5 sm:p-8 neu text-ink">
      
      {/* Top Header / Mode Switcher */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue">
              Studio OS · Brand Delivery Kit
            </span>
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
              Interactive 3D Demo
            </span>
          </div>
          <h3 className="display mt-2 text-2xl font-normal text-ink sm:text-3xl">
            Brand Delivery Kit <span className="text-gradient">— Studio OS</span>
          </h3>
          <p className="mt-1 text-xs text-ink-soft">
            Explore the physical deliverables, developer code tokens, and client revenue calculator.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-paper p-1.5 neu-inset self-start md:self-auto">
          {[
            { id: '3d', label: '✦ 3D Studio Kit' },
            { id: 'swatches', label: '🎨 Tokens & Palette' },
            { id: 'calculator', label: '💰 ROI Calculator' },
            { id: 'brandbook', label: '📖 Live Brand Book' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'btn-gradient text-white shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: 3D STUDIO KIT & INTERACTIVE HOTSPOTS                     */}
      {/* ============================================================== */}
      {activeTab === '3d' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
          
          {/* Left: 3D Interactive Card Canvas with Mouse Tilt */}
          <div className="lg:col-span-8">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
              className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ink neu-inset shadow-2xl cursor-crosshair select-none"
            >
              {/* Photorealistic 3D Render Asset */}
              <img
                src="/images/brand-delivery-kit-cover.jpg"
                alt="Brand Delivery Kit Studio OS 3D Mockup"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                loading="eager"
              />

              {/* Dynamic Specular Glare Layer */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, rgba(255,255,255,0) 60%)`,
                }}
              />

              {/* Interactive Hotspot Pins */}
              {HOTSPOTS.map((spot) => {
                const isActive = activeHotspot.id === spot.id
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveHotspot(spot)}
                    onMouseEnter={() => setActiveHotspot(spot)}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-400 text-ink scale-110 shadow-lg ring-4 ring-amber-400/40 ring-offset-2'
                        : 'bg-ink/80 text-white/90 hover:bg-ink hover:text-white neu-sm'
                    }`}
                  >
                    <span className={`inline-block h-2 w-2 rounded-full ${isActive ? 'bg-ink animate-ping' : 'bg-amber-400'}`} />
                    <span>{spot.badge}</span>
                  </button>
                )
              })}

              {/* Bottom Instructions pill */}
              <div className="absolute bottom-3 left-3 z-10 rounded-full bg-ink/75 px-3 py-1 text-[10px] font-medium text-white/80 backdrop-blur-md">
                🖱️ Move cursor for 3D tilt · Click or hover pins to inspect deliverables
              </div>
            </div>
          </div>

          {/* Right: Active Deliverable Deep Dive Panel */}
          <div className="flex flex-col justify-between rounded-2xl bg-paper p-5 neu-inset lg:col-span-4 lg:min-h-[360px]">
            <div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="font-mono text-xs font-bold uppercase text-blue">
                  Deliverable Spec
                </span>
                <span className="rounded-full bg-blue/10 px-2.5 py-0.5 text-[10px] font-bold text-blue">
                  {activeHotspot.highlight}
                </span>
              </div>

              <h4 className="display mt-3 text-xl font-bold text-ink">
                {activeHotspot.title}
              </h4>
              <p className="mt-2 text-xs font-medium leading-relaxed text-ink-soft">
                {activeHotspot.desc}
              </p>

              {/* Quick Deliverables Checklist */}
              <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-[11px] text-ink">
                <p className="font-bold text-ink uppercase tracking-wider text-[10px]">What is inside this folder:</p>
                <div className="flex items-center gap-2 text-xs text-ink-soft">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Duplicate-per-job folder ready for clients</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-soft">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Zero Canva / Zero unlicensed font assets</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-soft">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Automated client sign-off &amp; walkthrough script</span>
                </div>
              </div>
            </div>

            {/* CTA in sidebar */}
            <div className="mt-6 flex flex-col gap-2 border-t border-line pt-4">
              <button
                type="button"
                onClick={onBuy}
                className="btn-gradient w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.14em] shadow-md"
              >
                Buy Studio OS (₦18,000 / $15) →
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('brandbook')}
                className="neu-hover rounded-full bg-paper py-2.5 text-xs font-bold uppercase tracking-wider text-ink-soft neu-sm hover:text-ink"
              >
                Preview Live Brand Book ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LIVE COLOR PALETTE & CODE TOKEN INSPECTOR                */}
      {/* ============================================================== */}
      {activeTab === 'swatches' && (
        <div className="mt-6 space-y-6">
          {/* Swatches Grid */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="display text-lg font-bold text-ink">Atelier North Identity Palette</h4>
                <p className="text-xs text-ink-soft">Click any color chip to copy the HEX code to your clipboard.</p>
              </div>
              {copiedText && (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-700 animate-pulse">
                  ✓ Copied {copiedText}
                </span>
              )}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => copyToClipboard(swatch.hex, swatch.hex)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line p-3 text-left transition hover:scale-102 hover:shadow-lg"
                  style={{ backgroundColor: swatch.bg, color: swatch.text }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{swatch.hex}</span>
                    <span className="text-[10px] opacity-0 transition group-hover:opacity-100 font-bold uppercase">
                      Copy ⎘
                    </span>
                  </div>
                  <div className="mt-12">
                    <p className="text-xs font-bold">{swatch.name}</p>
                    <p className="text-[10px] opacity-75">{swatch.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Tokens Viewer */}
          <div className="rounded-2xl bg-paper p-5 neu-inset">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ink">Handoff Tokens</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setCodeType('css')}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      codeType === 'css' ? 'bg-ink text-white' : 'bg-paper text-ink-soft neu-sm'
                    }`}
                  >
                    tokens.css
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeType('json')}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      codeType === 'json' ? 'bg-ink text-white' : 'bg-paper text-ink-soft neu-sm'
                    }`}
                  >
                    design-tokens.json
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    codeType === 'css' ? SAMPLE_TOKENS_CSS : SAMPLE_TOKENS_JSON,
                    codeType === 'css' ? 'tokens.css' : 'design-tokens.json'
                  )
                }
                className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-blue neu-sm hover:text-ink transition"
              >
                {copiedText.includes('tokens') ? '✓ Copied Code' : 'Copy Token File ⎘'}
              </button>
            </div>

            <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-xs text-emerald-400">
              <code>{codeType === 'css' ? SAMPLE_TOKENS_CSS : SAMPLE_TOKENS_JSON}</code>
            </pre>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CLIENT ROI CALCULATOR                                   */}
      {/* ============================================================== */}
      {activeTab === 'calculator' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h4 className="display text-xl font-bold text-ink">Choose a Scope Tier to Bill Your Client</h4>
              <p className="mt-1 text-xs text-ink-soft">
                The kit comes with pre-written proposal specs and deliverables for 3 distinct market tiers.
              </p>
            </div>

            <div className="space-y-3">
              {TIERS.map((tier) => {
                const isSelected = selectedTier.name === tier.name
                return (
                  <div
                    key={tier.name}
                    onClick={() => setSelectedTier(tier)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all ${
                      isSelected
                        ? 'bg-paper border-2 border-blue neu shadow-md'
                        : 'bg-paper border border-line neu-sm hover:border-ink/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-ink">{tier.name}</span>
                      <span className="display text-base font-bold text-blue">
                        ₦{tier.clientPriceNgn.toLocaleString()} (${tier.clientPriceUsd})
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">{tier.bestFor} · Turnaround: {tier.timeToDeliver}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tier.features.slice(0, 3).map((f) => (
                        <span key={f} className="rounded-full bg-paper px-2 py-0.5 text-[10px] font-medium text-ink neu-inset">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ROI Metric Box */}
          <div className="rounded-3xl bg-paper p-6 neu lg:col-span-5 text-center">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Immediate Return on Investment
            </span>

            <h5 className="display mt-4 text-3xl font-bold text-ink">
              +₦{(selectedTier.clientPriceNgn - 18000).toLocaleString()}
            </h5>
            <p className="text-xs font-semibold text-emerald-600">
              Net Profit from your very next brand client
            </p>

            <div className="mt-5 space-y-2 rounded-2xl bg-paper p-4 text-left neu-inset text-xs">
              <div className="flex justify-between border-b border-line pb-1.5 text-ink-soft">
                <span>Kit One-Time Cost:</span>
                <span className="font-mono text-ink font-bold">₦18,000 ($15)</span>
              </div>
              <div className="flex justify-between border-b border-line pb-1.5 text-ink-soft">
                <span>Your Client Invoice:</span>
                <span className="font-mono text-blue font-bold">₦{selectedTier.clientPriceNgn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-ink">
                <span>Calculated ROI:</span>
                <span className="text-emerald-600">
                  {Math.round(((selectedTier.clientPriceNgn - 18000) / 18000) * 100)}% ROI
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onBuy}
              className="btn-gradient mt-5 w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
            >
              Get Studio OS for ₦18,000 →
            </button>
            <p className="mt-2 text-[10px] text-ink-soft">
              Commercial Royalty-Free License · Use across unlimited client projects.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LIVE BRAND BOOK QUICK VIEW (Interactive Frame)          */}
      {/* ============================================================== */}
      {activeTab === 'brandbook' && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="display text-lg font-bold text-ink">Atelier North Live Brand Book</h4>
              <p className="text-xs text-ink-soft">
                This is the actual HTML brand book included in the kit for client delivery.
              </p>
            </div>
            <a
              href="/kits/brand-delivery-kit/index.html"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-paper px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue neu-sm hover:text-ink transition"
            >
              Open Fullscreen ↗
            </a>
          </div>

          <div className="h-[480px] w-full overflow-hidden rounded-2xl border border-line neu-inset">
            <iframe
              src="/kits/brand-delivery-kit/index.html"
              title="Atelier North Brand Book"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  )
}
