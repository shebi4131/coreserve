import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";

export const blogSettingsType = defineType({
  name: "blogSettings",
  title: "Blog settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({ name: "heading", title: "Blog heading", type: "string", initialValue: "Cleaning advice and property guidance", validation: (rule) => rule.required().max(90) }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 3, validation: (rule) => rule.required().max(280) }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string", validation: (rule) => rule.max(60).warning("Aim for 50–60 characters.") }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3, validation: (rule) => rule.max(160).warning("Keep this below 160 characters.") }),
  ],
  preview: { prepare: () => ({ title: "Blog settings" }) },
});
