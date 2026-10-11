import { getLenis } from "@/hooks/useLenis";

/**
 * Baja hasta `el` respetando su `scroll-margin-top` (las secciones llevan
 * `scroll-mt-28` para no quedar bajo la cabecera fija).
 *
 * Con Lenis el salto va por Lenis: un `scrollIntoView` se pelearía con su
 * scroll suavizado. Sin Lenis (reduced-motion) es un salto seco, sin
 * `smooth`. Mide en el momento de llamar: quien salte tras cambiar el alto de
 * la página tiene que esperar a que esté pintada y a `ScrollTrigger.refresh()`.
 */
export function irAAncla(el: HTMLElement | null): void {
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    // Lenis recalcula su tope con un ResizeObserver con retardo: justo tras
    // cargar (o tras cambiar de alto) el tope viejo cortaría el salto a medias.
    lenis.resize();
    // Lenis ya resta el `scroll-margin-top` del destino: no pasar `offset`.
    lenis.scrollTo(el);
    return;
  }
  el.scrollIntoView({ block: "start" });
}
