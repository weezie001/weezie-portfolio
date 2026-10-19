# Brand Delivery Kit v2

Completed the previously missing designed applications and client-facing delivery material around the fictional Atelier North identity.

## Product contents

- 12 finished sample application SVGs and 12 editable starting SVGs.
- Cards, letterhead, invoice, square/portrait/story social layouts, banner, avatar, two presentation layouts and website share image.
- 12 logo variants (four orientations, three color treatments), 24 transparent PNGs, six favicon PNG sizes and ICO.
- Eight-page brand guidelines PDF, four-page exact-size stationery proof PDF, editable sample and blank HTML books.
- Local browser editor: name, messaging, colors, fonts, contacts and client imagery; save/load settings; individual SVG, brand book and branded handover ZIP exports.
- Branded exports contain application SVGs, logo variants, matching CSS/JSON tokens, email signature and editable HTML book.
- Studio strategy/process documents, commercial-use terms, file manifest and start guide.

Artwork source formats are SVG and HTML. Native Figma, Canva, DOCX and PPTX files are not included. The sample uses original AI-generated photography, with the prompt archived in docs/design/brand-kit-v2-imagegen.md.

## Validation

- Editor tests cover rebranding, color propagation, filters, reset actions, download generation and text/color escaping.
- The client ZIP is reopened to verify CRC, 12 application SVGs, 12 logos and matching brand settings/tokens.
- Both PDFs were rasterized and visually inspected. Application previews were reviewed; a photo-positioning issue and business-card text sizing were corrected.
- PDF page counts and text bounds, SVG XML validity, preview links and full ZIP checksums/counts were checked.
- The master archive contains 139 files and is below the host's per-file size limit.
- Portfolio build passed. Chrome was not used.

Rebuild: node scripts/build-brand-assets.mjs, python scripts/build-brand-pdfs.py, python scripts/render-brand-cover.py, python scripts/package-brand-kit.py, npm run build. The PDF marker helper is only required when starting a new PDF authoring operation, not each rebuild of the same operation.

Store product remains $15 / NGN 18,000. No real purchase or email delivery was triggered to test it.
