/**
 * Cálculo puro do score geral de um exame: percentual de marcadores
 * lançados cujo valor caiu dentro da faixa ideal do marcador.
 *
 * Marcadores sem faixa definida (min e max nulos) são ignorados no
 * denominador — não dá para julgar "dentro" ou "fora" sem faixa.
 *
 * `valores` é a lista de exame_valores (com `marcador_id` e `valor`),
 * `marcadores` é o catálogo (com `id`, `valor_ideal_min`, `valor_ideal_max`).
 */
export function calcularScore(valores, marcadores) {
  const porId = new Map(marcadores.map((m) => [m.id, m]));

  let avaliados = 0;
  let dentroDaFaixa = 0;

  for (const v of valores) {
    const marcador = porId.get(v.marcador_id);
    if (!marcador) continue;
    if (marcador.valor_ideal_min == null || marcador.valor_ideal_max == null) {
      continue;
    }

    avaliados += 1;
    if (v.valor >= marcador.valor_ideal_min && v.valor <= marcador.valor_ideal_max) {
      dentroDaFaixa += 1;
    }
  }

  if (avaliados === 0) return null;
  return Math.round((dentroDaFaixa / avaliados) * 100);
}

/**
 * Status de um único valor frente à faixa ideal do seu marcador.
 * Usado na matriz de marcadores para colorir cada célula.
 */
export function statusValor(valor, marcador) {
  if (marcador.valor_ideal_min == null || marcador.valor_ideal_max == null) {
    return "default";
  }
  return valor >= marcador.valor_ideal_min && valor <= marcador.valor_ideal_max
    ? "good"
    : "bad";
}
