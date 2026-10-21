import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { services } from "@/lib/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.siteUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.siteUrl}/end-of-tenancy-cleaning-checklist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteConfig.siteUrl}/areas-we-cover`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteConfig.siteUrl}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteConfig.siteUrl}/faqs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.siteUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteConfig.siteUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.siteUrl}/complaints`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

  return [
    ...staticPages,
    ...services.map((service) => ({ url: `${siteConfig.siteUrl}/services/${service.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: service.category === "Cleaning" ? 0.9 : 0.8 })),
  ];
}
