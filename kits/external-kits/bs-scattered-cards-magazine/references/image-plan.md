# Image plan

Every photograph has one job, one subject and one crop per slot. The set must look
like the work of one photographer on one assignment.

## Art direction

> Editorial magazine photograph, medium-format film look with an 80mm lens, warm late-afternoon Mediterranean sunlight with long soft shadows, palette of warm white lime plaster, travertine, terracotta, olive green and deep sea blue, natural materials, gentle film grain, calm and unstaged, quiet independent-magazine mood, absolutely no text, letters, logos or signage anywhere.

Apply it to every prompt. Ask for no text, letters, logos, signage or screens.
Generate at the aspect the slot displays, then export WebP: lead and feature
images about 1400px wide, details 900px, products 1000px, portraits 640px.
Review every image at full size and at 390px; regenerate anything with
artefacts, wrong subject, uncanny hands or faces, or text.

## Rules

- One subject per entity. A story's lead can reappear on its own cards, its
  topic, its issue cover or its print; never on an unrelated story or product.
- Each story gets a second, different image (detail, material, process or place).
- Portraits share framing (head and shoulders, centred), background and light.
- Covers and framed prints are composed in HTML from a photograph plus type,
  so the masthead stays crisp and editable. Leave clear wall or sky in the upper
  third of any cover photograph.
- Set `object-position` per slot; home hero cards crop leads to about 9:8 (215px high), the 404 arc fan to 4:5.
- Every `<img>` has alt text describing the subject; duplicate image links that
  sit next to a titled link use `alt=""` and `aria-hidden`.

## Slots (worked example: Ferrow)

