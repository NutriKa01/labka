"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, SignOut } from "@phosphor-icons/react";
import { criarClienteNavegador } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

const NAV = [{ href: "/pacientes", label: "Pacientes", Icon: Users }];

export default function Sidebar({ email }) {
  const pathname = usePathname();
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
    <aside className="w-60 shrink-0 bg-sidebar text-sidebar-ink flex flex-col">
      <div className="px-6 py-7 border-b border-sidebar-line">
        <span className="font-serif text-xl font-medium">labka</span>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {NAV.map(({ href, label, Icon }) => {
          const ativo = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-control)]",
                "text-sm transition-colors",
                ativo
                  ? "bg-sidebar-active text-sidebar-ink"
                  : "text-sidebar-dim hover:text-sidebar-ink"
              )}
            >
              <Icon size={17} weight={ativo ? "fill" : "regular"} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-5 border-t border-sidebar-line flex flex-col gap-3">
        {email && (
          <p className="px-3 text-xs text-sidebar-dim truncate">{email}</p>
        )}
        <button
          type="button"
          onClick={sair}
          disabled={saindo}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-control)]",
            "text-sm text-sidebar-dim hover:text-sidebar-ink transition-colors",
            "disabled:opacity-50"
          )}
        >
          <SignOut size={17} aria-hidden="true" />
          {saindo ? "Saindo…" : "Sair"}
        </button>
      </div>
    </aside>
  );
}
