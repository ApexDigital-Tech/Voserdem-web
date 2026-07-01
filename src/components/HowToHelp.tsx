import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Heart, Sprout, ShieldAlert, Award, FileText } from 'lucide-react';

interface HowToHelpProps {
  onDonateClick: () => void;
  onContactClick: () => void;
}

const SignatureDivider = () => (
  <div className="flex items-center justify-center space-x-4 py-4">
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
    <div className="w-2 h-2 rotate-45 bg-[#C5A059] border border-[#1B3022]/40" />
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
  </div>
);

export default function HowToHelp({ onDonateClick, onContactClick }: HowToHelpProps) {
  const options = [
    {
      title: 'Voluntariado',
      description: 'Únete a las jornadas de fin de semana para riego, deshierbe, plantación de árboles nativos y preparación de tierra orgánica para nuestro vivero comunal, o comparte tiempo con los adultos mayores.',
      icon: Sprout,
      benefits: 'Capacitación certificada, contacto directo con la naturaleza y apoyo social activo.'
    },
    {
      title: 'Donación Institucional',
      description: 'Aporta recursos económicos directos que se transforman en sistemas de riego por goteo, infraestructura educativa o raciones nutricionales en los comedores.',
      icon: Heart,
      benefits: 'Transparencia total con informes verificables y deducción fiscal oportuna.'
    },
    {
      title: 'Alianzas y Cooperación',
      description: 'Acuerdos estratégicos con gremios, responsabilidad social empresarial (RSE) o red de parroquias para potenciar el impacto en nuestros sitios piloto.',
      icon: Users,
      benefits: 'Multiplicación del impacto social y cumplimiento de Objetivos de Desarrollo Sostenible (ODS).'
    },
  ];

  return (
    <div className="py-16 bg-[#F5F2ED] min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block">Súmate a la causa</span>
          <h2 className="font-display text-3xl sm:text-4.5xl font-black text-[#1B3022] tracking-tight">
            ¿Cómo puedes ayudar a VOSERDEM?
          </h2>
          <SignatureDivider />
          <p className="text-xs text-[#2C2C2C] leading-relaxed font-sans">
            Creemos que toda contribución es sumamente valiosa. Hay múltiples formas de generar progreso ecológico y social en Cochabamba de forma activa.
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((opt, idx) => {
            const Icon = opt.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-6 lg:p-8 flex flex-col justify-between shadow-none hover:border-[#1B3022]/40 transition-colors"
                id={`help-option-${idx}`}
              >
                <div className="space-y-4">
                  {/* Rectangular box 4px radius with inline icon */}
                  <div className="w-10 h-10 bg-[#1B3022]/10 border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center rounded-[4px]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1B3022]">{opt.title}</h3>
                  <p className="text-xs text-[#2C2C2C] leading-relaxed font-sans">{opt.description}</p>
                  
                  {/* Thin Heritage Gold Divider */}
                  <div className="border-t border-[#C5A059]/25 pt-4">
                    <p className="text-[10px] text-[#2C2C2C] leading-relaxed font-sans">
                      <strong className="text-[#1B3022] font-sans">Beneficios:</strong> {opt.benefits}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Proposal / Suggestion Core Accentuated Block */}
        <div className="bg-[#FCF9F8] rounded-[8px] p-8 sm:p-12 border border-[#C5A059]/35 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display text-2xl font-black text-[#1B3022] tracking-tight">¿Tienes alguna propuesta o sugerencia?</h3>
            <p className="text-xs text-[#2C2C2C] leading-relaxed font-sans">
              Estamos dispuestos a realizar convenios estratégicos con gremios profesionales, instituciones corporativas comprometidas con planes de Responsabilidad Social Empresarial (RSE), y redes ecologistas internacionales. Conversemos sobre tus ideas de impacto hoy.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onDonateClick}
                className="bg-[#C5A059] text-[#1B3022] border-b border-[#1B3022] px-6 py-3.5 rounded-[4px] font-black text-[10px] uppercase tracking-widest hover:bg-[#C5A059]/95 transition-all cursor-pointer"
              >
                Donativo Semilla
              </button>
              <button
                onClick={onContactClick}
                className="bg-transparent text-[#1B3022] border border-[#1B3022] px-6 py-3.5 rounded-[4px] font-black text-[10px] uppercase tracking-widest hover:bg-[#1B3022]/10 transition-all cursor-pointer"
              >
                Solicitar Coordinación
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[4px] p-6 shadow-none w-full max-w-sm space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] font-sans block">Requisitos para Voluntariado</span>
              <ul className="space-y-3.5 text-[11px] text-[#2C2C2C] font-sans">
                <li className="flex items-center gap-2 font-sans">
                  <FileText className="h-4 w-4 shrink-0 text-[#C5A059]" />
                  <span>Cédula de Identidad de Bolivia (CI)</span>
                </li>
                <li className="flex items-center gap-2 font-sans">
                  <FileText className="h-4 w-4 shrink-0 text-[#C5A059]" />
                  <span>Mayor de 16 años (o permiso de apoderado)</span>
                </li>
                <li className="flex items-center gap-2 font-sans">
                  <FileText className="h-4 w-4 shrink-0 text-[#C5A059]" />
                  <span>Disponibilidad mínima de 4 horas semanales</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
