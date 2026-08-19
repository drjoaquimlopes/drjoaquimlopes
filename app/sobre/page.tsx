import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Accent, CtaStrip } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";
import {
  IdCard,
  Shield,
  Award,
  Globe,
  Heart,
  Target,
  Refresh,
  Book,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Formação e trajetória",
  description:
    "Conheça a formação do Dr. Joaquim Lopes em ortopedia, cirurgia do joelho e medicina esportiva. CRM-SP 171205 e RQE 113362.",
  keywords: [
    "dr joaquim lopes ortopedista",
    "ortopedista vila olímpia",
    "traumatologista são paulo",
    "especialista joelho são paulo",
    "cirurgião do joelho sp",
    "CRM 171205",
    "medicina esportiva",
    "fellow coreia do sul",
    "santa casa são paulo ortopedia",
  ],
  alternates: { canonical: "/sobre" },
  openGraph: {
    type: "profile",
    url: "/sobre",
    title: "Sobre o Dr. Joaquim Lopes | Ortopedista em São Paulo",
    description:
      "Formação em Ortopedia pela HMCC, Cirurgia do Joelho pela Santa Casa de SP e Fellow em Medicina Esportiva na Coreia do Sul.",
    images: [
      {
        url: "/assets/images/dr/fellow-1.jpg",
        width: 1200,
        height: 800,
        alt: "Dr. Joaquim Lopes, ortopedista especialista em joelho",
      },
    ],
  },
};

const credentials = [
  { icon: IdCard, label: "CRM", value: "CRM-SP 171205" },
  { icon: Shield, label: "RQE", value: "RQE 113362" },
  { icon: Award, label: "Associação", value: "Membro SBOT" },
  { icon: Award, label: "Associação", value: "Membro SBCJ" },
];

const timeline = [
  { year: "2019 – 2022", text: "Residência em Ortopedia e Traumatologia no HMCC" },
  {
    year: "2022",
    text: "Título de especialista em Ortopedia e Traumatologia pela SBOT",
  },
  {
    year: "2022 – 2023",
    text: "Residência em Cirurgia do Joelho na Santa Casa de São Paulo",
  },
  { year: "2023", text: "Título de especialista em Cirurgia do Joelho pela SBCJ" },
];

const values = [
  {
    icon: Heart,
    title: "Humanização",
    desc: "Cada paciente é único. O atendimento começa pela escuta.",
  },
  {
    icon: Target,
    title: "Precisão",
    desc: "Diagnóstico correto é o primeiro passo para um bom tratamento.",
  },
  {
    icon: Refresh,
    title: "Recuperação total",
    desc: "O objetivo é sempre o retorno pleno à qualidade de vida.",
  },
  {
    icon: Book,
    title: "Atualização contínua",
    desc: "Sempre alinhado às técnicas mais modernas da ortopedia.",
  },
];

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Physician",
    "@id": `${site.url}/#medico`,
    name: site.name,
    jobTitle: "Ortopedista e Traumatologista",
    medicalSpecialty: ["Orthopedic", "SportsMedicine"],
    description:
      "Ortopedista especializado em Cirurgia do Joelho e Medicina Esportiva, com formação pela Santa Casa de São Paulo e Fellow internacional pelo Myongji Hospital em Seul, Coreia do Sul.",
    image: `${site.url}/assets/images/dr/sobre-1.jpg`,
    identifier: { "@type": "PropertyValue", name: "CRM-SP", value: "171205" },
  },
};

