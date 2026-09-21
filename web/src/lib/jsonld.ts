import type { Faq, Project, Service, SiteSettings } from "@/content/types";
import { env } from "./env";

/**
 * schema.org builders. Pure functions of content, so structured data always
 * matches what the page shows. Rendered by <JsonLd>.
 */
const url = (path = "") => `${env.NEXT_PUBLIC_SITE_URL}${path}`;
const ORG_ID = url("/#organization");

export function organization(site: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: url("/"),
    logo: url("/icon.svg"),
    image: url("/og-default.jpg"),
    email: site.email,
    telephone: site.phone.replace(/\s/g, ""),
    founder: site.founder ? { "@type": "Person", name: site.founder } : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
    knowsAbout: ["Website development", "Web application development", "Mobile app development", "Custom software", "UI/UX design"],
    sameAs: site.socials.map((s) => s.url),
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
    description: service.seo.description ?? service.summary,
    url: url(`/services/${service.slug}`),
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
