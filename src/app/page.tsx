import { ArrowRight, BookOpen, Lightbulb, Users, Microscope, Award, Building2, Shield, Heart, MapPin, Mail, Phone, Clock, Send } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ContactForm } from "@/components/ContactForm";
import { mockUsers } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export default async function Home() {
  const client = supabase as any;

  // Consultas a Supabase seguras y en paralelo del lado del servidor (SSR)
  const [
    projectsRes,
    publicationsRes,
    linesRes,
    projectsCountRes,
    publicationsCountRes,
    linesCountRes
  ] = await Promise.all([
    client.from("proyectos").select("*").limit(3),
    client.from("publicaciones").select("*").limit(3),
    client.from("lineas_investigacion").select("*").limit(3),
    client.from("proyectos").select("*", { count: "exact", head: true }),
    client.from("publicaciones").select("*", { count: "exact", head: true }),
    client.from("lineas_investigacion").select("*", { count: "exact", head: true })
  ]);

  const dbProjects = projectsRes.data || [];
  const dbPublications = publicationsRes.data || [];
  const dbLines = linesRes.data || [];

  const totalProjects = projectsCountRes.count || 0;
  const totalPublications = publicationsCountRes.count || 0;
  const totalLines = linesCountRes.count || 0;

  // Mapeo estructurado para renderizado
  const recentProjects = dbProjects.map((p: any) => ({
    id: p.id,
    title: p.nombre,
    summary: p.descripcion || "Sin descripción disponible.",
    fundingEntity: p.entidad_financiadora || "Financiación Interna",
    status: p.estado || "PENDING_APPROVAL",
    startDate: p.fecha_inicio || new Date().toISOString(),
    endDate: p.fecha_fin || new Date().toISOString(),
  }));

  const recentPublications = dbPublications.map((p: any) => ({
    id: p.id,
    title: p.titulo,
    authors: p.autores ? p.autores.split(", ") : [],
    doi: p.doi || undefined,
    status: p.estado || "SUBMITTED",
  }));

  return (
    <div className="flex flex-col gap-16 pb-16 bg-slate-50 text-slate-800">

      {/* 1. SECCIÓN HERO (Primer Impacto Visual) */}
      <section
        className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white overflow-hidden"
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

        {/* Elementos abstractos decorativos (para la experiencia visual premium) */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-sky-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="container mx-auto px-6 py-24 lg:py-36 relative z-10 flex flex-col items-center text-center max-w-5xl">
          <span
            className="px-4 py-1.5 text-xs font-bold tracking-wider text-blue-200 uppercase bg-blue-950/60 rounded-full border border-blue-500/20 mb-6 backdrop-blur-md inline-block shadow-inner"
          >
            Investigación Científica de Vanguardia
          </span>
          <h1
            id="hero-title"
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-white"
          >
            Impulsando la ciencia del mañana mediante la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">innovación multidisciplinar</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl font-light leading-relaxed">
            Bienvenido a ResearchHUB, el portal del Grupo de Investigación Avanzada. Desarrollamos soluciones científicas en inteligencia artificial, ciberseguridad cuántica y computación distribuida para resolver los retos tecnológicos más complejos de la sociedad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
            <Link
              href="/projects"
              className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              aria-label="Explorar proyectos activos del grupo"
            >
              Explorar Proyectos <ArrowRight size={18} />
            </Link>
            <Link
              href="/research-lines"
              className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/15 transition-all border border-white/15 backdrop-blur-md text-center focus:ring-4 focus:ring-white/20 focus:outline-none"
              aria-label="Ver áreas y líneas de investigación del grupo"
            >
              Líneas de Investigación
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MÉTRICAS CLAVE (Usabilidad y Legibilidad de Datos) */}
      <section
        className="container mx-auto px-6 -mt-24 relative z-20 max-w-6xl"
        aria-label="Estadísticas de impacto del grupo"
      >
        <div className="bg-white rounded-3xl p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-xl shadow-slate-900/5 border border-slate-100/80">
          <div className="flex flex-col items-center p-4 border-r border-slate-100 last:border-r-0">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 mb-4 shadow-inner">
              <Microscope size={32} aria-hidden="true" />
            </div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalProjects}</h3>
            <p className="text-sm text-slate-500 font-semibold mt-1">Proyectos Activos</p>
          </div>
          <div className="flex flex-col items-center p-4 border-r border-slate-100 last:border-r-0">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 mb-4 shadow-inner">
              <BookOpen size={32} aria-hidden="true" />
            </div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalPublications}</h3>
            <p className="text-sm text-slate-500 font-semibold mt-1">Publicaciones de Impacto</p>
          </div>
          <div className="flex flex-col items-center p-4 border-r border-slate-100 last:border-r-0">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 mb-4 shadow-inner">
              <Award size={32} aria-hidden="true" />
            </div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalLines}</h3>
            <p className="text-sm text-slate-500 font-semibold mt-1">Líneas de Estudio</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 mb-4 shadow-inner">
              <Users size={32} aria-hidden="true" />
            </div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">5</h3>
            <p className="text-sm text-slate-500 font-semibold mt-1">Científicos Activos</p>
          </div>
        </div>
      </section>

      {/* 3. ¿QUIÉNES SOMOS Y QUÉ HACEMOS? (Identidad e Impacto Social) */}
      <section
        className="container mx-auto px-6 max-w-6xl"
        aria-labelledby="about-heading"
      >
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest block">Nuestra Misión</span>
            <h2 id="about-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Investigación científica rigurosa orientada al beneficio social y tecnológico
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Somos un grupo de científicos y tecnólogos dedicados a explorar las fronteras del conocimiento. Llevamos a cabo investigación fundamental y aplicada en colaboración con universidades mundiales e industrias de primer nivel.
            </p>
            <p className="text-slate-600 leading-relaxed text-base">
              Nuestra meta es transferir el conocimiento surgido en el laboratorio a la sociedad, mediante patentes, desarrollo de software de código abierto y publicaciones de acceso libre.
            </p>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0 h-fit">
                <Shield size={24} aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Rigor y Ética</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Cada experimento y artículo cumple con los máximos estándares de reproducibilidad y ética científica.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0 h-fit">
                <Heart size={24} aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Ciencia Abierta</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Fomentamos el libre acceso al conocimiento publicando artículos en revistas y repositorios libres (Green/Gold Open Access).</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0 h-fit">
                <Microscope size={24} aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Tecnología Aplicada</h4>
                <p className="text-slate-500 text-sm leading-relaxed">No nos quedamos en la teoría. Creamos prototipos y simuladores para validar nuestras hipótesis.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0 h-fit">
                <Users size={24} aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Formación Activa</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Formamos a la próxima generación de doctores e investigadores mediante mentorías personalizadas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECONOCIMIENTOS DEL MES (Excelencia Científica) */}
      <section
        className="container mx-auto px-6 max-w-6xl"
        aria-labelledby="highlights-heading"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Reconocimiento Académico</span>
          <h2 id="highlights-heading" className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Excelencia Científica del Mes</h2>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Destacamos las contribuciones excepcionales de nuestros investigadores y las publicaciones que están redefiniendo el estado del arte científico.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Columna de Investigadores Destacados */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 shadow-md p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Users className="text-blue-600" size={20} aria-hidden="true" />
                Investigadores del Mes
              </h3>

              <div className="space-y-6">
                {/* Investigador 1 */}
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-white transition-all">
                  <img
                    src={mockUsers[0].avatarUrl}
                    alt={`Fotografía de ${mockUsers[0].firstName} ${mockUsers[0].lastName}`}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">{mockUsers[0].firstName} {mockUsers[0].lastName}</h4>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase mt-1 inline-block">
                      Líder de Investigación
                    </span>
                    <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                      Lidera la línea de Inteligencia Artificial aplicada a la salud, destacada este mes por sus avances en redes convolucionales para diagnóstico clínico.
                    </p>
                  </div>
                </div>

                {/* Investigador 2 */}
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-white transition-all">
                  <img
                    src={mockUsers[1].avatarUrl}
                    alt={`Fotografía de ${mockUsers[1].firstName} ${mockUsers[1].lastName}`}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">{mockUsers[1].firstName} {mockUsers[1].lastName}</h4>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase mt-1 inline-block">
                      Investigador Principal
                    </span>
                    <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                      Reconocido por sus innovaciones en protocolos de autenticación ligeros para Smart Cities y ciberseguridad cuántica en el Edge.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-center mt-6 pt-4 border-t border-slate-100">
              Evaluado mensualmente por el Comité Científico Institucional.
            </div>
          </div>

          {/* Columna de Artículo Destacado */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white p-8 md:p-10 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

            <div className="relative z-10 space-y-6">
              <span className="bg-amber-500/20 text-amber-200 border border-amber-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                🏆 Mejor Artículo del Mes
              </span>

              <div className="space-y-3">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block">Publicación Destacada</span>
                <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">
                  Análisis Cuántico en Redes Neuronales y Criptografía Post-Cuántica
                </h3>
                <p className="text-blue-300 text-sm font-semibold">
                  Autores: Elena Ramírez, Carlos Mendoza
                </p>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed font-light">
                Celebramos la publicación en Science Magazine de nuestro último marco empírico que demuestra la viabilidad de la simulación cuántica para acelerar en un 40% el entrenamiento y robustecer la ciberseguridad en redes neuronales convolucionales.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <span>JIF: <strong className="text-white">56.9 (Q1)</strong></span>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <span>Clasificación: <strong className="text-white">Excelente</strong></span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 mt-8 flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-slate-400">DOI: 10.1126/science.2026.10824</span>
              <a
                href="https://doi.org/10.1126/science.2026.10824"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-white hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                Ver Artículo Completo &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LÍNEAS DE INVESTIGACIÓN REALES (Datos de Supabase) */}
      <section
        className="bg-slate-100/50 py-16 border-y border-slate-200/50"
        aria-labelledby="lines-heading"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Nuestra Especialización</span>
            <h2 id="lines-heading" className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Áreas de Investigación Principal</h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Descubrimientos y desarrollos clasificados en las líneas aprobadas por nuestro comité científico y persistidos de forma segura.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {dbLines.map((line: any) => (
              <div key={line.id} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600 w-fit mb-4">
                    <Lightbulb size={24} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{line.nombre}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">{line.descripcion}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <Link href="/research-lines" className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                    Ver Proyectos Asociados &rarr;
                  </Link>
                </div>
              </div>
            ))}
            {dbLines.length === 0 && (
              <p className="text-slate-400 italic text-center col-span-3">No hay líneas de investigación cargadas en este momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* 5. PROYECTOS Y PUBLICACIONES REALES (Doble Columna Accesible) */}
      <section
        className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12"
        aria-label="Directorio científico en tiempo real"
      >
        {/* Proyectos Destacados */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="text-blue-600" size={24} aria-hidden="true" /> Proyectos Recientes
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">Estudios en curso del grupo</p>
            </div>
            <Link href="/projects" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
              Ver todos &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {recentProjects.map((project: any) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:border-blue-200 group relative"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-blue-600 transition-colors">
                    <Link href={`/projects/${project.id}`}>{project.title}</Link>
                  </h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${project.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    project.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                    {project.status === 'ACTIVE' ? 'Activo' : project.status === 'PENDING_APPROVAL' ? 'Pendiente' : project.status}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{project.summary}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{project.fundingEntity}</span>
                  <span>{new Date(project.startDate).getFullYear()} - {new Date(project.endDate).getFullYear()}</span>
                </div>
              </div>
            ))}
            {recentProjects.length === 0 && (
              <p className="text-slate-400 italic text-sm">No hay proyectos activos registrados.</p>
            )}
          </div>
        </div>

        {/* Últimas Publicaciones */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="text-blue-600" size={24} aria-hidden="true" /> Producción Científica
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">Últimos artículos publicados</p>
            </div>
            <Link href="/publications" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
              Ver todas &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {recentPublications.map((pub: any) => (
              <div
                key={pub.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:border-blue-200"
              >
                <h3 className="font-bold text-slate-800 text-base leading-snug mb-1">{pub.title}</h3>
                <p className="text-blue-600 text-xs font-bold mb-3">{pub.authors.join(", ")}</p>

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider pt-3 border-t border-slate-50">
                  <span className={`px-2.5 py-0.5 rounded-full ${pub.status === 'PUBLISHED' ? 'bg-blue-50 text-blue-700' :
                    pub.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      'bg-purple-50 text-purple-700 border border-purple-100'
                    }`}>
                    {pub.status === 'PUBLISHED' ? 'Publicado' : pub.status === 'ACCEPTED' ? 'Aceptado' : 'En Revisión'}
                  </span>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-600 flex items-center gap-0.5"
                    >
                      DOI &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
            {recentPublications.length === 0 && (
              <p className="text-slate-400 italic text-sm">No hay publicaciones disponibles.</p>
            )}
          </div>
        </div>
      </section>

      {/* 6. CONTACTO Y LOCALIZACIÓN (Accesibilidad y UX Interactiva) */}
      <section
        className="container mx-auto px-6 max-w-6xl"
        aria-labelledby="contact-heading"
      >
        <div className="bg-white border border-slate-200/80 shadow-xl shadow-slate-900/5 rounded-3xl overflow-hidden grid lg:grid-cols-12">

          {/* Columna de Datos de Contacto */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white p-8 md:p-12 flex flex-col justify-between relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 space-y-8">
              <div>
                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block mb-2">Comunícate</span>
                <h2 id="contact-heading" className="text-3xl font-extrabold tracking-tight">Información de Contacto</h2>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  ¿Quieres colaborar con nosotros en proyectos conjuntos de doctorado o transferencia de tecnología? Escríbenos o visítanos directamente en las oficinas de nuestra universidad.
                </p>
              </div>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center gap-3.5">
                  <div className="bg-white/10 p-2 rounded-lg"><MapPin size={18} className="text-blue-300" /></div>
                  <address className="not-italic text-slate-200 leading-normal">
                    Edificio de Investigación, Lab 402<br />
                    Universidad Politécnica, CP 28040 Madrid
                  </address>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="bg-white/10 p-2 rounded-lg"><Mail size={18} className="text-blue-300" /></div>
                  <a href="mailto:info.research@university.edu" className="text-slate-200 hover:text-white transition-colors">
                    info.research@university.edu
                  </a>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="bg-white/10 p-2 rounded-lg"><Phone size={18} className="text-blue-300" /></div>
                  <a href="tel:+34912345678" className="text-slate-200 hover:text-white transition-colors">
                    +34 91 234 56 78
                  </a>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="bg-white/10 p-2 rounded-lg"><Clock size={18} className="text-blue-300" /></div>
                  <span className="text-slate-200">
                    Lunes a Viernes, 9:00 - 18:00
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/10 mt-8 text-xs text-slate-400">
              Grupo de Investigación Reconocido (GIR) &bull; ID: GR-2026-991
            </div>
          </div>

          {/* Columna de Formulario Interactivo en Cliente */}
          <ContactForm />

        </div>
      </section>

    </div>
  );
}
