import { criarClienteServidor } from "./supabase/server";

/**
 * Repository de pacientes. Componentes nunca chamam `.from()` direto
 * — sempre passam por aqui, para manter a query em um lugar só.
 */

export async function listarPacientes() {
  const supabase = await criarClienteServidor();

  const { data, error } = await supabase
    .from("pacientes")
    .select("id, nome, sexo, data_nascimento, altura, telefone, criado_em")
    .order("nome", { ascending: true });

  if (error) return { ok: false, erro: error.message };
  return { ok: true, resultado: data ?? [] };
}

export async function buscarPaciente(id) {
  const supabase = await criarClienteServidor();

  const { data, error } = await supabase
    .from("pacientes")
    .select("id, nome, sexo, data_nascimento, altura, telefone, criado_em")
    .eq("id", id)
    .maybeSingle();

  if (error) return { ok: false, erro: error.message };
  return { ok: true, resultado: data ?? null };
}

export async function criarPaciente(dados) {
  const supabase = await criarClienteServidor();

  const { data, error } = await supabase
    .from("pacientes")
    .insert({
      nome: dados.nome.trim(),
      sexo: dados.sexo,
      data_nascimento: dados.data_nascimento,
      altura: dados.altura || null,
      telefone: dados.telefone?.trim() || null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, erro: error.message };
  return { ok: true, resultado: data };
}
