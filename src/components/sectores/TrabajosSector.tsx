import { TarjetaTrabajo } from "@/components/ui/TarjetaTrabajo";
import type { Trabajo } from "@/content/trabajos";

/**
 * Bloque 6 de una página de sector (spec §3.8, D-007): los trabajos del sector, con
 * `id="trabajos-sector"` (distinto del `#trabajos` de la portada).
 *
 * Si no hay ninguno no sale nada, ni el título (P-01). Cada tarjeta dice si es un
 * encargo o un estudio propio, así que aquí no hace falta otro aviso.
 */
export function TrabajosSector({
  trabajos,
  className,
}: {
  /** Ya resueltos con `trabajosPorSlug`. */
  trabajos: Trabajo[];
  className?: string;
}) {
  if (trabajos.length === 0) return null;

  return (
    <section id="trabajos-sector" aria-labelledby="trabajos-sector-titulo" className={className}>
      <div className="border-t border-conducto pt-14">
        <p className="font-mono-label mb-4">Trabajos del sector</p>
        <h2 id="trabajos-sector-titulo" className="max-w-xl text-3xl font-medium text-hueso md:text-5xl">
          Así ha quedado.
        </h2>
        <ul className="lista-titulares mt-12">
          {trabajos.map((trabajo) => (
            <li key={trabajo.slug}>
              <TarjetaTrabajo trabajo={trabajo} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
