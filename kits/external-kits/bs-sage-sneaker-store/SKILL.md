---
name: bs-sage-sneaker-store
description: Build a complete multi-page website with a sage hero, oversized white uppercase type, an editorial model photograph, white proof cards and clean product grids. Includes connected content pages and interactive controls, with a reusable visual system for new brands and content.
---

# Sage Sneaker Store

Build a premium footwear or apparel storefront: a sage campaign hero with
oversized white uppercase type over an editorial model photograph, white proof
cards layered on the photo, clean product grids on a matched studio backdrop,
and a full set of connected store pages that actually work.

The worked example is the fictional label Stride Common (eight sneakers, four
collections, 27 routes). `references/template.html` is the visual and
behavioural blueprint and the starting source for the default single-file
store. Keep its design relationships when you replace the brand, copy and
imagery.

## Quality bar (non-negotiable)

- Premium UI: real type system, calibrated sage palette, consistent radius and
  shadow scale, full interaction states on everything clickable.
- Reasonable imagery: every image has one job, one art direction across the
  set, crops chosen so heads and shoes are never cut.
- Reasonable motion: short, calm, purposeful; content is visible without JS.
- A real store: every link resolves, cart and checkout flows work, empty and
  error states exist, mobile is designed rather than squashed.

Read `references/quality-checklist.md` before you start and again before you
deliver.

## Workflow

### 1. Establish content and output location

Read the target repository (if any) and its instructions. Identify the brand,
market (country, currency, tax), audience, product range and pages needed. Ask
only for information that blocks progress. For a real business, facts come
from the brief; anything missing is drafted as plausible placeholder copy and
listed in the final reply (see "Adapting to a real brief"). Keep unrelated
files intact. Never invent real customers, certifications or awards.

### 2. Choose the deliverable

- **No existing project and no named stack (default):** one self-contained
  HTML file, like the store demo. Copy `references/template.html` next to an
  `images/` folder, edit it into the buyer's store, then build the single file
  with `scripts/inline-assets.mjs` (step 8). Offer a framework port as the next
  step.
- **The buyer has a framework project or asks for one:** port the design per
  `references/framework-adaptation.md` into real components, content data
  modules and routes (Next.js App Router with TypeScript when they ask for
  React without naming a framework). Never wrap the template in an iframe or
  inject it as raw HTML; the hash router belongs to the single file.

### 3. Read the visual system

Read `references/style-guide.md` (tokens, type scale, components) and
`references/visual-contract.md` (what must not change). Open
`references/template.html` and study the hero, proof cards, product card,
spotlight, promise band, store visit, reviews carousel and footer wordmark.

Preserve the signature structures `sneaker-hero`, `sneaker-model`,
`sneaker-proof` and `hero-search` with the template's restrained hero: a flat
650 px sage panel, copy in the left 61% (eyebrow, 88 px white uppercase
headline in three lines, a short subline, a white pill search, four small
activity pills), the model photograph blended into the right 51% with her head
and shoes whole, and one small white service card on the photo's lower right.
Do not enlarge the headline, pull it up or add stat strips, rating badges or
extra cards to the hero; no purple anywhere.

Fonts: Archivo (variable; display, 800, uppercase), Geist (variable; body)
and Geist Mono (variable; labels and spec captions). The template loads them
from the fontsource CDN. In a framework project install
`@fontsource-variable/archivo`, `@fontsource-variable/geist` and
`@fontsource-variable/geist-mono` or use `next/font/google` (`Archivo`,
`Geist`, `Geist_Mono`). For the single file, `scripts/inline-assets.mjs`
downloads each woff2 file named in the template's `@font-face` rules once at
build time and embeds it as a data URI, so the page makes no network requests.

### 4. Plan the page family

Read `references/page-library.md`, `references/route-inventory.md` and
`references/interior-pages.md`. Every nav item, card, footer link and CTA must
lead to a designed page. Inner pages are never a heading and two sentences:
product pages have a gallery, variant selectors, specs, reviews and related
items; collections have a hero, the models, a comparison aid and buying advice;
help pages have working tools (size finder, delivery options, FAQ tabs).
Include a designed 404.

### 5. Plan and generate images by role

