"use client";

import { useMemo, useState } from "react";
import { plantillas, sectoresPlantillas } from "@/content/plantillas";
import { TarjetaPlantilla } from "@/components/ui/TarjetaPlantilla";
import { cn } from "@/lib/utils";

const TODOS = "Todos";

export function CatalogoPlantillas() {
  const [sector, setSector] = useState<string>(TODOS);

  const visibles = useMemo(
    () => (sector === TODOS ? plantillas : plantillas.filter((p) => p.sector === sector)),
    [sector]
  );

  return (
    <div>
      <div className="border-y border-conducto py-5">
        <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <legend className="sr-only">Filtrar plantillas por sector</legend>
          {[TODOS, ...sectoresPlantillas].map((opcion) => {
            const activo = opcion === sector;
            return (
              <button
                key={opcion}
                type="button"
                onClick={() => setSector(opcion)}
                aria-pressed={activo}
                className={cn(
                  "filtro-sector font-mono-label rounded-full border px-3.5 py-1.5 text-[10px] transition-colors",
                  activo
                    ? "es-activo"
                    : "border-apagado-abajo text-apagado-abajo hover:border-hueso hover:text-hueso"
                )}
              >
                {opcion}
                {opcion === TODOS && ` (${plantillas.length})`}
              </button>
            );
          })}
        </fieldset>
      </div>

      <p className="font-mono-label mt-6 text-[10px]" aria-live="polite">
        {visibles.length === plantillas.length
          ? `${plantillas.length} plantillas`
          : `${visibles.length} de ${plantillas.length}`}
      </p>

      <ul className="lista-titulares lista-catalogo mt-8">
        {visibles.map((plantilla, i) => (
          <li key={plantilla.slug}>
            <TarjetaPlantilla plantilla={plantilla} variante="corte" priority={i < 3} />
          </li>
        ))}
      </ul>
    </div>
  );
}
