export interface PasoProceso {
  numero: string;
  titulo: string;
  descripcion: string;
  /** El dato del paso, en Kode Mono lima (spec 002 §3.9). */
  dato: string;
  /** Columna «Lo que ves tú» de la tabla del proceso (§3.9, P-04). */
  vesTu: string;
  /** Columna «Lo que hacemos por debajo» de la tabla del proceso (§3.9, P-04). */
  debajo: string;
}

/**
 * Los seis pasos del proceso. `vesTu` y `debajo` parten del boceto
 * (`undertactics-bocetos/js/a.js:213-214`); los que faltaban (`vesTu` de 02 y 04,
 * `debajo` de 01, 03 y 05) son borradores que revisa Álvaro en P-04.
 *
 * Sin imports, para que los tests de Node lo carguen tal cual.
 */
export const proceso: PasoProceso[] = [
  {
    numero: "01",
    titulo: "Nos cuentas",
    descripcion:
      "Diez minutos de formulario, con tus palabras. Lo que no sepas lo dejas en blanco: se nota menos un hueco que un dato inventado.",
    dato: "10 min",
    vesTu: "Un formulario de diez minutos",
    debajo: "Ordenamos tus respuestas por las horas que te cuestan",
  },
  {
    numero: "02",
    titulo: "Miramos",
    descripcion:
      "Tu negocio por fuera y por dentro. Sale un informe con las horas que se van cada semana y lo que cuestan, en euros.",
    dato: "horas y euros",
    vesTu: "Sigues con lo tuyo mientras miramos",
    debajo: "Tu negocio por fuera y por dentro",
  },
  {
    numero: "03",
    titulo: "Te lo contamos",
    descripcion:
      "El informe es tuyo, gratis y sin compromiso. Si con eso te apañas solo, perfecto.",
    dato: "gratis",
    vesTu: "El informe, tuyo",
    debajo: "Qué montaríamos, en qué orden y por cuánto",
  },
  {
    numero: "04",
    titulo: "Construimos",
    descripcion:
      "Partimos de una base propia y la adaptamos a lo tuyo. Semanas, no meses, y sabiendo el precio desde el principio.",
    dato: "semanas, no meses",
    vesTu: "El diseño, con tu marca y tus textos",
    debajo: "Una base propia adaptada a lo tuyo",
  },
  {
    numero: "05",
    titulo: "Lo ves funcionando",
    descripcion:
      "Montado y andando antes de que pagues nada. Si no es lo que esperabas, se cambia o no hay trato.",
    dato: "antes de pagar",
    vesTu: "Montado y andando",
    debajo: "Lo conectamos a lo que ya usas y lo probamos",
  },
  {
    numero: "06",
    titulo: "Lo mantenemos",
    descripcion:
      "Sigue funcionando, se actualiza y crece contigo. Y como todo está a tu nombre, si un día te vas, te lo llevas entero.",
    dato: "a tu nombre",
    vesTu: "Crece contigo",
    debajo: "Copias, actualizaciones y vigilancia de caídas",
  },
];
