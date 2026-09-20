export interface Cifra {
  valor: number;
  sufijo: string;
  etiqueta: string;
}

/**
 * Cifras del taller, no de una cartera de clientes.
 *
 * Todas son comprobables hoy: el catálogo de plantillas vivas, el plazo con el
 * que se trabaja, el número de preguntas de la auditoría y lo que cuesta. No se
 * publica ningún "X clientes satisfechos" mientras no haya clientes.
 */
export const cifras: Cifra[] = [
  { valor: 30, sufijo: "", etiqueta: "Plantillas propias publicadas y en línea" },
  { valor: 2, sufijo: " sem.", etiqueta: "Desde que dices que sí hasta que está en línea" },
  { valor: 36, sufijo: "", etiqueta: "Preguntas de la auditoría, y las contestas en 10 minutos" },
  { valor: 0, sufijo: " €", etiqueta: "Lo que cuesta la auditoría y el presupuesto" },
];
