"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { GoogleReview, GoogleReviews as Reviews } from "@/lib/google-reviews-data";
import { site } from "@/lib/site";

function subscribeColumns(callback: () => void) {
  const media = [matchMedia("(min-width: 640px)"), matchMedia("(min-width: 1024px)")];
  media.forEach(query => query.addEventListener("change", callback));
  return () => media.forEach(query => query.removeEventListener("change", callback));
}
const getColumns = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
const serverColumns = () => 3;

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
  const [cursor, setCursor] = useState(0);
  const columns = useSyncExternalStore(subscribeColumns, getColumns, serverColumns);
  const total = data?.reviews.length || 0;
  const start = Math.floor(Math.min(cursor, Math.max(0, total - 1)) / columns) * columns;
  const last = Math.floor(Math.max(0, total - 1) / columns) * columns;
  const carouselId = useId();
  const touch = useRef<{ x: number; y: number } | null>(null);
  const previous = () => setCursor(Math.max(0, start - columns));
  const next = () => setCursor(Math.min(last, start + columns));
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
        setData(result); setCursor(0); setStatus("ready");
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-lg text-xs leading-relaxed text-muted">Navegue pelas avaliações, da mais recente à mais antiga atualização no Google.</p>
        {total > 0 && <div className="flex items-center gap-3">
          <span className="min-w-20 text-center text-xs tabular-nums text-muted" role="status" aria-live="polite" aria-atomic="true">{start + 1}–{Math.min(start + columns, total)} de {total}</span>
          <button type="button" onClick={previous} disabled={start === 0} aria-label="Avaliações anteriores" aria-controls={carouselId} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-p/25 bg-white text-p transition-colors hover:bg-p-muted disabled:cursor-default disabled:opacity-40"><Chevron direction="left" /></button>
          <button type="button" onClick={next} disabled={start >= last} aria-label="Próximas avaliações" aria-controls={carouselId} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-p/25 bg-white text-p transition-colors hover:bg-p-muted disabled:cursor-default disabled:opacity-40"><Chevron direction="right" /></button>
        </div>}
      </div>
      <div id={carouselId} role="region" aria-label="Avaliações dos pacientes" aria-roledescription="carrossel" tabIndex={0}
        onKeyDown={event => { if (event.key === "ArrowLeft") { event.preventDefault(); previous(); } if (event.key === "ArrowRight") { event.preventDefault(); next(); } }}
        onTouchStart={event => { const point = event.touches[0]; touch.current = point ? { x: point.clientX, y: point.clientY } : null; }}
        onTouchEnd={event => { const point = event.changedTouches[0], origin = touch.current; touch.current = null; if (!point || !origin) return; const dx = point.clientX - origin.x, dy = point.clientY - origin.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) next(); else previous(); } }}
        className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.reviews.slice(start, start + columns).map(review => <article key={review.id} className="flex min-h-[360px] min-w-0 flex-col rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <header className="mb-4 flex min-h-12 items-center gap-3">
            <ReviewerPhoto key={review.photoUrl || review.id} review={review} />
            <div className="min-w-0"><h3 className="break-words text-sm font-semibold text-dark">{review.author}</h3><time className="text-xs text-muted" dateTime={review.date}>{new Date(review.date).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" })}</time></div>
          </header>
          <Stars rating={review.rating} />
          {review.comment ? <ReviewText text={review.comment} /> : <p className="mt-3 min-h-[172px] text-sm leading-relaxed text-muted">Avaliação publicada sem comentário.</p>}
          <a href={site.googleProfileUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 items-center self-start pt-4 text-xs font-semibold text-p underline underline-offset-4" aria-label="Publicado no Google — abrir perfil para consultar as avaliações">Publicado no Google ↗</a>
        </article>)}
      </div>
    </> : status === "unavailable" ? <p className="text-sm leading-relaxed text-muted">Você pode consultar as avaliações diretamente no perfil do Google. <button type="button" className="min-h-11 cursor-pointer font-semibold text-p underline underline-offset-4" onClick={() => setAttempt(value => value + 1)}>Tentar carregar novamente</button></p> : (status === "waiting" || status === "loading") ? <ReviewsPlaceholder /> : null}
    <noscript><p className="text-sm text-muted">Consulte as avaliações pelo botão acima para abrir o perfil do Google.</p></noscript>
  </div>;
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={direction === "left" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} /></svg>;
}

function ReviewsPlaceholder() {
  return <div aria-hidden="true">
    <div className="mb-5 h-8 w-60 max-w-full rounded bg-p-muted" />
    <div className="mb-5 h-24 rounded bg-p-muted/50 lg:h-11" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map(index => <div key={index} className={`min-h-[360px] rounded-2xl border border-line bg-white/70 p-6 ${index === 1 ? "hidden sm:block" : index === 2 ? "hidden lg:block" : ""}`}>
        <div className="mb-5 h-4 w-3/5 rounded bg-p-muted" /><div className="mb-3 h-3 w-1/3 rounded bg-p-muted" /><div className="mb-2 h-3 rounded bg-p-muted" /><div className="h-3 w-4/5 rounded bg-p-muted" />
      </div>)}
    </div>
  </div>;
}

function ReviewerPhoto({ review }: { review: GoogleReview }) {
  const [failed, setFailed] = useState(false);
  return <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-p-muted text-sm font-semibold text-p">
    {review.photoUrl && !failed ? <Image src={review.photoUrl} alt="" width={40} height={40} unoptimized loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" onError={() => setFailed(true)} /> : review.author.trim().split(/\s+/).slice(0, 2).map(word => Array.from(word)[0]).join("").toLocaleUpperCase("pt-BR")}
  </span>;
}

function ReviewText({ text }: { text: string }) {
  // The API appends Google's translation to the original review. Keep its
  // attribution with the translated text, revealed only by the reader.
  const translationIndex = text.search(/\r?\n\s*\((?:Translated by Google|Traduzido pelo Google)\)/i);
  const originalPrefix = translationIndex > 0 ? text.slice(0, translationIndex).trimEnd() : "";
  const original = originalPrefix || text;
  const translation = originalPrefix ? text.slice(translationIndex).trim() : null;
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
  }, [expanded, original]);
  return <div className="mt-3 min-h-[172px] text-sm leading-relaxed text-muted">
    <blockquote className="whitespace-pre-line break-words"><p ref={content} id={id} className={expanded ? "" : "line-clamp-5"}>{original}</p></blockquote>
    {(clipped || expanded) && <button type="button" className="mt-2 min-h-11 cursor-pointer font-semibold text-p underline underline-offset-4" aria-controls={id} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? "Ler menos" : "Ler avaliação completa"}</button>}
    {translation && <details className="group/translation mt-2">
      <summary className="w-fit cursor-pointer py-3 font-semibold text-p underline underline-offset-4"><span className="group-open/translation:hidden">Ver tradução do Google</span><span className="hidden group-open/translation:inline">Ocultar tradução do Google</span></summary>
      <blockquote className="mt-2 whitespace-pre-line break-words border-l-2 border-line pl-3"><p>{translation}</p></blockquote>
    </details>}
  </div>;
}
