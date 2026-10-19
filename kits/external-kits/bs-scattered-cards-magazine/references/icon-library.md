# Icon library

Icons are inline SVG in Lucide grammar: 24 x 24 viewBox, `fill="none"`,
`stroke="currentColor"`, stroke width 1.6, round caps and joins. The template
defines them once as `<symbol>` elements in a hidden sprite and uses them with
`<svg class="ic"><use href="#i-name"/></svg>`. Sizes: 20px default, 16px
small, 24px in the search field.

| Symbol | Use |
| --- | --- |
| `i-search` | Header search, search fields |
| `i-bag` | Header bag button (with count badge) |
| `i-menu`, `i-x` | Mobile menu, sheet close |
| `i-arrow-right`, `i-arrow-left` | Text links, CTAs, carousel buttons |
| `i-arrow-up-right` | "Read online" in contents lists |
| `i-chevron-right`, `i-chevron-down` | Breadcrumbs, selects |
| `i-plus`, `i-minus` | Quantity steppers, quick add |
| `i-bookmark` | Save a story (filled when saved) |
| `i-link`, `i-copy` | Copy link, copy email |
| `i-check` | Feature lists, success states, toasts |
| `i-grid`, `i-rows` | Grid and index views |
| `i-truck`, `i-package`, `i-return` | Delivery, dispatch and returns notes |
| `i-gift` | Gift subscription |
| `i-pen`, `i-camera`, `i-book`, `i-leaf` | About principles |
| `i-sun`, `i-drop`, `i-frame` | Print care steps |
| `i-mail`, `i-rss`, `i-instagram` | Footer social row |
| `i-loader` | Button loading state (the only spinning element) |
| `i-alert` | Field errors |
| `i-mark` | Brand mark: three paper cards fanned (filled white, stroked) |

Rules:

- No emoji, Unicode dingbats or arrows typed as characters, no icon fonts, no
  remote icon requests.
- Icon-only buttons need an `aria-label` that names the action (and the bag
  count). Decorative icons inside labelled controls are `aria-hidden`.
- A bookmark only where saving works; an arrow only for real navigation; the
  bag only for cart actions.
- Social icons in the footer are the only third-party glyphs; never draw
  customer or partner logos.
