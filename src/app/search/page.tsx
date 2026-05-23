"use client";

import { mockProjects, mockPublications, mockResearchLines } from "@/lib/mockData";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, Building2, Lightbulb } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return <p className="text-slate-500 text-center py-12">Por favor, introduce un término de búsqueda.</p>;
  }

  const projects = mockProjects.filter(p => 
    p.title.toLowerCase().includes(query) || p.summary.toLowerCase().includes(query)
  );

  const publications = mockPublications.filter(p => 
    p.title.toLowerCase().includes(query) || p.authors.some(a => a.toLowerCase().includes(query))
  );

  const lines = mockResearchLines.filter(l => 
    l.name.toLowerCase().includes(query) || l.description.toLowerCase().includes(query)
  );

  return (
    <div className="space-y-12">
      {/* Projects */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 className="text-brand-600" /> Proyectos ({projects.length})
        </h2>
        {projects.length > 0 ? (
          <div className="grid gap-4">
            {projects.map(p => (
              <Link href={`/projects/${p.id}`} key={p.id} className="block bg-white p-5 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all">
                <h3 className="font-bold text-lg text-slate-800">{p.title}</h3>
                <p className="text-slate-600 text-sm mt-1 line-clamp-2">{p.summary}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No se encontraron proyectos.</p>
        )}
      </section>

      {/* Publications */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="text-brand-600" /> Publicaciones ({publications.length})
        </h2>
        {publications.length > 0 ? (
          <div className="grid gap-4">
            {publications.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800">{p.title}</h3>
                <p className="text-brand-600 text-sm mt-1">{p.authors.join(", ")}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No se encontraron publicaciones.</p>
        )}
      </section>

      {/* Lines */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Lightbulb className="text-brand-600" /> Líneas de Investigación ({lines.length})
        </h2>
        {lines.length > 0 ? (
          <div className="grid gap-4">
            {lines.map(l => (
              <Link href="/research-lines" key={l.id} className="block bg-white p-5 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all">
                <h3 className="font-bold text-lg text-slate-800">{l.name}</h3>
                <p className="text-slate-600 text-sm mt-1 line-clamp-2">{l.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No se encontraron líneas de investigación.</p>
        )}
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Resultados de la Búsqueda</h1>
        <Suspense fallback={<p>Cargando resultados...</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
