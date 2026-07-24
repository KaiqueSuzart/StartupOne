# Práticas de segurança

Aplicadas desde a PoC, mesmo sem backend:

- **Sem segredos no repositório.** Não há chaves nem endpoints privados. Se surgir
  configuração, usar `.env.local` (o `.gitignore` já cobre `.env*`) e manter um
  `.env.example` sem valores reais.
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
- **Dependências mínimas e fixadas.** Apenas `zod` e `vitest` além do scaffold;
  `.npmrc` com `save-exact=true`.

## Riscos conhecidos e aceitos (2026-07)

`npm audit` reporta vulnerabilidades **transitivas** nas ferramentas de build/lint das
versões estáveis mais recentes (minimatch via ESLint; postcss embutido no Next;
sharp/libvips). Não afetam o runtime desta PoC local e as "correções" do npm exigiriam
downgrades quebrados (ex.: `next@9`). Decisão: **não** rodar `npm audit fix --force`;
reavaliar a cada atualização de dependências.
