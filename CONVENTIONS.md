# Convenções de código

- **≤ 150 linhas por arquivo.** Ao se aproximar do limite, quebre em módulos.
  Um componente por arquivo.
- **Responsabilidade única por módulo.** Dados (`lib/`), domínio (`domain/`) e UI
  (`app/`, `components/`) nunca se misturam no mesmo arquivo.
- **TypeScript `strict`, sem `any`** (nem `as any`, nem `@ts-ignore`). Prefira unions
  discriminadas (ex.: `VehicleReportResult`) a booleanos soltos.
- **Todo dado externo passa por Zod** (`lib/schema.ts`) antes de virar tipo do domínio.
  Nunca renderizar dado não validado.
- **Nomes em inglês no código; textos de interface em português.**
- **Funções pequenas e puras** onde possível; efeitos colaterais isolados na camada de
  dados. Regra de negócio nova nasce em `domain/`, com teste em `tests/`.
- **Sem código morto, sem TODO solto.** Decisões futuras vão para `ARCHITECTURE.md`.
- **Comentários explicam o "porquê", não o "o quê".** Comente decisões (a costura do
  repositório, a máscara do VIN), não o óbvio.
- **Server Components por padrão.** `"use client"` só com justificativa real
  (hoje o projeto não tem nenhum).
- **Commits pequenos e atômicos**, mensagem no imperativo em inglês
  (ex.: `add plate search form`).
- **Dependências**: mínimas, com versão exata (`.npmrc` força `save-exact`). Cada lib
  nova precisa de justificativa.
