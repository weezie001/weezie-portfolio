# Composing a deck from the style kit

`references/style-kit.json` holds this style's example deck as reusable slide
recipes. The store example and every deck you generate share its stylesheet
(`contentCSS`) and recipes, so composing from the kit is how the output keeps
the example's look.

## 1. Read the kit

Each entry in `recipes` is one example slide:

| Field | Meaning |
| --- | --- |
| `recipe` | ID to pick in the plan. Recipes may repeat. |
| `title` | The example slide's title, for orientation. |
| `texts[]` | Editable text nodes: `node` ID, `type`, `sample` text. Entries with `segments` hold styled runs (spans, bold parts); pass one string per segment. |
| `images[]` | Picture slots: `node` ID, `alt`, `fit`, and the example picture's `size` and `aspect`. Generate or crop new pictures at that `aspect`; it overrides any ratio written elsewhere. |
| `vectors[]` | Inline SVG nodes (icons, charts, diagrams). `svgText` lists the labels inside the SVG in document order. |
| `styles[]` | Inline percentages that usually encode data, such as a bar length (`--h: 62%`) or a progress width. |
| `root` | The full node tree, for anything the lists above do not cover. |

## 2. Write `plan.json`

```json
{
  "title": "Clinic Online Consultation",
  "contentLocale": "zh-CN",
  "slides": [
    {
      "recipe": "cover",
      "id": "cover",
      "notes": "Two or three talking points for the presenter.",
      "text": {
        "m-cover-3": "Online consultation, step by step",
        "m-cover-5": ["Plain part, ", "highlighted part"]
      },
      "images": { "m-cover-9": "img/cover.webp" },
      "alt": { "m-cover-9": "A nurse answering a video call at a clinic desk" },
      "remove": ["m-cover-11"]
    },
    {
      "recipe": "capacity",
      "text": { "m-capacity-40": "Weekly visits" },
      "style": { "m-capacity-62": { "--h": "64%" } },
      "svg": { "m-capacity-58": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M4 12h16\"/></svg>" },
      "svgText": { "m-capacity-70": ["Mon", "Tue", "Wed"] }
    }
  ]
}
```

| Key | Use |
| --- | --- |
| `title`, `contentLocale`, `contentDirection`, `palette`, `typography` | Optional deck settings. `contentLocale` is detected from the plan's text when omitted (Chinese, Japanese, Korean); set it explicitly for other languages. |
| `recipe` | Required: a recipe ID from the kit. |
| `id`, `title`, `notes` | Optional slide ID (unique, no spaces), thumbnail title and speaker notes. |
| `text` | Node ID → new text. A string replaces the text; `\n` becomes a line break. A list fills a node's `segments` and keeps their styling. |
| `images` | Node ID → picture file path (relative to `plan.json`), data URL, or `library:<id>` for a picture from this Skill's library (inline those afterwards with `node scripts/embed-library-images.mjs project.json`). |
| `alt` | Node ID → description of the new picture. Always set it when you replace a picture. |
| `svg` | Node ID → replacement inline `<svg>` markup, for icons or diagrams that belong to the example's subject. Draw line icons on a `0 0 24 24` view box with `stroke="currentColor"` so they keep the style's color. |
| `svgText` | Node ID → list of new labels for the text runs inside that SVG. |
| `style` | Node ID → CSS properties merged into the node's inline style, such as a bar length or progress width. |
| `remove` | Node IDs to drop from that slide (not the slide root). |

Page counters written as `NN / TT` (for example `03 / 12`) are renumbered
automatically for the new order and length. Other text is never changed
unless the plan names it.

## 3. Run compose

```sh
python3 scripts/style-kit.py compose --style-kit references/style-kit.json --plan plan.json --output project.json
```

The JSON report lists what still needs attention:

- `unfilledImages`: picture slots still showing a placeholder, with the
  `aspect` and `size` to generate.
- `leftoverExample`: example content the plan did not replace, by kind:
  `text`, `alt` (a replaced picture still described by the example's alt),
  `icon` (an example icon that may name the wrong subject), `svgText` (labels
  inside an SVG chart or diagram) and `style` (data-like percentages). Replace
  everything that belongs to the example's topic; generic labels and
  decorative icons may stay.
- `structureLost`: styled text you replaced with a plain string; pass a list
  of segments instead if the styling matters.
- `renumberedPageCounters`: page counters that were renumbered.

Refine `project.json` where the content needs more than the recipes offer
(add, delete, move or restyle nodes, keeping IDs unique), keep the kit's
`contentCSS`, then build and check with the style kit so leftovers are caught
even after manual edits:

```sh
python3 scripts/build-deck.py --project project.json --config editor-config.json --output presentation.html
python3 scripts/check-deck.py presentation.html --expected-slides N --style-kit references/style-kit.json --report deck-check.json
```
