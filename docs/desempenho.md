# Desempenho — 19 de outubro de 2026

## Diagnóstico

A página inicial já apresentava bom desempenho. Os relatórios PageSpeed enviados pelo responsável mostraram 96 no celular e 100 no desktop, com acessibilidade, boas práticas e SEO em 100. A principal oportunidade encontrada na auditoria foi o início prematuro do processamento WebGL na página de anatomia.

Auditoria adicional do site publicado, antes dos ajustes, com Lighthouse 13.5.0, navegador Edge/Chromium, carga inicial, sem consentimento de Analytics, perfil móvel padrão com simulação de rede lenta e CPU reduzida:

| Página | Desempenho | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: |
| Início | 92 | 3,21 s | 30 ms | 0 |
| Início, desktop | 100 | 0,80 s | 0 ms | 0 |
| Blog | 94 | 2,91 s | 45 ms | 0 |
| Artigo sobre artroplastia | 94 | 2,96 s | 27 ms | 0 |
| Anatomia do joelho | 61 | 2,99 s | 3.553 ms | 0 |
| Pré-agendamento | 94 | 2,97 s | 75 ms | 0 |
| Sobre | 93 | 3,06 s | 40 ms | 0 |

São medições individuais de laboratório, sujeitas a variações. Não equivalem aos resultados de usuários reais, nem substituem o relatório Core Web Vitals do Search Console. O PageSpeed enviado pelo responsável não tinha dados de campo suficientes.

## Ajustes

- A home usa uma única imagem principal, conservando o enquadramento e a posição em celular e desktop. Em um celular emulado com DPR 2, as duas imagens anteriores escondidas por CSS provocavam downloads de 750 e 1.080 px. Agora há apenas um download por abertura.
- A foto principal da home e as capas dos artigos recebem prioridade alta explícita. O logo continua carregando imediatamente, sem disputar um preload com a imagem principal. A foto de Sobre recebe carregamento imediato, prioridade alta e tamanhos condizentes com o espaço ocupado.
- O atlas inicia o código, o modelo e o WebGL quando uma parte significativa do palco entra na tela, em vez de iniciar 150 px antes da área visível. O limite considera a altura da viewport para funcionar também em modo paisagem. O conteúdo educativo continua disponível em HTML, independentemente do 3D.
- O renderizador agrupa as alterações no mesmo frame, evitando redesenhar a cena repetidamente para mudanças de câmera, camadas e seleção que chegam juntas. Continua sem loop de renderização ocioso.
- A detecção de hover no modelo ocorre no máximo uma vez por frame, somente com mouse sem botão pressionado; não disputa processamento com o gesto de toque/arraste. Os frames pendentes são cancelados na desmontagem.
- Arquivos originais de `/assets/` e `/models/knee/` recebem cache público de um dia e revalidação em segundo plano de até sete dias. Não se aplica cache imutável a nomes sem versão. Ao substituir um arquivo que precise mudar imediatamente, use novo nome ou versão na URL e atualize sua referência.
- O GLB, as texturas, os materiais, a resolução do renderizador e a anatomia permanecem iguais.

## Comparação controlada local

Builds de produção antes e depois, mesma máquina, navegador, perfil Lighthouse e origem local; uma leitura por caso. Não comparar diretamente esses tempos com o teste do servidor publicado:

| Página | Nota antes → depois | LCP antes → depois | TBT antes → depois |
| --- | ---: | ---: | ---: |
| Início, celular | 95 → 95 | 2,92 → 2,91 s | 40 → 38 ms |
| Início, desktop | 100 → 100 | 0,57 → 0,58 s | 0 → 0 ms |
| Anatomia, celular | 67 → 95 | 2,56 → 2,56 s | 3.673 → 162 ms |
| Artigo sobre artroplastia, celular | 96 → 96 | 2,66 → 2,71 s | 26 → 53 ms |

A transferência inicial do atlas caiu de aproximadamente 2,45 MB para 365 KB nesse perfil, pois o usuário começa lendo a introdução. O modelo de 2,09 MB continua sendo baixado ao explorar a área 3D; o custo não foi eliminado da interação. Quando o palco já aparece suficientemente na abertura de uma tela maior, ele carrega automaticamente.

## Verificação e manutenção

- ESLint sem avisos, TypeScript e build de produção.
- Dois testes do rig: geometria quantizada e retorno da flexão à posição original.
- Conferência em Edge emulado de 320×740, 390×844, 768×1024, 844×390, 1024×768 e 1440×1000, incluindo DPR 2. Sem rolagem horizontal; foto principal com um download, menu acessível, seleção/deseleção, flexão e pausa ao sair da área visível.
- Conferir os oito grupos e os controles do atlas após alterar o renderizador. Os testes visuais do modelo devem excluir a navegação fixa e o link de pular conteúdo, que podem sobrepor o recorte durante a rolagem; diferenças mínimas de arredondamento da GPU não significam deformação.
- Preservar o consentimento de Analytics e não carregar widgets de avaliações ou mapas pesados antecipadamente. A futura integração com as avaliações deve preferir HTML renderizado pelo servidor.
- Repetir PageSpeed em início, blog, um artigo, anatomia e agendamento após alterações significativas. Registrar o URL, data, dispositivo e consentimento. Priorizar LCP, bloqueio e estabilidade, evitando perseguir diferenças de um ponto de nota.
- Validar aparelhos reais Android/iOS quando disponíveis. A emulação não garante o desempenho de toda GPU, aparelho ou conexão. TBT é uma métrica de laboratório; não é uma medição de INP de usuários.

Referência: [Core Web Vitals](https://web.dev/articles/vitals). Objetivos de campo no percentil 75: LCP até 2,5 s, INP até 200 ms e CLS até 0,1.
