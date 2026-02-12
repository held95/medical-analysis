import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema ASO - Controle de Atestado de Saúde Ocupacional",
  description: "Sistema de gerenciamento de funcionários e exames ocupacionais ASO",
  keywords: ["ASO", "saúde ocupacional", "exames", "funcionários", "aderência"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-white">
      <body className={`${inter.className} bg-white`}>
        <div className="min-h-screen bg-white">
          <Header />
          <Navigation />
          <main className="container mx-auto py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
