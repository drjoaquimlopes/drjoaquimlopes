import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero, Accent } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { getAllPosts, postAuthorSchema } from "@/lib/blog";
import { FeaturedArticles } from "@/components/FeaturedArticles";
import { formatDatePtBr } from "@/lib/format";
import { site } from "@/lib/site";
import { Book } from "@/components/icons";

export const metadata: Metadata = {
  title: "Blog de Ortopedia e Joelho",
  description:
    "Artigos e guias informativos sobre ortopedia, cirurgia do joelho, lesões esportivas, prevenção e recuperação.",
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
  twitter: {
    card: "summary_large_image",
    title: "Blog de Ortopedia e Joelho | Dr. Joaquim Lopes",
    description:
      "Conteúdo sobre ortopedia, cirurgia do joelho e recuperação pelo Dr. Joaquim Lopes.",
    images: ["/assets/images/dr/1.jpg"],
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
      author: postAuthorSchema(p.author),
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

      <FeaturedArticles />
      <section className="border-t border-line px-5 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="mb-8 text-h2 font-bold text-dark">Mais sobre joelho e movimento</h2>
          {posts.length === 0 ? (
            <div className="mx-auto max-w-md rounded-[18px] border border-line bg-bg-alt p-12 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-p-muted">
                <Book width={30} height={30} className="text-p" />
              </div>
              <h2 className="mb-2.5 text-h3 font-bold text-dark">
                Conteúdo em breve
              </h2>
              <p className="text-muted">
                Estamos preparando artigos sobre ortopedia e cirurgia do joelho.
                Volte em breve para conferir.
              </p>
            </div>
          ) : (
            <div className="reveal-group grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {posts.filter((post) => !post.featured).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="reveal card-lift group flex flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-soft"
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
                    <h2 className="mb-2 text-h3 font-bold leading-snug text-dark transition-colors duration-300 group-hover:text-p">
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
