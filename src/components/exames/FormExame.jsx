"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";
import Badge from "../ui/Badge";
import Card, { CardTitle } from "../ui/Card";
import UploadArquivoExame from "./UploadArquivoExame";

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
  const [confiancaPorMarcador, setConfiancaPorMarcador] = useState({});
  const [arquivo, setArquivo] = useState(null);
  const [analisando, setAnalisando] = useState(false);
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function alterarValor(marcadorId, valor) {
    setValores((atual) => ({ ...atual, [marcadorId]: valor }));
    setConfiancaPorMarcador((atual) => {
      if (!(marcadorId in atual)) return atual;
      const { [marcadorId]: _removido, ...resto } = atual;
      return resto;
    });
  }

  async function aoSelecionarArquivo(file) {
    setArquivo(file);
    setErro(null);

    if (!file) {
      setConfiancaPorMarcador({});
      return;
    }

    setAnalisando(true);
    try {
      const formData = new FormData();
      formData.append("arquivo", file);

      const resposta = await fetch("/api/exames/extrair", {
        method: "POST",
        body: formData,
      });
      const dados = await resposta.json();

      if (!dados.ok) {
        setErro(dados.erro || "Não consegui analisar o arquivo.");
        return;
      }

      const novaConfianca = {};
      setValores((atual) => {
        const atualizado = { ...atual };
        for (const item of dados.resultado) {
          atualizado[item.marcador_id] = String(item.valor);
          novaConfianca[item.marcador_id] = item.confianca;
        }
        return atualizado;
      });
      setConfiancaPorMarcador(novaConfianca);
    } catch {
      setErro("Não consegui falar com o servidor pra analisar o arquivo.");
    } finally {
      setAnalisando(false);
    }
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
      const formData = new FormData();
      formData.append("pacienteId", pacienteId);
      formData.append("dataExame", dataExame);
      formData.append("pesoKg", pesoKg || "");
      formData.append(
        "valores",
        JSON.stringify(
          Object.entries(valores).map(([marcador_id, valor]) => ({ marcador_id, valor }))
        )
      );
      if (arquivo) formData.append("arquivo", arquivo);

      const resposta = await fetch("/api/exames", {
        method: "POST",
        body: formData,
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

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Laudo do exame (opcional)</span>
        <UploadArquivoExame
          arquivo={arquivo}
          onArquivoSelecionado={aoSelecionarArquivo}
          disabled={analisando}
        />
        {analisando && <p className="text-xs text-dim">Analisando arquivo…</p>}
      </div>

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
                label={
                  <span className="inline-flex items-center gap-2">
                    {marcador.nome}
                    {confiancaPorMarcador[marcador.id] && (
                      <Badge tone={confiancaPorMarcador[marcador.id] === "alta" ? "good" : "warn"}>
                        {confiancaPorMarcador[marcador.id] === "alta" ? "Alta confiança" : "Revisar"}
                      </Badge>
                    )}
                  </span>
                }
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
