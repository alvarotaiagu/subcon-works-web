"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { esperarCortina } from "@/components/layout/Cortina";
import { Boton } from "@/components/ui/Boton";
import { Cota } from "@/components/ui/Cota";
import { Glifo } from "@/components/ui/Glifo";
import { cortePortada } from "@/content/portada";
import { flujos, type Flujo } from "@/content/hero";
import { hero as textoHero } from "@/content/consultora";
import { cn } from "@/lib/utils";

/** La entrada «inicio» del corte: su cota y su nitidez salen de ahí, como las demás. */
const SUPERFICIE = cortePortada[0];

/** Dónde cae cada parada en su pozo, de la superficie al fondo (las tres, a la misma altura en los cuatro). */
const ALTURAS_PARADA = [0.3, 0.6, 0.9] as const;

/** Lo que tarda el pulso en bajar por el pozo (§3.6: «unos 1,4 s»). */
const DURACION_PULSO = 1.4;

/** Un fotograma que tarda más de 0,1 s cuenta como 1/30 s: el reloj no salta tras un atasco. */
const ATASCO = 0.1;

/** Inactividad (§3.6, D-019): un pozo nuevo cada 5 s, una vuelta, y 15 s de silencio tras un gesto. */
const ESPERA_INACTIVIDAD = 5;
const SILENCIO_TRAS_GESTO = 15;
/** El hero cuenta como en pantalla con al menos el 20 % visible. */
const VISIBLE_MINIMO = 0.2;

/** Tirador (§3.6): hasta 160 px hacia arriba y 60 hacia abajo (0 en móvil), 24 px por flecha. */
const TIRADOR_ARRIBA = 160;
const TIRADOR_ABAJO = 60;
const PASO_TECLADO = 24;
/** Vuelta del tirador al soltar: 0,65 s con expo.out. */
const DURACION_VUELTA = 0.65;

/** Scroll (§3.6): la superficie sube hasta un 22 % del alto del hero en escritorio y un 12 % en móvil. */
const SUBIDA_ESCRITORIO = 0.22;
const SUBIDA_MOVIL = 0.12;
const ESCRITORIO = "(min-width: 768px)";

/** Bajada de calidad (§3.15): por debajo de 40 fps durante 2 s seguidos, medidos en ventanas de 0,5 s. */
const FPS_MINIMO = 40;
const LENTO_MAXIMO = 2;
const VENTANA_FPS = 0.5;
/** Un fotograma de más de 0,25 s es un parón, no un ritmo: no entra en la medida. */
const PARON = 0.25;

const expoOut = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** La lectura de un flujo en una línea, para el lector de pantalla: «Ejemplo: …, …». */
const textoLectura = (f: Flujo) => `Ejemplo: ${f.lectura.join(f.flechas ? ", " : " ")}`;

/** `gesto`: toque, clic o foco (se anuncia). `raton`: pasar el ratón (cuenta como gesto, no se anuncia). */
type Origen = "gesto" | "raton" | "auto";

/** Todo lo que lleva el bucle del hero (PD-11), en un solo objeto mutable: no pinta nada por sí. */
interface Reloj {
  /** Id del requestAnimationFrame pendiente (0: el bucle está parado). */
  raf: number;
  ultimo: number;
  /** Hero con al menos el 20 % en pantalla, y pestaña oculta. */
  visible: boolean;
  oculta: boolean;
  /** Movimiento reducido (§3.17) y bajada de calidad (§3.15). */
  quieto: boolean;
  degradado: boolean;
  pausado: boolean;
  /** La cortina ya se ha ido y el pozo 1 está encendido: la inactividad puede empezar. */
  iniciado: boolean;
  /** El pulso en curso: pozo y segundos que lleva bajando (sin contar atascos). */
  pulso: { pozo: number; t: number } | null;
  /** Inactividad: segundos de quietud contados, cuántos hay que esperar y cambios que quedan en la vuelta. */
  inact: { cuenta: number; espera: number; restantes: number };
  /** Medida de fotogramas: la ventana en curso y los segundos seguidos por debajo de 40 fps. */
  fps: { t: number; n: number; lento: number };
  /** Superficie: alto del hero y su borde de arriba en la página (medidos al cambiar de tamaño). */
  alto: number;
  arriba: number;
  movil: boolean;
  /** Desplazamiento pintado, el que toca al scroll y el que pone la persona (tirador o flechas). */
  dy: number;
  dyScroll: number;
  manual: number;
  arrastre: { id: number; y: number; m0: number; base: number } | null;
  /** La vuelta del tirador: desplazamiento manual al soltar y segundos que lleva volviendo. */
  vuelta: { m0: number; t: number } | null;
}

