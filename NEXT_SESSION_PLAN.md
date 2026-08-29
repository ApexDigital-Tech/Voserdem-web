# Plan para la proxima sesion

## 1. Validar Contenido Historico

- Auditar que contenido del antiguo WordPress de VOSERDEM necesita ser migrado a Supabase (ej. publicaciones antiguas del blog, proyectos pasados).
- Si no hay contenido historico, proceder a crear redirecciones (301) de las URLs del WordPress antiguo a las nuevas URLs de React para conservar el SEO, o documentar que no aplica.

## 2. Cambio de DNS

- Documentar el proceso de despliegue final.
- Apuntar el dominio oficial del cliente (ej. `voserdem.org` o `voserdem.org.bo`) hacia el proyecto de Vercel.
- Validar certificados SSL, resolucion del dominio y re-ejecutar pruebas de QA sobre el dominio final.

## 3. Entrega Final y Acta

- Generar documento de entrega con credenciales de Supabase, Vercel, y Github para el cliente.
- Realizar sesion de induccion sobre el uso del Panel Administrativo de la plataforma.
