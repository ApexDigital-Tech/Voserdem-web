import fs from 'fs';
import path from 'path';
import { supabase } from './supabaseClient.js';
import { Project, Donation, Message, BlogPost, Bulletin, Subscriber, CarouselSlide, LogoConfig } from '../types.js';

const DATA_FILE = path.join(process.cwd(), 'data-store.json');
const TENANT_ID = 'voserdem-bolivia';

async function runMigration() {
  console.log('Iniciando migración de datos a Supabase para el tenant:', TENANT_ID);

  if (!fs.existsSync(DATA_FILE)) {
    console.error('Error: El archivo data-store.json no existe en la raíz.');
    process.exit(1);
  }

  const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
  const data = JSON.parse(fileData);

  // 1. Proyectos
  if (data.projects && Array.isArray(data.projects)) {
    console.log(`Migrando ${data.projects.length} proyectos...`);
    // Limpiar proyectos anteriores
    await supabase.from('projects').delete().eq('organization_id', TENANT_ID);
    
    for (const proj of data.projects) {
      const { error } = await supabase.from('projects').insert({
        id: proj.id,
        organization_id: TENANT_ID,
        title: proj.title,
        description: proj.description,
        category: proj.category,
        region: proj.region || 'Valles',
        area: proj.area || 'Medio Ambiente',
        image: proj.image,
        goal: Number(proj.goal),
        raised: Number(proj.raised || 0),
        location: proj.location || 'Bolivia',
        impact: proj.impact || '',
        details: proj.details || proj.description
      });
      if (error) console.error(`Error migrando proyecto ${proj.id}:`, error.message);
    }
  }

  // 2. Donaciones
  if (data.donations && Array.isArray(data.donations)) {
    console.log(`Migrando ${data.donations.length} donaciones...`);
    await supabase.from('donations').delete().eq('organization_id', TENANT_ID);

    for (const don of data.donations) {
      const { error } = await supabase.from('donations').insert({
        id: don.id,
        organization_id: TENANT_ID,
        donor_name: don.donorName,
        email: don.email,
        amount: Number(don.amount),
        project_id: don.projectId,
        project_title: don.projectTitle || 'Proyecto',
        date: don.date || new Date().toISOString(),
        comment: don.comment || ''
      });
      if (error) console.error(`Error migrando donación ${don.id}:`, error.message);
    }
  }

  // 3. Mensajes
  if (data.messages && Array.isArray(data.messages)) {
    console.log(`Migrando ${data.messages.length} mensajes...`);
    await supabase.from('messages').delete().eq('organization_id', TENANT_ID);

    for (const msg of data.messages) {
      const { error } = await supabase.from('messages').insert({
        id: msg.id,
        organization_id: TENANT_ID,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        date: msg.date || new Date().toISOString()
      });
      if (error) console.error(`Error migrando mensaje ${msg.id}:`, error.message);
    }
  }

  // 4. Blog
  if (data.blog && Array.isArray(data.blog)) {
    console.log(`Migrando ${data.blog.length} artículos de blog...`);
    await supabase.from('blog').delete().eq('organization_id', TENANT_ID);

    for (const b of data.blog) {
      const { error } = await supabase.from('blog').insert({
        id: b.id,
        organization_id: TENANT_ID,
        title: b.title,
        summary: b.summary || '',
        content: b.content,
        image: b.image,
        category: b.category,
        author: b.author,
        date: b.date || new Date().toISOString().split('T')[0],
        read_time: b.readTime || '3 min',
        featured: !!b.featured,
        status: b.status || 'published'
      });
      if (error) console.error(`Error migrando blog ${b.id}:`, error.message);
    }
  }

  // 5. Boletines
  if (data.bulletins && Array.isArray(data.bulletins)) {
    console.log(`Migrando ${data.bulletins.length} boletines...`);
    await supabase.from('bulletins').delete().eq('organization_id', TENANT_ID);

    for (const bull of data.bulletins) {
      const { error } = await supabase.from('bulletins').insert({
        id: bull.id,
        organization_id: TENANT_ID,
        title: bull.title,
        summary: bull.summary,
        publish_date: bull.publishDate || new Date().toISOString().split('T')[0],
        issue_number: bull.issueNumber,
        download_url: bull.downloadUrl || '',
        image: bull.image || '',
        status: bull.status || 'published'
      });
      if (error) console.error(`Error migrando boletín ${bull.id}:`, error.message);
    }
  }

  // 6. Suscriptores
  if (data.subscribers && Array.isArray(data.subscribers)) {
    console.log(`Migrando ${data.subscribers.length} suscriptores...`);
    await supabase.from('subscribers').delete().eq('organization_id', TENANT_ID);

    for (const sub of data.subscribers) {
      const { error } = await supabase.from('subscribers').insert({
        id: sub.id,
        organization_id: TENANT_ID,
        email: sub.email,
        date: sub.date || new Date().toISOString()
      });
      if (error) console.error(`Error migrando suscriptor ${sub.id}:`, error.message);
    }
  }

  // 7. About Us
  if (data.aboutUs) {
    console.log('Migrando configuración Sobre Nosotros...');
    await supabase.from('about_us').delete().eq('organization_id', TENANT_ID);

    const ab = data.aboutUs;
    const { error } = await supabase.from('about_us').insert({
      id: 'default',
      organization_id: TENANT_ID,
      intro_sub: ab.introSub,
      intro_title: ab.introTitle,
      intro_text: ab.introText,
      mission_title: ab.missionTitle,
      mission_text: ab.missionText,
      vision_title: ab.visionTitle,
      vision_text: ab.visionText,
      image_url: ab.imageUrl,
      hero_image_url: ab.heroImageUrl || '',
      pillars: ab.pillars
    });
    if (error) console.error('Error migrando Sobre Nosotros:', error.message);
  }

  // 8. Carrusel slides
  if (data.carouselSlides && Array.isArray(data.carouselSlides)) {
    console.log(`Migrando ${data.carouselSlides.length} diapositivas de carrusel...`);
    await supabase.from('carousel_slides').delete().eq('organization_id', TENANT_ID);

    for (const cs of data.carouselSlides) {
      const { error } = await supabase.from('carousel_slides').insert({
        id: cs.id,
        organization_id: TENANT_ID,
        image: cs.image,
        badge: cs.badge || '',
        badge_icon_name: cs.badgeIconName || 'Trees',
        title: cs.title || '',
        description: cs.description || ''
      });
      if (error) console.error(`Error migrando slide ${cs.id}:`, error.message);
    }
  }

  // 9. Logos
  if (data.logoConfig) {
    console.log('Migrando configuración de Logos...');
    await supabase.from('logo_config').delete().eq('organization_id', TENANT_ID);

    const { error } = await supabase.from('logo_config').insert({
      id: 'default',
      organization_id: TENANT_ID,
      logo_color: data.logoConfig.logoColor,
      logo_gold: data.logoConfig.logoGold
    });
    if (error) console.error('Error migrando Logos:', error.message);
  }

  console.log('Migración completada con éxito.');
}

runMigration().catch((err) => {
  console.error('Error fatal durante la migración:', err);
});
