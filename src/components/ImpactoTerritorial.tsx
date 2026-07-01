import React from 'react';
import { Map, Users, Leaf, GraduationCap, Droplets, Utensils } from 'lucide-react';

export default function ImpactoTerritorial() {
  const regions = [
    {
      id: 'andino',
      name: 'Sitio Andino',
      location: 'Sacaca y Norte de Potosí',
      description: 'Nuestra presencia histórica más profunda, enfrentando condiciones de extrema pobreza con intervenciones sostenidas en educación, nutrición y agricultura de alta montaña.',
      image: 'https://images.unsplash.com/photo-1542662565-7e4fd6e56d7a?q=80&w=2000&auto=format&fit=crop',
      stats: [
        { icon: GraduationCap, label: 'UAS UCB V', value: 'Centro de formación universitaria' },
        { icon: Utensils, label: 'Comedores', value: 'Alimentación escolar y adultos mayores' },
        { icon: Droplets, label: 'Agua', value: 'Sistemas de captación' }
      ]
    },
    {
      id: 'valles',
      name: 'Sitio Valles',
      location: 'Quillacollo / Chocaya',
      description: 'El corazón ecológico de VOSERDEM. Aquí desarrollamos el Ecocampo, un modelo de agroforestería y educación medioambiental para recuperar acuíferos y suelos.',
      image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000&auto=format&fit=crop',
      stats: [
        { icon: Leaf, label: 'Agroforestería', value: '70 hectáreas recuperadas' },
        { icon: Users, label: 'Capacitación', value: 'Huertos familiares' },
        { icon: Droplets, label: 'Cuencas', value: 'Protección de recarga hídrica' }
      ]
    },
    {
      id: 'amazonico',
      name: 'Sitio Amazónico',
      location: 'Villa Tunari, Trópico de Cochabamba',
      description: 'Intervención enfocada en el desarrollo productivo tropical sostenible, apoyando a comunidades a encontrar alternativas económicas ecológicamente viables.',
      image: 'https://images.unsplash.com/photo-1518182170546-076616fd4ff8?q=80&w=2000&auto=format&fit=crop',
      stats: [
        { icon: Sprout, label: 'Desarrollo', value: 'Alternativas productivas' },
        { icon: Users, label: 'Comunidades', value: 'Acompañamiento técnico' },
        { icon: Leaf, label: 'Conservación', value: 'Respeto al bosque' }
      ]
    },
    {
      id: 'chaco',
      name: 'Sitio Chaco',
      location: 'Región del Chaco Boliviano',
      description: 'Nuestro polo de desarrollo en gestación. Estamos mapeando necesidades críticas de agua y desarrollo productivo para expandir nuestro modelo DSI a esta región.',
      image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop',
      stats: [
        { icon: Map, label: 'Fase', value: 'Gestación y Mapeo' },
        { icon: Droplets, label: 'Prioridad', value: 'Acceso a agua' },
        { icon: Users, label: 'Impacto', value: 'Proyección 2030' }
      ]
    }
  ];

  const Sprout = Leaf; // Alias fallback if missing

  return (
    <div className="bg-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 space-y-16 max-w-7xl mx-auto">
      {/* Encabezado */}
      <section className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059]">Presencia Nacional</span>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#1B3022] tracking-tight">
          Impacto Territorial
        </h1>
        <div className="h-[1px] bg-[#C5A059]/30 w-24 mx-auto" />
        <p className="text-sm text-[#2C2C2C] font-sans leading-relaxed">
          Nuestra estrategia de desarrollo se organiza en cuatro grandes <strong>Sitios Piloto</strong>. 
          En lugar de dispersar esfuerzos, concentramos recursos en territorios específicos para generar 
          transformaciones profundas, verificables y permanentes.
        </p>
      </section>

      {/* Fichas Geográficas */}
      <section className="space-y-12">
        {regions.map((region, index) => (
          <div key={region.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center bg-white rounded-[12px] overflow-hidden border border-[#C5A059]/20 shadow-sm hover:shadow-md transition-shadow`}>
            
            <div className="w-full lg:w-1/2 h-64 lg:h-[400px] relative">
              <img 
                src={region.image} 
                alt={region.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B3022]/80 to-transparent flex flex-col justify-end p-6">
                <span className="text-[#C5A059] text-[10px] uppercase font-bold tracking-widest mb-1">{region.location}</span>
                <h3 className="font-display text-3xl font-black text-[#F5F2ED]">{region.name}</h3>
              </div>
            </div>

            <div className="w-full lg:w-1/2 p-8 lg:p-12 space-y-8">
              <p className="text-[#2C2C2C] text-sm leading-relaxed font-sans">
                {region.description}
              </p>
              
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#1B3022] border-b border-[#C5A059]/30 pb-2">
                  Obras y Logros Clave
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {region.stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 bg-[#FCF9F8] p-3 rounded-[6px] border border-[#C5A059]/10">
                        <div className="bg-[#1B3022]/5 p-1.5 rounded-[4px]">
                          <Icon className="h-4 w-4 text-[#C5A059]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1B3022] text-xs uppercase tracking-wider">{stat.label}</p>
                          <p className="text-[#2C2C2C] text-xs font-sans mt-0.5">{stat.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        ))}
      </section>
    </div>
  );
}
