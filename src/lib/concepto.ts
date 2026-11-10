/**
 * «Trinquete»: la pieza que… → separa el nombre entre comillas del resto. Es la regla de
 * `partirConcepto` del boceto (`undertactics-bocetos/js/comun.js`): sin comillas al
 * principio, `nombre` queda vacío y `resto` es el texto entero.
 *
 * Sin imports (ni `@/`), para que los tests de Node lo carguen tal cual.
 */
export function partirConcepto(texto: string): { nombre: string; resto: string } {
  const m = texto.match(/^«([^»]+)»:?\s*(.*)$/);
  return m ? { nombre: m[1], resto: m[2].charAt(0).toUpperCase() + m[2].slice(1) } : { nombre: "", resto: texto };
}
