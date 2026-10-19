---
name: bs-scattered-cards-magazine
description: Build a complete multi-page website with a white editorial ground, a fan of rotated article cards, a ruled topic index and generous photographic story grids. Includes connected content pages and interactive controls, with a reusable visual system for new brands and content.
---

# Scattered-Cards Magazine

Build an independent-magazine website: a white editorial ground, a hero fan of
rotated paper article cards, a ruled topic index, generous photographic story
grids and long-form article pages, plus the shop, subscription and utility
pages a real publication needs.

The worked example is **Ferrow**, a fictional quarterly of places, objects and
people, with 36 connected routes (15 page types, 8 stories, 7 topics, 6
products). `references/template.html` is the visual and behavioural blueprint:
vanilla HTML, CSS and JS, content in one JSON collection, two web fonts and
21 role-planned photographs. Recreate its design relationships with the user's
content; do not ship a generic headline-and-button site.

## Workflow

### 1. Establish the content and output location

Read the target repository and its instructions first. Identify the brand,
audience, topics, stories, products and any subscription or membership offer,
then map them onto the template with **Adapting to a real brief** below. Ask
only for information that blocks progress. For a real business, facts come
from the brief; anything it does not give (people, letters, stockists,
figures, prices, dates, addresses) is drafted as specific, plausible
placeholder copy and listed in your final reply for the user to confirm or
replace. Never use lorem ipsum, "Your Company" or placeholder people, and
never invent awards, certifications or regulatory claims.

Keep unrelated files intact. Put a standalone site in its own directory. Do
not silently migrate an existing application to another framework.

### 2. Choose the deliverable

No existing project: build **one self-contained HTML file** from the template,
like the store demo. This is the default; do not ask a stack question. The
user has a framework project or asks for one (Vue, React, Astro, Next.js, a
TypeScript starter): inspect it first, preserve unrelated files and port per
`references/framework-adaptation.md` (Next.js App Router with TypeScript when
a framework is wanted but not named): real components, real routes, typed
content modules. Never wrap the template in an iframe or inject it as raw
HTML. The hash router belongs to the single-file deliverable.

### 3. Lock the visual system before writing pages

Read `references/style-guide.md` and `references/visual-contract.md`, then open
`references/template.html` in a browser. Keep these signatures:

- **editorial-hero + editorial-fan**: a centred eyebrow, five scattered paper
  cards (fixed slots and angles, see the Hero anatomy in the style guide),
  a two-line heavy serif headline at 62px, a short lead and one outlined
  button. Keep this composition and scale; do not add a second CTA, stats,
  badges or an announcement bar, and never use purple.
- **topic-index**: a ruled, numbered list of topics with large serif names,
  counts and a thumbnail that reveals on hover.
- **Story grids**: asymmetric 7/5 compositions, a full-bleed feature image, a
  portrait carousel. Never three identical cards in a row.
- **article-body**: serif reading column with drop cap, rule-topped pull quote,
  sticky facts aside, inline detail figure, next story and topic archive.

Use the tokens, type scale, radius rules and shadows exactly as documented.

- Fonts: Newsreader (variable, roman and italic) and Schibsted Grotesk
  (variable). The template loads them from the fontsource CDN. In a framework
  project install `@fontsource-variable/newsreader` (import `wght.css` and
  `wght-italic.css`) and `@fontsource-variable/schibsted-grotesk`, or use
  `next/font/google` (`Newsreader` with both styles, `Schibsted_Grotesk`); for
  the single-file deliverable, `scripts/inline-assets.mjs` downloads the three
  woff2 files named in the template's `@font-face` rules once at build time
  and embeds them as data URIs, so the page makes no network requests. A
  substitute needs similar width and contrast and must be documented.

### 4. Plan the complete page family

Read `references/page-library.md`, `references/route-inventory.md` and
`references/interior-pages.md`. Inventory every nav item, card, topic, story,
product and form destination before building. Model content as collections
(stories, topics, archive, products, plans) and render repeated pages from
them. Each entity gets an id, a title, a specific description and its own
image subject. Every page needs a breadcrumb or back path, one `h1`, and a
contextual next step. Keep a designed not-found page.

### 5. Plan and make the imagery

