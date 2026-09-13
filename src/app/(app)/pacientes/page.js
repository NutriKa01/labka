import Link from "next/link";
import { listarPacientes } from "../../../lib/pacientesRepository";
import ListaPacientes from "../../../components/pacientes/ListaPacientes";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

export const metadata = { title: "Pacientes — Lab.Ka" };

export default async function PacientesPage() {
  const { ok, resultado, erro } = await listarPacientes();

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-ink">Pacientes</h1>
        <Button as={Link} href="/pacientes/novo">
          Novo paciente
        </Button>
      </div>

      {!ok ? (
        <Alert level="critical" title="Não consegui carregar os pacientes">
          {erro}
        </Alert>
      ) : (
        <ListaPacientes pacientes={resultado} />
      )}
    </div>
  );
}
