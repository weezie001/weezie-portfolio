#!/usr/bin/env node
/**
 * Validate a page built from the Scattered-Cards Magazine Skill.
 *
 *   node scripts/validate-design.mjs path/to/index.html              # your site (default)
 *   node scripts/validate-design.mjs path/to/index.html --files      # deployed site, images/ and fonts/ beside it
 *   node scripts/validate-design.mjs references/template.html --template
 *   node scripts/validate-design.mjs path/to/store-demo.html --demo
 *
 * Modes
 *   (default)   A finished single-file site for a real brief. Strict: offline,
 *               images and fonts inlined as data URIs, no REPLACE comments,
 *               and it FAILS when the template's sample identity (the
 *               fictional Ferrow quarterly: brand, domain, people, stockists,
 *               story places, story and print titles) is still in the page.
 *   --template  (alias --allow-replace) references/template.html itself:
 *               allows REPLACE comments, requires local images/ references to
 *               exist next to the file and accepts fontsource CDN woff2 files
 *               as @font-face src only. Sample identity is expected here.
 *   --demo      The fictional store demo: strict like the default, but the
 *               sample identity is allowed because the demo is the sample.
 *   --files     With the default mode, for a deployed site that keeps its own
 *               images/, fonts/ or assets/ files beside the page: local
 *               references must exist, the size cap is not applied; remote
 *               URLs and sample leftovers still fail.
 *
 * Route names, page names, nav labels and collection sizes are the buyer's
 * own; only the structure is checked.
 *   1. No external resources (scripts, styles, images, fonts, frames, CSS url/@import);
 *      template mode allows only fontsource CDN woff2 files inside @font-face.
 *   2. Sandbox safety: no network/storage/dialog/popup/top-navigation APIs
 *      (storage is allowed only inside try/catch), forms never rely on native submit.
 *   3. No emoji or dingbat glyphs used as icons; no em or en dashes in visible text.
 *   4. No leftover placeholders or lorem ipsum.
 *   5. Router: hashchange listener, a home page, a not-found page, at least 8
 *      routed page types, every "#/..." link resolves to a static data-page or
 *      to a data-route + data-collection entry in the content JSON.
 *   6. Accessibility basics: html lang, skip link, alt on every <img>, labelled fields,
 *      :focus-visible styles, a prefers-reduced-motion block.
 *   7. Signature structures: editorial-fan (5+ cards), topic-index, editorial-hero,
 *      article-body, @font-face rules for the display and text families.
 *   8. Size budget: 8 MB hard cap (warn above 5 MB), single-file modes only.
 *   9. Sample leftovers (default mode only).
 * Exits non-zero when any error is found.
 */
