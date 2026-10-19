"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] rounded-[18px] border border-white/15 bg-[#171d20] p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b6c8bd] disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-[#b6c8bd]"

export default function MotionExplodedStack({ layers=['Interface','Interaction','Data'] }) {
 const [exploded,setExploded]=useState(false)
 return <section className={panel}><div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-semibold">Under the surface.</h2><button className={button} aria-pressed={exploded} onClick={()=>setExploded(!exploded)}>{exploded?'Assemble':'Explode layers'}</button></div><div className="relative mx-auto my-8 h-72 w-full max-w-sm" style={{perspective:900}}>{layers.map((layer,i)=><div key={layer} className="absolute left-[10%] top-12 grid h-36 w-[80%] place-items-center rounded-xl border border-white/30 text-lg font-semibold text-zinc-900 shadow-xl motion-safe:transition-transform motion-safe:duration-700" style={{background:['#cdd9c1','#c1b8aa','#c9a593'][i%3],zIndex:layers.length-i,transform:`rotateX(48deg) rotateZ(-25deg) translateY(${i*(exploded?62:14)}px)`}}>{layer}</div>)}</div><p className="text-sm text-zinc-400">An interactive CSS layer diagram. No 3D engine required.</p></section>
}
