"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { hayEntrada } from "@/hooks/useDescubrir";
import { cn } from "@/lib/utils";

/** Lo que dura cada palabra y el escalonado entre ellas (§3.2: 0,04 s, expo.out). */
const DURACION = 900;
const ESCALON = 40;

/** Las palabras de un texto, partidas por los espacios. Igual en el servidor y en el cliente. */
function palabras(texto: string) {
  return texto.split(/\s+/).filter(Boolean);
}

/**
 * Titular de sección (H2) o de interior (H1) (spec 002 §3.2, plan PD-6).
 *
 * - `arriba`, en Geologica 300; `em`, la segunda línea, en Kode Mono 500 a .82em y lima.
 * - Las palabras se parten aquí, en el render (también en el servidor): cada una en un
 *   `inline-block` con `nowrap` dentro de su máscara. Sin `SplitText`, así no hay salto
 *   al hidratar, y sin JS ya está bien.
 * - Entran una vez, al cruzar el 90 % de la pantalla: cada palabra sube desde debajo de
 *   su máscara (`translateY` 100 % → 0, 0,04 s de escalonado, expo.out). Solo con
 *   `html.js-si` y movimiento permitido; si no, están en su sitio desde el principio.
 * - La nitidez sale de `--shrp`, que pone la sección. Nunca se anima.
 * - El lector de pantalla lee el `aria-label` (la frase seguida), no las palabras sueltas.
 *
 * El H1 del hero no usa esto: va entero, en un bloque (es el candidato a LCP).
 */
export function Titular({
  nivel,
  arriba,
  em,
  id,
  className,
}: {
  nivel: 1 | 2;
  arriba: string;
  em?: string;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Etiqueta = nivel === 1 ? "h1" : "h2";

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !hayEntrada()) return;
    const alto = document.documentElement.clientHeight;
    if (el.getBoundingClientRect().top < alto * 0.9) return;

    el.classList.add("es-por-emerger");
    let reloj = 0;
    const terminar = () => el.classList.remove("es-por-emerger", "es-emergiendo");

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (e.boundingClientRect.top < 0) return terminar();
        // En el mismo cambio de estilo: la transición la declara `es-emergiendo`.
        el.classList.add("es-emergiendo");
        el.classList.remove("es-por-emerger");
        const n = el.querySelectorAll(".titular-palabra").length;
        reloj = window.setTimeout(terminar, DURACION + n * ESCALON + 100);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(reloj);
      terminar();
    };
  }, []);

  let i = 0;
  const pintar = (texto: string) =>
    palabras(texto).map((p, j, todas) => (
      <span key={j}>
        <span className="titular-mascara">
          <span className="titular-palabra" style={{ "--i": i++ } as CSSProperties}>
            {p}
          </span>
        </span>
        {j < todas.length - 1 ? " " : null}
      </span>
    ));

  const frase = em ? `${arriba} ${em}` : arriba;

  return (
    <Etiqueta ref={ref} id={id} aria-label={frase} className={cn("titular", className)}>
      <span aria-hidden="true">
        {pintar(arriba)}
        {em && <em className="titular-em">{pintar(em)}</em>}
      </span>
    </Etiqueta>
  );
}
