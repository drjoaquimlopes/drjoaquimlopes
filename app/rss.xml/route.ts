import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      const pubDate = post.date
        ? new Date(post.date).toUTCString()
        : new Date().toUTCString();
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");
      const image = post.cover
        ? `<enclosure url="${site.url}${post.cover}" type="image/jpeg" />`
        : "";
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(post.author)}</dc:creator>
      ${categories}${image}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Blog do Dr. Joaquim Lopes</title>
    <link>${site.url}/blog</link>
    <description>Artigos sobre ortopedia, cirurgia do joelho e medicina esportiva pelo Dr. Joaquim Lopes.</description>
    <language>pt-BR</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
