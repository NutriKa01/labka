-- ============================================================
-- 003 — CONTAS E PERFIS (multi-tenant)
--
-- Vira o produto de "conta única da nutricionista" para multi-conta:
-- cada conta é um consultório/nutricionista que assina o produto,
-- com suas próprias ferramentas habilitadas. Um usuário de auth
-- (auth.users) tem um perfil (perfis) que diz a que conta ele
-- pertence e qual seu papel (admin vê tudo, nutricionista só a
-- própria conta).
--
-- Rodar depois do 001 e 002. Idempotente onde possível (create if
-- not exists / drop policy if exists), mas os ALTER TABLE de conta_id
-- assumem que ainda não foram aplicados — rodar uma única vez.
-- ============================================================

-- cor_destaque / cor_fundo (hex, ex. '#b8862f'): sobrescrevem os tokens
-- --color-accent / --color-ground só dentro da área logada dessa conta.
-- Nulo = a conta usa o fallback sólido da paleta padrão da plataforma.
create table if not exists contas (
  id uuid primary key default gen_random_uuid(),
  nome_consultorio text not null,
  logo_url text,
  cor_destaque text,
  cor_fundo text,
  ferramentas_habilitadas jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

create table if not exists perfis (
  user_id uuid primary key references auth.users(id) on delete cascade,
  conta_id uuid not null references contas(id) on delete restrict,
  role text not null check (role in ('admin', 'nutricionista')),
  criado_em timestamptz not null default now()
);

alter table contas enable row level security;
alter table perfis enable row level security;

-- ------------------------------------------------------------
-- conta_id nas tabelas de dado de paciente
-- ------------------------------------------------------------

alter table pacientes add column if not exists conta_id uuid references contas(id) on delete restrict;
alter table exames add column if not exists conta_id uuid references contas(id) on delete restrict;

create index if not exists pacientes_conta_id_idx on pacientes(conta_id);
create index if not exists exames_conta_id_idx on exames(conta_id);

-- ------------------------------------------------------------
-- Helpers de RLS: papel e conta do usuário autenticado.
-- security definer + search_path fixo para poder ser lida dentro
-- das próprias policies de `perfis` sem recursão infinita.
-- ------------------------------------------------------------

create or replace function auth_conta_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select conta_id from perfis where user_id = auth.uid();
$$;

create or replace function auth_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from perfis where user_id = auth.uid();
$$;

-- ------------------------------------------------------------
-- Policies: perfis
-- Cada usuário lê o próprio perfil; admin lê todos.
-- ------------------------------------------------------------

drop policy if exists "le_proprio_perfil" on perfis;
create policy "le_proprio_perfil" on perfis for select
  using (user_id = auth.uid() or auth_role() = 'admin');

drop policy if exists "admin_gerencia_perfis" on perfis;
create policy "admin_gerencia_perfis" on perfis for all
  using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- ------------------------------------------------------------
-- Policies: contas
-- nutricionista lê só a própria conta; admin acessa (lê/escreve) todas.
-- ------------------------------------------------------------

drop policy if exists "le_propria_conta" on contas;
create policy "le_propria_conta" on contas for select
  using (id = auth_conta_id() or auth_role() = 'admin');

drop policy if exists "admin_gerencia_contas" on contas;
create policy "admin_gerencia_contas" on contas for all
  using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- ------------------------------------------------------------
-- Policies: pacientes / exames / exame_valores
-- Substituem "autenticado_tudo" (RLS de conta única) por checagem
-- de conta_id, com bypass total para admin.
-- ------------------------------------------------------------

drop policy if exists "autenticado_tudo" on pacientes;
create policy "por_conta" on pacientes for all
  using (conta_id = auth_conta_id() or auth_role() = 'admin')
  with check (conta_id = auth_conta_id() or auth_role() = 'admin');

drop policy if exists "autenticado_tudo" on exames;
create policy "por_conta" on exames for all
  using (conta_id = auth_conta_id() or auth_role() = 'admin')
  with check (conta_id = auth_conta_id() or auth_role() = 'admin');

-- exame_valores não tem conta_id próprio: herda a conta do exame.
drop policy if exists "autenticado_tudo" on exame_valores;
create policy "por_conta" on exame_valores for all
  using (
    auth_role() = 'admin'
    or exists (
      select 1 from exames
      where exames.id = exame_valores.exame_id
        and exames.conta_id = auth_conta_id()
    )
  )
  with check (
    auth_role() = 'admin'
    or exists (
      select 1 from exames
      where exames.id = exame_valores.exame_id
        and exames.conta_id = auth_conta_id()
    )
  );

-- categorias_marcadores / marcadores continuam catálogo global,
-- compartilhado por todas as contas — sem mudança de policy aqui.
