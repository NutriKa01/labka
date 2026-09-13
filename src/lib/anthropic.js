/**
 * Fetch cru para a API da Anthropic — mesmo padrão do moto-taxa, sem
 * SDK. Só server-side: `ANTHROPIC_API_KEY` não é NEXT_PUBLIC_.
 */
export async function perguntarClaude(prompt, { maxTokens = 1200 } = {}) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Falha ao falar com a Anthropic.");
  }

  return data.content[0].text.trim();
}
