"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, UserCircle, Building2 } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
          <div className="hidden sm:block flex-1 max-w-sm">
            <SearchBar />
          </div>

          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600">
            <UserCircle className="h-6 w-6" />
            <span className="hidden sm:inline">Panel Investigador</span>
          </Link>
          
          <button 
            className="md:hidden text-slate-600 hover:text-brand-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-4">
            <div className="sm:hidden">
              <SearchBar />
            </div>
            <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600">
              <Link 
                href="/projects" 
                className="hover:text-brand-600 transition-colors p-2 -mx-2 rounded-lg hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Proyectos
              </Link>
              <Link 
                href="/publications" 
                className="hover:text-brand-600 transition-colors p-2 -mx-2 rounded-lg hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Publicaciones
              </Link>
              <Link 
                href="/research-lines" 
                className="hover:text-brand-600 transition-colors p-2 -mx-2 rounded-lg hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Líneas de Investigación
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
