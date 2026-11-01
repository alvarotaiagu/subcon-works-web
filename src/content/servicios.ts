export interface Servicio {
  numero: string;
  nombre: string;
  /** Una línea: qué resuelve, en la lengua del cliente. */
  descripcion: string;
  /** Lo que entra en el paquete. Se pintan como etiquetas. */
  incluye: string[];
  /** Icono de línea para el panel que sigue al cursor (ver Servicios.tsx). */
  icono: string;
  /** Enlace opcional bajo las etiquetas, a la herramienta que sostiene el servicio. */
  enlace?: { href: string; label: string };
}

export const servicios: Servicio[] = [
  {
    numero: "01",
    nombre: "Diseño y desarrollo web",
    descripcion:
      "Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima, y a tu nombre. Y si ya tienes una en WordPress, Wix o Webnode que va lenta o a la que nadie tiene las claves, se saca de ahí sin perder lo que ya te posiciona en Google.",
    incluye: [
      "Diseño a medida",
      "Código sin constructores",
      "Textos incluidos",
      "Logotipo redibujado",
      "Avisos legales",
      "Rescate de webs viejas",
      "Redirecciones 301",
    ],
    icono: "/servicios/web.svg",
  },
  {
    numero: "02",
    nombre: "Tienda online",
    descripcion:
      "Te la entregamos con el catálogo subido y cobrando desde el primer día. Después la llevas tú desde el móvil, y te avisa de qué reponer.",
    incluye: [
      "Catálogo cargado",
      "Tarjeta y Bizum",
      "Recogida en tienda",
      "Panel en el móvil",
      "Páginas legales",
    ],
    icono: "/servicios/tienda.svg",
    enlace: { href: "/herramientas/#tiendas", label: "Ver cómo funciona" },
  },
  {
    numero: "03",
    nombre: "Aparecer en Google",
    descripcion:
      "Que te encuentren en Google se trabaja a mano: con la ficha de Google, las reseñas y una web que cargue rápido de verdad.",
    incluye: [
      "Ficha de Google",
      "SEO local",
      "Reseñas",
      "Datos estructurados",
      "Core Web Vitals",
    ],
    icono: "/servicios/google.svg",
  },
  {
    numero: "04",
    nombre: "Automatización de procesos",
    descripcion:
      "Presupuestos, citas, recordatorios, informes: si algo se copia a mano de un sitio a otro, podemos montar que funcione solo mientras tú atiendes.",
    incluye: [
      "Reservas y citas",
      "Recordatorios",
      "Conexión entre programas",
      "Informes automáticos",
    ],
    icono: "/servicios/automatizacion.svg",
  },
  {
    numero: "05",
    nombre: "Agentes y chatbots con IA",
    descripcion:
      "Un asistente en tu web que contesta lo de siempre, coge la cita y te pasa lo que necesita que estés tú. Y, a tu medida, también en WhatsApp.",
    incluye: [
      "Web, y WhatsApp a medida",
      "Fuera de horario",
      "Reserva de cita",
    ],
    icono: "/servicios/agentes.svg",
  },
  {
    numero: "06",
    nombre: "Marketing y contenido con IA",
    descripcion:
      "Lo que se puede dejar funcionando solo: el correo a tus clientes, las fichas de producto, los textos de la web y la respuesta a cada reseña que entra.",
    incluye: [
      "Email a clientes",
      "Fichas de producto",
      "Respuesta a reseñas",
      "Textos de la web",
      "Avisos automáticos",
    ],
    icono: "/servicios/contenido.svg",
  },
  {
    numero: "07",
    nombre: "Mantenimiento y soporte",
    descripcion:
      "Cambiar la carta, subir precios, abrir los domingos de verano: nos lo dices y lo cambiamos. También hacemos las copias de seguridad y las actualizaciones.",
    incluye: [
      "Cambios de contenido",
      "Copias de seguridad",
      "Actualizaciones",
      "Te lo llevas entero",
    ],
    icono: "/servicios/mantenimiento.svg",
  },
];
