import { site } from "@/lib/site";
import { Button } from "./Button";

export function GoogleReviewsLink() {
  return (
    <section aria-labelledby="google-reviews-title" className="border-y border-line bg-bg-alt px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1120px] flex-col items-start justify-between gap-7 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 id="google-reviews-title" className="text-h3 font-bold text-dark">Conheça também as avaliações no Google</h2>
          <p className="mt-3 leading-relaxed text-muted">Leia os relatos publicados pelos pacientes no perfil do Dr. Joaquim Lopes.</p>
        </div>
        <Button href={site.googleProfileUrl} external variant="outline" className="shrink-0" ariaLabel="Ver perfil e avaliações no Google (abre em nova aba)">Ver avaliações no Google</Button>
      </div>
    </section>
  );
}
