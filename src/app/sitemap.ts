import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Vacío a propósito: robots.ts bloquea todo el rastreo, así que no se publica
// ningún listado de URLs (incluye casos de clientes reales) a los buscadores.
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
