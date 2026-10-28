import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Cabeceras de seguridad para todas las páginas. Next.js inserta scripts en
// línea, por eso 'unsafe-inline'; en desarrollo además necesita 'unsafe-eval'.
// connect-src: el panel /admin habla con Supabase desde el navegador.
// form-action: Webpay Plus recibe al cliente con un formulario hacia Transbank.
const desarrollo = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${desarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' https://*.supabase.co${desarrollo ? " ws:" : ""}`,
  "form-action 'self' https://webpay3g.transbank.cl https://webpay3gint.transbank.cl",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const cabeceras = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: cabeceras }];
  },
};

export default nextConfig;

// Permite usar los recursos de Cloudflare en `npm run dev`
initOpenNextCloudflareForDev();
