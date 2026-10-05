# Lastro: critérios de sucesso e o que muda no plano

> Síntese produzida em 2026-10-05 a partir de três pesquisas feitas na mesma data:
> [critérios de sucesso internacional](pesquisa/criterios-de-sucesso-internacional.md),
> [atualização do mercado brasileiro](pesquisa/mercado-brasil-atualizacao-2026-10.md) e
> [limites de plataforma, segurança e LGPD](pesquisa/plataforma-limites-e-seguranca.md).
> Complementa a [análise de julho](ANALISE-MERCADO.md). Fatos externos têm fonte nos anexos;
> conferir antes de usar em material oficial. Legenda dos anexos: [FATO], [INFERÊNCIA], [NÃO VERIFICADO].

## 1. Os oito critérios que separaram quem deu certo de quem morreu

Só dois registros de km alimentados por oficina existem no mundo (Bélgica, 2006; Holanda, 2014)
e os dois são lei. Entre os privados, prosperaram Carfax (US$ 1,75 bi em 2025), carVertical
(€ 75,8 mi, margem bruta 77%) e Autofact (Chile, comprada pela CAR Group). Morreram VINchain,
VerifyCar, Wejo e Otonomo. O padrão é consistente:

| # | Critério | Evidência | Lastro hoje | Lastro no piloto |
|---|----------|-----------|-------------|------------------|
| 1 | **Zero fricção para quem alimenta** | Bélgica e Holanda: o software da oficina envia sozinho. Carfax Service Network: 24 mil oficinas (2012) para 90 mil (2025), grátis | Formulário de 8 campos no desktop | App de 30 s no celular (foto do painel, placa, categoria) e importação do XML da nota. API para parceiros desde o início; integração com Bling na escala |
| 2 | **Grátis e com retorno visível para a oficina** | Carfax: "no cost to us, the price sure is right"; o nome da oficina aparece no relatório que o comprador vê | Grátis; nome aparece na linha do tempo | Painel da oficina: carros atendidos, consultas recebidas, certificado de evidência por registro (defesa jurídica) |
| 3 | **Quem paga é quem vende** | Carfax: 82% da receita em assinatura de 40 mil revendas; relatório grátis no anúncio dá +27% de leads e +50% de conversão; OLX cobra R$ 22,90 do vendedor; mobile.de embutiu Carfax em set/2026 | Ninguém paga | Revenda paga por carro anunciado; comprador vê grátis no anúncio |
| 4 | **Densidade: várias leituras por carro por ano** | Bélgica: ~3 leituras por carro por ano, fraude de 10% para 0,11%. Uma leitura por inspeção (França, Itália, Chile) não contém fraude. Holanda: cobertura parcial deslocou a fraude para os importados (20%) | 4 veículos fictícios | Uma cidade, 2 ou 3 oficinas e 1 ou 2 revendas; meta de 2 ou mais leituras na maioria dos carros anunciados |
| 5 | **Km sozinho vira commodity; o ativo é o resto** | Onde o Estado publica km (UK, Holanda, França), a Carlytics vende relatório a € 8,90. O que ninguém tem: serviço feito, peças, nota fiscal, foto do odômetro, oficina identificada | Já é o modelo | Manter e aprofundar: itens trocados, NF-e e NFS-e, foto conferida por OCR, correção sem apagar |
| 6 | **Vender resposta de risco, não linha do tempo bonita** | HPI (UK): o que vende é "posso perder o carro?" (financiamento, roubo, sinistro). Na pesquisa do time, o maior medo é problema mecânico oculto | Só km, manutenção e recall | Semáforo com leilão, sinistro, roubo e gravame via API de bureau (R$ 15 sem leilão, R$ 30 a 35 com), atrás de uma costura |
| 7 | **Âncora compulsória ou oficial** | Bélgica funcionou no ano 1 porque os dois lados foram obrigados. A UE adotou o modelo em dez/2025. No Brasil, o RENAVE entrou em vigor em 28/09/2026 com hodômetro obrigatório | Nenhuma fonte oficial | Km do RENAVE entra pela revenda do piloto (a SENATRAN não abre a terceiros). Longo prazo: ser a infraestrutura que uma regulação adotaria |
| 8 | **Confiança explicável** | Comprador sofisticado sabe que imutável não é verdadeiro. Carfax e Car-Pass mostram quem registrou e quando. Oficina abandona se erro honesto vira fraude permanente | Proveniência por evento, cadeia de hash, cobertura honesta | Hierarquia de confiança ponderada (RENAVE > vistoria > concessionária > oficina > dono), retificação encadeada, "sem nota" com selo rebaixado |

