import { cache } from "react";
import { criarClienteServidor } from "./supabase/server";
import { lerUsuario } from "./auth";

/**
 * Perfil (role + conta) do usuário logado, com os dados da conta pra
 * montar o tema. `cache`: layout, sidebar e página podem pedir isso na
 * mesma requisição sem repetir a ida ao banco.
 */
export const lerPerfilComConta = cache(async function lerPerfilComConta() {
  const usuario = await lerUsuario();
  if (!usuario) return null;

  const supabase = await criarClienteServidor();

  const { data, error } = await supabase
    .from("perfis")
    .select(
      "role, conta_id, contas ( nome_consultorio, logo_url, cor_destaque, cor_fundo, nome_profissional, crn, cidade )"
    )
    .eq("user_id", usuario.id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    role: data.role,
    contaId: data.conta_id,
    conta: data.contas ?? null,
  };
});
