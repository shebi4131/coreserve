import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { services } from "@/lib/services";
import { getBlogCategories, getBlogPosts } from "@/sanity/lib/fetch";

export const dynamic = "force-static";

function canonicalUrl(path = "/") {
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;
  return new URL(normalizedPath, `${siteConfig.siteUrl}/`).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: canonicalUrl(), lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: canonicalUrl("/services"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: canonicalUrl("/end-of-tenancy-cleaning-checklist"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: canonicalUrl("/areas-we-cover"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: canonicalUrl("/about"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: canonicalUrl("/faqs"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: canonicalUrl("/contact"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: canonicalUrl("/blog"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: canonicalUrl("/privacy"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: canonicalUrl("/terms"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: canonicalUrl("/complaints"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

  return [
    ...staticPages,
    ...services.map((service) => ({ url: canonicalUrl(`/services/${service.slug}`), lastModified: new Date(), changeFrequency: "monthly" as const, priority: service.category === "Cleaning" ? 0.9 : 0.8 })),
    ...posts.filter((post) => post.slug).map((post) => ({
      url: canonicalUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.filter((category) => category.slug).map((category) => ({
      url: canonicalUrl(`/blog/category/${category.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
  ];
}
