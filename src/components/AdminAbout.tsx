import React, { useState, useEffect } from 'react';
import { Compass, Activity, BookOpen, Layers, Sparkles, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

import { Project, BlogPost, Bulletin } from '../types';

interface AdminAboutProps {
  projects: Project[];
  blogPosts: BlogPost[];
  bulletins: Bulletin[];
  loadAllAdminData: () => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminAbout({
  loadAllAdminData,
  setLoading,
  projects,
  blogPosts,
  bulletins
}: AdminAboutProps) {
  const showStatus = (text: string, type: 'success' | 'error') => {
    toast[type](text);
  };

  const [aboutIntroSub, setAboutIntroSub] = useState('');
  const [aboutIntroTitle, setAboutIntroTitle] = useState('');
  const [aboutIntroText, setAboutIntroText] = useState('');
  const [aboutMissionTitle, setAboutMissionTitle] = useState('');
  const [aboutMissionText, setAboutMissionText] = useState('');
  const [aboutVisionTitle, setAboutVisionTitle] = useState('');
  const [aboutVisionText, setAboutVisionText] = useState('');
  const [aboutImageUrl, setAboutImageUrl] = useState('');
  const [aboutHeroImageUrl, setAboutHeroImageUrl] = useState('');
  const [aboutPillars, setAboutPillars] = useState<any[]>([
    { title: '', description: '', iconName: 'Users' },
    { title: '', description: '', iconName: 'Leaf' },
    { title: '', description: '', iconName: 'Heart' },
    { title: '', description: '', iconName: 'GraduationCap' },
  ]);


  // Load data locally
  useEffect(() => {
    const loadData = async () => {
      const res = await api.get<any>('/api/about');
      if (res.success && res.data) {
        const aboutData = res.data;
        setAboutIntroSub(aboutData.introSub || '');
        setAboutIntroTitle(aboutData.introTitle || '');
        setAboutIntroText(aboutData.introText || '');
        setAboutMissionTitle(aboutData.missionTitle || '');
        setAboutMissionText(aboutData.missionText || '');
        setAboutVisionTitle(aboutData.visionTitle || '');
        setAboutVisionText(aboutData.visionText || '');
        setAboutImageUrl(aboutData.imageUrl || '');
        setAboutHeroImageUrl(aboutData.heroImageUrl || '');
        if (aboutData.pillars && Array.isArray(aboutData.pillars)) {
          setAboutPillars(aboutData.pillars);
        }
      }
    };
    loadData();
  }, []);

  const handleUpdateAboutUs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanedImageUrl = cleanGoogleDriveUrl(aboutImageUrl);
      const cleanedHeroImageUrl = cleanGoogleDriveUrl(aboutHeroImageUrl);

      const payload = {
        introSub: aboutIntroSub,
        introTitle: aboutIntroTitle,
        introText: aboutIntroText,
        missionTitle: aboutMissionTitle,
        missionText: aboutMissionText,
        visionTitle: aboutVisionTitle,
        visionText: aboutVisionText,
        imageUrl: cleanedImageUrl,
        heroImageUrl: cleanedHeroImageUrl,
        pillars: aboutPillars,
      };
      const res = await api.put('/api/about', payload);

      if (res.success) {
        showStatus('Contenido de "Sobre Nosotros" guardado con éxito.', 'success');
        loadAllAdminData();
      } else {
        showStatus('Error al intentar actualizar la sección Sobre Nosotros.', 'error');
      }
    } catch (err) {
      showStatus('Error de red al intentar guardar los cambios.', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#ebdccd]/15 p-6 rounded-2xl border border-[#ebdccd]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-[#1c1a17]">
            Gestión de Sobre Nosotros
          </h3>
          <p className="text-xs text-[#5c544b]">
            Personaliza los copys estratégicos, visiones generales y la principal imagen
            ilustrativa del portal.
          </p>
        </div>

        <button
          onClick={handleUpdateAboutUs}
          className="bg-[#1f5f3d] hover:bg-[#15462b] text-white py-2.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-sm"
        >
          <Compass className="h-4 w-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <form onSubmit={handleUpdateAboutUs} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#ebdccd]/60 p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs">
            <h4 className="font-display font-bold text-sm text-[#1b3022] pb-2 border-b border-[#ebdccd]/30 flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-[#1f5f3d]" />
              1. Copys de Introducción
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                  Sub-encabezado de Introducción
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Nuestro Propósito Coherente"
                  value={aboutIntroSub}
                  onChange={(e) => setAboutIntroSub(e.target.value)}
                  className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                  Título de Introducción Principal
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. ¿Quiénes Somos en VOSERDEM?"
                  value={aboutIntroTitle}
                  onChange={(e) => setAboutIntroTitle(e.target.value)}
                  className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                Texto de Introducción Detallado
              </label>
              <textarea
                required
                rows={4}
                placeholder="Escribe el texto descriptivo primordial que verán los visitantes al inicio de la página..."
                value={aboutIntroText}
                onChange={(e) => setAboutIntroText(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-xl p-3 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
              />
            </div>
          </div>

          <div className="bg-white border border-[#ebdccd]/60 p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs">
            <h4 className="font-display font-bold text-sm text-[#1b3022] pb-2 border-b border-[#ebdccd]/30 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-[#1f5f3d]" />
              2. Misión, Visión e Imagen
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                  URL de Imagen de Presentación (Sobre Nosotros)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... o enlace de red"
                  value={aboutImageUrl}
                  onChange={(e) => setAboutImageUrl(e.target.value)}
                  className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                  URL de la Foto de Portada Principal (Página de Inicio / Hero)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... o enlace de red de la portada"
                  value={aboutHeroImageUrl}
                  onChange={(e) => setAboutHeroImageUrl(e.target.value)}
                  className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Título de Misión
                  </label>
                  <input
                    type="text"
                    required
                    value={aboutMissionTitle}
                    onChange={(e) => setAboutMissionTitle(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Cuerpo de Misión
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={aboutMissionText}
                    onChange={(e) => setAboutMissionText(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl p-2.5 text-xs text-[#1c1a17] resize-none font-sans"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Título de Visión
                  </label>
                  <input
                    type="text"
                    required
                    value={aboutVisionTitle}
                    onChange={(e) => setAboutVisionTitle(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Cuerpo de Visión
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={aboutVisionText}
                    onChange={(e) => setAboutVisionText(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl p-2.5 text-xs text-[#1c1a17] resize-none font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#ebdccd]/60 p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs">
            <h4 className="font-display font-bold text-sm text-[#1b3022] pb-2 border-b border-[#ebdccd]/30 flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-[#1f5f3d]" />
              3. Pilares Estratégicos de Acción (Cuatro Bloques)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {aboutPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#fbfaf7] border border-[#ebdccd]/40 rounded-xl space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#d95c2b]">
                      BLOQUE N° {idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-tight text-[#5c544b]">
                        Icono:
                      </label>
                      <select
                        value={pillar.iconName}
                        onChange={(e) => {
                          const updated = [...aboutPillars];
                          updated[idx].iconName = e.target.value;
                          setAboutPillars(updated);
                        }}
                        className="bg-white border border-[#ebdccd] rounded px-1.5 py-0.5 text-[9px] text-[#1c1a17] focus:outline-none"
                      >
                        <option value="Users">Usuarios / Grupo</option>
                        <option value="Leaf">Ecología / Hoja</option>
                        <option value="Heart">Dignidad / Corazón</option>
                        <option value="GraduationCap">Educación / Grado</option>
                        <option value="Compass">Misiones / Compás</option>
                        <option value="Shield">Escudo / Protección</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-[#4e4842]">
                      Título del Pilar
                    </label>
                    <input
                      type="text"
                      required
                      value={pillar.title}
                      onChange={(e) => {
                        const updated = [...aboutPillars];
                        updated[idx].title = e.target.value;
                        setAboutPillars(updated);
                      }}
                      className="w-full bg-white border border-[#ebdccd] rounded-lg px-2.5 py-1.5 text-xs text-[#1c1a17] font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-[#4e4842]">
                      Descripción pilar
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={pillar.description}
                      onChange={(e) => {
                        const updated = [...aboutPillars];
                        updated[idx].description = e.target.value;
                        setAboutPillars(updated);
                      }}
                      className="w-full bg-white border border-[#ebdccd] rounded-lg p-2 text-xs text-[#1c1a17] resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {aboutImageUrl && (
            <div className="bg-white border border-[#ebdccd]/60 p-4 rounded-2xl text-center space-y-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c544b] block">
                Imagen de Presentación
              </span>
              <img
                src={cleanGoogleDriveUrl(aboutImageUrl)}
                alt=""
                className="w-full h-44 object-cover rounded-xl border border-[#ebdccd] shadow-xs bg-neutral-100"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <p className="text-[9px] text-[#5c544b] leading-tight font-sans">
                La imagen se adaptará automáticamente a la faja derecha del propósito
                institucional.
              </p>
            </div>
          )}

          {aboutHeroImageUrl && (
            <div className="bg-white border border-[#ebdccd]/60 p-4 rounded-2xl text-center space-y-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c544b] block">
                Imagen de Portada (Hero)
              </span>
              <img
                src={cleanGoogleDriveUrl(aboutHeroImageUrl)}
                alt=""
                className="w-full h-44 object-cover rounded-xl border border-[#ebdccd] shadow-xs bg-neutral-100"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <p className="text-[9px] text-[#5c544b] leading-tight font-sans">
                Esta imagen se mostrará como el fondo principal de la portada superior (Hero) de
                la web.
              </p>
            </div>
          )}

          <div className="bg-[#1f5f3d]/5 border-2 border-[#1f5f3d]/15 p-5 rounded-2xl space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1f5f3d] block flex items-center gap-1.5 shadow-none">
              <Sparkles className="h-3.5 w-3.5" />
              Previsualización Pública Activa
            </span>
            <p className="text-[11px] text-[#2c2c2c] leading-relaxed">
              Las novedades de <strong>Blog</strong>, <strong>Proyectos</strong> y{' '}
              <strong>Boletines</strong> se generan automáticamente en el pie de página de
              "Sobre Nosotros". Esto incrementa la tracción orgánica de visitas y descargas de
              PDFs con enlaces activos.
            </p>

            <div className="border-t border-[#1f5f3d]/15 pt-3 space-y-3 text-[11px] text-[#5c544b]">
              <div className="flex justify-between items-center">
                <span>Proyectos Dinámicos:</span>
                <span className="font-mono font-bold text-[#1f5f3d]">
                  {projects.length} activos
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Artículos de Trazabilidad:</span>
                <span className="font-mono font-bold text-[#1f5f3d]">
                  {blogPosts.length} publicados
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Boletines de Transparencia:</span>
                <span className="font-mono font-bold text-[#1f5f3d]">
                  {bulletins.length} enlistados
                </span>
              </div>
            </div>

            <div className="bg-white/60 border border-[#ebdccd]/50 p-3 rounded-lg space-y-2 text-[10px]">
              <div className="font-bold text-[#1c1a17] text-left">Ejemplo del widget:</div>
              <div className="flex gap-2 items-center text-left bg-white p-2 rounded border border-[#ebdccd]/30">
                <FileText className="h-5 w-5 text-[#d95c2b]" />
                <div className="truncate">
                  <div className="font-bold truncate text-[#1b3022]">
                    {bulletins[0]?.title || 'Boletín de Invierno'}
                  </div>
                  <div className="text-[8px] text-[#5c544b] font-mono">
                    {bulletins[0]?.issueNumber || 'N° 12'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1f5f3d] hover:bg-[#15462b] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Compass className="h-4 w-4" />
            <span>Aplicar Cambios Globales</span>
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
