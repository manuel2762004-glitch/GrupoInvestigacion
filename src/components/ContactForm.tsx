"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      alert("Por favor, rellene todos los campos obligatorios.");
      return;
    }
    alert("¡Gracias por tu mensaje! El coordinador del grupo te responderá a la brevedad.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="lg:col-span-7 p-8 md:p-12 space-y-6"
      aria-label="Formulario de contacto"
    >
      <h3 className="text-xl font-bold text-slate-900 mb-2">Envíanos un Mensaje</h3>
      
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2" htmlFor="contact-name">
            Nombre Completo
          </label>
          <input 
            type="text" 
            id="contact-name" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Dr. Manuel Espinoza" 
            className="w-full px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2" htmlFor="contact-email">
            Correo Electrónico
          </label>
          <input 
            type="email" 
            id="contact-email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com" 
            className="w-full px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2" htmlFor="contact-subject">
          Asunto de la Consulta
        </label>
        <input 
          type="text" 
          id="contact-subject" 
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ej: Solicitud de colaboración en proyecto" 
          className="w-full px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2" htmlFor="contact-message">
          Mensaje o Propuesta
        </label>
        <textarea 
          id="contact-message" 
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe tu propuesta de colaboración o consulta científica..." 
          className="w-full px-4 py-3 border border-slate-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all resize-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 focus:ring-4 focus:ring-blue-200 focus:outline-none"
      >
        <Send size={16} /> Enviar Mensaje
      </button>
    </form>
  );
}
