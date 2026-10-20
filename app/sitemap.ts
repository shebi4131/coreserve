import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.siteUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.siteUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
  ];
}
