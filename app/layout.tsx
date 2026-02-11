import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medical Analysis - Sistema de Análise Médica",
  description: "Sistema de gerenciamento de pacientes e exames médicos",
  keywords: ["saúde", "exames", "pacientes", "análise médica"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Header />
          <Navigation />
          <main className="container mx-auto py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
