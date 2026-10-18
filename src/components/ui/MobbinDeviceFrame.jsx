"use client";
import { useState, useEffect } from 'react'

/**
 * MobbinDeviceFrame — Weezie UI (Inspired by Mobbin)
 * Photorealistic mobile device frame with brushed titanium bezel,
 * interactive Dynamic Island, status bar, and live tactile app interface.
 * Pure React + Tailwind CSS. Zero external dependencies.
 */
export default function MobbinDeviceFrame({
  children,
  initialTab = 'home',
  className = "",
}) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [islandExpanded, setIslandExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState('9:41')
  const [balanceHidden, setBalanceHidden] = useState(false)
  const [viewMode, setViewMode] = useState('interactive') // 'interactive' | 'photorealistic'

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`mx-auto flex flex-col items-center ${className}`}>
      {/* Top Controller: Toggle between Live Interactive & Photorealistic Artwork */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 p-1.5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setViewMode('interactive')}
          className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
            viewMode === 'interactive'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          📱 Live Interactive Screen
        </button>
        <button
          type="button"
          onClick={() => setViewMode('photorealistic')}
          className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
            viewMode === 'photorealistic'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          ✨ Photorealistic Render
        </button>
      </div>

      {/* Titanium Hardware Chassis */}
      <div className="relative mx-auto w-full max-w-[360px] rounded-[52px] border-[10px] border-zinc-800 bg-zinc-950 p-2 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black">
        {/* Hardware side buttons simulation */}
        <div className="absolute -left-[14px] top-28 h-10 w-1 rounded-l-md bg-zinc-700" />
        <div className="absolute -left-[14px] top-42 h-12 w-1 rounded-l-md bg-zinc-700" />
        <div className="absolute -left-[14px] top-58 h-12 w-1 rounded-l-md bg-zinc-700" />
        <div className="absolute -right-[14px] top-36 h-16 w-1 rounded-r-md bg-zinc-700" />

        {/* OLED Screen Area */}
        <div className="relative h-[660px] w-full overflow-hidden rounded-[42px] bg-black">
          {/* Top Status Bar & Interactive Dynamic Island */}
          <div className="relative z-30 flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-white">
            <span className="font-mono">{currentTime}</span>

            {/* Dynamic Island */}
            <div
              onClick={() => setIslandExpanded(!islandExpanded)}
              className={`cursor-pointer rounded-full bg-black border border-white/10 px-3 py-1 text-[10px] font-mono text-white transition-all duration-300 ${
                islandExpanded ? 'w-48 py-2 bg-zinc-900 border-blue-500/40' : 'h-6 w-24'
              }`}
            >
              {islandExpanded ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    Apple Pay
                  </span>
                  <span className="text-zinc-400">Done ✓</span>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                </div>
              )}
            </div>

            {/* Battery & Signal */}
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span>5G</span>
              <div className="flex h-2.5 w-5 items-center rounded-sm border border-white/60 p-0.5">
                <div className="h-full w-full rounded-2xs bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* Screen Content: Either Photorealistic Artwork OR Live Interactive App */}
          {viewMode === 'photorealistic' ? (
            <div className="relative h-full w-full">
              <img
                src="/images/mobile-app-mockup.png"
                alt="Mobile App Interface"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-6 inset-x-6 rounded-2xl bg-black/80 p-3 backdrop-blur-md border border-white/10 text-center">
                <p className="text-xs font-bold text-white">Photorealistic Mobile Render</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Edge-to-edge OLED glass preview</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between p-5 pt-8">
              {children || (
                <div className="space-y-4">
                  {/* User Profile Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white shadow-md">
                        W
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Weezie Vault</p>
                        <p className="text-[10px] text-emerald-400">● Tier-1 Security Active</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBalanceHidden(!balanceHidden)}
                      className="rounded-full border border-white/15 bg-white/5 p-2 text-xs text-zinc-400 hover:text-white"
                      title="Toggle balance visibility"
                    >
                      {balanceHidden ? '👁️' : '🔒'}
                    </button>
                  </div>

                  {/* Balance Card */}
                  <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 shadow-xl">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Total Net Liquidity
                    </span>
                    <p className="display mt-1 text-3xl font-extrabold text-white">
                      {balanceHidden ? '••••••••' : '$64,820.50'}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400">+18.4% this month</span>
                      <span className="text-zinc-500">USD Vault</span>
                    </div>

                    {/* Quick action buttons */}
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        className="rounded-2xl border border-white/10 bg-white/10 py-2.5 text-center text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95"
                      >
                        Deposit
                      </button>
                      <button
                        type="button"
                        className="rounded-2xl border border-white/10 bg-white/10 py-2.5 text-center text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        className="rounded-2xl border border-white/10 bg-white/10 py-2.5 text-center text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95"
                      >
                        Swap
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Recent Activity
                    </span>
                    {[
                      { name: 'Stripe Settlement', time: '12m ago', amt: '+$2,400.00', plus: true },
                      { name: 'Cloudflare Pro', time: '2h ago', amt: '-$20.00', plus: false },
                      { name: 'Client Retainer', time: 'Yesterday', amt: '+$4,500.00', plus: true },
                    ].map((tx) => (
                      <div
                        key={tx.name}
                        className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-900/60 p-3"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{tx.name}</p>
                          <p className="text-[10px] text-zinc-500">{tx.time}</p>
                        </div>
                        <span className={`font-mono text-xs font-bold ${tx.plus ? 'text-emerald-400' : 'text-zinc-300'}`}>
                          {tx.amt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Dock Navigation Bar */}
              <div className="mb-4 flex items-center justify-around rounded-2xl border border-white/10 bg-zinc-900/90 py-2.5 backdrop-blur-md">
                {['Home', 'Cards', 'Stats', 'Vault'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`text-xs font-bold transition-colors ${
                      activeTab === tab.toLowerCase() ? 'text-blue-400 scale-105' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* iPhone Home Bottom Swipe Bar */}
          <div className="absolute bottom-2 inset-x-0 flex justify-center z-30">
            <div className="h-1 w-32 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  )
}
