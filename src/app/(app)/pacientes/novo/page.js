import FormPaciente from "@/components/pacientes/FormPaciente";

export const metadata = { title: "Novo paciente — labka" };

export default function NovoPacientePage() {
  return (
    <div className="max-w-md mx-auto w-full px-4 py-10 flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold text-ink">Novo paciente</h1>
      <FormPaciente />
    </div>
  );
}
