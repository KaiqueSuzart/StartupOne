# Plataforma Lastro: limites, preços, segurança e LGPD (pesquisa de 2026-10-05)

Legenda: **[FATO]** verificado em fonte citada na linha. **[INFERÊNCIA]** conclusão nossa a partir dos fatos. **[NÃO VERIFICADO]** afirmação de terceiro ou memória, conferir antes de decidir.
Contexto: Next.js 16 (Server Actions) + Supabase (só chave anon, tabelas append-only, rate limit em trigger) + Vercel + tesseract.js/sharp em Server Action. Meta: piloto (3 oficinas, 100 consultas/mês) que escale a 300 oficinas e 100k consultas/mês sem reescrita.

## 1. Supabase: limites, preços e recomendações

| Item | Free | Pro ($25/mês + $10 de crédito de compute) | Team ($599/mês) |
|---|---|---|---|
| Banco | 500 MB, instância Nano | 8 GB incluídos, depois $0,125/GB | igual ao Pro |
| Egress | 5 GB | 250 GB, depois $0,09/GB | igual |
| Storage | 1 GB, arquivo até 50 MB | 100 GB ($0,0213/GB extra), arquivo até 500 GB | igual |
| Auth MAU | 50.000 | 100.000, depois $0,00325/MAU | igual |
| Edge Functions | 500 mil invocações | 2 milhões, depois $2/milhão | igual |
| Realtime | 200 conexões, 2 M msgs | 500 conexões ($10/1000 extra), 5 M msgs ($2,50/M) | igual |
| Backups | nenhum | diário, 7 dias | diário, 14 dias |
| PITR | não | $100/mês por 7 dias (exige compute Small) | igual |
| Pausa por inatividade | após 1 semana | nunca | nunca |
| Logs | 1 dia (audit de Auth: 1 h) | 7 dias | 28 dias, SOC2/ISO 27001 |

Tabela toda **[FATO]** https://supabase.com/pricing e https://supabase.com/docs/guides/platform/backups (PITR: WAL a cada 2 min, RPO 2 min, "requires at least a Small compute add-on"; "backups do not include objects you store via the Storage API").
- Compute e conexões **[FATO]** https://supabase.com/docs/guides/platform/compute-and-disk: Nano $0 (60 diretas / 200 via pooler), Micro ~$10 (1 GB RAM, 60/200), Small ~$15 (2 GB, 90/400), Medium ~$60 (4 GB, 120/600), Large ~$110 (2 vCPU dedicadas, 160/800). O Pro já paga a Micro com o crédito. Como o app fala com o banco via supabase-js (PostgREST/HTTP), funções serverless não esgotam conexões; só código com driver Postgres precisa do pooler em modo transação **[INFERÊNCIA]**.
- Região **[FATO]** https://supabase.com/docs/guides/platform/regions: "South America (São Paulo)" sa-east-1 disponível; a doc avisa que escolher região "is not proof of regulatory compliance".
- Rate limits de Auth **[FATO]** https://supabase.com/docs/guides/auth/rate-limits: 2 e-mails/hora com o SMTP embutido (produção exige SMTP próprio), sign-in/sign-up 30 req por 5 min por IP, token refresh 150 por 5 min, OTP 1 por 60 s, MFA 15/min, anônimos 30/h; retorna 429. CAPTCHA nativo (hCaptcha ou Turnstile) nos endpoints de signup, sign-in e reset **[FATO]** https://supabase.com/docs/guides/auth/auth-captcha.
- Chaves novas **[FATO]** https://supabase.com/docs/guides/api/api-keys: `sb_publishable_...` substitui `anon` e `sb_secret_...` substitui `service_role`; não são JWT (vão no header `apikey`); legacy "deprecating ... by the end of 2026"; projetos novos já não têm anon/service_role; a secret key "bypass every Row Level Security policy", nunca em browser, e a doc recomenda "a separate secret key for each backend component". JWT signing keys assimétricas (RSA/EC), rotação sem downtime e `getClaims()` verificando localmente via Web Crypto; migração automática em 1/10/2025 **[FATO]** https://supabase.com/blog/jwt-signing-keys.
- Quando usar secret key no servidor: só em jobs, admin e pipelines com autorização própria no código; para ações em nome de usuário, manter publishable key + JWT do usuário (RLS continua sendo a fronteira) **[FATO]** api-keys acima, aplicação ao Lastro **[INFERÊNCIA]**.
- Desempenho de RLS **[FATO]** https://supabase.com/docs/guides/database/postgres/row-level-security: índice em toda coluna filtrada por policy ("a column counts as indexed only when it comes first in a btree index"), `(select auth.uid())` gera initPlan e cacheia por statement, declarar `to authenticated`, quebrar recursão com security definer. Benchmark da comunidade: 179 ms para 9 ms com o wrapper e >100x com índice **[FATO]** https://github.com/orgs/supabase/discussions/14576. Security definer: `set search_path = ''`, nomes qualificados, nunca em schema exposto na API, `revoke execute ... from public` **[FATO]** mesma doc de RLS.
- Infra interna: pg_cron agenda jobs; pg_net faz HTTP assíncrono (200 req/s) e sustenta Database Webhooks; pgmq é a fila durável (Supabase Queues) **[FATO]** https://supabase.com/docs/guides/database/extensions/pg_net, https://supabase.com/docs/guides/database/webhooks, https://supabase.com/blog/supabase-queues. MFA TOTP é grátis em todo projeto; MFA por telefone é add-on de $75/mês **[FATO]** https://supabase.com/docs/guides/platform/manage-your-usage/advanced-mfa-phone.