export default function SobrePage() {
  return (
    <>
      <JsonLd data={profileJsonLd} />
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Sobre", path: "/sobre" },
        ])}
      />

      <PageHero
        breadcrumb="Sobre"
        title={
          <>
            Sobre o <Accent>Dr. Joaquim</Accent>
          </>
        }
        description="Conheça a trajetória, formação e os valores que guiam cada atendimento."
      />

      <section className="px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-[1120px] items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Foto */}
          <div className="reveal h-[280px] overflow-hidden rounded-[18px] shadow-hover sm:h-[440px] lg:sticky lg:top-24 lg:h-[560px]">
            <Image
              src="/assets/images/dr/sobre-1.jpg"
              alt="Dr. Joaquim Lopes"
              width={560}
              height={560}
              sizes="(min-width: 1024px) 50vw, calc(100vw - 40px)"
              className="h-full w-full object-cover object-top"
            />
          </div>

          {/* Texto */}
          <div>
            <span className="reveal mb-3.5 block text-xs font-bold uppercase tracking-[1.8px] text-p">
              Trajetória
            </span>
            <h2 className="reveal mb-6 text-3xl font-extrabold tracking-[-1.5px] text-dark sm:text-4xl lg:text-[42px]">
              Cuidado especializado com <Accent>empatia</Accent>
            </h2>

            <p className="reveal mb-7 text-base leading-[1.9] text-muted">
              Dr. Joaquim Lopes é médico especialista em Ortopedia, Traumatologia e
              Medicina do Esporte, com formação sólida e contínua voltada ao cuidado
              completo do sistema músculo-esquelético. Seu diferencial está no
              atendimento humanizado: cada paciente é ouvido com atenção e tratado
              com respeito, independentemente do caso.
            </p>
            <p className="reveal mb-7 text-base leading-[1.9] text-muted">
              Com residência em Cirurgia do Joelho pela renomada Santa Casa de São
              Paulo, o Dr. Joaquim está preparado para tratar desde lesões esportivas
              até condições degenerativas complexas, sempre buscando a recuperação
              completa e o retorno à qualidade de vida do paciente.
            </p>
            <p className="reveal mb-7 text-base leading-[1.9] text-muted">
              É membro ativo da Sociedade Brasileira de Ortopedia e Traumatologia
              (SBOT) e da Sociedade Brasileira de Cirurgia do Joelho (SBCJ), estando
              constantemente atualizado com as mais modernas técnicas e protocolos da
              medicina ortopédica.
            </p>

            <hr className="my-9 border-line" />

            {/* Credenciais */}
            <p className="reveal mb-5 text-[17px] font-bold text-dark">
              Registro profissional
            </p>
            <div className="reveal-group grid gap-4 sm:grid-cols-2">
              {credentials.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div
                    key={`${c.label}-${i}`}
                    className="reveal card-lift flex items-start gap-3.5 rounded-[10px] border border-line bg-bg-alt p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-p-muted">
                      <Icon width={20} height={20} className="text-p" strokeWidth={1.7} />
                    </div>
                    <div>
                      <div className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.8px] text-muted">
                        {c.label}
                      </div>
                      <div className="text-sm font-semibold text-dark">{c.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="reveal mt-9 flex flex-wrap gap-2.5">
              {["Ortopedia", "Traumatologia", "Cirurgia do Joelho", "Medicina do Esporte"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-white px-4 py-[7px] text-[13px] font-semibold text-p transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-p-light hover:bg-p-muted"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>

            <hr className="my-9 border-line" />

            {/* Formação */}
            <p className="reveal mb-6 text-[17px] font-bold text-dark">
              Formação profissional
            </p>
            <div className="flex flex-col">
              {timeline.map((item, i) => (
                <div key={i} className="relative flex gap-[18px] pb-6">
                  {i !== timeline.length - 1 && (
                    <span className="absolute left-[13px] top-[30px] bottom-0 w-0.5 bg-line" />
                  )}
                  <span className="relative z-[1] flex h-7 w-7 min-w-7 items-center justify-center rounded-full border-2 border-p-light bg-p-muted">
                    <span className="h-[9px] w-[9px] rounded-full bg-p" />
                  </span>
                  <div>
                    <div className="mb-0.5 text-xs font-semibold tracking-[0.4px] text-p">
                      {item.year}
                    </div>
                    <div className="text-sm font-semibold leading-[1.45] text-dark">
                      {item.text}
                    </div>
                  </div>
                </div>
              ))}

              {/* Fellow (destaque) */}
              <div className="mt-1 flex gap-[18px] rounded-xl border-[1.5px] border-p-light bg-gradient-to-br from-[#f0f4f8] to-[#dce8f0] p-4">
                <span className="relative z-[1] flex h-7 w-7 min-w-7 items-center justify-center rounded-full border-2 border-p bg-p">
                  <span className="h-[9px] w-[9px] rounded-full bg-white" />
                </span>
                <div className="flex flex-1 flex-col gap-3.5">
                  <div>
                    <div className="text-[13px] font-semibold uppercase tracking-[0.6px] text-p">
                      Fellow Avançado
                    </div>
                    <div className="text-[15px] font-semibold leading-[1.45] text-dark">
                      Medicina Esportiva - Myongji Hospital, Seul · Coreia do Sul
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-p/10 px-3 py-1 text-[11px] font-bold tracking-[0.5px] text-p">
                      <Globe width={13} height={13} strokeWidth={1.7} />
                      Formação Internacional
                    </span>
                  </div>
                  <div className="h-[180px] w-full overflow-hidden rounded-lg">
                    <Image
                      src="/assets/images/dr/fellow-1.jpg"
                      alt="Dr. Joaquim Lopes durante Fellow em Medicina Esportiva no Myongji Hospital, Seul, Coreia do Sul"
                      width={600}
                      height={180}
                      sizes="(min-width: 1024px) 480px, calc(100vw - 96px)"
                      className="h-full w-full object-cover object-[center_25%]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-9 border-line" />

            {/* Valores */}
            <p className="reveal mb-5 text-[17px] font-bold text-dark">
              Valores do atendimento
            </p>
            <div className="reveal-group grid gap-4 sm:grid-cols-2">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="reveal card-lift rounded-[10px] border border-line bg-bg-alt p-6 text-center"
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-p-muted">
                      <Icon width={24} height={24} className="text-p" strokeWidth={1.7} />
                    </div>
                    <div className="mb-1.5 text-[15px] font-bold text-dark">{v.title}</div>
                    <div className="text-[13px] leading-relaxed text-muted">{v.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        title="Quer agendar uma consulta?"
        text="Entre em contato e dê o primeiro passo para sua recuperação."
        buttonLabel="Agendar consulta"
      />
    </>
  );
}
