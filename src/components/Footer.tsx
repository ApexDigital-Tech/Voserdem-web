import React from 'react';
import { Mail, Phone, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VoserdemLogoGold } from './VoserdemLogo';
import { LogoConfig } from '../types';

interface FooterProps {
  logoConfig?: LogoConfig;
}

export default function Footer({ logoConfig }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="glass-dark border-t border-[#C5A059]/20 pt-16 pb-12 relative overflow-hidden">
      {/* Optional ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#C5A059]/15">
        {/* Colon 1: Branding */}
        <div className="md:col-span-5 space-y-5 flex flex-col items-start text-left">
          <div className="self-start">
            <VoserdemLogoGold size="md" className="!items-start !text-left" config={logoConfig} />
          </div>

          <p className="text-xs text-[#F5F2ED]/80 leading-relaxed max-w-sm font-sans pt-2">
            Organización civil boliviana sin fines de lucro, inspirada espiritualmente y sostenida
            por voluntarios, ejecutando proyectos de desarrollo sostenible integral en 4 regiones
            clave del país.
          </p>

          <p className="text-[11px] text-[#C5A059]/90 leading-relaxed max-w-sm font-sans italic border-l-2 border-[#C5A059]/40 pl-3">
            "Una Bolivia mejor es posible con la voluntad de hacer bien el bien y siguiendo las
            huellas de Jesús."
          </p>

          <div className="flex items-center gap-1.5 text-[10px] text-[#F5F2ED]/90 font-semibold tracking-wider uppercase">
            <Award className="h-4.5 w-4.5 text-[#C5A059]" />
            <span>Transparencia Civil 100% Auditada</span>
          </div>
        </div>

        <div className="md:col-span-3 space-y-4 text-xs">
          <h4 className="text-[#C5A059] font-bold uppercase tracking-widest text-[10px]">
            Secciones
          </h4>
          <ul className="space-y-2">
            {[
              { path: '/nuestra-obra', name: 'Nuestra Obra (Identidad)' },
              { path: '/impacto', name: 'Impacto Territorial' },
              { path: '/programas', name: 'Programas de Impacto' },
              { path: '/transparencia', name: 'Transparencia y Memoria' },
              { path: '/como-ayudar', name: 'Cómo Ayudar' },
              { path: '/contacto', name: 'Contacto' },
            ].map((link, idx) => (
              <li key={`${link.path}-${idx}`}>
                <Link
                  to={link.path}
                  className="hover:text-[#C5A059] transition-colors hover:underline cursor-pointer text-left block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] rounded-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colon 3: Coordinates / Contacts */}
        <div className="md:col-span-4 space-y-4 text-xs">
          <h4 className="text-[#C5A059] font-bold uppercase tracking-widest text-[10px]">
            Contacto Legal
          </h4>
          <div className="space-y-3.5 text-[#F5F2ED]/85 font-sans">
            <p className="leading-relaxed">
              <strong>Sede Bolivia:</strong> Av. América Oeste #845, Cochabamba, Bolivia.
              <br />
              <strong>Estación Ecológica:</strong> Comunidad Chocaya, Cochabamba.
            </p>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#C5A059]" />
              <span>contacto@voserdem.org.bo</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#C5A059]" />
              <span>+591 (4) 424-8562</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Right and Acknowledgements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#F5F2ED]/60 font-sans">
        <p>
          © {year} Asociación de Laicos Católicos Voserdem — Voluntarios al Servicio de los Demás.
          Todos los derechos reservados.
        </p>
        <div className="flex gap-4">
          <Link to="/transparencia" className="hover:underline hover:text-[#C5A059] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] rounded-sm">
            Memoria Institucional
          </Link>
          <span aria-hidden="true">•</span>
          <Link to="/contacto" className="hover:underline hover:text-[#C5A059] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] rounded-sm">
            Contacto Oficial
          </Link>
          <span aria-hidden="true">•</span>
          <Link to="/admin" className="hover:underline hover:text-[#C5A059] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] rounded-sm">
            Intranet
          </Link>
        </div>
      </div>
    </footer>
  );
}