const relojInicial = (): Reloj => ({
  raf: 0,
  ultimo: 0,
  visible: true,
  oculta: false,
  quieto: false,
  degradado: false,
  pausado: false,
  iniciado: false,
  pulso: null,
  inact: { cuenta: 0, espera: ESPERA_INACTIVIDAD, restantes: 0 },
  fps: { t: 0, n: 0, lento: 0 },
  alto: 0,
  arriba: 0,
  movil: true,
  dy: 0,
  dyScroll: 0,
  manual: 0,
  arrastre: null,
  vuelta: null,
});

/** ¿Toca contar la inactividad? Ni con movimiento reducido, ni con la calidad bajada, ni en pausa, ni arrastrando. */
const inactividadArmada = (r: Reloj) =>
  !r.quieto && !r.degradado && !r.pausado && !r.arrastre && r.inact.restantes > 0;

/**
 * El hero (spec 002 §3.6, plan PD-9, PD-10 y PD-11). Fondo partido por la superficie: arriba,
 * en cal, lo que ve el cliente (el titular de arriba y cuatro objetos); debajo, en hondo, la
 * instalación (un pozo por objeto, con tres paradas que son servicios reales).
 *
 * - `[data-hero]` lleva `--nivel` (la altura de la superficie). La línea es
 *   `[data-superficie]` y las capas que mueve la cortina llevan `data-capa="arriba" | "abajo"`.
 * - El H1 va entero, en un bloque, con sus dos líneas en `<span>` (es el LCP, §3.2): no se
 *   parte en palabras ni se oculta al cargar.
 * - Encender un pozo: pasar el ratón, tocar o enfocar un objeto. El pozo pasa a lima y un
 *   pulso baja por él encendiendo las paradas. Solo uno a la vez. La lectura cambia.
 * - Anuncios: la región `aria-live` solo se rellena tras un toque, clic o foco; los cambios
 *   automáticos (el pozo 1 al cargar y la inactividad) van a `[data-lectura-auto]`, sin
 *   `aria-live`. La lectura que se ve es un dibujo de esas dos (`aria-hidden`).
 *
 * Lo vivo (T08), con un solo bucle `requestAnimationFrame` (PD-11) que lleva los pulsos, la
 * vuelta del tirador, la inactividad y la medida de fotogramas. Se para con el hero a menos
 * del 20 % en pantalla, con la pestaña oculta y cuando no queda nada que mover ni contar.
 * - Inactividad: 5 s quieto → siguiente pozo, una vuelta (cuatro cambios) y se para hasta el
 *   siguiente gesto o hasta que el hero sale y vuelve a entrar. Un gesto en un objeto o en el
 *   tirador da 15 s de silencio. «Pausar ejemplos» la para (WCAG 2.2.2).
 * - La superficie se mueve con el scroll (22 % / 12 % del alto del hero) y con el tirador,
 *   siempre con `transform` sobre la línea, el fondo claro, el titular, la cota, los objetos
 *   con sus pozos y el propio tirador. Nunca sobre los `data-capa` (los anima la cortina):
 *   el fondo claro y la cota van envueltos en una caja propia que es la que se traslada.
 * - Bajada de calidad: < 40 fps durante 2 s → sin inactividad y pulsos sin recorrido.
 */
