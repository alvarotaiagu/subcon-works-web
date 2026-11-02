"use client";

import { useEffect, useRef, useState } from "react";
import { cortePortada } from "@/content/portada";
import { alCargarGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** La cabeza del conducto (Hilo.tsx): una sección «se alcanza» cuando su borde de arriba pasa por aquí. */
const LINEA = 0.66;
/** Una franja del 1 % del alto justo bajo esa línea, para el `IntersectionObserver`. */
const FRANJA = "-66% 0px -33% 0px";
/** Desde aquí se pinta (`hilo.css`): por debajo no cabe en el gutter. */
const ANCHO_MINIMO = "(min-width: 1280px)";

/** «−2 · Soluciones de ejemplo» → «−2»; «Fondo · Contacto» → «Fondo». */
const corta = (cota: string) => cota.split(" · ")[0];

/**
 * El profundímetro de la portada: una escala fija al borde derecho, de la Superficie al
 * Fondo, con la cota en la que se está y lo recorrido en lima. Complementa al hilo (Hilo.tsx),
 * que va por el margen izquierdo y dentro del documento: el hilo enseña el tramo que se ve; el
 * profundímetro, dónde se está en el total.
 *
 * - **Las marcas** son las nueve secciones del corte, puestas donde cada una llega a la
 *   cabeza del hilo (el 66 % de la pantalla), en proporción al scroll total: la cota cambia
 *   justo cuando el cursor pasa su marca. Se miden al montar, con `ResizeObserver` en
 *   `<main>`, al cambiar la ventana y en cada `refresh` de ScrollTrigger (el pin del proceso
 *   alarga la página), sin pedir GSAP (`alCargarGsap`).
 * - **La cota actual** sale de un `IntersectionObserver` con una franja en esa misma línea.
 * - **El cursor y lo recorrido** van con una animación ligada al scroll (`animation-timeline`)
 *   en CSS; donde no la hay, con el scroll y un fotograma.
 * - **En la superficie no se ve** (el hero es claro y es la cota cero): se enciende al bajar.
 *   Solo desde 1280 px, donde cabe en el gutter sin pisar texto; en la Sobria no sale. Fuera
 *   de eso no mide ni escucha nada: arranca y para al cambiar el ancho o la densidad.
 *   Es solo dibujo (`aria-hidden`): la navegación ya está en el menú.
 */
export function Profundimetro() {
  const raizRef = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const raiz = raizRef.current;
    const main = raiz?.closest("main");
    if (!raiz || !main) return;
    const html = document.documentElement;

    const arrancar = () => {
      const marcas = [...raiz.querySelectorAll<HTMLElement>(".prof-marca")];
      const relleno = raiz.querySelector<HTMLElement>(".prof-relleno");
      const cursor = raiz.querySelector<HTMLElement>(".prof-cursor");
      const secciones = cortePortada.map((e) => document.getElementById(e.id));
      let maximo = 1;

      // Sin `animation-timeline`, el cursor y lo recorrido se mueven aquí.
      const conCss = CSS.supports("animation-timeline: scroll()");
      let fotograma = 0;
      const pintar = () => {
        fotograma = 0;
        if (conCss || !relleno || !cursor) return;
        const p = Math.min(1, Math.max(0, window.scrollY / maximo));
        relleno.style.transform = `scaleY(${p.toFixed(4)})`;
        cursor.style.transform = `translateY(${(p * 100).toFixed(2)}%)`;
      };
      const alScroll = () => {
        if (!fotograma) fotograma = requestAnimationFrame(pintar);
      };

      const medir = () => {
        maximo = Math.max(1, html.scrollHeight - html.clientHeight);
        const sy = window.scrollY;
        const linea = html.clientHeight * LINEA;
        secciones.forEach((s, i) => {
          if (!s || !marcas[i]) return;
          const p = Math.min(
            1,
            Math.max(0, (s.getBoundingClientRect().top + sy - linea) / maximo),
          );
          marcas[i].style.top = `${(p * 100).toFixed(2)}%`;
        });
        pintar();
      };

      // La cota actual: la última sección que cruza la franja de la cabeza.
      const dentro = new Set<number>();
      const io = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            const i = secciones.indexOf(e.target as HTMLElement);
            if (e.isIntersecting) dentro.add(i);
            else dentro.delete(i);
          }
          if (dentro.size) setActual(Math.max(...dentro));
        },
        { rootMargin: FRANJA },
      );
      for (const s of secciones) if (s) io.observe(s);

      let vivo = true;
      let pedido = 0;
      const pedirMedida = () => {
        if (pedido || !vivo) return;
        pedido = requestAnimationFrame(() => {
          pedido = 0;
          medir();
        });
      };
      const ro = new ResizeObserver(pedirMedida);
      ro.observe(main);
      window.addEventListener("resize", pedirMedida);
      if (!conCss)
        window.addEventListener("scroll", alScroll, { passive: true });
      let soltarGsap = () => {};
      const dejarDeEsperar = alCargarGsap(({ ScrollTrigger }) => {
        ScrollTrigger.addEventListener("refresh", pedirMedida);
        soltarGsap = () =>
          ScrollTrigger.removeEventListener("refresh", pedirMedida);
        pedirMedida();
      });
      void document.fonts.ready.then(pedirMedida);

      return () => {
        vivo = false;
        cancelAnimationFrame(pedido);
        cancelAnimationFrame(fotograma);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("resize", pedirMedida);
        window.removeEventListener("scroll", alScroll);
        dejarDeEsperar();
        soltarGsap();
      };
    };

    // Solo trabaja cuando se pinta: desde 1280 px y fuera de la Sobria (la cambia el mando).
    const ancho = window.matchMedia(ANCHO_MINIMO);
    let parar: (() => void) | null = null;
    const revisar = () => {
      const toca = ancho.matches && !html.classList.contains("densidad-sobria");
      if (toca && !parar) parar = arrancar();
      else if (!toca && parar) {
        parar();
        parar = null;
      }
    };
    revisar();
    ancho.addEventListener("change", revisar);
    const moHtml = new MutationObserver(revisar);
    moHtml.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      ancho.removeEventListener("change", revisar);
      moHtml.disconnect();
      parar?.();
    };
  }, []);

  return (
    <div
      ref={raizRef}
      className={cn("profundimetro", actual === 0 && "es-en-superficie")}
      aria-hidden="true"
    >
      <div className="prof-escala">
        <span className="prof-relleno" />
        {cortePortada.map((e, i) => (
          <span
            key={e.id}
            className={cn("prof-marca", i <= actual && "es-pasada")}
          />
        ))}
        <div className="prof-cursor">
          <span className="prof-lectura" data-numeracion="">
            {corta(cortePortada[actual].cota)}
          </span>
        </div>
      </div>
    </div>
  );
}
