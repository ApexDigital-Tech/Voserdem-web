/**
 * Vercel Serverless Function — VOSERDEM API
 *
 * This file is self-contained to avoid Vercel esbuild path resolution issues.
 * All backend logic that was in server.ts is duplicated here so that
 * Vercel can bundle it in one shot without cross-directory imports.
 *
 * server.ts is still used for LOCAL development (npm run dev).
 */
import express from 'express';
import { createClient } from '@supabase/supabase-js';

// ---- Supabase Client (inline, no relative imports) ----
const supabaseUrl =
  process.env.SUPABASE_URL || 'https://jnovhyyqypvwydpvtubh.supabase.co';
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impub3ZoeXlxeXB2d3lkcHZ0dWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTY1MzYsImV4cCI6MjA5NjE3MjUzNn0.fhujiFlgnXyFw3aUGdv8a_uyjNsMixBAgjcsIwJKScE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
const TENANT_ID = 'voserdem-bolivia';
const ADMIN_PASSKEY = 'voserdem2026';

app.use(express.json());

// ---- Auth middleware ----
function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSKEY) return next();
  res.status(401).json({ error: 'Acceso denegado. Credenciales de administrador inválidas.' });
}

// ---- Default data ----
const initialLogoConfig = {
  logoColor: {
    brandName: 'VOSERDEM',
    slogan: 'Voluntarios al Servicio de los Demás',
    useCustomImage: false,
    imageUrl: ''
  },
  logoGold: {
    brandName: 'VOSERDEM',
    slogan: 'Unidos por Bolivia',
    useCustomImage: false,
    imageUrl: ''
  }
};

const initialAboutUs = {
  introSub: 'Nuestro Propósito Coherente',
  introTitle: '¿Quiénes Somos en VOSERDEM?',
  introText:
    'El Voluntariado de Servicio para el Desarrollo Humano y Medio Ambiente (VOSERDEM) es una institución boliviana...',
  missionTitle: 'Nuestra Misión',
  missionText: 'Promover y consolidar el desarrollo integral...',
  visionTitle: 'Nuestra Visión',
  visionText: 'Constituirnos en un modelo de referencia...',
  imageUrl:
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
  heroImageUrl:
    'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=600',
  pillars: [
    {
      title: 'Desarrollo Humano Integral',
      description: 'Acompañamos a sectores en vulnerabilidad...',
      iconName: 'Users'
    }
  ]
};

const initialCarouselSlides = [
  {
    id: 'slide-1',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    badge: 'Medio Ambiente & Ecología',
    badgeIconName: 'Trees',
    title: 'Sembrando Sostenibilidad, Cultivando Dignidad Humana',
    description: 'Somos una organización sin fines de lucro en Cochabamba, Bolivia.'
  }
];

const initialProjects = [
  {
    id: 'proj-1',
    title: 'Ecocamp Chocaya',
    description: 'Centro de restauración ecológica y educación ambiental en Bolivia.',
    category: 'Medio Ambiente',
    region: 'Valles',
    area: 'Medio Ambiente',
    image:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    goal: 15000,
    raised: 8450,
    location: 'Chocaya, Cochabamba, Bolivia',
    impact: 'Más de 500 árboles nativos plantados.',
    details: 'El Ecocamp de Chocaya...'
  }
];

const initialBlog = [
  {
    id: 'blog-1',
    title: 'Restauración activa en el Tunari: ¿Por qué plantamos Queñuas?',
    summary:
      'La queñua (Polylepis) es un árbol nativo indispensable para recargar los acuíferos de Cochabamba.',
    content: 'En las alturas de la cordillera del Tunari...',
    image:
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800',
    category: 'Ecología',
    author: 'Ing. René Mendoza, Coordinador Ecológico',
    date: '2026-05-15',
    readTime: '4 min',
    featured: true
  }
];

