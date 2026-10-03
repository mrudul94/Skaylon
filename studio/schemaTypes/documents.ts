import { defineArrayMember, defineField, defineType } from "sanity";
import { paragraphs } from "./objects";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", description: "Short name for nav and cards.", validation: (r) => r.required().max(40) }),
    defineField({ name: "slug", type: "slug", options: { source: "name", maxLength: 64 }, validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", validation: (r) => r.required().integer().min(1) }),
    defineField({
      name: "menuDescription",
      title: "Menu description",
      type: "string",
      description: "One line shown under the name in the Services menu.",
      validation: (r) => r.required().max(90),
    }),
    defineField({ name: "summary", type: "text", rows: 2, validation: (r) => r.required().max(200) }),
    defineField({ name: "headline", title: "Page headline (H1)", type: "string", validation: (r) => r.required().max(80) }),
    defineField({ name: "overview", type: "text", rows: 5, validation: (r) => r.required().max(900) }),
    defineField({
      name: "capabilities",
      title: "What we can build",
      type: "array",
      of: [defineArrayMember({ type: "titledText" })],
      validation: (r) => r.required().min(3).max(8),
    }),
    defineField({
      name: "useCases",
      title: "Ideal use cases",
      type: "array",
      of: [defineArrayMember({ type: "titledText" })],
      validation: (r) => r.required().min(2).max(6),
    }),
    defineField({ name: "benefits", type: "array", of: [defineArrayMember({ type: "titledText" })], validation: (r) => r.required().min(1).max(6) }),
    defineField({ name: "process", title: "Delivery steps", type: "array", of: [defineArrayMember({ type: "titledText" })], validation: (r) => r.required().min(1).max(6) }),
    defineField({ name: "faqs", title: "FAQs", type: "array", of: [defineArrayMember({ type: "faq" })] }),
    defineField({
      name: "related",
      title: "Related services",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
      validation: (r) => r.max(3).unique(),
    }),
    defineField({
      name: "localContent",
      title: "Local SEO block",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.max(120) }),
        defineField({ name: "text", type: "text", rows: 4, validation: (r) => r.max(600) }),
      ],
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required().max(90) }),
        defineField({ name: "label", title: "Button label", type: "string", validation: (r) => r.required().max(40) }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "summary" } },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required().max(90) }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "client", type: "string", validation: (r) => r.required().max(80) }),
    defineField({ name: "industry", type: "string", validation: (r) => r.required().max(60) }),
    defineField({ name: "year", type: "number", validation: (r) => r.required().integer().min(2000).max(2100) }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (r) => r.required().max(240) }),
    defineField({ name: "cover", title: "Cover image", type: "imageWithAlt", validation: (r) => r.required() }),
    defineField({ name: "gallery", type: "array", of: [defineArrayMember({ type: "imageWithAlt" })] }),
    defineField({ name: "services", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })] }),
    paragraphs("challenge", "The challenge"),
    paragraphs("approach", "Our thinking"),
    paragraphs("solution", "The solution"),
    paragraphs("outcome", "The outcome"),
    defineField({
      name: "metrics",
      title: "Measured outcomes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", description: "e.g. 3.2×, −48%, 0.9s", validation: (r) => r.required().max(12) }),
            defineField({ name: "label", type: "string", validation: (r) => r.required().max(80) }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (r) => r.max(3),
    }),
    defineField({ name: "techStack", title: "Tech stack", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "liveUrl", title: "Live URL", type: "url" }),
    defineField({ name: "featured", title: "Feature on home page", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 100, validation: (r) => r.integer() }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "client", media: "cover" } },
});

/** Values for showcase categories: the site's filter chips follow this list. */
export const SHOWCASE_CATEGORIES = [
  { title: "Landing page", value: "landing" },
  { title: "Business website", value: "business" },
  { title: "E-commerce", value: "ecommerce" },
  { title: "Portfolio", value: "portfolio" },
  { title: "Web app", value: "webapp" },
  { title: "Dashboard", value: "dashboard" },
  { title: "Experimental", value: "experimental" },
];

/**
 * Showcase: demo and concept sites built by Skaylon (not client work, which
 * goes in Project). Shown as a gallery on /showcase, each card opening the
 * live demo.
 */
export const showcase = defineType({
  name: "showcase",
  title: "Showcase item",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required().max(60) }),
    defineField({
      name: "url",
      title: "Live demo URL",
      type: "url",
      description: "Where the card links to. Opens in a new tab.",
      validation: (r) => r.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "screenshot",
      type: "imageWithAlt",
      description:
        "A full-page screenshot works best: the card shows the top and scrolls down it on hover. At least 1600 px wide.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 2, description: "One or two lines under the card.", validation: (r) => r.max(160) }),
    defineField({
      name: "category",
      type: "string",
      options: { list: SHOWCASE_CATEGORIES, layout: "dropdown" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "techStack", title: "Tech stack", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" }, validation: (r) => r.max(5) }),
    defineField({ name: "year", type: "number", validation: (r) => r.required().integer().min(2000).max(2100) }),
    defineField({ name: "order", type: "number", initialValue: 100, description: "Lower numbers show first.", validation: (r) => r.integer() }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "url", media: "screenshot" } },
});

export const documentTypes = [service, project, showcase];
