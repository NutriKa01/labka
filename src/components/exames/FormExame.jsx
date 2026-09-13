"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";
import Card, { CardTitle } from "../ui/Card";

/**
 * `categorias` vem de `listarCategoriasComMarcadores()`: cada
 * categoria já traz seus marcadores embutidos, então o formulário só
 * percorre a árvore — não decide sozinho quais categorias existem.
 */
export default function FormExame({ pacienteId, categorias }) {
  const router = useRouter();

  const [dataExame, setDataExame] = useState("");
  const [pesoKg, setPesoKg] = useState("");
  const [valores, setValores] = useState({});
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function alterarValor(marcadorId, valor) {
    setValores((atual) => ({ ...atual, [marcadorId]: valor }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErro(null);

    if (!dataExame) {
      setErro("Informe a data do exame.");
      return;
    }

    setEnviando(true);
    try {
      const resposta = await fetch("/api/exames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteId,
          dataExame,
          pesoKg: pesoKg ? Number(pesoKg) : null,
          valores: Object.entries(valores).map(([marcador_id, valor]) => ({
            marcador_id,
            valor,
          })),
        }),
      });
      const dados = await resposta.json();

      if (!dados.ok) {
        setErro(dados.erro || "Não consegui salvar o exame.");
        return;
      }

      router.push(`/pacientes/${pacienteId}`);
      router.refresh();
    } catch {
      setErro("Não consegui falar com o servidor. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-6">
      {erro && (
        <Alert level="critical" title="Não foi possível salvar">
          {erro}
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Data do exame"
          type="date"
          value={dataExame}
          onChange={(e) => setDataExame(e.target.value)}
        />
        <Input
          label="Peso"
          type="number"
          numeric
          suffix="kg"
          step="0.1"
          value={pesoKg}
          onChange={(e) => setPesoKg(e.target.value)}
        />
      </div>

      {categorias.map((categoria) => (
        <Card key={categoria.id}>
          <CardTitle className="mb-4">{categoria.nome}</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            {categoria.marcadores.map((marcador) => (
              <Input
                key={marcador.id}
                label={marcador.nome}
                type="number"
                numeric
                suffix={marcador.unidade || undefined}
                step="any"
                value={valores[marcador.id] ?? ""}
                onChange={(e) => alterarValor(marcador.id, e.target.value)}
                hint={
                  marcador.valor_ideal_min != null && marcador.valor_ideal_max != null
                    ? `Ideal: ${marcador.valor_ideal_min}–${marcador.valor_ideal_max}`
                    : undefined
                }
              />
            ))}
          </div>
        </Card>
      ))}

      <Button type="submit" size="lg" fullWidth loading={enviando}>
        {enviando ? "Salvando" : "Salvar exame"}
      </Button>
    </form>
  );
}
