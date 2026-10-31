export const site = {
  nombre: "Undertactics",
  // El titular del hero (spec 002 §3.6, §3.13): sus dos líneas, seguidas.
  tagline: "Lo de arriba vende. Lo de abajo trabaja.",
  // Descripción del hero y `description` de la portada (§3.13; P-04).
  descripcion:
    "Diseñamos lo que ve tu cliente y montamos lo que lo hace funcionar: web, automatización e inteligencia artificial para negocios.",
  email: "alvarot2601@gmail.com",
  // Teléfono: no se publica ninguno hasta que haya una línea de estudio.
  // No se inventa: el contacto entra por correo y por el formulario.
  telefono: null,
  ubicacion: "Carballo, A Coruña",
  zonaHoraria: "Europe/Madrid",
  nav: [
    { label: "Servicios", href: "/#servicios" },
    { label: "Plantillas", href: "/#plantillas" },
    { label: "Herramientas", href: "/herramientas/" },
    { label: "Proceso", href: "/#proceso" },
    { label: "Auditoría", href: "/#auditoria" },
  ],
  cta: "Auditoría gratis",
  ctaHref: "/auditoria/",
  redes: [
    // [PENDIENTE] perfiles reales del estudio — hasta entonces no se enlaza a "#".
  ] as ReadonlyArray<{ label: string; href: string }>,
} as const;
