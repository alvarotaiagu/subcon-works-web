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
      "Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Es tuya, se puede cambiar y no paga cuota a nadie por seguir existiendo. Y si ya tienes una en WordPress, Wix o Webnode que va lenta o a la que nadie tiene las claves, se saca de ahí sin perder lo que ya te posiciona en Google.",
    incluye: [
      "Diseño propio",
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
      "Te la entregamos con el catálogo subido y cobrando desde el primer día. Después la llevas tú desde el móvil, y te dice qué reponer y qué se mira sin venderse.",
    incluye: [
      "Catálogo cargado",
      "Tarjeta y Bizum",
      "Recogida y reparto local",
      "Pedidos por WhatsApp",
      "Panel en el móvil",
      "Instagram y Google Shopping",
      "Páginas legales",
    ],
    icono: "/servicios/tienda.svg",
    enlace: { href: "/herramientas/#tiendas", label: "Ver cómo funciona" },
  },
  {
    numero: "03",
    nombre: "Aparecer en Google",
    descripcion:
      "La mitad de los negocios de aquí se buscan por el móvil a dos calles de distancia. Eso se trabaja con la ficha de Google, las reseñas y una web que cargue rápido de verdad.",
    incluye: [
      "Ficha de Google",
      "SEO local",
      "Reseñas",
      "Datos estructurados",
      "Core Web Vitals",
      "Medición sin cookies",
    ],
    icono: "/servicios/google.svg",
    enlace: { href: "/herramientas/#ficha-google", label: "Ver cómo funciona" },
  },
  {
    numero: "04",
    nombre: "Automatización de procesos",
    descripcion:
      "Presupuestos, citas, recordatorios, facturas, informes. Lo que hoy copias de un sitio a otro a mano, funcionando solo mientras tú atiendes.",
    incluye: [
      "Reservas y citas",
      "Recordatorios",
      "Facturación",
      "Conexión entre programas",
      "Informes automáticos",
    ],
    icono: "/servicios/automatizacion.svg",
  },
  {
    numero: "05",
    nombre: "Agentes y chatbots con IA",
    descripcion:
      "Atención en la web, en WhatsApp y al teléfono. Contestan lo de siempre, cogen la cita y te pasan solo lo que de verdad necesita que estés tú.",
    incluye: [
      "Web y WhatsApp",
      "Fuera de horario",
      "Reserva de cita",
      "Filtra y te avisa",
      "Habla como tu negocio",
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
      "Cambiar la carta, subir precios, abrir los domingos de verano. Se hace y ya está: sin abrir una incidencia, sin esperar tres semanas y sin que se caiga nada por el camino.",
    incluye: [
      "Cambios de contenido",
      "Copias de seguridad",
      "Actualizaciones",
      "Vigilancia de caídas",
      "Te lo llevas cuando quieras",
    ],
    icono: "/servicios/mantenimiento.svg",
    enlace: { href: "/herramientas/#vigilancia", label: "Ver cómo funciona" },
  },
];
