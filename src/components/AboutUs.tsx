import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Leaf,
  Heart,
  Users,
  Shield,
  GraduationCap,
  Compass,
  Landmark,
  ArrowRight,
  BookOpen,
  FileText,
  Calendar,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { Project, BlogPost, Bulletin } from '../types';
import { api } from '../services/api';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

interface AboutUsProps {
  onDonateClick: () => void;
  onProjectsClick: () => void;
  onBlogClick?: () => void;
  onBulletinsClick?: () => void;
}

interface PillarItem {
  title: string;
  description: string;
  iconName: string;
}

interface AboutUsData {
  introSub: string;
  introTitle: string;
  introText: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  imageUrl: string;
  pillars: PillarItem[];
}

const SignatureDivider = () => (
  <div className="flex items-center justify-center space-x-4 py-6">
    <div className="h-[1px] bg-[#C5A059]/30 w-24" />
    <div className="w-2.5 h-2.5 rotate-45 bg-[#C5A059] border border-[#1B3022]/40" />
    <div className="h-[1px] bg-[#C5A059]/30 w-24" />
  </div>
);

const iconMap: Record<string, React.ComponentType<any>> = {
  Leaf,
  Heart,
  Users,
  Shield,
  GraduationCap,
  Compass,
  Landmark,
};

