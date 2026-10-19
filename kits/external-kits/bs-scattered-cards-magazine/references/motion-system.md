# Motion system

Motion here behaves like paper on a table: things settle, lift a little when
touched and never perform. Every animation answers "what does this tell the
reader?" If it only decorates, remove it.

## Tokens

```css
--ease-out: cubic-bezier(.23, 1, .32, 1);     /* entrances, hovers, lifts */
--ease-in-out: cubic-bezier(.77, 0, .175, 1); /* on-screen moves */
--ease-drawer: cubic-bezier(.32, .72, 0, 1);  /* sheets and drawers */
--d-1: 140ms;  /* press, small state changes */
--d-2: 220ms;  /* colour, border, opacity */
--d-3: 560ms;  /* reveals, accordion, underline, clip-path */
--d-4: 820ms;  /* long reveals; the hero deal itself is 640ms + stagger */
```

Animate only `transform`, `opacity`, `clip-path` and the individual `rotate`
and `translate` properties. Never width, height, top or left (the accordion
uses the `grid-template-rows: 0fr -> 1fr` technique).

## What moves and why

| Element | Motion | Purpose |
| --- | --- | --- |
| Hero fan | Cards rise 28px from upright and deal out to their angles once on load, 640ms ease-out, 60ms stagger from the centre outward | Introduces the signature and the stories it holds |
| Hero copy | Headline, lead and CTA rise 10px and fade in 160ms after the deal starts, 60ms stagger; the whole hero is settled within 900ms | Reading order |
| Hero card hover | Lift 18px and straighten, stronger shadow, photo scales 1.035, caption darkens | Shows the card is a link |
| Arc fan hover (404) | Lift 22px along its own angle, photo scales 1.04, side title fades in | Names the suggested story |
| Section reveals | Opacity 0 to 1 and 18px rise, 700-800ms, `--rd` stagger of 80ms | Paces long pages without hiding content |
| Topic row hover | Name and description shift 10px, thumbnail reveals with `clip-path` | Preview before committing |
| Story and product cards | Image scales 1.035 over 1.1s | Calm affordance |
| Letters | Rotated notes straighten and lift 6px on hover | Physical, on-theme feedback |
| Stats | Count up once when visible, 1.2s ease-out | Draws the eye to the four facts |
| Route change | Current view fades and drops 8px in 160ms, new view rises in 240-320ms, scroll jumps to top | Confirms navigation without delay |
| Article | 2px pine progress line scales with reading position | Orientation in long reads |
| Header | Gains a translucent blurred background and shrinks from 72 to 62px after 40px of scroll | Keeps navigation present but quiet |
| Drawer, menu, search | Slide in 460-480ms on `--ease-drawer`, overlay fades | Spatial continuity |
| Buttons | `scale(.97)` on press; arrow icons nudge 3px on hover; add-to-bag shows a spinner, then "Added" | Feedback |
| Bag badge | Bumps 0.6 to 1.15 to 1 when the count rises | Confirms the add |
| Toast | Rises 14px in, fades out after about 4s | Transient confirmation |

## Reveal pattern with fallbacks

1. A head script adds `class="js"` to `<html>`. Hidden starting states exist
   only under `.js`, so without JavaScript everything is visible.
2. On each route render, elements with `data-reveal` already within 96% of
   the viewport are revealed immediately; the rest are observed by one
   `IntersectionObserver` and revealed once.
3. Without `IntersectionObserver`, or with reduced motion, everything is
   revealed at once.
4. Do not put `data-reveal` on items inside horizontal scrollers; reveal the
   track instead, or off-screen cards stay hidden.
5. Elements that already use `transform` for their own pose (letters, fan
   cards) use the individual `rotate` and `translate` properties so the reveal
   transform does not overwrite them.

## Reduced motion

`@media (prefers-reduced-motion: reduce)` sets all animation and transition
durations to 1ms, removes delays, shows reveal targets and hero copy
immediately, places fan cards at their final angles, disables count-up and
switches smooth scrolling to instant. Route changes still swap content and
scroll to the top.

## Never

- No scroll-jacking, parallax on text, cursor followers or infinite loops
  next to reading text.
- No blur-in on body copy, no bounce, no spin except the loading icon.
- Nothing above the fold waits for scroll to appear.
