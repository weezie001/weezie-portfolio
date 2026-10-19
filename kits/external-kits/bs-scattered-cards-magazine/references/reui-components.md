# ReUI components for React outputs

`references/template.html` implements its controls in vanilla HTML, CSS and
JS so the single-file deliverable stays self-contained. When the target stack is React or
Next.js, build the same controls from [ReUI](https://reui.io) components and
keep the template's class names on the rendered elements so its CSS (and its
contextual rules) still applies.

| Template element (class or attribute) | ReUI component |
| --- | --- |
| `.btn`, `.btn-primary`, `.btn-ghost`, link buttons | `Button` (`asChild` for links) |
| `.icon-btn` (search, bag, menu, close, copy) | `Button` with `size="icon"` and `aria-label` |
| `.field` + `.input` / `.textarea` | `Field`, `FieldLabel`, `Input` / `Textarea`, `FieldError`, `FieldDescription` |
| `.select` (sort, country, topic, start issue) | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` |
| `.radio-pill` (product options, newsletter frequency) | `RadioGroup` + `RadioGroupItem` styled as pills, or `ToggleGroup type="single"` |
| `.radio-card` (delivery method) | `RadioGroup` with card items |
| `.check` | `Checkbox` |
| `.chips` with `aria-pressed` (topics, shop categories) | `ToggleGroup type="single"` |
| `.segmented` (grid or index, for me or gift, term) | `ToggleGroup type="single"` |
| `.tool-btn[data-save]` | `Toggle` |
| `.tabs` / `[role=tab]` (contact) | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `.accordion` / `.acc-item` | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` |
| `.qty` stepper | `Button` pair around an `output` (or a number input group) |
| Menu sheet, bag drawer | `Sheet`, `SheetContent`, `SheetTitle` |
| Search overlay | `Dialog` (top-anchored) or `Command` |
| Toasts | `Sonner` / toast component |

Bespoke and not ReUI: the editorial fan, topic rows, story cards, composed
covers, framed prints, the cover fan, letters, the reading progress line and
the footer wordmark. Keep them as components with the template's CSS.

## Styling contract

1. Map ReUI custom properties to the template tokens: `--primary` to
   `--ink`, `--background` to `--paper`, `--border` to `--line-2`, `--ring`
   to `--accent`, `--radius` to 6px for fields (buttons and chips override to
   fully rounded), font to Schibsted Grotesk.
2. Keep the template's class names on rendered elements; do not fork the
   component implementations per template.

## Verification

For each control: open it, operate it with the keyboard (arrows in tabs and
selects, Enter or Space to activate, Esc to dismiss), confirm focus returns to
the trigger, submit an empty required form and check `aria-invalid` and the
error text, and check 390px for overflow and 44px targets.

Component source: ReUI, https://github.com/keenthemes/reui.
