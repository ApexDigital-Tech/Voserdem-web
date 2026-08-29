import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  MoveUp,
  MoveDown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface PageBlock {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  body: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  sortOrder: number;
  isActive: boolean;
}

const PAGES = [
  { id: 'nuestra-obra', name: 'Nuestra Obra' },
  { id: 'impacto-territorial', name: 'Impacto Territorial' },
  { id: 'programas', name: 'Programas' },
  { id: 'blog', name: 'Blog (Intro)' },
  { id: 'como-ayudar', name: 'Cómo Ayudar' },
  { id: 'contacto', name: 'Contacto' },
];

export default function AdminPagesManager() {
  const [activePage, setActivePage] = useState<string>(PAGES[0].id);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );

  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPageBlocks(activePage);
  }, [activePage]);

  const loadPageBlocks = async (pageId: string) => {
    setLoading(true);
    try {
      const res = await api.get<PageBlock[]>(`/api/pages/${pageId}`);
      if (res.success && res.data) {
        setBlocks(res.data);
      } else {
        setBlocks([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBlocks = async (newBlocks: PageBlock[]) => {
    setSaving(true);
    try {
      const res = await api.put(`/api/pages/${activePage}`, { blocks: newBlocks });

      if (res.success) {
        setBlocks(newBlocks);
        setStatusMsg({ text: 'Página guardada exitosamente.', type: 'success' });
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        throw new Error('Error al guardar');
      }
    } catch (err) {
      setStatusMsg({ text: 'Error al guardar los bloques.', type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const openNewBlock = () => {
    setEditingBlock({
      id: `block-${Date.now()}`,
      sectionKey: `section-${blocks.length + 1}`,
      title: '',
      subtitle: '',
      body: '',
      imageUrl: '',
      ctaLabel: '',
      ctaUrl: '',
      sortOrder: blocks.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const saveEditingBlock = () => {
    if (!editingBlock) return;
    let newBlocks = [...blocks];
    const idx = newBlocks.findIndex((b) => b.id === editingBlock.id);
    if (idx >= 0) {
      newBlocks[idx] = editingBlock;
    } else {
      newBlocks.push(editingBlock);
    }
    newBlocks.sort((a, b) => a.sortOrder - b.sortOrder);
    handleSaveBlocks(newBlocks);
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const deleteBlock = (id: string) => {
    if (confirm('¿Eliminar este bloque? Esta acción no se puede deshacer.')) {
      const newBlocks = blocks.filter((b) => b.id !== id);
      handleSaveBlocks(newBlocks);
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    const tempOrder = newBlocks[index].sortOrder;
    newBlocks[index].sortOrder = newBlocks[targetIndex].sortOrder;
    newBlocks[targetIndex].sortOrder = tempOrder;

    newBlocks.sort((a, b) => a.sortOrder - b.sortOrder);
    handleSaveBlocks(newBlocks);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-[#1B3022]">Gestión de Páginas</h2>
          <p className="text-sm text-[#2C2C2C] font-sans mt-1">
            Administra el contenido por bloques para las 6 páginas públicas clave.
          </p>
        </div>
        <button
          onClick={openNewBlock}
          className="flex items-center gap-2 bg-[#1B3022] text-[#F5F2ED] px-4 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider hover:bg-[#1B3022]/90 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Añadir Bloque
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-[4px] flex items-center gap-2 text-sm font-bold ${statusMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {statusMsg.text}
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#C5A059]/30 pb-2">
        {PAGES.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`px-4 py-2 rounded-t-[4px] text-xs font-bold transition-colors cursor-pointer ${activePage === page.id ? 'bg-[#1B3022] text-[#F5F2ED]' : 'bg-[#C5A059]/10 text-[#2C2C2C] hover:bg-[#C5A059]/20'}`}
          >
            {page.name}
          </button>
        ))}
      </div>

      {/* Blocks List */}
      <div className="bg-white border border-[#C5A059]/30 rounded-[8px] p-6 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3022]"></div>
          </div>
        ) : blocks.length === 0 ? (
          <div className="text-center py-12 text-[#2C2C2C]/60 text-sm">
            No hay bloques configurados para esta página. Añade el primero.
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className={`border ${block.isActive ? 'border-[#C5A059]/40 bg-[#FCF9F8]' : 'border-gray-200 bg-gray-50 opacity-75'} rounded-[8px] p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center`}
              >
                <div className="flex-grow space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#1B3022] text-[#F5F2ED] px-2 py-0.5 rounded font-bold uppercase">
                      {block.sectionKey}
                    </span>
                    <h3 className="font-bold text-[#1B3022]">{block.title || 'Sin Título'}</h3>
                    {!block.isActive && (
                      <span className="text-[10px] text-red-600 border border-red-200 bg-red-50 px-2 py-0.5 rounded">
                        Inactivo
                      </span>
                    )}
                  </div>
                  {block.subtitle && (
                    <p className="text-xs text-[#C5A059] font-bold">{block.subtitle}</p>
                  )}
                  {block.body && (
                    <p className="text-xs text-[#2C2C2C] line-clamp-1">{block.body}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 md:ml-auto">
                  <button
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-2 text-[#2C2C2C] hover:text-[#1B3022] disabled:opacity-30 cursor-pointer"
                  >
                    <MoveUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-2 text-[#2C2C2C] hover:text-[#1B3022] disabled:opacity-30 cursor-pointer"
                  >
                    <MoveDown className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-[#C5A059]/30 mx-1"></div>
                  <button
                    onClick={() => {
                      setEditingBlock(block);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingBlock && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#C5A059]/40 shadow-xl">
            <div className="p-6 border-b border-[#C5A059]/20 flex justify-between items-center bg-[#FCF9F8] sticky top-0 z-10">
              <h3 className="font-display font-black text-xl text-[#1B3022]">Editar Bloque</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#2C2C2C] hover:text-red-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-[#2C2C2C] uppercase tracking-wider mb-1">
                    Clave de Sección (ID)
                  </label>
                  <input
                    type="text"
                    value={editingBlock.sectionKey}
                    onChange={(e) =>
                      setEditingBlock({ ...editingBlock, sectionKey: e.target.value })
                    }
                    className="w-full text-sm border border-[#C5A059]/30 rounded p-2 outline-none focus:border-[#1B3022]"
                    placeholder="ej: hero-principal"
                  />
                </div>
                <div className="col-span-2 md:col-span-1 flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingBlock.isActive}
                      onChange={(e) =>
                        setEditingBlock({ ...editingBlock, isActive: e.target.checked })
                      }
                      className="rounded text-[#1B3022] focus:ring-[#1B3022]"
                    />
                    <span className="text-sm font-bold text-[#1B3022]">
                      Bloque Activo (Visible)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#2C2C2C] uppercase tracking-wider mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={editingBlock.title}
                  onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                  className="w-full text-sm border border-[#C5A059]/30 rounded p-2 outline-none focus:border-[#1B3022]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#2C2C2C] uppercase tracking-wider mb-1">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={editingBlock.subtitle}
                  onChange={(e) => setEditingBlock({ ...editingBlock, subtitle: e.target.value })}
                  className="w-full text-sm border border-[#C5A059]/30 rounded p-2 outline-none focus:border-[#1B3022]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#2C2C2C] uppercase tracking-wider mb-1">
                  Texto Principal
                </label>
                <textarea
                  rows={4}
                  value={editingBlock.body}
                  onChange={(e) => setEditingBlock({ ...editingBlock, body: e.target.value })}
                  className="w-full text-sm border border-[#C5A059]/30 rounded p-2 outline-none focus:border-[#1B3022]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#2C2C2C] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" /> URL de Imagen
                </label>
                <input
                  type="text"
                  value={editingBlock.imageUrl}
                  onChange={(e) => setEditingBlock({ ...editingBlock, imageUrl: e.target.value })}
                  className="w-full text-sm border border-[#C5A059]/30 rounded p-2 outline-none focus:border-[#1B3022]"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2C2C] uppercase tracking-wider mb-1">
                    Texto Botón (CTA)
                  </label>
                  <input
                    type="text"
                    value={editingBlock.ctaLabel}
                    onChange={(e) => setEditingBlock({ ...editingBlock, ctaLabel: e.target.value })}
                    className="w-full text-sm border border-[#C5A059]/30 rounded p-2 outline-none focus:border-[#1B3022]"
                    placeholder="ej: Saber más"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2C2C2C] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" /> URL Botón
                  </label>
                  <input
                    type="text"
                    value={editingBlock.ctaUrl}
                    onChange={(e) => setEditingBlock({ ...editingBlock, ctaUrl: e.target.value })}
                    className="w-full text-sm border border-[#C5A059]/30 rounded p-2 outline-none focus:border-[#1B3022]"
                    placeholder="/contacto"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#C5A059]/20 bg-[#FCF9F8] flex justify-end gap-3 sticky bottom-0 z-10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded text-sm font-bold text-[#2C2C2C] hover:bg-gray-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={saveEditingBlock}
                disabled={saving}
                className="px-4 py-2 rounded text-sm font-bold bg-[#1B3022] text-[#F5F2ED] flex items-center gap-2 hover:bg-[#1B3022]/90 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" /> Guardar Bloque
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
