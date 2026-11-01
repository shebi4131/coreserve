import { siteConfig } from "@/lib/site";
import { imageUrl } from "@/sanity/lib/image";
import type { BlogPost } from "@/sanity/lib/types";

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function BlogJsonLd({ post }: { post: BlogPost }) {
  const articleUrl = `${siteConfig.siteUrl}/blog/${post.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${articleUrl}#article`,
      headline: post.title,
      description: post.seoDescription || post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      mainEntityOfPage: articleUrl,
      image: imageUrl(post.socialImage || post.featuredImage, 1200, 630),
      author: { "@type": "Person", name: post.author?.name || siteConfig.name },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        logo: { "@type": "ImageObject", url: `${siteConfig.siteUrl}/brand/coreserve-logo.png` },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
      ],
    },
  ];

  if (post.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
    });
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson({ "@context": "https://schema.org", "@graph": graph }) }} />;
}
