"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] rounded-[18px] border border-[#e0e5d6] bg-[#fbfcf7] p-5 text-[#272c22] sm:p-8"
const button = "rounded-full border border-[#d8dfca] px-4 py-2 text-sm transition hover:bg-[#e1e9d5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#284cd8] disabled:opacity-40"
const field = "w-full rounded-xl border border-[#d8dfca] bg-[#e9eee0] px-4 py-3 text-[#272c22] focus:outline-2 focus:outline-[#284cd8]"

export default function DesignMdWorkflowStepper({ steps = [{title:'Choose',text:'Pick a visual direction that suits your product.'},{title:'Configure',text:'Set your colors, typography and spacing tokens.'},{title:'Build',text:'Use the components and check your real content.'}] }) {
 const [active,setActive]=useState(0)
 return <section className={panel}><p className="text-xs uppercase tracking-widest text-[#284cd8]">From idea to interface</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{steps.map((s,i)=><button key={s.title} aria-current={i===active?'step':undefined} className={`rounded-xl border p-5 text-left ${active===i?'border-[#284cd8] bg-[#284cd8]/10':'border-[#e0e5d6]'}`} onClick={()=>setActive(i)}><span className="text-xs text-[#88927a]">0{i+1}</span><h2 className="mt-5 text-xl font-semibold">{s.title}</h2></button>)}</div><p className="my-6 min-h-12 text-[#727b65]" aria-live="polite">{steps[active]?.text}</p><div className="flex justify-between"><button className={button} disabled={active===0} onClick={()=>setActive(active-1)}>Back</button><button className={button} disabled={active>=steps.length-1} onClick={()=>setActive(active+1)}>Next step</button></div></section>
}
