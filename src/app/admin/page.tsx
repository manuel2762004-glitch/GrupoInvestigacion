"use client";

import { supabase } from "@/lib/supabase";
import { Check, X, ShieldCheck, Building2, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: pData } = await supabase.from('proyectos').select('*');
      if (pData) {
        setProjects((pData as any[]).map(p => ({
          id: p.id,
          title: p.nombre,
          summary: p.descripcion,
          status: p.estado || 'PENDING_APPROVAL'
        })));
      }
      
      const { data: pubData } = await supabase.from('publicaciones').select('*');
      if (pubData) {
        setPublications((pubData as any[]).map(p => ({ 
          id: p.id,
          title: p.titulo,
          authors: typeof p.autores === 'string' ? p.autores.split(',') : (p.autores || []),
          status: p.estado || 'SUBMITTED'
        })));
      }
    };
    loadData();
  }, []);

  const pendingProjects = projects.filter(p => p.status === "PENDING_APPROVAL");
  const submittedPublications = publications.filter(p => p.status === "SUBMITTED");

  const handleApproveProject = async (id: string) => {
    // @ts-ignore
    const { error } = await supabase.from('proyectos').update({ estado: 'ACTIVE' }).eq('id', id);
    if (!error) {
      setProjects(projects.map(p => p.id === id ? { ...p, status: "ACTIVE" } : p));
      alert("Proyecto aprobado y activado correctamente en base de datos.");
    } else {
      alert("Error al aprobar proyecto: " + error.message);
    }
  };

  const handleRejectProject = async (id: string) => {
    // @ts-ignore
    const { error } = await supabase.from('proyectos').update({ estado: 'REJECTED' }).eq('id', id);
    if (!error) {
      setProjects(projects.map(p => p.id === id ? { ...p, status: "REJECTED" } : p));
      alert("Proyecto rechazado correctamente.");
    } else {
      alert("Error al rechazar proyecto: " + error.message);
    }
  };

  const handleUpdatePublication = async (id: string, newStatus: "ACCEPTED" | "REJECTED") => {
    // @ts-ignore
    const { error } = await supabase.from('publicaciones').update({ estado: newStatus }).eq('id', id);
    if (!error) {
      setPublications(publications.map(p => p.id === id ? { ...p, status: newStatus } : p));
      alert(`Publicación ${newStatus === "ACCEPTED" ? "Aceptada" : "Rechazada"} correctamente.`);
    } else {
      alert("Error al actualizar la publicación: " + error.message);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Admin Header */}
      <div className="bg-slate-900 pb-24 pt-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="text-white flex items-center gap-3">
              <div className="bg-brand-500 p-2 rounded-xl">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Panel de Administración</h1>
                <p className="text-slate-400 mt-1">Gestión global de la plataforma</p>
              </div>
            </div>
            <Link href="/" className="px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all backdrop-blur-md">
              Volver al Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-16">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Proyectos Pendientes */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Building2 className="text-brand-500" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Proyectos Pendientes</h2>
              {pendingProjects.length > 0 && (
                <span className="bg-amber-100 text-amber-700 font-bold px-2.5 py-0.5 rounded-full text-sm ml-auto">
                  {pendingProjects.length}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {pendingProjects.map(project => (
                <div key={project.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{project.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{project.summary}</p>
                  
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/60">
                    <button 
                      onClick={() => handleRejectProject(project.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <X size={16} /> Rechazar
                    </button>
                    <button 
                      onClick={() => handleApproveProject(project.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors"
                    >
                      <Check size={16} /> Aprobar
                    </button>
                  </div>
                </div>
              ))}
              
              {pendingProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 py-12 text-slate-400">
                  <Check className="mb-2 text-emerald-400" size={32} />
                  <p>Todos los proyectos han sido revisados.</p>
                </div>
              )}
            </div>
          </section>

          {/* Publicaciones Pendientes de Revisión */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <BookOpen className="text-accent-500" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Publicaciones en Revisión</h2>
              {submittedPublications.length > 0 && (
                <span className="bg-purple-100 text-purple-700 font-bold px-2.5 py-0.5 rounded-full text-sm ml-auto">
                  {submittedPublications.length}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {submittedPublications.map(pub => (
                <div key={pub.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{pub.title}</h3>
                  <p className="text-sm text-brand-600 font-medium mb-4">{pub.authors.join(", ")}</p>
                  
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/60">
                    <button 
                      onClick={() => handleUpdatePublication(pub.id, "REJECTED")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <X size={16} /> Rechazar
                    </button>
                    <button 
                      onClick={() => handleUpdatePublication(pub.id, "ACCEPTED")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors"
                    >
                      <Check size={16} /> Aceptar
                    </button>
                  </div>
                </div>
              ))}
              
              {submittedPublications.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 py-12 text-slate-400">
                  <AlertCircle className="mb-2 text-slate-300" size={32} />
                  <p>No hay publicaciones pendientes de revisión.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
