import { useEffect, useState } from 'react'
import { storeCategories, storeProducts as fallbackProducts } from '../data.js'
import {
  fetchStoreProducts,
  submitLeadToCRM,
  launchPaystackPopup,
  verifyAndRecordOrder,
} from '../lib/crmStore.js'
import { ev } from '../lib/analytics.js'

function formatAmount(product, currency) {
  if (product.is_freebie || (product.price_ngn === 0 && product.price_usd === 0)) {
    return 'FREE'
  }
  return currency === 'NGN'
    ? `₦${Number(product.price_ngn || 0).toLocaleString('en-US')}`
    : `$${Number(product.price_usd || 0).toLocaleString('en-US')}`
}

export function StoreModal({ product, currency, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | processing | unlocked | error
  const [downloadUrl, setDownloadUrl] = useState('')
  const [orderRef, setOrderRef] = useState('')
  const [errMsg, setErrMsg] = useState('')

  if (!product) return null
  const isFreebie = Boolean(product.is_freebie) || (product.price_ngn === 0 && product.price_usd === 0)
  const amount = currency === 'NGN' ? Number(product.price_ngn || 0) : Number(product.price_usd || 0)

  async function handleAction(e) {
    e.preventDefault()
    setErrMsg('')
    if (!name.trim() || !email.trim()) {
      setErrMsg('Please enter your name and email address.')
      return
    }

    setStatus('processing')
    ev(isFreebie ? 'store_freebie_claim' : 'store_checkout_start', { slug: product.slug, currency })

    if (isFreebie) {
      const res = await submitLeadToCRM({
        name: name.trim(),
        email: email.trim(),
        source: 'freebie',
        product_slug: product.slug,
        plan: product.title,
        message: `Claimed Freebie: ${product.title}`,
      })
      if (res?.ok) {
        setDownloadUrl(res.downloadUrl || product.file_url || '/downloads/weezie-free-hero-pack.zip')
        setStatus('unlocked')
      } else {
        setErrMsg(res?.error || 'Could not unlock freebie. Please try again.')
        setStatus('error')
      }
      return
    }

    // Paid template/product -> Paystack checkout
    launchPaystackPopup({
      email: email.trim(),
      amount,
      currency,
      metadata: {
        custom_fields: [
          { display_name: 'Buyer Name', variable_name: 'buyer_name', value: name.trim() },
          { display_name: 'Product', variable_name: 'product_slug', value: product.slug },
        ],
      },
      onSuccess: async ({ reference }) => {
        const verified = await verifyAndRecordOrder({
          reference,
          name: name.trim(),
          email: email.trim(),
          item_type: 'product',
          item_id: product.slug,
          item_title: product.title,
          currency,
          amount,
          download_url: product.file_url,
        })
        if (!verified?.ok) {
          setErrMsg(verified?.error || 'Payment could not be verified.')
          setStatus('error')
          return
        }
        setOrderRef(reference)
        setDownloadUrl(verified.downloadUrl || product.file_url || `/downloads/${product.slug}.zip`)
        setStatus('unlocked')
        ev('store_purchase_complete', { slug: product.slug, currency, amount })
      },
      onCancel: () => {
        setStatus('idle')
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-paper p-6 neu md:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="neu-hover sticky left-full top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink"
        >
          ✕
        </button>

        <div className="-mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-paper px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue neu-sm">
              {product.category}
            </span>
            {product.badge && (
              <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                {product.badge}
              </span>
            )}
          </div>

          <h3 className="display mt-3 text-2xl text-ink md:text-4xl">{product.title}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink-soft">{product.description}</p>

          {Array.isArray(product.features) && product.features.length > 0 && (
            <div className="mt-5 rounded-2xl bg-paper p-4 neu-inset">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink">What&rsquo;s inside this pack</p>
              <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs font-medium text-ink-soft">
                    <span className="font-bold text-blue">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {status === 'unlocked' ? (
            <div className="mt-6 rounded-2xl bg-paper p-6 text-center neu-inset">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue">
                {isFreebie ? '🎉 Freebie Unlocked!' : `✅ Payment Confirmed (${orderRef})`}
              </p>
              <h4 className="display mt-2 text-2xl text-ink">Your files are ready</h4>
              <p className="mt-2 text-xs font-medium text-ink-soft">
                We also emailed a copy of your download link from <strong>hello@weezie.site</strong> to{' '}
                <strong>{email}</strong>.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a
                  href={downloadUrl}
                  download
                  className="btn-gradient rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em]"
                >
                  Download Pack (.zip) ↓
                </a>
                {product.preview_url && (
                  <a
                    href={product.preview_url}
                    target="_blank"
                    rel="noreferrer"
                    className="neu-hover rounded-full bg-paper px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-ink neu-sm"
                  >
                    Live Preview ↗
                  </a>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleAction} className="mt-6 flex flex-col gap-4 border-t border-line pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
                    {isFreebie ? 'Instant Email Unlock' : 'One-Time License'}
                  </span>
                  <span className="display text-3xl text-ink">{formatAmount(product, currency)}</span>
                </div>
                {product.preview_url && (
                  <a
                    href={product.preview_url}
                    target="_blank"
                    rel="noreferrer"
                    className="neu-hover rounded-full bg-paper px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink neu-sm"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enang Wisdom"
                    className="w-full rounded-xl bg-paper px-4 py-3 text-sm font-medium text-ink outline-none neu-inset focus:ring-2 focus:ring-blue/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                    Email for Download Link *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full rounded-xl bg-paper px-4 py-3 text-sm font-medium text-ink outline-none neu-inset focus:ring-2 focus:ring-blue/50"
                  />
                </div>
              </div>

              {errMsg && <p className="text-xs font-bold text-red-600">{errMsg}</p>}

              <button
                type="submit"
                disabled={status === 'processing'}
                className="btn-gradient mt-1 rounded-full px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-60"
              >
                {status === 'processing'
                  ? 'Processing…'
                  : isFreebie
                    ? 'Send My Free Download →'
                    : `Buy Now (${formatAmount(product, currency)}) via Paystack →`}
              </button>
              <p className="text-center text-[11px] font-medium text-ink-soft">
                {isFreebie
                  ? 'Instant download + sent straight to your inbox from hello@weezie.site.'
                  : 'Secure Paystack checkout (Cards, Bank Transfer, USSD, Apple Pay). Instant download + email receipt.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StoreSection({ fullPage = false, onNavigate }) {
  const [products, setProducts] = useState(fallbackProducts)
  const [category, setCategory] = useState('All')
  const [currency, setCurrency] = useState('USD')
  const [search, setSearch] = useState('')
  const [activeProduct, setActiveProduct] = useState(null)

  useEffect(() => {
    fetchStoreProducts().then(setProducts)
  }, [])

  const filtered = products.filter((p) => {
    const matchCat =
      category === 'All' ||
      (category === 'Freebies' ? p.is_freebie || p.category === 'Freebies' : p.category === category)
    const q = search.trim().toLowerCase()
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const visibleProducts = fullPage ? filtered : filtered.slice(0, 4)

  return (
    <section id="store" className="relative bg-paper px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        {fullPage && (
          <div className="mb-8 flex items-center justify-between">
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
            <a
              href="/admin/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/admin/')
                }
              }}
              className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft hover:text-blue"
            >
              Admin CRM ↗
            </a>
          </div>
        )}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// Digital Store &amp; Freebies</p>
            <h2 className="display mt-2 text-5xl text-ink md:text-7xl">
              TEMPLATES &amp; <span className="text-gradient">AI KITS</span>
            </h2>
            <p className="mt-3 max-w-2xl text-base font-medium text-ink-soft">
              Production-ready landing pages, UI component packs, AI agents, workflows, design systems, and free starter
              kits built by Enang Weezie.
            </p>
          </div>

          {/* Currency switch */}
          <div className="flex items-center gap-2 self-start rounded-full bg-paper p-1.5 neu-inset md:self-auto">
            {['USD', 'NGN'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                  currency === c ? 'btn-gradient text-white shadow' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {c === 'USD' ? '$ USD' : '₦ NGN'}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter bar + search */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {storeCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  category === cat
                    ? 'btn-gradient text-white'
                    : 'neu-hover bg-paper text-ink-soft neu-sm hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {fullPage && (
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates, agents, kits…"
              className="w-full rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink outline-none neu-inset lg:w-72"
            />
          )}
        </div>

        {/* Product Grid */}
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((item) => {
            const isFree = Boolean(item.is_freebie) || (item.price_ngn === 0 && item.price_usd === 0)
            return (
              <article
                key={item.slug || item.id}
                className="neu-hover flex flex-col justify-between overflow-hidden rounded-[26px] bg-paper p-5 neu"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-ink/5 neu-inset">
                    {item.cover_image ? (
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-paper/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink backdrop-blur-sm">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="rounded-full bg-blue px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="display mt-5 text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-ink-soft">{item.tagline}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft">
                      {isFree ? 'Email Unlock' : 'Instant Download'}
                    </span>
                    <span className="display text-2xl text-ink">{formatAmount(item, currency)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveProduct(item)}
                    className="btn-gradient rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em]"
                  >
                    {isFree ? 'Get Freebie →' : 'Buy / Details →'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {/* Homepage CTA to view all products on /store */}
        {!fullPage && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl bg-paper p-6 neu-sm sm:flex-row">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-blue">
                Explore all {products.length} digital products &amp; freebies
              </p>
              <p className="mt-1 text-sm font-medium text-ink-soft">
                Browse landing pages, UI components, AI prompt packs, workflows, and free starter downloads.
              </p>
            </div>
            <a
              href="/store/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/store/')
                }
              }}
              className="btn-gradient shrink-0 rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em]"
            >
              Open Full Store (/store) →
            </a>
          </div>
        )}
      </div>

      {activeProduct && (
        <StoreModal product={activeProduct} currency={currency} onClose={() => setActiveProduct(null)} />
      )}
    </section>
  )
}
