export interface Cifra {
  valor: number;
  sufijo: string;
  etiqueta: string;
}

/** Valores de partida — edítalos aquí cuando tengas datos reales. */
export const cifras: Cifra[] = [
  { valor: 12, sufijo: "+", etiqueta: "Proyectos entregados" },
  { valor: 3, sufijo: " sem.", etiqueta: "Tiempo medio de entrega" },
  { valor: 20, sufijo: "h", etiqueta: "Ahorradas al mes por cliente" },
  { valor: 12, sufijo: "+", etiqueta: "Negocios en Galicia" },
];
