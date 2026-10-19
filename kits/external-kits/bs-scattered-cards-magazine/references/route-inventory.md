# Route inventory

The route set follows the buyer's brief; this table is the worked example
(Ferrow), with 36 routes: 15 page types, of which `story`, `topic`
and `product` are templates rendered from the content collections in
`<script type="application/json" id="content">` (`stories`, `topics`,
`archive`, `products`, `plans`). Keep this table, the navigation and the
collections in sync when adding or removing content.

| Route | Page | Title | What it contains |
| --- | --- | --- | --- |
| `#/` | `home` | A different way of seeing. | Fan hero (eyebrow, five cards, headline, lead, one CTA), topic index, Issue 09 grid, full-bleed feature, carousel, issue band with contents, stats, letters, newsletter |
| `#/stories` | `stories` | Stories | Search, topic and saved chips, sort, grid or index view, empty state |
| `#/topics` | `topics` | Topics | Full ruled index with thumbnails, descriptions and counts |
| `#/shop` | `shop` | Issues, prints and notebooks | Category chips, sort, product stages, quick add, subscription band |
| `#/cart` | `cart` | Your bag | Lines with quantity and remove, delivery zone, totals, empty state |
| `#/checkout` | `checkout` | Checkout | Contact, address, delivery method, payment note, summary, validation, confirmation |
| `#/subscribe` | `subscribe` | Four issues a year, sent to your door. | Cover fan, for me or gift, 1 or 2 years, two plans, gift details form, FAQ |
| `#/about` | `about` | A slow magazine about ordinary things done well. | Statement, masthead portraits, principles, stockists, pitch band |
| `#/contact` | `contact` | Write to us | Copyable addresses, tabs: pitch, stockists, anything else, validated forms |
| `#/faq` | `faq` | Questions, answered | Category filter, search, grouped accordions, empty state |
| `#/newsletter` | `newsletter` | The Ferrow Letter | Sign-up with frequency choice, sample letter on paper |
| `#/delivery` | `delivery` | Delivery and care | Rate table by zone, print care steps, returns accordion |
| `#/privacy` | `privacy` | Privacy | Sticky contents, four sections |
| `#/terms` | `terms` | Terms of sale | Sticky contents, four sections |
| (any unknown path) | `not-found` | This page went to print without us. | 404 numeral, front page and search actions, three suggested story cards |
| `#/stories/fashion` | `story` | Clothes for an unhurried day | Article: 6 min, Issue 09, topic people |
| `#/stories/ceramics` | `story` | The quiet shape of a vessel | Article: 8 min, Issue 09, topic objects |
| `#/stories/interior` | `story` | A room for the everyday | Article: 7 min, Issue 09, topic spaces |
| `#/stories/food` | `story` | A table worth gathering around | Article: 7 min, Issue 09, topic food |
| `#/stories/botanical` | `story` | A small green world | Article: 5 min, Issue 09, topic nature |
| `#/stories/studio` | `story` | Inside the working studio | Article: 8 min, Issue 08, topic people |
| `#/stories/architecture` | `story` | A house that listens | Article: 10 min, Issue 08, topic architecture |
| `#/stories/coast` | `story` | Where the land takes a breath | Article: 9 min, Issue 07, topic places |
| `#/topics/spaces` | `topic` | Spaces | Online stories, print archive, other topics |
| `#/topics/objects` | `topic` | Objects | Online stories, print archive, other topics |
| `#/topics/places` | `topic` | Places | Online stories, print archive, other topics |
| `#/topics/people` | `topic` | People | Online stories, print archive, other topics |
| `#/topics/architecture` | `topic` | Architecture | Online stories, print archive, other topics |
| `#/topics/food` | `topic` | Food | Online stories, print archive, other topics |
| `#/topics/nature` | `topic` | Nature | Online stories, print archive, other topics |
| `#/shop/issue-09` | `product` | Issue 09: The Everyday | Issue, from €22 |
| `#/shop/issue-08` | `product` | Issue 08: Thresholds | Issue, from €22 |
| `#/shop/issue-07` | `product` | Issue 07: Salt & Stone | Issue, from €22 |
| `#/shop/field-notebook` | `product` | Field notebook, set of two | Stationery, from €28 |
| `#/shop/olive-print` | `product` | Olive shadow print | Print, from €140 |
| `#/shop/coast-print` | `product` | The coast from above print | Print, from €140 |

## Navigation map

- Header: Stories, Topics, Shop, Subscribe, About; search; bag.
- Footer: Read (stories, topics, a topic, the Letter), Shop (issue, back issues,
  prints, subscribe), Ferrow (about, submit a story, stockists anchor, questions),
  Help (delivery, bag, privacy, terms), legal row.
- Contextual: topic links in every story kicker, issue links from stories and
  the print archive, "Read online" links in every table of contents, prints
  link back to their story, 404 links to three stories.

## Adding a route

1. Add the entity to its collection with a unique slug, real copy and its own
   image ids (see `image-plan.md`).
2. Link it from at least one visible place (a card, a list, a nav or footer link).
3. In the single file the router picks it up automatically (one-segment
   routes are read from the `data-page` sections, entries from the content
   JSON); in a framework,
   add the page file or dynamic segment and `generateStaticParams` (or the
   stack's equivalent).
4. Run `scripts/validate-design.mjs`; it fails on links that resolve nowhere.
