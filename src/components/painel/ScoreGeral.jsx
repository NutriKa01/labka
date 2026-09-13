import Card, { CardLabel } from "../ui/Card";

function tonalidade(score) {
  if (score == null) return { cor: "text-dim", rotulo: "sem dados" };
  if (score >= 80) return { cor: "text-good", rotulo: "bom" };
  if (score >= 50) return { cor: "text-warn", rotulo: "atenção" };
  return { cor: "text-bad", rotulo: "crítico" };
}

export default function ScoreGeral({ score }) {
  const { cor, rotulo } = tonalidade(score);

  return (
    <Card className="flex flex-col gap-1">
      <CardLabel>Score geral</CardLabel>
      <p className={`font-serif text-4xl font-semibold ${cor}`}>
        {score == null ? "—" : `${score}%`}
      </p>
      <p className="text-xs text-dim capitalize">{rotulo}</p>
    </Card>
  );
}
