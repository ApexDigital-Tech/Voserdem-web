/**
 * Vercel Serverless Function — VOSERDEM API
 *
 * This file is self-contained to avoid Vercel esbuild path resolution issues.
 * All backend logic that was in server.ts is duplicated here so that
 * Vercel can bundle it in one shot without cross-directory imports.
 *
 * server.ts is still used for LOCAL development (npm run dev).
 */
import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// ---- Environment validation (fail-fast on missing secrets) ----
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY;

if (!supabaseUrl || !supabaseAnonKey || !ADMIN_PASSKEY) {
  throw new Error(
    'Missing required environment variables: SUPABASE_URL, SUPABASE_ANON_KEY, and ADMIN_PASSKEY must be set.'
  );
}

if (!supabaseServiceKey) {
  console.warn(
    '⚠️ [SECURITY WARNING] SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to SUPABASE_ANON_KEY. ' +
      'Database writes will fail if RLS policies are properly secured.'
  );
}

// Use Service Role Key for backend operations to bypass RLS and perform admin tasks securely.
// Fallback to Anon Key only for backward compatibility if the service key is missing.
const activeKey = supabaseServiceKey || supabaseAnonKey;
const supabase = createClient(supabaseUrl, activeKey);

const app = express();
const TENANT_ID = 'voserdem-bolivia';

app.use(express.json());

// ---- Auth middleware ----
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSKEY) return next();
  res.status(401).json({ error: 'Acceso denegado. Credenciales de administrador inválidas.' });
}

// ---- Dedicated auth endpoint (no DB queries) ----
app.post('/api/auth/verify', (req, res) => {
  const adminPassword = req.headers['x-admin-password'];

  if (!adminPassword || adminPassword !== ADMIN_PASSKEY) {
    return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
  }

  return res.status(200).json({ success: true, message: 'Autenticación exitosa' });
});

// ---- Default data ----
const initialLogoConfig = {
  logoColor: {
    brandName: 'VOSERDEM',
    slogan: 'Voluntarios al Servicio de los Demás',
    useCustomImage: false,
    imageUrl: '',
  },
  logoGold: {
    brandName: 'VOSERDEM',
    slogan: 'Una Bolivia mejor es posible',
    useCustomImage: false,
    imageUrl: '',
  },
};

const initialAboutUs = {
  introSub: 'Asociación de Laicos Católicos · Bolivia',
  introTitle: 'Institución con Alma, Resultados y Visión',
  introText:
    'Nacidos en 1993 en la Parroquia Compañía de Jesús al servicio de poblaciones migrantes temporales. Hoy somos una obra sostenida por voluntarios, fundadores y aliados internacionales, que responde a la extrema vulnerabilidad con acciones estructurales: unidades académicas, comedores comunitarios, centros multifuncionales y ecocampos que unen el desarrollo humano y la espiritualidad de servicio.',
  missionTitle: 'Nuestra Misión',
  missionText:
    'Servir a las poblaciones más vulnerables de Bolivia aplicando el Modelo de Desarrollo Sostenible Integral (DSI). Nuestra labor articula la formación educativa (técnica y superior), el sustento nutricional en comedores comunitarios, el acompañamiento directo a sectores marginados y el cuidado responsable de la casa común a través de la agroforestería y el desarrollo territorial; todo ello cimentado en la espiritualidad cristiana y el compromiso voluntario.',
  visionTitle: 'Nuestra Visión 2030',
  visionText:
    'Consolidar operativamente nuestra institución a nivel nacional e internacional, afianzando la plena sostenibilidad de nuestras obras estructurales: las Unidades Académicas (UAS UCB V), los Centros Multifuncionales y los programas de atención comunitaria. Aspiramos a una presencia autónoma y transformadora en los Sitios Piloto Andino, Valles, Amazónico y Chaco, demostrando que una Bolivia mejor, justa y equitativa es posible.',
  imageUrl:
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
  heroImageUrl:
    'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=600',
  pillars: [
    {
      title: 'Sitio Piloto Andino',
      description:
        'Sacaca, Norte de Potosí y Kami. Centro Multifuncional «Gabriela» y Unidad Académica Sacaca (UAS UCB V). Intervención en zonas de extrema pobreza con infraestructura educativa y de servicio social.',
      iconName: 'Landmark',
    },
    {
      title: 'Sitio Piloto Valles',
      description:
        'Quillacollo, Cercado y Ecocampo Chocaya. Raíz fundacional en la Parroquia Compañía de Jesús. Agroforestería, energía solar y acompañamiento a comunidades rurales.',
      iconName: 'Leaf',
    },
    {
      title: 'Sitio Piloto Amazónico',
      description:
        'Villa Tunari, El Torno y Norte Integrado Cruceño. Comedores escolares y descentralización de la acción educativa en el trópico boliviano.',
      iconName: 'Users',
    },
    {
      title: 'Sitio Piloto Chaco',
      description:
        'Región en gestación estratégica. VOSERDEM avanza hacia la presencia integral en las cuatro grandes bioregiones de Bolivia, completando su cobertura territorial nacional.',
      iconName: 'Compass',
    },
  ],
};

