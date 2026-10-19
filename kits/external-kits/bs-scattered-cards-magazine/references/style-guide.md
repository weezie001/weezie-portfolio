# Style guide

Scattered-Cards Magazine is a white editorial site with one physical gesture:
paper photographs fanned and scattered across a calm page. Everything else is
quiet: a refined serif, a sober grotesk, fine ink rules, warm photography and
a single pine-green accent. The template (`template.html`) is the source of
truth; this guide names the decisions so they survive new content.

## Typography

Fonts: Newsreader (variable, roman and italic) and Schibsted Grotesk
(variable). The template loads them from the fontsource CDN. In a framework
use `@fontsource-variable/newsreader` and `@fontsource-variable/schibsted-grotesk`
or `next/font/google`. The single-file deliverable never loads fonts at runtime:
`scripts/inline-assets.mjs` downloads the woff2 files once at build time and
embeds them as data URIs.

| Role | Family | Size | Line height | Tracking | Weight |
| --- | --- | --- | --- | --- | --- |
| Hero h1 (home only) | Newsreader | `clamp(38px, 4.8vw, 62px)`, 40px on phones | 1.02 | -.03em, word-spacing .05em | 800 |
| Hero eyebrow | Schibsted Grotesk | 11px uppercase | 1.5 | .2em | 600, muted |
| Hero lead | Schibsted Grotesk | 15px, 14px on phones | 1.55 | 0 | 400, muted, max 30em |
| Page h1 | Newsreader | `clamp(38px, 4.4vw, 64px)` | 1 | -.036em | 400 |
| Article title | Newsreader | `clamp(38px, 4.5vw, 66px)` | .98 | -.04em | 400 |
| Topic h1 | Newsreader | `clamp(40px, 4.5vw, 66px)` | .96 | -.04em | 400 |
| h2 | Newsreader | `clamp(30px, 2.9vw, 42px)` | 1.04 | -.03em | 400 |
| h3 / card title | Newsreader | `clamp(21px, 1.8vw, 26px)` | 1.14 | -.018em | 440 |
| Topic row name | Newsreader | `clamp(22px, 1.95vw, 28px)` | 1.05 | -.03em | 400 |
| Stat figure | Newsreader | `clamp(44px, 4.4vw, 64px)` | .9 | -.045em | 400 |
| h4 | Newsreader | 20px | 1.22 | -.012em | 460 |
| Article body | Newsreader | `clamp(19px, 1.45vw, 21px)` | 1.62 | -.003em | 400, max 660px |
| Dek / pull quote | Newsreader italic | 20-25px / 28-38px | 1.42 / 1.18 | -.01 / -.025em | 380 |
| UI and body | Schibsted Grotesk | 16px | 1.6 | 0 | 400-600 |
| Lead | Schibsted Grotesk | `clamp(17px, 1.35vw, 19px)` | 1.55 | 0 | 400, max 48-58ch |
| Kicker | Schibsted Grotesk | 12px uppercase | 1.4 | .09em | 600 |

Scale ceiling: the hero headline stays at 62px and no section heading goes
above 42px at 1440px; page titles stop at 64-66px. Larger type makes the site
look like a template. The heavy 800 weight belongs to
the home hero alone; every other heading is the 400 roman.

Rules: `text-wrap: balance` on headings, `pretty` on leads. Emphasis inside a
headline is the italic of the same family, never another typeface. Tabular
numerals only on figures (prices, counts, stats); never on prose, because the
tabular feature also widens commas and full stops. No em or en dashes in copy.

## Colour tokens

```css
--paper:#ffffff;      /* page ground */
--ground:#f3f4f0;     /* tinted bands: issue band, letters, stages */
--ground-2:#e8eae4;
--ink:#161816;        /* text, rules, primary buttons */
--ink-2:#3a3e39;      /* secondary text (11:1) */
--muted:#5f645d;      /* meta text (5.9:1 on white) */
--line:rgba(22,24,22,.12);   --line-2:rgba(22,24,22,.24);
--rule:#161816;       /* the 1px ink rule that tops lists and sections */
--accent:#24503b;     /* pine: active nav, links on hover, drop cap, progress, focus */
--accent-soft:#e2ece5;
--danger:#a33a22;     --oak:#b48f62 (frame material only)
```

