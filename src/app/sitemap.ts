import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Vacío a propósito: robots.ts bloquea todo el rastreo, así que no tiene
// sentido publicar un listado de URLs a los buscadores.
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
