# Práticas de segurança

## O que o sistema garante — e o que não garante

A pergunta honesta é: *"e se o dono pagar para a oficina dizer que fez a revisão
sem ter feito?"*. Nenhum sistema impede uma parte confiável de mentir na entrada —
nem cartório, nem blockchain. O que se pode fazer é **encarecer a mentira**.

**O Lastro garante:** que este número de quilometragem foi registrado nesta data,
por esta entidade identificada, vinculado a esta chave de NF-e e a esta foto — e
que nada disso pode mais ser alterado ou removido, nem pela oficina, nem por nós.

**O Lastro não garante:** que o serviço físico ocorreu, nem que a nota fiscal
corresponde ao serviço descrito. Essa verificação depende da SEFAZ (seam
documentado em `ARCHITECTURE.md`) e, no limite, de inspeção física.

Três mecanismos elevam o custo da fraude:

1. **Vínculo com NF-e.** Registrar exige informar a chave de uma nota fiscal com
   dígito verificador válido. A fraude deixa de ser "digitar um texto" e passa a
   exigir **emitir nota fiscal falsa** — crime fiscal, com a Receita do outro lado.
2. **Cruzamento emitente ↔ oficina.** O CNPJ embutido na chave é comparado com o
   da oficina autenticada. Divergência **não bloqueia** (matriz, filial e rede
   emitem legitimamente), mas fica gravada e **aparece no relatório do comprador**.
3. **Km monotônico na escrita.** Um registro com km menor que o último é recusado
   **antes de existir** — no domínio e, sobretudo, por trigger no Postgres, que
   vale mesmo para quem chamar a API direto.

## Superfície de escrita (etapa 2)

- **`workshop_id` vem sempre de `auth.uid()` no servidor**, nunca de campo de
  formulário. A policy de `INSERT` exige `workshop_id = auth.uid()` — o banco
  recusa gravar em nome de outra oficina mesmo que o código tentasse.
- **Append-only de verdade:** existem policies de `SELECT` e `INSERT`; **não
  existe policy de `UPDATE` nem de `DELETE`**. Provado por
  `scripts/verify-append-only.mjs`, que roda contra o banco real com uma sessão
  de oficina válida.
- **Foto do odômetro em bucket privado.** Pode capturar interior do veículo,
  pessoas ou local. O relatório público mostra apenas o **hash sha256**, que prova
  que a evidência existe e não foi trocada. O caminho no Storage é o próprio hash
  (endereçado por conteúdo) e não há policy de `UPDATE`: foto enviada não é
  substituída.
- **Upload validado no servidor:** tipo, tamanho (8 MB) e *magic number* do
  arquivo — o `content-type` declarado pelo cliente não é confiável. O hash é
  calculado no servidor.
- **NF-e é dado sensível.** Guarda-se a chave e o CNPJ emitente; o relatório
  público exibe a chave **mascarada** e o CNPJ do emitente (dado público de
  empresa), nunca o documento fiscal completo.
- **Mensagem de login genérica**, para não revelar quais e-mails existem.

## Práticas gerais

- **Sem segredos no repositório.** As credenciais do Supabase ficam em `.env.local`
  (o `.gitignore` cobre `.env*`); `.env.example` documenta as variáveis sem valores reais.
- **Somente a chave anon, nunca a `service_role`.** A anon é pública por design e está
  contida pelo Row Level Security; a `service_role` ignora RLS e não deve existir neste
  projeto nem no ambiente de execução.
- **Banco append-only para a aplicação.** As policies em `supabase/schema.sql` liberam
  apenas `SELECT`. Sem policy de `INSERT`/`UPDATE`/`DELETE`, nenhuma escrita é possível
  com a chave da aplicação — verificado na prática, não só no papel.
- **Entrada nunca é usada crua.** Placa/VIN passam por `normalizeIdentifier` +
  validação de formato (`domain/plate.ts`) antes de qualquer uso.
- **Todo dado de fonte externa é validado por Zod** (`lib/schema.ts`) antes de ser
  renderizado — fixtures hoje, respostas on-chain amanhã. O contrato do
  `VehicleRepository` exige isso de qualquer implementação.
- **Sem `dangerouslySetInnerHTML`** nem injeção de HTML; o React escapa tudo.
- **Sem PII.** Veículos, VINs, placas e oficinas são fictícios. O VIN é tratado como
  identificador sensível: mascarado na UI e, na fase on-chain, armazenado apenas como
  hash.
- **Headers de segurança** em `next.config.ts`: `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.
- **Dependências mínimas e fixadas.** Apenas `zod`, `@supabase/supabase-js` e `vitest`
  além do scaffold; `.npmrc` com `save-exact=true`.
- **Rotacionar credencial exposta.** Qualquer chave ou senha que apareça em chat, print,
  log ou commit é considerada comprometida e deve ser rotacionada no painel do Supabase.

## Riscos conhecidos e aceitos (2026-07)

`npm audit` reporta vulnerabilidades **transitivas** nas ferramentas de build/lint das
versões estáveis mais recentes (minimatch via ESLint; postcss embutido no Next;
sharp/libvips). Não afetam o runtime desta PoC local e as "correções" do npm exigiriam
downgrades quebrados (ex.: `next@9`). Decisão: **não** rodar `npm audit fix --force`;
reavaliar a cada atualização de dependências.
