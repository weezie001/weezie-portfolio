# Image plan

Beacon is a product-first style: the product console, tour and bento are built as HTML/SVG
product UI, never as photographs of screens. Photographs appear only where a real
SaaS site uses them, and every photo has one job tied to the copy beside it.

## Art direction (one photographer, one grade)

> Natural documentary-style photography shot on a 50mm lens at f/2, soft diffused daylight or dusk light, calm warm-neutral palette of stone grey, warm off-white and charcoal with one cool beacon-blue light accent, gentle low contrast, fine natural film grain, quiet contemporary tech-company editorial, realistic skin texture, no retouched glamour look.

Append this sentence to every prompt. It keeps the set consistent: natural light,
warm stone neutrals with one cool blue accent (the beacon), low contrast, fine
grain, real skin texture. No text, logos, watermarks or readable screens in any
image; laptops are closed or turned away.

## Slots

| id | role | aspect | crop focus (`object-position`) | used in | file |
| --- | --- | --- | --- | --- | --- |
| `night-page` | editorial / mood | 3:2 master, shown 1:1 (16:11 on tablet) | `78% 50%`: phone and blue glow right of centre, stat card sits in the dark top-left | `#alerting` split | `images/night-page.webp`, 1400 px |
| `story-adaeze` | customer, environmental portrait | 3:2 master, shown ~4:3 to 16:10 | `72% 38%`: subject on the right third, face in the upper third | `#customers` featured story | `images/story-adaeze.webp`, 1400 px |
| `av-1` to `av-9` | people, testimonial portraits | 1:1 crops from one 3x3 grid image | centred head and shoulders | testimonial cards, auth aside | `images/av-N.webp`, 176 px |
| `team-support` | team / company | 3:2 | `50% 45%`: group centred, room to crop both sides | `#/contact` route | `images/team-support.webp`, 1400 px |

Total: 4 generations, 12 files. Avatars come from a single 3x3 grid generation so
lighting, background and framing match exactly; crop each cell with an inset of a
few pixels to avoid the gutters (for example `cwebp -crop x y 340 340 -resize 176 176`
on a 1254 px master), then check every crop as a circle at 40 px.

## Prompts used

### `story-adaeze` (landscape, 1400 px)

Environmental portrait of a Nigerian woman in her late thirties, VP of Engineering, standing relaxed and leaning against a concrete pillar in a calm, half-empty software company office at early evening, arms loosely folded, warm genuine half-smile, looking just off camera. Short natural coily hair, charcoal knit top, small silver earrings. Background softly out of focus: long oak desks, a few desk lamps, large warehouse windows with fading blue dusk light. Subject placed on the right third of the frame with open negative space on the left. Any screens in the background are turned away or completely blurred with no readable content.

### `avatars-grid` (square, 1024 px)

A precise 3 by 3 grid of nine separate head-and-shoulders studio portraits of different software engineers, each in its own equal square cell separated by thin even warm off-white gutters, no borders, no text. Every cell uses the same plain warm light-grey seamless wall, the same soft window light from the left, the same framing with eyes on the upper third and shoulders visible, relaxed genuine expressions. Row one, left to right: a Polish man in his mid-forties with short greying hair and stubble in a navy crew-neck sweater; a Japanese man in his early thirties with black hair and thin metal glasses in a grey t-shirt; a Latina woman in her forties with shoulder-length dark wavy hair in an olive shirt. Row two: a Welsh man in his late twenties with a short ginger beard in a denim shirt; a South Indian woman in her mid-thirties with hair tied back in a black blouse; a Black man in his thirties with close-cropped hair in a charcoal overshirt. Row three: a Swedish woman in her late twenties with a straight blonde bob in a cream knit sweater; a Brazilian man in his fifties with a salt-and-pepper beard in a white oxford shirt; an East Asian woman in her forties with short black hair and small silver earrings in a grey blazer.

### `night-page` (landscape, 1400 px)

Quiet bedroom at night, close still-life of a bedside table: a smartphone lying face down on a light oak nightstand, its screen casting a soft cool blue glow onto the wood grain and the edge of a rumpled linen duvet, a ceramic cup and a folded pair of glasses beside it. Very dark warm-neutral surroundings, the only light is the soft blue spill from under the phone. Calm, restful, cinematic low-key lighting, shallow depth of field, composition weighted to the right with dark empty space on the left.

### `team-support` (landscape, 1400 px)

Four software support engineers of mixed ages and backgrounds gathered around a long pale wooden table in a bright, calm office with white-washed brick walls and large windows, mid-conversation, one pointing at a paper notebook, laptops closed or angled away from camera with no visible screens, mugs and a few plants. Candid, warm, collaborative mood, soft overcast daylight, eye-level medium-wide shot with the group centered and room to crop on both sides.

## Re-planning for a new product

Reuse of the shipped files: `av-1` to `av-9` and `team-support` may stay as
neutral placeholders (call them out as stand-ins; real people need real
photos); `night-page` fits alerting and notification products only;
`story-adaeze` is the sample customer and must be regenerated and renamed.

1. List the slots by role before writing prompts: story portrait (customer the quote
   belongs to), one editorial image that dramatises the core promise, testimonial
   portraits, team photo for the contact route. Skip any slot the page does not need.
2. Write one art-direction sentence for the brand and append it to every prompt.
   Keep the cool blue accent somewhere in the light so photos belong to the beam.
3. Choose the aspect per slot from the table above and decide the crop focus
   before generating; compose the prompt so the subject sits where the crop keeps it.
4. Generate at 1.5x the largest displayed size, save WebP (q78-82): full-bleed
   1800-2000 px, half-width 1200-1400 px, cards 800-900 px, avatars 160-200 px.
5. Look at every image. Regenerate anything with text, fake UI, warped hands or
   faces, a second light colour, or a subject that the crop would cut.
6. Every `<img>` gets a specific `alt`, `width`/`height`, `loading="lazy"` below
   the fold and `decoding="async"`; decorative images use `alt=""`.

No image tool available? Keep the product UI (it needs no images), use initials
chips for testimonials (`.initials`), replace the alerting photo with a product
vignette card, and drop the team photo. Never hot-link stock photos.
