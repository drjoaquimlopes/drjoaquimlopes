"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Observa elementos `.reveal` e adiciona `.is-visible` quando entram na viewport.
 * Reescaneia a cada troca de rota. Substitui o IntersectionObserver do main.js antigo.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
