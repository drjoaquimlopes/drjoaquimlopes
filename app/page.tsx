import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Accent, SectionHeading, CtaStrip } from "@/components/sections";
import { Calendar, ArrowRight, Search, Activity, Shield } from "@/components/icons";
import { locations } from "@/lib/locations";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";

const especialidades = [
  {
    icon: Search,
    name: "Exames",
    desc: "Avaliação clínica completa e diagnóstico preciso para identificar a melhor conduta para cada paciente.",
  },
  {
    icon: Activity,
    name: "Procedimentos",
    desc: "Tratamentos personalizados e procedimentos minimamente invasivos para sua recuperação com segurança.",
  },
  {
    icon: Shield,
    name: "Cirurgias",
    desc: "Especializado em Cirurgia do Joelho, incluindo LCA, artroplastia, menisco e outras intervenções de alta complexidade.",
  },
];

const sinaisParaAvaliacao = [
  {
    title: "Dor persistente no joelho",
    desc: "Dor que não melhora, limita caminhadas, exercícios ou atividades do dia a dia merece avaliação especializada.",
  },
  {
    title: "Inchaço, estalos ou travamento",
    desc: "Sintomas recorrentes podem estar relacionados a alterações nos meniscos, cartilagem ou outras estruturas do joelho.",
  },
  {
    title: "Instabilidade ao caminhar",
    desc: "A sensação de falseio pode ocorrer após lesões ligamentares, inclusive do ligamento cruzado anterior (LCA).",
  },
  {
    title: "Lesão durante o esporte",
    desc: "Traumas em corrida, futebol, tênis e academia precisam de diagnóstico correto para orientar um retorno seguro.",
  },
];