## 2. Vercel: limites e preços

- Planos **[FATO]** https://vercel.com/pricing: Hobby "for personal, non-commercial use", sem compra de uso extra; Pro $20 por desenvolvedor/mês com $20 de crédito de uso, viewers ilimitados. Hobby inclui 100 GB de transferência, 1 M requests de CDN, 1 M invocações, 4 h de Active CPU, 360 GB-h de memória, 5 mil otimizações de imagem; Pro inclui 1 TB (depois $0,15/GB), 10 M requests ($2/M extra), invocações $0,60/M, imagens $0,05 por mil. Logs de runtime: 1 h Hobby, 1 dia Pro, 30 dias com Observability Plus **[FATO]** https://vercel.com/docs/limits.
- Funções com Fluid Compute **[FATO]** https://vercel.com/docs/functions/limitations: duração Hobby 300 s (default e máximo); Pro 300 s default, 800 s máximo, 1800 s em beta; memória 2 GB/1 vCPU (Hobby máx.), Pro até 4 GB/2 vCPU; bundle 250 MB descompactado, "Large functions" até 5 GB em beta (Node, Bun, Python; exige Fluid com Active CPU, projetos novos já elegíveis); body de request e response 4,5 MB; concorrência até 30 mil; região única padrão iad1, trocável (gru1 = São Paulo), multi-região só Pro. Node 24.x é o default de projetos novos **[FATO]** https://vercel.com/docs/functions/runtimes/node-js/node-js-versions.
- Preço Fluid por região **[FATO]** https://vercel.com/docs/functions/usage-and-pricing: Active CPU $0,128/h em iad1 e $0,221/h em gru1; memória $0,0106 e $0,0183 por GB-h; só CPU ativa é cobrada (I/O não conta), memória conta enquanto a instância vive.
- Cron **[FATO]** https://vercel.com/docs/cron-jobs/usage-and-pricing: 100 por projeto em todo plano; Hobby só 1 vez ao dia com precisão de ±59 min; Pro por minuto.
- Firewall **[FATO]** https://vercel.com/docs/vercel-firewall/vercel-waf/usage-and-pricing e https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting: DDoS, bloqueio de IP e custom rules grátis em todos os planos; tráfego negado/desafiado/rate-limited não conta como uso. Rate limiting disponível em todos: Hobby 1 regra e 1 M "allowed requests" incluídos; Pro 40 regras, $0,50 por 1 M allowed requests; chaves IP e JA4, janela de 10 s a 10 min, fixed window (token bucket só Enterprise). Attack Mode grátis em todos os planos e sem custo pelo tráfego bloqueado **[FATO]** https://vercel.com/docs/vercel-firewall/attack-mode. BotID: Basic grátis em todos; Deep Analysis (Kasada) $1 por 1000 chamadas `checkBotId()` no Pro **[FATO]** https://vercel.com/docs/botid.
- tesseract.js + sharp + tessdata: cabem folgados nos 250 MB **[INFERÊNCIA]**, mas exigem `serverExternalPackages` (sharp, tesseract.js) e `outputFileTracingIncludes` para `.traineddata` e worker; o worker do tesseract.js já quebrou build do Next **[FATO]** https://github.com/naptha/tesseract.js/issues/868 e https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions. Gargalo real: Server Action aceita 1 MB de body por padrão (`serverActions.bodySizeLimit`) **[FATO]** https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions e a função aceita 4,5 MB; foto de celular tem 3 a 8 MB, então redimensionar no cliente ou subir direto ao Storage com URL assinada e passar só o path **[INFERÊNCIA]**. OCR custa CPU: 3 s de CPU em 2 GB por 5 s dá ~$0,00014 por imagem em iad1 e ~$0,00023 em gru1 **[INFERÊNCIA]** com os preços acima.

