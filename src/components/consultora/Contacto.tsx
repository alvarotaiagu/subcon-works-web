import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";
import { contacto } from "@/content/consultora";
import { site } from "@/content/site";
import { FormularioContacto } from "./FormularioContacto";

/**
 * «Fondo · Contacto»: el final del corte y del conducto, que acaba en el botón del
 * formulario (`data-hilo-fin`). A la izquierda el titular y las otras dos puertas
 * (diagnóstico rápido de un minuto, que no envía nada, y la auditoría completa); a la
 * derecha el formulario corto. Debajo va el pie, en roca.
 */
export function Contacto() {
  return (
    <Seccion id="contacto" aria-labelledby="contacto-titulo" className="py-[var(--space-section)]">
      <div className="container-max">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Titular nivel={2} id="contacto-titulo" arriba={contacto.titulo} em={contacto.em} />
            <p className="mt-8 max-w-md text-lg text-apagado-abajo">{contacto.texto}</p>

            <ul className="contacto-puertas">
              <li>
                <a href={`mailto:${site.email}`} className="link-underline text-hueso">
                  {site.email}
                </a>
                <span>Si prefieres escribir directamente.</span>
              </li>
              <li>
                <Link href="/sectores/" className="link-underline text-hueso">
                  Diagnóstico rápido <Glifo nombre="derecha" />
                </Link>
                <span>Un minuto, en tu navegador: no envía ni guarda nada.</span>
              </li>
              <li>
                <Link href="/auditoria/" className="link-underline text-hueso">
                  Auditoría completa <Glifo nombre="derecha" />
                </Link>
                <span>36 preguntas sobre cómo trabajáis, con informe.</span>
              </li>
            </ul>
          </div>

          <FormularioContacto />
        </div>
      </div>
    </Seccion>
  );
}
