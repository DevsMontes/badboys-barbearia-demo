# Atualização das artes oficiais do hero

O código da V3 foi mantido. Esta alteração trata dos dois recortes, da apresentação responsiva e da adaptação das animações da abertura. O agendamento e o painel demonstrativo não foram alterados.

## Origem e recortes

Arquivo original preservado em `references/originals/codex-clipboard-bb5b3830-cad4-4702-8241-5bf2c64ba18d.png`, com 1672 × 941 pixels.

A detecção automática por projeção da presença de vermelho identificou duas regiões separadas. Aplicou-se um recuo interno de 3 pixels para excluir a borda suavizada e os cantos externos. Coordenadas abaixo usam origem superior esquerda; direita e inferior exclusivas.

| Arquivo | Recorte (esquerda, topo, direita, inferior) | Dimensões |
| --- | --- | --- |
| badboys-hero-desktop.webp | 29, 114, 1198, 768 | 1169 × 654 |
| badboys-hero-mobile.webp | 1229, 26, 1648, 915 | 419 × 889 |

Exportação WebP sem perdas, sem redimensionamento, redesenho, correção de cor ou nitidez. Cada arquivo foi decodificado e comparado pixel a pixel com sua região de origem: igualdade RGB integral. O fundo externo e a composição vizinha foram excluídos. A resolução permanece a da imagem enviada.

Arquivos usados pelo site: `public/assets/editorial/`. Resultado da verificação em `hero-update/crop-results.json`.

## Apresentação responsiva

`BrandReveal.tsx` usa `<picture>` com a composição horizontal quando a proporção da janela é pelo menos 9:10 e a vertical nas demais proporções. Assim, tablets em pé recebem a arte vertical e aparelhos em paisagem recebem a horizontal. Os preloads seguem a mesma condição e somente a arte selecionada é baixada.

O enquadramento usa `object-fit: cover` e posição calculada pelo ponto central da marca quando toda a logomarca cabe na área protegida. Quando a proporção da tela comprometer a marca, utiliza uma caixa proporcional com `contain`, escala limitada pela área segura e posição ajustada. O frame recorta somente a decoração periférica excedente. Não há deformação nem máscara atravessando a logomarca. Pequenas faixas de fundo podem ser necessárias em proporções extremas para conservar o símbolo completo.

Foram mantidos o progresso por rolagem, a variação de opacidade, os registros gráficos, a linha de construção, a entrada da frase e o comportamento de movimento reduzido. A antiga ampliação com máscara foi adaptada para evitar cortes na nova logomarca. As cores e texturas do arquivo permanecem intactas; a opacidade varia durante a animação existente.

## Validação

- Build, lint e TypeScript aprovados; os 11 testes existentes passaram.
- Navegador Microsoft Edge via Playwright, com viewports 375×812, 390×844, 430×932 e 1440×900, além de 320×568, 768×1024, 1024×768, 1920×1080 e 844×390.
- Movimento reduzido conferido em 390×844.
- Sem overflow horizontal, erro JavaScript ou download duplicado das duas artes; limites da marca dentro da área segura em todos os casos.
- Capturas em `hero-update/hero-375.png`, `hero-390.png`, `hero-430.png` e `hero-1440.png`, com exemplos adicionais de paisagem, monitor e movimento reduzido. Metadados em `hero-update/responsive-results.json`.

As capturas são de viewports em navegador de desktop. Não representam teste em dispositivos físicos ou Safari no iPhone.