Read `references/image-plan.md`. Write one art direction for the whole site
(light, palette, lens, grain, mood) and a slot table by role: story lead,
story detail, cover still life, product still life, masthead portraits. One
subject per entity; a story's lead may reappear on its own cards, cover or
print, never on an unrelated item. Generate with the host image tool or use
owned assets, at the aspect the slot displays, with no text, logos or UI in
the picture. Look at every result and regenerate anything off-brief. Export
WebP (heroes about 1400 px wide, details 900 px, portraits 640 px), set
`object-position` per slot, and give every image meaningful alt text.

### 6. Build components and pages

Shared components: header (wordmark with fan mark, centred
nav with an active underline, search, bag with count badge, mobile menu
sheet), footer (columns, socials as SVG, giant wordmark, legal row), buttons,
chips, segmented controls, fields with inline errors, accordion, tabs,
carousel, toast, drawer, cover (composed in HTML from a photo plus masthead
type) and framed print (mat plus optional oak frame). Keep design tokens at
the top of the stylesheet. Keep interaction state local except the bag and
saved stories.

### 7. Apply the motion system

Read `references/motion-system.md`. The fan deals out once on load, hero copy
follows, sections reveal with a short rise, the article shows a reading
progress line, routes cross-fade and scroll to top. Content is visible without
JavaScript and with reduced motion. Animate only transform, opacity and
clip-path.

### 8. Make every interaction work

Wire every visible control to a real result: search overlay with grouped
results and an empty state; story filters, search, sort, grid or index view
and a no-results state; saved stories; copy link; product options that
update price and the framed preview; quantity; add to bag with loading and
done states; mini-bag drawer with running total and free-delivery note; bag
page with delivery zone; checkout with inline validation, delivery method and
a confirmation that does not claim payment; subscription plans with term and
gift toggles; FAQ filter; contact tabs and forms with success states. Local
forms never claim that an email was sent or a card was charged.

### 9. Apply the icon grammar

Read `references/icon-library.md`. Inline SVG in Lucide grammar only (24
viewBox, `currentColor`, 1.6 stroke, round caps). No emoji, dingbats or icon
fonts. Icon-only buttons have accessible names.

### 10. Build and validate

Keep your source page next to an `images/` folder (copy the template there
with the images you use), then build the deliverable and validate it:

```bash
node scripts/inline-assets.mjs site/index.src.html site/index.html
node scripts/validate-design.mjs site/index.html
```

`inline-assets.mjs` embeds every `images/`, `fonts/` and `assets/` file and
the three fontsource fonts as data URIs (the template's `IMAGES` registry
already references each file once, so a lead used on Home, its topic, cover
and search stays one copy). The validator's default mode is your site: it
checks external resources, sandbox safety, emoji and dashes, leftover
`REPLACE` comments and placeholders, route integrity (home, not-found, at
least 8 page types, every `#/` link resolves to a page or a content entry),
alt text, labels, focus and reduced-motion styles, the signature structures,
the size budget, and fails if any of the worked example's identity is left
(Ferrow, its domain, people, stockists, story places and titles).
`--files` validates a deployed site that keeps `images/` and `fonts/` beside
the page; `--template` checks the un-inlined template. Fix every error. For a
framework output run its own type check and build; the HTML validator does
not read framework source.

### 11. Review in a real browser

Work through `references/quality-checklist.md` at 1440, 1024, 768 and 390 px.
Click every nav item, card, filter, option, form and drawer; check the
not-found route, empty states and keyboard focus. Fix covered text, clipped
captions, horizontal overflow, blank images and console errors, then review a
second time.

### 12. Deliver clearly

Report the output path, stack, routes, image count and what was validated
programmatically versus in the browser. List every placeholder fact and every
stand-in image (generated portraits, reused shipped images) for the user to
confirm or replace. Do not claim deployment, publication, payment integration
or rights clearance that did not happen.

## Adapting to a real brief

- **Counts flex; the grammar does not.** Stories, topics, archive rows and
  products are arrays in the content JSON; pages, counts, chips and the
  router follow them. Home takes its lead, two side cards and up to four
  carousel cards from `HOME_PICKS` (missing slugs fill from content order),
  so ship at least three stories and ideally seven. The hero fan is always
  five cards. `.product-grid` is three columns at any length. `.plans`
  is `repeat(2,…)`: for one or three plans change it to `repeat(n,…)`.
  `.stats` holds four figures (three: `repeat(3,…)`), `.letters` two or
  three notes (rotations exist for three; none: delete the band),
  `.masthead` three people (two or four: change its `repeat(3,…)`),
  `.stockists` any number in two columns. Headings and prose that state a
  count ("Seven subjects", "one of seven topics", "Four issues a year")
  change with it.
