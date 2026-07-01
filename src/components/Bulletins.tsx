import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Mail, Calendar, Download, Bookmark, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Bulletin } from '../types';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

const SignatureDivider = () => (
  <div className="flex items-center justify-center space-x-4 py-4">
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
    <div className="w-2 h-2 rotate-45 bg-[#C5A059] border border-[#1B3022]/40" />
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
  </div>
);

interface BulletinsProps {
  hideHeader?: boolean;
}

export default function Bulletins({ hideHeader = false }: BulletinsProps) {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Subscriber form state
  const [emailInput, setEmailInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/bulletins')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Fallo al obtener boletines');
      })
      .then((data) => setBulletins(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setErrorMessage('Por favor, introduce un correo electrónico válido.');
      setSuccessMessage(null);
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/subscribers', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: emailInput })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('¡Suscripción exitosa! Ahora estás registrado en nuestro boletín oficial.');
        setEmailInput('');
      } else {
        setErrorMessage(data.error || 'Error al completar la suscripción.');
      }
    } catch (err) {
      setErrorMessage('Error de red. Por favor, reintente más tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-[#F5F2ED] min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Header */}
        {!hideHeader && (
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block">
              Memoria Histórica y Transparencia
            </span>
            <h1 className="font-display text-3xl sm:text-4.5xl font-black text-[#1B3022] tracking-tight">
              Boletines VOSERDEM
            </h1>
            <div className="h-[1px] bg-[#C5A059]/30 w-32 mx-auto" />
            <p className="text-xs text-[#2C2C2C] leading-relaxed font-sans">
              Accede a nuestra colección histórica de revistas y boletines, un registro detallado de más de 34 años de trabajo voluntario y solidaridad institucional en Bolivia.
            </p>
          </div>
        )}

        {/* Dynamic Split Grid (Newsletter Form + Bulletins stream) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Subscription Module Widget */}
          <div className="lg:col-span-4 bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-6 sm:p-8 space-y-6 lg:sticky lg:top-24 shadow-none">
            <div className="space-y-3">
              <div className="w-9 h-9 bg-[#1B3022]/10 text-[#C5A059] rounded-[4px] border border-[#C5A059]/20 flex items-center justify-center">
                <Bookmark className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1B3022]">Mantente Informado</h3>
              <p className="text-xs text-[#2C2C2C]/95 leading-relaxed font-sans">
                Recibe mensualmente en tu correo nuestro resumen ejecutivo de voluntariado, estados financieros, hitos forestales en Chocaya, e historias inspiradoras de nuestras abuelas beneficiarias.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold text-[#2C2C2C]/80 block tracking-widest">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C5A059]" />
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[4px] pl-10 pr-3 py-2.5 text-xs text-[#2C2C2C] placeholder-[#2C2C2C]/50 outline-none focus:ring-1 focus:ring-[#1B3022] focus:border-[#1B3022] transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#C5A059] text-[10px] text-[#1B3022] hover:bg-[#C5A059]/95 border-b border-[#1B3022] py-3 rounded-[4px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Inscribiendo...' : 'Suscribirse al Boletín'}
              </button>
            </form>

            {/* Error notifications */}
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-3 bg-red-50 border border-red-200/45 text-red-700 text-xs rounded-[4px] flex items-start gap-2"
              >
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-red-600" />
                <span className="font-sans text-xs">{errorMessage}</span>
              </motion.div>
            )}

            {/* Success notifications */}
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-3 bg-green-50 border border-green-200/40 text-[#1B3022] text-xs rounded-[4px] flex items-start gap-2"
              >
                <Check className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#1B3022]" />
                <span className="font-sans text-xs">{successMessage}</span>
              </motion.div>
            )}

            <div className="border-t border-[#C5A059]/20 pt-4 text-[10px] text-[#2C2C2C]/70 leading-relaxed flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#C5A059] shrink-0" />
              <span className="font-sans">Privacidad garantizada. Puedes desuscribirte de la lista en cualquier momento.</span>
            </div>
          </div>

          {/* RIGHT: Bulletins line historical list */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-display text-xl font-bold text-[#1B3022] border-b border-[#C5A059]/20 pb-3 block">
              Ediciones Publicadas
            </h3>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3022]"></div>
              </div>
            ) : bulletins.length === 0 ? (
              <div className="text-center py-12 bg-[#FCF9F8] border border-dashed border-[#C5A059]/30 rounded-[8px]">
                <FileText className="h-8 w-8 text-[#C5A059] mx-auto mb-3" />
                <p className="text-xs text-[#2C2C2C]/80 font-sans">Aún no hay boletines publicados disponibles en línea.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bulletins.map((bull, idx) => (
                  <motion.div
                    key={bull.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="p-5 sm:p-6 bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] hover:border-[#1B3022]/40 hover:shadow-none transition-all flex flex-col md:flex-row gap-6 group"
                  >
                    {/* Bulletin Cover Photo */}
                    <div className="w-full md:w-36 h-28 shrink-0 overflow-hidden rounded-[4px] border border-[#ebdccd]/80 bg-neutral-100">
                      <img
                        src={cleanGoogleDriveUrl(bull.image) || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400'}
                        alt={bull.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-grow flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Rectangular tag with 2px radius and 10% gold background, 100% gold text */}
                          <span className="bg-[#C5A059]/10 text-[#C5A059] text-[9px] font-black px-2.5 py-1 rounded-[2px] tracking-widest uppercase border border-[#C5A059]/20">
                            {bull.issueNumber}
                          </span>
                          <span className="text-[10px] text-[#2C2C2C]/80 flex items-center gap-1.5 font-bold uppercase tracking-wider font-sans">
                            <Calendar className="h-3 w-3 text-[#C5A059]" /> {bull.publishDate}
                          </span>
                        </div>
                        
                        <h4 className="font-display text-lg font-bold text-[#1B3022] group-hover:text-[#C5A059] transition-colors leading-snug">
                          {bull.title}
                        </h4>
                        
                        <p className="text-xs text-[#2C2C2C]/90 leading-relaxed font-sans">
                          {bull.summary}
                        </p>
                      </div>

                      <div className="pt-2 flex justify-start md:justify-end">
                        <a
                          href={bull.downloadUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-[#FCF9F8] hover:bg-[#1B3022]/5 text-[#1B3022] px-4 py-2.5 rounded-[4px] text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer border border-[#1B3022] w-full sm:w-auto justify-center"
                        >
                          <Download className="h-4 w-4 text-[#C5A059]" />
                          <span>Descargar PDF</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
