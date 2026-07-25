# Análise do Lastro — perspectiva de executivo de pós-venda/inovação de montadora (Brasil)

## 1. Onde o Lastro me interessa de verdade

**Retenção de pós-venda é o interesse número 1, e é defensivo.** Perco o cliente para a oficina independente entre o 3º e o 5º ano (fim da garantia). Hoje meu argumento de retenção é "revisão na rede preserva a garantia". Um histórico público e verificável cria um argumento novo e mensurável: **"revisão na rede autorizada vale mais na revenda"**. Se o relatório consultado pelo comprador de usado carimba visivelmente "revisões feitas na rede VW/Toyota", isso monetiza a rede autorizada no valor residual — exatamente o efeito que o Carfax gera para oficinas nos EUA (o reporte é gratuito porque a visibilidade no relatório é o incentivo) [FATO do benchmark Carfax Service Network]. É o único mecanismo que transforma revisão cara na concessionária em ativo financeiro para o dono.

**Residual value dos seminovos certificados.** Meu programa de seminovos (tipo "VW Sign&Drive usados", "Toyota Certified") vive de prêmio de preço sobre o usado comum. Hoje esse prêmio é sustentado por inspeção própria + garantia — modelo Kavak, que verticaliza a confiança e ainda assim falha (reclamações de inspeção no Reclame Aqui) [FATO]. Um histórico externo, imutável e auditável reduz meu custo de certificação e aumenta o prêmio defensável.

**Fraude de garantia por km adulterado.** Cliente que atrasa revisão ou estoura km recua o odômetro para caber na garantia. Não há lei específica de fraude de odômetro no Brasil (a Lei 14.562/23 deliberadamente não incluiu o odômetro no art. 311 CP) [FATO], então minha defesa é contratual e probatória — cara. Um registro de km ancorado em múltiplas fontes (minhas revisões + vistorias SISCSV + RENAVE, agora obrigatório pela Res. CONTRAN 1.026/2026) [FATO] me dá prova documental barata para negar garantia fraudada. Interesse direto e quantificável em R$.

**Dados de uso de frota:** interesse menor. Já tenho telemetria dos conectados; o que eu não tenho é o comportamento do carro **depois** que sai da minha rede — quais serviços a oficina independente fez, quais peças. Isso vale para engenharia de qualidade e para precificar garantia estendida. É nice-to-have, não driver de decisão.

## 2. Por que eu NÃO entrego meus dados — e sob que condições entro

Razões para não entrar (e são fortes):

- **Dado é ativo estratégico.** Meu histórico de revisões da rede é insumo do meu próprio programa de seminovos e da minha financeira/seguradora cativa. Entregá-lo a uma startup neutraliza minha vantagem contra a Localiza/Movida/Kavak e contra montadoras rivais. A BMW cancelou o VerifyCar exatamente por isso: a montadora que já tem o km telemetrizado não ganha nada colocando-o num ledger público — ganha mais guardando ou vendendo ela mesma [FATO + INFERÊNCIA do benchmark].
- **Risco de dependência de fornecedor.** Se o Lastro vira o registro de referência, quem controla a régua de confiança do meu seminovo é um terceiro em PoC. Montadora não aceita single point of failure de startup em processo core.
- **Prefiro consórcio a fornecedor** — mas com ceticismo informado: o MOBI (BMW, Ford, GM, Renault, Honda) existe desde 2018 e em sete anos produziu padrões em PDF, nenhum produto com consumidor na ponta [FATO]. Consórcio de concorrentes anda na velocidade do membro mais lento. Ou seja: eu digo que prefiro consórcio, mas consórcio não entrega.
- **Blockchain não me convence e me assusta juridicamente.** Imutabilidade conflita com LGPD (placa é dado pessoal identificável [FATO]; direito de eliminação vs. registro imutável é problema real). E os precedentes do meu setor são Renault/Microsoft (protótipo morto), Porsche/XAIN (pivotou), VINchain (token a zero) [FATOS]. carVertical só cresceu quando virou empresa de dados comum [FATO].

