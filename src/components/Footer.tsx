import React from 'react';
import { Trees, Mail, Phone, Heart, Globe, Award } from 'lucide-react';
import { VoserdemLogoGold } from './VoserdemLogo';
import { LogoConfig } from '../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  logoConfig?: LogoConfig;
}

export default function Footer({ setActiveTab, logoConfig }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2C2C2C] text-[#F5F2ED] border-t border-[#C5A059]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#C5A059]/15">
        
        {/* Colon 1: Branding */}
        <div className="md:col-span-5 space-y-5 flex flex-col items-start text-left">
          <div className="self-start">
            <VoserdemLogoGold size="md" className="!items-start !text-left" config={logoConfig} />
          </div>
          
          <p className="text-xs text-[#F5F2ED]/80 leading-relaxed max-w-sm font-sans pt-2">
            Organización boliviana de voluntariado dedicada a construir una sociedad más justa, fraterna y en armonía con la Creación.
          </p>
          
          <div className="flex items-center gap-1.5 text-[10px] text-[#F5F2ED]/90 font-semibold tracking-wider uppercase">
            <Award className="h-4.5 w-4.5 text-[#C5A059]" />
            <span>Transparencia Civil 100% Auditada</span>
          </div>
        </div>

        {/* Colon 2: Quick Links */}
        <div className="md:col-span-3 space-y-4 text-xs">
          <h4 className="text-[#C5A059] font-bold uppercase tracking-widest text-[10px]">Secciones</h4>
          <ul className="space-y-2">
            {[
              { id: 'nuestra-obra', name: 'Quiénes Somos (VOSERDEM)' },
              { id: 'projects', name: 'Programas de Impacto' },
              { id: 'transparencia', name: 'Nuestro Blog de Vivencias' },
              { id: 'transparencia', name: 'Boletines Oficiales' },
              { id: 'how-to-help', name: 'Canales de Apoyo' },
              { id: 'contact', name: 'Buzón de Contacto' },
              { id: 'admin', name: 'Portal Interno (Admin)' }
            ].map((link, idx) => (
              <li key={`${link.id}-${idx}`}>
                <button
                  onClick={() => setActiveTab(link.id)}
                  className="hover:text-[#C5A059] transition-colors hover:underline cursor-pointer text-left"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Colon 3: Coordinates / Contacts */}
        <div className="md:col-span-4 space-y-4 text-xs">
          <h4 className="text-[#C5A059] font-bold uppercase tracking-widest text-[10px]">Contacto Legal</h4>
          <div className="space-y-3.5 text-[#F5F2ED]/85 font-sans">
            <p className="leading-relaxed">
              <strong>Sede Bolivia:</strong> Av. América Oeste #845, Cochabamba, Bolivia.<br />
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
        <p>© {year} Voluntariado de Servicio para el Desarrollo Humano y Medio Ambiente (VOSERDEM). Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('nuestra-obra')} className="hover:underline hover:text-[#C5A059]">Condiciones del Donante</button>
          <span>•</span>
          <button onClick={() => setActiveTab('contact')} className="hover:underline hover:text-[#C5A059]">Capacitaciones Ecocamp</button>
        </div>
      </div>

    </footer>
  );
}

