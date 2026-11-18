# THE BEST DIGITAL — Tienda de Juegos Digitales PS4 & PS5

Tienda e-commerce full-stack para venta de juegos digitales de PlayStation 4 y PlayStation 5, diseñada con estética gamer oscura estilo *The Best*, sincronizada en vivo con Google Sheets y cierre de pedidos directo por WhatsApp.

## ¿Qué incluye el proyecto?

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS v3**: renderizado SSR rápido, tipado estricto y diseño 100% responsive.
- **Sincronización en vivo con Google Sheets**: lectura server-side de la planilla (~766 juegos de PS4 y PS5) con caché inteligente (`revalidate = 300s`), soporte para ofertas/preventas, precios de cuenta **Primaria / Secundaria** y endpoint `POST /api/revalidate` para refrescar el catálogo al instante.
- **+303 carátulas oficiales verificadas**: resolución automática de portadas desde la columna `IMAGEN` de la planilla, mapa curado de Steam CDN verificado, soporte opcional para RAWG API y fallback estilizado PS4/PS5 sin imágenes rotas.
- **Catálogo interactivo y buscador instantáneo**: Hero slider, categorías rápidas, sección de ofertas destacadas, autocomplete en vivo, filtros por consola/promos, ordenamiento, paginación fluida (*Cargar más*) y modal de Vista Rápida (*Quick-View*).
- **Carrito persistente + Checkout por WhatsApp**: drawer deslizable guardado en `localStorage`, control de cantidades, total en tiempo real en ARS y envío del pedido detallado en español directo a WhatsApp.
- **Páginas SEO compartibles `/juego/[slug]`**: URL propia para cada juego con metadatos dinámicos (`title`, `description`, `OpenGraph`) ideales para compartir en WhatsApp, Instagram o Google, más juegos relacionados.
- **Referencia histórica**: la demo HTML estática original quedó preservada en `legacy-demo/index.html`.

---

## Cómo correrlo en local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno (opcional, trae valores por defecto):**
   ```bash
   cp .env.example .env.local
   ```

3. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

### Otros scripts útiles

```bash
npm run build      # Compilación de producción
npm run start      # Levantar build de producción
npm run typecheck  # Verificar tipos TypeScript
npm run lint       # Ejecutar ESLint
```

---

## Subir el repositorio a GitHub (`X-Marcio97`)

### Opción A — Creando un repo vacío en github.com

1. Entrá a [github.com/new](https://github.com/new) con tu cuenta **`X-Marcio97`**.
2. Creá un repositorio vacío (por ejemplo `pag-juegos`) **sin** inicializar README ni `.gitignore`.
3. Ejecutá estos comandos dentro de la carpeta del proyecto:
   ```bash
   git remote add origin https://github.com/X-Marcio97/pag-juegos.git
   git branch -M main
   git push -u origin main
   ```

### Opción B — Usando GitHub CLI (`gh`)

Si instalás [GitHub CLI](https://cli.github.com/):
```bash
gh auth login
gh repo create X-Marcio97/pag-juegos --public --source=. --remote=origin --push
```

---

## Deploy gratis ($0/mes) en Vercel desde GitHub

1. Ingresá a [vercel.com](https://vercel.com) e iniciá sesión con tu cuenta de **GitHub**.
2. Hacé clic en **Add New… → Project** y seleccioná el repositorio `X-Marcio97/pag-juegos`.
3. Vercel detectará **Next.js** automáticamente (no hace falta cambiar el comando de build).
4. En **Environment Variables**, agregá las variables opcionales que necesites personalizar:

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Número de WhatsApp de ventas (solo dígitos, con código de país) | `5491100000000` |
| `GOOGLE_SHEET_ID` | ID de la planilla de Google Sheets pública | `1R3u-VPzH_dyWg7eNvIbkZv2dlczr8iT8` |
| `GOOGLE_SHEET_GID` | GID de la pestaña del catálogo | `973457218` |
| `RAWG_API_KEY` | *(Opcional)* API Key de RAWG para enriquecer carátulas adicionales | *(vacío)* |
| `REVALIDATE_SECRET` | *(Opcional)* Token secreto para proteger `POST /api/revalidate` | *(vacío)* |

5. Hacé clic en **Deploy**. En ~1 minuto tendrás tu tienda online con HTTPS gratis y actualizaciones automáticas en cada `git push` a `main`.
