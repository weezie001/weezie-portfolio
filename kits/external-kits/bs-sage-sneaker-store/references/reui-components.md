# ReUI mapping for React outputs

`references/template.html` is dependency-free: its controls are native,
semantic HTML elements with ARIA where needed, styled by the template's tokens.
When the generated site is React or Next.js, implement the generic controls
with ReUI components and keep the template's class names and tokens on them.

| Template element | Where | ReUI component |
| --- | --- | --- |
| `.btn` link or button | CTAs, forms, empty states | `Button` (`asChild` for links) |
| `.input`, `.textarea` in `.field` | Checkout, contact, newsletter, size finder, promo | `Field`, `FieldLabel`, `Input` / `Textarea`, `FieldError`, `FieldDescription` |
| `.select` | Sort, contact topic, fit model | `Select` + `SelectTrigger` / `SelectContent` / `SelectItem` |
| `.option` radio cards | Checkout delivery method | `RadioGroup` + `RadioGroupItem` |
| `.seg` width control | Product width | `ToggleGroup` (single) |
| `.size-grid` | Product sizes | `RadioGroup` styled as a grid (keep the sold-out and low-stock states) |
| `.chip` filters, `.size-btn`, `.colour-btn` | Catalog filters | `ToggleGroup` (multiple) or `Toggle` |
| `.check` | Fit filter, newsletter interests | `Checkbox` |
| `.tabs` | Popular profiles, FAQ topics, legal | `Tabs` + `TabsList` / `TabsTrigger` / `TabsContent` |
| `.accordion` | FAQ, product details | `Accordion` + `AccordionItem` / `AccordionTrigger` / `AccordionContent` |
| `.drawer` | Mini-cart, mobile menu | `Sheet` + `SheetContent` |
| `.filters` under 1024 px | Mobile filters | `Sheet` (side `bottom`) |
| `.search-panel` | Search | `Dialog` (or `Command` for keyboard search) |
| `.toast` | Feedback | the project's toast (Sonner via shadcn) |

Bespoke components stay bespoke: sage hero, proof cards, product card, spotlight
hotspots, promise cards, store visit card, reviews carousel, bag lines and the
footer wordmark.

## Styling contract

1. Point ReUI's custom properties at the palette: `--primary` = ink,
   `--background` = ground, `--card` = paper, `--border` = line, `--ring` =
   ink, `--radius` = 14 px for fields; pills via the template classes.
2. Keep the template's classes on the rendered elements so its CSS (pill
   buttons, 52 px fields, selected states) applies unchanged.

## Verification

For every control: open it, choose with the keyboard, clear it, submit an
empty required form and confirm the inline error and `aria-invalid`, dismiss
with Escape and confirm focus returns to the trigger. Check 375 px for
overflow and 44 px tap targets.

Component source: ReUI, https://github.com/keenthemes/reui.
