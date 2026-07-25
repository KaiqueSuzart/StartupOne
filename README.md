# Lastro — PoC de Histórico Veicular

Prova de conceito do **Lastro**: consulta do histórico completo de um veículo por
**placa** ou **chassi (VIN)**, com linha do tempo de revisões e **detecção automática de
inconsistência de quilometragem**.

> **Aviso:** todos os dados são **simulados** (fixtures JSON com veículos fictícios) e
> **não há blockchain nesta fase**. A PoC valida a experiência de consulta; a arquitetura
> já reserva o ponto onde a blockchain pluga depois — ver [ARCHITECTURE.md](ARCHITECTURE.md).

## Rodar

```bash
npm install
npm run dev       # http://localhost:3000
```

Outros comandos: `npm run test` (Vitest), `npm run build`, `npm run lint`,
`npx tsc --noEmit`.

## Demonstração

| Consulta | Cenário |
| --- | --- |
| `BRA0S17` | Histórico limpo (3 registros) |
| `ABC1234` | Histórico rico (8 registros, formato antigo de placa) |
| `XYZ9A87` | **Fraude de odômetro**: 88.500 km → 52.000 km |
| `AAA0A00` | Placa válida sem histórico (estado vazio) |

O relatório mostra km atual e média anual, gráfico de quilometragem, procedência
de cada registro e o encadeamento de hashes (simulado — ver
[/como-verificamos](http://localhost:3000/como-verificamos)).

Também funciona por VIN (ex.: `9BWZZZ377VT004251`) e por deep-link:
`http://localhost:3000/?placa=XYZ9A87`.

## Documentação

- [ARCHITECTURE.md](ARCHITECTURE.md) — camadas e a costura para a blockchain
- [CONVENTIONS.md](CONVENTIONS.md) — padrões de código
- [SECURITY.md](SECURITY.md) — práticas de segurança
- [docs/ANALISE-MERCADO.md](docs/ANALISE-MERCADO.md) — mercado, concorrentes,
  visões de oficina/cliente/montadora e roadmap
