import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, X, BookOpen, Edit2, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

interface AdminProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  loadAllAdminData: () => Promise<void>;
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

export default function AdminProjects({
  projects,
  setProjects,
  loadAllAdminData,
  adminFetch
}: AdminProjectsProps) {
  const showStatus = (text: string, type: 'success' | 'error') => {
    toast[type](text);
  };

  // Project Editing / Creating States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Project Form States
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<
    'Educación' | 'Medio Ambiente' | 'Adulto Mayor' | 'Desarrollo'
  >('Medio Ambiente');
  const [formRegion, setFormRegion] = useState<'Andino' | 'Valles' | 'Amazonia' | 'Chaco'>(
    'Andino'
  );
  const [formArea, setFormArea] = useState<
    'Educación' | 'Medio Ambiente' | 'Productivo' | 'Intergeneracional'
  >('Medio Ambiente');
  const [formDescription, setFormDescription] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formGoal, setFormGoal] = useState<number>(10000);
  const [formRaised, setFormRaised] = useState<number>(0);
  const [formLocation, setFormLocation] = useState('Cochabamba, Bolivia');
  const [formImpact, setFormImpact] = useState('');
  const [formImage, setFormImage] = useState('');

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('Medio Ambiente');
    setFormRegion('Valles');
    setFormArea('Medio Ambiente');
    setFormDescription('');
    setFormDetails('');
    setFormGoal(10000);
    setFormRaised(0);
    setFormLocation('Cochabamba, Bolivia');
    setFormImpact('');
    setFormImage('');
    setIsEditing(false);
    setEditingProjectId(null);
    setIsCreating(false);
  };

  const selectForEdit = (proj: Project) => {
    resetForm();
    setIsEditing(true);
    setEditingProjectId(proj.id);
    setFormTitle(proj.title);
    setFormCategory(proj.category as any);
    setFormRegion((proj.region as any) || 'Valles');
    setFormArea((proj.area as any) || 'Medio Ambiente');
    setFormDescription(proj.description || '');
    setFormDetails(proj.details || '');
    setFormGoal(proj.goal);
    setFormRaised(proj.raised);
    setFormLocation(proj.location || 'Cochabamba, Bolivia');
    setFormImpact(proj.impact || '');
    setFormImage(proj.image || '');
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    try {
      const response = await api.post('/api/projects', {
        title: formTitle,
        category: formCategory,
        region: formRegion,
        area: formArea,
        description: formDescription,
        details: formDetails || formDescription,
        goal: formGoal,
        location: formLocation,
        impact: formImpact,
        image: cleanGoogleDriveUrl(formImage),
      });

      if (response.success) {
        showStatus('Proyecto creado con éxito.', 'success');
        resetForm();
        loadAllAdminData();
      } else {
        showStatus(response.error || 'Error al guardar el proyecto.', 'error');
      }
    } catch (err) {
      showStatus('Fallo de red al intentar crear el proyecto.', 'error');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProjectId) return;

    const previousProjects = [...projects];
    const payload = {
      title: formTitle,
      category: formCategory,
      region: formRegion,
      area: formArea,
      description: formDescription,
      details: formDetails,
      goal: formGoal,
      raised: formRaised,
      location: formLocation,
      impact: formImpact,
      image: cleanGoogleDriveUrl(formImage),
    };

    setProjects((prev) => prev.map((p) => (p.id === editingProjectId ? { ...p, ...payload } : p)));
    showStatus('Actualizando proyecto...', 'success');
    resetForm();

    try {
      const response = await api.put(`/api/projects/${editingProjectId}`, payload);

      if (response.success) {
        showStatus('Proyecto actualizado correctamente.', 'success');
        loadAllAdminData();
      } else {
        setProjects(previousProjects);
        showStatus(response.error || 'Error al modificar el proyecto.', 'error');
      }
    } catch (err) {
      setProjects(previousProjects);
      showStatus('Fallo en la comunicación con el servidor.', 'error');
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (
      !window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el proyecto "${name}"?`)
    ) {
      return;
    }

    const previousProjects = [...projects];
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showStatus('Eliminando proyecto...', 'success');

    try {
      const response = await adminFetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showStatus('Proyecto eliminado con éxito.', 'success');
        loadAllAdminData();
      } else {
        setProjects(previousProjects);
        showStatus('Error de rechazo al eliminar proyecto.', 'error');
      }
    } catch (err) {
      setProjects(previousProjects);
      showStatus('Error de red al intentar eliminar.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header row to trigger "Add project" form */}
      <div className="flex justify-between items-center bg-[#ebdccd]/15 p-4 rounded-2xl border border-[#ebdccd]/35">
        <p className="text-xs text-[#5c544b] font-medium">
          Haga clic en un proyecto existente para editarlo de manera inmediata, o añada una
          nueva campaña.
        </p>
        {!isCreating && !isEditing && (
          <button
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
            className="bg-[#1f5f3d] text-white hover:bg-[#15432b] text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Añadir Proyecto
          </button>
        )}
      </div>

      {/* Create or Edit Form Box */}
      {(isCreating || isEditing) && (
        <div className="bg-[#fcfbf9] border-2 border-[#1f5f3d]/30 rounded-3xl p-6 sm:p-8 shadow-md relative space-y-6">
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 text-[#5c544b] hover:text-[#1c1a17]"
          >
            <X className="h-5 w-5" />
          </button>

          <h4 className="font-display text-lg font-bold text-[#1c1a17] flex items-center gap-1.5">
            <BookOpen className="h-5 w-5 text-[#1f5f3d]" />
            {isEditing ? 'Editar Detalles del Proyecto' : 'Crear Nueva Campaña VOSERDEM'}
          </h4>

          <form
            onSubmit={isEditing ? handleUpdateProject : handleCreateProject}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                  Título del Proyecto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Bosque Tunari Protegido"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-[#1f5f3d]/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                  Categoría
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none"
                >
                  <option value="Medio Ambiente">Medio Ambiente</option>
                  <option value="Adulto Mayor">Adulto Mayor</option>
                  <option value="Educación">Educación</option>
                  <option value="Desarrollo">Desarrollo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                  Ubicación Geográfica
                </label>
                <input
                  type="text"
                  placeholder="Ej. Cochabamba, Bolivia"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none animate-fade-in"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                  Región Geográfica (Bolivia)
                </label>
                <select
                  value={formRegion}
                  onChange={(e) => setFormRegion(e.target.value as any)}
                  className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none"
                >
                  <option value="Altiplano">Altiplano</option>
                  <option value="Valles">Valles</option>
                  <option value="Oriente">Oriente</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Amazonia">Amazonía</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                  Área de Acción
                </label>
                <select
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value as any)}
                  className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none"
                >
                  <option value="Medio Ambiente">Medio Ambiente</option>
                  <option value="Educación">Educación</option>
                  <option value="Productivo">Desarrollo Productivo</option>
                  <option value="Intergeneracional">Intergeneracional</option>
                  <option value="Institucional">Fortalecimiento Institucional</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                Descripción Corta (Mostrada en tarjetas)
              </label>
              <textarea
                required
                rows={2}
                placeholder="Resumen breve del proyecto..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-[#1f5f3d]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                Detalles Completos (Opcional - Usado en la página del proyecto)
              </label>
              <textarea
                rows={5}
                placeholder="Descripción extensa, contexto, y metas a largo plazo..."
                value={formDetails}
                onChange={(e) => setFormDetails(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-[#1f5f3d]/20 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                  Meta de Recaudación (Bs.)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formGoal}
                  onChange={(e) => setFormGoal(Number(e.target.value))}
                  className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-[#1f5f3d]/20 focus:outline-none"
                />
              </div>

              {isEditing && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                    Total Recaudado (Bs.)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formRaised}
                    onChange={(e) => setFormRaised(Number(e.target.value))}
                    className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-[#1f5f3d]/20 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                Resultados / Impacto Esperado
              </label>
              <input
                type="text"
                placeholder="Ej. 500 árboles plantados, 120 familias beneficiadas"
                value={formImpact}
                onChange={(e) => setFormImpact(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                URL de Imagen (Google Drive o Web)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-[#1f5f3d]/20 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-[#ebdccd] flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-bold text-[#5c544b] hover:bg-[#ebdccd]/30 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#1f5f3d] text-white hover:bg-[#15432b] text-xs font-bold py-2 px-6 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Proyecto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Master Table of projects */}
      <div className="bg-white rounded-3xl border border-[#ebdccd]/50 shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#fcfbf9] border-b border-[#ebdccd]/50">
                <th className="py-4 px-5 text-[10px] font-extrabold uppercase tracking-widest text-[#5c544b]">
                  Proyecto
                </th>
                <th className="py-4 px-5 text-[10px] font-extrabold uppercase tracking-widest text-[#5c544b]">
                  Progreso (Bs)
                </th>
                <th className="py-4 px-5 text-[10px] font-extrabold uppercase tracking-widest text-[#5c544b]">
                  Ubicación
                </th>
                <th className="py-4 px-5 text-[10px] font-extrabold uppercase tracking-widest text-[#5c544b] text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdccd]/30">
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-[#8c847b]">
                    No hay proyectos registrados. Crea uno nuevo para comenzar.
                  </td>
                </tr>
              )}
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-[#fcfbf9]/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      {proj.image ? (
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-10 h-10 rounded-lg object-cover border border-[#ebdccd]/50 shadow-xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#ebdccd]/30 flex items-center justify-center border border-[#ebdccd]/50">
                          <BookOpen className="w-4 h-4 text-[#8c847b]" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-[#1c1a17] leading-tight mb-0.5">
                          {proj.title}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f3d]">
                          {proj.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="w-full max-w-[120px]">
                      <div className="flex justify-between text-[10px] font-bold mb-1.5">
                        <span className="text-[#1c1a17]">{proj.raised?.toLocaleString()} Bs</span>
                        <span className="text-[#8c847b]">/ {proj.goal?.toLocaleString()} Bs</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#ebdccd]/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1f5f3d] rounded-full"
                          style={{
                            width: `${Math.min(((proj.raised || 0) / (proj.goal || 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-xs text-[#5c544b] font-medium flex items-center gap-1.5 mt-2">
                    <MapPin className="h-3.5 w-3.5 text-[#1f5f3d]/60" />
                    {proj.location || 'Bolivia'}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => selectForEdit(proj)}
                        title="Editar"
                        className="p-1.5 rounded-lg border border-[#ebdccd]/60 bg-white hover:bg-[#fcfbf9] text-[#1c1a17] hover:border-[#ebdccd] transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        title="Eliminar"
                        className="p-1.5 rounded-lg border border-[#ebdccd]/60 bg-white hover:bg-rose-50 text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
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
      </div>
    </div>
  );
}
