"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] rounded-[18px] border border-[#e0e5d6] bg-[#fbfcf7] p-5 text-[#272c22] sm:p-8"
const button = "rounded-full border border-[#d8dfca] px-4 py-2 text-sm transition hover:bg-[#e1e9d5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#284cd8] disabled:opacity-40"
const field = "w-full rounded-xl border border-[#d8dfca] bg-[#e9eee0] px-4 py-3 text-[#272c22] focus:outline-2 focus:outline-[#284cd8]"

export default function ReferoSoftTabs({ items = [{label:'Trending',text:'Fresh directions with warm surfaces and confident typography.'},{label:'Popular',text:'Familiar patterns that make the next action easy to find.'},{label:'Newest',text:'Recently added experiments, ready for a closer look.'}], onChange }) {
 const [active,setActive]=useState(0);const id=useId();const refs=useRef([])
 function select(i){setActive(i);onChange?.(items[i]);refs.current[i]?.focus()}
 return <section className={panel}><div role="tablist" aria-label="Browse styles" className="flex flex-wrap gap-1 rounded-xl bg-[#e4ecd8] p-1">{items.map((item,i)=><button ref={el=>refs.current[i]=el} id={`${id}-${i}`} aria-controls={`${id}-panel-${i}`} role="tab" aria-selected={active===i} tabIndex={active===i?0:-1} key={item.label} onClick={()=>select(i)} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();select(e.key==='Home'?0:e.key==='End'?items.length-1:(i+(e.key==='ArrowRight'?1:-1)+items.length)%items.length)}}} className={`${button} flex-1 ${i===active?'bg-[#284cd8] text-white':''}`}>{item.label}</button>)}</div>{items.map((item,i)=><div role="tabpanel" hidden={i!==active} id={`${id}-panel-${i}`} aria-labelledby={`${id}-${i}`} tabIndex={0} key={item.label} className="pt-8"><h2 className="text-3xl font-semibold">{item.label} directions</h2><p className="mt-4 text-[#727b65]">{item.text}</p></div>)}</section>
}
