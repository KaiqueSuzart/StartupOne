# Plataforma Lastro pronta para o piloto: desenho aprovado

Data: 2026-10-05. Status: desenho aprovado em conversa; este documento é a referência para
os planos de implementação de cada fase. Pesquisa de base em
[docs/CRITERIOS-DE-SUCESSO.md](../../CRITERIOS-DE-SUCESSO.md) e anexos.

## 1. Objetivo

Sair da PoC (dados fictícios, 1 login por oficina, formulário de desktop, sem deploy) para uma
plataforma que atenda duas entregas em sequência, sem reescrever nada entre elas:

1. **Apresentação** (3 a 6 semanas): produto com identidade própria, relatório convincente e
   "cara de produto" (painéis, planos, métricas), ainda com dados fictícios.
2. **Piloto** (90 dias, uma cidade): 2 ou 3 oficinas e 1 ou 2 revendas com dados reais, medindo
   as métricas-norte da seção 11.

A regra de ouro: o que for construído para a apresentação roda com dado real no piloto, e o que
rodar no piloto escala a 300 oficinas e 100 mil consultas por mês sem troca de arquitetura.

## 2. Princípios (herdados e novos)

- Dependências apontam para dentro: UI depende do domínio; domínio não depende de nada.
- Toda regra de negócio nasce em `domain/` como função pura, com teste.
- Todo dado externo passa por Zod antes de virar tipo do domínio.
- O livro de eventos é **append-only**: sem policy de `UPDATE` nem `DELETE`, nem endpoint que
  edite histórico. Correção é um evento novo que aponta para o antigo.
- **Nenhuma chave que ignore RLS roda na aplicação** (nem `service_role`, nem `sb_secret`).
  Operações privilegiadas acontecem em funções `security definer` com verificação explícita,
  e administração via papel de membro na organização "plataforma".
- Dado pessoal fica **fora** do livro append-only, em tabelas apagáveis.
- Cada fase tem a própria spec curta e o próprio plano; esta spec é o guarda-chuva.

## 3. Infra, ambientes e custo

| Ambiente | Hospedagem | Banco | Dados | Chaves |
|----------|-----------|-------|-------|--------|
| Local | `npm run dev` | nenhum (fixtures) ou staging | fixtures | nenhuma |
| Preview | deploy de preview da Vercel | Supabase **staging** (sa-east-1) | seed + teste | `sb_publishable` de staging, `lst_test_` |
| Produção | Vercel, função em `gru1` | Supabase **produção** (sa-east-1) | seed + real | `sb_publishable` de produção, `lst_live_` |

**Planos: gratuitos até o piloto, pagos a partir do primeiro uso comercial.**

| Fase | Vercel | Supabase | Por quê |
|------|--------|----------|---------|
| Desenvolvimento e apresentação (dados fictícios, sem receita) | Hobby, US$ 0 | Free, 2 projetos (produção e staging), US$ 0 | Hobby é "uso pessoal, não comercial": demo acadêmica sem receita cabe. Free pausa após 7 dias sem atividade e não tem backup: aceitável enquanto tudo é regenerável do seed |
| Piloto (dado real, revenda pagando) | Pro, US$ 20 por assento | Pro, US$ 25 (backups diários, sem pausa) | uso comercial exige Pro na Vercel; dado real exige backup e banco que não pausa |

Cuidados no gratuito: monitor de uptime (gratuito) chamando a cada 5 minutos uma página que
consulta o banco, para o projeto Free não pausar; conferir o painel do Supabase na véspera de
qualquer apresentação; Hobby tem 1 regra de rate limit (suficiente) e cron só diário, então as
rotinas agendadas ficam no `pg_cron` do Supabase, não na Vercel; logs de 1 hora (Sentry cobre
os erros); no Hobby a conta é de uma pessoa, e deploy por push de outro autor pode ser
bloqueado (a confirmar na configuração do projeto; se bloquear, o dono da conta faz o merge).

Serviços gratuitos em qualquer fase: domínio próprio (único custo, ~R$ 40/ano); e-mail
transacional em plano gratuito como SMTP do Supabase Auth (o padrão envia 2 e-mails por hora);
Cloudflare Turnstile no login e nos formulários públicos (nativo no Supabase Auth); 1 regra de
rate limit por IP no firewall da Vercel em `/consulta/*` e `/api/v1/*`; Sentry; monitor de
uptime e status page; GitHub Actions com lint, tipos, testes e build; Dependabot; Upstash.
Chaves novas do Supabase (`sb_publishable`, sem `sb_secret` criada) e JWT com chave
assimétrica, lendo claims com `getClaims()`.

