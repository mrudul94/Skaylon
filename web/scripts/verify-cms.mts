/**
 * verify-cms — runs the site's REAL GROQ queries (src/sanity/queries.ts)
 * against the live dataset and deep-compares the results with the local seed
 * the dataset was created from. Proves the projections return exactly the
 * shapes pages expect. Needs network; run after seeding:
 *
 *   node --experimental-strip-types scripts/verify-cms.mts [projectId]
 */
import { createClient } from "@sanity/client";
import { isDeepStrictEqual } from "node:util";
import * as q from "../src/sanity/queries.ts";
import { siteSettings } from "../src/content/seed/site.ts";
import { services } from "../src/content/seed/services.ts";
import { aboutPage, homePage, processPage } from "../src/content/seed/pages.ts";
import { privacyPage, termsPage } from "../src/content/seed/legal.ts";

const projectId = process.argv[2] ?? "94bjvovm";
const client = createClient({ projectId, dataset: "production", apiVersion: "2025-01-01", useCdn: false });

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}
// Sanity omits undefined optional fields; normalise both sides the same way.
const clean = (v: unknown) => JSON.parse(JSON.stringify(v));
function firstDiff(a: unknown, b: unknown, path = ""): string {
  if (isDeepStrictEqual(a, b)) return "";
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return `${path || "(root)"}: ${JSON.stringify(a)?.slice(0, 80)} ≠ ${JSON.stringify(b)?.slice(0, 80)}`;
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const d = firstDiff((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`);
    if (d) return d;
  }
  return "";
}
const same = (name: string, got: unknown, want: unknown) => {
  const d = firstDiff(clean(got), clean(want));
  check(name, !d, d);
};

same("siteSettings", await client.fetch(q.SITE_SETTINGS), siteSettings);

const home = await client.fetch(q.HOME_PAGE);
same("homePage.hero", home.hero, homePage.hero);
for (const [key, ch] of Object.entries(homePage.chapters)) {
  const fields = { eyebrow: ch.eyebrow, heading: ch.heading, body: ch.body }; // `key` isn't stored
  same(`homePage.chapters.${key}`, home.chapters[key], fields);
}
same("homePage.outcomes", home.outcomes, homePage.outcomes);

same("aboutPage", await client.fetch(q.ABOUT_PAGE), aboutPage);
same("processPage", await client.fetch(q.PROCESS_PAGE), processPage);
for (const page of [privacyPage, termsPage]) {
  const { slug, ...fields } = page;
  same(`legal:${slug}`, await client.fetch(q.LEGAL_PAGE, { id: `${slug}Page` }), fields);
}

const cmsServices = await client.fetch(q.SERVICES);
check(`services: ${cmsServices.length} in CMS, ${services.length} in seed`, cmsServices.length === services.length);
for (const s of services) same(`service:${s.slug}`, cmsServices.find((c: { slug: string }) => c.slug === s.slug), s);

const projects = await client.fetch(q.PROJECTS);
check(`projects query runs (${projects.length} published)`, Array.isArray(projects));

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
