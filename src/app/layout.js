import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
});

export const metadata = {
  title: "labka",
  description: "Painel clínico — diagnóstico laboratorial e evolução de pacientes",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`h-full antialiased ${inter.variable} ${fraunces.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
