import "./globals.css";

export const metadata = {
  title: "labka",
  description: "Painel clínico — diagnóstico laboratorial e evolução de pacientes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
