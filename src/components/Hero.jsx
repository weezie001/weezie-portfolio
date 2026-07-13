import { useEffect, useRef, useState } from 'react'
import { site } from '../data.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'

// Types a word, pauses, deletes it, moves to the next — forever.
function useTypewriter(words) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[i % words.length]
    const done = !deleting && text === word
    const empty = deleting && text === ''

    const t = setTimeout(() => {
      if (done) return setDeleting(true)
      if (empty) { setDeleting(false); return setI(i + 1) }
      setText(word.slice(0, text.length + (deleting ? -1 : 1)))
    }, done ? 1600 : deleting ? 45 : 110)

    return () => clearTimeout(t)
  }, [text, deleting, i, words])

  return text
}

const NAMES = ['ENANG WEEZIE', 'WEB DESIGNER', 'PRODUCT BUILDER']

export default function Hero() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const videoRef = useRef(null)
  const typed = useTypewriter(NAMES)
  const [muted, setMuted] = useState(true)

  const src = isDesktop ? site.video.landscape : site.video.portrait
  const poster = isDesktop ? site.video.landscapePoster : site.video.portraitPoster

  useEffect(() => {
    const v = videoRef.current
    if (v && !reduceMotion) v.play?.().catch(() => {})
  }, [src, reduceMotion])

  // Auto-unmute on the visitor's first interaction so the intro actually talks.
  useEffect(() => {
    if (reduceMotion) return
    function onFirst() {
      const v = videoRef.current
      if (v && v.muted) {
        v.muted = false
        setMuted(false)
        v.play?.().catch(() => {})
      }
      remove()
    }
    function remove() {
      window.removeEventListener('pointerdown', onFirst)
      window.removeEventListener('keydown', onFirst)
    }
    window.addEventListener('pointerdown', onFirst, { once: true })
    window.addEventListener('keydown', onFirst, { once: true })
    return remove
  }, [reduceMotion])

  function toggleSound() {
    const v = videoRef.current
    if (!v) return
    const next = !muted
    setMuted(next)
    v.muted = next
    if (!next) { v.currentTime = 0; v.play?.().catch(() => {}) }
  }

  // When the intro finishes, glide down to the game.
  function handleEnded() {
    document.querySelector('#play')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative flex h-dvh min-h-[560px] items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        key={src}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        autoPlay={!reduceMotion}
        onEnded={handleEnded}
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" aria-hidden="true" />

      <div className="relative z-10 px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">
          &lt;/&gt; Designer &amp; Product Builder
        </p>
        <h1 className="display mt-5 min-h-[1.1em] text-[13vw] leading-none text-white sm:text-7xl md:text-8xl">
          {typed || ' '}
          <span className="caret font-light text-white" aria-hidden="true">|</span>
        </h1>
        <p className="sr-only">Enang Weezie — Web Designer and Product Builder</p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#work"
            className="btn-gradient rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            View My Work
          </a>
          <a
            href="#play"
            className="rounded-full bg-white/95 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-ink transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Win 30% Off
          </a>
        </div>
      </div>

      {/* sound toggle */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? 'Unmute intro' : 'Mute intro'}
        className="absolute bottom-6 left-6 z-10 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
      >
        {muted ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9v6h4l5 5V4L8 9H4z" /><path d="M16 9l4 6M20 9l-4 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
            Tap for sound
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9v6h4l5 5V4L8 9H4z" /><path d="M16 8a5 5 0 010 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
            Sound on
          </>
        )}
      </button>

      {/* scroll cue */}
      <a
        href="#play"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/80 transition-colors hover:text-white"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="floaty">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}
