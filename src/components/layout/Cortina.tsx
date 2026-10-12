"use client";

import { useLayoutEffect, useRef } from "react";
import { Simbolo } from "@/components/ui/Logo";
import {
  CLAVE_CORTINA,
  EVENTO_CORTINA_FUERA,
  EVENTO_CORTINA_PARTIDA,
} from "@/lib/scriptCabeza";

/** Clave de `sessionStorage` de la cortina. La pone el script del `<head>`. */
export const PRELOADER_SESSION_KEY = CLAVE_CORTINA;
/** El terreno se parte por la superficie (paso 3). Llega antes de que vuelva el scroll. */
export const PRELOADER_DONE_EVENT = EVENTO_CORTINA_PARTIDA;
/** La cortina ya no está y se puede hacer scroll (final del paso 5, o el seguro). */
export const PRELOADER_GONE_EVENT = EVENTO_CORTINA_FUERA;

const puesta = () => document.documentElement.classList.contains("cortina-si");

/**
 * Se resuelve cuando la cortina de entrada se ha retirado, o en el acto si no está
 * puesta (`html.cortina-si`, que decide el script del `<head>`).
 */
export function esperarCortina(): Promise<void> {
  if (typeof document === "undefined" || !puesta()) return Promise.resolve();
  return new Promise((resolve) => {
    // El evento lo lanzan la retirada y el seguro del <head>. Además se mira la clase,
    // por si se va sin evento: una promesa que no se resuelve dejaría el salto a
    // #diagnostico, o el pozo 1 del hero, esperando para siempre.
    const listo = () => {
      if (puesta()) return;
      window.removeEventListener(PRELOADER_GONE_EVENT, listo);
      mo.disconnect();
      resolve();
    };
    const mo = new MutationObserver(listo);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener(PRELOADER_GONE_EVENT, listo);
  });
}

// ─── Tiempos (s) ───────────────────────────────────────────────────────────────
// La secuencia entera, de 0 a FIN, no pasa de 3 s (§3.14).
/** 1. Aparece el símbolo. */
const SIMBOLO = [0, 0.5] as const;
/** 2. La superficie se traza desde el centro hacia los lados. */
const TRAZO = [0.4, 1.1] as const;
/** 3. El terreno se parte por la línea (aquí, PRELOADER_DONE_EVENT). */
const PARTE = [1.2, 2.2] as const;
/** 5. Lo de arriba del hero emerge desde la superficie y lo de abajo se hunde. */
const EMERGE = [1.4, 2.5] as const;
const FIN = EMERGE[1];

/** Un fotograma que tarda más de 0,1 s cuenta como 1/30 s: tras un atasco no se salta pasos. */
const ATASCO = 0.1;
/** Si algo deja el bucle colgado (ms): la cortina se retira igual. */
const TOPE_MS = (FIN + 1.5) * 1000;

/** expo.inOut, la curva de toda la secuencia. */
const expoInOut = (t: number) =>
  t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;

/** Progreso (0–1, con la curva) de un tramo en el instante `t`. */
const tramo = (t: number, [a, b]: readonly [number, number]) => expoInOut((t - a) / (b - a));

/** Una capa del hero que la cortina mueve en el paso 5. */
type Capa = { el: HTMLElement; arriba: boolean; top: number; alto: number };

/** ¿La retirada ya se hizo? Evita repetirla (y que un remontaje en desarrollo vuelva a ponerla). */
let retirada = false;
let partida = false;

function avisarPartida() {
  if (partida) return;
  partida = true;
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}

/** Quita la cortina y avisa (una sola vez). El CSS deja de pintarla y vuelve el scroll. */
function quitarCortina() {
  if (retirada) return;
  retirada = true;
  avisarPartida();
  document.documentElement.classList.remove("cortina-si");
  window.dispatchEvent(new Event(PRELOADER_GONE_EVENT));
}

