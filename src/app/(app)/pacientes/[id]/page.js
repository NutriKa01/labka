import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarPaciente } from "@/lib/pacientesRepository";
import { listarExamesDoPaciente } from "@/lib/examesRepository";
import { listarMarcadores } from "@/lib/marcadoresRepository";
import { calcularScore } from "@/lib/score";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import ScoreGeral from "@/components/painel/ScoreGeral";
import GraficoEvolucao from "@/components/painel/GraficoEvolucao";
import MatrizMarcadores from "@/components/exames/MatrizMarcadores";
import SugestaoConduta from "@/components/painel/SugestaoConduta";

function idade(dataNascimento) {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) anos -= 1;
  return anos;
}

export const metadata = { title: "Painel do paciente — labka" };

export default async function PainelPacientePage({ params }) {
  const { id } = await params;

  const [pacienteRes, examesRes, marcadoresRes] = await Promise.all([
    buscarPaciente(id),
    listarExamesDoPaciente(id),
    listarMarcadores(),
  ]);

  if (!pacienteRes.ok || !pacienteRes.resultado) notFound();

  const paciente = pacienteRes.resultado;

  if (!examesRes.ok || !marcadoresRes.ok) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-10">
        <Alert level="critical" title="Não consegui carregar o painel">
          {examesRes.erro || marcadoresRes.erro}
        </Alert>
      </div>
    );
  }

  const exames = examesRes.resultado;
  const marcadores = marcadoresRes.resultado;
  const ultimoExame = exames.at(-1);

  const scoreAtual = ultimoExame
    ? calcularScore(ultimoExame.exame_valores, marcadores)
    : null;

  const pontos = exames.map((exame) => ({
    data: exame.data_exame,
    score: calcularScore(exame.exame_valores, marcadores),
    peso: exame.peso_kg,
  }));

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">{paciente.nome}</h1>
          <p className="text-sm text-dim mt-1">
            {idade(paciente.data_nascimento)} anos · {paciente.sexo}
            {paciente.telefone ? ` · ${paciente.telefone}` : ""}
          </p>
        </div>
        <Button as={Link} href={`/pacientes/${id}/exame/novo`}>
          Novo exame
        </Button>
      </div>

      {exames.length === 0 ? (
        <Alert level="info" title="Nenhum exame lançado ainda">
          Lance o primeiro exame para ver o score e a evolução do paciente.
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ScoreGeral score={scoreAtual} />
            <SugestaoConduta exameId={ultimoExame.id} />
          </div>

          <GraficoEvolucao pontos={pontos} />
          <MatrizMarcadores exames={exames} marcadores={marcadores} />
        </>
      )}
    </div>
  );
}
