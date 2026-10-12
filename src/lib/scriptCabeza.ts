/**
 * El script del `<head>` (spec 002 §3.14 y §3.16, plan PD-8 y PD-13). `layout.tsx` lo
 * pone en línea, antes de pintar nada, y hace cuatro cosas en `<html>`:
 *
 * 1. `js-si`, siempre: hay JS. Todo estado inicial oculto (máscaras, palabras,
 *    emersión, cortina) existe solo bajo esta clase; sin JS la web se lee entera.
 * 2. `cortina-si`, solo en una carga de documento de la portada (`basePath + "/"`), la
 *    primera vez de la sesión y sin movimiento reducido. Apunta la sesión como vista
 *    (entrar por una interior no la apunta) y arma el seguro: a los 4,5 s quita la
 *    clase, con lo que la cortina se va y vuelve el scroll, aunque el JS de la página
 *    no llegue a correr. `Cortina.tsx` lo anula al arrancar (`window.__cortinaSeguro`).
 * 3. `densidad-sobria`, si la URL lleva `revision=sobria` (§3.16: sin parpadeo).
 * 4. Nada más. Cada paso va en su `try`: un `sessionStorage` bloqueado no deja la
 *    cortina puesta.
 *
 * Sin imports, para que el layout (componente de servidor) y `Cortina.tsx` (de cliente)
 * lean las mismas constantes.
 */

/** Clave de `sessionStorage`: la cortina ya salió en esta pestaña (la misma de siempre). */
export const CLAVE_CORTINA = "undertactics-preloader-seen";
/** El terreno se parte por la superficie (paso 3 de la cortina). */
export const EVENTO_CORTINA_PARTIDA = "undertactics:preloader-done";
/** La cortina ya no está y se puede hacer scroll. */
export const EVENTO_CORTINA_FUERA = "undertactics:preloader-gone";
/** Lo que espera el seguro del `<head>` antes de quitar la cortina por su cuenta (ms). */
export const SEGURO_CORTINA_MS = 4500;

/** El código, como cadena. `base` es el basePath de Pages («» en local). */
export function scriptCabeza(base: string): string {
  const portada = JSON.stringify(`${base}/`);
  const clave = JSON.stringify(CLAVE_CORTINA);
  const fuera = JSON.stringify(EVENTO_CORTINA_FUERA);
  return [
    "(function(){var d=document.documentElement,w=window;",
    'try{d.classList.add("js-si")}catch(e){}',
    "try{",
    `var p=location.pathname;if(p===${portada}||p===${portada}+"index.html"){`,
    `if(!sessionStorage.getItem(${clave})&&!matchMedia("(prefers-reduced-motion: reduce)").matches){`,
    `sessionStorage.setItem(${clave},"1");d.classList.add("cortina-si");w.__cortinaDecidida=true;`,
    'w.__cortinaSeguro=setTimeout(function(){d.classList.remove("cortina-si");',
    `try{dispatchEvent(new Event(${fuera}))}catch(e){}},${SEGURO_CORTINA_MS})}}`,
    '}catch(e){d.classList.remove("cortina-si")}',
    'try{if(/[?&]revision=sobria(&|$)/.test(location.search))d.classList.add("densidad-sobria")}catch(e){}',
    "})()",
  ].join("");
}
