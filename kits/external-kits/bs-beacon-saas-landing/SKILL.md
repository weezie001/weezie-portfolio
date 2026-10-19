---
name: bs-beacon-saas-landing
description: Generate a premium SaaS marketing site in the beacon style, a calm warm-neutral page lit by one blurred blue light beam, with gradient-filled Geist headlines, a sticky blur-on-scroll nav, a calm centered hero, the product itself rendered as live HTML and SVG UI just below it, a section library (logo row, feature bento, editorial photo split, tabbed product tour, setup steps with code, count-up numbers, customer story and testimonial masonry, monthly or yearly pricing with a comparison table, security, FAQ, beam CTA, footer), companion routes for sign-up, sign-in, contact sales, changelog, status, legal and 404, and full light and dark themes. Use it when a founder, marketer or developer asks for a SaaS landing page, startup marketing site, product launch page or pricing page. The standalone output is one self-contained HTML file that runs from disk and inside a sandboxed iframe; inside a user's project the site is generated in the project's own stack with the same visual grammar.
---

# Beacon SaaS Landing

Build a SaaS marketing site that a demanding designer would call premium and a
founder could ship as-is: quiet warm-neutral surfaces, one blue light beam,
gradient Geist headlines, the product shown as real interface, purposeful
motion, and every link, form and route working.

**Start from [references/template.html](references/template.html).** It is the
complete engine and visual blueprint: tokens for both themes, fonts, the
header with mega menu and mobile sheet, the calm centered hero with its one
beam, the product console with a live chart, all fifteen landing sections, seven companion routes, the hash
router, reveal and count-up systems, tabs, accordion, pricing switch, forms
with validation and success states, and toasts. Replace content and data,
delete what you do not use, and keep the machinery.

## Files

- `references/template.html`: the source page (images as `images/<id>.webp`, fonts from the fontsource CDN), filled with a fictional sample product (Pulsegrid) that you replace.
- `references/style-guide.md`: tokens, type scale, layout, surfaces, the beam, component anatomy, do and don't, voice.
- `references/section-library.md`: every section and route with its anatomy and IDs.
- `references/motion-system.md`: motion tokens, what moves and why, reveal fallback, reduced motion.
- `references/image-plan.md`: art direction, image slots by role, crops, the exact prompts, fallbacks.
- `references/icon-library.md`: the SVG sprite, symbol list, brand and customer marks.
- `references/quality-checklist.md`: the pre-delivery checklist.
- `references/images/`: the sample's photographs and testimonial portraits (WebP); see the reuse rules under **Adapting to a real brief**.
- `scripts/inline-assets.mjs`: inlines `images/`, `fonts/` and `assets/` references and embeds the fontsource CDN fonts, producing one HTML file (a repeated image is embedded once).
- `scripts/validate-landing.mjs`: the automated quality gate (modes: default single file, `--files`, `--template`).

Fonts: Geist (variable) and Geist Mono (variable). The template loads them
from the fontsource CDN. In a framework project install
`@fontsource-variable/geist` and `@fontsource-variable/geist-mono` or use
`next/font/google` (`Geist`, `Geist_Mono`); for the standalone single-file
deliverable run `scripts/inline-assets.mjs`, which embeds both woff2 files as
data URIs, so the page makes no network requests.

## Workflow

1. **Gather the product story.** Product name, what it does and for whom, the
   one outcome it promises, 4-6 capabilities with the mechanism behind each,
   two to four plans with real limits, 4-6 FAQ answers, 3-4 honest numbers,
   the customer names and quotes you may use. Rough notes are enough: draft
   missing copy in the voice from the style guide (specific, outcome-first,
   organic numbers, no em dashes, no lorem, no "Your Company") and list every
   drafted fact in your final reply (see **Adapting to a real brief**).
2. **Choose the deliverable.** No existing project: build one
   self-contained HTML file from the template, like the store demo. This is
   the default; do not ask a stack question. The user has a framework
   project or asks for one: inspect it first, keep unrelated files, detect React/Next,
   Vue/Nuxt, Svelte, Astro or plain HTML from `package.json` and config, and
   build there: sections and routes as components and real routes, tokens in
   the project's styling system, data arrays as typed constants or JSON,
   reveals and count-ups as a small IntersectionObserver hook, icons from the
   framework's Lucide package, fonts from `@fontsource-variable/geist` and
   `@fontsource-variable/geist-mono` or `next/font/google`. Every rule below holds
   in any stack.
3. **Read the style guide and motion system** before writing markup.
   Non-negotiables: one blue accent used as light, neutral buttons, gradient
   H1/H2, Geist + Geist Mono, hairline surfaces, both themes complete.
