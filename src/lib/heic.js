import convert from "heic-convert";

/**
 * Converte HEIC/HEIF para JPEG só pra mandar pra IA — a Anthropic não
 * aceita HEIC como imagem. O arquivo original (HEIC) continua sendo o
 * que é salvo no Storage, sem alteração.
 */
export async function converterHeicParaJpeg(bytes) {
  const jpegBuffer = await convert({
    buffer: bytes,
    format: "JPEG",
    quality: 0.9,
  });

  return Buffer.from(jpegBuffer);
}
