"use client";

import { useEffect, useState } from "react";
import { X, Printer } from "@phosphor-icons/react";
import Card, { CardLabel, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const DISCLAIMER =
  "Esta sugestão de suplementação é gerada por IA e não substitui o julgamento clínico profissional. " +
  "O uso de qualquer suplemento deve ser validado e prescrito pela nutricionista responsável.";

const CAMPOS = [
  ["nutriente", "Nutriente"],
  ["forma", "Forma"],
  ["dosagem", "Dosagem"],
  ["frequencia", "Frequência"],
  ["duracao", "Duração"],
  ["reavaliacao", "Reavaliação"],
];

export default function SugestaoSuplementacao({ exameId, categorias, conta }) {
  const [sugestoes, setSugestoes] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [removidos, setRemovidos] = useState(() => new Set());

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const resposta = await fetch(`/api/exames/${exameId}/sugestao-suplementacao`, {
          method: "POST",
        });
        const dados = await resposta.json();
        if (cancelado) return;
        if (!dados.ok) {
          setErro(dados.erro || "Não consegui gerar a sugestão.");
          return;
        }
        setSugestoes(dados.resultado);
      } catch {
        if (!cancelado) setErro("Não consegui falar com o servidor. Tente de novo.");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [exameId]);

  if (carregando) {
    return (
      <Card>
        <p className="text-sm text-dim">Gerando sugestões…</p>
      </Card>
    );
  }

  if (erro) {
    return (
      <Alert level="critical" title="Não foi possível gerar">
        {erro}
      </Alert>
    );
  }

  if (!sugestoes || sugestoes.length === 0) {
    return (
      <Alert level="info" title="Nenhum marcador alterado">
        Todos os marcadores lançados neste exame estão dentro da faixa ideal —
        não há sugestão de suplementação a gerar.
      </Alert>
    );
  }

  const sugestaoPorMarcadorId = new Map(sugestoes.map((s) => [s.marcador_id, s]));

  const gruposComItens = categorias
    .map((categoria) => ({
      ...categoria,
      itens: categoria.marcadores
        .filter((m) => sugestaoPorMarcadorId.has(m.id) && !removidos.has(m.id))
        .map((m) => ({ marcador: m, sugestao: sugestaoPorMarcadorId.get(m.id) })),
    }))
    .filter((categoria) => categoria.itens.length > 0);

  function remover(marcadorId) {
    setRemovidos((atual) => new Set(atual).add(marcadorId));
  }

  const linhasAssinatura = [conta?.nome_profissional, conta?.crn && `CRN ${conta.crn}`]
    .filter(Boolean)
    .join(" · ");

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="print:hidden flex justify-end">
        <Button size="sm" onClick={() => window.print()}>
          <Printer size={16} aria-hidden="true" />
          Exportar PDF
        </Button>
      </div>

      {gruposComItens.length === 0 ? (
        <Alert level="info" title="Resumo vazio">
          Todos os marcadores foram removidos do resumo.
        </Alert>
      ) : (
        gruposComItens.map((categoria) => (
          <div key={categoria.id} className="flex flex-col gap-3">
            <CardLabel>{categoria.nome}</CardLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoria.itens.map(({ marcador, sugestao }) => (
                <Card key={marcador.id} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle>{marcador.nome}</CardTitle>
                    <button
                      type="button"
                      onClick={() => remover(marcador.id)}
                      className="print:hidden text-dim hover:text-bad transition-colors"
                      aria-label={`Remover ${marcador.nome} do resumo`}
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <dl className="text-sm flex flex-col gap-1.5">
                    {CAMPOS.map(([campo, rotulo]) => (
                      <div key={campo} className="flex gap-2">
                        <dt className="text-dim shrink-0">{rotulo}:</dt>
                        <dd className="text-ink">{sugestao[campo]}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}

      <Alert level="info" title="Aviso importante">
        {DISCLAIMER}
      </Alert>

      <div className="border-t border-line pt-4 text-sm text-dim flex flex-col gap-1">
        {linhasAssinatura && <p className="text-ink font-medium">{linhasAssinatura}</p>}
        {conta?.cidade && <p>{conta.cidade}, {dataHoje}</p>}
        {!conta?.cidade && <p>{dataHoje}</p>}
      </div>
    </div>
  );
}
