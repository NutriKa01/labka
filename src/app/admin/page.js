import { listarContasComAcesso } from "../../lib/contasRepository";
import Alert from "../../components/ui/Alert";
import BotaoSairAdmin from "../../components/admin/BotaoSairAdmin";

export const metadata = { title: "Contas — Lab.Ka" };

function formatarData(iso) {
  if (!iso) return "Nunca acessou";
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  const { ok, resultado, erro } = await listarContasComAcesso();

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-ink">Contas</h1>
        <BotaoSairAdmin />
      </div>

      {!ok ? (
        <Alert level="critical" title="Não consegui carregar as contas">
          {erro}
        </Alert>
      ) : resultado.length === 0 ? (
        <Alert level="info" title="Nenhuma conta cadastrada">
          Contas aparecem aqui assim que forem criadas.
        </Alert>
      ) : (
        <div className="border border-line rounded-[var(--radius-card)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-dim text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Consultório</th>
                <th className="text-left px-4 py-3 font-medium">Pacientes</th>
                <th className="text-left px-4 py-3 font-medium">Último acesso</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((conta) => (
                <tr key={conta.id} className="border-t border-line">
                  <td className="px-4 py-3 text-ink">{conta.nome_consultorio}</td>
                  <td className="px-4 py-3 text-ink">{conta.total_pacientes}</td>
                  <td className="px-4 py-3 text-dim">
                    {formatarData(conta.ultimo_acesso)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
