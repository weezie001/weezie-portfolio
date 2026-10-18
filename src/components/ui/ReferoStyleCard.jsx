"use client";
import { useState, useEffect, useRef, useId } from 'react'

// Original Weezie UI implementation. React + Tailwind CSS; no UI dependencies.
const panel = "mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-900 p-5 text-white sm:p-8"
const button = "rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:opacity-40"
const field = "w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white focus:outline-2 focus:outline-lime-300"

export default function ReferoStyleCard({ title='Studio Journal', description='Warm paper, expressive type, one bright accent.', onSave }) {
 const [saved,setSaved]=useState(false)
 return <article className="mx-auto max-w-lg rounded-[2rem] border border-white/15 bg-zinc-900 p-3 text-white"><div className="aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-[#efe9dd] p-6 text-[#252b27]"><div className="flex justify-between border-b border-black/20 pb-3 text-xs"><span>STUDIO / 01</span><span>Independent ideas</span></div><p className="mt-8 max-w-[240px] font-serif text-4xl leading-none sm:text-5xl">Good things<br/><i>take shape.</i></p><div className="mt-5 h-3 w-16 bg-orange-600"/></div><div className="p-4"><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-semibold">{title}</h2><button aria-pressed={saved} className={button} onClick={()=>{setSaved(!saved);onSave?.(!saved)}}>{saved?'Saved':'Save'}</button></div><p className="mt-3 text-sm text-zinc-400">{description}</p></div></article>
}
