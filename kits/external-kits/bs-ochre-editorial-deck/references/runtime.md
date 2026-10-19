# Shared editable presentation runtime

Every style uses one fixed monochrome editor. Read `framework/README.md`,
`framework/project.schema.json` and `framework/config.schema.json`. The runtime
assets in `references/framework/` are copied unchanged from the shared
framework. Presentation data styles the slides; it never replaces the editor.

## Build and validate

Run from the installed Skill directory:

```sh
python3 scripts/style-kit.py compose --style-kit references/style-kit.json --plan plan.json --output project.json
python3 scripts/build-deck.py --project project.json --config editor-config.json --output presentation.html
python3 scripts/check-deck.py presentation.html --expected-slides N --style-kit references/style-kit.json --report deck-check.json
```

See `compose.md` for the plan format and the compose report. Python 3 is
required only for building and static checks. The finished HTML embeds all
pictures, interface catalogs and the native export library, works offline and
needs no Node packages or saving server. If the check warns about size, run
`python3 scripts/optimize-images.py presentation.html` and check again.

## Model and style

Use a stable project ID and unique slide/node IDs. Each slide has a `stack`
root. Keep headings, body text, pictures, tables, cards, groups, columns and
Smart items independently editable. Add three to five useful talking points to
each slide's `notes`. Never flatten meaningful text or a whole slide into one
picture.

Keep the palette, typography, layout proportions, picture character and
content limits of this style. Layout snippets in `layouts.md` show composition
only; build pages from the style kit's recipes. The kit's `contentCSS` is the
style's stylesheet, scoped to `.slide[data-imported]`; follow the framework
sanitizer and schema instead of injecting arbitrary HTML or script.
`style-source.css` keeps the original stylesheet as design reference only.

Set `uiLocale` and `conversationLocale` from the user's communication
language. Choose `contentLocale`/`contentDirection` from the content brief
(compose detects Chinese, Japanese and Korean plans). Switching the UI never
translates slide text or notes. All 20 UI languages are bundled; Arabic and
Hebrew UI and content are right-to-left independently. Keep logical
children/weights in their original order; code and coordinate frames stay
left-to-right.

Style fonts cover Latin text. For Chinese, Japanese and Korean the runtime
adds system fallbacks (PingFang/Microsoft YaHei, Songti/SimSun for serif
styles, and the Japanese and Korean equivalents) to every font stack, and
PowerPoint export sets the matching East Asian font. Do not add webfont links;
the deck must stay offline.

## Viewing, editing and saving

The file opens in a clean page view with an Edit button. Editing shows
continuous cards, synchronized thumbnails, a compact icon dock, floating
text/block tools with tooltips, a component library and side-panel notes.
Users can add, remove, move, duplicate and nest objects, change colors, column
widths and Smart layouts, replace pictures, and undo/redo. The editor has no
per-style theme chooser, brand banner or illustration gallery; named palettes
in `themes.md` are generation choices for slide content.

Edits are kept in the browser automatically, and the editor says so. Pressing
Save (Cmd/Ctrl+S) writes them into the HTML file itself. `?mode=view`,
`?mode=edit` and `?mode=present` open a specific mode.

Every page is fixed at 1280 by 720 (16:9). Presentation disables editing and
keeps navigation; its glass controls hide after five idle seconds and return
on interaction. HTML export saves the current editable project as one file.
In opaque site previews,
editing is temporary and file export is unavailable with a localized
explanation; download the standalone HTML to use the full workflow.

## Native export

The Export menu offers HTML, PowerPoint and Print/PDF. PowerPoint export keeps
all slide text as native editable text boxes in their exact positions, with
speaker notes, and every picture as its own PowerPoint picture. A plain photo
keeps the original image with a native crop and its rounded or round frame, so
Replace Picture, Crop, move and resize work; a picture with a mask, filter or
complex clipping is exported as drawn by the browser, still as a separate
picture. Backgrounds, decorations, SVG artwork and gradients are painted from
the browser's rendering in paint order: one background per slide, then
transparent layers for whatever sits above a picture (scrims, cards, frosted
glass), so the exported layout matches the HTML. The same `.pptx` opens in PowerPoint, Keynote and WPS; there is no
separate Keynote export.

```sh
python3 scripts/check-pptx.py presentation.pptx --project project.json --report pptx-check.json
```

Open the file in PowerPoint, Keynote or WPS and compare it with the browser
before calling it verified. Text uses the style's font names; when a
recipient lacks a font, the application substitutes one, which can change
weight and width slightly. Single-line text is exported without wrapping to
keep lines intact. PDF is one 16:9 page per slide for viewing and printing.
