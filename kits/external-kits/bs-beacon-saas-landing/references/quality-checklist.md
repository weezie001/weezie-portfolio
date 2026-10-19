# Pre-delivery quality checklist

Run `node scripts/validate-landing.mjs <your-file.html>` first (add `--files` for a deployed site that keeps its images and fonts beside the page; it automates the items
marked [auto]), then walk the page in a real browser. Do at least two review
passes: screenshot, critique as a demanding designer, fix, repeat.

## Premium UI

- [ ] Geist + Geist Mono embedded and actually rendering (no fallback font in screenshots). [auto: @font-face]
- [ ] Hero H1 is 60px / weight 500 on desktop (40px on phones), two lines on desktop and three on phones, gradient fill visible, subtitle 18px in 2-3 lines, both CTAs on one line each.
- [ ] Hero holds only badge, H1, subtitle, two buttons and the one beam; H1 top about 227px at 1440x900 and 390x844; the logo row shows in the first viewport at 1440x900; the product console sits in `#product` after the features.
- [ ] Section H2s stay at or under about 27px; no purple, violet or lavender anywhere.
- [ ] Section compositions vary; no two adjacent sections share a layout family.
- [ ] One accent only; status colors appear only where they mean status.
- [ ] Body text contrast at least 4.5:1 in both themes; no grey-on-grey.
- [ ] Radius scale and shadow scale followed; the featured plan and product window are the only strongly raised surfaces.
- [ ] Copy is specific and believable: product vocabulary in every UI string, organic numbers, real-sounding names, no em dashes, no lorem. [auto: placeholders]

## Imagery

- [ ] Every photo has a role from `image-plan.md` and matches the copy beside it.
- [ ] One art direction across all photos; no text, logos or fake screens inside photos.
- [ ] Crops checked at desktop, tablet and phone: no cut heads, the subject stays in frame.
- [ ] Every `<img>` has a meaningful alt (or `alt=""` if decorative), width/height, `decoding="async"`, `loading="lazy"` below the fold. [auto]

## Motion

- [ ] Hero content finishes animating within about 0.9s; nothing waits for scroll above the fold.
- [ ] Reveals are once-only, 450-750ms, ease-out, staggered; content visible without JS. [auto: .js guard]
- [ ] Product motion explains something (chart draw, region confirmation, live counter) and stops off screen.
- [ ] `prefers-reduced-motion: reduce` shows final states with no movement. [auto: block present]

## Completeness and interactions

- [ ] Every nav item, CTA, card link, footer link and social mark goes to a section or a route with real content; no `href="#"`.
- [ ] Mega menu: hover intent, click, arrow keys, Esc, outside click.
- [ ] Mobile sheet: opens, traps focus, closes on Esc, backdrop and link click.
- [ ] Console range switch updates chart and KPIs; chart tooltip follows the pointer; "See it in action" scrolls to the console.
- [ ] Tour tabs and setup steps: click and arrow keys; code copy shows "Copied" (or "Selected" where clipboard is blocked).
- [ ] Pricing switch changes prices, notes and the plan carried into sign-up; comparison disclosure opens.
- [ ] Testimonials "Show all" and "Show fewer"; FAQ accordion.
- [ ] Every form: inline errors on empty/invalid submit, live re-validation, loading state, success state.
- [ ] Routes: sign-up (plan chip), sign-in (forgot, SSO), contact, changelog (filters, search, empty state, clear), status (bar tooltips), privacy, terms, 404. Each has one H1 and a back link; titles change.
- [ ] Theme toggle switches every surface, chart, code and photo card correctly and is remembered when storage is allowed.

## Responsiveness

- [ ] 1440, 1024, 768, 390 and 360 px checked; mobile layouts are designed, not squashed.
- [ ] No horizontal page overflow at any width (check `document.documentElement.scrollWidth` and `innerWidth` with mobile emulation), including with the comparison table and on-call tab open.
- [ ] Tap targets at least 44px; the console window drops the sidebar and secondary columns on phones.

## Accessibility

- [ ] Skip link, `header/nav/main/footer` landmarks, one H1 per view. [auto]
- [ ] `:focus-visible` ring on every interactive element; programmatic focus targets have no ring. [auto: styles]
- [ ] Labels above inputs; errors linked with `aria-describedby`; `aria-invalid` set.
- [ ] Tabs use `role="tablist"/"tab"/"tabpanel"` with `aria-selected` and roving tabindex; accordions use `aria-expanded`/`aria-controls`; the switch uses `role="switch"` + `aria-checked`.
- [ ] Decorative product UI is `aria-hidden` behind one descriptive `role="img"` label.

## Performance and sandbox

- [ ] Zero network requests: no CDN, Google Fonts or remote images. [auto]
- [ ] No console errors, including inside `<iframe sandbox="allow-scripts">` from disk (routing still works when URL changes are refused).
- [ ] Storage access wrapped in try/catch with an in-memory fallback; no alert/confirm/prompt, window.open or top navigation. [auto]
- [ ] Built file at most 5 MB (hard cap 8 MB); images WebP q78-82 at sensible widths. [auto]

## Real brief

- [ ] No sample identity left: Pulsegrid, its people, customers, offices, `story-adaeze`. [auto]
- [ ] Every drafted fact (quotes, logos, numbers, prices, addresses, dates, compliance claims) listed in the reply for the user to confirm.
- [ ] Generated portraits of real people called out as stand-ins.
