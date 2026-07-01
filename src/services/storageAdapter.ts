import fs from 'fs';
import path from 'path';
import { supabase } from '../utils/supabaseClient.js';
import { Project, Donation, Message, BlogPost, Bulletin, Subscriber, CarouselSlide, LogoConfig } from '../types.js';

const DATA_FILE = path.join(process.cwd(), 'data-store.json');

// --- Types ---
export interface IStorage {
  resetData(tenantId: string, initialData: any): Promise<void>;

  getProjects(tenantId: string): Promise<Project[]>;
  getProjectById(id: string, tenantId: string): Promise<Project | null>;
  createProject(project: any): Promise<Project>;
  updateProject(id: string, tenantId: string, updates: any): Promise<Project | null>;
  deleteProject(id: string, tenantId: string): Promise<void>;

  getDonations(tenantId: string): Promise<Donation[]>;
  createDonation(donation: any): Promise<Donation>;

  getMessages(tenantId: string): Promise<Message[]>;
  createMessage(message: any): Promise<Message>;

  getBlogPosts(tenantId: string, showAll: boolean): Promise<BlogPost[]>;
  createBlogPost(post: any): Promise<BlogPost>;
  updateBlogPost(id: string, tenantId: string, updates: any): Promise<BlogPost | null>;
  deleteBlogPost(id: string, tenantId: string): Promise<void>;

  getBulletins(tenantId: string, showAll: boolean): Promise<Bulletin[]>;
  createBulletin(bulletin: any): Promise<Bulletin>;
  updateBulletin(id: string, tenantId: string, updates: any): Promise<Bulletin | null>;
  deleteBulletin(id: string, tenantId: string): Promise<void>;

  getSubscribers(tenantId: string): Promise<Subscriber[]>;
  getSubscriberByEmail(email: string, tenantId: string): Promise<Subscriber | null>;
  createSubscriber(subscriber: any): Promise<Subscriber>;
  deleteSubscriber(id: string, tenantId: string): Promise<void>;

  getCarouselSlides(tenantId: string): Promise<CarouselSlide[]>;
  updateCarouselSlides(tenantId: string, slides: any[]): Promise<CarouselSlide[]>;

  getLogoConfig(tenantId: string): Promise<LogoConfig | null>;
  updateLogoConfig(tenantId: string, config: any): Promise<LogoConfig>;

  getAboutUs(tenantId: string): Promise<any | null>;
  updateAboutUs(tenantId: string, config: any): Promise<any>;
}

// --- Mappers ---
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

