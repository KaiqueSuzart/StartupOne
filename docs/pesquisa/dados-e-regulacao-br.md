# Relatório: Ecossistema de dados e regulação veicular no Brasil — relevância para o Lastro

Legenda: **[FATO]** = verificado em fonte citada. **[INFERÊNCIA]** = conclusão minha a partir dos fatos.

---

## 1. Fontes oficiais de dados

**Senatran/RENAVAM**
- **[FATO]** O Serpro expõe APIs oficiais de dados do RENAVAM (veículos), RENACH (condutores) e RENAINF (infrações) via WSDenatran — 52 consultas, acesso mediante convênio com a Senatran e contratação com o Serpro. Fontes: [Catálogo Conecta gov.br — WSDenatran](https://www.gov.br/conecta/catalogo/apis/wsdenatran), [Serpro — Consulta Online Senatran](https://serprocrm.custhelp.com/app/answers/detail/a_id/174/~/consulta-online-senatran), [Painel de Inteligência Veicular](https://loja.serpro.gov.br/painelveicular).
- **[INFERÊNCIA]** Consultas comerciais por placa (Olho no Carro, Checkauto etc.) revendem essa base. O Lastro competiria/complementaria esses players; acesso direto exige convênio, o que é barreira relevante para uma PoC.

**RENAVE — a fonte mais estratégica**
- **[FATO]** RENAVE (Senatran + Serpro) registra em tempo real entrada e saída de veículos no estoque de lojas e concessionárias, integrado a Detran, Receita e Sefaz. Custo: R$ 4,43 por operação. Lojas operam via "empresas integradoras" credenciadas. Fontes: [Autoconf](https://autoconf.com.br/blog/o-que-e-renave-como-funciona-revendas-de-veiculos/), [gov.br](https://www.gov.br/pt-br/servicos/contratar-solucao-para-registro-eletronico-de-entrada-e-saida-de-veiculos-em-estoque-renave), [Serpro/Central de Ajuda](https://centraldeajuda.serpro.gov.br/renave/faq/renavefaq/).
- **[FATO]** Na entrada em estoque, o RENAVE exige valor do hodômetro e data da medição (km da vistoria de entrada). Fontes: [Manual Renave — Serpro](https://renave.estaleiro.serpro.gov.br/renave-ws/manual/solicitar-entrada-estoque), [Renave Fácil](https://renavefacil.zendesk.com/hc/pt-br/articles/360045811671-Solicita%C3%A7%C3%A3o-de-entrada-no-estoque).
- **[FATO — MUITO RECENTE]** Resolução CONTRAN nº 1.026/2026 (publicada 30/06/2026) tornou o RENAVE **obrigatório em todo o Brasil** para novos e usados, com 90 dias de adaptação, substituindo os livros físicos. Fontes: [ANAUTOS](https://anautos.org.br/2026/07/02/contran-publica-resolucao-no-1-026-2026-e-torna-renave-obrigatorio-em-todo-o-brasil/), [FENAUTO](https://www.fenauto.org.br/news/nova-resolucao-do-contran-torna-o-renave-obrigatorio), [Rede Cred Auto](https://blog.redecredauto.com.br/renave-obrigatorio-veja-o-que-muda-em-2026/).
- **[INFERÊNCIA]** Isso cria, a partir de ~out/2026, um registro nacional compulsório de km a cada passagem do carro por revenda — exatamente a "âncora" de km que o Lastro precisa. O Lastro pode se posicionar como camada de consulta/confiança sobre esses pontos, ou virar integradora RENAVE.

**Vistoria de transferência**
- **[FATO]** Não existe inspeção periódica obrigatória no Brasil; vistoria é exigida em transferência de propriedade, mudança de município/UF e suspeitas de irregularidade. Fonte: [AnyCar](https://anycar.com.br/blog/vistoria-obrigatoria-veiculos-brasil-2026).
- **[FATO]** A Resolução CONTRAN 941/2022 padroniza a vistoria de identificação veicular; o laudo é exclusivamente eletrônico e só vale se registrado no SISCSV (sistema mantido pela Senatran), com validade de 60 dias e uso único. Fontes: [LegisWeb — Res. 941/2022](https://www.legisweb.com.br/legislacao/?id=429791), [Grupo Otimiza (consolidada)](https://grupootimiza.com.br/legislacao/resolucao-contran-no-941-2022/).
- **[FATO]** A vistoria coleta quilometragem: manuais de Detran citam bloqueio de laudo por "erro na coleta da quilometragem anterior" e detecção de km menor que a última análise. Fontes: [Manual Detran-DF](https://www.detran.df.gov.br/wp-content/uploads/2021/04/MANUAL-INFORMACOES-VISTORIA-3-PUBLICACAO-12-9-21.pdf), [Gringo](https://gringo.com.vc/blog/vistoria-veicular-para-transferencia-saiba-como-funciona/).
- **[INFERÊNCIA]** Já existe, portanto, um histórico oficial fragmentado de km (vistorias + RENAVE), mas sem produto de consulta pública consolidado — é a lacuna que o Lastro atacaria. A detecção de rollback da PoC replica lógica que o próprio SISCSV já aplica.

**Inspeção veicular / CSV**
- **[FATO]** O PL 3507/2025 (inspeção periódica para carros 5+ anos) avançou em comissões mas **não é lei**. Fontes: [Câmara — enquete PL 3507/2025](https://www.camara.leg.br/enquetes/2537555), [ND Mais](https://ndmais.com.br/transportes/inspecao-veicular-entenda-projeto/).

**Recall (Senacon/Senatran)**
- **[FATO]** Recall é comunicado pelo fabricante à Senatran e anotado automaticamente no RENAVAM e no CRLV-e (app CDT); consulta pública por placa/chassi. Não atendido em 1 ano vira restrição administrativa que **bloqueia licenciamento e transferência**. Fontes: [Agência Gov](https://agenciagov.ebc.com.br/noticias/202410/voce-sabe-o-que-e-e-como-funciona-o-recall-a-senatran-tira-suas-duvidas), [Portal de Serviços Senatran](https://portalservicos.senatran.serpro.gov.br/).
- **[INFERÊNCIA]** Recall pendente é um dado de alto valor e baixa fricção para a timeline do Lastro (já é público e consultável por placa).

## 2. Lei sobre fraude de odômetro

- **[FATO]** **Não existe lei específica** de fraude de odômetro nem registro obrigatório universal de km. O PL 3881/15 (km obrigatório no comprovante de transferência) apenas tramitou. Fontes: [Câmara](https://www.camara.leg.br/noticias/529453-REGISTRO-DE-QUILOMETRAGEM-PODERA-SER-OBRIGATORIO-NA-TRANSFERENCIA-DO-VEICULO), [AutoPapo](https://autopapo.com.br/noticia/quilometragem-transferencia-veiculo/).
- **[FATO]** A prática é punida por enquadramentos gerais: estelionato (art. 171 CP, reclusão 1–5 anos + multa) para quem vende com km adulterada; art. 66 do CDC (detenção 3 meses–1 ano) por informação falsa ao consumidor; art. 7º, IX da Lei 8.137/90 (2–5 anos) quando praticado por revenda. Fontes: [TJDFT](https://www.tjdft.jus.br/institucional/imprensa/campanhas-e-produtos/direito-facil/edicao-semanal/adulteracao-de-quilometragem), [Blanco Advocacia](https://www.blancoadvocacia.com.br/direito-consumidor/o-crime-de-adulteracao-na-quilometragem-de-revenda-de-veiculo/).
- **[FATO]** A Lei 14.562/23, que ampliou o art. 311 CP (adulteração de sinal identificador — chassi, motor, placa; pena 3–6 anos), **não incluiu o odômetro** entre os objetos do crime. Fonte: [Estratégia Concursos](https://www.estrategiaconcursos.com.br/blog/artigo-311-codigo-penal/).
- **[INFERÊNCIA]** O vácuo de lei específica + prova difícil (o comprador precisa demonstrar a adulteração) é o argumento de mercado do Lastro: registro imutável transforma a fraude em algo detectável documentalmente.

## 3. Software de gestão de oficinas (potencial integração)

- **[FATO]** Mercado pulverizado, sem líder claro. Nomes recorrentes em rankings: **Oficina Integrada** (foco em OS, autodeclara "milhares de oficinas"), **Ultracar**, **SisMecânica**, **OnMotor**, **MinhaOficina**, **Mecânica Mais**, **Ultra Oficina**. Fontes: [CompararSoftware — Top 10](https://www.compararsoftware.com.br/oficina-mecanica), [Limersoft — 7 melhores](https://www.limersoft.com.br/post/os-7-melhores-programas-para-oficinas-mecanicas-manutencao-de-frotas-autopecas-e-servicos-automoti), [Oficina Integrada](https://www.oficinaintegrada.com.br/), [EV8 Auto](https://blog.ev8auto.com.br/post/sistema-para-oficina-mecanica-melhores-opcoes).
- **[FATO]** **GestãoClick** é ERP generalista com módulo de oficina cuja OS já registra placa, marca e **quilometragem** do veículo. Fonte: [GestãoClick — oficina](https://gestaoclick.com.br/programa-para-oficina-mecanica/).
- **[INFERÊNCIA]** Nex é PDV/gestão genérico e Auto Avaliar é plataforma B2B de avaliação/repasse para concessionárias — não são sistemas de oficina; para captura de revisão na fonte, os alvos são Oficina Integrada, Ultracar e afins. Como toda OS já carrega placa+km+serviço, uma integração "publicar OS no Lastro" é tecnicamente trivial; o desafio é comercial (fragmentação exige integrar 5–10 sistemas para cobertura razoável). Nota fiscal de serviço (NFS-e), que esses sistemas emitem, é outro ponto de captura possível.

## 4. LGPD e dados veiculares

- **[FATO]** Placa é tratada pela doutrina como **dado pessoal indireto/identificável** (identifica o dono por cruzamento — ex.: publicações de IPVA em diário oficial), enquadrando-se no conceito amplo de dado pessoal da LGPD. Fontes: [LinkedIn — análise jurídica placa/IP/MAC](https://pt.linkedin.com/pulse/placa-de-ve%C3%ADculo-ip-e-mac-address-correla%C3%A7%C3%A3o-como-%C3%A0-augusto-navarro), [Unirede — Série LGPD](https://www.unirede.net/serie-lgpd-a-placa-do-seu-carro-e-a-lgpd-como-se-relacionam/).
- **[FATO]** O mercado de consulta veicular opera legalmente entregando histórico do **veículo** (leilão, sinistro, débitos, restrições) sem expor nome/CPF/endereço do proprietário — expor dados do dono sem base legal viola a LGPD. Fontes: [AnyCar](https://anycar.com.br/blog/como-descobrir-proprietario-veiculo-placa-brasil-2026), [BuscaSim](https://buscasim.com.br/blog/consulta-placa/puxar-endereco-pela-placa/).
- **[INFERÊNCIA]** Para o Lastro: km, data, tipo de serviço e oficina vinculados a placa/VIN são defensáveis (legítimo interesse + dados do bem, não do titular), desde que (a) nunca exponha proprietário, (b) trate o par placa+histórico como dado pessoal identificável (relatório de impacto, base legal documentada), (c) cuidado com geolocalização fina de serviços, que pode revelar padrão de vida do dono. Não localizei manifestação específica da ANPD sobre placa — tratar como zona cinzenta.

## 5. Manutenção conectada das montadoras

- **[FATO]** **Meu VW / VW Play**: substituiu o livrete de manutenção por Plano de Serviços Digital — histórico online de revisões com data e serviços, "Certificado de Serviço VW" com selo digital, e telemetria (km total, combustível, consumo) nos modelos com VW Play. Fontes: [VW — Meu VW](https://www.vw.com.br/pt/volkswagen/MeuVW.html), [VW News — Plano de Serviços Digital](https://www.vwnews.com.br/news/141), [Revista Carro](https://revistacarro.com.br/volkswagen-lanca-plano-de-servicos-digital/).
- **[FATO]** **Chevrolet OnStar/myChevrolet**: ativo no Brasil, nova geração do app em 2025, telemetria e serviços conectados em todo o território. Fontes: [Chevrolet — OnStar](https://www.chevrolet.com.br/servicos/onstar/assinar-renovar-novo-onstar), [GM News 2025](https://news.gm.com.br/newsroom.detail.html/Pages/news/br/pt/2025/may/0522-onstar.html).
- **[FATO]** **Toyota App**: km em tempo real, histórico de serviços e agendamento de revisão na rede. Fontes: [Toyota — App](https://www.toyota.com.br/meu-toyota/app), [Toyota — Serviços Conectados](https://www.toyota.com.br/meu-toyota/conectado).
- **[INFERÊNCIA]** As montadoras já capturam o dado que o Lastro quer (km telemetrado + revisões em concessionária), mas em silos proprietários que morrem quando o carro sai da rede autorizada (carro 5+ anos migra para oficina independente). O diferencial viável do Lastro é o cross-brand e o pós-garantia — e o "selo verificado" da PoC concorre diretamente com o "Certificado de Serviço VW", que só cobre uma marca.

---

## Síntese executiva (inferências principais)

1. **O timing regulatório é favorável**: Res. CONTRAN 1.026/2026 (RENAVE obrigatório, jun/2026) cria km oficial compulsório em toda transação via revenda. O Lastro deve decidir rápido se integra o RENAVE (via credenciamento como integradora) ou consome seus dados.
2. **O Estado já coleta km** (RENAVE + vistorias/SISCSV + montadoras), mas de forma fragmentada e sem consulta pública consolidada — a proposta de valor do Lastro é a consolidação confiável, mais que a imutabilidade em si.
3. **Não há lei de odômetro**; a punição é por estelionato/CDC, com ônus de prova no comprador — bom argumento de venda.
4. **LGPD não inviabiliza** o produto, mas exige tratar placa+histórico como dado pessoal identificável e jamais expor o proprietário.
5. **Captura na oficina independente** (o elo que falta) esbarra em mercado de software pulverizado; priorizar 2–3 integrações (Oficina Integrada, Ultracar, GestãoClick) cujas OS já contêm placa+km.