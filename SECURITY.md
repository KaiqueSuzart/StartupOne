# Práticas de segurança

Aplicadas desde a PoC, mesmo sem backend:

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
