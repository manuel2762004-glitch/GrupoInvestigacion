import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Search, Menu, UserCircle, Building2 } from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";

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
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand-700">
                <div className="bg-brand-600 p-1.5 rounded-lg text-white">
                  <Building2 size={20} />
                </div>
                <span>ResearchHUB</span>
              </Link>
              
              <nav className="hidden md:flex gap-4 text-sm font-medium text-slate-600">
                <Link href="/projects" className="hover:text-brand-600 transition-colors">Proyectos</Link>
                <Link href="/publications" className="hover:text-brand-600 transition-colors">Publicaciones</Link>
                <Link href="/research-lines" className="hover:text-brand-600 transition-colors">Líneas de Investigación</Link>
              </nav>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end">
              {/* Global Search Bar */}
              <SearchBar />

              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600">
                <UserCircle className="h-6 w-6" />
                <span className="hidden sm:inline">Panel Investigador</span>
              </Link>
              
              <button className="md:hidden text-slate-600 hover:text-brand-600">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

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
