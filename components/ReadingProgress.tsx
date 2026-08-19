"use client";

import { useEffect, useRef } from "react";

/**
 * Barra fina no topo indicando o progresso de leitura do artigo.
 * Escreve direto no DOM via rAF para não re-renderizar o React a cada scroll.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${ratio})`;
      bar.style.opacity = ratio > 0.005 ? "1" : "0";
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[1002] h-[3px]"
    >
      <div
        ref={barRef}
        style={{ transform: "scaleX(0)", opacity: 0 }}
        className="h-full origin-left bg-gradient-to-r from-p-mid to-p-dark transition-opacity duration-300"
      />
    </div>
  );
}
