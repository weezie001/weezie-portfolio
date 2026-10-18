import { useState } from 'react'
import BentoFeatures from './ui/BentoFeatures.jsx'
import UsagePricingSlider from './ui/UsagePricingSlider.jsx'
import OtpVerificationInput from './ui/OtpVerificationInput.jsx'
import FeatureComparisonMatrix from './ui/FeatureComparisonMatrix.jsx'
import SplitAuthCard from './ui/SplitAuthCard.jsx'

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
]

export default function ComponentShowcase({ onNavigate }) {
  const [activeTab, setActiveTab] = useState(COMPONENTS[0].id)
  const [viewMode, setViewMode] = useState('preview') // 'preview' | 'code'
  const [copied, setCopied] = useState(false)

  const activeComp = COMPONENTS.find((c) => c.id === activeTab) || COMPONENTS[0]
  const ActiveComponent = activeComp.component

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(activeComp.code)
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
              5 of 30 Ready to Copy
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
            <div className="relative p-6 font-mono text-xs leading-relaxed text-zinc-300">
              <pre className="overflow-x-auto rounded-2xl bg-black/60 p-6">
                <code>{activeComp.code}</code>
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
