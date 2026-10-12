"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  codificar,
  decodificar,
  esSector,
  opcionesPara,
  preguntasPara,
  respuestaValida,
} from "@/lib/diagnostico";
import type { Decodificado } from "@/lib/diagnostico";
import { preguntas as todasLasPreguntas } from "@/content/diagnostico";
import type { ClaveRespuesta, Contexto, Respuestas, Sector } from "@/content/diagnostico";
import { esperarCortina } from "@/components/layout/Cortina";
import { irAAncla } from "@/lib/irAAncla";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { withBasePath } from "@/lib/utils";
import { PasoPregunta } from "./PasoPregunta";
import { Resultado } from "./Resultado";

/** Los parámetros que son del diagnóstico: `v` y uno por pregunta. */
const CLAVES_URL = new Set<string>(["v", ...todasLasPreguntas.map((p) => p.clave)]);

/**
 * Pone la query del diagnóstico en la barra de direcciones, o la quita con
 * `null`, sin recargar (`replaceState`, spec §3.5). Deja el hash y cualquier
 * otro parámetro que no sea del diagnóstico.
 */
function escribirQuery(diagnostico: string | null) {
  const { pathname, search, hash } = window.location;
  // Los otros parámetros se copian tal cual, sin pasar por URLSearchParams,
  // que los recodificaría (`a%20b` → `a+b`, `?x` → `?x=`). `codificar` deja
  // también las comas de `canales` tal cual.
  const otros = search
    .slice(1)
    .split("&")
    .filter((parte) => {
      if (!parte) return false;
      const clave = parte.split("=", 1)[0];
      let decodificada = clave;
      try {
        decodificada = decodeURIComponent(clave.replace(/\+/g, " "));
      } catch {
        // `%` suelto: se compara la clave en bruto.
      }
      return !CLAVES_URL.has(decodificada);
    });
  const query = [...otros, diagnostico ?? ""].filter(Boolean).join("&");
  const nueva = `${pathname}${query ? `?${query}` : ""}${hash}`;
  if (nueva !== `${pathname}${search}${hash}`) window.history.replaceState(null, "", nueva);
}

