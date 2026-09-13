import { cache } from "react";
import { criarClienteServidor } from "./supabase/server";

/**
 * O usuario logado, validado no Supabase.
 *
 * Sempre `getUser()`, nunca `getSession()`: `getSession` le o cookie
 * e acredita nele, `getUser` manda o token para o Supabase validar.
 *
 * `cache` do React: uma requisicao pode perguntar isto varias vezes
 * (layout, header, pagina) e cada `getUser` e uma ida a rede. Com o
 * cache sao varias chamadas e uma viagem so.
 */
export const lerUsuario = cache(async function lerUsuario() {
  const supabase = await criarClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
});
