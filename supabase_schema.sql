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
-- POLÍTICAS DE SEGURIDAD (Row Level Security - RLS) SECURE
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

-- 1. Políticas públicas de LECTURA (Solo lectura para frontend/visitantes)
-- Permite que cualquiera (anon) pueda leer datos públicos necesarios para la web.
CREATE POLICY "Allow public select on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public select on blog" ON public.blog FOR SELECT USING (true);
CREATE POLICY "Allow public select on bulletins" ON public.bulletins FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public select on carousel" ON public.carousel FOR SELECT USING (true);
CREATE POLICY "Allow public select on about" ON public.about FOR SELECT USING (true);
CREATE POLICY "Allow public select on logos" ON public.logos FOR SELECT USING (true);

-- 2. Políticas de ESCRITURA públicas restringidas
-- Solo pueden insertar de forma estricta (Sin lectura, ni borrado, ni update).
CREATE POLICY "Allow anon insert on messages" ON public.messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert on subscribers" ON public.subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert on donations" ON public.donations FOR INSERT TO anon WITH CHECK (true);

-- ==============================================================================
-- NOTA IMPORTANTE PARA EL BACKEND:
-- El backend (Express/Node.js) AHORA DEBE utilizar la variable de entorno 
-- `SUPABASE_SERVICE_ROLE_KEY` en lugar de `SUPABASE_ANON_KEY`. 
-- El uso del `service_role` key evade las políticas RLS y otorga permisos de 
-- administrador a la API backend. Esto permite que el servidor proxy actúe 
-- como un guardián seguro, usando el header `x-admin-password`.
-- ==============================================================================

-- FIN DEL SCRIPT
-- Asegúrate de ejecutar `NOTIFY pgrst, 'reload schema';` si la API no detecta las tablas de inmediato.
-- ==============================================================================
