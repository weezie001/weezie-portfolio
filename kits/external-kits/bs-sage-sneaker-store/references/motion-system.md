# Motion system

Motion is calm and functional. It confirms actions, explains state changes and
introduces the hero once. It never hides content that a visitor needs.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(.23, 1, .32, 1)` | Entrances, hovers, popovers, reveals |
| `--ease-in-out` | `cubic-bezier(.77, 0, .175, 1)` | On-screen movement (rare) |
| `--ease-drawer` | `cubic-bezier(.32, .72, 0, 1)` | Drawers, sheets, sticky buy bar |
| `--d-press` | 140 ms | `:active` scale 0.97 on buttons, chips, icon buttons |
| `--d-fast` | 180 ms | Colour, border, icon nudges, tooltips, hotspot notes |
| `--d-base` | 260 ms | Tabs, accordion rows, nav underline, search dialog |
| `--d-enter` | 640 ms | Scroll reveals |
| Drawer | 420 ms | Mini-cart, mobile menu, filter sheet |
| Route | 380 ms | Page fade and 10 px rise |

Animate only `transform`, `opacity` and (for the accordion) `grid-template-rows`.
Never animate width, height, top or left.

## What moves and why

| Element | Motion | Purpose |
| --- | --- | --- |
| Hero headline | Each of the three lines slides up from a clipped mask, 620 ms, 70 ms stagger | Introduces the brand statement once |
| Hero eyebrow, subline, search, pills | Fade and 10 px rise, 500 ms, 50 ms stagger from 180 ms | Reading order of the first screen |
| Hero service card | Opacity/10 px transition after 380 ms (a transition, so it does not replay when it reappears at a wider breakpoint) | Arrives last, quietly |
| Hero photo | Settles from scale 1.03 to 1 over 900 ms | Quiet depth, no loop |

The whole hero entrance ends within 900 ms.
| Section content | Opacity and 18 px rise once on entering the viewport, 70 ms stagger | Rhythm while scrolling |
| Route change | New page fades and rises 10 px, 380 ms; scroll to top; focus the H1 | Spatial continuity between pages |
| Product media | Image scales to 1.07 on card hover, 900 ms | Affordance for the whole-card link |
| Quick add, popovers | Scale 0.97 to 1 and fade, 240 ms, from the trigger side | Origin-aware feedback |
| Drawer and sheets | Slide from the edge with `--ease-drawer`; overlay fades | Where the panel lives |
| Bag badge | Single 420 ms bump when an item is added | Confirms the add without a modal |
| Price on width change | Brief colour flash and 3 px drop | Shows the price changed |
| Size grid without a selection | 360 ms shake plus an inline message | Explains why nothing was added |
| Free-delivery meter | `scaleX` to the new ratio, 500 ms | Progress toward a threshold |
| Accordion | `grid-template-rows: 0fr` to `1fr`, plus icon rotates | Reveals answers without layout jumps |

No marquees, no infinite loops next to text, no parallax tied to scroll
events, no custom cursors. The gallery zoom follows the pointer only while it
is over the product image on fine pointers.

## Reveal pattern with fallback

```html
<script>document.documentElement.classList.add('js');</script>
```

```css
.js.io .reveal { opacity: 0; transform: translateY(18px);
  transition: opacity var(--d-enter) var(--ease-out), transform var(--d-enter) var(--ease-out);
  transition-delay: calc(var(--i, 0) * 70ms); }
.js.io .reveal.is-in { opacity: 1; transform: none; }
```

- The `io` class is added only when `IntersectionObserver` exists and reduced
  motion is off, so without JS or IO everything is visible.
- On every route render, elements already inside the viewport get `is-in`
  immediately; the rest are observed and revealed once, then unobserved.
- Rendered grids (filters, tabs) call the same function so new cards never sit
  invisible.
- Route transitions use `animation-fill-mode: backwards` and remove the class
  on `animationend`, so no transform lingers on the page. A lingering transform
  would trap fixed drawers and sheets below the overlay.

## Reduced motion

`@media (prefers-reduced-motion: reduce)` sets every animation and transition
to 1 ms, makes reveals and the hero lines visible immediately, and the script
skips loading delays, smooth scrolling and route animations. Feedback still
happens (badge counts, messages, drawer opening) without movement.
