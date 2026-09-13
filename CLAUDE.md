# Labka

Painel clínico para a nutricionista lançar exames de pacientes, ver evolução
e receber sugestão de conduta gerada por IA. Uso interno, conta única
(sem multi-tenant).

## Convenções

- **Identidade visual**: antes de criar ou estilizar qualquer tela/componente,
  ler [DESIGN.md](DESIGN.md). É o design system fechado do projeto — paleta,
  tipografia, regras de botão/card/sidebar e o que evitar. Não redecidir isso
  a cada feature.
- **Migrations SQL**: arquivos em `supabase/`, numerados e nomeados por
  conteúdo (`001-schema.sql`, `002-seed-marcadores.sql`, ...). Rodar em ordem
  no SQL Editor do Supabase. Nunca criar usuário via INSERT direto — sempre
  pelo Supabase Auth (tela de cadastro do app ou Auth → Users no painel).
- **Env vars**: `.env.local` (gitignored) com `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY` (server-side only,
  nunca prefixar com `NEXT_PUBLIC_`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
