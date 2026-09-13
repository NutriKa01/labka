import { Suspense } from "react";
import FormEntrar from "../../components/auth/FormEntrar";
import LogoWordmark from "../../components/brand/LogoWordmark";

export const metadata = { title: "Entrar — Lab.Ka" };

export default function EntrarPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ground px-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo%20imagem%20sem%20fundo.png"
            alt="Lab.Ka"
            className="h-20 w-20 object-contain"
          />
          <div className="flex flex-col gap-2">
            <LogoWordmark className="text-3xl" />
            <p className="text-sm text-dim">
              Painel clínico. Entre com sua conta.
            </p>
          </div>
        </div>

        {/* useSearchParams obriga um limite de Suspense, senao a rota
            inteira e forcada a renderizar sob demanda. */}
        <Suspense fallback={<div className="h-[19rem]" />}>
          <FormEntrar />
        </Suspense>
      </div>
    </div>
  );
}
