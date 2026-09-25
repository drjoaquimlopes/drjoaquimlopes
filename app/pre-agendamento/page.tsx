import type { Metadata } from "next";
import { PageHero, Accent, Eyebrow } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { site, whatsappUrl } from "@/lib/site";
import { Phone, Mail, MapPin, Clock, IdCard, WhatsAppSolid } from "@/components/icons";

export const metadata: Metadata = {
  title: "Agendar Consulta Ortopédica",
  description:
    "Agende sua consulta com o Dr. Joaquim Lopes em São Paulo ou Osasco. Atendimento por WhatsApp, telefone ou e-mail.",
  keywords: [
    "agendar consulta ortopedista são paulo",
    "consulta ortopedia vila nova conceição",
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
      "Agende sua consulta de ortopedia na Vila Nova Conceição, Higienópolis, Jardim Paulista, Itaim Bibi ou Osasco. WhatsApp (11) 92553-8077.",
    images: [
      {
        url: "/assets/images/dr/1.jpg",
        width: 1200,
        height: 800,
        alt: "Dr. Joaquim Lopes, ortopedista em São Paulo e Osasco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Agendar Consulta | Dr. Joaquim Lopes - Ortopedista São Paulo e Osasco",
    description:
      "Agende sua consulta de ortopedia na Vila Nova Conceição, Higienópolis, Jardim Paulista, Itaim Bibi ou Osasco.",
    images: ["/assets/images/dr/1.jpg"],
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
    <div className="reveal flex min-w-0 items-start gap-4">
      <div className="flex h-12 w-12 min-w-12 items-center justify-center rounded-[14px] bg-p-muted">
        <Icon width={22} height={22} className="text-p" />
      </div>
      <div className="min-w-0 flex-1">
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
        <div className="mx-auto grid min-w-0 max-w-[1120px] items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Info */}
          <div className="min-w-0">
            <Eyebrow className="reveal mb-3.5">Informações de contato</Eyebrow>
            <h2 className="reveal mb-5 text-h2 font-extrabold text-dark">
              Estamos aqui para <Accent>ajudar</Accent>
            </h2>
            <p className="reveal mb-10 text-lead text-muted">
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
                <a
                  href="https://maps.app.goo.gl/X39WtzS18QjHe7b66"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[15px] font-semibold leading-[1.5] text-dark transition-colors hover:text-p"
                >
                  Clínica Derplus
                  <br />
                  R. Arminda, 93 - Conj 102, Vila Nova Conceição
                  <br />
                  São Paulo - SP, CEP 04545-100
                </a>
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
                src="https://maps.google.com/maps?q=Cl%C3%ADnica+Derplus+Edif%C3%ADcio+Personna+R.+Arminda%2C+93+Vila+Nova+Concei%C3%A7%C3%A3o+S%C3%A3o+Paulo&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Clínica Derplus - R. Arminda, 93, Vila Nova Conceição, São Paulo"
              />
            </div>
          </div>

          {/* Card de contato */}
          <div className="reveal min-w-0">
            <div className="rounded-[18px] border border-line bg-bg-alt p-7 shadow-soft md:p-12">
              <h3 className="mb-1.5 text-h3 font-bold text-dark">
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
                  className="card-lift flex items-start gap-3.5 rounded-[10px] border border-line bg-white p-5 shadow-[0_1px_2px_rgba(86,105,122,0.04)]"
                >
                  <Phone width={20} height={20} className="mt-0.5 text-p" strokeWidth={1.8} />
                  <div className="min-w-0 flex-1">
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
                  className="card-lift flex items-start gap-3.5 rounded-[10px] border border-line bg-white p-5 shadow-[0_1px_2px_rgba(86,105,122,0.04)]"
                >
                  <Mail width={20} height={20} className="mt-0.5 text-p" strokeWidth={1.8} />
                  <div className="min-w-0 flex-1">
                    <strong className="block text-sm text-dark">
                      Envie um e-mail
                    </strong>
                    <span className="block break-all text-sm text-muted">
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
