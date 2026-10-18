# Atlas do joelho — verificação em telas móveis

Data: 18/10/2026.

## Ambiente

Edge/Chromium com viewport móvel e eventos de toque emulados. Tamanhos: 320 × 740, 375 × 812, 390 × 844, 430 × 932, 844 × 390 (horizontal) e 768 × 1.024 px (tablet). Não equivale a uma validação em iPhone/Safari ou Android físico.

## Cenários conferidos

- Menu móvel abre e fecha por toque; o conteúdo de fundo fica inerte enquanto o menu está aberto.
- Sem rolagem horizontal ou controles de camadas cortados nos seis tamanhos.
- Cinco camadas podem ser ocultadas, com recuperação pelo estado vazio.
- Marcadores mantêm alvos de toque de 44 px. Na largura de 390 px, os oito grupos foram selecionados e desmarcados por toque.
- Resumo móvel abre, expande definição/função/problemas e fecha por toque. O segundo toque na mesma estrutura remove o destaque.
- Zoom, vistas, transparência, flexão por toque, reprodução/pausa e restauração respondem aos controles.
- Gestos no build de produção: arrasto horizontal gira o modelo, arrasto vertical sobre ele permite rolar a página, e arrasto do controle de flexão dobra o joelho.
- Ações flutuantes ficam ausentes durante a interação com o atlas e reaparecem ao chegar às referências e na home.
- Guia em HTML e acordeões continuam disponíveis para leitura.

ESLint sem avisos e build de produção das 29 páginas, incluindo a verificação TypeScript, aprovados.

## Correção encontrada nesta verificação

O link flutuante de agendamento podia cobrir a barra de flexão, interceptando o toque em telas pequenas. `FloatingActions` agora observa a presença do atlas na tela e oculta as ações flutuantes enquanto ele estiver visível. Os links de agendamento voltam fora do atlas; a chamada final para consulta permanece na página.

O observador é desconectado ao sair da rota. O comportamento das ações flutuantes nas demais páginas é preservado.