Custo: US$ 0 até o piloto. No piloto, US$ 45 a 50 por mês (Vercel Pro 1 assento + Supabase
Pro); em escala (100 mil consultas e 20 mil registros por mês) US$ 300 a 350. PITR (US$ 100
por mês) só quando o livro virar prova para terceiros. Fonte: anexo de plataforma.

## 4. Modelo de dados v2

Não há dado real a migrar: o projeto de desenvolvimento é recriado do zero. As migrações ficam
em `supabase/migrations/NNNN_nome.sql`, numeradas e idempotentes, e `supabase/seed.sql` é gerado
dos fixtures por `scripts/generate-seed.mjs`. Os arquivos SQL soltos atuais são substituídos.

### 4.1 Organizações e pessoas

| Tabela | Colunas principais | Regras |
|--------|--------------------|--------|
| `organizations` | `id`, `kind` (`workshop`, `dealer`, `inspector`, `platform`), `legal_name`, `display_name`, `cnpj` (14 dígitos, único, obrigatório exceto `platform`), `city`, `state`, `status` (`invited`, `active`, `suspended`) | leitura pública de `display_name`, `kind`, `city`, `state` via view; o resto só para membros |
| `memberships` | `user_id`, `org_id`, `role` (`owner`, `member`, `admin`), chave primária composta | `admin` só existe na organização `platform`; membro lê a própria organização |
| `contacts` | `id`, `org_id`, `user_id` (opcional), `full_name`, `email`, `phone` | **dado pessoal, apagável**; sem leitura pública; membro lê os da própria organização |
| `invitations` | `id`, `org_id`, `email`, `role`, `token_hash`, `expires_at`, `accepted_at` | criada por `owner` ou `admin`; aceitar cria `membership` via RPC |

Helpers SQL (`security definer`, `set search_path = ''`, `revoke execute from public`):
`current_org_ids()` devolve as organizações do usuário; `is_platform_admin()`.

### 4.2 O livro: `vehicle_events` (substitui `service_records`)

| Coluna | Tipo e regra |
|--------|--------------|
| `id` | uuid |
| `vin` | referência a `vehicles` |
| `event_type` | `initial_registration`, `service`, `stock_entry`, `stock_exit`, `ownership_transfer`, `inspection` |
| `service_type` | enum atual sem `initial_registration` e `ownership_transfer`; obrigatório se e só se `event_type = 'service'` |
| `service_date` | date |
| `recorded_at` | timestamptz, default `now()`, nunca informado pelo cliente |
| `odometer_km` | inteiro ≥ 0 |
| `odometer_measured_at` | timestamptz opcional (RENAVE informa data e hora da medição) |
| `attestor_type` | enum atual mais `reseller` (loja de seminovos) |
| `attestor_org_id` | organização que gravou; nulo em histórico importado do seed |
| `source_channel` | `seed`, `app`, `api`, `xml_import`, `renave_export`, `admin` |
| `description`, `service_items`, `next_service_km` | como hoje |
| `fiscal_doc_kind` | `nfe` (44 dígitos), `nfse` (50 dígitos), `none` |
| `fiscal_doc_key`, `fiscal_doc_emitter_cnpj`, `fiscal_doc_cnpj_mismatch` | chave validada por tamanho conforme o tipo |
| `fiscal_doc_status` | `not_provided`, `structure_valid`, `confirmed`, `cancelled`, `not_found` |
| `odometer_photo_path`, `odometer_photo_hash`, `odometer_ocr_km`, `odometer_ocr_match` | como hoje |
| `odometer_ocr_provider`, `odometer_ocr_confidence`, `odometer_ocr_latency_ms` | para calibrar a cascata de OCR |
| `evidence_hash` | sha256 do arquivo importado (XML ou exportação RENAVE) |
| `corrects_event_id` | evento que este corrige; `correction_reason` obrigatório quando presente |
| `created_by`, `api_key_id` | quem gravou (usuário ou chave de API) |

Restrições e índices:

- Evidência: `source_channel = 'app'` exige `odometer_photo_hash`; `xml_import` e `renave_export`
  exigem `evidence_hash`; `api` aceita sem foto, com confiança rebaixada (seção 5.2).
- Unicidade: `(attestor_org_id, fiscal_doc_key)` e `(attestor_org_id, odometer_photo_hash)`,
  ambas só quando `corrects_event_id` é nulo, para nunca duplicar serviço e permitir que a
  correção reaproveite a foto original.
