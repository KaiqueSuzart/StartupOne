# Lastro — Análise de mercado e produto

> Síntese executiva produzida em 2026-07-24 a partir de pesquisa de mercado (Brasil e
> internacional), levantamento de fontes de dados/regulação e três análises de
> perspectiva (oficina, cliente, montadora). Relatórios completos em
> [docs/pesquisa/](pesquisa/). Fatos externos foram coletados por pesquisa na web nessa
> data — confira as fontes nos anexos antes de usar em material oficial.

## 1. Diagnóstico da PoC atual

A PoC tem acabamento raro para o estágio: cenário de fraude concreto (XYZ9A87 caindo de 88.500 para 52.000 km), estados de loading/vazio/erro, suporte a placa antiga/Mercosul/VIN, deep-link e um ponto único de troca do repositório que responde bem ao "cadê a blockchain?". O problema central é que a peça-chave da marca se sabota na tela: o registro fraudulento exibe "Km inconsistente" ao lado de "Registro verificado", sem hash, sem atestador, sem página "como funciona" — o cético pergunta "verificado por quem?" e a demo não responde. A fraude está enterrada em texto (sem gráfico), todos os registros têm o mesmo peso visual (oficina de bairro = concessionária) e o modelo de dados não representa quem escreveu o registro nem quando foi gravado. Em resumo: ótima casca de produto, mas a tese de imutabilidade ainda é adjetivo, não mecanismo visível.

## 2. Melhorias imediatas na PoC (sem blockchain, sem backend)

| # | Item | Impacto | Esforço | Justificativa |
|---|------|---------|---------|---------------|
| 1 | Corrigir semântica do selo (copy) | Alto | ~Zero | Separar "registro preservado" de "conteúdo consistente" — hoje o selo gera desconfiança na tela mais importante. |
| 2 | Gráfico km × tempo (SVG inline) | Alto | Baixo | A queda de 36.500 km vira uma linha que despenca — é O slide do pitch. |
| 3 | Badge de procedência por registro (`attestor`) | Alto | Baixo | Reconhece a objeção nº 1 ("quem escreveu isso?") e corrige a maior lacuna do modelo de dados. |
| 4 | Km atual + média km/ano no summary (vs. ~13 mil km/ano nacional) | Alto | Baixo | Primeira pergunta do comprador respondida em 2 segundos. |
| 5 | Hash simulado encadeado, rotulado "simulação" | Alto | Baixo | Transforma "imutável" em mecanismo visível; sem rótulo vira acusação de blockchain falsa. |
| 6 | Callout "a fraude não pôde ser apagada; está aqui" | Alto | ~Zero | O rollback preservado é a prova viva da tese — hoje a frase-chave nunca é dita. |
| 7 | Botão copiar link + CSS `@media print` | Médio | Baixo | Resolve "compartilhar/exportar" sem gerar PDF real (esforço sem retorno). |
| 8 | Chip `AAA0A00` na home | Médio | Trivial | O estado vazio existe e ninguém o vê na demo. |
| 9 | Recall pendente no fixture + banner | Alto | Médio | Segunda história de valor além do odômetro; dado público que bloqueia licenciamento após 1 ano. |
| 10 | `recordedAt` separado de `date` + anomalias "data futura" e "gap > 24 meses" | Alto | Médio | Base técnica da narrativa append-only: backdating fica visível; gap de histórico importa ao comprador. |

Rejeitados por ora: score 0–100 (precisão falsa com só 2 sinais), QR code (sem deploy público), PDF real, cadastro de oficinas.

## 3. O que o mercado ensina

