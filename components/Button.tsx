import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "white";
type Size = "md" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-0 active:scale-[0.97] active:duration-100 motion-reduce:transform-none";

const sizes: Record<Size, string> = {
  md: "px-7 py-[15px] text-base",
  sm: "px-[22px] py-[11px] text-sm",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-p text-white shadow-[0_4px_20px_rgba(86,105,122,0.28)] hover:bg-p-dark hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(86,105,122,0.4)]",
  outline:
    "border-2 border-p-light text-p hover:border-p hover:bg-p-muted hover:-translate-y-0.5",
  white:
    "bg-white text-p hover:bg-p-muted hover:text-p-dark hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
  ariaLabel,
}: Props) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
