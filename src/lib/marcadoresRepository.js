import { criarClienteServidor } from "./supabase/server";

/**
 * Catálogo fixo de categorias e marcadores. Só leitura na Fase 1 —
 * escrita é feita direto no SQL editor do Supabase.
 */
export async function listarCategoriasComMarcadores() {
  const supabase = await criarClienteServidor();

  const { data, error } = await supabase
    .from("categorias_marcadores")
    .select(
      "id, nome, ordem, marcadores(id, nome, valor_ideal_min, valor_ideal_max, unidade)"
    )
    .order("ordem", { ascending: true });

  if (error) return { ok: false, erro: error.message };
  return { ok: true, resultado: data ?? [] };
}

export async function listarMarcadores() {
  const supabase = await criarClienteServidor();

  const { data, error } = await supabase
    .from("marcadores")
    .select("id, categoria_id, nome, valor_ideal_min, valor_ideal_max, unidade");

  if (error) return { ok: false, erro: error.message };
  return { ok: true, resultado: data ?? [] };
}
