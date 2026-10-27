import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {};

export default nextConfig;

// Permite usar los recursos de Cloudflare en `npm run dev`
initOpenNextCloudflareForDev();
