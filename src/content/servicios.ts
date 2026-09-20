export interface Servicio {
  numero: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  /** Icono suelto y transparente para el panel que sigue al cursor en el
   * hover de escritorio (ver Servicios.tsx). Si falta, ese hover no muestra
   * ningún panel para este servicio — como ya pasa con "Agentes y chatbots
   * con IA", que en su lugar muestra la red de nodos 3D. */
  icono?: string;
}

export const servicios: Servicio[] = [
  {
    numero: "01",
    nombre: "Diseño y desarrollo web",
    descripcion:
      "Webs rápidas, propias y mantenibles. Nada de plantillas genéricas ni constructores que te atan.",
    imagen: "/servicios/diseno-desarrollo.svg",
    icono: "/servicios/diseno-desarrollo-icono.svg",
  },
  {
    numero: "02",
    nombre: "Automatización de procesos",
    descripcion:
      "Facturación, reservas, pedidos, informes. Lo que hoy haces a mano, funcionando solo.",
    imagen: "/servicios/automatizacion.svg",
    icono: "/servicios/automatizacion-icono.svg",
  },
  {
    numero: "03",
    nombre: "Agentes y chatbots con IA",
    descripcion:
      "Atención en web, WhatsApp y llamadas. Responden, reservan y filtran sin que estés tú.",
    imagen: "/servicios/agentes-ia.svg",
  },
  {
    numero: "04",
    nombre: "Marketing y contenido con IA",
    descripcion:
      "Email, reseñas, redes y contenido, con sistemas que se sostienen sin dedicarles el día.",
    imagen: "/servicios/marketing-ia.svg",
    icono: "/servicios/marketing-ia-icono.svg",
  },
];
