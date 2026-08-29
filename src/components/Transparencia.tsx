import React from 'react';
import Bulletins from './Bulletins';
import { Shield, FileText, CheckCircle2, Handshake } from 'lucide-react';

export default function Transparencia() {
  return (
    <div className="bg-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 space-y-24 max-w-7xl mx-auto">
      {/* Encabezado */}
      <section className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059]">
          Compromiso Ético
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#1B3022] tracking-tight">
          Transparencia y Memoria
        </h1>
        <div className="h-[1px] bg-[#C5A059]/30 w-24 mx-auto" />
        <p className="text-sm text-[#2C2C2C] font-sans leading-relaxed">
          Nuestra labor como institución católica exige el más alto nivel de integridad. Aquí
          documentamos nuestra historia, compartimos nuestros boletines oficiales y rendimos cuentas
          claras a nuestros aliados y beneficiarios.
        </p>
      </section>

      {/* Rendición de Cuentas */}
      <section className="bg-white border border-[#C5A059]/20 rounded-[12px] p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-6 w-6 text-[#C5A059]" />
          <h2 className="font-display text-2xl font-bold text-[#1B3022]">
            Rendición de Cuentas 2026
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <p className="text-3xl font-black text-[#1B3022]">85%</p>
            <p className="text-xs text-[#2C2C2C] uppercase tracking-wider font-bold">
              Destinado a Obra Social
            </p>
            <p className="text-[10px] text-[#2C2C2C]/80 font-sans mt-2 leading-relaxed">
              De cada dólar donado, la inmensa mayoría va directo a los programas en terreno.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-[#1B3022]">15%</p>
            <p className="text-xs text-[#2C2C2C] uppercase tracking-wider font-bold">
              Operación y Logística
            </p>
            <p className="text-[10px] text-[#2C2C2C]/80 font-sans mt-2 leading-relaxed">
              Gastos administrativos mantenidos al mínimo indispensable por nuestra red de
              voluntarios.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-[#C5A059]" />
              <p className="text-sm font-bold text-[#1B3022]">Auditoría Anual</p>
            </div>
            <p className="text-[10px] text-[#2C2C2C]/80 font-sans leading-relaxed">
              Nuestros estados financieros son revisados anualmente por firmas independientes y
              reportados al Estado Boliviano.
            </p>
          </div>
        </div>
      </section>

      {/* Memoria Institucional y Boletines */}
      <section className="space-y-16">
        <div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-[#C5A059]" />
            <h2 className="font-display text-3xl font-black text-[#1B3022]">Boletines Oficiales</h2>
          </div>
          <div className="max-w-4xl mx-auto -mt-10">
            {/* Reutilizando el componente Bulletins, pero ajustando su diseño interno si es necesario */}
            <Bulletins hideHeader={true} />
          </div>
        </div>
      </section>

      {/* Aliados */}
      <section className="bg-[#1B3022] rounded-[12px] p-8 md:p-12 text-center space-y-8">
        <Handshake className="h-8 w-8 text-[#C5A059] mx-auto" />
        <h2 className="font-display text-2xl font-black text-[#F5F2ED]">Aliados y Cooperantes</h2>
        <p className="text-[#F5F2ED]/85 text-sm max-w-2xl mx-auto font-sans leading-relaxed">
          Nuestra labor no sería posible sin el soporte técnico y financiero de la Cooperación
          Internacional, órdenes religiosas, fundaciones locales y cientos de donantes anónimos. A
          todos ellos, nuestra profunda gratitud.
        </p>
      </section>
    </div>
  );
}
