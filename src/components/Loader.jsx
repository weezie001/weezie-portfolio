import { useEffect, useState } from 'react'
import { site } from '../data.js'

export default function Loader() {
  const [gone, setGone] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setGone(true), 1200)
    const t2 = setTimeout(() => setHidden(true), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (hidden) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-100 flex items-center justify-center bg-paper transition-opacity duration-500 ${gone ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <span className="loader-word display text-6xl md:text-8xl text-ink">
        {site.logo.replace('.', '')}
        <span className="text-gradient">.</span>
      </span>
    </div>
  )
}
