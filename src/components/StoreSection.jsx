import { useEffect, useState } from 'react'
import { storeCategories, storeProducts as fallbackProducts } from '../data.js'
import {
  fetchStoreProducts,
  submitLeadToCRM,
  launchPaystackPopup,
  verifyAndRecordOrder,
} from '../lib/crmStore.js'
import { ev } from '../lib/analytics.js'
import PaymentStatusModal from './PaymentStatusModal.jsx'
import { Doodle } from './Doodles.jsx'
import { site } from '../data.js'

function formatAmount(product, currency) {
  if (product.is_freebie || (product.price_ngn === 0 && product.price_usd === 0)) {
    return 'FREE'
  }
  return currency === 'NGN'
    ? `₦${Number(product.price_ngn || 0).toLocaleString('en-US')}`
    : `$${Number(product.price_usd || 0).toLocaleString('en-US')}`
}

/**
 * Dedicated Pre-Paystack Purchase Pop-up (StoreModal)
 * Styled identically to the Confirmed status modal with:
 * - Brand character & doodles at the top
 * - Product summary & clear pricing
 * - Prominent Free Bonus callout box: Weezie UI (35 React & Tailwind Components) auto-emailed free
 * - Buyer Name & Email inputs
 * - Direct "Proceed to Paystack Checkout" trigger
 * - Crisp borders, sharp shadows, absolutely ZERO white glow
 */
