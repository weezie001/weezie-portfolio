"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function DesignMdTokenCard({ title='Field Notes', author='Weezie Studio', onSave, tokens={background:'#f4f1e9',text:'#252b27',accent:'#bf5b36'} }) {
 const [saved,setSaved]=useState(false),[status,setStatus]=useState('')
 async function copy(){try{await navigator.clipboard.writeText(JSON.stringify(tokens,null,2));setStatus('Tokens copied')}catch{setStatus('Copy unavailable. Values are shown below.')}}
 return <article className={panel}><div className="flex justify-between gap-4"><div><p className="text-xs text-zinc-400">DESIGN SYSTEM / ORIGINAL</p><h2 className="mt-2 text-3xl font-semibold">{title}</h2></div><button aria-pressed={saved} className={button} onClick={()=>{setSaved(!saved);onSave?.(!saved)}}>{saved?'Saved':'Save'}</button></div><div className="my-6 flex overflow-hidden rounded-2xl">{Object.entries(tokens).map(([key,value])=><div key={key} className="flex-1"><div className="h-20" style={{background:value}}/><code className="block bg-black/30 p-2 text-[10px]">{value}</code></div>)}</div><div className="flex items-center justify-between gap-3"><span className="text-sm text-zinc-400">By {author}</span><button className={button} onClick={copy}>Copy tokens</button></div><p role="status" className="mt-3 text-xs text-lime-300">{status}</p></article>
}
