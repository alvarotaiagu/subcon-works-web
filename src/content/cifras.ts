import { plantillas } from "./plantillas.ts";

export interface Cifra {
  valor: number;
  sufijo: string;
  etiqueta: string;
}

/**
 * Cifras del taller, no de una cartera de clientes.
 *
 * Todas son comprobables hoy: el catálogo de plantillas vivas y el número de preguntas de la
 * auditoría. No se publica ningún "X clientes satisfechos" mientras no haya clientes. Desde la
 * 003 salen el plazo («2 sem.», A32), el tiempo de la auditoría («10 minutos», A35) y el precio
 * («0 €», A34 y A80: se dice «no se cobra»), que no tienen fuente (textos.md, `cifras.ts`).
 *
 * La de plantillas sale del catálogo (spec 002 §3.5): si cambia `plantillas.ts`, cambia
 * sola. Import relativo con extensión, para que los tests de Node lo carguen.
 */
export const cifras: Cifra[] = [
  { valor: plantillas.length, sufijo: "", etiqueta: "Plantillas publicadas, con su demo entera" },
  { valor: 36, sufijo: "", etiqueta: "Preguntas de la auditoría" },
];

/** El plazo («2 sem.»): ya no hay cifra de plazo (A32), así que es `undefined`. Lo lee `Plantillas`, de la portada vigente. */
export const plazo = cifras.find((c) => c.sufijo.trim() === "sem.");

/** «semana» o «semanas» según el número. */
export const palabraSemanas = (n: number) => (n === 1 ? "semana" : "semanas");
