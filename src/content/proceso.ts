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
 * Los seis pasos del proceso, versión «consultora» (rama exp/consultora): el contacto es el
 * formulario corto de la portada, se trabaja por fases (lo primero que funciona, en
 * semanas) y cada fase se paga cuando se ve funcionando. Decidido por Álvaro el
 * 2026-10-31; en la portada anterior eran «semanas, no meses» y «antes de pagar».
 *
 * Sin imports, para que los tests de Node lo carguen tal cual.
 */
export const proceso: PasoProceso[] = [
  {
    numero: "01",
    titulo: "Nos cuentas",
    descripcion:
      "Cinco minutos de formulario, con tus palabras: a qué te dedicas y qué te gustaría quitarte de encima. Lo que no sepas, déjalo en blanco.",
    dato: "5 min",
    vesTu: "Un formulario corto",
    debajo: "Leemos lo que nos cuentas y preparamos las preguntas",
  },
  {
    numero: "02",
    titulo: "Miramos",
    descripcion:
      "Hablamos contigo y vemos cómo trabajas: qué programas usas, qué se hace a mano y dónde se van las horas cada semana, en horas y en euros.",
    dato: "horas y euros",
    vesTu: "Una conversación, y sigues con lo tuyo",
    debajo: "Tus procesos por dentro: programas, datos y tareas a mano",
  },
  {
    numero: "03",
    titulo: "Te lo contamos",
    descripcion:
      "El diagnóstico es tuyo, gratis y sin compromiso: qué montaríamos, en qué orden y por cuánto, por escrito. Si con eso te apañas solo, perfecto.",
    dato: "gratis",
    vesTu: "El diagnóstico, tuyo",
    debajo: "Qué montaríamos, en qué orden y por cuánto",
  },
  {
    numero: "04",
    titulo: "Construimos",
    descripcion:
      "Por fases, empezando por lo que más horas te quita. Lo primero que funciona llega en semanas y el resto se va sumando, con el precio de cada fase por escrito antes de empezarla.",
    dato: "por fases",
    vesTu: "Lo primero, funcionando en semanas",
    debajo: "Conectamos tus programas y montamos la primera fase",
  },
  {
    numero: "05",
    titulo: "Lo ves funcionando",
    descripcion:
      "Cada fase la pruebas con tus datos de verdad antes de pagarla. Si no hace lo que esperabas, se ajusta antes de seguir.",
    dato: "antes de cada pago",
    vesTu: "Lo pruebas con tus datos",
    debajo: "Pruebas, registro de lo que hace y límites a la IA",
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
