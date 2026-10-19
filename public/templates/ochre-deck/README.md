# Shared editable presentation framework

This framework assembles a presentation project and editor configuration into one offline HTML file. All styles reuse the same black, white and gray editor, localized icon tooltips, block library, speaker-notes sidebar, presentation navigation and editable export actions. Presentation colors, fonts, images and composition remain specific to the project.

## Authoring boundary

The AI authors project data and configuration. It must not rewrite the editor shell, runtime, UI styles, language catalogs, persistence codec or bundled export library to create a visual style. Shared behavior changes belong in the canonical framework and must pass editing and export acceptance.

Read `project.schema.json`, `config.schema.json` and `backup.schema.json`. Each slide has a `stack` root. The 18 stable node types are `stack`, `columns`, `column`, `smart`, `item`, `heading`, `subheading`, `text`, `label`, `number`, `callout`, `code`, `group`, `image`, `rule`, `table`, `tablerow` and `cell`. Smart layouts use `solid`, `outline`, `side`, `topline`, `steps`, `timeline`, `plain` and `quote`. IDs are internal contracts and must not be translated.

Use palette and typography fields, node styles, nested editable containers, column weights, Smart layout settings and independent media nodes. Keep text and notes editable. Images must be embedded. Legacy migration may retain scoped `contentCSS`, original semantic tags, sanitized rich inline HTML/SVG, namespaced embedded fonts and approved inline CSS. Presentation selectors must be scoped to `.slide[data-imported]`; editor selectors, executable content and external resources are rejected. Keep original media and text during migration.

Use stable, globally unique node IDs, unique slide IDs, no more than 100 slides or 10,000 nodes, and depth no greater than 20. Columns contain `column` nodes; Smart layouts contain `item` nodes; tables contain `tablerow` nodes containing `cell` nodes. Use one positive weight per column. `x-` fields carry extension metadata.

## Build and check

From a bundled style Skill:

```sh
python3 scripts/build-deck.py --project project.json --config editor-config.json --output presentation.html
python3 scripts/check-deck.py presentation.html --expected-slides 6 --report deck-check.json
```

Replace the expected count with the agreed slide count. `check-deck.py` fails above 20 MB and warns above 12 MB; shrink oversized embedded images with `python3 scripts/optimize-images.py presentation.html` (Pillow; WebP, 1920 px long edge, only when smaller).

When the style has an accepted example, compose new decks from its style kit so the output matches the example:

```sh
python3 scripts/style-kit.py extract examples/demo.html --output references/style-kit.json   # once, by the Skill author
python3 scripts/style-kit.py compose --style-kit references/style-kit.json --plan plan.json --output project.json
```

A plan lists `{recipe, id, text, images, remove, notes}` per slide, keyed by recipe node IDs; the composed project can be edited further before building. For text entries that list `segments`, pass a list with one string per segment so styled parts survive; `structureLost` in the report names any node flattened to plain text. The build uses Python's standard library and bundled assets. No package installation, network request or third-party lifecycle script is required. Always rebuild from the user's current project. The supplied semantic fixture is a schema example, not the user's presentation.

Open the result over local HTTP for browser acceptance. Check every page's font, hierarchy, colors, crop, spacing and bounds. Actually edit text, insert/delete/copy/move objects, resize/add/delete columns, switch a Smart layout, change colors, edit notes, undo/redo and save/reopen HTML. Build/schema checks alone do not prove visual or native application correctness.

## Interface language and direction

Supported IDs: `en`, `zh`, `zh-tw`, `ja`, `ko`, `es`, `pt-br`, `de`, `fr`, `ar`, `ru`, `it`, `hi`, `id`, `tr`, `vi`, `th`, `nl`, `pl`, `he`. Arabic and Hebrew use RTL interface chrome. Catalogs include labels, tooltips, accessible names, placeholders and messages.

Set `uiLocale` and `conversationLocale` to the user's communication language. Put `contentLocale` and `contentDirection` on the project independently. Slides may override them with `locale`/`direction`; nodes may override them for mixed-language passages. Code remains LTR. Changing interface language does not translate or replace existing slide copy or notes. Newly inserted blocks use the active slide's content language.

