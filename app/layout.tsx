import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mapa dos 11 Inegociáveis™ | Andréia Assis",
  description:
    "Uma jornada guiada para nomear os seus 11 inegociáveis e sair com o seu Mapa. Pilar 1 do método DOMA, de Andréia Assis.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-texto">{children}</body>
    </html>
  );
}
