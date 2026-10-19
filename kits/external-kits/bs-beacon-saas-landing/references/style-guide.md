# Beacon style guide

A calm, warm-neutral SaaS marketing site lit by one blurred blue light beam.
Everything is quiet typography and hairline surfaces on a warm off-white (or
warm near-black) ground. The only brand chroma is the beacon blue, used as
light: the beam, glows, the top highlight of the product window, focus rings,
links and active states. Never as a painted section background or a gradient
button.

The page earns its premium feel from four things, in this order:
typography, the product rendered as real UI, restraint in color, and small
interaction details that all behave.

## Tokens

Declared once on `:root`, re-declared under `html.dark`. Section markup never
hard-codes these values.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | `#F3F2EE` | `#0E0E10` | page ground |
| `--bg-sunk` | `#ECEAE5` | `#0A0A0B` | recessed bands, segmented controls, table group rows |
| `--surface` | `#FAF9F7` | `#151517` | cards |
| `--surface-raised` | `#FFFFFF` | `#1B1B1E` | product window, featured plan, inputs, popovers |
| `--ink` | `#141416` | `#EDECE8` | headings and primary text |
| `--ink-2` | `#34332F` | `#D2D0CA` | secondary text on cards |
| `--muted` | `#625F59` | `#A3A09A` | body copy, ledes (5.3:1 on `--bg`) |
| `--faint` | `#8B8881` | `#7B7872` | icons, axis labels, placeholders only (never body text) |
| `--line` / `--line-strong` | ink at 9% / 15% | white at 7.5% / 13% | hairlines |
| `--beam` | `#4C9BFF` | `#2F7BFF` | the light: beam, glows, chart line |
| `--accent` | `#1A5FD0` | `#7DB3FF` | text-level blue: links, focus, active nav, checks |
| `--sky` | `#0B4F85` | `#D8E9FF` | top stop of the H1 gradient |
| `--ok` `--warn` `--down` | `#2B9A68` `#C4860F` `#D0473A` | brighter in dark | status semantics inside product UI only |
| `--primary` / `--primary-ink` | ink / off-white | off-white / ink | solid primary button |

Rules:

- One accent. Status green/amber/red appear only where they carry meaning
  (monitors, incidents, uptime bars, form errors). The testimonial star gold
  is the single decorative exception.
- Neutrals are warm-tinted, never pure grey and never pure black or white
  text on the ground. Shadows are tinted (`rgba(40,32,20,…)`), layered, and
  the largest one carries a faint blue cast from the beam.
- Body text contrast is at least 4.5:1. `--faint` is for non-text marks.
- Blues stay between hue 205 and 222deg. Nothing on the page is purple,
  violet, indigo-violet or lavender (hue 235 to 300deg), in either theme.

## Typography

Fonts: **Geist** (variable; UI and display) and **Geist Mono** (variable;
numbers, code, labels inside product UI). The template loads them from the
fontsource CDN. In a framework project install `@fontsource-variable/geist`
and `@fontsource-variable/geist-mono` or use `next/font/google` (`Geist`,
`Geist_Mono`); for the standalone single-file deliverable run
`scripts/inline-assets.mjs`, which embeds both woff2 files as data URIs.
Never load Google Fonts or any other font service in a delivered page.

