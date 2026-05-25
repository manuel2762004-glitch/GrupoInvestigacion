"use client";

import { mockUsers } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import { 
  PlusCircle, FileText, Settings, User as UserIcon, LogOut, CheckCircle2, 
  Clock, BookOpen, Building2, ChevronRight, Edit3, Send, Beaker, 
  Play, Check, X, ShieldAlert, Sparkles, AlertCircle, RefreshCw 
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Listado de destinos de publicación científicos con sus métricas
const scientificVenues = [
  { id: "nature", name: "Nature Journal", abbrev: "Nature", type: "REVISTA", difficulty: 9.0, impactFactor: 64.8, acceptanceRate: "5%" },
  { id: "science", name: "Science Magazine", abbrev: "Science", type: "REVISTA", difficulty: 8.8, impactFactor: 56.9, acceptanceRate: "6%" },
  { id: "cvpr", name: "IEEE/CVF CVPR (Computer Vision)", abbrev: "CVPR", type: "CONFERENCIA", difficulty: 7.5, impactFactor: 15.6, acceptanceRate: "20%" },
  { id: "tse", name: "IEEE Transactions on Software Engineering", abbrev: "TSE", type: "REVISTA", difficulty: 7.0, impactFactor: 9.5, acceptanceRate: "15%" },
  { id: "chi", name: "ACM CHI (Human-Computer Interaction)", abbrev: "CHI", type: "CONFERENCIA", difficulty: 6.0, impactFactor: 8.4, acceptanceRate: "25%" },
  { id: "jair", name: "Journal of Artificial Intelligence Research", abbrev: "JAIR", type: "REVISTA", difficulty: 5.0, impactFactor: 5.2, acceptanceRate: "30%" }
];

export default function Dashboard() {
  const currentUser = mockUsers[1];
  
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [myPublications, setMyPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del Simulador de Revisión por Pares
  const [selectedPub, setSelectedPub] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<string>("jair");
  const [simulationStep, setSimulationStep] = useState<number>(0); // 0: Config/Idle, 1: Animación, 2: Dictamen Final
  const [loadingText, setLoadingText] = useState<string>("");
  const [reviewResult, setReviewResult] = useState<any | null>(null);
  const [destinationEmail, setDestinationEmail] = useState<string>("");
  const [customType, setCustomType] = useState<string>("REVISTA");

  const loadData = async () => {
    try {
      const { data: projData } = await supabase.from('proyectos').select('*');
      if (projData) {
        setMyProjects((projData as any[]).map(p => ({ 
          id: p.id,
          title: p.nombre,
          summary: p.descripcion,
          status: p.estado || 'PENDING_APPROVAL',
          members: [] 
        })));
      }

      const { data: pubData } = await supabase.from('publicaciones').select('*');
      if (pubData) {
        setMyPublications((pubData as any[]).map(p => ({ 
          id: p.id,
          title: p.titulo,
          authors: typeof p.autores === 'string' ? p.autores.split(',') : (p.autores || []),
          status: p.estado || 'SUBMITTED',
          doi: p.doi
        })));
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Función para obtener la clasificación cualitativa del factor de impacto (JIF)
  const getImpactClass = (factor: number) => {
    if (factor >= 10) return "Excelente";
    if (factor >= 5) return "Alto";
    if (factor >= 2) return "Medio";
    return "Bajo";
  };

  // Función para ejecutar la simulación de revisión científica interactiva
  const startSimulation = async () => {
    if (!selectedPub) return;
    setSimulationStep(1);

    const venue = scientificVenues.find(v => v.id === selectedVenue)!;

    // Fase 1: Envío (0-1s)
    setLoadingText(destinationEmail ? `Enviando manuscrito científico a ${destinationEmail}...` : "Enviando manuscrito científico a la secretaría del comité editorial...");
    
    await new Promise(r => setTimeout(r, 1000));
    // Fase 2: Asignación (1-2s)
    setLoadingText("Asignando 3 revisores pares internacionales del comité científico (Double-Blind)...");

    await new Promise(r => setTimeout(r, 1000));
    // Fase 3: Evaluación (2-3s)
    setLoadingText(`Evaluando novedad científica frente al factor de impacto (JIF: ${venue.impactFactor})...`);

    await new Promise(r => setTimeout(r, 1000));
    // Fase 4: Dictamen (3-4s)
    setLoadingText("Compilando valoraciones y generando dictamen metodológico final...");

    await new Promise(r => setTimeout(r, 1000));

    // Algoritmo matemático para evaluar si es aceptado (basado en dificultad)
    const score = parseFloat((Math.random() * 5 + 5).toFixed(1)); // Calificación entre 5.0 y 10.0
    const accepted = score >= venue.difficulty;
    let generatedDoi = null;
    let comments = [];

    if (accepted) {
      generatedDoi = `10.1109/${venue.abbrev.toUpperCase()}.2026.${Math.floor(Math.random() * 90000 + 10000)}`;
      comments = [
        `Revisor 1: "Excelente marco experimental. El enfoque de resolución de problemas es riguroso y está muy bien evaluado."`,
        `Revisor 2: "Contribución sólida de gran interés para los lectores del medio. Metodología impecable."`
      ];

      // Actualizar en base de datos Supabase
      try {
        await fetch('/api/publications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedPub.id, estado: 'ACCEPTED', doi: generatedDoi })
        });
      } catch (err) {
        console.error("Error al actualizar estado en Supabase:", err);
      }
    } else {
      comments = [
        `Revisor 1: "Aunque la premisa es interesante, el tamaño de la muestra empírica es limitado y falta comparar contra el estado del arte."`,
        `Revisor 2: "Falta formalismo en el modelado teórico de la propuesta. Requiere revisiones mayores de fondo."`
      ];

      // Actualizar en base de datos Supabase a REJECTED
      try {
        await fetch('/api/publications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedPub.id, estado: 'REJECTED' })
        });
      } catch (err) {
        console.error("Error al actualizar estado en Supabase:", err);
      }
    }

    setReviewResult({
      score,
      accepted,
      doi: generatedDoi,
      comments,
      venue
    });

    setSimulationStep(2);
    // Recargar datos suavemente en el dashboard
    loadData();
  };

  const openSimulator = (pub: any) => {
    setSelectedPub(pub);
    setSelectedVenue("jair");
    setSimulationStep(0);
    setReviewResult(null);
    setIsModalOpen(true);
  };

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
                          Rol: {project.members?.find((m: any) => m.userId === currentUser.id)?.role?.replace('_', ' ') || 'CREADOR'}
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
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span>Estado:</span> 
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          pub.status === 'PUBLISHED' ? 'bg-blue-100 text-blue-700' :
                          pub.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                          pub.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          pub.status === 'SUBMITTED' ? 'bg-purple-100 text-purple-700' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {pub.status === 'PUBLISHED' ? 'Publicado' : 
                           pub.status === 'ACCEPTED' ? 'Aceptado' : 
                           pub.status === 'REJECTED' ? 'Rechazado' :
                           pub.status === 'SUBMITTED' ? 'En Revisión' : pub.status}
                        </span>
                      </div>
                      {pub.doi && (
                        <p className="text-xs text-slate-400 mt-2 font-mono">
                          DOI: {pub.doi}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 flex items-center gap-2 mt-auto sm:mt-0">
                      <button onClick={() => alert("Abriendo editor de publicación...")} className="p-2 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-brand-600 transition-colors shadow-sm" title="Editar publicación">
                        <Edit3 size={18} />
                      </button>
                      
                      {/* Mostrar botón para simular envío si está en borrador, en revisión o rechazado */}
                      {(pub.status === 'DRAFT' || pub.status === 'SUBMITTED' || pub.status === 'REJECTED') && (
                        <button 
                          onClick={() => openSimulator(pub)} 
                          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-accent-600 to-accent-500 rounded-xl hover:from-accent-700 hover:to-accent-600 transition-all shadow-md shadow-accent-500/20" 
                          title="Simular envío a revisión por pares"
                        >
                          <Beaker size={15} />
                          Simular Envío
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

      {/* MODAL DEL SIMULADOR DE ENVIOS CIENTIFICOS */}
      {isModalOpen && selectedPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden transform scale-100 transition-all flex flex-col max-h-[90vh]">
            
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-accent-600 to-brand-700 p-6 text-white relative shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={simulationStep === 1}
                className="absolute top-4 right-4 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3">
                <Beaker className="text-white" size={24} />
                <h3 className="text-xl font-bold">Simulador de Revisión Científica</h3>
              </div>
              <p className="text-white/80 text-xs mt-1 leading-snug line-clamp-1">
                Artículo: "{selectedPub.title}"
              </p>
            </div>

            {/* Contenido según el paso de Simulación */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* PASO 0: Configuración del Envío */}
              {simulationStep === 0 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detalles del Manuscrito</h4>
                    <p className="text-slate-800 font-bold leading-snug">{selectedPub.title}</p>
                    <p className="text-brand-600 text-xs font-medium mt-1.5">{selectedPub.authors.join(", ")}</p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/50">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Envío por Correo Electrónico (Opcional)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">¿A qué correo quieres enviarlo?</label>
                        <input 
                          type="email"
                          value={destinationEmail}
                          onChange={(e) => setDestinationEmail(e.target.value)}
                          placeholder="ej: editor@nature.com"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Si es destino personalizado, ¿es Revista o Conferencia?</label>
                        <select 
                          value={customType}
                          onChange={(e) => setCustomType(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white outline-none text-sm"
                        >
                          <option value="REVISTA">Revista Científica</option>
                          <option value="CONFERENCIA">Conferencia</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Selecciona Revista o Conferencia Destino (Predefinido)</label>
                    <div className="grid gap-3 max-h-60 overflow-y-auto pr-1">
                      {scientificVenues.map(v => (
                        <div 
                          key={v.id}
                          onClick={() => setSelectedVenue(v.id)}
                          className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-center justify-between ${
                            selectedVenue === v.id 
                              ? 'border-brand-600 bg-brand-50/50 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                v.type === 'REVISTA' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {v.type}
                              </span>
                              <h5 className="font-bold text-slate-800 text-sm truncate">{v.name}</h5>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mt-1.5">
                              <span>JIF: <strong className="text-slate-600">{v.impactFactor}</strong></span>
                              <span>Tasa Aceptación: <strong className="text-slate-600">{v.acceptanceRate}</strong></span>
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col items-end">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              v.difficulty >= 8.5 ? 'bg-red-50 text-red-700 border border-red-200' :
                              v.difficulty >= 7.0 ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                              'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}>
                              Dif. {v.difficulty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={startSimulation}
                    className="w-full py-3.5 font-bold text-white bg-gradient-to-r from-accent-600 to-brand-600 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md shadow-accent-600/10 flex items-center justify-center gap-2"
                  >
                    <Play size={16} fill="white" />
                    Iniciar Simulación Científica
                  </button>
                </div>
              )}

              {/* PASO 1: Animación de Envío en Progreso */}
              {simulationStep === 1 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-100 border-t-brand-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Beaker className="text-brand-500 animate-pulse" size={28} />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <p className="text-slate-800 font-bold text-lg">Revisión Científica en Curso</p>
                    <p className="text-slate-500 text-sm animate-pulse leading-relaxed">{loadingText}</p>
                  </div>
                </div>
              )}

              {/* PASO 2: Dictamen Final */}
              {simulationStep === 2 && reviewResult && (
                <div className="space-y-6">
                  
                  {/* Banner de Estado */}
                  <div className={`p-6 rounded-3xl text-center border relative overflow-hidden ${
                    reviewResult.accepted 
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50/50 border-rose-200 text-rose-800'
                  }`}>
                    <div className="absolute -right-6 -bottom-6 opacity-10">
                      {reviewResult.accepted ? <Check size={120} /> : <X size={120} />}
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-sm ${
                        reviewResult.accepted ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'
                      }`}>
                        {reviewResult.accepted ? <CheckCircle2 size={32} /> : <ShieldAlert size={32} />}
                      </div>
                      
                      <h4 className="text-2xl font-black uppercase tracking-wider">
                        {reviewResult.accepted ? "¡Manuscrito Aceptado!" : "Manuscrito Rechazado"}
                      </h4>
                      <p className="text-xs font-semibold mt-1 opacity-75">
                        {reviewResult.venue.name} (JIF: {reviewResult.venue.impactFactor})
                      </p>

                      <div className="flex items-center gap-4 mt-4 bg-white/70 px-4 py-2 rounded-2xl border border-slate-100 text-slate-800 text-sm font-medium">
                        <span>Puntuación Par: <strong className="text-slate-900">{reviewResult.score} / 10</strong></span>
                        <span className="text-slate-300">|</span>
                        <span>Impacto: <strong className="text-slate-900">{getImpactClass(reviewResult.venue.impactFactor)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del DOI si fue aceptado */}
                  {reviewResult.accepted && reviewResult.doi && (
                    <div className="bg-brand-50/30 p-4 rounded-2xl border border-brand-100 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">DOI Generado Permanentemente</p>
                        <p className="font-mono text-sm text-slate-800 truncate font-bold mt-0.5">{reviewResult.doi}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Verificado
                      </span>
                    </div>
                  )}

                  {/* Valoraciones de los Revisores */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      Comentarios del Comité Editorial
                    </h5>
                    <div className="grid gap-3">
                      {reviewResult.comments.map((comment: string, i: number) => (
                        <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-600 text-sm italic leading-relaxed">
                          {comment}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-2">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-3.5 font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-2xl transition-all shadow-md"
                    >
                      Entendido y Cerrar
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
