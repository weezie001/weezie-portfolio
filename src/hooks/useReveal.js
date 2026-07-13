import { useEffect } from 'react'

// Reveal-on-enter: each `.reveal` element slides in from its side and STAYS put
// while it's on screen. It only resets once fully scrolled out of view, so
// scrolling back up plays the same entrance again. Side comes from
// `.from-left` / `.from-right` (or is picked from the element's position).
// Respects prefers-reduced-motion.
export function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = [...document.querySelectorAll('.reveal')]

    if (reduce) { els.forEach((el) => el.classList.add('in')); return }

    const vw = window.innerWidth
    els.forEach((el, i) => {
      if (el.classList.contains('from-left') || el.classList.contains('from-right') || el.classList.contains('from-up')) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const narrow = r.width < vw * 0.66
      if (narrow && cx < vw * 0.42) el.classList.add('from-left')
      else if (narrow && cx > vw * 0.58) el.classList.add('from-right')
      else el.classList.add(i % 2 === 0 ? 'from-left' : 'from-right')
    })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in')
          else e.target.classList.remove('in')
        })
      },
      { threshold: 0.14 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
