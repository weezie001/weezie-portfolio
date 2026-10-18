"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function ReferoSoftTabs({ items = [{label:'Trending',text:'Fresh directions with warm surfaces and confident typography.'},{label:'Popular',text:'Familiar patterns that make the next action easy to find.'},{label:'Newest',text:'Recently added experiments, ready for a closer look.'}], onChange }) {
 const [active,setActive]=useState(0);const id=useId();const refs=useRef([])
 function select(i){setActive(i);onChange?.(items[i]);refs.current[i]?.focus()}
 return <section className={panel}><div role="tablist" aria-label="Browse styles" className="flex flex-wrap gap-1 rounded-2xl bg-black/40 p-1">{items.map((item,i)=><button ref={el=>refs.current[i]=el} id={`${id}-${i}`} aria-controls={`${id}-panel-${i}`} role="tab" aria-selected={active===i} tabIndex={active===i?0:-1} key={item.label} onClick={()=>select(i)} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();select(e.key==='Home'?0:e.key==='End'?items.length-1:(i+(e.key==='ArrowRight'?1:-1)+items.length)%items.length)}}} className={`${button} flex-1 ${i===active?'bg-lime-300 text-black':''}`}>{item.label}</button>)}</div>{items.map((item,i)=><div role="tabpanel" hidden={i!==active} id={`${id}-panel-${i}`} aria-labelledby={`${id}-${i}`} tabIndex={0} key={item.label} className="pt-8"><h2 className="text-3xl font-semibold">{item.label} directions</h2><p className="mt-4 text-zinc-300">{item.text}</p></div>)}</section>
}
