# Icon library

Every pictorial mark is an inline SVG. Never emoji, Unicode arrows, check
marks, stars, diamonds, sparkles, the command-key glyph or any other dingbat
character, and never icon fonts. The validator fails the build on them.

## Sprite pattern (as in template.html)

The template declares one hidden sprite right after `<body>` and references
symbols with `<use>`. This keeps markup short and every icon themeable.

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <symbol id="i-arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </symbol>
  </defs>
</svg>

<svg class="ic" aria-hidden="true"><use href="#i-arrow-right"/></svg>
```

- Lucide grammar: 24 viewBox, `stroke="currentColor"`, stroke-width 2, round
  caps and joins. Size with CSS (`.ic` is 1em; buttons use 16px, nav 14px).
- Decorative icons get `aria-hidden="true"`; icon-only buttons get an
  `aria-label` on the button.
- Use `style="fill:var(--bg)"`, not `fill="var(--bg)"`, when a symbol needs a
  theme token (presentation attributes do not resolve `var()` reliably).
- In React/Vue/Svelte outputs use `lucide-react` / `lucide-vue-next` /
  `lucide-svelte` with the same names instead of the sprite.

## Symbols in the template

| Purpose | Symbol id |
| --- | --- |
| CTA arrow, back link | `i-arrow-right`, `i-arrow-left` |
| Menus, disclosure, breadcrumbs | `i-chevron-down`, `i-chevron-right` |
| Plan checks, comparison yes/no | `i-check`, `i-minus` |
| FAQ, mobile menu | `i-plus` (rotates to a cross), `i-menu`, `i-x` |
| Theme toggle | `i-sun`, `i-moon` |
| Monitoring vocabulary | `i-activity`, `i-heart-pulse`, `i-badge-check`, `i-radio`, `i-globe`, `i-dashboard`, `i-search`, `i-command` |
| Alerting | `i-bell`, `i-bell-off`, `i-layers`, `i-alert`, `i-alert-circle`, `i-circle-check` |
| Time and people | `i-clock`, `i-calendar`, `i-history`, `i-users`, `i-undo`, `i-rotate` |
| Channels | `i-smartphone`, `i-message`, `i-phone`, `i-mail`, `i-webhook`, `i-inbox` |
| Security | `i-shield-check`, `i-lock`, `i-key`, `i-map-pin` |
| Product / settings | `i-plug`, `i-sliders`, `i-terminal`, `i-copy`, `i-file`, `i-zap`, `i-database`, `i-building`, `i-life-buoy` |
| Forms | `i-eye`, `i-eye-off`, `i-search-x` (empty state) |
| Footer marks | `i-rss` (changelog), `i-at` (contact), `i-activity` (status) |
| Rating star (filled) | `i-star`, colored `#D99A1E` light / `#E9B04A` dark |

Add new icons by copying the path data from Lucide into a new `<symbol>`;
keep the same attributes.

## Brand mark

`brand-mark` is a 32px rounded square in `--ink` holding four probe dots,
one lit in beacon blue with a faint ring. It doubles as the favicon (inline
SVG data URI in `<head>`). Redraw it for the user's product with the same
rules: one simple geometric idea, one blue accent, works at 16px.

## Fictional customer marks

The logo row and story card use invented companies, each with a simple
abstract SVG mark and a different type treatment so the row reads like six
different brands:

| Company | Symbol | Wordmark class |
| --- | --- | --- |
| Norvane | `m-norvane` (north arrow) | `wm-caps` |
| quillory | `m-quillory` (quincunx) | `wm-italic` |
| Fernhold | `m-fernhold` (leaf) | default |
| OSLERO | `m-oslero` (open ring) | `wm-caps` |
| Tidewell | `m-tidewell` (two waves) | `wm-light` |
| marisco | `m-marisco` (blocks) | `wm-mono` |

These are the sample's customers: replace the names and symbol ids
(`m-<name>`) for a real brief; the validator fails while any of them is
left. Match `.logo-row` columns to the number of logos (4-6).

Never use real company logos or names for social proof unless the user
supplies their own customers. If the product genuinely integrates real
services and the user wants them shown, use monochrome marks with visible
text labels, never recolored and never as decoration.
