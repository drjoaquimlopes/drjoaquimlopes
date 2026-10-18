import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { kneePage } from "@/lib/knee-page";

/** Link estático: não carrega o visualizador nem os arquivos do modelo 3D. */
export function KneeAtlasLink({ compact = false }: { compact?: boolean }) {
  return (
    <Link href={kneePage.path} className={`group flex flex-col gap-5 rounded-[18px] border border-p/20 bg-[#eff4f1] transition-colors hover:bg-[#e4eee8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-p ${compact ? "p-6" : "p-7 sm:flex-row sm:items-center sm:justify-between md:p-9"}`}>
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-p">Conheça seu joelho · Atlas interativo</p>
        <h2 className={`${compact ? "text-h3" : "text-h2"} font-semibold text-dark`}>Anatomia do joelho em 3D</h2>
        <p className="mt-3 max-w-[580px] text-sm leading-7 text-muted">Gire o modelo, simule a flexão e explore ossos, meniscos, ligamentos, tendões e músculos. Entenda o que cada estrutura faz e continue a leitura nos artigos relacionados.</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-3 text-sm font-bold text-p">Explorar a anatomia <ArrowRight width={18} height={18} /></span>
    </Link>
  );
}