| id | role | aspect | crop focus | used in | prompt |
| --- | --- | --- | --- | --- | --- |
| `story-fashion` | Story lead (People) | portrait 2:3 | face and torso, 40% 30% | Home fan (People slot), issue grid lead, story split hero, People topic, carousel and search thumbs | Full-length portrait of a relaxed man in his thirties with dark brown skin and short cropped hair, wearing a loose undyed oatmeal linen overshirt with rolled sleeves and wide charcoal cotton trousers with leather sandals, standing in the open doorway of a pale lime-plastered house on a quiet whitewashed lane, one hand in his pocket, looking slightly away from the camera, warm sunlight raking across the wall and showing the texture of the linen, a terracotta pot with a small olive tree beside the door. Subject centred, whole body in frame with space above the head. |
| `story-ceramics` | Story lead (Objects) | landscape 3:2 | hands and bowl, 40-55% 45-55% | Fan, issue grid, story lead, cards | Close view of a potter's clay-covered hands shaping a wide stoneware bowl on a wheel, a sunlit workshop with wooden shelves of finished pots behind, soft window light. |
| `story-interior` | Story lead (Spaces) | landscape 3:2 | armchair, 55-62% 60% | Fan, carousel, story lead, Spaces topic, spread in Issue 09 gallery | A rust bouclé armchair in a sunlit converted-warehouse loft with exposed brick, a tall steel-framed window with a distant city skyline, an open book on the polished concrete floor, dried flowers on a side table, warm late-afternoon light. |
| `story-food` | Story lead (Food) | landscape 3:2 | figs and bread, 30-50% | Fan, issue grid, story lead, Food topic | Overhead view of a linen-covered table with sliced sourdough, halved figs, honey, butter, coffee cups and a stovetop coffee pot, late breakfast light. |
| `story-botanical` | Story lead (Nature) and print | landscape 3:2 | branch, 60% 40% | Fan, carousel, story lead, Olive shadow print | The shadow of a gnarled olive branch falling across a warm white wall in low afternoon sun, a few leaves in focus at the top edge. |
| `story-studio` | Story lead (People) | landscape 3:2 | editor at table, 55% 45% | Carousel, story lead, People topic | A woman in a black shirt working at a long table covered with prints and contact sheets in a bright studio with plants, pinned photographs and a tall window. |
| `story-architecture` | Story lead (Architecture) and Issue 08 cover | landscape 3:2 | olive tree and pool, 50-68% 55% | Fan, carousel, story lead, Issue 08 cover | A courtyard of pale stone walls with a long reflecting pool and an old olive tree, a deep shaded doorway, a small figure in the distance, blue sky. |
| `story-coast` | Story lead (Places), feature and print | landscape 3:2 | cliff and chapel, 50-58% 50% | Home fan centre card, full-bleed feature, story lead, coast print, 404 fan | Aerial view of white limestone cliffs dropping into clear turquoise water, a small domed whitewashed chapel on the headland, a footpath along the ridge, mid-morning light. |
| `detail-fashion` | Story detail | landscape 3:2 | tote on stool, centre | Inline figure in the linen story | A rust leather tote resting on a folded cobalt merino sweater on a brushed steel stool, against a warm plaster wall with a raking shadow. |
| `detail-ceramics` | Story detail | square 1:1 | row of cups, centre | Inline figure in the ceramics story | Overhead close-up of six freshly glazed handmade stoneware cups drying in a loose row on a worn wooden board in a pottery workshop, glaze pooling at the base of each cup in cream, ash grey and iron brown, faint finger marks in the clay, a few drops of glaze on the board, soft side light from a window. |
| `detail-interior` | Story detail | portrait 2:3 | window niche, centre | Inline figure in the interior story | Close detail of a deep lime-plaster window niche in an old apartment: a hand-thrown stoneware bowl with a pale glaze and a folded natural linen cloth resting on the sill, a sheer linen curtain lifted slightly by a breeze, warm afternoon sun casting a long diagonal shadow across the plaster. No people. |
| `detail-food` | Story detail | landscape 3:2 | hands pouring oil, centre | Inline figure in the Sunday lunch story | Close view of a woman's hands pouring golden olive oil from a small ceramic jug over a plate of thickly sliced red and yellow heirloom tomatoes with torn basil and flaky salt, on a long linen-covered outdoor table under the dappled shade of a vine pergola, other plates and glasses softly out of focus. Face not visible. |
| `detail-botanical` | Story detail | portrait 2:3 | fig leaf and shadow, centre | Inline figure in the balcony story | A single large fig leaf on a long stem standing in a clear glass bottle of water on a narrow lime-plaster shelf, its sharp shadow cast across a warm white wall by low afternoon sun, minimal composition with generous negative space. |
| `detail-studio` | Story detail | landscape 3:2 | contact sheets, centre | Inline figure in the studio story | Overhead view of a large studio work table covered with photographic contact sheets of small landscape and still-life thumbnails, torn colour paper swatches in ochre, olive and rust, a steel ruler, scissors, a glass loupe and a pencil, arranged in a loose working grid, warm daylight from one side. The thumbnails are tiny photographs with no writing. |
| `detail-architecture` | Story detail | portrait 2:3 | doorway and light strip, centre | Inline figure in the stone house story | A deep shaded threshold inside a contemporary house built of pale travertine: a tall narrow doorway framing a sunlit courtyard with a single olive tree beyond, one bright strip of sunlight falling across the honed stone floor inside, a simple oak bench against the wall, strong quiet geometry, serene and empty. |
| `detail-coast` | Story detail and Issue 07 cover | portrait 2:3 | steps and cove, 50% 60% | Inline figure in the coast story, Issue 07 cover | Worn limestone steps descending between low whitewashed walls toward a tiny rocky cove with clear turquoise water, a small wooden rowing boat pulled onto the pebbles, wild fennel growing from the cracks, seen from the top of the steps, late afternoon light. No people. |
| `issue-cover` | Cover still life (Issue 09) | portrait 2:3 | vase low, empty wall above, 50% 70% | Issue 09 cover everywhere, subscription bag line | Still life for a magazine cover photograph: a tall matte cream stoneware vase holding a single gnarled olive branch, standing on a low travertine plinth against a softly lime-washed warm white wall, the branch shadow falling across the wall, the vase and plinth placed in the lower half of the frame with generous plain empty wall in the upper third. |
| `product-notebook` | Product still life | square 1:1 | notebooks, centre | Notebook card, product gallery, bag thumbs | Product still life on a pale plaster surface: a closed A5 cloth-bound notebook with a sage green linen cover and a rounded spine lying on top of a second notebook in rust linen slightly offset, a natural wood pencil laid beside them, soft directional daylight and a gentle shadow, completely plain blank covers with no marks, seen from a three-quarter overhead angle. |
| `portrait-editor` | Masthead portrait | square 1:1 | face, 50% 30% | About masthead | Head-and-shoulders portrait of a woman in her early fifties with short silver hair and fine laugh lines, wearing a navy cotton shirt, looking calmly at the camera with a slight smile, standing against a warm white lime-plastered wall in soft window light, face centred in the frame. |
| `portrait-photo` | Masthead portrait | square 1:1 | face, 50% 30% | About masthead | Head-and-shoulders portrait of an East Asian man in his mid thirties with short black hair and light stubble, wearing an olive cotton work jacket over a white t-shirt, looking at the camera with a relaxed neutral expression, standing against a warm white lime-plastered wall in soft window light, face centred in the frame. |
| `portrait-art` | Masthead portrait | square 1:1 | face, 50% 30% | About masthead | Head-and-shoulders portrait of a Black woman in her early thirties with natural shoulder-length curly hair and small gold hoop earrings, wearing a rust-coloured knitted sweater, looking at the camera with a warm calm expression, standing against a warm white lime-plastered wall in soft window light, face centred in the frame. |

All 21 images were generated for this Skill. The template references them as
`images/<id>.webp` through a single `IMAGES` registry in the script;
`scripts/inline-assets.mjs` inlines each file once for the single-file
deliverable, and every slot reuses it by id.

## Reuse policy for a buyer's site

- Neutral placeholders (Mediterranean light; reuse only when the brand fits
  that palette): `story-botanical`, `detail-botanical`, `issue-cover`,
  `story-interior`, `detail-interior`, `story-architecture`,
  `detail-architecture`, `story-coast`, `detail-coast`, `story-food`,
  `detail-ceramics`.
- Sample-specific, regenerate: `story-fashion`, `story-ceramics`,
  `story-studio`, `detail-fashion`, `detail-food`, `detail-studio`,
  `product-notebook`.
- Stand-ins only (generated people): `portrait-editor`, `portrait-photo`,
  `portrait-art`. Ask for real photos of real people and say which images
  are stand-ins in the final reply.
