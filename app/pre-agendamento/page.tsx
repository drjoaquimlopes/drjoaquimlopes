import type { Metadata } from "next";
import { PageHero, Accent } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { site, whatsappUrl } from "@/lib/site";
import { Phone, Mail, MapPin, Clock, IdCard, WhatsAppSolid } from "@/components/icons";

export const metadata: Metadata = {
  title: "Agendar Consulta Ortopedista São Paulo e Osasco | Dr. Joaquim Lopes",
  description:
    "Agende sua consulta com o Dr. Joaquim Lopes, ortopedista em São Paulo e Osasco. Atendimento na Vila Olímpia, Higienópolis, Jardim Paulista, Itaim Bibi e Osasco.",
  keywords: [
    "agendar consulta ortopedista são paulo",
    "consulta ortopedia vila olímpia",
    "ortopedista higienópolis",
    "ortopedista jardim paulista",
    "ortopedista itaim bibi",
    "ortopedista osasco",
    "marcar consulta joelho sp",
  ],
  alternates: { canonical: "/pre-agendamento" },
  openGraph: {
    type: "website",
    url: "/pre-agendamento",
    title:
      "Agendar Consulta | Dr. Joaquim Lopes - Ortopedista São Paulo e Osasco",
    description:
      "Agende sua consulta de ortopedia na Vila Olímpia, Higienópolis, Jardim Paulista, Itaim Bibi ou Osasco. WhatsApp (11) 92553-8077.",
    images: [{ url: "/assets/images/logo/logo.png" }],
  },
};

function ContactItem({
  icon: Icon,
  label,
  children,
}: {
  icon: (p: { width: number; height: number; className: string }) => React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="reveal flex items-start gap-4">
      <div className="flex h-12 w-12 min-w-12 items-center justify-center rounded-[14px] bg-p-muted">
        <Icon width={22} height={22} className="text-p" />
      </div>
      <div>
        <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.8px] text-muted">
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}

export default function PreAgendamentoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Pré-agendamento", path: "/pre-agendamento" },
        ])}
      />

      <PageHero
        breadcrumb="Pré-agendamento"
        title={
          <>
            Dê o primeiro <Accent>passo</Accent>
          </>
        }
        description="Entre em contato diretamente com nossa equipe pelo WhatsApp, telefone ou e-mail. Confirmamos sua consulta o mais breve possível."
      />

      <section className="px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-[1120px] items-start gap-12 md:grid-cols-2 md:gap-20">
          {/* Info */}
          <div>
            <span className="reveal mb-3.5 block text-xs font-bold uppercase tracking-[1.8px] text-p">
              Informações de contato
            </span>
            <h2 className="reveal mb-5 text-[28px] font-extrabold tracking-[-1px] text-dark md:text-[32px]">
              Estamos aqui para <Accent>ajudar</Accent>
            </h2>
            <p className="reveal mb-10 text-base leading-[1.85] text-muted">
              Nossa equipe está pronta para orientar seu agendamento e confirmar
              sua consulta. Escolha o canal mais conveniente e fale conosco
              diretamente.
            </p>

            <div className="flex flex-col gap-6">
              <ContactItem icon={Phone} label="Telefone / WhatsApp">
                <a
                  href={`https://wa.me/${site.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[15px] font-semibold text-dark transition-colors hover:text-p"
                >
                  {site.phoneDisplay}
                </a>
              </ContactItem>

              <ContactItem icon={Mail} label="E-mail">
                <a
                  href={`mailto:${site.email}`}
                  className="block break-words text-[15px] font-semibold text-dark transition-colors hover:text-p"
                >
                  {site.email}
                </a>
              </ContactItem>

              <ContactItem icon={MapPin} label="Localização">
                <span className="block text-[15px] font-semibold leading-[1.5] text-dark">
                  CAORT - Clínica Avançada de Ortopedia e Traumatologia
                  <br />
                  Rua Helena, 260, Vila Olímpia
                  <br />
                  São Paulo - SP, CEP 04552-040
                </span>
              </ContactItem>

              <ContactItem icon={MapPin} label="Outros locais de atendimento">
                <span className="block text-[15px] font-semibold leading-[1.5] text-dark">
                  Instituto Vita
                  <br />
                  Hospital 9 de Julho - Ambulatório
                  <br />
                  Hospital São Luiz Itaim, Rede D&apos;Or - Ambulatório
                  <br />
                  Hospital São Luiz, Rede D&apos;Or - Ambulatório
                </span>
              </ContactItem>

              <ContactItem icon={Clock} label="Horário de atendimento">
                <span className="block text-[15px] font-semibold leading-[1.5] text-dark">
                  Segunda a Sexta
                  <br />
                  08h às 18h
                </span>
              </ContactItem>

              <ContactItem icon={IdCard} label="Registro profissional">
                <span className="block text-[15px] font-semibold leading-[1.5] text-dark">
                  {site.crmRqe}
                </span>
              </ContactItem>
            </div>

            {/* Mapa */}
            <div className="reveal mt-10 h-[250px] overflow-hidden rounded-[18px] border border-line">
              <iframe
                src="https://maps.google.com/maps?q=CAORT+Cl%C3%ADnica+Avan%C3%A7ada+de+Ortopedia+e+Traumatologia+Rua+Helena+260+Vila+Ol%C3%ADmpia+S%C3%A3o+Paulo&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização CAORT - Rua Helena, 260, Vila Olímpia, São Paulo"
              />
            </div>
          </div>

          {/* Card de contato */}
          <div className="reveal">
            <div className="rounded-[18px] border border-line bg-bg-alt p-7 shadow-soft md:p-12">
              <h3 className="mb-1.5 text-2xl font-bold text-dark">
                Fale com nossa equipe
              </h3>
              <p className="mb-8 text-sm text-muted">
                Por enquanto, o agendamento está sendo feito diretamente pelos
                canais abaixo.
              </p>

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-full bg-[#25d366] px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1da851] hover:shadow-[0_8px_24px_rgba(37,211,102,0.3)]"
              >
                <WhatsAppSolid width={20} height={20} />
                Agendar pelo WhatsApp
              </a>

              <div className="mt-6 flex flex-col gap-4">
                <a
                  href={`tel:${site.phoneE164.replace(/-/g, "")}`}
                  className="flex items-start gap-3.5 rounded-[10px] border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-p-light hover:shadow-soft"
                >
                  <Phone width={20} height={20} className="mt-0.5 text-p" strokeWidth={1.8} />
                  <div>
                    <strong className="block text-sm text-dark">
                      Ligue para a clínica
                    </strong>
                    <span className="block text-sm text-muted">
                      {site.phoneDisplay}
                    </span>
                  </div>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-start gap-3.5 rounded-[10px] border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-p-light hover:shadow-soft"
                >
                  <Mail width={20} height={20} className="mt-0.5 text-p" strokeWidth={1.8} />
                  <div>
                    <strong className="block text-sm text-dark">
                      Envie um e-mail
                    </strong>
                    <span className="block break-words text-sm text-muted">
                      {site.email}
                    </span>
                  </div>
                </a>
              </div>

              <div className="mt-6 rounded-[10px] border border-line bg-white p-5 text-sm leading-[1.7] text-muted">
                <strong className="text-dark">
                  Atendimento em horário comercial.
                </strong>{" "}
                Assim que recebermos seu contato, retornamos com orientações e
                disponibilidade para confirmar a consulta.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
