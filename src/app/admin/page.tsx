"use client";

import { supabase } from "@/lib/supabase";
import { Check, X, ShieldCheck, Building2, BookOpen, AlertCircle, Clock, CheckCircle2, XCircle, Home, Users, Eye, UserPlus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Toast component internal to avoid creating a new file
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-5 fade-in duration-300 ${
      type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      {type === 'success' ? <CheckCircle2 className="text-emerald-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
      <p className="font-bold text-sm">{message}</p>
      <button onClick={onClose} className="p-1.5 hover:bg-black/5 rounded-lg transition-colors ml-4">
        <X size={18} />
      </button>
    </div>
  );
}

// Datos falsos (mock) para la gestión de usuarios
const mockUsers = [
  { id: '1', name: 'Dr. María González', email: 'maria.g@universidad.edu', role: 'ADMIN', status: 'ACTIVE', department: 'Ciencias de la Computación', avatar: 'MG' },
  { id: '2', name: 'Prof. Carlos Ruiz', email: 'carlos.ruiz@universidad.edu', role: 'RESEARCHER', status: 'ACTIVE', department: 'Física Aplicada', avatar: 'CR' },
  { id: '3', name: 'Ana Silva', email: 'asilva@universidad.edu', role: 'RESEARCHER', status: 'PENDING', department: 'Biología Molecular', avatar: 'AS' },
  { id: '4', name: 'Dr. Jorge López', email: 'jlopez@universidad.edu', role: 'RESEARCHER', status: 'INACTIVE', department: 'Ingeniería Química', avatar: 'JL' },
  { id: '5', name: 'Carlos Mendoza', email: 'cmendoza@universidad.edu', role: 'RESEARCHER', status: 'ACTIVE', department: 'Ingeniería de Software', avatar: 'CM' },
];

type TabType = 'pending' | 'approved' | 'rejected' | 'users';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Estado para el modal de proyecto
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }

  useEffect(() => {
    const loadData = async () => {
      const { data: pData } = await supabase.from('proyectos').select('*');
      if (pData) {
        setProjects((pData as any[]).map(p => ({
          id: p.id,
          title: p.nombre,
          summary: p.descripcion,
          entidad_financiadora: p.entidad_financiadora,
          presupuesto: p.presupuesto,
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

  // Stats
  const totalProjects = projects.length;
  const pendingProjects = projects.filter(p => p.status === "PENDING_APPROVAL");
  const activeProjects = projects.filter(p => p.status === "ACTIVE");
  
  const totalPublications = publications.length;
  const pendingPublications = publications.filter(p => p.status === "SUBMITTED");
  const acceptedPublications = publications.filter(p => p.status === "ACCEPTED");

  // Filtering based on tab
  const getFilteredProjects = () => {
    if (activeTab === 'pending') return pendingProjects;
    if (activeTab === 'approved') return activeProjects;
    if (activeTab === 'rejected') return projects.filter(p => p.status === "REJECTED");
    return [];
  };

  const getFilteredPublications = () => {
    if (activeTab === 'pending') return pendingPublications;
    if (activeTab === 'approved') return acceptedPublications;
    if (activeTab === 'rejected') return publications.filter(p => p.status === "REJECTED");
    return [];
  };

  const filteredProjects = getFilteredProjects();
  const filteredPublications = getFilteredPublications();

  const handleApproveProject = async (id: string) => {
    // @ts-ignore
    const { error } = await supabase.from('proyectos').update({ estado: 'ACTIVE' }).eq('id', id);
    if (!error) {
      setProjects(projects.map(p => p.id === id ? { ...p, status: "ACTIVE" } : p));
      showToast("Proyecto aprobado y publicado correctamente.", "success");
    } else {
      showToast("Error al aprobar proyecto: " + error.message, "error");
    }
  };

  const handleRejectProject = async (id: string) => {
    // @ts-ignore
    const { error } = await supabase.from('proyectos').update({ estado: 'REJECTED' }).eq('id', id);
    if (!error) {
      setProjects(projects.map(p => p.id === id ? { ...p, status: "REJECTED" } : p));
      showToast("Proyecto rechazado.", "success");
    } else {
      showToast("Error al rechazar proyecto: " + error.message, "error");
    }
  };

  const handleUpdatePublication = async (id: string, newStatus: "ACCEPTED" | "REJECTED") => {
    // @ts-ignore
    const { error } = await supabase.from('publicaciones').update({ estado: newStatus }).eq('id', id);
    if (!error) {
      setPublications(publications.map(p => p.id === id ? { ...p, status: newStatus } : p));
      showToast(`Publicación ${newStatus === "ACCEPTED" ? "aceptada" : "rechazada"} correctamente.`, "success");
    } else {
      showToast("Error al actualizar la publicación: " + error.message, "error");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-900 pb-16">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Modal de Revisión de Proyecto */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedProject(null)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-8 sm:p-10">
               <div className="flex justify-between items-start mb-8 gap-6">
                 <div>
                   <span className="bg-amber-100 text-amber-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Revisión Pendiente</span>
                   <h2 className="text-3xl font-extrabold text-slate-900 mt-5 leading-tight">{selectedProject.title}</h2>
                 </div>
                 <button onClick={() => setSelectedProject(null)} className="p-2.5 bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors flex-shrink-0">
                   <X size={20} />
                 </button>
               </div>
               
               <div className="space-y-8">
                 <div>
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Descripción del Proyecto</h4>
                   <p className="text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 text-[15px]">{selectedProject.summary || 'Sin descripción detallada.'}</p>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                     <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Entidad Financiadora</span>
                     <span className="font-bold text-slate-900 text-lg">{selectedProject.entidad_financiadora || 'No especificada'}</span>
                   </div>
                   <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                     <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Presupuesto Asignado</span>
                     <span className="font-bold text-emerald-600 text-lg">{selectedProject.presupuesto ? `${selectedProject.presupuesto.toLocaleString('es-ES')} €` : 'No especificado'}</span>
                   </div>
                 </div>
               </div>
               
               <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-4">
                 <button 
                   onClick={() => { handleRejectProject(selectedProject.id); setSelectedProject(null); }}
                   className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all"
                 >
                   Rechazar Proyecto
                 </button>
                 <button 
                   onClick={() => { handleApproveProject(selectedProject.id); setSelectedProject(null); }}
                   className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/30 rounded-xl transition-all"
                 >
                   <Check size={18} /> Aprobar y Publicar
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Header/Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-2.5 rounded-2xl shadow-lg shadow-brand-500/30">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Panel de Administración</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Gestión de la plataforma</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-all">
            <Home size={18} />
            <span className="hidden sm:inline">Volver al Portal</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 max-w-7xl mt-10 space-y-10">
        
        {/* Statistics Overview */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat Card 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-6 -top-6 bg-brand-50 rounded-full p-8 transition-transform group-hover:scale-110">
                <Clock className="text-brand-500/30" size={64} />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Pendientes Totales</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-extrabold text-slate-900 tracking-tighter">{pendingProjects.length + pendingPublications.length}</h3>
                </div>
                <p className="text-xs font-medium text-slate-400 mt-2">Requieren revisión</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-6 -top-6 bg-emerald-50 rounded-full p-8 transition-transform group-hover:scale-110">
                <Building2 className="text-emerald-500/30" size={64} />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Proyectos Activos</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-extrabold text-slate-900 tracking-tighter">{activeProjects.length}</h3>
                  <span className="text-sm font-bold text-emerald-600">/ {totalProjects}</span>
                </div>
                <p className="text-xs font-medium text-slate-400 mt-2">En ejecución actualmente</p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-6 -top-6 bg-accent-50 rounded-full p-8 transition-transform group-hover:scale-110">
                <BookOpen className="text-accent-500/30" size={64} />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Pubs. Aceptadas</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-extrabold text-slate-900 tracking-tighter">{acceptedPublications.length}</h3>
                  <span className="text-sm font-bold text-accent-600">/ {totalPublications}</span>
                </div>
                <p className="text-xs font-medium text-slate-400 mt-2">Publicadas en el portal</p>
              </div>
            </div>

            {/* Stat Card 4 - System Status */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-900/20 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">Sistema</h3>
                <p className="text-sm text-slate-300">Conexión con base de datos estable.</p>
              </div>
              <div className="relative z-10 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-emerald-400 bg-black/20 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Online</span>
                </div>
                <Users size={24} className="text-slate-500 opacity-50" />
              </div>
            </div>

          </div>
        </section>

        {/* Workspace Area */}
        <section className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-100 overflow-hidden flex flex-col">
          
          {/* Tabs */}
          <div className="bg-slate-50/80 border-b border-slate-100 px-4 sm:px-10 flex gap-2 sm:gap-8 overflow-x-auto no-scrollbar">
            {(['pending', 'approved', 'rejected', 'users'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-6 px-4 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-t-xl'
                }`}
              >
                {tab === 'users' && <Users size={16} />}
                {tab === 'pending' && 'Pendientes de Revisión'}
                {tab === 'approved' && 'Aprobados / Aceptados'}
                {tab === 'rejected' && 'Rechazados'}
                {tab === 'users' && 'Gestión de Usuarios'}
                
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.5)]"></div>
                )}
                {/* Badge for pending items */}
                {tab === 'pending' && (pendingProjects.length > 0 || pendingPublications.length > 0) && (
                  <span className={`ml-2 inline-flex items-center justify-center text-xs rounded-full h-5 px-2.5 font-extrabold ${activeTab === 'pending' ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500'}`}>
                    {pendingProjects.length + pendingPublications.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10 bg-slate-50/30">
            {activeTab !== 'users' ? (
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Proyectos Column */}
                <div className="flex flex-col h-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                    <div className="bg-blue-50 p-2.5 rounded-xl">
                      <Building2 className="text-blue-500" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Proyectos</h2>
                  </div>

                  <div className="flex flex-col gap-4 flex-1">
                    {filteredProjects.map(project => (
                      <div key={project.id} className="group bg-slate-50/50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-2xl p-5 transition-all duration-300">
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight text-lg">{project.title}</h3>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                            project.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                            project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {project.status === 'PENDING_APPROVAL' ? 'Pendiente' : project.status === 'ACTIVE' ? 'Activo' : 'Rechazado'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-5 leading-relaxed">{project.summary}</p>
                        
                        {activeTab === 'pending' && (
                          <div className="pt-4 border-t border-slate-200/50">
                            <button 
                              onClick={() => setSelectedProject(project)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 hover:text-brand-800 border border-brand-200/50 rounded-xl transition-all"
                            >
                              <Eye size={18} /> Revisar Detalles
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {filteredProjects.length === 0 && (
                      <div className="flex flex-col items-center justify-center flex-1 py-16 text-center rounded-2xl bg-slate-50/50">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-100">
                          <CheckCircle2 className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-500 font-bold">No hay proyectos aquí</p>
                        <p className="text-sm text-slate-400 mt-1 font-medium">Todo está organizado en esta vista.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Publicaciones Column */}
                <div className="flex flex-col h-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                    <div className="bg-purple-50 p-2.5 rounded-xl">
                      <BookOpen className="text-purple-500" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Publicaciones</h2>
                  </div>

                  <div className="flex flex-col gap-4 flex-1">
                    {filteredPublications.map(pub => (
                      <div key={pub.id} className="group bg-slate-50/50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 rounded-2xl p-5 transition-all duration-300">
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <h3 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors leading-tight text-lg">{pub.title}</h3>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider whitespace-nowrap ${
                            pub.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-700' :
                            pub.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {pub.status === 'SUBMITTED' ? 'Pendiente' : pub.status === 'ACCEPTED' ? 'Aceptada' : 'Rechazada'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-5">
                          <Users size={14} className="text-brand-500" />
                          <p className="text-sm font-semibold text-brand-700 line-clamp-1">{pub.authors.join(", ")}</p>
                        </div>
                        
                        {activeTab === 'pending' && (
                          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/50">
                            <button 
                              onClick={() => handleUpdatePublication(pub.id, "REJECTED")}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-xl transition-all"
                            >
                              <X size={16} /> Rechazar
                            </button>
                            <button 
                              onClick={() => handleUpdatePublication(pub.id, "ACCEPTED")}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 rounded-xl transition-all"
                            >
                              <Check size={16} /> Aceptar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {filteredPublications.length === 0 && (
                      <div className="flex flex-col items-center justify-center flex-1 py-16 text-center rounded-2xl bg-slate-50/50">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-100">
                          <AlertCircle className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-500 font-bold">No hay publicaciones aquí</p>
                        <p className="text-sm text-slate-400 mt-1 font-medium">No hay elementos que mostrar en esta vista.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Vista de Gestión de Usuarios */
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h2>
                    <p className="text-slate-500 text-sm mt-1">Administra los roles y accesos a la plataforma.</p>
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all">
                    <UserPlus size={18} />
                    <span>Invitar Usuario</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th scope="col" className="px-6 py-4">Usuario</th>
                        <th scope="col" className="px-6 py-4">Departamento</th>
                        <th scope="col" className="px-6 py-4">Rol</th>
                        <th scope="col" className="px-6 py-4">Estado</th>
                        <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {mockUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold shadow-inner">
                                {user.avatar}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{user.name}</div>
                                <div className="text-slate-500 text-xs">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700">
                            {user.department}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs tracking-wider">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                              user.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : user.status === 'PENDING' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                              {user.status === 'ACTIVE' ? 'Activo' : user.status === 'PENDING' ? 'Pendiente' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Editar">
                                <Edit2 size={16} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
