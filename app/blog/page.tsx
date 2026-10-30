import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPosts, getBlogSettings } from "@/sanity/lib/fetch";
import { siteConfig } from "@/lib/site";

const defaultDescription = "Practical cleaning advice, property preparation checklists and professional guidance from CoreServe Facilities Group.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBlogSettings();
  const title = settings?.seoTitle || "Cleaning Advice & Property Guides";
  const description = settings?.seoDescription || defaultDescription;
  return {
    title,
    description,
    alternates: { canonical: "/blog", types: { "application/rss+xml": `${siteConfig.siteUrl}/feed.xml` } },
    openGraph: { type: "website", title, description, url: "/blog" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getBlogPosts(), getBlogSettings()]);
  const featured = posts.find((post) => post.featured) || posts[0];
  const remaining = featured ? posts.filter((post) => post._id !== featured._id) : [];

  return (
    <main id="main-content">
      <section className="blog-hero">
        <div className="shell blog-hero__grid">
          <div>
            <span className="eyebrow eyebrow--light">CoreServe knowledge centre</span>
            <h1>{settings?.heading || "Cleaning advice and property guidance"}</h1>
            <p>{settings?.introduction || "Practical guidance for homeowners, tenants, landlords, letting agents and businesses—from preparing for a clean to maintaining a property between visits."}</p>
          </div>
          <div className="blog-hero__mark" aria-hidden="true"><BookOpen /></div>
        </div>
      </section>

      {featured ? (
        <>
          <section className="section section--pale">
            <div className="shell">
              <span className="eyebrow">Featured guidance</span>
              <BlogCard post={featured} featured />
            </div>
          </section>
          {remaining.length ? (
            <section className="section">
              <div className="shell">
                <div className="section-heading"><span className="eyebrow">Latest articles</span><h2>Useful advice for cleaner, better-prepared spaces.</h2></div>
                <div className="blog-grid">{remaining.map((post) => <BlogCard post={post} key={post._id} />)}</div>
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <section className="section">
          <div className="shell blog-empty">
            <BookOpen size={34} aria-hidden="true" />
            <h2>Helpful articles are being prepared.</h2>
            <p>Our cleaning guides and property checklists will appear here soon. In the meantime, tell us what you need and we will help you plan the right service.</p>
            <Link className="button button--primary" href="/contact">Request a quote <ArrowRight size={18} /></Link>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="shell cta-band__inner">
          <div><span className="eyebrow eyebrow--light">Need practical advice?</span><h2>Discuss your property and cleaning requirements.</h2></div>
          <div className="cta-band__actions"><a className="button button--outline-light" href={siteConfig.social.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp us</a><Link className="button button--primary" href="/contact">Get a free quote <ArrowRight size={18} /></Link></div>
        </div>
      </section>
    </main>
  );
}
