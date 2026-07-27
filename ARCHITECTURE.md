# Arquitetura

Camadas com dependências apontando **para dentro**: a UI depende do domínio; o domínio
não depende de nada.

```
  UI (app/, components/)
        ↓ depende de
  Domínio (domain/) — tipos + regras puras (anomalia, placa/VIN)
        ↑ implementado por
  Dados (lib/repository/)
        ├── FixtureVehicleRepository  → lê data/vehicles/*.json          (padrão, sem config)
        ├── SupabaseVehicleRepository → lê Postgres/Supabase via anon+RLS (com .env.local)
        └── OnChainVehicleRepository  → lê da blockchain via viem        (FUTURO — não implementado)
```

**A troca de fixtures para banco já aconteceu, e nenhum componente de tela mudou** —
a prova prática de que a costura funciona.

## Fluxo de uma consulta

```
URL ?placa=xyz
  → app/consulta/page.tsx (Server Component)
    → lib/report.ts · lookupVehicleReport()          [composição]
        → domain/plate.ts · classifyIdentifier()     [puro]
        → lib/repository/index.ts · vehicleRepository [A COSTURA]
            → Fixture ou Supabase → Zod (lib/schema.ts) [MESMA validação]
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
[lib/repository/index.ts](lib/repository/index.ts) — hoje ele escolhe Supabase quando há
credenciais no ambiente e fixtures caso contrário. Na fase on-chain, o
`OnChainVehicleRepository` implementará a mesma interface (lendo a chain via viem e
validando as respostas com os **mesmos** schemas Zod de `lib/schema.ts`) e entrará ali.
**Nenhum arquivo de `app/`, `components/` ou `domain/` muda.**

### O banco não é a arquitetura

O Postgres é um detalhe de implementação atrás da interface: o domínio não sabe que ele
existe, e `supabase/seed.sql` é gerado a partir dos mesmos fixtures — as duas fontes
produzem exatamente o mesmo `VehicleHistory`. O esquema já reflete a tese do produto: o
RLS libera apenas `SELECT`, sem policy de `UPDATE`/`DELETE`, tornando o histórico
append-only para qualquer cliente.

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
- `mileage.ts` — km atual e média anual comparada à referência nacional.
- `integrity.ts` — integridade da linha do tempo: registro retroativo
  (`recordedAt` muito posterior a `date`), serviço declarado para depois do
  próprio registro, e lacunas acima de 24 meses.
- `ledger.ts` — encadeamento de hashes (cada registro depende do anterior).
  **Simulação didática com FNV-1a**, rotulada como tal na UI; a fase on-chain
  usará hash criptográfico e ancoragem real.

## Duas datas por registro, e por que importam

`date` é quando o serviço foi **declarado** como realizado; `recordedAt` é
quando o registro **entrou** no histórico. Num histórico append-only ninguém
altera o carimbo de entrada — só pode declarar uma data de serviço anterior.
Por isso a cadeia de hashes segue a ordem de `recordedAt` (ordem de entrada),
enquanto a linha do tempo exibe a ordem de `date`: um registro retroativo
aparece no meio da timeline mas no fim da cadeia, e isso fica visível.

## Confiança da fonte

Cada `ServiceRecord` carrega um `attestor` (concessionária, rede autorizada,
oficina independente, vistoria, proprietário). A UI exibe a procedência porque a
confiança do relatório depende de quem atestou, não só do conteúdo — é a base do
modelo multi-atestador (com assinatura por fonte) previsto para a fase 2.

## Decisões registradas para o futuro (fora do escopo da PoC)

- Prioridades ainda abertas da análise de mercado (ver
  [docs/ANALISE-MERCADO.md](docs/ANALISE-MERCADO.md)): `workshopId`/CNPJ,
  tipos de evento como union (transferência de dono, vistoria), histórico vazio
  representável e semáforo de risco com dados de bureau (leilão, sinistro,
  gravame).

- **VIN é identificador sensível**: on-chain será publicado apenas como hash, nunca em
  texto puro. A UI já o exibe mascarado.
- Dígito verificador do VIN (ISO 3779) não é validado na PoC — só o formato.
- Detecção de desordem de datas entre registros: regra futura de anomalia.
- A latência simulada de 400 ms no `FixtureVehicleRepository` será substituída pela
  latência real da chain.
