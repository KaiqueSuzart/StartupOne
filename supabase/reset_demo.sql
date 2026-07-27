-- Lastro — devolve a demonstração ao estado original.
--
-- Remove APENAS os registros gravados pela ponta de escrita (workshop_id
-- não nulo), preservando o histórico semeado dos três veículos.
--
-- Só roda com credencial de administrador do banco. É essa a assimetria que
-- o produto promete: a aplicação e a oficina não conseguem apagar nada — o
-- dono do banco consegue, e é por isso que a fase on-chain existe. Enquanto o
-- registro estiver só no Postgres, esta janela existe; documentá-la é mais
-- honesto do que fingir que não.

begin;

delete from storage.objects where bucket_id = 'odometer-photos';

delete from public.service_records where workshop_id is not null;

commit;

select
  v.plate,
  count(*) as registros,
  count(*) filter (where sr.workshop_id is not null) as gravados_por_oficina
from public.vehicles v
join public.service_records sr on sr.vin = v.vin
group by v.plate
order by v.plate;
