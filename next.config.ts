import type { NextConfig } from "next";

/**
 * Cabeceras de seguridad aplicadas a todas las rutas.
 * La CSP es deliberadamente conservadora (sin nonces) para no romper los
 * scripts inline de Next; endurecerla con nonces es un paso siguiente.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self' mailto:",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // El indicador de desarrollo se superponía a los accesos flotantes de contacto.
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
