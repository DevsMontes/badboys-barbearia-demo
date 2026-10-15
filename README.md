# Bad Boys Barbearia — V3

Revisão visual final: abertura com cortinas de revelação, vinheta e fusão das bordas desktop. Consulte [docs/ABERTURA-FINAL.md](docs/ABERTURA-FINAL.md) e as capturas em `docs/cinematic-final/`.

Atualização posterior: artes oficiais responsivas no hero, preservando o agendamento e o painel. Recortes, implementação e capturas documentados em [docs/HERO-ARTES.md](docs/HERO-ARTES.md).

Demonstração comercial da Montes Dev, construída sobre a V2. O adendo final prevalece: **não há backend, login, banco remoto, pagamento ou reserva real**. Abertura preservada e mais curta, simulador integrado a painel público, mapa e contato demonstrativo. Nada foi publicado.

## Executar

Requisitos: Node.js 24 e npm.

No Windows, também é possível abrir `INICIAR-DEMO.cmd`, que instala dependências ausentes e inicia a prévia. Mantenha a janela do servidor aberta durante a apresentação; fechar o servidor impede novas requisições do navegador. A prévia de produção não tem atualização automática: após um novo build, recarregue a página.

```sh
npm ci
npm run dev
```

Site: `http://127.0.0.1:5173/badboys-barbearia-demo/`.

Painel: `http://127.0.0.1:5173/badboys-barbearia-demo/#/admin`.

Use a porta exibida no terminal caso a padrão esteja ocupada. O hash routing funciona no GitHub Pages sem rotas de servidor.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

A prévia de produção usa normalmente a porta 4173, mantendo o caminho base. `dist/` deve ser servido por HTTP, não aberto diretamente como arquivo.

## Experimentar o ciclo completo

1. Em Agendamento, escolha **EXPLORAR DEMONSTRAÇÃO**.
2. Escolha serviço, Guilherme (Gui), João Pedro (Balinha) ou qualquer profissional, e data.
3. Escolha um horário disponível **simulado**. Os ocupados estão desabilitados.
4. Informe um nome fictício, revise e confirme a simulação.
5. Abra **VISUALIZAR PAINEL DEMONSTRATIVO** para consultar o registro atribuído ao profissional.
6. Altere status, explore agenda diária/semanal ou cancele. Cancelar libera o horário do exemplo.

Registros são compartilhados **em memória nesta página**. Navegar para `#/admin` conserva a sessão; recarregar ou fechar a página descarta os registros criados e recria os exemplos iniciais. **Não há localStorage ou sessionStorage.** Restaurar demonstração exige confirmação.

Os bloqueios variam de forma determinística por data e profissional, sem aleatoriedade a cada renderização. “Qualquer profissional” escolhe o primeiro livre na ordem Guilherme e João Pedro. `demoConfig.slotMinutes = 60` define somente a grade fictícia; não representa duração real nem escala dos profissionais. Os sete serviços e preços oficiais foram preservados.

Status: Pendente → Confirmado → Em atendimento → Concluído. Os três primeiros permitem Cancelado. Estados finais não são reabertos; crie outro exemplo ou restaure a demonstração.

**PREPARAR MENSAGEM** conserva o gerador da V2 como alternativa: prepara solicitação copiável, sem criar registro na agenda. A simulação nunca encaminha automaticamente ao WhatsApp, mesmo com número configurado.

## Painel e privacidade

O painel é público, sem login. A escolha de perfil é um filtro visual, sem autorização ou isolamento de segurança. Use somente dados fictícios. Não há telefone no repositório de agendamentos.

A prevenção de conflito funciona apenas na mesma instância JavaScript, sem interrupção entre validação e inserção. Não oferece coordenação entre navegadores ou abas, nem representa backend de produção. Veja `docs/V3-PRODUCAO.md`.

## Configuração e arquitetura

