"use client";
import { useState } from 'react'
import artwork from './assets/cobalt-arch.png'

export default function MinimalCard({ title='Form & space', category='Objects / Editorial', year='2026', url='https://example.com', imageUrl=artwork, initialBookmarks=0, onBookmarkChange, className='' }) {
  const [saved,setSaved]=useState(false)
  function bookmark(){const next=!saved;setSaved(next);onBookmarkChange?.(next,initialBookmarks+Number(next))}
  return <article className={`[font-family:Arial,Helvetica,sans-serif] group mx-auto w-full max-w-xl rounded-[18px] border border-[#e2e1db] bg-[#faf9f6] p-2.5 text-[#242622] [font-family:Arial,Helvetica,sans-serif] ${className}`}>
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e8e5dd]">
      <a href={url} target="_blank" rel="noreferrer" aria-label={`Explore ${title}`} className="block h-full focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#284cd8]"><img src={imageUrl} alt="Cobalt glass and quiet architectural forms" className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(.2,.65,.3,1)] group-hover:scale-[1.025]" loading="lazy"/></a>
      <button onClick={bookmark} type="button" aria-pressed={saved} aria-label={saved?'Remove bookmark':'Bookmark this site'} className={`absolute right-4 top-4 flex h-10 min-w-10 items-center justify-center gap-2 rounded-full px-3 backdrop-blur-md motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-[#284cd8] ${saved?'bg-[#284cd8] text-white':'bg-white/85 text-[#242622] hover:bg-white'}`}>
        <svg width="14" height="17" viewBox="0 0 14 17" fill={saved?'currentColor':'none'} stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M2 1h10v14l-5-3-5 3z"/></svg><span className="text-[11px] tabular-nums">{initialBookmarks+Number(saved)}</span>
      </button>
      <span className="absolute bottom-4 left-4 rounded-md bg-white/85 px-2.5 py-1.5 text-[10px] uppercase tracking-[.15em] backdrop-blur-md">Independent / Selected</span>
    </div>
    <div className="flex items-center justify-between gap-4 px-2 pb-3 pt-5"><div><h3 className="text-[18px] font-medium tracking-[-.035em]">{title}</h3><p className="mt-1.5 text-[11px] text-[#777b72]">{category} <span className="mx-2 text-[#c2c5ba]">/</span> {year}</p></div><a href={url} target="_blank" rel="noreferrer" aria-label={`Visit ${title}`} className="grid h-9 w-9 place-items-center rounded-full border border-[#d9dcd2] text-xl motion-safe:transition-colors hover:bg-[#eceee7] focus-visible:outline-2 focus-visible:outline-[#284cd8]">↗</a></div>
  </article>
}
