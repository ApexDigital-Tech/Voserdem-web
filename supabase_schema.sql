-- ==============================================================================
-- SCRIPT DE MIGRACIÓN: VOSERDEM DATA-STORE -> SUPABASE
-- Este script crea todas las tablas requeridas por la aplicación,
-- basándose en la estructura del archivo `data-store.json`.
-- ==============================================================================

-- 1. TABLA: projects
CREATE TABLE public.projects (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    region TEXT,
    area TEXT,
    image TEXT,
    goal NUMERIC DEFAULT 0,
    raised NUMERIC DEFAULT 0,
    location TEXT,
    impact TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA: donations
CREATE TABLE public.donations (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    "donorName" TEXT NOT NULL,
    email TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    "projectId" TEXT,
    "projectTitle" TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA: messages (Contacto)
CREATE TABLE public.messages (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA: blog
CREATE TABLE public.blog (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    image TEXT,
    category TEXT,
    author TEXT,
    date TEXT,
    "readTime" TEXT,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA: bulletins
CREATE TABLE public.bulletins (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    title TEXT NOT NULL,
    summary TEXT,
    "issueNumber" TEXT,
    "publishDate" TEXT,
    "downloadUrl" TEXT,
    image TEXT,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA: subscribers (Newsletter)
CREATE TABLE public.subscribers (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    email TEXT NOT NULL UNIQUE,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA: carousel
CREATE TABLE public.carousel (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    image TEXT NOT NULL,
    badge TEXT,
    "badgeIconName" TEXT,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLA: about
CREATE TABLE public.about (
    id TEXT PRIMARY KEY DEFAULT 'voserdem-bolivia',
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    "introSub" TEXT,
    "introTitle" TEXT,
    "introText" TEXT,
    "missionTitle" TEXT,
    "missionText" TEXT,
    "visionTitle" TEXT,
    "visionText" TEXT,
    "imageUrl" TEXT,
    "heroImageUrl" TEXT,
    pillars JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABLA: logos
CREATE TABLE public.logos (
    id TEXT PRIMARY KEY DEFAULT 'voserdem-bolivia',
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    "logoColor" JSONB,
    "logoGold" JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- Nota: Dado que el backend proxy maneja la autenticación y usa la "anon_key", 
-- es necesario permitir el acceso público a estas tablas desde el cliente REST de Supabase.
-- La seguridad real de modificación está en la capa Express (middleware requireAdmin).
-- ==============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir acceso total a 'anon' (El backend Node.js usa anon_key)
CREATE POLICY "Allow all operations for anon on projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon on donations" ON public.donations FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon on messages" ON public.messages FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon on blog" ON public.blog FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon on bulletins" ON public.bulletins FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon on subscribers" ON public.subscribers FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon on carousel" ON public.carousel FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon on about" ON public.about FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon on logos" ON public.logos FOR ALL USING (true);

-- ==============================================================================
-- FIN DEL SCRIPT
-- Asegúrate de ejecutar `NOTIFY pgrst, 'reload schema';` si la API no detecta las tablas de inmediato.
-- ==============================================================================