## 3. Rate limiting e antiabuso sem gravar IP no banco

| Camada | Ferramenta | Custo | Observação |
|---|---|---|---|
| Borda | Vercel WAF rate limit por IP/JA4 nas rotas `/consulta` e `/api/v1/*` | Hobby: 1 regra grátis; Pro: $0,50/M allowed | contador fica na Vercel, IP nunca entra no seu BD **[FATO]** doc acima |
| Formulário público | Cloudflare Turnstile | grátis, "unlimited challenges", 20 widgets, 10 hostnames/widget **[FATO]** https://developers.cloudflare.com/turnstile/plans/ | integra nativo no Supabase Auth; hCaptcha free tem teto ambíguo (10 mil ou 100 mil/mês) **[NÃO VERIFICADO]** |
| Por chave/oficina | Upstash Redis + `@upstash/ratelimit` | Free: 500 mil comandos/mês, 256 MB, 1 BD; PAYG $0,20 por 100 mil; Fixed $10/mês **[FATO]** https://upstash.com/pricing/redis | chave = HMAC(IP ou api_key, salt diário) com TTL, sem IP em claro **[INFERÊNCIA]** |
| Rotas caras (registro com OCR) | Vercel BotID | Basic grátis; Deep Analysis $1/1000 | invisível, sem desafio ao usuário **[FATO]** |

Recomendação: piloto = 1 regra WAF + Turnstile no formulário de consulta e no login + triggers Postgres atuais por `workshop_id` (custo zero). Escala = mesmas camadas + Upstash para limite por chave de parceiro (ainda no free tier a 100k consultas) + BotID Deep Analysis só na rota de registro (~$20/mês a 20 mil registros). Tudo isso são adições, nada obriga reescrita **[INFERÊNCIA]**.

## 4. OCR de odômetro (7 dígitos, foto de celular ~1 MP)

