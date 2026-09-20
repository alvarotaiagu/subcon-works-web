export interface PasoProceso {
  numero: string;
  titulo: string;
  descripcion: string;
}

export const proceso: PasoProceso[] = [
  {
    numero: "01",
    titulo: "Nos cuentas",
    descripcion:
      "Diez minutos de formulario, con tus palabras. Lo que no sepas lo dejas en blanco: se nota menos un hueco que un dato inventado.",
  },
  {
    numero: "02",
    titulo: "Miramos",
    descripcion:
      "Tu negocio por fuera y por dentro. Sale un informe con las horas que se van cada semana y lo que cuestan, en euros.",
  },
  {
    numero: "03",
    titulo: "Te lo contamos",
    descripcion:
      "El informe es tuyo, gratis y sin compromiso. Si con eso te apañas solo, perfecto. Aquí no hay letra pequeña.",
  },
  {
    numero: "04",
    titulo: "Construimos",
    descripcion:
      "Partimos de una base propia y la adaptamos a lo tuyo. Semanas, no meses, y sabiendo el precio desde el principio.",
  },
  {
    numero: "05",
    titulo: "Lo ves funcionando",
    descripcion:
      "Montado y andando antes de que pagues nada. Si no es lo que esperabas, se cambia o no hay trato.",
  },
  {
    numero: "06",
    titulo: "Lo mantenemos",
    descripcion:
      "Sigue funcionando, se actualiza y crece contigo. Sin permanencia: se queda quien quiere quedarse.",
  },
];
