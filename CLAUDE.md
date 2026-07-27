@AGENTS.md

# Lastro — PoC de histórico veicular

Prova de conceito: uma pessoa digita uma placa (ou VIN) e vê a linha do tempo do veículo
(registro inicial + revisões) com detecção de anomalia de quilometragem. Valida a
**experiência de consulta** — não a tecnologia. **Não há blockchain nesta fase**; os dados
são fixtures JSON fictícios. A arquitetura, porém, já deixa o ponto exato onde a blockchain
pluga depois (ver `ARCHITECTURE.md`).

## Comandos

- `npm run dev` — servidor local (Turbopack)
- `npm run test` — testes de domínio (Vitest)
- `npm run build` / `npm run lint` — build e lint
- `npx tsc --noEmit` — checagem de tipos

## Escopo

**Entra:** busca por placa/VIN (inclusive via `?placa=`), timeline do veículo, veredito e
alerta de anomalia de km (funcionalidade de primeira classe), recalls, integridade do
histórico, estados vazio/carregando. Fonte de dados: fixtures por padrão, Supabase quando
há `.env.local`.

**Não entra (não construir):** blockchain/viem/carteiras, autenticação,
cadastro/escrita de revisões, deploy. Rodar em localhost basta.

## Regras inegociáveis

Detalhes em `.claude/rules/` e nos docs do repo — em resumo:

1. Arquivos ≤ 150 linhas; um componente por arquivo; responsabilidade única.
2. TypeScript `strict`, sem `any`; todo dado externo validado com Zod antes de renderizar.
3. A UI só fala com dados via a interface `VehicleRepository`; a troca de implementação
   acontece apenas em `lib/repository/index.ts` (a costura). Nunca usar a chave
   `service_role` do Supabase — só a anon, contida por RLS de leitura.
4. Regras de negócio são funções puras em `domain/`, sempre com teste.
5. Sem segredos no repo, sem `dangerouslySetInnerHTML`, sem PII nos fixtures.
6. Não introduzir blockchain nem novas dependências sem justificativa.

## Documentação

`README.md` (rodar/demonstrar) · `ARCHITECTURE.md` (camadas e costura on-chain) ·
`CONVENTIONS.md` (padrões) · `SECURITY.md` (práticas de segurança)
