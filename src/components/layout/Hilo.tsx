"use client";

import { useEffect, useRef } from "react";
import { esperarCortina } from "@/components/layout/Cortina";
import { alCargarGsap, gsapCargado } from "@/lib/gsap";

/** Lo lanza el hilo cada vez que se mide (PD-9). `detail`: `{ largo, fin }` (px, en el documento). */
export const HILO_MEDIDO_EVENT = "undertactics:hilo-medido";

/** Por debajo de este ancho el canal va a 8 px del borde; desde él, a la mitad del gutter (§3.10). */
const ANCHO_CANAL = 640;
const CANAL_ESTRECHO = 8;
/** Aire entre el final de la entrada horizontal y la cota (o el botón del Fondo). */
const AIRE = 6;
/** Holgura alrededor del trazo al buscarle un paso libre de texto y controles. */
const MARGEN = 4;
/** El pin del proceso (Proceso.tsx lo crea con este id). */
const PIN_PROCESO = "proceso";

const NS = "http://www.w3.org/2000/svg";

/** Un tramo del trazo: de `ya` a `yb` (px, en el documento) se dibuja de `l0` a `l1`. */
type Tramo = { ya: number; yb: number; l0: number; l1: number };
/** Un trozo continuo del trazo: el conducto en reposo y, encima, lo recorrido. */
type Pieza = { base: SVGPathElement; vivo: SVGPathElement; tramos: Tramo[]; largo: number; pintado: number };
/** Una cota (o el botón del Fondo) y la `y` de su entrada. Las del hero se mueven con la superficie. */
type Ancla = { el: HTMLElement; y: number; enHero: boolean };

/** Largo recorrido de una pieza con la cabeza a `h`. */
function recorrido(tramos: Tramo[], h: number): number {
  let largo = 0;
  for (const t of tramos) {
    if (h >= t.yb) {
      largo = t.l1;
      continue;
    }
    if (h > t.ya) largo = t.l0 + ((t.l1 - t.l0) * (h - t.ya)) / (t.yb - t.ya);
    break;
  }
  return largo;
}

/** Va juntando un trazo de rectas (V y H), con sus tramos y su largo, sin preguntar al DOM. */
function trazo(x: number, y: number) {
  let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
  let cx = x;
  let cy = y;
  let largo = 0;
  const tramos: Tramo[] = [];
  return {
    get y() {
      return cy;
    },
    bajar(y2: number) {
      if (y2 <= cy) return;
      d += `V${y2.toFixed(1)}`;
      tramos.push({ ya: cy, yb: y2, l0: largo, l1: largo + (y2 - cy) });
      largo += y2 - cy;
      cy = y2;
    },
    cruzar(x2: number) {
      const l = Math.abs(x2 - cx);
      if (l < 0.5) return;
      d += `H${x2.toFixed(1)}`;
      tramos.push({ ya: cy, yb: cy, l0: largo, l1: largo + l });
      largo += l;
      cx = x2;
    },
    cerrar: () => ({ d, tramos, largo }),
  };
}

/**
 * El conducto principal de la portada (spec 002 §3.10, PD-9).
 *
 * Un trazo SVG por el margen izquierdo, desde la superficie del hero hasta el botón
 * «Empezar la auditoría» del Fondo (`[data-hilo-fin]`): baja en vertical por el canal
 * (a la mitad del gutter desde 640 px, a 8 px del borde por debajo) y entra en
 * horizontal a la cota de cada sección (`[data-hilo]`). En reposo, `--conducto`; lo
 * recorrido, `--superficie`. La cabeza va al 66 % del alto de la pantalla (`66svh`) y
 * cada cota que pasa lleva `es-alcanzada`.
 *
 * - **Sin bucle propio**: se pinta en el evento de scroll (Lenis mueve el scroll de
 *   verdad, así que hay uno por fotograma mientras se mueve) y cuando se mueve la
 *   superficie. Con la pestaña oculta o el trazo fuera de pantalla no pinta nada: lo
 *   deja pendiente para cuando vuelva.
 * - **El pin del proceso**: mientras dura, el recorrido lo hace la broca del testigo. El
 *   trazo se corta a la altura de la escena anclada (de `start` a `end` + su alto, de
 *   ScrollTrigger, no del `getBoundingClientRect` del pin), así que la cabeza no avanza
 *   de la cota «−2» hasta que el pin se suelta y la escena se va.
 * - **El tramo del hero** (de la superficie a la cota «Superficie») se traslada con la
 *   superficie, que sube con el scroll y con el tirador: se lee su `transform` y se
 *   aplica al trozo, más un puente que estira el canal hasta donde sigue el resto.
 * - **Se mide** al montar (tras la cortina), con `ResizeObserver` en `<main>`, tras las
 *   letras, en cada `refresh` de ScrollTrigger y al cambiar el ancho de la ventana (un
 *   `resize` que solo cambia el alto, la barra del navegador, no hace nada). Cada medida
 *   lanza `undertactics:hilo-medido`.
 * - **Al abrir a mitad de página** pinta el estado que toca sin transiciones.
 * - **Movimiento reducido**: entero y en lima, con todas las cotas alcanzadas (§3.17).
 * - **Densidad sobria** (§3.16): no se pinta y no marca cotas.
 */