export function StoreModal({ product, currency, onClose, onPaymentStatus }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | processing | unlocked | error
  const [downloadUrl, setDownloadUrl] = useState('')
  const [orderRef, setOrderRef] = useState('')
  const [errMsg, setErrMsg] = useState('')

  if (!product) return null
  const isFreebie = Boolean(product.is_freebie) || (product.price_ngn === 0 && product.price_usd === 0)
  const amount = currency === 'NGN' ? Number(product.price_ngn || 0) : Number(product.price_usd || 0)
  const priceDisplay = formatAmount(product, currency)

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
    // Paystack accounts operate in NGN. Local and international cards process seamlessly.
    const payCurrency = 'NGN'
    const payAmount = Number(product.price_ngn || 0)
    launchPaystackPopup({
      email: email.trim(),
      amount: payAmount,
      currency: payCurrency,
      metadata: {
        custom_fields: [
          { display_name: 'Buyer Name', variable_name: 'buyer_name', value: name.trim() },
          { display_name: 'Product', variable_name: 'product_slug', value: product.slug },
          { display_name: 'Store Currency', variable_name: 'store_currency', value: currency },
        ],
      },
      onSuccess: async ({ reference }) => {
        if (onPaymentStatus) {
          onPaymentStatus({
            isOpen: true,
            status: 'pending',
            order: {
              reference,
              itemTitle: product.title,
              amount: payAmount,
              currency: payCurrency,
              email: email.trim(),
            },
          })
          onClose()
        }

        const verified = await verifyAndRecordOrder({
          reference,
          name: name.trim(),
          email: email.trim(),
          item_type: 'product',
          item_id: product.slug,
          item_title: product.title,
          currency: payCurrency,
          amount: payAmount,
          download_url: product.file_url,
        })

        if (!verified?.ok) {
          if (onPaymentStatus) {
            onPaymentStatus({
              isOpen: true,
              status: 'failed',
              order: {
                reference,
                itemTitle: product.title,
                amount: payAmount,
                currency: payCurrency,
                email: email.trim(),
                errorReason: verified?.error || 'Payment confirmation failed on edge server.',
              },
            })
          } else {
            setErrMsg(verified?.error || 'Payment could not be verified.')
            setStatus('error')
          }
          return
        }

        const finalDownloadUrl = verified.downloadUrl || product.file_url || `/downloads/${product.slug}.zip`
        setOrderRef(reference)
        setDownloadUrl(finalDownloadUrl)
        setStatus('unlocked')

        if (onPaymentStatus) {
          onPaymentStatus({
            isOpen: true,
            status: 'confirmed',
            order: {
              reference,
              itemTitle: product.title,
              amount: payAmount,
              currency: payCurrency,
              email: email.trim(),
              downloadUrl: finalDownloadUrl,
            },
          })
        }
        ev('store_purchase_complete', { slug: product.slug, currency: payCurrency, amount: payAmount })
      },
      onCancel: () => {
        setStatus('idle')
        if (onPaymentStatus) {
          onPaymentStatus({
            isOpen: true,
            status: 'failed',
            order: {
              itemTitle: product.title,
              amount: payAmount,
              currency: payCurrency,
              email: email.trim(),
              errorReason: 'Payment checkout window was closed before completion. No charges were made.',
            },
          })
          onClose()
        }
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      {/* Dark backdrop overlay — solid, clean, no white glow */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Main Card — Crisp border, deep shadow, ZERO white halo */}
      <div className="relative z-10 my-auto w-full max-w-lg overflow-hidden rounded-[28px] bg-paper p-6 text-ink border border-line shadow-2xl sm:p-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-sm font-bold text-ink hover:bg-paper-2 transition active:scale-95"
        >
          ✕
        </button>

        {status === 'unlocked' ? (
          <div className="flex flex-col items-center text-center">
            {/* Celebration Character */}
            <div className="relative mb-3 flex h-32 w-full items-center justify-center overflow-hidden">
              <div className="absolute left-10 top-2 h-6 w-6 text-amber-500 animate-bounce">
                <Doodle name="crown" />
              </div>
              <div className="absolute right-10 top-2 h-6 w-6 text-blue">
                <Doodle name="star" />
              </div>
              <img
                src="/characters/showing.png"
                alt="Weezie Files Ready"
                className="relative z-10 h-32 object-contain drop-shadow-md"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="display text-base font-bold tracking-tight text-ink">
                {site.logo.replace('.', '')}<span className="text-blue">.</span>
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                {isFreebie ? '✓ Freebie Unlocked' : '✓ Payment Confirmed'}
              </span>
            </div>

            <h3 className="display mt-2 text-2xl text-ink sm:text-3xl">Your files are ready</h3>
            <p className="mt-1.5 text-xs text-ink-soft">
              A copy of your download link was also emailed to <strong className="text-ink">{email}</strong>.
            </p>

            <div className="mt-5 flex w-full flex-col gap-2.5">
              <a
                href={downloadUrl}
                download
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md hover:bg-blue-deep transition active:scale-98"
              >
                <span>Download Purchased Pack (.zip)</span>
                <span>↓</span>
              </a>

              {product.slug !== 'weezie-ui-components-bundle' && (
                <a
                  href="/downloads/weezie-ui-components.zip"
                  download
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-blue/40 bg-blue/10 py-3 text-xs font-bold uppercase tracking-[0.12em] text-blue hover:bg-blue/20 transition"
                >
                  <span>🎁 Download Bonus UI Components (.zip)</span>
                  <span>↓</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-line bg-paper py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft hover:text-ink hover:border-ink transition"
              >
                Return to Store
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAction} className="flex flex-col items-center text-center">
            {/* Top Brand Character Scene */}
            <div className="relative mb-2 flex h-28 w-full items-center justify-center overflow-hidden">
              <div className="absolute left-12 top-2 h-6 w-6 text-amber-500">
                <Doodle name="crown" />
              </div>
              <div className="absolute right-12 top-2 h-6 w-6 text-blue">
                <Doodle name="star" />
              </div>
              <img
                src="/characters/showing.png"
                alt="Weezie Order Checkout"
                className="relative z-10 h-28 object-contain drop-shadow-md"
              />
            </div>

            {/* Brand Logo & Pill */}
            <div className="flex items-center gap-2">
              <span className="display text-base font-bold tracking-tight text-ink">
                {site.logo.replace('.', '')}<span className="text-blue">.</span>
              </span>
              <span className="rounded-full border border-blue/30 bg-blue/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue">
                {isFreebie ? 'Instant Free Unlock' : 'Order Checkout'}
              </span>
            </div>

            {/* Modal Title & Subtitle */}
            <h3 className="display mt-2 text-2xl text-ink sm:text-3xl">
              {isFreebie ? 'Claim your free kit' : 'Complete your purchase'}
            </h3>
            <p className="mt-1 text-xs text-ink-soft max-w-sm">
              {isFreebie
                ? 'Enter your email below. We will unlock the package instantly on this screen and send a copy to your inbox.'
                : 'Enter your details to initiate checkout. Instant file delivery + license dispatched upon payment confirmation.'}
            </p>

            {/* Product Summary Card */}
            <div className="mt-4 w-full rounded-2xl bg-paper-2/70 p-3.5 text-left border border-line shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <div>
                  <span className="rounded-full bg-blue/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-blue">
                    {product.category}
                  </span>
                  <p className="mt-1 text-sm font-bold text-ink">{product.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                    {isFreebie ? 'Price' : 'Total'}
                  </p>
                  <p className="display text-base font-bold text-ink">{priceDisplay}</p>
                </div>
              </div>
              <p className="mt-2 text-[11px] font-medium text-ink-soft leading-relaxed">
                {product.tagline || product.description}
              </p>
            </div>

            {/* Free Bonus Weezie UI Component Bundle Callout Box (Prominently stated before Paystack) */}
            {!isFreebie && (
              <div className="mt-3 w-full rounded-2xl border border-blue/30 bg-blue/5 p-3.5 text-left shadow-sm">
                <div className="flex items-start gap-2.5">
                  <span className="text-xl">🎁</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] font-bold text-ink">Free Bonus With This Order</p>
                      <span className="rounded-full bg-blue/15 px-2 py-0.5 text-[9px] font-bold text-blue uppercase">
                        Free $29 Gift
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-ink-soft leading-relaxed">
                      Everyone who purchases this package automatically receives the complete <strong>Weezie UI Bundle (35 React &amp; Tailwind Components, $29 value)</strong> free of charge! Sent directly to your email upon payment confirmation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Input Fields */}
            <div className="mt-4 flex w-full flex-col gap-2.5 text-left">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enang Wisdom"
                  className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink-soft/50 outline-none focus:border-blue transition"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                  Email Address for Delivery *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink-soft/50 outline-none focus:border-blue transition"
                />
              </div>
            </div>

            {errMsg && <p className="mt-2 text-xs font-bold text-red-600">{errMsg}</p>}

            {/* Submit / Proceed to Paystack Button */}
            <div className="mt-4 flex w-full flex-col gap-2">
              <button
                type="submit"
                disabled={status === 'processing'}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md hover:bg-blue-deep transition active:scale-98 disabled:opacity-60"
              >
                {status === 'processing'
                  ? 'Initiating Checkout…'
                  : isFreebie
                    ? 'Send My Free Download →'
                    : currency === 'USD'
                      ? `Proceed to Paystack ($${product.price_usd} · ₦${Number(product.price_ngn || 0).toLocaleString()}) →`
                      : `Proceed to Paystack (₦${Number(product.price_ngn || 0).toLocaleString()}) →`}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-line bg-paper py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft hover:text-ink hover:border-ink transition"
              >
                Cancel
              </button>
            </div>

            {/* Footnote */}
            <p className="mt-3 text-center text-[10px] text-ink-soft">
              {isFreebie
                ? 'Instant download on screen + delivered to your inbox from hello@weezie.site.'
                : '🔒 Secure 256-bit encrypted Paystack checkout. Cards, Transfer, USSD & Apple Pay supported.'}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default function StoreSection({ fullPage = false, onNavigate }) {
  const [products, setProducts] = useState(fallbackProducts)
  const [category, setCategory] = useState('All')
  const [currency, setCurrency] = useState('NGN')
  const [search, setSearch] = useState('')
  const [activeProduct, setActiveProduct] = useState(null)
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    status: 'confirmed',
    order: {},
  })

  useEffect(() => {
    fetchStoreProducts().then(setProducts)

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('reference') || params.get('trxref')
      if (ref) {
        setPaymentModal({
          isOpen: true,
          status: 'pending',
          order: {
            reference: ref,
            itemTitle: 'Digital Product Order',
            amount: 35000,
            currency: 'NGN',
            email: 'client@domain.com',
          },
        })

        verifyAndRecordOrder({ reference: ref, item_type: 'product' }).then((res) => {
          if (res?.ok) {
            setPaymentModal({
              isOpen: true,
              status: 'confirmed',
              order: {
                reference: ref,
                itemTitle: res.order?.item_title || 'Digital Product Order',
                amount: res.order?.amount || 35000,
                currency: res.order?.currency || 'NGN',
                email: res.order?.buyer_email || 'client@domain.com',
                downloadUrl: res.downloadUrl || '/downloads/weezie-ui-components.zip',
              },
            })
          } else {
            setPaymentModal({
              isOpen: true,
              status: 'failed',
              order: {
                reference: ref,
                itemTitle: 'Digital Product Order',
                amount: 35000,
                currency: 'NGN',
                email: 'client@domain.com',
                errorReason: res?.error || 'Payment verification could not be confirmed.',
              },
            })
          }
        })
      }
    }
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
              className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink hover:bg-paper-2 transition"
            >
              ← Back to Portfolio
            </a>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue/10 px-3.5 py-1 text-xs font-bold text-blue">
                Commercial Royalty-Free License
              </span>
            </div>
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

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Currency switch */}
            <div className="flex items-center gap-2 rounded-full bg-paper p-1.5 border border-line">
              {['USD', 'NGN'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCurrency(c)
                    ev('store_currency_switch', { currency: c })
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition ${
                    currency === c ? 'bg-blue text-white shadow-sm' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {c === 'USD' ? '$ USD' : '₦ NGN'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-line pb-6 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {storeCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  category === cat
                    ? 'bg-blue text-white shadow-sm'
                    : 'border border-line bg-paper text-ink-soft hover:text-ink hover:border-ink'
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
              className="w-full rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-medium text-ink outline-none focus:border-blue lg:w-72 transition"
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
                className="flex flex-col justify-between overflow-hidden rounded-[26px] bg-paper p-5 border border-line shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-ink/5 border border-line/50">
                    {item.cover_image ? (
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-paper/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink backdrop-blur-sm border border-line/40">
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

                <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft">
                      {isFree ? 'Email Unlock' : 'Instant Download'}
                    </span>
                    <span className="display text-2xl text-ink">{formatAmount(item, currency)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.preview_url ? (
                      <a
                        href={item.preview_url}
                        onClick={(e) => {
                          if (item.preview_url.startsWith('/') && onNavigate) {
                            e.preventDefault()
                            onNavigate(item.preview_url)
                          }
                        }}
                        target={item.preview_url.startsWith('/') ? undefined : '_blank'}
                        rel="noreferrer"
                        className="rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-bold text-ink-soft hover:text-blue hover:border-blue transition"
                      >
                        Preview ↗
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setActiveProduct(item)}
                      className="rounded-full bg-blue px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-blue-deep shadow-sm transition active:scale-95"
                    >
                      {isFree ? 'Get Freebie →' : 'Get Pack →'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Homepage CTA to view all products on /store */}
        {!fullPage && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl bg-paper p-6 border border-line shadow-sm sm:flex-row">
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
              className="shrink-0 rounded-full bg-blue px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-blue-deep shadow-sm transition"
            >
              Open Full Store (/store) →
            </a>
          </div>
        )}
      </div>

      {/* Pre-Checkout Purchase Pop-up (Opens before Paystack with Bonus announced) */}
      {activeProduct && (
        <StoreModal
          product={activeProduct}
          currency={currency}
          onClose={() => setActiveProduct(null)}
          onPaymentStatus={(statusData) => setPaymentModal(statusData)}
        />
      )}

      {/* Branded Payment Status Modal (Confirmed, Pending, Failed) - strictly ONE modal per action */}
      <PaymentStatusModal
        isOpen={paymentModal.isOpen}
        status={paymentModal.status}
        order={paymentModal.order}
        onClose={() => setPaymentModal((prev) => ({ ...prev, isOpen: false }))}
        onRetry={() => {
          setPaymentModal((prev) => ({ ...prev, isOpen: false }))
        }}
      />
    </section>
  )
}
