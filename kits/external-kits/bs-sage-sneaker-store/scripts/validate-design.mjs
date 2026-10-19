#!/usr/bin/env node
/**
 * Validate a store built from the Sage Sneaker Store Skill.
 *
 *   node scripts/validate-design.mjs path/to/index.html              # your store (default)
 *   node scripts/validate-design.mjs path/to/index.html --files      # deployed, images/fonts beside the page
 *   node scripts/validate-design.mjs references/template.html --template
 *   node scripts/validate-design.mjs path/to/store-demo.html --demo
 *
 * Modes
 *   (default)   A finished single-file store for a real brief. Strict: offline,
 *               every asset inlined, and it FAILS when the template's sample
 *               identity is still in the page (brand, store, address, products,
 *               lines, reviewers, promo code, order prefix, sample slugs).
 *   --template  (alias --allow-replace) references/template.html itself: allows
 *               relative images/ references and the fontsource CDN woff2 files
 *               inside @font-face src. Any other remote URL still fails. The
 *               sample identity is expected here.
 *   --demo      The fictional store demo: strict like the default, but the
 *               sample identity is allowed because the demo is the sample.
 *   --files     With the default mode, for a deployed site that keeps its
 *               images and fonts as local files beside the page (images/,
 *               fonts/, assets/): local references and size are not checked;
 *               remote URLs and sample leftovers still fail.
 *
 * Route names, nav labels, headings and item counts are the buyer's own. Checks:
 *   1. Self-contained and offline: no remote URLs, scripts, stylesheets or fonts.
 *   2. Sandbox-safe: no network APIs, cookies, dialogs or window.open; storage
 *      only inside try/catch; no location.hash assignment; script-dispatched
 *      form submission.
 *   3. Icon discipline: no emoji or Unicode dingbats outside inline SVG.
 *   4. Accessibility: every <img> has alt; reduced-motion block; :focus-visible;
 *      skip link; landmarks; labelled form controls; one <h1> per static page.
 *   5. Store structure: hash router, home + not-found, at least 8 routed pages,
 *      at least one detail page (data-detail="<index>") whose index exists, a
 *      form, every static "#/..." link resolves (detail links to a known id).
 *   6. Signature structures: sneaker-hero, sneaker-model, sneaker-proof,
 *      hero-search, oversized white uppercase hero title, @font-face woff2.
 *   7. Content hygiene and size: no {{tokens}}, lorem ipsum or generic
 *      placeholder names; single file 5 MB target, 8 MB hard cap.
 *   8. Sample leftovers (default mode only).
 */
import { readFileSync, statSync } from 'node:fs';

const args = process.argv.slice(2);
const template = args.includes('--template') || args.includes('--allow-replace');
const demo = args.includes('--demo');
const files = args.includes('--files') && !template;
const mode = template ? 'template' : demo ? 'demo' : 'site';
const file = args.find((a) => !a.startsWith('--'));
if (!file) { console.error('usage: node scripts/validate-design.mjs <page.html> [--template | --demo] [--files]'); process.exit(2); }
let html;
try { html = readFileSync(file, 'utf8'); } catch (err) { console.error(`cannot read ${file}: ${err.message}`); process.exit(2); }

/* The template's sample identity (Stride Common, fictional). A buyer's page
   must not contain any of these; the store demo and the template may.
   Matching is case-insensitive and includes comments, attributes and scripts. */
