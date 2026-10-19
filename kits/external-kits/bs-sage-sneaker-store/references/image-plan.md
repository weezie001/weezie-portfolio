# Image plan

Plan every image by role before generating anything. Each slot has one job,
one subject that matches the copy next to it, and a crop chosen for the frame
it fills. No two images may be interchangeable.

## Art direction (appended to every prompt)

> Quiet athletic editorial look for a fictional footwear label: seamless muted sage and pale sage-grey paper, polished concrete and pale oak, soft diffused north-window daylight from the upper left, gentle natural contact shadows, low contrast matte grade, desaturated palette of sage, stone, chalk white and charcoal with restrained muted accents in the footwear. Shot on medium format, natural color, crisp detail, no text, no logos, no brand marks, no stripes or swooshes on any shoe, no watermarks.

## Roles in this template

- **Campaign hero (1)**: a full-length model on seamless sage paper, wearing
  one of the store's own products, with generous paper above her head. It fills
  the right half of the hero panel; its paper tone matches the panel's `--sage`
  so the soft left edge disappears.
- **Product (one per product)**: a single shoe, lateral side view, toe to the
  left, slight three-quarter angle from above, centred with generous margin on
  the same pale sage-grey paper, same light, same contact shadow. Generate each
  product separately with the identical framing sentence; never crop products
  out of a multi-product sheet.
- **Collection context (one per collection)**: the store's own product in use
  (running path, community court, training studio, city square). The same
  image becomes the "worn" view on that product's page.
- **Store (1)**: the physical store for the visit section and contact page
  (only when the business has one).
- **Craft / story (1)**: the resole bench for the About page.

## Slots

