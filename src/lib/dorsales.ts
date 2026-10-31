/**
 * Dorsales de la sección «−1 · La plantilla» (spec 002 §3.8): las destacadas llevan del
 * 1 al N, en el orden de `plantillas.ts`, y las demás de N+1 al total, también en su
 * orden. El dorsal no se guarda en ningún sitio: se calcula aquí.
 *
 * Sin imports (ni `@/`), para que los tests de Node lo carguen tal cual.
 */

export interface ConDorsal<T> {
  plantilla: T;
  dorsal: number;
}

/**
 * Cada plantilla con su dorsal, ordenadas por dorsal: las destacadas primero y luego el
 * resto, cada grupo en el orden de entrada. No toca la lista que recibe. Con menos de 10
 * destacadas (o con más de 30 plantillas) la numeración sigue igual: N son las que haya.
 */
export function conDorsal<T extends { destacada?: boolean }>(plantillas: readonly T[]): ConDorsal<T>[] {
  const titulares = plantillas.filter((p) => p.destacada);
  const banquillo = plantillas.filter((p) => !p.destacada);
  return [...titulares, ...banquillo].map((plantilla, i) => ({ plantilla, dorsal: i + 1 }));
}

/**
 * «Trinquete»: la pieza que… → separa el nombre entre comillas del resto. Es la regla de
 * `partirConcepto` del boceto (`undertactics-bocetos/js/comun.js`): sin comillas al
 * principio, `nombre` queda vacío y `resto` es el texto entero.
 */
export function partirConcepto(texto: string): { nombre: string; resto: string } {
  const m = texto.match(/^«([^»]+)»:?\s*(.*)$/);
  return m ? { nombre: m[1], resto: m[2].charAt(0).toUpperCase() + m[2].slice(1) } : { nombre: "", resto: texto };
}
