# Route inventory

The worked example has 27 routes rendered from 17 page sections. Product and
collection pages are rendered from data (`PRODUCTS`, `COLLECTIONS`) by one
template each. The table is the sample's inventory, not a requirement: a
buyer's store keeps home, an index with item pages, bag, checkout, at least one
help page, contact and the 404, and renames, adds or drops the rest. Keep the
inventory, the navigation and the footer in sync.

Renaming a route: change `data-page`, every `href="#/old"`, `data-nav` and
`data-detail="old"`, and the `'old'` keys and values in `NAV_OF` and
`resolveRoute()` / `route()` in the script (search for `'old'` and `#/old`).
Static routes are read from the markup (every `<section data-page>` without
`data-detail`), so adding or dropping a static page needs no router edit.

| Route | Page | Template / data |
| --- | --- | --- |
| `#/` | Home: sage hero, popular profiles, activity bento, spotlight, promise band, store visit, reviews, FAQ, newsletter | `data-page="home"` |
| `#/catalog` | Shop all: chips, filters, sort, results, empty state (accepts `?q=` and `?c=`) | `catalog` |
| `#/catalog/pace-one` | Pace One, running | `product` + `PRODUCTS` |
| `#/catalog/tempo-knit` | Tempo Knit, running | `product` |
| `#/catalog/court-shift` | Court Shift, basketball | `product` |
| `#/catalog/studio-motion` | Studio Motion, basketball | `product` |
| `#/catalog/trail-form` | Trail Form, training | `product` |
| `#/catalog/field-runner` | Field Runner, training | `product` |
| `#/catalog/city-quiet` | City Quiet, lifestyle | `product` |
| `#/catalog/daily-arc` | Daily Arc, lifestyle | `product` |
| `#/collections` | Four collections with models and a comparison table | `collections` |
| `#/collections/running` | Running | `collection` + `COLLECTIONS` |
| `#/collections/basketball` | Basketball | `collection` |
| `#/collections/training` | Training | `collection` |
| `#/collections/lifestyle` | Lifestyle | `collection` |
| `#/cart` | Bag with quantities, promo code and summary | `cart` |
| `#/checkout` | Demo checkout and confirmation (no payment) | `checkout` |
| `#/saved` | Saved pairs or empty state | `saved` |
| `#/size-guide` | Size finder, measuring steps, size chart, fit by model | `size-guide` |
| `#/delivery` | Delivery options, 60-day wear test, returns steps, resole service | `delivery` |
| `#/faq` | Questions by topic (tabs + accordion) | `faq` |
| `#/contact` | Contact form with topic fields and fitting slots (accepts `?topic=`) | `contact` |
| `#/about` | Story, numbers, timeline | `about` |
| `#/brands` | Our three lines with their products | `brands` |
| `#/newsletter` | Monthly note sign-up and recent issues | `newsletter` |
| `#/legal` | Privacy, terms of sale, cookies (accepts `?tab=`) | `legal` |
| any other | Designed 404 with search and bestsellers | `not-found` |

Product names are invented and never echo a real trademark. `saved` and
`legal` exist so the heart icon and the footer legal links have destinations.

## Router contract (demo)

- Route state lives in JS (`currentPath`). Internal links are intercepted,
  rendered directly, then synced with `history.pushState` inside try/catch;
  `hashchange` and `popstate` re-render on back/forward.
- On every route: close overlays, render dynamic content, swap the active
  section with a short fade, update `document.title`, set `aria-current` on
  the nav, scroll to top, observe reveals and focus the H1.
- Unknown paths, unknown products and unknown collections show the 404 page
  with the requested path.

In a framework project use real routes (`app/catalog/[slug]/page.tsx`,
`app/collections/[slug]/page.tsx`, `app/not-found.tsx`) and the framework link
component. See `framework-adaptation.md`.
