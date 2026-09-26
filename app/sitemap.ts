import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();
  const newestPost = posts[0]?.date ? new Date(posts[0].date) : now;

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: new Date("2026-09-25"), changeFrequency: "monthly", priority: 1.0 },
    { url: `${site.url}/sobre`, lastModified: new Date("2026-07-14"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/joelho`, lastModified: new Date("2026-09-25"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/especialidade`, lastModified: new Date("2026-09-25"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/pre-agendamento`, lastModified: new Date("2026-09-25"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/politica-de-privacidade`, lastModified: new Date("2026-09-25"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/blog`, lastModified: newestPost, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
    ...(post.cover ? { images: [`${site.url}${post.cover}`] } : {}),
  }));

  return [...staticPages, ...postPages];
}
