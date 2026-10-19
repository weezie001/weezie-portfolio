#!/usr/bin/env node
// Image library helper for deck Skills. The Skill ships a small catalog
// (references/image-library.json) of example pictures hosted online; this
// script lists them, downloads them, and inlines them into a deck so the
// finished deck stays a single offline file.
//
//   node scripts/embed-library-images.mjs --list [--any-topic] [--kind decorative]
//   node scripts/embed-library-images.mjs project.json
//       replaces every image node src="library:<id>" or CSS url(library:<id>) in project.json with
//       the verified picture as a data URI (the file is rewritten in place)
//   node scripts/embed-library-images.mjs --download <id> [<id> ...] --out <dir>
//       saves pictures to <dir>, e.g. to pass them to an image tool as style
//       references
//
// Options: --library <catalog.json> (default: ../references/image-library.json
// next to this script), --cache <dir> (default: ~/.cache/skillry-image-library).
// Every download is checked against the catalog's sha256 before use.
// Requires Node.js 20 or newer (built-in fetch). Exit code 1 on any failure.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const flag = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return false;
  args.splice(i, 1);
  return true;
};

const libraryPath = path.resolve(option('--library', path.join(here, '..', 'references', 'image-library.json')));
const cacheDir = path.resolve(option('--cache', path.join(os.homedir(), '.cache', 'skillry-image-library')));
const outDir = option('--out');
const kindFilter = option('--kind');
const list = flag('--list');
const anyTopic = flag('--any-topic');
const download = flag('--download');

if (!existsSync(libraryPath)) {
  console.error(`No image library found at ${libraryPath}.`);
  process.exit(1);
}
const library = JSON.parse(readFileSync(libraryPath, 'utf8'));
const byId = new Map(library.pictures.map((p) => [p.id, p]));
const MIME = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };

async function fetchPicture(picture) {
  const ext = path.extname(new URL(picture.url).pathname).slice(1).toLowerCase();
  const cached = path.join(cacheDir, `${picture.sha256}.${ext}`);
  if (existsSync(cached)) {
    const bytes = readFileSync(cached);
    if (createHash('sha256').update(bytes).digest('hex') === picture.sha256) return { bytes, ext, file: cached };
  }
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(picture.url, { headers: { 'User-Agent': 'skill-image-library/1.0' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const digest = createHash('sha256').update(bytes).digest('hex');
      if (digest !== picture.sha256) throw new Error('checksum mismatch');
      mkdirSync(cacheDir, { recursive: true });
      writeFileSync(cached, bytes);
      return { bytes, ext, file: cached };
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`${picture.id}: ${lastError.message} (${picture.url})`);
}

if (list) {
  const rows = library.pictures.filter(
    (p) => (!anyTopic || p.reuse === 'any-topic') && (!kindFilter || p.kind === kindFilter)
  );
  for (const p of rows) {
    const topic = p.reuse === 'any-topic' ? 'any topic' : `topic: ${p.topic || 'specific'}`;
    console.log(`${p.id}  [${p.kind}, ${p.orientation} ${p.width}x${p.height}${p.transparent ? ', transparent' : ''}; ${topic}; good for ${p.goodFor.join(', ')}]`);
    console.log(`    ${p.description}`);
  }
  console.log(`${rows.length} of ${library.pictures.length} pictures.`);
  process.exit(0);
}

if (download) {
  if (!outDir || !args.length) {
    console.error('Usage: --download <id> [<id> ...] --out <dir>');
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });
  let failed = 0;
  for (const id of args) {
    const picture = byId.get(id);
    if (!picture) { console.error(`Unknown picture id: ${id}`); failed++; continue; }
    try {
      const { bytes, ext } = await fetchPicture(picture);
      const target = path.join(outDir, `${id}.${ext}`);
      writeFileSync(target, bytes);
      console.log(target);
    } catch (error) {
      console.error(error.message);
      failed++;
    }
  }
  process.exit(failed ? 1 : 0);
}

const deckPath = args[0];
if (!deckPath) {
  console.error('Usage: embed-library-images.mjs project.json | --list | --download <id> --out <dir>');
  process.exit(1);
}
const source = readFileSync(deckPath, 'utf8');
const project = JSON.parse(source);
const exact = /^library:([a-z0-9][a-z0-9-]*)$/;
const cssPattern = /url\((["']?)library:([a-z0-9][a-z0-9-]*)\1\)/g;
const ids = new Set();
function collect(value, key = '') {
  if (typeof value === 'string') {
    const direct = key === 'src' && value.match(exact);
    if (direct) ids.add(direct[1]);
    if (key !== 'text' && key !== 'notes' && key !== 'html') for (const match of value.matchAll(cssPattern)) ids.add(match[2]);
  } else if (Array.isArray(value)) value.forEach(entry => collect(entry, key));
  else if (value && typeof value === 'object') for (const [childKey, entry] of Object.entries(value)) collect(entry, childKey);
}
collect(project);
if (!ids.size) { console.log('No library image references found; project is unchanged.'); process.exit(0); }
const dataUris = new Map();
for (const id of ids) {
  const picture = byId.get(id);
  if (!picture) throw new Error(`Unknown picture id: ${id}`);
  const { bytes, ext } = await fetchPicture(picture);
  dataUris.set(id, `data:${MIME[ext] || 'application/octet-stream'};base64,${bytes.toString('base64')}`);
}
function replace(value, key = '') {
  if (typeof value === 'string') {
    const direct = key === 'src' && value.match(exact);
    if (direct) return dataUris.get(direct[1]);
    return key === 'text' || key === 'notes' || key === 'html' ? value : value.replace(cssPattern, (_, quote, id) => `url(${dataUris.get(id)})`);
  }
  if (Array.isArray(value)) return value.map(entry => replace(entry, key));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([childKey, entry]) => [childKey, replace(entry, childKey)]));
  return value;
}
const temporary = `${deckPath}.tmp-${process.pid}`;
writeFileSync(temporary, JSON.stringify(replace(project), null, 2) + '\n');
renameSync(temporary, deckPath);
console.log(`Embedded ${ids.size} verified library picture(s) into ${deckPath}.`);
