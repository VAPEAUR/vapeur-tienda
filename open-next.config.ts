// Configuración de OpenNext para Cloudflare Workers.
// Sin caché incremental en R2 por ahora: la prueba técnica no la necesita.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
