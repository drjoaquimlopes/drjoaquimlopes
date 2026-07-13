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
      <h2 className="reveal text-3xl font-extrabold leading-[1.1] tracking-[-1.5px] text-dark md:text-[42px]">
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
    <div className="relative overflow-hidden bg-gradient-to-br from-p-muted to-[#dce4ea] px-5 pb-[72px] pt-[calc(72px+64px)] md:px-12 md:pt-[calc(96px+72px)]">
      <div className="mx-auto max-w-[1120px]">
        <nav className="mb-4 text-[13px] text-muted" aria-label="Breadcrumb">
          <Link href="/" className="text-p hover:underline">
            Início
          </Link>
          <span className="mx-1.5">/</span>
          {breadcrumb}
        </nav>
        <h1 className="mb-3.5 text-[32px] font-extrabold tracking-[-1.5px] text-dark md:text-5xl md:tracking-[-2px]">
          {title}
        </h1>
        <p className="max-w-[560px] text-base leading-relaxed text-muted md:text-lg">
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
    <section className="bg-p px-5 py-20 text-center md:px-12">
      <h2 className="reveal mb-3.5 text-[28px] font-extrabold tracking-[-1px] text-white md:text-4xl">
        {title}
      </h2>
      <p className="reveal mx-auto mb-9 max-w-xl text-[17px] text-white/75">{text}</p>
      <div className="reveal flex justify-center">
        <Button href={href} variant="white">
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
