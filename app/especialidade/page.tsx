import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, Accent, CtaStrip } from "@/components/sections";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cirurgia do Joelho em São Paulo",
  description:
    "Tratamentos e cirurgia do joelho em São Paulo: artroscopia, reconstrução de LCA, prótese, infiltração e medicina esportiva.",
  keywords: [
    "cirurgia do joelho são paulo",
    "artroscopia joelho sp",
    "reconstrução lca são paulo",
    "ligamento cruzado anterior",
    "prótese de joelho são paulo",
    "infiltração joelho",
    "PRP joelho",
    "viscossuplementação",
    "menisco cirurgia",
    "ortopedista cirurgião joelho",
  ],
  alternates: { canonical: "/especialidade" },
  openGraph: {
    type: "website",
    url: "/especialidade",
    title: "Cirurgia do Joelho em São Paulo | Dr. Joaquim Lopes",
    description:
      "Artroscopia, reconstrução de LCA/LCP, prótese de joelho, infiltração e PRP. Ortopedista especialista na Vila Olímpia, SP.",
    images: [
      {
        url: "/assets/images/dr/1.jpg",
        width: 1200,
        height: 800,
        alt: "Dr. Joaquim Lopes durante atendimento ortopédico",
      },
    ],
  },
};

const blocks = [
  {
    number: "01. Exames",
    image: "/assets/images/dr/1.jpg",
    alt: "Exames ortopédicos",
    title: (
      <>
        Diagnóstico <Accent>preciso</Accent> para o tratamento certo
      </>
    ),
    body: "O diagnóstico correto é o ponto de partida de qualquer tratamento bem-sucedido. O Dr. Joaquim realiza uma avaliação clínica completa, aliada a exames de imagem e funcionais, para identificar com precisão a origem do problema e traçar o melhor caminho terapêutico.",
    items: [
      "Avaliação clínica ortopédica completa",
      "Interpretação de exames de imagem (Raio-X, RM, TC)",
      "Avaliação funcional do joelho e membro inferior",
      "Diagnóstico de lesões ligamentares e meniscais",
      "Avaliação de desgaste articular e cartilagem",
    ],
    cta: "Agendar avaliação",
  },
  {
    number: "02. Procedimentos",
    image: "/assets/images/dr/2.jpg",
    alt: "Procedimentos ortopédicos",
    title: (
      <>
        Tratamentos <Accent>personalizados</Accent> para cada paciente
      </>
    ),
    body: "Nem toda condição ortopédica exige cirurgia. O Dr. Joaquim oferece uma ampla gama de procedimentos minimamente invasivos e tratamentos conservadores, com o objetivo de proporcionar alívio da dor e recuperação funcional com máxima segurança.",
    items: [
      "Infiltrações e bloqueios articulares",
      "Viscossuplementação (ácido hialurônico)",
      "PRP (Plasma Rico em Plaquetas)",
      "Tratamento conservador de lesões ligamentares",
      "Reabilitação pós-operatória orientada",
      "Imobilizações e órteses personalizadas",
    ],
    cta: "Consultar tratamentos",
  },
  {
    number: "03. Cirurgias",
    image: "/assets/images/dr/3.jpg",
    alt: "Cirurgias do joelho",
    title: (
      <>
        Cirurgia do Joelho com <Accent>alta precisão</Accent>
      </>
    ),
    body: "Com residência específica em Cirurgia do Joelho pela Santa Casa de São Paulo e título de especialista pela SBCJ, o Dr. Joaquim realiza as principais intervenções cirúrgicas do joelho, incluindo técnicas artroscópicas e procedimentos de alta complexidade.",
    items: [
      "Reconstrução do Ligamento Cruzado Anterior (LCA)",
      "Reconstrução do Ligamento Cruzado Posterior (LCP)",
      "Sutura e transplante de menisco",
      "Artroplastia total e parcial do joelho",
      "Tratamento cirúrgico da condromalácia e desgaste de cartilagem",
      "Osteotomia corretiva (valgo/varo)",
      "Cirurgia artroscópica diagnóstica e terapêutica",
      "Tratamento de lesões em atletas de alta performance",
    ],
    cta: "Agendar consulta",
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Especialidades - Dr. Joaquim Lopes",
  url: `${site.url}/especialidade`,
  description:
    "Serviços de ortopedia e cirurgia do joelho: exames, procedimentos conservadores e cirurgias.",
  mainEntity: {
    "@type": "MedicalProcedure",
    name: "Cirurgia do Joelho",
    procedureType: "Surgical",
    bodyLocation: "Joelho",
    description:
      "Artroscopia, reconstrução de ligamento cruzado anterior e posterior, reparo de menisco e artroplastia de joelho.",
  },
};

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15px] text-text">
      <span className="mt-0.5 flex h-5 w-5 min-w-5 items-center justify-center rounded-full border-2 border-p-light bg-p-muted">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-p"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {children}
    </li>
  );
}

export default function EspecialidadePage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Especialidade", path: "/especialidade" },
        ])}
      />

      <PageHero
        breadcrumb="Especialidade"
        title={
          <>
            Do diagnóstico à <Accent>recuperação</Accent>
          </>
        }
        description="Atendimento completo com foco em Cirurgia do Joelho, incluindo exames, procedimentos e cirurgias de alta complexidade."
      />

      <section className="px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1120px]">
          {blocks.map((block, i) => (
            <div key={block.number}>
              {i > 0 && <hr className="my-14 border-line md:my-20" />}
              <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
                <div
                  className={`reveal group h-[220px] overflow-hidden rounded-[18px] shadow-hover sm:h-[360px] lg:h-[400px] ${
                    i % 2 === 1 ? "lg:order-2 reveal-right" : "reveal-left"
                  }`}
                >
                  <Image
                    src={block.image}
                    alt={block.alt}
                    width={560}
                    height={400}
                    sizes="(min-width: 1024px) 50vw, calc(100vw - 40px)"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </div>
                <div>
                  <span className="reveal mb-3 block text-[13px] font-bold uppercase tracking-[2px] text-p-light">
                    {block.number}
                  </span>
                  <h2 className="reveal mb-5 text-[26px] font-extrabold tracking-[-1.2px] text-dark md:text-[34px]">
                    {block.title}
                  </h2>
                  <p className="reveal mb-7 text-base leading-[1.85] text-muted">
                    {block.body}
                  </p>
                  <ul className="reveal mb-8 flex flex-col gap-3">
                    {block.items.map((item) => (
                      <CheckItem key={item}>{item}</CheckItem>
                    ))}
                  </ul>
                  <div className="reveal">
                    <Button href="/pre-agendamento" size="sm">
                      {block.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg-alt px-5 py-16 text-center md:px-12">
        <div className="mx-auto max-w-[720px]">
          <h2 className="mb-3 text-2xl font-extrabold text-dark md:text-3xl">
            Quer entender melhor os problemas do joelho?
          </h2>
          <p className="mb-7 leading-relaxed text-muted">
            Consulte o guia com informações sobre dor, artrose, LCA, cartilagem,
            cirurgias, recuperação e prevenção de lesões.
          </p>
          <Link
            href="/joelho"
            className="inline-flex rounded-full border-2 border-p px-7 py-3.5 font-semibold text-p transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-p hover:text-white hover:shadow-[0_10px_28px_rgba(86,105,122,0.3)] active:translate-y-0 active:scale-[0.97]"
          >
            Acessar guia de saúde do joelho
          </Link>
        </div>
      </section>

      <CtaStrip
        title="Tem alguma dúvida sobre seu caso?"
        text="Agende uma consulta e receba uma avaliação personalizada."
      />
    </>
  );
}
