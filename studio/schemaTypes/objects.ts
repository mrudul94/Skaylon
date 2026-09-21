import { defineArrayMember, defineField, defineType } from "sanity";

/** Paragraphs as an array of plain texts: exactly what the site renders. */
export const paragraphs = (name: string, title: string, opts: { required?: boolean; max?: number } = {}) =>
  defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "text", rows: 4 })],
    validation: (r) => {
      let rule = r;
      if (opts.required) rule = rule.required().min(1);
      if (opts.max) rule = rule.max(opts.max);
      return rule;
    },
  });

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Title", type: "string", description: "≤ 60 characters. \"| Skaylon\" is appended.", validation: (r) => r.max(60) }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (r) => r.max(160).warning("Aim for ≤ 160 characters.") }),
    defineField({ name: "noindex", title: "Hide from search engines", type: "boolean", initialValue: false }),
  ],
});

export const titledText = defineType({
  name: "titledText",
  title: "Titled text",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required().max(80) }),
    defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.required().max(400) }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required().max(160) }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required().max(800) }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for screen readers and search engines.",
      validation: (r) => r.required().max(160),
    }),
  ],
});

export const objectTypes = [seo, titledText, faq, imageWithAlt];
