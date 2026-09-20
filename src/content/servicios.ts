export interface Servicio {
  numero: string;
  nombre: string;
  /** Una línea: qué resuelve, en la lengua del cliente. */
  descripcion: string;
  /** Lo que entra en el paquete. Se pintan como etiquetas. */
  incluye: string[];
  /** Icono de línea para el panel que sigue al cursor (ver Servicios.tsx). */
  icono: string;
}

export const servicios: Servicio[] = [
  {
    numero: "01",
    nombre: "Diseño y desarrollo web",
    descripcion:
      "Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Es tuya, se puede cambiar y no paga cuota a nadie por seguir existiendo.",
    incluye: [
      "Diseño propio",
      "Código sin constructores",
      "Móvil primero",
      "Textos incluidos",
      "Logotipo redibujado",
      "Avisos legales",
    ],
    icono: "/servicios/web.svg",
  },
  {
    numero: "02",
    nombre: "Plantillas por sector",
    descripcion:
      "Treinta bases ya construidas y publicadas. Si una encaja con lo tuyo, se adapta con tus datos y tus fotos: en línea en dos semanas y por bastante menos que empezar de cero.",
    incluye: [
      "30 bases vivas",
      "Dos semanas",
      "Precio cerrado",
      "Adaptación completa",
      "Puedes verla antes",
    ],
    icono: "/servicios/plantillas.svg",
  },
  {
    numero: "03",
    nombre: "Rescate de webs y migraciones",
    descripcion:
      "Tienes algo hecho en WordPress, Wix o Webnode que va lento, ya no lo toca nadie o nadie te da las claves. Se saca todo de ahí sin perder lo que ya te posiciona en Google.",
    incluye: [
      "Rastreo de la web vieja",
      "Redirecciones 301",
      "Se conserva el posicionamiento",
      "Convivencia si hace falta",
      "Dominio y correo",
    ],
    icono: "/servicios/rescate.svg",
  },
  {
    numero: "04",
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
  },
  {
    numero: "05",
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
    numero: "06",
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
    numero: "07",
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
    numero: "08",
    nombre: "Vídeo, reels y redes",
    descripcion:
      "Esto no lo hace una máquina. Vamos, grabamos en tu local y montamos: reels, vídeo corto y fotos de lo que vendes. Y si quieres, llevamos la cuenta entera y te la quitamos de encima.",
    incluye: [
      "Reels y vídeo corto",
      "Grabamos en tu local",
      "Montaje y subtítulos",
      "Foto de producto",
      "Calendario de publicación",
      "Comentarios y mensajes",
    ],
    icono: "/servicios/video.svg",
  },
  {
    numero: "09",
    nombre: "Mantenimiento y soporte",
    descripcion:
      "Cambiar la carta, subir precios, abrir los domingos de verano. Se hace y ya está: sin abrir una incidencia, sin esperar tres semanas y sin que se caiga nada por el camino.",
    incluye: [
      "Cambios de contenido",
      "Copias de seguridad",
      "Actualizaciones",
      "Vigilancia de caídas",
      "Sin permanencia",
    ],
    icono: "/servicios/mantenimiento.svg",
  },
];
