#!/usr/bin/env node
/**
 * Validate a beacon SaaS site built from this Skill.
 *
 *   node scripts/validate-landing.mjs path/to/index.html               # your site (default)
 *   node scripts/validate-landing.mjs path/to/index.html --files       # deployed, files beside the page
 *   node scripts/validate-landing.mjs references/template.html --template
 *   node scripts/validate-landing.mjs path/to/store-demo.html --demo
 *
 * Modes
 *   (default)   A finished single-file site for a real brief. Strict: offline,
 *               every image and font embedded as a data: URI, and it FAILS when
 *               the template's sample identity is still in the page (brand,
 *               people, customer companies, addresses, file slugs).
 *   --files     With the default mode, for a deployed site that keeps its
 *               images and fonts as files beside the page (images/, fonts/,
 *               assets/): those references must exist on disk; remote URLs
 *               and sample leftovers still fail; network APIs only warn.
 *   --template  references/template.html itself: allows relative images/ and
 *               fonts/ references that are not on disk, and fontsource CDN
 *               woff2 files inside @font-face src only. Sample identity is
 *               expected here.
 *   --demo      The fictional store demo: strict like the default, but the
 *               sample identity is allowed because the demo is the sample.
 *
 * Nothing from the sample product is required: no route name, section id,
 * heading, plan name or count. Checks:
 *   1. Remote resources: http(s) src/href/url()/@import, <script src>, CDNs.
 *   2. Sandbox-hostile APIs (fetch, XHR, WebSocket, sendBeacon, EventSource;
 *      warnings only with --files), dialogs, window.open, top navigation, and
 *      storage outside try/catch.
 *   3. Emoji or Unicode dingbats anywhere (icons must be inline SVG).
 *   4. Leftover REPLACE / lorem placeholders.
 *   5. <img> without alt or width/height.
 *   6. Style structure: header/nav/main/footer, skip link, hero, the beam,
 *      gradient headings, theme toggle + .dark tokens, design tokens, guarded
 *      IntersectionObserver reveal, reduced-motion block, :focus-visible,
 *      @font-face.
 *   7. Site structure: if the page has a hash router (var ROUTES), every
 *      route's view exists, a "404" view exists, every #/ link resolves to a
 *      route, at least one route besides home carries a form; every #anchor
 *      link and every <use href="#..."> / icon('...') resolves; exactly one
 *      <h1> per view; the home view has at least five <section>s; 1 to 4
 *      pricing plans with a .plans grid that matches the count; labelled
 *      form controls.
 *   8. Size over 8 MB (warns over 5 MB).
 *   9. Sample leftovers (default and --files only).
 * Warns on: em/en dashes in visible text, missing meta description / OG tags,
 * placeholder domains, logo-row columns that do not match LOGOS.
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const templateMode = args.includes("--template");
const demoMode = args.includes("--demo") && !templateMode;
const filesMode = args.includes("--files") && !templateMode;
const mode = templateMode ? "template" : demoMode ? "demo" : "site";
if (!file) {
  console.error("usage: node scripts/validate-landing.mjs <page.html> [--template | --demo] [--files]");
  process.exit(2);
}
let html;
try { html = readFileSync(file, "utf8"); } catch (err) { console.error(`cannot read ${file}: ${err.message}`); process.exit(2); }

/* The template's sample identity (Pulsegrid, fictional). A buyer's page must
   not contain any of these (case-insensitive, comments and scripts count);
   the store demo and the template may. */
const SAMPLE = {
  brand: ["Pulsegrid"],
  people: [
    "Maya Okafor", "Jonas Lindgren", "Ravi Pillai", "Hiroko Tanabe", "Dan Whitcombe", "Adaeze Nwosu",
    "Tomasz Wierzbicki", "Kenji Hayashida", "Marisol Echeverria", "Rhys Talbot", "Priya Raghunathan",
    "Olumide Bankole", "Hanna Lindqvist", "Diego Ferraz", "Yu-Ting Liao",
  ],
  customers: ["Norvane", "Quillory", "Fernhold", "Oslero", "Tidewell", "Marisco", "Halden Rail", "Ardenne Labs", "Corvid Freight"],
  address: ["Keizersgracht 241", "188 Spadina Ave"],
  slugs: ["story-adaeze"],
  firstNames: ["Maya", "Adaeze", "Jonas", "Hiroko"],
};

const errors = [];
const warns = [];
const fail = (m) => errors.push(m);
const warn = (m) => warns.push(m);