- **O relatório é commodity no Brasil**: Olho no Carro (R$ 59,90), Checktudo (a partir de R$ 15), InfoMotors (R$ 37,90), OLX (R$ 22,90 pago pelo *vendedor*) — todos bebem das mesmas ~5 fontes (BIN/SENATRAN, DETRANs, SNG/B3, leilão, seguradoras). Diferenciação real é distribuição e marca, não dado.
- **A lacuna real é manutenção** — e ela já foi atacada sem sucesso: VEHISTORY e QueridoCarro fazem exatamente a tese do Lastro (sem blockchain) e não decolaram. O gargalo comprovado é cold start de oficinas, não tecnologia de registro.
- **Carfax Service Network é o modelo de captura que funciona**: oficina reporta grátis via integração com o software de gestão (não digitação), o incentivo é o "carimbo" no relatório, e quem paga é o dealer/consultante. 139 mil fontes, 35 bi de registros — densidade + marca vendem, não tecnologia.
- **carVertical prova que a proposta de valor é o dado**: nasceu como ICO blockchain em 2018, hoje fatura ~€54 mi (2024) vendendo relatório clássico; o token virou vestígio de marketing.
- **Todos os pilotos blockchain de montadora morreram**: VINchain (token a zero), BMW VerifyCar, Renault/Microsoft, Porsche/XAIN, VW/IOTA — causa comum: quem tem o dado não ganha nada em abri-lo, e blockchain não resolve cold start ("imutabilidade de banco vazio"). MOBI produziu PDFs de padrão em 7 anos, nenhum produto. (Obs.: o Car-Pass belga não constava do material recebido; o análogo pesquisado é o Cartell.ie irlandês, que virou referência construindo o registro nacional de km — 23+ mi de leituras — antes de todos.)
- **Lição HPI (UK)**: o que vende relatório é medo jurídico/financeiro (perder o carro por dívida de terceiro — 1 em 4 usados no UK tem financiamento pendente), não timeline bonita. Alerta vermelho > design.
- **RENAVE é o presente estratégico**: Res. CONTRAN 1.026/2026 torna o RENAVE obrigatório em todo o Brasil (~out/2026), com km + data exigidos na entrada de estoque (R$ 4,43/operação). Nasce um registro nacional compulsório de km a cada passagem por revenda — a âncora de cold start que faltou a todos os antecessores.
- **Vácuo legal favorável**: não há lei específica de fraude de odômetro (a Lei 14.562/23 deliberadamente não incluiu odômetro no art. 311 CP); a prova é difícil (art. 171 CP, CDC art. 66). Registro imutável torna a fraude documentalmente detectável — esse é o argumento de mercado.

## 4. Visão da oficina / do cliente / da montadora

**Oficina independente (200 carros/mês)**
- *Ganho central*: defesa jurídica contra "vocês estragaram meu carro" (registro com timestamp de terceiro) + retenção ("seu carro documentado vale mais") — os únicos ganhos que não dependem de efeito de rede.
- *Objeção central*: rastro fiscal. Registro imutável cruzável com NFS-e pela Sefaz mata a adesão de boa parte das independentes; e retrabalho de digitação mata o resto em duas semanas.
- *Top 3 features*: (1) integração nativa com o sistema de OS (fechou a OS, subiu sozinho — mercado pulverizado: Oficina Integrada, Ultracar, GestãoClick); (2) registro em 30s com foto do odômetro (OCR + evidência — protege a oficina e o sistema); (3) só dados não-fiscais (placa, km, categoria de serviço; sem valor, sem peças) e custo zero para sempre.

**Cliente (comprador de usado R$ 45–80 mil / dono)**
- *Ganho central*: comprador — resposta em 5 segundos ao risco real (leilão, sinistro, gravame vêm *antes* de km na ordem de medo); dono — dossiê que rebate a oferta baixa e venda mais rápida.
- *Objeção central*: "por que pagar se o Olho no Carro já mostra tudo?" — sem dados de bureau embutidos, o Lastro é complemento, não substituto. E relatório vazio pago é cliente perdido falando mal (99% das placas vazias nos primeiros anos).
- *Top 3 features*: (1) semáforo de risco no topo (vermelho/amarelo/verde, via API de bureau tipo Infocar/Checktudo); (2) funil grátis → pago (R$ 20–40 avulso; nunca cobrar consulta vazia); (3) selo com proveniência por evento + distinção explícita "verificado" vs. "período sem registro", e detalhe só com autorização do dono (link temporário — modelo Renault).

**Montadora**
- *Ganho central*: retenção de pós-venda ("revisão na rede autorizada vale mais na revenda" — monetiza a rede no valor residual) + prova barata contra fraude de km em claims de garantia.
- *Objeção central*: dado é ativo estratégico — a lição BMW VerifyCar: quem já tem o km telemetrizado ganha mais guardando-o. Não aceita startup em PoC como single point of failure de processo core.
- *Top 3 features*: (1) modelo multi-atestador com assinatura criptográfica por fonte e hierarquia de confiança exibida (telemetria > SISCSV > RENAVE > rede autorizada > oficina > dono); (2) atestados derivados ("km ≥ 45.000 em 12/05, assinado") sem entregar dado bruto; (3) white-label para seminovos certificados + LGPD by design (dado pessoal fora do registro imutável) — é o produto que ela compra primeiro.

## 5. Tensões e riscos estratégicos

