# Bad Boys Barbearia — V2

Demonstração conceitual desenvolvida por Montes Dev, com direção interna **RED DISTRICT**. A interface pública utiliza a marca Bad Boys Barbearia. Projeto local em React + Vite + TypeScript, preparado para GitHub Pages. Nenhum repositório remoto foi criado e nada foi publicado.

A V2 foi construída sobre a V1. Calendário, dados comerciais, utilitários, regras de agendamento, testes e GitHub Pages foram conservados. A evolução acrescenta abertura narrativa por rolagem e um modo explícito de demonstração. Diagnóstico em `docs/V2-AUDITORIA.md`; testes e limites atuais em `docs/V2-TESTES.md`; capturas em `docs/v2/`. Arquivos na raiz de `docs/` documentam a V1, quando não identificados como V2.

## Executar

Requisitos: Node.js 24 e npm.

```sh
npm ci
npm run dev
```

Abra a URL exibida no terminal, incluindo `/badboys-barbearia-demo/`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

`dist/` contém o site compilado; abra-o por um servidor HTTP. Abrir `index.html` diretamente pelo sistema de arquivos não executa corretamente a aplicação. A prévia usa normalmente `http://localhost:4173/badboys-barbearia-demo/`.

## Configuração comercial

Edite `src/data/business.ts` para alterar endereço, Instagram, horários, serviços e preços. Os preços são valores numéricos em reais. Nenhum dado comercial é buscado automaticamente no Instagram.

`business.whatsapp` começa vazio. Após confirmar o número oficial com o proprietário, configure somente dígitos, incluindo país e DDD, sem espaços, `+` ou pontuação. Não use um número fictício. Com um número válido, a conclusão do modo cliente oferece `wa.me` com mensagem codificada por `encodeURIComponent()`.

Enquanto estiver vazio, a interface oferece resumo, mensagem formatada e cópia para a área de transferência, com alternativa de cópia manual se o navegador bloquear a API. A confirmação do atendimento sempre depende da barbearia. Não há backend, controle de vagas ou reserva automática.

O calendário bloqueia datas anteriores ao dia local de Brasília. O horário é digitado livremente dentro do funcionamento, sem inventar duração ou intervalos de serviço. Para o dia atual, também é bloqueada uma preferência anterior ao horário atual. Feriados e fechamentos excepcionais não foram fornecidos; confirmar com a equipe.

## Apresentar o agendamento

Após a introdução da marca, acesse Agendamento e escolha **TESTAR AGENDAMENTO**. O fluxo contém sete etapas: serviço, atendimento, data, horário, dados, resumo e conclusão. Em dados, **USAR DADOS FICTÍCIOS** preenche um visitante explicitamente demonstrativo, sem inventar contato ou profissional.

O modo demonstração nunca abre WhatsApp, mesmo com número configurado. Ao concluir, é possível revisar, copiar uma mensagem marcada como demonstração e reiniciar. Reiniciar ou mudar de modo limpa os campos, inclusive dados de contato. No modo cliente, é possível escolher um serviço pela lista comercial e continuar com ele pré-selecionado. Não há reserva real em nenhum dos modos.

A abertura normal acompanha a rolagem e pode ser contornada pelo link de exploração ou pelo skip link. `prefers-reduced-motion` apresenta a marca diretamente. Nenhuma interação exige assistir a uma animação ou aguardar uma sequência automática.

## Conteúdo futuro

`team` e `gallery`, em `src/data/business.ts`, começam vazios. A galeria e a seção de equipe só aparecem quando possuem conteúdo. Profissionais cadastrados em `team` passam a integrar a escolha de atendimento. Forneça apenas nomes e imagens autorizados. As imagens da galeria podem usar o helper `asset()` para respeitar o caminho base.

Os dados do formulário existem apenas no estado React desta página. Recarregar apaga a solicitação. Não há localStorage, sessionStorage, analytics, envio automático ou fontes carregadas de servidores externos.

## Imagens

- `references/originals/`: cinco arquivos originais, preservados; não entram no build público.
- `public/assets/brand/`: logo WebP e favicon raster.
- `public/assets/editorial/`: fotografia da fachada em WebP.
- `docs/INVENTARIO.md`: classificação e decisões de uso.
- `tools/optimize_assets.py`: tratamento reproduzível, requer Python 3 e Pillow (`pip install Pillow`).

A logo não foi vetorizada, redesenhada, recolorida ou distorcida. O fundo original está preservado. A fachada recebeu ajuste leve de contraste e nitidez, mantendo a resolução nativa; não houve geração de detalhes. Para melhorar a apresentação futura, substitua por fotografias oficiais em maior resolução, mantendo textos alternativos e dimensões coerentes.

Fontes Barlow Condensed e Manrope hospedadas no próprio build. Licenças em `docs/licenses/`.

## Componentes e estilo

`src/components/`: marca, revelação, transição editorial, navegação, calendário e conteúdo futuro. `src/components/booking/`: escolha de modo e conclusão. `src/sections/`: `IntroExperience` e o agendamento original estendido. `src/hooks/useIntroProgress.ts`: progressão vinculada ao scroll. `src/utils/booking.ts`: regras preservadas, mensagem e bloqueio de envio no modo demo. `src/styles/global.css`: base e tokens preservados; `v2.css`: direção visual atual. Ícones Lucide. `Hero.tsx` permanece como referência da V1, sem entrar na interface atual.

## Publicar no GitHub Pages — somente após autorização

O workflow está preparado em `.github/workflows/deploy.yml`, com build e validações antes de enviar `dist/`. A configuração segue o [guia oficial do Vite para GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages).

1. Após autorização explícita, criar ou escolher um repositório na conta correta e enviar o projeto para `main`.
2. Em Settings → Pages, escolher GitHub Actions como origem.
3. O workflow executa a cada push em `main` e pode ser acionado manualmente.
4. O endereço esperado é `https://USUARIO.github.io/badboys-barbearia-demo/`.

Se mudar o nome do repositório, altere `base` em `vite.config.ts` antes do build. Para domínio próprio ou publicação na raiz da conta, use `base: '/'`. Depois de definir o endereço definitivo, complete Open Graph com URL e imagem absolutas de produção. Não há coordenadas ou marcador inventado: o link do Google Maps é uma pesquisa textual.

## Verificação e limites

Consulte `docs/V2-TESTES.md`, `docs/PENDENCIAS.md` e `docs/v2/qa-results.json`. Os seis testes unitários cobrem regras de negócio e separação entre cliente e demonstração; as verificações de navegador utilizaram Playwright com Microsoft Edge instalado no ambiente de criação e axe-core. Screenshots atuais ficam em `docs/v2/`; as capturas anteriores ficam preservadas na raiz de `docs/`.

Não foi utilizado Safari iOS real. A auditoria automática não substitui avaliação com leitor de tela e dispositivo físico. Metas de LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1 precisam ser medidas no endereço publicado e em condições representativas.

Para reproduzir as verificações opcionais de navegador, com a prévia na porta 4173 e Microsoft Edge instalado:

```sh
npm install --no-save playwright axe-core
node tools/v2-intro-qa.cjs
node tools/v2-qa.cjs
```

Essas ferramentas são apenas de verificação e não integram o bundle público. Em outro sistema, ajuste `channel: 'msedge'` nos scripts para um navegador instalado e compatível com Playwright. A cópia para clipboard requer permissão do navegador. Os scripts sobrescrevem as respectivas evidências e capturas em `docs/v2/`. Os scripts antigos ficam preservados como histórico da V1; para a interface atual, execute os scripts V2 acima.
