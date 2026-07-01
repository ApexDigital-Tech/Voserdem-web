import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Trees, Users, Award, Landmark, Heart, Activity, ArrowRight, Play, ChevronRight } from 'lucide-react';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';
import { CarouselSlide } from '../types';

interface HeroProps {
  onLearnMore: () => void;
  onDonate: () => void;
}

const iconMap: Record<string, any> = {
  Trees,
  Users,
  Landmark,
  Award,
  Heart,
  Activity
};

const defaultSlides: CarouselSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    badge: '34 Años de Servicio',
    badgeIconName: 'Award',
    title: 'Una *Bolivia mejor* es posible',
    description: 'Con la voluntad de hacer bien el bien y siguiendo las huellas de Jesús. 34 años de trayectoria en Cochabamba, Potosí y Santa Cruz.'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1600',
    badge: 'Desarrollo Humano',
    badgeIconName: 'Heart',
    title: 'Educación, Salud y *Dignidad*',
    description: 'Impactando a más de 1200 estudiantes en comedores escolares y brindando atención cálida a las abuelitas de Cochabamba.'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600',
    badge: 'Impacto Territorial',
    badgeIconName: 'Landmark',
    title: 'De los *Andes* al *Oriente*',
    description: 'Transformando comunidades en Sacaca, Quillacollo, Villa Tunari y el Norte Integrado Cruceño mediante desarrollo sostenible.'
  }
];