const initialCarouselSlides = [
  {
    id: 'slide-1',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    badge: '34 Años de Servicio',
    badgeIconName: 'Award',
    title: 'Una *Bolivia mejor* es posible',
    description:
      'Con la voluntad de hacer bien el bien y siguiendo las huellas de Jesús. 34 años de trayectoria en Cochabamba, Potosí y Santa Cruz.',
  },
  {
    id: 'slide-2',
    image:
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1600',
    badge: 'Desarrollo Humano',
    badgeIconName: 'Heart',
    title: 'Educación, Salud y *Dignidad*',
    description:
      'Impactando a más de 1200 estudiantes en comedores escolares y brindando atención cálida a las abuelitas de Cochabamba.',
  },
  {
    id: 'slide-3',
    image:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600',
    badge: 'Impacto Territorial',
    badgeIconName: 'Landmark',
    title: 'De los *Andes* al *Oriente*',
    description:
      'Transformando comunidades en Sacaca, Quillacollo, Villa Tunari y el Norte Integrado Cruceño mediante desarrollo sostenible.',
  },
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
    details: 'El Ecocamp de Chocaya...',
  },
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
    featured: true,
  },
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
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
  },
];

// ---- DB mappers ----
function mapDonationFromDb(db: any) {
  return {
    id: db.id,
    donorName: db.donor_name,
    email: db.email,
    amount: Number(db.amount),
    projectId: db.project_id,
    projectTitle: db.project_title,
    date: db.date,
    comment: db.comment || '',
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
    readTime: db.read_time || '3 min',
    featured: !!db.featured,
    status: db.status || 'published',
  };
}

function mapBulletinFromDb(db: any) {
  return {
    id: db.id,
    title: db.title,
    summary: db.summary,
    publishDate: db.publish_date,
    issueNumber: db.issue_number,
    downloadUrl: db.download_url || '',
    image: db.image || '',
    status: db.status || 'published',
  };
}

function mapCarouselFromDb(db: any) {
  return {
    id: db.id,
    image: db.image,
    badge: db.badge || '',
    badgeIconName: db.badgeIconName || 'Trees',
    title: db.title || '',
    description: db.description || '',
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
    heroImageUrl: db.heroImageUrl || '',
    pillars: db.pillars,
  };
}

function mapLogosFromDb(db: any) {
  return {
    logoColor: db.logoColor,
    logoGold: db.logoGold,
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
      description: s.description || '',
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
      logoGold: typeof logoGold === 'string' ? JSON.parse(logoGold) : logoGold,
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
    introSub,
    introTitle,
    introText,
    missionTitle,
    missionText,
    visionTitle,
    visionText,
    imageUrl,
    heroImageUrl,
    pillars,
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
      pillars:
        typeof pillars === 'string'
          ? JSON.parse(pillars)
          : Array.isArray(pillars)
            ? pillars
            : initialAboutUs.pillars,
    });
    if (error) throw error;
    res.json(req.body);
  } catch (err: any) {
    console.error('about PUT:', err.message);
    res.status(500).json({ error: 'Error interno al guardar sección Sobre Nosotros.' });
  }
});

// ---- GENERIC PAGES CMS (Bridge Solution) ----
app.get('/api/pages/:pageId', async (req, res) => {
  const { pageId } = req.params;
  try {
    const { data, error } = await supabase
      .from('about')
      .select('pillars')
      .eq('organization_id', TENANT_ID)
      .eq('id', pageId)
      .maybeSingle();

    if (error) throw error;
    // We store the generic page blocks inside the 'pillars' JSON column
    res.json(data && data.pillars ? data.pillars : []);
  } catch (err: any) {
    console.error(`pages GET [${pageId}]:`, err.message);
    res.json([]);
  }
});