/**
 * La cortina de entrada (spec 002 §3.14, plan PD-8, PD-9 y PD-13). Solo sale si el
 * script del `<head>` puso `html.cortina-si`; si no, no hace nada y el CSS no la pinta.
 *
 * 1. aparece el símbolo del iceberg;
 * 2. la superficie se traza desde el centro hacia los lados;
 * 3. el terreno se parte por la línea: la mitad de arriba sube con el borde combado y
 *    la de abajo se hunde (`PRELOADER_DONE_EVENT`);
 * 4. la línea se queda donde está la superficie del hero (`[data-superficie]`, medida
 *    antes de empezar): es la misma;
 * 5. lo de arriba del hero emerge desde la superficie y lo de abajo se hunde desde ella,
 *    con `translate` y un recorte a ras de la línea. Al acabar, `PRELOADER_GONE_EVENT`.
 *
 * - El H1 está pintado desde el primer fotograma, debajo (es el LCP): nada lo esconde,
 *   solo se desplaza unos píxeles y se recorta lo que cruza la línea.
 * - Va con su propio reloj (`requestAnimationFrame`), no con el ticker de GSAP: Lenis
 *   le quita el `lagSmoothing`, y aquí un atasco no debe comerse un paso.
 * - Retirada garantizada: anula el seguro del `<head>` al arrancar y arma el suyo; si
 *   algo falla a mitad, la retira en el `catch`.
 * - Mientras está, no se hace scroll: el CSS bloquea el del navegador y aquí se cortan
 *   la rueda y el dedo antes de que lleguen a Lenis.
 */
