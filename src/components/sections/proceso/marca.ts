/**
 * Marca de tiempo justo antes de evaluar `three` (para `?fps`). `escena3d.ts` importa este
 * módulo antes que `three` y, por el orden de evaluación de los módulos ES, corre antes;
 * la diferencia con el final de `escena3d.ts` es lo que cuesta evaluar la librería. Hace
 * falta porque Safari (y todo iOS) no tiene la API de tareas largas.
 */
export const antesDeThree = performance.now();