| Opção | Custo por 1000 imagens | Latência típica | Acurácia / limites |
|---|---|---|---|
| tesseract.js na função | ~$0,14 (iad1) a $0,23 (gru1) de compute **[INFERÊNCIA]** | 2 a 8 s com carga do wasm e tessdata **[INFERÊNCIA]** | OCR genérico "perform poorly on odometer images" (variação de fonte, LCD, 7 segmentos) **[FATO]** https://www.frontiersin.org/articles/10.3389/fams.2019.00061/full |
| Google Cloud Vision TEXT_DETECTION | 1000/mês grátis; $1,50; $0,60 acima de 5 M **[FATO]** https://cloud.google.com/vision/pricing | ~1 s **[NÃO VERIFICADO]** | bom em texto impresso, sem noção de "odômetro" |
| AWS Textract DetectDocumentText | $1,50 (1º milhão); 1000/mês grátis por 3 meses **[FATO]** https://aws.amazon.com/textract/pricing/ | ~1 a 3 s **[NÃO VERIFICADO]** | focado em documentos |
| AWS Rekognition DetectText | $1,00 (1º milhão); 1000/mês grátis por 12 meses **[FATO]** https://aws.amazon.com/rekognition/pricing/ | ~1 s **[NÃO VERIFICADO]** | texto em cena, até 100 palavras |
| Azure AI Vision Read | F0: 5000/mês grátis, 20/min **[FATO]** https://azure.microsoft.com/en-us/pricing/details/computer-vision/ ; S1 exibido como "$-" | ~1 s **[NÃO VERIFICADO]** | preço S1 ~$1/1000 **[NÃO VERIFICADO]** |
| Claude Haiku 4.5 (visão) | 1000x1000 px = 1296 tokens, "about $1.30 USD per thousand images" de entrada; com saída ~$1,60 **[FATO]** https://platform.claude.com/docs/en/build-with-claude/vision | 2 a 5 s **[INFERÊNCIA]** | entende contexto (ignora relógio/trip), devolve JSON validável; Sonnet 5.5 a $2/M entrada daria ~$3,10 **[NÃO VERIFICADO]** https://claude.com/pricing |
| OpenAI gpt-5-nano / gpt-4o-mini | nano: 1024 patches x1,5 = 1536 tokens a $0,05/M ≈ $0,10; 4o-mini: 2833+4x5667 = 25.501 tokens a $0,15/M ≈ $3,80 **[FATO]** https://developers.openai.com/api/docs/guides/images-vision e https://developers.openai.com/api/docs/pricing | 2 a 5 s **[INFERÊNCIA]** | nano é o mais barato, acurácia em 7 segmentos não medida |
| APIs dedicadas | Inspektlabs (até 95%), Cognexa OdoCap (99,9% alegado), modelo comunitário Roboflow (mAP@50 90,3%); Roboflow serverless ~1 crédito por 1000 inferências | n/d | preços de Inspektlabs/Cognexa não públicos **[NÃO VERIFICADO]** https://inspektlabs.com/ai-powered-ocr, https://universe.roboflow.com/odometer-ocr/odometer-ocr |

Estratégia de costura (seam) **[INFERÊNCIA]**: interface `OdometerReader { read(img): Promise<{ km: number | null; confidence: number; provider: string }> }` com composição única em `lib/ocr/index.ts` (mesmo padrão do `VehicleRepository`). Cascata: sharp recorta e redimensiona para ~1000 px, tesseract.js tenta primeiro (grátis), se confiança < limiar chama um leitor LLM (Haiku 4.5 ou gpt-5-nano) com prompt "só dígitos ou null" validado por Zod, e por fim a oficina confirma o valor na tela (manter a política atual de recusar a ler em vez de errar). Gravar provider, confiança e latência por leitura para medir acurácia real e trocar o default sem tocar na UI. Custo marginal por registro fica abaixo de $0,002 em qualquer escala.

## 5. Baseline de segurança para o piloto com dados reais

