import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "./Button";

/** Rótulo pequeno em maiúsculas acima dos títulos. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`block text-xs font-bold uppercase tracking-[1.8px] text-p ${className}`}
    >
      {children}
    </span>
  );
}

/** Destaque colorido dentro de títulos (equivale ao <em> do site antigo). */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="not-italic text-p">{children}</em>;
}

/** Cabeçalho de seção centralizado (eyebrow + título + subtítulo). */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center" : "text-left";
  const subAlign = align === "center" ? "mx-auto" : "";
  return (
    <div className={`mb-16 ${alignCls}`}>
      <Eyebrow className="reveal mb-3.5">{eyebrow}</Eyebrow>
      <h2 className="reveal text-3xl font-extrabold leading-[1.1] tracking-[-1.5px] text-dark sm:text-4xl lg:text-[42px]">
        {title}
      </h2>
      {sub && (
        <p
          className={`reveal mt-5 max-w-[540px] text-[17px] leading-relaxed text-muted ${subAlign}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/** Hero das páginas internas (breadcrumb + título + descrição). */
export function PageHero({
  breadcrumb,
  title,
  description,
}: {
  breadcrumb: string;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <div className="anim-gradient relative overflow-hidden bg-gradient-to-br from-p-muted via-[#e4eaf0] to-[#dce4ea] px-5 pb-[72px] pt-[calc(72px+64px)] sm:px-8 lg:px-12 lg:pt-[calc(96px+72px)]">
      <div
        aria-hidden
        className="anim-float pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"
      />
      <div className="relative mx-auto max-w-[1120px]">
        <nav
          className="anim-fade-up mb-4 text-[13px] text-muted"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="link-underline text-p">
            Início
          </Link>
          <span className="mx-1.5">/</span>
          {breadcrumb}
        </nav>
        <h1 className="anim-fade-up mb-3.5 text-[32px] font-extrabold tracking-[-1.5px] text-dark [animation-delay:0.08s] sm:text-4xl lg:text-5xl lg:tracking-[-2px]">
          {title}
        </h1>
        <p className="anim-fade-up max-w-[560px] text-base leading-relaxed text-muted [animation-delay:0.16s] md:text-lg">
          {description}
        </p>
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-px h-12 bg-white [clip-path:ellipse(60%_100%_at_50%_100%)]"
      />
    </div>
  );
}

/** Faixa de chamada para ação (fundo azul-acinzentado). */
export function CtaStrip({
  title,
  text,
  buttonLabel = "Agendar agora",
  href = "/pre-agendamento",
}: {
  title: ReactNode;
  text: ReactNode;
  buttonLabel?: string;
  href?: string;
}) {
  return (
    <section className="anim-gradient relative overflow-hidden bg-gradient-to-br from-p via-[#4d6070] to-p-dark px-5 py-20 text-center md:px-12">
      <div
        aria-hidden
        className="anim-float-slow pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="anim-float pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl"
      />
      <div className="relative reveal-group">
        <h2 className="reveal mb-3.5 text-[28px] font-extrabold tracking-[-1px] text-white md:text-4xl">
          {title}
        </h2>
        <p className="reveal mx-auto mb-9 max-w-xl text-[17px] text-white/75">
          {text}
        </p>
        <div className="reveal flex justify-center">
          <Button href={href} variant="white">
            {buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
