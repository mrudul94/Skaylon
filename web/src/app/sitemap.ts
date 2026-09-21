import type { MetadataRoute } from "next";
import { getProjects, getServices } from "@/content";
import { env } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const [services, projects] = await Promise.all([getServices(), getProjects()]);
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly") => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    entry("/", 1, "weekly"),
    entry("/services", 0.9, "monthly"),
    ...services.filter((s) => !s.seo.noindex).map((s) => entry(`/services/${s.slug}`, 0.8, "monthly")),
    entry("/work", 0.8, "weekly"),
    ...projects.filter((p) => !p.seo.noindex).map((p) => entry(`/work/${p.slug}`, 0.7, "monthly")),
    entry("/process", 0.6, "yearly"),
    entry("/about", 0.6, "yearly"),
    entry("/contact", 0.7, "yearly"),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];
}