Read `references/image-plan.md`. Before generating anything, write a plan with
one art direction sentence and one row per slot (with a small budget, follow
its "Minimum viable set" priority order): id, role (campaign hero,
product, collection context, store, craft/story), aspect, crop focus, where it
is used and the prompt.

- Product photos are one coherent set: same seamless backdrop colour, same
  side-profile angle, same light, generated one image per product. Never crop
  several products out of one sheet.
- The campaign hero is a full-length model on seamless sage paper whose paper
  tone matches the hero panel, with generous paper above her head. It fills the
  right half of the panel; if the frame is too tight, extend the plain paper
  (top or sides) rather than cropping the model. Keep its natural tones.
- Context photos show the store's own products in use, so a product page can
  reuse its context image as a "worn" view.
- No text, logos, stripes or swooshes on shoes, no watermarks. Review every
  image and regenerate anything uncanny, off the art direction or mis-cropped.
- Use owned assets when supplied. Export WebP at native resolution.

### 6. Build

Set `SITE` and `CONFIG` at the top of the template's script first: brand and
store name, order prefix, storage key, locale and currency, tax mode and rate,
delivery fees and free-delivery threshold, postcode format, size label and
promo code. Then replace the data arrays (`IMG`, `COLLECTIONS`, `LINES`,
`PRODUCTS`, `REVIEWS`, `FAQ`, `SIZES`, `SIZE_CHART`, `PRICE_BANDS`) and work
through the Replace checklist below for the static copy.

Use shared components for header, product card, proof card, tabs, accordion,
carousel, sheet/drawer, forms and footer. Keep collections (products,
collections, lines, reviews, FAQ, size chart) in typed data modules and render
them with small functions. Implement:

- Header that gains a backdrop on scroll, active nav indicator, search dialog
  (also on "/"), saved count, bag count badge hidden at zero, mobile sheet menu.
- Product cards with save toggle and quick add (size picker in the card on
  desktop, bottom sheet on phones).
- Catalog with activity chips, size-in-stock, price, colour and width filters,
  sort, active-filter chips, result count and a helpful empty state; filters
  become a bottom sheet under 1024 px.
- Product page with gallery and hover zoom, width selector that changes price,
  size grid with sold-out and low-stock states, add-to-bag loading and success,
  delivery estimate, accordion details, spec tiles, reviews with fit scale,
  related products and a mobile sticky buy bar.
- Mini-cart drawer with quantities, remove, free-delivery meter and subtotal;
  bag page with promo code validation; checkout with inline validation,
  delivery methods that change the total, a clearly disabled payment step and
  a confirmation state. Never imply a real payment or order.
- Contact form with topic-dependent fields and fitting slots, newsletter with
  success state, size finder that converts foot length to US/UK/EU.

Read `references/motion-system.md` and apply its tokens, reveal pattern and
reduced-motion rules.

### 7. Icons

Read `references/icon-library.md`. Inline SVG in Lucide grammar only (24
viewBox, 1.75 stroke, round caps). Star ratings are SVG. No emoji, dingbats or
icon fonts. Icon-only buttons need accessible names.

### 8. Build and validate

```bash
node scripts/inline-assets.mjs path/to/source.html path/to/index.html   # single file: fonts + images inlined
node scripts/validate-design.mjs path/to/index.html                     # buyer mode (strict)
node scripts/validate-design.mjs path/to/source.html --template         # while editing, images/ and CDN fonts allowed
```

The buyer mode fails on any remote request, sandbox-unsafe API, missing
structure and on every sample name left from the template (brand, store,
address, products, lines, reviewers, `STRIDE10`, `SC-` order numbers, sample
slugs). A deployed site that keeps `images/` and `fonts/` beside the page is
validated with `--files`. Fix every error. For a framework output, also run its
type check and build; the validator does not check framework source.

### 9. Review in a real browser

Open home and every route at 1440, 1024, 768 and 390 px. Click the nav,
cards, quick add, filters, sort, variant selectors, drawer, promo, checkout,
contact, newsletter, size finder and search. Confirm: no horizontal overflow,
no clipped heading, the hero headline stays at 88 px or less with its top about
176 px down at 1440x900, the hero model and shoes are whole at every width, the
service card never covers the shoes, no console errors, visible focus, reduced motion
honoured. For a single file that will be previewed in a sandboxed iframe,
repeat the clicks inside `<iframe sandbox="allow-scripts">`: links must render
without hash navigation and every form must work without `allow-forms`.

