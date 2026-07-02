import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, MoveUp, MoveDown, Map, CheckCircle2 } from 'lucide-react';

export default function AdminImpacto({ adminFetch }: { adminFetch: (url: string, options?: RequestInit) => Promise<Response> }) {
  const [data, setData] = useState<{
    mainTitle: string;
    mainSubtitle: string;
    introText: string;
    sites: any[];
  }>({
    mainTitle: 'Impacto Territorial',
    mainSubtitle: 'Presencia Nacional',
    introText: '',
    sites: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/impacto');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...data };
      payload.sites = payload.sites.map((s, idx) => ({ ...s, order: idx + 1 }));

      const res = await adminFetch('/api/impacto', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setStatusMsg({ text: 'Página guardada exitosamente.', type: 'success' });
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        throw new Error('Error al guardar');
      }
    } catch (err) {
      setStatusMsg({ text: 'Error al guardar. Intente de nuevo.', type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateSite = (idx: number, field: string, value: any) => {
    const newSites = [...data.sites];
    newSites[idx] = { ...newSites[idx], [field]: value };
    setData({ ...data, sites: newSites });
  };

  const updateStat = (siteIdx: number, statIdx: number, field: string, value: string) => {
    const newSites = [...data.sites];
    const newStats = [...newSites[siteIdx].stats];
    newStats[statIdx] = { ...newStats[statIdx], [field]: value };
    newSites[siteIdx].stats = newStats;
    setData({ ...data, sites: newSites });
  };

  const addStat = (siteIdx: number) => {
    const newSites = [...data.sites];
    if (!newSites[siteIdx].stats) newSites[siteIdx].stats = [];
    newSites[siteIdx].stats.push({ icon: 'Leaf', label: 'Nuevo Logro', value: 'Descripción corta' });
    setData({ ...data, sites: newSites });
  };

  const removeStat = (siteIdx: number, statIdx: number) => {
    const newSites = [...data.sites];
    newSites[siteIdx].stats.splice(statIdx, 1);
    setData({ ...data, sites: newSites });
  };

  const moveSite = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === data.sites.length - 1) return;

    const newSites = [...data.sites];
    const temp = newSites[idx];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    newSites[idx] = newSites[targetIdx];
    newSites[targetIdx] = temp;
    setData({ ...data, sites: newSites });
  };

  const addSite = () => {
    setData({
      ...data,
      sites: [
        ...data.sites,
        {
          id: `site-${Date.now()}`,
          name: 'Nuevo Sitio',
          location: 'Ubicación',
          description: 'Descripción detallada',
          image: '',
          order: data.sites.length + 1,
          stats: []
        }
      ]
    });
  };

  const removeSite = (idx: number) => {
    if (confirm('¿Eliminar este sitio piloto?')) {
      const newSites = [...data.sites];
      newSites.splice(idx, 1);
      setData({ ...data, sites: newSites });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#2C2C2C]">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header / Configuración Principal */}
      <div className="bg-white rounded-[12px] shadow-sm border border-[#C5A059]/30 p-6 relative">
        <h2 className="text-xl font-display font-black text-[#1B3022] mb-4 flex items-center gap-2">
          <Map className="w-5 h-5 text-[#C5A059]" />
          Configuración Principal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-2">Título Principal</label>
            <input
              type="text"
              className="w-full bg-[#FCF9F8] border border-[#E5E0D8] rounded-[6px] p-3 text-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all"
              value={data.mainTitle}
              onChange={(e) => updateField('mainTitle', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-2">Subtítulo (Top)</label>
            <input
              type="text"
              className="w-full bg-[#FCF9F8] border border-[#E5E0D8] rounded-[6px] p-3 text-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all"
              value={data.mainSubtitle}
              onChange={(e) => updateField('mainSubtitle', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-2">Texto Introductorio (Soporta HTML básico)</label>
          <textarea
            rows={4}
            className="w-full bg-[#FCF9F8] border border-[#E5E0D8] rounded-[6px] p-3 text-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all resize-y"
            value={data.introText}
            onChange={(e) => updateField('introText', e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-[#C5A059] hover:bg-[#C5A059]/90 text-white px-6 py-2.5 rounded-[6px] font-bold text-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'Guardar Todos los Cambios'}</span>
          </button>
        </div>

        {statusMsg && (
          <div className={`mt-4 p-3 rounded-[6px] flex items-center gap-2 text-sm font-bold ${
            statusMsg.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            {statusMsg.text}
          </div>
        )}
      </div>

      {/* Sitios Piloto */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-display font-black text-[#1B3022]">Sitios Piloto ({data.sites.length})</h2>
          <button
            onClick={addSite}
            className="flex items-center gap-2 text-sm font-bold text-[#1565C0] hover:text-[#0D47A1] bg-[#1565C0]/10 px-4 py-2 rounded-[6px] transition-colors"
          >
            <Plus className="w-4 h-4" /> Añadir Sitio
          </button>
        </div>

        {data.sites.map((site, idx) => (
          <div key={site.id} className="bg-white rounded-[12px] shadow-sm border border-[#E5E0D8] p-6 relative group">
            
            {/* Controles de orden y eliminación */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button 
                onClick={() => moveSite(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 text-gray-400 hover:text-[#1B3022] hover:bg-gray-100 rounded-[4px] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                title="Mover arriba"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button 
                onClick={() => moveSite(idx, 'down')}
                disabled={idx === data.sites.length - 1}
                className="p-1.5 text-gray-400 hover:text-[#1B3022] hover:bg-gray-100 rounded-[4px] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                title="Mover abajo"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button 
                onClick={() => removeSite(idx)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[4px] transition-colors"
                title="Eliminar sitio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#1B3022] text-[#C5A059] font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {idx + 1}
              </div>
              <h3 className="font-display font-black text-lg text-[#1B3022]">{site.name || 'Sin Nombre'}</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-1">Nombre del Sitio</label>
                  <input
                    type="text"
                    className="w-full bg-[#FCF9F8] border border-[#E5E0D8] rounded-[6px] p-2 text-sm focus:ring-2 focus:ring-[#C5A059] outline-none"
                    value={site.name}
                    onChange={(e) => updateSite(idx, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-1">Ubicación / Región</label>
                  <input
                    type="text"
                    className="w-full bg-[#FCF9F8] border border-[#E5E0D8] rounded-[6px] p-2 text-sm focus:ring-2 focus:ring-[#C5A059] outline-none"
                    value={site.location}
                    onChange={(e) => updateSite(idx, 'location', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-1">URL de Imagen</label>
                  <input
                    type="text"
                    className="w-full bg-[#FCF9F8] border border-[#E5E0D8] rounded-[6px] p-2 text-sm focus:ring-2 focus:ring-[#C5A059] outline-none"
                    value={site.image}
                    onChange={(e) => updateSite(idx, 'image', e.target.value)}
                    placeholder="https://images.unsplash..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    className="w-full bg-[#FCF9F8] border border-[#E5E0D8] rounded-[6px] p-2 text-sm focus:ring-2 focus:ring-[#C5A059] outline-none resize-y"
                    value={site.description}
                    onChange={(e) => updateSite(idx, 'description', e.target.value)}
                  />
                </div>
              </div>

              {/* Estadísticas/Logros */}
              <div className="bg-[#FCF9F8] rounded-[8px] p-4 border border-[#E5E0D8]">
                <div className="flex justify-between items-center mb-4 border-b border-[#E5E0D8] pb-2">
                  <h4 className="text-xs font-bold text-[#1B3022] uppercase tracking-wider">Logros Clave</h4>
                  <button onClick={() => addStat(idx)} className="text-xs font-bold text-[#C5A059] hover:text-[#8C6612]">+ Añadir Logro</button>
                </div>
                
                <div className="space-y-3">
                  {site.stats?.map((stat: any, sIdx: number) => (
                    <div key={sIdx} className="flex items-start gap-2 bg-white p-2 rounded-[6px] border border-[#E5E0D8] relative group/stat">
                      <div className="w-1/4">
                        <input
                          type="text"
                          className="w-full border-b border-gray-200 text-xs p-1 outline-none focus:border-[#C5A059]"
                          placeholder="Icon (ej. Leaf)"
                          value={stat.icon}
                          onChange={(e) => updateStat(idx, sIdx, 'icon', e.target.value)}
                        />
                      </div>
                      <div className="w-3/4 space-y-1">
                        <input
                          type="text"
                          className="w-full border-b border-gray-200 font-bold text-xs p-1 outline-none focus:border-[#C5A059]"
                          placeholder="Título del logro"
                          value={stat.label}
                          onChange={(e) => updateStat(idx, sIdx, 'label', e.target.value)}
                        />
                        <input
                          type="text"
                          className="w-full text-xs p-1 outline-none bg-transparent"
                          placeholder="Descripción corta"
                          value={stat.value}
                          onChange={(e) => updateStat(idx, sIdx, 'value', e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => removeStat(idx, sIdx)}
                        className="absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover/stat:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(!site.stats || site.stats.length === 0) && (
                    <p className="text-xs text-gray-500 italic">No hay logros configurados para este sitio.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        ))}

        {data.sites.length === 0 && (
          <div className="bg-white rounded-[12px] shadow-sm border border-dashed border-[#C5A059] p-12 text-center">
            <Map className="w-12 h-12 text-[#C5A059]/40 mx-auto mb-4" />
            <p className="text-[#2C2C2C] font-bold">No hay Sitios Piloto configurados.</p>
            <p className="text-sm text-gray-500 mb-4">Añade tu primer sitio para comenzar a construir el mapa de impacto.</p>
            <button onClick={addSite} className="bg-[#C5A059] text-white px-6 py-2 rounded-[6px] text-sm font-bold shadow hover:bg-[#C5A059]/90 transition">
              Crear Sitio Piloto
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
