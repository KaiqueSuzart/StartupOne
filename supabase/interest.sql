-- Lastro — captura de interesse no estado vazio
--
-- 99% das placas consultadas não existem na base. Essa tela é o instrumento
-- que mede se as pessoas de fato querem o produto: cada e-mail deixado é um
-- voto. Rode DEPOIS de schema.sql.

create table if not exists public.vehicle_interest (
  id          uuid primary key default gen_random_uuid(),
  plate       text not null check (plate ~ '^[A-Z0-9]{7,17}$'),
  email       text not null check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  created_at  timestamptz not null default now(),
  unique (plate, email)
);

alter table public.vehicle_interest enable row level security;

-- ESCRITA sim, LEITURA não. E-mail é dado pessoal (LGPD): a policy de insert
-- permite deixar o contato, mas nenhuma policy de select existe, então nem a
-- aplicação nem o navegador conseguem listar quem se cadastrou. Só o
-- administrador do banco lê.
drop policy if exists "qualquer um registra interesse" on public.vehicle_interest;
create policy "qualquer um registra interesse"
  on public.vehicle_interest for insert to anon, authenticated
  with check (true);
