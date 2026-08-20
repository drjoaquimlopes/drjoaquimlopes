import Link from "next/link";
import Image from "next/image";
import { site, navLinks } from "@/lib/site";
import { locations, locationOneLine } from "@/lib/locations";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const year = 2026;

  return (
    <footer className="bg-dark px-5 pb-10 pt-16 text-white/65 sm:px-8 lg:px-12 lg:pt-[72px]">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.4fr] lg:gap-14">
          {/* Marca */}
          <div>
            <Link href="/" className="mb-3 block">
              <Image
                src="/assets/images/logo/logo.png"
                alt="Dr. Joaquim Lopes"
                width={280}
                height={96}
                sizes="(min-width: 1024px) 233px, 187px"
                className="h-16 w-auto object-contain brightness-0 invert lg:h-20"
              />
            </Link>
            <p className="mb-4 max-w-[280px] text-sm leading-relaxed">
              Ortopedista e Traumatologista especializado em Cirurgia do Joelho.
              Atendimento humanizado com excelência técnica para sua recuperação
              completa.
            </p>
            <p className="text-xs text-white/55">{site.crmRqe}</p>
          </div>

          {/* Navegação */}
          <div>
            <div className="mb-[18px] text-sm font-semibold text-white">
              Navegação
            </div>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/pre-agendamento"
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  Agendar consulta
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato + locais */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <div className="mb-[18px] text-sm font-semibold text-white">Contato</div>
            <div className="mb-3 text-sm">
              <a
                href={`https://wa.me/${site.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 transition-colors hover:text-white"
              >
                {site.phoneDisplay}
              </a>
            </div>
            <div className="mb-3 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="text-white/55 transition-colors hover:text-white"
              >
                {site.email}
              </a>
            </div>
            {locations.map((loc) => (
              <div
                key={loc.schemaId}
                className="mb-2.5 text-sm leading-normal text-white/55"
              >
                {locationOneLine(loc)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] text-white/55">
              © {year} {site.name}. Todos os direitos reservados.
            </p>
            <p className="text-[13px] text-white/55">
              Desenvolvido por{" "}
              <a
                href="https://www.joaovictordss.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 transition-colors hover:text-white"
              >
                João Victor
              </a>
            </p>
          </div>
          <SocialLinks
            className="justify-center"
            linkClassName="text-white/45 transition-colors hover:text-white"
          />
        </div>
      </div>
    </footer>
  );
}
