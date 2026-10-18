# Atlas interativo do joelho

Página em `/joelho/anatomia`, integrada à home, ao hub `/joelho` e aos artigos relacionados. Publicação autorizada pelo responsável em 18/10/2026. O resultado do deploy deve ser conferido no workflow de produção do repositório e na URL pública.

## Modelo e preparação

- Fonte fornecida no workspace: `knee-anatomy.zip`, contendo `source/Knee Anatomy.fbx` e 15 texturas PNG. O arquivo original permanece fora do repositório.
- O FBX contém três malhas por material. O pipeline recupera 13 superfícies desconectadas por conectividade geométrica, preservando as coordenadas UV.
- Uma ou duas passagens de subdivisão Loop suavizam a geometria conforme o tecido. São 79.792 triângulos antes da indexação e otimização, distribuídos pelas superfícies originais. Normais suavizadas entre as emendas UV e tangentes MikkTSpace dão continuidade à iluminação.
- O pipeline centraliza e orienta o modelo, usa texturas WebP de 1.024 ou 1.536 px e executa weld, dedup, quantização, compressão Meshopt e prune com glTF Transform.
- Os mapas originais de oclusão e rugosidade são combinados nos canais ORM de cada um dos três conjuntos de textura. Cinco materiais distinguem osso cortical, patela, meniscos, ligamentos e tendões.
- Arquivo entregue: `public/models/knee/knee.glb`, 2.093.612 bytes. Usa as extensões `EXT_texture_webp`, `KHR_mesh_quantization` e `EXT_meshopt_compression`, com decoder Meshopt incluído no carregamento do GLTFLoader.
- O visualizador usa materiais físicos, iluminação de estúdio com ambiente pré-filtrado, luz principal, preenchimento e recorte e sombra difusa de contato. O osso recebe variações sutis de cor e microtextura procedural; os tendões recebem fibras longitudinais. São recursos didáticos de acabamento, não detalhes anatômicos obtidos por escaneamento.
- A seleção preserva a cor natural do tecido e usa uma borda discreta. A abertura apresenta o modelo sólido, com foco na articulação; o botão “Ver modelo inteiro” permite reenquadrar. Há três vistas, rotação, zoom e transparência opcional para ver estruturas internas.
- Marcadores clicáveis de 01 a 08 correspondem aos números dos botões no painel. Cada marcador acompanha um vértice da estrutura ao girar, ampliar e dobrar o joelho; linhas finas mantêm a referência quando os números são afastados para evitar sobreposição. Têm alvo de toque de 44 px e acesso por teclado. O marcador muscular desaparece quando sua camada é ocultada, e todos são removidos na desmontagem do visualizador.
- Cinco controles independentes de camadas: ossos, meniscos, ligamentos, tendões e músculos. Selecionar uma estrutura revela sua camada automaticamente. O estado sem camadas oferece recuperação explícita; “Restaurar visão” recompõe camadas, câmera frontal, pose de repouso e o estado inicial do destaque.
- Selecionar pelo modelo ou pelo painel realça a estrutura e suaviza as demais. “Ver conjunto” remove o destaque preservando as camadas escolhidas. As estruturas suavizadas continuam selecionáveis.
- Clicar novamente na mesma estrutura, pelo número, painel ou superfície do modelo, remove o destaque e fecha o resumo móvel. Cores, contornos e estados dos botões voltam ao conjunto, mantendo câmera, zoom, flexão e camadas; o painel conserva o último texto para leitura.
- No celular, o toque no número abre um resumo com função e opção de expandir definição, problemas associados e artigo relacionado. O resumo não bloqueia o modelo, pode ser fechado por botão ou Escape, devolve foco ao número e ajusta a rolagem apenas quando necessário para não cobrir o ponto selecionado.
- Uma camada original de sete volumes musculares procedurais representa, de forma esquemática, a região anterior e posterior da coxa e a panturrilha. Tem formas afiladas, fibras longitudinais e tons avermelhados; não acrescenta downloads ao GLB. Pode ser ocultada pelo botão “Músculos”. Meniscos em azul acinzentado e ligamentos em tom palha ajudam a distinguir os tecidos.
- Carrega código e modelo ao se aproximar da área visível. Renderiza sob demanda, sem animação contínua. Desmontagem libera controles, observador, geometrias, materiais, texturas e ambiente pré-filtrado.

Para regenerar, extraia o ZIP e execute:

```sh
npm run model:prepare -- /caminho/da/pasta-extraida
npm run model:validate
npm run check
```

O argumento aponta para a pasta que contém `source/` e `textures/`. Sem argumento, usa `../knee-source`, organização deste workspace. O GLB já está pronto para deploy: não é necessário regenerá-lo durante o build do site.

## Conteúdo e limites anatômicos

Oito grupos interativos: meniscos, ligamentos, patela, tendões, fêmur, tíbia, fíbula e músculos. Cada grupo apresenta definição, função, problemas associados e um artigo existente do site. Os dois meniscos e os ligamentos não são identificados individualmente nesta primeira versão; o aparelho extensor também está agrupado. A cartilagem articular não é uma malha individualizada no arquivo fornecido, e essa limitação aparece na página.

