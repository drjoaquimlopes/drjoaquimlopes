import Link from "next/link";
import { ArrowRight } from "./icons";

const guides = [
  { title: "Lesão do LCA", description: "Entenda a reconstrução do ligamento cruzado anterior.", slug: "reconstrucao-do-lca-como-e-a-cirurgia" },
  { title: "Artrose e prótese de joelho", description: "Conheça as indicações e técnicas de artroplastia.", slug: "artroplastia-de-joelho-indicacoes-tecnicas-e-robotica" },
  { title: "Cartilagem e esporte", description: "Informações sobre desgaste e prática de atividade física.", slug: "desgaste-da-cartilagem-do-joelho-e-esporte" },
  { title: "Volta à atividade física", description: "O retorno à academia após uma cirurgia no joelho.", slug: "retornar-a-academia-apos-cirurgia-de-joelho" },
];

export function TreatmentLinks() {
  return (
    <section aria-labelledby="treatment-guides" className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-9 max-w-2xl">
          <h2 id="treatment-guides" className="text-h2 font-bold text-dark">Entenda seu joelho. Prepare suas perguntas.</h2>
          <p className="mt-5 text-lead text-muted">Informações para conversar com o médico sobre diagnóstico, opções de tratamento e retorno às atividades.</p>
        </div>
        <div className="grid gap-x-12 md:grid-cols-2">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/blog/${guide.slug}`} className="group flex items-center justify-between gap-5 border-t border-line py-7">
              <div><h3 className="text-xl font-semibold text-p group-hover:underline underline-offset-4">{guide.title}</h3><p className="mt-2 max-w-md text-muted">{guide.description}</p></div>
              <ArrowRight width={22} height={22} className="shrink-0 text-p" />
            </Link>
          ))}
        </div>
        <Link href="/joelho" className="mt-5 inline-flex min-h-11 items-center font-semibold text-p underline underline-offset-4">Ver todos os temas sobre saúde do joelho</Link>
      </div>
    </section>
  );
}
