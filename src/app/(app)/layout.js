import { lerUsuario } from "../../lib/auth";
import { lerPerfilComConta } from "../../lib/perfilRepository";
import { construirTemaConta } from "../../lib/tema";
import Sidebar from "../../components/layout/Sidebar";

export default async function AppLayout({ children }) {
  const usuario = await lerUsuario();
  const perfil = await lerPerfilComConta();
  const tema = construirTemaConta(perfil?.conta);

  return (
    <div className="flex min-h-screen" style={tema ?? undefined}>
      <Sidebar email={usuario?.email} />
      <main className="flex-1 min-w-0 bg-ground text-ink">{children}</main>
    </div>
  );
}
