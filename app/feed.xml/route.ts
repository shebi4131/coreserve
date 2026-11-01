import { getBlogPosts } from "@/sanity/lib/fetch";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function xmlEscape(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] || character);
}

export async function GET() {
  const posts = await getBlogPosts();
  const items = posts.map((post) => `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${siteConfig.siteUrl}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${siteConfig.siteUrl}/blog/${post.slug}/</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${xmlEscape(post.excerpt)}</description>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(siteConfig.name)} Blog</title>
    <link>${siteConfig.siteUrl}/blog/</link>
    <description>Professional cleaning advice and property guidance from ${xmlEscape(siteConfig.name)}.</description>
    <language>en-gb</language>${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
