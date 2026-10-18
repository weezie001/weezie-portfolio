"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function ReferoRotatingHeadline({ words = ['a clearer story', 'a better first impression', 'your next big idea'], interval = 3200 }) {
  const [index,setIndex]=useState(0), [playing,setPlaying]=useState(false)
  useEffect(()=>{if(!playing || !words.length)return;const timer=setInterval(()=>setIndex(i=>(i+1)%words.length),Math.max(1000,interval));return()=>clearInterval(timer)},[playing,words.length,interval])
  return <section className={panel}><p className="text-xs uppercase tracking-[.3em] text-lime-300">A little less ordinary</p><h2 className="my-8 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Make room for<br/><span key={index} className="text-lime-300">{words[index%words.length] || 'something new'}.</span></h2><div className="flex gap-3"><button className={button} onClick={()=>setPlaying(!playing)}>{playing?'Pause rotation':'Play rotation'}</button><button className={button} onClick={()=>setIndex(i=>(i+1)%Math.max(1,words.length))}>Next phrase</button></div><p className="mt-5 text-xs text-zinc-400">A headline that changes at your pace.</p></section>
}
