-- Lastro — ponta de escrita da oficina (etapa 2)
-- Rode DEPOIS de schema.sql. Idempotente: pode rodar de novo com segurança.
--
-- IMUTABILIDADE NO BANCO: service_records é APPEND-ONLY. Existe policy de
-- SELECT (pública) e de INSERT (oficina autenticada, só com o próprio
-- workshop_id). NÃO existe policy de UPDATE nem de DELETE — de propósito.
-- Assim, nem uma credencial de oficina comprometida reescreve o passado: o
-- Postgres ensaia hoje a imutabilidade que a blockchain garantirá depois.

create table if not exists public.workshops (
  id          uuid primary key references auth.users (id) on delete cascade,
  cnpj        text not null unique check (cnpj ~ '^[0-9]{14}$'),
  name        text not null,
  created_at  timestamptz not null default now()
);

alter table public.workshops enable row level security;

drop policy if exists "leitura publica de oficinas" on public.workshops;
create policy "leitura publica de oficinas"
  on public.workshops for select using (true);

-- ── Campos da escrita autenticada ─────────────────────────────────────
-- attestor (tipo de atestador) continua existindo e alimenta o badge de
-- procedência. workshop_id é a IDENTIDADE de quem gravou — os dois papéis
-- são distintos e não se substituem.
alter table public.service_records
  add column if not exists workshop_id uuid references public.workshops (id),
  add column if not exists nfe_key text check (nfe_key ~ '^[0-9]{44}$'),
  add column if not exists nfe_emitter_cnpj text check (nfe_emitter_cnpj ~ '^[0-9]{14}$'),
  -- Emitente da nota diferente do CNPJ da oficina: não bloqueia (matriz,
  -- filial e rede emitem legitimamente), mas fica registrado e visível.
  add column if not exists nfe_cnpj_mismatch boolean not null default false,
  add column if not exists odometer_photo_path text,
  add column if not exists odometer_photo_hash text;

create index if not exists service_records_workshop_idx
  on public.service_records (workshop_id);

-- Registro gravado por oficina autenticada exige nota fiscal e foto: é o
-- que encarece a fraude da "revisão fantasma".
alter table public.service_records
  drop constraint if exists service_records_workshop_requires_evidence;
alter table public.service_records
  add constraint service_records_workshop_requires_evidence check (
    workshop_id is null
    or (nfe_key is not null and odometer_photo_hash is not null)
  );

drop policy if exists "oficina registra o proprio servico" on public.service_records;
create policy "oficina registra o proprio servico"
  on public.service_records for insert to authenticated
  with check (
    workshop_id = auth.uid()
    and exists (select 1 from public.workshops w where w.id = auth.uid())
  );

-- ── Km monotônico no próprio banco ────────────────────────────────────
-- A regra também existe no domínio (domain/serviceEntry.ts), mas validação
-- de aplicação não vale para quem chama a API REST direto com a sessão da
-- oficina. Aqui a garantia é do Postgres.
--
-- Só vale para registros da ponta de escrita (workshop_id não nulo): o
-- histórico importado PODE conter a fraude — é justamente o que o relatório
-- do comprador denuncia. O que não se admite é introduzir fraude nova.
create or replace function public.enforce_monotonic_odometer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  last_km integer;
begin
  if new.workshop_id is null then
    return new;
  end if;

  select max(odometer_km) into last_km
  from public.service_records
  where vin = new.vin and service_date <= new.service_date;

  if last_km is not null and new.odometer_km < last_km then
    raise exception
      'quilometragem regride: ultimo registro e % km, recebido % km',
      last_km, new.odometer_km
      using errcode = 'check_violation';
  end if;

  return new;
end $$;

drop trigger if exists service_records_monotonic_odometer on public.service_records;
create trigger service_records_monotonic_odometer
  before insert on public.service_records
  for each row execute function public.enforce_monotonic_odometer();

-- ── Cota diária de escrita ────────────────────────────────────────────
-- A demonstração é pública e as credenciais de teste também. Como o
-- histórico é append-only, registro ruim não se apaga pela aplicação — então
-- a defesa tem que ser ANTES da escrita. A cota limita o estrago sem
-- atrapalhar um uso real de oficina (20 serviços/dia é folgado para o MVP).
create or replace function public.enforce_daily_write_quota()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  today_count integer;
begin
  if new.workshop_id is null then
    return new;
  end if;

  select count(*) into today_count
  from public.service_records
  where workshop_id = new.workshop_id
    and recorded_at = current_date;

  if today_count >= 20 then
    raise exception
      'limite diario de registros atingido para esta oficina (20 por dia)'
      using errcode = 'check_violation';
  end if;

  return new;
end $$;

drop trigger if exists service_records_daily_quota on public.service_records;
create trigger service_records_daily_quota
  before insert on public.service_records
  for each row execute function public.enforce_daily_write_quota();

-- ── Storage da foto do odômetro ───────────────────────────────────────
-- Bucket PRIVADO: a foto pode capturar interior do veículo, pessoas ou
-- local. O relatório público mostra apenas o hash, provando que a evidência
-- existe e não foi trocada.
insert into storage.buckets (id, name, public)
values ('odometer-photos', 'odometer-photos', false)
on conflict (id) do update set public = false;

drop policy if exists "oficina envia foto na propria pasta" on storage.objects;
create policy "oficina envia foto na propria pasta"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'odometer-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "oficina le as proprias fotos" on storage.objects;
create policy "oficina le as proprias fotos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'odometer-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
