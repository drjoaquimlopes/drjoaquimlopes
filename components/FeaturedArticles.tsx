import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { ArrowRight } from "./icons";

export function FeaturedArticles() {
  const posts = getAllPosts().filter((post) => post.featured).slice(0, 3);
  if (!posts.length) return null;
  return (
    <section aria-labelledby="patient-guides" className="bg-[#f3f6f8] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-xl"><p className="mb-3 text-sm font-semibold text-p">Para ler antes da consulta</p><h2 id="patient-guides" className="text-h2 font-bold text-dark">Mais clareza para o próximo passo.</h2></div>
          <Link href="/joelho" className="inline-flex min-h-11 items-center gap-2 font-semibold text-p">Explorar o guia do joelho <ArrowRight width={18} height={18} /></Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post) => <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col rounded-2xl border border-p/15 bg-white p-6 hover:border-p sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-muted"><span className="rounded-full bg-p-muted px-3 py-1.5 font-semibold text-p">{post.tags[0]}</span><span>{post.readingMinutes} min de leitura</span></div>
            <h3 className="mb-4 text-[1.375rem] font-bold leading-snug text-dark group-hover:text-p">{post.title}</h3>
            <p className="mb-8 text-[15px] leading-relaxed text-muted">{post.description}</p>
            <span className="mt-auto flex items-center justify-between border-t border-line pt-5 text-sm font-semibold text-p">Ler orientação <ArrowRight width={19} height={19} /></span>
          </Link>)}
        </div>
      </div>
    </section>
  );
}
