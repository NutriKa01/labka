# Identidade visual — Labka

Design system fechado do projeto. Qualquer tela ou componente novo deve seguir
este documento — não reabrir a discussão de paleta/tipografia a cada feature.
Referência: "Lab PRO" — consultório de alto padrão, não app de tech/IA.

## Posicionamento

Elegante e sofisticado. O produto deve parecer papelaria de consultório caro,
nunca um dashboard SaaS genérico. Isso significa: sem ícones flutuantes
coloridos, sem badges neon, sem emoji, sem gradientes, sem sombras pesadas,
sem cards de borda grossa.

## Paleta

Sidebar escura (bordô/vinho profundo — **não preto puro**) + conteúdo em
creme/off-white quente (**nunca branco puro nem cinza frio de dashboard**) +
um único acento vivo e saturado, usado com moderação.

```css
:root {
  /* Sidebar */
  --color-sidebar: #3a1420;         /* bordô/vinho profundo, não preto */
  --color-sidebar-ink: #f3e9dd;     /* texto sobre o vinho */
  --color-sidebar-dim: #c9a9a9;     /* texto secundário sobre o vinho */
  --color-sidebar-line: #55232f;    /* divisórias finas dentro da sidebar */
  --color-sidebar-active: #4d1c29;  /* fundo do item de navegação ativo */

  /* Conteúdo */
  --color-ground: #f8f2e7;          /* creme/off-white quente — fundo de página */
  --color-surface: #fffdf9;         /* cards, levemente mais claro que o ground */
  --color-ink: #2a201c;             /* texto principal, marrom quase-preto */
  --color-dim: #7a6f63;             /* texto secundário */
  --color-line: #e8ddc9;            /* divisórias finas */
  --color-line-strong: #d8c9ac;     /* bordas de input/hover */

  /* Acento — cor de marca (dourado é o placeholder; Karol define a final) */
  --color-accent: #b8862f;
  --color-accent-light: #cc9a42;
  --color-accent-veil: #f3e6d0;     /* fundo leve p/ estado selecionado com o acento */

  /* Estados — baixa saturação, não pastel apagado */
  --color-good: #2f6d47;
  --color-good-veil: #e7efe2;
  --color-warn: #a86a1f;
  --color-warn-veil: #f3e9d6;
  --color-bad: #9c3b34;
  --color-bad-veil: #f2e3de;

  --radius-control: 0.375rem;   /* botões/inputs: canto discreto, não pill */
  --radius-card: 0.5rem;
}
```

Regras de uso:
- O acento (`--color-accent`) é para ação primária e destaques pontuais (score,
  CTA principal). Não usar em blocos grandes de fundo nem repetir em vários
  elementos da mesma tela.
- Nunca introduzir uma segunda cor saturada. Variações de estado (bom/alerta/
  ruim) ficam sempre dessaturadas, nunca neon.
- Sem gradientes em nenhum elemento.

## Tipografia

Contraste clássico serifada + sans-serif — nunca as duas famílias na mesma
função.

- **Serifada** (títulos, números grandes, score, métricas de destaque):
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

- Logo da sidebar: sempre na serifada, peso médio/semibold, sem caixa alta.
- Rótulos secundários (ex.: "MARCADOR", "VALORES IDEAIS"): sans-serif, texto
  pequeno (`text-xs`), caixa alta, `letter-spacing` aberto (`tracking-wide` ou
  mais).

## Componentes

**Botões**
- Cantos discretamente arredondados (`--radius-control`, ~6px) — nunca pill,
  nunca 90° reto.
- Primário usa o acento sólido; nunca gradiente.
- Rótulos de botão em sans-serif normal (não caixa alta) — caixa alta é só
  para os rótulos secundários de dado (ver Tipografia).

**Cards**
- Fundo `--color-surface` sobre `--color-ground`, distinção sutil (quase sem
  contraste de luminosidade), separação por borda fina de 1px em
  `--color-line`.
- Sem sombra pesada. No máximo uma sombra muito sutil no hover, se necessário.
- Nunca borda grossa (>1px) nem borda colorida.

**Sidebar**
- Fundo `--color-sidebar-bg`, sempre um vinho/bordô profundo — nunca preto
  puro (`#000`) nem cinza-chumbo neutro.
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
- Gradientes em qualquer elemento.
- Sombras pesadas ou cards com borda grossa.
- Ícones flutuantes coloridos, badges neon, emoji.
- Duas fontes serifadas ou duas fontes sans na mesma tela.
