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

/**
 * Credenciais exibidas no hero — derivadas de site.qualifications.
 * Só siglas, para as colunas ficarem simétricas; a residência na Santa Casa
 * aparece por extenso no texto da seção "Sobre", logo abaixo.
 */
const credenciaisHero = [
  { sigla: "SBOT", label: "Título de especialista" },
  { sigla: "SBCJ", label: "Especialista em joelho" },
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
      "O atendimento é realizado na Vila Nova Conceição, Higienópolis, Jardim Paulista e Itaim Bibi, além de uma unidade em Osasco. Os endereços completos estão disponíveis nesta página.",
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

      {/* ══ HERO ══
          Altura menor que a viewport inteira: a seção seguinte aparece na
          dobra e convida a rolar sem precisar de um indicador explícito. */}
      <section className="relative flex min-h-[86vh] items-center overflow-hidden px-5 pb-16 pt-24 sm:px-8 sm:pt-28 lg:min-h-[90vh] lg:px-12 lg:pb-20">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 hidden w-[52%] bg-gradient-to-br from-p-muted to-[#dce4ea] [clip-path:polygon(18%_0,100%_0,100%_100%,4%_100%)] lg:block"
        />

        <div className="relative z-[2] mx-auto grid w-full max-w-[1120px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="anim-fade-up mb-5 text-xs font-bold uppercase tracking-[1.8px] text-p [animation-delay:0.05s]">
              Ortopedista e Traumatologista em São Paulo - SP
            </p>

            <h1 className="anim-fade-up text-display font-extrabold text-dark [animation-delay:0.15s]">
              Ortopedista em <Accent>São Paulo</Accent>
              <span className="mt-2 block text-[0.68em] leading-[1.15] text-p-dark">
                especialista em joelho
              </span>
            </h1>

            {/* Foto mobile */}
            <div className="anim-fade-up group mb-7 mt-7 h-[240px] overflow-hidden rounded-[20px] shadow-[0_16px_48px_rgba(86,105,122,0.2)] sm:h-[360px] lg:hidden">
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

            <p className="anim-fade-up mt-6 mb-9 max-w-[470px] text-lead text-muted [animation-delay:0.25s]">
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

            {/* Faixa de credenciais: colunas de largura igual, para o divisor
                nunca ficar órfão numa segunda linha. */}
            <dl className="anim-fade-up mt-11 grid max-w-[400px] grid-cols-2 border-t border-p/15 pt-6 [animation-delay:0.45s]">
              {credenciaisHero.map((item, i) => (
                <div
                  key={item.sigla}
                  className={i > 0 ? "border-l border-p/15 pl-6" : "pr-6"}
                >
                  <dt className="text-2xl font-extrabold tracking-[-0.02em] text-p-dark">
                    {item.sigla}
                  </dt>
                  <dd className="mt-0.5 text-xs font-medium text-muted">
                    {item.label}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="anim-fade-up mt-4 text-xs text-muted [animation-delay:0.45s]">
              {site.crmRqe}
            </p>
          </div>

          {/* Foto desktop */}
          <div className="anim-fade-up hidden justify-center lg:flex [animation-delay:0.2s]">
            <div className="group h-[540px] w-[420px] max-w-full overflow-hidden rounded-[32px] shadow-photo transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5">
              <Image
                src="/assets/images/dr/home-1.jpg"
                alt="Dr. Joaquim Lopes, ortopedista em São Paulo especialista em joelho"
                width={420}
                height={540}
                priority
                sizes="420px"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUANDO PROCURAR ══
          Lista com filetes em vez de quatro caixas iguais: o cabeçalho fica
          fixo à esquerda no desktop e os sinais correm ao lado. */}
      <section id="quando-procurar" className="px-5 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Avaliação ortopédica"
              title={
                <>
                  Quando procurar um <Accent>ortopedista de joelho</Accent>?
                </>
              }
              sub="Uma avaliação especializada ajuda a identificar a causa dos sintomas e definir o tratamento adequado para cada caso."
            />
            <div className="reveal flex flex-wrap gap-3">
              <Button href="/joelho" size="sm">
                Guia de saúde do joelho
                <ArrowRight width={16} height={16} strokeWidth={2} />
              </Button>
              <Button href="/especialidade" variant="outline" size="sm">
                Tratamentos e cirurgias
              </Button>
            </div>
          </div>

          <ul className="reveal-group flex flex-col">
            {sinaisParaAvaliacao.map((item) => (
              <li
                key={item.title}
                className="reveal border-t border-line py-7 first:border-t-0 first:pt-0"
              >
                <h3 className="mb-2 text-h3 font-bold text-dark">{item.title}</h3>
                <p className="max-w-[540px] text-[15px] leading-[1.75] text-muted">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ ESPECIALIDADE ══
          Sobe na página, logo depois dos sintomas: é o momento de conversão. */}
      <section className="bg-bg-alt px-5 py-20 md:px-12 md:py-28">
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

          <div className="reveal-group grid gap-6 md:grid-cols-3 md:gap-7">
            {especialidades.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href="/especialidade"
                  className="reveal card-lift group flex flex-col rounded-[20px] border border-line bg-white p-8 shadow-soft lg:p-9"
                >
                  <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-[18px] bg-p transition-colors duration-300 group-hover:bg-p-dark">
                    <Icon
                      width={30}
                      height={30}
                      className="text-white"
                      strokeWidth={1.6}
                    />
                  </span>
                  <h3 className="mb-3 text-h3 font-bold text-dark transition-colors duration-300 group-hover:text-p">
                    {item.name}
                  </h3>
                  <p className="mb-6 text-[15px] leading-relaxed text-muted">
                    {item.desc}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-p">
                    Saber mais
                    <ArrowRight width={15} height={15} strokeWidth={2} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ SOBRE ══ */}
      <section className="px-5 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-[1120px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="reveal reveal-left group h-[300px] overflow-hidden rounded-[20px] shadow-hover sm:h-[440px] lg:h-[500px]">
            <Image
              src="/assets/images/dr/home-2.jpg"
              alt="Dr. Joaquim Lopes em atendimento"
              width={560}
              height={500}
              sizes="(min-width: 1024px) 50vw, calc(100vw - 40px)"
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
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
            <p className="reveal mb-6 text-lead text-muted">
              Dr. Joaquim Lopes é especialista em Ortopedia, Traumatologia e
              Medicina do Esporte, com residência em Cirurgia do Joelho pela
              Santa Casa de São Paulo. Membro da SBCJ e da SBOT.
            </p>
            <p className="reveal mb-6 text-lead text-muted">
              Seu atendimento é marcado pela escuta ativa, empatia e foco na
              recuperação completa do paciente, unindo técnica de excelência a
              um cuidado verdadeiramente humanizado.
            </p>
            <p className="reveal mb-8 border-l-2 border-p-light pl-5 text-[15px] leading-[1.7] text-muted">
              Fellow avançado em Medicina Esportiva pelo Myongji Hospital, em
              Seul, na Coreia do Sul.
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

      {/* ══ LOCAIS ══
          Conteúdo de referência: peso visual reduzido de propósito, para não
          competir com as seções que carregam a decisão do paciente. */}
      <section className="bg-bg-alt px-5 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeading
            size="support"
            eyebrow="Locais de atendimento"
            title={
              <>
                Consultas em <Accent>São Paulo e Osasco</Accent>
              </>
            }
            sub="Clínicas e hospitais de referência para ortopedia, traumatologia e cirurgia do joelho."
          />
          <ul className="reveal-group grid gap-x-12 gap-y-0 sm:grid-cols-2">
            {locations.map((loc) => (
              <li
                key={loc.schemaId}
                className="reveal border-t border-line py-5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
              >
                <h3 className="mb-1 flex flex-wrap items-center gap-2 text-[15px] font-bold text-dark">
                  {loc.name}
                  {loc.primary && (
                    <span className="rounded-full bg-p-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.8px] text-p">
                      Consultório
                    </span>
                  )}
                </h3>
                {loc.addressLines ? (
                  <p className="text-sm leading-[1.6] text-muted">
                    {loc.addressLines.map((line, j) => (
                      <span key={j} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-sm leading-[1.6] text-muted">
                    {loc.city} - {loc.region}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="px-5 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[820px]">
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title={
              <>
                Ortopedia e atendimento em <Accent>São Paulo</Accent>
              </>
            }
            sub="Informações gerais para ajudar você a entender quando buscar avaliação e como funciona o atendimento."
          />
          <div className="reveal-group divide-y divide-line border-y border-line">
            {perguntasFrequentes.map((item) => (
              <details key={item.question} name="faq-home" className="reveal group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[17px] font-bold text-dark transition-colors duration-300 marker:content-none group-hover:text-p">
                  {item.question}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-p-muted text-xl font-light leading-none text-p transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-p group-hover:text-white group-open:rotate-[135deg]"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-12 text-[15px] leading-[1.8] text-muted">
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
