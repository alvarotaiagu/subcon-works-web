import { TarjetaPlantilla } from "@/components/ui/TarjetaPlantilla";
import { plantillas as catalogo } from "@/content/plantillas";
import type { Plantilla } from "@/content/plantillas";

const plantillaPorSlug = new Map<string, Plantilla>(catalogo.map((p) => [p.slug, p]));

/** Las plantillas del catálogo que existen de verdad para esos slugs, en su orden. */
export function plantillasValidas(slugs: string[]): Plantilla[] {
  return slugs.flatMap((slug) => {
    const plantilla = plantillaPorSlug.get(slug);
    return plantilla ? [plantilla] : [];
  });
}

/**
 * Bloque 6 de una página de sector (spec §3.8, D-007): las plantillas
 * ficticias del sector, con `id="plantillas-sector"` (distinto del
 * `#plantillas` de la portada).
 *
 * Si no queda ninguna plantilla válida no sale nada, ni el título (P-01). El
 * aviso de que son ficticias es el mismo texto que en `/plantillas/`.
 */
export function PlantillasSector({
  plantillas: lista,
  className,
}: {
  /** Ya filtradas con `plantillasValidas`. */
  plantillas: Plantilla[];
  className?: string;
}) {
  if (lista.length === 0) return null;

  return (
    <section
      id="plantillas-sector"
      aria-labelledby="plantillas-sector-titulo"
      className={className}
    >
      <div className="border-t border-conducto pt-14">
        <p className="font-mono-label mb-4">Plantillas del sector</p>
        <div className="grid gap-8 md:grid-cols-2">
          <h2
            id="plantillas-sector-titulo"
            className="max-w-xl text-3xl font-medium text-hueso md:text-5xl"
          >
            Así puede quedar la web.
          </h2>
          <div data-aviso-inventadas className="border-l-2 border-superficie/50 pl-5">
            <p className="font-mono-label mb-2 text-[10px] text-superficie">Aviso</p>
            <p className="text-sm text-apagado-abajo">
              Todos los negocios que aparecen son <strong className="font-medium text-hueso">inventados</strong>:
              nombres, direcciones, precios y textos. No son clientes ni existen. Están para enseñar
              cómo queda una web terminada, con todo su contenido en vez de «Lorem ipsum».
            </p>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          {lista.map((plantilla) => (
            <TarjetaPlantilla key={plantilla.slug} plantilla={plantilla} />
          ))}
        </div>
      </div>
    </section>
  );
}