export default function Hero({ onLearnMore, onDonate }: HeroProps) {
  const [slides, setSlides] = useState<CarouselSlide[] | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const { scrollY } = useScroll();
  // Translate the background background relative to viewport scrolling
  const yBg = useTransform(scrollY, [0, 1000], [0, 320]);

  useEffect(() => {
    fetch('/api/carousel')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data && data.length > 0) {
          setSlides(data);
        } else {
          setSlides(defaultSlides);
        }
      })
      .catch((err) => {
        console.error('Error loading dynamic carousel slides:', err);
        setSlides(defaultSlides);
      });
  }, []);

  const slidesToRender = slides && slides.length > 0 ? slides : defaultSlides;

  // Auto-play interval for the slides (6500ms duration)
  useEffect(() => {
    if (slidesToRender.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToRender.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slidesToRender.length]);

  if (slides === null) {
    return <div className="min-h-[600px] sm:min-h-[660px] md:min-h-[720px] lg:min-h-[680px] bg-[#1B3022] flex items-center justify-center animate-pulse" />;
  }



  // Helper to format titles with md-like *asterisks* into gorgeous highlighted spans
  const formatTitle = (titleText: string) => {
    if (!titleText) return '';
    const parts = titleText.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const cleanWord = part.slice(1, -1);
        return (
          <span key={i} className="text-[#C5A059] italic font-display font-medium">
            {cleanWord}
          </span>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  const activeSlide = slidesToRender[currentSlide] || slidesToRender[0] || defaultSlides[0];

  return (
    <div className="relative bg-[#1B3022] min-h-[600px] sm:min-h-[660px] md:min-h-[720px] lg:min-h-[680px] overflow-hidden flex flex-col justify-between border-b border-[#C5A059]/30">
      
      {/* 1. LAYER: Background Slides with delicate Cross-fade & high-performance scroll interpolation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slidesToRender.map((slide, index) => (
          <motion.div
            key={slide.id || index}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1.0 : 1.05
            }}
            transition={{ 
              opacity: { duration: 1.8, ease: 'easeInOut' },
              scale: { duration: 6.5, ease: 'easeOut' }
            }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${cleanGoogleDriveUrl(slide.image)})`,
              y: yBg,
              visibility: currentSlide === index || (Math.abs(currentSlide - index) <= 1) ? 'visible' : 'hidden'
            }}
          />
        ))}
      </div>

      {/* 2. LAYER: Organic Gradient Overlay for text readability (Fusión Fluida) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#111E15]/95 via-[#16271B]/85 to-transparent md:block hidden" />
      <div className="absolute inset-0 z-10 bg-[#111E15]/80 md:hidden block" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#111E15] to-transparent z-10" />

      {/* Decorative ambient gold glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-80 h-80 rounded-full bg-[#C5A059]/10 blur-3xl z-10 pointer-events-none" />

      {/* 3. LAYER: Foreground Interactive Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 lg:pt-28 relative z-20 flex-grow flex flex-col justify-center w-full animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column: Fully animated with staggering transitions relative to active slide */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Active category badge with dynamic Lucide mapping */}
                <span className="inline-flex items-center space-x-2 bg-[#C5A059]/20 text-[#FFE5A3] border border-[#C5A059]/40 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {React.createElement(iconMap[activeSlide?.badgeIconName] || Trees, { className: "h-3.5 w-3.5 text-[#C5A059]" })}
                  <span>{activeSlide?.badge}</span>
                </span>

                {/* Primary Slide Title with Asterisks Highlight */}
                <h1 className="font-display text-2xl sm:text-4.5xl lg:text-6xl font-black text-[#F5F2ED] leading-tight tracking-tight">
                  {formatTitle(activeSlide?.title)}
                </h1>

                {/* Description paragraph */}
                <p className="text-xs sm:text-sm md:text-base text-[#F5F2ED]/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans font-normal drop-shadow-sm">
                  {activeSlide?.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Action buttons (always visible) */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2">
              <button
                onClick={onDonate}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#C5A059] text-[#1B3022] border-b-2 border-[#1B3022]/40 px-8 py-3.5 rounded-[4px] text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059]/90 hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Heart className="h-4 w-4 fill-current text-[#1B3022]" />
                <span>Apoyar un Proyecto</span>
              </button>
              
              <button
                onClick={onLearnMore}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 bg-transparent text-[#F5F2ED] border border-[#F5F2ED]/40 hover:bg-[#F5F2ED]/10 px-8 py-3.5 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                <span>Ver Proyectos Activos</span>
                <ChevronRight className="h-4 w-4 text-[#C5A059]" />
              </button>
            </div>
            
            {/* Slide Navigation Indicators */}
            <div className="flex justify-center lg:justify-start items-center gap-2 pt-4">
              {slidesToRender.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-[#C5A059]' : 'w-2.5 bg-[#F5F2ED]/30 hover:bg-[#F5F2ED]/50'
                  }`}
                  title={`Ir a diapositiva ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Floating Badge Box */}
          <div className="lg:col-span-4 hidden lg:block relative justify-self-end w-full max-w-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#111E15]/75 backdrop-blur-md p-6 rounded-2xl border border-[#C5A059]/25 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start space-x-4">
                <div className="bg-[#C5A059]/15 text-[#C5A059] p-3 rounded-xl border border-[#C5A059]/35">
                  <Award className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-[#C5A059] uppercase tracking-widest block">Institución con historia</span>
                  <p className="text-xs text-[#F5F2ED]/85 leading-relaxed font-sans">
                    Más de tres décadas construyendo una Bolivia mejor mediante el Modelo de Desarrollo Sostenible Integral, guiados por el espíritu de servicio.
                  </p>
                  <p className="text-[10px] italic text-[#C5A059] font-medium pt-1">
                    ✓ Transparencia civil auditada
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 4. LAYER: Bottom floating Counters Grid */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {[
            { count: '34', text: 'Años de Servicio', icon: Award, color: '#C5A059' },
            { count: '4', text: 'Sitios Piloto', icon: Landmark, color: '#F5F2ED' },
            { count: '1200+', text: 'Estudiantes (Comedores)', icon: Users, color: '#C5A059' },
            { count: '500+', text: 'Familias con Agua Segura', icon: Activity, color: '#F5F2ED' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-3 sm:p-4 bg-[#111E15]/65 backdrop-blur-md border border-[#C5A059]/20 rounded-xl shadow-lg hover:border-[#C5A059]/35 transition-all duration-300"
              >
                <div className="p-1.5 bg-[#1B3022]/60 text-[#C5A059] rounded-lg mb-2 border border-[#C5A059]/10">
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <span className="font-display text-2xl sm:text-3xl font-black text-[#F5F2ED] tracking-tight">{stat.count}</span>
                <span className="text-[9px] text-[#F5F2ED]/75 font-semibold tracking-wider mt-0.5 uppercase block">{stat.text}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