- **Product types drive the visual.** `type: "issue"` renders a composed
  cover (masthead from `BRAND`, season from `season` or `SEASON`) and feeds
  the cover fans and the Home issue band; `"print"` renders a framed print
  with frame and size options; any other type renders a photo stage. Give a
  new type a `typeLabel` and a chip in `CATS`. A business without
  periodical releases removes the Home issue band, both `[data-cover-fan]`
  wrappers and the Issues chip; the fans render nothing without issues.
- **Map the sections to the business.** A maker or studio with a journal:
  Stories become journal entries, Topics become techniques or materials,
  Shop sells pieces (photo stage) and workshops, Subscribe becomes a
  membership or class pass with the same plan cards and term toggle. A city
  or travel publisher: Stories become guides, Topics become neighbourhoods,
  printed guides stay `issue` covers, maps become `print`. A food or coffee
  brand: Stories become origin reports, Topics become regions, Subscribe
  becomes the delivery subscription, and a seasonal box can keep the
  composed-cover grammar.
- **Real facts only.** Letters, stockists, masthead, figures, prices,
  delivery rates, addresses and dates come from the brief. Missing ones are
  drafted as plausible placeholders and listed in the final reply. No
  invented awards, certifications, regulatory or security claims, and no
  claim that payment or email works when no backend is connected.
- **People photos.** If the site presents real people (editors, makers,
  authors), ask for their photos and crop them to the slot. Generated
  portraits, including the shipped `portrait-editor`, `portrait-photo` and
  `portrait-art`, are stand-ins: say so in the final reply.
- **Shipped images.** Reusable as neutral Mediterranean-light placeholders
  when the brand fits that palette: `story-botanical`, `detail-botanical`,
  `issue-cover`, `story-interior`, `detail-interior`, `story-architecture`,
  `detail-architecture`, `story-coast`, `detail-coast`, `story-food`,
  `detail-ceramics`. Sample-specific, regenerate for any other content:
  `story-fashion` (the linen maker in his doorway), `story-ceramics` (the
  potter's hands), `story-studio` (the photobook editor), `detail-fashion`
  (a rust tote on a stool), `detail-food` (oil poured at a pergola lunch),
  `detail-studio` (contact sheets), `product-notebook` (the sample
  notebooks). A different palette or setting means a new art direction and
  a full new set (`references/image-plan.md`).
- **Deliverable.** No project: the single HTML file built with
  `scripts/inline-assets.mjs` (fonts and images as data URIs, safe in a
  sandboxed preview). A normal deployed site may keep `images/` and the
  font files beside the page (validate with `--files`). A framework project:
  port per `references/framework-adaptation.md` with local image and font
  files.
- **The hero copy changes, its anatomy does not.** New eyebrow, two-line
  headline, two-sentence lead and one outlined button label; five cards
  pointing at five of the buyer's stories (new images, alt text and topic
  captions); same sizes, slots and angles.

## Replace checklist

The `<!-- REPLACE: -->` and `/* REPLACE: */` comments mark the head metadata,
the hero fan and the script config. The rest of the sample identity sits in
static copy; go through it all (the validator's default mode lists anything
left):

- **Script config** (top of the main script): `BRAND`, `SITE` (copy-link
  URL), `SEARCH_HINTS`, `SHIPS_FROM`, `HOME_PICKS`; `SEASON` or a `season`
  on each issue; `SHIP` zones and rates, `freeNote()` threshold and wording,
  the `eur()` currency formatter, `CATS` and the product `typeLabel` map.
- **Head**: title, description, `og:*` tags, the favicon colour.
- **Header, menu sheet, footer**: wordmark (and its "Quarterly" tag), nav,
  footer columns, social links (`data-external` labels), the giant footer
  wordmark, the legal line.
- **Home**: hero, topic-index heading and prose count, "New in Issue NN",
  feature caption, issue band (`data-cover`, `data-toc` slugs, title,
  price), the four `data-count` stats, letters with names and places,
  newsletter band name.
