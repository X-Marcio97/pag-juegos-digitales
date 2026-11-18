# THE BEST DIGITAL — Juegos Digitales PS4 & PS5

Tienda web moderna de juegos digitales para PlayStation 4 y PlayStation 5, construida con **Next.js (App Router)**, **React**, **TypeScript** y **Tailwind CSS**, sincronizada en vivo con Google Sheets y cierre de pedidos directo por WhatsApp.

## Stack Tecnológico

- **Framework:** Next.js 14 (App Router) + React 18
- **Lenguaje:** TypeScript (modo estricto)
- **Estilos:** Tailwind CSS v3 + tokens gamer oscuros (`Montserrat`)
- **Fuente de datos:** Google Sheets CSV sincronizado server-side

## Estructura del Proyecto

- `src/types/game.ts` — Contratos TypeScript compartidos (juegos, estadísticas, configuración, respuestas de API, carrito)
- `src/lib/` — Carga, parseo y caché del catálogo de Google Sheets
- `src/app/api/` — Endpoints REST internos (`/api/catalog`, `/api/games/[slug]`)
- `src/components/` — Componentes interactivos de la tienda (Hero, Catálogo, Filtros, Drawer de Carrito, WhatsApp)
- `src/app/` — Páginas y layouts (`layout.tsx`, `globals.css`, `page.tsx`, `juego/[slug]/page.tsx`)
- `legacy-demo/index.html` — Demo estática original conservada como referencia de diseño

## Desarrollo Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno (opcional, incluye defaults):
   ```bash
   cp .env.example .env.local
   ```

3. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000).

## Scripts Disponibles

- `npm run dev` — Inicia el servidor de desarrollo
- `npm run build` — Compila la aplicación para producción
- `npm run start` — Inicia la aplicación compilada
- `npm run typecheck` — Verifica tipos con TypeScript (`tsc --noEmit`)
- `npm run lint` — Ejecuta ESLint
