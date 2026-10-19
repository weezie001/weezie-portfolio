"use client";
import { useState, useEffect } from 'react'
import artwork from './assets/cobalt-arch.png'

/**
 * MobbinDeviceFrame — Weezie UI (Inspired by Mobbin)
 * Editorial mobile device frame with brushed titanium bezel,
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
  const [viewMode, setViewMode] = useState('interactive') // 'interactive' | 'editorial'

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
    <div className={`[font-family:Arial,Helvetica,sans-serif] mx-auto flex flex-col items-center ${className}`}>
      {/* Top Controller: Toggle between Live Interactive & Editorial Artwork */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-[#e0e5d6] bg-[#fbfcf7]/80 p-1.5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setViewMode('interactive')}
          className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
            viewMode === 'interactive'
              ? 'bg-[#252a20] text-white shadow-md'
              : 'text-[#88927a] hover:text-[#272c22]'
          }`}
        >
          📱 Live Interactive Screen
        </button>
        <button
          type="button"
          onClick={() => setViewMode('editorial')}
          className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
            viewMode === 'editorial'
              ? 'bg-[#252a20] text-white shadow-md'
              : 'text-[#88927a] hover:text-[#272c22]'
          }`}
        >
          ✨ Editorial Render
        </button>
      </div>

      {/* Titanium Hardware Chassis */}
      <div className="relative mx-auto w-full max-w-[360px] rounded-[52px] border-[10px] border-zinc-800 bg-[#f8f8f3] p-2 text-[#272c22] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black">
        {/* Hardware side buttons simulation */}
        <div className="absolute -left-[14px] top-28 h-10 w-1 rounded-l-md bg-zinc-700" />
        <div className="absolute -left-[14px] top-42 h-12 w-1 rounded-l-md bg-zinc-700" />
        <div className="absolute -left-[14px] top-58 h-12 w-1 rounded-l-md bg-zinc-700" />
        <div className="absolute -right-[14px] top-36 h-16 w-1 rounded-r-md bg-zinc-700" />

        {/* OLED Screen Area */}
        <div className="relative h-[660px] w-full overflow-hidden rounded-[42px] bg-black">
          {/* Top Status Bar & Interactive Dynamic Island */}
          <div className="relative z-30 flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-[#272c22]">
            <span className="font-mono">{currentTime}</span>

            {/* Dynamic Island */}
            <div
              onClick={() => setIslandExpanded(!islandExpanded)}
              className={`cursor-pointer rounded-full bg-black border border-[#e0e5d6] px-3 py-1 text-[10px] font-mono text-[#272c22] transition-all duration-300 ${
                islandExpanded ? 'w-48 py-2 bg-[#fbfcf7] border-blue-500/40' : 'h-6 w-24'
              }`}
            >
              {islandExpanded ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#284cd8]">
                    <span className="h-2 w-2 rounded-full bg-[#284cd8] motion-safe:animate-pulse" />
                    Apple Pay
                  </span>
                  <span className="text-[#88927a]">Done ✓</span>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e5e9dd]" />
                </div>
              )}
            </div>

            {/* Battery & Signal */}
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span>5G</span>
              <div className="flex h-2.5 w-5 items-center rounded-sm border border-[#d2dcc3]/60 p-0.5">
                <div className="h-full w-full rounded-2xs bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* Screen Content: Either Editorial Artwork OR Live Interactive App */}
          {viewMode === 'editorial' ? (
            <div className="relative h-full w-full">
              <img
                src={artwork}
                alt="Mobile App Interface"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-6 inset-x-6 rounded-xl bg-black/80 p-3 backdrop-blur-md border border-[#e0e5d6] text-center">
                <p className="text-xs font-bold text-[#272c22]">Editorial Mobile Render</p>
                <p className="text-[10px] text-[#88927a] mt-0.5">Edge-to-edge OLED glass preview</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between p-5 pt-8">
              {children || (
                <div className="space-y-4">
                  {/* User Profile Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-[#272c22] shadow-md">
                        W
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#272c22]">Weezie Vault</p>
                        <p className="text-[10px] text-emerald-400">● Tier-1 Security Active</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBalanceHidden(!balanceHidden)}
                      className="rounded-full border border-[#e0e5d6] bg-[#e9eee0] p-2 text-xs text-[#88927a] hover:text-[#272c22]"
                      title="Toggle balance visibility"
                    >
                      {balanceHidden ? '👁️' : '🔒'}
                    </button>
                  </div>

                  {/* Balance Card */}
                  <div className="rounded-[18px] border border-[#e0e5d6] bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 shadow-[0_8px_32px_-24px_#35402540]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#88927a]">
                      Total Net Liquidity
                    </span>
                    <p className="display mt-1 text-3xl font-extrabold text-[#272c22]">
                      {balanceHidden ? '••••••••' : '$64,820.50'}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400">+18.4% this month</span>
                      <span className="text-[#929d83]">USD Vault</span>
                    </div>

                    {/* Quick action buttons */}
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-[#e0e5d6] bg-[#e1e9d5] py-2.5 text-center text-xs font-bold text-[#272c22] transition-all hover:bg-white/20 active:scale-95"
                      >
                        Deposit
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-[#e0e5d6] bg-[#e1e9d5] py-2.5 text-center text-xs font-bold text-[#272c22] transition-all hover:bg-white/20 active:scale-95"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-[#e0e5d6] bg-[#e1e9d5] py-2.5 text-center text-xs font-bold text-[#272c22] transition-all hover:bg-white/20 active:scale-95"
                      >
                        Swap
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#88927a]">
                      Recent Activity
                    </span>
                    {[
                      { name: 'Stripe Settlement', time: '12m ago', amt: '+$2,400.00', plus: true },
                      { name: 'Cloudflare Pro', time: '2h ago', amt: '-$20.00', plus: false },
                      { name: 'Client Retainer', time: 'Yesterday', amt: '+$4,500.00', plus: true },
                    ].map((tx) => (
                      <div
                        key={tx.name}
                        className="flex items-center justify-between rounded-xl border border-[#e5eadb] bg-[#fbfcf7]/60 p-3"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#272c22]">{tx.name}</p>
                          <p className="text-[10px] text-[#929d83]">{tx.time}</p>
                        </div>
                        <span className={`font-mono text-xs font-bold ${tx.plus ? 'text-emerald-400' : 'text-[#727b65]'}`}>
                          {tx.amt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Dock Navigation Bar */}
              <div className="mb-4 flex items-center justify-around rounded-xl border border-[#e0e5d6] bg-[#fbfcf7]/90 py-2.5 backdrop-blur-md">
                {['Home', 'Cards', 'Stats', 'Vault'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`text-xs font-bold transition-colors ${
                      activeTab === tab.toLowerCase() ? 'text-[#284cd8] scale-105' : 'text-[#929d83] hover:text-[#727b65]'
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
