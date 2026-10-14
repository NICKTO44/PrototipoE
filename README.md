# Euroheaters · Sección de controladores

Prueba práctica de diseño y desarrollo: una sección web para presentar productos industriales
(controladores para moldes de colada caliente) en la que un cliente potencial puede **identificar
el producto**, **conocer sus características** y **solicitar una cotización** con facilidad.

Información e imágenes tomadas de [euroheaters.mx › Controladores](https://www.euroheaters.mx/index.php/productos/controladores).

## Qué incluye

| Vista                         | Contenido                                                                                                                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Catálogo** `/`              | Cabecera con carrusel de productos (autoplay accesible, swipe en móvil), botones _Solicitar cotización_ y _Contactar_, grilla filtrable por tipo y bloque de asesoría.                                                                     |
| **Ficha** `/productos/[slug]` | Galería sobre "lámina técnica", datos clave, beneficios (bento), especificaciones con PDF del fabricante, configurador _Arme su gabinete_ y otros controladores.                                                                           |
| **Navegación**                | Barra fija con menú de productos. Las secciones fuera del alcance de la prueba (Inicio, Nosotros, Servicios, Sostenibilidad, Inversionistas, Contacto y otras líneas) llevan a una página interna _Próximamente_: nunca se sale del sitio. |
| **Contacto y pie de página**  | Accesos flotantes a WhatsApp, correo y ubicación (abajo a la izquierda) y un footer de ejemplo con productos, otras líneas, recursos, contacto y redes sociales.                                                                           |
| **Asistente de cotización**   | Un único asistente flotante para todo el sitio. Sabe en qué sección y producto está el usuario, combina opciones guiadas con texto libre (Gemini) y termina en una solicitud.                                                              |

## Stack y decisiones

| Elección                                 | Por qué                                                                                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Next.js 16 (App Router) + TypeScript** | Fichas con URL propia y generadas estáticamente (SEO, rendimiento). Una _Route Handler_ protege la clave de Gemini sin montar un backend aparte. |
| **Tailwind CSS 4**                       | Tokens de diseño centralizados en `src/app/globals.css` (`@theme`). Ajustar la paleta es cambiar variables, no componentes.                      |
| **Gemini (`@google/genai`)**             | Salida **estructurada en JSON**, validada con Zod y contrastada con el catálogo: la IA nunca puede inventar productos ni campos.                 |
| **Flujo guiado de respaldo**             | Si la IA no está configurada o falla, el asistente sigue funcionando con opciones. La conversación siempre termina en una solicitud completa.    |
| **Zod**                                  | Un solo contrato para cliente, servidor y modelo (`schema.ts`); el esquema JSON que recibe Gemini se genera desde el mismo esquema.              |
| **Embla Carousel**                       | Ligero, accesible y con gestos táctiles.                                                                                                         |

### ¿Por qué no llamar a Gemini directo desde el navegador?

Porque la clave quedaría visible en el bundle y cualquiera podría usarla. La petición pasa por
`/api/quote-agent`, que corre como función serverless: el proyecto sigue siendo "solo frontend" de
cara al despliegue (un repo, un deploy, sin servidores que mantener).

## Estructura

```
src/
├── app/                        # Rutas (solo composición, sin lógica de negocio)
│   ├── page.tsx                # Catálogo
│   ├── productos/[slug]/       # Ficha de producto (SSG)
│   └── api/quote-agent/        # Proxy seguro a Gemini
├── domain/catalog/             # Modelo, datos y consultas del catálogo (independiente de la UI)
├── features/
│   ├── catalog/                # Cabecera, carrusel, grilla, tarjetas
│   ├── product/                # Ficha: galería, beneficios, specs, configurador
│   └── quote-agent/            # Asistente: estado, flujo guiado, contrato y servidor
│       └── server/             # Prompt y cliente de Gemini (server-only)
├── components/                 # UI compartida (Button, Container, …) y layout
├── config/site.ts              # Datos públicos del sitio (contacto)
└── lib/                        # Utilidades: env validado, rate limit, cn
```

Para escalar: cambiar la fuente del catálogo (CMS, ERP) solo toca `domain/catalog/queries.ts`;
agregar un producto es agregar un objeto a `products.ts` (el configurador, la ficha y el asistente
lo toman automáticamente).

## Puesta en marcha

Requisitos: **Node.js 20.9+** (recomendado 22, ver `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # y complete GEMINI_API_KEY (opcional)
npm run dev                  # http://localhost:3000
```

Sin `GEMINI_API_KEY` el sitio funciona completo; el asistente opera en **modo guiado**.

## Variables de entorno

Definidas y documentadas en [`.env.example`](./.env.example). Solo ese archivo se versiona.

| Variable                 | Ámbito       | Uso                                                       |
| ------------------------ | ------------ | --------------------------------------------------------- |
| `GEMINI_API_KEY`         | **Servidor** | Clave de Google AI Studio. Nunca llega al navegador.      |
| `GEMINI_MODEL`           | Servidor     | Modelo (por defecto `gemini-flash-latest`).               |
| `QUOTE_AGENT_RATE_LIMIT` | Servidor     | Peticiones por minuto e IP al asistente (por defecto 20). |
| `NEXT_PUBLIC_SITE_URL`   | Pública      | URL canónica (metadatos).                                 |
| `NEXT_PUBLIC_CONTACT_*`  | Pública      | Correo y teléfono de ventas.                              |

Las variables de servidor se validan con Zod en `src/lib/env.server.ts`, que importa `server-only`:
si un componente de cliente intentara importarlo, el build falla.

## Scripts

| Comando             | Descripción                                 |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                      |
| `npm run build`     | Build de producción                         |
| `npm run start`     | Sirve el build                              |
| `npm run lint`      | ESLint (reglas de Next, React y TypeScript) |
| `npm run typecheck` | Genera tipos de rutas y verifica TypeScript |
| `npm run test`      | Pruebas unitarias (Vitest)                  |
| `npm run format`    | Formatea con Prettier                       |
| `npm run check`     | lint + typecheck + test                     |

## Seguridad

- Clave de IA solo en servidor (`server-only`, sin prefijo `NEXT_PUBLIC_`).
- `/api/quote-agent`: solo mismo origen, límite de tamaño, validación Zod, _rate limit_ por IP,
  _timeout_ de 15 s y errores sin detalles internos. No se registra el contenido de los usuarios.
- Prompt con defensa ante inyección: los mensajes del usuario se tratan como datos; el modelo no
  puede inventar precios ni especificaciones.
- Lo que propone el modelo se valida contra el catálogo antes de aceptarse (`mergeModelDraft`).
- Cabeceras de seguridad en `next.config.ts` (`nosniff`, `frame-ancestors 'none'`, etc.).

## Accesibilidad y responsive

Layout fluido con `flex-wrap` (sin saltos bruscos entre tamaños), objetivos táctiles ≥ 44 px,
HTML semántico, navegación por teclado (Esc cierra el asistente), `aria-live` en el chat y el
carrusel, contraste AA en botones y respeto de `prefers-reduced-motion` (sin autoplay).

## Despliegue (Vercel)

1. Suba el repositorio a GitHub e impórtelo en Vercel.
2. En _Settings › Environment Variables_ agregue `GEMINI_API_KEY` (y las demás si cambian).
   Use claves distintas para **Preview** y **Production**.
3. Cada push genera una URL de vista previa.

## Próximos pasos

- Sustituir los enlaces de redes sociales de ejemplo por las cuentas oficiales.
- Afinar la paleta de las secciones oscuras (tokens `--color-night-*`).
- Enviar la solicitud a un CRM / correo transaccional en lugar de `mailto:`.
- _Rate limit_ distribuido (Redis/Upstash) y CSP con _nonces_.
- Pruebas E2E (Playwright) del flujo catálogo → ficha → cotización.
