import "server-only";
import { sanityConfigured, sanityFetch } from "@/sanity/client";
import * as q from "@/sanity/queries";
import type { AboutPage, ChapterKey, HomePage, LegalPage, ProcessPage, Project, Service, SiteSettings } from "./types";
import { siteSettings } from "./seed/site";
import { services as seedServices } from "./seed/services";
import { aboutPage, homePage, processPage, projects as seedProjects } from "./seed/pages";
import { privacyPage, termsPage } from "./seed/legal";

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
  return fromCms(q.SITE_SETTINGS, siteSettings);
}

export async function getHomePage(): Promise<HomePage> {
  type Raw = Omit<HomePage, "chapters"> & { chapters?: Partial<Record<ChapterKey, Omit<HomePage["chapters"][ChapterKey], "key">>> };
  const raw = await fromCms<Raw>(q.HOME_PAGE, homePage);
  // Every chapter is anchored to a 3D pose, so all five must exist: fill any
  // missing one from the seed rather than breaking the journey.
  const chapters = Object.fromEntries(
    (Object.keys(homePage.chapters) as ChapterKey[]).map((key) => [
      key,
      raw.chapters?.[key] ? { key, ...raw.chapters[key] } : homePage.chapters[key],
    ]),
  ) as HomePage["chapters"];
  return {
    hero: raw.hero ?? homePage.hero,
    chapters,
    outcomes: raw.outcomes?.length ? raw.outcomes : homePage.outcomes,
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
  return services.length ? services : seedServices;
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

export async function getLegalPage(slug: LegalPage["slug"]): Promise<LegalPage> {
  const seed = slug === "privacy" ? privacyPage : termsPage;
  const doc = await fromCms<Omit<LegalPage, "slug"> | null>(q.LEGAL_PAGE, null, { id: `${slug}Page` });
  return doc ? { ...doc, slug } : seed;
}
