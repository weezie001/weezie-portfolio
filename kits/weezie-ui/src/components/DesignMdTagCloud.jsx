"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function DesignMdTagCloud({ tags=['Minimal','Editorial','Dark','SaaS','Commerce','Playful','Warm','Monochrome'], onChange }) {
 const [selected,setSelected]=useState([])
 function toggle(tag){const next=selected.includes(tag)?selected.filter(t=>t!==tag):[...selected,tag];setSelected(next);onChange?.(next)}
 return <section className={panel}><h2 className="text-3xl font-semibold">A few words. A direction.</h2><p className="mt-3 text-zinc-400">Combine the qualities your interface should express.</p><div className="my-7 flex flex-wrap gap-3">{tags.map(tag=><button key={tag} aria-pressed={selected.includes(tag)} className={`${button} ${selected.includes(tag)?'bg-lime-300 text-black':''}`} onClick={()=>toggle(tag)}>{selected.includes(tag)?'+ ':''}{tag}</button>)}</div><div className="flex items-center justify-between gap-4"><p role="status" className="text-sm text-zinc-400">{selected.length?selected.join(' + '):'No filters selected'}</p><button className={button} onClick={()=>{setSelected([]);onChange?.([])}}>Reset</button></div></section>
}
