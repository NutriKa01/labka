import { criarExameComValores } from "../../../lib/examesRepository";

export async function POST(request) {
  try {
    const dados = await request.json();
    const resultado = await criarExameComValores(dados);

    if (!resultado.ok) {
      return Response.json({ ok: false, erro: resultado.erro }, { status: 400 });
    }
    return Response.json(resultado);
  } catch (error) {
    return Response.json({ ok: false, erro: error.message }, { status: 500 });
  }
}
