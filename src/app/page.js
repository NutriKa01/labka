import { redirect } from "next/navigation";
import { lerUsuario } from "../lib/auth";

export default async function HomePage() {
  const usuario = await lerUsuario();
  redirect(usuario ? "/pacientes" : "/entrar");
}
