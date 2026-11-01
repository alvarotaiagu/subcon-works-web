import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { Seccion } from "@/components/ui/Seccion";
import { Titular } from "@/components/ui/Titular";
import { faq } from "@/content/consultora";

/**
 * «−6 · Dudas»: acordeón con `<details>`, que se abre con teclado y sin JS. Sin cifras que
 * no existan: coste, plazos y cuotas remiten a la propuesta por escrito. La primera
 * pregunta va abierta para que se vea que se despliega.
 */
export function Faq() {
  return (
    <Seccion id="faq" aria-labelledby="faq-titulo" className="py-[var(--space-section)]">
      <div className="container-max">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Titular nivel={2} id="faq-titulo" arriba={faq.titulo} em={faq.em} />
            <p className="mt-8 max-w-sm text-apagado-abajo">
              ¿Tu duda no está aquí?{" "}
              <Link href="#contacto" className="link-underline text-hueso">
                Cuéntanosla
              </Link>
              .
            </p>
          </div>

          <ul className="faq-lista">
            {faq.items.map((p, i) => (
              <li key={p.pregunta}>
                <details className="faq-item" open={i === 0 ? true : undefined} name="faq">
                  <summary>
                    <span className="font-mono-label faq-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="faq-pregunta">{p.pregunta}</span>
                    <span className="faq-signo" aria-hidden="true">
                      <Glifo nombre="derecha" />
                    </span>
                  </summary>
                  <div className="faq-respuesta">
                    {p.respuesta.map((linea) => (
                      <p key={linea}>{linea}</p>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Seccion>
  );
}