export function Hilo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const sondaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const sonda = sondaRef.current;
    const main = svg?.closest("main");
    if (!svg || !sonda || !main) return;

    const html = document.documentElement;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sobria = () => html.classList.contains("densidad-sobria");

    // Capas: el trozo del hero va en un <g> que se traslada con la superficie.
    const capaHero = document.createElementNS(NS, "g");
    const capaResto = document.createElementNS(NS, "g");
    svg.append(capaHero, capaResto);

    const nuevaPieza = (capa: SVGGElement, d: string, tramos: Tramo[], largo: number): Pieza => {
      const base = document.createElementNS(NS, "path");
      base.setAttribute("class", "hilo-reposo");
      base.setAttribute("data-hilo-trazo", "");
      const vivo = document.createElementNS(NS, "path");
      vivo.setAttribute("class", "hilo-vivo");
      base.setAttribute("d", d);
      vivo.setAttribute("d", d);
      // Un solo guion del largo del trozo y un hueco mayor: con nada recorrido no asoma ni
      // una mota. Largos reales (sin pathLength): no hay nada que redondee.
      vivo.style.strokeDasharray = `${largo.toFixed(1)} ${(largo + 20).toFixed(1)}`;
      // Con movimiento reducido nace entero; si no, vacío hasta que lo pinte el scroll.
      vivo.style.strokeDashoffset = entero ? "0" : largo.toFixed(1);
      capa.append(base, vivo);
      return { base, vivo, tramos, largo, pintado: entero ? largo : 0 };
    };

    let piezas: Pieza[] = [];
    let piezaHero: Pieza | null = null;
    let puente: Pieza | null = null;
    let anclas: Ancla[] = [];
    /** La `y` (en el documento, sin trasladar) donde el tramo del hero enlaza con el resto. */
    let enlace = 0;
    let canal = 0;
    /** Origen del SVG en el documento. */
    let origenY = 0;
    let cabeza = 0;
    let dy = 0;
    let listo = false;
    let entero = false;
    let pendiente = false;
    let enPantalla = true;
    let ultimaH = 0;
    /** El scroll máximo, medido con lo demás: en el scroll no se pregunta nada al layout. */
    let scrollMaximo = 0;

    const superficie = () => main.querySelector<HTMLElement>("[data-superficie]");
    /** Lo que la superficie está trasladada ahora (scroll, tirador): la `m42` de su transform. */
    const leerDy = () => {
      const s = superficie();
      if (!s) return 0;
      const t = getComputedStyle(s).transform;
      return !t || t === "none" ? 0 : new DOMMatrixReadOnly(t).m42;
    };

    const vaciar = () => {
      capaHero.replaceChildren();
      capaResto.replaceChildren();
      piezas = [];
      piezaHero = null;
      puente = null;
      listo = false;
    };

    const marcar = (el: HTMLElement, si: boolean) => {
      if (el.classList.contains("es-alcanzada") !== si) el.classList.toggle("es-alcanzada", si);
    };

    const apagar = () => {
      vaciar();
      svg.classList.remove("es-medido");
      for (const a of anclas) marcar(a.el, false);
      anclas = [];
    };

    /**
     * El puente del canal entre el trozo del hero (subido con la superficie) y el resto. Se
     * crea una vez y se le cambia el trazo: la superficie se mueve en cada fotograma del
     * scroll por el hero.
     */
    const ponerPuente = () => {
      if (!piezaHero) return;
      puente ??= nuevaPieza(capaResto, "M0 0", [], 0);
      const largo = Math.max(0, -dy);
      // Sin recorrido (la superficie en su sitio o más abajo), el puente se queda sin trazo y
      // deja de contar como trozo del conducto.
      for (const p of [puente.base, puente.vivo]) {
        if (largo < 0.5) p.removeAttribute("d");
        else p.setAttribute("d", `M${canal.toFixed(1)} ${(enlace + dy).toFixed(1)}V${enlace.toFixed(1)}`);
      }
      puente.base.toggleAttribute("data-hilo-trazo", largo >= 0.5);
      puente.largo = largo;
      puente.tramos = largo < 0.5 ? [] : [{ ya: enlace + dy, yb: enlace, l0: 0, l1: largo }];
      puente.vivo.style.strokeDasharray = `${largo.toFixed(1)} ${(largo + 20).toFixed(1)}`;
      puente.vivo.style.strokeDashoffset = largo.toFixed(1);
      puente.pintado = 0;
    };

    // Al abrir a mitad de página (o al volver de Sobria): el estado que toca, sin animar.
    let quieto1 = 0;
    let quieto2 = 0;
    const sinTransiciones = () => {
      main.classList.add("es-hilo-quieto");
      cancelAnimationFrame(quieto1);
      cancelAnimationFrame(quieto2);
      quieto1 = requestAnimationFrame(() => {
        quieto2 = requestAnimationFrame(() => main.classList.remove("es-hilo-quieto"));
      });
    };

    const pintarPieza = (p: Pieza, h: number) => {
      const hecho = entero ? p.largo : recorrido(p.tramos, h);
      if (Math.abs(hecho - p.pintado) < 0.05) return;
      p.pintado = hecho;
      p.vivo.style.strokeDashoffset = (p.largo - hecho).toFixed(1);
    };

    const pintar = () => {
      if (!listo) return;
      if (document.hidden || !enPantalla) {
        pendiente = true;
        return;
      }
      pendiente = false;
      // La cabeza, en coordenadas del SVG. Al fondo de la página el último tramo (el botón
      // del Fondo) se completa aunque no llegue al 66 %.
      const h = window.scrollY + cabeza - origenY;
      // Un salto de más de media pantalla (scroll restaurado al recargar, un ancla sin
      // Lenis): las cotas cambian sin transición, como al abrir a mitad de página.
      if (Math.abs(h - ultimaH) > cabeza / 2) sinTransiciones();
      ultimaH = h;
      const alFondo = window.scrollY >= scrollMaximo - 4;
      const hFin = alFondo ? Number.POSITIVE_INFINITY : h;
      if (piezaHero) pintarPieza(piezaHero, hFin - dy);
      if (puente) pintarPieza(puente, hFin);
      for (const p of piezas) pintarPieza(p, hFin);
      for (const a of anclas) marcar(a.el, entero || h >= a.y + (a.enHero ? dy : 0));
    };

    const moverHero = () => {
      dy = entero ? 0 : leerDy();
      capaHero.setAttribute("transform", Math.abs(dy) < 0.01 ? "" : `translate(0 ${dy.toFixed(2)})`);
      ponerPuente();
      pintar();
    };

    const medir = () => {
      if (sobria()) {
        apagar();
        return;
      }
      vaciar();
      entero = reducido.matches;

      const sx = window.scrollX;
      const sy = window.scrollY;
      const ancho = html.clientWidth;
      const alto = Math.max(0, main.getBoundingClientRect().bottom + sy);
      svg.setAttribute("width", String(ancho));
      svg.setAttribute("height", alto.toFixed(0));
      svg.setAttribute("viewBox", `0 0 ${ancho} ${alto.toFixed(0)}`);
      const o = svg.getBoundingClientRect();
      const ox = o.left + sx;
      origenY = o.top + sy;
      cabeza = sonda.offsetHeight;
      scrollMaximo = html.scrollHeight - html.clientHeight;
      dy = entero ? 0 : leerDy();

      // Coordenadas de una caja en el SVG; `quitar` resta lo que la superficie la traslada.
      const caja = (el: Element, quitar = 0) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + sx - ox, y: r.top + sy - origenY - quitar, alto: r.height };
      };

      // El canal: a la mitad del gutter del contenedor, o a 8 px del borde en estrecho.
      const contenedor = main.querySelector<HTMLElement>(".container-max");
      canal = CANAL_ESTRECHO;
      if (ancho >= ANCHO_CANAL && contenedor) {
        const gutter = parseFloat(getComputedStyle(contenedor).paddingLeft) || 0;
        canal = caja(contenedor).x + gutter / 2;
      }

      /** Cajas (en el SVG) de los textos, controles y dibujos de `raiz`, menos los de `salvo`. */
      const obstaculos = (raiz: Element, salvo: Element) => {
        const cajas: Array<{ l: number; t: number; r: number; b: number }> = [];
        const meter = (r: DOMRect) => {
          if (r.width < 2 || r.height < 2) return;
          cajas.push({ l: r.left + sx - ox, t: r.top + sy - origenY, r: r.right + sx - ox, b: r.bottom + sy - origenY });
        };
        const rango = document.createRange();
        const textos = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
        for (let n = textos.nextNode(); n; n = textos.nextNode()) {
          if (!n.nodeValue?.trim() || salvo.contains(n)) continue;
          rango.selectNodeContents(n);
          for (const r of rango.getClientRects()) meter(r);
        }
        for (const el of raiz.querySelectorAll("a, button, input, select, textarea, svg, img")) {
          if (!salvo.contains(el)) meter(el.getBoundingClientRect());
        }
        return cajas;
      };

      const hero = main.querySelector<HTMLElement>("[data-hero]");
      const visibles = (el: HTMLElement) => el.getClientRects().length > 0;
      const cotas = [...main.querySelectorAll<HTMLElement>("[data-hilo]")].filter(visibles);
      const fin = main.querySelector<HTMLElement>("[data-hilo-fin]");
      anclas = cotas.map((el) => {
        const enHero = !!hero?.contains(el);
        const c = caja(el, enHero ? dy : 0);
        return { el, y: c.y + c.alto / 2, enHero };
      });

      // El hueco del pin del proceso: la escena anclada, de su `start` a su `end` más su
      // alto (en el documento). Ahí no hay trazo: el recorrido es de la broca.
      let hueco: [number, number] | null = null;
      try {
        const pin = gsapCargado()?.ScrollTrigger.getById(PIN_PROCESO);
        if (pin && pin.end > pin.start) {
          const escena = pin.trigger as HTMLElement | undefined;
          const altoEscena = escena?.offsetHeight ?? html.clientHeight;
          hueco = [pin.start - origenY, pin.end + altoEscena - origenY];
        }
      } catch {
        // Sin GSAP no hay pin: el trazo baja seguido.
      }

      // 1. El tramo del hero: de la superficie a la cota «Superficie» (se traslada con ella).
      const anclaHero = anclas.find((a) => a.enHero);
      const linea = superficie();
      let inicio: number;
      if (anclaHero && linea) {
        const s = caja(linea, dy);
        const t = trazo(canal, s.y + s.alto / 2);
        t.bajar(anclaHero.y);
        t.cruzar(caja(anclaHero.el, dy).x - AIRE);
        t.cruzar(canal);
        const { d, tramos, largo } = t.cerrar();
        piezaHero = nuevaPieza(capaHero, d, tramos, largo);
        inicio = anclaHero.y;
      } else {
        inicio = anclas[0]?.y ?? 0;
      }
      enlace = inicio;
      capaHero.setAttribute("transform", Math.abs(dy) < 0.01 ? "" : `translate(0 ${dy.toFixed(2)})`);

      // 2. El resto: de cota en cota hasta el botón del Fondo, cortado en el pin.
      let t = trazo(canal, inicio);
      const cerrarTrozo = () => {
        const { d, tramos, largo } = t.cerrar();
        if (largo > 0) piezas.push(nuevaPieza(capaResto, d, tramos, largo));
      };
      const bajarHasta = (y: number) => {
        if (hueco && t.y < hueco[1] && y > hueco[0]) {
          t.bajar(hueco[0]);
          cerrarTrozo();
          t = trazo(canal, Math.max(hueco[1], t.y));
          hueco = null;
        }
        t.bajar(y);
      };
      for (const a of anclas) {
        if (a.enHero) continue;
        bajarHasta(a.y);
        t.cruzar(caja(a.el).x - AIRE);
        t.cruzar(canal);
      }
      // 3. El final: entra en horizontal al botón del Fondo. Si a su altura hay algo entre
      // el canal y el botón (las cifras, el iceberg), va por encima de esa fila y baja al
      // lado del botón: el trazo no pisa texto ni controles (§3.10).
      let finY = t.y;
      if (fin && visibles(fin)) {
        const f = caja(fin);
        finY = f.y + f.alto / 2;
        const cajas = obstaculos(fin.closest("section") ?? main, fin);
        const libre = (l: number, a: number, r: number, b: number) =>
          !cajas.some((c) => c.l < r && c.r > l && c.t < b && c.b > a);
        let rodeo: number | null = null;
        const xv = f.x - 3 * AIRE;
        if (!libre(canal, finY - MARGEN, f.x - AIRE, finY + MARGEN) && xv > canal + 1) {
          for (let y = f.y - 2 * MARGEN; y > Math.max(t.y, f.y - 600); y -= 4) {
            if (libre(canal, y - 2.5 * MARGEN, xv, y + 2.5 * MARGEN) && libre(xv - MARGEN, y, xv + MARGEN, finY)) {
              rodeo = y;
              break;
            }
          }
        }
        if (rodeo !== null) {
          bajarHasta(rodeo);
          t.cruzar(xv);
        }
        bajarHasta(finY);
        t.cruzar(f.x - AIRE);
      }
      cerrarTrozo();

      listo = true;
      ponerPuente();
      pintar();
      svg.classList.add("es-medido");
      window.dispatchEvent(
        new CustomEvent(HILO_MEDIDO_EVENT, {
          detail: { largo: piezas.reduce((s, p) => s + p.largo, piezaHero?.largo ?? 0), fin: finY + origenY },
        }),
      );
    };

    // Las medidas se juntan en un fotograma (un ResizeObserver y un refresh seguidos).
    let pedido = 0;
    const pedirMedida = () => {
      if (pedido) return;
      pedido = requestAnimationFrame(() => {
        pedido = 0;
        if (vivo) medir();
      });
    };

    let vivo = true;
    let empezado = false;
    const ro = new ResizeObserver(() => empezado && pedirMedida());
    const io = new IntersectionObserver(([e]) => {
      enPantalla = e.isIntersecting;
      if (enPantalla && pendiente) pintar();
    });
    const alVisibilidad = () => {
      if (!document.hidden && pendiente) pintar();
    };
    // Un resize que solo cambia el alto (la barra del navegador en móvil) no recalcula.
    let anchoVentana = window.innerWidth;
    const alResize = () => {
      if (window.innerWidth === anchoVentana) return;
      anchoVentana = window.innerWidth;
      if (empezado) pedirMedida();
    };
    const alRefresh = () => empezado && pedirMedida();
    // La superficie se traslada con transform (scroll, tirador, vuelta): el trozo del hero la sigue.
    const moSuperficie = new MutationObserver(() => listo && moverHero());
    // El mando de maqueta cambia la densidad en <html>.
    let eraSobria = sobria();
    const moHtml = new MutationObserver(() => {
      if (sobria() === eraSobria) return;
      eraSobria = sobria();
      if (empezado) {
        sinTransiciones();
        medir();
      }
    });
    const alCambiarMovimiento = () => empezado && medir();

    window.addEventListener("scroll", pintar, { passive: true });
    window.addEventListener("resize", alResize);
    document.addEventListener("visibilitychange", alVisibilidad);
    reducido.addEventListener("change", alCambiarMovimiento);
    moHtml.observe(html, { attributes: true, attributeFilter: ["class"] });
    io.observe(svg);
    // GSAP llega con `import()` (D-028) y no lo pide el hilo: si llega (con movimiento),
    // escucha sus `refresh`. Sin GSAP se mide igual con el ResizeObserver.
    let soltarGsap = () => {};
    const dejarDeEsperar = alCargarGsap(({ ScrollTrigger }) => {
      if (!vivo) return;
      ScrollTrigger.addEventListener("refresh", alRefresh);
      soltarGsap = () => ScrollTrigger.removeEventListener("refresh", alRefresh);
      if (empezado) pedirMedida();
    });

    void (async () => {
      // Tras la cortina: mientras está puesta, las capas del hero van trasladadas.
      await esperarCortina();
      if (!vivo) return;
      empezado = true;
      sinTransiciones();
      medir();
      ro.observe(main);
      const s = superficie();
      if (s) moSuperficie.observe(s, { attributes: true, attributeFilter: ["style", "class"] });
      await document.fonts.ready;
      if (vivo) pedirMedida();
    })();

    return () => {
      vivo = false;
      cancelAnimationFrame(pedido);
      cancelAnimationFrame(quieto1);
      cancelAnimationFrame(quieto2);
      window.removeEventListener("scroll", pintar);
      window.removeEventListener("resize", alResize);
      document.removeEventListener("visibilitychange", alVisibilidad);
      reducido.removeEventListener("change", alCambiarMovimiento);
      dejarDeEsperar();
      soltarGsap();
      moHtml.disconnect();
      moSuperficie.disconnect();
      ro.disconnect();
      io.disconnect();
      main.classList.remove("es-hilo-quieto");
      for (const a of anclas) marcar(a.el, false);
      capaHero.remove();
      capaResto.remove();
    };
  }, []);

  return (
    <>
      <svg ref={svgRef} className="hilo" aria-hidden="true" focusable="false" />
      {/* El 66 % del alto de la pantalla, en `svh` (la barra del navegador no lo cambia). */}
      <div ref={sondaRef} className="hilo-sonda" aria-hidden="true" />
    </>
  );
}
