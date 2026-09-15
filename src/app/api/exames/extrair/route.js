import { listarMarcadores } from "../../../../lib/marcadoresRepository";
import { extrairMarcadoresDoArquivo } from "../../../../lib/anthropicVisao";
import { converterHeicParaJpeg } from "../../../../lib/heic";

const TIPOS_HEIC = ["image/heic", "image/heif"];
const TIPOS_ACEITOS = ["application/pdf", "image/jpeg", "image/png", ...TIPOS_HEIC];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const arquivo = formData.get("arquivo");

    if (!arquivo) {
      return Response.json({ ok: false, erro: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      return Response.json(
        { ok: false, erro: "Formato de arquivo não suportado. Use PDF, JPG, PNG ou HEIC." },
        { status: 400 }
      );
    }

    const { ok: okMarcadores, resultado: marcadores, erro: erroMarcadores } = await listarMarcadores();
    if (!okMarcadores) {
      return Response.json({ ok: false, erro: erroMarcadores }, { status: 400 });
    }

    let bytes = Buffer.from(await arquivo.arrayBuffer());
    let tipoMime = arquivo.type;

    if (TIPOS_HEIC.includes(tipoMime)) {
      bytes = await converterHeicParaJpeg(bytes);
      tipoMime = "image/jpeg";
    }

    const resultado = await extrairMarcadoresDoArquivo({
      bytesBase64: bytes.toString("base64"),
      tipoMime,
      marcadores,
    });

    return Response.json({ ok: true, resultado });
  } catch (error) {
    return Response.json({ ok: false, erro: error.message }, { status: 500 });
  }
}
