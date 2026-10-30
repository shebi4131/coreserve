import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogImage } from "./BlogImage";
import type { BlogPostSummary } from "@/sanity/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function BlogCard({ post, featured = false }: { post: BlogPostSummary; featured?: boolean }) {
  return (
    <article className={`blog-card${featured ? " blog-card--featured" : ""}`}>
      <Link className="blog-card__media" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
        <BlogImage image={post.featuredImage} width={featured ? 1200 : 760} height={featured ? 720 : 475} />
      </Link>
      <div className="blog-card__content">
        <div className="blog-card__meta">
          <time dateTime={post.publishedAt}>{dateFormatter.format(new Date(post.publishedAt))}</time>
          {post.categories?.[0] ? <span>{post.categories[0].title}</span> : null}
        </div>
        <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
        <p>{post.excerpt}</p>
        <Link className="text-link" href={`/blog/${post.slug}`}>Read article <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