- Índices: `(vin, service_date)`, `(attestor_org_id, recorded_at)`, `(corrects_event_id)`.
- Triggers `before insert` (continuam valendo para quem chamar a API REST direto):
  1. **Km monotônico** sobre os eventos **efetivos** (exclui os já corrigidos e o que está sendo
     corrigido), só para `attestor_org_id` não nulo.
  2. **Regras de correção:** o original existe, mesmo `vin`, mesma `attestor_org_id`, gravado há
     no máximo 30 dias, ainda não corrigido (cadeia linear), `correction_reason` com 10 ou mais
     caracteres. O original fica intacto e visível.
  3. **Cota diária** de 50 eventos por organização.
- RLS: `select` público; `insert` para `authenticated` com `attestor_org_id in current_org_ids()`,
  `(select auth.jwt()->>'aal') = 'aal2'` e `recorded_at` default. Nenhuma policy de `update`
  ou `delete`.

### 4.3 Tabelas de apoio

| Tabela | Finalidade | Acesso |
|--------|-----------|--------|
| `vehicles`, `recalls` | como hoje | leitura pública |
| `listings` | carro anunciado pela revenda: `org_id`, `vin`, `status` (`active`, `sold`, `removed`), `share_token`, `asking_price`, `sold_price`, `sold_at` | membros da revenda leem e **atualizam status** (não é o livro); leitura pública só via RPC pelo `share_token` |
| `report_views` | abertura de relatório por `share_token` ou consulta direta, sem IP | insert anônimo, leitura só `platform` |
| `search_log`, `vehicle_interest` | como hoje | insert anônimo; leitura só `platform` |
| `titular_requests` | pedidos de titular LGPD (acesso, correção, eliminação) | insert anônimo com Turnstile, leitura só `platform` |
| `api_keys` | `org_id`, `prefix`, `key_hash` (sha256), `last4`, `scopes`, `expires_at`, `revoked_at` | `owner` lê as da própria organização; criação e revogação via RPC |
| `idempotency_keys` | `(org_id, key)`, `request_hash`, `response_status`, `response_body`, `created_at` | só via RPC; expurgo em 24 h por `pg_cron` |
| `audit.events` | `occurred_at`, `actor_user_id`, `org_id`, `action`, `target`, `metadata` sem dado pessoal | insert por trigger e RPC; leitura só `platform` |
| `upload_tickets` | caminho autorizado de upload por chave de API, com expiração | criado por RPC; usado pela policy do Storage (fase de escala) |

Storage: bucket privado `odometer-photos`, caminho `org_id/vin/<sha256>.<ext>`. Policy de
`insert` e `select` exige que o primeiro segmento esteja em `current_org_ids()`. Sem `update`
nem `delete`. Réplica semanal para um segundo bucket em outro projeto (função agendada), porque
backup do banco não cobre Storage.

### 4.4 Domínio e fixtures

- `ServiceRecord` vira `VehicleEvent` e `VehicleHistory.records` vira `events`. Renome
  mecânico, guiado pelo compilador, com os componentes atuais adaptados na fase 1 e redesenhados
  na fase 2. `recordedAt` passa a ISO 8601 completo (data e hora, como no banco); as regras de
  integridade continuam comparando por dia.
- Novos módulos puros: `domain/trust.ts` (seção 5.2), `domain/corrections.ts` (resolve a cadeia
  e devolve eventos efetivos e corrigidos), `domain/fiscalDoc.ts` (detecta tipo pelo tamanho,
  valida estrutura e dígito verificador da NF-e; para NFS-e valida tamanho e campos do leiaute
  nacional, e marca `structure_valid` quando a estrutura bate).
- Detecção de anomalia, integridade, manutenção, cobertura e veredito passam a receber os
  eventos efetivos. A integridade ganha o item "correções declaradas".
- Fixtures em `data/vehicles/*.json` com `schemaVersion: 2`; os 4 veículos atuais são
  convertidos e ganham, no veículo de fraude, um evento `stock_entry` vindo de
  `renave_export` (mostra a hierarquia) e, no veículo limpo, uma correção de km (mostra a
  retificação). `lib/schema.ts` acompanha, com a asserção de igualdade com o domínio mantida.

## 5. Costuras

Composição única em `lib/repository/index.ts`. Nenhum arquivo de `app/`, `components/` ou
`domain/` importa implementação concreta.

