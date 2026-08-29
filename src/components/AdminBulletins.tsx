import React, { useState } from 'react';
import { Bulletin } from '../types';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

interface AdminBulletinsProps {
  bulletins: Bulletin[];
  loadAllAdminData: () => Promise<void>;
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

export default function AdminBulletins({
  bulletins,
  loadAllAdminData,
  adminFetch
}: AdminBulletinsProps) {
  const showStatus = (text: string, type: 'success' | 'error') => {
    toast[type](text);
  };

  // Bulletin Form States
  const [isCreatingBulletin, setIsCreatingBulletin] = useState(false);
  const [isEditingBulletin, setIsEditingBulletin] = useState(false);
  const [editingBulletinId, setEditingBulletinId] = useState<string | null>(null);
  const [bulletinTitle, setBulletinTitle] = useState('');
  const [bulletinIssueNumber, setBulletinIssueNumber] = useState('');
  const [bulletinSummary, setBulletinSummary] = useState('');
  const [bulletinDownloadUrl, setBulletinDownloadUrl] = useState('');
  const [bulletinImage, setBulletinImage] = useState('');
  const [bulletinStatus, setBulletinStatus] = useState<'draft' | 'published'>('published');

  // About Us Admin States

  const resetBulletinForm = () => {
    setBulletinTitle('');
    setBulletinIssueNumber('');
    setBulletinSummary('');
    setBulletinDownloadUrl('');
    setBulletinImage('');
    setBulletinStatus('published');
    setIsCreatingBulletin(false);
    setIsEditingBulletin(false);
    setEditingBulletinId(null);
  };

  const startEditBulletin = (bull: Bulletin) => {
    setBulletinTitle(bull.title || '');
    setBulletinIssueNumber(bull.issueNumber || '');
    setBulletinSummary(bull.summary || '');
    setBulletinDownloadUrl(bull.downloadUrl || '');
    setBulletinImage(bull.image || '');
    setBulletinStatus(bull.status || 'published');

    setIsEditingBulletin(true);
    setEditingBulletinId(bull.id);
    setIsCreatingBulletin(true);
  };

  const handleCreateBulletin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulletinTitle.trim() || !bulletinIssueNumber.trim() || !bulletinSummary.trim()) {
      showStatus('Por favor, complete los campos obligatorios del boletín.', 'error');
      return;
    }

