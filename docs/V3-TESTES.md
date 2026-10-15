# Relatório da V3 — 15/10/2026

Escopo final definido pelo adendo: demonstração local sem backend, login, banco remoto ou reserva real. A V2 foi editada no mesmo projeto; seus utilitários, calendário, preços, assets e workflow foram reaproveitados.

## Verificação técnica

- Build de produção, lint e typecheck aprovados.
- 11 testes unitários aprovados: os 6 anteriores e 5 novos testes do repositório/disponibilidade.
- Sem erros de execução de página nas rotinas de navegador.
- Base do Vite preservada em `/badboys-barbearia-demo/`; painel em `#/admin`, sem rota de servidor.
- Nenhuma credencial, backend, migração SQL, conta ou publicação criada.

## Testes pedidos no adendo

| Caso | Resultado local |
|---|---|
| A — criar para Guilherme | Cliente fictício A criou exemplo; registro apareceu no perfil de Guilherme; confirmação simulada refletiu no painel. |
| B — repetir horário/profissional | Horário ficou desabilitado na grade de Guilherme. |
| C — João Pedro no mesmo horário | Horário independente foi selecionável e gerou registro atribuído a João Pedro. Filtros de perfil exibiram os registros correspondentes. |
| D — cancelar e liberar | Cancelamento no painel liberou novamente a seleção do horário de Guilherme. |
| E — recarregar | Como foi escolhido armazenamento em memória, os exemplos criados desapareceram e a base fictícia foi recriada. LocalStorage/sessionStorage permaneceram vazios. |
| F — WhatsApp | Painel demonstrativo abriu; cópia foi lida de volta do clipboard; Escape fechou; nenhuma URL wa.me foi gerada sem número. |
| G — Google Maps | Botões apontam exatamente para o link fornecido. Prévia por endereço só foi criada após clique e carregou conteúdo real do Google no navegador. |
| H — fachada | WebP e JPEG retornaram HTTP 200 no build. Imagem apresentou largura natural 361 px. Uma falha WebP injetada acionou com sucesso o JPEG da mesma foto. |
| I — responsividade | Site e painel verificados em 320, 360, 375, 390, 402, 430, 768, 1024, 1440 e 1920 px, sem rolagem horizontal detectada. |

Também foram testados o ciclo Pendente → Confirmado → Em atendimento → Concluído, agenda semanal e confirmação de restauração (recusa e aceite do diálogo).

Verificação adicional de alturas/orientações: 320 × 568, 390 × 667, 430 × 932, 667 × 375, 844 × 390 e 932 × 430. Cada dimensão foi verificada em início, agendamento e painel: 18 combinações sem excesso de largura, com evidência em `v3/height-results.json`.

Os testes unitários verificam bloqueios determinísticos, horários de domingo, criação com preço oficial, consulta por perfil, cancelamento, atribuição ordenada em “qualquer profissional”, transições inválidas e restauração. Duas criações simultâneas no **mesmo repositório local** resultaram em uma aceitação e um conflito. Isso não é teste de concorrência de backend nem isolamento de segurança entre usuários.

## Abertura e fachada

A rolagem adicional da intro mediu 380 px em 320/390 × 844, 600 px em 768 × 1000 e 700 px em 1440 × 1000. Redução em relação à V2: aproximadamente 47,0%, 45,5% e 46,2%, respectivamente. A revelação ainda é antecipada dentro desse percurso. Não há bloqueio de rolagem ou loader de introdução.

A nova frase foi conferida no DOM: “O PRÓXIMO CORTE É O SEU.”. Marca, máscaras, paleta e estrutura narrativa foram conservadas. Movimento reduzido continua apresentando a identidade diretamente.

Não foi reproduzido um 404 de fachada na V2 auditada. Foram verificados arquivo público, cópia em dist, caminho com BASE_URL e requisições HTTP. A V3 remove a dependência de lazy loading nessa foto próxima da introdução, usa picture WebP/JPEG, preserva dimensões nativas e oferece erro com nova tentativa. Não se atribuiu a falha relatada a uma causa não comprovada.

## Acessibilidade e revisão visual

axe-core, WCAG 2 A/AA e WCAG 2.1 AA: nenhuma violação detectada nos 8 estados auditados, incluindo slots, conclusão, perfil Guilherme, semanal desktop, contato WhatsApp, painel desktop e diária/semanal em 320 px. O conteúdo interno do Google Maps não integra a certificação da página; o resultado automático não substitui auditoria manual.

Durante o polimento foi corrigido o contraste do seletor Diária/Semanal. Calendário original, labels, foco visível e feedback acessível foram conservados. Horários ocupados estão desabilitados e identificados por texto/ícone, sem depender apenas de cor. O contato flutuante se oculta na área útil do formulário.

Capturas principais em `docs/v3/`: `slots-mobile`, `receipt-mobile`, `admin-gui-mobile`, `admin-completed-desktop`, `admin-weekly-desktop`, `admin-weekly-320`, `whatsapp-mobile`, `location-mobile`/`map-detail-mobile`, além de fachadas, abertura e versões gerais nas larguras de referência. Os detalhes de componentes omitem o cabeçalho sobreposto somente na captura; a interface real mantém o cabeçalho.

## Maps, armazenamento e limites

O link curto foi resolvido para Street View. Não foi confirmada uma ficha específica da barbearia; a prévia é uma pesquisa do endereço e não um marcador próprio. O iframe não usa o link curto. O Google fornece o mapa e pode apresentar tempo de carregamento variável. Há carregamento sob demanda, estado de espera e retorno ao cartão/links externos em falha ou demora. Uma captura do mapa foi feita com a área visível para permitir a renderização de seus tiles.

O repositório é local e público. Não existe autenticação real, RLS, sincronização entre abas, persistência de produção ou envio de WhatsApp. Dados fictícios ficam apenas em memória até recarregar, restaurar ou fechar. Filtros por perfil foram testados como apresentação, sem alegar segurança.

Bundle principal aproximado: 288 kB minificado / 89 kB gzip. Sem novas dependências de backend/animação. Metas de LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1 permanecem objetivos para medição em condições representativas; os valores de relatórios anteriores não foram atribuídos à V3.

Safari iOS físico, teclado virtual real, leitor de tela, rede móvel e backend de produção não foram testados. Nenhuma funcionalidade simulada foi considerada pronta para receber reservas reais. Ver `V3-PRODUCAO.md`.
