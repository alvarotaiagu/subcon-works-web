export interface PasoProceso {
  numero: string;
  titulo: string;
  descripcion: string;
}

export const proceso: PasoProceso[] = [
  {
    numero: "01",
    titulo: "Miramos",
    descripcion: "Vemos qué haces hoy a mano y qué te está costando dinero.",
  },
  {
    numero: "02",
    titulo: "Construimos",
    descripcion: "Partimos de una base propia y la adaptamos. Semanas, no meses.",
  },
  {
    numero: "03",
    titulo: "Lo ves funcionando",
    descripcion: "Te lo enseñamos montado antes de hablar de precio.",
  },
  {
    numero: "04",
    titulo: "Lo mantenemos",
    descripcion: "Sigue funcionando, se actualiza y crece contigo.",
  },
];
