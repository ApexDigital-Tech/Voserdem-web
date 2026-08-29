# Acta de Entrega - VOSERDEM Web 2026

## 1. Alcance del Proyecto
Este documento certifica la entrega técnica del *Frente 1* (Fases 0 a 4) de la plataforma web de **VOSERDEM (Voluntarios al Servicio de los Demás)**.

### Módulos Entregados:
- **Arquitectura Base**: React + Vite + TypeScript.
- **Backend Serverless**: Endpoints unificados bajo Express/Vercel (`/api/*`).
- **Seguridad y Robustez (Fase 3 & 4)**: 
  - *Rate Limiting* (Prevención de ataques DDoS / Spam).
  - *Server-Side Validation* con Zod.
  - *Row Level Security (RLS)* cerrado por defecto. Todo acceso administrativo utiliza autenticación asimétrica (`ADMIN_PASSKEY`).
- **Performance**: Code-Splitting total del panel administrativo (React.lazy), resultando en un bundle inicial menor a 500 KB.
- **Limpieza (Clean Code)**: Purga total de dependencias fantasma e imports sin utilizar (ESLint flat config configurado de forma estricta).

## 2. Credenciales de Producción (ACTUALIZADAS)
A continuación, se detallan las credenciales requeridas para el entorno productivo de **Vercel** y la administración del sitio web.

> **⚠️ ATENCIÓN AL CLIENTE**: Conservar esta información en un lugar seguro.

### 2.1 Contraseña de Administrador del Panel (CMS)
- **Contraseña:** [Será entregada al cliente por un canal separado y seguro (Ej. Gestor de Contraseñas), NUNCA por escrito en repositorios]
- *Nota: Esta contraseña debe insertarse en Vercel bajo las claves `VITE_ADMIN_PASSKEY` y `ADMIN_PASSKEY`.*

### 2.2 Variables de Entorno de Base de Datos (Supabase)
Como medida final de seguridad, se ha instado al equipo a rotar las claves del proyecto en Supabase (debido a rastros en el historial público de desarrollo).
Deben configurar las siguientes variables en **Vercel** con las **claves rotadas recién generadas** en el Dashboard de Supabase (Project Settings -> API):

- `VITE_SUPABASE_URL` = `https://[YOUR_PROJECT_REF].supabase.co`
- `SUPABASE_URL` = `https://[YOUR_PROJECT_REF].supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `[INGRESAR CLAVE ANON ROTADA AQUÍ]`
- `SUPABASE_ANON_KEY` = `[INGRESAR CLAVE ANON ROTADA AQUÍ]`
- `SUPABASE_SERVICE_ROLE_KEY` = `[INGRESAR SERVICE_ROLE_KEY ROTADA AQUÍ]`

## 3. Entornos
- **Repositorio**: [Repositorio en GitHub]
- **Producción**: [Dominio Oficial] (Pendiente de redirección DNS en el Frente 2)

## 4. Firmas
**Entregado por:** [Equipo de Desarrollo / Antigravity]  
**Recibido por:** Director de VOSERDEM
