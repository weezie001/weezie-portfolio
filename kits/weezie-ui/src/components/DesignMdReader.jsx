"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

const rules = {Overview:`# Field Notes

A quiet, editorial system for independent makers.
Use generous whitespace and short, useful labels.`,Colors:`# Color rules

- Paper: #f4f1e9
- Ink: #252b27
- Accent: #bf5b36

Keep accents for meaningful actions.`,Typography:`# Type rules

Headings: system serif, 40/44px.
Body: system sans-serif, 16/26px.
Labels: monospace, 12/18px.`,Spacing:`# Spacing rules

Base unit: 4px.
Card padding: 24px.
Section gap: 64px.
Touch targets: at least 44px.`}
export default function DesignMdReader({ sections=rules }) {
 const [active,setActive]=useState(Object.keys(sections)[0]),[status,setStatus]=useState('')
 function download(){const blob=new Blob([Object.values(sections).join('\n\n')],{type:'text/markdown'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='DESIGN.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('DESIGN.md downloaded')}
 return <section className={panel}><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-semibold">A design system you can read.</h2><button className={button} onClick={download}>Download DESIGN.md</button></div><div className="mt-6 grid gap-5 sm:grid-cols-[130px_1fr]"><nav aria-label="Design rules" className="flex flex-wrap gap-2 sm:flex-col">{Object.keys(sections).map(k=><button key={k} aria-pressed={k===active} className={`${button} ${active===k?'bg-white text-black':''}`} onClick={()=>setActive(k)}>{k}</button>)}</nav><pre className="min-h-52 whitespace-pre-wrap rounded-xl bg-black/30 p-5 text-sm leading-7 text-zinc-300">{sections[active]}</pre></div><p role="status" className="mt-3 text-xs">{status}</p></section>
}
