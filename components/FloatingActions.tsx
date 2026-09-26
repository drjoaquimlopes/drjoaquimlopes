"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, WhatsAppSolid } from "./icons";
import { whatsappUrl } from "@/lib/site";

/**
 * Ações flutuantes no canto inferior direito:
 * - WhatsApp sempre disponível, inclusive antes do primeiro scroll;
 * - "Voltar ao topo" surge quando a página já rolou bastante.
 */
export function FloatingActions() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
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

      {pathname !== "/pre-agendamento" && <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
        className="pointer-events-auto flex h-14 items-center justify-center gap-2 rounded-full bg-[#176b45] px-4 text-white shadow-soft hover:bg-[#105335]"
      >
        <WhatsAppSolid width={26} height={26} />
        <span className="text-sm font-semibold">Agendar</span>
      </a>}
    </div>
  );
}
