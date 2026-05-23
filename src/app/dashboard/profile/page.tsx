"use client";

import { mockUsers } from "@/lib/mockData";
import { UserCircle, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileEdit() {
  const currentUser = mockUsers[1];
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    institution: currentUser.institution,
  });
  
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Perfil actualizado correctamente.");
    router.push("/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/dashboard" className="text-brand-600 hover:underline text-sm font-medium flex items-center gap-1">
          <ArrowLeft size={16} /> Volver al Panel
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
          <h1 className="text-2xl font-bold text-slate-800">Modificar Perfil</h1>
          <p className="text-slate-500 text-sm mt-1">Actualiza tu información personal y de contacto.</p>
        </div>

        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 border-4 border-white shadow-sm overflow-hidden shrink-0">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={40} />
              )}
            </div>
            <div>
              <button type="button" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                Cambiar Avatar
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Institucional</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Institución</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/dashboard" className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-2">
              <Save size={16} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
