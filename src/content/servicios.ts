export interface Servicio {
  numero: string;
  nombre: string;
  descripcion: string;
  imagen: string;
}

export const servicios: Servicio[] = [
  {
    numero: "01",
    nombre: "Diseño y desarrollo web",
    descripcion:
      "Webs rápidas, propias y mantenibles. Nada de plantillas genéricas ni constructores que te atan.",
    imagen: "/servicios/diseno-desarrollo.svg",
  },
  {
    numero: "02",
    nombre: "Automatización de procesos",
    descripcion:
      "Facturación, reservas, pedidos, informes. Lo que hoy haces a mano, funcionando solo.",
    imagen: "/servicios/automatizacion.svg",
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
  },
];