export default function AboutUs({
  onDonateClick,
  onProjectsClick,
  onBlogClick = () => {},
  onBulletinsClick = () => {},
}: AboutUsProps) {
  // Dynamic Content States
  const [aboutData, setAboutData] = useState<AboutUsData | null>(null);

  // Previews States
  const [latestProject, setLatestProject] = useState<Project | null>(null);
  const [latestBlog, setLatestBlog] = useState<BlogPost | null>(null);
  const [latestBulletin, setLatestBulletin] = useState<Bulletin | null>(null);

  useEffect(() => {
    // Load Dynamic About Copy
    api
      .get<AboutUsData>('/api/about')
      .then((res) => {
        if (res.success && res.data) setAboutData(res.data);
      })
      .catch((err) => console.error('Error fetching about dynamic content:', err));

    // Load Preview Sources
    api
      .get<Project[]>('/api/projects')
      .then((res) => {
        const projs = res.data;
        if (res.success && projs && projs.length > 0) {
          // Sort or pick first/featured
          setLatestProject(projs[0]);
        }
      })
      .catch((err) => console.error('Error picking latest project preview:', err));

    api
      .get<BlogPost[]>('/api/blog')
      .then((res) => {
        const blogs = res.data;
        if (res.success && blogs && blogs.length > 0) {
          // Find featured or first
          const feat = blogs.find((b) => b.featured) || blogs[0];
          setLatestBlog(feat);
        }
      })
      .catch((err) => console.error('Error picking latest blog preview:', err));

    api
      .get<Bulletin[]>('/api/bulletins')
      .then((res) => {
        const bulls = res.data;
        if (res.success && bulls && bulls.length > 0) {
          setLatestBulletin(bulls[0]);
        }
      })
      .catch((err) => console.error('Error picking latest bulletin preview:', err));
  }, []);

  if (aboutData === null) {
    return (
      <div className="space-y-16 py-16 bg-[#F5F2ED] min-h-[600px] flex items-center justify-center animate-pulse"></div>
    );
  }

  return (
    <div className="space-y-16 py-16 bg-[#F5F2ED]">
      {/* Intro section: Mission/Vision (Split screen Column with Image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text details */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block">
              {aboutData.introSub}
            </span>
            <h2 className="font-display text-3xl sm:text-4.5xl font-black text-[#1B3022] tracking-tight leading-tight">
              Quiénes Somos
            </h2>
            <div className="h-[1px] bg-[#C5A059]/30 w-32" />
            <p className="text-[#2C2C2C] text-sm leading-relaxed font-sans pre-wrap">
              Nacidos en 1993 en la Parroquia Compañía de Jesús al servicio de poblaciones
              migrantes. Hoy somos una obra sostenida por voluntarios, fundadores y aliados
              internacionales que responde a la extrema vulnerabilidad con acciones estructurales:
              unidades académicas, comedores comunitarios, centros multifuncionales y ecocampos que
              unen el desarrollo humano y la espiritualidad de servicio.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onDonateClick}
                className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#1B3022] border-b border-[#1B3022] px-5 py-3 rounded-[4px] font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
              >
                Ofrecer un Donativo
              </button>
              <button
                onClick={onProjectsClick}
                className="bg-transparent text-[#1B3022] border border-[#1B3022] px-5 py-3 rounded-[4px] font-black text-[10px] uppercase tracking-widest hover:bg-[#1B3022]/10 transition-all cursor-pointer"
              >
                Conocer Proyectos
              </button>
            </div>
          </div>

          {/* Right Column Image presentation */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Back Heritage frame ornament */}
              <div className="absolute -inset-2 border border-[#C5A059]/30 rounded-[12px] -rotate-1 z-0" />
              <img
                src={cleanGoogleDriveUrl(aboutData.imageUrl)}
                alt="VOSERDEM Cochabamba"
                className="rounded-[8px] object-cover aspect-4/3 w-full border border-[#C5A059]/40 shadow-md relative z-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-[#1B3022]/90 text-[#F5F2ED] py-1.5 px-3 border border-[#C5A059]/40 rounded-[4px] text-[10px] uppercase font-bold tracking-widest z-20">
                Cochabamba · Bolivia
              </div>
            </div>
          </div>
        </div>

        {/* Mission and Vision Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {/* Misión Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-8 shadow-none flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#1B3022]/10 text-[#C5A059] flex items-center justify-center rounded-[4px] border border-[#C5A059]/20">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1B3022]">
                {aboutData.missionTitle}
              </h3>
              <p className="text-[#2C2C2C] text-xs leading-relaxed font-sans pre-wrap">
                {aboutData.missionText}
              </p>
            </div>
          </motion.div>

          {/* Visión Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-8 shadow-none flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#1B3022]/10 text-[#C5A059] flex items-center justify-center rounded-[4px] border border-[#C5A059]/20">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1B3022]">
                {aboutData.visionTitle}
              </h3>
              <p className="text-[#2C2C2C] text-xs leading-relaxed font-sans pre-wrap">
                {aboutData.visionText}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <SignatureDivider />
      </div>

      {/* Pillars Section */}
      <section className="bg-[#FCF9F8]/65 py-16 border-y border-[#C5A059]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block">
              Presencia a Nivel Nacional
            </span>
            <h2 className="font-display text-3xl font-bold text-[#1B3022]">
              Mapa de Impacto Territorial
            </h2>
            <div className="h-[1px] bg-[#C5A059]/30 w-20 mx-auto" />
            <p className="text-xs text-[#2C2C2C]/80 font-sans">
              Nuestra acción capilar transforma vidas en cuatro grandes sitios piloto de Bolivia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutData.pillars.map((pillar, idx) => {
              const Icon = iconMap[pillar.iconName] || Leaf;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-6 lg:p-8 flex gap-5 shadow-none hover:border-[#1B3022]/35 transition-colors"
                >
                  <div className="p-3 bg-[#1B3022] text-[#C5A059] rounded-[4px] h-fit shrink-0 border border-[#C5A059]/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display text-md font-bold text-[#1B3022]">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-[#2C2C2C] leading-relaxed font-sans">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEW: Blog, Projects, and Bulletins Real-Time Preview section with images and direct links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] flex items-center justify-center gap-1.5">
            <Activity className="h-3 w-3 animate-pulse" />
            Transparencia y Evidencia
          </span>
          <h2 className="font-display text-3xl font-black text-[#1B3022] tracking-tight">
            Programas Emblemáticos e Historia Viva
          </h2>
          <div className="h-[1px] bg-[#C5A059]/30 w-24 mx-auto" />
          <p className="text-xs text-[#2C2C2C] font-sans">
            Conoce el estado de nuestros programas activos (Ecocampo, Comedores, Agua), rinde
            homenaje a quienes hicieron esto posible y revisa nuestra memoria institucional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Project */}
          <div className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-6 flex flex-col justify-between hover:border-[#1B3022]/35 transition-all">
            <div className="space-y-4">
              <span className="bg-[#1B3022]/10 border border-[#C5A059]/30 text-[#1B3022] text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-[4px] inline-block">
                Programa Emblemático
              </span>

              {latestProject ? (
                <div className="space-y-4">
                  <img
                    src={cleanGoogleDriveUrl(latestProject.image)}
                    alt={latestProject.title}
                    className="w-full h-40 object-cover rounded-[4px] border border-[#ebdccd]"
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="font-display font-bold text-base text-[#1B3022] line-clamp-1">
                    {latestProject.title}
                  </h3>
                  <p className="text-[11px] text-[#2C2C2C] leading-relaxed line-clamp-2 font-sans">
                    {latestProject.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between font-mono font-bold text-[#2C2C2C]">
                      <span>RECAUDADO: ${latestProject.raised.toLocaleString()} USD</span>
                      <span>META: ${latestProject.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#1B3022]/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C5A059] h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (latestProject.raised / latestProject.goal) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center text-xs text-neutral-400 font-sans border border-dashed rounded">
                  No se registran iniciativas aún.
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#C5A059]/20 mt-4">
              <button
                onClick={onProjectsClick}
                className="text-[10px] text-[#1B3022] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>Donar / Ver Proyectos</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
              </button>
            </div>
          </div>

          {/* Preview Blog Article */}
          <div className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-6 flex flex-col justify-between hover:border-[#1B3022]/35 transition-all">
            <div className="space-y-4">
              <span className="bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-[4px] inline-block">
                Historia Viva
              </span>

              {latestBlog ? (
                <div className="space-y-4">
                  <img
                    src={cleanGoogleDriveUrl(latestBlog.image)}
                    alt={latestBlog.title}
                    className="w-full h-40 object-cover rounded-[4px] border border-[#ebdccd]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex items-center gap-2 text-[9px] text-[#2C2C2C]/70 font-mono">
                    <Calendar className="h-3 w-3 text-[#C5A059]" />
                    <span>{latestBlog.date}</span>
                    <span>·</span>
                    <span>{latestBlog.readTime}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[#1B3022] line-clamp-1">
                    {latestBlog.title}
                  </h3>
                  <p className="text-[11px] text-[#2C2C2C] leading-relaxed line-clamp-2 font-sans">
                    {latestBlog.summary}
                  </p>
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center text-xs text-neutral-400 font-sans border border-dashed rounded">
                  No hay artículos publicados aún.
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#C5A059]/20 mt-4">
              <button
                onClick={onBlogClick}
                className="text-[10px] text-[#1B3022] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>Leer Diario Completo</span>
                <BookOpen className="h-3 w-3 shrink-0" />
              </button>
            </div>
          </div>

          {/* Preview Bulletin */}
          <div className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] p-6 flex flex-col justify-between hover:border-[#1B3022]/35 transition-all">
            <div className="space-y-4">
              <span className="bg-[#1B3022]/10 border border-[#C5A059]/30 text-[#1B3022] text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-[4px] inline-block">
                Transparencia (Boletines)
              </span>

              {latestBulletin ? (
                <div className="space-y-5 py-2">
                  <div className="border border-[#C5A059]/25 bg-[#F5F2ED] p-4 rounded-[4px] flex items-center gap-3.5 shadow-inner">
                    <FileText className="h-10 w-10 text-[#C5A059]" />
                    <div>
                      <h4 className="font-display font-black text-xs text-[#1B3022] uppercase tracking-wide">
                        {latestBulletin.issueNumber}
                      </h4>
                      <p className="text-[9px] text-[#2C2C2C]/85 font-mono">
                        Publicado: {latestBulletin.publishDate}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#1B3022] line-clamp-2 leading-tight">
                    {latestBulletin.title}
                  </h3>

                  <p className="text-[11px] text-[#2C2C2C] leading-relaxed line-clamp-3 font-sans">
                    {latestBulletin.summary}
                  </p>
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center text-xs text-neutral-400 font-sans border border-dashed rounded">
                  No hay boletines disponibles para previsualizar.
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#C5A059]/20 mt-4 space-y-3">
              {latestBulletin?.downloadUrl && (
                <a
                  href={latestBulletin.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C5A059] text-[#1B3022] border border-[#1B3022] text-[10px] font-black tracking-widest uppercase py-2 px-3.5 rounded-[4px] text-center flex items-center justify-center gap-1.5 hover:bg-[#C5A059]/90 transition-all font-sans"
                >
                  <span>Bajar PDF de Resumen</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <button
                onClick={onBulletinsClick}
                className="text-[10px] text-[#1B3022] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline cursor-pointer block"
              >
                <span>Ver Todos los Boletines</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action within landing page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1B3022] rounded-[8px] text-white p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-none border border-[#C5A059]/40">
          {/* Back art details */}
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-[#C5A059]/5 blur-3xl -mr-20 -mb-20" />

          <div className="max-w-3xl relative z-10 space-y-6">
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#F5F2ED]">
              ¿Quieres ser parte de la transformación en Bolivia?
            </h3>
            <p className="text-[#F5F2ED]/85 text-xs sm:text-sm leading-relaxed max-w-xl font-sans">
              Apoya la formación de jóvenes en Sacaca, el sostenimiento de comedores comunitarios o
              el acompañamiento a los adultos mayores. Tu compromiso se traduce en resultados
              verificables y una Bolivia con más dignidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onDonateClick}
                className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#1B3022] px-6 py-3 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all shadow-none cursor-pointer border-b border-[#1B3022]"
              >
                Apoyar con Donación
              </button>
              <button
                onClick={onProjectsClick}
                className="bg-transparent hover:bg-white/10 text-[#F5F2ED] border border-[#C5A059]/40 px-6 py-3 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all text-center cursor-pointer"
              >
                Explorar Nuestros Proyectos
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
