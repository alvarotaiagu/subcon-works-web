"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cargarGsap, type Movimiento } from "@/lib/gsap";
import { proceso } from "@/content/proceso";
import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";
import { cn } from "@/lib/utils";
import { estado, hayWebGL, leerColores } from "./proceso/reloj";
import { montarPlanB } from "./proceso/planb";
import type { Escena3D, FaseMontaje } from "./proceso/escena3d";

/** Recorrido del pin (D-037: unas 6 pantallas), en altos de la ventana. */
const PANTALLAS = 6;
const RECORRIDO = `+=${PANTALLAS * 100}%`;
/** GSAP ha fallado al crear el pin: el proceso se queda como tabla (§6). */
let gsapRoto = false;
const avisos = new Set<() => void>();
let consultaReducido: MediaQueryList | null = null;
const reducido = () => (consultaReducido ??= window.matchMedia("(prefers-reduced-motion: reduce)"));

/**
 * ¿Se monta la escena? Con JS, movimiento permitido, fuera de la densidad sobria (§3.16)
 * y si GSAP funciona. Se vuelve a mirar al cambiar el movimiento reducido y la clase de
 * <html> (el mando de maqueta pasa a Sobria y vuelve).
 */
const escenaStore = {
  leer: () =>
    !gsapRoto &&
    !reducido().matches &&
    !document.documentElement.classList.contains("densidad-sobria"),
  // En el servidor (y sin JS), la tabla.
  leerServidor: () => false,
  suscribir(aviso: () => void) {
    avisos.add(aviso);
    reducido().addEventListener("change", aviso);
    const clases = new MutationObserver(aviso);
    clases.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      avisos.delete(aviso);
      reducido().removeEventListener("change", aviso);
      clases.disconnect();
    };
  },
  romper() {
    gsapRoto = true;
    avisos.forEach((a) => a());
  },
};

/**
 * Proceso, «El proceso» (spec 002 §3.9 y D-037, «El bloque»).
 *
 * - **La tabla está en el HTML**: dos columnas, «Lo que ves tú» y «Lo que hacemos por
 *   debajo», una fila por paso con su dato. Es lo que se ve sin JS, con movimiento
 *   reducido, en la densidad sobria y si GSAP falla (§6, §3.17).
 * - **La escena se monta encima solo con JS** y movimiento permitido, anclada con un pin
 *   de GSAP de unas 6 pantallas (también en móvil). El `onUpdate` del pin pasa el progreso
 *   al reloj (`proceso/reloj.ts`) y este mueve la vista que esté: el plan B en SVG
 *   (`proceso/planb.ts`, desde el principio) y, cuando llega, la escena en Three.js
 *   (`proceso/escena3d.ts`): su chunk se pide con `import()` en reposo tras la carga (nunca
 *   va en el JS inicial) y se monta en tareas cortas a dos pantallas de la sección. Sin
 *   WebGL, con `?planb` o si el chunk no llega, se queda el SVG.
 *   Cada sexto del recorrido enciende su paso (`.es-activo`).
 * - Lo anclado es la escena (el bloque y el paso), no la sección: la cota y el titular
 *   pasan de largo y el pin ocupa la pantalla entera. Ningún ancestro lleva `transform`,
 *   `filter`, `will-change` ni `clip-path` mientras dura (la máscara de entrada de
 *   `Seccion` se quita al terminar).
 * - El pin se llama `proceso` (`ScrollTrigger.getById("proceso")`): de sus `start`/`end`
 *   toma el hilo las anclas mientras dura (§3.10).
 * - `?fps` enseña el contador de fotogramas del 3D (abajo a la izquierda de la escena).
 */
