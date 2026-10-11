"use client";

import type { Ref } from "react";
import { tituloResultado } from "@/lib/diagnostico";
import type { Contexto, Respuestas, Sector } from "@/content/diagnostico";

/**
 * El resultado del diagnóstico rápido.
 *
 * Marcador hasta T09: de momento solo el título. T09 añade las mejoras de
 * `diagnosticar`, la línea de «cualquier agencia» y las tres acciones.
 */
export function Resultado({
  sector,
  tituloRef,
}: {
  sector: Sector;
  respuestas: Respuestas;
  contexto: Contexto;
  hayPlantillas: boolean;
  tituloRef: Ref<HTMLHeadingElement>;
}) {
  return (
    <div>
      <h3
        ref={tituloRef}
        tabIndex={-1}
        className="max-w-3xl text-2xl font-medium text-text-primary outline-none md:text-4xl"
      >
        {tituloResultado(sector)}
      </h3>
    </div>
  );
}
