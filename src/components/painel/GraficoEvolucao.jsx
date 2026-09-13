"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Card, { CardLabel } from "../ui/Card";

/**
 * `pontos` já vem pronto de `page.js`: [{ data, score, peso }]. O
 * componente não recalcula nada, só desenha.
 */
export default function GraficoEvolucao({ pontos }) {
  if (pontos.length < 2) {
    return (
      <Card>
        <CardLabel>Evolução</CardLabel>
        <p className="text-sm text-dim mt-2">
          Lance ao menos dois exames para ver a evolução ao longo do tempo.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardLabel>Evolução — score e peso</CardLabel>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pontos} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
            <XAxis dataKey="data" tick={{ fontSize: 12 }} stroke="var(--color-dim)" />
            <YAxis yAxisId="score" tick={{ fontSize: 12 }} stroke="var(--color-dim)" />
            <YAxis
              yAxisId="peso"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="var(--color-dim)"
            />
            <Tooltip />
            <Line
              yAxisId="score"
              type="monotone"
              dataKey="score"
              name="Score (%)"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="peso"
              type="monotone"
              dataKey="peso"
              name="Peso (kg)"
              stroke="var(--color-warn)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
