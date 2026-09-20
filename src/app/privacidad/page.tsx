import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Privacidad — ${site.nombre}`,
  description: "Qué datos se recogen en el formulario de auditoría, para qué y durante cuánto.",
  robots: { index: false, follow: false },
};

/**
 * Política de privacidad del formulario de auditoría.
 *
 * Los datos de identificación del responsable están como [PENDIENTE] a
 * propósito: no se inventa un nombre fiscal, un NIF ni un domicilio. Hay que
 * completarlos antes de que el formulario reciba una sola solicitud real.
 */
const PENDIENTE = (
  <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
    [PENDIENTE]
  </span>
);

function Apartado({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="mb-4 text-xl font-medium text-text-primary md:text-2xl">{titulo}</h2>
      <div className="space-y-4 text-text-muted">{children}</div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <div className="pt-32 md:pt-40">
      <div className="container-max max-w-3xl pb-[var(--space-section)]">
        <Link href="/" className="link-underline font-mono-label text-xs">
          ← Volver
        </Link>
        <p className="font-mono-label mb-4 mt-8">Privacidad</p>
        <h1 className="text-4xl font-medium text-text-primary md:text-6xl">
          Qué hacemos con tus datos
        </h1>
        <p className="mt-8 text-lg text-text-muted">
          En esta web solo se recogen datos en un sitio: el formulario de la auditoría. Ni hay
          analítica, ni hay publicidad, ni hay cookies de terceros.
        </p>

        <div className="mt-14">
          <Apartado titulo="Quién responde">
            <p>
              {site.nombre}, {PENDIENTE} (nombre fiscal y NIF), con domicilio en {PENDIENTE} (
              {site.ubicacion}). Para cualquier cosa relacionada con esto:{" "}
              <a href={`mailto:${site.email}`} className="link-underline text-text-primary">
                {site.email}
              </a>
              .
            </p>
          </Apartado>

          <Apartado titulo="Qué se recoge">
            <p>
              Lo que escribas en el formulario de auditoría: el nombre del negocio, la ciudad, el
              sector, la dirección de vuestra web si la tenéis, tu nombre, tu correo, tu teléfono si
              lo pones, y las respuestas a las preguntas del cuestionario.
            </p>
            <p>
              No se recoge tu dirección IP, ni se te pone ninguna cookie de seguimiento, ni se
              guarda de qué página vienes. Lo único que se guarda en tu navegador es el borrador de
              tus respuestas, para que no las pierdas si cierras la pestaña: eso se queda en tu
              ordenador y se borra al enviar el formulario.
            </p>
            <p>
              El cuestionario <strong className="font-medium text-text-primary">no pide</strong>{" "}
              datos de vuestros clientes, contraseñas ni accesos a vuestros programas. Si llega algo
              así igualmente, se borra sin usarlo y te avisamos.
            </p>
          </Apartado>

          <Apartado titulo="Para qué">
            <p>
              Para preparar el informe que has pedido y para responderte. Nada más: ni se te apunta
              a un boletín, ni se te manda publicidad después, ni se usan tus respuestas como
              ejemplo en ningún sitio sin que nos digas que sí por escrito.
            </p>
            <p>
              La base legal es la aplicación de medidas precontractuales a petición tuya (artículo
              6.1.b del RGPD): nos lo pides tú rellenando el formulario.
            </p>
          </Apartado>

          <Apartado titulo="Dónde se guardan y quién los ve">
            <p>
              En una base de datos de <strong className="font-medium text-text-primary">Supabase</strong>{" "}
              alojada en servidores de la Unión Europea (región de París). Solo se puede acceder a
              ella con las claves del estudio: la web no puede leer lo que han mandado otros.
            </p>
            <p>
              El informe se redacta con herramientas de IA de{" "}
              <strong className="font-medium text-text-primary">Anthropic</strong>, que procesa las
              respuestas para generarlo y no las usa para entrenar sus modelos. Aparte de esos dos
              proveedores, no se cede nada a nadie.
            </p>
          </Apartado>

          <Apartado titulo="Cuánto tiempo">
            <p>
              Un año desde que nos escribes, si no acabamos trabajando juntos. Si acabamos
              trabajando juntos, lo que dure la relación y los plazos que exija la ley después.
              Puedes pedir que se borren antes y se borran.
            </p>
          </Apartado>

          <Apartado titulo="Tus derechos">
            <p>
              Puedes pedir ver lo que tenemos, corregirlo, borrarlo, limitar su uso, oponerte a él o
              llevártelo a otro sitio. Se hace escribiendo a{" "}
              <a href={`mailto:${site.email}`} className="link-underline text-text-primary">
                {site.email}
              </a>{" "}
              — sin formularios ni trámites, y se contesta en menos de un mes.
            </p>
            <p>
              Si crees que no lo estamos haciendo bien, puedes reclamar ante la Agencia Española de
              Protección de Datos (
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-text-primary"
              >
                aepd.es
              </a>
              ).
            </p>
          </Apartado>

          <Apartado titulo="Cookies">
            <p>
              Esta web no usa cookies de seguimiento ni analítica. Lo único que se guarda en tu
              navegador es el borrador del formulario y el hecho de que ya has visto el aviso, y
              ninguna de las dos cosas sale de tu ordenador.
            </p>
          </Apartado>
        </div>
      </div>
    </div>
  );
}
