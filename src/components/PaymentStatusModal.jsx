"use client";
import { useState } from 'react'
import { Doodle } from './Doodles.jsx'
import { site } from '../data.js'

/**
 * PaymentStatusModal — Weezie Studio
 * Branded transactional modal handling all 3 payment states:
 * 1. Confirmed (Celebration character + Order receipt + Instant Download)
 * 2. Pending / Verifying (Contemplating character + Live verification mesh)
 * 3. Failed / Incomplete (Empathy character + Reason explanation + Direct Transfer alternative)
 *
 * Infused with official Weezie brand assets (3D cut-out characters, crown/star doodles,
 * neu-morphic paper styling, and luxury gradients).
 */
export default function PaymentStatusModal({
  isOpen = false,
  status = 'confirmed', // 'confirmed' | 'pending' | 'failed'
  order = {},
  onClose = () => {},
  onRetry = () => {},
  onSwitchState = null, // optional preview switcher
}) {
  const [copiedRef, setCopiedRef] = useState(false)
  const [copiedBank, setCopiedBank] = useState(false)
  const [showBankDetails, setShowBankDetails] = useState(false)

  if (!isOpen) return null

  const reference = order.reference || `WZ-${Date.now().toString().slice(-8)}`
  const itemTitle = order.itemTitle || order.item_title || 'Digital Product'
  const amount = order.amount ? (typeof order.amount === 'number' ? order.amount.toLocaleString('en-US') : order.amount) : '35,000'
  const currency = order.currency || 'NGN'
  const formattedPrice = currency === 'NGN' ? `₦${amount}` : `$${amount}`
  const buyerEmail = order.email || order.buyer_email || 'your-email@domain.com'
  const downloadUrl = order.downloadUrl || order.download_url || '/downloads/weezie-ui-components.zip'
  const errorReason = order.errorReason || order.error || 'Transaction was cancelled or declined by your issuing bank before authorization.'

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference)
      setCopiedRef(true)
      setTimeout(() => setCopiedRef(false), 2200)
    } catch {
      setCopiedRef(false)
    }
  }

  async function copyAccountNumber() {
    try {
      await navigator.clipboard.writeText('0123456789')
      setCopiedBank(true)
      setTimeout(() => setCopiedBank(false), 2200)
    } catch {
      setCopiedBank(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Payment Status"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-ink/75 backdrop-blur-md transition-opacity"
        onClick={status === 'pending' ? undefined : onClose}
      />

      {/* Main Branded Modal Card */}
      <div className="relative z-10 my-auto w-full max-w-lg overflow-hidden rounded-[36px] bg-paper p-6 text-ink neu shadow-2xl sm:p-8">
        
        {/* Optional Interactive State Switcher for Instant Testing */}
        {onSwitchState && (
          <div className="mb-4 flex items-center justify-between border-b border-line pb-3 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            <span>Brand Assets Preview</span>
            <div className="flex gap-1.5">
              {['confirmed', 'pending', 'failed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onSwitchState(st)}
                  className={`rounded-full px-2.5 py-0.5 transition-all ${
                    status === st ? 'bg-ink text-white shadow-sm' : 'bg-paper neu-sm text-ink-soft hover:text-ink'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Close Button (disabled while pending) */}
        {status !== 'pending' && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="neu-hover absolute right-6 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-paper text-sm font-bold text-ink neu-sm"
          >
            ✕
          </button>
        )}

        {/* ============================================================== */}
        {/* STATE 1: PAYMENT CONFIRMED (Success Celebration)               */}
        {/* ============================================================== */}
        {status === 'confirmed' && (
          <div className="flex flex-col items-center text-center">
            {/* Top Brand Asset: 3D Celebration Character Scene */}
            <div className="relative mb-3 flex h-36 w-full items-center justify-center overflow-hidden">
              <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
              
              {/* Brand doodle marks */}
              <div className="absolute left-10 top-2 h-7 w-7 text-amber-500 animate-bounce">
                <Doodle name="crown" />
              </div>
              <div className="absolute right-12 top-4 h-6 w-6 text-blue">
                <Doodle name="star" />
              </div>
              <div className="absolute right-8 bottom-2 h-5 w-5 text-emerald-500">
                <Doodle name="ring" />
              </div>

              {/* 3D Cut-out Character */}
              <img
                src="/characters/showing.png"
                alt="Weezie Celebrating Order Confirmation"
                className="relative z-10 h-36 object-contain drop-shadow-xl transition-transform hover:scale-105"
              />
            </div>

            {/* Brand Logo & Pill */}
            <div className="flex items-center gap-2">
              <span className="display text-base font-bold tracking-tight text-ink">
                {site.logo.replace('.', '')}<span className="text-blue">.</span>
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                ✓ Payment Confirmed
              </span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="display mt-2 text-2xl text-ink sm:text-3xl">
              You&rsquo;re all set! Files are ready.
            </h3>
            <p className="mt-1.5 text-xs text-ink-soft">
              A copy of your license key and download link was also dispatched to{' '}
              <strong className="text-ink">{buyerEmail}</strong>.
            </p>

            {/* Receipt Summary Card */}
            <div className="mt-5 w-full rounded-2xl bg-paper p-4 text-left neu-inset">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Item Purchased</p>
                  <p className="text-sm font-bold text-ink">{itemTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Amount Paid</p>
                  <p className="display text-sm font-bold text-ink">{formattedPrice}</p>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Order Reference</p>
                  <p className="font-mono text-xs font-bold text-ink">{reference}</p>
                </div>
                <button
                  type="button"
                  onClick={copyReference}
                  className="rounded-full bg-paper px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue neu-sm hover:text-ink transition-all active:scale-95"
                >
                  {copiedRef ? '✓ Copied' : 'Copy Ref'}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex w-full flex-col gap-2.5">
              <a
                href={downloadUrl}
                download
                className="btn-gradient flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase tracking-[0.14em] shadow-lg transition-transform hover:scale-102"
              >
                <span>Download Assets (.zip)</span>
                <span>↓</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="neu-hover rounded-full bg-paper py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft neu-sm hover:text-ink"
              >
                Return to Store
              </button>
            </div>

            {/* Support guarantee footnote */}
            <p className="mt-4 text-center text-[10px] text-ink-soft">
              Protected by Weezie Studio Direct Handover Guarantee. Need help? Message{' '}
              <a href="mailto:hello@weezie.site" className="font-bold text-blue hover:underline">
                hello@weezie.site
              </a>
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 2: PAYMENT PENDING (Verification in Progress)            */}
        {/* ============================================================== */}
        {status === 'pending' && (
          <div className="flex flex-col items-center text-center">
            {/* Top Brand Asset: 3D Contemplating Character Scene */}
            <div className="relative mb-3 flex h-36 w-full items-center justify-center overflow-hidden">
              <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-blue/20 blur-2xl" />

              {/* Pulsing orbital rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-28 w-28 rounded-full border border-blue/20 animate-ping" />
              </div>

              {/* 3D Character */}
              <img
                src="/characters/about.png"
                alt="Weezie Verifying Transaction"
                className="relative z-10 h-36 object-contain drop-shadow-xl"
              />
            </div>

            {/* Brand Logo & Pill */}
            <div className="flex items-center gap-2">
              <span className="display text-base font-bold tracking-tight text-ink">
                {site.logo.replace('.', '')}<span className="text-blue">.</span>
              </span>
              <span className="rounded-full border border-blue/30 bg-blue/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue animate-pulse mr-1" />
                Verifying Gateway
              </span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="display mt-2 text-2xl text-ink sm:text-3xl">
              Confirming your transaction…
            </h3>
            <p className="mt-1.5 text-xs text-ink-soft">
              Validating signature with Paystack and securing your digital license.
            </p>

            {/* Animated Verification Stepper */}
            <div className="mt-5 w-full space-y-2 rounded-2xl bg-paper p-4 text-left neu-inset">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    ✓
                  </span>
                  Paystack Gateway Ping
                </span>
                <span className="font-mono text-[10px] text-emerald-600 font-bold">Authorized</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <span className="h-4 w-4 rounded-full border-2 border-blue border-t-transparent animate-spin" />
                  Cloudflare D1 State Lock
                </span>
                <span className="font-mono text-[10px] text-blue font-bold">Verifying…</span>
              </div>

              <div className="flex items-center justify-between text-xs opacity-50">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-line text-[10px] font-bold text-ink-soft">
                    3
                  </span>
                  Download Token Dispatch
                </span>
                <span className="font-mono text-[10px] text-ink-soft">Queued</span>
              </div>
            </div>

            {/* Important reassurance banner */}
            <div className="mt-5 rounded-2xl border border-blue/20 bg-blue/5 p-3 text-center">
              <p className="text-[11px] font-semibold text-blue">
                🔒 Please keep this tab open — you will be unlocked automatically.
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-soft">
                Order Ref: {reference}
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 3: PAYMENT FAILED / CANCELLED (Empathy & Direct Fallback) */}
        {/* ============================================================== */}
        {status === 'failed' && (
          <div className="flex flex-col items-center text-center">
            {/* Top Brand Asset: 3D Supportive Character Scene */}
            <div className="relative mb-3 flex h-36 w-full items-center justify-center overflow-hidden">
              <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />

              {/* Brand doodle marks */}
              <div className="absolute left-10 top-3 h-6 w-6 text-red-500">
                <Doodle name="arc" />
              </div>
              <div className="absolute right-10 top-3 h-6 w-6 text-amber-500">
                <Doodle name="x" />
              </div>

              {/* 3D Character */}
              <img
                src="/characters/partnership.png"
                alt="Weezie Supportive Handover"
                className="relative z-10 h-36 object-contain drop-shadow-xl"
              />
            </div>

            {/* Brand Logo & Pill */}
            <div className="flex items-center gap-2">
              <span className="display text-base font-bold tracking-tight text-ink">
                {site.logo.replace('.', '')}<span className="text-blue">.</span>
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                Transaction Incomplete
              </span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="display mt-2 text-2xl text-ink sm:text-3xl">
              Payment didn&rsquo;t go through.
            </h3>
            <p className="mt-1.5 text-xs text-ink-soft">
              No funds were deducted from your account. Here is what the gateway reported:
            </p>

            {/* Error Message Box */}
            <div className="mt-4 w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-3.5 text-left">
              <div className="flex items-start gap-2.5">
                <span className="text-sm">⚠️</span>
                <div>
                  <p className="text-xs font-bold text-red-700">Notice from Payment Gateway</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-red-600/90">{errorReason}</p>
                </div>
              </div>
            </div>

            {/* Alternative: Direct Bank Transfer Option (Toggleable) */}
            <div className="mt-4 w-full">
              <button
                type="button"
                onClick={() => setShowBankDetails(!showBankDetails)}
                className="flex w-full items-center justify-between rounded-xl bg-paper p-3 text-xs font-bold text-ink neu-sm transition hover:text-blue"
              >
                <span>🏦 Prefer Direct Bank Transfer (Nigeria / Instant)?</span>
                <span>{showBankDetails ? '▲ Hide' : '▼ View Details'}</span>
              </button>

              {showBankDetails && (
                <div className="mt-2.5 rounded-2xl bg-paper p-4 text-left neu-inset">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-ink-soft">Bank Name</p>
                      <p className="text-xs font-bold text-ink">Access Bank / Kuda</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-ink-soft">Account Name</p>
                      <p className="text-xs font-bold text-ink">Enang Wisdom</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between pt-1">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-ink-soft">Account Number</p>
                      <p className="font-mono text-sm font-bold text-blue">0123456789</p>
                    </div>
                    <button
                      type="button"
                      onClick={copyAccountNumber}
                      className="rounded-full bg-paper px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink neu-sm hover:text-blue"
                    >
                      {copiedBank ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-ink-soft border-t border-line/60 pt-2">
                    After transfer, send proof to <strong className="text-ink">hello@weezie.site</strong> or WhatsApp for instant file unlock.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex w-full flex-col gap-2.5">
              <button
                type="button"
                onClick={onRetry}
                className="btn-gradient flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase tracking-[0.14em] shadow-lg transition-transform hover:scale-102"
              >
                <span>Try Again with Paystack</span>
                <span>→</span>
              </button>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/2348000000000?text=${encodeURIComponent(`Hi Enang, my payment failed for ${itemTitle} (Ref: ${reference}). Could you assist?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="neu-hover flex-1 rounded-full bg-paper py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-green-700 neu-sm"
                >
                  WhatsApp Help 💬
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="neu-hover flex-1 rounded-full bg-paper py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft neu-sm hover:text-ink"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