4. **Plan sections and routes** with
   [references/section-library.md](references/section-library.md). Keep the
   canonical order, keep IDs stable, vary compositions. Header, hero, footer
   and the sign-up route always ship; include contact, changelog, status,
   privacy and terms whenever the footer links to them.
5. **Design the product UI.** The product console sits in its own section
   right after the features (never inside the hero, which stays a small
   centered headline block: badge, 60px H1, 18px subtitle, two buttons, one
   beam). Rebuild the console, tour panels and bento vignettes in the product's own vocabulary:
   its objects, states, numbers, people and timestamps. A generic
   "Metric one" pane, lorem rows or a photo of a laptop is a failed output.
   Keep charts as SVG drawn from data, tables from arrays, and one
   descriptive `role="img"` label on the decorative window.
6. **Plan and make the images** with
   [references/image-plan.md](references/image-plan.md): list slots by role
   (customer story portrait, one editorial image for the core promise,
   testimonial portraits, team photo for contact), write one art-direction
   sentence, choose aspect and crop focus per slot, then generate with the
   available image tool. Look at every result and regenerate anything with
   text, fake screens, artifacts or a bad crop. Without an image tool, follow
   the fallback in the image plan; never hot-link stock photos.
7. **Build from the template.** Copy `template.html` as `src.html` and put
   your images in `images/` beside it (the fonts stay on the fontsource CDN
   until step 9 embeds them).
   Edit `BRAND` and the data arrays at the top of the script (`LOGOS`,
   `QUOTES`, `MONITORS`, `COMPARE`, `CHANGELOG`, `STATUS`,
   `STATUS_INCIDENTS`, `LEGAL`), `PLANS` next to `setPlan`, the `ROUTES`
   table, the copy in each section and the `<head>` (title, description, OG
   tags, favicon); then walk the **Replace checklist** below for the sample
   strings that live in markup. Delete unused sections with their CSS and JS
   hooks. Do not re-derive the CSS or JS engine.
8. **Wire every interaction** (see the quality checklist): mega menu, mobile
   sheet, range switch and chart tooltip, tabs, copy button, pricing switch
   carrying the plan into sign-up, comparison disclosure, testimonials show
   all, accordion, every form with inline validation, loading and success,
   changelog filters and search with an empty state, status tooltips, theme
   toggle. No `href="#"` anywhere: every link reaches a section or a route.
9. **Build the single file**:
   `node scripts/inline-assets.mjs src.html index.html` (target 5 MB or
   less, hard cap 8 MB). It embeds the images (a repeated image only once)
   and downloads the two fontsource font files once, so this build step
   needs network access. A site deployed to a normal host may skip this and
   keep `images/` and `fonts/` beside the page.
10. **Validate** your own output file:
    `node scripts/validate-landing.mjs index.html` must print `ok`. It checks
    remote requests, sandbox-hostile APIs, unguarded storage, emoji and
    dingbats, placeholders, image alt and dimensions, landmarks, the beam,
    gradient headings, theme tokens, the guarded reveal system, the
    reduced-motion block, focus-visible styles, fonts and size; the site
    structure (every `ROUTES` view exists, a 404 view, every `#/` and
    `#anchor` link and every icon resolves, one H1 per view, at least five
    home sections, 1-4 plans with a matching `.plans` grid, labelled form
    controls); and it fails while any of the template's sample identity
    (Pulsegrid, its people, customers, addresses) is left in the page.
    Add `--files` for a deployed site that keeps `images/` and `fonts/`
    beside the page. `--template` is only for the un-inlined source.
11. **Review in a browser, twice.** Screenshot 1440, 1024, 768, 390 and
    360 px in light and dark. Critique as a demanding designer (hierarchy,
    rhythm, crops, copy, empty space, wrapping), fix, and shoot again. Click
    through every route and interaction, test in
    `<iframe sandbox="allow-scripts">` from disk, and confirm zero console
    errors and no horizontal overflow (compare `scrollWidth` with
    `innerWidth` under mobile emulation, with the comparison table and
    on-call tab open). Then walk
    [references/quality-checklist.md](references/quality-checklist.md).

## Adapting to a real brief

- **Counts flex.** Plans: 2-4 cards; set `.plans { grid-template-columns:
  repeat(n, minmax(0, 1fr)) }` to the count, keep one `.plan--featured`,
  give each card a `?plan=` slug that has an entry in `PLANS` (the first
  entry is the default and, if free, shows no billing cadence), and match
  the comparison table: one `<th>` per plan (mark the featured one
  `class="feat"`) and one value per plan in each `COMPARE` row; the column
  count and highlight follow the table head. A fifth tier goes in the
  Enterprise strip. Logos: 4-6, with `.logo-row` set to `repeat(n, ...)`.
  Quotes: 3 (no "Show all", added automatically) or 7-9; with 4-6 the
  button only matters on phones. Numbers: 3 or 4, with `.num-grid` to match.
  Routes: rename or drop any companion route in `ROUTES` together with its
  links; keep home, a 404 and at least one route with a form.
