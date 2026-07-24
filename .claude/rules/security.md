# Segurança (aplicar sempre, mesmo sem backend)

- **Sem segredos no repositório.** Chaves, tokens e endpoints privados só em `.env.local` (já coberto pelo `.gitignore`); se surgir config, criar também `.env.example` sem valores reais.
- **Nunca confiar na entrada bruta do usuário.** Placa e VIN passam por `normalizeIdentifier` + validação de formato (`domain/plate.ts`) antes de qualquer uso.
- **Proibido `dangerouslySetInnerHTML`** e qualquer injeção de HTML. O React escapa tudo.
- **Sem PII nos dados de exemplo.** VINs, placas e oficinas são fictícios. O VIN é identificador sensível: exibir mascarado na UI e, na futura fase on-chain, armazenar apenas hash — nunca texto puro.
- **Dependências mínimas.** Cada lib nova precisa de justificativa e versão exata (`.npmrc` já força `save-exact`). Não rodar `npm audit fix --force`.
- **Headers de segurança** definidos em `next.config.ts` — não remover.
