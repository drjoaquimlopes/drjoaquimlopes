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

/**
 * Cabeçalho de seção (eyebrow + título + subtítulo).
 *
 * `size` controla o peso do título na página: `lead` para as seções que
 * carregam a narrativa, `support` para as de apoio — é o que evita que todas
 * as seções gritem no mesmo volume.
 *
 * `spacing` separa o cabeçalho do conteúdo. O padrão acompanha o alinhamento
 * (centralizado respira mais); passe explicitamente quando o cabeçalho for
 * seguido de texto corrido, sem precisar de margem negativa no consumidor.
 */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  size = "lead",
  spacing,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "center" | "left";
  size?: "lead" | "support";
  spacing?: "normal" | "tight";
}) {
  const isCenter = align === "center";
  const gap =
    (spacing ?? (isCenter ? "normal" : "tight")) === "normal"
      ? "mb-14 md:mb-16"
      : "mb-7";
  const titleCls =
    size === "lead"
      ? "text-h2 font-extrabold text-dark"
      : "text-h3 font-bold text-dark md:text-[1.75rem]";

  return (
    <div className={`${gap} ${isCenter ? "text-center" : "text-left"}`}>
      {eyebrow && <Eyebrow className="reveal mb-3.5">{eyebrow}</Eyebrow>}
      <h2 className={`reveal ${titleCls}`}>{title}</h2>
      {sub && (
        <p
          className={`reveal mt-5 max-w-[540px] text-lead text-muted ${
            isCenter ? "mx-auto" : ""
          }`}
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
    <div className="relative overflow-hidden bg-gradient-to-br from-p-muted to-[#dce4ea] px-5 pb-[72px] pt-[calc(72px+64px)] sm:px-8 lg:px-12 lg:pt-[calc(96px+72px)]">
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
        <h1 className="anim-fade-up mb-3.5 text-h1 font-extrabold text-dark [animation-delay:0.08s]">
          {title}
        </h1>
        <p className="anim-fade-up max-w-[560px] text-lead text-muted [animation-delay:0.16s]">
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
      <div className="reveal-group">
        <h2 className="reveal mb-3.5 text-h2 font-extrabold text-white">
          {title}
        </h2>
        <p className="reveal mx-auto mb-9 max-w-xl text-lead text-white/75">
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
