# Figma file structure

Two files, not one dumping ground.

## File 1 — Identity master

Pages, in order:

1. `Cover` — job name, status, date
2. `Brief` — pasted strategy (or screenshot of the markdown)
3. `Exploration` — sketches, type tests, colour tests (hidden at handover)
4. `Directions` — max 3 concepts, labelled A B C
5. `Logo system` — all lockups on light / dark / photo / colour field
6. `Clear space & min size`
7. `Don’ts` — 6 real mistakes, not clip-art
8. `Colour` — palettes, ratios 60/30/10, contrast pairs
9. `Type` — scale, specimen, pairing
10. `Grid & space`
11. `Icon & imagery`
12. `Tokens` — variable collection that matches `05-tokens`
13. `Archive`

**Figma variables** (create these collections):

- `primitive/color`
- `semantic/color`
- `primitive/space`
- `primitive/type`
- `semantic/elevation`

Primitives are raw. Semantics are `bg/page`, `text/primary`, `action/default`. Never bind a button to `blue-600` directly.

## File 2 — Applications

Pages:

1. `Stationery`
2. `Digital` (favicon, OG, email, slides)
3. `Social`
4. `CIP` (only if sold)
5. `Mockups` (presentation only)

Components are built from Identity variables. If an application invents a new colour, it is wrong.

## Export presets

| Asset | Format | Notes |
|---|---|---|
| Logos | SVG + PNG @2x | SVG first, always |
| Mark / favicon | SVG + PNG 16/32/48/180/512/1024 | |
| Social | PNG sRGB | Exact platform sizes in `07-applications/social` |
| Print | PDF + AI/SVG | 3mm bleed where it prints, CMYK note in guidelines |
| Tokens | copy from variables into JSON | do not eyeball hex twice |

## What you send vs what you keep

| Send | Keep |
|---|---|
| PDF guidelines, SVG/PNG logos, tokens, templates | Exploration page, rejected directions, raw photos |
| Figma *view* link if you want | Edit access unless they paid for editable source |

Editable source is a line item. Default handover is **use files**, not **edit the identity**.
