# Visual contract

A generated site passes this contract before it is called complete. Each line
is checkable in a screenshot or in the CSS.

## First screen (1440 x 900)

- [ ] Plain white ground, header with wordmark plus fan mark, centred
      five-item nav, search and bag icons, ink rule below. No announcement
      bar.
- [ ] Centred uppercase eyebrow, then five scattered paper photo cards
      (slots, size and angles as in `style-guide.md`, Hero anatomy), then the
      headline. Headline top near 505px at 1440x900 and 404px at 390x844.
- [ ] Two-line heavy serif headline (`A different way` / `of seeing.`) at
      62px desktop and 40px phone, weight 800, no italic word; a 15px muted
      two-sentence lead; one outlined button.
- [ ] Nothing else in the first screen: no second CTA, stat strip, pill,
      badge, glow, wash or purple tint.

## Signatures that must survive

- [ ] `editorial-fan`: five scattered paper cards on the home hero (slot
      positions and angles from the first edition), paper border, layered
      tinted shadow, hover lift that straightens the card; the not-found page
      reuses the arc variant around a shared pivot.
- [ ] `topic-index`: ink top rule, numbered rows, large serif names, counts,
      hover thumbnail reveal, arrow.
- [ ] Story grids: at least one 7/5 asymmetric grid, one full-bleed feature
      photograph with an offset caption, one portrait carousel.
- [ ] `article-body`: serif column, pine drop cap, rule-topped italic pull
      quote, sticky facts aside, inline detail figure, reading progress line.
- [ ] Covers composed in HTML (photo plus masthead type), framed prints with
      a mat, letters as scattered rotated notes.

## Tokens and type

- [ ] Newsreader for display and reading, Schibsted Grotesk for UI (or a
      documented equivalent with similar width and contrast).
- [ ] Only the tokens in `style-guide.md`; one pine accent.
- [ ] Headline tracking negative (-.03 to -.05em), body 1.6 line height,
      reading measure about 66ch.

## Imagery

- [ ] One art direction across every photograph.
- [ ] Every story has a lead and a different detail image; covers and prints
      reuse only their own story's photograph.
- [ ] No text, logos or fake screens inside photographs.
- [ ] Crops chosen per slot; no cut-off heads or sliced subjects at 390px.

## Responsive

- [ ] 960px: 5 fan cards stacking left to right with every caption visible,
      nav collapses into a menu sheet, splits stack.
- [ ] 390px: fan bleeds 50px past the gutters with 132px photos and every
      caption readable, headline 40px, one centred outlined CTA,
      single-column stories, two-column product grid, no horizontal overflow.

## Behaviour

- [ ] Active nav underline follows the route; routes cross-fade and start at
      the top; unknown routes show the designed 404.
- [ ] Every control has hover, press, focus-visible and (where relevant)
      selected, loading, success, empty and error states.