- Referência: OWASP ASVS 5.0.0 (maio de 2025), 17 capítulos, ~350 requisitos; L1 tem 70 requisitos e é o baseline testável em caixa-preta, L2 é o alvo recomendado para apps com dados sensíveis **[FATO]** https://owasp.org/www-project-application-security-verification-standard/ e https://scotthelme.co.uk/owasp-asvs-5-0-0-is-here/. Itens L1 que mapeiam direto para Next+Supabase **[INFERÊNCIA]**: validação de entrada em toda borda (Zod, já feito), autorização por registro em cada Server Action e via RLS, sessão com cookies HttpOnly/SameSite (`@supabase/ssr`), anti-CSRF, cabeçalhos (CSP, HSTS, `frame-ancestors`, `X-Content-Type-Options`), erros sem stack trace, log de eventos de segurança, upload com tipo/tamanho/magic bytes, segredos só em env.
- Checklist oficial Supabase **[FATO]** https://supabase.com/docs/guides/deployment/going-into-prod: RLS em todas as tabelas, SSL enforcement, Network Restrictions, MFA na conta e enforcement na organização, mais de um owner, confirmação de e-mail, expiração de OTP, MFA para usuários, SMTP próprio ("so that your users can see that the mails are coming from a trusted domain"), índices, load test, PITR acima de 4 GB, branching no Pro para testar migrations.
- Next.js **[FATO]** https://nextjs.org/blog/security-nextjs-server-components-actions: "use server" expõe endpoint público, "those functions should always start by validating that the current user is allowed"; CSRF: só POST e comparação `Origin` x `Host` (extensível com `serverActions.allowedOrigins`); Data Access Layer com `server-only` e DTOs; middleware/`proxy.ts` é "escape hatch", use allow list e nunca como única barreira. CVE-2025-29927 (CVSS 9.1): header `x-middleware-subrequest` pulava o middleware; corrigido em 15.2.3, 14.2.25, 13.5.9, 12.3.5; Next 16 não é afetado, mas o aprendizado é que autorização mora na action e no RLS **[FATO]** https://github.com/advisories/GHSA-f82v-jwr5-mffw. CSP com nonce via `proxy.ts` exige renderização dinâmica e é incompatível com PPR; alternativa: CSP estática em `next.config` ou SRI experimental **[FATO]** https://nextjs.org/docs/app/guides/content-security-policy.
- MFA para oficinas: TOTP grátis; policy restritiva `(select auth.jwt()->>'aal') = 'aal2'` nas tabelas de escrita força o segundo fator só em quem registra serviço **[FATO]** https://supabase.com/docs/guides/auth/auth-mfa.
- Audit log: separar o ledger de negócio (service_records, já append-only) de `audit_events` (login, troca de chave, convite, revogação, leitura de PII) em schema `audit`, insert-only por trigger, no padrão do `supa_audit` (`audit.record_version`); pgaudit só grava em log com retenção de 7 dias no Pro **[FATO]** https://github.com/supabase/supa_audit e https://pganalyze.com/blog/5mins-postgres-auditing-pgaudit-supabase-supa-audit.
- Backups: Pro dá 7 dias diários; PITR $100/mês + Small; fotos do Storage não entram no backup, então replicar o bucket (pg_cron + Edge Function copiando para outro bucket/conta) antes de depender dele como prova **[FATO]** backups acima, mitigação **[INFERÊNCIA]**.
- Rotação de segredos: uma secret key por componente e rotação de JWT signing keys sem downtime (Supabase); env vars "sensitive" na Vercel; segredo de webhook com janela de 24 h de sobreposição (padrão Stripe) **[FATO]** fontes já citadas e https://docs.stripe.com/webhooks.
- Dependências: Dependabot grátis em qualquer repo GitHub; Socket free com 1000 scans/mês; `npm audit` no CI **[FATO]** https://socket.dev/pricing e https://appsecsanta.com/dependabot. Erros: Sentry Developer grátis (1 usuário, 5 mil erros/mês, 30 dias), Team $26/mês com 50 mil **[FATO]** https://sentry.io/pricing/. Uptime e status page: Better Stack free com 10 monitores (3 min) e status page; UptimeRobot free com 50 monitores (5 min) **[FATO]** https://betterstack.com/uptime e https://hyperping.com/blog/uptimerobot-pricing.

## 6. API de parceiros (software de oficina)