Condições em que eu participo, em ordem de plausibilidade:

1. **White-label para meu programa de seminovos** — o Lastro como infraestrutura, minha marca na frente, meus dados só no meu perímetro. É a porta de entrada realista: eu pago, eu controlo, sem risco competitivo.
2. **Padrão aberto de evento de manutenção + governança neutra** (formato tipo MOBI VID, mas com produto): eu entro se o esquema de dados for aberto, se eu puder sair levando meus registros, e se a régua de confiança não for arbitrada unilateralmente pela startup.
3. **Reciprocidade assimétrica:** eu só publico dados da minha rede se ganhar em troca visibilidade do que oficinas independentes fizeram nos meus carros (qualidade, peças não originais, garantia). Dado por dado.
4. **Nunca:** dar telemetria bruta ou dados de cliente. No máximo publico **atestados derivados** ("km ≥ X na data Y, assinado pela montadora"), sem expor o dado-fonte.

## 3. O que eu posso aportar (do mais barato ao mais sensível)

1. **Certidão de nascimento do veículo**: VIN, configuração de fábrica, opcionais, data de produção — custo zero, sem LGPD, e é o único dado que ninguém mais tem na origem. Equivalente ao MOBI VID I [FATO].
2. **Recalls**: já são públicos e anotados no RENAVAM/CRLV-e, com bloqueio de licenciamento após 1 ano [FATO] — aportar aqui é só integração, mas dá densidade à timeline.
3. **Revisões da rede autorizada**: alto valor, médio risco. Meus DMS de concessionária já registram VIN + km + serviço; integração é tecnicamente simples (o Carfax faz isso há 35 anos via DMS [FATO]). Entra só via white-label ou reciprocidade.
4. **Atestado de km telemetrizado dos conectados**: o dado mais valioso e mais sensível. Só como atestado derivado, assinado, sob consentimento do dono (LGPD), e provavelmente cobrado — é o meu "oráculo" contra rollback, ninguém mais tem km contínuo.

## 4. Modelo de negócio comigo

| Quem paga | O quê | Racional |
|---|---|---|
| Montadora (eu) | White-label do registro para seminovos certificados — assinatura B2B + fee por veículo certificado | Substitui/reduz custo de certificação própria; comparável ao laudo cautelar de R$ 200–500 [FATO], então há teto de preço claro por carro |
| Minha rede de concessionárias | Fee por relatório embutido no anúncio do seminovo | Modelo OLX invertido: vendedor paga R$ 22,90 e o selo vende o carro [FATO]; dealer é o canal e o pagador principal, como no Carfax [FATO] |
| Banco/seguradora do grupo (VW Financial, Banco Toyota) | Consulta de risco por API (km atestado, histórico de manutenção) para precificar financiamento/seguro/garantia estendida de usados | Análogo ao HPI: o dado que vende é risco financeiro, não timeline bonita [INFERÊNCIA do benchmark] |
| Eu, de novo | Auditoria antifraude de garantia (verificação de km em claims) | ROI direto em claims negados |

O que eu **não** pago: acesso a relatório B2C, "estar na blockchain", dado que já tenho.

## 5. Features e decisões de arquitetura para um dia fechar comigo

A PoC atual (busca por placa, timeline, detecção de rollback, selo) demonstra o relatório — mas relatório é a parte comoditizada (Olho no Carro, Checktudo, Infocar já vendem por R$ 15–60 [FATO]). O que me faria conversar é a **camada de atestação multi-fonte**, que ninguém no Brasil tem.

### Priorizadas (P0 = pré-requisito para qualquer conversa comigo)

**P0.1 — Modelo multi-atestador com identidade criptográfica por fonte.** Cada evento assinado pela entidade que o atesta (montadora, concessionária, oficina, vistoriadora SISCSV, integradora RENAVE). Sem isso, "registro verificado" é selo vazio: verificado por quem?

