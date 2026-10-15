# Auditoria e decisões da V2

Pedido: evoluir a implementação existente, especialmente o agendamento. O projeto foi editado no mesmo diretório; o pacote ZIP da V1 permanece preservado em `outputs/badboys-barbearia-demo.zip`.

## Base conservada

- React, Vite, TypeScript, dependências e lockfile.
- `business.ts`: sete serviços e preços, endereço, horários e Instagram, sem mudanças comerciais.
- `Calendar.tsx`: calendário por mês, datas passadas bloqueadas, seleção acessível.
- `booking.ts`: fuso de Brasília, horários de domingo, validações, formatação de mensagem, telefone e URL codificada de WhatsApp.
- `Booking.tsx`: seleção de serviço, atendimento, data, horário, dados e resumo. A V2 estende esse componente, mantendo suas regras.
- Marca e fachada otimizadas, originais, inventário e tratamento técnico anterior.
- Conteúdo institucional, serviço selecionável, contato, galeria/equipe condicionais e rodapé.
- Testes unitários existentes e configuração do GitHub Pages.

## Diagnóstico visual

A V1 iniciava pela oferta comercial, com título à esquerda, logo em quadro inclinado e CTA imediato. A repetição de superfícies escuras e enquadramentos reduzia a diferenciação entre as seções. O formulário funcionava, mas não distinguia uma simulação para o proprietário de uma solicitação de cliente.

## Evolução implementada

`IntroExperience`, `BrandReveal` e `useIntroProgress` criam presença, construção e revelação com máscaras sobre o próprio raster oficial. Não há desenho de novos olhos, símbolo ou lettering. Um listener de scroll passivo, limitado por requestAnimationFrame, atualiza variáveis CSS. Não há nova biblioteca de animação, bloqueio de scroll ou loader falso.

A navegação fica fora da interação e da árvore de acessibilidade até a revelação; a rolagem continua livre. Há link funcional para acessar o conteúdo durante a abertura, e o skip link permanece primeiro no teclado. Em movimento reduzido, a marca e o conteúdo são apresentados diretamente. O menu mobile conserva Escape e acrescenta controle de foco.

`ExperienceTransition` conecta a marca à apresentação editorial. Serviços passam a uma superfície clara, com linhas e preços; experiência explora o recorte dos instrumentos da marca; agendamento assume uma superfície de aplicação escura com índice lateral, escolhas persistentes e progresso explícito.

`BookingDemoMode` acrescenta modo cliente e modo demonstração ao formulário existente. `BookingCompletion` separa conclusão de resumo. Dados fictícios são opcionais e explicitamente identificados. Demonstração nunca gera URL de WhatsApp, inclusive quando houver número configurado. A conclusão permite revisar, copiar e reiniciar sem criar reserva ou salvar dados.

## Assets e limitações

As cinco imagens já haviam sido analisadas e continuam com a classificação registrada em `INVENTARIO.md`. A V2 usa os mesmos arquivos otimizados, sem novos recortes gravados ou perdas adicionais. Máscaras CSS alteram apenas a parte visível durante a narrativa. Limites permanecem: logo raster 648 × 656 e fachada 361 × 485, sem detalhes inventados.

Validações e capturas atuais ficam em `docs/v2/`. As evidências anteriores são da V1 e não devem ser atribuídas à V2. Safari iOS físico, INP e métricas de campo continuam sujeitos à validação específica.
