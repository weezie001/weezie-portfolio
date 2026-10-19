# Icon library

The template defines one inline SVG sprite at the top of `<body>` and uses
icons as `<svg class="i"><use href="#i-name"/></svg>`. Grammar: Lucide style,
24 x 24 viewBox, `stroke="currentColor"`, stroke width 1.75, round caps and
joins, no fills except the star and small dots.

| Symbol | Used for |
| --- | --- |
| `i-search` | Header search, hero search, filter search |
| `i-bag` | Bag button, empty bag |
| `i-heart` | Save toggles, saved link, empty saved state |
| `i-menu`, `i-x` | Mobile menu, close buttons, removable filter chips |
| `i-arrow-right`, `i-arrow-left`, `i-arrow-up-right` | Navigation, carousels, external links |
| `i-chevron-right`, `i-chevron-left`, `i-chevron-down` | Breadcrumbs, selects |
| `i-plus`, `i-minus` | Quick add, quantity steppers |
| `i-check`, `i-alert`, `i-info` | Success, validation, status lines |
| `i-star` (filled) | Ratings; render five and dim the remainder |
| `i-truck`, `i-clock`, `i-store`, `i-package` | Delivery options and estimates |
| `i-return`, `i-swap`, `i-hammer` | Wear test, two-size returns, resole |
| `i-ruler`, `i-footprints` | Size guide, empty catalog |
| `i-pin`, `i-phone`, `i-mail`, `i-message`, `i-calendar` | Store details and contact |
| `i-shield`, `i-lock`, `i-leaf`, `i-sliders`, `i-trash` | Assurances, payment step, guides, filters, remove |

The brand mark is a separate inline SVG: a sage disc with two forward strokes.
The favicon is the same mark as an SVG data URI.

Rules: no emoji, Unicode dingbats or icon fonts. Icon-only buttons get an
`aria-label`; decorative icons get `aria-hidden="true"`. A heart is used only
for a working saved state, a bag only for cart actions, an arrow only for real
navigation. Do not draw third-party logos; social links are text with an
arrow.
