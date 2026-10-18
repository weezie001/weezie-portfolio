"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function ReferoPromptSearch({ onSearch, suggestions = ['Warm editorial', 'Calm productivity', 'Bold commerce'] }) {
 const [query,setQuery]=useState(''),[result,setResult]=useState('');const id=useId()
 function submit(e){e.preventDefault();if(!query.trim())return;setResult(query.trim());onSearch?.(query.trim())}
 return <section className={panel}><p className="text-lime-300 text-xs uppercase tracking-widest">Find your direction</p><h2 className="my-5 text-3xl font-semibold">What should it feel like?</h2><form onSubmit={submit} className="flex gap-2"><label htmlFor={id} className="sr-only">Describe a design style</label><input id={id} className={field} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try warm, simple and confident" required/><button className={button} aria-label="Search styles">Go</button></form><div className="mt-4 flex flex-wrap gap-2">{suggestions.map(s=><button className={button} key={s} onClick={()=>setQuery(s)}>{s}</button>)}</div><p role="status" className="mt-6 text-sm text-zinc-400">{result?`Selected direction: ${result}`:'Choose a starting point or write your own.'}</p></section>
}
