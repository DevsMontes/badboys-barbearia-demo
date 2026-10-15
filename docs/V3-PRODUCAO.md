# Limites da demonstração e preparação futura

O adendo final substituiu a solicitação inicial de backend real. Não foram provisionados Supabase, Firebase, PostgreSQL, autenticação, pagamentos ou infraestrutura. Não há contas, senhas, service_role, RLS ou dados reais. Não houve publicação ou alteração remota.

## Fronteiras atuais

- `AppointmentRepository` define consulta, criação, status e restauração. O único adaptador é `LocalAppointmentRepository`, em memória.
- Disponibilidade e grade de 60 minutos são fictícias, sem afirmar duração, folga ou escala real.
- `DemoContext` compartilha a sessão entre site e painel. Recarregar restaura a base. Não existe sincronização entre abas ou navegadores.
- Registros contêm alias, observação, serviço, preço, profissional, dia, horário, status e timestamps. Não há telefone. A interface pede dados fictícios.
- Perfis do painel são filtros públicos de apresentação, sem autenticação ou autorização.
- A proteção de conflito é local à instância JavaScript. O teste com promessas simultâneas não comprova concorrência em servidor.

## Produção posterior

Em novo escopo autorizado, definir durações e escalas reais, bloqueios/folgas, timezone, regras de confirmação/cancelamento, retenção e comunicação sobre dados pessoais. Substituir o repositório por API com validação no servidor e proteção transacional contra sobreposição. Implementar autenticação, autorização por profissional/administrador e verificar isolamento no backend; filtros de UI não bastam.

Criar contas somente com dados fornecidos e autorizados, sem inventar e-mails/senhas. Segredos administrativos pertencem ao servidor. Definir mitigação de abuso, monitoramento, recuperação e testes de integração. O reset público da demonstração não deve integrar uma API de produção.

Pendentes: contato oficial de WhatsApp, atualidade de valores/horários, confirmação da posição exata para eventual marcador próprio, imagens de maior resolução e autorização de publicação. Safari iOS físico, teclado virtual, leitor de tela e métricas de campo requerem validação específica.
