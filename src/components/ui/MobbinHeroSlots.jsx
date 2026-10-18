"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function MobbinHeroSlots({ onSelect, items=['Plan','Create','Share'] }) {
 const [active,setActive]=useState(items[0])
 return <section className={panel}><p className="text-xs uppercase tracking-widest text-lime-300">Everyday interfaces, considered</p><h2 className="my-7 text-4xl font-semibold tracking-tight sm:text-6xl">Small screens.<br/>Bigger possibilities.</h2><div className="flex flex-wrap gap-3">{items.map((item,i)=><button key={item} aria-pressed={active===item} onClick={()=>{setActive(item);onSelect?.(item)}} className={`${button} flex items-center gap-3 ${active===item?'bg-lime-300 text-black':''}`}><span className="grid h-10 w-10 place-items-center rounded-xl bg-black/10 font-serif text-2xl">{['P','C','S'][i%3]}</span><span>{item}</span></button>)}</div><p role="status" className="mt-6 text-sm text-zinc-400">Explore the {active?.toLowerCase()} experience.</p></section>
}
