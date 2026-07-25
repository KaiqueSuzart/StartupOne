# Revisão de produto e UX — Lastro PoC

Li: README, ARCHITECTURE, SECURITY, `domain/*` (types, anomaly, plate), `lib/*` (report, schema, format, repository), `app/*` (layout, home, consulta, loading), os 11 componentes, os 3 fixtures e os 2 arquivos de teste.

## 1. O que convence e o que não convence

**Convence:**
- O cenário de fraude é concreto e bem construído: `XYZ9A87` cai de 88.500 km para 52.000 km, e o fixture ainda conta história ("troca de óleo antes de anúncio de venda"). O `AnomalyAlert` explica o par inconsistente em linguagem de comprador, com recomendação de ação.
- Acabamento de produto raro em PoC: loading skeleton real (latência simulada de 400 ms), estado vazio, estado de query inválida, deep-link `?placa=`, placa antiga + Mercosul + VIN, formatação pt-BR, VIN mascarado (bom sinal para a pergunta LGPD).
- A "costura" do repositório (`lib/repository/index.ts`) é uma resposta de engenharia crível para "cadê a blockchain?": um único ponto de troca, mesma validação Zod.

**Não convence um cético:**
- **O selo se contradiz na tela.** Em `TimelineItem.tsx`, o registro fraudulento exibe "Km inconsistente" e "Registro verificado" lado a lado; em `VehicleSummaryCard.tsx`, "Histórico íntegro e auditável" aparece colado em "1 inconsistência detectada". O cético pergunta "verificado por quem?" e a demo não tem resposta — o selo não é clicável, não há hash, não há página "como funciona".
- **A fraude é texto, não imagem.** A queda de 36.500 km está enterrada numa frase. O momento "aha" do pitch é fraco.
- **Todos os registros parecem iguais.** `workshop` é string livre; um registro de concessionária e um de oficina de bairro têm o mesmo peso visual. A objeção nº 1 ao produto inteiro ("garbage in: a oficina pode mentir na entrada") não é nem reconhecida pela UI.
- O resumo não mostra os números que um comprador quer primeiro: última quilometragem e média km/ano.
- O chip de demo do estado vazio (`AAA0A00`, citado no README) não existe na home.

## 2. Lista priorizada (impacto × esforço)

**P0 — alto impacto, baixo esforço:**
1. **Corrigir a semântica do selo (copy, ~zero esforço).** Separar dois conceitos: "registro preservado/não alterado" (vale para todos, inclusive o fraudulento) vs "conteúdo consistente" (falha no fraudulento). Hoje a peça central da marca gera desconfiança na tela mais importante da demo.
2. **Gráfico km × tempo (SVG inline, sem lib).** A queda 88.500 → 52.000 vira uma linha que despenca — é O slide do pitch. Server component, dados já ordenados pelo repositório. Aceito.
3. **Badge de procedência por registro** (concessionária / oficina) com campo `attestor` no fixture + schema + domínio. Aceito — e corrige de quebra a maior lacuna do modelo de dados (ver §4).
4. **Km atual + média km/ano no summary card**, comparada a uma constante de média nacional (~13 mil km/ano, com fonte citada na UI). Aceito — resposta direta à primeira pergunta do comprador.
5. **Hash simulado encadeado por registro** (SHA-256 do registro + hash do anterior), exibido curto com rótulo explícito "simulação — como será ancorado on-chain". Aceito — é o que transforma "imutável" de adjetivo em mecanismo visível; didático e honesto se rotulado. Cuidado: sem rótulo vira acusação de blockchain falsa.
6. **Compartilhar: botão "copiar link" + CSS `@media print`.** O deep-link já existe; imprimir bem resolve "exportar PDF". Aceito nesses termos; **rejeito** geração real de PDF (esforço sem retorno na PoC).
7. **Chip `AAA0A00` nos atalhos de demo.** Trivial; o estado vazio já está pronto e ninguém o vê.

