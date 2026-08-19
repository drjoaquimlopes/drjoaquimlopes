"use client";

import { useEffect, useState } from "react";
import { ArrowUp, WhatsAppSolid } from "./icons";
import { whatsappUrl } from "@/lib/site";

/**
 * Ações flutuantes no canto inferior direito:
 * - WhatsApp sempre disponível (aparece após o primeiro scroll);
 * - "Voltar ao topo" surge quando a página já rolou bastante.
 */
export function FloatingActions() {
  const [showWhats, setShowWhats] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setShowWhats(y > 240);
      setShowTop(y > window.innerHeight * 1.2);
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div
      data-nav-background
      className="pointer-events-none fixed bottom-5 right-5 z-[998] flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)] sm:bottom-7 sm:right-7"
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/90 text-p shadow-soft backdrop-blur transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-p-light hover:shadow-hover active:scale-95 motion-reduce:transition-none ${
          showTop
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-90 opacity-0"
        }`}
      >
        <ArrowUp width={18} height={18} strokeWidth={2} />
      </button>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
        tabIndex={showWhats ? 0 : -1}
        aria-hidden={!showWhats}
        className={`pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.4)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-[#1da851] hover:shadow-[0_16px_38px_rgba(37,211,102,0.5)] active:scale-95 motion-reduce:transition-none ${
          showWhats
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-90 opacity-0"
        }`}
      >
        <WhatsAppSolid width={26} height={26} />
      </a>
    </div>
  );
}
