// Runs every static verify suite and summarises. Live suites (routes, headers
// against a URL) and the bundle suite (needs a build) have their own scripts.
import { spawnSync } from "node:child_process";

const suites = ["headers", "contrast", "formations", "camera", "anchors", "tiers", "env", "webhook", "contact"];
let failed = 0;
for (const s of suites) {
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", `scripts/verify-${s}.mts`], {
    encoding: "utf8",
  });
  const out = `${r.stdout}${r.stderr}`;
  const passes = (out.match(/^PASS/gm) ?? []).length;
  const fails = out.split("\n").filter((l) => l.startsWith("FAIL") || /Error/.test(l));
  console.log(`${r.status === 0 ? "ok  " : "FAIL"}  verify-${s}  (${passes} checks passed)`);
  if (r.status !== 0) {
    failed++;
    fails.forEach((l) => console.log(`        ${l}`));
  }
}
console.log(failed === 0 ? "\nAll verify suites passed." : `\n${failed} suite(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
