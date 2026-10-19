# URLs antigas no Search Console

Conferência pública em 19/10/2026, a partir de captura do relatório “Não encontrado (404)”. A captura contém dez dos dezoito exemplos; os oito restantes ainda não foram fornecidos. As datas de último rastreamento mostradas vão de abril a julho e não descrevem necessariamente o estado atual.

| Caminho informado | Resposta antes da correção | Tratamento |
| --- | --- | --- |
| `/sobre/index.html` | 404 | Redirecionamento permanente para `/sobre`. |
| `/especialidade/index.html` | 404 | Redirecionamento permanente para `/especialidade`. |
| `/blog/` no domínio sem www | Normaliza domínio/barra e termina em 200 em `https://www.drjoaquimlopes.com.br/blog` | Já funciona; nenhum novo redirecionamento necessário. |
| `/author/toon/` | Normaliza domínio/barra e termina em 404 | Não existe arquivo de autor equivalente no site atual. Mantido como 404. |
| `/tag/sutura-de-menisco/` | Normaliza domínio/barra e termina em 404 | Arquivo de tag sem substituto equivalente confirmado. Mantido como 404. |
| `/tag/dor-no-joelho/` | Normaliza domínio/barra e termina em 404 | Arquivo de tag sem substituto equivalente confirmado. Mantido como 404. |
| `/tag/joelho/` | Normaliza domínio/barra e termina em 404 | Arquivo de tag sem substituto equivalente confirmado. Mantido como 404. |
| `/tag/lesao-de-menisco/` | Normaliza domínio/barra e termina em 404 | Arquivo de tag sem substituto equivalente confirmado. Mantido como 404. |
| `/tag/infiltracao/` | Normaliza domínio/barra e termina em 404 | Arquivo de tag sem substituto equivalente confirmado. Mantido como 404. |
| `/dor-no-joelho-infiltracao-resolve-o-problema/` | Normaliza domínio/barra e termina em 404 | Artigo antigo sem conteúdo original disponível para mapear a um equivalente. Não foi redirecionado para o texto de bursite patelar, pois não foi confirmada equivalência. |

Os dois novos redirecionamentos são declarados em `next.config.ts` com `permanent: true` (308 no Next.js). Os caminhos antigos não entram no sitemap; os destinos canônicos já estão nele. URLs realmente removidas sem substituto podem continuar em 404. Não foi criada regra que envie indiscriminadamente tags, autores ou artigos removidos para a home.

Verificação local no build de produção: novos e antigos redirecionamentos permanentes, preservação de parâmetros de consulta, destinos 200 com canonical correto, rotas atuais e respostas 404 sem regras amplas. Sitemap mantém somente os destinos atuais. ESLint e build das 29 páginas, incluindo TypeScript, aprovados.

Para concluir a análise do relatório, conferir os exemplos 11–18. Para mapear o artigo antigo, obter o conteúdo anterior ou uma substituição confirmada pelo responsável. A conferência pública não acessou dados de cliques, backlinks ou registros de rastreamento da conta do Search Console.

Referências: [Google: migração e mapeamento de URLs](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes?hl=pt-br) e [relatório de indexação / respostas 404](https://support.google.com/webmasters/answer/7440203?hl=pt-BR).