### 10. Deliver

Report the output path, stack, what was validated and what was reviewed in the
browser. List every placeholder fact (prices, fees, reviews, addresses, dates,
store hours, metrics) and every stand-in image for the buyer to confirm or
replace. Do not claim deployment, publication, payment integration or rights
clearance that did not happen.

## Adapting to a real brief

- **Counts flex; the grammar does not.** Products: any number; the popular
  tabs show four, related items four, and a line with three or more products
  uses the four-column `.four` grid. Collections: two to four in the activity
  bento (the CSS fills the grid for two or three; with five or more the bento
  shows the first four and the rest live on the Collections page). Lines:
  any number, or drop the Our lines page and its links. Reviews: any number;
  Home shows six. Headings and copy that state a number ("Eight considered
  models", "Eight models, four activities") change with it; the bag's
  "Browse the eight models" is computed.
- **Market settings live in `CONFIG`.** Currency and number format come from
  `locale`/`currency`; `taxMode: 'included'` with a rate adds an "Includes 21%
  VAT" row (EU, UK), `'added'` with a rate adds an estimated tax row and
  total (US); `postcode` sets the checkout label, pattern and error (UK, DE and
  NL examples are in the comment); delivery fees and the free-delivery
  threshold drive the bag meter, checkout and product pages. Prices typed into
  static copy (hero card, delivery page, FAQ, `PRICE_BANDS` limits, "Under
  $150" tab) are in the Replace checklist.
- **Map the sections to the business.** Apparel: sizes become XS-XL in
  `SIZES` with `sizeLabel: 'Size'`, the size finder becomes a body-measurement
  table (or drop the finder and keep the chart), width variants become fit
  (regular/relaxed) or go (`wide: null`). A running shop or outdoor retailer
  carrying other brands: Our lines becomes Brands, collections become
  activities. Without a physical store: remove the store-visit section, the
  pickup option and the Contact store card; fittings become video calls or go.
  Without a repair service: the resole promise card and About timeline become
  the buyer's own service (returns, warranty), never an invented one.
- **Real facts only.** For a real business, prices, specs, policies, reviews,
  ratings and review counts, store address, hours, phone, founding year and
  timeline come from the brief. Anything missing is drafted as plausible
  placeholder copy and listed in the final reply. No invented certifications,
  awards, materials claims (recycled content, sugarcane foam) or security and
  payment claims. Keep the checkout's "nothing is charged" notes until a real
  payment provider is connected.
- **People photos.** The hero model and any reviewers or staff are invented.
  If the site presents real people (founder, staff, ambassadors), ask for
  their photos; a generated model is a stand-in and must be called out.
- **Shipped images.** Neutral stand-ins for a footwear or apparel store, to be
  renamed and called out: `hero-portrait` and `hero-model` (a model in grey
  retro sneakers on sage paper) and `store-rivergate` (a sage sneaker shop
  interior). Sample-specific, regenerate for the buyer's range: every `p-*`
  product photo (each is one sample sneaker), the four `col-*` context photos
  (sample shoes in use on a path, a court, a studio floor and a city bench)
  and `about-resole` (the resole bench, only true for a repair service).
  Any other kind of business regenerates all of them.
- **Deliverable.** No project: the single HTML file built with
  `scripts/inline-assets.mjs` (fonts and images as data URIs, safe in a
  sandboxed preview). A normal deployed site may keep `images/` and the font
  files beside the page (validate with `--files`). A framework project: port
  per `references/framework-adaptation.md` with local image and font files.
- **The hero copy changes, its anatomy does not.** New eyebrow, a three-line
  uppercase headline of short words (88 px cap), a short subline, the search
  placeholder, four activity pills that match the collections and three
  service rows on the white card.

## Replace checklist

Static strings that are not in the data arrays or `SITE`/`CONFIG`:

- `<title>`, `meta description`, `og:*` tags and the comment under them.
- `data-title` on every `<section data-page>` (`| Stride Common`).
- Brand: `.brand-name` and `aria-label` in header and footer, the footer
  wordmark, the copyright line and "Fictional brand for a design demo."
- Hero: eyebrow, headline, subline, search placeholder, activity pills, the
  service card rows ("Free delivery over $150", "Eight considered models").
- Home: popular tab labels ("Under $150", with `POPULAR.value`'s limit),
  spotlight product (name, hotspots, specs, `#/catalog/pace-one`, price),
  promise band numbers, store visit (photo, text, address, hours), FAQ and
  newsletter copy.
- Catalog lead, About (story, numbers, timeline, "Why only eight models"),
  Delivery (four option cards with fees, wear test, resole price), Size guide
  notes, FAQ and Contact (store name, address, phone,
  `hello@stridecommon.example`, topic options), Newsletter issues, Legal
  ("Prices are in US dollars and include sales tax"), 404 copy.
- Checkout: the pickup option ("Pick up at Rivergate", 218 Alder Street).
- Search: the `PAGES` list and the "Try moss, suede, trail or wide" hint.

The validator's buyer mode catches sample names left anywhere; stale prices
and counts are your own review.

## Single-file constraints

The single-file store is one HTML file (target 5 MB, cap 8 MB) with inlined
CSS, JS, fonts and WebP images, built by `scripts/inline-assets.mjs`. Sandbox
restrictions apply when the page is previewed inside a sandboxed iframe (a
single-file demo); a deployed site or framework project does not need them.
It runs from disk and inside `<iframe sandbox="allow-scripts">`: no network requests, no alert/confirm/
prompt, no window.open, storage only inside try/catch with an in-memory
fallback, route state kept in JS and synced with `history.pushState` inside
try/catch, and form submission dispatched from script. Each image file is
referenced once in the `IMG` map and applied through `data-img` keys so the
inlined data is not duplicated.

## Files

- `references/template.html`: the working blueprint and single-file source (images as `images/<id>.webp`, fonts from the fontsource CDN, `SITE`/`CONFIG` settings at the top of the script).
- `references/images/`: the sample's 16 WebP images (see "Shipped images" above).
- `references/style-guide.md`: tokens, type scale, spacing, radius, shadows, component anatomy, do and don't.
- `references/visual-contract.md`: signature elements and fidelity rules.
- `references/image-plan.md`: art direction, every image slot with its prompt, and the minimum set for a small budget.
- `references/motion-system.md`: durations, easings, reveal pattern, reduced motion.
- `references/quality-checklist.md`: pre-delivery checklist.
- `references/page-library.md`: page roles and required content.
- `references/route-inventory.md`: the 27 routes of the example and how to rename routes.
- `references/interior-pages.md`: depth requirements for inner pages.
- `references/framework-adaptation.md`: when to port, component mapping, ReUI layer for React.
- `references/reui-components.md`: ReUI mapping for React outputs.
- `references/icon-library.md`: icon set and accessibility rules.
- `scripts/inline-assets.mjs`: builds the single file (inlines `images/`, `fonts/`, `assets/` and the fontsource CDN fonts).
- `scripts/validate-design.mjs`: static validation; buyer mode (default), `--files`, `--template`, `--demo`.

<!-- reui:stack -->
#### Interface components in React outputs come from ReUI

The template uses native, semantic HTML controls styled by its tokens, so it
stays dependency-free. When the requested output is React or Next.js, build the
generic controls (buttons, inputs, selects, radio and toggle groups, tabs,
accordions, sheets, dialogs) with [ReUI](https://reui.io) components and map
them as described in `references/reui-components.md`.

- Install from the official registry (`npx shadcn@latest add @reui/button`,
  and so on) and import from your `components/ui` directory. The source lives
  at https://github.com/keenthemes/reui.
- Style through tokens, not forks: point ReUI's custom properties
  (`--primary`, `--background`, `--border`, `--radius`) at this palette and keep
  the template's class names on rendered elements.
- Keep bespoke the parts that are not generic controls: the sage hero, proof
  cards, product card, size grid, spotlight hotspots and footer wordmark.
- In a non-React stack, check ReUI's real support before promising it. Astro
  can mount React islands; Vue or Svelte cannot use ReUI directly, so raise the
  conflict rather than switching stacks.
<!-- /reui:stack -->