**P1 — alto impacto, esforço médio:**
8. **Recall pendente no fixture + banner.** Aceito — segunda história de valor além do odômetro, mostra que o produto não é "one-trick". Exige novo tipo de evento no modelo.
9. **Anomalias baratas novas:** data no futuro (trivial) e "gap de histórico > 24 meses" (trivial e relevante para comprador). **Rejeito por ora** "oficina inexistente" — exige cadastro de oficinas; com `workshopId` (§4) vira trivial depois.
10. **`recordedAt` separado de `date` no modelo** + anomalia "registro retroativo". É a base técnica da narrativa append-only: "backdating fica visível". Já listado como regra futura no ARCHITECTURE; antecipar.

**P2 — rejeitar ou adiar:**
11. **Score de confiança 0-100: rejeito nesta fase.** Com apenas 2 sinais de anomalia, o número é precisão falsa e convida exatamente o ataque que se quer evitar ("como calculou?"). Manter veredito qualitativo em 3 níveis com critérios visíveis; revisitar quando houver mais sinais.
12. **QR code: adiar.** Só faz sentido com deploy público; impacto baixo sobre o cético em demo local.
13. **Acessibilidade/mobile: não é gargalo.** A base já é boa (`sr-only`, `role="alert"`, `aria-busy`, `flex-wrap`, anomalia sinalizada por texto e não só cor). Fazer só uma passada de contraste (`text-slate-400`) e foco visível em links.

## 3. O que a UI ainda não comunica sobre "imutabilidade"

- **Quem** escreveu cada registro (atestador) e **quando** foi gravado vs quando o serviço ocorreu — sem isso, "imutável" não tem sujeito nem tempo.
- **Nenhuma materialização do mecanismo**: sem hash, sem encadeamento, sem placeholder de âncora; o selo é decoração estática, sem tooltip nem página "como verificamos".
- **A frase-chave da tese nunca é dita.** O rollback preservado no histórico é a prova viva de que o sistema funciona — "a fraude não pôde ser apagada; está aqui". O `AnomalyAlert` trata a anomalia só como aviso ao comprador, e perde o argumento de produto. Uma linha de callout resolve.
- Imutabilidade ≠ veracidade: a UI precisa dizer que garante que o registro *não mudou*, não que ele *é verdade* — hoje o selo mistura os dois e fragiliza a promessa.

## 4. Fraquezas do modelo de dados (`domain/types.ts`, `lib/schema.ts`)

- **`workshop` é string livre**: sem ID/CNPJ não há reputação, badge de procedência confiável, nem detecção de oficina inexistente; dois nomes iguais são a mesma oficina?
- **Sem atestador/procedência do registro** — o problema do oráculo (quem assina) nem está representado; on-chain isso é o campo mais importante.
- **Sem `recordedAt`** — sem timestamp de gravação não existe narrativa append-only nem detecção de backdating.
- **Sem evento de transferência de propriedade** (nem contagem de donos) — item nº 1 de qualquer laudo veicular real.
- **`ServiceRecord` é o único tipo de evento**: recall, sinistro, leilão e transferência não cabem; falta um union discriminado de eventos.
- **`vehicleHistorySchema` exige `min(1)` registro**: "veículo existe mas sem histórico" é irrepresentável — o `EmptyState` confunde "não encontrado na base" com "sem registros", estados com significados muito diferentes para o comprador.
- Sem referência a evidência por registro (NF, foto) e sem versão de schema nos fixtures — ambos vão doer na migração on-chain.

Arquivos centrais citados: `c:\Users\kaiqs\OneDrive\Desktop\startupone\components\TimelineItem.tsx`, `components\VehicleSummaryCard.tsx`, `components\AnomalyAlert.tsx`, `domain\types.ts`, `domain\anomaly.ts`, `lib\schema.ts`, `data\vehicles\rollback.json`.