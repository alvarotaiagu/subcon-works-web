"use client";

import { useLayoutEffect, type RefObject } from "react";

/** Lo que tarda la máscara en bajar (ms) y la línea de disparo (85 % del alto de la ventana). */
const DURACION = 900;
const DISPARO = 0.85;

/** expo.out, como el resto de entradas (§3.2). */
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** ¿Hay que esconder algo para descubrirlo? Solo con `html.js-si` y movimiento permitido. */
export function hayEntrada(): boolean {
  return (
    document.documentElement.classList.contains("js-si") &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Entrada de una sección de la portada (spec 002 §3.5, plan PD-7): el bloque se descubre
 * desde una línea horizontal que baja, una sola vez, al cruzar su borde de arriba el 85 %
 * de la pantalla. Al terminar se quita el `clip-path` (§3.9: nada de recortes sobre el
 * pin del proceso).
 *
 * - Sin JS no hace nada (el estado oculto lo pone este hook, no el CSS del servidor), y
 *   con JS solo con `html.js-si` y movimiento permitido. Si el bundle no llega a correr,
 *   nada se queda recortado.
 * - Lo que ya está por encima de la línea al montar (recarga a mitad de página, ancla) no
 *   se esconde; lo que entra por arriba (se vuelve subiendo) se descubre en el acto.
 * - La máscara recorre como mucho un alto de pantalla: en una sección larga, lo de más
 *   abajo aún no se ve cuando la línea llega al borde.
 */
export function useDescubrir<T extends HTMLElement>(ref: RefObject<T | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !hayEntrada()) return;

    const alto = document.documentElement.clientHeight;
    if (el.getBoundingClientRect().top < alto * DISPARO) return;

    el.classList.add("es-por-descubrir");
    let raf = 0;

    const terminar = () => {
      el.classList.remove("es-por-descubrir", "es-descubriendo");
      el.style.removeProperty("clip-path");
      el.style.removeProperty("--descubrir-y");
    };

    const descubrir = () => {
      const recorrido = Math.min(el.offsetHeight, document.documentElement.clientHeight);
      const inicio = performance.now();
      el.classList.add("es-descubriendo");
      const paso = (ahora: number) => {
        const p = Math.min(1, (ahora - inicio) / DURACION);
        const y = expoOut(p) * recorrido;
        el.style.clipPath = `inset(0 0 calc(100% - ${y.toFixed(1)}px) 0)`;
        el.style.setProperty("--descubrir-y", `${y.toFixed(1)}px`);
        if (p < 1) raf = requestAnimationFrame(paso);
        else terminar();
      };
      raf = requestAnimationFrame(paso);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // Entra por arriba (se vuelve subiendo, o un salto la ha dejado atrás): ya.
        if (e.boundingClientRect.top < 0) terminar();
        else descubrir();
      },
      { rootMargin: `0px 0px -${Math.round((1 - DISPARO) * 100)}% 0px` },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      terminar();
    };
  }, [ref]);
}