function mapDonationToDb(d: any, tenantId: string): any {
  return {
    id: d.id,
    organization_id: tenantId,
    donor_name: d.donorName,
    email: d.email,
    amount: d.amount,
    project_id: d.projectId,
    project_title: d.projectTitle,
    date: d.date,
    comment: d.comment
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

function mapBlogToDb(b: any, tenantId: string): any {
  const res: any = { organization_id: tenantId };
  if (b.id) res.id = b.id;
  if (b.title !== undefined) res.title = b.title;
  if (b.summary !== undefined) res.summary = b.summary;
  if (b.content !== undefined) res.content = b.content;
  if (b.image !== undefined) res.image = b.image;
  if (b.category !== undefined) res.category = b.category;
  if (b.author !== undefined) res.author = b.author;
  if (b.date !== undefined) res.date = b.date;
  if (b.readTime !== undefined) res.read_time = b.readTime;
  if (b.featured !== undefined) res.featured = !!b.featured;
  if (b.status !== undefined) res.status = b.status;
  return res;
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

function mapBulletinToDb(b: any, tenantId: string): any {
  const res: any = { organization_id: tenantId };
  if (b.id) res.id = b.id;
  if (b.title !== undefined) res.title = b.title;
  if (b.summary !== undefined) res.summary = b.summary;
  if (b.publishDate !== undefined) res.publish_date = b.publishDate;
  if (b.issueNumber !== undefined) res.issue_number = b.issueNumber;
  if (b.downloadUrl !== undefined) res.download_url = b.downloadUrl;
  if (b.image !== undefined) res.image = b.image;
  if (b.status !== undefined) res.status = b.status;
  return res;
}

function mapCarouselFromDb(db: any): CarouselSlide {
  return {
    id: db.id,
    image: db.image,
    badge: db.badge || '',
    badgeIconName: db.badgeIconName || 'Trees',
    title: db.title || '',
    description: db.description || ''
  };
}

function mapAboutFromDb(db: any): any {
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
    pillars: db.pillars
  };
}

function mapAboutToDb(a: any, tenantId: string): any {
  return {
    id: 'default',
    organization_id: tenantId,
    introSub: a.introSub,
    introTitle: a.introTitle,
    introText: a.introText,
    missionTitle: a.missionTitle,
    missionText: a.missionText,
    visionTitle: a.visionTitle,
    visionText: a.visionText,
    imageUrl: a.imageUrl,
    heroImageUrl: a.heroImageUrl,
    pillars: a.pillars
  };
}

function mapLogosFromDb(db: any): LogoConfig {
  return {
    logoColor: db.logoColor,
    logoGold: db.logoGold
  };
}

// --- Supabase Implementation ---
export class SupabaseStorage implements IStorage {
  async resetData(tenantId: string, initialData: any): Promise<void> {
    await Promise.all([
      supabase.from('projects').delete().eq('organization_id', tenantId),
      supabase.from('donations').delete().eq('organization_id', tenantId),
      supabase.from('messages').delete().eq('organization_id', tenantId),
      supabase.from('blog').delete().eq('organization_id', tenantId),
      supabase.from('bulletins').delete().eq('organization_id', tenantId),
      supabase.from('subscribers').delete().eq('organization_id', tenantId),
      supabase.from('about').delete().eq('organization_id', tenantId),
      supabase.from('carousel').delete().eq('organization_id', tenantId),
      supabase.from('logos').delete().eq('organization_id', tenantId)
    ]);

    await supabase.from('projects').insert(initialData.initialProjects.map((p: any) => ({ ...p, organization_id: tenantId })));
    await supabase.from('blog').insert(initialData.initialBlog.map((b: any) => mapBlogToDb(b, tenantId)));
    await supabase.from('bulletins').insert(initialData.initialBulletins.map((b: any) => mapBulletinToDb(b, tenantId)));
    
    await supabase.from('about').insert(mapAboutToDb(initialData.initialAboutUs, tenantId));
    
    await supabase.from('carousel').insert(initialData.initialCarouselSlides.map((slide: any) => ({
      id: slide.id,
      organization_id: tenantId,
      image: slide.image,
      badge: slide.badge,
      badgeIconName: slide.badgeIconName,
      title: slide.title,
      description: slide.description
    })));
    
    await supabase.from('logos').insert({
      id: 'default',
      organization_id: tenantId,
      logo_color: initialData.initialLogoConfig.logoColor,
      logo_gold: initialData.initialLogoConfig.logoGold
    });
  }

  async getProjects(tenantId: string): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*').eq('organization_id', tenantId);
    if (error) throw error;
    return data || [];
  }

  async getProjectById(id: string, tenantId: string): Promise<Project | null> {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).eq('organization_id', tenantId).maybeSingle();
    if (error) throw error;
    return data;
  }

  async createProject(project: any): Promise<Project> {
    const { error } = await supabase.from('projects').insert(project);
    if (error) throw error;
    return project as Project;
  }

  async updateProject(id: string, tenantId: string, updates: any): Promise<Project | null> {
    const { error } = await supabase.from('projects').update(updates).eq('id', id).eq('organization_id', tenantId);
    if (error) throw error;
    return this.getProjectById(id, tenantId);
  }

  async deleteProject(id: string, tenantId: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id).eq('organization_id', tenantId);
    if (error) throw error;
  }

  async getDonations(tenantId: string): Promise<Donation[]> {
    const { data, error } = await supabase.from('donations').select('*').eq('organization_id', tenantId);
    if (error) throw error;
    return (data || []).map(mapDonationFromDb);
  }

  async createDonation(donation: any): Promise<Donation> {
    const dbObj = mapDonationToDb(donation, donation.organization_id);
    const { error } = await supabase.from('donations').insert(dbObj);
    if (error) throw error;
    return mapDonationFromDb(dbObj);
  }

  async getMessages(tenantId: string): Promise<Message[]> {
    const { data, error } = await supabase.from('messages').select('*').eq('organization_id', tenantId);
    if (error) throw error;
    return data || [];
  }

  async createMessage(message: any): Promise<Message> {
    const { error } = await supabase.from('messages').insert(message);
    if (error) throw error;
    return message;
  }

  async getBlogPosts(tenantId: string, showAll: boolean): Promise<BlogPost[]> {
    let query = supabase.from('blog').select('*').eq('organization_id', tenantId);
    if (!showAll) query = query.neq('status', 'draft');
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapBlogFromDb);
  }

  async createBlogPost(post: any): Promise<BlogPost> {
    const dbObj = mapBlogToDb(post, post.organization_id);
    const { error } = await supabase.from('blog').insert(dbObj);
    if (error) throw error;
    return mapBlogFromDb(dbObj);
  }

  async updateBlogPost(id: string, tenantId: string, updates: any): Promise<BlogPost | null> {
    const dbUpdates = mapBlogToDb(updates, tenantId);
    delete dbUpdates.organization_id;
    const { error } = await supabase.from('blog').update(dbUpdates).eq('id', id).eq('organization_id', tenantId);
    if (error) throw error;
    const { data } = await supabase.from('blog').select('*').eq('id', id).eq('organization_id', tenantId).single();
    return data ? mapBlogFromDb(data) : null;
  }

  async deleteBlogPost(id: string, tenantId: string): Promise<void> {
    const { error } = await supabase.from('blog').delete().eq('id', id).eq('organization_id', tenantId);
    if (error) throw error;
  }

  async getBulletins(tenantId: string, showAll: boolean): Promise<Bulletin[]> {
    let query = supabase.from('bulletins').select('*').eq('organization_id', tenantId);
    if (!showAll) query = query.neq('status', 'draft');
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapBulletinFromDb);
  }

  async createBulletin(bulletin: any): Promise<Bulletin> {
    const dbObj = mapBulletinToDb(bulletin, bulletin.organization_id);
    const { error } = await supabase.from('bulletins').insert(dbObj);
    if (error) throw error;
    return mapBulletinFromDb(dbObj);
  }

  async updateBulletin(id: string, tenantId: string, updates: any): Promise<Bulletin | null> {
    const dbUpdates = mapBulletinToDb(updates, tenantId);
    delete dbUpdates.organization_id;
    const { error } = await supabase.from('bulletins').update(dbUpdates).eq('id', id).eq('organization_id', tenantId);
    if (error) throw error;
    const { data } = await supabase.from('bulletins').select('*').eq('id', id).eq('organization_id', tenantId).single();
    return data ? mapBulletinFromDb(data) : null;
  }

  async deleteBulletin(id: string, tenantId: string): Promise<void> {
    const { error } = await supabase.from('bulletins').delete().eq('id', id).eq('organization_id', tenantId);
    if (error) throw error;
  }

  async getSubscribers(tenantId: string): Promise<Subscriber[]> {
    const { data, error } = await supabase.from('subscribers').select('*').eq('organization_id', tenantId);
    if (error) throw error;
    return data || [];
  }

  async getSubscriberByEmail(email: string, tenantId: string): Promise<Subscriber | null> {
    const { data, error } = await supabase.from('subscribers').select('*').eq('email', email).eq('organization_id', tenantId).maybeSingle();
    if (error) throw error;
    return data;
  }

  async createSubscriber(subscriber: any): Promise<Subscriber> {
    const { error } = await supabase.from('subscribers').insert(subscriber);
    if (error) throw error;
    return subscriber;
  }

  async deleteSubscriber(id: string, tenantId: string): Promise<void> {
    const { error } = await supabase.from('subscribers').delete().eq('id', id).eq('organization_id', tenantId);
    if (error) throw error;
  }

  async getCarouselSlides(tenantId: string): Promise<CarouselSlide[]> {
    const { data, error } = await supabase.from('carousel').select('*').eq('organization_id', tenantId);
    if (error) throw error;
    return (data || []).map(mapCarouselFromDb);
  }

  async updateCarouselSlides(tenantId: string, slides: any[]): Promise<CarouselSlide[]> {
    await supabase.from('carousel_slides').delete().eq('organization_id', tenantId);
    const newSlides = slides.map(slide => ({
      id: slide.id,
      organization_id: tenantId,
      image: slide.image,
      badge: slide.badge || '',
      badge_icon_name: slide.badgeIconName || 'Trees',
      title: slide.title || '',
      description: slide.description || ''
    }));
    const { error } = await supabase.from('carousel_slides').insert(newSlides);
    if (error) throw error;
    return newSlides.map(mapCarouselFromDb);
  }

  async getLogoConfig(tenantId: string): Promise<LogoConfig | null> {
    const { data, error } = await supabase.from('logos').select('*').eq('organization_id', tenantId).eq('id', 'default').maybeSingle();
    if (error) throw error;
    return data ? mapLogosFromDb(data) : null;
  }

  async updateLogoConfig(tenantId: string, config: any): Promise<LogoConfig> {
    const { error } = await supabase.from('logos').upsert({
      id: 'default',
      organization_id: tenantId,
      logoColor: config.logoColor,
      logoGold: config.logoGold
    });
    if (error) throw error;
    return config;
  }

  async getAboutUs(tenantId: string): Promise<any | null> {
    const { data, error } = await supabase.from('about').select('*').eq('organization_id', tenantId).eq('id', 'default').maybeSingle();
    if (error) throw error;
    return data ? mapAboutFromDb(data) : null;
  }

  async updateAboutUs(tenantId: string, config: any): Promise<any> {
    const { error } = await supabase.from('about').upsert(mapAboutToDb(config, tenantId));
    if (error) throw error;
    return config;
  }
}