- Chaves: prefixo público identificável (`lst_live_` / `lst_test_` + aleatório), só o hash SHA-256 no banco, exibida uma vez, `last4` para suporte, escopos (`history:read`, `service_record:write`), expiração, revogação e rotação com duas chaves ativas em sobreposição. É o modelo do Unkey, que nunca armazena a chave em claro e cobra só requests válidos: Free 150 mil/mês, Pro a partir de $25 **[FATO]** https://www.unkey.com/pricing e https://www.unkey.com/docs/introduction. Para o piloto, tabela `api_keys` própria + verificação em Route Handler + cache no Upstash basta; Unkey é a saída se a gestão virar produto **[INFERÊNCIA]**.
- Idempotência (padrão Stripe) **[FATO]** https://docs.stripe.com/api/idempotent_requests: header `Idempotency-Key` (UUID v4, até 255 chars), guarda status e body da primeira resposta, mesma chave com parâmetros diferentes dá erro, chaves expiram em 24 h, só em POST. No Lastro, somar chave natural (`workshop_id` + chave da NF-e + hash da foto) como unique constraint, porque o ledger não pode duplicar serviço **[INFERÊNCIA]**.
- Webhooks: seguir Standard Webhooks (adotado por Supabase, OpenAI, Twilio): headers `webhook-id`, `webhook-timestamp`, `webhook-signature` = HMAC-SHA256 sobre `id.timestamp.payload`, várias assinaturas para rotação, `webhook-id` estável entre retries para dedupe **[FATO]** https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md. Entrega: retries com backoff exponencial por até 3 dias, tolerância de 5 min no timestamp, responder 2xx rápido e processar em fila (pgmq) **[FATO]** https://docs.stripe.com/webhooks.
- Versionamento e contrato **[INFERÊNCIA]**: `/api/v1/` no path, quebras só em `/v2`; OpenAPI 3.1 gerado dos mesmos schemas Zod (`zod-openapi`) e publicado; sandbox = segundo projeto Supabase (Free) + ambiente Vercel preview com chaves `lst_test_`; limite por chave (ex. 60 req/min e 5 mil/dia) no Upstash com headers `RateLimit-*` e 429; log de cada chamada em `api_request_log` sem IP em claro.

## 7. LGPD para agente de pequeno porte

