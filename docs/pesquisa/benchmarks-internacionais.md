# Benchmarks internacionais de histórico veicular e blockchain — relatório para o Lastro

Legenda: **[FATO]** = verificado em fonte citada. **[INFERÊNCIA]** = leitura minha a partir dos fatos.

---

## 1. Incumbentes: Carfax, AutoCheck, HPI, Cartell

### Carfax (EUA/Canadá)
- **[FATO]** Escala do dado é o produto: 139.000+ fontes de dados e 35+ bilhões de registros (30 bi já em dez/2022), tudo costurado por VIN. Fontes: DMVs, seguradoras, leilões, polícia, oficinas, concessionárias. ([Carfax About](https://www.carfax.com/company/about), [PR Newswire 30bi](https://www.prnewswire.com/news-releases/carfax-hits-30-billion-records-in-vehicle-history-database-301696301.html))
- **[FATO]** Carfax Service Network: oficinas se cadastram voluntariamente (carfaxservicereporting.com) e enviam eletronicamente data, km, serviço e peças por VIN — frequentemente via integração direta com o software de gestão da oficina (DMS/workshop software), não por digitação manual. Carfax tem ~35 anos de integrações com sistemas de gestão de concessionárias. ([Workshop Software + Carfax](https://workshopsoftware.com/Integrations/carfax/), [vehicledatabases.com](https://vehicledatabases.com/articles/how-does-carfax-get-its-information), [Carfax vs AutoCheck](https://blog.vinpassed.com/carfax-vs-autocheck/))
- **[FATO]** Incentivo da oficina: reportar ao Carfax é grátis e dá visibilidade/retenção (o histórico "carimba" a oficina no relatório). Reporte é voluntário — cobertura é incompleta por design. ([justanswer](https://www.justanswer.com/traffic-law/qlwhn-someone-please-walk-carfax-reporting.html))
- **[FATO]** Monetização: (1) assinatura B2B para dealers, leilões, seguradoras e bancos; (2) venda avulsa de relatórios a consumidores; (3) parcerias com marketplaces (Autotrader, Cars.com) que embutem o relatório no anúncio; (4) publicidade/produtos adjacentes (Carfax Used Car Listings). ([Oreate: modelo Carfax](https://www.oreateai.com/blog/carfax-company-overview-services-monetization-model-how-it-works/5c5c1afae4ce9c3048b592913a4996a8), [aboutcarsreviews](https://aboutcarsreviews.com/articles/how-does-carfax-generate-revenue-from-its-services-and-data), [Wikipedia](https://en.wikipedia.org/wiki/Carfax,_Inc.))
- **[INFERÊNCIA]** O que convence o comprador não é a tecnologia de armazenamento, é a densidade de eventos por VIN + a marca ("show me the Carfax"). O relatório vende porque o dealer o usa como argumento de venda — o dealer é o canal e o pagador principal.

### AutoCheck (Experian, EUA)
- **[FATO]** Diferencial: AutoCheck Score (1–100) — nota única que compara o veículo com similares de mesma classe/idade, criada como ferramenta de decisão rápida para dealers em leilão. É o provedor oficial dos grandes leilões (Manheim, ADESA). ([vinpassed: Carfax vs AutoCheck](https://blog.vinpassed.com/carfax-vs-autocheck/), [Capital One](https://www.capitalone.com/cars/learn/managing-your-money-wisely/carfax-vs-autocheck-vehicle-history-reports-compared/1621))
- **[INFERÊNCIA]** Lição: um score sintético reduz fricção cognitiva e vira feature de comparação — mas só funciona com base estatística grande por trás.

### HPI Check (Reino Unido, desde 1938)
- **[FATO]** 80+ pontos de dados; os que vendem o produto: financiamento pendente (afeta 1 em cada 4 usados no UK — o carro pode ser tomado do comprador), write-off de seguradora, roubo (Police National Computer), discrepância de km, trocas de placa. Preço: £19,99 por relatório, pacote de 3 por £29,99. Dados vêm de DVLA, polícia, seguradoras e financeiras. ([hpicheck.com](https://www.home.hpicheck.com/), [Motorway guide](https://motorway.co.uk/sell-my-car/guides/hpi-check-ultimate-guide), [Motorpoint](https://www.motorpoint.co.uk/guides/what-is-an-hpi-check))
- **[INFERÊNCIA]** O medo que move a compra do relatório no UK não é km, é risco jurídico/financeiro (perder o carro por dívida de terceiro). Feature de "alerta vermelho" > timeline bonita.

### Cartell.ie (Irlanda)
- **[FATO]** Criou o National Mileage Register — maior base de km da Irlanda, 23+ milhões de leituras, alimentada por registros de inspeção (NCT) e parceiros. Checa financiamento, write-off, roubo, donos anteriores. Limitação declarada: só cobre histórico irlandês pós-importação (carros ex-UK exigem HPI adicional). ([Wikipedia Cartell](https://en.wikipedia.org/wiki/Cartell), [CarAdvisor](https://caradvisor.ie/blog-cartell-check-ireland.html))
- **[INFERÊNCIA]** Caso mais análogo ao Lastro em estágio: player pequeno, país pequeno, que virou referência ao construir a base nacional de km antes de todo mundo. O ativo é o registro, não o relatório.

---

## 2. Blockchain: quem sobreviveu e quem morreu

### carVertical (Lituânia) — "blockchain" que virou empresa de dados
- **[FATO]** Nasceu como ICO (token CV, dez/2017–jan/2018) prometendo registro de veículos em blockchain. ([whitepaper.io](https://whitepaper.io/coin/carvertical))
- **[FATO]** Hoje é um negócio real e grande: €42,7 mi de receita em 2023 (+83%), ~€54 mi em 2024, FT 1000 (empresas que mais crescem na Europa) em 2023 e 2024, 25+ mercados. ([Wikipedia carVertical](https://en.wikipedia.org/wiki/CarVertical), [Dealroom](https://app.dealroom.co/companies/car_vertical))
- **[FATO]** Críticas recorrentes de usuários: relatórios incompletos, km oficial ausente, dados que existem grátis em bases públicas. ([EpicVIN comparativo](https://epicvin.com/blog/carvertical-vs-carfax-which-report-should-you-trust))
- **[INFERÊNCIA]** O crescimento da carVertical veio de agregação agressiva de dados multi-país + marketing de performance, não da blockchain. O token/blockchain virou vestígio de marketing; o produto que fatura é um relatório clássico estilo Carfax europeu. É a prova de que a proposta de valor é o DADO, e blockchain foi (na melhor hipótese) custo de aquisição narrativo em 2018.

### VINchain — o cemitério
- **[FATO]** ICO de 2018 com a mesma tese do Lastro ("histórico veicular descentralizado por VIN"); token hoje vale $0,00 e o projeto está inativo na prática. ([ICOholder](https://icoholder.com/en/vinchain-4494), [Bitcointalk airdrop encerrado](https://bitcointalk.org/index.php?topic=2431997))
- **[INFERÊNCIA]** Morreu pelo problema clássico: blockchain não resolve o cold start de dados. Sem oficinas/detentores de dados alimentando, imutabilidade é imutabilidade de banco vazio.

### MOBI (consórcio: BMW, Ford, GM, Honda, Renault…)
- **[FATO]** Consórcio sem fins lucrativos (2018) que publicou os padrões VID I ("certidão de nascimento" do veículo, 2019) e VID II (registro/ownership), com fases seguintes prevendo histórico de eventos do ciclo de vida. Segue vivo como órgão de padrões (Battery Birth Certificate, APIs de dados em 2025), mas sem produto de consumo. ([Ledger Insights VID](https://www.ledgerinsights.com/mobi-blockchain-vehicle-id-standard-renault-ford/), [Ledger Insights VID II](https://www.ledgerinsights.com/mobi-bmw-ford-blockchain-vehicle-identity-standard/), [dlt.mobi](https://dlt.mobi/mobi-announces-the-first-vehicle-identity-vid-standard-on-blockchain-in-collaboration-with-groupe-renault-ford-and-bmw-among-others/))
- **[INFERÊNCIA]** Sete anos depois, MOBI produziu PDFs de padrão, não rede em produção com consumidor na ponta. Consórcio de concorrentes anda na velocidade do membro mais lento.

### BMW VerifyCar (com VeChain)
- **[FATO]** Demo em 2019: passaporte digital do veículo contra fraude de odômetro (BMW citou que ~33% dos usados na Alemanha teriam odômetro adulterado). Testado só em veículos internos; BMW declarou na época que blockchain era "tema sensível" e que precisava revisar a estratégia antes de lançar. Nunca chegou aos modelos de produção; sem notícias desde então. ([Ledger Insights](https://www.ledgerinsights.com/bmw-blockchain-car-mileage-vechainthor-verifycar/), [CoinJournal](https://coinjournal.net/news/bmw-presents-blockchain-based-odometer-fraud-prevention-app-verifycar-developed-with-vechain/))
- **[INFERÊNCIA]** Morreu de conflito de incentivo: a montadora já tem o dado de km telemetrizado e não ganha nada tornando-o público num ledger — ganha mais vendendo-o (ou guardando-o) ela mesma.

### Renault "carnet d'entretien digital" (Microsoft + VISEO, 2017)
- **[FATO]** Protótipo de caderneta de manutenção em blockchain (Azure); dono autorizaria comprador a ver os dados. Ficou no protótipo — nenhum registro de rollout comercial. ([Renault Group press](https://media.renaultgroup.com/groupe-renault-teams-with-microsoft-and-viseo-to-create-the-first-ever-digital-car-maintenance-book-prototype/))

### Porsche + XAIN (2018)
- **[FATO]** Piloto de 3 meses num Panamera; casos de uso que vingaram no teste foram acesso/chave digital e permissões, não histórico veicular. XAIN depois pivotou; nada virou produto de histórico. ([Porsche Newsroom](https://newsroom.porsche.com/en/innovation/digital-deep-tech/porsche-blockchain-panamera-xain-technology-app-bitcoin-ethereum-data-smart-contracts-porsche-innovation-contest-14906.html), [Medium técnico](https://medium.com/next-level-german-engineering/the-porsche-xain-vehicle-blockchain-network-a-technical-overview-e1f48c40e73d))

### VW + IOTA "Digital CarPass" (2018)
- **[FATO]** Prometido para "início de 2019" para dar confiabilidade ao dado de km; não há evidência de lançamento. ([Coingape](https://coingape.com/volkswagen-blockchain-partnership-iota-digital-carpass/), [Cryptoslate](https://cryptoslate.com/iota-and-volkswagen-will-launch-blockchain-enabled-cars-in-2019/))

### Toyota Blockchain Lab
- **[FATO]** Lab desde 2019; em 2025 publicou white paper do "Mobility Orchestration Network" (veículo como NFT com ciclo de vida completo). Continua em fase de pesquisa/white paper, sem produto. ([Toyota global](https://global.toyota/en/newsroom/corporate/31827481.html), [Toyota Blockchain Lab](https://www.toyota-blockchain-lab.org/library/mon-orchestrating-trust-into-mobility-ecosystems))

**[INFERÊNCIA — padrão dos óbitos]** Todos os pilotos de montadora morreram (ou hibernam) pelas mesmas 3 causas: (1) quem tem o dado não tem incentivo para compartilhá-lo; (2) blockchain resolve adulteração *pós-registro*, mas o gargalo real é *garbage in* — ninguém garante que o km digitado na origem é verdadeiro; (3) o comprador final não paga por "blockchain", paga por resposta ("posso confiar neste carro?"). Quem prosperou (Carfax, carVertical) vendeu a resposta, não a infraestrutura.

---

## 3. Fraude de odômetro: números e o caso Car-Pass

### Estatísticas
- **[FATO]** EUA (NHTSA): 450.000+ veículos/ano vendidos com odômetro adulterado; prejuízo >US$ 1 bi/ano ao consumidor. ([NHTSA](https://www.nhtsa.gov/vehicle-safety/odometer-fraud), [estudo NHTSA](https://www.nhtsa.gov/sites/nhtsa.gov/files/doths809441.pdf))
- **[FATO]** UE: dano estimado entre €5,6 e €9,6 bi/ano (número citado pelo Conselho da UE em 2025); estimativas do Parlamento Europeu: 5–12% dos usados domésticos e 30–50% das vendas transfronteiriças com km manipulado. Fraude de odômetro era crime em apenas ~6 Estados-membros. ([newmobility.news](https://newmobility.news/en/2025/12/05/europe-agrees-to-adopt-belgian-car-pass-system-to-combat-odometer-fraud/), [Carlytics](https://www.carlytics.eu/odometer-fraud-check), [Wikipedia Odometer fraud](https://en.wikipedia.org/wiki/Odometer_fraud))

### Car-Pass (Bélgica) — o benchmark que importa
- **[FATO]** Como funciona: entidade sem fins lucrativos criada pelo setor automotivo sob lei federal anti-fraude (2004/2006). **Toda** visita a profissional aprovado — manutenção, reparo, inspeção técnica, troca de pneu — gera obrigatoriamente um registro de km em base central. Desde 2020, importadores/montadoras de carros conectados enviam leitura de odômetro 4x/ano. Na venda de um usado, o vendedor é **legalmente obrigado** a entregar o documento Car-Pass (histórico completo de km) ao comprador; sem ele a venda pode ser anulada. ([car-pass.be](https://www.car-pass.be/en/about-car-pass), [FPS Economy FAQ](https://economie.fgov.be/en/themes/consumer-protection/car-pass/car-pass-frequently-asked), [apresentação UNECE](https://wiki.unece.org/download/attachments/213876811/TF-R39MV-03-05%20%28B%29%20Car-Pass%20in%20Belgium.pdf?api=v2))
- **[FATO]** Resultado: de 60.000–100.000 carros "rejuvenescidos"/ano antes da lei para 1.716 casos novos em 2020 (0,2% dos usados registrados). ([ECC-Net](https://www.eccnet.eu/publication/mileage-verification-car-pass-ensuring-accuracy-vehicles-abroad))
- **[FATO]** Dez/2025: ministros de transporte da UE acordaram estender o modelo Car-Pass para toda a União (registro obrigatório de km em base central em inspeções e reparos; montadoras reportando km de carros conectados a cada 3 meses; criminalização da adulteração em todos os Estados-membros). Falta tramitar no Parlamento Europeu. ([newmobility.news](https://newmobility.news/en/2025/12/05/europe-agrees-to-adopt-belgian-car-pass-system-to-combat-odometer-fraud/))
- **[INFERÊNCIA]** O Car-Pass matou a fraude sem blockchain nenhum: banco de dados central + obrigatoriedade legal + captura do km em TODO ponto de contato (não só revisão) + documento obrigatório na venda. O "trust" vem da densidade e da compulsoriedade, não da criptografia.

---

## 4. Lições para o Lastro

### Copiar
1. **Densidade de pontos de captura (Car-Pass).** Registrar km em qualquer contato (pneu, freio, inspeção, vistoria cautelar), não só "revisão". Cada leitura extra torna rollback detectável — a feature de anomalia do Lastro fica exponencialmente melhor com mais leituras por carro. **[INFERÊNCIA]**
2. **Incentivo à oficina no modelo Carfax Service Network:** reporte grátis, integração com o software que a oficina já usa (no Brasil: sistemas de gestão de oficina/ERPs do setor), e devolver valor à oficina (visibilidade no relatório, retenção do cliente via lembrete de revisão). Digitação manual num portal não escala. **[FATO sobre Carfax / INFERÊNCIA sobre Brasil]**
3. **Alertas vermelhos jurídico-financeiros (HPI):** no Brasil, os equivalentes são leilão/sinistro, restrição financeira, roubo/furto, batida de km com laudos de vistoria. É isso que faz o comprador pagar, mais que a timeline. **[INFERÊNCIA]**
4. **Score sintético (AutoCheck)** como evolução futura do selo "verificado": uma nota comparativa comunica mais que uma lista de eventos — mas só depois de ter base estatística. **[INFERÊNCIA]**
5. **Monetização em camadas (Carfax):** B2B primeiro (lojistas, financeiras, seguradoras, marketplaces embutindo o relatório), B2C avulso depois. O comprador de usado compra 1 relatório na vida; o lojista compra todo dia. **[FATO sobre o modelo / INFERÊNCIA sobre priorização]**
6. **Começar como "registro nacional de km" (Cartell):** o ativo defensável é a base de leituras, não o front-end do relatório. **[INFERÊNCIA]**

### Evitar
1. **Vender blockchain como produto.** Todos que lideraram com "blockchain" (VINchain, VerifyCar, VW CarPass, Renault) morreram ou hibernam; carVertical só cresceu quando virou empresa de dados comum. Blockchain pode ficar como garantia de integridade nos bastidores (ex.: ancoragem de hashes), nunca como headline. **[INFERÊNCIA forte, baseada nos fatos da seção 2]**
2. **Ignorar o problema garbage-in.** Imutabilidade não valida a origem: se a oficina digita km errado (ou de má-fé), o Lastro imortaliza mentira. Mitigações: múltiplas fontes cruzadas por veículo, foto do painel/OBD como evidência, reputação da oficina reportante. **[INFERÊNCIA]**
3. **Esperar consórcio/padrão (armadilha MOBI).** Sete anos de VID e nenhum produto. Ande sozinho com dados que você mesmo consegue capturar. **[FATO + INFERÊNCIA]**
4. **Depender de montadora como parceira inicial.** Elas têm o dado e incentivo zero para abri-lo (caso BMW). A porta de entrada é a oficina independente e o lojista, que ganham com transparência. **[INFERÊNCIA]**
5. **Prometer cobertura que não existe.** Críticas à carVertical (relatório vazio/incompleto pago) mostram que relatório vazio cobrado destrói confiança — os estados vazios da PoC do Lastro devem dizer explicitamente o que NÃO está coberto, como a Cartell faz ("só histórico irlandês pós-importação"). **[FATO sobre críticas / INFERÊNCIA sobre UX]**

### Vento de cauda regulatório
**[INFERÊNCIA]** A UE acabou de validar o modelo "base central obrigatória de km" como política pública. No Brasil não existe equivalente (leituras de km existem dispersas em vistorias e não são públicas/consolidadas). Isso corta para os dois lados: é a oportunidade do Lastro construir o "Car-Pass privado brasileiro" — e é o risco de, um dia, DENATRAN/SENATRAN fazer uma versão estatal. Posicionar o Lastro para ser a infraestrutura que uma futura regulação adotaria (padrão de registro, rede de oficinas já integrada) é a jogada defensiva.

---

Fontes principais: [Carfax About](https://www.carfax.com/company/about) · [PR Newswire Carfax 30bi](https://www.prnewswire.com/news-releases/carfax-hits-30-billion-records-in-vehicle-history-database-301696301.html) · [Workshop Software/Carfax](https://workshopsoftware.com/Integrations/carfax/) · [HPI Check](https://www.home.hpicheck.com/) · [Motorway HPI guide](https://motorway.co.uk/sell-my-car/guides/hpi-check-ultimate-guide) · [Wikipedia Cartell](https://en.wikipedia.org/wiki/Cartell) · [Wikipedia carVertical](https://en.wikipedia.org/wiki/CarVertical) · [Ledger Insights MOBI VID](https://www.ledgerinsights.com/mobi-blockchain-vehicle-id-standard-renault-ford/) · [Ledger Insights VerifyCar](https://www.ledgerinsights.com/bmw-blockchain-car-mileage-vechainthor-verifycar/) · [Renault press](https://media.renaultgroup.com/groupe-renault-teams-with-microsoft-and-viseo-to-create-the-first-ever-digital-car-maintenance-book-prototype/) · [Porsche Newsroom](https://newsroom.porsche.com/en/innovation/digital-deep-tech/porsche-blockchain-panamera-xain-technology-app-bitcoin-ethereum-data-smart-contracts-porsche-innovation-contest-14906.html) · [Coingape VW/IOTA](https://coingape.com/volkswagen-blockchain-partnership-iota-digital-carpass/) · [Toyota Blockchain Lab](https://global.toyota/en/newsroom/corporate/31827481.html) · [NHTSA odometer fraud](https://www.nhtsa.gov/vehicle-safety/odometer-fraud) · [Car-Pass.be](https://www.car-pass.be/en/about-car-pass) · [FPS Economy Car-Pass FAQ](https://economie.fgov.be/en/themes/consumer-protection/car-pass/car-pass-frequently-asked) · [ECC-Net Car-Pass](https://www.eccnet.eu/publication/mileage-verification-car-pass-ensuring-accuracy-vehicles-abroad) · [newmobility.news UE adota modelo Car-Pass](https://newmobility.news/en/2025/12/05/europe-agrees-to-adopt-belgian-car-pass-system-to-combat-odometer-fraud/) · [Capital One Carfax vs AutoCheck](https://www.capitalone.com/cars/learn/managing-your-money-wisely/carfax-vs-autocheck-vehicle-history-reports-compared/1621) · [vinpassed Carfax vs AutoCheck](https://blog.vinpassed.com/carfax-vs-autocheck/) · [ICOholder VINchain](https://icoholder.com/en/vinchain-4494) · [Dealroom carVertical](https://app.dealroom.co/companies/car_vertical)