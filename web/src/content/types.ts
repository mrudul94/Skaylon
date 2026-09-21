/**
 * Content contract shared by every page. Checkpoint 2 swaps the data source
 * behind src/content/index.ts from local seed files to Sanity; these types
 * (and the page code consuming them) stay the same.
 */

export type Seo = {
  title?: string;
  description?: string;
  noindex?: boolean;
};

export type TitledText = { title: string; description: string };
export type Faq = { question: string; answer: string };
export type Cta = { title: string; label: string; href: string };

export type Service = {
  slug: string;
  /** Short name used in nav, cards and breadcrumbs. */
  name: string;
  order: number;
  /** Which of the 5 chip icons in the 3D world represents this service (0–4, unique). */
  wedgeIndex: number;
  summary: string;
  headline: string;
  overview: string;
  benefits: TitledText[];
  process: TitledText[];
  faqs: Faq[];
  localContent?: { heading: string; text: string };
  cta: Omit<Cta, "href">;
  seo: Seo;
};

export type ContentImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  year: number;
  summary: string;
  cover: ContentImage;
  gallery: ContentImage[];
  serviceSlugs: string[];
  challenge: string[];
  approach: string[];
  solution: string[];
  outcome: string[];
  metrics: { label: string; value: string }[];
  techStack: string[];
  liveUrl?: string;
  featured: boolean;
  order: number;
  seo: Seo;
};

export type SiteSettings = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  /** Digits only, international format, for wa.me links. */
  whatsapp: string;
  founder: string;
  address: { locality: string; region: string; country: string; countryCode: string };
  credential: { label: string; value: string };
  socials: { label: string; url: string }[];
};

export type ChapterKey = "understanding" | "capabilities" | "proof" | "process" | "commitment";

export type Chapter = {
  key: ChapterKey;
  eyebrow: string;
  heading: string;
  body: string[];
};

export type HomePage = {
  hero: { eyebrow: string; heading: string; sub: string };
  chapters: Record<ChapterKey, Chapter>;
  outcomes: string[];
  cta: Cta;
};

export type ProcessPhase = {
  number: string;
  title: string;
  summary: string;
  duration: string;
  deliverables: string[];
};

export type ProcessPage = {
  intro: { heading: string; sub: string };
  phases: ProcessPhase[];
  faqs: Faq[];
};

export type AboutPage = {
  intro: { heading: string; sub: string };
  story: string[];
  principles: TitledText[];
  quote: string;
};

export type LegalPage = {
  slug: "privacy" | "terms";
  title: string;
  lastUpdated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};
