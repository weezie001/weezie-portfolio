"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function DesignMdCliBox({ commands = {npm:'npm install',pnpm:'pnpm install',yarn:'yarn install'} }) {
 const [manager,setManager]=useState(Object.keys(commands)[0]),[status,setStatus]=useState('');const command=commands[manager]||''
 async function copy(){try{await navigator.clipboard.writeText(command);setStatus('Command copied')}catch{setStatus('Select and copy the command below')}}
 return <section className={panel}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Start with the essentials.</h2><div className="flex gap-1">{Object.keys(commands).map(m=><button key={m} aria-pressed={manager===m} className={`${button} ${manager===m?'bg-white text-black':''}`} onClick={()=>{setManager(m);setStatus('')}}>{m}</button>)}</div></div><div className="my-6 flex items-center gap-4 rounded-xl bg-black p-5"><span className="text-lime-300" aria-hidden="true">$</span><code className="min-w-0 flex-1 overflow-auto text-sm">{command}</code><button className={button} onClick={copy}>Copy</button></div><p className="text-xs text-zinc-400" role="status">{status||'Run inside the extracted starter project.'}</p></section>
}
