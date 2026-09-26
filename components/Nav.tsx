"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll do body e fecha no Escape quando o drawer está aberto.
  useEffect(() => {
    const toggle = toggleRef.current;
    document.body.style.overflow = open ? "hidden" : "";
    const background = document.querySelectorAll<HTMLElement>("main, footer, [data-nav-background]");
    background.forEach((element) => {
      element.inert = open;
    });

    if (open) drawerRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const controls = drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button, [tabindex="0"]');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      if (open) toggle?.focus();
      document.body.style.overflow = "";
      background.forEach((element) => {
        element.inert = false;
      });
    };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[999] flex items-center justify-between border-b border-p/[0.08] px-5 backdrop-blur-xl transition-[height,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 lg:px-12 ${
          scrolled
            ? "h-16 bg-white/95 shadow-[0_4px_32px_rgba(86,105,122,0.1)] lg:h-[76px]"
            : "h-[72px] bg-white/85 lg:h-24"
        }`}
      >
        <Link
          href="/"
          aria-label="Dr. Joaquim Lopes - Início"
          className="shrink-0 transition-transform duration-300 ease-out active:scale-95"
        >
          <Image
            src="/assets/images/logo/logo.png"
            alt="Dr. Joaquim Lopes"
            width={280}
            height={96}
            priority
            sizes="(min-width: 1024px) 280px, 164px"
            className={`w-auto object-contain transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              scrolled ? "h-11 lg:h-[60px]" : "h-[56px] lg:h-24"
            }`}
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={`relative text-sm font-medium transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:origin-left after:rounded after:bg-p after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive(pathname, link.href)
                    ? "text-p after:scale-x-100"
                    : "text-muted after:scale-x-0 hover:text-p hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/pre-agendamento"
              className="rounded-full bg-p px-[22px] py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(86,105,122,0.22)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-p-dark hover:shadow-[0_10px_26px_rgba(86,105,122,0.36)] active:translate-y-0 active:scale-[0.97] active:duration-100"
            >
              Agendar Consulta
            </Link>
          </li>
        </ul>

        <SocialLinks
          className="hidden xl:flex"
          linkClassName="text-muted transition-colors hover:text-p"
        />

        {/* Hamburger */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`h-0.5 w-[22px] rounded bg-p transition-all duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-[22px] rounded bg-p transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-[22px] rounded bg-p transition-all duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Overlay */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Fechar menu"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[1000] bg-black/35 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label="Menu de navegação"
        id="mobile-navigation"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[1001] flex w-[280px] max-w-[82vw] flex-col overflow-y-auto bg-white px-7 pb-8 pt-[88px] shadow-[-4px_0_32px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-p"
        >
          <span className="absolute h-0.5 w-6 rotate-45 rounded bg-current" />
          <span className="absolute h-0.5 w-6 -rotate-45 rounded bg-current" />
        </button>

        <ul className="flex flex-col">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
              className={`border-b border-line transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                open ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
              }`}
            >
              <Link
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block py-4 text-base font-semibold transition-all duration-300 hover:translate-x-1 ${
                  isActive(pathname, link.href)
                    ? "text-p"
                    : "text-dark hover:text-p"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li
            style={{
              transitionDelay: open ? `${120 + navLinks.length * 55}ms` : "0ms",
            }}
            className={`pt-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              open ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
            }`}
          >
            <Link
              href="/pre-agendamento"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-p px-[22px] py-3.5 text-center text-[15px] font-semibold text-white"
            >
              Agendar Consulta
            </Link>
          </li>
        </ul>

        <SocialLinks
          className="mt-auto gap-5 border-t border-line pt-6"
          linkClassName="text-muted transition-colors hover:text-p"
          size={22}
        />
      </div>
    </>
  );
}
