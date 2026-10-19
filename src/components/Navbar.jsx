import { useEffect, useState } from 'react'
import { site } from '../data.js'

const links = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Templates', href: '/templates' },
  { label: 'Components', href: '/components' },
  { label: 'AI Lab', href: '/ai-lab' },
  { label: 'Store', href: '/store' },
]

export default function Navbar({ onNavigate, currentPath = '/' }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHome = currentPath === '/' || currentPath === ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLinkClick(e, href) {
    if (href.startsWith('#')) {
      if (isHome) {
        // smooth scroll on home
        const target = document.querySelector(href)
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: 'smooth' })
          target.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'))
          setOpen(false)
        }
      } else {
        // on subpage, navigate to home with hash
        if (onNavigate) {
          e.preventDefault()
          onNavigate('/' + href)
          setOpen(false)
        }
      }
      return
    }

    if (href.startsWith('/')) {
      if (onNavigate) {
        e.preventDefault()
        onNavigate(href)
        setOpen(false)
      }
    }
  }

  // Header background styling:
  // On home: transparent at top, blurred dark on scroll.
  // On subpages: always solid dark luxury glass with crisp border.
  const headerBg = !isHome
    ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg'
    : scrolled
      ? 'bg-ink/90 backdrop-blur-md border-b border-white/5'
      : 'bg-transparent'

  return (
    <header className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${headerBg}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10" aria-label="Main">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault()
              if (isHome) {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                onNavigate('/')
              }
            }
          }}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white group"
        >
          <img
            src="/favicon.png"
            alt="Weezie Logo"
            className="h-7 w-7 rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="display">
            {site.logo.replace('.', '')}<span className="text-blue">.</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => {
            const isActive =
              l.href.startsWith('/') &&
              (currentPath === l.href ||
                currentPath === l.href + '/' ||
                (l.href !== '/' && currentPath.startsWith(l.href)))

            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleLinkClick(e, l.href)}
                  className={`relative text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                    isActive ? 'text-blue' : 'text-white/80'
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-blue" />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* CTA Contact Button */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="btn-gradient rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Contact Me
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 items-center justify-center text-white md:hidden focus-visible:outline-2 focus-visible:outline-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <ul className="flex flex-col gap-1 border-t border-white/10 bg-zinc-950/98 px-6 pb-6 pt-3 shadow-2xl backdrop-blur-2xl md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleLinkClick(e, l.href)}
                className="block px-3 py-3 text-base font-bold uppercase tracking-[0.08em] text-white/90 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
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
