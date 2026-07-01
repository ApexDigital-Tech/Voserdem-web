import React, { useState } from 'react';
import { Heart, Menu, X, Landmark, Users, Trees, MessageSquare, ShieldCheck, HeartHandshake, BookOpen, FileText, Map } from 'lucide-react';
import { VoserdemLogoColor } from './VoserdemLogo';
import { LogoConfig } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  logoConfig?: LogoConfig;
}

export default function Navbar({ activeTab, setActiveTab, logoConfig }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'about', label: 'Nuestra Obra', icon: Users },
    { id: 'impacto', label: 'Impacto Territorial', icon: Map },
    { id: 'projects', label: 'Programas', icon: Trees },
    { id: 'transparencia', label: 'Transparencia', icon: BookOpen },
    { id: 'how-to-help', label: 'Cómo Ayudar', icon: HeartHandshake },
    { id: 'contact', label: 'Contacto', icon: MessageSquare },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#1B3022] border-b border-[#C5A059]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* Logo */}
            <button
              onClick={() => setActiveTab('about')}
              className="flex items-center cursor-pointer group transition-transform duration-200"
            >
              <VoserdemLogoColor size="md" className="group-hover:scale-102" config={logoConfig} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A059]/20 text-[#C5A059] border-b border-[#C5A059]/60'
                      : 'text-[#F5F2ED]/85 hover:bg-[#C5A059]/10 hover:text-[#F5F2ED]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setActiveTab('donate')}
              className="ml-4 flex items-center space-x-1.5 bg-[#C5A059] text-[#1B3022] px-4 py-2.5 rounded-[4px] text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059]/90 transition-all duration-200 hover:-translate-y-[1px] active:scale-95 cursor-pointer border-b border-[#1B3022]"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span>Donar</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-[4px] text-[#F5F2ED] hover:text-[#C5A059] hover:bg-[#C5A059]/10 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#C5A059]/20 bg-[#1B3022] animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-[4px] text-sm font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#C5A059]/20 text-[#C5A059]'
                      : 'text-[#F5F2ED]/85 hover:bg-[#C5A059]/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 px-4">
              <button
                onClick={() => {
                  setActiveTab('donate');
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full bg-[#C5A059] text-[#1B3022] py-2.5 px-4 rounded-[4px] text-sm font-bold uppercase tracking-wider"
              >
                <Heart className="h-4 w-4 fill-current" />
                <span>Donar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
