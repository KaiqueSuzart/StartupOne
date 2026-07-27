-- Lastro — telemetria mínima de consultas
--
-- Sem isto a PoC no ar é cega: não dá para saber se dez ou mil pessoas
-- consultaram, nem quais veículos interessam. Rode DEPOIS de schema.sql.
--
-- NÃO guarda IP, user-agent nem qualquer identificador de pessoa. Placa é
-- identificador de veículo, não de gente, e é o dado que responde à pergunta
-- do produto: o que as pessoas procuram e quanto disso a base cobre.

create table if not exists public.search_log (
  id          bigserial primary key,
  identifier  text not null check (identifier ~ '^[A-Z0-9]{1,17}$'),
  kind        text not null check (kind in ('plate', 'vin', 'invalid')),
  found       boolean not null,
  created_at  timestamptz not null default now()
);

create index if not exists search_log_created_idx
  on public.search_log (created_at desc);

alter table public.search_log enable row level security;

-- Mesma disciplina da tabela de interesse: escrita aberta, leitura fechada.
-- Nem a aplicação nem o navegador conseguem enumerar o que foi buscado.
drop policy if exists "qualquer um registra consulta" on public.search_log;
create policy "qualquer um registra consulta"
  on public.search_log for insert to anon, authenticated
  with check (true);
