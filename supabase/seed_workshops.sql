-- Lastro — oficinas de teste (etapa 2)
-- Rode DEPOIS de workshop.sql. Idempotente.
--
-- No MVP não há autocadastro: oficinas entram por seed/admin, como o resto
-- da PoC. Credenciais abaixo são de DEMONSTRAÇÃO — nunca reutilize em
-- ambiente real.
--
--   oficina.central@lastro.dev  /  lastro-demo-2026   (CNPJ 11222333000181)
--   auto.center@lastro.dev      /  lastro-demo-2026   (CNPJ 04252011000110)

begin;

-- Cria (ou atualiza) o usuário de autenticação e a oficina vinculada.
-- A senha é gravada com bcrypt pelo próprio Postgres; nunca em texto puro.
do $$
declare
  w record;
begin
  for w in
    select * from (values
      ('a1111111-1111-4111-8111-111111111111'::uuid,
       'oficina.central@lastro.dev', '11222333000181', 'Oficina Mecânica Central'),
      ('a2222222-2222-4222-8222-222222222222'::uuid,
       'auto.center@lastro.dev', '04252011000110', 'Auto Center Estrada Real')
    ) as t(id, email, cnpj, name)
  loop
    -- Os campos de token vão como string vazia, não NULL: o serviço de auth
    -- os lê como texto e falha ("Database error querying schema") se forem
    -- nulos em usuário criado por SQL.
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token,
      email_change, email_change_token_new, email_change_token_current,
      phone_change, phone_change_token, reauthentication_token
    ) values (
      '00000000-0000-0000-0000-000000000000', w.id,
      'authenticated', 'authenticated', w.email,
      extensions.crypt('lastro-demo-2026', extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', '', '', '', '', ''
    )
    on conflict (id) do update
      set email = excluded.email,
          encrypted_password = excluded.encrypted_password,
          email_confirmed_at = excluded.email_confirmed_at,
          confirmation_token = '', recovery_token = '',
          email_change = '', email_change_token_new = '',
          email_change_token_current = '', phone_change = '',
          phone_change_token = '', reauthentication_token = '';

    insert into auth.identities (
      provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      w.email, w.id,
      jsonb_build_object('sub', w.id::text, 'email', w.email,
                         'email_verified', true, 'phone_verified', false),
      'email', now(), now(), now()
    )
    on conflict (provider, provider_id) do update
      set identity_data = excluded.identity_data;

    insert into public.workshops (id, cnpj, name)
    values (w.id, w.cnpj, w.name)
    on conflict (id) do update
      set cnpj = excluded.cnpj, name = excluded.name;
  end loop;
end $$;

commit;
