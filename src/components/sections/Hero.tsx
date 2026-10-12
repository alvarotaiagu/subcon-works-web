"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { esperarCortina } from "@/components/layout/Cortina";
import { Boton } from "@/components/ui/Boton";
import { Cota } from "@/components/ui/Cota";
import { Glifo } from "@/components/ui/Glifo";
import { cortePortada } from "@/content/portada";
import { flujos, type Flujo } from "@/content/hero";
import { site } from "@/content/site";
import { cn, withBasePath } from "@/lib/utils";

/** La entrada «inicio» del corte: su cota y su nitidez salen de ahí, como las demás. */
const SUPERFICIE = cortePortada[0];

/** Dónde cae cada parada en su pozo, de la superficie al fondo (las tres, a la misma altura en los cuatro). */
const ALTURAS_PARADA = [0.3, 0.6, 0.9] as const;

/** Lo que tarda el pulso en bajar por el pozo (§3.6: «unos 1,4 s»). */
const DURACION_PULSO = 1.4;

/** Un fotograma que tarda más de 0,1 s cuenta como 1/30 s: el pulso no salta tras un atasco. */
const ATASCO = 0.1;

/** La lectura de un flujo en una línea, para el lector de pantalla: «Ejemplo: …, …». */
const textoLectura = (f: Flujo) => `Ejemplo: ${f.lectura.join(f.flechas ? ", " : " ")}`;

/** `gesto`: toque, clic o foco (se anuncia). `raton`: pasar el ratón (cuenta como gesto, no se anuncia). */
type Origen = "gesto" | "raton" | "auto";

/**
 * El hero (spec 002 §3.6, plan PD-9 y PD-10). Fondo partido por la superficie: arriba, en
 * cal, lo que ve el cliente (el titular de arriba y cuatro objetos); debajo, en hondo, la
 * instalación (un pozo por objeto, con tres paradas que son servicios reales).
 *
 * - `[data-hero]` lleva `--nivel` (la altura de la superficie). La línea es
 *   `[data-superficie]` y las capas que la cortina y el tirador mueven llevan
 *   `data-capa="arriba" | "abajo"`. Se mueven con `transform`, nunca con `top` ni `height`.
 * - El H1 va entero, en un bloque, con sus dos líneas en `<span>` (es el LCP, §3.2): no se
 *   parte en palabras ni se oculta al cargar.
 * - Encender un pozo: pasar el ratón, tocar o enfocar un objeto. El pozo pasa a lima y un
 *   pulso baja por él encendiendo las paradas. Solo uno a la vez. La lectura cambia.
 * - Anuncios: la región `aria-live` solo se rellena tras un toque, clic o foco; los cambios automáticos
 *   (el pozo 1 al cargar y, en T08, la inactividad) van a `[data-lectura-auto]`, sin
 *   `aria-live`. La lectura que se ve es un dibujo de esas dos (`aria-hidden`).
 *
 * El tirador se pinta aquí; su arrastre, la inactividad y el scroll los pone T08 en el
 * mismo bucle (PD-11).
 */
