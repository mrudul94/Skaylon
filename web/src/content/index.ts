import "server-only";
import { sanityConfigured, sanityFetch } from "@/sanity/client";
import * as q from "@/sanity/queries";
import type { AboutPage, HomePage, LegalPage, LegalSlug, ProcessPage, Project, Service, SiteSettings } from "./types";
import { siteSettings } from "./seed/site";
import { services as seedServices } from "./seed/services";
import { aboutPage, homePage, processPage, projects as seedProjects } from "./seed/pages";
import { cookiesPage, privacyPage, termsPage } from "./seed/legal";

/**
 * The single content API every page uses.
 *
 * With Sanity configured (NEXT_PUBLIC_SANITY_PROJECT_ID), content comes from
 * the CMS via tagged ISR fetches. A singleton that hasn't been created yet
 * falls back to the local seed, so a fresh dataset never breaks a page. A
 * failed fetch is NOT swallowed: better a failed build or revalidation (the
 * last good page keeps serving) than silently publishing stale seed copy.
 * Projects are the one exception to seeding: an empty CMS means no case
 * studies, and the site says so honestly.
 */

async function fromCms<T>(query: string, fallback: T, params: Record<string, string> = {}): Promise<T> {
  if (!sanityConfigured) return fallback;
  const doc = await sanityFetch<T | null>(query, params);
  return doc ?? fallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const site = await fromCms(q.SITE_SETTINGS, siteSettings);
  // A photo uploaded in the CMS wins; until then the local one is used.
  return site.founderPhoto ? site : { ...site, founderPhoto: siteSettings.founderPhoto };
}

export async function getHomePage(): Promise<HomePage> {
  const raw = await fromCms<Partial<HomePage>>(q.HOME_PAGE, homePage);
  // Field-by-field fallback: a half-filled CMS document never leaves a hole.
  const list = <T,>(v: T[] | undefined, seed: T[]) => (v?.length ? v : seed);
  return {
    hero: raw.hero?.heading ? raw.hero : homePage.hero,
    summary: raw.summary || homePage.summary,
    audiences: list(raw.audiences, homePage.audiences),
    whyUs: list(raw.whyUs, homePage.whyUs),
    engagement: list(raw.engagement, homePage.engagement),
    faqs: list(raw.faqs, homePage.faqs),
    cta: raw.cta?.label ? { ...raw.cta, href: raw.cta.href || "/contact" } : homePage.cta,
  };
}

export async function getAboutPage(): Promise<AboutPage> {
  return fromCms(q.ABOUT_PAGE, aboutPage);
}

export async function getProcessPage(): Promise<ProcessPage> {
  return fromCms(q.PROCESS_PAGE, processPage);
}

export async function getServices(): Promise<Service[]> {
  if (!sanityConfigured) return [...seedServices].sort((a, b) => a.order - b.order);
  const services = await sanityFetch<Service[]>(q.SERVICES);
  // The site's structure assumes services exist; an unseeded dataset falls back.
  if (!services.length) return seedServices;
  return services.map(withSeedDefaults);
}

/**
 * Fills list fields a CMS service hasn't been given yet (e.g. a dataset
 * created before capabilities/use cases existed) from the seed service with
 * the same slug, so a partly migrated document never renders empty sections.
 * Fields the CMS does set always win.
 */
function withSeedDefaults(service: Service): Service {
  const seed = seedServices.find((s) => s.slug === service.slug);
  if (!seed) return service;
  const list = <K extends "capabilities" | "useCases" | "benefits" | "process" | "faqs" | "related">(k: K) =>
    service[k]?.length ? service[k] : seed[k];
  return {
    ...service,
    menuDescription: service.menuDescription || seed.menuDescription,
    capabilities: list("capabilities"),
    useCases: list("useCases"),
    benefits: list("benefits"),
    process: list("process"),
    faqs: list("faqs"),
    related: list("related"),
  };
}

export async function getService(slug: string): Promise<Service | null> {
  return (await getServices()).find((s) => s.slug === slug) ?? null;
}

export async function getProjects(opts: { featured?: boolean } = {}): Promise<Project[]> {
  const projects = sanityConfigured ? await sanityFetch<Project[]>(q.PROJECTS) : seedProjects;
  return projects.filter((p) => (opts.featured ? p.featured : true));
}

export async function getProject(slug: string): Promise<Project | null> {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

const legalSeed: Record<LegalSlug, LegalPage> = { privacy: privacyPage, terms: termsPage, cookies: cookiesPage };

export async function getLegalPage(slug: LegalSlug): Promise<LegalPage> {
  const doc = await fromCms<Omit<LegalPage, "slug"> | null>(q.LEGAL_PAGE, null, { id: `${slug}Page` });
  return doc ? { ...doc, slug } : legalSeed[slug];
}
