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
      <div className="border-y border-line py-5">
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
                  "font-mono-label rounded-full border px-3.5 py-1.5 text-[10px] transition-colors",
                  activo
                    ? "border-accent bg-accent text-bg-base"
                    : "border-line text-text-muted hover:border-text-faint hover:text-text-primary"
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

      <div className="mt-8 grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
        {visibles.map((plantilla, i) => (
          <TarjetaPlantilla
            key={plantilla.slug}
            plantilla={plantilla}
            priority={i < 3}
          />
        ))}
      </div>
    </div>
  );
}