export function Hero() {
  const [activo, setActivo] = useState(-1);
  const [encendidas, setEncendidas] = useState(0);
  // La lectura que se ve: sin JS, la del primer ejemplo (con su pozo en reposo, §6).
  const [lectura, setLectura] = useState(0);
  const [viva, setViva] = useState("");
  const [pausado, setPausado] = useState(false);
  /** Hay secuencia automática que pausar: con JS y con movimiento. */
  const [conSecuencia, setConSecuencia] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const activoRef = useRef(-1);
  const encendidasRef = useRef(0);
  const pozosRef = useRef<Array<HTMLDivElement | null>>([]);
  const pulsosRef = useRef<Array<SVGGElement | null>>([]);
  const altosRef = useRef<number[]>([0, 0, 0, 0]);
  /** Lo que se traslada con la superficie: `[data-sigue-superficie]` (nunca una `data-capa`). */
  const movilesRef = useRef<HTMLElement[]>([]);
  /** Lo que solo baja con ella (`[data-sigue-bajada]`): la lectura, la descripción y los botones. */
  const bajadaRef = useRef<HTMLElement[]>([]);
  const relojRef = useRef<Reloj>(relojInicial());

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

  /** Pinta la superficie a `dy` px de su sitio (negativo: hacia arriba). Solo `transform`. */
  const aplicar = useCallback((dy: number) => {
    const r = relojRef.current;
    if (Math.abs(dy - r.dy) < 0.01) return;
    r.dy = dy;
    const t = Math.abs(dy) < 0.01 ? "" : `translateY(${dy.toFixed(2)}px)`;
    for (const el of movilesRef.current) el.style.transform = t;
    const bajada = dy > 0.01 ? t : "";
    for (const el of bajadaRef.current) el.style.transform = bajada;
  }, []);

  /** Arranca el bucle si está parado y tiene algo que hacer. Lo monta el efecto del bucle. */
  const arrancarRef = useRef<() => void>(() => {});
  /** Recoloca la superficie según el scroll. Lo monta el efecto de la superficie. */
  const reubicarRef = useRef<() => void>(() => {});

  /** Empieza una vuelta de inactividad que espera `espera` segundos al primer cambio. */
  const armar = useCallback((espera: number) => {
    const r = relojRef.current;
    r.inact = { cuenta: 0, espera, restantes: flujos.length };
    arrancarRef.current();
  }, []);

  /** Un gesto en un objeto o en el tirador: corta la secuencia y da 15 s de silencio. */
  const gesto = useCallback(() => armar(SILENCIO_TRAS_GESTO), [armar]);

  const encender = useCallback(
    (i: number, origen: Origen) => {
      const f = flujos[i];
      const r = relojRef.current;
      if (origen !== "auto") gesto();
      // Solo toque, clic o foco se anuncian (§3.6): pasar el ratón por la fila no llena la
      // cola del lector con cuatro lecturas seguidas.
      if (origen === "gesto") setViva(textoLectura(f));
      // El mismo pozo: si ya está encendido (o encendiéndose), no vuelve a empezar.
      if (i === activoRef.current) return;

      if (r.pulso) moverPulso(r.pulso.pozo, null);
      activoRef.current = i;
      setActivo(i);
      setLectura(i);
      if (r.quieto || r.degradado) {
        // Movimiento reducido (§3.17) o calidad bajada (§3.15): encendido y quieto, sin pulso.
        r.pulso = null;
        ponerEncendidas(ALTURAS_PARADA.length);
        return;
      }
      ponerEncendidas(0);
      r.pulso = { pozo: i, t: 0 };
      arrancarRef.current();
    },
    [gesto, moverPulso, ponerEncendidas],
  );

  /** La superficie vuelve a la posición que toca al scroll: 0,65 s expo.out, o en el acto sin movimiento. */
  const volver = useCallback(() => {
    const r = relojRef.current;
    const m0 = r.dy - r.dyScroll;
    r.manual = 0;
    if (r.quieto || Math.abs(m0) < 0.5) {
      r.vuelta = null;
      aplicar(r.dyScroll);
      return;
    }
    r.vuelta = { m0, t: 0 };
    arrancarRef.current();
    // Con el hero fuera de pantalla o la pestaña oculta el bucle no arranca: la vuelta se
    // haría al volver a entrar y, mientras tanto, `r.vuelta` congelaría el scroll. En el acto.
    if (!r.raf) {
      r.vuelta = null;
      aplicar(r.dyScroll);
    }
  }, [aplicar]);

  // El bucle único (PD-11). Corre solo con el hero en pantalla, la pestaña visible y algo que
  // hacer: un pulso bajando, el tirador volviendo o la inactividad contando.
  useEffect(() => {
    const r = relojRef.current;
    const necesita = () => r.visible && !r.oculta && (!!r.pulso || !!r.vuelta || inactividadArmada(r));

    const degradar = () => {
      r.degradado = true;
      // «Pausar ejemplos» se queda donde está: esconderlo con el foco dentro lo perdería.
      heroRef.current?.setAttribute("data-calidad", "baja");
      if (r.pulso) {
        moverPulso(r.pulso.pozo, null);
        r.pulso = null;
        ponerEncendidas(ALTURAS_PARADA.length);
      }
    };

    const fotograma = (ahora: number) => {
      if (!r.visible || r.oculta) {
        // Fuera de pantalla o con la pestaña oculta: se para. La vuelta del tirador no se
        // queda a medias (al volver, la superficie tiene que estar donde toca al scroll).
        if (r.vuelta) {
          r.vuelta = null;
          aplicar(r.dyScroll);
        }
        r.raf = 0;
        return;
      }
      const real = Math.max(0, (ahora - r.ultimo) / 1000);
      r.ultimo = ahora;
      const dt = real > ATASCO ? 1 / 30 : real;

      // Fotogramas reales: < 40 fps durante 2 s seguidos baja la calidad. Un parón suelto
      // (una tarea larga al hidratar, el depurador) no es un ritmo de fotogramas: corta la
      // ventana en curso sin sumar ni borrar lo lento.
      const f = r.fps;
      if (real > PARON) {
        f.t = 0;
        f.n = 0;
      } else {
        f.t += real;
        f.n++;
      }
      if (f.t >= VENTANA_FPS) {
        f.lento = f.n / f.t < FPS_MINIMO ? f.lento + f.t : 0;
        f.t = 0;
        f.n = 0;
        if (f.lento >= LENTO_MAXIMO && !r.degradado) degradar();
      }

      // El pulso: cada parada se enciende cuando el pulso pasa por ella.
      const pulso = r.pulso;
      if (pulso) {
        pulso.t += dt;
        const e = Math.min(1, pulso.t / DURACION_PULSO);
        const bajada = 1 - (1 - e) ** 3; // sale rápido y se posa en la última parada
        const recorrido = bajada * ALTURAS_PARADA[ALTURAS_PARADA.length - 1];
        ponerEncendidas(ALTURAS_PARADA.filter((a) => recorrido >= a - 0.001).length);
        if (e >= 1) {
          moverPulso(pulso.pozo, null);
          r.pulso = null;
        } else moverPulso(pulso.pozo, recorrido * altosRef.current[pulso.pozo]);
      }

      // La vuelta del tirador, hacia lo que toca al scroll en cada fotograma (si se hace
      // scroll mientras vuelve, llega igual a su sitio).
      const v = r.vuelta;
      if (v) {
        v.t += dt;
        const e = Math.min(1, v.t / DURACION_VUELTA);
        aplicar(r.dyScroll + v.m0 * (1 - expoOut(e)));
        if (e >= 1) r.vuelta = null;
      }

      // La inactividad, con su reloj (que no cuenta atascos).
      if (inactividadArmada(r)) {
        const i = r.inact;
        i.cuenta += dt;
        if (i.cuenta >= i.espera) {
          i.cuenta = 0;
          i.espera = ESPERA_INACTIVIDAD;
          i.restantes--;
          encender((activoRef.current + 1) % flujos.length, "auto");
        }
      }

      // Mientras corre este fotograma, `r.raf` sigue con su id: así `arrancar()` (desde
      // `encender`) no pide un segundo bucle.
      r.raf = necesita() ? requestAnimationFrame(fotograma) : 0;
    };

    arrancarRef.current = () => {
      if (r.raf || !necesita()) return;
      r.ultimo = performance.now();
      // La medida de fotogramas vale solo en un tramo seguido del bucle.
      r.fps = { t: 0, n: 0, lento: 0 };
      r.raf = requestAnimationFrame(fotograma);
    };
    // Si el efecto se rehace (StrictMode, recarga en caliente) con algo a medias, sigue.
    arrancarRef.current();
    return () => {
      cancelAnimationFrame(r.raf);
      r.raf = 0;
    };
  }, [aplicar, encender, moverPulso, ponerEncendidas]);

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

  // La superficie y el scroll (§3.6). El alto y la posición del hero se miden con
  // `ResizeObserver` (el hero va en `svh`: la barra del navegador no lo cambia); en cada
  // scroll solo se lee `scrollY`. Durante el arrastre manda el tirador (§6).
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const r = relojRef.current;
    movilesRef.current = [...hero.querySelectorAll<HTMLElement>("[data-sigue-superficie]")];
    bajadaRef.current = [...hero.querySelectorAll<HTMLElement>("[data-sigue-bajada]")];
    const ancho = window.matchMedia(ESCRITORIO);
    const alScroll = () => {
      const p = r.alto ? limitar((window.scrollY - r.arriba) / r.alto, 0, 1) : 0;
      r.dyScroll = r.quieto ? 0 : -p * r.alto * (r.movil ? SUBIDA_MOVIL : SUBIDA_ESCRITORIO);
      if (!r.arrastre && !r.vuelta) aplicar(r.dyScroll + r.manual);
    };
    const medir = () => {
      r.movil = !ancho.matches;
      r.alto = hero.offsetHeight;
      r.arriba = hero.getBoundingClientRect().top + window.scrollY;
      if (r.movil) r.manual = Math.min(r.manual, 0);
      alScroll();
    };
    const ro = new ResizeObserver(medir);
    ro.observe(hero);
    reubicarRef.current = alScroll;
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      reubicarRef.current = () => {};
      ro.disconnect();
      window.removeEventListener("scroll", alScroll);
    };
  }, [aplicar]);

  // En pantalla (≥ 20 %) y pestaña visible: si no, el bucle se para solo en su siguiente
  // fotograma. Al volver a entrar, la inactividad empieza otra vuelta.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const r = relojRef.current;
    const io = new IntersectionObserver(
      ([e]) => {
        const antes = r.visible;
        r.visible = e.isIntersecting && e.intersectionRatio >= VISIBLE_MINIMO - 0.001;
        if (r.visible && !antes) {
          if (r.iniciado) armar(ESPERA_INACTIVIDAD);
          arrancarRef.current();
        }
      },
      { threshold: [0, VISIBLE_MINIMO / 2, VISIBLE_MINIMO, 0.5, 1] },
    );
    io.observe(hero);
    const alCambiar = () => {
      r.oculta = document.hidden;
      if (!r.oculta) arrancarRef.current();
    };
    alCambiar();
    document.addEventListener("visibilitychange", alCambiar);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", alCambiar);
    };
  }, [armar]);

  // Al cargar, o al retirarse la cortina, se enciende el pozo 1 (§3.6, PD-9) y empieza a
  // contar la inactividad. Con movimiento reducido (§3.17): pozo 1 encendido y quieto, sin
  // inactividad, y la superficie no sube con el scroll.
  useEffect(() => {
    const r = relojRef.current;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    const alCambiarMovimiento = () => {
      r.quieto = reducido.matches;
      setConSecuencia(!r.quieto);
      if (r.quieto && r.pulso) {
        moverPulso(r.pulso.pozo, null);
        r.pulso = null;
        ponerEncendidas(ALTURAS_PARADA.length);
      }
      // Sin movimiento, el tirador vuelve sin animación (§3.17): la vuelta en curso se corta.
      if (r.quieto) r.vuelta = null;
      // Sin movimiento la superficie se queda en su sitio; con él, vuelve a seguir el scroll.
      reubicarRef.current();
      // Con movimiento otra vez, la inactividad pendiente vuelve a contar.
      arrancarRef.current();
    };
    r.quieto = reducido.matches;
    setConSecuencia(!r.quieto);
    reducido.addEventListener("change", alCambiarMovimiento);
    let vivo = true;
    esperarCortina().then(() => {
      if (!vivo) return;
      r.iniciado = true;
      if (activoRef.current === -1) {
        encender(0, "auto");
        armar(ESPERA_INACTIVIDAD);
      }
    });
    return () => {
      vivo = false;
      reducido.removeEventListener("change", alCambiarMovimiento);
    };
  }, [armar, encender, moverPulso, ponerEncendidas]);

  const alPausar = () => {
    const r = relojRef.current;
    r.pausado = !r.pausado;
    setPausado(r.pausado);
    if (!r.pausado) armar(ESPERA_INACTIVIDAD);
  };

  /** Tirador (§3.6): Pointer Events con captura; solo él lleva `touch-action: none`. */
  const tiradorAbajo = () => (relojRef.current.movil ? 0 : TIRADOR_ABAJO);

  const alBajarPuntero = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const r = relojRef.current;
    // Un segundo dedo no le quita el arrastre al primero.
    if (r.arrastre) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    r.vuelta = null;
    // El arrastre parte de donde esté la superficie y manda hasta soltar: el scroll se congela.
    r.arrastre = { id: e.pointerId, y: e.clientY, m0: r.dy - r.dyScroll, base: r.dyScroll };
    gesto();
  };

  const alMoverPuntero = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = relojRef.current;
    const a = r.arrastre;
    if (!a || a.id !== e.pointerId) return;
    r.manual = limitar(a.m0 + e.clientY - a.y, -TIRADOR_ARRIBA, tiradorAbajo());
    aplicar(a.base + r.manual);
  };

  const alSoltar = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = relojRef.current;
    const a = r.arrastre;
    if (!a || a.id !== e.pointerId) return;
    r.arrastre = null;
    volver();
    // El silencio de 15 s cuenta desde el último gesto: el de soltar.
    gesto();
  };

  const alTeclaTirador = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const r = relojRef.current;
    if (r.arrastre) return;
    r.vuelta = null;
    const paso = e.key === "ArrowUp" ? -PASO_TECLADO : PASO_TECLADO;
    r.manual = limitar(r.dy - r.dyScroll + paso, -TIRADOR_ARRIBA, tiradorAbajo());
    aplicar(r.dyScroll + r.manual);
    gesto();
  };

  const alSalirTirador = () => {
    const r = relojRef.current;
    // Si ya está volviendo (soltado el ratón, el botón sigue enfocado), no se reinicia.
    if (!r.arrastre && !r.vuelta && Math.abs(r.dy - r.dyScroll) >= 0.01) volver();
  };

  return (
    <section
      id="inicio"
      ref={heroRef}
      data-hero=""
      className="hero"
      style={{ "--shrp": SUPERFICIE.shrp } as React.CSSProperties}
    >
      <div className="hero-cal-mov" data-sigue-superficie="" aria-hidden="true">
        <div className="hero-cal" data-capa="arriba" />
      </div>
      <div className="hero-superficie" data-sigue-superficie="" data-superficie="" aria-hidden="true" />

      <div className="hero-rejilla container-max">
        {/* Un solo <h1>, entero (§3.2): el espacio entre las dos líneas es para el lector. */}
        <h1 className="hero-titular" data-sigue-superficie="">
          <span className="hero-l1" data-capa="arriba">
            {textoHero.linea1}
          </span>{" "}
          <span className="hero-l2" data-capa="abajo">
            {textoHero.linea2} <em>{textoHero.linea2em}</em>
          </span>
        </h1>

        <p className="hero-cota" data-capa="abajo">
          <span className="hero-cota-mov" data-sigue-superficie="">
            <Cota>{SUPERFICIE.cota}</Cota>
            <span className="hero-lema font-mono-label">{textoHero.lema}</span>
          </span>
        </p>

        <div className="hero-instrumento" data-sigue-superficie="" data-ejemplo="">
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
                      <span className="hero-parada-num" data-numeracion="">{p.servicio}</span>
                      <span className="hero-parada-txt">{p.texto}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-bajo" data-capa="abajo">
          {/* Solo baja con la superficie (el tirador en escritorio, hasta 60 px): así la línea de
              abajo del titular no se le mete encima. Al subir se queda, y se abre el hondo. */}
          <div className="hero-bajo-mov" data-sigue-bajada="">
            <div className="hero-ejemplos" data-ejemplo="">
              {/* «Ejemplo» (D-019) y, a su lado, el control de la secuencia automática (WCAG
                  2.2.2). El botón se ve solo cuando hay secuencia que pausar: con JS, con
                  movimiento. Su sitio está reservado desde el HTML. */}
              <div className="hero-ejemplos-cabeza">
                <span className="hero-ejemplo" aria-hidden="true">
                  Ejemplo
                </span>
                <button
                  type="button"
                  className={cn("hero-pausar", !conSecuencia && "es-inerte")}
                  aria-pressed={pausado}
                  onClick={alPausar}
                >
                  {pausado ? "Seguir con los ejemplos" : "Pausar ejemplos"}
                </button>
              </div>
              {/* La lectura que se ve: las cuatro en la misma celda (la más larga fija el alto, así
                  cambiar de ejemplo no mueve nada), solo una visible. Es un dibujo: lo que leen
                  los lectores de pantalla va en las dos de abajo. */}
              <div className="hero-lectura" aria-hidden="true">
                {flujos.map((f, i) => (
                  <p key={f.rotulo} className={cn("hero-lectura-una", lectura === i && "es-visible")}>
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

            {textoHero.parrafos.map((parrafo) => (
              <p key={parrafo} className="hero-descripcion">
                {parrafo}
              </p>
            ))}
            <div className="hero-botones">
              <Boton href="#contacto">{textoHero.ctaPrincipal}</Boton>
              <Boton href="#servicios" variante="secundario">
                {textoHero.ctaSecundario}
              </Boton>
            </div>
            <p className="hero-especialidades font-mono-label">
              {textoHero.especialidades.join(" · ")}
            </p>
          </div>
        </div>
      </div>

      {/* El tirador (§3.6): arrastrar sube o baja la superficie; al soltar, vuelve. */}
      <button
        type="button"
        data-sigue-superficie=""
        className="hero-tirador"
        aria-label="Bajar la superficie para ver más instalación"
        aria-keyshortcuts="ArrowUp ArrowDown"
        onPointerDown={alBajarPuntero}
        onPointerMove={alMoverPuntero}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        onLostPointerCapture={alSoltar}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") gesto();
        }}
        onFocus={gesto}
        onBlur={alSalirTirador}
        onKeyDown={alTeclaTirador}
      >
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
        <span className="hero-tarjeta hero-web">
          <i className="hero-web-barra" aria-hidden="true" />
          <i className="hero-relleno" aria-hidden="true" />
          <i className="hero-relleno hero-relleno-corto" aria-hidden="true" />
          <span className="hero-pagar">Escríbenos</span>
        </span>
      );
  }
}
