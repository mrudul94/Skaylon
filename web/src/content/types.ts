/**
 * Content contract shared by every page. src/content/index.ts serves these
 * shapes from Sanity (production) or the local seed (dev, and as a fallback
 * for documents not created yet); pages never know which.
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
  /** One line (≤ 90 chars) shown under the name in the Services menu. */
  menuDescription: string;
  /** Two sentences at most: the answer to "what is this service?". */
  summary: string;
  headline: string;
  overview: string;
  /** What Skaylon can build under this service. */
  capabilities: TitledText[];
  /** Businesses and situations the service is a good fit for. */
  useCases: TitledText[];
  /** Why the approach works (short, factual). */
  benefits: TitledText[];
  process: TitledText[];
  faqs: Faq[];
  /** Slugs of related services, for internal links. */
  related: string[];
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
  /** Real photo of the founder, from the CMS (optional). */
  founderPhoto?: ContentImage;
  founderBio?: string;
  address: { locality: string; region: string; country: string; countryCode: string };
  credential: { label: string; value: string };
  socials: { label: string; url: string }[];
};

export type HomePage = {
  hero: { eyebrow: string; heading: string; sub: string };
  /** The "in short" answer block under the hero (AEO). */
  summary: string;
  audiences: TitledText[];
  whyUs: TitledText[];
  engagement: TitledText[];
  faqs: Faq[];
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

export type LegalSlug = "privacy" | "terms" | "cookies";

export type LegalPage = {
  slug: LegalSlug;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};
