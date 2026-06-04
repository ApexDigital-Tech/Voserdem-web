# Memory Log — Plataforma VOSERDEM Bolivia

## 1. Decisiones Arquitectónicas Recientes

### Cambio de Diseño de Proyectos (Layout Grid 3 Columnas)
- **Problema**: El despliegue de proyectos se encontraba colapsado en un formato de una única columna por área y región, desaprovechando el espacio horizontal disponible.
- **Solución**: Restructuramos el flujo iterador de proyectos por región usando filtros lógicos integrados. Eliminamos la subdivisión redundante de áreas en contenedores hijos y, en su lugar, habilitamos un layout unificado de **Grid de 3 columnas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`)** con badges bicolor para identificar visualmente tanto la región (`#1B3022`) como el área de intervención (`#C5A059`) de cada tarjeta.

### Dinamismo Visual Interpolado en Carrusel (Hero Parallax)
- **Problema**: La visualización del carrusel de imágenes de fondo se sentía estático durante la navegación vertical.
- **Solución**: Integramos los hooks `useScroll` y `useTransform` provistos por `motion/react`. El fondo del carrusel computa una transición suave sobre el eje Y (`0` a `320px`) dependiente del recorrido de scroll del viewport (`0` a `1000px`), generando un dinamismo visual sin penalizar el rendimiento del navegador. El background-position se ancló correctamente en el eje superior para evitar cortes accidentales del punto focal en dispositivos móviles.

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