| Interface | Agora (apresentação) | Piloto | Escala |
|-----------|---------------------|--------|--------|
| `VehicleRepository` | Fixture ou Supabase (como hoje) | Supabase | igual |
| `EventWriter` (antes `ServiceRecordWriter`) | Supabase, por requisição | igual | igual |
| `FiscalDocValidator` | offline: estrutura e DV | online: ConsultarNFe ou e-CNPJ A1 para NF-e; consulta pública nacional para NFS-e | igual |
| `OdometerReader` | cascata: Tesseract; se confiança baixa, leitor de visão por LLM; a oficina sempre confirma na tela | igual, com provedor padrão escolhido pelos dados gravados | igual |
| `RiskBureau` | fixtures (semáforo fictício rotulado) | Consultar Placa (leilão, sinistro, roubo, gravame) + Infosimples (débitos, recall) | adiciona provedores |
| `RenaveImporter` | parser puro do **formato canônico Lastro** (CSV: `placa, chassi, tipo, km, data_medicao`) | adaptador para o arquivo da integradora da revenda do piloto, assim que conhecida | adaptadores por integradora |
| `PhotoStorage` | URL assinada de upload com sessão do usuário; verificação do objeto no servidor | igual | mais `upload_tickets` para chaves de API |

### 5.1 Fluxo de registro v2 (app da oficina)

1. No celular, a foto é redimensionada para até 1600 px (JPEG) e seu sha256 é calculado no
   navegador. O app pede ao servidor a URL assinada para `org/vin/<hash>.jpg` (Server Action
   re-autoriza: membro da organização, `aal2`).
2. Upload direto ao Storage (sem passar pela função; resolve o limite de 1 MB da Server Action e
   de 4,5 MB da função).
3. Envio do formulário com `photo_path`. O servidor baixa o objeto, confere tamanho, magic
   number e hash, roda a cascata de OCR, valida o documento fiscal pela costura, aplica
   `domain/serviceEntry.ts` e grava via `EventWriter`. O banco confere tudo de novo (RLS e
   triggers).
4. Recibo com o elo na cadeia, como hoje.

### 5.2 Hierarquia de confiança (`domain/trust.ts`)

| Nível | Condição |
|-------|----------|
| `official` | `source_channel = 'renave_export'`, ou `attestor_type` em `registry`, `inspection` |
| `high` | `dealership` ou `authorized_service` com documento fiscal `structure_valid` ou `confirmed` e foto `match` |
| `medium` | `independent_workshop` ou `reseller` com foto e documento `structure_valid` ou `confirmed`; ou `dealership`/`authorized_service` sem um dos dois |
| `low` | `owner`; ou sem foto; ou `fiscal_doc_kind = 'none'`; ou foto `mismatch`; ou documento `cancelled`/`not_found` |

O relatório mostra o nível por evento e, numa anomalia entre dois eventos, qual lado tem mais
confiança. A detecção de anomalia em si não muda (qualquer regressão é sinalizada).

## 6. Segurança (antes de qualquer dado real)

| Medida | Como se verifica |
|--------|------------------|
| Toda Server Action e Route Handler re-autoriza; `proxy.ts` só renova sessão | revisão de código e teste de rota sem sessão |
| MFA TOTP para quem escreve, exigido pela RLS (`aal2`) | `scripts/verify-rls.mjs` tenta inserir com `aal1` e falha |
| Append-only em `vehicle_events` e Storage | `verify-rls.mjs` tenta `update`/`delete` e falha |
| Isolamento entre organizações | `verify-rls.mjs` insere para outra organização e falha; lê `contacts` alheios e falha |
| Nenhuma chave que ignore RLS | busca no repositório e nas variáveis de ambiente da Vercel |
| CSP estática, HSTS, `frame-ancestors 'none'`, headers atuais | teste de headers no CI |
| Upload só por URL assinada no próprio caminho; verificação de magic number e hash no servidor | teste de upload fora do caminho falha |
| Turnstile no login, interesse, titular e consulta | tentativa sem token falha |
| Rate limit: firewall da Vercel por IP + triggers por organização; Upstash por chave de API quando houver parceiro | regra ativa no painel; teste de cota |
| `audit.events` para login, convite, chave de API, correção, pedido de titular | linhas existem após cada ação |
| Réplica semanal das fotos | job agendado com log |
| Rotação documentada: chaves de API em sobreposição, JWT assimétrico sem downtime, segredos em env "sensitive" | `SECURITY.md` |
| Dependências: Dependabot, `npm audit` no CI (sem bloquear por transitivas) | CI |

