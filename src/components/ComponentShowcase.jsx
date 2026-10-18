import { useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ProjectBrief from './ProjectBrief.jsx'
import catalog from '../data/componentCatalog.json'

const modules = import.meta.glob('./ui/*.jsx', { eager: true })
const sources = import.meta.glob('./ui/*.jsx', { eager: true, query: '?raw', import: 'default' })
const COMPONENTS = catalog.map(item => ({ ...item,
  component: modules[`./ui/${item.fileName}`].default,
  source: sources[`./ui/${item.fileName}`],
  code: `"use client";\nimport ${item.id} from './components/${item.id}'\n\nexport default function Example() {\n  return <${item.id} />\n}\n`,
}))
const categories = [...new Set(catalog.map(item => item.category))]
const references = [...new Set(catalog.map(item => item.reference))]

export default function ComponentShowcase({ onNavigate }) {
  const [category, setCategory] = useState('All')
  const [reference, setReference] = useState('All')
  const [search, setSearch] = useState('')
  const [previewKey, setPreviewKey] = useState(0)
  const [previewClosed, setPreviewClosed] = useState(false)
  const [previewFeedback, setPreviewFeedback] = useState('')
  const [activeTab, setActiveTab] = useState(COMPONENTS[0].id)
  const [viewMode, setViewMode] = useState('preview') // 'preview' | 'code'
  const [codeTab, setCodeTab] = useState('source') // 'source' | 'usage'
  const [theme, setTheme] = useState('dark') // 'dark' | 'light'
  const [device, setDevice] = useState('desktop') // 'desktop' | 'mobile'
  const [copied, setCopied] = useState(false)

  const filtered = COMPONENTS.filter(c => (category === 'All' || c.category === category) && (reference === 'All' || c.reference === reference) && `${c.name} ${c.description}`.toLowerCase().includes(search.toLowerCase()))
  const activeComp = filtered.find(c => c.id === activeTab) || filtered[0] || COMPONENTS[0]
  const ActiveComponent = activeComp.component

  async function handleCopyCode() {
    const textToCopy = codeTab === 'source' ? activeComp.source : activeComp.code
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
      setPreviewFeedback('Clipboard unavailable. Open Code to select and copy the source.')
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
            {COMPONENTS.length} React Blocks + Source
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
              Original Tailwind CSS v4 &amp; React 19 interfaces, organized by what you need to build.
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
              <span>Get 35-Component Pack ($29)</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Visual Hero Banner with 3D UI Render */}
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-10 shadow-2xl">
          <img
            src="/images/ui-showcase-hero.png"
            alt="Weezie UI 3D Component Suite"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent" />
          
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Flagship Design System
            </span>
            <h2 className="display mt-3 text-2xl font-bold text-white sm:text-3xl">
              High-Velocity UI for Founders Who Build.
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              Tactile micro-interactions, dark glassmorphism, responsive spring states, and zero runtime dependencies. Every block is crafted to convert and ship.
            </p>
          </div>
        </div>

        <section aria-label="Find components" className="mt-8 grid gap-4 rounded-2xl border border-line p-5 md:grid-cols-3">
          <label className="text-xs font-bold">Search components<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Try pricing, cards, motion..." className="mt-2 w-full rounded-xl border border-line bg-paper p-3 text-sm" /></label>
          <label className="text-xs font-bold">Category<select value={category} onChange={e=>setCategory(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-paper p-3 text-sm"><option>All</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
          <label className="text-xs font-bold">Reference collection<select value={reference} onChange={e=>setReference(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-paper p-3 text-sm"><option>All</option>{references.map(r=><option key={r}>{r}</option>)}</select></label>
          <p className="text-xs text-ink-soft md:col-span-3" role="status">{filtered.length} of {COMPONENTS.length} components. Original implementations inspired by the references, with no affiliation. Demo data and backend integrations are clearly separated.</p>
        </section>
        {/* Component Selector Tabs */}
        <div className="mt-8 flex flex-wrap gap-2.5 pb-2">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id)
                setPreviewClosed(false)
                setPreviewFeedback('')
                setViewMode('preview')
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                activeComp.id === item.id
                  ? 'btn-gradient text-white shadow-md'
                  : 'bg-paper text-ink-soft neu-sm hover:text-ink'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {!filtered.length && <p className="mt-6 rounded-xl border border-line p-5">No components match. <button className="underline" onClick={()=>{setSearch('');setCategory('All');setReference('All')}}>Clear filters</button></p>}
        <div hidden={!filtered.length}>
        {/* Active Component Details & View Mode Toggle */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-paper p-5 neu-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue">
              {activeComp.category} / {activeComp.reference}
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
                {!previewClosed && <ActiveComponent key={`${activeComp.id}-${previewKey}`} theme={theme}
                  onClose={()=>setPreviewClosed(true)}
                  onSubmit={value=>setPreviewFeedback(`Demo submitted: ${JSON.stringify(value)}`)}
                  onSelect={value=>setPreviewFeedback(`Selected: ${JSON.stringify(value)}`)}
                  onApply={value=>setPreviewFeedback(`Filters applied: ${JSON.stringify(value)}`)}
                  onComplete={()=>setPreviewFeedback('Demo complete. Connect your own application action.')}
                />}
                <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/15 pt-4 text-xs">
                  <button className="rounded-full border border-current px-4 py-2" onClick={()=>{setPreviewKey(k=>k+1);setPreviewClosed(false);setPreviewFeedback('')}}>Reset demo</button>
                  <span role="status">{previewClosed?'Preview closed. Reset to open it again.':previewFeedback}</span>
                </div>
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
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
      <ProjectBrief />
    </div>
  )
}
