-- Campos de assinatura profissional, usados no bloco de assinatura da
-- Sugestão de Suplementação (PDF). Nullable: contas existentes continuam
-- funcionando, o bloco de assinatura só omite a linha até a nutricionista
-- preencher (por ora, direto no SQL Editor do Supabase — sem tela própria).
alter table contas add column if not exists nome_profissional text;
alter table contas add column if not exists crn text;
alter table contas add column if not exists cidade text;
