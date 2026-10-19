# Style guide: Sage Sneaker Store

A quiet, athletic editorial store. One confident brand colour (a grey sage
sampled from the campaign photograph), near-black green ink, cool chalk ground,
white cards. Display type is heavy, tight and uppercase; everything else is
calm. `references/template.html` is the source of truth for exact values.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ground` | `#F1F3EE` | Page background (cool chalk, not warm cream) |
| `--paper` | `#FFFFFF` | Cards, proof cards, drawers, forms |
| `--mist` | `#E3E8E0` | Product photo backdrop and image placeholders |
| `--sage` | `#8D9A89` | Hero panel, promise band, 404, confirmation, wordmark |
| `--sage-deep` | `#5E725B` | Icons and small accents on light grounds |
| `--sage-tint` | `#DCE4D8` | Quiet sage panels (spotlight, resole, icon chips) |
| `--sage-ink` | `#1F2A20` | Newsletter band (the one dark surface) |
| `--ink` | `#111713` | Headings, primary buttons, text on sage |
| `--ink-2` | `#2A322C` | Body text |
| `--muted` | `#566058` | Secondary text (6.1:1 on white) |
| `--faint` | `#7D877F` | Decorative or large text only |
| `--line` / `--line-2` | `rgba(17,23,19,.10)` / `.18` | Hairlines and control borders |
| `--danger` / `--ok` | `#A23B2A` / `#2F6B45` | Validation and success |

Contrast rule: on `--sage`, white is reserved for display type (the hero
headline, section titles in the promise band, the 404 title). Body copy, labels
and buttons on sage use `--ink` (6:1). Never put small white text on sage.

## Typography

Fonts: Archivo (variable; display, 800, uppercase), Geist (variable; body)
and Geist Mono (variable; labels and spec captions). The template loads them
from the fontsource CDN. In a framework project install
`@fontsource-variable/archivo`, `@fontsource-variable/geist` and
`@fontsource-variable/geist-mono` or use `next/font/google` (`Archivo`,
`Geist`, `Geist_Mono`); for the self-contained demo download each woff2 file
named in the template's `@font-face` rules once at build time and embed it as
a data URI, so the page makes no network requests.

| Role | Family | Size | Weight | Tracking | Leading |
| --- | --- | --- | --- | --- | --- |
| Hero eyebrow | Geist, uppercase, ink, 18x3 px bar before it | 10.5px | 700 | 0.2em | 1.5 |
| Hero display | Archivo, uppercase, white | `clamp(3.25rem, 6.8vw, 5.5rem)` (52-88 px) | 800 | -0.035em | 1.02 |
| Hero subline | Geist, `--ink-2` | 1rem (0.9375rem on phones) | 400 | 0 | 1.55 |
| H1 (inner pages) | Archivo, uppercase | `clamp(2.5rem, 4.6vw, 4.25rem)` | 800 | -0.04em | 0.88 |
| H2 (sections) | Archivo, uppercase | `clamp(1.75rem, 2.75vw, 2.4375rem)` | 800 | -0.035em | 0.92 |
| Product name | Archivo, uppercase | 1.125rem | 700 | -0.015em | 1.15 |
| H3 / card title | Archivo or Geist 600 | `clamp(1.25rem, 1.5vw, 1.5rem)` | 700 | -0.02em | 1.1 |
| Lead | Geist | `clamp(1.0625rem, 1.15vw, 1.25rem)` | 400 | 0 | 1.55 |
| Body | Geist | 1rem | 400 | 0 | 1.6 |
| Label / spec caption | Geist Mono, uppercase | 0.75rem | 500 | 0.06em | 1.2 |
| Price, data | Geist with tabular numerals | as context | 600 | -0.01em | 1 |

