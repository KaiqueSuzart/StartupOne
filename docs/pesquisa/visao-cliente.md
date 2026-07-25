# Análise do Cliente — Lastro (comprador de usado + dono do carro)

## 1. Comprador (usado de R$ 45–80 mil, de particular ou lojista)

### O que me faz pagar — e quanto

- Ancoragem de preço já existe no mercado: consulta completa B2C a ~R$ 59,90 (Olho no Carro), entrada a R$ 15–20 (Checktudo, AnyCar), InfoMotors a R$ 37,90, OLX a R$ 22,90 **pago pelo vendedor** e grátis pra mim. Laudo cautelar físico: R$ 200–500. Para um carro de R$ 45–80 mil, R$ 40–60 é irrelevante frente ao risco — o gargalo não é preço, é **crença de que o relatório contém algo que não acho de graça**. A crítica recorrente à carVertical é exatamente essa: cobrar por dado que existe grátis em base pública.
- Modelo que funciona comigo: **grátis com upsell** (padrão Gringo/Zul+) para triagem + avulso pago no carro finalista. Assinatura não faz sentido — compro carro a cada 4–6 anos.
- Disposição real: R$ 20–40 avulso se o relatório for completo. R$ 59,90 só com marca estabelecida. Se o Lastro entregar **só km + revisões**, não pago nada: km sozinho não fecha minha decisão.

### O que o relatório PRECISA responder (em ordem de medo)

Lição do HPI (UK): o que vende o relatório é **risco jurídico/financeiro de perder o carro ou o dinheiro**, não timeline bonita. Minha ordem:

1. **Leilão / sinistro / perda total** — o maior "deal breaker" e o dado que seguradoras usam pra recusar.
2. **Roubo/furto e restrição judicial** — posso perder o carro.
3. **Gravame/alienação fiduciária (SNG)** — dívida de terceiro vira meu problema.
4. **Débitos** (IPVA, multas, licenciamento) — entram direto na negociação do preço.
5. **Recall pendente** — bloqueia licenciamento após 1 ano (Lei 14.071/2020); dado público, tem que estar lá.
6. **Km/rollback + histórico de revisões** — é o diferencial do Lastro, mas é o item 6, não o 1. Precisa vir **em cima** dos itens 1–5 (via API de bureau tipo Infocar/Checktudo), senão o relatório é incompleto e eu compro no concorrente.
7. Número de donos anteriores / uso como táxi/app (proxy de desgaste).

### Quando na jornada eu consulto

- **Triagem (antes de visitar)**: consulta grátis/barata em 3–8 candidatos para descartar leilão/débito. Se for anúncio OLX, espero de graça no anúncio.
- **Decisão (1–2 finalistas)**: relatório completo pago.
- **Fechamento**: laudo cautelar físico de R$ 300 se sobrou dúvida estrutural. O Lastro não substitui a cautelar; substitui a **incerteza documental** antes dela.
- Implicação de produto: o Lastro precisa de um degrau grátis (existe carro? tem alerta vermelho?) e um degrau pago. Sem degrau grátis, não entro no funil.

### O que me faz confiar / desconfiar do selo "verificado"

**Confio se:**
- Cada evento mostra **proveniência**: quem registrou (oficina com CNPJ/nome, RENAVE, vistoria SISCSV), quando, e com que km. "Verificado" tem que significar "origem identificada e não alterada", explicado em uma linha.
- O selo **distingue "verificado" de "sem registro"**. Timeline com 2 revisões em 8 anos não é carro limpo, é carro sem dado. Se o selo verde aparece num histórico vazio, o selo vira fraude a meu favor do vendedor.
- A checagem de rollback cruza com âncoras externas (vistoria de transferência, RENAVE — que já exige hodômetro na entrada de estoque).

**Desconfio se:**
- "Verificado por blockchain" sem dizer quem inseriu o dado. Eu entendo intuitivamente que imutável ≠ verdadeiro: se a oficina digitou 40.000 km num carro de 80.000, a blockchain eterniza a mentira.
- Qualquer vendedor consegue o selo em 5 minutos (aí é ruído, não sinal — cf. reclamações da inspeção "240 pontos" da Kavak no Reclame Aqui).
- O que constrói selo é densidade + marca ("show me the Carfax"), não tecnologia. Nos primeiros anos, o selo do Lastro não vale nada pra mim sozinho; vale se ancorado em fontes que já respeito (RENAVE, vistoria, oficina que conheço).

## 2. Dono do carro

### Por que eu registraria minhas revisões

- **Valorização na revenda**: a pesquisa **não permite quantificar um percentual no Brasil** — não há estudo BR citado. O que dá pra ancorar honestamente: (a) o comprador paga R$ 200–500 de cautelar + até R$ 60 de consulta para reduzir incerteza — histórico documentado captura parte desse valor pra mim; (b) num carro de R$ 45–80 mil, o desconto de negociação por desconfiança ("vai ver não fez as revisões") é tipicamente de milhares de reais, e o dossiê é meu argumento contra a oferta baixa [INFERÊNCIA]; (c) internacionalmente, o relatório é a ferramenta de venda do dealer (Carfax) — quem paga/usa é quem vende. Recomendo ao Lastro validar e comunicar um número BR próprio (ex.: comparar tempo de venda/preço de anúncios com e sem histórico).
- **Venda mais rápida e sem atrito**: em vez de pilha de notinhas, um link.
- **Utilidade no dia a dia** (senão eu abandono no mês 2): lembrete de revisão por km/tempo, alerta de recall, carteira digital do carro. Sem uso recorrente, ninguém mantém caderneta — é o cold start que matou VEHISTORY/QueridoCarro na tração e VINchain por completo.
- **Condição inegociável**: quem registra é a **oficina, automaticamente** (integração com o sistema de OS, que já tem placa+km+serviço — padrão Carfax Service Network via DMS). Se eu tiver que digitar nota fiscal no app, não registro.

