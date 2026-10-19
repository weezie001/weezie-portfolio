> Pages are built from the style kit's recipes in `references/style-kit.json` (SKILL.md Workflow step 4); keep the composition rules in this file as design guidance. The HTML snippets below only illustrate each archetype's geometry and hierarchy; do not paste them as slides. Their `<section>` wrappers and `data-*` attributes come from the retired hand-written format and are not required.

# Layout recipes

These are independently reusable composition examples, not a mandatory sequence or a slide-count limit. Select, reorder, combine, remove or extend them to produce exactly the user-requested number of pages. Adapt card and image-slot arrangements to the actual content; do not treat the example inventory as an image quota.

Preserve cream, mustard and vermilion blocks, condensed openings, fine serif narrative headings, crisp photos and compact editorial detail. Generate each image slot independently.

## Layout 1

```html
<section class="slide s1 " data-slide-id="opening"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="portrait" data-art-slot="01" role="img" aria-label="Fictional ceramic artist against mustard brushwork"></div><div class="cover-copy"><span class="kicker">An independent craft journal / concept</span><h1>MADE<br>TO LAST.</h1><svg class="underline" viewBox="0 0 330 12"><path d="M3 9Q166-5 326 5M105 10Q186 5 270 10"/></svg><p>Useful objects. Thoughtful makers.<br>Stories worth keeping.</p><span class="button">Open the journal <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h15M13 5l7 7-7 7"/></svg></span></div><div class="stamp">MATERIAL<br>METHOD<br>MEANING</div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 2

```html
<section class="slide s2 " data-slide-id="about"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="studio" data-art-slot="02" role="img" aria-label="Potter sketching in a working studio"></div><div class="intro"><span class="kicker">Why this journal</span><h2>Objects with purpose.<br>Stories with <em>soul.</em></h2><svg class="underline" viewBox="0 0 330 12"><path d="M3 9Q166-5 326 5M105 10Q186 5 270 10"/></svg><p>We look beyond the finished thing: at the choices, tools and people that give it character. A good story makes those details visible without polishing away the human work.</p><div class="signature">An eye for the everyday.</div></div><div class="round-note">LOOK CLOSELY.<br>ASK BETTER<br>QUESTIONS.</div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 3

```html
<section class="slide s3 " data-slide-id="evidence"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="evidence" data-art-slot="03" role="img" aria-label="Craft editor table with clay, paper and tools"></div><div class="heading"><h2>Begin with<br><em>the object.</em></h2><p>A surface, a mark, a useful imperfection.<br>Follow the details before writing the story.</p></div><div class="label-strip"><span>01 / MATERIAL</span><span>02 / TOOL MARKS</span><span>03 / USE OVER TIME</span><span>04 / THE MAKER'S CHOICES</span></div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 4

```html
<section class="slide s4 dark ink" data-slide-id="practice"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="heading"><span class="kicker">The editorial practice</span><h2>What makes<br>a story<br>worth keeping?</h2><svg class="underline" viewBox="0 0 330 12"><path d="M3 9Q166-5 326 5M105 10Q186 5 270 10"/></svg><p>Four connected habits guide the proposed journal.</p></div><div class="service-grid"><article><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><h3>Notice the details</h3><p>Look at material, proportion and the signs of use.</p><span class="index">01 / OBSERVE</span></article><article><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="m16 3 5 5-12 12-6 1 1-6L16 3Z M13 6l5 5"/></svg><h3>Ask with care</h3><p>Find the decision behind a shape, joint or finish.</p><span class="index">02 / INTERVIEW</span></article><article><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3Z M12 6v16"/></svg><h3>Build the story</h3><p>Pair clear writing with photographs that explain.</p><span class="index">03 / COMPOSE</span></article><article><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/></svg><h3>Keep it useful</h3><p>Make an edition worth reading, saving and sharing.</p><span class="index">04 / PUBLISH</span></article></div><div class="service-outcome">A SMALL PROCESS. A CLEAR POINT OF VIEW.</div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 5

```html
<section class="slide s5 " data-slide-id="stories"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="heading"><span class="kicker">Selected story directions</span><h2>Three<br>ways<br>of making.</h2><svg class="underline" viewBox="0 0 330 12"><path d="M3 9Q166-5 326 5M105 10Q186 5 270 10"/></svg><p>Distinct materials.<br>A shared attention to use.</p><span class="button">First edition <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h15M13 5l7 7-7 7"/></svg></span></div><div class="project-grid"><article><div class="art" data-art-slot="05a" role="img" aria-label="Three ochre cups on a red field"></div><div class="caption"><h3>A daily ritual<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h15M13 5l7 7-7 7"/></svg></h3><p>Ceramics / Form and touch</p></div></article><article><div class="art" data-art-slot="05b" role="img" aria-label="Printmaking book and woodblock"></div><div class="caption"><h3>A mark on paper<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h15M13 5l7 7-7 7"/></svg></h3><p>Print / Process and repetition</p></div></article><article><div class="art" data-art-slot="05c" role="img" aria-label="Handwoven wooden stool"></div><div class="caption"><h3>A place to pause<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h15M13 5l7 7-7 7"/></svg></h3><p>Furniture / Structure and use</p></div></article></div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 6

```html
<section class="slide s6 " data-slide-id="hands"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="detail" data-art-slot="06" role="img" aria-label="Artisan hands shaping a terracotta bowl"></div><div class="story"><span class="kicker">Process / Clay</span><h2>The hand<br>leaves<br>a <em>trace.</em></h2><svg class="underline" viewBox="0 0 330 12"><path d="M3 9Q166-5 326 5M105 10Q186 5 270 10"/></svg><p>Small variations can show how an object was made. Ask which marks are intentional, which are accepted, and which are changed.</p><div class="observation">A useful question:<br>What did the material ask you to do differently?</div></div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 7

