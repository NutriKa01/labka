import { criarClienteServidor } from "./supabase/server";

/**
 * Lista pra /admin: todas as contas com contagem de pacientes e o
 * ultimo login de algum perfil daquela conta. A trava de "so admin
 * ve isto" mora dentro da funcao SQL (`admin_lista_contas`), nao
 * aqui — ver 005-admin-lista-contas.sql.
 */
export async function listarContasComAcesso() {
  const supabase = await criarClienteServidor();

  const { data, error } = await supabase.rpc("admin_lista_contas");

  if (error) return { ok: false, erro: error.message };
  return { ok: true, resultado: data ?? [] };
}
