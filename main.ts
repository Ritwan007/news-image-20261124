// News-image entry for make.fun competition news-image-20261124.
// The deliverable is entry.png beside this file: a one-page front page
// summing up Tuesday 24 November 2026 — Nvidia's Huang returns as CEO,
// the Ukraine war spreading to Libya, Korea's evacuation warning,
// the Indonesia factory fire, Gaza, and the World Chess Championship.
// This program is a deterministic byte copy: it writes exactly the
// shipped image to the output directory, nothing else, no network.
// Before writing it checks the image against the competition gate
// (a whole PNG, at most 1 MiB) so a broken file fails loudly here
// instead of silently reaching the judge.
//
// Run locally: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1_048_576;

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const sourcePath = new URL('./entry.png', import.meta.url);

const image = readFileSync(sourcePath);
if (!image.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png is not a PNG file');
}
if (image.length > MAX_BYTES) {
  throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB cap`);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), image);

const digest = createHash('sha256').update(image).digest('hex');
console.log(`entry.png: ${image.length} bytes, sha256 ${digest}`);
