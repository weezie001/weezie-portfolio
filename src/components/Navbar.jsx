import { useEffect, useState } from 'react'
import { site } from '../data.js'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Partners', href: '#partners' },
  { label: 'Play', href: '#play' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? 'bg-ink/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10" aria-label="Main">
        <a href="#home" className="display text-xl text-white">
          {site.logo.replace('.', '')}<span className="text-blue">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs font-bold uppercase tracking-[0.12em] text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="btn-gradient hidden rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] md:inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Contact Me
        </a>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 items-center justify-center text-white md:hidden focus-visible:outline-2 focus-visible:outline-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open
              ? <><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></>
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 bg-ink/95 px-6 pb-6 pt-3 backdrop-blur-md md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 text-base font-bold uppercase tracking-[0.08em] text-white/90 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-gradient mt-2 block rounded-full px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.1em]"
            >
              Contact Me
            </a>
          </li>
        </ul>
      )}
    </header>
  )
}
