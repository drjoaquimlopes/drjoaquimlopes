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

    // Sem animação para quem pediu menos movimento: mostra tudo de uma vez.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      // Dispara um pouco antes do elemento centralizar, para a entrada
      // terminar enquanto ainda está subindo na tela.
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
