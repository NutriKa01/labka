"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";

const SEXOS = [
  { valor: "feminino", rotulo: "Feminino" },
  { valor: "masculino", rotulo: "Masculino" },
];

export default function FormPaciente() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState("feminino");
  const [dataNascimento, setDataNascimento] = useState("");
  const [altura, setAltura] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setErro(null);

    if (!nome.trim() || !dataNascimento) {
      setErro("Preencha nome e data de nascimento.");
      return;
    }

    setEnviando(true);
    try {
      const resposta = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          sexo,
          data_nascimento: dataNascimento,
          altura: altura ? Number(altura) : null,
          telefone,
        }),
      });
      const dados = await resposta.json();

      if (!dados.ok) {
        setErro(dados.erro || "Não consegui salvar o paciente.");
        return;
      }

      router.push(`/pacientes/${dados.resultado.id}`);
      router.refresh();
    } catch {
      setErro("Não consegui falar com o servidor. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
      {erro && (
        <Alert level="critical" title="Não foi possível salvar">
          {erro}
        </Alert>
      )}

      <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Sexo</label>
        <div className="flex gap-2">
          {SEXOS.map((s) => (
            <button
              key={s.valor}
              type="button"
              onClick={() => setSexo(s.valor)}
              className={
                "h-11 px-4 rounded-[var(--radius-control)] border text-sm font-medium transition-colors " +
                (sexo === s.valor
                  ? "border-accent text-accent bg-accent-veil"
                  : "border-line text-dim hover:border-line-strong")
              }
            >
              {s.rotulo}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Data de nascimento"
        type="date"
        value={dataNascimento}
        onChange={(e) => setDataNascimento(e.target.value)}
      />

      <Input
        label="Altura"
        type="number"
        numeric
        suffix="m"
        value={altura}
        onChange={(e) => setAltura(e.target.value)}
        placeholder="1.65"
        step="0.01"
      />

      <Input
        label="Telefone"
        type="tel"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        placeholder="(11) 99999-0000"
      />

      <Button type="submit" size="lg" fullWidth loading={enviando}>
        {enviando ? "Salvando" : "Salvar paciente"}
      </Button>
    </form>
  );
}
