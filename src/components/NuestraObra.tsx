import React from 'react';
import { Target, Lightbulb, Compass, Sprout, Heart, ShieldCheck } from 'lucide-react';

export default function NuestraObra() {
  return (
    <div className="reveal bg-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 space-y-24 max-w-7xl mx-auto">
      {/* El Origen y el Lema */}
      <section className="reveal text-center space-y-6 max-w-4xl mx-auto animate-fade-in">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059]">
          Fundación y Propósito
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#1B3022] tracking-tight">
          El Origen: 34 Años Sirviendo a Bolivia
        </h1>
        <div className="h-[1px] bg-[#C5A059]/30 w-24 mx-auto" />
        <p className="text-sm text-[#2C2C2C] font-sans leading-relaxed">
          Nacimos hace más de tres décadas como una respuesta laica y católica a las profundas
          necesidades de nuestro país. Bajo la inspiración de los sacerdotes jesuitas y voluntarios
          fundadores, nuestra asociación civil sin fines de lucro fue forjada con un mandato
          inquebrantable: <strong>"Hacer bien el bien"</strong>.
        </p>
      </section>

      {/* Misión y Visión */}
      <section className="reveal grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-8 space-y-6 hover:border-[#1B3022]/30 transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#1B3022] p-2 rounded-full">
              <Target className="h-5 w-5 text-[#C5A059]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1B3022]">Nuestra Misión</h2>
          </div>
          <p className="text-[#2C2C2C] text-sm leading-relaxed font-sans">
            Promover el Desarrollo Sostenible Integral de las poblaciones más vulnerables, a través
            de programas de educación, salud, medio ambiente y desarrollo productivo, empoderando a
            las comunidades para que sean protagonistas de su propia transformación.
          </p>
        </div>

        <div className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-8 space-y-6 hover:border-[#1B3022]/30 transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#C5A059] p-2 rounded-full">
              <Lightbulb className="h-5 w-5 text-[#1B3022]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1B3022]">Nuestra Visión</h2>
          </div>
          <p className="text-[#2C2C2C] text-sm leading-relaxed font-sans">
            Ser una institución referente en Bolivia por su impacto comprobable, su compromiso ético
            y su capacidad para articular solidaridad efectiva, construyendo una sociedad más justa,
            fraterna y en armonía con la Creación.
          </p>
        </div>
      </section>

      {/* Modelo DSI */}
      <section className="reveal space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-display text-3xl font-black text-[#1B3022]">
            Modelo de Desarrollo Sostenible Integral (DSI)
          </h2>
          <p className="text-sm text-[#2C2C2C] font-sans">
            Nuestra metodología de intervención no es asistencialista, es estructural.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[8px] border-t-4 border-[#1B3022] shadow-sm">
            <Sprout className="h-8 w-8 text-[#1B3022] mb-4" />
            <h3 className="font-bold text-[#1B3022] mb-2 uppercase tracking-wide text-xs">
              Sostenibilidad Ecológica
            </h3>
            <p className="text-xs text-[#2C2C2C] leading-relaxed">
              Cuidado de la casa común, agroforestería y respeto por los ciclos vitales del agua y
              la tierra.
            </p>
          </div>
          <div className="bg-white p-6 rounded-[8px] border-t-4 border-[#C5A059] shadow-sm">
            <Heart className="h-8 w-8 text-[#C5A059] mb-4" />
            <h3 className="font-bold text-[#1B3022] mb-2 uppercase tracking-wide text-xs">
              Dignidad Humana
            </h3>
            <p className="text-xs text-[#2C2C2C] leading-relaxed">
              Educación técnica y universitaria, nutrición infantil y acompañamiento a la tercera
              edad.
            </p>
          </div>
          <div className="bg-white p-6 rounded-[8px] border-t-4 border-[#1B3022] shadow-sm">
            <ShieldCheck className="h-8 w-8 text-[#1B3022] mb-4" />
            <h3 className="font-bold text-[#1B3022] mb-2 uppercase tracking-wide text-xs">
              Autonomía Comunitaria
            </h3>
            <p className="text-xs text-[#2C2C2C] leading-relaxed">
              Desarrollo productivo local que permite a las comunidades dejar de depender de ayuda
              externa.
            </p>
          </div>
        </div>
      </section>

      {/* Horizonte 2030 */}
      <section className="reveal bg-[#1B3022] rounded-[12px] p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
        <Compass className="h-32 w-32 text-[#C5A059]/10 absolute -top-10 -right-10 rotate-45" />
        <h2 className="font-display text-3xl font-black text-[#F5F2ED] relative z-10">
          Horizonte 2030
        </h2>
        <p className="text-[#F5F2ED]/85 text-sm max-w-2xl mx-auto font-sans leading-relaxed relative z-10">
          De cara al futuro, VOSERDEM consolida sus 4 sitios piloto para transformarlos en polos de
          desarrollo autosustentables, ampliando nuestra red de aliados internacionales y
          reafirmando nuestro compromiso con las encíclicas Laudato Si' y Fratelli Tutti.
        </p>
      </section>
    </div>
  );
}
