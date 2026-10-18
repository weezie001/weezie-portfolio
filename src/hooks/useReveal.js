import { useEffect } from 'react'

// Reveal-on-enter: each `.reveal` element slides in from its side and STAYS put
// while it's on screen. It only resets once fully scrolled out of view, so
// scrolling back up plays the same entrance again. Side comes from
// `.from-left` / `.from-right` (or is picked from the element's position).
// Respects prefers-reduced-motion.
export function useReveal(path = '/') {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function revealElement(el) {
      if (!el) return
      el.classList.add('in')
    }

    function checkAll() {
      const vh = window.innerHeight || document.documentElement.clientHeight
      const els = document.querySelectorAll('.reveal:not(.in)')
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        // If element is in view or slightly below/above the viewport
        if (r.top <= vh * 1.25 && r.bottom >= -150) {
          revealElement(el)
        }
      })
    }

    // Force instant reveal for any element in active hash target
    if (window.location.hash) {
      try {
        const target = document.querySelector(window.location.hash)
        if (target) {
          target.querySelectorAll('.reveal').forEach(revealElement)
        }
      } catch {}
    }

    const els = [...document.querySelectorAll('.reveal')]
    if (reduce) {
      els.forEach(revealElement)
      return
    }

    const vw = window.innerWidth
    els.forEach((el, i) => {
      if (
        el.classList.contains('from-left') ||
        el.classList.contains('from-right') ||
        el.classList.contains('from-up')
      )
        return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const narrow = r.width < vw * 0.66
      if (narrow && cx < vw * 0.42) el.classList.add('from-left')
      else if (narrow && cx > vw * 0.58) el.classList.add('from-right')
      else el.classList.add(i % 2 === 0 ? 'from-left' : 'from-right')
    })

    // Check visible elements immediately
    checkAll()
    const t1 = setTimeout(checkAll, 60)
    const t2 = setTimeout(checkAll, 300)

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            revealElement(e.target)
          }
        })
      },
      { rootMargin: '0px 0px 150px 0px', threshold: 0.01 },
    )
    els.forEach((el) => io.observe(el))

    window.addEventListener('scroll', checkAll, { passive: true })
    window.addEventListener('hashchange', checkAll)
    window.addEventListener('popstate', checkAll)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      io.disconnect()
      window.removeEventListener('scroll', checkAll)
      window.removeEventListener('hashchange', checkAll)
      window.removeEventListener('popstate', checkAll)
    }
  }, [path])
}
