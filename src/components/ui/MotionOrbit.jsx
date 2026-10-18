"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function MotionOrbit({ label='Ideas in motion' }) {
 const [running,setRunning]=useState(false)
 return <section className={panel}><style>{`@keyframes wz-orbit{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.wz-orbit{animation:none!important}}`}</style><div className="relative mx-auto my-5 grid aspect-square w-full max-w-72 place-items-center rounded-full border border-white/20"><div className="absolute inset-6 rounded-full border border-white/10"/><div className="wz-orbit absolute inset-0 rounded-full" style={{animation:'wz-orbit 14s linear infinite',animationPlayState:running?'running':'paused'}}><div className="absolute left-1/2 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-lime-300 shadow-lg"/><div className="absolute bottom-8 left-6 h-9 w-9 rounded-full bg-violet-400"/></div><h2 className="max-w-32 text-center text-3xl font-semibold">{label}</h2></div><button className={button} aria-pressed={running} onClick={()=>setRunning(!running)}>{running?'Pause orbit':'Play orbit'}</button></section>
}
