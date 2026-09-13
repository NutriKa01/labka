# Identidade visual — Labka

Design system fechado do projeto. Qualquer tela ou componente novo deve seguir
este documento — não reabrir a discussão de paleta/tipografia a cada feature.

Duas camadas, não confundir:

1. **Plataforma (shell)** — login, favicon, e qualquer painel de admin
   exibido *antes* de entrar numa conta. É a marca "Lab.Ka" em si.
2. **Conta** — depois que a nutricionista entra na própria conta, a área
   logada (`(app)/*`) veste a cor daquela conta. Não é mais um valor fixo
   deste documento; vem do banco (`contas.cor_destaque` / `cor_fundo`, ver
   `src/lib/tema.js`).

## Paleta da plataforma (shell)

Referência: "pedra bruta" — carvão quente + pedra, nunca preto/cinza frio de
dashboard genérico. Acento é o gradiente metálico dourado→verde-petróleo da
marca, usado com moderação (ícone, um destaque pontual) — nunca como fundo
nem espalhado em vários elementos da mesma tela.

```css
:root {
  --color-ground: #2b2927;   /* fundo externo, carvão quente */
  --color-surface: #8c8280;  /* painéis/cards, pedra/taupe */
  --color-ink: #f3efe9;
  --color-dim: #c9c2bc;
  --color-line: #423e3a;
  --color-line-strong: #55504b;

  --color-accent: #d4af37;        /* dourado — fallback sólido */
  --color-accent-light: #e0c364;
  --color-accent-veil: #46402f;

  --gradient-gold: linear-gradient(135deg, #8a6a1f 0%, #d4af37 35%, #f7e28c 60%, #b8860b 100%);
  --gradient-teal: linear-gradient(135deg, #0d3d36 0%, #1f5c52 35%, #4fd1c5 60%, #144840 100%);

  --shadow-glow-gold: 0 0 12px rgba(212, 175, 55, 0.25);
  --shadow-glow-teal: 0 0 12px rgba(79, 209, 197, 0.25);
}
```

Regras de uso:
- O gradiente metálico (`--gradient-gold` / `--gradient-teal`) é de 4 pontos —
  sombra → base → brilho → sombra — pra simular reflexo, nunca um degradê
  plano de 2 cores. Ângulo fixo 135deg.
- Onde aplicar o gradiente: o monograma/ícone da marca, o wordmark do login,
  e no máximo **um** destaque a mais na tela de login (hoje: glow sutil no
  hover do botão primário). Nunca em fundo de tela, card inteiro, ou botão
  sólido preenchido com gradiente.
- Glow (`--shadow-glow-*`) é opcional e sutil (baixa opacidade, ~12px) — dá
  sensação de luz refletindo, não neon. Usar com moderação.
- `--color-sidebar*` (ver mais abaixo) é sempre desta paleta — a sidebar não
  muda de cor por conta.

## Paleta por conta (personalização)

Dentro de `(app)/*`, um wrapper (`src/app/(app)/layout.js` +
`src/lib/tema.js`) sobrescreve `--color-ground`, `--color-surface`,
`--color-ink`, `--color-dim`, `--color-line*`, `--color-accent*` a partir de
só dois campos guardados por conta: `cor_destaque` e `cor_fundo`. O resto
(ink, dim, linhas, variações do acento) é derivado por contraste — a conta
não escolhe cada token individualmente, só a cor de fundo e o acento.

Regras (valem também pra plataforma, exceto onde já dito acima):
- O acento é para ação primária e destaques pontuais (score, CTA principal).
  Não usar em blocos grandes de fundo nem repetir em vários elementos da
  mesma tela.
- Nunca introduzir uma segunda cor saturada além do acento da conta.
  Variações de estado (bom/alerta/ruim) ficam sempre dessaturadas, nunca
  neon — esses tokens (`--color-good/warn/bad`) são fixos, não variam por
  conta.
