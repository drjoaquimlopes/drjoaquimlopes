"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { GoogleReviews as Reviews } from "@/lib/google-reviews-data";
import { site } from "@/lib/site";

function Stars({ rating }: { rating: number }) {
  return <span className="inline-flex gap-0.5 text-[#8a5a12]" role="img" aria-label={`${rating.toLocaleString("pt-BR")} de 5 estrelas`}>
    {[1, 2, 3, 4, 5].map(star => <span key={star} className="relative inline-flex h-4 w-4" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3.2 9.6l6.2-.9Z" /></svg>
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, rating - star + 1)) * 100}%` }}><svg className="max-w-none" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5"><path d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3.2 9.6l6.2-.9Z" /></svg></span>
    </span>)}
  </span>;
}

export function GoogleReviews() {
  const host = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Reviews | null>(null);
  const [status, setStatus] = useState<"waiting" | "loading" | "ready" | "unavailable">("waiting");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let active = true;
    let visible = false;
    let loading = false;
    let fetchedAt = 0;
    let refresh: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    async function load() {
      if (!active || loading) return;
      loading = true;
      setStatus("loading");
      try {
        const response = await fetch("/api/google-reviews", { cache: "no-store", credentials: "omit", signal: controller.signal });
        if (!response.ok) throw new Error("unavailable");
        const result: Reviews = await response.json();
        if (!Array.isArray(result.reviews) || !Number.isFinite(result.averageRating) || !Number.isFinite(result.totalReviewCount) || !Number.isFinite(result.fetchedAt)) throw new Error("invalid_response");
        if (!active) return;
        fetchedAt = result.fetchedAt;
        setData(result); setStatus("ready");
        clearTimeout(refresh);
        refresh = setTimeout(() => { if (visible && !document.hidden) void load(); else { setData(null); setStatus("waiting"); } }, Math.max(60_000, result.fetchedAt + 3_600_000 - Date.now()));
      } catch {
        if (active) { setData(null); setStatus("unavailable"); }
      } finally { loading = false; }
    }
    const onVisibility = () => { if (!document.hidden && visible && Date.now() - fetchedAt >= 3_600_000) void load(); };
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible && Date.now() - fetchedAt >= 3_600_000) void load();
    }, { rootMargin: "350px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { active = false; controller.abort(); observer.disconnect(); clearTimeout(refresh); document.removeEventListener("visibilitychange", onVisibility); };
  }, [attempt]);

  return <div ref={host} className="mt-8" aria-busy={status === "loading"}>
    {data && data.totalReviewCount > 0 ? <>
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <strong className="text-2xl text-dark" aria-label={`Nota ${data.averageRating.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} de 5`}>{data.averageRating.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}<span className="ml-1 text-sm font-normal text-muted">/ 5</span></strong>
        <Stars rating={data.averageRating} />
        <span className="text-muted">{data.totalReviewCount.toLocaleString("pt-BR")} {data.totalReviewCount === 1 ? "avaliação no Google" : "avaliações no Google"}</span>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-muted">Avaliações recentes, ordenadas pela última atualização no Google.</p>
      <div className="grid items-start gap-4 lg:grid-cols-3">
        {data.reviews.map(review => <article key={review.id} className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <header className="mb-4 flex items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-p-muted text-sm font-semibold text-p">{review.author.trim().split(/\s+/).slice(0, 2).map(word => Array.from(word)[0]).join("").toLocaleUpperCase("pt-BR")}</span>
            <div className="min-w-0"><h3 className="break-words text-sm font-semibold text-dark">{review.author}</h3><time className="text-xs text-muted" dateTime={review.date}>{new Date(review.date).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" })}</time></div>
          </header>
          <Stars rating={review.rating} />
          {review.comment ? <ReviewText text={review.comment} /> : <p className="mt-3 text-sm leading-relaxed text-muted">Avaliação publicada sem comentário.</p>}
          <a href={site.googleProfileUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center text-xs font-semibold text-p underline underline-offset-4" aria-label="Publicado no Google — abrir perfil para consultar as avaliações">Publicado no Google ↗</a>
        </article>)}
      </div>
    </> : status === "unavailable" ? <p className="text-sm leading-relaxed text-muted">Você pode consultar as avaliações diretamente no perfil do Google. <button type="button" className="min-h-11 cursor-pointer font-semibold text-p underline underline-offset-4" onClick={() => setAttempt(value => value + 1)}>Tentar carregar novamente</button></p> : (status === "waiting" || status === "loading") ? <div aria-hidden="true" className="grid gap-4 lg:grid-cols-3">{[1, 2, 3].map(key => <div key={key} className="min-h-[228px] rounded-2xl border border-line bg-white/70 p-6"><div className="mb-5 h-4 w-3/5 rounded bg-p-muted" /><div className="mb-3 h-3 w-1/3 rounded bg-p-muted" /><div className="mb-2 h-3 rounded bg-p-muted" /><div className="h-3 w-4/5 rounded bg-p-muted" /></div>)}</div> : null}
    <noscript><p className="text-sm text-muted">Consulte as avaliações pelo botão acima para abrir o perfil do Google.</p></noscript>
  </div>;
}

function ReviewText({ text }: { text: string }) {
  const content = useRef<HTMLParagraphElement>(null);
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const [clipped, setClipped] = useState(false);
  useEffect(() => {
    if (expanded || !content.current) return;
    const element = content.current;
    const check = () => setClipped(element.scrollHeight > element.clientHeight + 1);
    const observer = new ResizeObserver(check); observer.observe(element); check();
    return () => observer.disconnect();
  }, [expanded, text]);
  return <div className="mt-3 text-sm leading-relaxed text-muted"><blockquote className="whitespace-pre-line break-words"><p ref={content} id={id} className={expanded ? "" : "line-clamp-5"}>{text}</p></blockquote>{(clipped || expanded) && <button type="button" className="mt-2 min-h-11 cursor-pointer font-semibold text-p underline underline-offset-4" aria-controls={id} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? "Ler menos" : "Ler avaliação completa"}</button>}</div>;
}
