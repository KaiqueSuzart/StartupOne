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

## Área da oficina (registrar um serviço)

Acesse **/oficina/login** com uma das credenciais de demonstração:

| E-mail | Senha | CNPJ |
| --- | --- | --- |
| `oficina.central@lastro.dev` | `lastro-demo-2026` | 11.222.333/0001-81 |
| `auto.center@lastro.dev` | `lastro-demo-2026` | 04.252.011/0001-10 |

O fluxo é: placa → km → tipo de serviço → chave da NF-e → foto do odômetro. O
registro aparece **na hora** no relatório do comprador e **não pode ser editado
nem removido** — nem pela oficina, nem pelo administrador do banco via API.

Para gerar uma chave de NF-e válida para teste, rode
`node --env-file=.env.local scripts/demo-registro.mjs BRA0S17 26000` (o script
imprime a chave usada) ou use o script apenas como referência do cálculo do
dígito verificador.

Provas de segurança executáveis:

```bash
node --env-file=.env.local scripts/verify-append-only.mjs
```

Verifica, contra o banco real e com sessão de oficina válida, que UPDATE e
DELETE são negados e que ninguém grava em nome de outra oficina.

## Banco de dados

O Postgres do Supabase é uma das implementações de `VehicleRepository` — não uma
dependência da interface. Para provisionar:

1. No SQL Editor do Supabase, rode nesta ordem:
   [`supabase/schema.sql`](supabase/schema.sql) →
   [`supabase/seed.sql`](supabase/seed.sql) (gerado a partir dos fixtures) →
   [`supabase/workshop.sql`](supabase/workshop.sql) (ponta de escrita) →
   [`supabase/seed_workshops.sql`](supabase/seed_workshops.sql) (oficinas de teste).
2. Copie `.env.example` para `.env.local` e preencha `SUPABASE_URL` e
   `SUPABASE_ANON_KEY`.

A aplicação usa **somente a chave anon**, e o Row Level Security libera apenas `SELECT`:
nenhuma escrita é possível pela aplicação. A `service_role` não existe no projeto.

## Documentação

- [ARCHITECTURE.md](ARCHITECTURE.md) — camadas e a costura para a blockchain
- [CONVENTIONS.md](CONVENTIONS.md) — padrões de código
- [SECURITY.md](SECURITY.md) — práticas de segurança
- [docs/ANALISE-MERCADO.md](docs/ANALISE-MERCADO.md) — pesquisa de mercado e roadmap
