"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Input from "../ui/Input";
import Card, { CardBody } from "../ui/Card";

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

export default function ListaPacientes({ pacientes }) {
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return pacientes;
    return pacientes.filter((p) => p.nome.toLowerCase().includes(termo));
  }, [busca, pacientes]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Buscar por nome"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {filtrados.length === 0 ? (
        <Card>
          <CardBody>
            {pacientes.length === 0
              ? "Nenhum paciente cadastrado ainda."
              : "Nenhum paciente encontrado para essa busca."}
          </CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrados.map((p) => (
            <Link key={p.id} href={`/pacientes/${p.id}`}>
              <Card
                as="div"
                padding="sm"
                className="flex items-center justify-between hover:border-line-strong transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{p.nome}</p>
                  <p className="text-xs text-dim">
                    {idade(p.data_nascimento)} anos · {p.sexo}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
