# VOSERDEM Web Platform

Plataforma institucional para el Voluntariado de Servicio para el Desarrollo Humano y Medio Ambiente (VOSERDEM).

## Stack Tecnologico
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4.
- **Backend**: Serverless Functions alojadas en Vercel (`api/index.ts`).
- **Base de Datos**: Supabase (PostgreSQL).
- **Hosting**: Vercel.

## Estructura del Repositorio
- `/src`: Codigo fuente del frontend (Componentes, Hooks, Servicios).
- `/api`: Unico backend oficial para despliegue en Vercel (`api/index.ts`). Maneja todas las llamadas a la base de datos (Supabase).
- `supabase_schema.sql`: Respaldo del esquema DDL aplicado en la base de datos de produccion.
- `data-store.json`: JSON de respaldo para migraciones de datos institucionales basicos.

## Desarrollo Local

1. Instalar dependencias: `npm install`
2. Configurar `.env` con las credenciales de Supabase (ver `.env.example`).
3. Para desarrollo completo, usar Vercel CLI (emula `/api` localmente):
   ```bash
   vercel dev
   ```
