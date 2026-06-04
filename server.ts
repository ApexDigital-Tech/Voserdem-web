import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { supabase } from './src/utils/supabaseClient.js';
import { Project, Donation, Message, BlogPost, Bulletin, Subscriber, CarouselSlide, LogoConfig } from './src/types.js';

const app = express();
const PORT = 3000;
const TENANT_ID = 'voserdem-bolivia';
const ADMIN_PASSKEY = 'voserdem2026';

app.use(express.json());

// ---------------------- ADMIN AUTENTICACION MIDDLEWARE ----------------------
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSKEY) {
    next();
  } else {
    res.status(401).json({ error: 'Acceso denegado. Credenciales de administrador inválidas.' });
  }
}

// ---------------------- DEFAULTS / INITIAL MOCKS ----------------------
const initialBlog = [
  {
    id: 'blog-1',
    title: 'Restauración activa en el Tunari: ¿Por qué plantamos Queñuas?',
    summary: 'La queñua (Polylepis) es un árbol nativo indispensable para recargar los acuíferos de Cochabamba.',
    content: 'En las alturas de la cordillera del Tunari...',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800',
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
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800'
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
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    goal: 15000,
    raised: 8450,
    location: 'Chocaya, Cochabamba, Bolivia',
    impact: 'Más de 500 árboles nativos plantados.',
    details: 'El Ecocamp de Chocaya...'
  }
];

const initialAboutUs = {
  introSub: 'Nuestro Propósito Coherente',
  introTitle: '¿Quiénes Somos en VOSERDEM?',
  introText: 'El Voluntariado de Servicio para el Desarrollo Humano y Medio Ambiente (VOSERDEM) es una institución boliviana...',
  missionTitle: 'Nuestra Misión',
  missionText: 'Promover y consolidar el desarrollo integral...',
  visionTitle: 'Nuestra Visión',
  visionText: 'Constituirnos en un modelo de referencia...',
  imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
  heroImageUrl: 'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=600',
  pillars: [
    { title: 'Desarrollo Humano Integral', description: 'Acompañamos a sectores en vulnerabilidad...', iconName: 'Users' }
  ]
};

const initialCarouselSlides = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    badge: 'Medio Ambiente & Ecología',
    badgeIconName: 'Trees',
    title: 'Sembrando Sostenibilidad, Cultivando Dignidad Humana',
    description: 'Somos una organización sin fines de lucro en Cochabamba, Bolivia.'
  }
];

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

// ---------------------- DATABASE MAPPING HELPERS ----------------------
function mapDonationFromDb(db: any): Donation {
  return {
    id: db.id,
    donorName: db.donor_name,
    email: db.email,
    amount: Number(db.amount),
    projectId: db.project_id,
    projectTitle: db.project_title,
    date: db.date,
    comment: db.comment || ''
  };
}

function mapBlogFromDb(db: any): BlogPost {
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
    status: db.status || 'published'
  };
}

function mapBulletinFromDb(db: any): Bulletin {
  return {
    id: db.id,
    title: db.title,
    summary: db.summary,
    publishDate: db.publish_date,
    issueNumber: db.issue_number,
    downloadUrl: db.download_url || '',
    image: db.image || '',
    status: db.status || 'published'
  };
}

function mapCarouselFromDb(db: any): CarouselSlide {
  return {
    id: db.id,
    image: db.image,
    badge: db.badge || '',
    badgeIconName: db.badge_icon_name || 'Trees',
    title: db.title || '',
    description: db.description || ''
  };
}

function mapAboutFromDb(db: any): any {
  return {
    introSub: db.intro_sub,
    introTitle: db.intro_title,
    introText: db.intro_text,
    missionTitle: db.mission_title,
    missionText: db.mission_text,
    visionTitle: db.vision_title,
    visionText: db.vision_text,
    imageUrl: db.image_url,
    heroImageUrl: db.hero_image_url || '',
    pillars: db.pillars
  };
}

function mapLogosFromDb(db: any): LogoConfig {
  return {
    logoColor: db.logo_color,
    logoGold: db.logo_gold
  };
}

// ---------------------- API ROUTES ----------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'supabase', time: new Date().toISOString() });
});

// CAROUSEL API
app.get('/api/carousel', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('carousel_slides')
      .select('*')
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.json(initialCarouselSlides);
    }
    res.json(data.map(mapCarouselFromDb));
  } catch (err: any) {
    console.error('Error fetching carousel:', err.message);
    res.json(initialCarouselSlides);
  }
});

