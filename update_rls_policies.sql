-- ==============================================================================
-- SCRIPT DE ACTUALIZACIÓN DE POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- FASE 0 - AUDITORÍA (Estricto)
-- ==============================================================================

-- 1. Eliminar cualquier política pública insegura de operaciones totales (si existiera)
DROP POLICY IF EXISTS "Allow all operations for anon on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow all operations for anon on donations" ON public.donations;
DROP POLICY IF EXISTS "Allow all operations for anon on messages" ON public.messages;
DROP POLICY IF EXISTS "Allow all operations for anon on blog" ON public.blog;
DROP POLICY IF EXISTS "Allow all operations for anon on bulletins" ON public.bulletins;
DROP POLICY IF EXISTS "Allow all operations for anon on subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow all operations for anon on carousel" ON public.carousel;
DROP POLICY IF EXISTS "Allow all operations for anon on about" ON public.about;
DROP POLICY IF EXISTS "Allow all operations for anon on logos" ON public.logos;
DROP POLICY IF EXISTS "Allow public read access on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read access on blog" ON public.blog;
DROP POLICY IF EXISTS "Allow public read access on bulletins" ON public.bulletins;
DROP POLICY IF EXISTS "Allow public read access on carousel" ON public.carousel;
DROP POLICY IF EXISTS "Allow public read access on about" ON public.about;
DROP POLICY IF EXISTS "Allow public read access on logos" ON public.logos;
DROP POLICY IF EXISTS "Allow public insert on messages" ON public.messages;
DROP POLICY IF EXISTS "Allow public insert on subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow public insert on donations" ON public.donations;

-- 2. Habilitar RLS estricto
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas de LECTURA (SELECT) solo en datos publicables
CREATE POLICY "Allow public select on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public select on blog" ON public.blog FOR SELECT USING (true);
CREATE POLICY "Allow public select on bulletins" ON public.bulletins FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public select on carousel" ON public.carousel FOR SELECT USING (true);
CREATE POLICY "Allow public select on about" ON public.about FOR SELECT USING (true);
CREATE POLICY "Allow public select on logos" ON public.logos FOR SELECT USING (true);

-- 4. Crear Políticas de ESCRITURA (INSERT) exclusivamente para anon (Sin SELECT, UPDATE ni DELETE)
CREATE POLICY "Allow anon insert on messages" ON public.messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert on subscribers" ON public.subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert on donations" ON public.donations FOR INSERT TO anon WITH CHECK (true);

-- Nota: Todas las operaciones de UPDATE/DELETE y las lecturas de información sensible 
-- (messages, subscribers, donations) deberán ejecutarse vía el backend usando service_role key.
-- ==============================================================================