export function Proceso() {
  const escenaRef = useRef<HTMLDivElement>(null);
  const lienzoRef = useRef<HTMLCanvasElement>(null);
  const planbRef = useRef<SVGSVGElement>(null);
  const rotuloRef = useRef<HTMLParagraphElement>(null);
  const fpsRef = useRef<HTMLDivElement>(null);
  const fpsTextoRef = useRef<HTMLSpanElement>(null);
  const tareaRef = useRef<HTMLSpanElement>(null);
  const conEscena = useSyncExternalStore(escenaStore.suscribir, escenaStore.leer, escenaStore.leerServidor);
  const [activo, setActivo] = useState(0);
  const [en3d, setEn3d] = useState(false);

  // El pin. Va sobre la escena, que siempre está en el DOM (con la escena apagada se
  // esconde con CSS): así React nunca quita un nodo que GSAP haya metido en su pin-spacer.
  useEffect(() => {
    const escena = escenaRef.current;
    const lienzo = lienzoRef.current;
    const svg = planbRef.current;
    const rotulo = rotuloRef.current;
    const main = document.querySelector("main");
    if (!conEscena || !escena || !lienzo || !svg || !rotulo || !main) return;

    const params = new URLSearchParams(window.location.search);
    const planB = montarPlanB(svg);
    let tres: Escena3D | null = null;
    let ultimoP = 0;
    let ultimoPaso = -1;
    const pintar = (progreso: number) => {
      ultimoP = progreso;
      const e = estado(progreso);
      if (e.i !== ultimoPaso) {
        ultimoPaso = e.i;
        setActivo(e.i);
      }
      rotulo.classList.toggle("es-visible", e.punta >= 1);
      (tres ?? planB).pintar(e);
    };
    pintar(0);

    // Con `?fps`, la tarea larga más larga del 3D (lo que la D-037 mide contra el tope de
    // 300 ms de la D-031), cuánto tarda en montarse y la tarea más larga de cada fase: chunk
    // (descargar y evaluar `three`), montar, compilar, sombra y el primer fotograma. Solo
    // cuentan las tareas del 3D: las de la ventana del chunk (de pedirlo a que llega) y las
    // del montaje (de empezar a estar listo). Entre medias el chunk espera en memoria y lo
    // que pase (GSAP, el scroll, otras secciones) no es suyo.
    const tareas = {
      desde: 0,
      chunk: -1,
      montaje: -1,
      listo: -1,
      largas: [] as { inicio: number; fin: number }[],
      fases: {} as Partial<Record<FaseMontaje, string>>,
      /** Lo mismo en número, y lo que costó evaluar `three` medido a mano (`marca.ts`). */
      propias: {} as Partial<Record<FaseMontaje | "chunk", number>>,
      /** Safari (todo iOS) no tiene la API de tareas largas: entonces se tira de lo medido a mano. */
      conApi: false,
      observador: null as PerformanceObserver | null,
      escribir() {
        const caja = tareaRef.current;
        if (!caja || !this.desde) return;
        const ahora = performance.now();
        const enVentana = (a: number, b: number) => this.largas.filter((l) => l.fin >= a && l.inicio <= b).map((l) => l.fin - l.inicio);
        // La evaluación del chunk no se puede medir desde dentro: es la tarea larga más larga
        // entre que se pide y que llega (si no hay ninguna, duró menos de 50 ms).
        const delChunk = enVentana(this.desde, this.chunk >= 0 ? this.chunk : ahora);
        const delMontaje = this.montaje >= 0 ? enVentana(this.montaje, this.listo >= 0 ? this.listo : ahora) : [];
        const aMano = Object.values(this.propias);
        const max = this.conApi ? Math.max(0, ...delChunk, ...delMontaje) : Math.max(0, ...aMano);
        const trozos = [`tarea más larga ${Math.round(max)} ms (tope 300${this.conApi ? "" : ", sin API de tareas largas: por fases"})`];
        if (this.listo >= 0) trozos.push(`3D listo en ${Math.round(this.listo - this.montaje)} ms`);
        if (this.chunk >= 0) {
          const evaluar = this.propias.chunk ?? 0;
          const largo = delChunk.length ? Math.max(...delChunk) : 0;
          trozos.push(`chunk ${this.conApi && largo ? Math.round(Math.max(largo, evaluar)) : Math.round(evaluar)}`);
        }
        for (const [fase, nombre] of [
          ["montar", "montar"],
          ["compilar", "compilar"],
          ["sombra", "sombra"],
          ["fotograma", "1.er fotograma"],
        ] as const) {
          const v = this.fases[fase];
          if (v) trozos.push(`${nombre} ${v}`);
        }
        caja.textContent = trozos.join(" · ");
      },
    };
    const medirTareas = () => {
      if (!params.has("fps") || tareas.desde) return;
      tareas.desde = performance.now();
      tareas.conApi = typeof PerformanceObserver !== "undefined" && (PerformanceObserver.supportedEntryTypes?.includes("longtask") ?? false);
      if (!tareas.conApi) return tareas.escribir();
      tareas.observador = new PerformanceObserver((lista) => {
        for (const t of lista.getEntries()) {
          tareas.largas.push({ inicio: t.startTime, fin: t.startTime + t.duration });
        }
        tareas.escribir();
      });
      tareas.observador.observe({ type: "longtask" });
      tareas.escribir();
    };

    // El 3D en dos tiempos (D-037, nunca en el JS inicial, D-028):
    // 1. el chunk de `three` se pide en reposo tras la carga (o antes, si la sección se
    //    acerca): evaluarlo es una tarea que no se puede partir y así no cae en el scroll;
    // 2. la escena se monta, en tareas cortas, cuando la sección está a dos pantallas, y
    //    acaba antes de llegar. Hasta entonces (y sin WebGL, con `?planb` o si el chunk
    //    falla) se ve el plan B.
    let vivo = true;
    let cerca: IntersectionObserver | null = null;
    let cancelarReposo = () => {};
    let esperaCarga: (() => void) | null = null;
    const corte = new AbortController();
    if (!params.has("planb") && hayWebGL()) {
      let chunk: Promise<typeof import("./proceso/escena3d")> | null = null;
      const pedir = () => {
        if (chunk) return chunk;
        medirTareas();
        chunk = import("./proceso/escena3d");
        chunk.then(
          (m) => {
            tareas.chunk = performance.now();
            tareas.propias.chunk = m.evaluarThree;
            tareas.escribir();
          },
          () => {},
        );
        return chunk;
      };
      const enReposo = () => {
        esperaCarga = null;
        if (!vivo) return;
        // Con Ahorro de datos o una conexión lenta no se adelanta: se pide al acercarse.
        const red = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
        if (red?.saveData || /(^|-)2g$/.test(red?.effectiveType ?? "")) return;
        const ya = () => void pedir().catch(() => {});
        if ("requestIdleCallback" in window) {
          const id = requestIdleCallback(ya, { timeout: 4000 });
          cancelarReposo = () => cancelIdleCallback(id);
        } else {
          const id = globalThis.setTimeout(ya, 2000);
          cancelarReposo = () => clearTimeout(id);
        }
      };
      if (document.readyState === "complete") enReposo();
      else {
        esperaCarga = enReposo;
        window.addEventListener("load", enReposo, { once: true });
      }

      cerca = new IntersectionObserver(
        ([entrada]) => {
          if (!entrada.isIntersecting) return;
          cerca?.disconnect();
          cerca = null;
          pedir()
            .then((m) => {
              tareas.montaje = performance.now();
              return m;
            })
            .then(({ montarEscena3D }) =>
              montarEscena3D({
                lienzo,
                colores: leerColores(),
                estado: () => estado(ultimoP),
                fps: params.has("fps") ? fpsTextoRef.current : null,
                senal: corte.signal,
                alMedir: (fase, ms, extra) => {
                  tareas.fases[fase] = `${Math.round(ms)}${extra ? ` (${extra})` : ""}`;
                  tareas.propias[fase] = ms;
                  tareas.escribir();
                },
                // El navegador perdió el contexto WebGL: se suelta el 3D y vuelve el plan B.
                alPerder: () => {
                  const esc = tres;
                  if (!esc) return;
                  tres = null;
                  esc.destruir();
                  setEn3d(false);
                  planB.pintar(estado(ultimoP));
                },
              }),
            )
            .then((esc) => {
              // Desmontado mientras se montaba: se queda el plan B.
              if (!vivo) return esc.destruir();
              tres = esc;
              esc.pintar(estado(ultimoP));
              setEn3d(true);
              tareas.listo = performance.now();
              tareas.escribir();
            })
            .catch((e: unknown) => {
              if (e instanceof DOMException && e.name === "AbortError") return;
              console.warn("Proceso: sin 3D, se queda el plan B", e);
            });
        },
        { rootMargin: "200% 0px" },
      );
      cerca.observe(escena);
    }
    if (params.has("fps")) fpsRef.current?.classList.add("es-visible");

    // GSAP llega con `import()` tras hidratar (D-028). Mientras tanto la escena está
    // pintada en reposo (plan B en 0, paso 01) y el recorrido del pin se reserva ya, al
    // hidratar, como hacía el pin: lo de debajo no salta cuando llega, y al recargar a
    // mitad de página el navegador devuelve el scroll sobre la página con su alto final.
    escena.style.marginBottom = `${Math.round(PANTALLAS * window.innerHeight)}px`;
    let quitar = () => {};
    const anclar = ({ ScrollTrigger }: Movimiento) => {
      if (!vivo) return;
      let pin: ReturnType<typeof ScrollTrigger.create>;
      // El pin-spacer ocupa ahora el sitio reservado (en la misma tarea: no se pinta entre
      // medias). Sin anclaje de scroll mientras dura el cambio: ScrollTrigger mide con la
      // reserva ya quitada, y el navegador compensaría ese hueco subiendo la vista 6
      // pantallas (con la página por debajo del proceso, la dejaba dentro del pin).
      const raiz = document.documentElement;
      const anclaje = raiz.style.overflowAnchor;
      raiz.style.overflowAnchor = "none";
      escena.style.removeProperty("margin-bottom");
      try {
        // Que la barra del navegador en móvil (solo cambia el alto) no recalcule el pin.
        ScrollTrigger.config({ ignoreMobileResize: true });
        pin = ScrollTrigger.create({
          id: "proceso",
          trigger: escena,
          start: "top top",
          end: RECORRIDO,
          pin: true,
          onRefresh: (self) => pintar(self.progress),
          onUpdate: (self) => pintar(self.progress),
        });
      } catch {
        // Sin GSAP: el proceso se queda como tabla (§6).
        escenaStore.romper();
        return;
      } finally {
        // Una medida con el pin-spacer ya puesto, y el anclaje vuelve.
        void raiz.offsetHeight;
        raiz.style.overflowAnchor = anclaje;
      }

      // El `end` del pin depende de lo que haya encima: se recalcula cuando cambia el alto
      // del <main> (imágenes, letras, secciones que se montan) y tras las letras (§6).
      let altoMain = main.offsetHeight;
      let pedido = 0;
      const refrescar = () => {
        cancelAnimationFrame(pedido);
        pedido = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const observador = new ResizeObserver(() => {
        const h = main.offsetHeight;
        if (Math.abs(h - altoMain) < 1) return;
        altoMain = h;
        refrescar();
      });
      observador.observe(main);
      void document.fonts.ready.then(() => vivo && refrescar());

      quitar = () => {
        observador.disconnect();
        cancelAnimationFrame(pedido);
        pin.kill();
        // Sin el pin-spacer la página encoge 6 pantallas: que los demás triggers lo sepan.
        ScrollTrigger.refresh();
      };
    };
    cargarGsap().then(anclar, () => vivo && escenaStore.romper());

    return () => {
      vivo = false;
      quitar();
      corte.abort();
      cerca?.disconnect();
      if (esperaCarga) window.removeEventListener("load", esperaCarga);
      cancelarReposo();
      tareas.observador?.disconnect();
      tres?.destruir();
      tres = null;
      planB.destruir();
      escena.style.removeProperty("margin-bottom");
      rotulo.classList.remove("es-visible");
      setEn3d(false);
      setActivo(0);
    };
  }, [conEscena]);

  return (
    <Seccion id="proceso" className={cn("proceso", conEscena && "es-con-escena")}>
      <div className="container-max">
        <Titular nivel={2} arriba="Lo montamos por debajo," em="y te lo llevas entero." className="max-w-4xl" />
      </div>

      {/* La escena: solo con JS (la enciende `es-con-escena`). */}
      <div ref={escenaRef} className="proceso-escena">
        <div className="container-max proceso-escena-dentro">
          <div className="proceso-texto">
            <ol className="proceso-pasos">
              {proceso.map((paso, i) => (
                <li key={paso.numero} data-paso="" className={cn("proceso-paso", i === activo && "es-activo")}>
                  <span className="proceso-paso-num">{paso.numero}</span>
                  <h3 className="proceso-paso-titulo">{paso.titulo}</h3>
                  <p className="proceso-paso-texto">{paso.descripcion}</p>
                  <p className="proceso-paso-dato">{paso.dato}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* El bloque: el lienzo del 3D y, debajo, el SVG del plan B (el mismo reloj). */}
          <div className={cn("proceso-bloque", en3d && "es-3d")} aria-hidden="true">
            <canvas ref={lienzoRef} data-lienzo="" className="proceso-lienzo" />
            <svg ref={planbRef} data-planb="" className="proceso-planb" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" />
            <p ref={rotuloRef} className="proceso-rotulo">
              a tu nombre
            </p>
            <div ref={fpsRef} className="proceso-fps">
              <span ref={fpsTextoRef} />
              <span ref={tareaRef} />
            </div>
          </div>
        </div>
      </div>

      {/* La tabla: siempre en el HTML; se esconde cuando la escena está montada. */}
      <div className="container-max proceso-tabla-caja">
        {/* Roles explícitos: en móvil las filas pasan a grid y WebKit quitaría la semántica. */}
        <table className="proceso-tabla" role="table">
          <caption className="sr-only">El proceso, paso a paso: lo que ves tú y lo que hacemos por debajo</caption>
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader">Paso</th>
              <th scope="col" role="columnheader">Lo que ves tú</th>
              <th scope="col" role="columnheader">Lo que hacemos por debajo</th>
              <th scope="col" role="columnheader">Dato</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {proceso.map((paso) => (
              <tr key={paso.numero} role="row">
                <th scope="row" role="rowheader">
                  <span>
                    {paso.numero} · {paso.titulo}
                  </span>
                </th>
                <td role="cell" data-col="Lo que ves tú">
                  <span>{paso.vesTu}</span>
                </td>
                <td role="cell" data-col="Lo que hacemos por debajo">
                  <span>{paso.debajo}</span>
                </td>
                <td role="cell" className="proceso-tabla-dato">
                  <span>{paso.dato}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Seccion>
  );
}