- Enquadramento **[FATO]** https://www.normaslegais.com.br/legislacao/resolucao-anpd-2-2022.htm (Res. CD/ANPD 2/2022): startups e microempresas são agentes de pequeno porte (art. 2), salvo tratamento de alto risco (arts. 3 e 4: larga escala ou impacto relevante + critério específico como dado sensível ou decisão automatizada). Benefícios: registro simplificado das operações (arts. 8 e 9), dispensa de encarregado desde que exista canal com o titular (art. 11), prazos em dobro e política de segurança simplificada (arts. 13 e 14). A ANPD publicou o modelo de registro simplificado (ROPA) com 8 campos em Excel e PDF **[FATO]** https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-modelo-de-registro-simplificado-de-operacoes-com-dados-pessoais-para-agentes-de-tratamento-de-pequeno-porte-atpp.
- Encarregado: Res. CD/ANPD 18/2024 regula a função e mantém a dispensa para pequeno porte, com canal de comunicação obrigatório **[FATO]** https://www.tjba.jus.br/extrajudicial/wp-content/uploads/2024/08/RESOLUCAO-ANPD-No-18-Encarregado-de-Dados.pdf.
- Incidentes **[FATO]** https://www.abrapp.org.br/legislacao/resolucao-cd-anpd-no-15-de-24-de-abril-de-2024/ (Res. 15/2024): o prazo é de 3 dias úteis após a ciência, não 72 h, e conta em dobro para pequeno porte (art. 6, caput e §8); conteúdo mínimo no art. 6 §2 (dados afetados, número de titulares, medidas, riscos, datas, causa raiz); titulares também em 3 dias úteis, em dobro (art. 9); registro interno de todos os incidentes, inclusive não comunicados, por 5 anos (art. 10 §1); "risco relevante" exige afetar direitos e ao menos um critério como credenciais de autenticação, dados financeiros ou larga escala (art. 5). Vazamento de credenciais de oficina ou de NF-e cai nesses critérios **[INFERÊNCIA]**.
- Mapeamento: placa/VIN com histórico é dado pessoal quando permite identificar o dono (LGPD art. 5, I); CNPJ da oficina não é, mas nome, e-mail e telefone do responsável são **[INFERÊNCIA]**. Preencher o modelo ANPD por processo: consulta pública, registro de serviço, conta de oficina, telemetria, suporte.
- Retenção e ledger: definir prazo por finalidade (art. 15) e manter além dele só nas hipóteses do art. 16 (obrigação legal, estudo, uso exclusivo anonimizado). Para conciliar eliminação (art. 18, VI) com append-only: o ledger guarda só dados do veículo e pseudônimos (art. 13 §4); PII do titular fica em tabela separada cifrada com chave por titular, e apagar = destruir a chave (crypto-shredding), reconhecido por EDPB/ICO/CNIL segundo fontes secundárias e sem posicionamento específico da ANPD **[NÃO VERIFICADO]** https://granit-fx.dev/dotnet/compliance/crypto-shredding/. Hash do VIN deve ser HMAC com segredo, porque VIN tem estrutura previsível e hash puro é quebrável por enumeração **[INFERÊNCIA]**.
- Política de privacidade mínima (LGPD art. 9) **[FATO]** https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm: finalidade, forma e duração, identificação e contato do controlador, compartilhamentos, responsabilidades dos agentes, direitos do titular (art. 18) e o canal do art. 41 §2 I.
- Cookies **[FATO]** https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf/@@display-file/file: cookies estritamente necessários (sessão, autenticação) dispensam consentimento (legítimo interesse ou execução de contrato); os demais exigem consentimento inequívoco sem opções pré-marcadas. Sem analytics de terceiros, basta descrever os cookies de sessão na política, sem banner **[INFERÊNCIA]**.

## 8. Estimativa de custo mensal (USD)

| Item | Piloto (100 consultas, 50 registros) | Crescimento (10 mil, 2 mil) | Escala (100 mil, 20 mil) |
|---|---|---|---|
| Vercel | Pro, 1 seat: $20 (crédito cobre uso) | Pro, 2 seats: $40 + ~$2 BotID | Pro, 3 seats: $60 + $10 Observability Plus + ~$4 compute + ~$20 BotID + $0,15 WAF ≈ $95 |
| Supabase | Pro: $25 (Micro, backups 7 dias) | Pro: $25; +$105 se ligar PITR 7 dias (Small) | Pro + Small + PITR 7 dias: ~$130; +$3 storage acima de 100 GB |
| Upstash | $0 (free) | $0 (~24 mil comandos) | $0 a $10 (~240 mil comandos, free ou Fixed) |
| OCR | ~$0 (tesseract; 50 fallbacks LLM < $0,10) | $1 a $3 (30% fallback Haiku ou Vision) | $10 a $30 (6 mil fallbacks Haiku, ou 20 mil em Vision) |
| Sentry | $0 (Developer) | $0 a $26 | $26 (Team) |
| Uptime/status | $0 (Better Stack free) | $0 | $0 a $29 |
| Domínio e e-mail | .com.br ~R$40/ano; e-mail transacional em free tier **[NÃO VERIFICADO]** | ~$1 + e-mail ~$20 **[NÃO VERIFICADO]** | ~$1 + ~$20 |
| **Total** | **~$45 a 50** | **~$70 (sem PITR) a ~$200 (com PITR)** | **~$300 a 350** |