88 px is the ceiling for any type on the site: the hero headline is the largest
thing on the page, section heads stay around 36-39 px and inner-page titles
around 64-68 px. Do not scale the hero up on wide screens.

Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`, measure
56-66ch. Mono labels are rationed: category meta on cards, spec captions,
section labels at most once every three sections.

## Layout and spacing

- Container 1320 px plus `--gutter` (`clamp(16px, 4vw, 40px)`).
- Section rhythm `--section` = `clamp(72px, 8vw, 120px)`; tight sections use 0.6x.
- Grids: products 4 columns (3 in the catalog beside a 248 px filter rail,
  2 on phones); activity bento 1 tall + 1 wide + 2 small; split heads
  `1.25fr / 1fr` with the lead aligned to the bottom.
- Vary compositions: tabbed grid, bento, spotlight with hotspots, sage promise
  band with white cards, image with overlapping card, carousel, split FAQ,
  dark newsletter band. Do not repeat a layout family on one page.

## Shape and elevation

- Radius scale: pill for every interactive control (buttons, chips, search,
  segmented controls); 14 px for form fields and options; 18 px for cards and
  product media; 28 px for panels (hero, bands, galleries).
- Shadows are tinted green-grey: `--shadow-1` resting cards, `--shadow-2`
  proof cards and popovers, `--shadow-3` drawers, dialogs, overlapping cards.
- Hairlines (`--line`) separate rows; avoid a border on every side of
  everything.

## Component anatomy

- **Header**: brand mark (sage disc with two forward strokes) + uppercase
  wordmark; centred nav with an underline indicator for the active route;
  search, saved (count) and bag (count, hidden at zero) icon buttons 44 px.
  Transparent at the top, gains a blurred chalk backdrop and hairline on scroll.
- **Sage hero (`sneaker-hero`)**: a flat `--sage` panel, 28 px radius,
  `min-height: 650px` (not viewport-tall). Copy column = left 61%, padding
  64/56 px, stacked in this order and nothing else: eyebrow ("Move in your own
  way"), the headline in three lines on desktop ("Made / to / move.", two lines
  on phones), a four-word subline, the search, four activity pills. At
  1440x900 the headline top sits about 176 px from the top of the page.
- **Model photograph (`sneaker-model`)**: absolutely positioned in the right
  51% of the panel, full height, `object-fit: cover; object-position: 50% 100%`
  (40% on 701-900 px). Its paper matches `--sage`, so a 22% left-edge mask lets
  the model stand in the same space as the type. The frame keeps about 85-95 px
  of paper above her head. Natural tones: no duotone, wash or blend mode.
- **Hero search (`hero-search`)**: 370 x 50 px pill in 90% white, placeholder
  "Find a model", a 42 px round ink button with the search icon inside the pill.
- **Activity pills**: 32 px pills in 82% white, Geist 700 11 px uppercase,
  0.08em tracking, 12 px apart (10 px type, 5 px apart on phones, one row).
- **Service card (`sneaker-proof`)**: one small white card, 16 px radius,
  `right: 24px; bottom: 24px` on the photograph, three icon rows at 12 px
  (Free delivery over $150, Eight considered models, 60-day wear test). Hidden
  at 900 px and below, where it would cover the shoes. Proof elsewhere (the
  promise band) uses larger white cards.
- **Product card**: 1:1 media on `--mist`, save toggle top-right, quick add
  (hover pill on desktop, round button on touch), meta row (collection / flag,
  rating), uppercase name, two-tone colour swatch, colourway, price.
- **Promise band**: sage panel, white H2, three white cards with an icon chip,
  a large display number ("60 days", "2 sizes", "$45"), a title and a sentence.
- **Forms**: label above field, 52 px fields, hint below, inline error with an
  alert icon, loading label on submit, success panel replacing the form.

## Do

- Keep the hero headline white, uppercase and at 88 px maximum: three lines on
  desktop, two on phones. Keep the hero to its six elements.
- Keep product photos on one backdrop, angle and light.
- Use real, specific content: prices, specs, fit notes, policies that agree
  with each other everywhere they appear.
- Give every interactive element hover, active (scale 0.97), focus-visible,
  disabled and selected states.

## Don't

- Don't use warm beige, brass, purple, violet or lavender anywhere (no hue
  235-300 fills, washes or glows); don't add a second accent.
- Don't add stat strips, rating badges, extra cards or chips to the hero, and
  don't enlarge or move the headline up to fill a wide screen.
- Don't place the service card over the model's shoes or crop her head or feet.
- Don't put labels or pills on top of product photos.
- Don't use emoji, dingbats, em dashes in copy, or icon fonts.
- Don't leave any link, card or footer item without a designed destination.
