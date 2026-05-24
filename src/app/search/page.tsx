"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Building2, Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const [projects, setProjects] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          { data: projectsData },
          { data: publicationsData },
          { data: linesData }
        ] = await Promise.all([
          supabase.from("proyectos").select("*"),
          supabase.from("publicaciones").select("*"),
          supabase.from("lineas_investigacion").select("*")
        ]);

        const projectsList = (projectsData || []) as any[];
        const publicationsList = (publicationsData || []) as any[];
        const linesList = (linesData || []) as any[];

        // Filtrar y mapear proyectos
        const filteredProjects = projectsList.filter(p => 
          (p.nombre && p.nombre.toLowerCase().includes(query)) || 
          (p.descripcion && p.descripcion.toLowerCase().includes(query))
        ).map(p => ({
          id: p.id,
          title: p.nombre,
          summary: p.descripcion || ""
        }));

        // Filtrar y mapear publicaciones
        const filteredPublications = publicationsList.filter(p => 
          (p.titulo && p.titulo.toLowerCase().includes(query)) || 
          (p.autores && p.autores.toLowerCase().includes(query))
        ).map(p => ({
          id: p.id,
          title: p.titulo,
          authors: p.autores ? p.autores.split(",").map((a: string) => a.trim()) : []
        }));

        // Filtrar y mapear líneas de investigación
        const filteredLines = linesList.filter(l => 
          (l.nombre && l.nombre.toLowerCase().includes(query)) || 
          (l.descripcion && l.descripcion.toLowerCase().includes(query))
        ).map(l => ({
          id: l.id,
          name: l.nombre,
          description: l.descripcion || ""
        }));

        setProjects(filteredProjects);
        setPublications(filteredPublications);
        setLines(filteredLines);
      } catch (error) {
        console.error("Error performing search:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  if (!query) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 shadow-sm">
        Por favor, introduce un término de búsqueda en la parte superior.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        <p className="text-sm font-medium animate-pulse">Buscando en Supabase...</p>
      </div>
    );
  }

  const hasResults = projects.length > 0 || publications.length > 0 || lines.length > 0;

  if (!hasResults) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-sm">
        <p className="text-slate-700 font-semibold text-lg">No se encontraron resultados</p>
        <p className="text-slate-500 text-sm mt-1">No hay coincidencia para "{query}" en proyectos, publicaciones o líneas de investigación.</p>
      </div>
    );
  }

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
          <p className="text-slate-500 text-sm italic">No se encontraron proyectos para esta búsqueda.</p>
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
              <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800">{p.title}</h3>
                <p className="text-brand-600 text-sm mt-1 font-medium">{p.authors.join(", ")}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">No se encontraron publicaciones para esta búsqueda.</p>
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
          <p className="text-slate-500 text-sm italic">No se encontraron líneas de investigación para esta búsqueda.</p>
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
