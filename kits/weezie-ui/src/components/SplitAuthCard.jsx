"use client";
import { useState } from 'react'

/**
 * SplitAuthCard — Weezie UI
 * High-converting split-screen authentication card with brand quote panel, social OAuth,
 * and email magic link sign-in.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function SplitAuthCard({
  brandName = "Weezie Studio",
  headline = "Build and ship software with unstoppable momentum.",
  testimonial = "“Using this component suite cut our design-to-production time from 3 weeks down to 2 days. The code is spotless.”",
  authorName = "Marcus Vance",
  authorRole = "CTO at Hypergrowth AI",
  onSubmitEmail = () => {},
  onOAuthSignIn = () => {},
  className = "",
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    try {
      await onSubmitEmail(email)
      setStatus('sent')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className={`mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl ${className}`}>
      <div className="grid lg:grid-cols-12">
        
        {/* Left Editorial Visual Panel */}
        <div className="relative flex flex-col justify-between overflow-hidden p-8 sm:p-12 lg:col-span-5">
          {/* Photorealistic 3D Liquid Glass Background */}
          <img
            src="/images/auth-scene.png"
            alt="Atmospheric 3D Liquid Glass"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/40 backdrop-blur-[2px]" />

          {/* Brand header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="font-mono text-lg font-black text-white">W</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">{brandName}</span>
          </div>

          {/* Testimonial body */}
          <div className="relative z-10 my-12 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
            <p className="text-lg font-medium leading-relaxed tracking-tight text-white sm:text-xl">
              {headline}
            </p>
            <blockquote className="mt-4 border-l-2 border-white/40 pl-3 text-xs italic leading-relaxed text-zinc-300">
              {testimonial}
            </blockquote>
            <div className="mt-3">
              <p className="text-xs font-bold text-white">{authorName}</p>
              <p className="text-[11px] text-zinc-400">{authorRole}</p>
            </div>
          </div>

          {/* Footer badge */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
            <span>Over 2,400+ developers shipping daily</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Sign in with your work email or favorite OAuth provider.
            </p>

            {/* OAuth Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onOAuthSignIn('github')}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-white/10"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
              <button
                type="button"
                onClick={() => onOAuthSignIn('google')}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-white/10"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6 text-center text-xs text-zinc-500">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-zinc-950 px-3 uppercase tracking-wider text-[10px]">
                or continue with email
              </span>
            </div>

            {/* Email Form */}
            {status === 'sent' ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                <p className="text-sm font-bold text-emerald-400">Magic Link Sent! ✉️</p>
                <p className="mt-1 text-xs text-emerald-300/80">
                  We sent a sign-in link to <strong>{email}</strong>. Check your inbox to proceed.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-3 text-xs font-semibold text-white underline hover:text-zinc-200"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-blue-500 focus:bg-white/[0.08]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-full bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending Magic Link…' : 'Send Magic Link →'}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-[11px] text-zinc-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