app.put('/api/pages/:pageId', requireAdmin, async (req, res) => {
  const { pageId } = req.params;
  const blocks = req.body.blocks || [];
  try {
    const { error } = await supabase.from('about').upsert({
      id: pageId,
      organization_id: TENANT_ID,
      introSub: '',
      introTitle: '',
      introText: '',
      missionTitle: '',
      missionText: '',
      visionTitle: '',
      visionText: '',
      imageUrl: '',
      heroImageUrl: '',
      pillars: blocks,
    });
    if (error) throw error;
    res.json(blocks);
  } catch (err: any) {
    console.error(`pages PUT [${pageId}]:`, err.message);
    res.status(500).json({ error: 'Error interno al guardar la página.' });
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
    title,
    description,
    category,
    region: region || 'Valles',
    area: area || 'Medio Ambiente',
    image:
      image ||
      'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=800',
    goal: Number(goal),
    raised: 0,
    location: location || 'Cochabamba, Bolivia',
    impact: impact || '',
    details: details || description,
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
  const fields = [
    'title',
    'description',
    'category',
    'region',
    'area',
    'image',
    'location',
    'impact',
    'details',
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });
  if (req.body.goal !== undefined) updates.goal = Number(req.body.goal);
  if (req.body.raised !== undefined) updates.raised = Number(req.body.raised);
  try {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    const { data: updated, error: findErr } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('organization_id', TENANT_ID)
      .single();
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
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('organization_id', TENANT_ID);
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
    const { data: proj, error: projErr } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('organization_id', TENANT_ID)
      .maybeSingle();
    if (projErr || !proj) return res.status(404).json({ error: 'Proyecto no existe.' });
    const newRaised = Number(proj.raised || 0) + amountNum;
    await supabase
      .from('projects')
      .update({ raised: newRaised })
      .eq('id', projectId)
      .eq('organization_id', TENANT_ID);
    const newDonation = {
      id: `don-${Date.now()}`,
      organization_id: TENANT_ID,
      donor_name: donorName,
      email,
      amount: amountNum,
      project_id: projectId,
      project_title: proj.title,
      date: new Date().toISOString(),
      comment,
    };
    const { error } = await supabase.from('donations').insert(newDonation);
    if (error) throw error;
    res
      .status(201)
      .json({ success: true, donation: mapDonationFromDb(newDonation), currentRaised: newRaised });
  } catch (err: any) {
    console.error('donations POST:', err.message);
    res.status(500).json({ error: 'Error al procesar la donación.' });
  }
});

app.get('/api/donations', requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('organization_id', TENANT_ID);
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
    name,
    email,
    subject,
    message,
    date: new Date().toISOString(),
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
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('organization_id', TENANT_ID);
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
    if (!showAll) query = query.or('status.neq.draft,status.is.null');
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
    image:
      image ||
      'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=800',
    category,
    author,
    date: new Date().toISOString().split('T')[0],
    read_time: readTime || '3 min',
    featured: !!featured,
    status: status || 'published',
  };
  try {
    const { error } = await supabase.from('blog').insert(newPost);
    if (error) throw error;
    res.status(201).json(mapBlogFromDb(newPost));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving about config' });
  }
});

// ---------------------------------------------------------------------------
// IMPACTO TERRITORIAL ENDPOINTS
// ---------------------------------------------------------------------------
const initialImpactoData = {
  mainTitle: 'Impacto Territorial',
  mainSubtitle: 'Presencia Nacional',
  introText:
    'Organización civil boliviana sin fines de lucro, inspirada espiritualmente y sostenida por voluntarios, ejecutando proyectos de desarrollo sostenible integral en 4 regiones clave del país.',
  sites: [
    {
      id: 'andino',
      name: 'Sitio Andino',
      location: 'Sacaca y Norte de Potosí',
      description:
        'Intervención en zonas de extrema pobreza con infraestructura educativa y de servicio social.',
      image:
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
      order: 1,
      stats: [
        { icon: 'Users', label: 'Beneficiarios', value: '3,500+' },
        { icon: 'BookOpen', label: 'Educación', value: 'UAS UCB V' },
      ],
    },
    {
      id: 'valles',
      name: 'Sitio Valles',
      location: 'Quillacollo, Cercado y Ecocampo Chocaya',
      description:
        'Raíz fundacional. Agroforestería, energía solar y acompañamiento a comunidades rurales.',
      image:
        'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=800',
      order: 2,
      stats: [
        { icon: 'Leaf', label: 'Ecocampo', value: 'Activo' },
        { icon: 'Sun', label: 'Energía', value: 'Solar' },
      ],
    },
    {
      id: 'amazonico',
      name: 'Sitio Amazónico',
      location: 'Villa Tunari y El Torno',
      description:
        'Comedores escolares y descentralización de la acción educativa en el trópico boliviano.',
      image:
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800',
      order: 3,
      stats: [
        { icon: 'Coffee', label: 'Comedores', value: '2 Activos' },
        { icon: 'Users', label: 'Niños', value: '850+' },
      ],
    },
    {
      id: 'chaco',
      name: 'Sitio Chaco',
      location: 'Región del Chaco Boliviano',
      description:
        'Nuestro polo de desarrollo en gestación. Estamos mapeando necesidades críticas de agua y desarrollo productivo para expandir nuestro modelo DSI a esta región.',
      image:
        'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800',
      order: 4,
      stats: [
        { icon: 'Map', label: 'Fase', value: 'Gestación' },
        { icon: 'Droplets', label: 'Prioridad', value: 'Agua' },
      ],
    },
  ],
};

