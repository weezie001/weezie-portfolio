"use client";
import { useState, useRef } from 'react'

/**
 * OtpVerificationInput — Weezie UI
 * 6-digit numeric one-time security code input with auto-advance, backspace navigation,
 * clipboard paste detection, and shake error animation.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function OtpVerificationInput({
  length = 6,
  email = 'alex@acme.studio',
  onComplete = () => {},
  onResend = () => {},
  className = '',
}) {
  const [digits, setDigits] = useState(Array(length).fill(''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(45)
  const inputRefs = useRef([])

  function handleChange(index, value) {
    // Only accept numeric inputs
    const char = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = char
    setDigits(newDigits)
    setError('')

    // Auto-advance to next input if filled
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Trigger complete callback when all digits entered
    if (newDigits.every((d) => d !== '')) {
      handleVerify(newDigits.join(''))
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move back and clear previous
        const newDigits = [...digits]
        newDigits[index - 1] = ''
        setDigits(newDigits)
        inputRefs.current[index - 1]?.focus()
      } else {
        const newDigits = [...digits]
        newDigits[index] = ''
        setDigits(newDigits)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length)
    if (!pasted) return

    const newDigits = Array(length).fill('')
    pasted.split('').forEach((char, i) => {
      newDigits[i] = char
    })
    setDigits(newDigits)
    setError('')

    // Focus last filled or next empty
    const nextIdx = Math.min(pasted.length, length - 1)
    inputRefs.current[nextIdx]?.focus()

    if (newDigits.every((d) => d !== '')) {
      handleVerify(newDigits.join(''))
    }
  }

  async function handleVerify(code) {
    setIsVerifying(true)
    setError('')
    try {
      const res = await onComplete(code)
      if (res && res.error) {
        setError(res.error)
      }
    } catch {
      setError('Invalid or expired verification code. Try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  function handleResendClick() {
    if (resendCooldown > 0) return
    setDigits(Array(length).fill(''))
    setError('')
    onResend()
    setResendCooldown(60)
    inputRefs.current[0]?.focus()
  }

  return (
    <div className={`[font-family:Arial,Helvetica,sans-serif] mx-auto max-w-md rounded-[18px] border border-[#e0e5d6] bg-[#f8f8f3] p-6 text-[#272c22] shadow-[0_12px_40px_-24px_#35402540] sm:p-8 ${className}`}>
      {/* Icon Badge */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#e0e5d6] bg-[#e9eee0] text-[#284cd8]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Header */}
      <div className="mt-5 text-center">
        <h3 className="text-xl font-bold tracking-tight text-[#272c22] sm:text-2xl">
          Check your email
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-[#88927a]">
          We sent a 6-digit security code to <strong className="font-semibold text-zinc-200">{email}</strong>.
          Enter it below to confirm your account.
        </p>
      </div>

      {/* Inputs Grid */}
      <div className="mt-8 flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`h-12 w-11 rounded-xl border text-center font-mono text-xl font-bold outline-none transition-all sm:h-14 sm:w-12 sm:text-2xl ${
              error
                ? 'border-red-500/50 bg-red-500/10 text-red-300'
                : digit
                  ? 'border-blue-500/70 bg-[#284cd8]/10 text-[#272c22] shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'border-[#e0e5d6] bg-white/[0.04] text-[#272c22] focus:border-[#cbd6b9] focus:bg-white/[0.08]'
            }`}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-3 text-center text-xs font-medium text-red-400">
          ⚠️ {error}
        </p>
      )}

      {/* Action CTA */}
      <div className="mt-8">
        <button
          type="button"
          disabled={isVerifying || digits.some((d) => d === '')}
          onClick={() => handleVerify(digits.join(''))}
          className="w-full rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#272c22] transition-all hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-40"
        >
          {isVerifying ? 'Verifying Code…' : 'Confirm & Continue →'}
        </button>
      </div>

      {/* Resend state */}
      <div className="mt-6 text-center text-xs text-[#929d83]">
        Didn't receive the email?{' '}
        <button
          type="button"
          disabled={resendCooldown > 0}
          onClick={handleResendClick}
          className={`font-semibold transition-colors ${
            resendCooldown > 0 ? 'text-[#83916d]' : 'text-[#284cd8] hover:text-blue-300'
          }`}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
        </button>
      </div>
    </div>
  )
}
