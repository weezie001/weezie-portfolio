# Framework adaptation and visual fidelity

## Selection

An explicit user framework/starter wins. With no existing project and no
named stack, the deliverable is the single self-contained HTML file built from
`template.html` (like the store demo); offer a framework port as the next
step. When the buyer has a framework project or asks for one, port the design
as described here; Next.js App Router with TypeScript is the default port
target when they ask for "a React app" without naming a framework.
Inspect package.json and project rules before writing. Work inside the named
starter when requested; do not overwrite or migrate unrelated applications.
Use the repository's existing package manager and compatible dependency
versions. For a fresh Next.js application, resolve current stable versions
from official documentation at execution time rather than pinning stale ones.

## Design contract

Read template.html and style-guide.md first. Extract actual color tokens,
font families/fallbacks, headline/body ratios, content width, section spacing,
border radii, stroke weights, image aspect ratios and decorative treatments.
Make a section-by-section checklist before implementation. The reference is
the visual specification, not inspiration for a different generic landing page.
Keep a copy of this checklist in the generated application's README.

## Next.js port

Use app/layout.tsx for document metadata and the shared shell, app/page.tsx
for the home route, and real app/<section>/page.tsx or dynamic detail routes.
Keep typed project/product/article collections in a data module. Extract
named header, footer, hero, card and section components from the template.
Use next/link for internal links. Use server components for static content;
mark only interactive menus, filters, tabs, forms and carts with use client.
Use React state and native form validation instead of document-wide selectors.
Provide meaningful metadata, a not-found route, local images with width/height
and descriptive alt text, and a README with install/dev/build instructions.
Use CSS variables or the project's styling system without altering visual
values. Load Archivo, Geist and Geist Mono through `next/font/google` or the
`@fontsource-variable/archivo`, `@fontsource-variable/geist` and
`@fontsource-variable/geist-mono` packages. Preserve the original CSS when it is the most faithful translation.

## Other stacks

- React: typed reusable components, the starter's router, hooks for state.
- Vue: SFC components, script setup with TypeScript when supported, Vue Router
  for multiple pages, refs/computed values for interactive controls.
- Astro: file-based pages, reusable .astro components and scoped client islands
  only for controls requiring state; keep article and product content static.
- TypeScript starter: follow its build tool, entry points, router and CSS
  conventions. TypeScript describes the language, not a replacement framework.
- No project: the single HTML file (see SKILL.md, Single-file constraints).

## Image coverage

Write the image plan first (`image-plan.md`): one art direction sentence and a
row per slot with role, aspect, crop focus and prompt. Every product gets its
own photo on the shared studio backdrop; every collection gets a context photo
that shows the store's own product in use; the hero is a full-length model on
paper that matches the sage panel, placed in the right half of the hero. Do not crop several products out of
one sheet, reuse a hero for unrelated items or fill space with random
photography. Deliver images as local files (WebP at native resolution) with
width, height and meaningful alt text. In Next.js use `next/image` with
`priority` on the hero and set `object-position` as documented.

## Interaction and content contract

Every navigation link must lead to a populated page. Preserve mobile menu,
active route, keyboard focus, hover states and reduced-motion support. Detail
pages must contain specific content rather than repeated generic paragraphs.
Filters change the displayed items and expose an empty result state; sort
controls reorder results. A cart supports add/remove/quantity/totals, including
empty state. Forms validate fields and show a clear local demo confirmation.
Do not imply an email was delivered, a booking confirmed, or payment charged
unless a real backend was explicitly requested and connected. Keep real
payments, account services and order processing out of an unconnected demo.

## Verification

Build the project with its package manager. Walk every route and test the
controls listed in `quality-checklist.md`, browser back/forward, invalid form
input and empty states. Inspect screenshots at 1440, 1024, 768 and 390 px and
compare the hero (88 px headline at the template's position, model and shoes
whole, service card clear of the shoes),
type scale and section order against `template.html`. A successful build does
not prove fidelity. Sandbox rules (single file, no network) apply when the page is previewed
inside a sandboxed iframe as a single file. A deployed site or framework
project does not need them; framework routing uses real routes.
Never replace framework components with an iframe.

<!-- reui:framework -->
## ReUI component layer

Generic interface controls are ReUI components. This is a requirement of the
output, not a styling suggestion, and it survives the stack choice.

### Mapping

| Template element | ReUI component |
| --- | --- |
| CTA / link button | `Button` (use `asChild` to render an `<a>`) |
| Text, email, phone field | `Input` inside `Field` + `FieldLabel` |
| Long-form field | `Textarea` |
| Dropdown choice | `Select` + `SelectTrigger` / `SelectContent` / `SelectItem` |
| Single choice from a visible set | `RadioGroup` + `RadioGroupItem` |
| Opt-in / agreement | `Checkbox` |
| Filter chips, size or billing switches | `ToggleGroup` + `ToggleGroupItem` |
| Save / wishlist toggle | `Toggle` |
| Sectioned panels | `Tabs` + `TabsList` / `TabsTrigger` / `TabsContent` |
| FAQ and process lists | `Accordion` + `AccordionItem` / `AccordionTrigger` |
| Mobile navigation panel | `Sheet` + `SheetContent` |
| Modal | `Dialog` + `DialogContent` |
| Validation messaging | `FieldError`, `FieldDescription`, `aria-invalid` |

Template-specific visuals (the sage hero, proof cards, product card, spotlight
hotspots, promise cards and footer wordmark) stay in bespoke CSS. ReUI covers
the interface layer, not the art direction.

### Keeping the template's look

Two mechanisms, in this order:

1. **Token mapping.** ReUI reads its chrome from custom properties. Point
   them at the template palette so components inherit its colour, radius and
   type rather than ReUI's defaults.
2. **The template's own CSS.** Rendered controls keep their original class
   names, so existing rules (including contextual ones like `.sneaker-hero
   .btn`) continue to apply. Do not delete that CSS and re-implement it in
   component files.

The component implementations are never forked per template. If two
templates look different, that difference lives in tokens and template CSS.

### Accessibility expectations

Radix gives these components roving focus, typeahead, focus trapping and
focus restoration. Keep them: do not replace a trigger with a `div`, do not
strip `aria-*` attributes, and do not remove the visible focus ring. Verify
keyboard operation of every control: arrow keys in tabs and selects,
Enter/Space to activate, Escape to dismiss, and focus returning to the
trigger afterwards.
<!-- /reui:framework -->
