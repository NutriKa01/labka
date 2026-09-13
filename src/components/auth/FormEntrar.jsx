"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { criarClienteNavegador } from "../../lib/supabase/client";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";

/**
 * Login. `router.refresh()` antes do push e obrigatorio: o cookie de
 * sessao acabou de mudar e o cache de server component ainda tem o
 * HTML de deslogado. Sem o refresh a pessoa entra e ve a tela antiga.
 */
export default function FormEntrar() {
  const router = useRouter();
  const params = useSearchParams();
  const proximo = params.get("proximo");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setErro(null);

    if (!email.trim() || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    setEnviando(true);
    try {
      const supabase = criarClienteNavegador();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: senha,
      });

      if (error) {
        setErro(traduzirErro(error.message));
        return;
      }

      const destino = proximo?.startsWith("/") ? proximo : "/pacientes";
      router.refresh();
      router.replace(destino);
    } catch {
      setErro(
        "Não consegui falar com o servidor. Verifique sua conexão e tente de novo."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
      {erro && (
        <Alert level="critical" title="Não foi possível entrar">
          {erro}
        </Alert>
      )}

      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="voce@exemplo.com"
      />

      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={enviando}
        className="transition-shadow hover:shadow-[var(--shadow-glow-gold)]"
      >
        {enviando ? "Entrando" : "Entrar"}
      </Button>
    </form>
  );
}

function traduzirErro(mensagem = "") {
  const m = mensagem.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials"))
    return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed"))
    return "Falta confirmar seu e-mail. Procure o link que enviei, inclusive no spam.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas seguidas. Espere um minuto e tente de novo.";
  return "Algo deu errado ao entrar. Tente de novo.";
}
