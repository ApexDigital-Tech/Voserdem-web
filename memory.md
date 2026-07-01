# Memory Log — Plataforma VOSERDEM Bolivia

## 1. Decisiones Arquitectónicas Recientes

### Cambio de Diseño de Proyectos (Layout Grid 3 Columnas)
- **Problema**: El despliegue de proyectos se encontraba colapsado en un formato de una única columna por área y región, desaprovechando el espacio horizontal disponible.
- **Solución**: Restructuramos el flujo iterador de proyectos por región usando filtros lógicos integrados. Eliminamos la subdivisión redundante de áreas en contenedores hijos y, en su lugar, habilitamos un layout unificado de **Grid de 3 columnas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`)** con badges bicolor para identificar visualmente tanto la región (`#1B3022`) como el área de intervención (`#C5A059`) de cada tarjeta.

### Dinamismo Visual Interpolado en Carrusel (Hero Parallax)
- **Problema**: La visualización del carrusel de imágenes de fondo se sentía estático durante la navegación vertical.
- **Solución**: Integramos los hooks `useScroll` y `useTransform` provistos por `motion/react`. El fondo del carrusel computa una transición suave sobre el eje Y (`0` a `320px`) dependiente del recorrido de scroll del viewport (`0` a `1000px`), generando un dinamismo visual sin penalizar el rendimiento del navegador. El background-position se ancló correctamente en el eje superior para evitar cortes accidentales del punto focal en dispositivos móviles.

### Seguridad en Restauración de Base de Datos (Admin Panel)
- **Problema**: El botón "Restaurar Valores por Defecto" en el panel de administración carecía de confirmación estricta y su color rojo provocaba pulsaciones accidentales, lo que causó un reseteo no deseado de toda la base de datos Supabase en producción.
- **Solución**: Se mitigó el riesgo de UX implementando un "camuflaje" visual del botón (colores neutros/transparentes que solo se activan en hover). A nivel de lógica de seguridad, se agregó un `window.prompt` de validación estricta que exige al administrador teclear explícitamente la palabra `"CONFIRMAR"` en mayúsculas antes de disparar el endpoint de reseteo (`/api/admin/reset`).

### Selección de Monedas y Coordenadas Financieras (Donaciones)
- **Problema**: Donantes locales requerían soporte directo en Bolivianos (BOB) con lectura QR, mientras que iniciativas internacionales requerían soporte en Dólares (USD) vía transferencias tradicionales en cuenta corriente.
- **Solución**: 
  - Rediseñamos el componente `DonationForm` introduciendo un estado de selección de moneda (`currency: 'USD' | 'BOB'`).
  - Adaptamos los montos rápidos preestablecidos dinámicamente según la moneda elegida.
  - Al completar exitosamente la información de apoyo, la pantalla de "Gracias" genera de manera condicionada e interactiva las credenciales correctas:
    - **Si es BOB**: Despliega un componente interactivo de **QR Simple** oficial altamente estilizado con un token geométrico del código bancario del país y el monto de la donación precalculado en bolivianos.
    - **Si es USD**: Despliega el componente informativo del **Banco BISA S.A.** con todos los datos necesarios para transferencias interbancarias y códigos de enrutamiento Swift.
  - El backend procesa localmente el equivalente dolarizado (tipo de cambio 6.96) para mantener el avance de las metas financieras consistentes en la base de datos central sin distorsionar las métricas globales.

### Mitigación de Errores de Compilación en Panel Administrador (AdminPanel.tsx)
- **Edición Quirúrgica**: Corregimos un error estructural que afectaba la compilación donde un bloque de cabecera de tabla (`<thead>` e hijos) se encontraba alojado erróneamente fuera de las etiquetas de apertura de tabla `<table>`. Envolvemos el iterador maestro de proyectos perfectamente en su tabla correspondiente solucionando los cuellos de botella de transpilación.

