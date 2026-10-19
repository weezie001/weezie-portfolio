# Component visual refresh, 19 October 2026

Scope: the 35 existing component templates and their downloadable source pack. The storefront and component-library page layout are unchanged.

Built-in image generation was used for a direction board and original component artwork. The artwork is bundled at `src/components/ui/assets/cobalt-arch.png` and copied to the downloadable starter at `src/components/assets/cobalt-arch.png`. The direction board is `docs/design/component-direction.png`.

The largest layout revisions are in BentoFeatures, UsagePricingSlider, SplitAuthCard, MinimalCard, ReferoStyleCard and ReferoRotatingHeadline. The remaining templates retain their behaviors with revised typography, surfaces, geometry and collection palettes.

## Final prompt set

### Direction board

Use case: ui-mockup. Create a highly polished visual design direction board for an ORIGINAL premium React component library called 'Weezie UI'. Landscape 3:2 composition, flat front-on interface presentation, no perspective mockup. Background warm ivory #f6f5f0. Left top: elegant oversized black neo-grotesque type 'Small details. Better interfaces.' with a tiny cobalt handwritten star. Right top: beautifully proportioned featured card with an original quiet architectural photo of a sculptural white concrete arch with cobalt glass object. Lower area: arranged 3 diverse premium component examples, a monochrome filter navigation, a high-end pricing selector with hairline dividers and a single cobalt action, and an editorial mobile app card in muted sage. Art direction should feel like a thoughtful independent design gallery, sophisticated Swiss typography and whitespace, clean editorial hierarchy, tiny uppercase mono labels used sparingly, 16px corner radii max, soft natural photographic texture. Exact readable text only where specified; other interface text short plausible English. Original visual design inspired by the polish of Minimal Gallery, Refero and Mobbin but no logos or copies. Avoid generic SaaS gradients, neon lime, giant pill buttons, glassmorphism, stock dashboard aesthetics, clutter. This is a reference board to implement as real interactive code; deliver one beautifully composed raster image.

### Component artwork

Use case: product-mockup. Original editorial art photograph for a premium design gallery and React component showcase. Landscape 3:2, exceptionally clean contemporary art direction. One translucent deep cobalt-blue glass ring standing upright on a warm off-white travertine plinth, with a softly curving ivory plaster architectural arch behind it. Framing slightly asymmetric with the ring in the right third and beautiful negative space at left. Gentle daylight from upper left, soft believable shadows, subtle film grain, tactile chalky stone, luminous glass caustics. Gallery quality still life, restrained Japanese / Swiss editorial sensibility. Colors: warm paper, pale sand, cobalt, charcoal shadow. Photorealistic fine material detail, not plastic 3D render. No text, no interface, no logos, no watermarks, no extra objects. Image should crop gracefully as card imagery and a taller auth-panel background.

## Checks

The 35 sources render and mount in automated checks. Representative keyboard, selection, pricing, checklist and motion controls are tested. Both the portfolio and standalone starter must build. The ZIP inventory and checksums are checked against the deployed download. No Chrome or visual browser automation was used, per the user's preference. The generated direction board is a design reference, not a screenshot of the implementation.
