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
import { aboutPage, homePage, pricingPage, processPage } from "../../web/src/content/seed/pages.ts";
import { cookiesPage, privacyPage, termsPage } from "../../web/src/content/seed/legal.ts";

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
    summary: homePage.summary,
    audiences: keyed(homePage.audiences, "a"),
    whyUs: keyed(homePage.whyUs, "w"),
    engagement: keyed(homePage.engagement, "e"),
    faqs: keyed(homePage.faqs, "f"),
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
  {
    _id: "pricingPage",
    _type: "pricingPage",
    intro: pricingPage.intro,
    packages: pricingPage.packages.map(({ serviceSlug, ...p }, i) => ({
      _key: `pk${i}`,
      ...p,
      ...(serviceSlug ? { service: { _type: "reference", _ref: `service-${serviceSlug}` } } : {}),
    })),
    factors: keyed(pricingPage.factors, "fa"),
    note: pricingPage.note,
    faqs: keyed(pricingPage.faqs, "f"),
  },
  ...[privacyPage, termsPage, cookiesPage].map((p) => ({
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
    menuDescription: s.menuDescription,
    summary: s.summary,
    headline: s.headline,
    overview: s.overview,
    capabilities: keyed(s.capabilities, "c"),
    useCases: keyed(s.useCases, "u"),
    benefits: keyed(s.benefits, "b"),
    process: keyed(s.process, "st"),
    faqs: keyed(s.faqs, "f"),
    related: s.related.map((slug, i) => ({ _key: `r${i}`, _type: "reference", _ref: `service-${slug}` })),
    localContent: s.localContent,
    cta: s.cta,
    seo: s.seo,
  })),
];

const tx = client.transaction();
for (const doc of docs) tx.createOrReplace(doc);
const result = await tx.commit();
console.log(`Seeded ${result.results.length} documents into ${projectId}.`);
