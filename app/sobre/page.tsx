import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Accent, CtaStrip, Eyebrow } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";
import {
  IdCard,
  Shield,
  Award,
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
  twitter: {
    card: "summary_large_image",
    title: "Sobre o Dr. Joaquim Lopes | Ortopedista em São Paulo",
    description:
      "Formação em Ortopedia pela HMCC, Cirurgia do Joelho pela Santa Casa de SP e Fellow em Medicina Esportiva na Coreia do Sul.",
    images: ["/assets/images/dr/fellow-1.jpg"],
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
            <Eyebrow className="reveal mb-3.5">Trajetória</Eyebrow>
            <h2 className="reveal mb-6 text-h2 font-extrabold text-dark">
              Cuidado especializado com <Accent>empatia</Accent>
            </h2>

            <p className="reveal mb-7 text-lead text-muted">
              Dr. Joaquim Lopes é médico especialista em Ortopedia, Traumatologia e
              Medicina do Esporte, com formação sólida e contínua voltada ao cuidado
              completo do sistema músculo-esquelético. Seu diferencial está no
              atendimento humanizado: cada paciente é ouvido com atenção e tratado
              com respeito, independentemente do caso.
            </p>
            <p className="reveal mb-7 text-lead text-muted">
              Com residência em Cirurgia do Joelho pela renomada Santa Casa de São
              Paulo, o Dr. Joaquim está preparado para tratar desde lesões esportivas
              até condições degenerativas complexas, sempre buscando a recuperação
              completa e o retorno à qualidade de vida do paciente.
            </p>
            <p className="reveal mb-7 text-lead text-muted">
              É membro ativo da Sociedade Brasileira de Ortopedia e Traumatologia
              (SBOT) e da Sociedade Brasileira de Cirurgia do Joelho (SBCJ), estando
              constantemente atualizado com as mais modernas técnicas e protocolos da
              medicina ortopédica.
            </p>

            <hr className="my-9 border-line" />

            {/* Credenciais */}
            <Eyebrow className="reveal mb-5">Registro profissional</Eyebrow>
            <dl className="reveal-group grid gap-x-10 sm:grid-cols-2">
              {credentials.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div
                    key={`${c.label}-${i}`}
                    className="reveal flex items-center gap-3 border-t border-line py-3.5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                  >
                    <Icon
                      width={17}
                      height={17}
                      className="shrink-0 text-p-light"
                      strokeWidth={1.7}
                    />
                    <dt className="text-[11px] font-bold uppercase tracking-[0.8px] text-muted">
                      {c.label}
                    </dt>
                    <dd className="ml-auto text-sm font-semibold text-dark">
                      {c.value}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="reveal mt-9 flex flex-wrap gap-2.5">
              {["Ortopedia", "Traumatologia", "Cirurgia do Joelho", "Medicina do Esporte"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-bg-alt px-4 py-[7px] text-[13px] font-semibold text-p"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>

            <hr className="my-9 border-line" />

            {/* Formação */}
            <Eyebrow className="reveal mb-6">Formação profissional</Eyebrow>
            <div className="flex flex-col">
              {timeline.map((item, i) => (
                <div key={i} className="relative flex gap-[18px] pb-6">
                  <span className="absolute left-[13px] top-[30px] bottom-0 w-0.5 bg-line" />
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

              {/* Fellow: último item da linha do tempo, com registro em foto */}
              <div className="flex gap-[18px]">
                <span className="relative z-[1] flex h-7 w-7 min-w-7 items-center justify-center rounded-full border-2 border-p bg-p">
                  <span className="h-[9px] w-[9px] rounded-full bg-white" />
                </span>
                <div className="flex flex-1 flex-col gap-4">
                  <div>
                    <div className="mb-0.5 text-xs font-semibold tracking-[0.4px] text-p">
                      Fellow avançado · Coreia do Sul
                    </div>
                    <div className="text-sm font-semibold leading-[1.45] text-dark">
                      Medicina Esportiva - Myongji Hospital, Seul
                    </div>
                  </div>
                  <div className="h-[200px] w-full overflow-hidden rounded-xl">
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
            <Eyebrow className="reveal mb-5">Valores do atendimento</Eyebrow>
            <div className="reveal-group grid gap-x-10 sm:grid-cols-2">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="reveal flex gap-4 border-t border-line py-5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                  >
                    <Icon
                      width={22}
                      height={22}
                      className="mt-0.5 shrink-0 text-p"
                      strokeWidth={1.7}
                    />
                    <div>
                      <div className="mb-1 text-[15px] font-bold text-dark">
                        {v.title}
                      </div>
                      <div className="text-[13px] leading-relaxed text-muted">
                        {v.desc}
                      </div>
                    </div>
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
