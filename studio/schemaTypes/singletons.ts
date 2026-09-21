import { defineArrayMember, defineField, defineType } from "sanity";
import { paragraphs } from "./objects";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "legalName", title: "Legal name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", validation: (r) => r.required().max(80) }),
    defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.required().max(300) }),
    defineField({ name: "email", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "phone", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      description: "Digits only, with country code, e.g. 918075915386.",
      validation: (r) => r.required().regex(/^\d{8,15}$/, { name: "digits" }),
    }),
    defineField({ name: "founder", type: "string" }),
    defineField({
      name: "address",
      type: "object",
      fields: [
        defineField({ name: "locality", type: "string", validation: (r) => r.required() }),
        defineField({ name: "region", type: "string", validation: (r) => r.required() }),
        defineField({ name: "country", type: "string", validation: (r) => r.required() }),
        defineField({ name: "countryCode", title: "Country code (ISO)", type: "string", validation: (r) => r.required().length(2) }),
      ],
    }),
    defineField({
      name: "credential",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "value", type: "string" }),
      ],
    }),
    defineField({
      name: "socials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", type: "url", validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
  ],
});

const chapter = (key: string, title: string) =>
  defineField({
    name: key,
    title,
    type: "object",
    fields: [
      defineField({ name: "eyebrow", type: "string", validation: (r) => r.required().max(40) }),
      defineField({ name: "heading", type: "string", validation: (r) => r.required().max(90) }),
      paragraphs("body", "Body", { required: true, max: 3 }),
    ],
  });

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string", validation: (r) => r.required().max(60) }),
        defineField({ name: "heading", type: "string", validation: (r) => r.required().max(60) }),
        defineField({ name: "sub", type: "text", rows: 3, validation: (r) => r.required().max(240) }),
      ],
    }),
    defineField({
      name: "chapters",
      description: "The five scroll chapters. Each is paired with a fixed movement of the 3D monolith.",
      type: "object",
      fields: [
        chapter("understanding", "01 — Understanding"),
        chapter("capabilities", "02 — Capabilities"),
        chapter("proof", "03 — Proof"),
        chapter("process", "04 — Process"),
        chapter("commitment", "05 — Commitment"),
      ],
    }),
    defineField({ name: "outcomes", type: "array", of: [defineArrayMember({ type: "string" })], validation: (r) => r.max(3) }),
    defineField({
      name: "cta",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "label", type: "string" }),
        defineField({ name: "href", type: "string", initialValue: "/contact" }),
      ],
    }),
  ],
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({
      name: "intro",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required().max(80) }),
        defineField({ name: "sub", type: "text", rows: 3, validation: (r) => r.required().max(300) }),
      ],
    }),
    paragraphs("story", "Story", { required: true }),
    defineField({ name: "principles", type: "array", of: [defineArrayMember({ type: "titledText" })] }),
    defineField({ name: "quote", type: "string", validation: (r) => r.max(160) }),
  ],
});

export const processPage = defineType({
  name: "processPage",
  title: "Process page",
  type: "document",
  fields: [
    defineField({
      name: "intro",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required().max(80) }),
        defineField({ name: "sub", type: "text", rows: 3, validation: (r) => r.required().max(300) }),
      ],
    }),
    defineField({
      name: "phases",
      type: "array",
      validation: (r) => r.required().min(1).max(6),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "number", type: "string", validation: (r) => r.required().max(4) }),
            defineField({ name: "title", type: "string", validation: (r) => r.required().max(40) }),
            defineField({ name: "summary", type: "text", rows: 4, validation: (r) => r.required().max(500) }),
            defineField({ name: "duration", type: "string", validation: (r) => r.max(40) }),
            defineField({ name: "deliverables", type: "array", of: [defineArrayMember({ type: "string" })] }),
          ],
          preview: { select: { title: "title", subtitle: "duration" } },
        }),
      ],
    }),
    defineField({ name: "faqs", title: "FAQs", type: "array", of: [defineArrayMember({ type: "faq" })] }),
  ],
});

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "lastUpdated", title: "Last updated", type: "date", validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
            paragraphs("body", "Body", { required: true }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
    }),
  ],
});

export const singletonTypes = [siteSettings, homePage, aboutPage, processPage, legalPage];
