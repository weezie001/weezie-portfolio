# Motion system

Motion in beacon is calm and explanatory. It reveals content in reading order,
shows the product doing its job, and acknowledges every action. It never hides
content, never loops next to reading text, and never hijacks scroll.

## Tokens

```css
--ease-out:    cubic-bezier(.22, 1, .36, 1);   /* entrances, reveals */
--ease-snap:   cubic-bezier(.23, 1, .32, 1);   /* hovers, presses, popovers */
--ease-in-out: cubic-bezier(.77, 0, .175, 1);  /* on-screen movement */
--t-press: 140ms;   /* :active scale */
--t-ui: 200ms;      /* hover, color, chevrons, menus */
--t-panel: 280ms;   /* tabs, accordion, header condense, route change */
--t-reveal: 700ms;  /* scroll reveals */
--stagger: 70ms;    /* sibling delay via --i */
```

Animate only `transform`, `opacity`, `clip-path`, `stroke-dashoffset`,
`grid-template-rows` (accordion) and, sparingly, `filter`. Never width,
height, top or left.

## What moves and why

| Element | Motion | Why |
| --- | --- | --- |
| Hero badge, H1, subtitle, CTAs | fade + rise 14px, 620ms, 60ms stagger, CSS animation on load; all done by ~0.85s | first read in order, no waiting for scroll |
| Hero beam | opacity fade over 900ms, once (CTA and bento beams keep their slower fade) | the light switches on |
| Console chart (`#product`) | drawn on load; p95/p50 lines replay their 1.4s draw (`stroke-dashoffset`) the first time the console is 20% visible, and redraw on range switch | shows live data |
| Console alert toast | slides in once, 0.9s after the console first enters view | demonstrates paging |
| Checks counter | +180..440 every 2.6s, only while the console is visible and the tab is foreground | the product is alive |
| Region vignette | six rows light up 320ms apart, then the verdict; plays once when 45% visible; "Replay" button | explains confirmation |
| Section content | `.rv`: opacity 0 to 1, translateY(18px) to 0, 700ms, stagger by `--i`; `.rv-scale` adds scale(.985) for large surfaces | quiet reading order |
| Stats | count up once over 1.4s (ease-out cubic) at 60% visibility | emphasis |
| Header | backdrop + hairline + 72px to 60px height when scrolled | context |
| Mega menu | opacity + translateY(-6px) + scale(.98) from the trigger, 200ms | origin-aware popover |
| Mobile sheet | slides from top 360ms with backdrop | spatial |
| Tabs / tour panels | panel fade + rise 8px, 280ms | state change |
| Accordion, compare table | `grid-template-rows: 0fr` to `1fr`, 280-420ms | height without layout jank |
| Price switch | new number blurs in 360ms | state change |
| Routes | view fades + rises 10px, 300ms; scroll to top; focus H1 | page change |
| Buttons, chips, filters | `:active` scale(.975); arrows nudge 3px on hover | feedback |
| Toasts | rise 12px + fade 320ms; auto-dismiss 4.8s | confirmation |
| Live dot | one soft ping every 2.4s, only on real status (incident chip, footer status) | semantic state |

## Reveal pattern with fallback

1. A head script adds `class="js"` to `<html>` before paint. Reveal styles
   only exist under `.js`, so without JavaScript nothing is hidden.
2. The same head script sets a 2.5s timer: if the main script has not set
   `window.__pgReady`, it adds `.no-reveal`, which forces every `.rv` visible.
3. The main script reveals everything already in the viewport immediately,
   then observes the rest with one IntersectionObserver
   (`rootMargin: 0px 0px -6% 0px`, `threshold: .08`) and unobserves after the
   first reveal. Without IntersectionObserver, everything is revealed at once.
4. When a route view becomes visible, its `.rv` elements are scanned again.

```css
.js .rv { opacity: 0; transform: translateY(18px);
  transition: opacity var(--t-reveal) var(--ease-out), transform var(--t-reveal) var(--ease-out);
  transition-delay: calc(var(--i, 0) * var(--stagger)); }
.js .rv.is-in { opacity: 1; transform: none; }
.no-reveal .rv { opacity: 1 !important; transform: none !important; }
```

Smooth scrolling is done in JS on link clicks only (`scrollIntoView` with
`behavior: smooth`), not with `html { scroll-behavior: smooth }`, so
programmatic scrolls, screenshots and "back to top" on route changes stay
instant.

## Reduced motion

`@media (prefers-reduced-motion: reduce)` and the `reduceMotion` flag in JS:

- every animation and transition collapses to ~0ms; reveals, hero entrance
  and the toast are shown in their final state;
- chart lines render fully drawn; the region vignette shows its final state;
- the live counter and the ping dots stop; count-ups jump to the final value;
- smooth scrolling becomes instant. Color and opacity state changes remain.

## Never

Scroll-jacking, parallax on text, cursor followers, bouncing or spinning
entrances, blur-in on body text, infinite marquees beside reading text,
animating anything triggered by a keyboard shortcut, or entrances longer
than 800ms for UI.
