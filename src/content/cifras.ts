import { trabajos } from "./trabajos.ts";

export interface Cifra {
  valor: number;
  sufijo: string;
  etiqueta: string;
}

/**
 * Cifras del taller, no de una cartera de clientes.
 *
 * Todas son comprobables hoy: las webs enseñadas en Trabajos, el plazo con el
 * que se trabaja, el número de preguntas de la auditoría y lo que cuesta. No se
 * publica ningún "X clientes satisfechos" mientras no haya clientes.
 *
 * La de trabajos sale de la lista (spec 002 §3.5): si cambia `trabajos.ts`, cambia
 * sola. Import relativo con extensión, para que los tests de Node lo carguen.
 */
export const cifras: Cifra[] = [
  { valor: trabajos.length, sufijo: "", etiqueta: "Webs propias y de clientes, en línea y abiertas" },
  { valor: 2, sufijo: " sem.", etiqueta: "Desde que dices que sí hasta que está en línea" },
  { valor: 36, sufijo: "", etiqueta: "Preguntas de la auditoría, y las contestas en 10 minutos" },
  { valor: 0, sufijo: " €", etiqueta: "Lo que cuesta la auditoría y el presupuesto" },
];

/** El plazo («2 sem.»), que el proceso y el recuento de la Sobria escriben entero. */
export const plazo = cifras.find((c) => c.sufijo.trim() === "sem.");

/** «semana» o «semanas» según el número. */
export const palabraSemanas = (n: number) => (n === 1 ? "semana" : "semanas");
