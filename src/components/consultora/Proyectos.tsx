import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { IlustracionInforme, IlustracionTienda } from "@/components/ui/IlustracionHerramienta";
import { Seccion } from "@/components/ui/Seccion";
import { TarjetaTrabajo } from "@/components/ui/TarjetaTrabajo";
import { Titular } from "@/components/ui/Titular";
import { proyectos, type CategoriaProyectos } from "@/content/consultora";
import { trabajos } from "@/content/trabajos";

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
 * «−4 · Proyectos y demostraciones», en tres bandas. La A son las webs de `trabajos.ts`:
 * encargos de clientes reales y estudios propios, cada tarjeta con su etiqueta (D-036). Las
 * herramientas son software propio con datos de ejemplo. Su `id` es `trabajos`: los
 * enlaces `/#trabajos` de las demás páginas llegan aquí.
 */
export function Proyectos() {
  const [webs, auto, soft] = proyectos.categorias;

  return (
    <Seccion id="trabajos" aria-labelledby="proyectos-titulo" className="py-[var(--space-section)]">
      <div className="container-max">
        <Titular
          nivel={2}
          id="proyectos-titulo"
          arriba={proyectos.titulo}
          em={proyectos.em}
          className="max-w-3xl"
        />
        <div className="mt-8 border-l-2 border-superficie pl-5 md:max-w-2xl">
          <p className="font-mono-label mb-2 text-xs text-superficie">Aviso</p>
          <p className="text-sm text-apagado-abajo">{proyectos.aviso}</p>
        </div>

        <div className="banda">
          <header className="banda-cabeza">
            <p className="font-mono-label banda-num">A</p>
            <h3 className="banda-titulo">{webs.titulo}</h3>
            <p className="banda-intro">{webs.intro}</p>
          </header>
          <ul className="lista-titulares">
            {trabajos.map((trabajo) => (
              <li key={trabajo.slug}>
                <TarjetaTrabajo trabajo={trabajo} />
              </li>
            ))}
          </ul>
          <div className="banda-pie">
            <Filas categoria={webs} />
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
            <div className="banda-ilustracion">
              <IlustracionInforme titulo="Ilustración de un informe: hallazgos ordenados, una nota de conjunto y una lupa sobre las medidas" />
            </div>
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
            <div className="banda-ilustracion">
              <IlustracionTienda titulo="Ilustración de una tienda online: escaparate con productos y el panel del dueño en el móvil" />
            </div>
          </div>
        </div>
      </div>
    </Seccion>
  );
}