| Arquivo | Responsabilidade |
|---|---|
| `src/data/business.ts` | Serviços, preços, endereço, horários, Instagram, `mapsUrl` e contato |
| `src/data/professionals.ts` | Guilherme (Gui) e João Pedro (Balinha) |
| `src/data/demo.ts` | Parâmetros fictícios |
| `src/domain/appointments.ts` | Modelo, status, transições e contrato `AppointmentRepository` |
| `src/services/availability.ts` | Grade, bloqueios e disponibilidade determinística |
| `src/services/LocalAppointmentRepository.ts` | Consulta, criação, status e restauração em memória |
| `src/context/DemoContext.tsx` | Estado compartilhado e operações |
| `src/AppRoot.tsx` | Página pública e painel por hash |
| `src/sections/Booking.tsx` | Fluxo da V2 ampliado com slots e registro simulado |
| `src/sections/AdminDemo.tsx` | Agenda e gestão fictícia de status |

O contrato do repositório permite substituir a implementação local por um adaptador de API no futuro. Não foram implementadas migrações SQL ou integrações remotas nesta etapa, conforme o adendo final.

## Abertura e fachada

A distância adicional da introdução foi reduzida aproximadamente 45–47% em relação à V2; a revelação foi antecipada. A rolagem permanece livre, há acesso rápido a serviços/agendamento e suporte a movimento reduzido. A transição agora diz **O PRÓXIMO CORTE É O SEU.**

A fachada oficial permanece em `public/assets/editorial/fachada.webp`. `FacadeImage` respeita `BASE_URL`, carrega antecipadamente e oferece fallback JPEG da mesma foto, além de nova tentativa em erro. Ambos respondem HTTP 200 no build local. Não foi reproduzido um 404 na versão auditada; não se atribui a falha relatada a uma causa não comprovada. A resolução nativa é preservada, sem imagem de outro estabelecimento. Originais e inventário continuam em `references/originals/` e `docs/INVENTARIO.md`.

## Google Maps

O clique na prévia e todos os botões de navegação abrem exatamente o [link fornecido](https://maps.app.goo.gl/LGtAAxrBPFRAXufR6).

Esse link foi resolvido para uma vista do Street View, sem confirmar uma ficha da barbearia. A prévia é uma **pesquisa pelo endereço divulgado**, carregada após clique. O link curto não é usado como iframe. A pesquisa incorporada foi observada carregando no navegador; não é validação da posição exata da loja. Se demorar ou falhar, o cartão de localização e os links externos continuam disponíveis. Nenhuma coordenada própria ou API paga foi configurada.

## WhatsApp

O número continua vazio. `whatsappNumber` deriva da única fonte `business.whatsapp`, em `business.ts`. Configure somente contato real autorizado com país, DDD e dígitos, sem pontuação. Não existe número fictício na interface.

Sem número, o botão abre **Fale com a Bad Boys**, com mensagem de exemplo, cópia e aviso de configuração pendente. Com número válido, permite abrir conversa predefinida. O contato é separado da reserva. O ícone aparece após a revelação e se oculta na área útil do formulário para não encobrir controles; respeita safe areas.

## GitHub Pages

`vite.config.ts` mantém `base: '/badboys-barbearia-demo/'`. O workflow `.github/workflows/deploy.yml` foi preservado. Após autorização explícita, escolher conta/repositório e GitHub Actions em Settings → Pages. O workflow valida e publica `dist/` quando acionado em `main`. Se o repositório mudar de nome, atualizar `base`. Nenhuma publicação ou mudança remota foi realizada.

## Verificação

Relatório atual: `docs/V3-TESTES.md`. Evidências/capturas atuais: `docs/v3/`. Materiais anteriores da V1/V2 são históricos. Para repetir o roteiro de navegador, sirva o build na porta 4173, com Edge instalado:

```sh
npm install --no-save playwright axe-core
node tools/v3-qa.cjs
```

O script usa dados fictícios, clipboard autorizado e uma falha WebP injetada para verificar fallback. Requer acesso ao Google para o mapa. Safari iOS físico, teclado virtual e serviços de produção não foram testados.

