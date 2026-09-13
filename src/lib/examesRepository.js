import { criarClienteServidor } from "./supabase/server";

/**
 * Repository de exames e seus valores lançados.
 */

export async function listarExamesDoPaciente(pacienteId) {
  const supabase = await criarClienteServidor();

  const { data, error } = await supabase
    .from("exames")
    .select("id, data_exame, peso_kg, exame_valores(marcador_id, valor)")
    .eq("paciente_id", pacienteId)
    .order("data_exame", { ascending: true });

  if (error) return { ok: false, erro: error.message };
  return { ok: true, resultado: data ?? [] };
}

export async function buscarExame(id) {
  const supabase = await criarClienteServidor();

  const { data, error } = await supabase
    .from("exames")
    .select("id, paciente_id, data_exame, peso_kg, exame_valores(marcador_id, valor)")
    .eq("id", id)
    .maybeSingle();

  if (error) return { ok: false, erro: error.message };
  return { ok: true, resultado: data ?? null };
}

/**
 * Cria o exame e insere os valores lançados numa tacada, via RPC
 * seria mais atômico — mas na Fase 1, dois passos sequenciais bastam:
 * se o segundo falhar, o exame fica sem valores e é visível na tela
 * (não há como um exame "meio salvo" enganar a leitura do score).
 */
export async function criarExameComValores({ pacienteId, dataExame, pesoKg, valores }) {
  const supabase = await criarClienteServidor();

  const { data: exame, error: erroExame } = await supabase
    .from("exames")
    .insert({
      paciente_id: pacienteId,
      data_exame: dataExame,
      peso_kg: pesoKg || null,
    })
    .select("id")
    .single();

  if (erroExame) return { ok: false, erro: erroExame.message };

  const linhas = valores
    .filter((v) => v.valor !== "" && v.valor != null)
    .map((v) => ({
      exame_id: exame.id,
      marcador_id: v.marcador_id,
      valor: Number(v.valor),
    }));

  if (linhas.length === 0) {
    return { ok: false, erro: "Lance ao menos um valor de marcador." };
  }

  const { error: erroValores } = await supabase.from("exame_valores").insert(linhas);

  if (erroValores) return { ok: false, erro: erroValores.message };
  return { ok: true, resultado: { id: exame.id } };
}
