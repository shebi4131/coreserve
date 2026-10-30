import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Authors",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 80 }, validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Role", type: "string", initialValue: "CoreServe Facilities Group" }),
    defineField({ name: "bio", title: "Biography", type: "text", rows: 4, validation: (rule) => rule.max(400) }),
    defineField({
      name: "image",
      title: "Profile image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required() })],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