const perguntasFrequentes = [
  {
    question: "Quando devo procurar um ortopedista especialista em joelho?",
    answer:
      "Procure avaliação quando houver dor persistente, inchaço, limitação de movimento, travamento, instabilidade ou uma lesão durante a prática esportiva. Em casos de trauma importante ou incapacidade de apoiar o membro, busque atendimento imediato.",
  },
  {
    question: "Quais problemas no joelho são avaliados em consulta?",
    answer:
      "A consulta pode investigar lesões de menisco e ligamentos, artrose, alterações da cartilagem, tendinites, bursites, dor patelofemoral e lesões relacionadas ao esporte, entre outras condições.",
  },
  {
    question: "Toda dor no joelho precisa de cirurgia?",
    answer:
      "Não. A indicação depende do diagnóstico, da intensidade dos sintomas e dos objetivos do paciente. Muitos casos podem ser conduzidos com tratamento conservador; a cirurgia é considerada quando existe indicação clínica.",
  },
  {
    question: "Onde o Dr. Joaquim Lopes atende em São Paulo?",
    answer:
      "O atendimento é realizado na Vila Olímpia, Higienópolis, Jardim Paulista e Itaim Bibi, além de uma unidade em Osasco. Os endereços completos estão disponíveis nesta página.",
  },
  {
    question: "Como agendar uma consulta ortopédica?",
    answer:
      "Use o pré-agendamento do site ou entre em contato pelo WhatsApp. A equipe confirma a unidade, a disponibilidade de horário e as orientações para a consulta.",
  },
];

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "@id": `${site.url}/#pagina-inicial`,
  url: site.url,
  name: "Ortopedista em São Paulo - Dr. Joaquim Lopes",
  description:
    "Atendimento em ortopedia, traumatologia, cirurgia do joelho e medicina esportiva em São Paulo.",
  about: { "@id": `${site.url}/#medico` },
  mainEntity: { "@id": `${site.url}/#medico` },
  specialty: "Orthopedic",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: perguntasFrequentes.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <JsonLd data={faqJsonLd} />
      {/* ── HERO ── */}
      <section className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden px-5 pb-12 pt-24 sm:px-8 sm:pt-28 lg:min-h-screen lg:px-12 lg:pb-0 lg:pt-24">
        <div
          aria-hidden
          className="anim-gradient absolute inset-y-0 right-0 hidden w-[52%] bg-gradient-to-br from-p-muted via-[#e4eaf0] to-[#dce4ea] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)] lg:block"
        />
        <div
          aria-hidden
          className="anim-float pointer-events-none absolute -left-32 top-24 hidden h-80 w-80 rounded-full bg-p-light/25 blur-3xl lg:block"
        />
        <div
          aria-hidden
          className="anim-float-slow pointer-events-none absolute -right-10 bottom-0 hidden h-96 w-96 rounded-full bg-p-muted/70 blur-3xl lg:block"
        />
        <div className="relative z-[2] mx-auto grid w-full max-w-[1120px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="anim-fade-up mb-7 inline-flex items-center gap-2 rounded-full bg-p-muted px-[18px] py-2 text-[13px] font-semibold tracking-[0.3px] text-p [animation-delay:0.05s]">
              <span className="anim-pulse-dot h-2 w-2 rounded-full bg-p" />
              Ortopedista &amp; Traumatologista em São Paulo - SP
            </div>
            <h1 className="anim-fade-up text-[34px] font-extrabold leading-[1.04] tracking-[-1.5px] text-dark [animation-delay:0.15s] sm:text-5xl lg:text-6xl lg:tracking-[-2px]">
              Ortopedista em <Accent>São Paulo</Accent>
              <span className="mt-2 block text-[0.72em] leading-[1.12] tracking-[-1px] text-p-dark">
                especialista em joelho
              </span>
            </h1>

            {/* Foto mobile */}
            <div className="anim-fade-up group mb-6 mt-6 h-[240px] overflow-hidden rounded-[20px] shadow-[0_16px_48px_rgba(86,105,122,0.2)] sm:h-[360px] lg:hidden">
              <Image
                src="/assets/images/dr/home-1.jpg"
                alt="Dr. Joaquim Lopes, ortopedista em São Paulo especialista em joelho"
                width={520}
                height={280}
                priority
                sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), 420px"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </div>

            <p className="anim-fade-up mb-10 max-w-[480px] text-[15px] leading-[1.75] text-muted [animation-delay:0.25s] md:text-lg">
              Dr. Joaquim Lopes é ortopedista e traumatologista com foco em
              cirurgia do joelho e medicina esportiva. Realiza avaliação,
              tratamento e acompanhamento individualizado em São Paulo.
            </p>
            <div className="anim-fade-up flex flex-col gap-3.5 [animation-delay:0.35s] sm:flex-row sm:flex-wrap">
              <Button href="/pre-agendamento">
                <Calendar width={17} height={17} strokeWidth={2} />
                Agendar Consulta
              </Button>
              <Button href="/sobre" variant="outline">
                Conheça o Dr. Joaquim
                <ArrowRight width={17} height={17} strokeWidth={2} />
              </Button>
            </div>
            <div className="anim-fade-up mt-13 flex gap-10 [animation-delay:0.45s]">
              <div>
                <span className="block text-2xl font-extrabold tracking-[-1px] text-p-dark">
                  SBOT
                </span>
                <span className="text-xs font-medium text-muted">
                  Membro certificado
                </span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold tracking-[-1px] text-p-dark">
                  SBCJ
                </span>
                <span className="text-xs font-medium text-muted">
                  Especialista em Joelho
                </span>
              </div>
            </div>
          </div>

          {/* Foto desktop */}
          <div className="anim-fade-up hidden justify-center lg:flex [animation-delay:0.2s]">
            <div className="group h-[520px] w-[420px] max-w-full overflow-hidden rounded-[32px] shadow-photo transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5">
              <Image
                src="/assets/images/dr/home-1.jpg"
                alt="Dr. Joaquim Lopes, ortopedista em São Paulo especialista em joelho"
                width={420}
                height={520}
                priority
                sizes="420px"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── QUANDO PROCURAR ── */}
      <section id="quando-procurar" className="px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeading
            eyebrow="Avaliação ortopédica"
            title={
              <>
                Quando procurar um <Accent>ortopedista de joelho</Accent>?
              </>
            }
            sub="Uma avaliação especializada ajuda a identificar a causa dos sintomas e definir o tratamento adequado para cada caso."
          />
          <div className="reveal-group grid gap-5 sm:grid-cols-2">
            {sinaisParaAvaliacao.map((item) => (
              <article
                key={item.title}
                className="reveal card-lift rounded-[18px] border border-line bg-white p-7 shadow-soft"
              >
                <h3 className="mb-2 text-lg font-bold text-dark">{item.title}</h3>
                <p className="text-[15px] leading-[1.75] text-muted">{item.desc}</p>
              </article>
            ))}
          </div>
          <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/especialidade" variant="outline">
              Conhecer tratamentos e cirurgias
              <ArrowRight width={17} height={17} strokeWidth={2} />
            </Button>
            <Button href="/joelho">
              Explorar o guia de saúde do joelho
            </Button>
          </div>
        </div>
      </section>

      {/* ── SOBRE TEASER ── */}
      <section className="bg-bg-alt px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="reveal h-[280px] overflow-hidden rounded-[18px] shadow-hover sm:h-[420px] lg:h-[480px]">
            <Image
              src="/assets/images/dr/home-2.jpg"
              alt="Dr. Joaquim Lopes"
              width={560}
              height={480}
              sizes="(min-width: 1024px) 50vw, calc(100vw - 40px)"
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Sobre o médico"
              title={
                <>
                  Cuidado especializado com <Accent>empatia</Accent>
                </>
              }
            />
            <p className="reveal mb-7 -mt-10 text-base leading-[1.85] text-muted">
              Dr. Joaquim Lopes é especialista em Ortopedia, Traumatologia e
              Medicina do Esporte, com residência em Cirurgia do Joelho pela Santa
              Casa de São Paulo. Membro da SBCJ e da SBOT.
            </p>
            <p className="reveal mb-7 text-base leading-[1.85] text-muted">
              Seu atendimento é marcado pela escuta ativa, empatia e foco na
              recuperação completa do paciente, unindo técnica de excelência a um
              cuidado verdadeiramente humanizado.
            </p>
            <div className="reveal">
              <Button href="/sobre">
                Conhecer a trajetória
                <ArrowRight width={17} height={17} strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ESPECIALIDADES ── */}
      <section className="px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeading
            eyebrow="Especialidade"
            title={
              <>
                Do diagnóstico à <Accent>recuperação</Accent>
              </>
            }
            sub="Atendimento completo com foco em Cirurgia do Joelho, com diagnóstico, tratamento e cirurgias de alta complexidade."
          />
          <div className="reveal-group grid gap-6 md:grid-cols-3">
            {especialidades.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href="/especialidade"
                  className="reveal card-lift group rounded-[18px] border border-line bg-bg-alt p-8 text-center lg:p-11"
                >
                  <div className="mx-auto mb-7 flex h-18 w-18 items-center justify-center rounded-[20px] bg-p shadow-[0_8px_24px_rgba(86,105,122,0.25)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:rotate-3 group-hover:scale-105 group-hover:bg-p-dark">
                    <Icon width={34} height={34} className="text-white" strokeWidth={1.6} />
                  </div>
                  <h3 className="mb-3 text-[22px] font-bold text-dark transition-colors duration-300 group-hover:text-p">
                    {item.name}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-muted">{item.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LOCAIS ── */}
      <section className="bg-bg-alt px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeading
            eyebrow="Locais de atendimento"
            title={
              <>
                Consultas em <Accent>São Paulo e Osasco</Accent>
              </>
            }
            sub="O Dr. Joaquim Lopes atende em clínicas e hospitais de referência para ortopedia, traumatologia e cirurgia do joelho."
          />
          <div className="reveal-group grid gap-[18px] md:grid-cols-2">
            {locations.map((loc) => (
              <article
                key={loc.schemaId}
                className="reveal card-lift rounded-xl border border-line bg-white p-6 shadow-soft"
              >
                <h3 className="mb-2.5 text-lg font-bold text-dark">{loc.name}</h3>
                {loc.addressLines ? (
                  <p className="text-sm leading-[1.65] text-muted">
                    {loc.addressLines.map((line, j) => (
                      <span key={j} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-sm leading-[1.65] text-muted">
                    {loc.city} - {loc.region}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[860px]">
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title={
              <>
                Ortopedia e atendimento em <Accent>São Paulo</Accent>
              </>
            }
            sub="Informações gerais para ajudar você a entender quando buscar avaliação e como funciona o atendimento."
          />
          <div className="reveal-group space-y-3">
            {perguntasFrequentes.map((item) => (
              <details
                key={item.question}
                name="faq-home"
                className="reveal group rounded-[14px] border border-line bg-white px-6 py-5 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-p-light hover:shadow-hover open:border-p-light"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-dark transition-colors duration-300 marker:content-none group-hover:text-p">
                  {item.question}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-p-muted text-xl font-light leading-none text-p transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-p group-hover:text-white group-open:rotate-[135deg]"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 border-t border-line pt-4 text-[15px] leading-[1.8] text-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaStrip
        title="Pronto para dar o primeiro passo?"
        text="Agende sua consulta e reconquiste sua qualidade de vida."
      />
    </>
  );
}
