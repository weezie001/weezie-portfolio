# Colour system

Fill this once. Copy into `05-tokens`. Do not keep a second list in Figma that disagrees.

## Role mix

Aim **60%** surface / paper, **30%** ink / support, **10%** primary action.

## Primary

| Name | Hex | RGB | CMYK (if print) | Role |
|---|---|---|---|---|
| | # | | | Brand / CTA |
| | # | | | Hover / pressed |

## Accent

| Name | Hex | RGB | Role |
|---|---|---|---|
| | # | | Highlight, charts, rare |

## Neutrals

| Name | Hex | RGB | Role |
|---|---|---|---|
| Paper | # | | Page |
| Paper 2 | # | | Bands |
| Ink | # | | Text |
| Ink soft | # | | Secondary text |
| Line | # | | Borders |

## Semantic (product / site)

| Name | Hex | Use |
|---|---|---|
| Success | # | |
| Warning | # | |
| Danger | # | |
| Info | # | |

## Contrast log (required)

| Pair | Ratio | WCAG |
|---|---|---|
| Ink on paper | | AA / AAA |
| Primary on paper | | AA or “display only” |
| White on primary | | |
| Ink on paper-2 | | |

If primary-on-white fails AA, **do not use it for small text or UI**. Use it for large type and fills only.

## Do not

- Extra “pretty” hexes from a mockup
- Pure `#000000` on `#FFFFFF` unless the brand is actually that hard
- Gradients that cannot be named in the token file
