"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] rounded-[18px] border border-[#e0e5d6] bg-[#fbfcf7] p-5 text-[#272c22] sm:p-8"
const button = "rounded-full border border-[#d8dfca] px-4 py-2 text-sm transition hover:bg-[#e1e9d5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#284cd8] disabled:opacity-40"
const field = "w-full rounded-xl border border-[#d8dfca] bg-[#e9eee0] px-4 py-3 text-[#272c22] focus:outline-2 focus:outline-[#284cd8]"

export default function MobbinAppIconGrid({ apps=[{name:'Field',category:'Productivity',color:'#cdd9c1'},{name:'Forma',category:'Design',color:'#d6ccf2'},{name:'Tempo',category:'Music',color:'#f5c595'},{name:'Orbit',category:'Learning',color:'#b8dce8'}], onSelect }) {
 const [active,setActive]=useState(null)
 return <section className={panel}><h2 className="mb-7 text-2xl font-semibold">A home for good ideas.</h2><div className="grid grid-cols-2 gap-5 sm:grid-cols-4">{apps.map(app=><button key={app.name} aria-pressed={active?.name===app.name} className="rounded-xl p-2 text-center focus-visible:outline-2 focus-visible:outline-[#284cd8]" onClick={()=>{setActive(app);onSelect?.(app)}}><span style={{background:app.color}} className="mx-auto grid aspect-square w-full max-w-24 place-items-center rounded-[30%] text-4xl font-semibold text-[#272c22] shadow-inner">{app.name[0]}</span><span className="mt-3 block text-sm">{app.name}</span></button>)}</div><p role="status" className="mt-6 text-sm text-[#88927a]">{active?`${active.name} / ${active.category}`:'Select an original demo app to inspect it.'}</p></section>
}