const initialBulletins = [
  {
    id: 'bull-1',
    title: 'Boletín Informativo Otoño 2026 - Edición N° 12',
    summary: 'Revisión completa de las campañas de invierno en el Tunari...',
    publishDate: '2026-04-30',
    issueNumber: 'Año 12 - N° 1',
    downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    image:
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800'
  }
];

// ---- DB mappers ----
function mapDonationFromDb(db: any) {
  return {
    id: db.id,
    donorName: db.donorName,
    email: db.email,
    amount: Number(db.amount),
    projectId: db.projectId,
    projectTitle: db.projectTitle,
    date: db.date,
    comment: db.comment || ''
  };
}

function mapBlogFromDb(db: any) {
  return {
    id: db.id,
    title: db.title,
    summary: db.summary,
    content: db.content,
    image: db.image,
    category: db.category,
    author: db.author,
    date: db.date,
    readTime: db.readTime || '3 min',
    featured: !!db.featured,
    status: db.status || 'published'
  };
}

function mapBulletinFromDb(db: any) {
  return {
    id: db.id,
    title: db.title,
    summary: db.summary,
    publishDate: db.publishDate,
    issueNumber: db.issueNumber,
    downloadUrl: db.downloadUrl || '',
    image: db.image || '',
    status: db.status || 'published'
  };
}

function mapCarouselFromDb(db: any) {
  return {
    id: db.id,
    image: db.image,
    badge: db.badge || '',
    badgeIconName: db.badgeIconName || 'Trees',
    title: db.title || '',
    description: db.description || ''
  };
}

function mapAboutFromDb(db: any) {
  return {
    introSub: db.introSub,
    introTitle: db.introTitle,
    introText: db.introText,
    missionTitle: db.missionTitle,
    missionText: db.missionText,
    visionTitle: db.visionTitle,
    visionText: db.visionText,
    imageUrl: db.imageUrl,
    heroImageUrl: db.hero_imageUrl || '',
    pillars: db.pillars
  };
}

function mapLogosFromDb(db: any) {
  return {
    logoColor: db.logoColor,
    logoGold: db.logoGold
  };
}

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: 'supabase', time: new Date().toISOString() });
});

// ---- CAROUSEL ----
app.get('/api/carousel', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('carousel')
      .select('*')
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json(data && data.length > 0 ? data.map(mapCarouselFromDb) : initialCarouselSlides);
  } catch (err: any) {
    console.error('carousel GET:', err.message);
    res.json(initialCarouselSlides);
  }
});

