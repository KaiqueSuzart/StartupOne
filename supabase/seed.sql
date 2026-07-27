-- Lastro — dados de demonstração (gerados a partir de data/vehicles/*.json).
-- Rode DEPOIS de schema.sql. Todos os veículos são fictícios: sem PII.

begin;

delete from public.recalls;
delete from public.service_records where workshop_id is null;
delete from public.vehicles where vin not in (select vin from public.service_records);

-- Volkswagen T-Cross Comfortline (BRA0S17)
insert into public.vehicles (vin, plate, make, model, model_year, color) values
  ('9BWZZZ377VT004251', 'BRA0S17', 'Volkswagen', 'T-Cross Comfortline', 2023, 'Cinza Platinum')
  on conflict (vin) do nothing;

insert into public.service_records (id, vin, service_date, recorded_at, odometer_km, workshop, attestor, service_type, description) values
  ('clean-001', '9BWZZZ377VT004251', '2023-03-10', '2023-03-10', 0, 'Concessionária AutoPrime VW', 'dealership', 'initial_registration', 'Registro inicial do veículo zero-quilômetro na concessionária.'),
  ('clean-002', '9BWZZZ377VT004251', '2024-03-05', '2024-03-05', 10240, 'Concessionária AutoPrime VW', 'dealership', 'scheduled_maintenance', 'Revisão de 1 ano / 10.000 km: troca de óleo e filtros, inspeção geral.'),
  ('clean-003', '9BWZZZ377VT004251', '2025-02-20', '2025-02-21', 20180, 'Oficina Roda Viva', 'independent_workshop', 'scheduled_maintenance', 'Revisão de 2 anos / 20.000 km: óleo, filtros, alinhamento e balanceamento.')
  on conflict (id) do nothing;

-- Chevrolet Onix LTZ 1.4 (ABC1234)
insert into public.vehicles (vin, plate, make, model, model_year, color) values
  ('9BGRD08X04G117974', 'ABC1234', 'Chevrolet', 'Onix LTZ 1.4', 2018, 'Branco Summit')
  on conflict (vin) do nothing;

insert into public.service_records (id, vin, service_date, recorded_at, odometer_km, workshop, attestor, service_type, description) values
  ('rich-001', '9BGRD08X04G117974', '2018-06-15', '2018-06-15', 0, 'Concessionária Vector Chevrolet', 'dealership', 'initial_registration', 'Registro inicial do veículo zero-quilômetro na concessionária.'),
  ('rich-002', '9BGRD08X04G117974', '2019-06-20', '2019-06-20', 14350, 'Concessionária Vector Chevrolet', 'dealership', 'scheduled_maintenance', 'Revisão de 1 ano: troca de óleo e filtros, verificação de freios.'),
  ('rich-003', '9BGRD08X04G117974', '2020-07-02', '2020-07-03', 27900, 'Oficina Mecânica Central', 'independent_workshop', 'oil_change', 'Troca de óleo e filtro de óleo fora da rede autorizada.'),
  ('rich-004', '9BGRD08X04G117974', '2021-08-11', '2021-08-11', 42750, 'Oficina Mecânica Central', 'independent_workshop', 'brakes', 'Substituição de pastilhas e discos dianteiros; fluido de freio novo.'),
  ('rich-transfer-1', '9BGRD08X04G117974', '2021-09-15', '2021-09-16', 44100, 'Detran-SP · Vistoria de transferência', 'registry', 'ownership_transfer', 'Transferência de propriedade registrada, com vistoria e leitura de odômetro.'),
  ('rich-005', '9BGRD08X04G117974', '2022-09-30', '2022-10-01', 58200, 'Pneus & Cia', 'independent_workshop', 'tires', 'Troca dos quatro pneus; alinhamento e balanceamento.'),
  ('rich-006', '9BGRD08X04G117974', '2023-10-14', '2023-10-14', 71400, 'Oficina Mecânica Central', 'independent_workshop', 'suspension', 'Substituição de amortecedores dianteiros e bieletas.'),
  ('rich-007', '9BGRD08X04G117974', '2024-11-08', '2024-11-09', 84100, 'Auto Elétrica Farol Norte', 'independent_workshop', 'electrical', 'Substituição da bateria e revisão do alternador.'),
  ('rich-008', '9BGRD08X04G117974', '2026-01-17', '2026-01-17', 95350, 'Oficina Mecânica Central', 'independent_workshop', 'scheduled_maintenance', 'Revisão completa: óleo, filtros, correia dentada e velas.')
  on conflict (id) do nothing;

insert into public.recalls (id, vin, code, announced_at, system, description, status, resolved_by_record_id) values
  ('rich-recall-1', '9BGRD08X04G117974', 'RCL-2021-0413', '2021-05-04', 'Airbag do motorista', 'Possível falha no acionamento do airbag do motorista em caso de colisão frontal. Reparo gratuito na rede autorizada.', 'pending', null)
  on conflict (id) do nothing;

-- Renault Sandero Expression 1.6 (XYZ9A87)
insert into public.vehicles (vin, plate, make, model, model_year, color) values
  ('93YLSR7UHFJ123456', 'XYZ9A87', 'Renault', 'Sandero Expression 1.6', 2015, 'Vermelho Vivo')
  on conflict (vin) do nothing;

insert into public.service_records (id, vin, service_date, recorded_at, odometer_km, workshop, attestor, service_type, description) values
  ('rb-001', '93YLSR7UHFJ123456', '2015-04-08', '2015-04-08', 0, 'Concessionária Rota Renault', 'dealership', 'initial_registration', 'Registro inicial do veículo zero-quilômetro na concessionária.'),
  ('rb-002', '93YLSR7UHFJ123456', '2017-05-19', '2017-05-19', 30150, 'Concessionária Rota Renault', 'dealership', 'scheduled_maintenance', 'Revisão de 30.000 km: óleo, filtros e correia do alternador.'),
  ('rb-003', '93YLSR7UHFJ123456', '2019-06-27', '2019-06-27', 61300, 'Oficina do Bairro', 'independent_workshop', 'scheduled_maintenance', 'Revisão de 60.000 km: óleo, filtros, velas e fluido de arrefecimento.'),
  ('rb-004', '93YLSR7UHFJ123456', '2021-03-12', '2021-03-12', 88500, 'Oficina do Bairro', 'independent_workshop', 'brakes', 'Troca de pastilhas traseiras e revisão do freio de estacionamento.'),
  ('rb-transfer-1', '93YLSR7UHFJ123456', '2021-06-20', '2021-06-21', 90100, 'Detran-MG · Vistoria de transferência', 'registry', 'ownership_transfer', 'Transferência de propriedade registrada, com vistoria e leitura de odômetro.'),
  ('rb-005', '93YLSR7UHFJ123456', '2022-08-04', '2023-06-10', 52000, 'Auto Center Estrada Real', 'independent_workshop', 'oil_change', 'Troca de óleo e filtro antes de anúncio de venda.'),
  ('rb-006', '93YLSR7UHFJ123456', '2023-02-15', '2023-02-16', 58600, 'Auto Center Estrada Real', 'independent_workshop', 'tires', 'Troca de dois pneus dianteiros e balanceamento.'),
  ('rb-transfer-2', '93YLSR7UHFJ123456', '2023-03-01', '2023-03-02', 59000, 'Detran-MG · Vistoria de transferência', 'registry', 'ownership_transfer', 'Transferência de propriedade registrada, com vistoria e leitura de odômetro.')
  on conflict (id) do nothing;

insert into public.recalls (id, vin, code, announced_at, system, description, status, resolved_by_record_id) values
  ('rb-recall-1', '93YLSR7UHFJ123456', 'RCL-2018-0177', '2018-02-19', 'Fixação do banco traseiro', 'Parafusos de fixação do banco traseiro podem apresentar folga. Reparo gratuito na rede autorizada.', 'resolved', 'rb-003')
  on conflict (id) do nothing;

commit;