```html
<section class="slide s7 " data-slide-id="materials"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="material" data-art-slot="07" role="img" aria-label="Board of fabric, clay, wood, glass and fiber"></div><div class="heading"><span class="kicker">A material-led interview</span><h2>Every material<br>changes <em>the story.</em></h2></div><div class="process"><article><span class="number">01</span><div><h3>Notice the difference</h3><p>Describe what the material does, not only how it looks.</p></div></article><article><span class="number">02</span><div><h3>Ask about the trade-off</h3><p>Find out what was gained and what was left behind.</p></div></article><article><span class="number">03</span><div><h3>Return to everyday use</h3><p>Connect the making decision to the life of the object.</p></div></article></div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 8

```html
<section class="slide s8 dark rust" data-slide-id="principle"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="paint" data-art-slot="08" role="img" aria-label="Restrained vermilion painted field with sparse mustard and cream marks"></div><div class="statement"><span class="kicker">An editorial principle</span><blockquote>Good design gives us<br>something to use.<br>A good story gives us<br>a reason to look again.</blockquote><div class="rule"></div><p>A belief that guides what we choose,<br>how we ask, and what we publish.</p></div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 9

```html
<section class="slide s9 " data-slide-id="insights"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="heading"><span class="kicker">Editorial notes</span><h2>Ideas<br>from the<br>workbench.</h2><svg class="underline" viewBox="0 0 330 12"><path d="M3 9Q166-5 326 5M105 10Q186 5 270 10"/></svg><p>Three possible essays for the first edition.</p></div><div class="project-grid"><article><div class="art" data-art-slot="09a" role="img" aria-label="Mustard paper and original black print"></div><div class="caption"><span class="kicker">Perspective</span><h3>Less, but with intention</h3><p>What becomes clearer when an object has fewer parts?</p></div></article><article><div class="art" data-art-slot="09b" role="img" aria-label="Black and vermilion abstract print"></div><div class="caption"><span class="kicker">Material</span><h3>The power of a simple mark</h3><p>A small gesture can carry the evidence of a whole process.</p></div></article><article><div class="art" data-art-slot="09c" role="img" aria-label="Sketchbook of ceramic form studies"></div><div class="caption"><span class="kicker">Method</span><h3>From a sketch to a useful thing</h3><p>Follow the changes between an early idea and the finished form.</p></div></article></div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 10

```html
<section class="slide s10 " data-slide-id="makers"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="heading"><span class="kicker">The people behind the work</span><h2>People<br>before<br><em>profiles.</em></h2><p>A conversation should leave room for the maker to be more than a polished origin story.</p></div><div class="stamp">MAKERS<br>MATERIAL<br>MINDSET</div><div class="maker-grid"><article><div class="art" data-art-slot="10a" role="img" aria-label="Woodworker holding a carved vessel"></div><h3>The shape of patience</h3><p>A proposed conversation about tools, grain and small decisions.</p></article><article><div class="art" data-art-slot="10b" role="img" aria-label="Printmaker beside a manual press"></div><h3>A mark worth repeating</h3><p>A proposed conversation about pressure, paper and variation.</p></article></div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 11

```html
<section class="slide s11 " data-slide-id="edition"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="binding" data-art-slot="11" role="img" aria-label="Magazine signatures and traditional binding tools"></div><div class="heading"><span class="kicker">A proposed first issue</span><h2>One edition.<br>Made with <em>care.</em></h2></div><div class="edition-plan"><article><span class="kicker">Gather</span><div><h3>Choose three useful stories</h3><p>Find distinct objects and a clear question for each.</p></div></article><article><span class="kicker">Make</span><div><h3>Build one coherent edition</h3><p>Commission photographs, interview carefully and edit together.</p></div></article><article><span class="kicker">Review</span><div><h3>Read it as a reader</h3><p>Check facts, sequence, captions and the space between stories.</p></div></article></div><div class="small-note">A manageable first edition is a chance to learn what the journal should become.</div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```

## Layout 12

```html
<section class="slide s12 dark mustard" data-slide-id="closing"><div class="canvas"><div class="topline"><b>OBJECT JOURNAL</b><span>Independent craft / edition concept &nbsp; <span data-page-number></span></span></div><div class="closing-art" data-art-slot="12" role="img" aria-label="Original hand-drawn hand holding a bowl on mustard paper"></div><div class="close-copy"><span class="kicker" style="color:#171612">Let us look closer</span><h2>Have an object<br>in mind?</h2><svg class="underline" viewBox="0 0 330 12"><path d="M3 9Q166-5 326 5M105 10Q186 5 270 10"/></svg><p>Bring a useful thing and the question it raises.<br>That is enough to begin a good story.</p><span class="button">Start with a question <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h15M13 5l7 7-7 7"/></svg></span></div><div class="footer-band"><div><b>OBJECT JOURNAL</b><p>A fictional independent publication concept.<br>Useful objects. Thoughtful stories.</p></div><div><span class="kicker">The practice</span><p>Observe carefully.<br>Ask with interest.<br>Publish with care.</p></div><div><span class="kicker">The next step</span><p>Choose one object.<br>Meet the person behind it.<br>Find the story worth keeping.</p></div></div><div class="footnote">An independent journal concept / Original editorial studies</div></div></section>
```