**P0.2 — Hierarquia de confiança explícita e exibida no relatório.** Peso distinto por classe de fonte: telemetria da montadora > vistoria oficial (SISCSV) > RENAVE (R$ 4,43/operação, obrigatório a partir de ~out/2026 [FATO]) > rede autorizada > oficina independente credenciada > autodeclaração do dono. O detector de rollback deve ponderar por confiança da fonte, não tratar todo km como igual.

**P0.3 — Atestados derivados em vez de dados brutos.** Arquitetura que aceita "afirmo que km ≥ 45.000 em 12/05/2026, assinatura: Montadora X" sem exigir o dado-fonte. É a única forma de eu participar sem entregar telemetria.

**P0.4 — Conformidade LGPD por construção.** Dados pessoais fora do registro imutável; on-chain (se houver chain) só hashes/compromissos, conteúdo apagável off-chain. Consentimento do dono como objeto de primeira classe. Sem isso meu jurídico veta na primeira reunião.

**P1.1 — Namespace/tenant white-label.** Meu programa de seminovos com minha marca, meus atestadores, minhas regras de exibição, sobre a mesma infraestrutura. É o produto que eu compro primeiro.

**P1.2 — Ingestão via DMS/ERP, nunca digitação.** Conector para os sistemas que a rede e as oficinas já usam (DMS da concessionária; no independente, Oficina Integrada, Ultracar, GestãoClick — OS já carrega placa+km+serviço [FATO]). Lição Carfax: o reporte tem de ser efeito colateral do fluxo existente [FATO].

**P1.3 — Trilha de auditoria completa + correção sem apagamento.** Evento errado não se deleta: emite-se contra-evento assinado ("revisão lançada com km digitado errado, corrigida por X"). Para claims de garantia eu preciso reconstituir quem afirmou o quê, quando — imutabilidade útil é isso, não "está na blockchain".

**P1.4 — Âncora RENAVE/SISCSV.** Integrar (via integradora credenciada) os pontos compulsórios de km que o Estado já coleta. Resolve meu ceticismo de cold start: a espinha dorsal do km vem do registro obrigatório, e o Lastro adensa com revisões [INFERÊNCIA da pesquisa regulatória].

**P2.1 — API de risco para bancos/seguradoras** (km atestado, gaps de manutenção, flags) — é onde meu grupo financeiro paga recorrente.

**P2.2 — Score sintético de confiança do histórico** (estilo AutoCheck Score [FATO]) — só depois de densidade de dados; score sem base estatística é ruído.

**P2.3 — Verificação de recall na timeline** — dado público, fricção baixa, valor imediato [FATO].

### O que despriorizar na minha visão

- **Blockchain como argumento de venda para mim.** Todos os pilotos do meu setor morreram (VerifyCar, Renault/VISEO, Porsche/XAIN) e o sobrevivente (carVertical) venceu como agregador de dados, não como chain [FATOS]. O que eu compro é assinatura por fonte + auditoria + governança de saída — se isso rodar em Postgres com log assinado, para mim tanto faz. Blockchain só volta à mesa se um dia virar consórcio multi-montadora com governança neutra — e o precedente MOBI mostra que esse dia demora.
- **Features B2C de relatório bonito.** Não é isso que me faz assinar contrato; é a infraestrutura de atestação e o white-label.

### Resumo em uma frase

Como montadora, eu não entro no Lastro como "fornecedor de dados de uma plataforma neutra" — entro como **cliente de white-label para seminovos certificados e antifraude de garantia**, e só se a arquitetura tiver multi-atestador, atestados derivados, hierarquia de confiança e LGPD by design; a startup deve construir a espinha dorsal com RENAVE/SISCSV (que é compulsório e não depende de mim) e me deixar plugar por cima, porque eu nunca serei o primeiro a doar meu ativo estratégico para um banco de dados de terceiro.