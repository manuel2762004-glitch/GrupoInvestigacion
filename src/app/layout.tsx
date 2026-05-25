import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestión de Investigación",
  description: "Portal para la gestión de proyectos, publicaciones y líneas de investigación.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <Navbar />

        <main className="flex-1">
          {children}
        </main>
        
        <footer className="border-t border-slate-200 bg-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Grupo de Investigación. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
