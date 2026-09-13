"use client";

import { useState } from "react";
import Card, { CardLabel } from "../ui/Card";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const DISCLAIMER =
  "Esta sugestão é gerada por IA e não substitui o julgamento clínico profissional. " +
  "Toda conduta deve ser validada e assinada pela nutricionista responsável antes de ser aplicada ao paciente.";

/**
 * `exameId` é sempre o exame mais recente do paciente — a sugestão é
 * pedida sob demanda (custa uma chamada à API da Anthropic) e nunca
 * fica em cache entre exames diferentes.
 */
export default function SugestaoConduta({ exameId }) {
  const [texto, setTexto] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function pedirSugestao() {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch("/api/sugestao-conduta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exame_id: exameId }),
      });
      const dados = await resposta.json();
      if (!dados.ok) {
        setErro(dados.erro || "Não consegui gerar a sugestão.");
        return;
      }
      setTexto(dados.resultado);
    } catch {
      setErro("Não consegui falar com o servidor. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <CardLabel>Sugestão de conduta (IA)</CardLabel>
        <Button size="sm" variant="secondary" loading={carregando} onClick={pedirSugestao}>
          {texto ? "Gerar novamente" : "Gerar sugestão"}
        </Button>
      </div>

      {erro && (
        <Alert level="critical" title="Não foi possível gerar">
          {erro}
        </Alert>
      )}

      {texto && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink whitespace-pre-line">{texto}</p>
          <Alert level="info" title="Aviso importante">
            {DISCLAIMER}
          </Alert>
        </div>
      )}
    </Card>
  );
}
