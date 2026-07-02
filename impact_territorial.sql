-- Create the impact_territorial table
CREATE TABLE IF NOT EXISTS public.impact_territorial (
    id TEXT PRIMARY KEY DEFAULT 'voserdem-bolivia',
    organization_id TEXT NOT NULL DEFAULT 'voserdem-bolivia',
    "mainTitle" TEXT,
    "mainSubtitle" TEXT,
    "introText" TEXT,
    sites JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.impact_territorial ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on impact_territorial"
    ON public.impact_territorial
    FOR SELECT
    USING (true);

-- Allow authenticated (service role or admins) to update
CREATE POLICY "Allow update on impact_territorial"
    ON public.impact_territorial
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow insert on impact_territorial"
    ON public.impact_territorial
    FOR INSERT
    WITH CHECK (true);

-- Insert default initial data
INSERT INTO public.impact_territorial (
    id, 
    organization_id, 
    "mainTitle", 
    "mainSubtitle", 
    "introText", 
    sites
) VALUES (
    'voserdem-bolivia',
    'voserdem-bolivia',
    'Impacto Territorial',
    'Presencia Nacional',
    'Nuestra estrategia de desarrollo se organiza en cuatro grandes Sitios Piloto. En lugar de dispersar esfuerzos, concentramos recursos en territorios específicos para generar transformaciones profundas, verificables y permanentes.',
    '[
      {
        "id": "andino",
        "name": "Sitio Andino",
        "location": "Sacaca y Norte de Potosí",
        "description": "Nuestra presencia histórica más profunda, enfrentando condiciones de extrema pobreza con intervenciones sostenidas en educación, nutrición y agricultura de alta montaña.",
        "image": "https://images.unsplash.com/photo-1542662565-7e4fd6e56d7a?q=80&w=2000&auto=format&fit=crop",
        "order": 1,
        "stats": [
          { "icon": "GraduationCap", "label": "UAS UCB V", "value": "Centro de formación universitaria" },
          { "icon": "Utensils", "label": "Comedores", "value": "Alimentación escolar y adultos mayores" },
          { "icon": "Droplets", "label": "Agua", "value": "Sistemas de captación" }
        ]
      },
      {
        "id": "valles",
        "name": "Sitio Valles",
        "location": "Quillacollo / Chocaya",
        "description": "El corazón ecológico de VOSERDEM. Aquí desarrollamos el Ecocampo, un modelo de agroforestería y educación medioambiental para recuperar acuíferos y suelos.",
        "image": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000&auto=format&fit=crop",
        "order": 2,
        "stats": [
          { "icon": "Leaf", "label": "Agroforestería", "value": "70 hectáreas recuperadas" },
          { "icon": "Users", "label": "Capacitación", "value": "Huertos familiares" },
          { "icon": "Droplets", "label": "Cuencas", "value": "Protección de recarga hídrica" }
        ]
      },
      {
        "id": "amazonico",
        "name": "Sitio Amazónico",
        "location": "Villa Tunari, Trópico de Cochabamba",
        "description": "Intervención enfocada en el desarrollo productivo tropical sostenible, apoyando a comunidades a encontrar alternativas económicas ecológicamente viables.",
        "image": "https://images.unsplash.com/photo-1518182170546-076616fd4ff8?q=80&w=2000&auto=format&fit=crop",
        "order": 3,
        "stats": [
          { "icon": "Sprout", "label": "Desarrollo", "value": "Alternativas productivas" },
          { "icon": "Users", "label": "Comunidades", "value": "Acompañamiento técnico" },
          { "icon": "Leaf", "label": "Conservación", "value": "Respeto al bosque" }
        ]
      },
      {
        "id": "chaco",
        "name": "Sitio Chaco",
        "location": "Región del Chaco Boliviano",
        "description": "Nuestro polo de desarrollo en gestación. Estamos mapeando necesidades críticas de agua y desarrollo productivo para expandir nuestro modelo DSI a esta región.",
        "image": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop",
        "order": 4,
        "stats": [
          { "icon": "Map", "label": "Fase", "value": "Gestación y Mapeo" },
          { "icon": "Droplets", "label": "Prioridad", "value": "Acceso a agua" },
          { "icon": "Users", "label": "Impacto", "value": "Proyección 2030" }
        ]
      }
    ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
