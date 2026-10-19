"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] rounded-[18px] border border-[#e0e5d6] bg-[#fbfcf7] p-5 text-[#272c22] sm:p-8"
const button = "rounded-full border border-[#d8dfca] px-4 py-2 text-sm transition hover:bg-[#e1e9d5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#284cd8] disabled:opacity-40"
const field = "w-full rounded-xl border border-[#d8dfca] bg-[#e9eee0] px-4 py-3 text-[#272c22] focus:outline-2 focus:outline-[#284cd8]"

export default function MobbinFlowStepper({ steps=[{title:'Welcome',text:'Explain the value before asking for anything.',action:'Get started'},{title:'Preferences',text:'Let people choose what matters to them.',action:'Save preferences'},{title:'Ready',text:'Make the next useful action obvious.',action:'Start exploring'}], onComplete }) {
 const [active,setActive]=useState(0),[complete,setComplete]=useState(false)
 return <section className={panel}><div className="flex gap-2">{steps.map((s,i)=><button key={s.title} aria-label={`Step ${i+1}: ${s.title}`} aria-current={active===i?'step':undefined} className={`[font-family:Arial,Helvetica,sans-serif] h-2 flex-1 rounded-full ${i<=active?'bg-[#284cd8]':'bg-white/20'}`} onClick={()=>{setActive(i);setComplete(false)}}/>)}</div><p className="mt-8 text-xs text-[#88927a]">STEP {active+1} / {steps.length}</p><h2 className="my-4 text-4xl font-semibold">{steps[active]?.title}</h2><p className="mb-8 text-[#727b65]">{steps[active]?.text}</p><div className="flex justify-between gap-3"><button className={button} disabled={!active} onClick={()=>{setActive(active-1);setComplete(false)}}>Back</button><button className={`${button} bg-[#284cd8] text-white`} onClick={()=>active<steps.length-1?setActive(active+1):(setComplete(true),onComplete?.())}>{steps[active]?.action}</button></div><p role="status" className="mt-4 text-sm text-[#284cd8]">{complete?'Demo flow completed. Connect your own next step.':''}</p></section>
}
