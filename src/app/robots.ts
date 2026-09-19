import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Web de venta con casos de clientes reales: bloqueada a rastreadores por completo
// mientras no se decida publicarla en serio. Ver también el meta robots en layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
