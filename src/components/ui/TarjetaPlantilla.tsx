import { BrowserMockup } from "@/components/ui/BrowserMockup";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { WorkImage } from "@/components/ui/WorkImage";
import type { Plantilla } from "@/content/plantillas";
import { partirConcepto } from "@/lib/dorsales";
import { cn } from "@/lib/utils";

/**
 * Una plantilla del catálogo. La tarjeta entera es el enlace a su demo viva:
 * son sitios publicados, así que lo útil es abrirlos, no leer una ficha.
 *
 * Dos variantes:
 * - `navegador` (por defecto): la captura en un marco de navegador, con su ficha.
 * - `corte` (spec 002 §3.8): la tarjeta del corte. Arriba, la portada; luego la línea de
 *   superficie; debajo, en `--hondo`, el negocio, «sector · ciudad», el nombre del
 *   concepto en Kode Mono lima y, al pasar el ratón o al enfocar, lo que se mueve. El
 *   `dorsal` es opcional: la portada lo pone, `/plantillas/` no. Sin `data-cursor-*`.
 */
export function TarjetaPlantilla({
  plantilla,
  className,
  priority = false,
  variante = "navegador",
  dorsal,
}: {
  plantilla: Plantilla;
  className?: string;
  priority?: boolean;
  variante?: "navegador" | "corte";
  /** Solo en la variante `corte`: el número del §3.8 (lo calcula `conDorsal`). */
  dorsal?: number;
}) {
  if (variante === "corte") {
    const { nombre } = partirConcepto(plantilla.concepto);
    return (
      <a
        href={plantilla.demo}
        target="_blank"
        rel="noopener"
        data-foco-dentro
        className={cn("tarjeta-corte", className)}
      >
        <span className="tarjeta-corte-sup">
          <WorkImage
            src={`/plantillas/${plantilla.slug}.jpg`}
            alt={`Portada de la plantilla ${plantilla.negocio}, del sector ${plantilla.sector}`}
            width={1440}
            height={960}
            sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 90vw"
            loading={priority ? undefined : "lazy"}
            priority={priority}
          />
          <span className="tarjeta-corte-mov">{plantilla.movimiento}</span>
        </span>
        <span className="tarjeta-corte-linea" aria-hidden="true" />
        <span className="tarjeta-corte-inf">
          <span className="tarjeta-corte-negocio">{plantilla.negocio}</span>
          <span className="tarjeta-corte-sector">
            {plantilla.sector} · {plantilla.ciudad}
          </span>
          {nombre && <span className="tarjeta-corte-concepto">«{nombre}»</span>}
          {dorsal !== undefined && (
            <span data-dorsal className="tarjeta-corte-dorsal" aria-hidden="true">
              {dorsal}
            </span>
          )}
        </span>
      </a>
    );
  }

  return (
    <a
      href={plantilla.demo}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("plantilla-card group block min-w-0", className)}
      data-cursor-hover
      data-cursor-label="Abrir"
    >
      <BrowserMockup
        src={`/plantillas/${plantilla.slug}.jpg`}
        alt={`Portada de la plantilla ${plantilla.negocio}, del sector ${plantilla.sector}`}
        priority={priority}
        url={plantilla.demo.replace("https://", "").replace(/\/$/, "")}
      />

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-2xl font-medium text-hueso">{plantilla.negocio}</p>
          <span className="font-mono-label shrink-0 text-[10px]">{plantilla.ciudad}</span>
        </div>
        <p className="font-mono-label mt-1 text-[10px]">{plantilla.sector}</p>
        <p className="mt-3 text-sm text-apagado-abajo">{plantilla.concepto}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {plantilla.etiquetas.map((etiqueta) => (
            <li key={etiqueta}>
              <Etiqueta>{etiqueta}</Etiqueta>
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}
