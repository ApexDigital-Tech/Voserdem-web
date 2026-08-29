import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const TENANT_ID = 'voserdem-bolivia';

async function seed() {
  console.log('Reading data-store.json...');
  const dataPath = path.join(process.cwd(), 'data-store.json');
  const fileContent = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(fileContent);

  if (data.projects && data.projects.length > 0) {
    console.log(`Recuperando ${data.projects.length} proyectos...`);
    for (const p of data.projects) {
      await supabase
        .from('projects')
        .upsert({ ...p, organization_id: TENANT_ID }, { onConflict: 'id' });
    }
  }

  if (data.blog && data.blog.length > 0) {
    console.log(`Recuperando ${data.blog.length} blogs...`);
    for (const b of data.blog) {
      await supabase
        .from('blog')
        .upsert({ ...b, organization_id: TENANT_ID }, { onConflict: 'id' });
    }
  }

  if (data.bulletins && data.bulletins.length > 0) {
    console.log(`Recuperando ${data.bulletins.length} boletines...`);
    for (const b of data.bulletins) {
      await supabase.from('bulletins').upsert(
        {
          id: b.id,
          title: b.title,
          summary: b.summary,
          publish_date: b.publishDate,
          issue_number: b.issueNumber,
          download_url: b.downloadUrl,
          image: b.image,
          organization_id: TENANT_ID,
        },
        { onConflict: 'id' }
      );
    }
  }

  if (data.carouselSlides && data.carouselSlides.length > 0) {
    console.log(`Recuperando ${data.carouselSlides.length} slides de carrusel...`);
    for (const cs of data.carouselSlides) {
      await supabase
        .from('carousel')
        .upsert({ ...cs, organization_id: TENANT_ID }, { onConflict: 'id' });
    }
  }

  if (data.aboutUs) {
    console.log('Recuperando AboutUs...');
    await supabase
      .from('about')
      .upsert({ ...data.aboutUs, id: TENANT_ID, organization_id: TENANT_ID }, { onConflict: 'id' });
  }

  if (data.logoConfig) {
    console.log('Recuperando Logos...');
    await supabase.from('logos').upsert(
      {
        id: TENANT_ID,
        organization_id: TENANT_ID,
        logoColor: data.logoConfig.logoColor,
        logoGold: data.logoConfig.logoGold,
      },
      { onConflict: 'id' }
    );
  }

  console.log('Restauración completada con éxito.');
}

seed().catch(console.error);