const SAMPLE = {
  brand: ['Stride Common', 'stridecommon', 'STRIDE10'],
  store: ['Rivergate', 'Alder Street', '555-0148'],
  products: ['Pace One', 'Tempo Knit', 'Court Shift', 'Studio Motion', 'Trail Form', 'Field Runner', 'City Quiet', 'Daily Arc'],
  lines: ['Pace Studio', 'Field Supply', 'Common Form'],
  people: ['Priya Raman', 'Tomás Ibarra', 'Ruth Mensah', 'Daniel Cho', 'Marcus Adeyemi', 'Jonah Feld', 'Aiko Tanaka', 'Leo Marchetti', 'Hannah Okoye', 'Sam Whitlock', 'Grace Lindqvist', 'Andre Silva', 'Nadia Ferreira', 'Owen Brennan', 'Mei-Lin Chao', 'Ibrahim Haddad'],
  slugs: ['pace-one', 'tempo-knit', 'court-shift', 'studio-motion', 'trail-form', 'field-runner', 'city-quiet', 'daily-arc', 'pace-studio', 'field-supply', 'common-form'],
};
/* Brand-derived codes (case-sensitive patterns) */
const SAMPLE_CODES = [
  ['order prefix "SC-"', /\bSC-(?:\d|\[)|['"]SC-['"]/],
  ['storage key "sc"', /['"]sc-(?:cart|saved|promo)['"]|storageKey\s*:\s*['"]sc['"]/],
];

const errors = [];
const warn = [];
const lean = html.replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi, 'data:');
const scripts = [...lean.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
const styles = [...lean.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
const markup = lean.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');

/* 1. Self-containment */
/* template mode: fontsource CDN font files inside @font-face src are the one allowed host */
const CDN_FONT = /url\(\s*(["']?)https:\/\/cdn\.jsdelivr\.net\/fontsource\/fonts\/[^)"'\s]+\.woff2\1\s*\)/g;
const net = template ? lean.replace(/@font-face\s*\{[^}]*\}/g, (block) => block.replace(CDN_FONT, 'url()')) : lean;
if (!template && /@font-face\s*\{[^}]*https?:\/\/[^}]*\}/.test(lean)) errors.push(files ? '@font-face loads a remote font file: download the fontsource woff2 files into fonts/ beside the page and point src at them' : '@font-face loads a remote font file: build with scripts/inline-assets.mjs (it embeds the fontsource woff2 files)');
for (const m of net.matchAll(/(?<![\w-])(?:src|href|poster|action)\s*=\s*["']((?:https?:)?\/\/[^"']+)["']/gi)) errors.push(`remote reference: ${m[1]}`);
if (/url\(\s*["']?(?:https?:)?\/\//i.test(net)) errors.push('CSS url() points to a remote asset');
if (/@import\b/i.test(styles)) errors.push('@import is not allowed; inline the CSS');
for (const m of net.matchAll(/<script[^>]+src\s*=\s*["']([^"']+)["']/gi)) errors.push(`external <script src="${m[1]}">: inline all JS`);
for (const m of net.matchAll(/<link\b[^>]*rel\s*=\s*["']?(?:stylesheet|preload|preconnect|dns-prefetch)[^>]*>/gi)) errors.push(`external <link> not allowed: ${m[0].slice(0, 80)}`);
if (!template && !files) {
  const rel = lean.match(/["'(](?:\.\/)?(?:images|fonts|assets)\/[\w./-]+\.(?:webp|png|jpe?g|avif|gif|woff2?|svg|mp4)/);
  if (rel) errors.push(`asset not inlined (${rel[0].slice(1)}): build with scripts/inline-assets.mjs, or validate a deployed site with --files`);
}

/* 2. Sandbox safety */
for (const api of ['fetch(', 'XMLHttpRequest', 'new WebSocket', 'EventSource', 'navigator.sendBeacon', 'document.cookie', 'indexedDB', 'window.open(', 'alert(', 'confirm(', 'prompt(']) {
  if (scripts.includes(api)) errors.push(`forbidden in a sandbox-safe page: ${api}`);
}
for (const api of ['localStorage', 'sessionStorage']) {
  let i = -1;
  while ((i = scripts.indexOf(api, i + 1)) !== -1) {
    const before = scripts.slice(Math.max(0, i - 160), i);
    if (!/try\s*\{[^}]*$/.test(before)) { errors.push(`${api} used outside a try block (sandboxed iframes throw)`); break; }
  }
}
if (/target\s*=\s*["']_(?:top|parent)["']/i.test(lean)) errors.push('top-level navigation target');
if (/location\.hash\s*=[^=]/.test(scripts)) errors.push('location.hash assignment: render the route from JS and sync with history.pushState inside try/catch');
if (/<form\b/i.test(markup) && /type=["']submit["']/i.test(lean) && !/dispatchEvent\(\s*new Event\(\s*['"]submit/.test(scripts)) {
  errors.push('forms rely on native submission, which a sandbox without allow-forms blocks: dispatch submit from script or use type="button" with click/Enter handlers');
}

/* 3. Emoji and dingbats outside SVG */
const visible = lean.replace(/<!--[\s\S]*?-->/g, '').replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/<symbol[\s\S]*?<\/symbol>/gi, '');
const emojiRe = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}\u{2700}-\u{27BF}\u{FE0F}\u{2022}\u{2023}\u{2043}]/u;
const em = visible.match(emojiRe);
if (em) errors.push(`emoji or dingbat U+${em[0].codePointAt(0).toString(16).toUpperCase()} used as an icon: replace with inline SVG`);
if (/font-family\s*:[^;]*(font\s*awesome|material\s*(icons|symbols)|icomoon|ionicons)/i.test(styles)) errors.push('icon fonts are not allowed');
if (/[—–]/.test(visible.replace(/<style[\s\S]*?<\/style>/gi, ''))) warn.push('em or en dash in copy: prefer commas, periods or a hyphen');

/* 4. Accessibility basics */
const imgs = [...lean.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
const noAlt = imgs.filter((t) => !/\balt\s*=/.test(t));
if (noAlt.length) errors.push(`${noAlt.length} <img> without alt, e.g. ${noAlt[0].slice(0, 90)}`);
if (!/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(styles)) errors.push('missing @media (prefers-reduced-motion: reduce) block');
if (!/:focus-visible/.test(styles)) errors.push('missing :focus-visible styles');
if (!/class=["'][^"']*skip-link/.test(markup)) warn.push('no skip link found');
if (!/<main\b/.test(markup) || !/<header\b/.test(markup) || !/<footer\b/.test(markup)) errors.push('missing header/main/footer landmarks');
for (const m of markup.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)) {
  const attrs = m[2];
  if (/type\s*=\s*["'](hidden|radio|checkbox)["']/.test(attrs) || /aria-label(ledby)?\s*=/.test(attrs)) continue;
  const id = (attrs.match(/\bid\s*=\s*["']([^"']+)["']/) || [])[1];
  if (!id || !new RegExp(`for\\s*=\\s*["']${id}["']`).test(markup)) errors.push(`form control without a <label for> or aria-label: ${m[0].slice(0, 70)}`);
}
if (!/aria-expanded/.test(lean)) warn.push('no aria-expanded controls (mobile menu, accordions)');

/* 5. Store structure (generic: the route names are the buyer's own) */
if (!/addEventListener\(\s*['"](hashchange|popstate)['"]/.test(scripts)) errors.push('no hash router found (hashchange/popstate listener)');
const sections = [...markup.matchAll(/<section\b([^>]*\bdata-page\s*=\s*["']([^"'$]+)["'][^>]*)>/g)].map((m) => ({ page: m[2], detail: (m[1].match(/\bdata-detail\s*=\s*["']([^"']+)["']/) || [])[1] || null }));
const pageList = sections.map((s) => s.page);
const pages = new Set(pageList);
for (const p of pageList.filter((p, i) => pageList.indexOf(p) !== i)) errors.push(`duplicate data-page="${p}"`);
for (const p of ['home', 'not-found']) if (!pages.has(p)) errors.push(`router page missing: data-page="${p}" (the router falls back to these)`);
if (pages.size < 8) errors.push(`only ${pages.size} routed pages (data-page); a store needs at least 8: home, an index, a detail page, bag, checkout, a help page, contact and the 404`);
const detailOf = new Map(sections.filter((s) => s.detail).map((s) => [s.detail, s.page]));
/* item links rendered from data: `#/<index>/${item.id}` */
const renderedIndex = new Set([...scripts.matchAll(/#\/([\w-]+)\/\$\{/g)].map((m) => m[1]).filter((i) => pages.has(i)));
if (!detailOf.size && !renderedIndex.size) errors.push('no collection: expected an index page with item pages #/<index>/<id>; mark the page that renders an item with data-detail="<index>" (the template has data-page="product" data-detail="catalog")');
else if (!detailOf.size) warn.push(`item pages under ${[...renderedIndex].map((i) => '#/' + i + '/').join(', ')} have no data-detail marker on the section that renders them`);
for (const [index, page] of detailOf) if (!pages.has(index)) errors.push(`detail page "${page}" (data-detail="${index}") has no index page data-page="${index}"`);
if (!/<form\b/i.test(markup)) errors.push('no form: keep the checkout or the contact form');
const ids = new Set([...scripts.matchAll(/\bid\s*:\s*['"]([\w-]+)['"]/g)].map((m) => m[1]));
const linked = new Set();
for (const m of markup.matchAll(/href\s*=\s*["']#\/([^"'#?]*)/g)) {
  const route = m[1].replace(/\/$/, '');
  if (!route) { linked.add('home'); continue; }
  const [top, child, ...rest] = route.split('/');
  if (pages.has(route)) { linked.add(route); continue; }
  if (child && detailOf.has(top)) {
    if (rest.length || !ids.has(child)) errors.push(`link "#/${m[1]}" names no item with id '${child}' in the data arrays`);
    else linked.add(detailOf.get(top));
    continue;
  }
  if (child && pages.has(top) && renderedIndex.has(top)) {
    if (rest.length || !ids.has(child)) errors.push(`link "#/${m[1]}" names no item with id '${child}' in the data arrays`);
    linked.add(top); continue;
  }
  if (child && pages.has(top)) { warn.push(`link "#/${m[1]}": mark the page it renders with data-detail="${top}"`); linked.add(top); continue; }
  errors.push(`link "#/${m[1]}" resolves to no data-page`);
}
for (const m of markup.matchAll(/data-nav\s*=\s*["']([^"']+)["']/g)) if (!pages.has(m[1])) errors.push(`nav item data-nav="${m[1]}" matches no data-page`);
const blocks = [...markup.matchAll(/<section\b[^>]*\bdata-page\s*=\s*["']([^"']+)["'][^>]*>[\s\S]*?(?=<section\b[^>]*\bdata-page\s*=|<\/main>)/g)];
const shells = new Set(blocks.filter((m) => !m[0].replace(/<[^>]+>/g, '').trim()).map((m) => m[1])); /* empty sections filled by script */
const scriptLinks = new Set([...scripts.matchAll(/#\/([\w-]+)/g)].map((m) => m[1]));
for (const s of sections) if (!s.detail && !shells.has(s.page) && s.page !== 'home' && s.page !== 'not-found' && !linked.has(s.page) && !scriptLinks.has(s.page)) warn.push(`page "${s.page}" is never linked`);
for (const m of blocks) {
  if (detailOf.has(sections.find((s) => s.page === m[1])?.detail) || shells.has(m[1])) continue; /* rendered from data */
  const n = (m[0].match(/<h1\b/g) || []).length;
  if (n !== 1) errors.push(`page "${m[1]}" has ${n} <h1> (expected 1)`);
}

/* 6. Signature structures */
for (const [label, re] of [['sneaker-hero', /class=["'][^"']*\bsneaker-hero\b/], ['sneaker-model', /class=["'][^"']*\bsneaker-model\b/], ['sneaker-proof', /class=["'][^"']*\bsneaker-proof\b/], ['hero-search', /class=["'][^"']*\bhero-search\b/]]) {
  if (!re.test(markup)) errors.push(`missing signature structure: ${label}`);
}
const heroRule = (styles.match(/\.hero-title\s*\{[^}]*\}/) || [''])[0];
if (!/text-transform:\s*uppercase/.test(heroRule) || !/color:\s*(#fff\b|#ffffff|white)/i.test(heroRule)) errors.push('.hero-title must be oversized white uppercase type');
if (!/@font-face[\s\S]*?woff2/.test(lean)) errors.push('no @font-face with a woff2 font');

/* 7. Content hygiene and size */
const bytes = statSync(file).size;
if (!template && !files) {
  if (bytes > 8 * 1024 * 1024) errors.push(`page is ${(bytes / 1048576).toFixed(1)} MB (hard cap 8 MB): reference each image once (IMG map) and build with scripts/inline-assets.mjs`);
  else if (bytes > 5 * 1024 * 1024) warn.push(`page is ${(bytes / 1048576).toFixed(1)} MB (target 5 MB)`);
}
if (!template && /<!--\s*REPLACE:/.test(lean)) errors.push('leftover REPLACE placeholder');
if (/\{\{[a-z_:-]+\}\}/i.test(markup)) errors.push('leftover {{token}} placeholder');
if (/lorem ipsum|dolor sit amet/i.test(lean)) errors.push('lorem ipsum copy');
if (/\b(John|Jane) Doe\b|Your Company|\bAcme\b/i.test(visible)) errors.push('generic placeholder names in copy');

/* 8. Sample leftovers (a buyer's page must not ship the template's identity) */
const found = [];
if (mode === 'site') {
  const text = lean.replace(/&amp;/g, '&').replace(/&aacute;/g, 'á').replace(/&rsquo;|&#8217;|’|&#39;|&apos;/g, "'").replace(/&nbsp;|\s+/g, ' ').toLowerCase();
  for (const [kind, terms] of Object.entries(SAMPLE)) {
    for (const term of terms) {
      const t = term.toLowerCase();
      const hit = kind === 'slugs' ? new RegExp(`(?<![a-z0-9])${t}(?![a-z0-9])`).test(text) : text.includes(t);
      if (hit) found.push(`${term} (${kind})`);
    }
  }
  for (const [label, re] of SAMPLE_CODES) if (re.test(lean)) found.push(label);
  if (found.length) errors.push(`sample identity from the template is still in the page: ${found.join(', ')}`);
  if (/Fictional brand for a design demo/i.test(visible)) warn.push('the footer line "Fictional brand for a design demo." is still there: keep it only if the brand really is fictional');
  const domains = [...new Set(lean.match(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.example\b/gi) || [])];
  if (domains.length) warn.push(`placeholder domain(s) ${domains.join(', ')}: list them for the buyer to replace with the real domain`);
}

for (const w of warn) console.warn(`warn: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\n${errors.length} problem(s) in ${file} [${mode} mode${files ? ', local files' : ''}]`);
  process.exit(1);
}
console.log(`ok: ${file} [${mode} mode${files ? ', local files' : ''}] (${pages.size} pages, ${imgs.length} img tags, ${(bytes / 1024).toFixed(0)} KB)`);