## 2. O que a pesquisa de outubro muda no plano

1. **RENAVE está em vigor e tem km datado, mas é fechado.** Prazo venceu em 28/09/2026 sem
   prorrogação; a partir de novembro bancos bloqueiam financiamento de carro fora do RENAVE. A
   entrada em estoque exige `hodometro` e `dataHoraMedicaoHodometro`. Nenhuma API pública: só a
   loja e a integradora dela veem. **Ação imediata:** perguntar à revenda do piloto qual
   integradora escolheu (janela oficial de 09 a 20/10) e se exporta os eventos de entrada e saída.
2. **Nenhum sistema de oficina tem API pública** (Ultracar, Oficina Integrada, WorkMotor). Só
   ERPs genéricos (Bling, GestãoClick, Tiny), sem campo de placa ou km. No piloto a captura é
   nossa; integração fica para a escala, começando pelo Bling (único com OS e webhooks).
3. **NFS-e nacional obrigatória para o Simples em 01/11/2026**, chave de 50 dígitos com consulta
   pública gratuita. O validador precisa aceitar NF-e (44) e NFS-e (50), confirmar existência
   online (ConsultarNFe a R$ 0,89 ou e-CNPJ A1 a ~R$ 220/ano) e aceitar registro sem nota com
   confiança rebaixada, porque oficina informal é parte do público.
4. **O semáforo custa dinheiro por placa.** Consultar Placa e Infosimples têm preço público sem
   contrato: ~R$ 15 sem leilão, R$ 30 a 35 com leilão. Consulta B2C abaixo disso perde dinheiro;
   o modelo que fecha é a revenda pagando por anúncio.
5. **"O carro manda o km sozinho" chega por OEM e por lei, não por startup.** Wejo faliu, Otonomo
   foi absorvida (US$ 15 mi de receita contra US$ 250 mi de despesa), a FTC proibiu a GM de
   vender dados. O Data Act europeu aponta o caminho realista: consentimento do dono para puxar o
   dado do carro. Guardar a ideia do sensor como atestador futuro, sem depender de montadora.
6. **Plataforma:** Vercel Pro e Supabase Pro desde o primeiro dia público (Hobby é proibido para
   uso comercial; Free pausa em 1 semana e não tem backup). Cerca de US$ 45 a 50 por mês no
   piloto, US$ 300 a 350 em 100 mil consultas por mês. Cinco lacunas de segurança a fechar antes
   de dado real: upload da foto (limite de 1 MB na Server Action), chaves legadas do Supabase
   (saem até o fim de 2026), MFA para oficina, trilha de auditoria e réplica das fotos (Storage
   não entra no backup).
7. **LGPD:** o Lastro é agente de pequeno porte (Res. ANPD 2/2022): registro simplificado de 8
   campos, sem encarregado obrigatório, mas canal para o titular obrigatório; incidente comunicado
   em 6 dias úteis. Placa com histórico é dado pessoal: nunca exibir o dono, dado pessoal fora do
   livro append-only.
8. **Startup One (FIAP):** pitch de 5 minutos e 10 de feedback; critérios públicos da Rock New
   Ventures pesam mercado, execução do time, domínio técnico, viabilidade e apresentação. Tração
   real (oficinas e revendas nomeadas, dados de uso) vale mais que arquitetura.

