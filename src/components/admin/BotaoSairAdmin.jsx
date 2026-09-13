"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";
import { criarClienteNavegador } from "../../lib/supabase/client";
import { cn } from "../../lib/cn";

export default function BotaoSairAdmin() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    const supabase = criarClienteNavegador();
    await supabase.auth.signOut();
    router.refresh();
    router.replace("/entrar");
  }

  return (
    <button
      type="button"
      onClick={sair}
      disabled={saindo}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-[var(--radius-control)]",
        "text-sm text-dim hover:text-ink transition-colors",
        "disabled:opacity-50"
      )}
    >
      <SignOut size={16} aria-hidden="true" />
      {saindo ? "Saindo…" : "Sair"}
    </button>
  );
}
