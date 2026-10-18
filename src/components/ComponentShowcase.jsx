import { useState } from 'react'
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
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/') : window.location.href = '/'}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
            >
              ← Back to Portfolio
            </button>
            <span className="text-zinc-600">/</span>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-white">Weezie UI Component Library</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
              10 of 30 Ready to Copy
            </span>
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/store') : window.location.href = '/store'}
              className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              Get Full Bundle
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Title & Description */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Copy & Paste Ready · Zero Dependencies
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Production React & Tailwind Components
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Recreated from the web's cleanest interfaces. Pure React with Tailwind CSS classes,
            clean props, accessible semantics, and zero bloated npm libraries.
          </p>
        </div>

        {/* Component Selector Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {COMPONENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id)
                setViewMode('preview')
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Active Component Details & View Mode Toggle */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              {activeComp.category}
            </span>
            <h2 className="text-xl font-bold text-white">{activeComp.name}</h2>
            <p className="text-xs text-zinc-400">{activeComp.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border border-white/10 bg-zinc-900 p-1">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  viewMode === 'preview' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
                }`}
              >
                👁️ Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('code')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  viewMode === 'code' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
                }`}
              >
                💻 Code
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-400 transition-all hover:bg-blue-500/20 active:scale-95"
            >
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
          </div>
        </div>

        {/* Display Canvas */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
          {viewMode === 'preview' ? (
            <div className="p-4 sm:p-8">
              <ActiveComponent />
            </div>
          ) : (
            <div>
              {/* Code sub-toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/60 px-6 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCodeTab('source')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      codeTab === 'source' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    📄 Component Source ({activeComp.fileName})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeTab('usage')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      codeTab === 'usage' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🚀 Usage Example
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>File path: <code className="rounded bg-white/5 px-2 py-0.5 text-blue-400">src/components/ui/{activeComp.fileName}</code></span>
                </div>
              </div>

              <div className="relative p-6 font-mono text-xs leading-relaxed text-zinc-300">
                <pre className="max-h-[600px] overflow-x-auto overflow-y-auto rounded-2xl bg-black/60 p-6 leading-relaxed">
                  <code>{codeTab === 'source' ? activeComp.source : activeComp.code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
