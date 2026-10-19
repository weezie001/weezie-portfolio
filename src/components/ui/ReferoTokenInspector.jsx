"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] rounded-[18px] border border-[#e0e5d6] bg-[#fbfcf7] p-5 text-[#272c22] sm:p-8"
const button = "rounded-full border border-[#d8dfca] px-4 py-2 text-sm transition hover:bg-[#e1e9d5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#284cd8] disabled:opacity-40"
const field = "w-full rounded-xl border border-[#d8dfca] bg-[#e9eee0] px-4 py-3 text-[#272c22] focus:outline-2 focus:outline-[#284cd8]"

export default function ReferoTokenInspector({ colors = {'Ink':'#18181b','Paper':'#f4f4f5','Accent':'#bef264','Muted':'#a1a1aa'} }) {
 const [status,setStatus]=useState('Choose a swatch to copy its value.')
 async function copy(value){try{await navigator.clipboard.writeText(value);setStatus(`Copied ${value}`)}catch{setStatus(`Copy manually: ${value}`)}}
 return <section className={panel}><h2 className="text-2xl font-semibold">The details make the system.</h2><div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{Object.entries(colors).map(([name,value])=><button className="overflow-hidden rounded-xl border border-[#d8dfca] text-left focus-visible:outline-2 focus-visible:outline-[#284cd8]" key={name} onClick={()=>copy(value)}><span className="block h-20" style={{background:value}}/><span className="block p-3 text-xs">{name}<br/>{value}</span></button>)}</div><div className="grid gap-6 sm:grid-cols-2"><div><p className="text-xs text-[#88927a]">TYPE / SYSTEM SANS</p><p className="text-3xl font-semibold">Aa. Clear by design.</p></div><div><p className="text-xs text-[#88927a]">SPACE / 4PX BASE</p><div className="mt-3 flex items-end gap-2">{[4,8,16,24,32].map(n=><div key={n} className="bg-[#284cd8] text-center text-[10px] text-black" style={{height:n+20,width:n+16}}>{n}</div>)}</div></div></div><p role="status" className="mt-6 text-xs text-[#88927a]">{status}</p></section>
}
