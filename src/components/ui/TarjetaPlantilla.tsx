import { BrowserMockup } from "@/components/ui/BrowserMockup";
import { Etiqueta } from "@/components/ui/Etiqueta";
import type { Plantilla } from "@/content/plantillas";
import { cn } from "@/lib/utils";

/**
 * Una plantilla del catálogo. La tarjeta entera es el enlace a su demo viva:
 * son sitios publicados, así que lo útil es abrirlos, no leer una ficha.
 */
export function TarjetaPlantilla({
  plantilla,
  className,
  priority = false,
}: {
  plantilla: Plantilla;
  className?: string;
  priority?: boolean;
}) {
  return (
    <a
      href={plantilla.demo}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("plantilla-card group block", className)}
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
          <p className="text-2xl font-medium text-text-primary">{plantilla.negocio}</p>
          <span className="font-mono-label shrink-0 text-[10px]">{plantilla.ciudad}</span>
        </div>
        <p className="font-mono-label mt-1 text-[10px]">{plantilla.sector}</p>
        <p className="mt-3 text-sm text-text-muted">{plantilla.concepto}</p>
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
