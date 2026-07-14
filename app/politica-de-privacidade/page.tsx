import type { Metadata } from "next";
import { Accent, PageHero } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o site do Dr. Joaquim Lopes trata dados de navegação, contatos e serviços externos.",
  alternates: { canonical: "/politica-de-privacidade" },
  robots: { index: true, follow: true },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Política de privacidade", path: "/politica-de-privacidade" },
        ])}
      />

      <PageHero
        breadcrumb="Política de privacidade"
        title={
          <>
            Política de <Accent>privacidade</Accent>
          </>
        }
        description="Transparência sobre o tratamento de dados e os serviços utilizados neste site."
      />

      <article className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="prose-article mx-auto max-w-[760px]">
          <p>
            Este site apresenta informações institucionais e conteúdos de saúde do
            {` ${site.name}`}. Não solicitamos dados pessoais por formulários próprios.
          </p>

          <h2>Dados de navegação</h2>
          <p>
            O provedor de hospedagem pode registrar informações técnicas necessárias
            para segurança e funcionamento, como endereço IP, navegador, dispositivo,
            páginas acessadas e data do acesso.
          </p>

          <h2>Contato e agendamento</h2>
          <p>
            Os links de telefone, e-mail e WhatsApp direcionam para serviços externos.
            Os dados enviados nesses canais são tratados conforme a finalidade do
            contato e as políticas dos respectivos provedores.
          </p>

          <h2>Serviços externos</h2>
          <p>
            A página de agendamento incorpora o Google Maps e o site possui links para
            redes sociais. Esses serviços podem processar dados de navegação conforme
            suas próprias políticas de privacidade.
          </p>

          <h2>Seus direitos e contato</h2>
          <p>
            Para solicitar informações, correção ou exclusão de dados enviados
            diretamente à equipe, entre em contato pelo e-mail
            {` ${site.email}`}.
          </p>

          <p>Última atualização: 13 de julho de 2026.</p>
        </div>
      </article>
    </>
  );
}
