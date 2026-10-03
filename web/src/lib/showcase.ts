import type { ShowcaseCategory } from "@/content/types";

/** Filter-chip labels. Keep in sync with SHOWCASE_CATEGORIES in studio/schemaTypes/documents.ts. */
export const SHOWCASE_CATEGORY_LABELS: Record<ShowcaseCategory, string> = {
  landing: "Landing page",
  business: "Business website",
  ecommerce: "E-commerce",
  portfolio: "Portfolio",
  webapp: "Web app",
  dashboard: "Dashboard",
  experimental: "Experimental",
};
