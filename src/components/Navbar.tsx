import React, { useState, useEffect } from 'react';
import {
  Heart,
  Menu,
  X,
  Users,
  Trees,
  MessageSquare,
  HeartHandshake,
  BookOpen,
  Map,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { VoserdemLogoColor } from './VoserdemLogo';
import { LogoConfig } from '../types';

interface NavbarProps {
  logoConfig?: LogoConfig;
}

export default function Navbar({ logoConfig }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { path: '/nuestra-obra', label: 'Nuestra Obra', icon: Users },
    { path: '/impacto', label: 'Impacto Territorial', icon: Map },
    { path: '/programas', label: 'Programas', icon: Trees },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/como-ayudar', label: 'Cómo Ayudar', icon: HeartHandshake },
    { path: '/contacto', label: 'Contacto', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-[#C5A059]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center cursor-pointer group transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] rounded-sm"
              aria-label="Ir a la página de inicio"
            >
              <VoserdemLogoColor size="md" className="group-hover:scale-102" config={logoConfig} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] ${
                    isActive
                      ? 'bg-[#C5A059]/20 text-[#C5A059] border-b border-[#C5A059]/60'
                      : 'text-[#F5F2ED]/85 hover:bg-[#C5A059]/10 hover:text-[#F5F2ED]'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/donar"
              className="ml-4 flex items-center space-x-1.5 bg-[#C5A059] text-[#1B3022] min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-[4px] text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059]/90 transition-all duration-200 hover:-translate-y-[1px] active:scale-95 cursor-pointer border-b border-[#1B3022] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B3022]"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span>Donar</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Cerrar menú principal" : "Abrir menú principal"}
              aria-expanded={isOpen}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-[4px] text-[#F5F2ED] hover:text-[#C5A059] hover:bg-[#C5A059]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] cursor-pointer"
            >
              {isOpen ? <X className="h-7 w-7" aria-hidden="true" /> : <Menu className="h-7 w-7" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-20 z-40 bg-[#1B3022] md:hidden overflow-y-auto border-t border-[#C5A059]/20 flex flex-col"
          >
            <div className="flex-1 flex flex-col px-6 pt-8 pb-12 space-y-4">
              {menuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-4 w-full py-4 text-base font-bold uppercase tracking-widest border-b border-[#C5A059]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] ${
                      isActive
                        ? 'text-[#C5A059]'
                        : 'text-[#F5F2ED] hover:text-[#C5A059]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-12 mt-auto">
                <Link
                  to="/donar"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full bg-[#C5A059] text-[#1B3022] min-h-[56px] rounded-[4px] text-base font-bold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B3022]"
                >
                  <Heart className="h-5 w-5 fill-current" />
                  <span>Donar Ahora</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
