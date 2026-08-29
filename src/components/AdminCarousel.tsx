import React from 'react';
import { CarouselSlide } from '../types';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

interface AdminCarouselProps {
  carouselSlides: CarouselSlide[];
  setCarouselSlides: React.Dispatch<React.SetStateAction<CarouselSlide[]>>;
  loadAllAdminData: () => Promise<void>;
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminCarousel({
  carouselSlides,
  setCarouselSlides,
  loadAllAdminData,
  adminFetch,
  setLoading
}: AdminCarouselProps) {
  const showStatus = (text: string, type: 'success' | 'error') => {
    toast[type](text);
  };

  const handleUpdateCarousel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sanitizedSlides = carouselSlides.map((slide) => ({
        ...slide,
        image: cleanGoogleDriveUrl(slide.image),
      }));

      const res = await adminFetch('/api/carousel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedSlides),
      });

      if (res.ok) {
        showStatus('Carrusel de portada guardado con éxito (máximo 5 fotografías).', 'success');
        loadAllAdminData();
      } else {
        const err = await res.json();
        showStatus(err.error || 'Error al intentar actualizar el carrusel.', 'error');
      }
    } catch (err) {
      showStatus('Error de red al intentar guardar los cambios del carrusel.', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
    <form onSubmit={handleUpdateCarousel} className="space-y-8 animate-fade-in">
      <div className="bg-[#ebdccd]/20 border border-[#ebdccd]/80 p-6 rounded-3xl space-y-2">
        <h3 className="font-display text-xl font-extrabold text-[#1c1a17] flex items-center gap-2">
          <Sparkles className="h-5.5 w-5.5 text-[#1f5f3d]" />
          Gestión Integral del Carrusel de Portada (Muro de 5 Fotografías)
        </h3>
        <p className="text-xs text-[#5c544b] leading-relaxed">
          Gestione las 5 diapositivas deslizantes que los visitantes verán en la página de
          inicio. Puede personalizar el distintivo de categoría (badge), la imagen de fondo, el
          título y la descripción.
          <br />
          <strong className="text-[#d95c2b]">Truco de Estilo:</strong> Envuelva las palabras
          importantes en asteriscos, por ejemplo:{' '}
          <code className="bg-[#ebdccd]/40 px-1.5 py-0.5 rounded text-xs font-mono select-all">
            *Sostenibilidad*
          </code>{' '}
          para resaltarlas magníficamente en cursiva y amarillo dorado corporativo.
        </p>
      </div>

      <div className="space-y-6">
        {carouselSlides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className="bg-[#fcfbf9] border border-[#ebdccd]/60 rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 hover:border-[#1f5f3d]/30 transition-all"
          >
            {/* Inputs settings col */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#ebdccd]/30">
                <span className="w-6 h-6 bg-[#1f5f3d] text-white rounded-full flex items-center justify-center text-xs font-bold font-mono">
                  {idx + 1}
                </span>
                <h4 className="font-display font-black text-sm text-[#1c1a17] uppercase tracking-wide">
                  Fotografía / Diapositiva N° {idx + 1}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Etiqueta / Distintivo (Badge)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Medio Ambiente & Ecología"
                    value={slide.badge || ''}
                    onChange={(e) => {
                      const updated = [...carouselSlides];
                      updated[idx].badge = e.target.value;
                      setCarouselSlides(updated);
                    }}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Selección de Icono del Distintivo
                  </label>
                  <select
                    value={slide.badgeIconName || 'Trees'}
                    onChange={(e) => {
                      const updated = [...carouselSlides];
                      updated[idx].badgeIconName = e.target.value;
                      setCarouselSlides(updated);
                    }}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none"
                  >
                    <option value="Trees">Bosque / Árboles (Trees)</option>
                    <option value="Users">Comunidad / Abuelas (Users)</option>
                    <option value="Landmark">Institucional / Campamento (Landmark)</option>
                    <option value="Award">Certificaciones / Logros (Award)</option>
                    <option value="Heart">Apoyo / Voluntariado (Heart)</option>
                    <option value="Activity">Iniciativas / Acción (Activity)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                  URL de la Fotografía (Unsplash o servidor de imágenes)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/etc..."
                  value={slide.image || ''}
                  onChange={(e) => {
                    const updated = [...carouselSlides];
                    updated[idx].image = e.target.value;
                    setCarouselSlides(updated);
                  }}
                  className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                  Título Principal (Use asteriscos para destacar palabras, Ej: Sembrando
                  *Sostenibilidad*)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Escriba el encabezado descriptivo de la portada..."
                  value={slide.title || ''}
                  onChange={(e) => {
                    const updated = [...carouselSlides];
                    updated[idx].title = e.target.value;
                    setCarouselSlides(updated);
                  }}
                  className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                  Texto Descriptivo Secundario
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escriba un resumen atractivo que capture la visión del voluntariado o ecología..."
                  value={slide.description || ''}
                  onChange={(e) => {
                    const updated = [...carouselSlides];
                    updated[idx].description = e.target.value;
                    setCarouselSlides(updated);
                  }}
                  className="w-full bg-white border border-[#ebdccd] rounded-xl p-3 text-xs text-[#1c1a17] resize-none"
                />
              </div>
            </div>

            {/* Live Preview interactive thumbnail col */}
            <div className="lg:col-span-4 flex flex-col justify-center items-center bg-[#f2ede6]/40 rounded-2xl p-4 border border-[#ebdccd]/40 text-center">
              <span className="text-[10px] uppercase font-sans font-bold text-[#5c544b] mb-3 block">
                Previsualización de Imagen N° {idx + 1}
              </span>

              <div className="w-full h-40 bg-neutral-100 rounded-xl overflow-hidden border border-[#ebdccd] shadow-xs relative">
                {slide.image ? (
                  <img
                    src={cleanGoogleDriveUrl(slide.image)}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#7d756b] font-mono">
                    Sin imagen de red
                  </div>
                )}
              </div>

              <p className="text-[9px] text-[#5c544b] leading-tight mt-3">
                La imagen se escalará fluidamente y se mezclará orgánicamente bajo el efecto de
                la portada.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-[#1f5f3d] hover:bg-[#15462b] text-white py-3.5 px-8 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Sparkles className="h-4 w-4" />
          <span>Guardar Configuración del Carrusel</span>
        </button>
      </div>
    </form>
    </>
  );
}
