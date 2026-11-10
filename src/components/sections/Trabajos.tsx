import { Seccion } from "@/components/ui/Seccion";
import { TarjetaTrabajo } from "@/components/ui/TarjetaTrabajo";
import { Titular } from "@/components/ui/Titular";
import { trabajos } from "@/content/trabajos";

/**
 * «−1 · Trabajos» (spec 002 §3.8). Encargos de clientes reales y estudios propios, en una
 * sola rejilla y en el orden de `trabajos.ts` (por calidad, no por origen). Cada tarjeta
 * dice si es un encargo o un estudio propio, y el aviso de abajo explica la diferencia.
 * Sin pin ni carrusel: una rejilla, que se lee igual con JS y sin él.
 */
export function Trabajos() {
  const hayEstudios = trabajos.some((t) => t.tipo === "estudio");

  return (
    <Seccion id="trabajos" className="py-[var(--space-section)]">
      <div className="container-max">
        <Titular nivel={2} arriba="Lo que hemos" em="construido." className="max-w-3xl" />

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="max-w-xl text-apagado-abajo">
            Webs de negocios reales y proyectos que hacemos por nuestra cuenta para probar hasta dónde se
            puede llegar. Cada una parte de una idea distinta, no de la misma retícula con otro color.
            Pincha en cualquiera y se abre la web entera.
          </p>
          {hayEstudios && (
            <div className="border-l-2 border-superficie pl-5">
              <p className="font-mono-label mb-2 text-xs text-superficie">Qué es cada cosa</p>
              <p className="text-sm text-apagado-abajo">
                <strong className="font-medium text-hueso">Encargo</strong> es una web hecha para un
                negocio real. <strong className="font-medium text-hueso">Estudio propio</strong> es un
                proyecto nuestro, sin cliente: su negocio es inventado, con nombres, precios y textos de
                ejemplo.
              </p>
            </div>
          )}
        </div>

        <ul className="lista-titulares mt-14">
          {trabajos.map((trabajo, i) => (
            <li key={trabajo.slug}>
              <TarjetaTrabajo trabajo={trabajo} priority={i < 3} />
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}
