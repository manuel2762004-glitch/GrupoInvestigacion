"use client";

import { Lightbulb, Users, Target, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ResearchLines() {
  const [researchLines, setResearchLines] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: linesData } = await supabase.from('lineas_investigacion').select('*');
        if (linesData) setResearchLines(linesData);
        
        const { data: projData } = await supabase.from('proyectos').select('*');
        if (projData) setProjects(projData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Líneas de Investigación</h1>
          <p className="text-slate-500 max-w-2xl">
            Nuestras áreas principales de estudio y desarrollo científico.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-pulse flex items-center gap-2"><Lightbulb className="text-slate-300" /> Cargando...</div></div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {researchLines.map(line => {
              const lineProjects = projects.filter(p => p.id_linea === line.id);
              return (
              <div key={line.id} className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-brand-100 p-3 rounded-xl text-brand-600">
                    <Lightbulb size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{line.nombre}</h2>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed min-h-20">
                  {line.descripcion}
                </p>
                
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Building2 size={16} className="text-slate-400" />
                    Proyectos en esta Línea ({lineProjects.length})
                  </h3>
                  {lineProjects.length > 0 ? (
                    <div className="flex flex-col gap-2 mt-2">
                      {lineProjects.map(p => (
                        <Link key={p.id} href={`/projects`} className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50 transition-colors text-sm font-medium text-slate-700">
                          {p.nombre}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No hay proyectos asociados a esta línea todavía.</p>
                  )}
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