- **Sem gradientes na área de conta.** Acento é sempre sólido — o gradiente
  metálico é exclusivo da marca Lab.Ka (plataforma), nunca da personalização
  de uma conta específica.
- `--color-sidebar*` não faz parte disso — sidebar fica sempre na paleta da
  plataforma, pra todas as contas (ver acima).

A conta "Consultório KP Nutrição" usa `cor_destaque = #b8862f` (dourado) e
`cor_fundo = #f8f2e7` (creme quente) — a paleta bordô/dourado/creme original
do projeto virou a personalização dela, não o padrão do sistema
(`supabase/004-seed-contas-e-perfis.sql`).

## Tipografia

Contraste clássico serifada + sans-serif — nunca as duas famílias na mesma
função. Vale tanto pra plataforma quanto pra conta.

- **Serifada** (títulos, números grandes, score, métricas de destaque, logo):
  `Fraunces` — carrega peso editorial/alto padrão. Fallback: `Georgia, serif`.
- **Sans-serif** (corpo de texto, formulários, tabelas, navegação):
  `Inter` — limpa, neutra. Fallback: `system-ui, sans-serif`.

Carregar via `next/font/google` em `layout.js`:

```js
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
```

- Rótulos secundários (ex.: "MARCADOR", "VALORES IDEAIS"): sans-serif, texto
  pequeno (`text-xs`), caixa alta, `letter-spacing` aberto (`tracking-wide` ou
  mais).

## Logo

Dois ativos, ambos em `src/components/brand/`, com os stops do gradiente
metálico *hardcoded* (não usam as CSS vars — precisam funcionar em contexto
sem o CSS da página, como o favicon):

- **`LogoMonograma`** — o "K" com folha, em SVG. Uso: favicon (`src/app/
  icon.svg`, mesmo desenho), avatar, sidebar (sempre colapsada/compacta —
  a sidebar não usa o wordmark).
- **`LogoWordmark`** — "Lab.Ka" em serifada com o gradiente dourado
  (`--gradient-gold` via `background-clip: text`). Uso: cabeçalho da tela de
  login. Não usar dentro da área de conta (lá quem aparece é o nome do
  consultório, não a marca da plataforma).

Nunca redesenhar esses ativos por tela — importar os componentes.

## Componentes

**Botões**
- Cantos discretamente arredondados (`--radius-control`, ~6px) — nunca pill,
  nunca 90° reto.
- Primário usa o acento sólido; nunca gradiente preenchendo o botão.
- Rótulos de botão em sans-serif normal (não caixa alta) — caixa alta é só
  para os rótulos secundários de dado (ver Tipografia).

**Cards**
- Fundo `--color-surface` sobre `--color-ground`, distinção sutil (quase sem
  contraste de luminosidade), separação por borda fina de 1px em
  `--color-line`.
- Sem sombra pesada. No máximo uma sombra muito sutil no hover, se necessário.
- Nunca borda grossa (>1px) nem borda colorida.

**Sidebar**
- Sempre na paleta da plataforma (pedra/carvão), nunca na cor da conta.
- Item ativo: leve realce de fundo (um tom só, sem borda colorida lateral
  grossa) ou o acento aplicado apenas ao texto/ícone do item ativo.
- Ícones (quando usados) monocromáticos, nunca coloridos/flutuantes.

**Divisórias e espaçamento**
- Divisórias sempre finas (1px), nunca duplas ou grossas.
- Espaçamento generoso entre seções — preferir espaço em branco a linhas de
  separação quando possível.

## O que evitar

- Preto puro ou cinza frio de dashboard genérico.
- Branco puro no fundo de conteúdo.
- Cores pastéis apagadas.
- Gradiente fora do lugar permitido (ícone/wordmark/1 destaque no login) —
  em especial, nunca gradiente na área de conta.
- Glow/gradiente exagerado a ponto de parecer "gamer RGB"/neon.
- Sombras pesadas ou cards com borda grossa.
- Ícones flutuantes coloridos, badges neon, emoji.
- Duas fontes serifadas ou duas fontes sans na mesma tela.
