---
name: bs-ochre-editorial-deck
description: "Create an editorial presentation with cream paper, oversized compressed headlines, warm portrait collages, mustard and vermilion color fields, and original craft photography. Every image is independently composed and used once. The slide count follows your request, with artwork planned around the content of each page. Every deck can be edited in the browser and exported as an editable PowerPoint file."
---

# Ochre Editorial Deck

Use this skill for presentations, pitches and explanations that call for the visual language below. The example is a fictional independent journal about useful handmade objects. The subject may change; the visual system stays coherent.

## Shared editor contract

This style always uses the bundled framework in `references/framework/`; never build a separate editor or paging engine. The editor UI is identical across styles: black, white and gray, with localized icon tooltips and independently editable objects. Palettes, fonts, artwork and layouts stay specific to this Skill and come from its style kit. Read [runtime](references/runtime.md) for the editor, saving and export behaviour, and [compose guide](references/compose.md) for the plan format.

## Workflow

1. Confirm the user's topic, audience, source facts, communication language, content language and slide count. Write slide copy in English unless the user asks for another language. Keep this style's art direction, layout proportions and content limits below; do not substitute a generic template.
2. Plan a clear narrative with one job per page, using the agreed number of fixed 16:9 pages and this style's word budgets and evidence rules.
3. Read this package's style references (below). Named palettes are choices for slide content; the shared editor stays unchanged.
4. Compose from the style kit so the deck matches the store example: write `plan.json` picking a recipe from `references/style-kit.json` for each page (recipes may repeat), set the new text, pictures, picture descriptions (`alt`), icons, chart labels and data values by node ID, remove nodes a page does not need, then run `python3 scripts/style-kit.py compose --style-kit references/style-kit.json --plan plan.json --output project.json`. Work through the report: fill every `unfilledImages` slot and replace each `leftoverExample` entry that belongs to the example's topic. The [compose guide](references/compose.md) documents every plan field. Refine `project.json` where needed (add, delete, move or restyle nodes, keeping IDs unique), keep the kit's `contentCSS`, and write `editor-config.json` with the bundled schema.
5. Pictures:
   - Before making any picture, ask the user once (with the step 1 questions when possible) and offer exactly three options. Pictures the user supplies come first in every option. If the user cannot be asked or does not answer, use option 1. Tell the user which option you used.
     1. **Reuse this style's original pictures (recommended)**: use only pictures from this Skill's picture library, with no image credits. A slot with no fitting picture keeps its labeled image frame; list those slots for the user.
     2. **Generate as needed**: reuse library pictures where they fit and generate only the remaining slots.
     3. **Regenerate everything**: generate every picture new for this topic.
   - Library: run `node scripts/embed-library-images.mjs --list`; use `any-topic` pictures freely and `topic-specific` ones only when their topic matches the deck, never show one picture on two pages, and set the plan's `images` value (or an image node `src`) to `library:<id>`. After composing, run `node scripts/embed-library-images.mjs project.json` to inline them; if a download fails, treat those slots as unfilled.
   - Generate pictures following `references/image-prompts.md`, at the `aspect` that `style-kit.json` and the compose report list for each slot. Use FAL with the user's `FAL_KEY` through `node scripts/fal-image.mjs` (submit once, then status/fetch; each submission is a paid task that is never retried automatically). In ChatGPT or Codex, the built-in image generation (GPT Image) may be used instead and needs no key. Never use another image provider. Library pictures (`--download <id> --out <dir>`) or pictures already made for this deck can be passed as `--reference` to keep the series consistent.
   - With neither FAL nor a built-in tool, options 2 and 3 fall back to option 1.
6. Set `uiLocale` and `conversationLocale` to the user's communication language and `contentLocale`/`contentDirection` from the brief; compose detects Chinese, Japanese and Korean plans. Arabic and Hebrew right-to-left layout is handled by the framework; do not reverse logical arrays.
7. Build and check: `python3 scripts/build-deck.py --project project.json --config editor-config.json --output presentation.html`, then `python3 scripts/check-deck.py presentation.html --expected-slides N --style-kit references/style-kit.json --report deck-check.json`. Resolve every example string the check still reports. If it warns about size, run `python3 scripts/optimize-images.py presentation.html` and check again.
8. Open the file over local HTTP and inspect every page: typography, pictures, hierarchy, crops, bounds, contrast and spacing. Edit text, add/delete/move a block, change a color or Smart layout, edit notes, undo/redo, save and reopen. Presentation mode must disable editing and its glass navigation must hide after five idle seconds.
9. Deliver the single HTML file. It opens in a page view with an Edit button and works offline. Tell the user that edits stay in the browser until they press Save (Cmd/Ctrl+S), which writes them into the file. On request, export PPTX from the built-in menu, run `python3 scripts/check-pptx.py presentation.pptx --project project.json --report pptx-check.json` and inspect it in PowerPoint, Keynote or WPS. Keynote uses the compatible `.pptx`. Print/PDF gives one page per slide.

