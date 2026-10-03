/**
 * GROQ projections that return exactly the shapes in src/content/types.ts,
 * so pages never know whether content came from Sanity or the local seed.
 */

const image = `{ "url": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

export const SITE_SETTINGS = `*[_id == "siteSettings"][0]{
  name, legalName, tagline, description, email, phone, whatsapp,
  "founder": coalesce(founder, ""),
  defined(founderPhoto.asset) => { "founderPhoto": founderPhoto${image} },
  defined(founderBio) => { founderBio },
  address, credential,
  "socials": coalesce(socials[]{label, url}, [])
}`;

export const HOME_PAGE = `*[_id == "homePage"][0]{
  hero, summary,
  "audiences": coalesce(audiences[]{title, description}, []),
  "whyUs": coalesce(whyUs[]{title, description}, []),
  "engagement": coalesce(engagement[]{title, description}, []),
  "faqs": coalesce(faqs[]{question, answer}, []),
  cta
}`;

export const ABOUT_PAGE = `*[_id == "aboutPage"][0]{
  intro, "story": coalesce(story, []),
  "principles": coalesce(principles[]{title, description}, []),
  "quote": coalesce(quote, "")
}`;

export const PROCESS_PAGE = `*[_id == "processPage"][0]{
  intro,
  "phases": coalesce(phases[]{number, title, summary, "duration": coalesce(duration, ""), "deliverables": coalesce(deliverables, [])}, []),
  "faqs": coalesce(faqs[]{question, answer}, [])
}`;

export const PRICING_PAGE = `*[_id == "pricingPage"][0]{
  intro,
  "packages": coalesce(packages[]{
    name, description,
    defined(priceFrom) => { priceFrom },
    defined(priceLabel) => { priceLabel },
    "features": coalesce(features, []),
    ctaLabel,
    defined(service) => { "serviceSlug": service->slug.current }
  }, []),
  "factors": coalesce(factors[]{title, description}, []),
  "note": coalesce(note, ""),
  "faqs": coalesce(faqs[]{question, answer}, [])
}`;

export const LEGAL_PAGE = `*[_id == $id][0]{
  title, lastUpdated, "intro": coalesce(intro, ""),
  "sections": coalesce(sections[]{heading, "body": coalesce(body, [])}, [])
}`;

const serviceFields = `
  "slug": slug.current, name, order, "menuDescription": coalesce(menuDescription, summary), summary, headline, overview,
  "capabilities": coalesce(capabilities[]{title, description}, []),
  "useCases": coalesce(useCases[]{title, description}, []),
  "benefits": coalesce(benefits[]{title, description}, []),
  "process": coalesce(process[]{title, description}, []),
  "faqs": coalesce(faqs[]{question, answer}, []),
  "related": coalesce(related[]->slug.current, []),
  defined(localContent.heading) => { localContent },
  cta, "seo": coalesce(seo, {})
`;

export const SERVICES = `*[_type == "service" && defined(slug.current)] | order(order asc){ ${serviceFields} }`;

const projectFields = `
  "slug": slug.current, title, client, industry, year, summary,
  "cover": cover${image},
  "gallery": coalesce(gallery[]${image}, []),
  "serviceSlugs": coalesce(services[]->slug.current, []),
  "challenge": coalesce(challenge, []),
  "approach": coalesce(approach, []),
  "solution": coalesce(solution, []),
  "outcome": coalesce(outcome, []),
  "metrics": coalesce(metrics[]{label, value}, []),
  "techStack": coalesce(techStack, []),
  defined(liveUrl) => { liveUrl },
  "featured": coalesce(featured, false),
  "order": coalesce(order, 100),
  "seo": coalesce(seo, {})
`;

export const SHOWCASE = `*[_type == "showcase" && defined(url) && defined(screenshot.asset)] | order(order asc, year desc){
  "id": _id, title, url,
  "screenshot": screenshot${image},
  defined(description) => { description },
  category, "techStack": coalesce(techStack, []), year
}`;

export const PROJECTS = `*[_type == "project" && defined(slug.current) && defined(cover.asset)] | order(order asc){ ${projectFields} }`;
