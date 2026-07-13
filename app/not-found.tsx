import { Button } from "@/components/Button";
import { Accent } from "@/components/sections";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center px-5 py-24 md:px-12">
      <div className="mx-auto max-w-md text-center">
        <p className="mb-3 text-6xl font-extrabold tracking-tight text-p">404</p>
        <h1 className="mb-4 text-2xl font-extrabold tracking-[-1px] text-dark md:text-3xl">
          Página <Accent>não encontrada</Accent>
        </h1>
        <p className="mb-8 text-muted">
          O endereço que você procura não existe ou foi movido. Volte para a
          página inicial e continue navegando.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/">Ir para o início</Button>
          <Button href="/pre-agendamento" variant="outline">
            Agendar consulta
          </Button>
        </div>
      </div>
    </section>
  );
}