| Role | Size | Weight | Tracking | Line height |
| --- | --- | --- | --- | --- |
| Hero H1 `.grad-h1` | `clamp(2.5rem, 1.6rem + 2.8vw, 3.75rem)` (40px phone, 60px desktop) | 500 | -0.04em | 1.08 |
| Hero subtitle `.hero-copy .lede` | 1.125rem (18px) | 400 | 0 | 1.5 |
| Route H1 `.page-head .grad-h1` | `clamp(2.25rem, 1.7rem + 1.6vw, 3rem)` | 500 | -0.04em | 1.08 |
| Section H2 `.grad-h2` | `clamp(1.5rem, 1.3rem + .45vw, 1.65rem)` (24 to 26.4px) | 600 | -0.022em | 1.18 |
| CTA card H2 | `clamp(1.5rem, 1.3rem + .6vw, 1.75rem)` | 600 | -0.022em | 1.18 |
| Card H3 | `clamp(1.05rem, 1rem + .15vw, 1.125rem)` | 560 | -0.02em | 1.1 |
| Lede | `clamp(1rem, .96rem + .2vw, 1.125rem)` | 400 | 0 | 1.55 |
| Body | 1rem | 400 | 0 | 1.6 |
| Small / meta | .875rem / .78rem | 400-530 | 0 | 1.45 |
| Stat value | `clamp(2rem, 1.6rem + 1vw, 2.375rem)` | 500 | -0.045em | 1 |
| Price | 2.375rem | 520 | -0.045em | 1 |
| Story pull quote | `clamp(1.2rem, 1.05rem + .5vw, 1.5rem)` | 480 | -0.025em | 1.3 |

The scale is deliberately calm: the hero H1 is the only large type on the
page, and nothing below it competes. Do not grow the H1 past 60px or set it
heavier than 500, and keep section H2s under about 27px. Bigger, bolder type
reads as a template, not as this style.

- The signature **vertical gradient fill**: H1 runs `--sky` to `--ink`
  (the first line reads blue-ink, the second line ink); every H2 runs `--ink`
  into a 62% ink/ground mix. Both use `background-clip: text` and keep a
  small `padding-bottom` so descenders are not clipped.
- Hero headline: two lines on desktop, three on phones, set by
  `text-wrap: balance` inside a 56rem column (no forced breaks). Subtext
  max ~22 words, two lines on desktop, three on phones.
- `text-wrap: balance` on headings, `pretty` on paragraphs, measure 60-75ch.
- Tabular numerals (`font-variant-numeric: tabular-nums`) for every number
  that changes or aligns: KPIs, prices, stats, tables, times.
- No eyebrow above every section. At most one small mono label per three
  sections. No em dashes in copy.

## Spacing, layout, radius

- Container 1240px plus gutters `clamp(16px, 4vw, 40px)`.
- Section rhythm `--section: clamp(88px, 10vw, 156px)`; tight bands use 62%.
- Vary compositions. The default page uses at least seven layout families:
  centered hero, logo row, asymmetric bento, product console section,
  editorial photo split, tabbed window, steps plus code, number band, story card plus
  masonry, pricing cards, icon grid, two-column FAQ, beam CTA card.
- Radius scale (documented rule, keep it): `--r-xs 6px` chips inside product
  UI, `--r-sm 10px` buttons and inputs, `--r-md 16px` cards, `--r-lg 22px`
  shells (product window, photos, CTA, code), `--r-pill` badges and toggles.
  The product window sits inside an 8px translucent frame
  (`.window-frame`) for a layered, device-like edge.

## Surfaces and elevation

- Cards: `--surface`, 1px `--line`, `--shadow-xs`. Raise only what matters:
  the product window (`--shadow-lg`), the featured plan, popovers and toasts.
- The product window gets a 1px top highlight in beam blue
  (`.window::before`), as if the light lands on it.
- One dark card is allowed in the bento (`.cell-b`, the cron terminal) as an
  accent; whole sections never invert. Dark theme is a full theme, toggled.

## The beam

The hero identity: ONE rotated, heavily blurred bar of `--beam` (a soft sky
blue, hue about 213deg, never violet). The field starts 8rem above the hero
so the light runs up behind the transparent header, sits in a 75% slot from
the right, and fades out at the bottom with a mask so it never ends in a
hard edge:

```css
.hero-beam { position:absolute; inset:-8rem 0 0 0; display:flex;
  justify-content:flex-end; align-items:center; overflow:hidden;
  pointer-events:none; mask-image:linear-gradient(180deg,#000 72%,transparent); }
.hero-beam-slot { width:75%; display:flex; justify-content:center; }
.hero-beam-bar { width:3rem; height:37.5rem; border-radius:1.5rem;
  background:var(--beam); filter:blur(70px); transform:rotate(35deg); }
@media (max-width:639.9px) { .hero-beam-bar { transform:rotate(15deg); } }
```

