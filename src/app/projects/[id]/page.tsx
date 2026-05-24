import { mockUsers } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import { Building2, Calendar, CheckCircle2, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Realizar las consultas a Supabase en paralelo del lado del servidor
  const [projectResponse, publicationsResponse] = await Promise.all([
    supabase.from('proyectos').select('*').eq('id', id).single(),
    supabase.from('publicaciones').select('*').eq('id_proyecto', id)
  ]);

  const project = projectResponse.data as any;
  const publications = (publicationsResponse.data || []) as any[];

  if (!project) {
    notFound();
  }

  // Mapear miembros de equipo ficticios para mantener la riqueza de la UI
  const projectMembers = [
    { userId: "u1", role: "INVESTIGADOR_PRINCIPAL", user: mockUsers[0] },
    { userId: "u2", role: "EQUIPO_INVESTIGACION", user: mockUsers[1] },
    { userId: "u3", role: "EQUIPO_TRABAJO", user: mockUsers[2] }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/projects" className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
            &larr; Volver a Proyectos
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 p-8 md:p-12 text-white relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.estado === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' :
                  project.estado === 'COMPLETED' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' :
                    'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                  }`}>
                  {project.estado === 'ACTIVE' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {project.estado === 'ACTIVE' ? 'Activo' : project.estado === 'COMPLETED' ? 'Completado' : 'Pendiente de Aprobación'}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">{project.nombre}</h1>

              <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <Building2 size={18} className="text-blue-300" />
                  <span>{project.entidad_financiadora || 'Financiación Interna'}</span>
                </div>
                {project.fecha_inicio && project.fecha_fin && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                    <Calendar size={18} className="text-blue-300" />
                    <span>{new Date(project.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(project.fecha_fin).toLocaleDateString('es-ES')}</span>
                  </div>
                )}
                {project.presupuesto !== undefined && project.presupuesto !== null && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                    <span className="text-blue-300 font-bold">€</span>
                    <span>{project.presupuesto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Resumen */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Resumen del Proyecto</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{project.descripcion || 'No se ha provisto una descripción para este proyecto.'}</p>
            </div>

            {/* Publicaciones Relacionadas */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                Publicaciones Científicas ({publications.length})
              </h2>
              {publications.length > 0 ? (
                <div className="grid gap-4 mt-4">
                  {publications.map((pub: any) => (
                    <div key={pub.id} className="bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 p-5 rounded-2xl transition-all shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 leading-snug">{pub.titulo}</h4>
                        <p className="text-blue-600 text-sm mt-1 font-medium">{pub.autores}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${pub.estado === 'PUBLISHED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          pub.estado === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            'bg-purple-100 text-purple-800 border border-purple-200'
                          }`}>
                          {pub.estado === 'PUBLISHED' ? 'Publicado' : pub.estado === 'ACCEPTED' ? 'Aceptado' : 'En Revisión'}
                        </span>
                        {pub.doi && (
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm" title="Ver artículo (DOI)">
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-sm mt-2">No se han registrado artículos científicos asociados a este proyecto todavía.</p>
              )}
            </div>

            {/* Equipo de Investigadores */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Users className="text-blue-600" /> Equipo de Investigación
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {projectMembers.map((member, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm overflow-hidden shrink-0 border border-slate-200">
                      {member.user?.avatarUrl ? (
                        <img src={member.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold">{member.user?.firstName?.[0]}{member.user?.lastName?.[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{member.user?.firstName} {member.user?.lastName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {member.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}