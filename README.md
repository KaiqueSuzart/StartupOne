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

A URL canônica do relatório é `/consulta/XYZ9A87` — compartilhável e com
**imagem de preview própria**, que mostra o veredito do veículo quando o link
é enviado em WhatsApp, Slack ou redes. `/consulta?placa=X` e `/?placa=X`
continuam funcionando e redirecionam para ela. Funciona também por VIN
(ex.: `9BWZZZ377VT004251`).

Em placa válida sem histórico, a tela oferece deixar um e-mail para ser
avisado. É a métrica que responde à pergunta da PoC — os e-mails ficam em
`vehicle_interest`, gravável por qualquer visitante e **legível apenas pelo
administrador do banco** (LGPD).

## Área da oficina (registrar um serviço)

Acesse **/oficina/login** com uma das credenciais de demonstração:

| E-mail | Senha | CNPJ |
| --- | --- | --- |
| `oficina.central@lastro.dev` | `lastro-demo-2026` | 11.222.333/0001-81 |
| `auto.center@lastro.dev` | `lastro-demo-2026` | 04.252.011/0001-10 |

O fluxo é: placa → km → tipo de serviço → **itens trocados** → **próxima
revisão** → chave da NF-e → foto do odômetro. Os itens são categorias (sem
valor nem quantidade) e alimentam os **alertas de manutenção vencida** no
relatório do comprador. Ao
gravar, a oficina recebe um **recibo com o elo do registro na cadeia**
(`/oficina/recibo/[id]`) e pode rever tudo que enviou em `/oficina/registros`.
O registro aparece **na hora** no relatório do comprador e **não pode ser
editado nem removido** — nem pela oficina, nem pelo administrador do banco via
API.

Não tem uma chave de NF-e à mão? O formulário tem o link **"Preencher com chave
de demonstração"**, que gera uma chave válida com o CNPJ da própria oficina.

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

O fluxo completo pela interface (login → formulário → foto → recibo) tem teste
de ponta a ponta em `scripts/e2e-oficina.mjs` — instruções no cabeçalho do
arquivo.

## Banco de dados

O Postgres do Supabase é uma das implementações de `VehicleRepository` — não uma
dependência da interface. Para provisionar:

1. No SQL Editor do Supabase, rode nesta ordem:
   [`supabase/schema.sql`](supabase/schema.sql) →
   [`supabase/seed.sql`](supabase/seed.sql) (gerado a partir dos fixtures) →
   [`supabase/workshop.sql`](supabase/workshop.sql) (ponta de escrita) →
   [`supabase/seed_workshops.sql`](supabase/seed_workshops.sql) (oficinas de teste) →
   [`supabase/interest.sql`](supabase/interest.sql) (captura de interesse) →
   [`supabase/telemetry.sql`](supabase/telemetry.sql) (registro de consultas) →
   [`supabase/rate_limit.sql`](supabase/rate_limit.sql) (limites de escrita pública).
2. Copie `.env.example` para `.env.local` e preencha `SUPABASE_URL` e
   `SUPABASE_ANON_KEY`.

A aplicação usa **somente a chave anon** — a `service_role` não existe no projeto. O Row
Level Security define exatamente o que essa chave pode fazer:

| Tabela | Leitura | Escrita |
| --- | --- | --- |
| `vehicles`, `service_records`, `recalls`, `workshops` | pública | `INSERT` só de oficina autenticada, no próprio nome |
| `vehicle_interest` | **nenhuma** (e-mail é dado pessoal) | `INSERT` aberto, com cota diária |
| `search_log` | **nenhuma** | `INSERT` aberto, com cota diária |

Em nenhuma tabela existe policy de `UPDATE` ou `DELETE` — o histórico é append-only até
para quem tem credencial de oficina.

## Publicar (Vercel)

O projeto está pronto para deploy; falta apenas a autenticação da sua conta,
que é interativa.

```bash
npx vercel login       # abre o navegador para autorizar
npx vercel --prod      # primeira vez: aceite os padrões detectados (Next.js)
```

Depois, em **Project → Settings → Environment Variables**, defina as duas
variáveis (as mesmas do `.env.local`) e faça um redeploy:

| Variável | Observação |
| --- | --- |
| `SUPABASE_URL` | `https://SEU-PROJETO.supabase.co` |
| `SUPABASE_ANON_KEY` | Apenas a chave **anon**. A `service_role` não vai para lugar nenhum. |

**Sem essas variáveis o deploy funciona assim mesmo**: a consulta pública cai
nos fixtures locais e a área da oficina exibe um aviso em vez de erro.

### Antes de divulgar o link

A demonstração é pública e as credenciais da oficina estão neste README —
qualquer visitante pode gravar registros, e o histórico é append-only. As
defesas já embutidas:

- **Cota de 20 registros por oficina por dia**, aplicada por trigger no
  Postgres (`supabase/workshop.sql`).
- **Cotas nas tabelas públicas** (`supabase/rate_limit.sql`): 10 cadastros de
  interesse por placa/dia e 30 consultas registradas por identificador/dia,
  com tetos globais. O limite é por chave de negócio, não por visitante — o
  projeto não guarda IP.
- **Reset administrativo**: `supabase/reset_demo.sql` apaga os registros
  gravados por oficinas e devolve a base ao estado semeado. Só roda com
  credencial de administrador — a aplicação não consegue.

Se o link for divulgado amplamente, prefira um projeto Supabase separado para
a demo, mantendo o de desenvolvimento intacto.

## O que medir com a PoC no ar

Duas tabelas só de escrita respondem à pergunta original — as pessoas querem
isso? Ambas são ilegíveis pela chave pública; só o administrador do banco
consulta:

```sql
-- volume e cobertura das consultas
select date(created_at) as dia, count(*) as consultas,
       count(*) filter (where found) as com_historico
from public.search_log group by 1 order by 1 desc;

-- quem pediu para ser avisado
select plate, count(*) from public.vehicle_interest group by 1 order by 2 desc;
```

## Documentação

- [ARCHITECTURE.md](ARCHITECTURE.md) — camadas e a costura para a blockchain
- [CONVENTIONS.md](CONVENTIONS.md) — padrões de código
- [SECURITY.md](SECURITY.md) — práticas de segurança
- [docs/ANALISE-MERCADO.md](docs/ANALISE-MERCADO.md) — pesquisa de mercado e roadmap
