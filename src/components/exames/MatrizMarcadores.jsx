"use client";

import { FileText } from "@phosphor-icons/react";
import Card, { CardLabel } from "../ui/Card";
import Badge from "../ui/Badge";
import { statusValor } from "../../lib/score";
import { criarClienteNavegador } from "../../lib/supabase/client";

const TOM_ROTULO = { good: "Ok", bad: "Atenção", default: "—" };

async function abrirArquivoOriginal(caminho) {
  const supabase = criarClienteNavegador();
  const { data, error } = await supabase.storage
    .from("exames-arquivos")
    .createSignedUrl(caminho, 60);

  if (error || !data?.signedUrl) return;
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

/**
 * Marcador × data. `exames` já vem ordenado por data ascendente;
 * `marcadores` é o catálogo completo — só entram na tabela os que
 * têm ao menos um valor lançado em algum exame do paciente.
 */
export default function MatrizMarcadores({ exames, marcadores }) {
  const marcadoresPorId = new Map(marcadores.map((m) => [m.id, m]));

  const idsComValor = new Set();
  for (const exame of exames) {
    for (const v of exame.exame_valores) idsComValor.add(v.marcador_id);
  }
  const linhas = marcadores.filter((m) => idsComValor.has(m.id));

  if (linhas.length === 0) return null;

  return (
    <Card padding="none" className="overflow-x-auto">
      <div className="p-5 sm:p-6 pb-0">
        <CardLabel>Marcadores por data</CardLabel>
      </div>
      <table className="w-full text-sm mt-3">
        <thead>
          <tr className="border-t border-line text-left text-dim text-xs">
            <th className="px-5 sm:px-6 py-3 font-medium">Marcador</th>
            {exames.map((exame) => {
              const arquivo = exame.exame_arquivos?.[0];
              return (
                <th key={exame.id} className="px-3 py-3 font-medium whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span>{exame.data_exame}</span>
                    {arquivo && (
                      <button
                        type="button"
                        onClick={() => abrirArquivoOriginal(arquivo.caminho)}
                        className="inline-flex items-center gap-1 text-accent font-normal normal-case hover:underline"
                      >
                        <FileText size={12} aria-hidden="true" />
                        Ver arquivo original
                      </button>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {linhas.map((marcador) => (
            <tr key={marcador.id} className="border-t border-line">
              <td className="px-5 sm:px-6 py-3 text-ink font-medium whitespace-nowrap">
                {marcador.nome}
              </td>
              {exames.map((exame) => {
                const valor = exame.exame_valores.find(
                  (v) => v.marcador_id === marcador.id
                );
                if (!valor) {
                  return (
                    <td key={exame.id} className="px-3 py-3 text-dim">
                      —
                    </td>
                  );
                }
                const tom = statusValor(valor.valor, marcador);
                return (
                  <td key={exame.id} className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-ink">
                        {valor.valor}
                        {marcador.unidade ? ` ${marcador.unidade}` : ""}
                      </span>
                      <Badge tone={tom}>{TOM_ROTULO[tom]}</Badge>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
