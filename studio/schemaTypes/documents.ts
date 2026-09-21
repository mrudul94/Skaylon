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
      name: "wedgeIndex",
      title: "3D icon",
      type: "number",
      description: "Which of the five 3D icons stands for this service: 0 browser, 1 dashboard, 2 phone, 3 stacked layers, 4 design ring. Must be unique.",
      validation: (r) =>
        r
          .required()
          .integer()
          .min(0)
          .max(4)
          .custom(async (value, ctx) => {
            if (value === undefined) return true;
            const id = ctx.document?._id.replace(/^drafts\./, "");
            const clash = await ctx
              .getClient({ apiVersion: "2025-01-01" })
              .fetch<number>(`count(*[_type == "service" && wedgeIndex == $value && !(_id in [$id, "drafts." + $id])])`, { value, id });
            return clash === 0 || "Another service already uses this icon.";
          }),
    }),
    defineField({ name: "summary", type: "text", rows: 2, validation: (r) => r.required().max(200) }),
    defineField({ name: "headline", title: "Page headline (H1)", type: "string", validation: (r) => r.required().max(80) }),
    defineField({ name: "overview", type: "text", rows: 5, validation: (r) => r.required().max(900) }),
    defineField({ name: "benefits", type: "array", of: [defineArrayMember({ type: "titledText" })], validation: (r) => r.required().min(1).max(6) }),
    defineField({ name: "process", title: "Delivery steps", type: "array", of: [defineArrayMember({ type: "titledText" })], validation: (r) => r.required().min(1).max(6) }),
    defineField({ name: "faqs", title: "FAQs", type: "array", of: [defineArrayMember({ type: "faq" })] }),
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

export const documentTypes = [service, project];