/** Espera dos fotogramas: el primero pinta lo último que ha cambiado React. */
function dosFotogramas(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

/**
 * Deja solo lo que vale para ese sector y lo ya respondido: al cambiar de
 * sector (portada) se caen las opciones `soloEn` del anterior, y al pasar a
 * `reserva=sin-cita` se cae `dolor=agenda`. Va en orden de preguntas, para
 * que `dolor` se valide con la `reserva` ya limpia.
 *
 * Aquí y no en `lib/diagnostico.ts` porque ese fichero lo estaba tocando otra
 * tarea (T04/T05) a la vez; puede subir allí más adelante.
 */
function limpiar(sector: Sector | undefined, respuestas: Respuestas): Respuestas {
  const limpias: Respuestas = {};
  for (const { clave } of preguntasPara(sector, "sector")) {
    const valor = respuestas[clave as ClaveRespuesta];
    if (valor === undefined) continue;
    if (clave === "canales") {
      const validos = new Set(opcionesPara(clave, sector, limpias).map((o) => o.codigo));
      const quedan = Array.isArray(valor) ? valor.filter((c) => validos.has(c)) : [];
      if (quedan.length > 0) limpias.canales = quedan;
    } else if (respuestaValida(clave, valor, sector, limpias)) {
      (limpias as Record<string, unknown>)[clave] = valor;
    }
  }
  return limpias;
}

/**
 * Diagnóstico rápido (spec 001, §3.2): una pregunta por pantalla y, al
 * terminar, el resultado en el mismo sitio.
 *
 * En la portada pregunta el sector; en una página de sector lo fija la
 * página. Lo prerrenderizado es siempre la primera pregunta; un diagnóstico
 * que llega por URL (§3.5) se abre al montar. Sin JS solo queda el
 * `<noscript>` con el enlace a la auditoría (§3.9).
 *
 * Nada de `data-reveal` aquí dentro: el contenido cambia (pregunta ↔
 * resultado) y `useReveal` lo dejaría oculto.
 */
export function Diagnostico({
  contexto,
  sector,
  hayPlantillas = false,
}: {
  contexto: Contexto;
  /** Obligatorio con `contexto="sector"`; en la portada se ignora. */
  sector?: Sector;
  hayPlantillas?: boolean;
}) {
  const [elegido, setElegido] = useState<Sector | undefined>(undefined);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [paso, setPaso] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const contenedorRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  // El foco solo se mueve cuando la persona cambia de pregunta, nunca al
  // cargar la página: robaría el foco y haría saltar el scroll.
  const movidoRef = useRef(false);
  // La query se lee una sola vez (PD-4): el doble montaje de StrictMode no la
  // vuelve a aplicar.
  const leidoRef = useRef<Decodificado | null>(null);
  // Se abrió un diagnóstico completo por URL: hay que bajar a él.
  const [saltar, setSaltar] = useState(false);
  const refrescoRef = useRef<number | undefined>(undefined);

  const sectorActivo = contexto === "sector" ? sector : elegido;
  const preguntas = useMemo(() => preguntasPara(sectorActivo, contexto), [sectorActivo, contexto]);
  const total = preguntas.length;
  const pregunta = preguntas[Math.min(paso, total - 1)];

  // Abrir un diagnóstico ya hecho (spec §3.5). Es export estático: la query
  // solo existe en el navegador, así que lo prerrenderizado es siempre la
  // primera pregunta y aquí se pasa a lo que diga la URL. Se lee
  // `location.search` en un efecto (sin `useSearchParams`, que pediría un
  // `Suspense`), como el borrador de la auditoría.
  useEffect(() => {
    if (leidoRef.current) return;
    const leido = decodificar(window.location.search, contexto === "sector" ? sector : undefined);
    leidoRef.current = leido;
    const sectorDeLaUrl = contexto === "portada" && leido.sector !== undefined;
    if (!sectorDeLaUrl && Object.keys(leido.respuestas).length === 0) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    if (contexto === "portada") setElegido(leido.sector);
    setRespuestas(leido.respuestas);
    if (leido.completa) {
      setTerminado(true);
      setSaltar(true);
    } else {
      // A medias: la primera que falta, con las anteriores marcadas.
      const falta = preguntasPara(leido.sector, contexto).findIndex(
        (p) => p.clave === leido.primeraSinResponder
      );
      setPaso(Math.max(0, falta));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [contexto, sector]);

  // ScrollTrigger mide las secciones de abajo al cargar; si el diagnóstico
  // cambia de alto (pregunta ↔ resultado) sus posiciones quedan viejas (PD-10).
  const refrescar = useCallback(() => {
    window.clearTimeout(refrescoRef.current);
    registerGsap();
    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    const el = contenedorRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    // La primera medida es la de partida, no un cambio: no refresca al cargar.
    let alto: number | null = null;
    const observador = new ResizeObserver(([entrada]) => {
      const nuevo = Math.round(entrada.contentRect.height);
      const antes = alto;
      alto = nuevo;
      if (antes === null || antes === nuevo) return;
      window.clearTimeout(refrescoRef.current);
      refrescoRef.current = window.setTimeout(refrescar, 150);
    });
    observador.observe(el);
    return () => {
      observador.disconnect();
      window.clearTimeout(refrescoRef.current);
    };
  }, [refrescar]);

  // El salto a `#diagnostico` de un diagnóstico abierto por URL: después de
  // que la cortina se haya retirado (con ella el body está en
  // `overflow:hidden` y el salto se perdería), con el resultado ya pintado y
  // con ScrollTrigger al día, que los pins de arriba cambian las medidas.
  useEffect(() => {
    if (!saltar) return;
    let vivo = true;
    void (async () => {
      await esperarCortina();
      await dosFotogramas();
      if (!vivo) return;
      refrescar();
      const contenedor = contenedorRef.current;
      irAAncla(contenedor?.closest<HTMLElement>("#diagnostico") ?? contenedor);
    })();
    return () => {
      vivo = false;
    };
  }, [saltar, refrescar]);

  // La query va a la barra de direcciones solo al llegar al resultado, para
  // que «copiar enlace» y el Atrás del navegador vayan bien. Mientras se
  // responde, no se toca.
  useEffect(() => {
    if (!terminado || !sectorActivo) return;
    escribirQuery(codificar(sectorActivo, respuestas));
  }, [terminado, sectorActivo, respuestas]);

  useEffect(() => {
    if (!movidoRef.current) return;
    const titulo = tituloRef.current;
    if (!titulo) return;
    titulo.focus({ preventScroll: true });
    // Si el título nuevo ha quedado por encima de la vista (opciones largas en
    // móvil), se sube al principio del componente. Con Lenis, por Lenis.
    // «Por encima» incluye quedar bajo la cabecera fija: se compara con el
    // `scroll-margin-top` del contenedor, no con 0.
    const contenedor = contenedorRef.current;
    const margen = contenedor ? parseFloat(getComputedStyle(contenedor).scrollMarginTop) || 0 : 0;
    if (titulo.getBoundingClientRect().top < margen) irAAncla(contenedor);
  }, [paso, terminado]);

  const avanzar = () => {
    movidoRef.current = true;
    if (paso < total - 1) setPaso(paso + 1);
    else setTerminado(true);
  };

  const atras = () => {
    movidoRef.current = true;
    setPaso((p) => Math.max(0, p - 1));
  };

  // «Cambiar respuestas»: a la primera pregunta con todo marcado, y la URL
  // sin la query del diagnóstico.
  const cambiar = () => {
    movidoRef.current = true;
    escribirQuery(null);
    setTerminado(false);
    setPaso(0);
  };

  const elegir = (codigo: string) => {
    if (pregunta.clave === "s") {
      if (!esSector(codigo)) return;
      setElegido(codigo);
      setRespuestas((r) => limpiar(codigo, r));
    } else {
      const clave = pregunta.clave;
      setRespuestas((r) => limpiar(sectorActivo, { ...r, [clave]: codigo }));
    }
    avanzar();
  };

  const marcar = (codigo: string) => {
    setRespuestas((r) => {
      const opciones = opcionesPara("canales", sectorActivo, r);
      const antes = new Set(r.canales ?? []);
      if (antes.has(codigo)) antes.delete(codigo);
      else antes.add(codigo);
      // En el orden de la pregunta, no en el de marcado.
      const canales = opciones.map((o) => o.codigo).filter((c) => antes.has(c));
      return limpiar(sectorActivo, { ...r, canales });
    });
  };

  const seguir = () => {
    if ((respuestas.canales ?? []).length > 0) avanzar();
  };

  const valor = pregunta.clave === "s" ? elegido : respuestas[pregunta.clave];

  return (
    <div ref={contenedorRef} className="scroll-mt-28">
      {terminado ? (
        <Resultado
          sector={sectorActivo ?? "otro"}
          respuestas={respuestas}
          contexto={contexto}
          hayPlantillas={hayPlantillas}
          tituloRef={tituloRef}
          onCambiar={cambiar}
        />
      ) : (
        <PasoPregunta
          key={pregunta.clave}
          pregunta={pregunta}
          opciones={opcionesPara(pregunta.clave, sectorActivo, respuestas)}
          numero={paso + 1}
          total={total}
          valor={valor}
          tituloRef={tituloRef}
          onElegir={elegir}
          onMarcar={marcar}
          onSeguir={seguir}
          onAtras={paso > 0 ? atras : undefined}
        />
      )}

      <noscript>
        <p className="mt-8 max-w-xl text-apagado-abajo">
          El diagnóstico rápido necesita JavaScript para ir pregunta a pregunta. Si lo tienes
          desactivado, puedes pedirnos directamente la{" "}
          <a href={withBasePath("/auditoria/")} className="link-underline text-hueso">
            auditoría gratuita
          </a>
          .
        </p>
      </noscript>
    </div>
  );
}
