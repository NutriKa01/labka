import { buscarExame } from "../../../lib/examesRepository";
import { listarMarcadores } from "../../../lib/marcadoresRepository";
import { buscarPaciente } from "../../../lib/pacientesRepository";
import { perguntarClaude } from "../../../lib/anthropic";

export async function POST(request) {
  try {
    const { exame_id } = await request.json();
    if (!exame_id) {
      return Response.json({ ok: false, erro: "exame_id é obrigatório." }, { status: 400 });
    }

    const [exameRes, marcadoresRes] = await Promise.all([
      buscarExame(exame_id),
      listarMarcadores(),
    ]);

    if (!exameRes.ok) return Response.json({ ok: false, erro: exameRes.erro }, { status: 400 });
    if (!exameRes.resultado) {
      return Response.json({ ok: false, erro: "Exame não encontrado." }, { status: 404 });
    }
    if (!marcadoresRes.ok) return Response.json({ ok: false, erro: marcadoresRes.erro }, { status: 400 });

    const pacienteRes = await buscarPaciente(exameRes.resultado.paciente_id);
    if (!pacienteRes.ok) return Response.json({ ok: false, erro: pacienteRes.erro }, { status: 400 });

    const marcadoresPorId = new Map(marcadoresRes.resultado.map((m) => [m.id, m]));

    const linhas = exameRes.resultado.exame_valores.map((v) => {
      const m = marcadoresPorId.get(v.marcador_id);
      if (!m) return null;
      const faixa =
        m.valor_ideal_min != null && m.valor_ideal_max != null
          ? `faixa ideal ${m.valor_ideal_min}–${m.valor_ideal_max}${m.unidade ? " " + m.unidade : ""}`
          : "sem faixa cadastrada";
      return `- ${m.nome}: ${v.valor}${m.unidade ? " " + m.unidade : ""} (${faixa})`;
    }).filter(Boolean);

    const prompt = `Você é um assistente de apoio para uma nutricionista clínica.
Paciente: ${pacienteRes.resultado.nome}, sexo ${pacienteRes.resultado.sexo}.
Exame de ${exameRes.resultado.data_exame}${exameRes.resultado.peso_kg ? `, peso ${exameRes.resultado.peso_kg} kg` : ""}.

Marcadores lançados:
${linhas.join("\n")}

Com base apenas nesses valores, escreva uma sugestão de conduta nutricional
objetiva, em português, organizada em tópicos curtos. Não invente exames que
não foram informados. Não prescreva medicamentos.`;

    const texto = await perguntarClaude(prompt);

    return Response.json({ ok: true, resultado: texto });
  } catch (error) {
    return Response.json({ ok: false, erro: error.message }, { status: 500 });
  }
}