## Style references

Read the [style kit](references/style-kit.json), [compose guide](references/compose.md), [palettes](references/themes.md), [layout recipes](references/layouts.md), [image prompts](references/image-prompts.md), [icons](references/icon-library.md), [style reference](references/style-reference.md) and [runtime](references/runtime.md).

## Art direction

Choose and adapt the following visual patterns to the agreed page plan. Any listed composition or image arrangement is a reusable example, not a required page or artwork quota.

Build an analog editorial system on warm cream paper. Use very large compressed black display type for openings, fine high-contrast serif type for narrative headings, and small modern sans labels. Place photographic people and tactile objects against raw mustard brush slabs, sparse vermilion gestures and black drybrush marks. Use rectangular photographs with crisp edges, a black service strip with hairline columns, three-image editorial grids, a full vermilion authored-statement spread, and a mustard closing above a black footer. Keep bodies compact but readable. Avoid generic rounded business cards, uniform photo boxes on every page, glossy gradients and repetitive still-life imagery.

## Style-specific planning and composition

- Establish audience, purpose, available evidence and language; slide copy defaults to English unless the user asks for another language. Use exactly the slide count requested by the user, including opening and closing pages unless they specify otherwise. If no count is given, propose a count based on the content and presentation duration and confirm it; never impose a fixed default. Pages are fixed 16:9 (1280x720). Give every page a distinct role and useful content.

- Build the agreed number of pages by selecting, reordering, combining or expanding suitable layout recipes. These are optional composition examples, not a mandatory sequence or a slide-count limit. The reference includes: giant type and portrait collage; studio portrait and editorial introduction; object evidence spread; black four-column service strip; three craft project images; tactile making close-up; material board and process; full vermilion statement; three editorial insight images; paired maker portraits; publishing plan; mustard illustrated closing with black footer. Adapt the words and evidence to the user's subject. Do not use one generic layout for every page.

- Create an art ledger with one entry per image slot: page, subject, aspect ratio, placement, palette, prompt and saved result. Use as many fresh images as the page design needs; do not reduce quality to save generation calls.

- Generate each distinct asset in a separate request, following Workflow step 5 for picture sources and tools and `references/image-prompts.md` for prompts, at the aspect that `references/style-kit.json` lists for the slot. Record every result in the art ledger before continuing. A failed paid request must never be automatically retried. When visual rework is authorized, regenerate an image that does not meet the brief and inspect the replacement.

- Use each artwork on one page only. Different crops, rotations, color changes or re-exports of the same source do not count as independent images. Functional SVG icons and diagram primitives may repeat. Pictorial artwork may not. Exclude inspiration images, source copy, identities, logos, watermarks, recognizable source faces and protected characters.

- Set the icons using the included Lucide-style inline SVG library. Use them for meaningful reading cues. Never use emoji, dingbat glyphs or icon fonts. Provider icons belong only in real labeled integration contexts.

- Compose with editable text and vector diagrams. Preserve this style's type pairing, layout proportions, spacing and image character. Do not rasterize the whole slide. Embed artwork as quality-98 WebP or lossless WebP where fine linework or text requires it. Preserve useful source resolution, remain below 20 MB, and make the final deck self-contained with no remote assets.

- Run `scripts/check-deck.py` as Workflow step 7 describes and inspect every page at its fixed 1280x720 size. Check image loading, artwork uniqueness, crops, text bounds, contrast and hierarchy. Check the thumbnails, speaker notes and presentation mode, and make sure the page list and notes match the actual slide count.

- Compare each rendered page with the provided visual reference or approved brief: typography, color-area ratios, image quality, density, spacing and edge treatment. Regenerate a mismatched image; rebuild a mismatched layout; inspect again. Finish the current style before starting the next one.

- Deliver the single presentation HTML at the agreed slide count with a brief visual review, plus distinct full-page WebP previews when they are requested. Claim an exported PPTX or a PDF only after that export has been separately created and verified.

## Package boundary

Keep SKILL.md, scripts and references together. Include the shared runtime and required style resources. Examples, manifests, provider records, migration reports, previews and credentials do not belong in the installation ZIP. Use only references inside this Skill.