- **Real facts only.** Anything the brief does not give (customer names,
  logos, quotes, metrics, the numbers band, changelog entries, status
  history, office addresses, legal entity, prices, dates) is drafted as
  clearly plausible placeholder copy and listed in your final reply for the
  user to confirm or replace. Never invent certifications, compliance
  badges (SOC 2, ISO 27001, HIPAA, GDPR claims), uptime SLAs, awards or
  security guarantees: the `#security` section and `LEGAL` text state only
  what the user confirms, otherwise they say what the product does
  (encryption, SSO) without a certificate.
- **People photos.** Real founders, team or named customers: ask for their
  photos. Generated portraits are stand-ins; say so in the reply. Without
  photos, testimonials can use the `.initials` chips.
- **Shipped images.** `av-1` to `av-9.webp` (neutral studio portraits) and
  `team-support.webp` (generic team at a table) may stay as neutral
  placeholders, called out as stand-ins. `night-page.webp` (phone glowing on
  a bedside table) fits only alerting, on-call or notification products;
  otherwise regenerate the editorial image for the brief's core promise.
  `story-adaeze.webp` is the sample customer's portrait: regenerate it for
  the buyer's story and rename the file (the validator fails on the old
  name in `--files` mode).
- **Deliverable.** No project: the single HTML file (workflow step 9), with
  fonts and images embedded so it also previews in a sandboxed iframe. A
  normal deployed site may keep files beside the page (`--files`). A
  framework project: port per workflow step 2.
- **Domain mismatch.** Keep the section order and swap the vocabulary, not
  the components. A billing or finance tool: the console shows invoices and
  payouts (KPIs, a revenue chart from `MONITORS`-style rows), the tour tabs
  become reconciliation, approvals and reports, `#/status` can stay or
  become a public roadmap. A developer API or AI product: the console shows
  requests, latency and keys, setup steps show its real CLI or SDK, and
  `night-page` is replaced. A non-technical product with no status page or
  changelog: drop those routes and their footer links.

### Replace checklist (sample strings outside the data arrays)

`<head>` title, description and OG tags (route titles follow `BRAND` and
`<title>`); header and footer brand name and `brand-mark` symbol; hero copy;
`#features` bento copy (`billing-export`, `edge-eu wildcard`); the product
window (`role="img"` label, workspace name Norvane, people Maya Okafor,
Jonas Lindgren, Ravi Pillai, Hiroko Tanabe, Dan Whitcombe and their
initials); `#alerting` caption; `#tour` incident and on-call panels;
`#setup` code tabs (`pulsegrid login`, `pulsegrid.yml`, `api.example.com`,
`status.example.com`) and the `code-out-text` strings in the script;
the numbers band and its `aria-label`; the `#customers` story (Adaeze Nwosu,
Norvane mark, `story-adaeze.webp`, its alt text); the auth aside quote
(Kenji Hayashida); contact offices and team photo alt; status page H1;
footer legal entity; `LEGAL` contact address (and the SLA percentages in
`LEGAL.terms`); the "SOC 2 Type II" claims in the mega menu and
`#security`, which stay only if the user confirms them; customer symbols
`m-norvane` ... `m-marisco` in the sprite. The validator lists any sample
name you miss.

## Constraints

- Standalone output: one HTML file, no frameworks, CDNs, Google Fonts,
  remote images or network calls. Fonts and images are inlined data URIs
  (`scripts/inline-assets.mjs` embeds the template's CDN fonts).
- Sandbox restrictions apply when the page is previewed inside a sandboxed
  iframe (the single-file output): no `fetch`, XHR or WebSocket, storage only
  inside try/catch with an in-memory fallback, state-first routing that works
  when the frame refuses URL changes. A deployed site or framework project
  does not need them (a real form endpoint may post with `fetch`). Never use
  `alert/confirm/prompt`, `window.open` or top navigation.
- Content is visible without JavaScript; reveal styles live under `.js` with
  a timed fallback. `prefers-reduced-motion` removes movement.
- Icons are inline SVG in Lucide grammar; no emoji or Unicode dingbats.
- No real brands, people or customer claims unless the user supplies them;
  invented companies get invented SVG marks.
- Light theme by default, with a complete dark theme behind the toggle.
- English copy unless the user asks otherwise.
