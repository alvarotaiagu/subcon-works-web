import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { Boton } from "@/components/ui/Boton";
import { Seccion } from "@/components/ui/Seccion";
import { TarjetaPlantilla } from "@/components/ui/TarjetaPlantilla";
import { Titular } from "@/components/ui/Titular";
import { proyectos, type CategoriaProyectos } from "@/content/consultora";
import { plantillas } from "@/content/plantillas";
import { conDorsal } from "@/lib/dorsales";
import { DibujoInforme, DibujoTienda } from "./DibujosProyectos";

function Filas({ categoria }: { categoria: CategoriaProyectos }) {
  return (
    <ul className="proyecto-filas">
      {categoria.items.map((p) => (
        <li key={p.nombre}>
          <Link href={p.href} className="proyecto-fila">
            <span className="font-mono-label proyecto-etiqueta">{p.etiqueta}</span>
            <span className="proyecto-nombre">{p.nombre}</span>
            <span className="proyecto-texto">{p.texto}</span>
            <span className="proyecto-ver font-mono-label">
              Ver <Glifo nombre="derecha" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * «−4 · Webs de ejemplo»: lo que hay en el repo, en tres bandas. Las plantillas son webs de
 * negocios inventados; el informe y la tienda se enseñan con un dibujo rotulado «Ejemplo»
 * (D-041), sin capturas ni datos.
 * El aviso de que nada es trabajo de cliente va dentro de esta misma `<section>`, visible y
 * en tamaño de texto normal (003 §3.5, CA-6; `data-aviso-inventadas`). Ni una sola pieza se
 * presenta como trabajo de cliente. Se queda con el `id` `plantillas` para que los enlaces
 * `/#plantillas` de las demás páginas sigan valiendo.
 */
export function Proyectos() {
  const titulares = conDorsal(plantillas).filter((x) => x.plantilla.destacada);
  const [webs, auto, soft] = proyectos.categorias;

  return (
    <Seccion id="plantillas" aria-labelledby="proyectos-titulo" className="py-[var(--space-portada)]">
      <div className="container-max">
        <Titular
          nivel={2}
          id="proyectos-titulo"
          arriba={proyectos.titulo}
          em={proyectos.em}
          className="max-w-3xl"
        />
        <div data-aviso-inventadas="" className="mt-8 border-l-2 border-superficie pl-5 md:max-w-2xl">
          <p className="font-mono-label mb-2 text-xs text-superficie">Aviso</p>
          <p className="text-base text-apagado-abajo">{proyectos.aviso}</p>
        </div>

        <div className="banda">
          <header className="banda-cabeza">
            <p className="font-mono-label banda-num">A</p>
            <h3 className="banda-titulo">{webs.titulo}</h3>
            <p className="banda-intro">{webs.intro}</p>
          </header>
          <ol className="lista-titulares">
            {titulares.map(({ plantilla, dorsal }) => (
              <li key={plantilla.slug}>
                <TarjetaPlantilla plantilla={plantilla} variante="corte" dorsal={dorsal} />
              </li>
            ))}
          </ol>
          <div className="banda-pie">
            <Boton href="/plantillas/" variante="secundario">
              Ver las {plantillas.length} plantillas
            </Boton>
          </div>
        </div>

        <div className="banda">
          <header className="banda-cabeza">
            <p className="font-mono-label banda-num">B</p>
            <h3 className="banda-titulo">{auto.titulo}</h3>
            <p className="banda-intro">{auto.intro}</p>
          </header>
          <div className="banda-doble">
            <Filas categoria={auto} />
            <DibujoInforme pie="Ilustración de ejemplo: cada fallo, marcado con su prueba y ordenado por prioridad" />
          </div>
        </div>

        <div className="banda">
          <header className="banda-cabeza">
            <p className="font-mono-label banda-num">C</p>
            <h3 className="banda-titulo">{soft.titulo}</h3>
            <p className="banda-intro">{soft.intro}</p>
          </header>
          <div className="banda-doble">
            <Filas categoria={soft} />
            <DibujoTienda pie="Ilustración de ejemplo: lo que hay debajo del escaparate de una tienda, pieza a pieza." />
          </div>
        </div>
      </div>
    </Seccion>
  );
}
