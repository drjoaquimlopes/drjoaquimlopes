import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, Accent, SectionHeading, CtaStrip } from "@/components/sections";
import { ArrowRight } from "@/components/icons";
import { getAllPosts } from "@/lib/blog";
import { breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Saúde do Joelho: Sintomas, Lesões e Tratamentos",
  description:
    "Guia sobre dor no joelho, artrose, lesões de menisco e LCA, cirurgia, prótese, recuperação e prevenção com o Dr. Joaquim Lopes.",
  alternates: { canonical: "/joelho" },
  openGraph: {
    type: "website",
    url: "/joelho",
    title: "Saúde do Joelho: Sintomas, Lesões e Tratamentos",
    description:
      "Informações médicas sobre problemas do joelho, opções de tratamento, cirurgias e retorno ao esporte.",
    images: [
      {
        url: "/assets/images/dr/3.jpg",
        width: 1200,
        height: 800,
        alt: "Avaliação ortopédica do joelho com o Dr. Joaquim Lopes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saúde do Joelho: Sintomas, Lesões e Tratamentos",
    description:
      "Informações médicas sobre problemas do joelho, opções de tratamento, cirurgias e retorno ao esporte.",
    images: ["/assets/images/dr/3.jpg"],
  },
};

const grupos = [
  {
    id: "sintomas-e-condicoes",
    eyebrow: "Sintomas e condições",
    title: "Entenda o que pode afetar o joelho",
    description:
      "Dor, inchaço, rigidez, travamento e instabilidade podem ter causas diferentes. A avaliação clínica e, quando necessários, exames complementares ajudam a identificar a origem do problema.",
    links: [
      { slug: "dor-no-joelho-quando-procurar-atendimento", label: "Dor no joelho: consulta ou urgência?" },
      { slug: "lesao-de-menisco-quando-precisa-operar", label: "Lesão de menisco: quando operar?" },
      {
        slug: "atividade-fisica-no-tratamento-da-artrose",
        label: "Artrose do joelho e atividade física",
      },
      {
        slug: "desgaste-da-cartilagem-do-joelho-e-esporte",
        label: "Desgaste da cartilagem e esporte",
      },
      {
        slug: "reconstrucao-do-lca-como-e-a-cirurgia",
        label: "Lesão e reconstrução do LCA",
      },
      {
        slug: "infiltracao-para-bursite-patelar",
        label: "Bursite patelar e infiltração",
      },
    ],
  },
  {
    id: "tratamentos-e-cirurgias",
    eyebrow: "Tratamentos e cirurgias",
    title: "Da abordagem conservadora à cirurgia do joelho",
    description:
      "Nem todo problema no joelho exige operação. O tratamento é individualizado e pode envolver orientação de atividade, reabilitação, procedimentos ou cirurgia, conforme o diagnóstico e os objetivos do paciente.",
    links: [
      {
        slug: "cirurgias-do-joelho-que-realizo",
        label: "Principais cirurgias do joelho",
      },
      {
        slug: "artroplastia-de-joelho-indicacoes-tecnicas-e-robotica",
        label: "Artroplastia e prótese de joelho",
      },
      {
        slug: "retornar-a-academia-apos-cirurgia-de-joelho",
        label: "Recuperação após cirurgia do joelho",
      },
      {
        slug: "voltar-a-jogar-tenis-apos-protese-de-joelho",
        label: "Retorno ao esporte após prótese",
      },
    ],
  },
  {
    id: "esporte-e-prevencao",
    eyebrow: "Esporte e prevenção",
    title: "Movimento com segurança em cada fase",
    description:
      "Fortalecimento, progressão de carga e respeito aos sinais do corpo fazem parte da prevenção. Depois de uma lesão, o retorno deve considerar o tipo de problema e a evolução individual.",
    links: [
      {
        slug: "corrida-como-proteger-os-joelhos",
        label: "Como proteger os joelhos na corrida",
      },
      {
        slug: "musculacao-beneficios-e-como-evitar-lesoes",
        label: "Musculação e prevenção de lesões",
      },
      {
        slug: "esteira-ergometrica-faz-mal-para-o-joelho",
        label: "Esteira e sobrecarga no joelho",
      },
      {
        slug: "lesionei-preciso-me-afastar-das-quadras",
        label: "Lesões e retorno às quadras",
      },
    ],
  },
] as const;

export default function JoelhoPage() {
  const posts = getAllPosts();
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
  const listedPosts = grupos.flatMap((grupo) =>
    grupo.links
      .map((link) => postsBySlug.get(link.slug))
      .filter((post) => post !== undefined),
  );

  const hubJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${site.url}/joelho#pagina`,
    url: `${site.url}/joelho`,
    name: "Saúde do Joelho: Sintomas, Lesões e Tratamentos",
    description:
      "Conteúdo sobre sintomas, condições, tratamentos, cirurgias e prevenção de problemas do joelho.",
    dateModified: "2026-09-25",
    author: { "@id": `${site.url}/#medico` },
    about: { "@type": "AnatomicalStructure", name: "Joelho" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listedPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${site.url}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={hubJsonLd} />
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Saúde do Joelho", path: "/joelho" },
        ])}
      />

      <PageHero
        breadcrumb="Saúde do Joelho"
        title={
          <>
            Sintomas, lesões e <Accent>tratamentos do joelho</Accent>
          </>
        }
        description="Um ponto de partida para entender os problemas mais comuns do joelho, as possibilidades de tratamento e os cuidados para voltar às suas atividades."
      />

      <section className="px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[920px]">
          <div className="reveal rounded-[18px] border border-line bg-bg-alt p-7 md:p-9">
            <p className="mb-3 text-h3 font-bold text-dark">
              Informação para conversar sobre sua saúde
            </p>
            <p className="text-[15px] leading-[1.8] text-muted">
              Artigos e guias sobre o joelho, com autoria identificada em cada página.
              Este material tem caráter informativo e não substitui uma avaliação médica individual.
            </p>
            <Link
              href="/blog/primeira-consulta-ortopedista-joelho"
              className="mr-6 mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-p underline underline-offset-4"
            >Como preparar sua consulta</Link>
            <Link
              href="/sobre"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-p hover:underline"
            >
              Conhecer formação e credenciais
              <ArrowRight width={16} height={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {grupos.map((grupo, grupoIndex) => (
        <section
          key={grupo.id}
          id={grupo.id}
          className={`scroll-mt-28 px-5 py-20 md:px-12 md:py-24 ${
            grupoIndex % 2 === 0 ? "bg-bg-alt" : "bg-white"
          }`}
        >
          <div className="mx-auto max-w-[1120px]">
            <SectionHeading
              eyebrow={grupo.eyebrow}
              title={<Accent>{grupo.title}</Accent>}
              sub={grupo.description}
            />
            <div className="reveal-group grid gap-5 md:grid-cols-2">
              {grupo.links.map((link) => {
                const post = postsBySlug.get(link.slug);
                if (!post) return null;

                return (
                  <Link
                    key={link.slug}
                    href={`/blog/${link.slug}`}
                    className="reveal card-lift group rounded-[18px] border border-line bg-white p-7 shadow-soft"
                  >
                    <h2 className="mb-3 text-h3 font-bold text-dark transition-colors duration-300 group-hover:text-p">
                      {link.label}
                    </h2>
                    <p className="mb-5 text-[15px] leading-[1.75] text-muted">
                      {post.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-p">
                      Ler orientação completa
                      <ArrowRight width={16} height={16} strokeWidth={2} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section className="px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[920px] text-center">
          <SectionHeading
            eyebrow="Avaliação individual"
            title={
              <>
                Cada joelho conta uma <Accent>história diferente</Accent>
              </>
            }
            sub="Sintomas parecidos podem ter causas diferentes. A consulta considera seu histórico, exame físico, rotina, prática esportiva e objetivos de recuperação."
          />
          <Link
            href="/especialidade"
            className="reveal inline-flex items-center gap-2 rounded-full border-2 border-p px-7 py-3.5 font-semibold text-p transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-p hover:text-white hover:shadow-[0_10px_28px_rgba(86,105,122,0.3)] active:translate-y-0 active:scale-[0.97]"
          >
            Ver tratamentos e cirurgias
            <ArrowRight width={17} height={17} strokeWidth={2} />
          </Link>
        </div>
      </section>

      <CtaStrip
        title="Precisa avaliar um sintoma no joelho?"
        text="Agende uma consulta para receber orientação de acordo com o seu caso."
      />
    </>
  );
}
