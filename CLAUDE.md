@AGENTS.md

# Lastro — histórico veicular (da PoC ao piloto)

Uma pessoa digita uma placa (ou VIN) e vê a linha do tempo do veículo com veredito,
detecção de anomalia de quilometragem, recalls e manutenção; oficinas e revendas
autenticadas alimentam o histórico. **Não há blockchain nesta fase**; a arquitetura deixa o
ponto onde ela pluga depois (ver `ARCHITECTURE.md`). Fase atual: reconstrução para
apresentação e piloto, conforme `docs/superpowers/specs/2026-10-05-plataforma-piloto-design.md`
(desenho aprovado em 2026-10-05). Pesquisa e critérios em `docs/CRITERIOS-DE-SUCESSO.md`.

## Comandos

- `npm run dev` — servidor local (Turbopack)
- `npm run test` — testes de domínio (Vitest)
- `npm run build` / `npm run lint` — build e lint
- `npx tsc --noEmit` — checagem de tipos

## Escopo

**Entra:** consulta por placa/VIN (inclusive via `?placa=`), timeline, veredito e alerta
de anomalia de km (funcionalidade de primeira classe), recalls, integridade do histórico,
semáforo de risco atrás da costura `RiskBureau`, e a **ponta de escrita**: organizações
(oficina, revenda) com vários membros registram eventos com NF-e ou NFS-e e foto do
odômetro; correção encadeada; importação RENAVE pela revenda; API v1 interna; painéis de
oficina, revenda e métricas; deploy (Vercel Pro + Supabase Pro); LGPD mínima. Fonte de
dados: fixtures por padrão, Supabase quando há `.env.local`.

**Não entra (não construir):** blockchain/viem/carteiras, SEFAZ por certificado, parceria
com montadora, sensor ou OBD no carro, cobrança real (tela de planos sim), app nativo,
autocadastro aberto (só por convite), webhooks e integração com software de oficina.

## Regras inegociáveis

Detalhes em `.claude/rules/` e nos docs do repo — em resumo:

1. Arquivos ≤ 150 linhas; um componente por arquivo; responsabilidade única.
2. TypeScript `strict`, sem `any`; todo dado externo validado com Zod antes de renderizar.
3. A UI só fala com dados via as interfaces de `lib/repository/` (`VehicleRepository`,
   `EventWriter`, `FiscalDocValidator`, `OdometerReader`, `RiskBureau`, `RenaveImporter`,
   `PhotoStorage`); a troca de implementação acontece apenas em `lib/repository/index.ts`
   (a costura). **Nunca usar chave que ignore RLS** (`service_role` ou `sb_secret`) na
   aplicação: só a chave publicável, contida por RLS; operação privilegiada é função
   `security definer` com verificação explícita.
4. Regras de negócio são funções puras em `domain/`, sempre com teste.
5. Sem segredos no repo, sem `dangerouslySetInnerHTML`, sem PII nos fixtures.
6. Não introduzir blockchain nem novas dependências sem justificativa.
7. **Escrita:** a organização que atesta vem sempre da sessão no servidor (membership de
   `auth.uid()`) ou da chave de API verificada, nunca do formulário. O livro
   (`vehicle_events`, antes `service_records`) é append-only — não criar policy de
   `UPDATE`/`DELETE`, nem endpoint que edite histórico; correção é evento novo com
   `corrects_event_id`. Dado pessoal fica fora do livro, em tabelas apagáveis.

## Documentação

`README.md` (rodar/demonstrar) · `ARCHITECTURE.md` (camadas e costura on-chain) ·
`CONVENTIONS.md` (padrões) · `SECURITY.md` (práticas de segurança)
