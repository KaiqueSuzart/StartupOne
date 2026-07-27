-- Lastro — limites de escrita nas tabelas públicas
--
-- `search_log` e `vehicle_interest` aceitam insert de qualquer visitante (é o
-- que permite medir demanda sem cadastro). Sem limite, dá para inundar as
-- duas e, pior que o volume, distorcer justamente a métrica que deveriam
-- produzir.
--
-- O limite é por CHAVE DE NEGÓCIO (placa), não por pessoa: o projeto não
-- guarda IP nem identificador de visitante, e não vai passar a guardar para
-- fazer throttle. Proteção por IP é camada de borda (firewall da Vercel),
-- não do banco.
--
-- Rode DEPOIS de telemetry.sql e interest.sql.

-- ── Consultas ─────────────────────────────────────────────────────────
-- Recarregar a mesma placa dezenas de vezes não deve virar "muita procura".
create or replace function public.enforce_search_log_quota()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  same_identifier integer;
  today_total integer;
begin
  select count(*) into same_identifier
  from public.search_log
  where identifier = new.identifier and created_at >= current_date;

  if same_identifier >= 30 then
    raise exception 'limite diario de consultas para este identificador'
      using errcode = 'check_violation';
  end if;

  select count(*) into today_total
  from public.search_log where created_at >= current_date;

  if today_total >= 20000 then
    raise exception 'limite diario global de consultas'
      using errcode = 'check_violation';
  end if;

  return new;
end $$;

drop trigger if exists search_log_quota on public.search_log;
create trigger search_log_quota
  before insert on public.search_log
  for each row execute function public.enforce_search_log_quota();

-- ── Interesse ─────────────────────────────────────────────────────────
-- Aqui o dado é pessoal (e-mail), então o limite é mais estreito. A restrição
-- unique(plate, email) já barra repetição exata; isto barra o resto.
create or replace function public.enforce_interest_quota()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  same_plate integer;
  today_total integer;
begin
  select count(*) into same_plate
  from public.vehicle_interest
  where plate = new.plate and created_at >= current_date;

  if same_plate >= 10 then
    raise exception 'limite diario de cadastros para esta placa'
      using errcode = 'check_violation';
  end if;

  select count(*) into today_total
  from public.vehicle_interest where created_at >= current_date;

  if today_total >= 2000 then
    raise exception 'limite diario global de cadastros'
      using errcode = 'check_violation';
  end if;

  return new;
end $$;

drop trigger if exists vehicle_interest_quota on public.vehicle_interest;
create trigger vehicle_interest_quota
  before insert on public.vehicle_interest
  for each row execute function public.enforce_interest_quota();
