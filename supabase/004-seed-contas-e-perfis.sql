-- ============================================================
-- 004 — SEED DE CONTA INICIAL E PERFIS
--
-- Rodar DEPOIS de:
--   1) aplicar 003-contas-e-perfis.sql
--   2) criar os dois usuários manualmente em
--      Supabase Dashboard → Authentication → Users → Add user
--      (marcar "Auto Confirm User"):
--        - kp.nutricionista@gmail.com   → papel nutricionista
--        - guilherme_fvb@hotmail.com    → papel admin
--
-- Não contém segredo nenhum (nenhuma senha) — só referencia os
-- usuários pelo e-mail, que já vão existir em auth.users.
--
-- Idempotente: pode rodar de novo sem duplicar.
-- ============================================================

-- Conta inicial (o consultório da nutricionista). cor_destaque/cor_fundo
-- é a paleta bordô/dourado/creme original — vira a personalização dela,
-- não o padrão da plataforma (que agora é pedra/carvão).
insert into contas (nome_consultorio, cor_destaque, cor_fundo, ferramentas_habilitadas)
select 'Consultório KP Nutrição', '#b8862f', '#f8f2e7', '{}'::jsonb
where not exists (select 1 from contas where nome_consultorio = 'Consultório KP Nutrição');

-- Vincula a nutricionista à conta acima.
insert into perfis (user_id, conta_id, role)
select
  u.id,
  (select id from contas where nome_consultorio = 'Consultório KP Nutrição'),
  'nutricionista'
from auth.users u
where u.email = 'kp.nutricionista@gmail.com'
on conflict (user_id) do update set
  conta_id = excluded.conta_id,
  role = excluded.role;

-- Admin: não pertence a um consultório específico, mas o schema
-- exige conta_id em perfis — associa à mesma conta inicial (o
-- bypass de admin nas policies ignora essa amarração na prática).
insert into perfis (user_id, conta_id, role)
select
  u.id,
  (select id from contas where nome_consultorio = 'Consultório KP Nutrição'),
  'admin'
from auth.users u
where u.email = 'guilherme_fvb@hotmail.com'
on conflict (user_id) do update set
  role = excluded.role;

-- Pacientes/exames já lançados antes da migration 003 ficam com
-- conta_id nulo — associa tudo à conta inicial para não perder dado.
update pacientes set conta_id = (select id from contas where nome_consultorio = 'Consultório KP Nutrição')
where conta_id is null;

update exames set conta_id = (select id from contas where nome_consultorio = 'Consultório KP Nutrição')
where conta_id is null;
