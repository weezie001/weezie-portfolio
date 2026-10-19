# Page library

Page roles, required content and the interactions each page must carry. The
full list of routes is in `route-inventory.md`.

## Home

1. Sage hero: split panel; eyebrow, three-line 88 px white uppercase headline,
   a four-word subline, pill search, four activity pills on the left; the model
   photograph on the right with one small white service card.
2. Popular profiles: tabs (Bestsellers, New in, Under $150) swapping a
   four-card grid.
3. Activity bento: two to four collection tiles with context photos (four in
   the sample; the grid fills without holes for two or three; more stay on the
   Collections page).
4. Spotlight: one product on a sage-tint panel with three material hotspots,
   three spec numbers and a price CTA.
5. Promise band: three white proof cards on sage with display numbers.
6. Store visit: store photo with an overlapping card (address, hours, booking).
7. Reviews carousel with buttons, swipe and arrow keys.
8. FAQ preview: four questions and a link to all questions.
9. Newsletter band (the one dark surface) with validation and success.

## Catalog

Breadcrumb, H1 with lead, activity chips with counts, sort select, filter rail
(search, size in stock, price bands, colour families, Wide), result count,
removable active-filter chips, 3-column grid, empty state that explains which
filter to relax. Under 1024 px the rail becomes a bottom sheet with a "Show N
pairs" button.

## Product detail

Breadcrumb to its collection, sticky gallery (studio view with hover zoom,
upper detail, worn view when a context photo exists), collection and line
label, rating that scrolls to reviews, H1, colourway with swatch, price that
updates with width, description, width segmented control (when Wide exists),
size grid with sold-out and low-stock states, status line with UK/EU
conversion, add-to-bag with loading and success, save toggle, delivery estimate
computed from today, accordion (materials, fit, care, delivery), four spec
tiles, worn image with caption, reviews with fit scale, four related products,
sticky buy bar on phones.

## Collections and collection

Index: alternating image and text rows with model chips, plus a comparison
table (weight, drop, stack, fit, price). Collection: image hero with intro, the
two model cards and a "Which one?" panel, three buying tips, links to the other
collections.

## Bag, checkout, saved

Bag: lines with quantity, remove, unit price, free-delivery meter, summary,
promo code (the first code in `CONFIG.promoCodes` valid, others show an inline error), checkout link and
assurances. Checkout: contact, address, delivery method (changes the total),
a disabled payment step that says payment is not collected, place-order with
validation, confirmation with order number, delivery date and total. Saved:
grid of hearted products or an empty state.

## Help and company pages

- Size guide: foot-length finder (validates 21-32 cm, adjusts for the chosen
  model's fit), three measuring steps with simple line drawings, size chart
  (US men, US women, UK, EU, cm) that highlights the match, fit note per model.
- Delivery: four shipping options with prices, the 60-day wear test, return
  steps, resole service facts and CTA.
- FAQ: topic tabs over an accordion and a help card.
- Contact: name, email, topic (order number or fitting slots appear by topic),
  message, preview-only success; store card with address, hours, phone, email.
- About: story with a wide craft photo, four numbers, three story blocks,
  timeline, CTA to lines and the store.
- Our lines: the product lines with their product cards (three in the sample;
   drop the page and its links if the business has no lines).
- Newsletter: sign-up with interests and recent issues.
- Legal: privacy, terms of sale and cookies tabs.
- 404: sage panel with the missing path, search, two actions, bestsellers.

## Content rules

Specific, consistent and fictional: real-sounding product specs and fit notes,
one delivery policy (2-3 working days, $8, free over $150; express $18), one
return policy (60-day wear test), one resole price ($45). No lorem ipsum, no
generic names, no claims about real customers.
