-- Lastro — esquema do histórico veicular
-- Rode este arquivo no SQL Editor do Supabase antes do seed.sql.
--
-- Princípio: o banco é APPEND-ONLY para o público. A leitura é aberta
-- (o histórico é o produto); escrita e alteração só com service_role,
-- nunca pela chave anon usada pela aplicação.

create table if not exists public.vehicles (
  vin           text primary key,
  plate         text not null unique,
  make          text not null,
  model         text not null,
  model_year    integer not null check (model_year between 1980 and 2100),
  color         text not null,
  created_at    timestamptz not null default now()
);

create table if not exists public.service_records (
  id            text primary key,
  vin           text not null references public.vehicles (vin) on delete cascade,
  service_date  date not null,
  -- Carimbo de entrada no histórico: separado da data do serviço para que
  -- registro retroativo seja detectável (ver domain/integrity.ts).
  recorded_at   date not null,
  odometer_km   integer not null check (odometer_km >= 0),
  workshop      text not null,
  attestor      text not null check (attestor in (
                  'dealership', 'authorized_service',
                  'independent_workshop', 'inspection', 'registry', 'owner')),
  service_type  text not null check (service_type in (
                  'initial_registration', 'ownership_transfer',
                  'scheduled_maintenance', 'oil_change', 'brakes', 'tires',
                  'suspension', 'electrical', 'other')),
  description   text not null default ''
);

create index if not exists service_records_vin_date_idx
  on public.service_records (vin, service_date);

-- Itens trocados/revisados e próxima revisão prevista. Categorias, sem valor
-- nem quantidade: detalhe útil ao comprador sem virar rastro fiscal.
alter table public.service_records
  add column if not exists service_items text[] not null default '{}',
  add column if not exists next_service_km integer
    check (next_service_km is null or next_service_km >= 0);

-- Os CHECKs acompanham a evolução do domínio e precisam ser recriados
-- explicitamente: `create table if not exists` não altera tabela existente.
alter table public.service_records
  drop constraint if exists service_records_attestor_check;
alter table public.service_records
  add constraint service_records_attestor_check check (attestor in (
    'dealership', 'authorized_service', 'independent_workshop',
    'inspection', 'registry', 'owner'));

alter table public.service_records
  drop constraint if exists service_records_service_type_check;
alter table public.service_records
  add constraint service_records_service_type_check check (service_type in (
    'initial_registration', 'ownership_transfer', 'scheduled_maintenance',
    'oil_change', 'brakes', 'tires', 'suspension', 'electrical', 'other'));

create table if not exists public.recalls (
  id                      text primary key,
  vin                     text not null references public.vehicles (vin) on delete cascade,
  code                    text not null,
  announced_at            date not null,
  system                  text not null,
  description             text not null default '',
  status                  text not null check (status in ('pending', 'resolved')),
  resolved_by_record_id   text references public.service_records (id)
);

create index if not exists recalls_vin_idx on public.recalls (vin);

-- Busca por placa é a consulta principal; normalizada em maiúsculas.
create index if not exists vehicles_plate_idx on public.vehicles (upper(plate));

-- ── Row Level Security ────────────────────────────────────────────────
-- Sem policy de insert/update/delete: a chave anon só lê.
alter table public.vehicles        enable row level security;
alter table public.service_records enable row level security;
alter table public.recalls         enable row level security;

drop policy if exists "leitura publica de veiculos" on public.vehicles;
create policy "leitura publica de veiculos"
  on public.vehicles for select using (true);

drop policy if exists "leitura publica de registros" on public.service_records;
create policy "leitura publica de registros"
  on public.service_records for select using (true);

drop policy if exists "leitura publica de recalls" on public.recalls;
create policy "leitura publica de recalls"
  on public.recalls for select using (true);
