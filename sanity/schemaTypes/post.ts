import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineArrayMember, defineField, defineType } from "sanity";

const serviceOptions = [
  { title: "Domestic Cleaning", value: "domestic-cleaning" },
  { title: "Deep Cleaning", value: "deep-move-cleaning" },
  { title: "End-of-Tenancy Cleaning", value: "end-of-tenancy-cleaning" },
  { title: "Commercial & Office Cleaning", value: "commercial-office-cleaning" },
  { title: "Carpet & Upholstery Cleaning", value: "carpet-upholstery-cleaning" },
  { title: "After-Builders Cleaning", value: "after-builders-cleaning" },
];

export const postType = defineType({
  name: "post",
  title: "Blog posts",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO & sharing" },
    { name: "connections", title: "Links & FAQs" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", validation: (rule) => rule.required().max(90) }),
    defineField({ name: "slug", title: "URL slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Excerpt", description: "Used on article cards and as the default meta description.", type: "text", rows: 3, group: "content", validation: (rule) => rule.required().min(80).max(180) }),
    defineField({
      name: "featuredImage",
      title: "Featured image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }], group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "categories", title: "Categories", type: "array", group: "content", of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })], validation: (rule) => rule.required().min(1).max(3) }),
    defineField({ name: "publishedAt", title: "Published date", type: "datetime", group: "content", initialValue: () => new Date().toISOString(), validation: (rule) => rule.required() }),
    defineField({ name: "featured", title: "Feature this article", type: "boolean", group: "content", initialValue: false }),
    defineField({
      name: "body",
      title: "Article content",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({ name: "href", title: "URL", type: "url", validation: (rule) => rule.required().uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }) }),
                  defineField({ name: "blank", title: "Open in a new tab", type: "boolean", initialValue: false }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          name: "articleImage",
          title: "Article image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
        defineArrayMember({
          name: "callout",
          title: "Callout",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "seoTitle", title: "SEO title", description: "Optional. Defaults to the article title.", type: "string", group: "seo", validation: (rule) => rule.max(60).warning("Aim for 50–60 characters.") }),
    defineField({ name: "seoDescription", title: "SEO description", description: "Optional. Defaults to the excerpt.", type: "text", rows: 3, group: "seo", validation: (rule) => rule.max(160).warning("Keep this below 160 characters.") }),
    defineField({ name: "canonicalUrl", title: "External canonical URL", description: "Leave empty unless this article was originally published elsewhere.", type: "url", group: "seo" }),
    defineField({ name: "noIndex", title: "Hide from search engines", type: "boolean", group: "seo", initialValue: false }),
    defineField({ name: "socialImage", title: "Social sharing image", description: "Optional 1200 × 630 image. Featured image is used by default.", type: "image", group: "seo", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })] }),
    defineField({ name: "relatedServices", title: "Related services", type: "array", group: "connections", of: [defineArrayMember({ type: "string" })], options: { list: serviceOptions, layout: "grid" }, validation: (rule) => rule.unique() }),
    defineField({ name: "relatedPosts", title: "Related articles", type: "array", group: "connections", of: [defineArrayMember({ type: "reference", to: [{ type: "post" }], options: { disableNew: true } })], validation: (rule) => rule.unique().max(3) }),
    defineField({
      name: "faqs",
      title: "Article FAQs",
      description: "Optional questions shown below the article and included in FAQ structured data.",
      type: "array",
      group: "connections",
      of: [defineArrayMember({ name: "faq", title: "FAQ", type: "object", fields: [defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }), defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (rule) => rule.required() })], preview: { select: { title: "question", subtitle: "answer" } } })],
    }),
  ],
  orderings: [{ title: "Published date, newest", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", media: "featuredImage", author: "author.name", date: "publishedAt" },
    prepare: ({ title, media, author, date }) => ({ title, media, subtitle: [author, date ? new Date(date).toLocaleDateString("en-GB") : null].filter(Boolean).join(" · ") }),
  },
});
