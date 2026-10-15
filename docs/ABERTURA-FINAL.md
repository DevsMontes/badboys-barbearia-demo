# Abertura cinematográfica — revisão final

Revisão visual aprovada pelo usuário e enviada ao GitHub. Site configurado no GitHub Pages: https://devsmontes.github.io/badboys-barbearia-demo/.

- Revelação por rolagem com duas cortinas em degradê: a composição surge por uma fresta central e abre de forma suave até a marca completa.
- Aproximação proporcional discreta de 4,5%, retornando à escala final. A logomarca não é redesenhada ou deformada.
- Vinheta permanente suave nas bordas e rodapé, sem cobrir o centro da marca na composição final.
- Extensão desfocada da mesma arte atrás do enquadramento principal; fusão gradual das bordas horizontais no desktop para eliminar a aparência de imagem encaixada com faixas laterais.
- Enquadramento mobile anterior mantido; as duas artes oficiais continuam selecionadas por proporção de tela.
- Movimento reduzido exibe diretamente a composição completa, sem cortinas ou aproximação.
- Agendamento e painel preservados.

Validação: build com TypeScript, lint e os 11 testes existentes aprovados. Início, meio e fim da abertura conferidos em 375, 390, 430, 768, 1411, 1440 e 1920 pixels de largura (21 estados), sem overflow horizontal ou erros JavaScript. Movimento reduzido verificado em 390×844. Testes de navegador Edge; sem teste em aparelhos físicos ou Safari.

Capturas atuais e metadados: `cinematic-final/`. As capturas em `hero-update/` documentam a revisão anterior, antes da restauração cinematográfica.

Para visualizar novamente desde o início, recarregue a página e volte ao topo. Servidor local: `http://127.0.0.1:4173/badboys-barbearia-demo/`. Se estiver parado, execute `INICIAR-DEMO.cmd`.
