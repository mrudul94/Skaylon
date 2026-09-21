/**
 * Seeds the dataset from the web app's own seed content (the copy migrated
 * from the previous site), so the CMS starts identical to what the site shows.
 * Idempotent: createOrReplace on fixed ids. Never creates projects: there are
 * no real case studies yet, and invented ones must never be published.
 *
 *   SANITY_STUDIO_PROJECT_ID=… SANITY_WRITE_TOKEN=… npm run seed
 */
import { createClient } from "@sanity/client";
import { siteSettings } from "../../web/src/content/seed/site.ts";
import { services } from "../../web/src/content/seed/services.ts";
import { aboutPage, homePage, processPage } from "../../web/src/content/seed/pages.ts";
import { privacyPage, termsPage } from "../../web/src/content/seed/legal.ts";

import { projectId } from "../env.ts";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Set SANITY_WRITE_TOKEN (an Editor token from sanity.io/manage → API → Tokens).");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// Array items in Sanity need a stable _key.
const keyed = <T extends object>(items: T[], prefix: string) => items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

const docs: ({ _id: string; _type: string } & Record<string, unknown>)[] = [
  { _id: "siteSettings", _type: "siteSettings", ...siteSettings, socials: keyed(siteSettings.socials, "s") },
  {
    _id: "homePage",
    _type: "homePage",
    hero: homePage.hero,
    chapters: Object.fromEntries(
      Object.entries(homePage.chapters).map(([k, { eyebrow, heading, body }]) => [k, { eyebrow, heading, body }]),
    ),
    outcomes: homePage.outcomes,
    cta: homePage.cta,
  },
  { _id: "aboutPage", _type: "aboutPage", ...aboutPage, principles: keyed(aboutPage.principles, "p") },
  {
    _id: "processPage",
    _type: "processPage",
    intro: processPage.intro,
    phases: keyed(processPage.phases, "ph"),
    faqs: keyed(processPage.faqs, "f"),
  },
  ...[privacyPage, termsPage].map((p) => ({
    _id: `${p.slug}Page`,
    _type: "legalPage",
    title: p.title,
    lastUpdated: p.lastUpdated,
    intro: p.intro,
    sections: keyed(p.sections, "sec"),
  })),
  ...services.map((s) => ({
    _id: `service-${s.slug}`,
    _type: "service",
    name: s.name,
    slug: { _type: "slug", current: s.slug },
    order: s.order,
    wedgeIndex: s.wedgeIndex,
    summary: s.summary,
    headline: s.headline,
    overview: s.overview,
    benefits: keyed(s.benefits, "b"),
    process: keyed(s.process, "st"),
    faqs: keyed(s.faqs, "f"),
    localContent: s.localContent,
    cta: s.cta,
    seo: s.seo,
  })),
];

const tx = client.transaction();
for (const doc of docs) tx.createOrReplace(doc);
const result = await tx.commit();
console.log(`Seeded ${result.results.length} documents into ${projectId}.`);
