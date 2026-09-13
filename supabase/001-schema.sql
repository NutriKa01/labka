-- ============================================================
-- 001 — SCHEMA BASE
--
-- Cinco tabelas do MVP: pacientes, catálogo de marcadores (fixo),
-- exames e os valores lançados por exame.
--
-- RLS: conta única da nutricionista, sem multi-tenant. A policy só
-- precisa checar `auth.uid() is not null` — não há "dono" por linha
-- porque só existe um usuário autenticado possível neste produto.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists pacientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  sexo text not null check (sexo in ('feminino', 'masculino')),
  data_nascimento date not null,
  altura numeric,
  telefone text,
  criado_em timestamptz not null default now()
);

create table if not exists categorias_marcadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  ordem int not null default 0
);

create table if not exists marcadores (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references categorias_marcadores(id) on delete cascade,
  nome text not null,
  valor_ideal_min numeric,
  valor_ideal_max numeric,
  unidade text
);

create table if not exists exames (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  data_exame date not null,
  peso_kg numeric
);

create table if not exists exame_valores (
  id uuid primary key default gen_random_uuid(),
  exame_id uuid not null references exames(id) on delete cascade,
  marcador_id uuid not null references marcadores(id) on delete restrict,
  valor numeric not null,
  unique (exame_id, marcador_id)
);

create index if not exists exame_valores_exame_id_idx on exame_valores(exame_id);
create index if not exists exames_paciente_id_idx on exames(paciente_id);
create index if not exists marcadores_categoria_id_idx on marcadores(categoria_id);

alter table pacientes enable row level security;
alter table categorias_marcadores enable row level security;
alter table marcadores enable row level security;
alter table exames enable row level security;
alter table exame_valores enable row level security;

-- pacientes / exames / exame_valores: leitura e escrita completas
-- para qualquer sessão autenticada (a única sessão possível é a da
-- nutricionista).
drop policy if exists "autenticado_tudo" on pacientes;
create policy "autenticado_tudo" on pacientes for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "autenticado_tudo" on exames;
create policy "autenticado_tudo" on exames for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "autenticado_tudo" on exame_valores;
create policy "autenticado_tudo" on exame_valores for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- categorias_marcadores / marcadores: catálogo fixo. Leitura para
-- qualquer sessão autenticada; escrita só via SQL editor (sem tela
-- de administração na Fase 1).
drop policy if exists "autenticado_le" on categorias_marcadores;
create policy "autenticado_le" on categorias_marcadores for select
  using (auth.uid() is not null);

drop policy if exists "autenticado_le" on marcadores;
create policy "autenticado_le" on marcadores for select
  using (auth.uid() is not null);
