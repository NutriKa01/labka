import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarPaciente } from "../../../../../../../lib/pacientesRepository";
import { buscarExame } from "../../../../../../../lib/examesRepository";
import { listarCategoriasComMarcadores } from "../../../../../../../lib/marcadoresRepository";
import { lerPerfilComConta } from "../../../../../../../lib/perfilRepository";
import Alert from "../../../../../../../components/ui/Alert";
import SugestaoSuplementacao from "../../../../../../../components/suplementacao/SugestaoSuplementacao";

export const metadata = { title: "Sugestão de suplementação — Lab.Ka" };

export default async function SuplementacaoPage({ params }) {
  const { id, exameId } = await params;

  const [pacienteRes, exameRes, categoriasRes, perfil] = await Promise.all([
    buscarPaciente(id),
    buscarExame(exameId),
    listarCategoriasComMarcadores(),
    lerPerfilComConta(),
  ]);

  if (!pacienteRes.ok || !pacienteRes.resultado) notFound();
  if (!exameRes.ok || !exameRes.resultado || exameRes.resultado.paciente_id !== id) notFound();

  if (!categoriasRes.ok) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-10">
        <Alert level="critical" title="Não consegui carregar a tela">
          {categoriasRes.erro}
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-10 flex flex-col gap-6">
      <div className="print:hidden flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">
            Sugestão de suplementação
          </h1>
          <p className="text-sm text-dim mt-1">
            {pacienteRes.resultado.nome} · exame de {exameRes.resultado.data_exame}
          </p>
        </div>
        <Link href={`/pacientes/${id}`} className="text-sm text-accent hover:underline">
          Voltar ao painel
        </Link>
      </div>

      <SugestaoSuplementacao
        exameId={exameId}
        categorias={categoriasRes.resultado}
        conta={perfil?.conta ?? null}
      />
    </div>
  );
}