/* strip data: URIs so base64 payloads never trigger text checks */
const lean = html.replace(/data:[a-z0-9.+\/-]+;base64,[A-Za-z0-9+/=]+/gi, "data:inlined");
const scripts = [...lean.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join("\n");
const styles = [...lean.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
const markup = lean.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ");
const markupNoComments = markup.replace(/<!--[\s\S]*?-->/g, " ");
const visibleText = markupNoComments.replace(/<[^>]+>/g, " ");

/* 1. remote resources
   Template mode: fontsource CDN font files inside @font-face src are the one
   allowed host. Any other host, or the same host anywhere else, still fails. */
const CDN_FONT = /url\(\s*(["']?)https:\/\/cdn\.jsdelivr\.net\/fontsource\/fonts\/[^)"'\s]+\.woff2\1\s*\)/g;
const net = templateMode ? lean.replace(/@font-face\s*\{[^}]*\}/g, (block) => block.replace(CDN_FONT, "url()")) : lean;
const netStyles = [...net.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
if (!templateMode && /@font-face\s*\{[^}]*(?:https?:)?\/\/[^}]*\}/.test(styles)) {
  fail(filesMode
    ? "@font-face loads a remote font file; download the Geist and Geist Mono woff2 files into fonts/ beside the page and point src at them"
    : "@font-face loads a remote font file; run scripts/inline-assets.mjs to embed it as a data URI");
}
for (const m of net.matchAll(/(?<![\w-])(?:src|href|poster|action|srcset)\s*=\s*["'](https?:)?\/\/[^"']+["']/gi)) fail(`external reference not allowed: ${m[0].slice(0, 120)}`);
if (/url\(\s*["']?(https?:)?\/\//i.test(netStyles)) fail("CSS url() references a remote asset");
if (/@import\s+(url\()?\s*["']?(https?:)?\/\//i.test(netStyles)) fail("remote CSS @import is not allowed");
if (/<script[^>]+\bsrc\s*=/i.test(lean)) fail("external <script src> is not allowed; inline all JS");
if (/<link[^>]+rel=["']?(?:stylesheet|preload|preconnect|dns-prefetch)/i.test(lean)) fail("external <link> (stylesheet/preload/preconnect) is not allowed; inline all CSS");
if (/fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|unpkg\.com|cdnjs/i.test(net)) fail("CDN or Google Fonts reference found; embed fonts and assets as data URIs (scripts/inline-assets.mjs)");

/* 1b. local assets: inlined (default/demo) or present beside the page (--files) */
if (!templateMode) {
  const base = dirname(resolve(file));
  for (const m of lean.matchAll(/["'(]((?:\.\/)?(?:images|assets|fonts)\/[A-Za-z0-9._\/-]+\.(?:webp|png|jpe?g|svg|avif|gif|woff2?|mp4))["')]/g)) {
    if (filesMode) { if (!existsSync(resolve(base, m[1]))) fail(`local asset not found beside the page: ${m[1]}`); }
    else fail(`asset not inlined: ${m[1]} (build with scripts/inline-assets.mjs, or pass --files for a deployed site that keeps its files)`);
  }
}

/* 2. sandbox-hostile APIs */
/* --files is a deployed site, not a sandboxed preview: a real form endpoint may
   use fetch/XHR there, so network APIs only warn; dialogs and top navigation
   still fail everywhere. */
for (const api of ["fetch(", "XMLHttpRequest", "WebSocket", "navigator.sendBeacon", "EventSource"]) {
  if (scripts.includes(api)) (filesMode ? warn : fail)(filesMode ? `${api} found: fine for a deployed site, but the page will not work as a sandboxed single-file preview` : `not allowed in a sandboxed page: ${api}`);
}
for (const api of ["window.open(", "alert(", "confirm(", "prompt(", "top.location", "parent.location"]) {
  if (scripts.includes(api)) fail(`not allowed: ${api} (use inline states and toasts)`);
}
for (const api of ["localStorage", "sessionStorage", "indexedDB", "document.cookie"]) {
  let idx = scripts.indexOf(api);
  while (idx !== -1) {
    const before = scripts.slice(Math.max(0, idx - 90), idx);
    if (!/try\s*\{[^}]*$/.test(before)) { fail(`${api} must be wrapped in try/catch with an in-memory fallback`); break; }
    idx = scripts.indexOf(api, idx + api.length);
  }
}

/* 3. emoji and dingbats (icons are inline SVG) */
const emojiRe = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{FE0F}\u{2713}\u{2714}\u{2716}\u{2605}\u{2606}\u{2731}\u{2726}\u{2727}]/u;
const emojiHit = lean.match(emojiRe);
if (emojiHit) fail(`emoji/dingbat character found ("${emojiHit[0]}" U+${emojiHit[0].codePointAt(0).toString(16).toUpperCase()}); use an inline Lucide SVG`);

/* 4. placeholders */
if (/\bREPLACE\b/.test(lean)) fail("leftover REPLACE placeholder");
if (/lorem ipsum|your company|jane doe|john doe/i.test(visibleText + scripts)) fail("placeholder copy found (lorem ipsum / Your Company / Jane Doe)");

/* 5. images */
const imgs = [...lean.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
imgs.forEach((tag, i) => {
  if (!/\balt\s*=/.test(tag)) fail(`<img> #${i + 1} has no alt attribute`);
  if (!/\bwidth\s*=/.test(tag) || !/\bheight\s*=/.test(tag)) fail(`<img> #${i + 1} needs width and height (or an aspect-ratio box) to avoid layout shift`);
  if (!/\bdecoding\s*=\s*["']async/.test(tag)) warn(`<img> #${i + 1} should use decoding="async"`);
});
for (const m of scripts.matchAll(/<img\b[^>]*>/gi)) if (!/\balt\s*=/.test(m[0])) fail("an <img> rendered from script has no alt attribute");

/* 6. style structure (the beacon grammar, not the sample's content) */
const need = [
  [/<header\b/i, "<header> landmark"],
  [/<nav\b/i, "<nav> landmark"],
  [/<main\b/i, "<main> landmark"],
  [/<footer\b/i, "<footer> landmark"],
  [/class=["'][^"']*\bskip-link\b/, "skip link (.skip-link)"],
  [/class=["'][^"']*\bhero\b/, "hero section (.hero)"],
  [/class=["'][^"']*\bbeam\b/, "the beacon beam (.beam)"],
  [/grad-h1/, "gradient H1 (.grad-h1)"],
  [/grad-h2/, "gradient section headings (.grad-h2)"],
  [/id=["']theme["']/, "theme toggle button (#theme)"],
  [/\.dark\s*\{/, "dark-theme token block (html.dark { ... })"],
  [/--beam\s*:/, "design token --beam"],
  [/--accent\s*:/, "design token --accent"],
  [/IntersectionObserver/, "scroll-reveal system (IntersectionObserver)"],
  [/classList\.add\(\s*['"]js['"]\s*\)/, "head script adding .js (reveal styles must only apply when JS runs)"],
  [/prefers-reduced-motion\s*:\s*reduce/, "@media (prefers-reduced-motion: reduce) block"],
  [/:focus-visible/, ":focus-visible styles"],
  [/@font-face/, "@font-face (Geist / Geist Mono)"],
  [/name=["']viewport["']/, "viewport meta"],
  [/<title>[^<]{8,}<\/title>/, "a real <title>"],
];
for (const [re, label] of need) if (!re.test(lean)) fail(`missing required structure: ${label}`);
if (/\.js\s+\.rv\s*\{[^}]*opacity\s*:\s*0/.test(styles) === false && /\.rv\s*\{[^}]*opacity\s*:\s*0/.test(styles)) fail("reveal styles hide content without the .js guard (.js .rv)");
if (/\.woff2/.test(lean) === false && /data:font\/woff2|data:inlined/.test(lean) === false) warn("no woff2 font found; embed Geist and Geist Mono");

/* 7. site structure */
const ids = new Set([...markupNoComments.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]));
/* views: <... data-view="name"> blocks, each until the next view or the footer */
const viewStarts = [...markupNoComments.matchAll(/<[a-z]+\b[^>]*\bdata-view\s*=\s*["']([^"']+)["']/gi)].map((m) => ({ name: m[1], at: m.index }));
const footAt = markupNoComments.search(/<footer\b/i);
const viewHtml = new Map();
viewStarts.forEach((v, i) => {
  const end = i + 1 < viewStarts.length ? viewStarts[i + 1].at : footAt > v.at ? footAt : markupNoComments.length;
  viewHtml.set(v.name, markupNoComments.slice(v.at, end));
});
const h1s = (markupNoComments.match(/<h1\b/gi) || []).length;
if (h1s === 0) fail("no <h1> found");
else if (!viewStarts.length && h1s > 1) fail(`${h1s} <h1> elements on a single-view page; use exactly one`);
for (const [name, part] of viewHtml) {
  const n = (part.match(/<h1\b/gi) || []).length;
  if (n !== 1) fail(`view "${name}" has ${n} <h1> elements; each view needs exactly one`);
}
const homeHtml = viewHtml.get("home") ?? (viewStarts.length ? "" : markupNoComments);
const homeSections = (homeHtml.match(/<section\b/gi) || []).length;
if (homeSections < 5) fail(`the home page has ${homeSections} <section> elements; a beacon landing needs at least five (hero plus four from the section library)`);

/* router: var ROUTES = { key: { view: '...' } } */
const routesBlock = (scripts.match(/var\s+ROUTES\s*=\s*\{([\s\S]*?)\n\s*\};/) || [])[1];
const routes = new Map();
if (routesBlock) {
  for (const m of routesBlock.matchAll(/^\s*(?:'([^']*)'|"([^"]*)"|([A-Za-z0-9_$-]+))\s*:\s*\{\s*view\s*:\s*['"]([^'"]+)['"]/gm)) routes.set(m[1] ?? m[2] ?? m[3], m[4]);
  if (!routes.has("")) fail("ROUTES has no home route ('')");
  for (const [r, v] of routes) if (!viewHtml.has(v)) fail(`route "${r || "home"}" points at view "${v}", but no element has data-view="${v}"`);
  if (!viewHtml.has("404")) fail('no not-found view (data-view="404") for unknown routes');
  const formRoute = [...routes].some(([r, v]) => r !== "" && /<form\b/i.test(viewHtml.get(v) || ""));
  if (!formRoute) fail("no route besides home carries a form (sign-up, contact or trial); the Skill ships at least one");
  const routeLinks = new Set();
  for (const m of markupNoComments.matchAll(/href\s*=\s*["']#\/([^"'?#]*)/g)) routeLinks.add(m[1].replace(/\/$/, ""));
  for (const m of scripts.matchAll(/['"]#\/([A-Za-z0-9_\/-]*)(?:\?[^'"]*)?['"]/g)) routeLinks.add(m[1].replace(/\/$/, ""));
  for (const r of routeLinks) if (!routes.has(r)) fail(`link to #/${r} does not match any route in ROUTES (it would show the 404 page)`);
} else if (/href\s*=\s*["']#\//.test(markupNoComments)) {
  fail("the page links to #/ routes but has no ROUTES table; keep the template's hash router");
}
/* in-page anchors and icon references */
for (const m of markupNoComments.matchAll(/<a\b[^>]*\shref\s*=\s*["']#([A-Za-z][\w:.-]*)["']/gi)) if (!ids.has(m[1])) fail(`link to #${m[1]} has no element with id="${m[1]}"`);
if (/<a\b[^>]*\shref\s*=\s*["']#["']/i.test(markupNoComments)) fail('href="#" found; every link must reach a section or a route');
const symbols = new Set([...lean.matchAll(/<symbol\b[^>]*\bid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]));
for (const m of markupNoComments.matchAll(/<use\b[^>]*href\s*=\s*["']#([^"']+)["']/gi)) if (!symbols.has(m[1]) && !ids.has(m[1])) fail(`<use href="#${m[1]}"> has no matching <symbol>`);
for (const m of scripts.matchAll(/\bicon\(\s*['"]([a-z0-9-]+)['"]/g)) if (!symbols.has(`i-${m[1]}`)) fail(`icon('${m[1]}') has no <symbol id="i-${m[1]}">`);
for (const m of scripts.matchAll(/<use href="#([a-z0-9-]+)"/g)) if (!symbols.has(m[1])) fail(`script renders <use href="#${m[1]}"> but no such <symbol> exists`);

/* pricing: 1 to 4 plans, and the .plans grid must match the count */
const plans = (homeHtml.match(/<article\b[^>]*class\s*=\s*["'][^"']*\bplan\b/gi) || []).length;
if (plans > 4) fail(`${plans} pricing plans; the beacon pricing grid holds 2 to 4 (move the rest to the Enterprise row or the comparison table)`);
if (plans === 1) warn("a single pricing plan: consider the Enterprise row layout instead of a one-card grid");
const plansCols = (styles.match(/\.plans\s*\{[^}]*grid-template-columns\s*:\s*repeat\(\s*(\d+)/) || [])[1];
if (plans >= 2 && plansCols && Number(plansCols) !== plans) fail(`.plans grid has repeat(${plansCols}, ...) but the page has ${plans} plans; set it to repeat(${plans}, minmax(0, 1fr))`);
const logosBlock = (scripts.match(/var\s+LOGOS\s*=\s*\[([\s\S]*?)\];/) || [])[1];
const logoCols = (styles.match(/\.logo-row\s*\{[^}]*repeat\(\s*(\d+)/) || [])[1];
if (logosBlock && logoCols) {
  const n = (logosBlock.match(/\bname\s*:/g) || []).length;
  if (n && n !== Number(logoCols)) warn(`LOGOS has ${n} entries but .logo-row uses repeat(${logoCols}, ...); match the column count to the logos`);
}

/* labelled form controls */
const labelFor = new Set([...markupNoComments.matchAll(/<label\b[^>]*\bfor\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]));
const labelSpans = [...markupNoComments.matchAll(/<label\b[\s\S]*?<\/label>/gi)].map((m) => [m.index, m.index + m[0].length]);
for (const m of markupNoComments.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
  const tag = m[0];
  if (/\btype\s*=\s*["']?(hidden|submit|button|reset)\b/i.test(tag)) continue;
  if (/\baria-label(ledby)?\s*=/.test(tag)) continue;
  const id = (tag.match(/\bid\s*=\s*["']([^"']+)["']/) || [])[1];
  if (id && labelFor.has(id)) continue;
  if (labelSpans.some(([a, b]) => m.index > a && m.index < b)) continue;
  fail(`form control without a label: ${tag.slice(0, 90)}`);
}

/* soft checks */
if (!/name=["']description["']/.test(lean)) warn("missing <meta name=\"description\">");
if (!/property=["']og:title["']/.test(lean)) warn("missing Open Graph tags");
if (!/rel=["']icon["']/.test(lean)) warn("missing inline SVG favicon");
const dash = visibleText.match(/[—–]/);
if (dash) warn("em/en dash in visible copy; prefer a period, comma or colon");

/* 8. size */
const bytes = statSync(file).size;
if (bytes > 8 * 1048576) fail(`file is ${(bytes / 1048576).toFixed(2)} MB; the hard cap is 8 MB`);
else if (bytes > 5 * 1048576) warn(`file is ${(bytes / 1048576).toFixed(2)} MB; target is 5 MB or less`);

/* 9. sample leftovers (a buyer's page must not ship the template's identity) */
if (mode === "site") {
  const text = lean.replace(/&amp;/g, "&").replace(/&nbsp;|\s+/g, " ").toLowerCase();
  const found = [];
  for (const [kind, terms] of Object.entries(SAMPLE)) {
    if (kind === "firstNames") continue;
    for (const term of terms) if (text.includes(term.toLowerCase())) found.push(`${term} (${kind})`);
  }
  if (found.length) fail(`sample identity from the template is still in the page: ${found.join(", ")}`);
  const visText = visibleText + " " + scripts;
  for (const n of SAMPLE.firstNames) if (new RegExp(`\\b${n}\\b`).test(visText)) warn(`sample first name "${n}" appears: confirm it is a real person from this brief`);
  const claims = [...new Set((visibleText.match(/SOC ?2(?: Type I{1,2})?|ISO ?27001|HIPAA|PCI[ -]DSS|FedRAMP|GDPR[- ]compliant/gi) || []).map((s) => s.trim()))];
  if (claims.length) warn(`compliance claim(s) ${claims.join(", ")}: keep only what the user confirmed, and list them in the reply`);
  const domains = [...new Set(lean.match(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.example(?:\.(?:com|org|net))?\b/gi) || [])];
  if (domains.length) warn(`placeholder domain(s) ${domains.join(", ")}: list them for the buyer to replace with the real domain`);
}

for (const w of warns) console.warn(`warn: ${w}`);
const label = `${mode} mode${filesMode ? ", local files" : ""}`;
if (errors.length) {
  for (const e of errors) console.error(`fail: ${e}`);
  console.error(`\n${errors.length} check(s) failed for ${file} [${label}]`);
  process.exit(1);
}
console.log(`ok: ${file} passes all beacon checks [${label}] [${(bytes / 1048576).toFixed(2)} MB, ${imgs.length} img tags, ${viewStarts.length || 1} view(s), ${routes.size} routes]`);
