# Quality checklist

Run through this before calling the site finished. Each line is a yes or no.

## Premium UI

- [ ] Archivo (or comparable heavy grotesk) for uppercase display, Geist for body, Geist Mono for labels; fonts from the fontsource CDN in the template, `@fontsource-variable/*` packages or `next/font/google` in a project, embedded as data URIs in the demo.
- [ ] Hero matches the template's anatomy: eyebrow, white uppercase headline at 88 px or less (three lines on desktop, two on phones, top about 176 px down at 1440x900), a short subline, search, four pills, one small service card. Nothing added.
- [ ] No section or page heading larger than the template's (section heads about 39 px, page titles about 68 px).
- [ ] One accent (sage). Ink buttons. No warm beige, brass, purple, violet or lavender anywhere.
- [ ] Body text contrast at least 4.5:1; small text on sage is ink, not white.
- [ ] Radius scale respected: pill controls, 14 px fields, 18 px cards, 28 px panels.
- [ ] Every clickable element has hover, active (scale 0.97), focus-visible, disabled and selected states.
- [ ] At least six different section compositions on the home page; no layout family repeated.
- [ ] Header gains a backdrop on scroll; active nav item is marked.
- [ ] Footer has columns, legal links and the full-width sage wordmark.

## Imagery

- [ ] An image plan with art direction and role-based slots exists.
- [ ] Product photos share backdrop, angle and light; one generated image per product.
- [ ] The hero shows the model's head and both shoes at 1440, 1024, 768 and 390 px.
- [ ] The hero service card never covers the worn product (it is hidden at 900 px and below).
- [ ] Photos keep their natural tones: no duotone, colour wash or blend mode.
- [ ] Context photos show the store's own products; each collection has its own image.
- [ ] No text, logos, stripes or real-brand marks in any image; no uncanny hands.
- [ ] Every `<img>` has meaningful alt (or empty alt for decoration), width and height, lazy loading below the fold.

## Motion

- [ ] Hero content animates in within 900 ms on load and nothing stays hidden.
- [ ] Content is visible without JS and without IntersectionObserver.
- [ ] Only transform and opacity animate (accordion uses grid rows).
- [ ] Reduced motion makes everything instant and keeps feedback.
- [ ] No lingering transform on route containers (drawers stay above the overlay).

## Completeness

- [ ] Every nav item, card, footer link and CTA reaches a designed page.
- [ ] Catalog: activity chips, size, price, colour and width filters, sort, active-filter chips, result count, empty state.
- [ ] Product page: gallery with zoom, width selector that changes price, size grid with sold-out and low-stock states, add-to-bag loading and success, specs, reviews with fit scale, related items.
- [ ] Mini-cart drawer: quantities, remove, free-delivery meter, subtotal, checkout and bag links, empty state.
- [ ] Bag page with promo validation; checkout with validation, delivery methods that change the total, a disabled payment step and a confirmation. No real payment is implied.
- [ ] Search dialog with live results and keyboard access; hero search reaches the catalog with the query.
- [ ] Contact (topic fields, fitting slots), newsletter, size finder, FAQ tabs, legal tabs and 404 all work.
- [ ] Content is specific and consistent (prices, delivery times, return window and resole price match everywhere).

## Responsive

- [ ] No horizontal overflow from 360 to 1920 px.
- [ ] 1024 and 768 px are designed (split hero with the search clear of the shoes, filter sheet, stacked PDP).
- [ ] Phone: stacked hero, round quick-add buttons, quick sizes as a bottom sheet, sticky buy bar on product pages, tap targets 44 px.

## Accessibility

- [ ] Landmarks, skip link, one H1 per route, focus moved to the H1 after navigation.
- [ ] Labels above inputs, `aria-invalid` and error text on failure, live regions for results and toasts.
- [ ] Dialogs trap focus, close on Escape and restore focus to the trigger.
- [ ] Tabs, radio groups and size grids support arrow keys.

## Performance and sandbox

- [ ] Single-file output (the default): one file built with `scripts/inline-assets.mjs`, 5 MB target, 8 MB cap; each image referenced once in the `IMG` map.
- [ ] Zero network requests; no console errors.
- [ ] Single file previewed in a sandboxed iframe: works inside `<iframe sandbox="allow-scripts">`: links render without hash navigation, forms work without `allow-forms`, storage is wrapped in try/catch.
- [ ] `node scripts/validate-design.mjs path/to/index.html` passes on your output (add `--files` for a deployed site that keeps images/ and fonts/ beside the page). It fails while any sample name (Stride Common, Rivergate, product, line or reviewer names, `STRIDE10`, `SC-` order numbers) is left.
- [ ] `SITE` and `CONFIG` at the top of the script are set for the buyer's brand and market; the Replace checklist in SKILL.md is done.
