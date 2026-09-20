import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Bloqueada a rastreadores por completo mientras no se venda nada: es la norma
// de la casa para todo lo publicado. Ver también el meta robots en layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
