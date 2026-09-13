/**
 * Deriva o restante da paleta de conta (ink, dim, linhas, superfície,
 * variações do acento) a partir só dos dois campos que a conta guarda
 * (`cor_destaque`, `cor_fundo`) — sem precisar de mais colunas no banco.
 *
 * Decide claro/escuro pela luminância do fundo: se a conta escolher um
 * fundo escuro, o texto vira claro automaticamente (e vice-versa).
 */

function hexParaRgb(hex) {
  const limpo = hex.replace("#", "");
  const seis =
    limpo.length === 3
      ? limpo
          .split("")
          .map((c) => c + c)
          .join("")
      : limpo;
  const num = parseInt(seis, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbParaHex({ r, g, b }) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.round(Math.min(255, Math.max(0, v)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function misturar(hexBase, hexAlvo, quantidade) {
  const a = hexParaRgb(hexBase);
  const b = hexParaRgb(hexAlvo);
  return rgbParaHex({
    r: a.r + (b.r - a.r) * quantidade,
    g: a.g + (b.g - a.g) * quantidade,
    b: a.b + (b.b - a.b) * quantidade,
  });
}

function luminanciaRelativa(hex) {
  const { r, g, b } = hexParaRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Retorna um objeto de CSS custom properties pra aplicar via `style`
 * num wrapper, ou `null` se a conta ainda não tem cor definida (nesse
 * caso a área logada cai no fallback padrão da plataforma).
 */
export function construirTemaConta(conta) {
  if (!conta?.cor_destaque || !conta?.cor_fundo) return null;

  const ground = conta.cor_fundo;
  const accent = conta.cor_destaque;
  const clara = luminanciaRelativa(ground) > 0.6;

  const preto = "#15100d";
  const branco = "#ffffff";

  const ink = clara ? misturar(ground, preto, 0.9) : misturar(ground, branco, 0.92);
  const dim = clara ? misturar(ground, preto, 0.55) : misturar(ground, branco, 0.6);
  const line = clara ? misturar(ground, preto, 0.12) : misturar(ground, branco, 0.16);
  const lineForte = clara ? misturar(ground, preto, 0.22) : misturar(ground, branco, 0.28);
  const surface = clara ? misturar(ground, branco, 0.35) : misturar(ground, branco, 0.15);
  const accentClaro = misturar(accent, branco, 0.18);
  const accentVeu = clara ? misturar(accent, branco, 0.88) : misturar(accent, ground, 0.75);

  return {
    "--color-ground": ground,
    "--color-surface": surface,
    "--color-ink": ink,
    "--color-dim": dim,
    "--color-line": line,
    "--color-line-strong": lineForte,
    "--color-accent": accent,
    "--color-accent-light": accentClaro,
    "--color-accent-veil": accentVeu,
  };
}
