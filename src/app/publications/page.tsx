"use client";

import { mockPublications } from "@/lib/mockData";
import { BookOpen, ExternalLink, Filter, Search } from "lucide-react";
import { useState } from "react";

export default function PublicationsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredPublications = mockPublications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pub.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || pub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Publicaciones Científicas</h1>
            <p className="text-slate-500 max-w-2xl">
              Explora los artículos y contribuciones de nuestro grupo de investigación.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por título o autor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl w-full sm:w-64 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-slate-200 rounded-xl w-full sm:w-48 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm appearance-none"
              >
                <option value="ALL">Cualquier estado</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ACCEPTED">Aceptado</option>
                <option value="SUBMITTED">Enviado a revisión</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-100">
            {filteredPublications.map(pub => (
              <li key={pub.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-brand-50 p-2 rounded-lg text-brand-600 mt-1 shrink-0">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 leading-snug">{pub.title}</h2>
                        <p className="text-brand-600 font-medium mt-1">
                          {pub.authors.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex flex-col items-end gap-3 min-w-[200px]">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      pub.status === 'PUBLISHED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      pub.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      pub.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {pub.status === 'PUBLISHED' ? 'Publicado' : 
                       pub.status === 'ACCEPTED' ? 'Aceptado' : 
                       pub.status === 'SUBMITTED' ? 'En Revisión' : 'Borrador'}
                    </span>
                    
                    {pub.doi && (
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-colors">
                        Ver artículo (DOI) <ExternalLink size={14} />
                      </a>
                    )}
                    
                    {pub.submitDate && (
                      <span className="text-xs text-slate-400">
                        Fecha: {new Date(pub.submitDate).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
            
            {filteredPublications.length === 0 && (
              <li className="p-12 text-center text-slate-500">
                No se han encontrado publicaciones que coincidan con la búsqueda.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
