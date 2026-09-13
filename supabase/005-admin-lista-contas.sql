-- ============================================================
-- 005 — LISTA DE CONTAS PARA O /admin
--
-- security definer pelo mesmo motivo de auth_role()/auth_conta_id()
-- (003): e o unico jeito de ler auth.users.last_sign_in_at (schema
-- auth nao e exposto via API) e de contar pacientes de TODAS as
-- contas numa unica query, sem depender de RLS linha a linha.
--
-- O `where auth_role() = 'admin'` dentro da função é a trava: quem
-- não for admin chama e recebe zero linhas, mesmo com o definer.
--
-- Rodar depois do 003 e 004.
-- ============================================================

create or replace function admin_lista_contas()
returns table (
  id uuid,
  nome_consultorio text,
  criado_em timestamptz,
  total_pacientes bigint,
  ultimo_acesso timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    c.id,
    c.nome_consultorio,
    c.criado_em,
    coalesce(p.total, 0) as total_pacientes,
    u.ultimo_acesso
  from contas c
  left join (
    select conta_id, count(*) as total
    from pacientes
    group by conta_id
  ) p on p.conta_id = c.id
  left join (
    select pf.conta_id, max(au.last_sign_in_at) as ultimo_acesso
    from perfis pf
    join auth.users au on au.id = pf.user_id
    group by pf.conta_id
  ) u on u.conta_id = c.id
  where auth_role() = 'admin'
  order by c.nome_consultorio;
$$;

revoke all on function admin_lista_contas() from public;
grant execute on function admin_lista_contas() to authenticated;
