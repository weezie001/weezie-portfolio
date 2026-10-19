"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] rounded-[18px] border border-[#e0e5d6] bg-[#fbfcf7] p-5 text-[#272c22] sm:p-8"
const button = "rounded-full border border-[#d8dfca] px-4 py-2 text-sm transition hover:bg-[#e1e9d5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#284cd8] disabled:opacity-40"
const field = "w-full rounded-xl border border-[#d8dfca] bg-[#e9eee0] px-4 py-3 text-[#272c22] focus:outline-2 focus:outline-[#284cd8]"

export default function DesignMdTagCloud({ tags=['Minimal','Editorial','Dark','SaaS','Commerce','Playful','Warm','Monochrome'], onChange }) {
 const [selected,setSelected]=useState([])
 function toggle(tag){const next=selected.includes(tag)?selected.filter(t=>t!==tag):[...selected,tag];setSelected(next);onChange?.(next)}
 return <section className={panel}><h2 className="text-3xl font-semibold">A few words. A direction.</h2><p className="mt-3 text-[#88927a]">Combine the qualities your interface should express.</p><div className="my-7 flex flex-wrap gap-3">{tags.map(tag=><button key={tag} aria-pressed={selected.includes(tag)} className={`${button} ${selected.includes(tag)?'bg-[#284cd8] text-white':''}`} onClick={()=>toggle(tag)}>{selected.includes(tag)?'+ ':''}{tag}</button>)}</div><div className="flex items-center justify-between gap-4"><p role="status" className="text-sm text-[#88927a]">{selected.length?selected.join(' + '):'No filters selected'}</p><button className={button} onClick={()=>{setSelected([]);onChange?.([])}}>Reset</button></div></section>
}
