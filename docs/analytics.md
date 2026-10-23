# Google Analytics 4 — visitas e cliques

Tag: `G-TQBVF15YCN`. Integração em `components/GoogleAnalytics.tsx` e `lib/analytics.ts`, presente no layout de todas as páginas. Atualização: 19/10/2026.

## Ajuste necessário na propriedade

Em **Administrador → Coleta e modificação de dados → Fluxos de dados → fluxo Web do site**, desativar **Medição otimizada**. A implementação envia `page_view` manualmente uma vez por mudança de caminho e mede os cliques definidos abaixo. A configuração `send_page_view: false` desliga o pageview inicial automático, mas não desliga sozinha a medição automática do History API: manter os dois mecanismos ligados duplicaria visitas e poderia enviar URLs completas.

O site não exige Google Tag Manager nem outra instalação dessa mesma tag. Não duplicar o snippet no cabeçalho, na Cloudflare ou em outro gerenciador. O painel do GA4 não foi acessado por esta implementação.

O responsável confirmou a desativação em 19/10/2026. A configuração pública entregue por `gtag.js` foi conferida novamente: sem as tags de medição otimizada de pageview/histórico e cliques de saída.

## Eventos

| Evento | Ação medida | Parâmetros específicos |
| --- | --- | --- |
| `page_view` | Página atual após consentimento e mudanças de rota | `page_location`, `page_title`, `page_referrer` |
| `whatsapp_click` | Clique que abre o WhatsApp | `placement` |
| `appointment_click` | Clique que abre `/pre-agendamento` | `placement`, `target_path` |
| `contact_click` | Clique em telefone ou e-mail | `placement`, `method` (`phone` ou `email`) |
| `google_reviews_click` | Clique para abrir as avaliações no perfil do Google | `placement`, sem autor ou comentário |
| `article_click` | Clique para um artigo do blog | `placement`, `target_path` |
| `anatomy_open` | Clique para abrir o atlas 3D | `placement`, `target_path` |
| `navigation_click` | Outros links internos para páginas públicas | `placement`, `target_path` |
| `clinic_select` | Seleção de unidade no pré-agendamento, por mouse/toque ou teclado | `clinic_id` público, sem texto da mensagem |
| `anatomy_structure` | Seleção/desmarcação pelo número ou pelos botões do atlas | `placement`, `structure`, `action` (`select` ou `deselect`) |
| `anatomy_control` | Reprodução, pausa, restauração ou troca de vista | `placement`, `action` |

`placement` identifica `header`, `content`, `footer`, `floating` ou `anatomy`. Os eventos incluem também `page_path`, sempre derivado de uma lista de rotas públicas conhecidas. A escolha clínica por superfície/raycast não tem evento próprio; a numeração e os botões têm. Não são enviados eventos a cada quadro da animação ou a cada movimento do controle de flexão.

Esses eventos representam navegação e intenção de contato. Não comprovam envio de mensagem, atendimento ou consulta confirmada. Não foi enviado `generate_lead`, `purchase` ou outro evento que anuncie um resultado de negócio não verificado.

## Consentimento e dados

- Consent mode básico: nenhuma carga de `gtag.js` ou envio de estatísticas antes de aceitar. A recusa mantém o site funcional.
- Consentimento de publicidade, personalização e dados publicitários permanece negado. Google Signals e personalização publicitária estão desativados no código.
- Preferência local por até 180 dias, com opção de alterá-la no rodapé e na política de privacidade. Se o armazenamento local estiver indisponível, a escolha vale para a página atual.
- Retirada de autorização ativa `ga-disable`, remove os cookies `_ga` acessíveis nos domínios do site e recarrega a página para descarregar o runtime. A coleta anterior não é apagada da propriedade automaticamente.
- Os eventos definidos pelo site usam nomes e valores permitidos, sem textos dos botões, valores digitados, nome, telefone, e-mail, mensagem do WhatsApp, dados clínicos, User-ID ou parâmetros livres.
- Endereços de página são enviados sem query string ou fragmento. Caminhos desconhecidos são representados por `/404`; o referrer externo usa somente a origem. Não se enviam cliques anteriores à aceitação retroativamente.
- Campanhas com UTM e outros parâmetros não foram mapeadas separadamente; esta etapa privilegia visitas e cliques sem parâmetros livres. O Google continua processando informações técnicas e cookies consentidos, descritos na política de privacidade.

## Como acompanhar na conta

1. Aceitar estatísticas no site e conferir **Relatórios → Tempo real**. Bloqueadores e a recusa impedem a coleta.
2. Conferir **Engajamento → Eventos** e **Páginas e telas** quando o processamento dos relatórios estiver concluído.
3. Para explorar os detalhes, criar dimensões personalizadas de escopo **Evento** em **Administrador → Definições personalizadas**, para os parâmetros `placement`, `target_path`, `method`, `clinic_id`, `structure` e `action`. O registro não cria dados retroativos.
4. Se for útil ao acompanhamento, marcar `whatsapp_click` como evento principal de **intenção de contato**, preservando a distinção entre clique e consulta efetivamente agendada.
5. Considerar filtros de tráfego interno para visitas da equipe e de ambientes de desenvolvimento antes de interpretar os totais.

A presença de uma chamada no navegador não confirma sua aparição nos relatórios de uma conta. A conferência final da propriedade é feita pelo responsável em Tempo real/DebugView. Testes automatizados interceptam o carregamento/coleta para não gerar visitas artificiais nessa propriedade.

## Validação técnica

- ESLint, TypeScript e build de produção das 29 páginas aprovados.
- Navegador com runtime simulado: nenhuma carga antes do consentimento; recusa persistida; aceitação pela preferência no rodapé; uma carga da tag por documento; uma visita por rota; eventos de contato, artigo, agendamento, unidade e seleção/desmarcação do atlas; ausência de mensagens, contatos e parâmetros livres nos eventos; retirada da autorização e remoção dos cookies.
- Runtime real do Google, com a configuração pública atual e endpoints de coleta interceptados: uma visita inicial e uma visita ao mudar a rota; URLs e referrers sem os parâmetros privados usados na simulação; tag ausente após retirada de autorização; cookies removidos. Nenhum evento de teste foi enviado à propriedade.
- Aviso de consentimento em 320, 390 e 844 px, botões com altura mínima de 44 px, sem rolagem horizontal e sem interferir no foco do menu móvel.

Referências: [consent mode básico](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), [pageviews e medição automática](https://developers.google.com/analytics/devguides/collection/ga4/views), [eventos](https://developers.google.com/analytics/devguides/collection/ga4/events) e [parâmetros e dimensões](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters).
