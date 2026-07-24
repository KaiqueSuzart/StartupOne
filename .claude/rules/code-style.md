---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Padrões de código

- **≤ 150 linhas por arquivo.** Ao se aproximar do limite, quebre em módulos. Um componente por arquivo.
- **Responsabilidade única por módulo.** Dados, domínio e UI nunca se misturam no mesmo arquivo.
- **TypeScript `strict`, sem `any`** (nem `as any`, nem `@ts-ignore`). Prefira union types discriminados a booleanos soltos.
- **Todo dado externo passa por Zod antes de virar tipo do domínio** (fixtures hoje, respostas on-chain amanhã). Nunca renderizar dado não validado. Os schemas vivem em `lib/schema.ts`.
- **Nomes em inglês no código; textos de interface em português.**
- **Funções pequenas e puras** onde possível; efeitos colaterais isolados na camada de dados.
- **Sem código morto, sem TODO solto.** Coisas do futuro vão para `ARCHITECTURE.md`.
- **Comentários explicam o "porquê"**, nunca o "o quê". Comente decisões (ex.: a costura do repositório), não o óbvio.
- Server Components por padrão; só adicionar `"use client"` com justificativa real.
- Commits pequenos e atômicos, mensagem no imperativo em inglês (ex.: `add plate search form`).
