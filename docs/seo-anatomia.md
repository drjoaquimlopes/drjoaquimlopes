# Anatomia do joelho — organização e busca

Atualização: 18/10/2026. Implementação verificada na versão local de produção e publicação autorizada pelo responsável. O resultado do deploy deve ser conferido no workflow do repositório e na URL pública. Não houve solicitação de indexação pela conta do Search Console.

## Página principal e caminhos de leitura

- URL canônica: https://www.drjoaquimlopes.com.br/joelho/anatomia
- A home apresenta o atlas; `/joelho` reúne anatomia, sintomas, tratamentos e prevenção.
- O rodapé mantém acesso direto ao atlas em todo o site.
- Os artigos relacionados a meniscos, LCA, dor, cartilagem, fortalecimento e lesões esportivas apresentam uma chamada para a anatomia. A seleção usa os links já associados às estruturas em `lib/knee-anatomy.ts`.
- O atlas contém links de volta para esses artigos. Cada estrutura tem sua própria âncora no guia, sem criar páginas duplicadas de pouco conteúdo.
- Modelo, guia e referências têm navegação própria. O guia mantém o que é, função e problemas por estrutura, disponível em HTML mesmo sem JavaScript ou WebGL.

## Implementação técnica

- H1 descritivo, título, descrição, canonical absoluto, Open Graph e Twitter com imagem de 1.200 × 800 px.
- Dados estruturados BreadcrumbList, MedicalWebPage e AnatomicalStructure, com oito estruturas ligadas ao conteúdo visível e à página principal de saúde do joelho.
- Não foi declarada revisão médica, autoria do médico ou data de revisão clínica para este material.
- Sitemap inclui URL e imagem do atlas. Datas de alteração da home e do hub acompanham a integração; não se altera a data a cada visita ou build.
- Robots permite rastreamento; a página responde 200 e não contém `noindex`.
- `llms.txt` também aponta para o guia, sem tratá-lo como fator de posicionamento no Google.
- As chamadas são componentes de servidor; não importam o visualizador nem solicitam o GLB na home ou nos artigos.

## Validação local

Build de produção das 29 páginas, ESLint e TypeScript aprovados. Auditoria no servidor local de produção com Edge: título/canonical/metadata/dados estruturados, sitemap com imagem, robots, 14 destinos internos com resposta 200, navegação pelas oito estruturas e leitura dos acordeões sem JavaScript. Links de descoberta conferidos na home, hub, rodapé e artigo de menisco. Ausência de downloads GLB nesses caminhos. Visualizador funcional e sem rolagem horizontal em 320, 390, 768 e 1.440 px.

Isso verifica a implementação, não comprova indexação, aprovação de rich results, Core Web Vitals de usuários reais ou ganho de posição.

## Publicação e acompanhamento

1. Concluir a revisão clínica e a confirmação dos direitos do modelo já documentadas em `revisao-anatomica.md` e `joelho-3d.md`.
2. Publicar pelo fluxo habitual do repositório. O workflow atual faz deploy em produção quando há alterações elegíveis na branch `main`; esta tarefa mantém o trabalho na branch de desenvolvimento.
3. Conferir a URL pública, canonical, imagem, `/robots.txt` e `/sitemap.xml` após o deploy. Usar o Rich Results Test/validador de schema para verificar a interpretação dos dados, sem presumir elegibilidade a um resultado especial.
4. Na propriedade existente do Search Console, inspecionar a URL pública, testar a versão publicada e solicitar indexação. Conferir também a leitura do sitemap existente; não é preciso reenviá-lo a cada visita ou criar outro sitemap.
5. Acompanhar o estado de indexação e o relatório de desempenho filtrado pela URL. Comparar impressões, cliques e consultas como “anatomia do joelho”, “ossos do joelho”, “meniscos” e “ligamentos do joelho” em períodos equivalentes, considerando o volume disponível.
6. Tratar cliques para contato como uma medida separada de consultas efetivamente agendadas. Nenhum novo rastreador foi adicionado.

Referências técnicas: [Google: SEO com JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [conteúdo útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) e [políticas de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
