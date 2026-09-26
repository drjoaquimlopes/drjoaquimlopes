/**
 * Leitura dos posts do blog em MDX (content/blog/*.mdx).
 * Cada arquivo tem frontmatter: title, description, date, cover?, tags?, draft?, author?
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { site } from "./site";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO (YYYY-MM-DD)
  cover?: string;
  /** dimensões reais da capa (para proporção correta); padrão 1080x1080 */
  coverW: number;
  coverH: number;
  /** vídeo (mp4) exibido no lugar da capa, quando presente */
  video?: string;
  /** galeria (carrossel) exibida no corpo do post */
  gallery?: string[];
  /** link do post no Instagram do médico */
  instagram?: string;
  tags: string[];
  author: string;
  draft: boolean;
  featured: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & { content: string };

function readDir(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
}

function parseFile(file: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
    cover: data.cover ?? undefined,
    coverW: typeof data.coverW === "number" ? data.coverW : 1080,
    coverH: typeof data.coverH === "number" ? data.coverH : 1080,
    video: data.video ?? undefined,
    gallery: Array.isArray(data.gallery) ? data.gallery : undefined,
    instagram: data.instagram ?? undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author ?? "Dr. Joaquim Lopes",
    draft: Boolean(data.draft),
    featured: Boolean(data.featured),
    readingMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)),
    content,
  };
}

function toPostMeta(post: Post): PostMeta {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    cover: post.cover,
    coverW: post.coverW,
    coverH: post.coverH,
    video: post.video,
    gallery: post.gallery,
    instagram: post.instagram,
    tags: post.tags,
    author: post.author,
    draft: post.draft,
    featured: post.featured,
    readingMinutes: post.readingMinutes,
  };
}

/** Lista de posts publicados (exclui rascunhos), mais recentes primeiro. */
export function getAllPosts(): PostMeta[] {
  return readDir()
    .map(parseFile)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(toPostMeta);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getPost(slug: string): Post | null {
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return null;
  const post = parseFile(file);
  if (post.draft) return null;
  return post;
}

export function postAuthorSchema(author: string) {
  return author === "Dr. Joaquim Lopes"
    ? { "@type": "Person", name: author, "@id": `${site.url}/#medico` }
    : { "@type": "Organization", name: "Site do Dr. Joaquim Lopes" };
}