import { readFileSync, statSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const template = args.includes('--template') || args.includes('--allow-replace');
const demo = args.includes('--demo') && !template;
const files = args.includes('--files') && !template;
const mode = template ? 'template' : demo ? 'demo' : 'site';
const file = args.find((a) => !a.startsWith('--'));
if (!file) { console.error('usage: node scripts/validate-design.mjs <page.html> [--template | --demo] [--files]'); process.exit(2); }
let html;
try { html = readFileSync(file, 'utf8'); } catch (err) { console.error(`cannot read ${file}: ${err.message}`); process.exit(2); }

/* The template's sample identity (Ferrow, a fictional quarterly). A buyer's
   page must not contain any of these (case-insensitive, comments and scripts
   included); the template and the store demo may. */
const SAMPLE = {
  brand: ['Ferrow', 'Ferrow Editions', 'Ferrow Letter'],
  domain: ['ferrowquarterly.com', 'instagram.com/ferrowquarterly'],
  people: ['Maren Solberg', 'Kenji Arai', 'Adaeze Okafor', 'Kofi Mensah', 'Tomás Ibarra', 'Saskia de Vries', 'Noor Haddad', 'Lena Hartwig', 'Hana Okabe', 'Matteo Lanzi', 'Elodie Brun', 'Yusuf Demir', 'Ruth Calloway', 'Giulia Rinaldi', 'Daniel Osei', 'Marta Soler', 'Lotte Brandt', 'Hélène Bellamy', 'Odile Marchand', 'Clara Weiss', 'Margarethe Lund', 'Rafael Quintas', 'Annelise Berger'],
  stockists: ['Casa Kettle', 'Halde Books', 'Kiosque Quarante', 'Tondo Libri', 'Buchladen Ferne', 'La Petite Réserve', 'Sette Pagine', 'Morrow Paper Room', 'Atelier Vos'],
  places: ['Cadaqués', 'Sóller', 'Porto Antico', 'Endoume', 'Croix-Rousse', 'Ostuni', 'Callelongue', 'Sormiou', 'Casa Ruiva', 'Via Lomellini'],
  titles: ['Clothes for an unhurried day', 'The quiet shape of a vessel', 'A room for the everyday', 'A table worth gathering around', 'A small green world', 'Inside the working studio', 'A house that listens', 'Where the land takes a breath', 'Olive shadow print', 'The coast from above', 'Salt & Stone'],
  slugs: ['olive-print', 'coast-print'],
  homeCity: ['Marseille'],
};

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);
const noData = html.replace(/data:[a-z0-9.+/-]+;base64,[A-Za-z0-9+/=]+/gi, 'data:');
const scripts = [...noData.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
const styles = [...noData.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');

/* 1. external resources ---------------------------------------------------- */
// Template mode: fontsource CDN woff2 files are the one allowed remote source,
// and only as the src of an @font-face rule. Self-contained pages stay strict.
const FONT_CDN = /url\(\s*["']?https:\/\/cdn\.jsdelivr\.net\/fontsource\/fonts\/[\w.:@\/-]+\.woff2["']?\s*\)/g;
const fontFaces = (s) => s.match(/@font-face\s*\{[^}]*\}/gi) || [];
const remoteFace = fontFaces(styles).find((b) => /url\(\s*["']?(https?:)?\/\//i.test(b));
if (!template && remoteFace) err(`remote @font-face src (${(remoteFace.match(/url\(([^)]*)\)/) || [])[1]}): ${files ? 'download the woff2 into fonts/ beside the page and point src at it' : 'build with scripts/inline-assets.mjs (it downloads the fontsource woff2 files once and embeds them)'}`);
/* template: CDN fonts are allowed; other modes: a remote @font-face is reported once above */
const allowCdnFonts = (s) => (template ? s.replace(/@font-face\s*\{[^}]*\}/gi, (b) => b.replace(FONT_CDN, 'url(cdn-font)')) : remoteFace ? s.replace(/@font-face\s*\{[^}]*\}/gi, '') : s);
for (const m of noData.matchAll(/<(script|link|img|source|iframe|video|audio|embed|object)\b[^>]*\b(?:src|href|srcset|data)\s*=\s*["']\s*(https?:)?\/\/[^"']*/gi)) err(`external resource in <${m[1]}>: ${m[0].slice(0, 120)}`);
if (/url\(\s*["']?(https?:)?\/\//i.test(allowCdnFonts(styles + noData.replace(/<script[\s\S]*?<\/script>/gi, '')))) err(template ? 'CSS url() loads a remote asset (only fontsource CDN woff2 files inside @font-face are allowed)' : 'CSS url() loads a remote asset');
if (/@import\s+(url\()?\s*["']?(https?:)?\/\//i.test(noData)) err('remote CSS @import');
for (const m of noData.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) err(`external <script src="${m[1]}"> - inline all JS`);
for (const m of noData.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)) err(`external stylesheet ${m[0].slice(0, 100)} - inline all CSS`);

/* 2. sandbox safety ---------------------------------------------------------- */
const apis = [['fetch(', 'network'], ['XMLHttpRequest', 'network'], ['WebSocket', 'network'], ['navigator.sendBeacon', 'network'], ['indexedDB', 'storage'], ['document.cookie', 'storage'], ['window.open(', 'popup'], ['alert(', 'dialog'], ['confirm(', 'dialog'], ['prompt(', 'dialog'], ['top.location', 'top navigation'], ['parent.location', 'top navigation']];
for (const [api, kind] of apis) if (scripts.includes(api)) err(`${kind} API not allowed in a sandboxed demo: ${api}`);
for (const api of ['localStorage', 'sessionStorage']) {
  let i = scripts.indexOf(api);
  while (i >= 0) {
    if (!/try\s*\{[^}]*$/.test(scripts.slice(Math.max(0, i - 160), i))) { err(`${api} used outside try/catch (sandboxed iframes throw)`); break; }
    i = scripts.indexOf(api, i + 1);
  }
}
if (/target\s*=\s*["']_(top|parent|blank)["']/i.test(noData)) err('target="_top/_parent/_blank" is blocked in the sandbox; intercept the click instead');
for (const f of noData.matchAll(/<form\b[\s\S]*?<\/form>/gi)) {
  if (/<button(?![^>]*type=["']button["'])[^>]*>/i.test(f[0]) || /type=["']submit["']/i.test(f[0])) err(`form relies on native submit (blocked without allow-forms): ${f[0].slice(0, 80)}`);
}

/* 3. icons and typography ------------------------------------------------- */
const visible = noData.replace(/<!--[\s\S]*?-->/g, '').replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
const emojiRe = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}\u{25A0}-\u{25FF}\u{2700}-\u{27BF}]/u;
const em = visible.match(emojiRe);
if (em) err(`emoji/dingbat character U+${em[0].codePointAt(0).toString(16).toUpperCase()} - use an inline SVG icon`);
if (/[—–]/.test(visible)) err('em or en dash in visible text - use a comma, a colon or a hyphen');
if (/font-family\s*:[^;]*(font\s*awesome|material\s*icons|icomoon|ionicons)/i.test(styles)) err('icon fonts are not allowed');

/* 4. placeholders ------------------------------------------------------------ */
if (!template && /<!--\s*REPLACE:|\/\*\s*REPLACE:/.test(noData)) err('leftover REPLACE comment (<!-- REPLACE: --> or /* REPLACE: */): fill the slot and delete the comment');
if (/\{\{img:[\w-]+\}\}/.test(html)) err('leftover {{img:...}} token');
if (/lorem ipsum/i.test(html)) err('lorem ipsum copy');
if (/Best AI Skills/i.test(visible)) err('vendor badge text found; the site must look like the customer\'s own');

/* 5. router -------------------------------------------------------------------- */
if (!/hashchange/.test(scripts)) err('no hash router (expected a hashchange listener)');
const sections = [...noData.matchAll(/<section\b[^>]*\bdata-page\s*=\s*["']([^"']+)["'][^>]*>/gi)].map((m) => ({ page: m[1], tag: m[0] }));
const staticPages = new Set(sections.filter((s) => !/data-route=/.test(s.tag)).map((s) => s.page));
const dynamic = sections.filter((s) => /data-route=/.test(s.tag)).map((s) => ({ page: s.page, route: (s.tag.match(/data-route=["']([^"']+)["']/) || [])[1], coll: (s.tag.match(/data-collection=["']([^"']+)["']/) || [])[1] }));
if (staticPages.size + dynamic.length < 8) err(`expected at least 8 routed pages, found ${staticPages.size + dynamic.length}`);
if (!staticPages.has('home')) err('missing the front page (data-page="home"); the router falls back to it for "#/"');
if (!staticPages.has('not-found')) err('missing a designed not-found page (data-page="not-found")');
let content = {};
const cm = noData.match(/<script[^>]*type=["']application\/json["'][^>]*id=["']content["'][^>]*>([\s\S]*?)<\/script>/i) || noData.match(/<script[^>]*id=["']content["'][^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/i);
if (cm) { try { content = JSON.parse(cm[1]); } catch (e) { err('content JSON does not parse: ' + e.message); } }
else if (dynamic.length) err('dynamic routes need a <script type="application/json" id="content"> collection');
const pathOf = { '': 'home' };
const linked = new Set();
const hrefs = [...noData.matchAll(/href\s*=\s*["']#\/([^"'#?]*)["']/g)].map((m) => m[1]).filter((h) => !h.includes('${'));
for (const raw of new Set(hrefs)) {
  const h = raw.replace(/\/$/, '');
  if (h === '') { if (!staticPages.has('home')) err('link "#/" but no data-page="home"'); linked.add('home'); continue; }
  if (staticPages.has(h)) { linked.add(h); continue; }
  const [a, b, ...rest] = h.split('/');
  const d = !rest.length && b ? dynamic.find((x) => x.route === `${a}/:slug`) : null;
  if (d && Array.isArray(content[d.coll]) && content[d.coll].some((e) => e.slug === b)) { linked.add(d.page); continue; }
  err(`link "#/${raw}" resolves to no page`);
}
for (const p of staticPages) if (!['home', 'not-found'].includes(p) && !linked.has(p) && !scripts.includes(`'${p}'`)) warn(`page "${p}" is not linked from any static link`);
for (const d of dynamic) {
  if (!d.coll || !Array.isArray(content[d.coll]) || !content[d.coll].length) err(`dynamic page "${d.page}" has no data-collection entries`);
  if (!scripts.includes(`#/${d.route.split('/')[0]}/`)) warn(`no template link to ${d.route}`);
}

/* 6. accessibility basics ------------------------------------------------------ */
if (!/<html[^>]*\blang=/.test(noData)) err('<html> has no lang attribute');
if (!/class=["'][^"']*\bskip\b/.test(noData)) err('no skip link');
const imgs = [...noData.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
const noAlt = imgs.filter((t) => !/\balt\s*=/.test(t));
if (noAlt.length) err(`${noAlt.length} <img> without alt (e.g. ${noAlt[0].slice(0, 80)})`);
const tplImgs = (scripts.match(/<img\b[^`]*?>/g) || []).filter((t) => !/\balt\s*=/.test(t));
if (tplImgs.length) err(`${tplImgs.length} script-rendered <img> without alt`);
for (const m of noData.matchAll(/<(input|select|textarea)\b[^>]*\bid=["']([^"']+)["'][^>]*>/gi)) {
  const id = m[2];
  if (/type=["'](hidden|radio|checkbox)["']/.test(m[0])) continue;
  if (!new RegExp(`for=["']${id}["']`).test(noData) && !/aria-label=/.test(m[0])) err(`field #${id} has no <label for> or aria-label`);
}
if (!/:focus-visible/.test(styles)) err('no :focus-visible styles');
if (!/prefers-reduced-motion\s*:\s*reduce/.test(styles)) err('no @media (prefers-reduced-motion: reduce) block');
if (!/<meta[^>]+name=["']description["']/i.test(noData)) warn('no meta description');
for (const s of sections.filter((x) => !/data-route=/.test(x.tag))) {
  const start = noData.indexOf(s.tag);
  const ends = [noData.indexOf('<section class="page"', start + 10), noData.indexOf('</main>', start)].filter((x) => x > 0);
  const body = noData.slice(start, ends.length ? Math.min(...ends) : undefined);
  const n = (body.match(/<h1\b/g) || []).length;
  if (n !== 1) warn(`page "${s.page}" has ${n} <h1> elements (expected 1)`);
}

/* 7. signature structures ------------------------------------------------------ */
const fanCards = (noData.match(/class=["'][^"']*\bfan-card\b/g) || []).length;
const checks = [
  ['editorial-fan', /\beditorial-fan\b/],
  ['topic-index', /\btopic-index\b/],
  ['editorial-hero', /\beditorial-hero\b/],
  ['article-body', /\barticle-body\b/],
];
for (const [label, re] of checks) if (!re.test(noData)) err(`missing signature structure: ${label}`);
if (fanCards < 5) err(`the editorial fan needs at least 5 rotated cards, found ${fanCards}`);
if (!/@font-face/.test(styles)) err('no @font-face rules for the display and text families');

/* local assets ----------------------------------------------------------------- */
const local = [...new Set([...noData.matchAll(/["'(]((?:\.\/)?(?:images|fonts|assets)\/[\w./-]+\.(?:webp|png|jpe?g|avif|svg|woff2?))["')]/g)].map((m) => m[1]))];
if (template || files) {
  const base = dirname(resolve(file));
  for (const p of local) if (!existsSync(resolve(base, p))) err(`page references missing asset ${p}`);
} else if (local.length) err(`${local.length} local asset references remain (e.g. ${local[0]}): build the single file with scripts/inline-assets.mjs, or validate a deployed site with --files`);

/* 8. size ------------------------------------------------------------------------ */
const bytes = statSync(file).size;
if (!template && !files && bytes > 8 * 1048576) err(`file is ${(bytes / 1048576).toFixed(2)} MB (hard cap 8 MB)`);
else if (!template && !files && bytes > 5 * 1048576) warn(`file is ${(bytes / 1048576).toFixed(2)} MB (target 5 MB)`);

/* 9. sample leftovers ------------------------------------------------------------ */
if (mode === 'site') {
  const decode = (t) => t
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z])(acute|grave|circ|uml|tilde|cedil);/gi, (m, l, k) => (l + { acute: '\u0301', grave: '\u0300', circ: '\u0302', uml: '\u0308', tilde: '\u0303', cedil: '\u0327' }[k.toLowerCase()]).normalize('NFC'))
    .replace(/&rsquo;|&lsquo;|&apos;|’/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  const text = decode(noData).normalize('NFC').replace(/\s+/g, ' ').toLowerCase();
  const found = [];
  for (const [kind, terms] of Object.entries(SAMPLE)) {
    if (kind === 'slugs' || kind === 'homeCity') continue;
    for (const term of terms) if (text.includes(term.toLowerCase())) found.push(`${term} (${kind})`);
  }
  const slugs = new Set([...hrefs.flatMap((h) => h.split('/')), ...Object.values(content).flatMap((v) => (Array.isArray(v) ? v.map((e) => e && e.slug) : []))]);
  for (const s of SAMPLE.slugs) if (slugs.has(s)) found.push(`${s} (slugs)`);
  if (found.length) err(`sample identity from the template is still in the page: ${found.join(', ')}`);
  for (const c of SAMPLE.homeCity) if (text.includes(c.toLowerCase())) warn(`"${c}" (the sample's home city, in delivery and about copy) appears: confirm the business is really based there`);
  const domains = [...new Set(noData.match(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.example\b/gi) || [])];
  if (domains.length) warn(`placeholder domain(s) ${domains.join(', ')}: list them for the buyer to replace with the real domain`);
}

for (const w of warns) console.warn(`warn: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\n${errors.length} problem(s) in ${file} [${mode} mode${files ? ', local files' : ''}]`);
  process.exit(1);
}
console.log(`ok: ${file} [${mode} mode${files ? ', local files' : ''}] (${staticPages.size} static + ${dynamic.length} templated page types, ${hrefs.length} route links, ${fanCards} fan cards, ${(bytes / 1024).toFixed(0)} KB)`);