Interface selection prioritizes a supported `?lang=` override, a trusted Skillry preview referrer, a saved project preference, explicit config, conversation language, browser language and English. The parent preview may send `editable-deck:set-locale`; only messages from its actual parent/referrer origin are accepted.

The physical paper, thumbnail, print and export coordinate frames remain LTR at 1280 by 720 (16:9). The slide article carries content direction. RTL places the first logical column on the right; generators must not reverse arrays or reflect export coordinates. Extra edited content scales into the fixed paper. Native paragraphs and notes retain language, reading direction and resolved alignment.

## Opening view

The file opens in a clean view of the pages with an **Edit** / **Present** glass bar. **Edit** or the E key opens the editor, **Done** returns. `?mode=view|edit|present` (or `?edit`) chooses the opening mode, config `startMode` (`view` default, `edit`) sets the generated default, and the last mode is remembered for the browser session.

## Saving and export

The browser keeps a safety copy of edits in IndexedDB (localStorage as fallback), stored as deltas from the immutable embedded project. Unchanged media, fonts and CSS are referenced rather than duplicated, and undo/redo use the same compact snapshots. This copy stays in one browser: the header shows "Edits kept in this browser only" while the file is behind, the first edit explains it once, and leaving with such edits asks for confirmation. **Save** (⌘S) writes the whole current document into an HTML file — with the File System Access API the chosen file is overwritten on later saves; otherwise an updated copy is downloaded. A storage failure preserves the previous record and asks the user to save the file. Uploaded images are stored as WebP with a 1920 px long edge.

Sandboxed previews keep temporary editing and show that changes are not saved. Export requires the downloaded standalone HTML; do not weaken the iframe sandbox to enable it.

- **HTML:** one offline file containing the current project, resolved interface language, images, fonts, catalogs and runtime. Reopening preserves current edits.
- **PowerPoint:** the export library is embedded gzip-compressed and unpacked on first export. Every slide's text becomes native editable text boxes in its exact position, with rich run formatting and speaker notes; a text node laid out internally (for example a metric with number and label) becomes one box per part, and single-line text does not wrap. Every picture is its own PowerPoint picture: a plain photo keeps the original image with a native crop and rounded or round frame (Replace Picture, Crop, move and resize work), and a picture with a mask, filter or complex clipping is exported as drawn by the browser, still as a separate picture. Everything else on the slide (backgrounds, decorations, SVG artwork, gradients) is painted from the browser's own rendering in paint order: one high-resolution background per slide, then transparent layers for whatever sits above a picture (scrims, cards, frosted glass), so the layout matches the HTML exactly. If a browser cannot render the slide image, export falls back to separate shapes and picture objects, with WebP/AVIF pictures re-encoded as PNG because PowerPoint and Keynote cannot read them. The same `.pptx` opens in PowerPoint, Keynote and WPS; there is no separate Keynote export and no native `.key` file.
- **Print/PDF:** one fixed 16:9 sheet per page; a viewing output.

Verify fresh PPTX with `python3 scripts/check-pptx.py presentation.pptx --project project.json --report pptx-check.json`, then inspect in the target native application when requested. Native font substitution or unsupported visual effects can affect wrapping or appearance; browser and native application checks are separate evidence.

The right-hand icon dock opens one panel at a time. An open panel takes the dock's place at the edge of the window and the dock hides; closing the panel (× or Esc) brings the dock back. On narrow screens the same applies to the bottom dock.

Presentation mode disables editing, dragging and insertion. Its gray glass navigation hides after five idle seconds and returns on interaction.

## Copy-clean integration

The project copy-clean workflow attaches the canonical runtime through `scripts/attach-editable-framework.py`. A style Skill retains its useful composition rules and required style resources while using the same build, editing and export contract. Keep generated examples, media, manifests and validation reports outside the installation ZIP. Installation packages contain only `SKILL.md`, required `scripts/` and `references/`.
