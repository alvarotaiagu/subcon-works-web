"use client";

import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { cortePortada, type FondoCorte } from "@/content/portada";
import { useDescubrir } from "@/hooks/useDescubrir";
import { cn } from "@/lib/utils";
import { Cota } from "./Cota";

const FONDOS: Record<FondoCorte, string> = {
  // El hero no pasa por aquí: su fondo partido lo pinta él (§3.6).
  "cal-hondo": "",
  hondo: "bg-hondo",
  estrato: "bg-estrato",
  roca: "bg-roca",
};

type PropsSeccion = Omit<React.ComponentPropsWithoutRef<"section">, "id" | "children"> & {
  /** El `id` de su entrada en `cortePortada`: de ahí salen la cota, la nitidez y el fondo. */
  id: string;
  /** Etiqueta propia de la sección: va detrás de la cota (§3.5). */
  etiqueta?: ReactNode;
  /** Para quien necesite la `<section>` (el pin de GSAP). Si no, usa uno propio. */
  ref?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

/**
 * Una sección del corte de la portada (spec 002 §3.5, plan PD-7). Pinta la `<section>` a
 * todo lo ancho con su `id`, su fondo y su `--shrp` (la nitidez de sus titulares, fija),
 * y encima la cota (ancla `data-hilo` del conducto) con la etiqueta propia detrás: en
 * escritorio en la misma línea, separadas por « · »; en móvil, la etiqueta debajo.
 *
 * Entra descubriéndose desde una línea (`useDescubrir`). El contenido pone su propio
 * `container-max` y su relleno.
 */
export function Seccion({ id, etiqueta, ref, className, style, children, ...resto }: PropsSeccion) {
  const entrada = cortePortada.find((e) => e.id === id);
  if (!entrada) throw new Error(`Seccion: «${id}» no está en cortePortada`);

  const propio = useRef<HTMLElement | null>(null);
  const seccion = ref ?? propio;
  useDescubrir(seccion);

  return (
    <section
      id={id}
      ref={seccion}
      className={cn("seccion", FONDOS[entrada.fondo], className)}
      style={{ "--shrp": entrada.shrp, ...style } as CSSProperties}
      {...resto}
    >
      <div className="container-max">
        <p className="seccion-cabecera">
          <Cota>{entrada.cota}</Cota>
          {etiqueta && (
            <>
              <span aria-hidden="true" className="seccion-separador">
                ·
              </span>
              <span className="font-mono-label seccion-etiqueta">{etiqueta}</span>
            </>
          )}
        </p>
      </div>
      {children}
    </section>
  );
}