app.put('/api/carousel', requireAdmin, async (req, res) => {
  const slides = req.body;
  if (!Array.isArray(slides)) return res.status(400).json({ error: 'Debe ser un array.' });
  if (slides.length > 5) return res.status(400).json({ error: 'Máximo 5 diapositivas.' });
  try {
    await supabase.from('carousel').delete().eq('organization_id', TENANT_ID);
    const rows = slides.map((s: any) => ({
      id: s.id || `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organization_id: TENANT_ID,
      image: s.image,
      badge: s.badge || '',
      badgeIconName: s.badgeIconName || 'Trees',
      title: s.title || '',
      description: s.description || ''
    }));
    const { error } = await supabase.from('carousel').insert(rows);
    if (error) throw error;
    res.json(rows.map(mapCarouselFromDb));
  } catch (err: any) {
    console.error('carousel PUT:', err.message);
    res.status(500).json({ error: 'Error interno al actualizar el carrusel.' });
  }
});

// ---- LOGOS ----
app.get('/api/logos', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('logos')
      .select('*')
      .eq('organization_id', TENANT_ID)
      .eq('id', 'default')
      .maybeSingle();
    if (error) throw error;
    res.json(data ? mapLogosFromDb(data) : initialLogoConfig);
  } catch (err: any) {
    console.error('logos GET:', err.message);
    res.json(initialLogoConfig);
  }
});

app.put('/api/logos', requireAdmin, async (req, res) => {
  const { logoColor, logoGold } = req.body;
  if (!logoColor || !logoGold)
    return res.status(400).json({ error: 'Faltan configuraciones de logotipo.' });
  try {
    const { error } = await supabase.from('logos').upsert({
      id: 'default',
      organization_id: TENANT_ID,
      logoColor: typeof logoColor === 'string' ? JSON.parse(logoColor) : logoColor,
      logoGold: typeof logoGold === 'string' ? JSON.parse(logoGold) : logoGold
    });
    if (error) throw error;
    res.json({ logoColor, logoGold });
  } catch (err: any) {
    console.error('logos PUT:', err.message);
    res.status(500).json({ error: 'Error interno al guardar logotipos.' });
  }
});

// ---- ABOUT ----
app.get('/api/about', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .eq('organization_id', TENANT_ID)
      .eq('id', 'default')
      .maybeSingle();
    if (error) throw error;
    res.json(data ? mapAboutFromDb(data) : initialAboutUs);
  } catch (err: any) {
    console.error('about GET:', err.message);
    res.json(initialAboutUs);
  }
});

app.put('/api/about', requireAdmin, async (req, res) => {
  const {
    introSub, introTitle, introText,
    missionTitle, missionText,
    visionTitle, visionText,
    imageUrl, heroImageUrl, pillars
  } = req.body;
  try {
    const { error } = await supabase.from('about').upsert({
      id: 'default',
      organization_id: TENANT_ID,
      introSub: introSub || initialAboutUs.introSub,
      introTitle: introTitle || initialAboutUs.introTitle,
      introText: introText || initialAboutUs.introText,
      missionTitle: missionTitle || initialAboutUs.missionTitle,
      missionText: missionText || initialAboutUs.missionText,
      visionTitle: visionTitle || initialAboutUs.visionTitle,
      visionText: visionText || initialAboutUs.visionText,
      imageUrl: imageUrl || initialAboutUs.imageUrl,
      heroImageUrl: heroImageUrl || initialAboutUs.heroImageUrl,
      pillars: typeof pillars === 'string' ? JSON.parse(pillars) : (Array.isArray(pillars) ? pillars : initialAboutUs.pillars)
    });
    if (error) throw error;
    res.json(req.body);
  } catch (err: any) {
    console.error('about PUT:', err.message);
    res.status(500).json({ error: 'Error interno al guardar sección Sobre Nosotros.' });
  }
});

// ---- PROJECTS ----
app.get('/api/projects', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('projects GET:', err.message);
    res.status(500).json({ error: 'Error al recuperar proyectos.' });
  }
});

app.post('/api/projects', requireAdmin, async (req, res) => {
  const { title, description, category, region, area, image, goal, location, impact, details } =
    req.body;
  if (!title || !description || !category || !goal)
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  const newProject = {
    id: `proj-${Date.now()}`,
    organization_id: TENANT_ID,
    title, description, category,
    region: region || 'Valles',
    area: area || 'Medio Ambiente',
    image: image || 'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=800',
    goal: Number(goal),
    raised: 0,
    location: location || 'Cochabamba, Bolivia',
    impact: impact || '',
    details: details || description
  };
  try {
    const { error } = await supabase.from('projects').insert(newProject);
    if (error) throw error;
    res.status(201).json(newProject);
  } catch (err: any) {
    console.error('projects POST:', err.message);
    res.status(500).json({ error: 'Error interno al crear el proyecto.' });
  }
});

app.put('/api/projects/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates: any = {};
  const fields = ['title','description','category','region','area','image','location','impact','details'];
  fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  if (req.body.goal !== undefined) updates.goal = Number(req.body.goal);
  if (req.body.raised !== undefined) updates.raised = Number(req.body.raised);
  try {
    const { error } = await supabase.from('projects').update(updates).eq('id', id).eq('organization_id', TENANT_ID);
    if (error) throw error;
    const { data: updated, error: findErr } = await supabase.from('projects').select('*').eq('id', id).eq('organization_id', TENANT_ID).single();
    if (findErr) throw findErr;
    res.json(updated);
  } catch (err: any) {
    console.error('projects PUT:', err.message);
    res.status(500).json({ error: 'Error interno al actualizar el proyecto.' });
  }
});

app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id).eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error('projects DELETE:', err.message);
    res.status(500).json({ error: 'Error al eliminar el proyecto.' });
  }
});

// ---- DONATIONS ----
app.post('/api/donations', async (req, res) => {
  const { donorName, email, amount, projectId, comment } = req.body;
  if (!donorName || !email || !amount || !projectId)
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0)
    return res.status(400).json({ error: 'El monto debe ser un número positivo.' });
  try {
    const { data: proj, error: projErr } = await supabase.from('projects').select('*').eq('id', projectId).eq('organization_id', TENANT_ID).maybeSingle();
    if (projErr || !proj) return res.status(404).json({ error: 'Proyecto no existe.' });
    const newRaised = Number(proj.raised || 0) + amountNum;
    await supabase.from('projects').update({ raised: newRaised }).eq('id', projectId).eq('organization_id', TENANT_ID);
    const newDonation = {
      id: `don-${Date.now()}`,
      organization_id: TENANT_ID,
      donorName: donorName, email,
      amount: amountNum,
      projectId: projectId,
      projectTitle: proj.title,
      date: new Date().toISOString(),
      comment
    };
    const { error } = await supabase.from('donations').insert(newDonation);
    if (error) throw error;
    res.status(201).json({ success: true, donation: mapDonationFromDb(newDonation), currentRaised: newRaised });
  } catch (err: any) {
    console.error('donations POST:', err.message);
    res.status(500).json({ error: 'Error al procesar la donación.' });
  }
});

app.get('/api/donations', requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase.from('donations').select('*').eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json((data || []).map(mapDonationFromDb));
  } catch (err: any) {
    console.error('donations GET:', err.message);
    res.status(500).json({ error: 'Error al recuperar donaciones.' });
  }
});

// ---- MESSAGES ----
app.post('/api/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: 'Rellene todos los campos.' });
  const newMessage = {
    id: `msg-${Date.now()}`,
    organization_id: TENANT_ID,
    name, email, subject, message,
    date: new Date().toISOString()
  };
  try {
    const { error } = await supabase.from('messages').insert(newMessage);
    if (error) throw error;
    res.status(201).json({ success: true, message: newMessage });
  } catch (err: any) {
    console.error('messages POST:', err.message);
    res.status(500).json({ error: 'Error al enviar mensaje.' });
  }
});

app.get('/api/messages', requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase.from('messages').select('*').eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('messages GET:', err.message);
    res.status(500).json({ error: 'Error al recuperar mensajes.' });
  }
});

// ---- BLOG ----
app.get('/api/blog', async (req, res) => {
  const showAll = req.query.all === 'true' || req.query.status === 'all';
  try {
    let query = supabase.from('blog').select('*').eq('organization_id', TENANT_ID);
    if (!showAll) query = query.neq('status', 'draft');
    const { data, error } = await query;
    if (error) throw error;
    res.json((data || []).map(mapBlogFromDb));
  } catch (err: any) {
    console.error('blog GET:', err.message);
    res.status(500).json({ error: 'Error al recuperar publicaciones.' });
  }
});

app.post('/api/blog', requireAdmin, async (req, res) => {
  const { title, summary, content, image, category, author, readTime, featured, status } = req.body;
  if (!title || !content || !category || !author)
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  const newPost = {
    id: `blog-${Date.now()}`,
    organization_id: TENANT_ID,
    title,
    summary: summary || content.slice(0, 150) + '...',
    content,
    image: image || 'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=800',
    category, author,
    date: new Date().toISOString().split('T')[0],
    readTime: readTime || '3 min',
    featured: !!featured,
    status: status || 'published'
  };
  try {
    const { error } = await supabase.from('blog').insert(newPost);
    if (error) throw error;
    res.status(201).json(mapBlogFromDb(newPost));
  } catch (err: any) {
    console.error('blog POST:', err.message);
    res.status(500).json({ error: 'Error al crear el artículo.' });
  }
});

app.put('/api/blog/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates: any = {};
  const fields = ['title','summary','content','image','category','author','status'];
  fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  if (req.body.readTime !== undefined) updates.readTime = req.body.readTime;
  if (req.body.featured !== undefined) updates.featured = !!req.body.featured;
  try {
    const { error } = await supabase.from('blog').update(updates).eq('id', id).eq('organization_id', TENANT_ID);
    if (error) throw error;
    const { data: updated, error: findErr } = await supabase.from('blog').select('*').eq('id', id).eq('organization_id', TENANT_ID).single();
    if (findErr) throw findErr;
    res.json(mapBlogFromDb(updated));
  } catch (err: any) {
    console.error('blog PUT:', err.message);
    res.status(500).json({ error: 'Error al actualizar el artículo.' });
  }
});

app.delete('/api/blog/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('blog').delete().eq('id', id).eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error('blog DELETE:', err.message);
    res.status(500).json({ error: 'Error al eliminar el artículo.' });
  }
});

// ---- BULLETINS ----
app.get('/api/bulletins', async (req, res) => {
  const showAll = req.query.all === 'true' || req.query.status === 'all';
  try {
    let query = supabase.from('bulletins').select('*').eq('organization_id', TENANT_ID);
    if (!showAll) query = query.neq('status', 'draft');
    const { data, error } = await query;
    if (error) throw error;
    res.json((data || []).map(mapBulletinFromDb));
  } catch (err: any) {
    console.error('bulletins GET:', err.message);
    res.status(500).json({ error: 'Error al recuperar boletines.' });
  }
});

app.post('/api/bulletins', requireAdmin, async (req, res) => {
  const { title, summary, issueNumber, downloadUrl, image, status } = req.body;
  if (!title || !summary || !issueNumber)
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  const newBulletin = {
    id: `bull-${Date.now()}`,
    organization_id: TENANT_ID,
    title, summary,
    issueNumber: issueNumber,
    publishDate: new Date().toISOString().split('T')[0],
    downloadUrl: downloadUrl || '',
    image: image || '',
    status: status || 'published'
  };
  try {
    const { error } = await supabase.from('bulletins').insert(newBulletin);
    if (error) throw error;
    res.status(201).json(mapBulletinFromDb(newBulletin));
  } catch (err: any) {
    console.error('bulletins POST:', err.message);
    res.status(500).json({ error: 'Error al crear el boletín.' });
  }
});

app.put('/api/bulletins/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates: any = {};
  const fields = ['title','summary','image','status'];
  fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  if (req.body.issueNumber !== undefined) updates.issueNumber = req.body.issueNumber;
  if (req.body.downloadUrl !== undefined) updates.downloadUrl = req.body.downloadUrl;
  try {
    const { error } = await supabase.from('bulletins').update(updates).eq('id', id).eq('organization_id', TENANT_ID);
    if (error) throw error;
    const { data: updated, error: findErr } = await supabase.from('bulletins').select('*').eq('id', id).eq('organization_id', TENANT_ID).single();
    if (findErr) throw findErr;
    res.json(mapBulletinFromDb(updated));
  } catch (err: any) {
    console.error('bulletins PUT:', err.message);
    res.status(500).json({ error: 'Error al actualizar el boletín.' });
  }
});

app.delete('/api/bulletins/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('bulletins').delete().eq('id', id).eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error('bulletins DELETE:', err.message);
    res.status(500).json({ error: 'Error al eliminar el boletín.' });
  }
});

// ---- SUBSCRIBERS ----
app.get('/api/subscribers', requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase.from('subscribers').select('*').eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('subscribers GET:', err.message);
    res.status(500).json({ error: 'Error al recuperar suscriptores.' });
  }
});

app.post('/api/subscribers', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@'))
    return res.status(400).json({ error: 'Correo electrónico inválido.' });
  try {
    const { data: existing } = await supabase.from('subscribers').select('*').eq('email', email.trim()).eq('organization_id', TENANT_ID).maybeSingle();
    if (existing) return res.status(400).json({ error: 'Este correo ya está registrado.' });
    const newSub = {
      id: `sub-${Date.now()}`,
      organization_id: TENANT_ID,
      email: email.trim(),
      date: new Date().toISOString()
    };
    const { error } = await supabase.from('subscribers').insert(newSub);
    if (error) throw error;
    res.status(201).json({ success: true, subscriber: newSub });
  } catch (err: any) {
    console.error('subscribers POST:', err.message);
    res.status(500).json({ error: 'Error al procesar suscripción.' });
  }
});

app.delete('/api/subscribers/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('subscribers').delete().eq('id', id).eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error('subscribers DELETE:', err.message);
    res.status(500).json({ error: 'Error al cancelar suscripción.' });
  }
});

// ---- RESET ----
app.post('/api/admin/reset', requireAdmin, async (_req, res) => {
  try {
    await Promise.all([
      supabase.from('projects').delete().eq('organization_id', TENANT_ID),
      supabase.from('donations').delete().eq('organization_id', TENANT_ID),
      supabase.from('messages').delete().eq('organization_id', TENANT_ID),
      supabase.from('blog').delete().eq('organization_id', TENANT_ID),
      supabase.from('bulletins').delete().eq('organization_id', TENANT_ID),
      supabase.from('subscribers').delete().eq('organization_id', TENANT_ID),
      supabase.from('about').delete().eq('organization_id', TENANT_ID),
      supabase.from('carousel').delete().eq('organization_id', TENANT_ID),
      supabase.from('logos').delete().eq('organization_id', TENANT_ID)
    ]);
    await supabase.from('projects').insert(initialProjects.map(p => ({ ...p, organization_id: TENANT_ID })));
    await supabase.from('blog').insert(initialBlog.map(b => ({
      id: b.id, organization_id: TENANT_ID,
      title: b.title, summary: b.summary, content: b.content,
      image: b.image, category: b.category, author: b.author,
      date: b.date, readTime: b.readTime, featured: b.featured, status: 'published'
    })));
    await supabase.from('bulletins').insert(initialBulletins.map(b => ({
      id: b.id, organization_id: TENANT_ID,
      title: b.title, summary: b.summary,
      issueNumber: b.issueNumber, publishDate: b.publishDate,
      downloadUrl: b.downloadUrl, image: b.image, status: 'published'
    })));
    await supabase.from('about').insert({
      id: 'default', organization_id: TENANT_ID,
      introSub: initialAboutUs.introSub, introTitle: initialAboutUs.introTitle,
      introText: initialAboutUs.introText, missionTitle: initialAboutUs.missionTitle,
      missionText: initialAboutUs.missionText, visionTitle: initialAboutUs.visionTitle,
      visionText: initialAboutUs.visionText, imageUrl: initialAboutUs.imageUrl,
      heroImageUrl: initialAboutUs.heroImageUrl, pillars: initialAboutUs.pillars
    });
    await supabase.from('carousel').insert(initialCarouselSlides.map(cs => ({
      id: cs.id, organization_id: TENANT_ID,
      image: cs.image, badge: cs.badge,
      badgeIconName: cs.badgeIconName, title: cs.title, description: cs.description
    })));
    await supabase.from('logos').insert({
      id: 'default', organization_id: TENANT_ID,
      logoColor: initialLogoConfig.logoColor,
      logoGold: initialLogoConfig.logoGold
    });
    res.json({ success: true, message: 'Base de datos restaurada a valores predeterminados.' });
  } catch (err: any) {
    console.error('reset POST:', err.message);
    res.status(500).json({ error: 'Error al restaurar base de datos.' });
  }
});

export default app;
