/**
 * verify-env — the pre-baked environment is current and decodes correctly.
 * Fails if src/world/environment.ts changed without `npm run bake:env`.
 */
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { DataUtils } from "three";
import { ENV_SIZE, ENV_TEXTURE, LIGHTFORMERS, decodeRGBE, encodeRGBE, environmentHash, rgbeToHalf, toHalf } from "../src/world/environment.ts";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

// RGBE round trip: relative error within 8-bit mantissa precision.
let worst = 0;
const buf = new Uint8Array(4);
for (const v of [1e-4, 0.003, 0.05, 0.37, 1, 1.9, 4, 17.5, 250]) {
  for (const [r, g, b] of [[v, v * 0.5, v * 0.1], [v * 0.2, v, v * 0.7]]) {
    encodeRGBE(r!, g!, b!, buf, 0);
    const out = decodeRGBE(buf, 0);
    const max = Math.max(r!, g!, b!);
    worst = Math.max(worst, ...[r!, g!, b!].map((x, i) => Math.abs(out[i]! - x) / max));
  }
}
check(`RGBE round trip error ≤ 1% of peak channel (${(worst * 100).toFixed(2)}%)`, worst <= 0.01);
encodeRGBE(0, 0, 0, buf, 0);
check("RGBE encodes black as zeros", buf.every((x) => x === 0) && decodeRGBE(buf, 0).every((x) => x === 0));

// The dependency-free float→half rounds to nearest (three's truncates), so
// compare accuracy, not bits: never worse than three, and within half
// precision (relative 2^-11 for normals). Range: |v| ≤ 65504 (the environment
// peaks at 4).
const samples = [0, 1, -1, 0.5, 1 / 3, 0.1, 2.5, 4, 65504, 1e-5, 6e-8, 1e-9, 0.000061, 3.14159, -17.25, 2048.5, 1024.25];
for (let i = 0; i < 20000; i++) samples.push((Math.random() - 0.3) * 10 ** (Math.random() * 8 - 4));
let worse = 0;
let tooFar = 0;
for (const input of samples) {
  // Both converters take a float32 (the texture data's precision); measuring
  // against the double would count float32 double-rounding at exact ties.
  const v = Math.fround(input);
  const mine = DataUtils.fromHalfFloat(toHalf(v));
  const theirs = DataUtils.fromHalfFloat(DataUtils.toHalfFloat(v));
  if (Math.abs(mine - v) > Math.abs(theirs - v) + 1e-12) worse++;
  const tolerance = Math.abs(v) >= 6.1e-5 ? Math.abs(v) * 2 ** -11 : 2 ** -25; // normal vs subnormal
  if (Math.abs(mine - v) > tolerance * 1.0001) tooFar++;
}
check(`toHalf never less accurate than three's (${samples.length} values, ${worse} worse)`, worse === 0);
check(`toHalf within half precision (${tooFar} outside)`, tooFar === 0);
check("toHalf(1) is 0x3c00", toHalf(1) === 0x3c00);

const metaPath = new URL(`../public/env/studio-${ENV_SIZE}.json`, import.meta.url);
const meta = JSON.parse(readFileSync(metaPath, "utf8")) as { width: number; height: number; hash: string; peak: number };
check(`baked hash matches lighting data (${meta.hash} vs ${environmentHash()})`, meta.hash === environmentHash(), "run `npm run bake:env`");
check(`baked layout ${meta.width}×${meta.height} = expected`, meta.width === ENV_TEXTURE.width && meta.height === ENV_TEXTURE.height);

const gz = readFileSync(new URL(`../public${ENV_TEXTURE.file}`, import.meta.url));
const raw = gunzipSync(gz);
check(`file decodes to width×height×4 bytes (${raw.length})`, raw.length === ENV_TEXTURE.width * ENV_TEXTURE.height * 4);
check(`file size ≤ 120 KB (${(gz.length / 1024).toFixed(1)} KB)`, gz.length <= 120 * 1024);
const halfBits = rgbeToHalf(raw);
check("whole-buffer decode yields width×height RGBA halves", halfBits.length === ENV_TEXTURE.width * ENV_TEXTURE.height * 4);

let peak = 0;
let lit = 0;
for (let o = 0; o < raw.length; o += 4) {
  const [r, g, b] = decodeRGBE(raw, o);
  const m = Math.max(r, g, b);
  peak = Math.max(peak, m);
  if (m > 0.01) lit++;
}
const brightest = Math.max(...LIGHTFORMERS.map((l) => l.intensity * Math.max(...l.color)));
check(`peak radiance ≈ brightest lightformer (${peak.toFixed(2)} vs ${brightest})`, Math.abs(peak - brightest) / brightest < 0.05);
check(`environment is not empty (${((lit / (raw.length / 4)) * 100).toFixed(1)}% of texels lit)`, lit > raw.length / 4 / 50);

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