export function Hero() {
  const [activo, setActivo] = useState(-1);
  const [encendidas, setEncendidas] = useState(0);
  // La lectura que se ve: sin JS, la del primer ejemplo (con su pozo en reposo, §6).
  const [lectura, setLectura] = useState(0);
  const [viva, setViva] = useState("");

  const activoRef = useRef(-1);
  const encendidasRef = useRef(0);
  const quietoRef = useRef(false);
  const pozosRef = useRef<Array<HTMLDivElement | null>>([]);
  const pulsosRef = useRef<Array<SVGGElement | null>>([]);
  const altosRef = useRef<number[]>([0, 0, 0, 0]);
  /** El pulso en curso: pozo y segundos que lleva bajando (sin contar atascos). */
  const pulsoRef = useRef<{ pozo: number; t: number } | null>(null);
  const rafRef = useRef(0);
  const ultimoRef = useRef(0);
  /** Momento del último gesto en el hero (lo usa la inactividad de T08). */
  const ultimoGestoRef = useRef(0);

  const ponerEncendidas = useCallback((n: number) => {
    if (encendidasRef.current === n) return;
    encendidasRef.current = n;
    setEncendidas(n);
  }, []);

  /** Coloca el pulso del pozo `i` a `y` px de la superficie (o lo esconde con null). */
  const moverPulso = useCallback((i: number, y: number | null) => {
    const g = pulsosRef.current[i];
    if (!g) return;
    if (y === null) g.setAttribute("visibility", "hidden");
    else {
      g.setAttribute("visibility", "visible");
      g.setAttribute("transform", `translate(0 ${y.toFixed(1)})`);
    }
  }, []);

  /** Arranca el bucle si está parado. Lo monta el efecto de abajo. */
  const arrancarRef = useRef<() => void>(() => {});

  const encender = useCallback(
    (i: number, origen: Origen) => {
      const f = flujos[i];
      if (origen !== "auto") ultimoGestoRef.current = performance.now();
      // Solo toque, clic o foco se anuncian (§3.6): pasar el ratón por la fila no llena la
      // cola del lector con cuatro lecturas seguidas.
      if (origen === "gesto") setViva(textoLectura(f));
      // El mismo pozo: si ya está encendido (o encendiéndose), no vuelve a empezar.
      if (i === activoRef.current) return;

      const antes = pulsoRef.current;
      if (antes) moverPulso(antes.pozo, null);
      activoRef.current = i;
      setActivo(i);
      setLectura(i);
      if (quietoRef.current) {
        // Movimiento reducido (§3.17): encendido y quieto, sin pulso.
        pulsoRef.current = null;
        ponerEncendidas(ALTURAS_PARADA.length);
        return;
      }
      ponerEncendidas(0);
      pulsoRef.current = { pozo: i, t: 0 };
      arrancarRef.current();
    },
    [moverPulso, ponerEncendidas],
  );

  // El bucle del pulso (PD-11: uno solo, con requestAnimationFrame; T08 le añade la
  // inactividad y la medida de fotogramas). Solo corre mientras baja un pulso.
  useEffect(() => {
    const fotograma = (ahora: number) => {
      rafRef.current = 0;
      const pulso = pulsoRef.current;
      if (!pulso) return;
      const dt = (ahora - ultimoRef.current) / 1000;
      ultimoRef.current = ahora;
      pulso.t += dt > ATASCO ? 1 / 30 : dt;
      const e = Math.min(1, pulso.t / DURACION_PULSO);
      const bajada = 1 - (1 - e) ** 3; // sale rápido y se posa en la última parada
      // Cada parada se enciende cuando el pulso pasa por ella.
      const recorrido = bajada * ALTURAS_PARADA[ALTURAS_PARADA.length - 1];
      ponerEncendidas(ALTURAS_PARADA.filter((a) => recorrido >= a - 0.001).length);
      if (e >= 1) {
        moverPulso(pulso.pozo, null);
        pulsoRef.current = null;
        return;
      }
      moverPulso(pulso.pozo, recorrido * altosRef.current[pulso.pozo]);
      rafRef.current = requestAnimationFrame(fotograma);
    };
    arrancarRef.current = () => {
      if (rafRef.current) return;
      ultimoRef.current = performance.now();
      rafRef.current = requestAnimationFrame(fotograma);
    };
    // Si el efecto se rehace (StrictMode, recarga en caliente) con un pulso a medias, sigue.
    if (pulsoRef.current) arrancarRef.current();
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [moverPulso, ponerEncendidas]);

  // Alto de cada pozo, para el pulso. Se mide al montar y al cambiar de tamaño, no en cada
  // fotograma: el dibujo va en coordenadas relativas y el navegador lo recoloca solo.
  useEffect(() => {
    const ro = new ResizeObserver((entradas) => {
      for (const e of entradas) {
        const i = pozosRef.current.indexOf(e.target as HTMLDivElement);
        if (i !== -1) altosRef.current[i] = e.contentRect.height;
      }
    });
    for (const p of pozosRef.current) if (p) ro.observe(p);
    return () => ro.disconnect();
  }, []);

  // Al cargar, o al retirarse la cortina, se enciende el pozo 1 (§3.6, PD-9).
  useEffect(() => {
    quietoRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let vivo = true;
    esperarCortina().then(() => {
      if (vivo && activoRef.current === -1) encender(0, "auto");
    });
    return () => {
      vivo = false;
    };
  }, [encender]);

  return (
    <section
      id="inicio"
      data-hero=""
      className="hero"
      style={{ "--shrp": SUPERFICIE.shrp } as React.CSSProperties}
    >
      <div className="hero-cal" data-capa="arriba" aria-hidden="true" />
      <div className="hero-superficie" data-superficie="" aria-hidden="true" />

      <div className="hero-rejilla container-max">
        {/* Un solo <h1>, entero (§3.2): el espacio entre las dos líneas es para el lector. */}
        <h1 className="hero-titular">
          <span className="hero-l1" data-capa="arriba">
            Lo de arriba vende.
          </span>{" "}
          <span className="hero-l2" data-capa="abajo">
            Lo de abajo <em>trabaja.</em>
          </span>
        </h1>

        <p className="hero-cota" data-capa="abajo">
          <Cota>{SUPERFICIE.cota}</Cota>
        </p>

        <div className="hero-instrumento">
          <ul className="hero-objetos" aria-label="Lo que ve tu cliente" data-capa="arriba" data-fondo="claro" data-foco-dentro="">
            {flujos.map((f, i) => (
              <li key={f.rotulo}>
                <button
                  type="button"
                  className={cn("hero-obj", activo === i && "es-activo")}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") encender(i, "raton");
                  }}
                  onClick={() => encender(i, "gesto")}
                  onFocus={() => encender(i, "gesto")}
                >
                  <span className="hero-obj-rotulo">
                    {f.rotuloCorto === f.rotulo ? (
                      f.rotulo
                    ) : (
                      <>
                        <span className="hero-solo-ancho">{f.rotulo}</span>
                        <span className="hero-solo-movil">{f.rotuloCorto}</span>
                      </>
                    )}
                  </span>
                  <Tarjeta indice={i} />
                </button>
              </li>
            ))}
          </ul>

          <div className="hero-pozos" data-capa="abajo">
            {flujos.map((f, i) => (
              <div
                key={f.rotulo}
                ref={(el) => {
                  pozosRef.current[i] = el;
                }}
                data-pozo=""
                className={cn("hero-pozo", activo === i && "es-activo")}
              >
                <svg className="hero-pozo-dibujo" aria-hidden="true" focusable="false">
                  <line x1="8" x2="8" y1="0" y2="100%" />
                  {/* El rombo donde el objeto toca la superficie. */}
                  <rect className="hero-pozo-boca" x="3.5" y="-4.5" width="9" height="9" rx="1.5" transform="rotate(45 8 0)" />
                  {ALTURAS_PARADA.map((a, k) => (
                    <svg key={a} x="0" y={`${a * 100}%`} overflow="visible">
                      <rect
                        className={cn("hero-pozo-parada", activo === i && k < encendidas && "es-encendida")}
                        x="3"
                        y="-5"
                        width="10"
                        height="10"
                      />
                    </svg>
                  ))}
                  <g
                    ref={(el) => {
                      pulsosRef.current[i] = el;
                    }}
                    visibility="hidden"
                  >
                    <circle className="hero-pozo-pulso" cx="8" cy="0" r="5" />
                  </g>
                </svg>
                <ol className="hero-paradas" aria-label={`Debajo de ${f.rotuloCorto}`}>
                  {f.paradas.map((p, k) => (
                    <li
                      key={p.texto}
                      className={cn(activo === i && k < encendidas && "es-encendida")}
                      style={{ "--y": `${ALTURAS_PARADA[k] * 100}%` } as React.CSSProperties}
                    >
                      <span className="hero-parada-num">{p.servicio}</span>
                      <span className="hero-parada-txt">{p.texto}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-bajo" data-capa="abajo">
          {/* La lectura que se ve: las cuatro en la misma celda (la más larga fija el alto, así
              cambiar de ejemplo no mueve nada), solo una visible. Es un dibujo: lo que leen
              los lectores de pantalla va en las dos de abajo. */}
          <div className="hero-lectura" aria-hidden="true">
            {flujos.map((f, i) => (
              <p key={f.rotulo} className={cn("hero-lectura-una", lectura === i && "es-visible")}>
                <span className="hero-ejemplo">Ejemplo</span>{" "}
                {f.lectura.map((tramo, k) => (
                  <span key={tramo}>
                    {k > 0 && " "}
                    {/* Cada tramo, en su caja: así el texto más grande de la lectura es un
                        tramo y no la lectura entera, que le quitaría el LCP al titular. */}
                    <span className="hero-tramo">
                      {k > 0 && f.flechas && (
                        <>
                          <Glifo nombre="derecha" className="hero-lectura-flecha" />{" "}
                        </>
                      )}
                      {tramo}
                    </span>
                  </span>
                ))}
              </p>
            ))}
          </div>
          {/* Tras un gesto, la región viva ya dice lo mismo: esta se calla para no leerlo dos veces. */}
          <p
            className="hero-oculto"
            data-lectura-auto=""
            aria-hidden={viva === textoLectura(flujos[lectura]) ? true : undefined}
          >
            <span>{textoLectura(flujos[lectura])}</span>
          </p>
          <p className="hero-oculto" aria-live="polite" aria-atomic="true">
            <span>{viva}</span>
          </p>

          <p className="hero-descripcion">{site.descripcion}</p>
          <div className="hero-botones">
            <Boton href="/auditoria/">Auditoría gratis</Boton>
            <Boton href="#servicios" variante="secundario">
              Ver qué hay debajo
            </Boton>
          </div>
        </div>
      </div>

      {/* El tirador (§3.6): se pinta aquí; el arrastre llega con T08. */}
      <button type="button" className="hero-tirador" aria-label="Bajar la superficie para ver más instalación">
        <Glifo nombre="vertical" />
      </button>
    </section>
  );
}

/** La tarjeta de cada objeto, en `--tarjeta`. En móvil (PD-10) pierden texto y relleno. */
function Tarjeta({ indice }: { indice: number }) {
  switch (indice) {
    case 0:
      return (
        <span className="hero-tarjeta hero-burbuja">
          <span className="hero-solo-ancho">¿Tenéis hueco el jueves por la tarde?</span>
          <span className="hero-solo-movil">¿Hueco el jueves?</span>
        </span>
      );
    case 1:
      return (
        <span className="hero-tarjeta hero-tienda">
          <i className="hero-relleno" aria-hidden="true" />
          <i className="hero-relleno hero-relleno-corto" aria-hidden="true" />
          <span className="hero-pagar">Pagar · Bizum</span>
        </span>
      );
    case 2:
      // La ficha es un dibujo: sin nombre de negocio ni recuento de reseñas (§5).
      return (
        <span className="hero-tarjeta hero-ficha">
          <span className="hero-estrellas" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((k) => (
              <Glifo key={k} nombre="estrella" />
            ))}
          </span>
          <span>Reseña nueva</span>
        </span>
      );
    default:
      return (
        <span className="hero-tarjeta hero-reel">
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático, sin optimizador */}
          <img src={withBasePath("/hero/reel.webp")} alt="Un reel" width={200} height={356} decoding="async" />
          <svg className="hero-reel-play" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M5 3.5v9l7.5-4.5z" />
          </svg>
        </span>
      );
  }
}
