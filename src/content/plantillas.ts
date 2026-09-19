export interface Plantilla {
  nombre: string;
  sector: string;
  incluye: string[];
  imagen: string;
}

export const plantillas: Plantilla[] = [
  {
    nombre: "Mesa",
    sector: "Hostelería",
    incluye: ["Carta digital", "Reservas", "Galería", "Horarios"],
    imagen: "/plantillas/mesa.svg",
  },
  {
    nombre: "Taller",
    sector: "Oficios y servicios",
    incluye: ["Presupuestos", "Casos de trabajo", "Formulario de contacto"],
    imagen: "/plantillas/taller.svg",
  },
  {
    nombre: "Estudio",
    sector: "Belleza y peluquería",
    incluye: ["Catálogo de servicios", "Reserva de cita", "Equipo"],
    imagen: "/plantillas/estudio.svg",
  },
  {
    nombre: "Consulta",
    sector: "Clínicas y salud",
    incluye: ["Servicios", "Profesionales", "Cita online", "Avisos legales"],
    imagen: "/plantillas/consulta.svg",
  },
  {
    nombre: "Local",
    sector: "Comercio de barrio",
    incluye: ["Catálogo", "Ubicación", "Pedidos por WhatsApp"],
    imagen: "/plantillas/local.svg",
  },
];