It fades in over 900ms. No second bar, no core, no extra wash or glow in the
hero. Below the hero the light may leak from behind a surface: a soft radial
`.beam-glow` behind the product console and the tour window, a smaller beam
inside the first bento cell, and the bars inside the CTA card. Never a
hard-edged shape, never more than one beam field per viewport, never purple
or lavender.

## Components (anatomy)

- **Buttons**: 44px default, 50px large (46px inside the hero), 36px small.
  Primary is solid ink with an inner top highlight; outline (`.btn-outline`,
  the hero's second button) is a hairline over a faint translucent fill;
  secondary is raised white with a hairline; ghost is text. All have hover, `:active` scale(.975), `:focus-visible` ring
  (`--ring`), disabled, and a loading state (`data-state="loading"` shows a
  spinner and hides the label). One label per intent across the page
  ("Start monitoring free" in the hero, "Start free" in the nav, "Talk to
  sales", "See it in action").
- **Hero (anatomy, keep it this small)**: centered column; a quiet static
  badge (`.badge`, 14px, hairline, no inner tag, no chevron); the two-line
  gradient H1; an 18px subtitle; two 46px buttons (primary + outline); the
  single beam. Badge top sits 104px below the 72px header (H1 top about
  227px at 1440x900 and 390x844). Nothing else: no product UI, stats,
  floating cards, chips or tab rails in the hero.
- **Product console** (`#product`, after the features bento, at most
  1024px wide): sidebar, breadcrumb bar, KPI tiles, chart panel with a
  range switch and hover tooltip, incident and on-call side cards, monitors
  table with 24h status bars. Data uses the product's own vocabulary.
- **Bento cell**: icon chip, H3, two-line blurb, then a live vignette pushed
  to the bottom (`.cell-vis`). Every cell has a visual, and at least two cells
  differ in background.
- **Tabs**: segmented container on `--bg-sunk`, selected tab raised; arrow
  keys, Home/End.
- **Forms**: label above input, helper text, error below with an icon, 46px
  inputs, focus ring, invalid border, live re-validation after first submit,
  loading then success state.
- **Toasts**: dark pill bottom-right, auto-dismiss 4.8s, dismiss button.
- **Footer**: brand + status pill, three link columns, newsletter form,
  legal row, SVG social marks that point to real routes.

## Do and don't

Do:

- Show the product. Build the product console, tour panels and vignettes as
  real HTML/SVG UI with believable data, states and names, below the hero.
- Use photographs only where a real SaaS site would: a customer story, an
  editorial mood image that supports one claim, the team on the contact page,
  testimonial portraits.
- Keep the page quiet: one beam, one accent, generous space, hairlines.

Don't:

- Paint section backgrounds blue, use gradient buttons or a purple AI glow.
- Put trust logos, feature bullets, pricing teasers or the product console
  inside the hero, or pull the headline up to make room for them.
- Use purple, violet, indigo or lavender anywhere: washes, glows, gradients,
  headline words or accent fills. The only chroma is the sky-blue beam.
- Use emoji, Unicode arrows or checkmarks, or icon fonts. Icons are inline SVG.
- Ship text at `opacity: 0` without the `.js` guard and a fallback.
- Use stock photos of laptops or screens with fake UI in them.
- Use round, perfect numbers (`99.99%`, `10K+`) unless they are real.

## Voice

Plain, specific, outcome-first. Headlines state the result ("Know your systems are
up before your users do"). Ledes are one sentence. Feature blurbs are two
sentences at most and name the mechanism ("retried from nearby regions
first"). Numbers are organic and attributable ("72% fewer pages in a team's
first month"). No exclamation marks, no buzzword chains, no em dashes. All
companies, people and quotes are fictional unless the user supplies real
ones.
