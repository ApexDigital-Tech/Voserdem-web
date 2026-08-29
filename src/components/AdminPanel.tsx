import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Project,
  Donation,
  Message,
  BlogPost,
  Bulletin,
  Subscriber,
  CarouselSlide,
  LogoConfig,
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
  Send,
  ArrowRight,
  X,
  AlertOctagon,
  CheckSquare,
  Sparkles,
  MapPin,
  FileText,
  Users,
  Compass,
  Activity,
} from 'lucide-react';
import { api } from '../services/api';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';
import AdminPagesManager from './AdminPagesManager';
import AdminImpacto from './AdminImpacto';
import AdminDonations from './AdminDonations';

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
  const [aboutIntroSub, setAboutIntroSub] = useState('');
  const [aboutIntroTitle, setAboutIntroTitle] = useState('');
  const [aboutIntroText, setAboutIntroText] = useState('');
  const [aboutMissionTitle, setAboutMissionTitle] = useState('');
  const [aboutMissionText, setAboutMissionText] = useState('');
  const [aboutVisionTitle, setAboutVisionTitle] = useState('');
  const [aboutVisionText, setAboutVisionText] = useState('');
  const [aboutImageUrl, setAboutImageUrl] = useState('');
  const [aboutHeroImageUrl, setAboutHeroImageUrl] = useState('');
  const [aboutPillars, setAboutPillars] = useState<any[]>([
    { title: '', description: '', iconName: 'Users' },
    { title: '', description: '', iconName: 'Leaf' },
    { title: '', description: '', iconName: 'Heart' },
    { title: '', description: '', iconName: 'GraduationCap' },
  ]);

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
      const [projRes, donRes, msgRes, blogRes, bullRes, subRes, aboutRes, carouselRes, logosRes] =
        await Promise.all([
          api.get<any>('/api/projects'),
          api.get<any>('/api/donations'),
          api.get<any>('/api/messages'),
          api.get<any>('/api/blog?status=all'),
          api.get<any>('/api/bulletins?status=all'),
          api.get<any>('/api/subscribers'),
          api.get<any>('/api/about'),
          api.get<any>('/api/carousel'),
          api.get<any>('/api/logos'),
        ]);

      if (projRes.success && projRes.data) setProjects(projRes.data);
      if (donRes.success && donRes.data) setDonations(donRes.data);
      if (msgRes.success && msgRes.data) setMessages(msgRes.data);
      if (blogRes.success && blogRes.data) setBlogPosts(blogRes.data);
      if (bullRes.success && bullRes.data) setBulletins(bullRes.data);
      if (subRes.success && subRes.data) setSubscribers(subRes.data);
      if (aboutRes.success && aboutRes.data) {
        const aboutData = aboutRes.data;
        setAboutIntroSub(aboutData.introSub || '');
        setAboutIntroTitle(aboutData.introTitle || '');
        setAboutIntroText(aboutData.introText || '');
        setAboutMissionTitle(aboutData.missionTitle || '');
        setAboutMissionText(aboutData.missionText || '');
        setAboutVisionTitle(aboutData.visionTitle || '');
        setAboutVisionText(aboutData.visionText || '');
        setAboutImageUrl(aboutData.imageUrl || '');
        setAboutHeroImageUrl(aboutData.heroImageUrl || '');
        if (aboutData.pillars && Array.isArray(aboutData.pillars)) {
          setAboutPillars(aboutData.pillars);
        }
      }
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

  const handleUpdateAboutUs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanedImageUrl = cleanGoogleDriveUrl(aboutImageUrl);
      const cleanedHeroImageUrl = cleanGoogleDriveUrl(aboutHeroImageUrl);

      const payload = {
        introSub: aboutIntroSub,
        introTitle: aboutIntroTitle,
        introText: aboutIntroText,
        missionTitle: aboutMissionTitle,
        missionText: aboutMissionText,
        visionTitle: aboutVisionTitle,
        visionText: aboutVisionText,
        imageUrl: cleanedImageUrl,
        heroImageUrl: cleanedHeroImageUrl,
        pillars: aboutPillars,
      };
      const res = await api.put('/api/about', payload);

      if (res.success) {
        showStatus('Contenido de "Sobre Nosotros" guardado con éxito.', 'success');
        loadAllAdminData();
      } else {
        showStatus('Error al intentar actualizar la sección Sobre Nosotros.', 'error');
      }
    } catch (err) {
      showStatus('Error de red al intentar guardar los cambios.', 'error');
    } finally {
      setLoading(false);
    }
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
    setFormCategory(proj.category);
    setFormRegion(proj.region || 'Valles');
    setFormArea(proj.area || 'Medio Ambiente');
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
        resetForm();
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
                resetForm();
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
      {adminSubTab === 'projects' && (
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
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                      Área de Acción (Categorización interna)
                    </label>
                    <select
                      value={formArea}
                      onChange={(e) => setFormArea(e.target.value as any)}
                      className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="Educación">Educación</option>
                      <option value="Medio Ambiente">Medio Ambiente</option>
                      <option value="Productivo">Productivo</option>
                      <option value="Intergeneracional">
                        Intergeneracional (comedores de niños, adulto mayor, etc)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                      Meta de Financiamiento (USD)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formGoal}
                      onChange={(e) => setFormGoal(Number(e.target.value))}
                      className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                      Recaudado (Solo editable en Cuentas Aud.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isEditing}
                      value={formRaised}
                      onChange={(e) => setFormRaised(Number(e.target.value))}
                      className="w-full bg-[#f4f3f0] border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none disabled:text-[#7d756b]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                      Muro de Métricas de Impacto
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 120 abuelas atendidas diariamente."
                      required
                      value={formImpact}
                      onChange={(e) => setFormImpact(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                    URL de la Imagen Ilustrativa (Unsplash u otro servidor)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                    Breve Introducción de Tarjeta
                  </label>
                  <input
                    placeholder="Máximo 150 caracteres para la vista resumida principal."
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#4e4842]">
                    Descripción Detallada (Cuerpo del Modal)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe de manera profunda los objetivos específicos, beneficiarios y necesidades financieras..."
                    required
                    value={formDetails}
                    onChange={(e) => setFormDetails(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-lg py-2 px-3 text-xs focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-[#ebdccd] rounded-lg text-xs font-semibold text-[#4e4842] hover:bg-[#e6dfd5]/40 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#1f5f3d] text-white hover:bg-[#16442b] px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    {isEditing ? 'Confirmar Cambios' : 'Crear Proyecto'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Master Table of projects */}
          <div className="bg-[#fcfbf9] border border-[#ebdccd]/65 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#ebdccd]/20 text-[10px] font-bold uppercase tracking-wider text-[#5c544b] border-b border-[#ebdccd]/30">
                    <th className="py-4 px-6">Detalle Proyecto</th>
                    <th className="py-4 px-6">Región / Área</th>
                    <th className="py-4 px-6">Ubicación</th>
                    <th className="py-4 px-6 text-right">Avance (USD)</th>
                    <th className="py-4 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebdccd]/30 text-xs text-[#1c1a17]">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-[#fbfaf7]">
                      <td className="py-4 px-6 font-medium">
                        <div className="flex items-center gap-3">
                          <img
                            src={cleanGoogleDriveUrl(proj.image)}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-[#1c1a17] hover:underline cursor-pointer block">
                              {proj.title}
                            </span>
                            <span className="text-[10px] text-[#5c544b] line-clamp-1">
                              {proj.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="bg-[#1f5f3d]/10 px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide text-[#1f5f3d] w-fit">
                            {proj.region || 'Valles'}
                          </span>
                          <span className="bg-[#ebdccd]/40 px-2 py-0.5 rounded-full font-semibold text-[9px] uppercase tracking-wide text-[#5c544b] w-fit">
                            {proj.area || 'Medio Ambiente'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#5c544b] uppercase tracking-tight font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#d95c2b]" />
                          <span>{proj.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold">
                        <span className="text-[#1f5f3d]">${proj.raised.toLocaleString()}</span> /{' '}
                        <span className="text-[#7d756b]">${proj.goal.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => selectForEdit(proj)}
                            title="Editar"
                            className="p-1.5 rounded-lg border border-[#ebdccd]/60 bg-white hover:bg-emerald-50 text-[#1f5f3d] hover:border-emerald-200 transition-colors cursor-pointer"
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
        <div className="space-y-8 animate-fade-in">
          <div className="bg-[#ebdccd]/15 p-6 rounded-2xl border border-[#ebdccd]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-[#1c1a17]">
                Gestión de Sobre Nosotros
              </h3>
              <p className="text-xs text-[#5c544b]">
                Personaliza los copys estratégicos, visiones generales y la principal imagen
                ilustrativa del portal.
              </p>
            </div>

            <button
              onClick={handleUpdateAboutUs}
              className="bg-[#1f5f3d] hover:bg-[#15462b] text-white py-2.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-sm"
            >
              <Compass className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>

          <form onSubmit={handleUpdateAboutUs} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#ebdccd]/60 p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs">
                <h4 className="font-display font-bold text-sm text-[#1b3022] pb-2 border-b border-[#ebdccd]/30 flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-[#1f5f3d]" />
                  1. Copys de Introducción
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      Sub-encabezado de Introducción
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Nuestro Propósito Coherente"
                      value={aboutIntroSub}
                      onChange={(e) => setAboutIntroSub(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      Título de Introducción Principal
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. ¿Quiénes Somos en VOSERDEM?"
                      value={aboutIntroTitle}
                      onChange={(e) => setAboutIntroTitle(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                    Texto de Introducción Detallado
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Escribe el texto descriptivo primordial que verán los visitantes al inicio de la página..."
                    value={aboutIntroText}
                    onChange={(e) => setAboutIntroText(e.target.value)}
                    className="w-full bg-white border border-[#ebdccd] rounded-xl p-3 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
                  />
                </div>
              </div>

              <div className="bg-white border border-[#ebdccd]/60 p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs">
                <h4 className="font-display font-bold text-sm text-[#1b3022] pb-2 border-b border-[#ebdccd]/30 flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-[#1f5f3d]" />
                  2. Misión, Visión e Imagen
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      URL de Imagen de Presentación (Sobre Nosotros)
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/... o enlace de red"
                      value={aboutImageUrl}
                      onChange={(e) => setAboutImageUrl(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                      URL de la Foto de Portada Principal (Página de Inicio / Hero)
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/... o enlace de red de la portada"
                      value={aboutHeroImageUrl}
                      onChange={(e) => setAboutHeroImageUrl(e.target.value)}
                      className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2.5 text-xs text-[#1c1a17] focus:outline-none focus:ring-1 focus:ring-[#1f5f3d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                        Título de Misión
                      </label>
                      <input
                        type="text"
                        required
                        value={aboutMissionTitle}
                        onChange={(e) => setAboutMissionTitle(e.target.value)}
                        className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17] font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                        Cuerpo de Misión
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={aboutMissionText}
                        onChange={(e) => setAboutMissionText(e.target.value)}
                        className="w-full bg-white border border-[#ebdccd] rounded-xl p-2.5 text-xs text-[#1c1a17] resize-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                        Título de Visión
                      </label>
                      <input
                        type="text"
                        required
                        value={aboutVisionTitle}
                        onChange={(e) => setAboutVisionTitle(e.target.value)}
                        className="w-full bg-white border border-[#ebdccd] rounded-xl px-3 py-2 text-xs text-[#1c1a17] font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#4e4842]">
                        Cuerpo de Visión
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={aboutVisionText}
                        onChange={(e) => setAboutVisionText(e.target.value)}
                        className="w-full bg-white border border-[#ebdccd] rounded-xl p-2.5 text-xs text-[#1c1a17] resize-none font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#ebdccd]/60 p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs">
                <h4 className="font-display font-bold text-sm text-[#1b3022] pb-2 border-b border-[#ebdccd]/30 flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-[#1f5f3d]" />
                  3. Pilares Estratégicos de Acción (Cuatro Bloques)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {aboutPillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#fbfaf7] border border-[#ebdccd]/40 rounded-xl space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-mono font-bold text-[#d95c2b]">
                          BLOQUE N° {idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-tight text-[#5c544b]">
                            Icono:
                          </label>
                          <select
                            value={pillar.iconName}
                            onChange={(e) => {
                              const updated = [...aboutPillars];
                              updated[idx].iconName = e.target.value;
                              setAboutPillars(updated);
                            }}
                            className="bg-white border border-[#ebdccd] rounded px-1.5 py-0.5 text-[9px] text-[#1c1a17] focus:outline-none"
                          >
                            <option value="Users">Usuarios / Grupo</option>
                            <option value="Leaf">Ecología / Hoja</option>
                            <option value="Heart">Dignidad / Corazón</option>
                            <option value="GraduationCap">Educación / Grado</option>
                            <option value="Compass">Misiones / Compás</option>
                            <option value="Shield">Escudo / Protección</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-[#4e4842]">
                          Título del Pilar
                        </label>
                        <input
                          type="text"
                          required
                          value={pillar.title}
                          onChange={(e) => {
                            const updated = [...aboutPillars];
                            updated[idx].title = e.target.value;
                            setAboutPillars(updated);
                          }}
                          className="w-full bg-white border border-[#ebdccd] rounded-lg px-2.5 py-1.5 text-xs text-[#1c1a17] font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-[#4e4842]">
                          Descripción pilar
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={pillar.description}
                          onChange={(e) => {
                            const updated = [...aboutPillars];
                            updated[idx].description = e.target.value;
                            setAboutPillars(updated);
                          }}
                          className="w-full bg-white border border-[#ebdccd] rounded-lg p-2 text-xs text-[#1c1a17] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              {aboutImageUrl && (
                <div className="bg-white border border-[#ebdccd]/60 p-4 rounded-2xl text-center space-y-3 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c544b] block">
                    Imagen de Presentación
                  </span>
                  <img
                    src={cleanGoogleDriveUrl(aboutImageUrl)}
                    alt=""
                    className="w-full h-44 object-cover rounded-xl border border-[#ebdccd] shadow-xs bg-neutral-100"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <p className="text-[9px] text-[#5c544b] leading-tight font-sans">
                    La imagen se adaptará automáticamente a la faja derecha del propósito
                    institucional.
                  </p>
                </div>
              )}

              {aboutHeroImageUrl && (
                <div className="bg-white border border-[#ebdccd]/60 p-4 rounded-2xl text-center space-y-3 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c544b] block">
                    Imagen de Portada (Hero)
                  </span>
                  <img
                    src={cleanGoogleDriveUrl(aboutHeroImageUrl)}
                    alt=""
                    className="w-full h-44 object-cover rounded-xl border border-[#ebdccd] shadow-xs bg-neutral-100"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                  <p className="text-[9px] text-[#5c544b] leading-tight font-sans">
                    Esta imagen se mostrará como el fondo principal de la portada superior (Hero) de
                    la web.
                  </p>
                </div>
              )}

              <div className="bg-[#1f5f3d]/5 border-2 border-[#1f5f3d]/15 p-5 rounded-2xl space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1f5f3d] block flex items-center gap-1.5 shadow-none">
                  <Sparkles className="h-3.5 w-3.5" />
                  Previsualización Pública Activa
                </span>
                <p className="text-[11px] text-[#2c2c2c] leading-relaxed">
                  Las novedades de <strong>Blog</strong>, <strong>Proyectos</strong> y{' '}
                  <strong>Boletines</strong> se generan automáticamente en el pie de página de
                  "Sobre Nosotros". Esto incrementa la tracción orgánica de visitas y descargas de
                  PDFs con enlaces activos.
                </p>

                <div className="border-t border-[#1f5f3d]/15 pt-3 space-y-3 text-[11px] text-[#5c544b]">
                  <div className="flex justify-between items-center">
                    <span>Proyectos Dinámicos:</span>
                    <span className="font-mono font-bold text-[#1f5f3d]">
                      {projects.length} activos
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Artículos de Trazabilidad:</span>
                    <span className="font-mono font-bold text-[#1f5f3d]">
                      {blogPosts.length} publicados
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Boletines de Transparencia:</span>
                    <span className="font-mono font-bold text-[#1f5f3d]">
                      {bulletins.length} enlistados
                    </span>
                  </div>
                </div>

                <div className="bg-white/60 border border-[#ebdccd]/50 p-3 rounded-lg space-y-2 text-[10px]">
                  <div className="font-bold text-[#1c1a17] text-left">Ejemplo del widget:</div>
                  <div className="flex gap-2 items-center text-left bg-white p-2 rounded border border-[#ebdccd]/30">
                    <FileText className="h-5 w-5 text-[#d95c2b]" />
                    <div className="truncate">
                      <div className="font-bold truncate text-[#1b3022]">
                        {bulletins[0]?.title || 'Boletín de Invierno'}
                      </div>
                      <div className="text-[8px] text-[#5c544b] font-mono">
                        {bulletins[0]?.issueNumber || 'N° 12'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1f5f3d] hover:bg-[#15462b] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Compass className="h-4 w-4" />
                <span>Aplicar Cambios Globales</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: CAROUSEL SLIDES CONFIG (5 PHOTOS) */}
      {adminSubTab === 'carousel_config' && (
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
      )}

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
