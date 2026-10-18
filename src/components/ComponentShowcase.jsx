import { useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ProjectBrief from './ProjectBrief.jsx'
import BentoFeatures from './ui/BentoFeatures.jsx'
import UsagePricingSlider from './ui/UsagePricingSlider.jsx'
import OtpVerificationInput from './ui/OtpVerificationInput.jsx'
import FeatureComparisonMatrix from './ui/FeatureComparisonMatrix.jsx'
import SplitAuthCard from './ui/SplitAuthCard.jsx'
import MinimalCard from './ui/MinimalCard.jsx'
import MinimalNavbar from './ui/MinimalNavbar.jsx'
import MinimalFilterBar from './ui/MinimalFilterBar.jsx'
import MinimalViewToggle from './ui/MinimalViewToggle.jsx'
import MinimalSubmitModal from './ui/MinimalSubmitModal.jsx'

// Import complete raw source code so buyers can copy the full implementation directly
import bentoRaw from './ui/BentoFeatures.jsx?raw'
import pricingRaw from './ui/UsagePricingSlider.jsx?raw'
import otpRaw from './ui/OtpVerificationInput.jsx?raw'
import matrixRaw from './ui/FeatureComparisonMatrix.jsx?raw'
import authRaw from './ui/SplitAuthCard.jsx?raw'
import minimalCardRaw from './ui/MinimalCard.jsx?raw'
import minimalNavbarRaw from './ui/MinimalNavbar.jsx?raw'
import minimalFilterBarRaw from './ui/MinimalFilterBar.jsx?raw'
import minimalViewToggleRaw from './ui/MinimalViewToggle.jsx?raw'
import minimalSubmitModalRaw from './ui/MinimalSubmitModal.jsx?raw'

/**
 * ComponentShowcase — Interactive Viewer & 1-Click Code Exporter
 * Lets users test live interactive components, view clean copy-paste JSX code,
 * and copy directly to clipboard with zero friction.
 */
const COMPONENTS = [
  {
    id: 'bento',
    name: 'Asymmetric Bento Grid',
    category: 'VibePrompts · Features',
    description: 'Dynamic asymmetric tiles with cursor-following spotlight glow, gradient borders, and reactive micro-visuals.',
    component: BentoFeatures,
    fileName: 'BentoFeatures.jsx',
    source: bentoRaw,
    code: `import BentoFeatures from '@/components/ui/BentoFeatures'

export default function Example() {
  return (
    <BentoFeatures
      eyebrow="Platform Capabilities"
      title="Everything you need to grow, nothing you don't"
      subtitle="One unified platform built to scale seamlessly with your engineering team."
      accent="59 130 246"
    />
  )
}`,
  },
  {
    id: 'pricing',
    name: 'Usage-Based Pricing Slider',
    category: 'VibePrompts · Pricing',
    description: 'Real-time interactive seat and tracked-event calculator with annual billing discount toggle.',
    component: UsagePricingSlider,
    fileName: 'UsagePricingSlider.jsx',
    source: pricingRaw,
    code: `import UsagePricingSlider from '@/components/ui/UsagePricingSlider'

export default function Example() {
  return (
    <UsagePricingSlider
      title="Transparent, scale-first pricing"
      subtitle="Pay only for the active seats and events your team actually tracks."
      basePrice={29}
      pricePerSeat={12}
      onSelectPlan={(plan) => console.log('Selected:', plan)}
    />
  )
}`,
  },
  {
    id: 'otp',
    name: 'OTP 6-Digit Verification',
    category: 'VibePrompts · Auth & Security',
    description: 'Auto-advancing 6-digit security code input with paste detection, backspace navigation, and resend cooldown.',
    component: OtpVerificationInput,
    fileName: 'OtpVerificationInput.jsx',
    source: otpRaw,
    code: `import OtpVerificationInput from '@/components/ui/OtpVerificationInput'

export default function Example() {
  return (
    <OtpVerificationInput
      length={6}
      email="alex@acme.studio"
      onComplete={(code) => console.log('Verifying code:', code)}
      onResend={() => console.log('Resending code')}
    />
  )
}`,
  },
  {
    id: 'matrix',
    name: 'Feature Comparison Matrix',
    category: 'VibePrompts · Pricing & Features',
    description: 'Multi-tier side-by-side feature comparison table with sticky headers, highlight badges, and category groupings.',
    component: FeatureComparisonMatrix,
    fileName: 'FeatureComparisonMatrix.jsx',
    source: matrixRaw,
    code: `import FeatureComparisonMatrix from '@/components/ui/FeatureComparisonMatrix'

export default function Example() {
  return (
    <FeatureComparisonMatrix
      title="Compare all features side by side"
      onSelectPlan={(plan) => console.log('Picked plan:', plan.name)}
    />
  )
}`,
  },
  {
    id: 'auth',
    name: 'Split-Screen Auth Card',
    category: 'VibePrompts · Auth & Conversion',
    description: 'High-converting authentication panel with social OAuth, email magic link flow, and brand testimonial panel.',
    component: SplitAuthCard,
    fileName: 'SplitAuthCard.jsx',
    source: authRaw,
    code: `import SplitAuthCard from '@/components/ui/SplitAuthCard'

export default function Example() {
  return (
    <SplitAuthCard
      brandName="Weezie Studio"
      headline="Ship world-class software without the design overhead."
      authorName="Marcus Vance"
      authorRole="Head of Engineering @ Hypergrowth"
      onSubmitEmail={(email) => console.log('Send link to:', email)}
    />
  )
}`,
  },
  {
    id: 'minimal-card',
    name: 'Minimal Curation Card',
    category: 'Minimal Gallery · Showcase',
    description: 'Clean showcase card with hover image zoom, category pill, and interactive bookmark button with live counter.',
    component: MinimalCard,
    fileName: 'MinimalCard.jsx',
    source: minimalCardRaw,
    code: `import MinimalCard from '@/components/ui/MinimalCard'

export default function Example() {
  return (
    <div className="max-w-sm">
      <MinimalCard
        title="Studio Linear"
        category="Design Agency"
        year="2026"
        url="https://linear.app"
        initialBookmarks={142}
      />
    </div>
  )
}`,
  },
  {
    id: 'minimal-nav',
    name: 'Minimal Floating Navbar',
    category: 'Minimal Gallery · Navigation',
    description: 'Split floating pill header with ⌘K search shortcut, live bookmarks count badge, and clean responsive menu.',
    component: MinimalNavbar,
    fileName: 'MinimalNavbar.jsx',
    source: minimalNavbarRaw,
    code: `import MinimalNavbar from '@/components/ui/MinimalNavbar'

export default function Example() {
  return (
    <MinimalNavbar
      brandName="Minimal Archive"
      bookmarksCount={5}
      onOpenSearch={() => console.log('Open search dialog')}
      onSubmitClick={() => console.log('Open submit modal')}
    />
  )
}`,
  },
  {
    id: 'minimal-filter',
    name: 'Horizontal Filter Bar',
    category: 'Minimal Gallery · Filters',
    description: 'Horizontal scrolling tag pill bar with active slider indicator, counts per tag, and clear-all reset button.',
    component: MinimalFilterBar,
    fileName: 'MinimalFilterBar.jsx',
    source: minimalFilterBarRaw,
    code: `import MinimalFilterBar from '@/components/ui/MinimalFilterBar'

export default function Example() {
  return (
    <MinimalFilterBar
      onChange={(activeTag) => console.log('Filtered by:', activeTag)}
    />
  )
}`,
  },
  {
    id: 'minimal-view',
    name: 'Segmented View Toggle',
    category: 'Minimal Gallery · Layout Controls',
    description: 'Smooth sliding layout switcher (2-col, 3-col, compact list) with persisted view state and animated indicators.',
    component: MinimalViewToggle,
    fileName: 'MinimalViewToggle.jsx',
    source: minimalViewToggleRaw,
    code: `import MinimalViewToggle from '@/components/ui/MinimalViewToggle'

export default function Example() {
  return (
    <MinimalViewToggle
      initialView="3col"
      onViewChange={(view) => console.log('Switched layout:', view)}
    />
  )
}`,
  },
  {
    id: 'minimal-modal',
    name: 'Minimal Submission Modal',
    category: 'Minimal Gallery · Modals',
    description: 'Minimalist website submission dialog with live URL metadata preview, category selector, and confirmation screen.',
    component: (props) => (
      <div className="relative flex min-h-[350px] items-center justify-center p-4">
        <MinimalSubmitModal isOpen={true} {...props} className="static max-w-md mx-auto" />
      </div>
    ),
    fileName: 'MinimalSubmitModal.jsx',
    source: minimalSubmitModalRaw,
    code: `import { useState } from 'react'
import MinimalSubmitModal from '@/components/ui/MinimalSubmitModal'

export default function Example() {
  const [open, setOpen] = useState(true)

  return (
    <MinimalSubmitModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={(data) => console.log('Submitted site:', data)}
    />
  )
}`,
  },
]

export default function ComponentShowcase({ onNavigate }) {
  const [activeTab, setActiveTab] = useState(COMPONENTS[0].id)
  const [viewMode, setViewMode] = useState('preview') // 'preview' | 'code'
  const [codeTab, setCodeTab] = useState('source') // 'source' | 'usage'
  const [theme, setTheme] = useState('dark') // 'dark' | 'light'
  const [device, setDevice] = useState('desktop') // 'desktop' | 'mobile'
  const [copied, setCopied] = useState(false)

  const activeComp = COMPONENTS.find((c) => c.id === activeTab) || COMPONENTS[0]
  const ActiveComponent = activeComp.component

  async function handleCopyCode() {
    const textToCopy = codeTab === 'source' ? activeComp.source : activeComp.code
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white">
      <Navbar onNavigate={onNavigate} currentPath="/components" />

      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16 md:px-10 md:pt-28">
        {/* Breadcrumb / Top Bar */}
        <div className="mb-6 flex items-center justify-between">
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
          <span className="rounded-full bg-blue/10 px-3.5 py-1 text-xs font-bold text-blue">
            30 Production Blocks · Zero Dependencies
          </span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// Weezie UI · Design &amp; Systems Lab</p>
            <h1 className="display mt-2 text-4xl text-ink md:text-6xl">
              COPY-PASTE <span className="text-gradient">REACT BLOCKS</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base font-medium text-ink-soft">
              Tested, accessible, zero-dependency Tailwind CSS v4 &amp; React 19 components inspired by modern web benchmarks.
              Live interactive previews with light/dark themes, responsive mobile/desktop toggles, and 1-click clipboard export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/store"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/store')
                }
              }}
              className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em]"
            >
              <span>Get 30-Component Pack ($29)</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Component Selector Tabs */}
        <div className="mt-8 flex flex-wrap gap-2.5 pb-2">
          {COMPONENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id)
                setViewMode('preview')
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                activeTab === item.id
                  ? 'btn-gradient text-white shadow-md'
                  : 'bg-paper text-ink-soft neu-sm hover:text-ink'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Active Component Details & View Mode Toggle */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-paper p-5 neu-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue">
              {activeComp.category}
            </span>
            <h2 className="display mt-0.5 text-2xl text-ink">{activeComp.name}</h2>
            <p className="mt-1 text-xs font-medium text-ink-soft">{activeComp.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Viewport device switcher */}
            {viewMode === 'preview' && (
              <div className="inline-flex rounded-full bg-paper p-1 neu-inset">
                <button
                  type="button"
                  onClick={() => setDevice('desktop')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition ${
                    device === 'desktop' ? 'btn-gradient text-white shadow' : 'text-ink-soft hover:text-ink'
                  }`}
                  title="Desktop View"
                >
                  🖥️ Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDevice('mobile')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition ${
                    device === 'mobile' ? 'btn-gradient text-white shadow' : 'text-ink-soft hover:text-ink'
                  }`}
                  title="Mobile View (390px)"
                >
                  📱 Mobile
                </button>
              </div>
            )}

            {/* Theme mode switcher */}
            {viewMode === 'preview' && (
              <div className="inline-flex rounded-full bg-paper p-1 neu-inset">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition ${
                    theme === 'dark' ? 'btn-gradient text-white shadow' : 'text-ink-soft hover:text-ink'
                  }`}
                  title="Dark Theme"
                >
                  🌙 Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition ${
                    theme === 'light' ? 'btn-gradient text-white shadow' : 'text-ink-soft hover:text-ink'
                  }`}
                  title="Light Theme"
                >
                  ☀️ Light
                </button>
              </div>
            )}

            {/* View mode switcher */}
            <div className="inline-flex rounded-full bg-paper p-1 neu-inset">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  viewMode === 'preview' ? 'btn-gradient text-white shadow' : 'text-ink-soft hover:text-ink'
                }`}
              >
                👁️ Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('code')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  viewMode === 'code' ? 'btn-gradient text-white shadow' : 'text-ink-soft hover:text-ink'
                }`}
              >
                💻 Code
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="btn-gradient inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em]"
            >
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
          </div>
        </div>

        {/* Display Canvas */}
        <div className="mt-6 overflow-hidden rounded-[28px] bg-paper p-3 neu md:p-6">
          {viewMode === 'preview' ? (
            <div
              className={`transition-all duration-300 ${
                device === 'mobile'
                  ? 'mx-auto max-w-[390px] rounded-[44px] border-[10px] border-zinc-900 shadow-2xl overflow-hidden'
                  : 'w-full rounded-2xl overflow-hidden border border-line/40'
              }`}
            >
              {/* Mobile device frame top bar */}
              {device === 'mobile' && (
                <div className="relative flex h-8 items-center justify-center bg-zinc-950 px-6">
                  <div className="h-4 w-24 rounded-full bg-black" />
                </div>
              )}

              {/* Component Canvas with Light/Dark Theme */}
              <div
                className={`overflow-x-hidden p-4 sm:p-8 transition-colors duration-300 ${
                  theme === 'light'
                    ? 'component-light-canvas'
                    : 'bg-zinc-950 text-white'
                }`}
              >
                <ActiveComponent theme={theme} />
              </div>

              {/* Mobile device frame bottom indicator */}
              {device === 'mobile' && (
                <div className="flex h-5 items-center justify-center bg-zinc-950">
                  <div className="h-1 w-28 rounded-full bg-white/30" />
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-line/40 bg-zinc-950">
              {/* Code sub-toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/80 px-6 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCodeTab('source')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      codeTab === 'source' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    📄 Component Source ({activeComp.fileName})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeTab('usage')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      codeTab === 'usage' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🚀 Usage Example
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>File path: <code className="rounded bg-white/10 px-2 py-0.5 text-blue-400 font-mono">src/components/ui/{activeComp.fileName}</code></span>
                </div>
              </div>

              <div className="relative p-4 font-mono text-xs leading-relaxed text-zinc-300 md:p-6">
                <pre className="max-h-[600px] overflow-x-auto overflow-y-auto rounded-xl bg-black/60 p-4 md:p-6 leading-relaxed">
                  <code>{codeTab === 'source' ? activeComp.source : activeComp.code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
      <ProjectBrief />
    </div>
  )
}
