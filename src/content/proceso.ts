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
      "Un formulario corto, con tus palabras: a qué te dedicas y qué te gustaría mejorar.",
    dato: "con tus palabras",
    vesTu: "Un formulario corto",
    debajo: "Leemos lo que nos cuentas y preparamos las preguntas",
  },
  {
    numero: "02",
    titulo: "Miramos",
    descripcion:
      "Hablamos contigo y vemos cómo trabajas: qué usas, qué se hace a mano y qué te gustaría que funcionara de otra manera.",
    dato: "cómo trabajas",
    vesTu: "Una conversación, y sigues con lo tuyo",
    debajo: "Tus procesos por dentro: programas, datos y tareas a mano",
  },
  {
    numero: "03",
    titulo: "Te lo contamos",
    descripcion:
      "La propuesta, por escrito: qué montaríamos, en qué orden y cuánto cuesta cada fase. No se cobra, y es tuya: si con ella te apañas solo, perfecto.",
    dato: "por escrito",
    vesTu: "La propuesta, tuya",
    debajo: "Qué montaríamos, en qué orden y por cuánto",
  },
  {
    numero: "04",
    titulo: "Construimos",
    descripcion:
      "Por fases, empezando por lo que más te importa. Lo primero que funciona llega en semanas y el resto se va sumando, con el precio de cada fase por escrito antes de empezarla.",
    dato: "por fases",
    vesTu: "Lo primero, funcionando en semanas",
    debajo: "Montamos la primera fase",
  },
  {
    numero: "05",
    titulo: "Lo ves funcionando",
    descripcion:
      "Cada fase la pruebas con tus datos de verdad antes de pagarla. Si no hace lo que esperabas, se ajusta antes de seguir.",
    dato: "antes de cada pago",
    vesTu: "Lo pruebas con tus datos",
    debajo: "Pruebas y, si lleva IA, registro de lo que hace y límites",
  },
  {
    numero: "06",
    titulo: "Lo mantenemos",
    descripcion:
      "Sigue funcionando, se actualiza y crece contigo. Y como está a tu nombre, si un día te vas, te lo llevas entero. La tienda online es la excepción: va sobre nuestra plataforma, y su código no es tuyo.",
    dato: "a tu nombre",
    vesTu: "Crece contigo",
    debajo: "Copias, actualizaciones y cambios de contenido",
  },
];
