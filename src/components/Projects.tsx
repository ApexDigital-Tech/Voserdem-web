import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { MapPin, Target, Sparkles, TrendingUp, Heart, ChevronRight, X } from 'lucide-react';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

interface ProjectsProps {
  onDonateSelect: (projectId: string) => void;
}

export default function Projects({ onDonateSelect }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const areas = ['Todas', 'Educación', 'Comedores', 'Agua y Agroforestería', 'Acompañamiento Social'];

  const getProjectArea = (p: Project): string => {
    const cat = p.category || p.area || '';
    if (cat.includes('Educación')) return 'Educación';
    if (cat.includes('Agua') || cat.includes('Medio Ambiente') || cat.includes('Agroforestería')) return 'Agua y Agroforestería';
    if (cat.includes('Comedor')) return 'Comedores';
    return 'Acompañamiento Social';
  };
  const getProjectRegion = (p: Project): string => p.region || 'Bolivia';

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('No se pudieron recuperar los proyectos.');
      }
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Hubo un error cargando los proyectos dinámicos de VOSERDEM. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedRegion === 'Todas') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => getProjectArea(p) === selectedRegion));
    }
  }, [selectedRegion, projects]);

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-[#F5F2ED]">
      
      {/* Tab Filter & Intro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4 border-b border-[#C5A059]/20">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059]">Impacto Directo</span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-[#1B3022] mt-1">
            Programas Emblemáticos
          </h2>
          <p className="text-xs text-[#2C2C2C] mt-1 max-w-xl font-sans">
            Reorganizados por Líneas de Intervención para brindarte una total transparencia sobre las iniciativas activas.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedRegion(area)}
              className={`px-4 py-2 rounded-[4px] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-[#1B3022] text-[#F5F2ED] shadow-sm'
                  : 'bg-[#C5A059]/10 text-[#2C2C2C] hover:bg-[#C5A059]/20 hover:text-[#1B3022]'
              }`}
            >
              {area === 'Todas' ? 'Todos los Programas' : area}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[#FCF9F8] border border-[#ba1a1a]/30 text-[#ba1a1a] p-6 rounded-[8px] text-center shadow-none">
          <p className="text-xs font-bold">{error}</p>
          <button
            onClick={fetchProjects}
            className="mt-4 bg-[#ba1a1a] hover:bg-[#ba1a1a]/90 text-white px-5 py-2 rounded-[4px] text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
          >
            Reintentar Carga
          </button>
        </div>
      )}

      {/* Skeleton / Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-5 space-y-4 animate-pulse">
              <div className="bg-[#C5A059]/10 h-48 w-full rounded-[4px]" />
              <div className="h-4 bg-[#C5A059]/10 w-2/3 rounded-[4px]" />
              <div className="h-4 bg-[#C5A059]/5 w-full rounded-[4px]" />
              <div className="h-2 bg-[#C5A059]/5 w-full rounded-[4px]" />
              <div className="h-8 bg-[#C5A059]/10 w-1/3 rounded-[4px]" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-[#FCF9F8] rounded-[8px] border border-dashed border-[#C5A059]/30">
          <p className="text-[#2C2C2C]/80 text-xs font-semibold uppercase tracking-wider">No se encontraron programas disponibles para esta línea.</p>
          <button
            onClick={() => setSelectedRegion('Todas')}
            className="mt-4 text-[#1B3022] font-semibold text-xs tracking-widest uppercase hover:underline cursor-pointer"
          >
            Ver todas las líneas
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {areas.filter(a => a !== 'Todas' && (selectedRegion === 'Todas' || a === selectedRegion)).map((area) => {
            const projectsInRegion = filteredProjects.filter(p => getProjectArea(p) === area);
            if (projectsInRegion.length === 0) return null;

            return (
              <div key={area} className="space-y-8 bg-white/45 p-6 sm:p-8 rounded-[12px] border border-[#C5A059]/20 shadow-xs animate-fade-in">
                {/* Region Heading */}
                <div className="flex items-center gap-3">
                  <div className="h-1 bg-[#1B3022] w-6 rounded-full"></div>
                  <h3 className="font-display text-2xl font-black text-[#1B3022] tracking-tight uppercase">
                    {area}
                  </h3>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-[#C5A059]/30 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projectsInRegion.map((project) => {
                    const pct = Math.min(Math.round((project.raised / project.goal) * 100), 100);
                    return (
                      <motion.div
                        key={project.id}
                        layoutId={`card-${project.id}`}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] shadow-none hover:border-[#1B3022]/40 transition-colors flex flex-col justify-between overflow-hidden"
                      >
                        {/* Image & category badge overlay */}
                        <div className="relative h-52 overflow-hidden bg-[#C5A059]/10">
                          <img
                            src={cleanGoogleDriveUrl(project.image)}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                            <span className="bg-[#1B3022] text-[#F5F2ED] text-[8.5px] font-black tracking-widest uppercase px-2 py-0.5 rounded-[2px] border border-[#C5A059]/40 w-fit">
                              {getProjectRegion(project)}
                            </span>
                            <span className="bg-[#C5A059] text-[#1B3022] text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-[2px] border border-[#1B3022]/20 w-fit">
                              {getProjectArea(project)}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-1.5 text-[10px] text-[#2C2C2C] font-semibold uppercase tracking-wider">
                              <MapPin className="h-3.5 w-3.5 text-[#C5A059]" />
                              <span>{project.location}</span>
                            </div>

                            <h3 className="font-display text-lg font-bold text-[#1B3022] hover:text-[#C5A059] transition-colors leading-snug">
                              {project.title}
                            </h3>

                            <p className="text-xs text-[#2C2C2C]/85 leading-relaxed font-sans line-clamp-3">
                              {project.description}
                            </p>
                          </div>

                          {/* Funding stats & Progress bar */}
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider">
                                <span className="text-[#1B3022] flex items-center gap-1">
                                  <TrendingUp className="h-3.5 w-3.5 text-[#C5A059]" />
                                  {pct}% Recaudado
                                </span>
                                <span className="text-[#2C2C2C]/80">
                                  ${project.raised.toLocaleString()} / <span className="text-[#1B3022]">${project.goal.toLocaleString()} USD</span>
                                </span>
                              </div>
                              
                              {/* Bar tracks */}
                              <div className="w-full bg-[#C5A059]/15 h-2 rounded-[4px] overflow-hidden">
                                <div
                                  className="bg-[#1B3022] h-full rounded-[4px] transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>

                            {/* Impact snippet badge */}
                            <div className="bg-[#1B3022]/5 border border-[#C5A059]/20 rounded-[8px] p-3 flex items-start gap-2.5 text-xs text-[#1B3022] leading-relaxed">
                              <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-[#C5A059]" />
                              <span className="font-sans text-xs">
                                <strong>Impacto:</strong> {project.impact}
                              </span>
                            </div>

                            {/* Action button */}
                            <div className="pt-2 flex gap-3">
                              <button
                                onClick={() => setSelectedProject(project)}
                                className="flex-1 bg-transparent hover:bg-[#1B3022]/5 text-[#1B3022] border border-[#1B3022] py-2 px-3 rounded-[4px] text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                Más Detalles
                                <ChevronRight className="h-3 w-3 text-[#C5A059]" />
                              </button>
                              <button
                                onClick={() => onDonateSelect(project.id)}
                                className="bg-[#C5A059] text-[#1B3022] hover:bg-[#C5A059]/90 border-b border-[#1B3022] py-2 px-4 rounded-[4px] text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Heart className="h-3 w-3 fill-current text-[#1B3022]" />
                                Apoyar
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-[#2C2C2C]/75 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FCF9F8] w-full max-w-2xl rounded-[8px] border border-[#C5A059]/40 shadow-2xl overflow-hidden relative z-50 text-left max-h-[90vh] flex flex-col"
            >
              {/* Image banner inside details */}
              <div className="relative h-64 bg-[#C5A059]/10 shrink-0">
                <img
                  src={cleanGoogleDriveUrl(selectedProject.image)}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Close Button overlay */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-[#2C2C2C]/80 text-[#F5F2ED] hover:text-[#C5A059] p-2 rounded-[4px] border border-[#C5A059]/30 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-4 flex gap-1.5">
                  <span className="bg-[#1B3022] text-[#F5F2ED] border border-[#C5A059]/30 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-[2px]">
                    {getProjectRegion(selectedProject)}
                  </span>
                  <span className="bg-[#C5A059] text-[#1B3022] border border-[#1B3022]/20 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-[2px]">
                    {getProjectArea(selectedProject)}
                  </span>
                </div>
              </div>

              {/* Scrollable description & detail info */}
              <div className="p-8 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#2C2C2C] font-semibold tracking-wider uppercase">
                    <MapPin className="h-4 w-4 text-[#C5A059]" />
                    <span>{selectedProject.location}</span>
                  </div>
                  <h3 className="font-display text-2xl lg:text-3.5xl font-black text-[#1B3022]">
                    {selectedProject.title}
                  </h3>
                </div>

                <div className="border-t border-[#C5A059]/20 pt-5 space-y-4">
                  <h4 className="font-display text-lg font-bold text-[#1B3022]">Descripción Detallada</h4>
                  <p className="text-[#2C2C2C] text-xs leading-relaxed font-sans whitespace-pre-line">
                    {selectedProject.details}
                  </p>
                </div>

                {/* Progress in Pop-up */}
                <div className="p-4 bg-[#C5A059]/10 rounded-[8px] border border-[#C5A059]/25 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#2C2C2C]">
                    <span className="flex items-center gap-1 text-[#1B3022]">
                      <Target className="h-4 w-4 text-[#C5A059]" />
                      Progreso de Campaña
                    </span>
                    <span>
                      ${selectedProject.raised.toLocaleString()} / <span className="text-[#C5A059]">${selectedProject.goal.toLocaleString()} USD</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#FCF9F8] h-2.5 rounded-[4px] overflow-hidden border border-[#C5A059]/20">
                    <div
                      className="bg-[#1B3022] h-full rounded-[4px] transition-all duration-500"
                      style={{ width: `${Math.min(Math.round((selectedProject.raised / selectedProject.goal) * 100), 100)}%` }}
                    />
                  </div>
                </div>

                {/* Impact Stat */}
                <div className="p-4 bg-[#1B3022]/5 rounded-[8px] border border-[#C5A059]/25 space-y-1 text-[#1B3022]">
                  <h5 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-[#C5A059]" />
                    Medición de Impacto Realizado
                  </h5>
                  <p className="text-xs text-[#2C2C2C] font-sans">
                    {selectedProject.impact}
                  </p>
                </div>
              </div>

              {/* Footer donate redirection */}
              <div className="bg-[#F5F2ED] border-t border-[#C5A059]/20 p-5 shrink-0 flex justify-end gap-3 rounded-b-[8px]">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-[4px] hover:bg-[#C5A059]/10 transition-all font-bold text-[10px] uppercase tracking-wider text-[#2C2C2C] cursor-pointer"
                >
                  Regresar
                </button>
                <button
                  onClick={() => {
                    onDonateSelect(selectedProject.id);
                    setSelectedProject(null);
                  }}
                  className="bg-[#C5A059] text-[#1B3022] hover:bg-[#C5A059]/90 border-b border-[#1B3022] px-6 py-2.5 rounded-[4px] font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Donar para este Proyecto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

