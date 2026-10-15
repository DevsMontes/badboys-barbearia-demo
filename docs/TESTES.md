# Relatório de verificação — 15/10/2026

Versão local de apresentação. Nenhuma publicação externa realizada.

## Engenharia

| Verificação | Resultado |
|---|---|
| `npm run build` | Aprovado: TypeScript e build Vite, com `dist/` gerado |
| `npm run typecheck` | Aprovado |
| `npm run lint` | Aprovado |
| `npm test` | 5 testes aprovados |
| Auditoria npm na instalação | 0 vulnerabilidades reportadas naquele momento |
| Prévia de produção | HTTP 200 em `/badboys-barbearia-demo/` |
| Console no navegador | Sem erros nas rotinas executadas |
| Imagens | Sem arquivos quebrados; originais fora do build público |

Os testes unitários verificam telefone opcional, fuso na virada do dia UTC, domingo e dias úteis, rejeição de datas/horários passados, funcionamento, mensagem com acentos, campos opcionais e codificação do WhatsApp. O número usado no teste isolado nunca integra a configuração pública.

## Navegador e fluxo funcional

Playwright com Microsoft Edge (Chromium), em Windows. Fluxo executado no build de produção em viewport móvel, com movimento reduzido:

- Menu abre e fecha; âncora de serviços funciona; Escape fecha o menu e devolve o foco ao botão.
- Serviço escolhido na lista comercial aparece selecionado no agendamento.
- Atendimento inicial é “Qualquer profissional disponível”.
- Calendário exige uma data; dias anteriores ficam desabilitados; navegação entre meses funciona.
- Horário fora do funcionamento é rejeitado; minutos livres são aceitos, sem intervalos artificiais.
- Nome vazio é rejeitado; nome e observação são preservados no resumo.
- Telefone em branco é omitido da mensagem.
- Resumo contém serviço, valor, profissional, data, horário e dados informados.
- Cópia real para clipboard foi lida de volta e conferida. Quebras de linha do Windows foram normalizadas no teste.
- Edição do nome a partir do resumo preserva o conteúdo preenchido.
- LocalStorage e sessionStorage permanecem vazios.
- Skip link é o primeiro destino de Tab.

O link real do WhatsApp não foi enviado, pois falta contato oficial. A construção e a codificação do link foram verificadas em teste unitário. Links externos de Instagram e Google Maps foram inspecionados quanto ao destino; não foi confirmada a existência de uma ficha da empresa no Maps. A tentativa de consulta ao Instagram não retornou conteúdo acessível.

## Responsividade e revisão visual

14 larguras verificadas: **320, 360, 375, 390, 402, 430, 480, 600, 768, 850, 1024, 1280, 1440 e 1920 px**. Nenhuma rolagem horizontal ou imagem quebrada foi detectada no resultado final. Também foram verificados layouts de 568, 667, 844 e 932 px com altura de 390 px.

Capturas em 375, 390, 430 e 1440 px, além de hero, calendário e resumo. Revisão visual dedicada ao hero mobile/desktop, hierarquia das seções, enquadramento da fachada e leitura do calendário. As capturas gerais da primeira rodada aprovada permanecem como referência; capturas funcionais foram atualizadas após os ajustes de navegação.

Correções realizadas: excesso de 7 px na faixa gráfica em 320 px; vermelho de componentes ajustado para contraste; números das etapas no fundo claro escurecidos; navegação entre etapas passa a reposicionar o título abaixo do cabeçalho; validação de telefone passou a contar dígitos; proporção declarada da fachada ajustada aos 361 × 485 px reais.

## Acessibilidade

axe-core, regras WCAG 2 A/AA e WCAG 2.1 AA: **nenhuma violação detectada** nos estados auditados de serviço, calendário, horário, formulário mobile/desktop e resumo mobile. Evidências em `accessibility-results.json` e `additional-results.json`. Foram aplicados botões semânticos, foco visível, labels, mensagens com role alert/status, seleção com marca de confirmação e movimento reduzido.

Esse resultado automático tem escopo limitado; não representa certificação de conformidade. Leitor de tela e Safari iOS real permanecem pendentes.

## Desempenho

Bundle principal de aproximadamente 253 kB minificado / 78,5 kB gzip, CSS aproximadamente 25,2 kB / 6,4 kB gzip. Fontes locais, imagens WebP, dimensões declaradas, carregamento tardio fora do hero e preload da logo compartilhada. Não há bibliotecas de animação ou chamadas de analytics.

A captura final por PerformanceObserver registrou LCP de **604 ms** e CLS de **0,00081**, em uma amostra local de 375 × 812 px, sem limitação de rede/CPU e com movimento reduzido. A primeira tentativa não havia produzido LCP válido e foi descartada. Esses valores locais atendem às metas de LCP e CLS nessa amostra, mas não comprovam o comportamento em outros dispositivos ou em produção. INP e métricas de campo não foram medidos. Metas de LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1 precisam de medição no ambiente publicado, com rede/CPU representativas.

## Limitações

Sem Safari iOS físico, teclado virtual real, leitor de tela ou medição de campo. Sem backend, disponibilidade real, regras de duração, cadastro de profissionais ou confirmação automática. A fachada continua limitada pela resolução original. Workflow preparado conforme documentação oficial do Vite; execução no GitHub aguarda autorização e configuração do repositório.