app.put('/api/carousel', requireAdmin, async (req, res) => {
  const slides = req.body;
  if (!Array.isArray(slides)) {
    return res.status(400).json({ error: 'El carrusel debe ser una lista de diapositivas.' });
  }
  if (slides.length > 5) {
    return res.status(400).json({ error: 'El carrusel debe contener un máximo de 5 fotografías.' });
  }
  try {
    await supabase.from('carousel_slides').delete().eq('organization_id', TENANT_ID);
    const newSlides = slides.map((slide: any) => ({
      id: slide.id || `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organization_id: TENANT_ID,
      image: slide.image,
      badge: slide.badge || '',
      badge_icon_name: slide.badgeIconName || 'Trees',
      title: slide.title || '',
      description: slide.description || ''
    }));
    const { error } = await supabase.from('carousel_slides').insert(newSlides);
    if (error) throw error;
    res.json(newSlides.map(mapCarouselFromDb));
  } catch (err: any) {
    console.error('Error saving carousel:', err.message);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el carrusel.' });
  }
});

// LOGOS API
app.get('/api/logos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('logo_config')
      .select('*')
      .eq('organization_id', TENANT_ID)
      .eq('id', 'default')
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.json(initialLogoConfig);
    res.json(mapLogosFromDb(data));
  } catch (err: any) {
    console.error('Error fetching logos:', err.message);
    res.json(initialLogoConfig);
  }
});

app.put('/api/logos', requireAdmin, async (req, res) => {
  const { logoColor, logoGold } = req.body;
  if (!logoColor || !logoGold) {
    return res.status(400).json({ error: 'Faltan configuraciones indispensables para guardar los logos.' });
  }
  try {
    const { error } = await supabase.from('logo_config').upsert({
      id: 'default',
      organization_id: TENANT_ID,
      logo_color: logoColor,
      logo_gold: logoGold
    });
    if (error) throw error;
    res.json({ logoColor, logoGold });
  } catch (err: any) {
    console.error('Error updating logos:', err.message);
    res.status(500).json({ error: 'Error interno al guardar logotipos.' });
  }
});

// ABOUT US API
app.get('/api/about', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('about_us')
      .select('*')
      .eq('organization_id', TENANT_ID)
      .eq('id', 'default')
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.json(initialAboutUs);
    res.json(mapAboutFromDb(data));
  } catch (err: any) {
    console.error('Error fetching about data:', err.message);
    res.json(initialAboutUs);
  }
});

app.put('/api/about', requireAdmin, async (req, res) => {
  const { introSub, introTitle, introText, missionTitle, missionText, visionTitle, visionText, imageUrl, heroImageUrl, pillars } = req.body;
  try {
    const { error } = await supabase.from('about_us').upsert({
      id: 'default',
      organization_id: TENANT_ID,
      intro_sub: introSub || initialAboutUs.introSub,
      intro_title: introTitle || initialAboutUs.introTitle,
      intro_text: introText || initialAboutUs.introText,
      mission_title: missionTitle || initialAboutUs.missionTitle,
      mission_text: missionText || initialAboutUs.missionText,
      vision_title: visionTitle || initialAboutUs.visionTitle,
      vision_text: visionText || initialAboutUs.visionText,
      image_url: imageUrl || initialAboutUs.imageUrl,
      hero_image_url: heroImageUrl || initialAboutUs.heroImageUrl,
      pillars: Array.isArray(pillars) ? pillars : initialAboutUs.pillars
    });
    if (error) throw error;
    res.json(req.body);
  } catch (err: any) {
    console.error('Error updating about data:', err.message);
    res.status(500).json({ error: 'Error interno al guardar sección Sobre Nosotros.' });
  }
});

// PROJECTS API
app.get('/api/projects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('Error fetching projects:', err.message);
    res.status(500).json({ error: 'Error al recuperar proyectos.' });
  }
});

app.post('/api/projects', requireAdmin, async (req, res) => {
  const { title, description, category, region, area, image, goal, location, impact, details } = req.body;
  if (!title || !description || !category || !goal) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para el proyecto.' });
  }
  const newProject = {
    id: `proj-${Date.now()}`,
    organization_id: TENANT_ID,
    title,
    description,
    category,
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
    console.error('Error creating project:', err.message);
    res.status(500).json({ error: 'Error interno al crear el proyecto.' });
  }
});

app.put('/api/projects/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, category, region, area, image, goal, raised, location, impact, details } = req.body;
  const updates: any = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (category !== undefined) updates.category = category;
  if (region !== undefined) updates.region = region;
  if (area !== undefined) updates.area = area;
  if (image !== undefined) updates.image = image;
  if (goal !== undefined) updates.goal = Number(goal);
  if (raised !== undefined) updates.raised = Number(raised);
  if (location !== undefined) updates.location = location;
  if (impact !== undefined) updates.impact = impact;
  if (details !== undefined) updates.details = details;

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
    console.error('Error updating project:', err.message);
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
    res.json({ success: true, message: 'Proyecto eliminado con éxito.' });
  } catch (err: any) {
    console.error('Error deleting project:', err.message);
    res.status(500).json({ error: 'Error interno al eliminar el proyecto.' });
  }
});

// DONATIONS API
app.post('/api/donations', async (req, res) => {
  const { donorName, email, amount, projectId, comment } = req.body;
  if (!donorName || !email || !amount || !projectId) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para registrar la donación.' });
  }
  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: 'El monto de la donación debe ser un número positivo.' });
  }

  try {
    const { data: proj, error: projErr } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('organization_id', TENANT_ID)
      .maybeSingle();
    if (projErr || !proj) {
      return res.status(404).json({ error: 'Proyecto destinatario no existe.' });
    }

    const newRaised = Number(proj.raised || 0) + amountNum;
    const { error: updateErr } = await supabase
      .from('projects')
      .update({ raised: newRaised })
      .eq('id', projectId)
      .eq('organization_id', TENANT_ID);
    if (updateErr) throw updateErr;

    const newDonation = {
      id: `don-${Date.now()}`,
      organization_id: TENANT_ID,
      donor_name: donorName,
      email,
      amount: amountNum,
      project_id: projectId,
      project_title: proj.title,
      date: new Date().toISOString(),
      comment
    };
    const { error: insertErr } = await supabase.from('donations').insert(newDonation);
    if (insertErr) throw insertErr;

    res.status(201).json({ 
      success: true, 
      donation: mapDonationFromDb(newDonation), 
      currentRaised: newRaised 
    });
  } catch (err: any) {
    console.error('Error registering donation:', err.message);
    res.status(500).json({ error: 'Error al procesar la donación.' });
  }
});

app.get('/api/donations', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json((data || []).map(mapDonationFromDb));
  } catch (err: any) {
    console.error('Error fetching donations:', err.message);
    res.status(500).json({ error: 'Error al recuperar donaciones.' });
  }
});

// CONTACT MESSAGES API
app.post('/api/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Por favor, rellene todos los campos de mensaje.' });
  }
  const newMessage = {
    id: `msg-${Date.now()}`,
    organization_id: TENANT_ID,
    name,
    email,
    subject,
    message,
    date: new Date().toISOString()
  };
  try {
    const { error } = await supabase.from('messages').insert(newMessage);
    if (error) throw error;
    res.status(201).json({ success: true, message: newMessage });
  } catch (err: any) {
    console.error('Error submitting message:', err.message);
    res.status(500).json({ error: 'Error interno al enviar mensaje.' });
  }
});

app.get('/api/messages', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ error: 'Error al recuperar mensajes.' });
  }
});

// BLOG API
app.get('/api/blog', async (req, res) => {
  const showAll = req.query.all === 'true' || req.query.status === 'all';
  try {
    let query = supabase.from('blog').select('*').eq('organization_id', TENANT_ID);
    if (!showAll) {
      query = query.neq('status', 'draft');
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json((data || []).map(mapBlogFromDb));
  } catch (err: any) {
    console.error('Error fetching blog posts:', err.message);
    res.status(500).json({ error: 'Error al recuperar publicaciones.' });
  }
});

app.post('/api/blog', requireAdmin, async (req, res) => {
  const { title, summary, content, image, category, author, readTime, featured, status } = req.body;
  if (!title || !content || !category || !author) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para el artículo del blog.' });
  }
  const newPost = {
    id: `blog-${Date.now()}`,
    organization_id: TENANT_ID,
    title,
    summary: summary || content.slice(0, 150) + '...',
    content,
    image: image || 'https://images.unsplash.com/photo-1469571486040-7a30d1de314a?auto=format&fit=crop&q=80&w=800',
    category,
    author,
    date: new Date().toISOString().split('T')[0],
    read_time: readTime || '3 min',
    featured: !!featured,
    status: status || 'published'
  };
  try {
    const { error } = await supabase.from('blog').insert(newPost);
    if (error) throw error;
    res.status(201).json(mapBlogFromDb(newPost));
  } catch (err: any) {
    console.error('Error creating blog post:', err.message);
    res.status(500).json({ error: 'Error interno al crear el artículo.' });
  }
});

app.put('/api/blog/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, image, category, author, readTime, featured, status } = req.body;
  const updates: any = {};
  if (title !== undefined) updates.title = title;
  if (summary !== undefined) updates.summary = summary;
  if (content !== undefined) updates.content = content;
  if (image !== undefined) updates.image = image;
  if (category !== undefined) updates.category = category;
  if (author !== undefined) updates.author = author;
  if (readTime !== undefined) updates.read_time = readTime;
  if (featured !== undefined) updates.featured = !!featured;
  if (status !== undefined) updates.status = status;

  try {
    const { error } = await supabase
      .from('blog')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', TENANT_ID);
    if (error) throw error;

    const { data: updated, error: findErr } = await supabase
      .from('blog')
      .select('*')
      .eq('id', id)
      .eq('organization_id', TENANT_ID)
      .single();
    if (findErr) throw findErr;
    res.json(mapBlogFromDb(updated));
  } catch (err: any) {
    console.error('Error updating blog post:', err.message);
    res.status(500).json({ error: 'Error interno al actualizar el artículo.' });
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
    res.json({ success: true, message: 'Artículo de blog eliminado con éxito.' });
  } catch (err: any) {
    console.error('Error deleting blog post:', err.message);
    res.status(500).json({ error: 'Error interno al eliminar el artículo.' });
  }
});

// BULLETINS API
app.get('/api/bulletins', async (req, res) => {
  const showAll = req.query.all === 'true' || req.query.status === 'all';
  try {
    let query = supabase.from('bulletins').select('*').eq('organization_id', TENANT_ID);
    if (!showAll) {
      query = query.neq('status', 'draft');
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json((data || []).map(mapBulletinFromDb));
  } catch (err: any) {
    console.error('Error fetching bulletins:', err.message);
    res.status(500).json({ error: 'Error al recuperar boletines.' });
  }
});

app.post('/api/bulletins', requireAdmin, async (req, res) => {
  const { title, summary, issueNumber, downloadUrl, image, status } = req.body;
  if (!title || !summary || !issueNumber) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para el boletín.' });
  }
  const newBulletin = {
    id: `bull-${Date.now()}`,
    organization_id: TENANT_ID,
    title,
    summary,
    issue_number: issueNumber,
    publish_date: new Date().toISOString().split('T')[0],
    download_url: downloadUrl || '',
    image: image || '',
    status: status || 'published'
  };
  try {
    const { error } = await supabase.from('bulletins').insert(newBulletin);
    if (error) throw error;
    res.status(201).json(mapBulletinFromDb(newBulletin));
  } catch (err: any) {
    console.error('Error creating bulletin:', err.message);
    res.status(500).json({ error: 'Error interno al crear el boletín.' });
  }
});

app.put('/api/bulletins/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, summary, issueNumber, downloadUrl, image, status } = req.body;
  const updates: any = {};
  if (title !== undefined) updates.title = title;
  if (summary !== undefined) updates.summary = summary;
  if (issueNumber !== undefined) updates.issue_number = issueNumber;
  if (downloadUrl !== undefined) updates.download_url = downloadUrl;
  if (image !== undefined) updates.image = image;
  if (status !== undefined) updates.status = status;

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
    console.error('Error updating bulletin:', err.message);
    res.status(500).json({ error: 'Error interno al actualizar el boletín.' });
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
    res.json({ success: true, message: 'Boletín eliminado con éxito.' });
  } catch (err: any) {
    console.error('Error deleting bulletin:', err.message);
    res.status(500).json({ error: 'Error interno al eliminar el boletín.' });
  }
});

// NEWSLETTER SUBSCRIBERS API
app.get('/api/subscribers', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('organization_id', TENANT_ID);
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('Error fetching subscribers:', err.message);
    res.status(500).json({ error: 'Error al recuperar suscriptores.' });
  }
});

app.post('/api/subscribers', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Dirección de correo electrónico inválida.' });
  }
  try {
    const { data: existing, error: findErr } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email.trim())
      .eq('organization_id', TENANT_ID)
      .maybeSingle();
    if (findErr) throw findErr;
    if (existing) {
      return res.status(400).json({ error: 'Este correo ya se encuentra registrado en nuestro boletín informativo.' });
    }

    const newSubscriber = {
      id: `sub-${Date.now()}`,
      organization_id: TENANT_ID,
      email: email.trim(),
      date: new Date().toISOString()
    };
    const { error } = await supabase.from('subscribers').insert(newSubscriber);
    if (error) throw error;
    res.status(201).json({ success: true, subscriber: newSubscriber });
  } catch (err: any) {
    console.error('Error adding subscriber:', err.message);
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
    res.json({ success: true, message: 'Suscripción cancelada con éxito.' });
  } catch (err: any) {
    console.error('Error deleting subscriber:', err.message);
    res.status(500).json({ error: 'Error interno al cancelar la suscripción.' });
  }
});

// RESET DATABASE UTILITY
app.post('/api/admin/reset', requireAdmin, async (req, res) => {
  try {
    await Promise.all([
      supabase.from('projects').delete().eq('organization_id', TENANT_ID),
      supabase.from('donations').delete().eq('organization_id', TENANT_ID),
      supabase.from('messages').delete().eq('organization_id', TENANT_ID),
      supabase.from('blog').delete().eq('organization_id', TENANT_ID),
      supabase.from('bulletins').delete().eq('organization_id', TENANT_ID),
      supabase.from('subscribers').delete().eq('organization_id', TENANT_ID),
      supabase.from('about_us').delete().eq('organization_id', TENANT_ID),
      supabase.from('carousel_slides').delete().eq('organization_id', TENANT_ID),
      supabase.from('logo_config').delete().eq('organization_id', TENANT_ID)
    ]);

    await supabase.from('projects').insert(initialProjects.map(p => ({ ...p, organization_id: TENANT_ID })));
    await supabase.from('blog').insert(initialBlog.map(b => ({
      id: b.id,
      organization_id: TENANT_ID,
      title: b.title,
      summary: b.summary,
      content: b.content,
      image: b.image,
      category: b.category,
      author: b.author,
      date: b.date,
      read_time: b.readTime,
      featured: b.featured,
      status: 'published'
    })));
    await supabase.from('bulletins').insert(initialBulletins.map(b => ({
      id: b.id,
      organization_id: TENANT_ID,
      title: b.title,
      summary: b.summary,
      issue_number: b.issueNumber,
      publish_date: b.publishDate,
      download_url: b.downloadUrl,
      image: b.image,
      status: 'published'
    })));
    await supabase.from('about_us').insert({
      id: 'default',
      organization_id: TENANT_ID,
      intro_sub: initialAboutUs.introSub,
      intro_title: initialAboutUs.introTitle,
      intro_text: initialAboutUs.introText,
      mission_title: initialAboutUs.missionTitle,
      mission_text: initialAboutUs.missionText,
      vision_title: initialAboutUs.visionTitle,
      vision_text: initialAboutUs.visionText,
      image_url: initialAboutUs.imageUrl,
      hero_image_url: initialAboutUs.heroImageUrl,
      pillars: initialAboutUs.pillars
    });
    await supabase.from('carousel_slides').insert(initialCarouselSlides.map(cs => ({
      id: cs.id,
      organization_id: TENANT_ID,
      image: cs.image,
      badge: cs.badge,
      badge_icon_name: cs.badgeIconName,
      title: cs.title,
      description: cs.description
    })));
    await supabase.from('logo_config').insert({
      id: 'default',
      organization_id: TENANT_ID,
      logo_color: initialLogoConfig.logoColor,
      logo_gold: initialLogoConfig.logoGold
    });

    res.json({ success: true, message: 'Base de datos de Supabase restaurada a valores predeterminados.' });
  } catch (err: any) {
    console.error('Error resetting database:', err.message);
    res.status(500).json({ error: 'Error interno al restaurar base de datos.' });
  }
});

// ---------------------- VITE / MIDDLEWARE SETUP ----------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
