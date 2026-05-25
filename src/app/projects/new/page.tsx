"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Building2, Save, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { mockUsers } from "@/lib/mockData";

export default function NewProject() {
  const router = useRouter();
  const currentUser = mockUsers[1]; // Simulating logged-in user

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    fundingEntity: "",
    startDate: "",
    endDate: "",
    budget: "",
    id_linea: "",
  });

  const [researchLines, setResearchLines] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchLines = async () => {
      const { data } = await supabase.from('lineas_investigacion').select('*');
      if (data) setResearchLines(data);
    };
    fetchLines();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(mId => mId !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const members = [
        { userId: currentUser.id, role: "INVESTIGADOR_PRINCIPAL" },
        ...selectedMembers.map(id => ({ userId: id, role: "EQUIPO_INVESTIGACION" }))
      ];

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'PENDING_APPROVAL',
          members
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error al guardar");
      }

      alert("¡Proyecto guardado con éxito y enviado a revisión!");
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
          <div className="bg-gradient-to-r from-brand-900 to-brand-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-xl">
                <Building2 size={24} className="text-brand-100" />
              </div>
              <h1 className="text-2xl font-bold">Crear Nuevo Proyecto</h1>
            </div>
            <p className="text-brand-100 opacity-90 text-sm">Completa la información para proponer un nuevo proyecto de investigación.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Título del Proyecto</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ej: Análisis Cuántico en Redes..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Línea de Investigación</label>
              <select
                required
                value={formData.id_linea}
                onChange={(e) => setFormData({...formData, id_linea: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm bg-white"
              >
                <option value="">Selecciona una línea...</option>
                {researchLines.map(line => (
                  <option key={line.id} value={line.id}>{line.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Resumen / Abstract</label>
              <textarea
                required
                rows={4}
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="Describe brevemente los objetivos y metodología del proyecto..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Entidad Financiadora</label>
              <input
                type="text"
                required
                value={formData.fundingEntity}
                onChange={(e) => setFormData({...formData, fundingEntity: e.target.value})}
                placeholder="Ej: Ministerio de Ciencia e Innovación"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Fecha de Inicio Estimada</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Fecha de Fin Estimada</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Presupuesto Estimado (€)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="Ej: 150000"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
              />
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-brand-600" size={20} />
                <h3 className="font-bold text-slate-800">Equipo de Investigación</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">Selecciona los investigadores que participarán en este proyecto. Tú eres asignado automáticamente como Investigador Principal.</p>
              
              <div className="space-y-3">
                {/* Current user (Investigador Principal) */}
                <div className="flex items-center justify-between p-3 bg-white border border-brand-200 rounded-xl shadow-sm ring-1 ring-brand-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{currentUser.firstName} {currentUser.lastName} <span className="text-xs font-normal text-slate-500">(Tú)</span></p>
                      <p className="text-xs text-brand-600 font-semibold">Investigador Principal</p>
                    </div>
                  </div>
                  <input type="checkbox" checked disabled className="w-4 h-4 text-brand-600 rounded bg-slate-100 border-slate-300 cursor-not-allowed" />
                </div>
                
                {/* Other users */}
                {mockUsers.filter(u => u.id !== currentUser.id).map(user => (
                  <label key={user.id} className={`flex items-center justify-between p-3 bg-white border rounded-xl shadow-sm cursor-pointer transition-all ${selectedMembers.includes(user.id) ? 'border-brand-500 ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-500">{user.institution}</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={selectedMembers.includes(user.id)}
                      onChange={() => toggleMember(user.id)}
                      className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer" 
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => router.push('/dashboard')} className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 border border-transparent rounded-xl hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 rounded-xl hover:from-brand-700 hover:to-brand-600 transition-all shadow-md shadow-brand-500/30 flex items-center gap-2 disabled:opacity-70">
                <Save size={18} /> {isSubmitting ? "Guardando..." : "Guardar Borrador"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
