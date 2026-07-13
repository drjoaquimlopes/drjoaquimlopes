import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Accent, CtaStrip } from "@/components/sections";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "Cirurgia do Joelho em São Paulo | Artroscopia, LCA, Prótese | Dr. Joaquim Lopes",
  description:
    "Cirurgia do Joelho em São Paulo: artroscopia, reconstrução de LCA/LCP, prótese de joelho, infiltração e PRP. Dr. Joaquim Lopes, ortopedista na Vila Olímpia.",
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
    images: [{ url: "/assets/images/dr/1.jpg" }],
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
                  className={`reveal h-[220px] overflow-hidden rounded-[18px] shadow-hover sm:h-[360px] lg:h-[400px] ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={block.image}
                    alt={block.alt}
                    width={560}
                    height={400}
                    className="h-full w-full object-cover"
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

      <CtaStrip
        title="Tem alguma dúvida sobre seu caso?"
        text="Agende uma consulta e receba uma avaliação personalizada."
      />
    </>
  );
}
