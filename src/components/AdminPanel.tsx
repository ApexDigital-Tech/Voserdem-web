import React, { useState, useEffect, Suspense, lazy } from 'react';
import toast from 'react-hot-toast';
import {
  Project,
  Donation,
  Message,
  BlogPost,
  Bulletin,
  Subscriber,
  CarouselSlide,
} from '../types';
import {
  ShieldAlert,
  Landmark,
  Mail,
  BookOpen,
  Key,
  Plus,
  Trash2,
  Edit2,
  Database,
  RefreshCw,
  Layers,
  DollarSign,
  ArrowRight,
  CheckSquare,
  Sparkles,
  MapPin,
  FileText,
  Users,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

// Lazy loaded Admin Modules (Code-Splitting)
const AdminPagesManager = lazy(() => import('./AdminPagesManager'));
const AdminImpacto = lazy(() => import('./AdminImpacto'));
const AdminDonations = lazy(() => import('./AdminDonations'));
const AdminBulletins = lazy(() => import('./AdminBulletins'));
const AdminCarousel = lazy(() => import('./AdminCarousel'));
const AdminAbout = lazy(() => import('./AdminAbout'));
const AdminProjects = lazy(() => import('./AdminProjects'));

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('voserdem_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin Sub-Tab
  const [adminSubTab, setAdminSubTab] = useState<
    | 'projects'
    | 'donations'
    | 'messages'
    | 'blog'
    | 'bulletins'
    | 'subscribers'
    | 'about_config'
    | 'pages_config'
    | 'impacto_config'
    | 'carousel_config'
    | 'logo_config'
  >('projects');

  // Loaded Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // Carousel & Logos Configurations States
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
  const [logoColorBrandName, setLogoColorBrandName] = useState('VOSERDEM');
  const [logoColorSlogan, setLogoColorSlogan] = useState('Voluntarios al Servicio de los Demás');
  const [logoColorUseCustomImage, setLogoColorUseCustomImage] = useState(false);
  const [logoColorImageUrl, setLogoColorImageUrl] = useState('');

  const [logoGoldBrandName, setLogoGoldBrandName] = useState('VOSERDEM');
  const [logoGoldSlogan, setLogoGoldSlogan] = useState('Una Bolivia mejor es posible');
  const [logoGoldUseCustomImage, setLogoGoldUseCustomImage] = useState(false);
  const [logoGoldImageUrl, setLogoGoldImageUrl] = useState('');

  // Loading / Error
  const [loading, setLoading] = useState<boolean>(false);

  const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || '';

  const adminFetch = (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    headers.set('x-admin-password', ADMIN_PASSKEY);
    return fetch(url, { ...options, headers });
  };

  // Blog Form States
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState<
    'Ecología' | 'Comunidad' | 'Adulto Mayor' | 'Institucional'
  >('Ecología');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('3 min');
  const [blogFeatured, setBlogFeatured] = useState(false);
  const [blogStatus, setBlogStatus] = useState<'draft' | 'published'>('published');

  const resetBlogForm = () => {
    setBlogTitle('');
    setBlogCategory('Ecología');
    setBlogSummary('');
    setBlogContent('');
    setBlogImage('');
    setBlogAuthor('');
    setBlogReadTime('3 min');
    setBlogFeatured(false);
    setBlogStatus('published');
    setIsCreatingBlog(false);
    setIsEditingBlog(false);
    setEditingBlogId(null);
  };

  const startEditBlogPost = (post: BlogPost) => {
    setBlogTitle(post.title || '');
    setBlogCategory(post.category || 'Ecología');
    setBlogSummary(post.summary || '');
    setBlogContent(post.content || '');
    setBlogImage(post.image || '');
    setBlogAuthor(post.author || '');
    setBlogReadTime(post.readTime || '3 min');
    setBlogFeatured(!!post.featured);
    setBlogStatus(post.status || 'published');

    setIsEditingBlog(true);
    setEditingBlogId(post.id);
    setIsCreatingBlog(true);
  };


  const handleCreateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim() || !blogAuthor.trim()) {
      showStatus('Por favor, rellene todos los campos requeridos para el blog.', 'error');
      return;
    }

    const previousBlogPosts = [...blogPosts];
    const payload = {
      title: blogTitle,
      category: blogCategory,
      summary: blogSummary,
      content: blogContent,
      image: cleanGoogleDriveUrl(blogImage),
      author: blogAuthor,
      readTime: blogReadTime,
      featured: blogFeatured,
      status: blogStatus,
    };
    const optimisticPost: any = {
      ...payload,
      id: isEditingBlog ? editingBlogId! : `temp-${Date.now()}`,
    };
    setBlogPosts((prev) =>
      isEditingBlog
        ? prev.map((p) => (p.id === editingBlogId ? { ...p, ...payload } : p))
        : [optimisticPost, ...prev]
    );
    showStatus('Guardando cambios...', 'success');
    resetBlogForm();

    try {
      const url = isEditingBlog ? `/api/blog/${editingBlogId}` : '/api/blog';
      const res = await (isEditingBlog ? api.put(url, payload) : api.post(url, payload));

      if (res.success) {
        showStatus(
          isEditingBlog
            ? 'Artículo del blog actualizado con éxito.'
            : 'Artículo del blog creado con éxito.',
          'success'
        );
        loadAllAdminData();
      } else {
        setBlogPosts(previousBlogPosts);
        showStatus(res.error || 'Error al guardar el artículo.', 'error');
      }
    } catch (err) {
      setBlogPosts(previousBlogPosts);
      showStatus('Fallo de red al intentar guardar.', 'error');
    }
  };

  const handleDeleteBlogPost = async (id: string, name: string) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar permanentemente la publicación "${name}"?`
      )
    ) {
      return;
    }

    const previousBlogPosts = [...blogPosts];
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    showStatus('Eliminando publicación...', 'success');

    try {
      const res = await adminFetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showStatus('Publicación eliminada con éxito del blog.', 'success');
        loadAllAdminData();
      } else {
        setBlogPosts(previousBlogPosts);
        showStatus('Error al eliminar artículo.', 'error');
      }
    } catch (err) {
      setBlogPosts(previousBlogPosts);
      showStatus('Error de red al intentar eliminar.', 'error');
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (
      !window.confirm(
        `¿Desea desvincular y eliminar permanentemente el correo electrónico "${email}"?`
      )
    ) {
      return;
    }

    try {
      const res = await adminFetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showStatus('Suscriptor removido con éxito.', 'success');
        loadAllAdminData();
      } else {
        showStatus('Error al intentar remover suscriptor.', 'error');
      }
    } catch (err) {
      showStatus('Error de red al eliminar suscriptor.', 'error');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSKEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('voserdem_admin_auth', 'true');
      setLoginError(null);
      loadAllAdminData();
    } else {
      setLoginError('Contraseña incorrecta. Intente de nuevo.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('voserdem_admin_auth');
    setPasswordInput('');
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [projRes, donRes, msgRes, blogRes, bullRes, subRes, carouselRes, logosRes] =
        await Promise.all([
          api.get<any>('/api/projects'),
          api.get<any>('/api/donations'),
          api.get<any>('/api/messages'),
          api.get<any>('/api/blog?status=all'),
          api.get<any>('/api/bulletins?status=all'),
          api.get<any>('/api/subscribers'),
          api.get<any>('/api/carousel'),
          api.get<any>('/api/logos'),
        ]);

      if (projRes.success && projRes.data) setProjects(projRes.data);
      if (donRes.success && donRes.data) setDonations(donRes.data);
      if (msgRes.success && msgRes.data) setMessages(msgRes.data);
      if (blogRes.success && blogRes.data) setBlogPosts(blogRes.data);
      if (bullRes.success && bullRes.data) setBulletins(bullRes.data);
      if (subRes.success && subRes.data) setSubscribers(subRes.data);
      if (carouselRes.success && carouselRes.data) {
        setCarouselSlides(carouselRes.data);
      }
      if (logosRes.success && logosRes.data) {
        const logoData = logosRes.data;
        if (logoData.logoColor) {
          setLogoColorBrandName(logoData.logoColor.brandName || 'VOSERDEM');
          setLogoColorSlogan(logoData.logoColor.slogan || 'Voluntarios al Servicio de los Demás');
          setLogoColorUseCustomImage(!!logoData.logoColor.useCustomImage);
          setLogoColorImageUrl(logoData.logoColor.imageUrl || '');
        }
        if (logoData.logoGold) {
          setLogoGoldBrandName(logoData.logoGold.brandName || 'VOSERDEM');
          setLogoGoldSlogan(logoData.logoGold.slogan || 'Una Bolivia mejor es posible');
          setLogoGoldUseCustomImage(!!logoData.logoGold.useCustomImage);
          setLogoGoldImageUrl(logoData.logoGold.imageUrl || '');
        }
      }
    } catch (err) {
      console.error('Error fetching admin data logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLogos = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminFetch('/api/logos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoColor: {
            brandName: logoColorBrandName,
            slogan: logoColorSlogan,
            useCustomImage: logoColorUseCustomImage,
            // Save original URL — cleanGoogleDriveUrl runs only at render time in VoserdemLogo
            imageUrl: logoColorImageUrl,
          },
          logoGold: {
            brandName: logoGoldBrandName,
            slogan: logoGoldSlogan,
            useCustomImage: logoGoldUseCustomImage,
            // Save original URL — cleanGoogleDriveUrl runs only at render time in VoserdemLogo
            imageUrl: logoGoldImageUrl,
          },
        }),
      });

      if (res.ok) {
        showStatus('Configuración de logos guardada con éxito.', 'success');
        // Dispatch custom event to notify all logo elements to re-fetch
        window.dispatchEvent(new CustomEvent('logo-updated'));
        loadAllAdminData();
      } else {
        const err = await res.json();
        showStatus(err.error || 'Error al intentar actualizar los logos.', 'error');
      }
    } catch (err) {
      showStatus('Error de red al intentar guardar los cambios de logos y branding.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllAdminData();
    }
  }, [isAuthenticated]);

  const handleResetDatabase = async () => {
    const userInput = window.prompt(
      'ATENCIÓN PELIGRO: Esto restaurará los proyectos iniciales y borrará TODAS las donaciones, mensajes, blogs y configuraciones actuales de la base de datos de producción.\n\nPara confirmar esta acción destructiva, escribe "CONFIRMAR" en mayúsculas:'
    );

    if (userInput !== 'CONFIRMAR') {
      showStatus('Operación de restauración cancelada. No se realizaron cambios.', 'success');
      return;
    }

    try {
      const response = await api.post('/api/admin/reset');
      if (response.success) {
        showStatus('Base de datos restaurada correctamente.', 'success');
        loadAllAdminData();
        
      }
    } catch (err) {
      showStatus('Error de red al intentar restaurar.', 'error');
    }
  };

  const showStatus = (text: string, type: 'success' | 'error') => {
    toast[type](text);
  };

  // Login Gate View
  if (!isAuthenticated) {
    return (
      <div className="py-24 max-w-md mx-auto px-4">
        <div className="bg-[#fcfbf9] border border-[#ebdccd]/80 rounded-3xl p-8 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-[#1f5f3d]/10 text-[#1f5f3d] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-extrabold text-[#1c1a17]">
              Portal de Administración
            </h2>
            <p className="text-xs text-[#5c544b]">
              Reservado para directores, coordinadores de VOSERDEM Bolivia y evaluadores del
              sistema.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4e4842] flex items-center gap-1">
                <Key className="h-3.5 w-3.5 text-[#d95c2b]" />
                Ingrese Contraseña de Acceso
              </label>
              <input
                type="password"
                required
                placeholder="Introduzca la clave..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-white border border-[#ebdccd] rounded-xl py-3 px-4 text-sm text-[#1c1a17] focus:outline-none focus:ring-2 focus:ring-[#1f5f3d]/20 transition-all"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-xs leading-relaxed">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1c1a17] hover:bg-[#2b2723] text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Autenticar Credenciales
            </button>
          </form>

          {/* Test Notice Helper */}
          <div className="bg-[#faf7f2] border border-[#ebdccd]/45 p-4 rounded-xl text-xs text-left text-[#5c544b] space-y-1">
            <p className="font-bold text-[#1f5f3d] flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Acceso Administrativo:
            </p>
            <p>
              Utilice la credencial proporcionada por el equipo de TI para desbloquear y acceder al sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Main View
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Title Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#ebdccd]/50">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1f5f3d]">
            <CheckSquare className="h-4 w-4" />
            VOSERDEM Core Engine Active
          </div>
          <h2 className="font-display text-3xl font-extrabold text-[#1c1a17] mt-0.5">
            Consola Operativa Global
          </h2>
          <p className="text-xs text-[#5c544b] mt-0.5">
            Gestión en tiempo real de iniciativas ecológicas, donaciones y mensajería en Cochabamba,
            Bolivia.
          </p>
        </div>

        {/* Database Management Tools */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={loadAllAdminData}
            className="bg-white hover:bg-[#ebdccd]/20 text-[#4e4842] border border-[#ebdccd] text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Sincronizar
          </button>
          <button
            onClick={handleResetDatabase}
            className="bg-transparent hover:bg-rose-50 text-[#a39c93] hover:text-rose-700 border border-transparent hover:border-rose-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100"
            title="Peligro: Restablecimiento de Base de Datos"
          >
            <Database className="h-4 w-4" />
            Restaurar Valores por Defecto
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-[#1c1a17] hover:bg-[#282420] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Summary Stat Widget Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#fcfbf9] border border-[#ebdccd]/60 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-emerald-500/10 text-emerald-700 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5c544b]">
              Iniciativas del Hub
            </span>
            <h4 className="text-2xl font-extrabold text-[#1c1a17] leading-tight">
              {projects.length}
            </h4>
          </div>
        </div>

        <div className="bg-[#fcfbf9] border border-[#ebdccd]/60 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-amber-500/10 text-amber-700 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5c544b]">
              Total Donaciones
            </span>
            <h4 className="text-2xl font-extrabold text-[#1c1a17] leading-tight">
              ${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()} USD
            </h4>
          </div>
        </div>

        <div className="bg-[#fcfbf9] border border-[#ebdccd]/60 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-indigo-500/10 text-indigo-700 rounded-xl">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5c544b]">
              Buzón de Mensajes
            </span>
            <h4 className="text-2xl font-extrabold text-[#1c1a17] leading-tight">
              {messages.length} recibidos
            </h4>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap border-b border-[#ebdccd]/40">
        {[
          { id: 'projects', label: 'Proyectos Dinámicos', icon: Layers },
          { id: 'donations', label: 'Auditoría de Donaciones', icon: DollarSign },
          { id: 'messages', label: 'Buzón de Mensajes', icon: Mail },
          { id: 'blog', label: 'Portal del Blog', icon: BookOpen },
          { id: 'bulletins', label: 'Publicar Boletines', icon: FileText },
          { id: 'subscribers', label: 'Suscriptores', icon: Users },
          { id: 'pages_config', label: 'Gestión de Páginas', icon: Layers },
          { id: 'impacto_config', label: 'Impacto Territorial', icon: MapPin },
          { id: 'about_config', label: 'Gestión Sobre Nosotros', icon: Compass },
          { id: 'carousel_config', label: 'Carrusel de Portada (5 Fotos)', icon: Sparkles },
          { id: 'logo_config', label: 'Branding & Logos corporativos', icon: Landmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = adminSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setAdminSubTab(tab.id as any);
                
              }}
              className={`flex items-center gap-1.5 py-3 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#1f5f3d] text-[#1f5f3d]'
                  : 'border-transparent text-[#5c544b] hover:text-[#1c1a17]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: PROJECTS MANAGEMENT */}
      <Suspense fallback={<div className="py-24 text-center animate-pulse text-[#5c544b] font-medium text-sm flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-[#1f5f3d] border-t-transparent rounded-full animate-spin"></div>Cargando módulo...</div>}>
        {adminSubTab === 'projects' && (
          <AdminProjects 
            projects={projects} 
            setProjects={setProjects} 
            loadAllAdminData={loadAllAdminData} 
            adminFetch={adminFetch} 
          />
        )}
        {/* TAB CONTENT: AUDITED DONATIONS */}
        {adminSubTab === 'donations' && (
          <AdminDonations donations={donations} />
        )}

        {/* TAB CONTENT: CONTACT MAILBOX CHAT */}
        {adminSubTab === 'messages' && (
          <div className="space-y-6">
            {messages.length === 0 ? (
              <div className="bg-[#fcfbf9] border border-[#ebdccd]/65 p-12 rounded-3xl text-center text-[#5c544b]">
                No hay mensajes entrantes en el buzón de correo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-[#fcfbf9] border border-[#ebdccd]/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-[#1f5f3d]/40 transition-colors"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start border-b border-[#ebdccd]/35 pb-2">
                        <div>
                          <h4 className="font-bold text-[#1c1a17] text-sm">{msg.name}</h4>
                          <span className="text-[10px] text-[#5c544b] font-medium">{msg.email}</span>
                        </div>
                        <span className="text-[9px] font-mono text-[#5c544b] font-semibold bg-[#ebdccd]/30 px-2 py-0.5 rounded-md">
                          {new Date(msg.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-[#d95c2b] uppercase tracking-wide">
                          Asunto: {msg.subject}
                        </span>
                        <p className="text-xs text-[#4e4842] leading-relaxed whitespace-pre-line bg-[#ebdccd]/10 p-3 rounded-lg border border-[#ebdccd]/20">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <a
                        href={`mailto:${msg.email}?subject=Respuesta VOSERDEM: ${msg.subject}`}
                        className="text-[10px] text-[#1f5f3d] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline hover:translate-x-0.5 transition-all"
                      >
                        Responder por Correo
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: BLOG ARTICLES CRUD */}
        {adminSubTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#ebdccd]/15 p-4 rounded-2xl border border-[#ebdccd]/50">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1c1a17]">
                  Historias en el Blog de VOSERDEM
                </h3>
                <p className="text-xs text-[#5c544b]">
                  Restaura la voz de la comunidad publicando y editando vivencias reales de Bolivia.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingBlog(!isCreatingBlog)}
                className="bg-[#1f5f3d] hover:bg-[#15462b] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>{isCreatingBlog ? 'Cerrar Formulario' : 'Crear Artículo'}</span>
              </button>
            </div>

            {isCreatingBlog && (
              <form
                onSubmit={handleCreateBlogPost}
                className="bg-white border border-[#ebdccd]/55 rounded-3xl p-6 sm:p-8 space-y-4 animate-fade-in"
              >
                <h4 className="font-display font-bold text-base text-[#1c1a17] border-b border-[#ebdccd]/40 pb-2">
                  {isEditingBlog ? 'Editar Publicación' : 'Nueva Publicación'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      Título del Artículo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Nuevos viveros de queñua en Chocaya"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      Categoría *
                    </label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value as any)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-2 py-2 text-xs text-[#1c1a17]"
                    >
                      <option value="Ecología">Ecología</option>
                      <option value="Comunidad">Comunidad</option>
                      <option value="Adulto Mayor">Adulto Mayor</option>
                      <option value="Institucional">Institucional</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      Autor/a *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Lic. Clara Salazar, Trabajo Social"
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      Tiempo de lectura estimado
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 4 min"
                      value={blogReadTime}
                      onChange={(e) => setBlogReadTime(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      Estado de Publicación *
                    </label>
                    <select
                      value={blogStatus}
                      onChange={(e) => setBlogStatus(e.target.value as 'draft' | 'published')}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-2 py-2 text-xs text-[#1c1a17]"
                    >
                      <option value="published">🟢 Publicado (Visible en la web)</option>
                      <option value="draft">🟡 Borrador (Solo visible en administrador)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    URL de Imagen de Portada
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={blogImage}
                    onChange={(e) => setBlogImage(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Resumen Corto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Resumen breve de la publicación para tarjetas en la página principal..."
                    value={blogSummary}
                    onChange={(e) => setBlogSummary(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Cuerpo del Artículo *
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Escribe el artículo completo aquí..."
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl p-3 text-xs text-[#1c1a17]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="formFeatured"
                    checked={blogFeatured}
                    onChange={(e) => setBlogFeatured(e.target.checked)}
                    className="rounded text-[#1f5f3d] focus:ring-[#1f5f3d]"
                  />
                  <label
                    htmlFor="formFeatured"
                    className="text-xs font-semibold text-[#1c1a17] select-none"
                  >
                    Marcar este artículo como Destacado (aparecerá en la parte superior del Blog)
                  </label>
                </div>

                <div className="flex gap-2.5 justify-end">
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="px-5 py-2.5 bg-[#ebdccd]/50 hover:bg-[#ebdccd]/70 text-[#1c1a17] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1f5f3d] hover:bg-[#15462b] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {isEditingBlog ? 'Actualizar Artículo' : 'Guardar Publicación'}
                  </button>
                </div>
              </form>
            )}

            {/* List of articles */}
            <div className="bg-white border border-[#ebdccd]/60 rounded-3xl overflow-hidden shadow-xs">
              {blogPosts.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#5c544b]">
                  Aún no hay publicaciones en el blog registradas en data-store.json
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#ebdccd]/15 text-[10px] font-bold uppercase tracking-wider text-[#5c544b] border-b border-[#ebdccd]/30">
                        <th className="py-4 px-6">Título</th>
                        <th className="py-4 px-6">Categoría</th>
                        <th className="py-4 px-6">Fecha</th>
                        <th className="py-4 px-6">Autor / Redactor</th>
                        <th className="py-4 px-6">Estado</th>
                        <th className="py-4 px-6">Destacado</th>
                        <th className="py-4 px-6 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebdccd]/30 text-xs text-[#1c1a17]">
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-[#fbfaf7]">
                          <td className="py-4 px-6 font-bold truncate max-w-xs">{post.title}</td>
                          <td className="py-4 px-6 text-[#1f5f3d] font-semibold">{post.category}</td>
                          <td className="py-4 px-6 text-[#5c544b]">{post.date}</td>
                          <td className="py-4 px-6 italic text-[#4e4842]">{post.author}</td>
                          <td className="py-4 px-6">
                            {post.status === 'draft' ? (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide border border-amber-200">
                                Borrador
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide border border-emerald-200">
                                Publicado
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {post.featured ? (
                              <span className="bg-[#d95c2b]/10 text-[#d95c2b] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                                Sí
                              </span>
                            ) : (
                              <span className="text-[#8e897e] text-[9px]">No</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => startEditBlogPost(post)}
                                title="Editar Artículo"
                                className="p-2 rounded-lg border border-[#ebdccd]/60 bg-white hover:bg-emerald-50 text-emerald-700 hover:border-emerald-200 transition-colors cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlogPost(post.id, post.title)}
                                title="Eliminar del Blog"
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
        )}

        {/* TAB CONTENT: BULLETINS CRUD */}
        {adminSubTab === 'bulletins' && (
          <AdminBulletins 
            bulletins={bulletins} 
            loadAllAdminData={loadAllAdminData} 
            adminFetch={adminFetch} 
          />
        )}

        {/* TAB CONTENT: NEWSLETTER SUBSCRIBERS ROSTER */}
        {adminSubTab === 'subscribers' && (
          <div className="space-y-4">
            <div className="bg-[#ebdccd]/15 p-4 rounded-2xl border border-[#ebdccd]/50">
              <h3 className="font-display text-lg font-bold text-[#1c1a17]">
                Lista de Suscriptores Oficiales
              </h3>
              <p className="text-xs text-[#5c544b]">
                Útiles para campañas directas de mercadeo social, envío de memorias semestrales y
                boletines de transparencia civil.
              </p>
            </div>

            <div className="bg-white border border-[#ebdccd]/60 rounded-3xl overflow-hidden shadow-xs">
              {subscribers.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#5c544b]">
                  Por el momento no hay usuarios suscritos a las novedades de VOSERDEM.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#ebdccd]/15 text-[10px] font-bold uppercase tracking-wider text-[#5c544b] border-b border-[#ebdccd]/30">
                        <th className="py-4 px-6">N° de Fila</th>
                        <th className="py-4 px-6">Dirección de Correo Electrónico</th>
                        <th className="py-4 px-6">Fecha de Suscripción Registro</th>
                        <th className="py-4 px-6 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebdccd]/30 text-xs text-[#1c1a17]">
                      {subscribers.map((sub, idx) => (
                        <tr key={sub.id} className="hover:bg-[#fbfaf7]">
                          <td className="py-4 px-6 font-mono font-semibold text-[#8e897e]">
                            {idx + 1}
                          </td>
                          <td className="py-4 px-6 font-bold text-[#1c1a17]">{sub.email}</td>
                          <td className="py-4 px-6 text-[#5c544b] font-mono">
                            {new Date(sub.date).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                              title="Desinscribir Correo"
                              className="p-2 rounded-lg border border-[#ebdccd]/60 bg-white hover:bg-rose-50 text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: GESTIÓN DE PÁGINAS CMS */}
        {adminSubTab === 'pages_config' && (
          <div className="animate-fade-in">
            <AdminPagesManager />
          </div>
        )}

        {/* TAB CONTENT: IMPACTO TERRITORIAL */}
        {adminSubTab === 'impacto_config' && (
          <div className="animate-fade-in">
            <AdminImpacto />
          </div>
        )}

        {/* TAB CONTENT: ABOUT US CONFIGURATION & PREVIEWS */}
        {adminSubTab === 'about_config' && (
          <AdminAbout 
            loadAllAdminData={loadAllAdminData} 
            setLoading={setLoading} 
            projects={projects}
            blogPosts={blogPosts}
            bulletins={bulletins}
          />
        )}

        {/* TAB CONTENT: CAROUSEL SLIDES CONFIG (5 PHOTOS) */}
        {adminSubTab === 'carousel_config' && (
          <AdminCarousel 
            carouselSlides={carouselSlides} 
            setCarouselSlides={setCarouselSlides} 
            loadAllAdminData={loadAllAdminData} 
            adminFetch={adminFetch} 
            setLoading={setLoading} 
          />
        )}
      </Suspense>

      {/* TAB CONTENT: LOGOS & BRANDING CONFIGURATION */}
      {adminSubTab === 'logo_config' && (
        <form onSubmit={handleUpdateLogos} className="space-y-8 animate-fade-in">
          <div className="bg-[#ebdccd]/20 border border-[#ebdccd]/80 p-6 rounded-3xl space-y-2">
            <h3 className="font-display text-xl font-extrabold text-[#1c1a17] flex items-center gap-2">
              <Landmark className="h-5.5 w-5.5 text-[#1f5f3d]" />
              Gestión Integral de Logos y Branding VOSERDEM
            </h3>
            <p className="text-xs text-[#5c544b] leading-relaxed">
              Personalice y gestione de manera integral las firmas visuales de la organización.
              Puede sustituir los nombres publicitarios, lemas de cabecera/pie, o decidir sustituir
              los emblemas vectoriales clásicos por archivos de imagen personalizados (ej. logos
              oficiales cargados).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. LIGHT HEADER COLOR LOGO */}
            <div className="bg-[#fcfbf9] border border-[#ebdccd]/60 rounded-3xl p-6 sm:p-8 space-y-6">
              <h4 className="font-display font-extrabold text-[#1c1a17] text-sm pb-2 border-b border-[#ebdccd]/30 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2.5 h-2.5 bg-[#d95c2b] rounded-full" />
                Logo Color (Barra de Navegación / Cabecera Clara)
              </h4>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Nombre de Marca Principal
                  </label>
                  <input
                    type="text"
                    required
                    value={logoColorBrandName}
                    onChange={(e) => setLogoColorBrandName(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Slogan de Barra / Lemas de Voluntariado
                  </label>
                  <input
                    type="text"
                    required
                    value={logoColorSlogan}
                    onChange={(e) => setLogoColorSlogan(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842] block">
                    Modo Gráfico del Logotipo
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-[#1c1a17] font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="logoColorMode"
                        checked={!logoColorUseCustomImage}
                        onChange={() => setLogoColorUseCustomImage(false)}
                        className="accent-[#1f5f3d]"
                      />
                      Clásico Emblema Vectorial (SVG)
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#1c1a17] font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="logoColorMode"
                        checked={logoColorUseCustomImage}
                        onChange={() => setLogoColorUseCustomImage(true)}
                        className="accent-[#1f5f3d]"
                      />
                      Imagen Externa (URL)
                    </label>
                  </div>
                </div>

                {logoColorUseCustomImage && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      URL de la Imagen del Logotipo Oficial
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://lh3.googleusercontent.com/d/..."
                      value={logoColorImageUrl}
                      onChange={(e) => setLogoColorImageUrl(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17]"
                    />
                  </div>
                )}
              </div>

              {/* Previsualizacion interna */}
              <div className="bg-[#1b3022] p-5 rounded-2xl flex flex-col items-center justify-center border border-[#ebdccd]/30 relative text-center">
                <span className="text-[9px] uppercase font-bold text-[#FFE5A3] absolute top-3 left-4">
                  Previsualización (Ejemplo Cabecera Oscura/Verde)
                </span>

                <div className="pt-4 pb-1">
                  <div className="flex items-center gap-3">
                    {logoColorUseCustomImage && logoColorImageUrl ? (
                      <img
                        src={cleanGoogleDriveUrl(logoColorImageUrl)}
                        alt="Logo Color Preview"
                        className="h-12 w-12 object-contain rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#ebdccd]/20 rounded-full flex items-center justify-center text-xs font-bold text-[#FFE5A3]">
                        SVG
                      </div>
                    )}
                    <div className="text-left font-sans text-[#F5F2ED]">
                      <span className="text-xl font-black block leading-none">
                        {logoColorBrandName}
                      </span>
                      <span className="text-[8px] uppercase tracking-wide text-[#C5A059] font-bold block mt-1 leading-tight">
                        {logoColorSlogan}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CORPORATE GOLD FOOTER LOGO */}
            <div className="bg-[#fcfbf9] border border-[#ebdccd]/60 rounded-3xl p-6 sm:p-8 space-y-6">
              <h4 className="font-display font-extrabold text-[#1c1a17] text-sm pb-2 border-b border-[#ebdccd]/30 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2.5 h-2.5 bg-[#C5A059] rounded-full" />
                Logo Dorado (Pie de Página / Estilo Editorial)
              </h4>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Nombre de Marca Principal
                  </label>
                  <input
                    type="text"
                    required
                    value={logoGoldBrandName}
                    onChange={(e) => setLogoGoldBrandName(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Subtítulo del Corporativo / Una Bolivia mejor es posible
                  </label>
                  <input
                    type="text"
                    required
                    value={logoGoldSlogan}
                    onChange={(e) => setLogoGoldSlogan(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842] block">
                    Modo Gráfico del Logotipo
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-[#1c1a17] font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="logoGoldMode"
                        checked={!logoGoldUseCustomImage}
                        onChange={() => setLogoGoldUseCustomImage(false)}
                        className="accent-[#1f5f3d]"
                      />
                      Corporativo Dorado (SVG)
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#1c1a17] font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="logoGoldMode"
                        checked={logoGoldUseCustomImage}
                        onChange={() => setLogoGoldUseCustomImage(true)}
                        className="accent-[#1f5f3d]"
                      />
                      Imagen Externa (URL)
                    </label>
                  </div>
                </div>

                {logoGoldUseCustomImage && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      URL de la Imagen Corporativa Dorada
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://lh3.googleusercontent.com/d/..."
                      value={logoGoldImageUrl}
                      onChange={(e) => setLogoGoldImageUrl(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17]"
                    />
                  </div>
                )}
              </div>

              {/* Previsualizacion interna */}
              <div className="bg-[#111e15] p-5 rounded-2xl flex flex-col items-center justify-center border border-[#ebdccd]/35 relative text-center">
                <span className="text-[9px] uppercase font-bold text-[#C5A059] absolute top-3 left-4">
                  Previsualización (Ejemplo Pie de Página)
                </span>

                <div className="pt-4 pb-1">
                  <div className="flex flex-col items-center gap-2">
                    {logoGoldUseCustomImage && logoGoldImageUrl ? (
                      <img
                        src={cleanGoogleDriveUrl(logoGoldImageUrl)}
                        alt="Logo Gold Preview"
                        className="h-12 w-12 object-contain rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-8 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded flex items-center justify-center text-[10px] font-bold text-[#C5A059]">
                        SVG Dor.
                      </div>
                    )}
                    <div className="space-y-1 text-center font-sans">
                      <h3 className="text-xl font-black text-[#FFE5A3] bg-gradient-to-r from-[#FFF0C2] via-[#C5A059] to-[#8C6612] bg-clip-text text-transparent">
                        {logoGoldBrandName}
                      </h3>
                      <p className="text-[8px] uppercase tracking-widest text-[#C5A059] font-bold">
                        {logoGoldSlogan}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-[#1f5f3d] hover:bg-[#15462b] text-white py-3.5 px-8 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Landmark className="h-4 w-4" />
              <span>Guardar Configuración de Branding y Logos</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
