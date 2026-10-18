"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function MotionSignalGrid({ size=8 }) {
 const [active,setActive]=useState(0),[playing,setPlaying]=useState(false);const count=Math.min(12,Math.max(3,size))
 useEffect(()=>{if(!playing)return;const t=setInterval(()=>setActive(i=>(i+1)%count),250);return()=>clearInterval(t)},[playing,count])
 return <section className={panel}><div className="mb-6 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">Signal / light study</h2><button className={button} aria-pressed={playing} onClick={()=>setPlaying(!playing)}>{playing?'Pause':'Play'}</button></div><div className="grid gap-2" style={{gridTemplateColumns:`repeat(${count},minmax(0,1fr))`}} aria-hidden="true">{Array.from({length:count*count},(_,i)=><div key={i} className="aspect-square rounded-full motion-safe:transition-colors" style={{background:i%count===active?'#bef264':'#27272a',opacity:1-Math.abs(Math.floor(i/count)-count/2)/count}}/>)}</div><label className="mt-6 block text-sm">Active column<input type="range" min="0" max={count-1} value={active} onChange={e=>{setPlaying(false);setActive(Number(e.target.value))}} className="mt-2 w-full accent-lime-300"/></label></section>
}
