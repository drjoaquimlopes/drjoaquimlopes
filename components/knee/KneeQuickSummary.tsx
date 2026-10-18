"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { KneePart } from "@/lib/knee-anatomy";

export function KneeQuickSummary({ part, onClose }: { part: KneePart; onClose: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const sheet = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(() => {
      const marker = document.querySelector<HTMLElement>(`.knee-marker[data-part="${part.id}"]`);
      if (!marker || marker.hidden || !sheet.current) return;
      const overlap = marker.getBoundingClientRect().bottom - sheet.current.getBoundingClientRect().top + 24;
      if (overlap > 0) window.scrollBy({ top: overlap, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } };
    document.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", key); };
  }, [onClose, part.id]);
  return <section className="knee-quick-summary" aria-labelledby="knee-quick-title" ref={sheet}>
    <div className="knee-quick-header">
      <span className="knee-quick-number" aria-hidden="true">{part.number}</span>
      <div><p>{part.category}</p><h2 id="knee-quick-title" tabIndex={-1} ref={heading}>{part.name}</h2></div>
      <button type="button" onClick={onClose} aria-label="Fechar resumo"><span aria-hidden="true">×</span></button>
    </div>
    {expanded ? <div className="knee-quick-content" id="knee-quick-content">
      <h3>O que é</h3><p>{part.what}</p>
      <h3>O que faz</h3><p>{part.function}</p>
      <h3>O que pode acontecer</h3><p>{part.problems}</p>
      <Link href={part.link}>{part.linkLabel} ↗</Link>
    </div> : <div className="knee-quick-content" id="knee-quick-content"><p>{part.function}</p></div>}
    <button type="button" className="knee-quick-expand" aria-expanded={expanded} aria-controls="knee-quick-content" onClick={() => setExpanded(!expanded)}>
      {expanded ? "Mostrar resumo" : "Mais detalhes"}<span aria-hidden="true">{expanded ? "−" : "+"}</span>
    </button>
  </section>;
}