## 7. API v1 (usada primeiro por nós)

- Base `/api/v1/`, Route Handlers, autenticação `Authorization: Bearer lst_live_...` ou
  `lst_test_...`. O servidor calcula sha256 e chama a RPC `verify_api_key`, que devolve
  organização e escopos (ou nada). Chave exibida uma vez, guardada só como hash.
- Endpoints do piloto: `POST /events` (escopo `events:write`, header `Idempotency-Key`
  obrigatório, corpo validado por Zod, gravação pela RPC `api_insert_event`, que força
  `attestor_org_id` da chave e `source_channel = 'api'`) e `GET /vehicles/{identificador}/report`
  (escopo `reports:read`, devolve o mesmo DTO do relatório da página).
- Respostas de erro em `application/problem+json`; 201 criado, 200 replay idempotente, 409
  conflito de idempotência, 422 validação, 429 limite.
- OpenAPI 3.1 gerada dos mesmos schemas Zod e servida em `/api/v1/openapi.json`.
- Sandbox: chaves `lst_test_` só existem no projeto staging; previews apontam para ele.
- Limite por chave (60 por minuto, 5 mil por dia) com headers `RateLimit-*`, no Upstash,
  ativado quando a primeira chave externa for emitida. Webhooks e integração com Bling ficam
  para a escala.

## 8. LGPD mínima

- Páginas `/privacidade`, `/termos` e `/lgpd` (canal do titular com formulário em
  `titular_requests` e e-mail). Política conforme art. 9: finalidade, duração, controlador,
  compartilhamentos, direitos e canal.
- `docs/lgpd/registro-operacoes.md` com o modelo simplificado da ANPD (8 campos) por processo:
  consulta pública, registro de evento, conta de organização, telemetria, interesse, suporte.
- `docs/lgpd/incidentes.md`: critérios de risco relevante, comunicação em 6 dias úteis, registro
  interno por 5 anos.
- Retenção: `search_log` e `report_views` agregados após 13 meses; `vehicle_interest` apagado
  após contato ou 12 meses; `contacts` apagado a pedido; livro nunca contém dado pessoal.
- **Decisão: relatório completo público** (padrão do mercado, base legal de legítimo interesse,
  minimização: sem dono, sem endereço de oficina, cidade apenas) com canal de oposição do
  titular. Reversível depois sem mudar o modelo: um gate por `share_token` na rota.
- Cookies só de sessão: sem banner, descritos na política.

## 9. Produto sobre o modelo v2 (cada item terá a própria spec)

1. **Identidade e design system**: logo, cores, tipografia, componentes base, tema claro.
2. **Consulta e relatório v2**: semáforo de risco no topo (`RiskBureau`), veredito, hierarquia
   de confiança por evento, correções visíveis, cobertura honesta, recall, manutenção, gráfico,
   cadeia de hash, link e QR.
3. **Site institucional**: landing, "como verificamos", privacidade, termos, canal do titular.
4. **App da oficina em 30 s** (PWA, celular): foto primeiro, placa, km confirmado do OCR,
   categoria, itens, nota opcional; recibo.
5. **Painel da oficina**: eventos por semana, consultas recebidas nos carros atendidos,
   certificado de evidência por evento (PDF via impressão), membros e convites, MFA.
6. **Painel da revenda**: carros anunciados (`listings`) com link e QR, importação RENAVE pelo
   formato canônico, status vendido com preço, membros.
7. **Planos e preços**: página pública com as hipóteses da seção 10 (cobrança real só no piloto).
8. **Métricas do time** (`/admin/metricas`, só `platform`): as métricas-norte da seção 11.

## 10. Hipóteses de modelo de negócio

Oficina grátis sempre. Revenda paga por carro anunciado (R$ 39 a 59 com semáforo completo) ou
plano mensal com lote. Comprador vê grátis pelo link do anúncio. Consulta avulsa só cobrada
quando há histórico (R$ 39,90), vazio é grátis com oferta de monitoramento. Montadora, banco e
seguradora fora do piloto.

## 11. Métricas-norte e observabilidade

Views SQL em `supabase/migrations/` alimentam `/admin/metricas`:

