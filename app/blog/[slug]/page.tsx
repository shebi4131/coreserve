import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogImage } from "@/components/blog/BlogImage";
import { BlogJsonLd } from "@/components/blog/BlogJsonLd";
import { PortableArticle } from "@/components/blog/PortableArticle";
import { getBlogPost, getBlogPostSlugs } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { services } from "@/lib/services";

type BlogPostPageProps = { params: Promise<{ slug: string }> };
const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
const emptyCmsSlug = "_cms-not-configured";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  // Next static export requires at least one parameter. The reserved fallback
  // renders through notFound() and is never linked or included in the sitemap.
  return (slugs.length ? slugs : [emptyCmsSlug]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: false } };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const socialImage = imageUrl(post.socialImage || post.featuredImage, 1200, 630);
  return {
    title,
    description,
    authors: [{ name: post.author?.name || "CoreServe Facilities Group" }],
    alternates: { canonical: post.canonicalUrl || `/blog/${post.slug}` },
    robots: post.noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: post.socialImage?.alt || post.featuredImage?.alt || post.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: socialImage ? [socialImage] : undefined },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const readingMinutes = Math.max(2, Math.ceil(JSON.stringify(post.body || []).length / 1100));
  const relatedServices = services.filter((service) => post.relatedServices?.includes(service.slug));

  return (
    <main id="main-content">
      <BlogJsonLd post={post} />
      <article>
        <header className="article-hero">
          <div className="shell article-hero__inner">
            <Link className="article-back" href="/blog"><ArrowLeft size={17} /> All articles</Link>
            {post.categories?.length ? <div className="article-categories">{post.categories.map((category) => <span key={category.slug}>{category.title}</span>)}</div> : null}
            <h1>{post.title}</h1>
            <p className="article-deck">{post.excerpt}</p>
            <div className="article-meta">
              <span><CalendarDays size={17} /> <time dateTime={post.publishedAt}>{dateFormatter.format(new Date(post.publishedAt))}</time></span>
              <span><Clock3 size={17} /> {readingMinutes} min read</span>
              <span><UserRound size={17} /> {post.author?.name || "CoreServe Facilities Group"}</span>
            </div>
          </div>
        </header>

        <div className="shell article-featured-image"><BlogImage image={post.featuredImage} width={1400} height={820} loading="eager" /></div>

        <div className="shell article-layout">
          <div className="article-body"><PortableArticle value={post.body || []} /></div>
          <aside className="article-sidebar">
            <div><span className="eyebrow eyebrow--compact">Need a quotation?</span><h2>Tell us about your property.</h2><p>Share the postcode, property details and preferred date for a clear, itemised response.</p><Link className="button button--primary" href="/contact">Request a quote <ArrowRight size={17} /></Link></div>
          </aside>
        </div>
      </article>

      {post.faqs?.length ? (
        <section className="section section--pale article-faqs">
          <div className="shell faq-layout"><div className="faq-layout__intro"><span className="eyebrow">Useful details</span><h2>Questions about this topic.</h2></div><div className="faq-list">{post.faqs.map((faq) => <details key={faq._key || faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div>
        </section>
      ) : null}

      {relatedServices.length ? (
        <section className="section">
          <div className="shell"><div className="section-heading"><span className="eyebrow">Related cleaning services</span><h2>Professional support for your property.</h2></div><div className="article-service-links">{relatedServices.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}><service.icon size={24} /><span><strong>{service.shortTitle}</strong><small>{service.summary}</small></span><ArrowRight size={18} /></Link>)}</div></div>
        </section>
      ) : null}

      {post.relatedPosts?.length ? (
        <section className="section section--pale"><div className="shell"><div className="section-heading"><span className="eyebrow">Continue reading</span><h2>Related cleaning guidance.</h2></div><div className="blog-grid">{post.relatedPosts.map((related) => <BlogCard post={related} key={related._id} />)}</div></div></section>
      ) : null}
    </main>
  );
}
