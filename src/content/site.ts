export const site = {
  nombre: "Undertactics",
  // El titular del hero (spec 002 §3.6, §3.13): sus dos líneas, seguidas.
  tagline: "Lo de arriba vende. Lo de abajo trabaja.",
  // Descripción del hero y `description` de la portada (§3.13; P-04).
  descripcion:
    "Hacemos la web, la tienda online y la ficha de Google de tu negocio, y montamos a tu medida lo que va por debajo: automatizaciones, asistentes con IA y programas de gestión.",
  email: "alvarot2601@gmail.com",
  // Teléfono: no se publica ninguno hasta que haya una línea de estudio.
  // No se inventa: el contacto entra por correo y por el formulario.
  telefono: null,
  ubicacion: "Carballo, A Coruña",
  zonaHoraria: "Europe/Madrid",
  nav: [
    { label: "Servicios", href: "/#servicios" },
    { label: "Soluciones", href: "/#soluciones" },
    { label: "Webs de ejemplo", href: "/#plantillas" },
    { label: "Productos", href: "/herramientas/" },
    { label: "Proceso", href: "/#proceso" },
    { label: "Contacto", href: "/#contacto" },
  ],
  cta: "Pedir una propuesta",
  ctaHref: "/#contacto",
  redes: [
    // [PENDIENTE] perfiles reales del estudio — hasta entonces no se enlaza a "#".
  ] as ReadonlyArray<{ label: string; href: string }>,
} as const;