One accent, used sparingly. Buttons are ink, not accent. No purple, violet or
indigo anywhere (no lavender washes, glows or gradients); the palette is ink,
warm white, tinted grey-green and pine. Selection is pine
with white text. Shadows are tinted with the ink hue, never pure black.

## Layout

- Container 1288px with `clamp(20px, 4vw, 44px)` gutters; 12-column grid,
  `clamp(16px, 2vw, 28px)` gap.
- Section rhythm `clamp(80px, 9vw, 136px)`; tight sections `clamp(56px, 6vw, 88px)`.
- Header 72px (62px when condensed), ink rule under the header, no
  announcement bar above it (the first screen holds only header and hero). Content never starts under the sticky header
  (`scroll-padding-top`).
- Compositions rotate: centred hero, 4/8 split with sticky aside, 7/5
  asymmetric grid, full-bleed feature, carousel, tinted 5/7 band, 4-column
  stats with top rules, scattered letters, bordered newsletter band.

## Radius, rules and shadows

- Paper and photographs: 2px. Covers: 1px. Fields: 6px. Buttons, chips,
  segmented controls, pills: fully rounded. Icon buttons: circles.
- Lists and stats start with a 1px ink rule; rows divide with `--line-2`.
- `--shadow-paper` for resting cards, `--shadow-lift` for hovered or hero
  objects, `--shadow-pop` for sheets and toasts.

## Hero anatomy (home)

The first screen is a fixed composition; keep it exactly. Top to
bottom, all centred: eyebrow (`Independent perspectives / Issue 09`) about
46px below the header rule, the five-card fan 20px below it (335px stage,
235px on phones, bleeding 50px past the gutters), the two-line headline
(`A different way<br>of seeing.`, top edge near 505px at 1440x900 and 404px at
390x844), a two-sentence lead 24px under it, one outlined button
(`Find your next story`, 46px high, 2px radius, 11.5px uppercase with .14em
tracking, fills ink on hover) 24px under that. Plain white ground; no
announcement bar, stat strip, second button, badge, glow or wash. Entrance:
cards deal from 28px below in 640ms with a 60ms stagger from the centre, the
copy rises 10px 160ms later; everything is settled within 900ms and a CSS
failsafe shows it after 2.4s if script never runs.

## Component anatomy

- **Hero fan card** (home): white paper, 10px padding (6px on phones), photo
  215px high (132px on phones), one uppercase topic caption. Five slots in a
  970px stage, `left: calc(4% + i * 16%)`, `top: calc(40px + (i - 2)^2 * 12px)`,
  width 27%, rotated `(i - 2) * 9deg` about the card centre. Desktop: centre
  card on top, captions of the right-hand cards right-aligned. 960px and
  below: stacking rises left to right and every caption sits bottom-left, so
  no caption is covered. Hover lifts 18px and straightens the card.
- **Arc fan card** (not-found page): 4:5 photo with kicker and title,
  rotated by `calc(var(--a) * var(--step))` around `transform-origin: 50% 330%`.
- **Topic row**: number, serif name, one-line description, count, 84px
  thumbnail revealed by `clip-path` on hover, arrow.
- **Story card**: image link (aria-hidden duplicate), kicker with topic link
  and reading time, serif title link, dek, byline and issue.
- **Cover**: 23:30 box with photo, white or ink masthead, issue number and
  season at top right, issue theme in italic under the masthead.
- **Framed print**: white mat (9% padding) on a tinted stage; the oak option
  adds a 14px frame. Options change the preview live.
- **Letter**: white note with `rotate` and `translate` (individual transform
  properties so reveal transforms can stack), straightens on hover.
- **Forms**: label above, hint below, error with icon below that, 50px
  fields, ink focus border plus a pine halo.

## Do

- Keep the fan, the ruled index and the big story photographs as the first
  three things a visitor sees.
- Give every photograph a job and a crop (`object-position`) for each slot.
- Compose covers and prints in HTML so type stays crisp and editable.

## Don't

- Don't add a second accent, gradients or glows.
- Don't put labels or pills on photographs (stock badges on product stages
  are the exception, as on a real shop).
- Don't use the same photograph for unrelated entities.
- Don't let a fan caption be cut by a neighbouring card; shorten or hide it.
- Don't repeat the home hero on inner pages.
