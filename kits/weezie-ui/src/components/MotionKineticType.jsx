"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] rounded-[18px] border border-white/15 bg-[#171d20] p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b6c8bd] disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-[#b6c8bd]"

export default function MotionKineticType({ text='MAKE IT MATTER' }) {
 const [spread,setSpread]=useState(0),[weight,setWeight]=useState(700)
 return <section className={panel}><p className="text-xs tracking-widest text-[#b6c8bd]">TYPE / PLAYGROUND</p><h2 className="my-10 break-words text-center text-4xl leading-tight sm:text-6xl motion-safe:transition-all" style={{letterSpacing:`${spread}px`,fontWeight:weight}}>{text}</h2><div className="grid gap-6 sm:grid-cols-2"><label className="text-sm">Letter spacing: {spread}px<input className="mt-3 block w-full accent-lime-300" type="range" min="-2" max="8" value={spread} onChange={e=>setSpread(Number(e.target.value))}/></label><label className="text-sm">Weight: {weight}<input className="mt-3 block w-full accent-lime-300" type="range" min="300" max="900" step="100" value={weight} onChange={e=>setWeight(Number(e.target.value))}/></label></div></section>
}
