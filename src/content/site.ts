export const site = {
  nombre: "Undertactics",
  // El titular del hero (spec 002 §3.6, §3.13): sus dos líneas, seguidas.
  tagline: "Lo de arriba vende. Lo de abajo trabaja.",
  // Descripción del hero y `description` de la portada (§3.13; P-04).
  descripcion:
    "Consultora tecnológica para pymes y autónomos: inteligencia artificial, automatización de procesos, software a medida y desarrollo web.",
  email: "alvarot2601@gmail.com",
  // Teléfono: no se publica ninguno hasta que haya una línea de estudio.
  // No se inventa: el contacto entra por correo y por el formulario.
  telefono: null,
  ubicacion: "Carballo, A Coruña",
  zonaHoraria: "Europe/Madrid",
  nav: [
    { label: "Servicios", href: "/#servicios" },
    { label: "Soluciones", href: "/#soluciones" },
    { label: "Proyectos", href: "/#plantillas" },
    { label: "Herramientas", href: "/herramientas/" },
    { label: "Proceso", href: "/#proceso" },
    { label: "Contacto", href: "/#contacto" },
  ],
  cta: "Solicitar diagnóstico",
  ctaHref: "/#contacto",
  redes: [
    // [PENDIENTE] perfiles reales del estudio — hasta entonces no se enlaza a "#".
  ] as ReadonlyArray<{ label: string; href: string }>,
} as const;
