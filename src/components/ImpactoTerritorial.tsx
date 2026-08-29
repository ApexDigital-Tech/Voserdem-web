import React from 'react';
import { Map, Users, Leaf, GraduationCap, Droplets, Utensils, Sprout } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export default function ImpactoTerritorial() {
  const fetchImpactoQuery = async () => {
    const response = await api.get<any>('/api/impacto');
    if (!response.success || !response.data) {
      throw new Error('Error fetching impacto');
    }
    return response.data;
  };

  const { data } = useQuery({
    queryKey: ['impacto'],
    queryFn: fetchImpactoQuery,
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return GraduationCap;
      case 'Utensils':
        return Utensils;
      case 'Droplets':
        return Droplets;
      case 'Leaf':
        return Leaf;
      case 'Users':
        return Users;
      case 'Sprout':
        return Sprout;
      case 'Map':
        return Map;
      default:
        return Leaf;
    }
  };

  if (!data || !data.sites || data.sites.length === 0) {
    return (
      <div className="bg-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 space-y-16 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-[#C5A059]/20 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-[#C5A059]/20 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-[#C5A059]/20 rounded col-span-2"></div>
                <div className="h-2 bg-[#C5A059]/20 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-[#C5A059]/20 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedSites = [...data.sites].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 space-y-16 max-w-7xl mx-auto">
      {/* Encabezado */}
      <section className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059]">
          {data.mainSubtitle}
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#1B3022] tracking-tight">
          {data.mainTitle}
        </h1>
        <div className="h-[1px] bg-[#C5A059]/30 w-24 mx-auto" />
        <p
          className="text-sm text-[#2C2C2C] font-sans leading-relaxed"
          dangerouslySetInnerHTML={{ __html: data.introText }}
        ></p>
      </section>

      {/* Fichas Geográficas */}
      <section className="space-y-12">
        {sortedSites.map((region, index) => (
          <div
            key={region.id}
            className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center bg-white rounded-[12px] overflow-hidden border border-[#C5A059]/20 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="w-full lg:w-1/2 h-64 lg:h-[400px] relative">
              <img src={region.image} alt={region.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B3022]/80 to-transparent flex flex-col justify-end p-6">
                <span className="text-[#C5A059] text-[10px] uppercase font-bold tracking-widest mb-1">
                  {region.location}
                </span>
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
                  {region.stats.map((stat: any, i: number) => {
                    const Icon = getIcon(stat.icon);
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-[#FCF9F8] p-3 rounded-[6px] border border-[#C5A059]/10"
                      >
                        <div className="bg-[#1B3022]/5 p-1.5 rounded-[4px]">
                          <Icon className="h-4 w-4 text-[#C5A059]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1B3022] text-xs uppercase tracking-wider">
                            {stat.label}
                          </p>
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
