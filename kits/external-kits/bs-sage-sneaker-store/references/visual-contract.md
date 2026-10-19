# Visual contract

What must survive any rebrand. Everything else (copy, product range, number of
pages, exact palette values within the sage family) may change.

## Signature elements

1. **Sage hero** (`sneaker-hero`): a single rounded, flat sage panel about
   650 px tall, split in two: copy on the left 61%, the model photograph in the
   right 51%. No second hero style, no centred headline, no gradient wash.
   Exactly six elements: eyebrow, headline, one short subline, search,
   activity pills, one small service card. No stat strips or rating badges.
2. **Oversized white uppercase type**: the hero headline is a heavy grotesk
   (Archivo 800 or a comparable face), white, uppercase,
   `clamp(52px, 6.8vw, 88px)` and never larger, line height 1.02, tracking
   -0.035em, three lines on desktop and two on phones. It starts top-left, below
   the eyebrow, about 98 px under the panel's top edge (176 px from the page top
   at 1440x900).
3. **Editorial model photograph** (`sneaker-model`): a full-length model seated
   or standing on seamless sage paper, wearing one of the store's own products,
   with about 90 px of paper above her head. It fills the right 51% of the panel
   at full height and blends in through a soft left-edge mask because its paper
   matches the panel. It must show the head and both shoes at every width.
   Natural, lightly graded tones only.
4. **White proof cards** (`sneaker-proof`): in the hero, one small white service
   card on the photo's lower-right corner (three icon rows). Promise band: three
   white cards on sage with large display numbers. They never cover the
   product being worn.
5. **Hero search** (`hero-search`): a 370 px white pill input with a round ink
   search button inside, followed by four small uppercase activity pills that
   link to collections.
6. **Clean product grids**: square product photos on one matched backdrop, one
   angle and one light; uppercase product names; mono meta; swatch, colourway
   and price on one line.

## Fidelity rules

- Container, section rhythm, radius scale and shadow scale follow
  `style-guide.md`.
- Type never exceeds the hero's 88 px; section heads stay around 36-39 px.
- Sage is the only accent; nothing purple, violet or lavender anywhere. Ink carries buttons and small text; white is for
  display type on sage.
- The footer ends with the brand name as a full-width sage wordmark sized to
  the container.
- Inner pages reuse the type, cards and controls but do not repeat the home
  hero. Product and collection pages carry their own imagery.

## Responsive behaviour

- 901 px and up: split panel as above; the service card sits 24 px from the
  panel's right and bottom edges, beside the lower shoe.
- 701-900 px: same split; the search narrows to 300 px, the photo focuses at
  40% so the raised shoe clears the search, and the service card is hidden.
- 700 px and below: the panel stacks eyebrow, headline (52 px, "Made / to
  move."), subline, full-width search and one row of pills on sage, then the
  photo 360 px tall with a soft top fade; no service card.
- Controls stay at least 44 px high on touch; no horizontal overflow from 360
  to 1920 px.

## Image direction

One art direction for the whole set (see `image-plan.md`): seamless sage and
pale sage-grey paper, polished concrete and pale oak, soft north-window light
from the upper left, low-contrast matte grade, muted accents only in the
footwear. No text, logos, stripes or swooshes. One image per product; context
photos show the store's own products in use.
