"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cargarGsap, type Movimiento } from "@/lib/gsap";
import { proceso } from "@/content/proceso";
import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";
import { cn } from "@/lib/utils";

/** Recorrido del pin (§3.9: unas 4,4 pantallas), en altos de la ventana. */
const PANTALLAS = 4.4;
const RECORRIDO = `+=${PANTALLAS * 100}%`;
/** Alto de la broca (px): su borde de abajo es la punta que marca el estrato. */
const BROCA = 3;
/** El paso que lleva el pulso (§3.9: el 05). */
const PASO_PULSO = 4;
/** GSAP ha fallado al crear el pin: el proceso se queda como tabla (§6). */
let gsapRoto = false;
const avisos = new Set<() => void>();
let consultaReducido: MediaQueryList | null = null;
const reducido = () => (consultaReducido ??= window.matchMedia("(prefers-reduced-motion: reduce)"));

/**
 * ¿Se monta el testigo? Con JS, movimiento permitido, fuera de la densidad sobria (§3.16)
 * y si GSAP funciona. Se vuelve a mirar al cambiar el movimiento reducido y la clase de
 * <html> (el mando de maqueta pasa a Sobria y vuelve).
 */
const testigoStore = {
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
 * Proceso, «−2 · El proceso» (spec 002 §3.9).
 *
 * - **La tabla está en el HTML**: dos columnas, «Lo que ves tú» y «Lo que hacemos por
 *   debajo», una fila por paso con su dato. Es lo que se ve sin JS, con movimiento
 *   reducido, en la densidad sobria y si GSAP falla (§6, §3.17).
 * - **El testigo se monta encima solo con JS** y movimiento permitido: una columna de
 *   seis estratos (`--estrato-1…6`) por la que baja una broca con el scroll, anclada con
 *   un pin de GSAP de unas 4,4 pantallas (también en móvil). Cada estrato que pasa
 *   enciende su paso; en el 05 baja un pulso. En la versión «consultora» no va el «2 semanas»
 *   bajo el 04: se trabaja por fases y el plazo no se promete (decidido el 2026-10-31).
 * - Lo anclado es la escena (el testigo y el paso), no la sección: la cota y el titular
 *   pasan de largo y el pin ocupa la pantalla entera. Ningún ancestro lleva `transform`,
 *   `filter`, `will-change` ni `clip-path` mientras dura (la máscara de entrada de
 *   `Seccion` se quita al terminar).
 * - El pin se llama `proceso` (`ScrollTrigger.getById("proceso")`): de sus `start`/`end`
 *   toma el hilo las anclas mientras dura (§3.10).
 */
export function Proceso() {
  const escenaRef = useRef<HTMLDivElement>(null);
  const estratosRef = useRef<HTMLOListElement>(null);
  const brocaRef = useRef<HTMLDivElement>(null);
  const testigo = useSyncExternalStore(testigoStore.suscribir, testigoStore.leer, testigoStore.leerServidor);
  const [activo, setActivo] = useState(0);

  // El pin. Va sobre la escena, que siempre está en el DOM (con el testigo apagado se
  // esconde con CSS): así React nunca quita un nodo que GSAP haya metido en su pin-spacer.
  useEffect(() => {
    const escena = escenaRef.current;
    const estratos = estratosRef.current;
    const broca = brocaRef.current;
    const main = document.querySelector("main");
    if (!testigo || !escena || !estratos || !broca || !main) return;

    let alto = estratos.clientHeight;
    let ultimo = -1;
    const pintar = (progreso: number) => {
      // La punta (el borde de abajo de la broca) baja de 3 px al fondo del testigo; el
      // paso encendido es el del estrato en el que está la punta.
      const punta = Math.max(BROCA, progreso * alto);
      broca.style.transform = `translateY(${(punta - BROCA).toFixed(1)}px)`;
      const i = Math.min(proceso.length - 1, Math.floor(punta / (alto / proceso.length)));
      if (i !== ultimo) {
        ultimo = i;
        setActivo(i);
      }
    };

    // GSAP llega con `import()` tras hidratar (D-028). Mientras tanto el testigo está
    // pintado en reposo por CSS (broca arriba, paso 01) y el recorrido del pin se reserva
    // ya, al hidratar, como hacía el pin: lo de debajo no salta cuando llega, y al recargar
    // a mitad de página el navegador devuelve el scroll sobre la página con su alto final.
    escena.style.marginBottom = `${Math.round(PANTALLAS * window.innerHeight)}px`;
    let vivo = true;
    let quitar = () => {};
    const anclar = ({ ScrollTrigger }: Movimiento) => {
      if (!vivo) return;
      let pin: ReturnType<typeof ScrollTrigger.create>;
      // El pin-spacer ocupa ahora el sitio reservado (en la misma tarea: no se pinta entre
      // medias). Sin anclaje de scroll mientras dura el cambio: ScrollTrigger mide con la
      // reserva ya quitada, y el navegador compensaría ese hueco subiendo la vista 4,4
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
          onRefresh: (self) => {
            alto = estratos.clientHeight;
            pintar(self.progress);
          },
          onUpdate: (self) => pintar(self.progress),
        });
      } catch {
        // Sin GSAP: el proceso se queda como tabla (§6).
        testigoStore.romper();
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
        // Sin el pin-spacer la página encoge 4,4 pantallas: que los demás triggers lo sepan.
        ScrollTrigger.refresh();
      };
    };
    cargarGsap().then(anclar, () => vivo && testigoStore.romper());

    return () => {
      vivo = false;
      quitar();
      escena.style.removeProperty("margin-bottom");
      broca.style.removeProperty("transform");
      setActivo(0);
    };
  }, [testigo]);

  return (
    <Seccion id="proceso" className={cn("proceso", testigo && "es-con-testigo")}>
      <div className="container-max">
        <Titular nivel={2} arriba="Un sondeo," em="de la superficie al fondo." className="max-w-4xl" />
      </div>

      {/* El testigo: solo con JS (lo enciende `es-con-testigo`). */}
      <div ref={escenaRef} className="proceso-escena">
        <div className="container-max proceso-escena-dentro">
          <div className={cn("proceso-testigo", activo === PASO_PULSO && "es-pulso")} aria-hidden="true">
            <ol ref={estratosRef} className="proceso-estratos">
              {proceso.map((paso, i) => (
                <li key={paso.numero} data-estrato="" className={cn(i <= activo && "es-pasado")}>
                  <span className="proceso-estrato-dato">{paso.dato}</span>
                  <span className="proceso-estrato-num" data-numeracion="">{paso.numero}</span>
                </li>
              ))}
            </ol>
            <div className="proceso-pulso">
              <span />
            </div>
            <div ref={brocaRef} data-broca="" className="proceso-broca" />
          </div>

          <ol className="proceso-pasos">
            {proceso.map((paso, i) => (
              <li key={paso.numero} data-paso="" className={cn("proceso-paso", i === activo && "es-activo")}>
                <span className="proceso-paso-num" data-numeracion="">{paso.numero}</span>
                <h3 className="proceso-paso-titulo">{paso.titulo}</h3>
                <p className="proceso-paso-texto">{paso.descripcion}</p>
                <p className="proceso-paso-dato">{paso.dato}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* La tabla: siempre en el HTML; se esconde cuando el testigo está montado. */}
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
                    <span data-numeracion="">{paso.numero}</span> · {paso.titulo}
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
