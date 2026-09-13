import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Roda antes de qualquer rota. No Next 16 este arquivo se chama
 * `proxy.js`: a convencao `middleware.js` foi renomeada.
 *
 * Duas funcoes, nesta ordem:
 *
 * 1. RENOVAR A SESSAO. Server component nao pode escrever cookie, so
 *    ler. Este arquivo pode.
 *
 * 2. BARRAR ROTA. So o barramento BARATO: tem sessao ou nao tem.
 *
 * Nada disto e seguranca de verdade. Seguranca e a RLS: mesmo que
 * alguem passe por aqui, o Postgres devolve vazio para quem nao
 * estiver autenticado. Isto existe para a pessoa ver a tela certa,
 * nao para proteger dado.
 */

const PRECISA_SESSAO = ["/pacientes"];
const SO_DESLOGADO = ["/entrar"];

export async function proxy(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          // Recriar a response depois de mexer nos cookies do request
          // e o passo que quase todo mundo pula: sem isso o cookie
          // renovado nao chega ao navegador e a sessao cai na proxima
          // requisicao.
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const casa = (lista) =>
    lista.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!user && casa(PRECISA_SESSAO)) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/entrar";
    destino.searchParams.set("proximo", pathname);
    return NextResponse.redirect(destino);
  }

  if (user && casa(SO_DESLOGADO)) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/pacientes";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
