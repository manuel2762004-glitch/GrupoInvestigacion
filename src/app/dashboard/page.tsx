"use client";

import { mockProjects, mockPublications, mockUsers } from "@/lib/mockData";
import { PlusCircle, FileText, Settings, User as UserIcon, LogOut, CheckCircle2, Clock, BookOpen, Building2, ChevronRight, Edit3, Send } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const currentUser = mockUsers[1];
  
  const myProjects = mockProjects.filter(p => p.members.some(m => m.userId === currentUser.id));
  const myPublications = mockPublications.filter(p => p.authors.includes(`${currentUser.firstName} ${currentUser.lastName}`));

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Top Gradient Header */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-700 pb-24 pt-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-extrabold tracking-tight">Panel de Control</h1>
              <p className="text-brand-100 mt-1 opacity-90">Gestión personal de investigación</p>
            </div>
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all backdrop-blur-md">
              <LogOut size={16} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-16">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Card & Quick Actions */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-brand-900/5 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-brand-50"></div>
              <div className="relative flex flex-col items-center mt-6 text-center">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-brand-600 mb-4 border-4 border-white shadow-md overflow-hidden ring-4 ring-brand-50/50">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={48} className="text-slate-300" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{currentUser.firstName} {currentUser.lastName}</h2>
                <div className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-brand-50 text-brand-700 text-sm font-bold tracking-wide">
                  {currentUser.isDoctor ? 'Doctorado' : 'Investigador'}
                </div>
                <p className="text-sm text-slate-500 mt-3 font-medium flex items-center justify-center gap-1.5">
                  <Building2 size={16} className="text-slate-400" />
                  {currentUser.institution}
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-4 py-2 rounded-xl transition-all">
                  <Settings size={16} /> Modificar Perfil
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-brand-900/5 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-xs">Acciones Rápidas</h3>
              <div className="flex flex-col gap-3">
                <Link href="/projects/new" className="flex items-center justify-between w-full p-4 text-left bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl"><PlusCircle size={20} /></div>
                    <span className="font-semibold">Nuevo Proyecto</span>
                  </div>
                  <ChevronRight size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link href="/publications/new" className="flex items-center justify-between w-full p-4 text-left bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-slate-500"><FileText size={20} /></div>
                    <span className="font-semibold">Añadir Publicación</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Mis Proyectos */}
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-brand-900/5 border border-slate-100">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="text-brand-500" /> Mis Proyectos
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Proyectos en los que estás participando</p>
                </div>
                <Link href="/projects" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group">
                  Ver todos <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              
              <div className="grid gap-4">
                {myProjects.map(project => (
                  <div key={project.id} className="group relative bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:shadow-md hover:border-brand-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                          project.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' : 
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {project.status === 'ACTIVE' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {project.status === 'ACTIVE' ? 'Activo' : project.status === 'PENDING_APPROVAL' ? 'Pendiente' : project.status}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Rol: {project.members.find(m => m.userId === currentUser.id)?.role.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-slate-800 group-hover:text-brand-700 transition-colors">{project.title}</h4>
                    </div>
                    
                    <div className="shrink-0">
                      <Link href={`/projects/${project.id}`} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all shadow-sm">
                        Gestionar
                      </Link>
                    </div>
                  </div>
                ))}
                {myProjects.length === 0 && (
                  <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                    No participas en ningún proyecto actualmente.
                  </div>
                )}
              </div>
            </section>

            {/* Mis Publicaciones */}
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-brand-900/5 border border-slate-100">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="text-accent-500" /> Mis Publicaciones
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Artículos en los que eres autor/coautor</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                {myPublications.map(pub => (
                  <div key={pub.id} className="group bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:shadow-md hover:border-accent-200 transition-all flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-accent-700 transition-colors">{pub.title}</h4>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        Estado: 
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          pub.status === 'PUBLISHED' ? 'bg-blue-100 text-blue-700' :
                          pub.status === 'SUBMITTED' ? 'bg-purple-100 text-purple-700' :
                          pub.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {pub.status === 'PUBLISHED' ? 'Publicado' : pub.status === 'SUBMITTED' ? 'Enviado' : pub.status}
                        </span>
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 mt-auto sm:mt-0">
                      <button onClick={() => alert("Abriendo editor de publicación...")} className="p-2 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-brand-600 transition-colors shadow-sm" title="Editar publicación">
                        <Edit3 size={18} />
                      </button>
                      {pub.status === 'DRAFT' && (
                        <button onClick={() => alert("Publicación enviada a revisión con éxito.")} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-accent-600 rounded-xl hover:bg-accent-700 transition-all shadow-md shadow-accent-600/20" title="Enviar a revisión">
                          <Send size={14} />
                          Enviar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {myPublications.length === 0 && (
                  <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                    No has añadido ninguna publicación todavía.
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
