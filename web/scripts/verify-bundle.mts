/**
 * verify-bundle — measures the real gzipped JS each prerendered page loads
 * (every <script src> in its HTML) against the initial-JS budget in plan §6.
 * Run after `next build`.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 130;
const root = new URL("../.next/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const appDir = join(root, "server", "app");
if (!existsSync(appDir)) {
  console.error("No build found. Run `next build` first.");
  process.exit(1);
}

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return htmlFiles(p);
    return name.endsWith(".html") ? [p] : [];
  });
}

const gzCache = new Map<string, number>();
function gz(src: string) {
  if (!gzCache.has(src)) {
    const file = join(root, src.replace(/^\/_next\//, ""));
    gzCache.set(src, existsSync(file) ? gzipSync(readFileSync(file), { level: 9 }).length : 0);
  }
  return gzCache.get(src)!;
}

let failures = 0;
for (const file of htmlFiles(appDir).sort()) {
  const html = readFileSync(file, "utf8");
  // Skip noModule scripts (legacy polyfills): modern browsers never download them.
  const srcs = [
    ...new Set(
      [...html.matchAll(/<script([^>]*)>/g)]
        .filter((m) => !/nomodule/i.test(m[1]!))
        .map((m) => /src="([^"]+\.js)"/.exec(m[1]!)?.[1])
        .filter((s): s is string => Boolean(s)),
    ),
  ];
  const kb = srcs.reduce((sum, s) => sum + gz(s), 0) / 1024;
  const route = file.slice(appDir.length).replace(/\\/g, "/").replace(/\.html$/, "").replace(/\/index$/, "/") || "/";
  const ok = kb <= BUDGET_KB;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${route.padEnd(42)} ${kb.toFixed(1).padStart(6)} KB gz (${srcs.length} scripts)`);
}
console.log(`\nBudget: ${BUDGET_KB} KB gz initial JS per route.`);
console.log(failures === 0 ? "All checks passed." : `${failures} route(s) over budget.`);
process.exit(failures === 0 ? 0 : 1);
