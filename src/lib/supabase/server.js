import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { lerEnvSupabase } from "./env";

/**
 * Cliente do SERVIDOR. Use em server component, route handler e
 * server action.
 *
 * Sobre o try/catch do setAll: server component so pode ler cookie,
 * nao escrever. Quando a lib tenta renovar um token expirado a
 * partir dali, o `set` estoura. Engolir o erro e o comportamento
 * correto: quem de fato renova a sessao e o proxy (`src/proxy.js`),
 * que roda antes e pode escrever.
 */
export async function criarClienteServidor() {
  const { url, anonKey } = lerEnvSupabase();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server component: somente leitura. O proxy renova.
        }
      },
    },
  });
}
