import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { getBlogCategories, getBlogPosts } from "@/sanity/lib/fetch";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()]);
  const latestPostUpdate = posts.reduce<string | undefined>((latest, post) => {
    const candidate = post.updatedAt || post.publishedAt;
    return !latest || new Date(candidate) > new Date(latest) ? candidate : latest;
  }, undefined);
  const staticPages: MetadataRoute.Sitemap = [
    { url: canonicalUrl(), changeFrequency: "monthly", priority: 1 },
    { url: canonicalUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: canonicalUrl("/end-of-tenancy-cleaning-checklist"), changeFrequency: "monthly", priority: 0.85 },
    { url: canonicalUrl("/areas-we-cover"), changeFrequency: "monthly", priority: 0.75 },
    { url: canonicalUrl("/about"), changeFrequency: "yearly", priority: 0.7 },
    { url: canonicalUrl("/faqs"), changeFrequency: "monthly", priority: 0.7 },
    { url: canonicalUrl("/contact"), changeFrequency: "yearly", priority: 0.8 },
    { url: canonicalUrl("/blog"), lastModified: latestPostUpdate ? new Date(latestPostUpdate) : undefined, changeFrequency: "weekly", priority: 0.8 },
    { url: canonicalUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: canonicalUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
    { url: canonicalUrl("/complaints"), changeFrequency: "yearly", priority: 0.4 },
  ];

  return [
    ...staticPages,
    ...services.map((service) => ({ url: canonicalUrl(`/services/${service.slug}`), changeFrequency: "monthly" as const, priority: service.category === "Cleaning" ? 0.9 : 0.8 })),
    ...posts.filter((post) => post.slug).map((post) => ({
      url: canonicalUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.filter((category) => category.slug).map((category) => {
      const categoryUpdate = posts
        .filter((post) => post.categories?.some((postCategory) => postCategory.slug === category.slug))
        .reduce<string | undefined>((latest, post) => {
          const candidate = post.updatedAt || post.publishedAt;
          return !latest || new Date(candidate) > new Date(latest) ? candidate : latest;
        }, undefined);

      return {
        url: canonicalUrl(`/blog/category/${category.slug}`),
        lastModified: categoryUpdate ? new Date(categoryUpdate) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      };
    }),
  ];
}
