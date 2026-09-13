import { Suspense } from "react";
import FormEntrar from "../../components/auth/FormEntrar";

export const metadata = { title: "Entrar — labka" };

export default function EntrarPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ground px-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-2xl font-medium text-ink">labka</h1>
          <p className="text-sm text-dim">
            Painel clínico. Entre com sua conta.
          </p>
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
