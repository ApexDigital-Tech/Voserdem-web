import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  HelpCircle,
  Check,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

const SignatureDivider = () => (
  <div className="flex items-center justify-center space-x-4 py-4">
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
    <div className="w-2 h-2 rotate-45 bg-[#C5A059] border border-[#1B3022]/40" />
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
  </div>
);

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresa un correo electrónico válido'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setErrorMsg(null);
    setSuccess(false);

    try {
      const response = await api.post('/api/messages', data);

      if (!response.success) {
        throw new Error(response.error || 'No se pudo enviar el mensaje.');
      }

      setSuccess(true);
      reset();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de red. Intenta enviar el formulario de nuevo más tarde.');
    }
  };

  return (
    <div className="py-16 bg-[#F5F2ED] min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Intro info heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block">
            Estamos para escucharte
          </span>
          <h2 className="font-display text-3xl sm:text-4.5xl font-black text-[#1B3022] tracking-tight">
            Ponte en Contacto con VOSERDEM
          </h2>
          <SignatureDivider />
          <p className="text-xs text-[#2C2C2C] leading-relaxed font-sans">
            Ya sea que desees registrarte como voluntario presencial en el Ecocamp Chocaya, conocer
            más sobre el estado de un programa, coordinar una donación física, o programar una
            visita institucional, envíanos tus datos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Contact Info Badges */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-8 space-y-6 shadow-none">
              <h3 className="font-display text-[#1B3022] font-bold text-lg">
                Oficinas de Coordinación VOSERDEM
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-[#FCF9F8] text-[#C5A059] border border-[#C5A059]/30 rounded-[4px] h-fit">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1B3022] uppercase tracking-wider font-sans">
                      Ubicación Física
                    </h4>
                    <p className="text-xs text-[#2C2C2C]/90 leading-relaxed mt-1 font-sans">
                      Av. América Oeste #845, Zona Queru Queru. Cochabamba, Bolivia.
                      <br />
                      <strong>Estación Ecocamp:</strong> Subida Tunari, Comunidad Chocaya.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-[#FCF9F8] text-[#C5A059] border border-[#C5A059]/30 rounded-[4px] h-fit">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1B3022] uppercase tracking-wider font-sans">
                      Correos Oficiales
                    </h4>
                    <p className="text-xs text-[#2C2C2C]/90 leading-relaxed mt-1 font-sans">
                      contacto@voserdem.org.bo
                      <br />
                      voluntariado@voserdem.org.bo
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-[#FCF9F8] text-[#C5A059] border border-[#C5A059]/30 rounded-[4px] h-fit">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1B3022] uppercase tracking-wider font-sans">
                      Teléfono de Atención
                    </h4>
                    <p className="text-xs text-[#2C2C2C]/90 leading-relaxed mt-1 font-sans">
                      +591 (4) 424-8562
                      <br />
                      +591 717-34500 (WhatsApp Coordinación)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#FCF9F8] rounded-[4px] border border-[#C5A059]/30 flex items-start gap-3.5 text-[11px] text-[#2C2C2C] leading-relaxed font-sans">
              <HelpCircle className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
              <p className="font-sans">
                ¿Buscas realizar pasantías de investigación ecológica? El Ecocamp mantiene convenios
                estratégicos de cooperación con institutos técnicos y universidades bolivianas e
                internacionales. Por favor, indícalo en el asunto del mensaje.
              </p>
            </div>
          </div>

          {/* Right Side: Interactive Form */}
          <div className="lg:col-span-7 bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-6 sm:p-10 shadow-none">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="font-display text-lg font-bold text-[#1B3022] pb-4 border-b border-[#C5A059]/20">
                Enviar Mensaje Directo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] font-sans">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    {...register('name')}
                    className={`w-full bg-[#FCF9F8] border ${errors.name ? 'border-red-500' : 'border-[#C5A059]/30'} rounded-[4px] py-3 px-4 text-xs text-[#2C2C2C] focus:outline-none focus:ring-1 focus:ring-[#1B3022] transition-all font-sans`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[10px]">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] font-sans">
                    Tu Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="juan@ejemplo.com"
                    {...register('email')}
                    className={`w-full bg-[#FCF9F8] border ${errors.email ? 'border-red-500' : 'border-[#C5A059]/30'} rounded-[4px] py-3 px-4 text-xs text-[#2C2C2C] focus:outline-none focus:ring-1 focus:ring-[#1B3022] transition-all font-sans`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px]">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] font-sans">
                  Asunto del Mensaje
                </label>
                <input
                  type="text"
                  placeholder="Ej. Coordinar voluntariado / Postular ideas / Consulta"
                  {...register('subject')}
                  className={`w-full bg-[#FCF9F8] border ${errors.subject ? 'border-red-500' : 'border-[#C5A059]/30'} rounded-[4px] py-3 px-4 text-xs text-[#2C2C2C] focus:outline-none focus:ring-1 focus:ring-[#1B3022] transition-all font-sans`}
                />
                {errors.subject && (
                  <p className="text-red-500 text-[10px]">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#2C2C2C] font-sans">
                  Mensaje Detallado
                </label>
                <textarea
                  rows={5}
                  placeholder="Escribe aquí tu consulta o propuesta detalladamente..."
                  {...register('message')}
                  className={`w-full bg-[#FCF9F8] border ${errors.message ? 'border-red-500' : 'border-[#C5A059]/30'} rounded-[4px] py-3 px-4 text-xs text-[#2C2C2C] focus:outline-none focus:ring-1 focus:ring-[#1B3022] transition-all resize-none font-sans`}
                />
                {errors.message && (
                  <p className="text-red-500 text-[10px]">{errors.message.message}</p>
                )}
              </div>

              {/* Notification blocks */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-green-50 border border-green-200/40 text-[#1B3022] rounded-[4px] text-xs font-semibold flex items-center gap-2.5 font-sans"
                  >
                    <Check className="h-4.5 w-4.5 shrink-0" />
                    <span>
                      ¡Mensaje enviado con éxito! Los asesores de VOSERDEM te responderán en un
                      lapso de 24 horas hábiles.
                    </span>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-red-50 border border-red-200/40 text-red-700 rounded-[4px] text-xs font-semibold flex items-center gap-2.5 font-sans"
                  >
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C5A059] text-[#1B3022] border-b border-[#1B3022] py-3.5 px-6 rounded-[4px] font-black text-xs tracking-widest uppercase hover:bg-[#C5A059]/95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Enviando Mensaje...' : 'Enviar Mensaje Directo'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