    try {
      const url = isEditingBulletin ? `/api/bulletins/${editingBulletinId}` : '/api/bulletins';
      const method = isEditingBulletin ? 'PUT' : 'POST';
      const payload = {
        title: bulletinTitle,
        issueNumber: bulletinIssueNumber,
        summary: bulletinSummary,
        downloadUrl: bulletinDownloadUrl,
        image: cleanGoogleDriveUrl(bulletinImage),
        status: bulletinStatus,
      };
      const res = await (isEditingBulletin ? api.put(url, payload) : api.post(url, payload));

      if (res.success) {
        showStatus(
          isEditingBulletin
            ? 'Boletín institucional actualizado con éxito.'
            : 'Boletín institucional publicado con éxito.',
          'success'
        );
        resetBulletinForm();
        loadAllAdminData();
      } else {
        showStatus(res.error || 'Error al guardar el boletín.', 'error');
      }
    } catch (err) {
      showStatus('Error de red al intentar guardar el boletín.', 'error');
    }
  };

  const handleDeleteBulletin = async (id: string, name: string) => {
    if (
      !window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el boletín "${name}"?`)
    ) {
      return;
    }

    try {
      const res = await adminFetch(`/api/bulletins/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showStatus('Boletín de difusión eliminado con éxito.', 'success');
        loadAllAdminData();
      } else {
        showStatus('Error al intentar eliminar.', 'error');
      }
    } catch (err) {
      showStatus('Error de red al eliminar.', 'error');
    }
  };


  return (
    <>
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#ebdccd]/15 p-4 rounded-2xl border border-[#ebdccd]/50">
        <div>
          <h3 className="font-display text-lg font-bold text-[#1c1a17]">
            Boletines de Difusión Institucional
          </h3>
          <p className="text-xs text-[#5c544b]">
            Publica descargables PDF para que los donantes auditen iniciativas andinas en
            Cochabamba.
          </p>
        </div>
        <button
          onClick={() => setIsCreatingBulletin(!isCreatingBulletin)}
          className="bg-[#1f5f3d] hover:bg-[#15462b] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>{isCreatingBulletin ? 'Cerrar Formulario' : 'Publicar Boletín'}</span>
        </button>
      </div>

      {isCreatingBulletin && (
        <form
          onSubmit={handleCreateBulletin}
          className="bg-white border border-[#ebdccd]/55 rounded-3xl p-6 sm:p-8 space-y-4 animate-fade-in"
        >
          <h4 className="font-display font-bold text-base text-[#1c1a17] border-b border-[#ebdccd]/40 pb-2">
            {isEditingBulletin ? 'Editar Boletín' : 'Nuevo Boletín Digital'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                Título del Boletín *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Boletín Informativo Otoño 2026"
                value={bulletinTitle}
                onChange={(e) => setBulletinTitle(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                Edición / N° de Edición *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Año 12 - N° 1 o N° Especial Viveros"
                value={bulletinIssueNumber}
                onChange={(e) => setBulletinIssueNumber(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                Soporte de Descarga (URL del PDF) o Enlace de Lectura
              </label>
              <input
                type="text"
                placeholder="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                value={bulletinDownloadUrl}
                onChange={(e) => setBulletinDownloadUrl(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                URL de Foto de Portada / Ilustración del Boletín
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-... o enlace de red"
                value={bulletinImage}
                onChange={(e) => setBulletinImage(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17]"
              />
            </div>
            <div className="space-y-1 col-span-1 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                Estado de Publicación *
              </label>
              <select
                value={bulletinStatus}
                onChange={(e) => setBulletinStatus(e.target.value as 'draft' | 'published')}
                className="w-full bg-white border border-[#ebdccd] rounded-xl px-2 py-2 text-xs text-[#1c1a17]"
              >
                <option value="published">🟢 Publicado (Visible en la web)</option>
                <option value="draft">🟡 Borrador (Solo visible en administrador)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4e4842]">
              Resumen de Contenido *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Escribe un breve listado o resumen de los hitos explicados en este boletín..."
              value={bulletinSummary}
              onChange={(e) => setBulletinSummary(e.target.value)}
              className="w-full bg-white border border-[#ebdccd] rounded-xl p-3 text-xs text-[#1c1a17]"
            />
          </div>

          <div className="flex gap-2.5 justify-end">
            <button
              type="button"
              onClick={resetBulletinForm}
              className="px-5 py-2.5 bg-[#ebdccd]/50 hover:bg-[#ebdccd]/70 text-[#1c1a17] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1f5f3d] hover:bg-[#15462b] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {isEditingBulletin ? 'Actualizar Boletín' : 'Publicar Documento'}
            </button>
          </div>
        </form>
      )}

      {/* List of bulletins */}
      <div className="bg-white border border-[#ebdccd]/60 rounded-3xl overflow-hidden shadow-xs">
        {bulletins.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5c544b]">
            No hay boletines listados en data-store.json
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#ebdccd]/15 text-[10px] font-bold uppercase tracking-wider text-[#5c544b] border-b border-[#ebdccd]/30">
                  <th className="py-4 px-6">Edición / N°</th>
                  <th className="py-4 px-6">Título del Boletín</th>
                  <th className="py-4 px-6">Fecha Publicado</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6">Resumen Ejecutivo</th>
                  <th className="py-4 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebdccd]/30 text-xs text-[#1c1a17]">
                {bulletins.map((bull) => (
                  <tr key={bull.id} className="hover:bg-[#fbfaf7]">
                    <td className="py-4 px-6 font-bold">{bull.issueNumber}</td>
                    <td className="py-4 px-6 font-semibold text-[#1f5f3d]">{bull.title}</td>
                    <td className="py-4 px-6 text-[#5c544b]">{bull.publishDate}</td>
                    <td className="py-4 px-6">
                      {bull.status === 'draft' ? (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide border border-amber-200">
                          Borrador
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide border border-emerald-200">
                          Publicado
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#5c544b] truncate max-w-xs">
                      {bull.summary}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => startEditBulletin(bull)}
                          title="Editar Boletín"
                          className="p-2 rounded-lg border border-[#ebdccd]/60 bg-white hover:bg-emerald-50 text-emerald-700 hover:border-emerald-200 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBulletin(bull.id, bull.title)}
                          title="Eliminar Boletín"
                          className="p-2 rounded-lg border border-[#ebdccd]/60 bg-white hover:bg-rose-50 text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
