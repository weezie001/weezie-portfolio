# Designer toolset

The software is not the kit. This is the short list that is enough to deliver.

## Must have

| Job | Tool | Why |
|---|---|---|
| Identity + applications | Figma | Variables, components, client review |
| Vector logo | Figma or Illustrator | True SVG, not outlined accidents |
| Type testing | Fontstand / Adobe / Google Fonts | Proof the license before you fall in love |
| Colour contrast | Polypane, Stark, or WebAIM | AA is a deliverable |
| Handover | this folder + zip | One package |
| Proof | HTML brand book (`index.html`) or PDF export | Clients open a browser |
| Code handoff | `05-tokens` | Stops the developer inventing hex |

## Should have (Standard+)

| Job | Tool |
|---|---|
| Print PDF | Adobe Acrobat or InDesign (cards, letterhead) |
| Mockups | Figma mockup kit or Placeit — never fake a print item without a spec |
| Icon set | Figma, 24px grid, SVG export |
| Motion spec | Figma smart animate *or* a written spec in `MOTION.md` |
| Email signature | HTML file, tested in Gmail |

## Optional

| Job | Tool |
|---|---|
| Photo direction | Lightroom mood + 1 retouch recipe |
| Packaging dielines | Illustrator |
| Slide master | Figma → PDF, or Google Slides themed from tokens |
| Asset QA | a colour extract vs palette (reject off-brand photos) |

## Export colour

- **Screens:** sRGB, hex + RGB
- **Print:** convert with a defined profile; write CMYK *and* a Pantone only if they will print offset. Digital-only brands do not need Pantone.

## Fonts — legal, not vibes

For every font in the kit, record in `08-handover/LICENSE-AND-USAGE.md`:

- Foundry
- License type (desktop, web, app)
- Who paid
- Link to license
- What the client may install

If you used a free Google font, still write it down. If you used a trial, it does not ship.
