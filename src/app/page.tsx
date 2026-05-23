import { mockProjects, mockPublications, mockResearchLines } from "@/lib/mockData";
import { ArrowRight, BookOpen, Lightbulb, Users, Search, Microscope, Award, Building2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const client = supabase as any;

  // Query projects and publications from Supabase
  const { data: dbProjects } = await client
    .from("proyectos")
    .select("*")
    .limit(3);

  const { data: dbPublications } = await client
    .from("publicaciones")
    .select("*")
    .limit(3);

  // Query counts for the stats section
  const { count: projectsCount } = await client
    .from("proyectos")
    .select("*", { count: "exact", head: true });

  const { count: publicationsCount } = await client
    .from("publicaciones")
    .select("*", { count: "exact", head: true });

  const { count: linesCount } = await client
    .from("lineas_investigacion")
    .select("*", { count: "exact", head: true });

  // Map database structures to UI structures, or fallback to mockData if DB is empty
  const recentProjects = dbProjects && dbProjects.length > 0
    ? dbProjects.map((p: any) => ({
        id: p.id,
        title: p.nombre,
        summary: p.descripcion || "",
        fundingEntity: "Plan Nacional de I+D",
        status: "ACTIVE" as const,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      }))
    : mockProjects.slice(0, 3);

  const recentPublications = dbPublications && dbPublications.length > 0
    ? dbPublications.map((p: any) => ({
        id: p.id,
        title: p.titulo,
        authors: p.autores ? p.autores.split(", ") : [],
        doi: p.doi || undefined,
        status: "PUBLISHED" as const,
      }))
    : mockPublications.slice(0, 3);

  const totalProjects = projectsCount !== null && projectsCount > 0 ? projectsCount : mockProjects.length;
  const totalPublications = publicationsCount !== null && publicationsCount > 0 ? publicationsCount : mockPublications.length;
  const totalLines = linesCount !== null && linesCount > 0 ? linesCount : mockResearchLines.length;


  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-accent-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10 flex flex-col items-center text-center">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-brand-100 uppercase bg-brand-800/50 rounded-full border border-brand-400/30 mb-6 backdrop-blur-md inline-block">
            Portal Científico
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
            Impulsando la <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-100 to-brand-300">investigación del mañana</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-100 mb-10 max-w-2xl font-light">
            Explora nuestros proyectos innovadores, descubre publicaciones de alto impacto y conecta con nuestra red de investigadores multidisciplinares.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
            <Link href="/projects" className="px-8 py-3 rounded-full bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-all shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2">
              Ver Proyectos <ArrowRight size={18} />
            </Link>
            <Link href="/research-lines" className="px-8 py-3 rounded-full bg-brand-700/50 text-white font-semibold hover:bg-brand-700 transition-all border border-brand-400/30 backdrop-blur-sm text-center">
              Líneas de Investigación
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="glass-panel rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4">
            <div className="bg-brand-100 p-3 rounded-full text-brand-600 mb-3">
              <Microscope size={28} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{totalProjects}</h3>
            <p className="text-sm text-slate-500 font-medium">Proyectos Activos</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="bg-accent-100 p-3 rounded-full text-accent-600 mb-3">
              <BookOpen size={28} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{totalPublications}</h3>
            <p className="text-sm text-slate-500 font-medium">Publicaciones</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mb-3">
              <Award size={28} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{totalLines}</h3>
            <p className="text-sm text-slate-500 font-medium">Líneas de Invest.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600 mb-3">
              <Users size={28} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">12+</h3>
            <p className="text-sm text-slate-500 font-medium">Investigadores</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 mt-8">
        {/* Recent Projects */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Proyectos Destacados</h2>
              <p className="text-slate-500">Investigaciones actualmente en curso</p>
            </div>
            <Link href="/projects" className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
               <div className="grid gap-4">
            {recentProjects.map((project: any) => (
              <div key={project.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-brand-200 group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-slate-800 group-hover:text-brand-600 transition-colors">
                    <Link href={`/projects/${project.id}`}>{project.title}</Link>
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                    project.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {project.status === 'ACTIVE' ? 'Activo' : project.status === 'PENDING_APPROVAL' ? 'Pendiente' : project.status}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.summary}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-slate-400" />
                    <span>{project.fundingEntity}</span>
                  </div>
                  <span>{new Date(project.startDate).getFullYear()} - {new Date(project.endDate).getFullYear()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Publications */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Últimas Publicaciones</h2>
              <p className="text-slate-500">Artículos y contribuciones científicas</p>
            </div>
            <Link href="/publications" className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid gap-4">
            {recentPublications.map((pub: any) => (
              <div key={pub.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-brand-200">
                <h3 className="font-semibold text-slate-800 mb-2 leading-snug">
                  {pub.title}
                </h3>
                <p className="text-brand-600 text-sm mb-3">
                  {pub.authors.join(", ")}
                </p>
                <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-slate-50">
                  <span className={`px-2 py-1 rounded font-medium ${
                    pub.status === 'PUBLISHED' ? 'bg-blue-50 text-blue-700' :
                    pub.status === 'SUBMITTED' ? 'bg-purple-50 text-purple-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {pub.status === 'PUBLISHED' ? 'Publicado' : pub.status === 'SUBMITTED' ? 'Enviado' : pub.status}
                  </span>
                  
                  {pub.doi && (
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-600 flex items-center gap-1">
                      DOI <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
