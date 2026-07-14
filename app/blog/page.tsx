import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero, Accent } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/blog";
import { formatDatePtBr } from "@/lib/format";
import { site } from "@/lib/site";
import { Book } from "@/components/icons";

export const metadata: Metadata = {
  title: "Blog de Ortopedia e Joelho",
  description:
    "Artigos do Dr. Joaquim Lopes sobre ortopedia, cirurgia do joelho, lesões esportivas, prevenção e recuperação.",
  keywords: [
    "blog ortopedia",
    "cirurgia do joelho",
    "lesão de joelho",
    "medicina esportiva",
    "dr joaquim lopes",
  ],
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "Blog do Dr. Joaquim Lopes" },
      ],
    },
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog | Dr. Joaquim Lopes",
    description:
      "Conteúdo sobre ortopedia, cirurgia do joelho e recuperação pelo Dr. Joaquim Lopes.",
    images: [
      {
        url: "/assets/images/dr/1.jpg",
        width: 1200,
        height: 800,
        alt: "Blog de ortopedia e cirurgia do joelho",
      },
    ],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}/blog`,
    name: "Blog do Dr. Joaquim Lopes",
    description:
      "Artigos sobre ortopedia, cirurgia do joelho e medicina esportiva.",
    url: `${site.url}/blog`,
    publisher: { "@id": `${site.url}/#medico` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${site.url}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.date,
      description: p.description,
      author: { "@id": `${site.url}/#medico` },
      ...(p.cover ? { image: `${site.url}${p.cover}` } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={blogJsonLd} />
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <PageHero
        breadcrumb="Blog"
        title={
          <>
            Conteúdo sobre <Accent>ortopedia e joelho</Accent>
          </>
        }
        description="Artigos sobre cirurgia do joelho, lesões esportivas, tratamentos e recuperação, para ajudar você a entender melhor sua saúde."
      />

      <section className="px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1120px]">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-md rounded-[18px] border border-line bg-bg-alt p-12 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-p-muted">
                <Book width={30} height={30} className="text-p" />
              </div>
              <h2 className="mb-2.5 text-2xl font-bold text-dark">
                Conteúdo em breve
              </h2>
              <p className="text-muted">
                Estamos preparando artigos sobre ortopedia e cirurgia do joelho.
                Volte em breve para conferir.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`reveal reveal-d${(i % 3) + 1} group flex flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover`}
                >
                  <div className="relative aspect-square overflow-hidden bg-p-muted">
                    {post.video ? (
                      <>
                        <video
                          src={`${post.video}#t=0.1`}
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="ml-1 text-p"
                              aria-hidden
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </span>
                      </>
                    ) : post.cover ? (
                      <Image
                        src={post.cover}
                        alt={post.title}
                        width={600}
                        height={600}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, calc(100vw - 40px)"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-p-muted to-p-light">
                        <Book width={40} height={40} className="text-p/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <time dateTime={post.date}>{formatDatePtBr(post.date)}</time>
                      {post.tags[0] && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="font-semibold text-p">{post.tags[0]}</span>
                        </>
                      )}
                    </div>
                    <h2 className="mb-2 text-xl font-bold leading-snug text-dark transition-colors group-hover:text-p">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
