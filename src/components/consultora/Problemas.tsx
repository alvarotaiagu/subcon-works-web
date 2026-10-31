import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";
import { problemas } from "@/content/consultora";

/**
 * «0 · Lo que pasa»: los tres problemas del día a día. Los números son grandes y la
 * segunda columna baja medio paso: la sección se lee en zigzag, no como una rejilla de
 * tarjetas. El cierre enlaza a los servicios; el contacto ya tiene su sitio en el hero y
 * al final.
 */
export function Problemas() {
  return (
    <Seccion id="problemas" aria-labelledby="problemas-titulo" className="py-[var(--space-section)]">
      <div className="container-max">
        <Titular nivel={2} id="problemas-titulo" arriba={problemas.titulo} className="max-w-4xl" />

        <ol className="problemas-lista">
          {problemas.items.map((p) => (
            <li key={p.numero} className="problema">
              <span className="problema-num" aria-hidden="true">
                {p.numero}
              </span>
              <h3 className="problema-titulo">{p.titulo}</h3>
              <p className="problema-texto">{p.texto}</p>
            </li>
          ))}
        </ol>

        <div className="problemas-cierre">
          <p>{problemas.cierre}</p>
          <Link href="#servicios" className="link-underline font-mono-label text-xs text-superficie">
            Ver cómo <Glifo nombre="derecha" />
          </Link>
        </div>
      </div>
    </Seccion>
  );
}
