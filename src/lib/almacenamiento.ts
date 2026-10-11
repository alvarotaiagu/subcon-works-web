/**
 * Las claves de localStorage se llamaban `subcon:…` hasta el cambio de nombre a
 * Undertactics (2026-10-11). Esto pasa el valor de la clave antigua a la nueva
 * la primera vez, para que nadie pierda su borrador ni vuelva a ver el aviso.
 * Puede lanzar si el almacenamiento está bloqueado: llamarlo dentro del
 * `try` de quien lo use.
 */
export function traerDeClaveAntigua(antigua: string, nueva: string) {
  const valor = localStorage.getItem(antigua);
  if (valor === null) return;
  if (localStorage.getItem(nueva) === null) localStorage.setItem(nueva, valor);
  localStorage.removeItem(antigua);
}
