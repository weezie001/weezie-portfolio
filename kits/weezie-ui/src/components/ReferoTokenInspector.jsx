"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function ReferoTokenInspector({ colors = {'Ink':'#18181b','Paper':'#f4f4f5','Accent':'#bef264','Muted':'#a1a1aa'} }) {
 const [status,setStatus]=useState('Choose a swatch to copy its value.')
 async function copy(value){try{await navigator.clipboard.writeText(value);setStatus(`Copied ${value}`)}catch{setStatus(`Copy manually: ${value}`)}}
 return <section className={panel}><h2 className="text-2xl font-semibold">The details make the system.</h2><div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{Object.entries(colors).map(([name,value])=><button className="overflow-hidden rounded-xl border border-white/20 text-left focus-visible:outline-2 focus-visible:outline-lime-300" key={name} onClick={()=>copy(value)}><span className="block h-20" style={{background:value}}/><span className="block p-3 text-xs">{name}<br/>{value}</span></button>)}</div><div className="grid gap-6 sm:grid-cols-2"><div><p className="text-xs text-zinc-400">TYPE / SYSTEM SANS</p><p className="text-3xl font-semibold">Aa. Clear by design.</p></div><div><p className="text-xs text-zinc-400">SPACE / 4PX BASE</p><div className="mt-3 flex items-end gap-2">{[4,8,16,24,32].map(n=><div key={n} className="bg-lime-300 text-center text-[10px] text-black" style={{height:n+20,width:n+16}}>{n}</div>)}</div></div></div><p role="status" className="mt-6 text-xs text-zinc-400">{status}</p></section>
}
