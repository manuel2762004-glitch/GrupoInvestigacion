import { mockProjects, mockUsers } from "@/lib/mockData";
import { Building2, Calendar, CheckCircle2, Clock, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  // Get full member details
  const projectMembers = project.members.map(member => {
    const user = mockUsers.find(u => u.id === member.userId);
    return { ...member, user };
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/projects" className="text-brand-600 hover:underline text-sm font-medium">
            &larr; Volver a Proyectos
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-brand-900 p-8 md:p-12 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                project.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' :
                project.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' :
                'bg-amber-500/20 text-amber-200 border border-amber-500/30'
              }`}>
                {project.status === 'ACTIVE' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {project.status === 'ACTIVE' ? 'Activo' : project.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">{project.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-brand-300" />
                <span>{project.fundingEntity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand-300" />
                <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
              </div>
              {project.budget && (
                <div className="flex items-center gap-2">
                  <span className="text-brand-300 font-bold">€</span>
                  <span>{project.budget.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-12">
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Resumen del Proyecto</h2>
              <p className="text-slate-600 leading-relaxed text-lg">{project.summary}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Users className="text-brand-600" /> Equipo de Investigación
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {projectMembers.map((member, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-600 shadow-sm overflow-hidden shrink-0">
                      {member.user?.avatarUrl ? (
                        <img src={member.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold">{member.user?.firstName?.[0]}{member.user?.lastName?.[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{member.user?.firstName} {member.user?.lastName}</p>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">
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