app.get('/api/impacto', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('impact_territorial')
      .select('*')
      .eq('organization_id', TENANT_ID)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.json(initialImpactoData);
    }

    // Convert snake_case from DB to camelCase for the frontend
    res.json({
      mainTitle: data.mainTitle || initialImpactoData.mainTitle,
      mainSubtitle: data.mainSubtitle || initialImpactoData.mainSubtitle,
      introText: data.introText || initialImpactoData.introText,
      sites: data.sites || initialImpactoData.sites,
    });
  } catch (err) {
    console.error(err);
    res.json(initialImpactoData);
  }
});

app.put('/api/impacto', requireAdmin, async (req: any, res: any) => {
  try {
    const { mainTitle, mainSubtitle, introText, sites } = req.body;

    const { data, error } = await supabase
      .from('impact_territorial')
      .upsert({
        id: TENANT_ID,
        organization_id: TENANT_ID,
        mainTitle,
        mainSubtitle,
        introText,
        sites,
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving impacto config' });
  }
});

app.put('/api/blog/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates: any = {};
  const fields = ['title', 'summary', 'content', 'image', 'category', 'author', 'status'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });
  if (req.body.readTime !== undefined) updates.read_time = req.body.readTime;
  if (req.body.featured !== undefined) updates.featured = !!req.body.featured;
  try {
    // Check if record exists first (handles IDs created locally that aren't in Supabase)
    const { data: existing } = await supabase
      .from('blog')
      .select('id')
      .eq('id', id)
      .eq('organization_id', TENANT_ID)
      .maybeSingle();

    if (existing) {
      // Record exists — standard update
      const { error } = await supabase
        .from('blog')
        .update(updates)
        .eq('id', id)
        .eq('organization_id', TENANT_ID);
      if (error) throw error;
    } else {
      // Record does not exist in Supabase — upsert from body to avoid data loss
      const upsertRow = {
        id,
        organization_id: TENANT_ID,
        title: req.body.title || 'Sin título',
        summary: req.body.summary || '',
        content: req.body.content || '',
        image: req.body.image || '',
        category: req.body.category || 'Institucional',
        author: req.body.author || 'VOSERDEM',
        date: req.body.date || new Date().toISOString().split('T')[0],
        read_time: req.body.readTime || '3 min',
        featured: !!req.body.featured,
        status: req.body.status || 'published',
        ...updates,
      };
      const { error } = await supabase.from('blog').upsert(upsertRow);
      if (error) throw error;
    }

    const { data: updated, error: findErr } = await supabase
      .from('blog')
      .select('*')
      .eq('id', id)
      .eq('organization_id', TENANT_ID)
      .maybeSingle();
    if (findErr) throw findErr;
    res.json(updated ? mapBlogFromDb(updated) : { id, ...updates });
  } catch (err: any) {
    console.error('blog PUT:', err.message);
    res.status(500).json({ error: 'Error al actualizar el artículo.' });
  }
});

app.delete('/api/blog/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('blog')
      .delete()
      .eq('id', id)
      .eq('organization_id', TENANT_ID);
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
    title,
    summary,
    issue_number: issueNumber,
    publish_date: new Date().toISOString().split('T')[0],
    download_url: downloadUrl || '',
    image: image || '',
    status: status || 'published',
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
  const fields = ['title', 'summary', 'image', 'status'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });
  if (req.body.issueNumber !== undefined) updates.issue_number = req.body.issueNumber;
  if (req.body.downloadUrl !== undefined) updates.download_url = req.body.downloadUrl;
  try {
    const { error } = await supabase
      .from('bulletins')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    const { data: updated, error: findErr } = await supabase
      .from('bulletins')
      .select('*')
      .eq('id', id)
      .eq('organization_id', TENANT_ID)
      .single();
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
    const { error } = await supabase
      .from('bulletins')
      .delete()
      .eq('id', id)
      .eq('organization_id', TENANT_ID);
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
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('organization_id', TENANT_ID);
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
    const { data: existing } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email.trim())
      .eq('organization_id', TENANT_ID)
      .maybeSingle();
    if (existing) return res.status(400).json({ error: 'Este correo ya está registrado.' });
    const newSub = {
      id: `sub-${Date.now()}`,
      organization_id: TENANT_ID,
      email: email.trim(),
      date: new Date().toISOString(),
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
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id)
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error('subscribers DELETE:', err.message);
    res.status(500).json({ error: 'Error al cancelar suscripción.' });
  }
});

// Endpoint de reseteo eliminado por seguridad (Fase 0)

export default app;