Os nomes foram atribuídos pela posição e pelo formato das superfícies recuperadas, não por metadados anatômicos existentes no FBX. A subdivisão é uma melhoria visual, não uma validação clínica. Revisar o mapeamento e a representação das estruturas com o Dr. Joaquim antes de produção; o modelo não deve ser apresentado como exame ou ferramenta de diagnóstico.

O pacote de revisão em [revisao-anatomica.md](revisao-anatomica.md) contém seis vistas focadas de patela, meniscos e ligamentos, com os nomes de origem e os pontos de conferência. Esta etapa aprimorou a inspeção e a apresentação das estruturas; a aprovação anatômica continua pendente.

Os textos novos são educativos, baseados nas referências AAOS vinculadas na página. Não foram revisados pelo Dr. Joaquim, e os dados estruturados não atribuem a ele autoria ou revisão deste novo conteúdo. A publicação deve passar pela revisão clínica do responsável.

O ZIP fornecido não inclui arquivo de licença, autoria ou atribuição. Confirmar os direitos de uso e os créditos exigidos pelo fornecedor do modelo antes de sua publicação pública.

## Movimento ilustrativo

O controle “Dobre o joelho” permite selecionar de 0° a 110° com mouse, toque ou teclado. Reproduzir inicia um ciclo de 0° a 100° na vista lateral; pausar ou mover a barra interrompe a reprodução. A animação também para quando a aba ou o modelo deixam de estar visíveis.

A coxa permanece fixa e a tíbia, fíbula e os meniscos acompanham um pivô simplificado de flexão. A patela percorre uma trajetória aproximada. Os ligamentos, o aparelho extensor e os músculos usam pesos de deformação para manter continuidade visual entre as regiões. Toda pose é calculada a partir da geometria de repouso, sem acumular deformações. Os atributos inteiros normalizados do GLB são convertidos em Float32 antes da deformação.

É uma demonstração visual da flexão, não uma simulação biomecânica: não calcula rolamento e deslizamento reais, rotação tibial, forças, tensões, colisões, inserções exatas ou amplitude individual. As formas musculares e a trajetória de movimento precisam de revisão anatômica pelo responsável antes de produção. Essa natureza ilustrativa também aparece na interface.

## Busca e acessibilidade

- Página estática com título, descrição, canonical próprio, Open Graph, breadcrumb, dados estruturados MedicalWebPage e AnatomicalStructure e inclusão no sitemap.
- Guia completo em HTML pré-renderizado, com acordeões nativos, disponível sem JavaScript e sem WebGL. A experiência 3D complementa esse conteúdo; não substitui o texto indexável.
- Acesso pela home, hub Saúde do Joelho, rodapé e chamadas nos artigos ligados às estruturas do modelo. Esses links são HTML estático e não carregam o modelo fora da página de anatomia.
- Índices de navegação para modelo, guia, referências e oito estruturas. Canonical, metadata, imagem social e sitemap compartilham os dados de `lib/knee-page.ts`.
- Não há promessa de posicionamento ou rich results. Plano de publicação e acompanhamento em `docs/seo-anatomia.md`.
- Seleção por botões acessíveis ao teclado, estado `aria-pressed`, painel anunciado por `aria-live`, zoom por botões e preservação da rolagem da página.
- Falha de carregamento ou WebGL mantém a lista e os textos, com opção de tentar novamente.

## Verificação realizada

- ESLint sem avisos, TypeScript e build de produção Next.js.
- Validação glTF: zero erros e zero avisos, inclusive na geometria descomprimida pelo decoder Meshopt. O validador informa que não verifica internamente a extensão Meshopt; por isso a verificação adicional do conteúdo descomprimido.
- Navegador Edge com WebGL: seleção dos oito grupos, clique real na tíbia, vistas, zoom, reenquadramento completo/detalhe, transparência, camada muscular, seleção por teclado e ausência de erros JavaScript.
- Movimento: extremos de 0° e 110°, mudança efetiva da anatomia renderizada, retorno visual exato ao repouso, reprodução, pausa e uso do controle no celular.
- Numeração: clique nos oito marcadores com confirmação do painel correspondente, acompanhamento da câmera e da flexão, ocultação da camada muscular e alvos de toque no layout de 390 px.
- Camadas e destaque: cinco grupos independentes, ocultação total, seleção de parte oculta com recuperação da camada, destaque, visão de conjunto e restauração completa da câmera/pose/camadas.
- Celular: resumo junto ao modelo, expansão dos detalhes, fechamento por Escape, retorno do foco ao número e preservação da estrutura selecionada acima do resumo. Layout conferido em 320, 375, 390, 768 e 1.440 px.
- Testes do rig em `scripts/knee-rig.test.mjs`: conversão correta de coordenadas quantizadas, fêmur fixo, comprimento preservado da perna, deformações finitas e restauração exata dos tecidos. Executar com `node --experimental-strip-types --test scripts/knee-rig.test.mjs` (Node 22.6+).
- Layout em viewport de 390 px sem overflow horizontal.
- Leitura e funcionamento dos acordeões sem JavaScript.
- Falha simulada do download do GLB, uso do painel no fallback e recuperação pelo botão de tentar novamente.

Testes locais executados com Node 24 do runtime disponível; o projeto mantém o requisito Node 22 para deploy. Não foram realizados auditoria clínica, validação em aparelhos físicos ou acompanhamento de resultados no Search Console.
