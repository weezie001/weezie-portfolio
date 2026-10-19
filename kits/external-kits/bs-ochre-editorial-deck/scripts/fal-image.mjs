#!/usr/bin/env node
/**
 * Submit, inspect, and fetch one paid FAL image task without automatic retries.
 * The request id is written to the task file immediately after submission.
 * Only FAL_KEY is read; no other image provider credential is supported.
 *
 *   node scripts/fal-image.mjs submit --prompt-file p.txt --task t.json [--aspect 3:4] [--reference ref.webp,...]
 *   node scripts/fal-image.mjs status --task t.json
 *   node scripts/fal-image.mjs fetch  --task t.json --out-dir img --prefix cover
 */
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';

const MODEL_ID = 'fal-ai/gpt-image-2';
const EDIT_MODEL_ID = 'openai/gpt-image-2/edit';
const PRESETS = {
  '1:1': 'square_hd',
  '4:3': 'landscape_4_3',
  '16:9': 'landscape_16_9',
  '3:4': 'portrait_4_3',
  '9:16': 'portrait_16_9',
};
const command = process.argv[2];
const flags = parseFlags(process.argv.slice(3));

if (!['submit', 'status', 'fetch'].includes(command)) {
  fail('Usage: node fal-image.mjs <submit|status|fetch> [flags]');
}

const credentials = process.env.FAL_KEY;
if (!credentials) fail('FAL_KEY is required.');

try {
  if (command === 'submit') await submitTask();
  if (command === 'status') await readStatus();
  if (command === 'fetch') await fetchResult();
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  fail(`Operation failed; no retry was attempted. ${detail}`);
}

async function submitTask() {
  const promptPath = requiredFlag('prompt-file');
  const taskPath = requiredFlag('task');
  const prompt = readFileSync(promptPath, 'utf8').trim();
  if (!prompt) fail('Prompt file is empty.');

  const numImages = integerFlag('num-images', 1, 1, 4);
  const quality = enumFlag('quality', ['low', 'medium', 'high', 'auto'], 'medium');
  const imageSize = flags.size || sizeForAspect(flags.aspect || '16:9');
  const references = (flags.reference || '').split(',').filter(Boolean).map(dataUrl);
  const modelId = references.length ? EDIT_MODEL_ID : MODEL_ID;
  const queueBase = `https://queue.fal.run/${modelId}`;
  const input = {
    prompt,
    image_size: imageSize,
    quality,
    num_images: numImages,
    output_format: 'webp',
  };
  if (references.length) input.image_urls = references;

  const response = await falRequest(queueBase, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  const requestId = response.request_id;
  if (!requestId) fail('FAL did not return a request_id; no retry was attempted.');

  const task = {
    schemaVersion: 1,
    modelId,
    requestId,
    statusUrl:
      response.status_url || `${queueBase}/requests/${requestId}/status`,
    responseUrl: response.response_url || `${queueBase}/requests/${requestId}`,
    submittedAt: new Date().toISOString(),
    promptFile: resolve(promptPath),
    promptSha256: createHash('sha256').update(prompt).digest('hex'),
    input: { imageSize, quality, numImages, outputFormat: 'webp', references: references.length },
    providerResponse: response,
  };
  writeJsonAtomic(taskPath, task);
  console.log(`Submitted once. Request id saved to ${resolve(taskPath)}.`);
}

async function readStatus() {
  const taskPath = requiredFlag('task');
  const task = readJson(taskPath);
  const status = await falRequest(task.statusUrl, { method: 'GET' });
  task.lastCheckedAt = new Date().toISOString();
  task.lastStatus = status;
  writeJsonAtomic(taskPath, task);
  console.log(JSON.stringify({ requestId: task.requestId, status: status.status }, null, 2));
}

async function fetchResult() {
  const taskPath = requiredFlag('task');
  const outDir = requiredFlag('out-dir');
  const prefix = flags.prefix || 'fal-image';
  const task = readJson(taskPath);
  const result = await falRequest(task.responseUrl, { method: 'GET' });
  const images = result.images || result.data?.images || [];
  if (!images.length) {
    fail('The saved task has no completed image result. Check status; no new task was submitted.');
  }

  mkdirSync(outDir, { recursive: true });
  const saved = [];
  for (let index = 0; index < images.length; index += 1) {
    const sourceUrl = new URL(images[index].url);
    if (sourceUrl.protocol !== 'https:') fail('Refusing a non-HTTPS result URL.');
    const response = await fetch(sourceUrl);
    if (!response.ok) fail(`Image download failed with HTTP ${response.status}.`);
    const extension = extensionFor(images[index], sourceUrl);
    const outputPath = join(outDir, `${prefix}-${index + 1}${extension}`);
    writeFileSync(outputPath, Buffer.from(await response.arrayBuffer()));
    saved.push(resolve(outputPath));
  }

  task.resultFetchedAt = new Date().toISOString();
  task.savedImages = saved;
  task.result = result;
  writeJsonAtomic(taskPath, task);
  console.log(JSON.stringify({ requestId: task.requestId, savedImages: saved }, null, 2));
}

async function falRequest(url, init) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: `Key ${credentials}`,
      'Content-Type': 'application/json',
    },
  });
  const body = await response.text();
  if (!response.ok) {
    fail(`FAL request failed with HTTP ${response.status}; no retry was attempted. ${body.slice(0, 500)}`);
  }
  try {
    return JSON.parse(body);
  } catch {
    fail('FAL returned a non-JSON response; no retry was attempted.');
  }
}

/** The style kit lists each picture slot's aspect (for example 3:4); match it. */
function sizeForAspect(aspect) {
  if (PRESETS[aspect]) return PRESETS[aspect];
  const [width, height] = aspect.split(':').map(Number);
  if (!(width > 0 && height > 0)) fail(`--aspect must look like 3:2, got ${aspect}.`);
  const scale = 1536 / Math.max(width, height);
  const snap = (value) => Math.max(256, Math.round((value * scale) / 16) * 16);
  return { width: snap(width), height: snap(height) };
}

/** Local reference pictures travel inline; remote https references pass through. */
function dataUrl(reference) {
  if (/^(?:https:|data:)/.test(reference)) return reference;
  const type = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }[extname(reference).toLowerCase()];
  if (!type) fail(`Unsupported reference picture: ${reference}`);
  return `data:${type};base64,${readFileSync(reference).toString('base64')}`;
}

function parseFlags(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith('--') || value === undefined) fail(`Invalid flag near ${key || '<end>'}.`);
    parsed[key.slice(2)] = value;
  }
  return parsed;
}

function requiredFlag(name) {
  if (!flags[name]) fail(`--${name} is required.`);
  return flags[name];
}

function integerFlag(name, fallback, min, max) {
  const value = flags[name] === undefined ? fallback : Number.parseInt(flags[name], 10);
  if (!Number.isInteger(value) || value < min || value > max) fail(`--${name} must be between ${min} and ${max}.`);
  return value;
}

function enumFlag(name, allowed, fallback) {
  const value = flags[name] || fallback;
  if (!allowed.includes(value)) fail(`--${name} must be one of: ${allowed.join(', ')}.`);
  return value;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJsonAtomic(path, value) {
  const resolved = resolve(path);
  mkdirSync(dirname(resolved), { recursive: true });
  const temporary = `${resolved}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  renameSync(temporary, resolved);
}

function extensionFor(image, sourceUrl) {
  const contentType = image.content_type || '';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('jpeg')) return '.jpg';
  if (contentType.includes('webp')) return '.webp';
  const extension = extname(sourceUrl.pathname).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.webp'].includes(extension) ? extension : '.webp';
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
