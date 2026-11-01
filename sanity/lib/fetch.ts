import { sanityClient } from "./client";
import { blogSettingsQuery, categoriesQuery, categoryBySlugQuery, categorySlugsQuery, footerCategoriesQuery, postBySlugQuery, postSlugsQuery, postsByCategoryQuery, postsQuery } from "./queries";
import type { BlogCategory, BlogPost, BlogPostSummary, BlogSettings } from "./types";

async function fetchSafely<T>(query: string, fallback: T, params: Record<string, unknown> = {}): Promise<T> {
  if (!sanityClient) return fallback;

  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    console.warn("Sanity content could not be loaded during this build.", error);
    return fallback;
  }
}

export function getBlogPosts() {
  return fetchSafely<BlogPostSummary[]>(postsQuery, []);
}

export function getBlogPost(slug: string) {
  return fetchSafely<BlogPost | null>(postBySlugQuery, null, { slug });
}

export function getBlogPostSlugs() {
  return fetchSafely<string[]>(postSlugsQuery, []);
}

export function getBlogCategories() {
  return fetchSafely<BlogCategory[]>(categoriesQuery, []);
}

export function getFooterBlogCategories() {
  return fetchSafely<BlogCategory[]>(footerCategoriesQuery, []);
}

export function getBlogCategorySlugs() {
  return fetchSafely<string[]>(categorySlugsQuery, []);
}

export function getBlogCategory(slug: string) {
  return fetchSafely<BlogCategory | null>(categoryBySlugQuery, null, { slug });
}

export function getBlogPostsByCategory(categoryId: string) {
  return fetchSafely<BlogPostSummary[]>(postsByCategoryQuery, [], { categoryId });
}

export function getBlogSettings() {
  return fetchSafely<BlogSettings | null>(blogSettingsQuery, null);
}
