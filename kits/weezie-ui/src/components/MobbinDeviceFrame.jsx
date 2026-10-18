"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function MobbinDeviceFrame({ children, title='Your day, in focus', time='9:41' }) {
 const [done,setDone]=useState([])
 return <div className="mx-auto w-full max-w-[330px] rounded-[44px] border-[8px] border-zinc-700 bg-[#f4f1e9] p-3 text-zinc-900 shadow-2xl"><div className="flex items-center justify-between px-3 py-2 text-xs font-bold"><span>{time}</span><span aria-hidden="true" className="h-5 w-20 rounded-full bg-black"/><span>100%</span></div><div className="h-[470px] overflow-y-auto rounded-[28px] p-4">{children||<><p className="mt-8 text-xs uppercase tracking-widest">FIELD / DAILY</p><h2 className="my-5 font-serif text-4xl">{title}</h2><div className="mb-6 rounded-3xl bg-[#cdd9c1] p-6"><p className="text-4xl">{done.length}/3</p><p className="mt-2 text-sm">small things, done well</p></div>{['Take a short walk','Read ten pages','Make something'].map(task=><label key={task} className="my-3 flex items-center gap-3 rounded-2xl bg-white p-4 text-sm"><input type="checkbox" checked={done.includes(task)} onChange={()=>setDone(done.includes(task)?done.filter(t=>t!==task):[...done,task])}/>{task}</label>)}</>}</div><div className="mx-auto my-2 h-1 w-24 rounded-full bg-black"/></div>
}
