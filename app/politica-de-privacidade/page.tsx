import type { Metadata } from "next";
import { Accent, PageHero } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { CookiePreferences } from "@/components/CookiePreferences";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o site do Dr. Joaquim Lopes trata dados de navegação, contatos e serviços externos.",
  alternates: { canonical: "/politica-de-privacidade" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/politica-de-privacidade",
    title: "Política de Privacidade | Dr. Joaquim Lopes",
    description:
      "Saiba como o site do Dr. Joaquim Lopes trata dados de navegação, contatos e serviços externos.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Política de Privacidade | Dr. Joaquim Lopes",
    description:
      "Saiba como o site do Dr. Joaquim Lopes trata dados de navegação, contatos e serviços externos.",
    images: [],
  },
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
            {` ${site.name}`}. A seleção de unidade no agendamento prepara uma
            mensagem para o WhatsApp e não é armazenada no site. Não solicitamos
            nome, telefone ou informações clínicas por formulários próprios.
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

          <h2>Estatísticas e cookies opcionais</h2>
          <p>
            Com sua autorização, usamos o Google Analytics 4 para medir visitas,
            páginas acessadas e interações como cliques em agendamento, WhatsApp,
            artigos e no modelo educativo do joelho. O serviço pode utilizar cookies
            e informações técnicas do navegador e dispositivo. Um clique de contato
            não significa que uma mensagem foi enviada ou que uma consulta foi agendada.
          </p>
          <p>
            A tag de estatísticas só é carregada após sua aceitação. Você pode
            recusar ou mudar a escolha em “Preferências de cookies” no rodapé.
            A preferência é guardada neste navegador por até 180 dias. Se retirar
            a autorização, a coleta é desativada e os cookies de Analytics acessíveis
            ao site são removidos.
          </p>
          <p>
            Nossos eventos de clique não incluem nome, telefone, e-mail, mensagens,
            valores digitados ou informações clínicas. Não configuramos identificação
            por User-ID, Google Signals ou personalização publicitária. Os dados de
            navegação são processados pelo Google e podem envolver infraestrutura
            fora do Brasil, conforme suas políticas e os ajustes da propriedade de Analytics.
            Consulte a <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade do Google</a>.
          </p>
          <div className="rounded-xl bg-dark px-5 py-2"><CookiePreferences /></div>

          <h2>Serviços externos</h2>
          <p>
            A página inicial exibe avaliações públicas do perfil do Dr. Joaquim no
            Google, incluindo nome público do autor, foto pública quando disponível,
            nota, comentário e data da última atualização. A consulta às avaliações
            é feita pelo servidor do site, com atualização periódica. As fotos são
            carregadas dos servidores do Google ao visualizar os relatos, sem enviar
            o endereço da página como referência. Essa seção não carrega um widget
            do Google no seu navegador. Ao abrir o perfil pelo link, passam a valer as
            políticas do serviço externo.
          </p>
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

          <p>Última atualização: 23 de outubro de 2026.</p>
        </div>
      </article>
    </>
  );
}
