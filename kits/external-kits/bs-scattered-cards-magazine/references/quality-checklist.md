# Quality checklist

Run this before delivery, at 1440, 1024, 768 and 390 px, then again after
fixes. Treat every unchecked line as a bug.

## Premium UI

- [ ] The first screen reads in one glance: eyebrow, five-card fan, two-line headline, short lead, one outlined CTA. Headline 62px desktop / 40px phone, no section heading above 42px.
- [ ] Type uses the documented families and scale; headings balanced; one italic emphasis at most per headline.
- [ ] One accent colour; neutrals from the token set; body contrast at least 4.5:1.
- [ ] Section compositions vary; no two consecutive sections share a layout family.
- [ ] Hairline rules, radius scale and tinted shadows match the style guide.
- [ ] No eyebrow above every section, no badges on photos, no decorative strips, no em dashes.
- [ ] Copy is specific (names, places, prices, page numbers) and reads like a real publication.

## Imagery

- [ ] Every slot in `image-plan.md` is filled with its own subject and crop.
- [ ] No image is reused for an unrelated entity; no text or logos inside images.
- [ ] Faces, hands and horizons are intact at every breakpoint.
- [ ] Every `<img>` has alt text, intrinsic size or aspect ratio, `decoding="async"`, lazy loading below the fold.

## Motion

- [ ] The fan deals once; the whole hero is settled within 900ms and shows without script after 2.4s.
- [ ] Nothing is hidden without JavaScript or with reduced motion.
- [ ] Only transform, opacity, clip-path (and rotate/translate) animate.
- [ ] Route changes fade, scroll to top and move focus to the page `h1`.

## Completeness

- [ ] Every nav item, card, footer link and CTA reaches a populated page.
- [ ] Stories: search, topic chips, saved filter, sort, grid and index views, empty state.
- [ ] Story pages: facts, pull quote, detail figure, save, copy link, next story, topic archive.
- [ ] Topic pages: online stories, print archive with buy or sold-out state, other topics.
- [ ] Shop: category chips, sort, quick add; product options update price and preview; quantity; related items.
- [ ] Bag drawer and bag page with quantity, remove with undo, delivery zone, totals, empty state.
- [ ] Checkout: inline validation, delivery method pricing, summary, honest confirmation.
- [ ] Subscribe: term and gift toggles, gift validation, plan added to the bag.
- [ ] Contact tabs, FAQ filter and search with empty state, newsletter, delivery, privacy, terms, designed 404.
- [ ] Search overlay: grouped results, highlighted matches, suggestions, empty state, Esc to close.

## Responsiveness

- [ ] No horizontal overflow from 360 to 1920 px (rotated cards are clipped by their section, not the page).
- [ ] Fan: 5 cards at every width; captions never cut by a neighbouring card (stacking switches at 960px).
- [ ] Touch targets at least 44px; CTAs full width on phones; tables scroll inside their wrapper.

## Accessibility

- [ ] Landmarks, skip link, one `h1` per page, labelled fields, `aria-invalid` and described errors.
- [ ] Menu, search and bag sheets trap focus, close on Esc and overlay click, and restore focus.
- [ ] Visible `:focus-visible` ring on every interactive element; tabs support arrow keys.
- [ ] Icon-only buttons have names; decorative SVGs are `aria-hidden`.

## Performance and sandbox (single-file deliverable)

- [ ] `node scripts/validate-design.mjs site/index.html` passes in its default mode (no sample identity left); `--files` for a deployed site.
- [ ] Page under 5 MB (8 MB cap); fonts under about 250 KB; every image inlined once.
- [ ] Zero network requests and zero console errors from disk and inside `<iframe sandbox="allow-scripts">`.
- [ ] Routing works by click inside the sandbox; forms use `type="button"`; clipboard has the textarea fallback.
