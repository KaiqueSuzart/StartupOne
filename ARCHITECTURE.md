# Arquitetura

Camadas com dependências apontando **para dentro**: a UI depende do domínio; o domínio
não depende de nada.

```
  UI (app/, components/)
        ↓ depende de
  Domínio (domain/) — tipos + regras puras (anomalia, placa/VIN)
        ↑ implementado por
  Dados (lib/repository/)
        ├── FixtureVehicleRepository → lê data/vehicles/*.json   (AGORA)
        └── OnChainVehicleRepository → lê da blockchain via viem (FUTURO — não implementado)
```

## Fluxo de uma consulta

```
URL ?placa=xyz
  → app/consulta/page.tsx (Server Component)
    → lib/report.ts · lookupVehicleReport()          [composição]
        → domain/plate.ts · classifyIdentifier()     [puro]
        → lib/repository/index.ts · vehicleRepository [A COSTURA]
            → FixtureVehicleRepository → JSON → Zod (lib/schema.ts)
        → domain/anomaly.ts · detectOdometerAnomalies() [puro]
    → components/* renderizam apenas dados validados e tipados
```

## A costura: como a blockchain entra depois

A UI conversa somente com a interface `VehicleRepository`
([lib/repository/VehicleRepository.ts](lib/repository/VehicleRepository.ts)):

```ts
export interface VehicleRepository {
  getByPlate(plate: string): Promise<VehicleHistory | null>;
  getByVin(vin: string): Promise<VehicleHistory | null>;
}
```

A escolha da implementação acontece em **um único ponto**:
[lib/repository/index.ts](lib/repository/index.ts). Na fase 2, o
`OnChainVehicleRepository` implementará a mesma interface (lendo a chain via viem e
validando as respostas com os **mesmos** schemas Zod de `lib/schema.ts`) e será trocado
ali. **Nenhum arquivo de `app/`, `components/` ou `domain/` muda.**

Regras para qualquer implementação: devolver só dados validados por Zod, registros
ordenados por data ascendente, e receber identificadores já normalizados.

## Domínio puro

`domain/` não importa React, Zod nem fonte de dados — só tipos e funções puras, todas
testadas em `tests/`:

- `anomaly.ts` — detecção de anomalia de km em pares consecutivos:
  `odometer_rollback` (km diminuiu) e `implausible_mileage_jump` (média diária
  > 500 km/dia, constante `MAX_PLAUSIBLE_KM_PER_DAY`).
- `plate.ts` — normalização e validação de placa (antiga e Mercosul) e VIN
  (17 caracteres, sem I/O/Q).

## Decisões registradas para o futuro (fora do escopo da PoC)

- **VIN é identificador sensível**: on-chain será publicado apenas como hash, nunca em
  texto puro. A UI já o exibe mascarado.
- Dígito verificador do VIN (ISO 3779) não é validado na PoC — só o formato.
- Detecção de desordem de datas entre registros: regra futura de anomalia.
- A latência simulada de 400 ms no `FixtureVehicleRepository` será substituída pela
  latência real da chain.
