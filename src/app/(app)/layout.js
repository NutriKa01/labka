import { lerUsuario } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";

export default async function AppLayout({ children }) {
  const usuario = await lerUsuario();

  return (
    <div className="flex min-h-screen">
      <Sidebar email={usuario?.email} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
