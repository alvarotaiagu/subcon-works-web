import type { Metadata } from "next";
import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { BrowserMockup } from "@/components/ui/BrowserMockup";
import { MovilMockup } from "@/components/ui/MovilMockup";
import { WorkImage } from "@/components/ui/WorkImage";
import { herramientas, type Herramienta } from "@/content/herramientas";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Herramientas — ${site.nombre}`,
  description:
    "El software que hemos escrito para sostener cada servicio: la plataforma de tiendas, el informe de mejoras de tu web, la vigilancia diaria, la auditoría de la ficha de Google y los formularios de contacto.",
  robots: { index: false, follow: false },
};

const [principal, ...resto] = herramientas;
const conCaptura = resto.filter((h) => h.capturas?.length);
const sinCaptura = resto.filter((h) => !h.capturas?.length);

function Sostiene({ herramienta }: { herramienta: Herramienta }) {
  return (
    <p className="mt-8 text-sm text-apagado-abajo">
      <span className="font-mono-label mr-2 text-[10px]">Sostiene</span>
      {herramienta.sostiene.map((s, i) => (
        <span key={s.nombre}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          <Link href={s.href} className="link-underline text-superficie">
            {s.nombre}
          </Link>
        </span>
      ))}
    </p>
  );
}

function Hace({ herramienta }: { herramienta: Herramienta }) {
  return (
    <ul className="mt-6 space-y-3 text-sm text-apagado-abajo">
      {herramienta.hace.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[0.55em] h-px w-3 shrink-0 bg-superficie" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Capturas({ herramienta }: { herramienta: Herramienta }) {
  const navegador = herramienta.capturas?.find((c) => c.marco === "navegador");
  const movil = herramienta.capturas?.find((c) => c.marco === "movil");

  return (
    <div className={movil ? "relative md:pb-16" : "relative"}>
      {navegador && (
        <div className={movil ? "md:w-[80%]" : undefined}>
          <BrowserMockup src={navegador.src} alt={navegador.alt} />
        </div>
      )}
      {movil && (
        // En escritorio el móvil se monta sobre la esquina del navegador; en
        // móvil va debajo, centrado, para que no tape la captura grande.
        <div className="mx-auto mt-10 w-[62%] max-w-[260px] md:absolute md:bottom-0 md:right-0 md:mt-0 md:w-[24%] md:max-w-none">
          <MovilMockup src={movil.src} alt={movil.alt} />
        </div>
      )}
    </div>
  );
}

export default function HerramientasPage() {
  return (
    <div className="pt-32 md:pt-40">
      <header className="container-max mb-20">
        <Link href="/#servicios" className="link-underline font-mono-label text-xs">
          <Glifo nombre="izquierda" /> Volver
        </Link>
        <p className="font-mono-label mb-4 mt-8">Herramientas</p>
        <h1 className="max-w-3xl text-4xl font-medium text-hueso md:text-7xl">
          Lo construimos nosotros.
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="text-lg text-apagado-abajo">
            No son programas comprados ni el panel de otra empresa con nuestro logo encima: es
            software que hemos escrito nosotros, y cada pieza sostiene uno de los servicios. Si algo
            no le encaja a tu negocio, se cambia en el código, no se espera a que lo arregle otro.
          </p>
          <div className="border-l-2 border-superficie/50 pl-5">
            <p className="font-mono-label mb-2 text-[10px] text-superficie">Aviso</p>
            <p className="text-sm text-apagado-abajo">
              La plataforma de tiendas se está estrenando con su{" "}
              <strong className="font-medium text-hueso">primera tienda</strong>. Las capturas
              de esta página salen de una tienda de ejemplo y de la demo de una de nuestras
              plantillas: los negocios, los productos, los pedidos y las cifras que aparecen son
              inventados.
            </p>
          </div>
        </div>

        <nav aria-label="Herramientas de esta página" className="mt-14">
          <ul className="flex flex-wrap gap-2">
            {herramientas.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="font-mono-label inline-flex rounded-full border border-apagado-abajo px-4 py-2 text-[10px] transition-colors hover:border-superficie hover:text-superficie"
                >
                  {h.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="container-max pb-[var(--space-section)]">
        {/* La principal: plataforma de tiendas, con su bloque de ventajas. */}
        <section id={principal.id} className="scroll-mt-28 border-t border-conducto pt-14">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <p className="font-mono-label mb-4 text-superficie">La principal</p>
              <h2 className="text-3xl font-medium text-hueso md:text-5xl">
                {principal.nombre}
              </h2>
              <p className="mt-5 text-lg text-apagado-abajo">{principal.resuelve}</p>
              <Hace herramienta={principal} />
              <Sostiene herramienta={principal} />
            </div>
            <Capturas herramienta={principal} />
          </div>

          {principal.ventajas && (
            <div className="mt-24">
              <h3 className="max-w-2xl text-3xl font-medium text-hueso md:text-5xl">
                {principal.ventajas.titulo}
              </h3>
              <ol className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {principal.ventajas.items.map((v, i) => (
                  <li key={v.titulo} className="border-t border-conducto pt-6">
                    <span className="font-mono-label text-xs text-superficie" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-3 text-xl font-medium text-hueso">{v.titulo}</h4>
                    <p className="mt-3 text-apagado-abajo">{v.texto}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        {conCaptura.map((h) => (
          <section key={h.id} id={h.id} className="mt-32 scroll-mt-28 border-t border-conducto pt-14">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div>
                <h2 className="text-3xl font-medium text-hueso md:text-5xl">{h.nombre}</h2>
                <p className="mt-5 text-lg text-apagado-abajo">{h.resuelve}</p>
                <Hace herramienta={h} />
                <Sostiene herramienta={h} />
              </div>
              <Capturas herramienta={h} />
            </div>
          </section>
        ))}

        <div className="mt-32 grid gap-6 border-t border-conducto pt-14 md:grid-cols-3">
          {sinCaptura.map((h) => (
            <section
              key={h.id}
              id={h.id}
              className="flex scroll-mt-28 flex-col rounded-2xl border border-conducto bg-estrato p-7"
            >
              {h.icono && (
                <div className="relative h-16 w-16">
                  <WorkImage src={h.icono} alt="" fill sizes="64px" className="object-contain" />
                </div>
              )}
              <h2 className="mt-6 text-2xl font-medium text-hueso">{h.nombre}</h2>
              <p className="mt-3 text-apagado-abajo">{h.resuelve}</p>
              <Hace herramienta={h} />
              <div className="mt-auto">
                <Sostiene herramienta={h} />
              </div>
            </section>
          ))}
        </div>

        <div className="mt-24 border-t border-conducto pt-14">
          <h2 className="max-w-xl text-3xl font-medium text-hueso md:text-5xl">
            ¿Cuál le hace falta a tu negocio?
          </h2>
          <p className="mt-5 max-w-xl text-apagado-abajo">
            Casi nunca son todas. La auditoría gratuita parte del informe de mejoras de tu web y te
            dice qué falta antes de hablar de precio.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/auditoria/"
              className="rounded-full bg-hueso px-7 py-3.5 text-sm font-medium text-hondo transition-colors hover:bg-apagado-abajo"
            >
              Pedir la auditoría gratuita
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="rounded-full border border-apagado-abajo px-7 py-3.5 text-sm font-medium text-hueso transition-colors hover:border-superficie hover:text-superficie"
            >
              Escribir un correo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
