# Verificação da V2 — 15/10/2026

Versão 2.0.0 construída sobre a implementação da V1. Relatório anterior preservado em `TESTES.md`; evidências atuais em `v2/`.

## Verificações técnicas

| Verificação | Resultado |
|---|---|
| Build de produção | Aprovado: TypeScript e Vite |
| Lint | Aprovado |
| Typecheck | Aprovado |
| Testes unitários | 6 aprovados, incluindo os 5 da V1 |
| Console nos fluxos executados | Sem erros |
| Assets e configuração comercial | Originais e valores preservados |
| GitHub Pages | Base e workflow conservados; publicação não executada |

O novo teste verifica que o modo demonstração não retorna URL de WhatsApp mesmo com número configurado, e que a mensagem está marcada como demonstração. Os demais continuam cobrindo telefone, fuso, domingo, funcionamento, preferências passadas e codificação da mensagem. O contato fictício em teste isolado não entra no bundle público.

## Abertura e navegação

- Presença, construção e revelação inspecionadas em 320, 375, 390, 430, 768 e 1440 px, com movimento normal, além das capturas gerais com movimento reduzido.
- Recortes pertencem à própria logo oficial, sem distorção ou desenho de novos elementos.
- O cabeçalho permanece inerte e fora da árvore de acessibilidade durante a presença; aparece após a revelação.
- Skip link permite contornar a abertura. A rolagem continua livre e o retorno ao topo restabelece a composição inicial.
- Movimento reduzido apresenta a marca diretamente, sem a distância adicional de rolagem da narrativa.
- Menu mobile abre/fecha, fecha com Escape e mantém ciclo de Tab dentro do cabeçalho enquanto aberto. Âncoras funcionam e transferem foco para a seção.
- Não há biblioteca adicional de animação, vídeo obrigatório, loader falso ou bloqueio de scroll.

## Agendamento preservado e ampliado

Fluxos reais de navegador executados com dados de teste:

1. Selecionar Barba pela lista comercial e conferir seleção e preço no agendamento.
2. Iniciar demonstração, escolher serviço e atendimento.
3. Exigir data, bloquear dias anteriores e navegar para o próximo mês.
4. Rejeitar 08:00 e aceitar uma preferência de 10:37 dentro do funcionamento, sem inventar intervalos.
5. Rejeitar nome vazio, preencher dados fictícios identificados e prosseguir.
6. Revisar resumo, voltar e editar o nome preservando o preenchimento.
7. Concluir demonstração; conferir ausência de qualquer link `wa.me`; copiar mensagem marcada como teste e ler de volta o clipboard para comparação.
8. Reiniciar demonstração e verificar serviço limpo e progresso no início.
9. Alternar para cliente; percorrer o fluxo, rejeitar telefone inválido e concluir sem número oficial, oferecendo cópia da mensagem normal.
10. Conferir ausência de dados em localStorage/sessionStorage e tamanho mínimo de 16 px nos campos editáveis inspecionados.

O WhatsApp real não foi aberto nem recebeu mensagem. Não existe backend ou reserva confirmada. A garantia de separação entre os modos foi coberta por teste unitário com configuração de contato e pela inspeção de links no navegador em modo demo.

## Responsividade e acessibilidade

14 larguras verificadas: **320, 360, 375, 390, 402, 430, 480, 600, 768, 850, 1024, 1280, 1440 e 1920 px**. Sem rolagem horizontal ou imagem quebrada detectada. Verificação adicional da conclusão da demonstração em 320 px.

Outras dimensões: 568 × 320, 667 × 375, 844 × 390, 932 × 430 e 390 × 667. As quatro primeiras tiveram captura da abertura em orientação horizontal com movimento normal. Abertura e detalhes do agendamento receberam revisão visual separada.

axe-core com regras WCAG 2 A/AA e WCAG 2.1 AA: nenhuma violação detectada nos 10 estados auditados, incluindo abertura, seleção, atendimento, calendário, dados, resumo, conclusão demo em 390/320, conclusão cliente e estado desktop. Não representa certificação de conformidade ou substituição de leitor de tela.

Correções feitas durante a revisão: contraste de legendas sobre vermelho; excesso de 3 px da tipografia de transição em 320 px; marcador gráfico da abertura reposicionado para caber em 768 px com movimento normal; composição para telas horizontais baixas; foco/rolagem entre etapas; indicação de modo e conclusão; separação de captura de componente e cabeçalho sobreposto. As capturas de detalhe do formulário omitem o cabeçalho apenas para mostrar o componente inteiro; o cabeçalho permanece no produto e nas capturas gerais.

Capturas de abertura: `v2/intro-presence-*`, `intro-construction-*`, `intro-reveal-*`, `intro-landscape-*`. Seções e páginas: `v2/about-*`, `booking-*`, `page-*`. Fluxo: `booking-services-mobile`, `booking-calendar-mobile`, `booking-summary-mobile`, `booking-completion-mobile`, `booking-completion-320` e `booking-completion-desktop`.

## Desempenho e limites

Bundle de aproximadamente 260,5 kB minificado / 80,6 kB gzip; CSS aproximadamente 48,1 kB / 11,1 kB gzip. O crescimento mantém as dependências anteriores. Fontes e imagens continuam locais e otimizadas. O hook limita atualizações por requestAnimationFrame e deixa de atualizar estilos quando o progresso não muda.

Amostra local em Edge headless, 390 × 844, movimento normal, sem limitação de rede ou CPU: **LCP 864 ms, CLS 0,000278**. Evidência em `v2/performance.json`. São resultados isolados locais; não comprovam as metas em produção. **INP não medido**. Metas de campo permanecem LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1.

Não houve validação em Safari iOS físico, teclado virtual real, rede móvel real ou leitor de tela. Safe areas, unidades svh, movimento reduzido e inputs são preparados em código e precisam da confirmação em dispositivo real. Permanecem pendentes o número oficial, verificação comercial dos valores/horários, fotos de maior resolução e autorização de publicação. Nada foi publicado nem alterado em repositório remoto.
