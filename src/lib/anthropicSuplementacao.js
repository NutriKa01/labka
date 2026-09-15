/**
 * Fetch cru pra API da Anthropic — mesmo padrão de anthropic.js, mas pede
 * resposta em JSON estrito (uma sugestão de suplementação por marcador
 * fora da faixa ideal). Só server-side: ANTHROPIC_API_KEY não é NEXT_PUBLIC_.
 */

function montarPrompt({ paciente, exame, itens }) {
  const lista = itens
    .map(
      (item) =>
        `- id: ${item.marcador_id} | nome: ${item.nome} | valor lançado: ${item.valor}${
          item.unidade ? " " + item.unidade : ""
        } | faixa ideal: ${item.faixaIdealMin}–${item.faixaIdealMax}${
          item.unidade ? " " + item.unidade : ""
        }`
    )
    .join("\n");

  return `Você é um assistente de apoio para uma nutricionista clínica, especializado em suplementação ortomolecular.

Paciente: ${paciente.nome}, sexo ${paciente.sexo}.
Exame de ${exame.data_exame}.

Os marcadores abaixo estão fora da faixa ideal neste exame:
${lista}

Para CADA marcador da lista acima, sugira uma suplementação. Responda SOMENTE com um JSON estrito, sem markdown, sem texto antes ou depois, no formato:
[{"marcador_id": "<id exato da lista acima>", "nutriente": "...", "forma": "...", "dosagem": "...", "frequencia": "...", "duracao": "...", "reavaliacao": "..."}]

Regras:
- Use exatamente um "marcador_id" da lista fornecida, nunca invente um id nem deixe de fora nenhum item da lista.
- "nutriente": nome do suplemento sugerido.
- "forma": forma farmacêutica (cápsula, gotas, pó, etc.).
- "dosagem": dose sugerida por tomada.
- "frequencia": quantas vezes ao dia/semana.
- "duracao": por quanto tempo manter o uso.
- "reavaliacao": quando reavaliar esse marcador (ex: "reexame em 60 dias").
- Não prescreva medicamentos, apenas suplementos nutricionais.
- Não invente marcador fora da lista fornecida.`;
}

export async function sugerirSuplementacao({ paciente, exame, itens }) {
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
      messages: [{ role: "user", content: montarPrompt({ paciente, exame, itens }) }],
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

  const idsValidos = new Set(itens.map((item) => item.marcador_id));
  const camposTexto = ["nutriente", "forma", "dosagem", "frequencia", "duracao", "reavaliacao"];

  return bruto.filter(
    (item) =>
      item &&
      typeof item.marcador_id === "string" &&
      idsValidos.has(item.marcador_id) &&
      camposTexto.every((campo) => typeof item[campo] === "string" && item[campo].trim() !== "")
  );
}
