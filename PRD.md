# Product Requirements Document (PRD) — Plataforma VOSERDEM Bolivia

## 1. Visión del Producto

VOSERDEM es una plataforma web full-stack, moderna y altamente refinada, diseñada para la organización social de voluntarios de Bolivia (Voluntarios al Servicio de los Demás). Facilita la recaudación de fondos transparente, educación comunitaria a través de boletines interactivos, divulgación ecológica e intergeneracional y una consola administrativa integral.

---

## 2. Personas de Usuario

### A. El Donante Comprometido (Nacional e Internacional)

- **Necesidades**: Seleccionar proyectos por su cercanía e impacto directo, elegir la moneda de su conveniencia ($ USD o Bs. BOB), y contar con instrucciones claras de transferencia instantánea (como el QR Simple oficial en Bolivia o Código Swift para cuentas en Dólares del Banco BISA).
- **Expectativas**: Transparencia absoluta del avance de metas financieras y un diseño impecable en dispositivos móviles.

### B. El Administrador de VOSERDEM

- **Necesidades**: Controlar dinámicamente el catálogo de proyectos activos clasificándolos por región (Altiplano, Valles, Oriente, Chaco) y área de acción (Educación, Medio Ambiente, Productivo, Intergeneracional).
- **Facilidades**: Administrar noticias, boletines, suscripciones, el carrusel de la cabecera interactiva y la imagen corporativa oficial directamente desde el portal seguro.

---

## 3. Especificaciones Funcionales (Módulos Core)

### Módulo de Proyectos (Filtro por Ubicación y Región)

- **Visualización en 3 Columnas**: Los proyectos se acomodan en un layout modular tipo grid de 3 columnas (en ordenadores) sumamente pulido y balanceado, agrupado elegantemente por región y área geográfica de acción.
- **Micro-Animaciones**: Implementación de animaciones sutiles y estables con `@motion/react` para un efecto de hover premium sobre tarjetas con badges dinámicos.

### Módulo de Donaciones Multidivisa e Instrucciones Dinámicas

- **Moneda USD**:
  - Habilita botones rápidos de $10, $25, $50, $100, $250.
  - Ofrece instrucciones de transferencia bancaria directa al **Banco BISA S.A.** (Cuenta Corriente Nº: 104523-402-3).
- **Moneda BOB (Bolivianos)**:
  - Habilita botones rápidos de Bs. 50, Bs. 100, Bs. 250, Bs. 500, Bs. 1000.
  - Genera un **QR Simple** corporativo para escanear y pagar desde cualquier banca móvil boliviana.
- **Cálculo Backend**: Al comprometerse una donación en Bolivianos, el servidor registra equivalentemente el avance en Dólares (tipo de cambio estable 6.96) para mantener el progreso unificado de la campaña global del proyecto.

### Módulo Hero con Dinamismo Visual Interpolado (Parallax-Scroll)

- **Efecto de Desplazamiento**: Movimiento de fondo controlado de manera declarativa con `useScroll` y `useTransform` de `@motion/react`, respondiendo directamente al viewport para lograr un mayor dinamismo visual de arriba hacia abajo.

### Control Adaptativo y Responsivo Premium (Mobile First)

- **Ajuste de Tipografía**: Reducción en proporciones de encabezados de cabecera (`text-2xl` a `text-4.5xl` en responsive) adaptando el tamaño de texto e imágenes fluidamente en pantallas táctiles sin sacrificar el contraste o el balance con el color de acento forestal `#1B3022`.

---

## 4. Requisitos de Seguridad y Arquitectura

- **Servidor Express (Backend)**: Todas las operaciones críticas de base de datos se ejecutan del lado del servidor leyendo localmente los datos de `data-store.json` de manera segura, aislando las rutas públicas `/api/*` y resguardando los flujos de configuración.
- **Sin Dependencias Inseguras**: Uso estricto de librerías oficiales de React, Tailwind CSSv4, Lucide-react y Motion.
