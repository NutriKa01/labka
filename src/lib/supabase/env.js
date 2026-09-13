/**
 * Le e valida as duas variaveis do Supabase.
 *
 * A validacao acontece na CHAMADA e nao no import: um `throw` no
 * topo do modulo derruba o build inteiro da Vercel se a variavel
 * nao estiver configurada la. Falhando na chamada, o erro aparece na
 * requisicao com o nome da variavel que falta.
 *
 * As duas sao NEXT_PUBLIC_ de proposito. A anon key vai mesmo para
 * o navegador: ela nao autoriza nada sozinha, quem autoriza e a RLS
 * (ver supabase/001-schema.sql). A service_role key, essa sim, nunca
 * pode aparecer em NEXT_PUBLIC_ nem no repo.
 */
export function lerEnvSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    const faltando = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !anonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ].filter(Boolean);

    throw new Error(
      `Supabase não configurado: falta ${faltando.join(" e ")}. ` +
        `Local: copie .env.local.example para .env.local e reinicie o ` +
        `servidor. Produção: cadastre na Vercel em Settings > ` +
        `Environment Variables e faça um novo deploy.`
    );
  }

  return { url, anonKey };
}