### O que me preocupa

- **Privacidade/LGPD**: placa é dado pessoal indireto (doutrina citada na pesquisa). Histórico detalhado aberto por placa expõe: em que bairro/cidade eu faço manutenção (onde moro/circulo), quanto rodo, quando viajo. Qualquer um com minha placa me rastreia. O mercado atual opera entregando dado do **veículo** sem dado do dono — o Lastro tem que ir além: **detalhe só com minha autorização** (link temporário/QR que eu gero na hora de vender — o modelo do protótipo Renault: dono autoriza o comprador). Público, no máximo, o agregado: "N registros, km consistente, sem alerta".
- **Imutabilidade contra mim**: (a) se a oficina errar o km, preciso de retificação (correção append-only, com trilha); (b) registro imutável de dado pessoal colide com direito de eliminação da LGPD — quero saber o que acontece se eu pedir pra sair; (c) assimetria: eu só quero registrar o que me valoriza — se toda ida à oficina (incluindo a batida) entra pra sempre, meu incentivo de adotar cai. O Lastro precisa decidir e comunicar isso com clareza, porque é o mesmo trade-off que define a credibilidade pro comprador.

## 3. Objeções e mal-entendidos prováveis

1. **"Blockchain" é majoritariamente indiferente; pra uma parcela, assusta** (associação com cripto/golpe pós-2021–22). Ninguém paga por blockchain: carVertical fatura €54 mi vendendo relatório clássico — o token virou vestígio; VINchain, com a tese idêntica ao Lastro, morreu a zero. Vender "registro que ninguém consegue apagar, nem a loja" funciona; vender "blockchain" não. Palavra pra letra miúda, não pra headline.
2. **"Verificado" ≠ "carro bom"**: comprador vai ler selo como aprovação do carro. Reporte voluntário de oficinas = cobertura incompleta por design (é assim no próprio Carfax). Risco reputacional: primeiro carro "verificado" que der problema queima a marca.
3. **"Imutável" ≠ "verdadeiro"**: garbage in, garbage forever. A objeção vai vir dos compradores mais sofisticados — exatamente os primeiros clientes.
4. **Relatório vazio**: nos primeiros anos, 99% das placas retornam quase nada. Comprador paga uma vez, recebe vazio, não volta e fala mal. Nunca cobrar por consulta vazia.
5. **"Por que pagar se o Olho no Carro já mostra tudo?"**: sem os dados de bureau (leilão/sinistro/débito) embutidos, o Lastro é complemento, não substituto — e complemento não sustenta R$ 59,90.

## 4. Features priorizadas (visão do cliente)

**P0 — sem isso não há produto pro cliente**
1. **Semáforo de risco no topo do relatório** (vermelho: leilão, sinistro, roubo, gravame, rollback; amarelo: débito, recall; verde: sem alertas) — resposta em 5 segundos, lição HPI/AutoCheck. Exige integrar API de bureau (Infocar/Checktudo) para leilão/sinistro/débito além do km próprio.
2. **Funil grátis → pago**: consulta gratuita de triagem (existe? alerta vermelho? quantos registros?) + relatório completo avulso R$ 20–40. Nunca cobrar por relatório vazio (mostrar de graça "sem registros ainda" + oferecer monitorar a placa).
3. **Selo com proveniência e honestidade de cobertura**: cada evento com origem (oficina/CNPJ, RENAVE, vistoria), e distinção explícita "verificado" vs "período sem registro". É o que separa o selo de um adesivo.
4. **Certificado de manutenção compartilhável pro anúncio** (link/QR, pago pelo vendedor ~R$ 20–30, grátis pro comprador — modelo OLX R$ 22,90). É o dono/vendedor quem tem incentivo de pagar; o comprador é o beneficiário.
5. **Transferência do histórico na venda**: o histórico segue o carro; novo dono assume a "carteira" com um clique. Fecha o ciclo dono→comprador→novo dono.

**P1 — retenção do dono e confiança**
6. **Alerta de recall pendente** por placa (dado público, alto valor, bloqueia licenciamento — custo baixo, impacto alto na timeline).
7. **Controle de privacidade do dono**: detalhe do histórico só via autorização/link temporário; público apenas o resumo agregado. Resolve LGPD e é argumento de venda pro dono.
8. **Lembrete de revisão/km + carteira digital do carro** — o motivo de abrir o app fora do momento de compra/venda; sem isso o dono some.
9. **Registro automático via integração com sistemas de oficina** (Oficina Integrada, Ultracar, GestãoClick; NFS-e como captura alternativa) — a OS já tem placa+km+serviço; dono não digita nada. Priorizar 2–3 integrações, não 10.

**P2 — quando houver base**
10. **Âncora RENAVE**: com a Resolução CONTRAN 1.026/2026 tornando o RENAVE obrigatório (~out/2026), todo carro que passa por loja gera km oficial — usar como espinha dorsal da detecção de rollback e como atalho pro cold start.
11. **Retificação append-only** de registros errados (correção visível, original preservado) — resolve o medo do dono sem quebrar a promessa de imutabilidade.
12. **Score sintético tipo AutoCheck** (nota única comparativa) — só quando houver densidade estatística; antes disso é número inventado.

**Síntese em uma linha**: o cliente não compra imutabilidade — o comprador compra a resposta "esse carro vai me dar prejuízo?" (e ela exige leilão/sinistro/débito, não só km) e o dono compra "meu carro vale mais e vende mais rápido com dossiê que eu controlo"; blockchain é detalhe de implementação que deve aparecer, no máximo, na letra miúda do selo.