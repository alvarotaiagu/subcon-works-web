"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cargarGsap, EASE_INOUT, gsapCargado, type Movimiento } from "@/lib/gsap";

/**
 * Transición entre páginas (spec 002 §3.4). Al cambiar de ruta, la página nueva queda
 * tapada por el terreno (--hondo) y se descubre desde una línea lima que baja de arriba
 * abajo. Se anima un número (`p`, de 0 a 100) y con él se escriben el `clip-path` de la
 * tapa y la posición de la línea: GSAP normaliza `inset()` y no se anima entero.
 * Con movimiento reducido, cambio directo. En la primera carga no hace nada.
 *
 * GSAP llega con `import()` (D-028): si se navega antes de que llegue, o si no llega, el
 * cambio es directo (§6).
 */
export function PageTransition() {
  const pathname = usePathname();
  const tapaRef = useRef<HTMLDivElement>(null);
  const lineaRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    // Proceso y Plantillas usan ScrollTrigger con pin:true, que envuelve la
    // sección en un pin-spacer y la reparenta. Al navegar a otra ruta, React
    // desmonta toda la home en un único commit; si el pin todavía no se ha
    // revertido cuando le toca a esa sección, su nodo ya no cuelga de <main>
    // y el removeChild de React explota con NotFoundError. Matarlos aquí, en
    // el click, deja el DOM ya desenganchado del pin antes de que React
    // empiece a desmontar nada.
    const onLinkClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement).closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("#") || anchor.getAttribute("target") === "_blank") return;
      // `/#servicios` desde la portada no cambia de ruta: no se desmonta nada y los pins siguen.
      if (new URL(href, window.location.href).pathname === window.location.pathname) return;
      const soltar = ({ ScrollTrigger }: Movimiento) => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      const ya = gsapCargado();
      if (ya) soltar(ya);
      // GSAP en camino (D-028): los pins se ponen en cuanto llega, quizá antes de que React
      // desmonte la página; se sueltan justo después (su tarea va tras la del pin).
      else cargarGsap().then(soltar, () => {});
    };
    document.addEventListener("click", onLinkClick, true);
    return () => document.removeEventListener("click", onLinkClick, true);
  }, []);

  // Antes de pintar: la página nueva no llega a verse ni un fotograma sin tapar.
  useLayoutEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const tapa = tapaRef.current;
    const linea = lineaRef.current;
    if (!tapa || !linea) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // GSAP aún en camino (D-028) o fallido: cambio directo, como con movimiento reducido.
    // Esperarlo con la tapa puesta dejaría la página nueva oculta lo que tarde el chunk.
    const movimiento = gsapCargado();
    if (!movimiento) return;

    const estado = { p: 0 };
    const pintar = () => {
      tapa.style.clipPath = `inset(${estado.p}% 0 0 0)`;
      linea.style.transform = `translateY(${estado.p}%)`;
    };
    const ocultar = () => {
      tapa.style.visibility = "hidden";
      linea.style.visibility = "hidden";
    };
    pintar();
    tapa.style.visibility = "visible";
    linea.style.visibility = "visible";
    const tween = movimiento.gsap.to(estado, {
      p: 100,
      duration: 0.8,
      delay: 0.05,
      ease: EASE_INOUT,
      onUpdate: pintar,
      onComplete: ocultar,
    });

    return () => {
      tween.kill();
      ocultar();
    };
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[95]" aria-hidden="true">
      <div ref={tapaRef} className="invisible absolute inset-0 bg-hondo" />
      {/* La línea va en una capa del alto de la ventana: su translateY en % es el mismo
          número que el recorte de la tapa. */}
      <div ref={lineaRef} className="invisible absolute inset-0">
        <div className="h-[3px] w-full bg-superficie" />
      </div>
    </div>
  );
}
