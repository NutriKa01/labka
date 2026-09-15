import { buscarExame } from "../../../../../lib/examesRepository";
import { listarMarcadores } from "../../../../../lib/marcadoresRepository";
import { buscarPaciente } from "../../../../../lib/pacientesRepository";
import { statusValor } from "../../../../../lib/score";
import { sugerirSuplementacao } from "../../../../../lib/anthropicSuplementacao";

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const [exameRes, marcadoresRes] = await Promise.all([
      buscarExame(id),
      listarMarcadores(),
    ]);

    if (!exameRes.ok) return Response.json({ ok: false, erro: exameRes.erro }, { status: 400 });
    if (!exameRes.resultado) {
      return Response.json({ ok: false, erro: "Exame não encontrado." }, { status: 404 });
    }
    if (!marcadoresRes.ok) return Response.json({ ok: false, erro: marcadoresRes.erro }, { status: 400 });

    const pacienteRes = await buscarPaciente(exameRes.resultado.paciente_id);
    if (!pacienteRes.ok) return Response.json({ ok: false, erro: pacienteRes.erro }, { status: 400 });
    if (!pacienteRes.resultado) {
      return Response.json({ ok: false, erro: "Paciente não encontrado." }, { status: 404 });
    }

    const marcadoresPorId = new Map(marcadoresRes.resultado.map((m) => [m.id, m]));

    const itensForaDaFaixa = exameRes.resultado.exame_valores
      .map((v) => {
        const marcador = marcadoresPorId.get(v.marcador_id);
        if (!marcador) return null;
        if (statusValor(v.valor, marcador) !== "bad") return null;
        return {
          marcador_id: marcador.id,
          nome: marcador.nome,
          valor: v.valor,
          unidade: marcador.unidade,
          faixaIdealMin: marcador.valor_ideal_min,
          faixaIdealMax: marcador.valor_ideal_max,
        };
      })
      .filter(Boolean);

    if (itensForaDaFaixa.length === 0) {
      return Response.json({ ok: true, resultado: [] });
    }

    const sugestoes = await sugerirSuplementacao({
      paciente: pacienteRes.resultado,
      exame: exameRes.resultado,
      itens: itensForaDaFaixa,
    });

    return Response.json({ ok: true, resultado: sugestoes });
  } catch (error) {
    return Response.json({ ok: false, erro: error.message }, { status: 500 });
  }
}
