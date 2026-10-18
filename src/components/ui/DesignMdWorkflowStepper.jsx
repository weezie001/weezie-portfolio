"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function DesignMdWorkflowStepper({ steps = [{title:'Choose',text:'Pick a visual direction that suits your product.'},{title:'Configure',text:'Set your colors, typography and spacing tokens.'},{title:'Build',text:'Use the components and check your real content.'}] }) {
 const [active,setActive]=useState(0)
 return <section className={panel}><p className="text-xs uppercase tracking-widest text-lime-300">From idea to interface</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{steps.map((s,i)=><button key={s.title} aria-current={i===active?'step':undefined} className={`rounded-2xl border p-5 text-left ${active===i?'border-lime-300 bg-lime-300/10':'border-white/15'}`} onClick={()=>setActive(i)}><span className="text-xs text-zinc-400">0{i+1}</span><h2 className="mt-5 text-xl font-semibold">{s.title}</h2></button>)}</div><p className="my-6 min-h-12 text-zinc-300" aria-live="polite">{steps[active]?.text}</p><div className="flex justify-between"><button className={button} disabled={active===0} onClick={()=>setActive(active-1)}>Back</button><button className={button} disabled={active>=steps.length-1} onClick={()=>setActive(active+1)}>Next step</button></div></section>
}