- **Oficina teme o fisco × comprador quer tudo registrado**: o comprador quer valor, peças e detalhes; a oficina só entra se nada for cruzável com faturamento. Decisão de produto inevitável: registrar apenas placa+km+categoria — aceitar relatório menos rico para ter rede.
- **Montadora quer perímetro fechado × Lastro precisa de rede aberta**: a montadora entra via white-label e atestados derivados; o valor para o comprador exige base neutra e aberta. Servir a primeira sem virar fornecedor cativo dela é o equilíbrio mais difícil.
- **Dono quer curadoria e privacidade × comprador quer completude imutável**: o dono só quer registrar o que valoriza e tem direito LGPD de eliminação; o comprador só confia se nada puder ser omitido. A resposta técnica (hash on-chain, conteúdo apagável off-chain, retificação append-only) precisa ser decidida já — define a credibilidade dos dois lados.
- **Imutabilidade × erro honesto**: km digitado errado num ledger imutável cria anomalia permanente no carro do cliente. Sem contra-evento de correção assinado, a oficina abandona e o dono processa.
- **Selo × cobertura incompleta por design**: reporte voluntário = buracos; selo verde em histórico vazio é fraude a favor do vendedor. "Verificado" ≠ "carro bom" e imutável ≠ verdadeiro ("garbage in, immutable garbage") precisam estar na UI.
- **Cold start é o risco existencial**: VINchain morreu, VEHISTORY/QueridoCarro estagnaram exatamente aqui. A mitigação única do Lastro é não depender de adesão voluntária no início: ancorar em km compulsório (RENAVE obrigatório ~out/2026 + vistorias SISCSV) e adensar com oficinas depois. Blockchain não muda esse gargalo — nunca mudou.

## 6. Roadmap sugerido

**Fase PoC+ (2–4 semanas)** — itens 1–8 da tabela da seção 2: selo corrigido, gráfico km×tempo, badge de atestador, km/ano, hash simulado rotulado, callout da tese, print/link, chip de demo; se sobrar, recall e `recordedAt`.

- Corrigir modelo de dados junto: `workshopId`/CNPJ, union de tipos de evento, `attestor`, histórico vazio representável (`min(1)` cai).
- Uma página "como verificamos" explicando registro preservado ≠ conteúdo verdadeiro.

**Fase Piloto** — pilotar com **revendas de seminovos + 2–3 oficinas em uma única cidade**, pegando carona na obrigatoriedade do RENAVE:

- Integração com 1–2 sistemas de OS (GestãoClick ou Oficina Integrada — a OS já tem placa+km+serviço) como única via de captura; zero digitação.
- Revenda como pagadora/canal (modelo OLX/Carfax: vendedor paga ~R$ 20–30, comprador vê grátis) — é quem tem incentivo econômico imediato e agora obrigação RENAVE.
- Captura com foto do odômetro (OCR + EXIF) e regra "data do evento = data do registro" desde o dia 1.
- Métrica de sucesso: consultas por carro anunciado e diferença de tempo/preço de venda com vs. sem histórico — o número BR que ninguém tem.

**Fase Produto**

- Semáforo de risco completo via API de bureau (Infocar/Checktudo) — sem leilão/sinistro/gravame não há produto B2C competitivo.
- Âncora oficial: integração RENAVE (via integradora) e SISCSV como espinha dorsal do km.
- Camada de atestação multi-fonte com hierarquia de confiança — o ativo que nenhum player BR tem.
- White-label de seminovos para 1 montadora + API de risco para banco/seguradora do grupo (receita recorrente).
- Blockchain só quando (e se) a rede existir — como mecanismo de auditoria, nunca como headline; "registro que ninguém consegue apagar, nem a loja" vende, "blockchain" não.
---

## Anexos — pesquisa completa

- [Mercado brasileiro](pesquisa/mercado-brasil.md) — concorrentes, preços, fontes de dados, lacunas
- [Benchmarks internacionais](pesquisa/benchmarks-internacionais.md) — Carfax, HPI, carVertical, pilotos blockchain
- [Dados e regulação no Brasil](pesquisa/dados-e-regulacao-br.md) — RENAVE, SISCSV, LGPD, software de oficina
- [Revisão da PoC](pesquisa/revisao-poc.md) — crítica de produto/UX do código atual
- [Visão da oficina](pesquisa/visao-oficina.md)
- [Visão do cliente](pesquisa/visao-cliente.md)
- [Visão da montadora](pesquisa/visao-montadora.md)
