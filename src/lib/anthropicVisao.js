/**
 * Fetch cru pra API da Anthropic com visão — mesmo padrão de anthropic.js,
 * mas monta um bloco multimodal (document/image) + texto. Só server-side:
 * ANTHROPIC_API_KEY não é NEXT_PUBLIC_.
 */

function montarPrompt(marcadores) {
  const catalogo = marcadores
    .map((m) => `- id: ${m.id} | nome: ${m.nome} | unidade: ${m.unidade ?? "—"}`)
    .join("\n");

  return `Você é um assistente que lê laudos de exames laboratoriais e extrai valores de marcadores.

Catálogo de marcadores cadastrados (use exatamente o "id" de um destes, nunca invente um id):
${catalogo}

Analise o documento anexado (laudo de exame) e identifique quais marcadores do catálogo acima aparecem nele, com seus valores numéricos.

Responda SOMENTE com um JSON estrito, sem markdown, sem texto antes ou depois, no formato:
[{"marcador_id": "<uuid do catálogo>", "valor": <número>, "confianca": "alta" | "revisar"}]

Regras:
- Use "alta" quando o nome do marcador e o valor no documento estão claros e sem ambiguidade.
- Use "revisar" quando houver dúvida razoável (grafia diferente, valor pouco legível, unidade divergente).
- Não inclua marcadores que não aparecem no documento.
- Não invente marcador_id fora do catálogo fornecido.
- Se nenhum marcador for identificado, responda com um array vazio: []`;
}

export async function extrairMarcadoresDoArquivo({ bytesBase64, tipoMime, marcadores }) {
  const blocoArquivo =
    tipoMime === "application/pdf"
      ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: bytesBase64 } }
      : { type: "image", source: { type: "base64", media_type: tipoMime, data: bytesBase64 } };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [blocoArquivo, { type: "text", text: montarPrompt(marcadores) }],
        },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Falha ao falar com a Anthropic.");
  }

  const texto = data.content[0].text.trim();

  let bruto;
  try {
    bruto = JSON.parse(texto);
  } catch {
    throw new Error("A IA retornou uma resposta em formato inesperado.");
  }

  if (!Array.isArray(bruto)) {
    throw new Error("A IA retornou uma resposta em formato inesperado.");
  }

  const idsValidos = new Set(marcadores.map((m) => m.id));

  return bruto.filter(
    (item) =>
      item &&
      typeof item.marcador_id === "string" &&
      idsValidos.has(item.marcador_id) &&
      typeof item.valor === "number" &&
      (item.confianca === "alta" || item.confianca === "revisar")
  );
}
