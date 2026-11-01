import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { siteConfig } from "@/lib/site";
import { getBlogCategory, getBlogCategorySlugs, getBlogPostsByCategory } from "@/sanity/lib/fetch";

type CategoryPageProps = { params: Promise<{ slug: string }> };
const emptyCmsSlug = "_cms-not-configured";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getBlogCategorySlugs();
  return (slugs.length ? slugs : [emptyCmsSlug]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getBlogCategory(slug);
  if (!category) return { title: "Category not found", robots: { index: false, follow: false } };

  const title = `${category.title} Cleaning Advice`;
  const description = category.description || `Browse practical ${category.title.toLowerCase()} articles and professional cleaning guidance from CoreServe Facilities Group.`;
  const url = `/blog/category/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getBlogCategory(slug);
  if (!category?._id) notFound();

  const posts = await getBlogPostsByCategory(category._id);
  const categoryUrl = `${siteConfig.siteUrl}/blog/category/${category.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": categoryUrl,
        name: `${category.title} Cleaning Advice`,
        description: category.description,
        url: categoryUrl,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.map((post, index) => ({ "@type": "ListItem", position: index + 1, url: `${siteConfig.siteUrl}/blog/${post.slug}`, name: post.title })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: category.title, item: categoryUrl },
        ],
      },
    ],
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="blog-category-hero">
        <div className="shell">
          <Link className="article-back" href="/blog"><ArrowLeft size={17} /> All cleaning advice</Link>
          <span className="eyebrow eyebrow--light">Advice category</span>
          <h1>{category.title}</h1>
          <p>{category.description || `Practical ${category.title.toLowerCase()} guidance from CoreServe Facilities Group.`}</p>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">{posts.length} {posts.length === 1 ? "article" : "articles"}</span>
            <h2>Guidance filed under {category.title.toLowerCase()}.</h2>
          </div>
          {posts.length ? <div className="blog-grid">{posts.map((post) => <BlogCard post={post} key={post._id} />)}</div> : (
            <div className="blog-empty"><BookOpen size={34} /><h2>More guidance is coming soon.</h2><p>Explore all cleaning advice while this category is being expanded.</p><Link className="button button--primary" href="/blog">View all articles <ArrowRight size={18} /></Link></div>
          )}
        </div>
      </section>
    </main>
  );
}
