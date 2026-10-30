# Vapeur – tienda online

Tienda propia de Vapeur SpA (vapeur.cl): vapes, líquidos y accesorios en Chile. **Venta exclusiva a mayores de 18 años** (Ley 21.642).

Lanzamiento previsto: lunes 14 de diciembre de 2026.

## Stack

- Next.js (App Router) + TypeScript
- Cloudflare Workers con [OpenNext](https://opennext.js.org/cloudflare) (prueba técnica 28-oct-2026)
- Supabase (base de datos, fotos y acceso del panel admin) — por conectar
- Webpay Plus de Transbank — conectado en ambiente de integración (pruebas)
- Resend (correo de confirmación de compra)
- Chilexpress — cotizador conectado (claves de prueba); crear envío y seguimiento listos en código

## Qué hay hoy (prototipo A · Grafito y petróleo)

- Verificación de edad al entrar (se recuerda solo durante la sesión del navegador).
- Inicio con portada, categorías, "Repuestos para tu equipo", Elegidos por Vapeur, quiz "¿Qué equipo es para ti?", kits por nivel y pasos de compra.
- Listados por categoría, marca y equipo (`/equipos`, `/marcas/[marca]`, `/repuestos/[equipo]`), kits y ficha de producto.
- Carro en el navegador y checkout en 2 pasos: valida RUT (módulo 11) y fecha de nacimiento, y bloquea a menores de 18.
- Pedidos guardados en Supabase y pago con **Webpay Plus en modo pruebas** (ver abajo).
- Catálogo, fotos (dibujos SVG) y tarifas de despacho son **de ejemplo** (`src/lib/catalogo.ts`) hasta conectar Supabase y el courier.
- Textos legales y de advertencia provisorios: los debe validar el abogado (`src/lib/paginas.ts`, `src/components/Advertencia.tsx`).
- Sitio sin indexar en buscadores hasta el lanzamiento.

## Catálogo en Supabase y panel /admin (sprint 2)

- Los productos viven en la tabla `public.productos` (`supabase/catalogo.sql`). La tienda los lee en cada visita, con 30 segundos de memoria (`src/lib/datos.ts`).
- Sin `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` (desarrollo local) se usa el catálogo de ejemplo de `src/lib/catalogo.ts`.
- `/admin`: panel para cargar productos, precios y stock. Entra solo quien tiene usuario en Supabase Auth y fila en `public.administradores`; la base de datos (RLS) rechaza cualquier otro cambio.
- Puesta en marcha: correr `supabase/catalogo.sql` en el SQL Editor, crear el usuario en Authentication → Users → Add user (marcar *Auto Confirm User*) y correr la línea 4 del mismo archivo con ese correo.
- Los kits (`KITS`) siguen en el código.

## Despacho con Chilexpress

- La calculadora (ficha, carro y checkout) pide el costo a `/api/despacho`, que cotiza con la API de Chilexpress desde Santiago Centro según el peso del carro (`src/lib/cotizar-envio.ts`, `src/lib/chilexpress.ts`).
- Si la API falla, tarda más de 5 s o faltan claves, se usa la tarifa estimada por zona (`TARIFA_ESTIMADA` en `src/lib/despacho.ts`): RM $5.990, regiones $9.990, zonas extremas $14.990 (calibrada con la API el 30-oct-2026).
- Si Chilexpress no llega a la comuna (hoy: O'Higgins en Aysén y San Fabián en Ñuble), no se cobra tarifa: la tienda pide escribir por WhatsApp.
- Nombres que Chilexpress escribe distinto (Santiago = "Santiago Centro", Llaillay, Marchigüe, Paihuano, Aysén): `NOMBRE_CHILEXPRESS` en `src/lib/chilexpress.ts`.
- Plazos mostrados: 1 a 2 días hábiles de preparación (igual que Ayuda › Despacho) + Chilexpress (RM 1–2, regiones 2–6, zonas extremas hasta 12 días hábiles).
- Claves: suscribirse en developers.wschilexpress.com a Cobertura, Cotizador y Envíos, y cargarlas en Cloudflare (ver `.env.example`). Con Cuenta Empresa: `CHILEXPRESS_AMBIENTE=produccion` y claves de producción.
- `crearEnvio()` y `seguimiento()` quedan listas para el sprint de pedidos (OT con etiqueta PDF y observación "entregar solo a mayor de 18 años con cédula").

## Pedidos y Webpay Plus (30-oct-2026)

Flujo: checkout → `POST /api/pedidos` → Webpay (Transbank) → `/api/webpay/retorno` → `/pedido`.

1. `POST /api/pedidos` vuelve a validar todo en el servidor: edad (RUT y fecha de nacimiento, que **no se guardan**), datos, stock, variantes, precios desde `public.productos` y despacho (`src/lib/despacho-servidor.ts`). Guarda el pedido en `public.pedidos` con estado `pendiente_pago` y crea la transacción en Webpay.
2. El navegador se va al formulario de pago de Transbank con el token.
3. `/api/webpay/retorno` recibe al cliente: confirma el pago (commit), revisa que monto y orden coincidan, marca el pedido `pagado`, descuenta stock (función `confirmar_pago`, una sola vez aunque se recargue) y envía el correo. Si el cliente anula, se acaba el tiempo o el banco rechaza, el pedido queda `anulado` o `rechazado` y el carro sigue guardado.
4. `/pedido?n=…&k=…` muestra el comprobante (orden de compra, fecha, tipo de pago, 4 últimos dígitos, código de autorización). La clave `k` es al azar: sin ella no se puede ver un pedido.

Puesta en marcha:

1. Supabase → SQL Editor: correr `supabase/pedidos.sql` (después de `catalogo.sql`).
2. Cloudflare → Variables and Secrets: agregar `SUPABASE_SECRET_KEY` como **Secret** (Supabase → Project Settings → API Keys → Secret keys).
3. Correo: crear cuenta en Resend y cargar `RESEND_API_KEY` como Secret. Mientras no se verifique el dominio vapeur.cl en Resend, solo llegan correos al correo de la cuenta de Resend (sirve para probar). Con el dominio verificado: `CORREO_REMITENTE` = `Vapeur <pedidos@vapeur.cl>`.
4. Webpay de prueba no necesita variables. Tarjetas de prueba de Transbank: crédito VISA 4051 8856 0044 6623, CVV 123, cualquier fecha futura; RUT 11.111.111-1 y clave 123 en la pantalla del banco.
5. Paso a producción (cuando Transbank entregue el código de comercio): `WEBPAY_AMBIENTE=produccion`, `WEBPAY_CODIGO_COMERCIO` y `WEBPAY_API_KEY` (Secret). No hay que cambiar código.

## Cloudflare

1. Variables (Workers → vapeur-tienda → Settings → Variables and Secrets): `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`; como Secret: `SUPABASE_SECRET_KEY` y `RESEND_API_KEY`.
2. La prueba técnica (ruta `/api/prueba-supabase` y tabla `prueba_conexion`) se aprobó el 27-oct-2026 y se borró.
3. Google (SEO): el sitio queda fuera de Google hasta que `INDEXAR` = `si` (se carga el día del lanzamiento, 14-dic-2026). Aun con `INDEXAR`, solo se indexa el dominio `vapeur.cl`; workers.dev y vistas previas siguen con `noindex` y `robots.txt` cerrado. `www.vapeur.cl`, `vaperia.cl` y `www.vaperia.cl` redirigen a `vapeur.cl` si están conectados al Worker. Detalle en `src/lib/seo.tsx`.

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
