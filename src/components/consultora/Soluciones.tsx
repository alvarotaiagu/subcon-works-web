import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";
import { soluciones } from "@/content/consultora";
import { EnVista } from "./EnVista";
import { Maqueta } from "./Maquetas";

/**
 * «−2 · Soluciones en acción»: cuatro casos de uso, cada uno con su ejemplo hecho a mano
 * (conversación, factura, voz, agenda; el embudo y el panel siguen en `Maquetas` sin usar).
 * La rejilla alterna anchos (7+5, 5+7) para que no sean cuatro tarjetas iguales. Los ejemplos se rotulan
 * «Ejemplo» y el aviso de arriba dice que los datos son inventados: ni clientes ni
 * resultados medidos.
 */
export function Soluciones() {
  return (
    <Seccion id="soluciones" aria-labelledby="soluciones-titulo" className="py-[var(--space-section)]">
      <div className="container-max">
        <Titular
          nivel={2}
          id="soluciones-titulo"
          arriba={soluciones.titulo}
          em={soluciones.em}
          className="max-w-3xl"
        />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="max-w-xl text-lg text-apagado-abajo">{soluciones.intro}</p>
          <div className="border-l-2 border-superficie pl-5">
            <p className="font-mono-label mb-2 text-xs text-superficie">Aviso</p>
            <p className="text-sm text-apagado-abajo">{soluciones.aviso}</p>
          </div>
        </div>

        <ol className="casos">
          {soluciones.casos.map((c, i) => (
            <li key={c.numero} className={`caso caso-${(i % 4 === 0 || i % 4 === 3) ? "ancho" : "estrecho"}`}>
              <EnVista className="caso-maqueta">
                <Maqueta tipo={c.maqueta} />
              </EnVista>
              <div className="caso-texto">
                <p className="font-mono-label caso-numero">{c.numero}</p>
                <h3 className="caso-titulo">{c.titulo}</h3>
                <p className="caso-descripcion">{c.texto}</p>
                <p className="caso-ideal">{c.ideal}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Seccion>
  );
}