// --- Local JSON Implementation ---
export class LocalJSONStorage implements IStorage {
  private readDB(): any {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
    return {
      projects: [], donations: [], messages: [], blog: [], bulletins: [], subscribers: [], carouselSlides: [], logoConfig: null, aboutUs: null
    };
  }

  private writeDB(db: any) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  }

  async resetData(tenantId: string, initialData: any): Promise<void> {
    const db = {
      projects: initialData.initialProjects,
      donations: [],
      messages: [],
      blog: initialData.initialBlog,
      bulletins: initialData.initialBulletins,
      subscribers: [],
      aboutUs: initialData.initialAboutUs,
      carouselSlides: initialData.initialCarouselSlides,
      logoConfig: initialData.initialLogoConfig
    };
    this.writeDB(db);
  }

  async getProjects(tenantId: string): Promise<Project[]> {
    return this.readDB().projects || [];
  }

  async getProjectById(id: string, tenantId: string): Promise<Project | null> {
    const db = this.readDB();
    return db.projects.find((p: any) => p.id === id) || null;
  }

  async createProject(project: any): Promise<Project> {
    const db = this.readDB();
    db.projects.push(project);
    this.writeDB(db);
    return project;
  }

  async updateProject(id: string, tenantId: string, updates: any): Promise<Project | null> {
    const db = this.readDB();
    const idx = db.projects.findIndex((p: any) => p.id === id);
    if (idx === -1) return null;
    db.projects[idx] = { ...db.projects[idx], ...updates };
    this.writeDB(db);
    return db.projects[idx];
  }

  async deleteProject(id: string, tenantId: string): Promise<void> {
    const db = this.readDB();
    db.projects = db.projects.filter((p: any) => p.id !== id);
    this.writeDB(db);
  }

  async getDonations(tenantId: string): Promise<Donation[]> {
    return this.readDB().donations || [];
  }

  async createDonation(donation: any): Promise<Donation> {
    const db = this.readDB();
    db.donations.push(donation);
    this.writeDB(db);
    return donation;
  }

  async getMessages(tenantId: string): Promise<Message[]> {
    return this.readDB().messages || [];
  }

  async createMessage(message: any): Promise<Message> {
    const db = this.readDB();
    db.messages.push(message);
    this.writeDB(db);
    return message;
  }

  async getBlogPosts(tenantId: string, showAll: boolean): Promise<BlogPost[]> {
    let posts = this.readDB().blog || [];
    if (!showAll) {
      posts = posts.filter((p: any) => p.status !== 'draft');
    }
    return posts;
  }

  async createBlogPost(post: any): Promise<BlogPost> {
    const db = this.readDB();
    db.blog.push(post);
    this.writeDB(db);
    return post;
  }

  async updateBlogPost(id: string, tenantId: string, updates: any): Promise<BlogPost | null> {
    const db = this.readDB();
    const idx = db.blog.findIndex((p: any) => p.id === id);
    if (idx === -1) return null;
    db.blog[idx] = { ...db.blog[idx], ...updates };
    this.writeDB(db);
    return db.blog[idx];
  }

  async deleteBlogPost(id: string, tenantId: string): Promise<void> {
    const db = this.readDB();
    db.blog = db.blog.filter((p: any) => p.id !== id);
    this.writeDB(db);
  }

  async getBulletins(tenantId: string, showAll: boolean): Promise<Bulletin[]> {
    let bulletins = this.readDB().bulletins || [];
    if (!showAll) {
      bulletins = bulletins.filter((p: any) => p.status !== 'draft');
    }
    return bulletins;
  }

  async createBulletin(bulletin: any): Promise<Bulletin> {
    const db = this.readDB();
    db.bulletins.push(bulletin);
    this.writeDB(db);
    return bulletin;
  }

  async updateBulletin(id: string, tenantId: string, updates: any): Promise<Bulletin | null> {
    const db = this.readDB();
    const idx = db.bulletins.findIndex((p: any) => p.id === id);
    if (idx === -1) return null;
    db.bulletins[idx] = { ...db.bulletins[idx], ...updates };
    this.writeDB(db);
    return db.bulletins[idx];
  }

  async deleteBulletin(id: string, tenantId: string): Promise<void> {
    const db = this.readDB();
    db.bulletins = db.bulletins.filter((p: any) => p.id !== id);
    this.writeDB(db);
  }

  async getSubscribers(tenantId: string): Promise<Subscriber[]> {
    return this.readDB().subscribers || [];
  }

  async getSubscriberByEmail(email: string, tenantId: string): Promise<Subscriber | null> {
    const db = this.readDB();
    return db.subscribers.find((s: any) => s.email === email) || null;
  }

  async createSubscriber(subscriber: any): Promise<Subscriber> {
    const db = this.readDB();
    db.subscribers.push(subscriber);
    this.writeDB(db);
    return subscriber;
  }

  async deleteSubscriber(id: string, tenantId: string): Promise<void> {
    const db = this.readDB();
    db.subscribers = db.subscribers.filter((s: any) => s.id !== id);
    this.writeDB(db);
  }

  async getCarouselSlides(tenantId: string): Promise<CarouselSlide[]> {
    return this.readDB().carouselSlides || [];
  }

  async updateCarouselSlides(tenantId: string, slides: any[]): Promise<CarouselSlide[]> {
    const db = this.readDB();
    db.carouselSlides = slides;
    this.writeDB(db);
    return slides;
  }

  async getLogoConfig(tenantId: string): Promise<LogoConfig | null> {
    return this.readDB().logoConfig || null;
  }

  async updateLogoConfig(tenantId: string, config: any): Promise<LogoConfig> {
    const db = this.readDB();
    db.logoConfig = config;
    this.writeDB(db);
    return config;
  }

  async getAboutUs(tenantId: string): Promise<any | null> {
    return this.readDB().aboutUs || null;
  }

  async updateAboutUs(tenantId: string, config: any): Promise<any> {
    const db = this.readDB();
    db.aboutUs = config;
    this.writeDB(db);
    return config;
  }
}

// --- Factory ---
export function getStorageAdapter(): IStorage {
  // If USE_LOCAL_JSON is set to "true", use LocalJSONStorage.
  // We document that this is only for local dev/QA contingency validation.
  if (process.env.USE_LOCAL_JSON === 'true') {
    console.log('[Storage Adapter] USING LOCAL JSON CONTINGENCY STORAGE');
    return new LocalJSONStorage();
  }
  console.log('[Storage Adapter] USING SUPABASE PRODUCTION STORAGE');
  return new SupabaseStorage();
}
