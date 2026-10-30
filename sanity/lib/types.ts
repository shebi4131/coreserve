import type { PortableTextBlock } from "@portabletext/react";

export type SanityImage = {
  _type?: "image" | "articleImage";
  alt?: string;
  caption?: string;
  asset?: {
    _id?: string;
    url?: string;
    metadata?: { dimensions?: { width?: number; height?: number; aspectRatio?: number } };
  };
  crop?: Record<string, number>;
  hotspot?: Record<string, number>;
};

export type BlogAuthor = { name: string; role?: string; bio?: string; image?: SanityImage };
export type BlogCategory = { title: string; slug: string };
export type BlogFaq = { _key?: string; question: string; answer: string };
export type BlogCallout = { _type: "callout"; _key: string; title?: string; text: string };
export type BlogBody = Array<PortableTextBlock | SanityImage | BlogCallout>;

export type BlogPostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  featuredImage?: SanityImage;
  author?: BlogAuthor;
  categories?: BlogCategory[];
};

export type BlogPost = BlogPostSummary & {
  body: BlogBody;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  socialImage?: SanityImage;
  relatedServices?: string[];
  relatedPosts?: BlogPostSummary[];
  faqs?: BlogFaq[];
};

export type BlogSettings = {
  heading?: string;
  introduction?: string;
  seoTitle?: string;
  seoDescription?: string;
};
