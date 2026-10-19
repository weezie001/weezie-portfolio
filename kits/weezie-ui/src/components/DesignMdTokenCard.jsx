"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl [font-family:Arial,Helvetica,sans-serif] rounded-[18px] border border-[#e0e5d6] bg-[#fbfcf7] p-5 text-[#272c22] sm:p-8"
const button = "rounded-full border border-[#d8dfca] px-4 py-2 text-sm transition hover:bg-[#e1e9d5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#284cd8] disabled:opacity-40"
const field = "w-full rounded-xl border border-[#d8dfca] bg-[#e9eee0] px-4 py-3 text-[#272c22] focus:outline-2 focus:outline-[#284cd8]"

export default function DesignMdTokenCard({ title='Field Notes', author='Weezie Studio', onSave, tokens={background:'#f4f1e9',text:'#252b27',accent:'#bf5b36'} }) {
 const [saved,setSaved]=useState(false),[status,setStatus]=useState('')
 async function copy(){try{await navigator.clipboard.writeText(JSON.stringify(tokens,null,2));setStatus('Tokens copied')}catch{setStatus('Copy unavailable. Values are shown below.')}}
 return <article className={panel}><div className="flex justify-between gap-4"><div><p className="text-xs text-[#88927a]">DESIGN SYSTEM / ORIGINAL</p><h2 className="mt-2 text-3xl font-semibold">{title}</h2></div><button aria-pressed={saved} className={button} onClick={()=>{setSaved(!saved);onSave?.(!saved)}}>{saved?'Saved':'Save'}</button></div><div className="my-6 flex overflow-hidden rounded-xl">{Object.entries(tokens).map(([key,value])=><div key={key} className="flex-1"><div className="h-20" style={{background:value}}/><code className="block bg-[#e9eee0] p-2 text-[10px]">{value}</code></div>)}</div><div className="flex items-center justify-between gap-3"><span className="text-sm text-[#88927a]">By {author}</span><button className={button} onClick={copy}>Copy tokens</button></div><p role="status" className="mt-3 text-xs text-[#284cd8]">{status}</p></article>
}
