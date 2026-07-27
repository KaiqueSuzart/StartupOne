# Lastro — PoC de Histórico Veicular

Consulta do histórico completo de um veículo por **placa** ou **chassi (VIN)**: linha do
tempo de revisões, **veredito em 5 segundos**, detecção automática de **fraude de
odômetro**, recalls pendentes e verificação de integridade do histórico.

> **Aviso:** todos os veículos são **fictícios** e **não há blockchain nesta fase**. A PoC
> valida a experiência de consulta; a arquitetura já reserva o ponto onde a blockchain
> pluga depois — ver [ARCHITECTURE.md](ARCHITECTURE.md).

## Rodar

```bash
npm install
npm run dev       # http://localhost:3000
```

**Sem nenhuma configuração**, a aplicação usa os fixtures locais de `data/vehicles/` e
funciona por completo. Para ler do Supabase, copie `.env.example` para `.env.local` e
preencha as duas variáveis (ver [Banco de dados](#banco-de-dados)). O rodapé mostra qual
fonte está ativa.

Outros comandos: `npm run test` (Vitest), `npm run build`, `npm run lint`,
`npx tsc --noEmit`.

## Demonstração

| Consulta | Cenário |
| --- | --- |
| `BRA0S17` | Histórico limpo — veredito verde |
| `ABC1234` | Sem fraude de km, mas com **recall de airbag pendente** |
| `XYZ9A87` | **Fraude de odômetro** (88.500 → 52.000 km) + registro retroativo + lacunas |
| `AAA0A00` | Placa válida sem histórico (estado vazio) |

Funciona também por VIN (ex.: `9BWZZZ377VT004251`) e por deep-link:
`http://localhost:3000/?placa=XYZ9A87`.

## Banco de dados

O Postgres do Supabase é uma das implementações de `VehicleRepository` — não uma
dependência da interface. Para provisionar:

1. No SQL Editor do Supabase, rode [`supabase/schema.sql`](supabase/schema.sql) e depois
   [`supabase/seed.sql`](supabase/seed.sql) (gerado a partir dos fixtures).
2. Copie `.env.example` para `.env.local` e preencha `SUPABASE_URL` e
   `SUPABASE_ANON_KEY`.

A aplicação usa **somente a chave anon**, e o Row Level Security libera apenas `SELECT`:
nenhuma escrita é possível pela aplicação. A `service_role` não existe no projeto.

## Documentação

- [ARCHITECTURE.md](ARCHITECTURE.md) — camadas e a costura para a blockchain
- [CONVENTIONS.md](CONVENTIONS.md) — padrões de código
- [SECURITY.md](SECURITY.md) — práticas de segurança
- [docs/ANALISE-MERCADO.md](docs/ANALISE-MERCADO.md) — pesquisa de mercado e roadmap
