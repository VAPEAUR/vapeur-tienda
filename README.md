# Vapeur – tienda online

Tienda propia de Vapeur SpA (vapeur.cl): vapes, líquidos y accesorios en Chile. **Venta exclusiva a mayores de 18 años** (Ley 21.642).

Lanzamiento previsto: lunes 14 de diciembre de 2026.

## Stack

- Next.js (App Router) + TypeScript
- Cloudflare Workers con [OpenNext](https://opennext.js.org/cloudflare) (prueba técnica 28-oct-2026)
- Supabase (base de datos, fotos y acceso del panel admin) — por conectar
- Webpay Plus de Transbank — por conectar
- Blue Express — por conectar

## Qué hay hoy (prototipo A · Grafito y petróleo)

- Verificación de edad al entrar (se recuerda solo durante la sesión del navegador).
- Inicio con portada, categorías, "Repuestos para tu equipo", Elegidos por Vapeur, quiz "¿Qué equipo es para ti?", kits por nivel y pasos de compra.
- Listados por categoría, marca y equipo (`/equipos`, `/marcas/[marca]`, `/repuestos/[equipo]`), kits y ficha de producto.
- Carro en el navegador y checkout en 2 pasos: valida RUT (módulo 11) y fecha de nacimiento, y bloquea a menores de 18.
- **Pago simulado**: Webpay se conecta cuando Transbank apruebe la afiliación.
- Catálogo, fotos (dibujos SVG) y tarifas de despacho son **de ejemplo** (`src/lib/catalogo.ts`) hasta conectar Supabase y el courier.
- Textos legales y de advertencia provisorios: los debe validar el abogado (`src/lib/paginas.ts`, `src/components/Advertencia.tsx`).
- Sitio sin indexar en buscadores hasta el lanzamiento.

## Catálogo en Supabase y panel /admin (sprint 2)

- Los productos viven en la tabla `public.productos` (`supabase/catalogo.sql`). La tienda los lee en cada visita, con 30 segundos de memoria (`src/lib/datos.ts`).
- Sin `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` (desarrollo local) se usa el catálogo de ejemplo de `src/lib/catalogo.ts`.
- `/admin`: panel para cargar productos, precios y stock. Entra solo quien tiene usuario en Supabase Auth y fila en `public.administradores`; la base de datos (RLS) rechaza cualquier otro cambio.
- Puesta en marcha: correr `supabase/catalogo.sql` en el SQL Editor, crear el usuario en Authentication → Users → Add user (marcar *Auto Confirm User*) y correr la línea 4 del mismo archivo con ese correo.
- Los kits (`KITS`) y las tarifas de despacho (`DESPACHO`) siguen en el código.

## Cloudflare

1. Variables (Workers → vapeur-tienda → Settings → Variables and Secrets): `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`.
2. La prueba técnica (ruta `/api/prueba-supabase` y tabla `prueba_conexion`) se aprobó el 27-oct-2026 y se borró.

Rama de producción en Cloudflare: `main` (desde el 27-oct-2026). Build en Cloudflare (Workers Builds): comando de build `npx opennextjs-cloudflare build`, comando de deploy `npx opennextjs-cloudflare deploy`.

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # sitio local en http://localhost:3000
npm run build      # build de Next.js
npm run preview    # build para Cloudflare y vista previa local con Wrangler
npm run deploy     # build y publicación en Cloudflare (requiere cuenta Cloudflare)
```

## Variables de entorno

Copia `.env.example` a `.env.local`. Las claves reales se cargan en Cloudflare, **nunca** en el repositorio.

## Reglas del proyecto

- Precios en CLP enteros, con IVA, calculados siempre en el servidor.
- Sin datos de tarjeta en el sitio: el pago ocurre completo en Transbank.
- Supabase con RLS en todas las tablas.
- Sin textos de beneficios para la salud ni promociones (Ley 21.642).
- Datos personales mínimos (Ley 19.628 / 21.719).
