import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost, getPostSlugs } from "@/lib/blog";
import { formatDatePtBr } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { ArrowRight, Instagram } from "@/components/icons";
import { ReadingProgress } from "@/components/ReadingProgress";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  // Toda página compartilhada precisa de uma imagem; sem capa (ex.: post em
  // vídeo), usa a imagem padrão do site.
  const ogImage = post.cover ?? "/assets/images/dr/1.jpg";
  const ogImageWidth = post.cover ? post.coverW : 1200;
  const ogImageHeight = post.cover ? post.coverH : 800;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: ogImageWidth,
          height: ogImageHeight,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [{ url: ogImage, width: ogImageWidth, height: ogImageHeight }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const articleImage = post.cover ?? "/assets/images/dr/1.jpg";
  const relatedPosts = getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      ...candidate,
      relevance: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.relevance - a.relevance || (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: `${site.url}/blog/${post.slug}`,
    image: `${site.url}${articleImage}`,
    author: { "@type": "Person", name: post.author, "@id": `${site.url}/#medico` },
    publisher: { "@id": `${site.url}/#medico` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blog/${post.slug}` },
    keywords: post.tags.join(", "),
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    about: post.tags.map((tag) => ({ "@type": "Thing", name: tag })),
  };

  return (
    <>
      <ReadingProgress />
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <article className="px-5 pb-20 pt-[calc(72px+56px)] sm:px-8 lg:px-12 lg:pb-24 lg:pt-[calc(96px+64px)]">
        <div className="mx-auto max-w-[760px]">
          <nav className="mb-6 text-[13px] text-muted" aria-label="Breadcrumb">
            <Link href="/" className="link-underline text-p">
              Início
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/blog" className="link-underline text-p">
              Blog
            </Link>
          </nav>

          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted">
            <time dateTime={post.date}>{formatDatePtBr(post.date)}</time>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-bg-alt px-3 py-1 text-xs font-semibold text-p transition-colors duration-300 hover:border-p-light hover:bg-p-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mb-4 text-h1 font-extrabold text-dark">{post.title}</h1>
          <p className="mb-8 text-lead text-muted">{post.description}</p>

          <div className="mb-8 flex flex-col gap-1 rounded-[14px] border border-line bg-bg-alt px-5 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              Conteúdo por{" "}
              <Link href="/sobre" className="font-bold text-p hover:underline">
                Dr. Joaquim Lopes
              </Link>
              , Ortopedista e Traumatologista
            </p>
            <p className="shrink-0 text-xs">CRM-SP 171205 · RQE 113362</p>
          </div>

          {post.video ? (
            <div className="mx-auto mb-10 max-w-[520px] overflow-hidden rounded-[18px] shadow-hover">
              <video
                src={post.video}
                controls
                playsInline
                preload="metadata"
                className="h-auto w-full"
              />
            </div>
          ) : post.cover ? (
            <div className="mx-auto mb-10 max-w-[520px] overflow-hidden rounded-[18px] shadow-hover">
              <Image
                src={post.cover}
                alt={post.title}
                width={post.coverW}
                height={post.coverH}
                priority
                sizes="(max-width: 559px) calc(100vw - 40px), 520px"
                className="h-auto w-full"
              />
            </div>
          ) : null}

          <div className="prose-article">
            <MDXRemote source={post.content} />
          </div>

          <aside className="mt-10 rounded-[14px] border border-line bg-bg-alt p-5 text-sm leading-relaxed text-muted">
            Este conteúdo é informativo e não substitui consulta, exame físico ou
            diagnóstico individual. Em caso de trauma importante, dor intensa ou
            incapacidade de apoiar o membro, procure atendimento médico.
          </aside>

          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-10 flex flex-col items-center gap-5">
              {post.gallery.map((src, i) => (
                <figure
                  key={src}
                  className="w-full max-w-[560px] overflow-hidden rounded-[18px] border border-line shadow-soft"
                >
                  <Image
                    src={src}
                    alt={`${post.title} - imagem ${i + 1}`}
                    width={1080}
                    height={1080}
                    sizes="(max-width: 599px) calc(100vw - 40px), 560px"
                    className="h-auto w-full"
                  />
                </figure>
              ))}
            </div>
          )}

          {post.instagram && (
            <a
              href={post.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#e1306c] to-[#f77737] px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(225,48,108,0.35)]"
            >
              <Instagram width={20} height={20} />
              Ver publicação no Instagram
            </a>
          )}

          <hr className="my-12 border-line" />

          <section aria-labelledby="conteudos-relacionados" className="mb-12">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <h2
                id="conteudos-relacionados"
                className="text-h3 font-extrabold text-dark md:text-[1.75rem]"
              >
                Conteúdos relacionados
              </h2>
              <Link
                href="/joelho"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-p hover:underline"
              >
                Ver guia de saúde do joelho
                <ArrowRight width={15} height={15} strokeWidth={2} />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="card-lift rounded-[12px] border border-line bg-white p-4 text-sm font-bold leading-snug text-dark hover:text-p"
                >
                  {related.title}
                </Link>
              ))}
            </div>
          </section>

          <div className="flex flex-col items-start gap-4 rounded-[18px] bg-bg-alt p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-h3 font-bold text-dark">
                Ficou com alguma dúvida?
              </p>
              <p className="text-sm text-muted">
                Agende uma consulta com o Dr. Joaquim Lopes.
              </p>
            </div>
            <Link
              href="/pre-agendamento"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-p px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-p-dark"
            >
              Agendar consulta
              <ArrowRight width={17} height={17} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
