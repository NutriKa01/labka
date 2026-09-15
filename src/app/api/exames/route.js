import { criarExameComValores } from "../../../lib/examesRepository";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const pacienteId = formData.get("pacienteId");
    const dataExame = formData.get("dataExame");
    const pesoKgRaw = formData.get("pesoKg");
    const pesoKg = pesoKgRaw ? Number(pesoKgRaw) : null;
    const valores = JSON.parse(formData.get("valores"));
    const arquivoFile = formData.get("arquivo");

    let arquivo = null;
    if (arquivoFile && arquivoFile.size > 0) {
      arquivo = {
        bytes: Buffer.from(await arquivoFile.arrayBuffer()),
        nome: arquivoFile.name,
        tipoMime: arquivoFile.type,
      };
    }

    const resultado = await criarExameComValores({
      pacienteId,
      dataExame,
      pesoKg,
      valores,
      arquivo,
    });

    if (!resultado.ok) {
      return Response.json({ ok: false, erro: resultado.erro }, { status: 400 });
    }
    return Response.json(resultado);
  } catch (error) {
    return Response.json({ ok: false, erro: error.message }, { status: 500 });
  }
}
