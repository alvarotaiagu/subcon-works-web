"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { servicios } from "@/content/servicios";
import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";

/**
 * Servicios («0 · Lo que montamos») — spec 002 §3.7.
 *
 * Diez pozos, en el orden de `servicios.ts`. Cada uno: arriba de su línea, número, nombre
 * y descripción; debajo, los `incluye` como paradas de un pozo vertical; y el `enlace`, si
 * lo tiene. El pozo en reposo es dibujo en `--conducto` (decorativo); el texto va siempre
 * en `--hueso` o `--apagado-abajo`, nunca con opacidad.
 *
 * Se enciende (lima, en línea; el texto de la parada pasa a `--hueso`):
 *  - en escritorio (≥ 768 px con hover): al pasar el ratón o al enfocar (el `<li>` es
 *    focusable, y los enlaces de dentro también lo encienden con `:focus-within`). Eso lo
 *    hace el CSS (`portada.css`, bloque «T10 · Servicios»);
 *  - en móvil o táctil: al entrar en pantalla, una vez cada uno (clase `es-activo`, puesta
 *    desde aquí). Sin JS no se enciende, pero se lee entero.
 */

/** Escritorio de verdad: hay hover y cabe en filas. Lo demás es la lista vertical. */
const ESCRITORIO = "(hover: hover) and (min-width: 768px)";

export function Servicios() {
  const lista = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = lista.current;
    if (!ol) return;
    const mq = window.matchMedia(ESCRITORIO);
    let io: IntersectionObserver | undefined;

    const montar = () => {
      io?.disconnect();
      io = undefined;
      if (mq.matches) {
        // En escritorio manda el ratón y el teclado: lo encendido por scroll se apaga.
        ol.querySelectorAll(".es-activo").forEach((el) => el.classList.remove("es-activo"));
        return;
      }
      io = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("es-activo");
            io?.unobserve(e.target);
          }
        },
        // Se enciende al cruzar el 70 % de la pantalla, no al asomar por abajo.
        { rootMargin: "0px 0px -30% 0px" },
      );
      ol.querySelectorAll(".pozo").forEach((el) => io?.observe(el));
    };

    montar();
    mq.addEventListener("change", montar);
    return () => {
      mq.removeEventListener("change", montar);
      io?.disconnect();
    };
  }, []);

  return (
    <Seccion id="servicios" className="py-[var(--space-section)]">
      <div className="container-max">
        <Titular
          nivel={2}
          arriba="Montamos lo que se ve"
          em="y lo que va debajo."
          className="max-w-3xl"
        />
        <p className="mt-6 max-w-xl text-apagado-abajo">
          Diez servicios. Cada uno tiene una parte que ve tu cliente y otra que trabaja por debajo.
        </p>

        <ol ref={lista} className="pozos">
          {servicios.map((servicio) => (
            // Focusable a propósito: el teclado enciende el pozo (§3.7). El foco visible
            // lo pinta `foco.css`; el pozo encendido, `portada.css`.
            <li key={servicio.numero} className="pozo" tabIndex={0}>
              <div className="pozo-cabecera">
                <span className="pozo-numero font-mono-label">{servicio.numero}</span>
                <h3 className="pozo-nombre">{servicio.nombre}</h3>
                <p className="pozo-descripcion">{servicio.descripcion}</p>
              </div>
              <ul className="pozo-paradas" aria-label={`Lo que incluye ${servicio.nombre}`}>
                {servicio.incluye.map((item, i) => (
                  <li key={item} className="pozo-parada" style={{ "--i": i } as CSSProperties}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {servicio.enlace && (
                <Link
                  href={servicio.enlace.href}
                  className="link-underline font-mono-label pozo-enlace"
                >
                  {servicio.enlace.label}
                  <Glifo nombre="derecha" />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </Seccion>
  );
}