Premissas **[INFERÊNCIA]**: Hobby descartado por ser não comercial; Supabase Free descartado por pausar em 1 semana e não ter backup; 3 invocações e ~1 MB de transferência por consulta; foto redimensionada para ~1 MB; OCR com 3 s de CPU; tráfego dentro de 1 TB/10 M requests do Pro; MAU irrelevante (300 oficinas); PITR vira obrigatório quando o ledger for prova para terceiros (fase crescimento tardia); preços de iad1, gru1 custa ~1,7x em compute mas a diferença é centavos; câmbio e impostos de importação não incluídos.

Sources:
- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/compute-and-disk
- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/platform/regions
- https://supabase.com/docs/guides/auth/rate-limits
- https://supabase.com/docs/guides/auth/auth-captcha
- https://supabase.com/docs/guides/auth/auth-mfa
- https://supabase.com/docs/guides/api/api-keys
- https://supabase.com/blog/jwt-signing-keys
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://github.com/orgs/supabase/discussions/14576
- https://supabase.com/docs/guides/deployment/going-into-prod
- https://supabase.com/docs/guides/database/extensions/pg_net
- https://supabase.com/docs/guides/database/webhooks
- https://supabase.com/blog/supabase-queues
- https://supabase.com/docs/guides/platform/manage-your-usage/advanced-mfa-phone
- https://github.com/supabase/supa_audit
- https://pganalyze.com/blog/5mins-postgres-auditing-pgaudit-supabase-supa-audit
- https://vercel.com/pricing
- https://vercel.com/docs/limits
- https://vercel.com/docs/functions/limitations
- https://vercel.com/docs/functions/usage-and-pricing
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- https://vercel.com/docs/cron-jobs/usage-and-pricing
- https://vercel.com/docs/vercel-firewall/vercel-waf/usage-and-pricing
- https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting
- https://vercel.com/docs/vercel-firewall/attack-mode
- https://vercel.com/docs/botid
- https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions
- https://github.com/naptha/tesseract.js/issues/868
- https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions
- https://nextjs.org/blog/security-nextjs-server-components-actions
- https://nextjs.org/docs/app/guides/content-security-policy
- https://github.com/advisories/GHSA-f82v-jwr5-mffw
- https://developers.cloudflare.com/turnstile/plans/
- https://upstash.com/pricing/redis
- https://www.frontiersin.org/articles/10.3389/fams.2019.00061/full
- https://cloud.google.com/vision/pricing
- https://aws.amazon.com/textract/pricing/
- https://aws.amazon.com/rekognition/pricing/
- https://azure.microsoft.com/en-us/pricing/details/computer-vision/
- https://platform.claude.com/docs/en/build-with-claude/vision
- https://claude.com/pricing
- https://developers.openai.com/api/docs/guides/images-vision
- https://developers.openai.com/api/docs/pricing
- https://inspektlabs.com/ai-powered-ocr
- https://universe.roboflow.com/odometer-ocr/odometer-ocr
- https://owasp.org/www-project-application-security-verification-standard/
- https://scotthelme.co.uk/owasp-asvs-5-0-0-is-here/
- https://socket.dev/pricing
- https://appsecsanta.com/dependabot
- https://sentry.io/pricing/
- https://betterstack.com/uptime
- https://hyperping.com/blog/uptimerobot-pricing
- https://www.unkey.com/pricing
- https://www.unkey.com/docs/introduction
- https://docs.stripe.com/api/idempotent_requests
- https://docs.stripe.com/webhooks
- https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md
- https://www.normaslegais.com.br/legislacao/resolucao-anpd-2-2022.htm
- https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-modelo-de-registro-simplificado-de-operacoes-com-dados-pessoais-para-agentes-de-tratamento-de-pequeno-porte-atpp
- https://www.tjba.jus.br/extrajudicial/wp-content/uploads/2024/08/RESOLUCAO-ANPD-No-18-Encarregado-de-Dados.pdf
- https://www.abrapp.org.br/legislacao/resolucao-cd-anpd-no-15-de-24-de-abril-de-2024/
- https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf/@@display-file/file
- https://granit-fx.dev/dotnet/compliance/crypto-shredding/
