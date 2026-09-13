import { createBrowserClient } from "@supabase/ssr";
import { lerEnvSupabase } from "./env";

/**
 * Cliente do NAVEGADOR. Use dentro de componente "use client".
 *
 * Grava a sessao em COOKIE em vez de localStorage, o que permite o
 * servidor (proxy, server component) enxergar quem esta logado.
 */
export function criarClienteNavegador() {
  const { url, anonKey } = lerEnvSupabase();
  return createBrowserClient(url, anonKey);
}