### Ajustes de Diseño Responsive en Móviles
- **Texto y Padding**: Modificamos el tamaño absoluto de los headers del Hero (`text-4xl sm:text-5xl lg:text-6xl` pasó a un más refinado `text-2xl sm:text-4.5xl lg:text-6xl`) mitigando el desborde tipográfico en pantallas chicas.
- **Botones y Formularios**: Fluidificamos las filas del carrusel y los inputs del formulario de donación para ocupar el 100% del ancho del dispositivo de forma segura en dispositivos táctiles (`touch-targets` mínimos de 44px).

### Estabilización de Carga Global y Prevención de "Flicker" (Sesión 7)
- **Problema**: Al cargar la página, se mostraba brevemente la data y las imágenes *hardcodeadas* predeterminadas antes de que las promesas de la base de datos se resolvieran (ej. imágenes predeterminadas y texto Lorem Ipsum).
- **Solución**: Se implementó un estado global de carga (`isInitialLoading`) en el punto de entrada de la aplicación (`App.tsx`) que envuelve la estructura principal. Se complementó con componentes esqueletos de animación (`animate-pulse`) en `Hero.tsx` y `AboutUs.tsx` que suspenden la renderización del HTML pesado hasta que el backend responde afirmativamente o se descarta la espera.

### Persistencia de Sesión del Administrador
- **Problema**: Cada vez que el administrador cambiaba el branding o guardaba cambios y decidía recargar la página para verlos reflejados, se le requería la contraseña nuevamente (`voserdem2026`).
- **Solución**: Se integró el objeto de estado de autenticación a `sessionStorage`. Así, la clave de seguridad se mantendrá activa mientras la pestaña del navegador no sea cerrada, previniendo fricciones operativas.

### Manejo de Topología y Enrutamiento Falso (Scroll Position)
- **Problema**: Como es una Single Page Application (SPA), al cambiar entre vistas completas (ej. de "Inicio" a "Contactos"), el navegador se quedaba anclado en la posición vertical (Y) donde el usuario dio clic en el enlace, desorientándolo.
- **Solución**: Se refactorizó la comunicación de pestañas. Todos los componentes y botones ahora invocan a la función unitaria `navigate` desde `App.tsx` que, junto con despachar el estado del nuevo componente, inyecta `window.scrollTo({ top: 0, behavior: 'instant' })`.

### Integridad de Componentes React (Hooks Order)
- **Problema Quirúrgico**: El entorno local fallaba de manera irrecuperable por un error en React: "rendered fewer hooks than expected".
- **Solución**: Se reubicó la lógica de "Early Return" empleada para los `Loading` states en `Hero.tsx` al final del documento, protegiendo todas las declaraciones de `useEffect` y garantizando que el ciclo de vida del framework sea determinista en cada render.

### Saneamiento y Empaquetado para Vercel
- **Problema**: El repositorio conten�a scripts de pruebas antiguos (`test-api.js`, migradores), empaquetados obsoletos (`.zip`) y metadatos de plantillas heredadas en el `README.md` y `package.json`. Adem�s, coexist�an `server.ts` y `/api/index.ts` como servidores en un esquema ambiguo.
- **Solucion**: 
  - Se eliminaron mas de 10 scripts de migracion, respaldos locales, y zips temporales, garantizando que el repositorio contenga unicamente codigo fuente productivo.
  - Se definio oficialmente la ruta `/api/` como el **unico backend** para las funciones de Vercel Serverless, eliminando `server.ts`. 
  - Se re-escribio el `README.md` a un estandar profesional de proyecto y se limpiaron metadatos en el `package.json` (`name`, `scripts`), dejando el paquete con una arquitectura de React + Vite pura.

### Enrutamiento Single Page (SPA) en Produccion (Vercel)
- **Problema**: Al intentar abrir paginas internas directo desde la URL (ej. `voserdem-web.vercel.app/blog`), el rewrite de Vercel servia el frontend pero React por defecto montaba la pestana inicial, ignorando la URL solicitada.
- **Solucion**: Se escribio un micro-enrutador nativo en `App.tsx` capaz de leer `window.location.pathname` al arrancar. Los eventos de navegacion ahora despachan `window.history.pushState` y escuchan `popstate`, combinando exitosamente la velocidad de una SPA con la indexabilidad y enlaces profundos tradicionales requeridos para SEO.
