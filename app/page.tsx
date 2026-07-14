import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Accent, SectionHeading, CtaStrip } from "@/components/sections";
import { Calendar, ArrowRight, Search, Activity, Shield } from "@/components/icons";
import { locations } from "@/lib/locations";

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

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden px-5 pb-12 pt-24 sm:px-8 sm:pt-28 lg:min-h-screen lg:px-12 lg:pb-0 lg:pt-24">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 hidden w-[52%] bg-gradient-to-br from-p-muted to-[#dce4ea] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)] lg:block"
        />
        <div className="relative z-[2] mx-auto grid w-full max-w-[1120px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="anim-fade-up mb-7 inline-flex items-center gap-2 rounded-full bg-p-muted px-[18px] py-2 text-[13px] font-semibold tracking-[0.3px] text-p [animation-delay:0.05s]">
              <span className="h-2 w-2 rounded-full bg-p" />
              Ortopedista &amp; Traumatologista em São Paulo - SP
            </div>
            <h1 className="anim-fade-up text-[34px] font-extrabold leading-[1.04] tracking-[-1.5px] text-dark [animation-delay:0.15s] sm:text-5xl lg:text-6xl lg:tracking-[-2px]">
              Reconquiste sua <Accent>liberdade</Accent>
              <br />
              de movimento
            </h1>

            {/* Foto mobile */}
            <div className="anim-fade-up mb-6 mt-6 h-[240px] overflow-hidden rounded-[20px] shadow-[0_16px_48px_rgba(86,105,122,0.2)] sm:h-[360px] lg:hidden">
              <Image
                src="/assets/images/dr/home-1.jpg"
                alt="Dr. Joaquim Lopes"
                width={520}
                height={280}
                priority
                sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), 420px"
                className="h-full w-full object-cover object-top"
              />
            </div>

            <p className="anim-fade-up mb-10 max-w-[480px] text-[15px] leading-[1.75] text-muted [animation-delay:0.25s] md:text-lg">
              Dê passos firmes em direção a uma vida sem limitações. Com um
              especialista em Cirurgia do Joelho, você está no caminho certo para
              uma recuperação completa.
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
            <div className="h-[520px] w-[420px] max-w-full overflow-hidden rounded-[32px] shadow-photo">
              <Image
                src="/assets/images/dr/home-1.jpg"
                alt="Dr. Joaquim Lopes"
                width={420}
                height={520}
                priority
                sizes="420px"
                className="h-full w-full object-cover object-top"
              />
            </div>
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
          <div className="grid gap-6 md:grid-cols-3">
            {especialidades.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href="/especialidade"
                  className={`reveal reveal-d${i + 1} group rounded-[18px] border border-line bg-bg-alt p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-p-light hover:shadow-hover lg:p-11`}
                >
                  <div className="mx-auto mb-7 flex h-18 w-18 items-center justify-center rounded-[20px] bg-p transition-transform duration-300 group-hover:scale-105">
                    <Icon width={34} height={34} className="text-white" strokeWidth={1.6} />
                  </div>
                  <h3 className="mb-3 text-[22px] font-bold text-dark">{item.name}</h3>
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
          <div className="grid gap-[18px] md:grid-cols-2">
            {locations.map((loc, i) => (
              <article
                key={loc.schemaId}
                className={`reveal reveal-d${(i % 4) + 1} rounded-xl border border-line bg-white p-6 shadow-soft`}
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

      <CtaStrip
        title="Pronto para dar o primeiro passo?"
        text="Agende sua consulta e reconquiste sua qualidade de vida."
      />
    </>
  );
}