- **Pages**: Subscribe (heading price, plan copy, FAQ), About (statement,
  masthead, principles, stockists, pitch band), Contact (each email in the
  text and in `data-copy`), Newsletter (name, sample letter head and date),
  Delivery (rate table, dispatch city), Privacy and Terms (company, email,
  jurisdiction), FAQ answers, the 404 copy.
- **Routes**: rename freely (`data-page`, every `href="#/..."` and
  `data-nav` move together; one-segment routes are read from the
  `data-page` sections). The `stories/`, `topics/` and `shop/` prefixes are
  also in `match()` and the card builders: change them together or keep
  them.

## Single-file constraints

The default deliverable is one self-contained HTML file (target 5 MB, hard
cap 8 MB) that runs from disk and inside `<iframe sandbox="allow-scripts">`:

- No network requests; inline images as data URIs, each file once
  (reference images by id from the `IMAGES` registry), and embed the three
  fontsource woff2 files as data URIs; `scripts/inline-assets.mjs` does both.
- Route on click, not by assigning `location.hash`; sync the URL with
  `history.pushState` inside try/catch and keep listening to `hashchange`.
- No native form submission: `<form novalidate>` with `type="button"` actions
  and an Enter-key handler.
- Clipboard: when `window.origin === 'null'` use the textarea and
  `execCommand('copy')` fallback, then still confirm with a toast.
- No dialogs, popups, `target="_blank"` or top navigation; external links
  are intercepted and explained.
- Storage only inside try/catch with an in-memory fallback.

Sandbox restrictions apply when the page is previewed inside a sandboxed
iframe (a single-file demo). A deployed site or framework project does not
need them.

## Files

- `references/template.html`: the working blueprint (36 routes in the worked
  example, content JSON, script config, router, components). Images live
  beside it in `references/images/`; fonts load from the fontsource CDN.
- `references/style-guide.md`: tokens, type scale, layout, components, do and don't.
- `references/visual-contract.md`: the non-negotiable fidelity checklist.
- `references/image-plan.md`: art direction and every image slot with its prompt.
- `references/motion-system.md`: motion tokens, patterns and reduced motion.
- `references/quality-checklist.md`: the pre-delivery checklist.
- `references/page-library.md`: page roles and required sections.
- `references/route-inventory.md`: the complete route table.
- `references/interior-pages.md`: depth rules for inner pages.
- `references/framework-adaptation.md`: stack choice and component mapping.
- `references/reui-components.md`: ReUI mapping for React outputs.
- `references/icon-library.md`: icon set and accessibility rules.
- `scripts/inline-assets.mjs`: builds the single file (images, fonts as data URIs).
- `scripts/validate-design.mjs`: static validation; default mode for your
  site, `--files` for a deployed site, `--template`, `--demo` for the store demo.

### Shopping bag entrance

Use a compact 44 px icon-only bag button in the header. Do not render "Bag
(0)" or a text label. Hide the count badge when the bag is empty; show and
update it (with a small bump) for positive quantities. Keep an accessible
label that states the count.

## Interior page depth

Read `references/interior-pages.md`. Every inner page is designed in its own
right: articles carry a full narrative with facts, pull quote and figure;
topics show online stories plus a print archive; products have a gallery,
options, specs and related items; utility pages have real policies and forms.
Never reduce an inner page to a heading and two sentences.

<!-- reui:stack -->
#### Interface components come from ReUI (React outputs)

The template's controls are hand-built vanilla HTML so the single-file
deliverable can stay self-contained. When the target stack is React or Next.js, implement
every generic control (buttons, fields, selects, radio groups, tabs,
accordions, chips and toggle groups, the menu sheet, the bag drawer, dialogs)
with [ReUI](https://reui.io) components, styled through tokens.

- Install from the official registry (`npx shadcn@latest add @reui/button`,
  and so on) and import from `components/ui`. Source:
  https://github.com/keenthemes/reui.
- Do not substitute a native `<select>`, a hand-rolled popover or a `div`
  with matching class names in a React output. If ReUI lacks a behaviour,
  build it explicitly and say so.
- Point ReUI's custom properties (`--primary`, `--background`, `--border`,
  `--radius`, font family) at this template's tokens and keep the template's
  class names on rendered elements. `references/reui-components.md` lists the
  mapping. The fan, covers, framed prints and letters stay bespoke CSS.
- In Vue or Svelte, ReUI does not apply; raise the conflict instead of
  silently switching libraries.
<!-- /reui:stack -->
