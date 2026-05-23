import { mockResearchLines } from "@/lib/mockData";
import { Lightbulb, Users, Target } from "lucide-react";

export default function ResearchLines() {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Líneas de Investigación</h1>
          <p className="text-slate-500 max-w-2xl">
            Nuestras áreas principales de estudio y desarrollo científico.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {mockResearchLines.map(line => (
            <div key={line.id} className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-brand-100 p-3 rounded-xl text-brand-600">
                  <Lightbulb size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{line.name}</h2>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                {line.description}
              </p>
              
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target size={16} className="text-slate-400" />
                  Palabras Clave
                </h3>
                <div className="flex flex-wrap gap-2">
                  {line.keywords.map(kw => (
                    <span key={kw} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium border border-slate-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
