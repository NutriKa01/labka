-- ============================================================
-- 006 — STORAGE DE ARQUIVOS DE EXAME
--
-- Bucket privado pra guardar o laudo original (PDF/foto) anexado ao
-- criar um exame. Path de cada objeto: {conta_id}/{exame_id}/{nome}.
-- RLS em storage.objects usa o mesmo par auth_conta_id()/auth_role()
-- de 003-contas-e-perfis.sql (já executável por authenticated, sem
-- grant adicional) comparando o primeiro segmento do path com a
-- conta do usuário — mesma lógica de isolamento das tabelas.
--
-- exame_arquivos guarda o vínculo exame -> objeto no bucket. Sem
-- conta_id próprio: herda a conta do exame, igual exame_valores.
--
-- Rodar depois do 003, 004 e 005.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('exames-arquivos', 'exames-arquivos', false)
on conflict (id) do nothing;

drop policy if exists "exames_arquivos_select_por_conta" on storage.objects;
create policy "exames_arquivos_select_por_conta" on storage.objects
for select using (
  bucket_id = 'exames-arquivos'
  and (
    auth_role() = 'admin'
    or (storage.foldername(name))[1] = auth_conta_id()::text
  )
);

drop policy if exists "exames_arquivos_insert_por_conta" on storage.objects;
create policy "exames_arquivos_insert_por_conta" on storage.objects
for insert with check (
  bucket_id = 'exames-arquivos'
  and (
    auth_role() = 'admin'
    or (storage.foldername(name))[1] = auth_conta_id()::text
  )
);

create table if not exists exame_arquivos (
  id uuid primary key default gen_random_uuid(),
  exame_id uuid not null references exames(id) on delete cascade,
  caminho text not null,
  nome_original text not null,
  tipo_mime text not null,
  criado_em timestamptz not null default now()
);

create index if not exists exame_arquivos_exame_id_idx on exame_arquivos(exame_id);

alter table exame_arquivos enable row level security;

drop policy if exists "por_conta" on exame_arquivos;
create policy "por_conta" on exame_arquivos for all
  using (
    auth_role() = 'admin'
    or exists (
      select 1 from exames
      where exames.id = exame_arquivos.exame_id
        and exames.conta_id = auth_conta_id()
    )
  )
  with check (
    auth_role() = 'admin'
    or exists (
      select 1 from exames
      where exames.id = exame_arquivos.exame_id
        and exames.conta_id = auth_conta_id()
    )
  );
