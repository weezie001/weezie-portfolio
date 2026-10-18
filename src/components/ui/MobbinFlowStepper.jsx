"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function MobbinFlowStepper({ steps=[{title:'Welcome',text:'Explain the value before asking for anything.',action:'Get started'},{title:'Preferences',text:'Let people choose what matters to them.',action:'Save preferences'},{title:'Ready',text:'Make the next useful action obvious.',action:'Start exploring'}], onComplete }) {
 const [active,setActive]=useState(0),[complete,setComplete]=useState(false)
 return <section className={panel}><div className="flex gap-2">{steps.map((s,i)=><button key={s.title} aria-label={`Step ${i+1}: ${s.title}`} aria-current={active===i?'step':undefined} className={`h-2 flex-1 rounded-full ${i<=active?'bg-lime-300':'bg-white/20'}`} onClick={()=>{setActive(i);setComplete(false)}}/>)}</div><p className="mt-8 text-xs text-zinc-400">STEP {active+1} / {steps.length}</p><h2 className="my-4 text-4xl font-semibold">{steps[active]?.title}</h2><p className="mb-8 text-zinc-300">{steps[active]?.text}</p><div className="flex justify-between gap-3"><button className={button} disabled={!active} onClick={()=>{setActive(active-1);setComplete(false)}}>Back</button><button className={`${button} bg-lime-300 text-black`} onClick={()=>active<steps.length-1?setActive(active+1):(setComplete(true),onComplete?.())}>{steps[active]?.action}</button></div><p role="status" className="mt-4 text-sm text-lime-300">{complete?'Demo flow completed. Connect your own next step.':''}</p></section>
}
