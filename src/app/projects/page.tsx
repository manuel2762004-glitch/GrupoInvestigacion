"use client";

import { Project } from "@/types";
import { Search, Filter, Building2, Calendar, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProjectsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('proyectos').select('*');
      if (data) {
        setProjects((data as any[]).map(p => ({
          id: p.id,
          title: p.nombre,
          summary: p.descripcion,
          status: p.estado || 'PENDING_APPROVAL',
          startDate: p.fecha_inicio || new Date().toISOString(),
          endDate: p.fecha_fin || new Date().toISOString()
        })));
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const title = project.title || "";
    const summary = project.summary || "";
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Directorio de Proyectos</h1>
            <p className="text-slate-500 max-w-2xl">
              Explora los proyectos de investigación activos, finalizados y en proceso de aprobación de nuestro grupo.
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filtrar por título..." 
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
                className="pl-9 pr-8 py-2 border border-slate-200 rounded-xl w-full sm:w-40 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm appearance-none"
              >
                <option value="ALL">Todos los estados</option>
                <option value="ACTIVE">Activos</option>
                <option value="COMPLETED">Completados</option>
                <option value="PENDING_APPROVAL">Pendientes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: Project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="group h-full">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col hover:shadow-lg hover:border-brand-300 transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  project.status === 'ACTIVE' ? 'bg-emerald-400' :
                  project.status === 'COMPLETED' ? 'bg-blue-400' :
                  project.status === 'PENDING_APPROVAL' ? 'bg-amber-400' :
                  'bg-slate-400'
                }`}></div>
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    project.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    project.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    project.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}>
                    {project.status === 'ACTIVE' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {project.status === 'ACTIVE' ? 'Activo' : 
                     project.status === 'COMPLETED' ? 'Completado' : 
                     project.status === 'PENDING_APPROVAL' ? 'Pendiente' : project.status}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                  {project.title}
                </h2>
                
                <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
                  {project.summary}
                </p>
                
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-500 font-medium mt-auto">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    <span className="truncate">{project.fundingEntity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{new Date(project.startDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} - {new Date(project.endDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl border-dashed">
            <h3 className="text-lg font-medium text-slate-800 mb-2">No se encontraron proyectos</h3>
            <p className="text-slate-500">Prueba a cambiar los filtros de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