export function Cortina() {
  const raizRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const d = document.documentElement;
    const w = window as Window & { __cortinaSeguro?: number; __cortinaDecidida?: boolean };

    // En desarrollo, el remontaje de Strict Mode deja <html> solo con lo que pone React
    // y se lleva las clases del script del <head> (guía de Next «Preventing flash»). Se
    // vuelven a poner aquí; en producción no cambia nada.
    d.classList.add("js-si");
    try {
      if (/[?&]revision=sobria(&|$)/.test(location.search)) d.classList.add("densidad-sobria");
    } catch {}
    if (w.__cortinaDecidida && !retirada) d.classList.add("cortina-si");

    const raiz = raizRef.current;
    if (!raiz || !puesta()) return;

    const arriba = raiz.querySelector<HTMLElement>("[data-cortina-arriba]");
    const abajo = raiz.querySelector<HTMLElement>("[data-cortina-abajo]");
    const linea = raiz.querySelector<HTMLElement>("[data-cortina-superficie]");
    const simbolo = raiz.querySelector<HTMLElement>("[data-cortina-simbolo]");
    window.clearTimeout(w.__cortinaSeguro);
    if (!arriba || !abajo || !linea || !simbolo) {
      quitarCortina(); // sin sus piezas no hay secuencia
      return;
    }

    let raf = 0;
    let tope = 0;
    let capas: Capa[] = [];
    /** La `y` de la superficie del hero, en la ventana. La línea de la cortina va ahí. */
    let nivel = 0;
    /** Lo que se desplazan las capas del hero al salir (px). */
    let salto = 0;

    const bloquear = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const opciones = { capture: true, passive: false } as const;

    const soltarCapas = () => {
      for (const c of capas) {
        c.el.style.removeProperty("translate");
        c.el.style.removeProperty("clip-path");
      }
      capas = [];
    };

    const medir = () => {
      const s = document.querySelector<HTMLElement>("[data-hero] [data-superficie]");
      const r = s?.getBoundingClientRect();
      // Sin hero, o fuera de la ventana: la línea, en el nivel del CSS (el del hero).
      if (!r || r.bottom < 0 || r.top > window.innerHeight) {
        raiz.style.removeProperty("--cortina-nivel");
        const l = linea.getBoundingClientRect();
        nivel = l.top + l.height / 2;
      } else {
        nivel = r.top + r.height / 2;
        raiz.style.setProperty("--cortina-nivel", `${nivel}px`);
      }
      salto = Math.min(48, Math.max(24, nivel * 0.1));
      // Las capas con contenido; los fondos (la cal) van con la superficie, no aquí. Se
      // miden sin desplazar.
      soltarCapas();
      capas = [...document.querySelectorAll<HTMLElement>("[data-hero] [data-capa]")]
        .filter((el) => el.childElementCount > 0 || (el.textContent ?? "").trim() !== "")
        .map((el) => {
          const c = el.getBoundingClientRect();
          return { el, arriba: el.dataset.capa === "arriba", top: c.top, alto: c.height };
        });
    };

    const parar = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      window.clearTimeout(tope);
      window.removeEventListener("wheel", bloquear, opciones);
      window.removeEventListener("touchmove", bloquear, opciones);
      window.removeEventListener("resize", medir);
    };

    const retirar = () => {
      parar();
      soltarCapas();
      quitarCortina();
    };

    /** Coloca las capas del hero: `k` = 0, en su sitio de salida; 1, en reposo. */
    const colocarCapas = (k: number) => {
      for (const c of capas) {
        const dy = (c.arriba ? 1 : -1) * salto * (1 - k);
        // Recorte a ras de la línea, solo de lo que la cruza al moverse: lo de arriba no
        // asoma por debajo de la superficie, ni lo de abajo por encima.
        let recorte: string;
        if (c.arriba) {
          const limite = Math.max(nivel, c.top + c.alto);
          recorte = `inset(-100vh -100vw ${Math.max(0, c.top + dy + c.alto - limite).toFixed(1)}px -100vw)`;
        } else {
          const limite = Math.min(nivel, c.top);
          recorte = `inset(${(limite - (c.top + dy)).toFixed(1)}px -100vw -100vh -100vw)`;
        }
        c.el.style.translate = `0 ${dy.toFixed(1)}px`;
        c.el.style.clipPath = recorte;
      }
    };

    const pintar = (t: number) => {
      const s = tramo(t, SIMBOLO);
      const p = tramo(t, PARTE);
      simbolo.style.opacity = String(Math.max(0, s - p * 1.6));
      simbolo.style.transform = `translateY(${(14 * (1 - s)).toFixed(1)}px)`;
      linea.style.transform = `scaleX(${tramo(t, TRAZO).toFixed(4)})`;
      // El borde de abajo de la mitad de arriba se comba y vuelve a enderezarse al subir.
      const comba = (Math.sin(p * Math.PI) * Math.min(70, nivel * 0.18)).toFixed(1);
      arriba.style.borderRadius = `0 0 50% 50% / 0 0 ${comba}px ${comba}px`;
      arriba.style.transform = `translateY(${(-108 * p).toFixed(2)}%)`;
      abajo.style.transform = `translateY(${(104 * p).toFixed(2)}%)`;
      colocarCapas(tramo(t, EMERGE));
      if (t >= PARTE[0]) avisarPartida();
    };

    try {
      // Con un ancla en la URL el navegador ya ha saltado: la cortina destapa el hero, y
      // el salto lo repite después AnclaPortada (o Diagnostico), con Lenis.
      if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "instant" });
      window.addEventListener("wheel", bloquear, opciones);
      window.addEventListener("touchmove", bloquear, opciones);
      window.addEventListener("resize", medir);
      tope = window.setTimeout(retirar, TOPE_MS);
      medir();
      pintar(0);

      let t = 0;
      let antes = performance.now();
      const fotograma = (ahora: number) => {
        try {
          const dt = (ahora - antes) / 1000;
          antes = ahora;
          t += dt > ATASCO ? 1 / 30 : Math.max(0, dt);
          if (t >= FIN) return retirar();
          pintar(t);
          raf = requestAnimationFrame(fotograma);
        } catch {
          retirar();
        }
      };
      raf = requestAnimationFrame(fotograma);
    } catch {
      retirar();
    }

    return () => {
      // Desmontaje real: la cortina no se queda puesta. En el remontaje de Strict Mode
      // (desarrollo) el efecto vuelve a correr en el acto, anula este aviso como anula el
      // seguro del <head> y empieza otra vez.
      parar();
      soltarCapas();
      if (!retirada) w.__cortinaSeguro = window.setTimeout(quitarCortina, 0);
    };
  }, []);

  return (
    <div ref={raizRef} className="cortina" data-cortina="" aria-hidden="true">
      <div className="cortina-arriba" data-cortina-arriba="">
        <span className="cortina-simbolo" data-cortina-simbolo="">
          <Simbolo />
        </span>
      </div>
      <div className="cortina-abajo" data-cortina-abajo="" />
      <div className="cortina-superficie" data-cortina-superficie="" />
    </div>
  );
}
