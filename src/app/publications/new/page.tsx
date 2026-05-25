"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function NewPublication() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    doi: "",
    projectId: "",
    status: "DRAFT",
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('proyectos').select('*');
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          authors: formData.authors,
          id_proyecto: formData.projectId,
          doi: formData.doi || null,
          status: 'DRAFT'
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error al guardar");
      }

      alert("¡Publicación guardada con éxito!");
      router.push("/dashboard");
    } catch (error: any) {
      alert(`Hubo un error al guardar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-brand-600 hover:underline text-sm font-medium flex items-center gap-1">
            <ArrowLeft size={16} /> Volver al Panel
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-accent-600 to-accent-500 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-xl">
                <BookOpen size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold">Añadir Publicación</h1>
            </div>
            <p className="text-accent-50 opacity-90 text-sm">Registra un nuevo artículo científico o contribución a conferencia.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Título de la Publicación</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ej: Deep Learning Approaches for..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Autores</label>
              <input
                type="text"
                required
                value={formData.authors}
                onChange={(e) => setFormData({...formData, authors: e.target.value})}
                placeholder="Ej: Elena Ramírez, Carlos Mendoza (separados por coma)"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors shadow-sm"
              />
            </div>

             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">DOI (Opcional)</label>
               <input
                 type="text"
                 value={formData.doi}
                 onChange={(e) => setFormData({...formData, doi: e.target.value})}
                 placeholder="Ej: 10.1016/j.artmed..."
                 className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors shadow-sm"
               />
             </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Vincular a Proyecto (Opcional)</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors shadow-sm bg-white"
              >
                <option value="">Ningún proyecto asociado</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => router.push('/dashboard')} className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 border border-transparent rounded-xl hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-accent-600 to-accent-500 rounded-xl hover:from-accent-700 hover:to-accent-600 transition-all shadow-md shadow-accent-500/30 flex items-center gap-2 disabled:opacity-70">
                <Save size={18} /> {isSubmitting ? "Guardando..." : "Guardar Publicación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
