"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function MotionSceneTimeline({ scenes=[{title:'An idea',text:'Start with the question worth answering.',color:'#d6ccf2'},{title:'A direction',text:'Give the idea a shape people can understand.',color:'#cdd9c1'},{title:'A beginning',text:'Put it in the world. Learn. Make it better.',color:'#f5c595'}] }) {
 const [progress,setProgress]=useState(0);const index=Math.min(scenes.length-1,Math.floor(progress/100*scenes.length));const scene=scenes[index]
 return <section className={panel}><div className="relative min-h-64 overflow-hidden rounded-2xl p-7 text-zinc-900 motion-safe:transition-colors" style={{background:scene?.color}}><span className="text-xs">SCENE 0{index+1}</span><div className="mt-12 max-w-sm"><h2 className="text-4xl font-semibold">{scene?.title}</h2><p className="mt-4">{scene?.text}</p></div><span className="absolute right-4 top-6 text-7xl opacity-10">0{index+1}</span></div><label className="mt-6 block text-sm">Scrub the story: {progress}%<input type="range" min="0" max="100" value={progress} onChange={e=>setProgress(Number(e.target.value))} className="mt-3 w-full accent-lime-300"/></label></section>
}
