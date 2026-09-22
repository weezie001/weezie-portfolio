import { track } from '@vercel/analytics'

// Thin wrapper around Vercel's custom events.
// Wrapped in try/catch so an ad-blocked or absent analytics script can never
// break a click handler — the UI must work whether or not tracking loads.
export function ev(name, props) {
  try {
    track(name, props)
  } catch {
    /* analytics is best-effort, never load-bearing */
  }
}
