import type { Metadata } from "next";
import Link from "next/link";
import { KneeExplorer } from "@/components/knee/KneeExplorer";
import { JsonLd } from "@/components/JsonLd";
import { CtaStrip } from "@/components/sections";
import { breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { anatomyReferences, kneeParts } from "@/lib/knee-anatomy";
import { kneePage } from "@/lib/knee-page";
import "./anatomia.css";

const { title, description } = kneePage;
export const metadata: Metadata = {
  title, description, alternates: { canonical: kneePage.path },
  openGraph: { title, description, url: kneePage.path, type: "website", images: [{ url: kneePage.image, width: 1200, height: 800, alt: "Explore a anatomia do joelho em 3D" }] },
  twitter: { card: "summary_large_image", title, description, images: [kneePage.image] },
};

export default function KneeAnatomyPage() {
  const pageUrl = `${site.url}${kneePage.path}`;
  const anatomy = {
    "@type": "AnatomicalStructure",
    "@id": `${pageUrl}#articulacao`,
    name: "Joelho",
    subStructure: kneeParts.map(part => ({
      "@type": "AnatomicalStructure",
      "@id": `${pageUrl}#estrutura-${part.id}`,
      url: `${pageUrl}#${part.id}`,
      name: part.name,
      description: part.what,
    })),
  };
  return <>
    <JsonLd data={breadcrumb([{ name: "Início", path: "/" }, { name: "Saúde do Joelho", path: "/joelho" }, { name: "Anatomia do joelho", path: "/joelho/anatomia" }])} />
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "@id": `${pageUrl}#pagina`,
      url: pageUrl, name: title, description,
      inLanguage: "pt-BR", dateModified: kneePage.modified,
      about: anatomy,
      primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}${kneePage.image}`, width: 1200, height: 800 },
      citation: anatomyReferences.map(reference => reference.href),
      isPartOf: [{ "@id": `${site.url}/#website` }, { "@id": `${site.url}/joelho#pagina` }],
      hasPart: kneeParts.map(part => ({ "@type": "WebPageElement", "@id": `${pageUrl}#${part.id}`, name: part.name, about: { "@id": `${pageUrl}#estrutura-${part.id}` } })),
    }} />
    <section className="knee-page-intro">
      <div className="knee-page-container">
        <nav aria-label="Navegação estrutural" className="knee-breadcrumb"><Link href="/">Início</Link><span aria-hidden="true">/</span><Link href="/joelho">Saúde do joelho</Link><span aria-hidden="true">/</span><span>Anatomia</span></nav>
        <div className="knee-intro-row">
          <div><p className="knee-eyebrow">CONHEÇA SEU JOELHO · ATLAS INTERATIVO</p><h1>Anatomia do <em>joelho</em> em 3D.</h1></div>
          <p className="knee-intro-description">Por trás de cada movimento, existe uma estrutura.<br className="hidden sm:block" /> Explore o joelho em 3D e entenda como cada parte ajuda você a seguir em frente.</p>
        </div>
        <nav aria-label="Nesta página" className="knee-page-index"><a href="#modelo-3d">Explorar o modelo 3D</a><a href="#guia-anatomia">Ler o guia de anatomia</a><a href="#referencias">Consultar referências</a></nav>
        <div id="modelo-3d" className="knee-anchor"><KneeExplorer /></div>
        <p className="knee-model-note">Modelo ilustrativo, com músculos simplificados, estruturas agrupadas e cores didáticas. A flexão representa o movimento de forma aproximada; não simula toda a mecânica da articulação nem a amplitude individual. Não representa um exame.</p>
      </div>
    </section>
    <section id="guia-anatomia" className="knee-guide knee-page-container">
      <div className="knee-guide-intro"><p className="knee-eyebrow">GUIA DE ANATOMIA DO JOELHO</p><h2>Como o joelho funciona?</h2><p>O joelho conecta a coxa à perna. Ossos, cartilagem, meniscos, ligamentos e tendões atuam juntos para combinar movimento, sustentação e estabilidade.</p><p>Conheça abaixo as estruturas do modelo. A cartilagem articular, que reveste as superfícies dos ossos, não está individualizada nesta visualização.</p><nav aria-label="Estruturas do joelho" className="knee-structure-index">{kneeParts.map(part => <a key={part.id} href={`#${part.id}`}><span>{part.number}</span>{part.name}</a>)}</nav><Link href="/blog/desgaste-da-cartilagem-do-joelho-e-esporte">Entenda também a cartilagem articular ↗</Link></div>
      <div className="knee-guide-parts">
        {kneeParts.map(part => <details key={part.id} id={part.id} className="knee-guide-part"><summary><span>{part.number}</span><h3>{part.name}</h3><span aria-hidden="true">+</span></summary><div><h4>O que é</h4><p>{part.what}</p><h4>Função no joelho</h4><p>{part.function}</p><h4>Problemas que podem afetar essa estrutura</h4><p>{part.problems}</p><Link href={part.link}>{part.linkLabel} ↗</Link></div></details>)}
      </div>
    </section>
    <section className="knee-care-note knee-page-container"><h2>Conhecer ajuda. Avaliar faz a diferença.</h2><p>Dor, inchaço, travamento ou instabilidade podem ter diferentes causas. O local da dor, sozinho, não identifica a estrutura afetada. Em caso de trauma importante ou incapacidade de apoiar a perna, procure atendimento imediato.</p><Link href="/blog/dor-no-joelho-quando-procurar-atendimento">Quando procurar atendimento →</Link></section>
    <section id="referencias" className="knee-references knee-page-container knee-anchor" aria-labelledby="referencias-titulo"><h2 id="referencias-titulo">Referências sobre a anatomia do joelho</h2><p>Conteúdo educativo com referências da American Academy of Orthopaedic Surgeons (AAOS). Não substitui uma avaliação médica individual.</p><div>{anatomyReferences.map(r => <a href={r.href} key={r.href} target="_blank" rel="noopener noreferrer">{r.name} ↗</a>)}</div></section>
    <CtaStrip title="Seu joelho merece atenção." text="Converse com a equipe para escolher uma unidade e agendar sua avaliação com o Dr. Joaquim Lopes." />
  </>;
}
