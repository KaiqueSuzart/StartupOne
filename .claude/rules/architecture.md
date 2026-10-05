# Arquitetura em camadas (inegociável)

As dependências apontam para dentro. A UI depende do domínio; o domínio não depende de nada.

```
UI (app/, components/)  →  Domínio (domain/)  ←  Dados (lib/repository/)
```

- **`domain/`** é puro: sem React, sem Zod, sem I/O, sem acesso a dados. Só tipos e funções puras (detecção de anomalia, normalização/validação de placa e VIN). Toda regra de negócio nova nasce aqui, com teste.
- **A UI nunca acessa JSON ou fonte de dados diretamente.** Ela usa as interfaces de `lib/repository/`: `VehicleRepository` para leitura e, na escrita, `EventWriter`, `FiscalDocValidator`, `OdometerReader`, `RiskBureau`, `RenaveImporter` e `PhotoStorage`.
- **`lib/repository/index.ts` é o ÚNICO ponto de composição.** É lá — e somente lá — que se decide qual implementação de cada interface está ativa. Nenhum arquivo em `app/`, `components/` ou `domain/` pode importar uma implementação concreta (ex.: `FixtureVehicleRepository`, `SupabaseVehicleRepository`).
- **Não introduzir blockchain nesta fase.** Nada de viem, wagmi, ethers, smart contracts, carteiras ou testnets. O futuro `OnChainVehicleRepository` está apenas documentado em `ARCHITECTURE.md` — não implementá-lo.
- **Banco (Supabase) é detalhe de implementação atrás da interface.** O domínio não sabe que ele existe; a aplicação usa apenas a chave publicável, contida por RLS; nenhuma chave que ignore RLS roda na aplicação. A escrita existe (organizações autenticadas, com MFA) e é append-only; o desenho completo está em `docs/superpowers/specs/2026-10-05-plataforma-piloto-design.md`.
- Toda implementação de repositório valida a resposta com os schemas de `lib/schema.ts` antes de devolver ao domínio, seja JSON, banco ou chain.