## 3. Métricas-norte do piloto

Definidas antes de começar, para a decisão de seguir ou parar ser por número:

| Métrica | Por que | Meta sugerida em 90 dias |
|---------|---------|--------------------------|
| Leituras de km por veículo por ano na frota-alvo | É o que torna o rollback detectável (Bélgica: ~3) | Média acima de 2 nos carros anunciados pelas revendas do piloto |
| % da frota-alvo com 2 ou mais leituras | Uma leitura não prova nada | Acima de 60% dos carros anunciados |
| Registros por semana por oficina | Retenção da oficina (VEHISTORY morreu aqui) | Não cair por 8 semanas seguidas |
| Tempo por registro no app | Acima de 60 s a oficina abandona | Mediana abaixo de 60 s |
| % de eventos por importação ou API, não por digitação | Caminho da escala | Acima de 30% ao fim do piloto |
| Consultas por carro anunciado | Prova que o comprador abre | Acima de 3 por anúncio |
| Revenda pagando | Única receita testável | Pelo menos 1 revenda pagando preço cheio |
| Tempo e preço de venda com e sem histórico | O número brasileiro que ninguém tem | Diferença mensurável, mesmo em amostra pequena |

## 4. Hipóteses de modelo de negócio para testar no piloto

- **Oficina:** grátis, sempre. Recebe visibilidade, painel de retorno e certificado de evidência.
- **Revenda:** paga por carro anunciado (hipótese: R$ 39 a 59 com semáforo completo) ou plano
  mensal com lote de carros. Comprador vê o relatório grátis pelo link ou QR do anúncio.
- **Consulta avulsa B2C:** só cobrada quando há histórico; placa sem registro mostra veredito,
  cobertura e oferta de monitoramento, de graça. Preço acima do custo de bureau (R$ 39,90).
- **Montadora, banco e seguradora:** fora do piloto. Entram depois via atestados derivados e
  white-label, nunca como parceiros iniciais.

## 5. Riscos novos

- **Integradoras RENAVE** (BNDV, Renave Fácil, Autoconf) passam a deter km datado de todo o
  estoque das revendas e podem lançar "histórico de km". O que defende o Lastro é o km entre
  transações (oficinas), não o km na loja.
- **Cobertura parcial desloca fraude** em vez de eliminar: selo verde em histórico ralo é fraude a
  favor do vendedor. A cobertura honesta já existe no relatório; manter como regra inegociável.
- **Oficina sem nota** fora do sistema ou, pior, dentro com dado fraco. Resposta: aceitar com
  confiança rebaixada e visível.
- **Erro honesto imutável.** Sem retificação encadeada a oficina abandona e o dono processa.

## 6. Decisões tomadas e em aberto

**Tomadas:** reconstrução em duas versões (apresentação em 3 a 6 semanas, depois piloto);
identidade visual primeiro; piloto em uma cidade com revenda como pagadora; blockchain fora até
a rede existir.

**Em aberto:** cidade do piloto; qual revenda e qual integradora RENAVE ela usa; preço por anúncio;
relatório completo público (padrão do mercado, legítimo interesse) ou detalhe só com autorização
do vendedor.

## Anexos

- [Critérios de sucesso internacional](pesquisa/criterios-de-sucesso-internacional.md): Car-Pass,
  NAP/RDW, UE 2025, Carfax/Mobility Global, carVertical, brokers de dado conectado
- [Mercado brasileiro, atualização out/2026](pesquisa/mercado-brasil-atualizacao-2026-10.md):
  RENAVE, software de oficina, bureaus, NF-e e NFS-e, regulação, Startup One
- [Plataforma, limites, segurança e LGPD](pesquisa/plataforma-limites-e-seguranca.md): Supabase,
  Vercel, rate limit, OCR, ASVS, API de parceiros, ANPD, custos
