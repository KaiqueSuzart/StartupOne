# Arquitetura em camadas (inegociável)

As dependências apontam para dentro. A UI depende do domínio; o domínio não depende de nada.

```
UI (app/, components/)  →  Domínio (domain/)  ←  Dados (lib/repository/)
```

- **`domain/`** é puro: sem React, sem Zod, sem I/O, sem acesso a dados. Só tipos e funções puras (detecção de anomalia, normalização/validação de placa e VIN). Toda regra de negócio nova nasce aqui, com teste.
- **A UI nunca acessa JSON ou fonte de dados diretamente.** Ela usa a interface `VehicleRepository` (`lib/repository/VehicleRepository.ts`).
- **`lib/repository/index.ts` é o ÚNICO ponto de composição.** É lá — e somente lá — que se decide qual implementação do repositório está ativa. Nenhum arquivo em `app/`, `components/` ou `domain/` pode importar uma implementação concreta (ex.: `FixtureVehicleRepository`).
- **Não introduzir blockchain nesta fase.** Nada de viem, wagmi, ethers, smart contracts, carteiras ou testnets. O futuro `OnChainVehicleRepository` está apenas documentado em `ARCHITECTURE.md` — não implementá-lo.
- Sem backend, banco de dados, autenticação ou telas de escrita. A PoC é somente leitura/consulta.
