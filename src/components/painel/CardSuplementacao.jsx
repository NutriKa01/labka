import Link from "next/link";
import Card, { CardLabel, CardBody } from "../ui/Card";
import Button from "../ui/Button";

export default function CardSuplementacao({ pacienteId, exameId }) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <CardLabel>Sugestão de suplementação (IA)</CardLabel>
      </div>
      <CardBody>
        Gere sugestões de suplementação por marcador fora da faixa ideal,
        revise e exporte em PDF com assinatura.
      </CardBody>
      <Button
        as={Link}
        href={`/pacientes/${pacienteId}/exame/${exameId}/suplementacao`}
        size="sm"
        variant="secondary"
        className="self-start"
      >
        Gerar sugestão
      </Button>
    </Card>
  );
}
