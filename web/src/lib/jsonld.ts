import type { Faq, Project, Service, SiteSettings } from "@/content/types";
import { env } from "./env";

/**
 * schema.org builders. Pure functions of content, so structured data always
 * matches what the page shows. Rendered by <JsonLd>.
 */
const url = (path = "") => `${env.NEXT_PUBLIC_SITE_URL}${path}`;
const ORG_ID = url("/#organization");

export function organization(site: SiteSettings, services: Service[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: url("/"),
    logo: { "@type": "ImageObject", url: url("/icon-512.png"), width: 512, height: 512 },
    image: url("/og-default.jpg"),
    email: site.email,
    telephone: site.phone.replace(/\s/g, ""),
    founder: site.founder
      ? { "@type": "Person", name: site.founder, jobTitle: "Founder", ...(site.founderPhoto ? { image: site.founderPhoto.url } : {}) }
      : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
    knowsAbout: services.map((s) => s.name),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phone.replace(/\s/g, ""),
      areaServed: "Worldwide",
      availableLanguage: ["en"],
    },
    ...(site.socials.length ? { sameAs: site.socials.map((s) => s.url) } : {}),
  };
}

export function website(site: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: url("/"),
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export function breadcrumbs(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.label, item: url(item.href) })),
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.summary,
    url: url(`/services/${service.slug}`),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name}: what Skaylon builds`,
      itemListElement: service.capabilities.map((c) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: c.title, description: c.description },
      })),
    },
    provider: { "@id": ORG_ID },
    areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
  };
}

export function faqPage(faqs: Faq[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

export function projectSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: url(`/work/${project.slug}`),
    image: project.cover.url,
    dateCreated: String(project.year),
    creator: { "@id": ORG_ID },
    about: project.industry,
    keywords: project.techStack.join(", "),
  };
}

/** WebPage node: ties a page to the site and organisation, with its summary. */
export function webPage({ path, name, description, type = "WebPage" }: { path: string; name: string; description: string; type?: "WebPage" | "ContactPage" | "AboutPage" | "CollectionPage" }) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": url(`${path}#webpage`),
    url: url(path),
    name,
    description,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", url: url("/") },
    about: { "@id": ORG_ID },
  };
}

export function serviceList(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Skaylon services",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: url(`/services/${s.slug}`),
    })),
  };
}
