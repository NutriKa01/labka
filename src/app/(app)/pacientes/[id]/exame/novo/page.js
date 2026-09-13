import { notFound } from "next/navigation";
import { buscarPaciente } from "../../../../../../lib/pacientesRepository";
import { listarCategoriasComMarcadores } from "../../../../../../lib/marcadoresRepository";
import FormExame from "../../../../../../components/exames/FormExame";

export const metadata = { title: "Novo exame — Lab.Ka" };

export default async function NovoExamePage({ params }) {
  const { id } = await params;

  const [pacienteRes, categoriasRes] = await Promise.all([
    buscarPaciente(id),
    listarCategoriasComMarcadores(),
  ]);

  if (!pacienteRes.ok || !pacienteRes.resultado) notFound();

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-10 flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink">Novo exame</h1>
        <p className="text-sm text-dim mt-1">{pacienteRes.resultado.nome}</p>
      </div>

      <FormExame pacienteId={id} categorias={categoriasRes.resultado ?? []} />
    </div>
  );
}
