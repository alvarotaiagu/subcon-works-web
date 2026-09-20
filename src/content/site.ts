export const site = {
  nombre: "Subcon Works",
  tagline: "Lo que hace funcionar tu negocio, por debajo.",
  descripcion:
    "Diseño, desarrollo web y automatización con IA para negocios que no tienen tiempo que perder en herramientas que no funcionan.",
  email: "alvarot2601@gmail.com",
  // Teléfono: no se publica ninguno hasta que haya una línea de estudio.
  // No se inventa: el contacto entra por correo y por el formulario.
  telefono: null,
  ubicacion: "Carballo, A Coruña",
  zonaHoraria: "Europe/Madrid",
  nav: [
    { label: "Servicios", href: "/#servicios" },
    { label: "Plantillas", href: "/#plantillas" },
    { label: "Proceso", href: "/#proceso" },
    { label: "Auditoría", href: "/#auditoria" },
  ],
  cta: "Auditoría gratis",
  ctaHref: "/auditoria/",
  redes: [
    // [PENDIENTE] perfiles reales del estudio — hasta entonces no se enlaza a "#".
  ] as ReadonlyArray<{ label: string; href: string }>,
} as const;
