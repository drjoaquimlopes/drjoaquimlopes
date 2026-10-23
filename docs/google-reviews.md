# Avaliações do Google

Integração em 23/10/2026 com a API do Perfil da Empresa, autorizada pelo administrador do perfil. Não usa Places API, scraping, widget ou biblioteca externa no navegador.

## Exibição e desempenho

- A página inicial permanece estática. Um componente pequeno consulta `/api/google-reviews` ao se aproximar da seção, sem bloquear a primeira tela.
- Nota média e quantidade total vêm do Google. Os três relatos mais recentemente atualizados seguem `updateTime desc`, sem filtragem pela quantidade de estrelas. Textos são preservados e podem ser expandidos.
- Autoria pública, data da atualização, estrelas e origem são exibidas. As iniciais substituem fotos externas para evitar requisições adicionais do navegador. O link abre o perfil, não um permalink individual de cada avaliação.
- Não são criados dados estruturados `Review` ou `AggregateRating`, nem prometidas estrelas nos resultados de pesquisa.
- Cache somente em memória por até uma hora em cada instância do servidor; instâncias novas podem consultar antes disso. Requisições simultâneas compartilham a mesma consulta. Não há cópia em disco, cache público/CDN ou geração estática das avaliações.
- A seção aberta é atualizada ao vencer o período; consultas são retomadas ao voltar à aba/seção. Dados expirados não são mantidos indefinidamente caso o Google falhe. O link para o perfil continua disponível e há opção de tentar novamente.
- Cliques para o perfil geram `google_reviews_click` somente com consentimento de estatísticas, sem nomes ou comentários.

## Credenciais e implantação

Variáveis exclusivas do servidor: `GBP_CLIENT_ID`, `GBP_CLIENT_SECRET`, `GBP_REFRESH_TOKEN`, `GBP_LOCATION_NAME`. Nenhuma usa prefixo `NEXT_PUBLIC_`.

O desenvolvimento usa `.env.local`, ignorado pelo Git. O workflow `deploy-main.yml` recebe quatro secrets criptografados do GitHub e os fornece ao ambiente de execução da Vercel. Reimplantações por outro caminho precisam receber a mesma configuração. Nunca inserir o JSON OAuth, tokens ou `.env.local` no repositório, tickets ou mensagens.

O endpoint público retorna apenas nota, contagem, horário da consulta e os campos públicos das três avaliações. Tokens, respostas administrativas e credenciais não são devolvidos. A consulta é feita pelo servidor com tempo limite; falhas têm resposta genérica `503`, `Retry-After: 60` e nenhuma resposta bruta do Google é registrada. As respostas públicas usam `Cache-Control: no-store`.

## Reconectar o perfil

1. Manter habilitadas Google My Business API, My Business Account Management API e My Business Business Information API no projeto aprovado.
2. Manter o app OAuth externo em produção. Em teste, autorizações com esse escopo podem expirar em sete dias. Produção não impede revogação pelo administrador nem substitui eventual exigência de verificação do Google.
3. No cliente OAuth do tipo aplicativo Web, permitir `http://localhost:8765/callback`. Baixar o JSON e guardá-lo fora do repositório.
4. Executar `node scripts/google-business-connect.mjs ../c.json`, ajustando o caminho ao arquivo privado, e abrir o endereço local impresso. Somente o administrador do perfil deve autorizar. O escopo disponível `business.manage` permite gerenciamento; esta implementação usa somente leitura de contas, locais e avaliações.
5. O utilitário valida estado e PKCE, grava a autorização local e identifica os locais em `.google-business/locations.json`, também ignorado. Se houver vários perfis, escolher explicitamente o correto para `GBP_LOCATION_NAME`; não selecionar outro negócio automaticamente.
6. Atualizar os quatro secrets do GitHub e reimplantar. Não há endpoint de administração ou OAuth publicado no site.

Perfil confirmado nesta configuração: Dr. Joaquim Lopes — Ortopedista, com website `drjoaquimlopes.com.br`. A autorização pode ser revogada na conta Google; para desligamento imediato, remover a configuração e reimplantar (o cache existente tem limite de uma hora).

## Verificação

`node --experimental-strip-types --test scripts/google-reviews.test.mjs` cobre normalização sem alteração do conteúdo, anonimato, notas baixas, deduplicação, expiração, falha/recuperação e configuração ausente. Conferir também build, acessibilidade no navegador, expansão por teclado, seção em telas pequenas e resposta pública em produção.

Verificação local em 23/10/2026: API real retornou nota 5,0, total 78 e três relatos. Navegador em 320, 390, 768 e 1440 px: sem rolagem lateral, expansão por teclado, carregamento adiado, recuperação após falha, link sem JavaScript e nenhum pedido externo no navegador com estatísticas recusadas. Evento de perfil conferido com coleta interceptada. Credenciais ausentes dos bundles públicos. Lighthouse local: desempenho 95 no celular e 100 no computador; acessibilidade, boas práticas e SEO 100 em ambos. São medições de laboratório, sujeitas a variação e não garantem notas idênticas em produção.

Referências: [listagem de avaliações](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list), [OAuth](https://developers.google.com/my-business/content/implement-oauth), [políticas](https://developers.google.com/my-business/content/policies), [validade de tokens](https://developers.google.com/identity/protocols/oauth2#expiration).