| id | Role | Aspect | Crop focus | Used in | Prompt |
| --- | --- | --- | --- | --- | --- |
| `hero-model` | Campaign source + worn view | 3:2, delivered 1873x1024 | Right-anchored; model and both shoes whole | City Quiet "worn" view on its product page; source of `hero-portrait` | Full-body editorial campaign photograph of a young woman in her late twenties with dark hair in a low bun and a calm, confident expression, seated on a pale grey concrete cube, one foot raised on the cube edge and her forearm resting on that knee, the other leg extended down to the floor. She wears an oversized off-white technical windbreaker, charcoal tapered joggers cropped at the ankle, white crew socks, and fog-grey suede-and-mesh retro running sneakers with cream foam midsoles. She and the cube sit in the right third of the frame; the left sixty percent of the frame is empty seamless muted sage-green paper backdrop (a mid-tone sage around #8FA38C) with a very soft falloff, the paper sweeping into the floor. Camera at waist height, 70mm lens, whole figure visible including both shoes, generous space above her head and below her feet. |
| `hero-portrait` | Campaign hero | ~1:1, delivered 1280x1256 | Model centred, about 14% paper above her head, shoes whole; `object-position: 50% 100%` | Home hero (right 51% of the panel) | Derived from the same generation as `hero-model`: cropped around the model and extended with plain paper on the top and right (edge colour + matched grain) so she stands at the original hero scale. No new prompt. |
| `p-pace-one` | Product | 1:1 | Shoe centred, toe left | Cards, Pace One page, spotlight with hotspots, bag lines | Studio product photograph of a single lightweight running shoe: off-white engineered mesh upper with a subtle perforated pattern, muted clay-coral heel counter, lining and lace loops, cream laces, tall cream foam midsole with a gentle rocker and a clay-coral outsole edge. The shoe stands on a seamless pale sage-grey paper backdrop (around #E3E8E0), lateral side view with the toe pointing left, camera slightly above at a gentle three-quarter angle, the shoe centered with generous empty margin on all sides, soft light from the upper left and a soft natural contact shadow beneath. |
| `p-tempo-knit` | Product | 1:1 | Shoe centred, toe left | Cards, Tempo Knit page, bag lines | Studio product photograph of a single daily running shoe: pale mist-grey knit upper, dusty slate-blue heel tab and inner lining, white flat laces, white foam midsole and a slate-blue rubber outsole. The shoe stands on a seamless pale sage-grey paper backdrop (around #E3E8E0), lateral side view with the toe pointing left, camera slightly above at a gentle three-quarter angle, the shoe centered with generous empty margin on all sides, soft light from the upper left and a soft natural contact shadow beneath. |
| `p-court-shift` | Product | 1:1 | Shoe centred, toe left | Cards, Court Shift page, bag lines | Studio product photograph of a single high-top basketball shoe: bone-white smooth leather upper with deep forest-green suede overlays at the toe and heel, padded collar, bone laces, off-white cupsole with a forest-green outsole. The shoe stands on a seamless pale sage-grey paper backdrop (around #E3E8E0), lateral side view with the toe pointing left, camera slightly above at a gentle three-quarter angle, the shoe centered with generous empty margin on all sides, soft light from the upper left and a soft natural contact shadow beneath. |
| `p-studio-motion` | Product | 1:1 | Shoe centred, toe left | Cards, Studio Motion page, bag lines | Studio product photograph of a single mid-top court shoe: chalk-white leather upper with muted brick-red suede panels at the eyestay and heel, a plain ankle strap with a matte closure, white laces, white rubber cupsole. The shoe stands on a seamless pale sage-grey paper backdrop (around #E3E8E0), lateral side view with the toe pointing left, camera slightly above at a gentle three-quarter angle, the shoe centered with generous empty margin on all sides, soft light from the upper left and a soft natural contact shadow beneath. |
| `p-trail-form` | Product | 1:1 | Shoe centred, toe left | Cards, Trail Form page, bag lines | Studio product photograph of a single trail shoe: warm stone-beige suede and ripstop upper with umber-brown leather overlays and a rubber toe bumper, a quick-pull toggle lace, chunky dark umber lugged outsole. The shoe stands on a seamless pale sage-grey paper backdrop (around #E3E8E0), lateral side view with the toe pointing left, camera slightly above at a gentle three-quarter angle, the shoe centered with generous empty margin on all sides, soft light from the upper left and a soft natural contact shadow beneath. |
| `p-field-runner` | Product | 1:1 | Shoe centred, toe left | Cards, Field Runner page, bag lines | Studio product photograph of a single training shoe: moss-green knit upper, charcoal heel counter, moss-green laces, a low, flat and wide charcoal rubber sole built for stability. The shoe stands on a seamless pale sage-grey paper backdrop (around #E3E8E0), lateral side view with the toe pointing left, camera slightly above at a gentle three-quarter angle, the shoe centered with generous empty margin on all sides, soft light from the upper left and a soft natural contact shadow beneath. |
| `p-city-quiet` | Product | 1:1 | Shoe centred, toe left | Cards, City Quiet page, hero "worn here" proof card | Studio product photograph of a single retro running sneaker: layered fog-grey suede overlays on a pale grey mesh upper, cream laces, off-white foam midsole and a cream rubber outsole. The shoe stands on a seamless pale sage-grey paper backdrop (around #E3E8E0), lateral side view with the toe pointing left, camera slightly above at a gentle three-quarter angle, the shoe centered with generous empty margin on all sides, soft light from the upper left and a soft natural contact shadow beneath. |
| `p-daily-arc` | Product | 1:1 | Shoe centred, toe left | Cards, Daily Arc page, bag lines | Studio product photograph of a single low-top canvas sneaker: cream cotton canvas upper, navy canvas toe cap and heel tab, cream laces, warm honey gum-rubber vulcanized sole. The shoe stands on a seamless pale sage-grey paper backdrop (around #E3E8E0), lateral side view with the toe pointing left, camera slightly above at a gentle three-quarter angle, the shoe centered with generous empty margin on all sides, soft light from the upper left and a soft natural contact shadow beneath. |
| `col-running` | Collection context | 3:2 | Shoes lower centre; tall crop keeps the trailing shoe | Activity bento (tall tile), Running collection hero, Pace One "worn" view | Low-angle photograph of a runner's lower legs and feet mid-stride on a pale concrete riverside path in soft early-morning overcast light. The runner wears off-white mesh running shoes with muted clay-coral heels and lining and tall cream foam soles, and sage-grey running tights cropped at the calf. The background is softly blurred: pale still water, a low stone wall and muted green trees. Calm, cool and desaturated. |
| `col-basketball` | Collection context | 3:2 | Shoes lower centre; label placed top-left in the wide tile | Activity bento (wide tile), Basketball collection hero, Court Shift "worn" view | An indoor community basketball court with a pale maple floor and soft daylight from high windows. A player sits on a low wooden bench at courtside lacing a bone-white leather high-top basketball shoe with deep forest-green suede overlays, cropped from the knees down, wearing charcoal shorts and white socks; a worn basketball rests on the floor beside the bench. Muted palette of pale wood, bone, forest green and soft grey walls. |
| `col-training` | Collection context | 3:2 | Shoes lower left with kettlebell | Activity bento, Training collection hero, Field Runner "worn" view | A quiet concrete training studio with sage-painted walls and large soft window light. A pair of moss-green knit training shoes with low flat charcoal soles sits on the polished concrete floor beside a rolled dark grey exercise mat, a matte charcoal kettlebell and a folded bone-colored towel. Low camera close to the floor, calm and minimal composition. |
| `col-lifestyle` | Collection context | 3:2 | Feet lower centre | Activity bento, Lifestyle collection hero, Daily Arc "worn" view | A person seated on a pale limestone bench in a quiet city square in soft overcast morning light, cropped from the knees down, wearing relaxed ecru cotton trousers and cream canvas low-top sneakers with navy toe caps and warm honey gum-rubber soles; a plain paper coffee cup without print rests on the bench. Muted sage-green trees and pale stone buildings softly blurred in the background. |
| `about-resole` | Craft / story | 3:2, shown 21:9 | Hands and sole centred (object-position 50% 45%) | About page wide image | Close-up photograph of a craftsperson's hands at an oak workbench in a daylight workshop, pressing a new honey gum-rubber outsole onto a worn fog-grey suede sneaker upper. A few tools lie nearby: an awl, a small brush, a roll of waxed thread and a short stack of spare rubber soles. Sage-painted wall behind, soft window light from the left, shallow depth of field, calm and tactile. |
| `store-rivergate` | Store | 3:2 | Shelves and plinth, object-position 50% 60% | Home store visit, contact page store card | A bright sneaker store interior with sage walls, floating oak shelves of white and grey sneakers, a concrete plinth and a tall street window, soft daylight. |

## Minimum viable set (small image budget)

The sample ships 16 image files (15 photographs plus the hero crop) for 8
products and 4 collections. A smaller budget
or catalog works in this order; stop where the budget ends and use the
fallback for everything after it.

1. **Campaign hero** (`hero-portrait`), 1 image. Without it the hero has no
   subject, so it comes first. Fallback: none; reuse the shipped one only as a
   stand-in for a footwear or apparel store and say so.
2. **One product photo per product**, all with the identical framing sentence.
   They fill cards, product pages, search, the bag and the spotlight. Fallback:
   none; a product without its own photo cannot be sold on this page.
3. **One context photo per collection**, in the order of the activity bento
   (the first, tall tile is the most visible). Fallback: the collection's
   bestseller product photo as the tile and collection-hero image. Set
   `context: null` on products without a "worn" view; the gallery then shows
   the product photo only.
4. **Store photo** (`store-*`), only if the business has a physical shop.
   Without a shop, remove the store-visit section, the pickup delivery option
   and the store card on Contact instead of using a photo.
5. **Craft / story photo** for the About wide image, last. Fallback: reuse a
   collection context photo.

Example budgets: 6 images for 4 products and 2 collections = hero + 4
products + the first collection's context photo (the second collection uses
its bestseller's product photo). 3 images = hero + products only when the
catalog has two products; otherwise ask for more budget or for product photos.

## Production notes

- Generated at native resolution (1254 px square, 1536x1024 landscape) and
  exported as WebP (q84-88). The demo inlines every file once through the `IMG`
  map; cards, galleries and bag lines reuse the same data reference.
- The hero frame was extended with plain sage paper (edge-colour continuation
  with matched grain): `hero-model` on the left, `hero-portrait` on the top and
  right, so the model keeps headroom and is never cropped. Prefer this to
  cropping the subject. Keep the photo's natural tonal range: no duotone, wash
  or blend mode.
- Set `object-position` deliberately: hero `50% 100%` (40% at 701-900 px),
  store `50% 60%`, about `50% 45%`.
- Review every image at full size before use. Regenerate anything with
  uncanny hands, extra laces, text, logos or a backdrop that does not match the
  set. Shoes must not imitate a real brand's marks.
- When rebranding, keep the roles and framing sentences and change the
  products, colourways, people and places. Product cards rely on the backdrop
  matching `--mist`.
