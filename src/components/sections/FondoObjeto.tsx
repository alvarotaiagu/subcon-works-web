"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Boton } from "@/components/ui/Boton";
import { Simbolo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/** El botón cruza esta fracción del alto de la pantalla (§3.11: el 66 %). */
const LINEA = 0.66;

/**
 * El objeto del Fondo (spec 002 §3.11, PD-12): el iceberg, «Empezar la auditoría» y el
 * enlace por correo. Es lo que se completa: la línea de 2 px bajo el botón descansa en
 * `--conducto` y, cuando el botón cruza el 66 % del alto de la pantalla, se enciende en
 * lima y el símbolo se dibuja entero, con su superficie en lima.
 *
 * - Lo decide un `IntersectionObserver` sobre el botón. No depende del hilo: funciona
 *   igual en las páginas de sector, que no lo tienen.
 * - Con movimiento reducido, sin JS o si el botón ya está por encima de la línea al
 *   montar (recarga a mitad de página, ancla `/#auditoria`), nace encendido. El estado
 *   de reposo lo pone este efecto, no el servidor: por eso mira el movimiento reducido
 *   él mismo y no depende de `html.js-si` (si el bundle corre, hay JS).
 * - `hilo`: en la portada, el botón es donde acaba el conducto (`data-hilo-fin`).
 */
export function FondoObjeto({ hilo = false }: { hilo?: boolean }) {
  const raiz = useRef<HTMLDivElement>(null);
  const [encendido, setEncendido] = useState(true);

  // El símbolo se dibuja con el largo real de sus trazos (así no depende de la geometría
  // del logo): el CSS lo lee de `--largo`.
  useEffect(() => {
    raiz.current?.querySelectorAll<SVGGeometryElement>("path[stroke]").forEach((p) => {
      p.style.setProperty("--largo", `${p.getTotalLength().toFixed(2)}px`);
    });
  }, []);

  useLayoutEffect(() => {
    const boton = raiz.current?.querySelector("a");
    if (!boton || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const alto = document.documentElement.clientHeight;
    // Ya cruzado (o dejado atrás): se queda encendido.
    if (boton.getBoundingClientRect().top < alto * LINEA) return;

    setEncendido(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setEncendido(true);
      },
      { rootMargin: `0px 0px -${Math.round((1 - LINEA) * 100)}% 0px` },
    );
    io.observe(boton);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={raiz} className={cn("fondo-objeto", !encendido && "es-por-encender")}>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-8">
        <span data-fondo-simbolo className="fondo-simbolo-caja">
          <Simbolo className="fondo-simbolo" />
        </span>
        <Boton
          href="/auditoria/"
          lineaApagada
          className={cn(encendido && "es-encendida")}
          data-fondo-boton=""
          data-hilo-fin={hilo ? "" : undefined}
        >
          Empezar la auditoría
        </Boton>
        <Boton href={`mailto:${site.email}`} variante="secundario">
          O escríbenos
        </Boton>
      </div>
    </div>
  );
}