| Métrica | Cálculo | Meta em 90 dias |
|---------|---------|-----------------|
| Leituras por veículo por ano | eventos efetivos por `vin` na frota anunciada, anualizado | média acima de 2 |
| % da frota anunciada com 2 ou mais leituras | `listings` ativos × eventos | acima de 60% |
| Eventos por semana por organização | `vehicle_events` por `attestor_org_id` | sem queda por 8 semanas |
| Mediana de tempo por registro | `recorded_at` menos início do fluxo, gravado pelo app | abaixo de 60 s |
| % de eventos por canal não manual | `source_channel` ≠ `app` | acima de 30% |
| Consultas por carro anunciado | `report_views` por `listing` | acima de 3 |
| Revendas pagando | manual no piloto | ao menos 1 |
| Tempo e preço de venda com e sem histórico | `listings` (`created_at`, `sold_at`, preços) | diferença mensurável |

Erros no Sentry, uptime e status page externos, logs da Vercel (1 dia no Pro; Observability
Plus se precisar).

## 12. Sequência e critérios de pronto

| Fase | Semana | Entrega | Pronto quando |
|------|--------|---------|---------------|
| 1a. Fundação | 1 | seções 3, 4, 5 (interfaces e implementações atuais), 6, 8 (páginas de privacidade, termos e canal do titular em versão simples; a fase 3 só as redesenha); app atual adaptado ao modelo v2 e no ar | deploy público com domínio, `verify-rls.mjs` verde contra staging, CI verde, políticas publicadas |
| 1b. Identidade | 1 (paralela) | item 9.1 | design system aplicado à home e ao relatório atual |
| 2. Relatório v2 | 2 e 3 | item 9.2 | os 4 veículos de demonstração contam a história completa (fraude, recall, correção, RENAVE) |
| 3. Institucional | 4 | item 9.3 | landing nova no ar com LGPD |
| 4. Cara de produto | 5 e 6 | itens 9.4 a 9.8 | fluxo de 30 s testado em celular real; painel da revenda gera link e QR; métricas lendo o banco |
| 5. Piloto | após a apresentação | migração para Vercel Pro e Supabase Pro antes do primeiro dado real; `RiskBureau` real, validação online de nota, onboarding por convite com CNPJ e CNAE, chaves de API para a revenda, réplica, cobrança | primeira oficina real registrando e primeira revenda com carro anunciado |

Cada fase gera `docs/superpowers/specs/<data>-<fase>-design.md` curto e um plano em
`docs/superpowers/plans/`. Esta spec é atualizada quando uma decisão aqui mudar.

## 13. Testes

- Unitários (Vitest) para todo módulo de `domain/`: `trust`, `corrections`, `fiscalDoc`
  (NF-e e NFS-e), além dos existentes adaptados a `VehicleEvent`.
- `scripts/verify-rls.mjs` (evolução do `verify-append-only.mjs`) contra staging: append-only,
  isolamento entre organizações, `aal1` recusado, leitura de `contacts`, `audit`, `search_log`
  recusada ao anônimo, chave de API revogada ou sem escopo recusada, idempotência.
- `scripts/e2e-oficina.mjs` atualizado para o fluxo com URL assinada.
- CI: lint, `tsc --noEmit`, Vitest, build, teste de headers; `verify-rls.mjs` roda em CI com
  segredos de staging.

## 14. Fora do escopo

Blockchain e carteiras; SEFAZ por certificado próprio da oficina; parceria com montadora;
sensor ou OBD no carro; cobrança real (tela de planos sim); app nativo; autocadastro aberto
(só convite); webhooks e integração com software de oficina (escala).

## 15. Decisões em aberto e premissas

- Cidade do piloto, revenda parceira e a integradora RENAVE que ela usa (janela oficial de
  09 a 20/10/2026): define o adaptador do `RenaveImporter`.
- Preço por anúncio: hipótese testada no piloto.
- Premissas: todo documento fiscal da oficina será NF-e (44) ou NFS-e nacional (50) a partir de
  01/11/2026; a revenda consegue exportar entradas e saídas da integradora em arquivo.

## 16. Riscos

| Risco | Mitigação |
|-------|-----------|
| Integradoras RENAVE lançarem "histórico de km" | foco no km entre transações (oficinas) e no que elas não têm (serviço, nota, foto) |
| Cobertura parcial deslocar a fraude | cobertura honesta no relatório; piloto denso numa cidade |
| Oficina sem nota | aceitar com `low` visível; nunca bloquear o registro por falta de nota |
| OCR errar e travar a oficina | cascata best-effort, confirmação humana, recusa a ler em vez de errar |
| Prazo da apresentação | fases 1 a 3 entregam algo apresentável; a fase 4 é cortável por item |
