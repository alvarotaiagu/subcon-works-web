import type { Metadata } from "next";
import { CabeceraInterior, nitidezInterior } from "@/components/ui/CabeceraInterior";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Privacidad — ${site.nombre}`,
  description:
    "Qué datos recogen el formulario de la portada y el de la auditoría, para qué, dónde se guardan y durante cuánto.",
  robots: { index: false, follow: false },
};

/**
 * Política de privacidad de los dos formularios (el de la portada y el de la auditoría).
 *
 * Los datos de identificación del responsable están como [PENDIENTE] a
 * propósito: no se inventa un nombre fiscal, un NIF ni un domicilio. Hay que
 * completarlos antes de que un formulario reciba una sola solicitud real.
 */
const PENDIENTE = (
  <span className="rounded bg-estrato px-1.5 py-0.5 font-mono text-[0.85em] text-superficie">
    [PENDIENTE]
  </span>
);

function Apartado({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-conducto py-10">
      <h2 className="mb-4 text-xl font-medium text-hueso md:text-2xl">{titulo}</h2>
      <div className="space-y-4 text-apagado-abajo">{children}</div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <div style={nitidezInterior("privacidad")}>
      <CabeceraInterior pagina="privacidad" arriba="Qué hacemos" em="con tus datos" className="mb-14">
        <p className="mt-8 max-w-3xl text-lg text-apagado-abajo">
          En esta web se recogen datos en dos sitios: el formulario de la portada para pedir una
          propuesta y el formulario de la auditoría. Ni hay analítica, ni hay publicidad, ni hay
          cookies.
        </p>
      </CabeceraInterior>

      <div className="container-max pb-[var(--space-section)]">
        <div className="max-w-3xl">
          <Apartado titulo="Quién responde">
            <p>
              {site.nombre}, {PENDIENTE} (nombre fiscal y NIF), con domicilio en {PENDIENTE} (
              {site.ubicacion}). Para cualquier cosa relacionada con esto:{" "}
              <a href={`mailto:${site.email}`} className="link-underline text-hueso">
                {site.email}
              </a>
              .
            </p>
          </Apartado>

          <Apartado titulo="Qué se recoge">
            <p>
              En el formulario de la portada para pedir una propuesta: tu nombre, el de tu empresa,
              tu correo, tu teléfono si lo pones, el tipo de negocio y lo que nos cuentes que te
              gustaría mejorar.
            </p>
            <p>
              En el formulario de la auditoría: el nombre del negocio, la ciudad, el sector, la
              dirección de vuestra web si la tenéis, tu nombre, tu correo, tu teléfono si lo pones,
              y las respuestas a las preguntas del cuestionario.
            </p>
            <p>
              Si nos escribes directamente al correo, el mensaje llega a nuestro buzón y la web no
              guarda nada.
            </p>
            <p>
              Nosotros no guardamos tu dirección IP ni te ponemos ninguna cookie. El formulario de
              la portada no guarda nada en tu navegador. El de la auditoría, desde que lo abres,
              guarda un borrador con tus datos de contacto y tus respuestas, para que no las pierdas
              si cierras la pestaña: se queda en tu ordenador y se borra cuando lo envías. No
              caduca: si no lo envías, sigue ahí hasta que borres los datos de esta web en tu
              navegador.
            </p>
            <p>
              El cuestionario <strong className="font-medium text-hueso">no pide</strong>{" "}
              datos de vuestros clientes, contraseñas ni accesos a vuestros programas. Si llega algo
              así igualmente, se borra sin usarlo y te avisamos.
            </p>
            <p>
              El diagnóstico rápido no envía ni guarda tus respuestas: van en la dirección de la
              página (y en el enlace, si lo copias). Solo pasan a la auditoría si pulsas el botón;
              allí se quitan de la dirección, pasan al borrador y aplica lo de arriba.
            </p>
          </Apartado>

          <Apartado titulo="Para qué">
            <p>
              Para responderte y, si has pedido la auditoría, para preparar su informe. Nada más: ni
              se te apunta a un boletín, ni se te manda publicidad después, ni se usan tus respuestas como
              ejemplo en ningún sitio sin que nos digas que sí por escrito.
            </p>
            <p>
              La base legal es la aplicación de medidas precontractuales a petición tuya (artículo
              6.1.b del RGPD): nos lo pides tú rellenando cualquiera de los dos formularios.
            </p>
          </Apartado>

          <Apartado titulo="Dónde se guardan y quién los ve">
            <p>
              Los dos formularios envían a la misma base de datos de Supabase, alojada en
              servidores de la Unión Europea (región de París). Solo se puede acceder a ella con
              las claves del estudio: la web no puede leer lo que han mandado otros.
            </p>
            <p>
              Las lee Álvaro, que es quien tiene esas claves, y para preparar el informe de la
              auditoría las copia en su ordenador.
            </p>
            <p>
              El informe de la auditoría se redacta con la IA de Anthropic, que procesa las
              respuestas para generarlo y no las usa para entrenar sus modelos. Los correos que nos
              mandas directamente están en nuestra cuenta de Gmail, de Google. Aparte de esos
              proveedores, no se cede nada a nadie.
            </p>
          </Apartado>

          <Apartado titulo="Cuánto tiempo">
            <p>
              En nuestro lado nada se borra solo. Lo que mandes por cualquiera de los dos
              formularios, y las copias que bajamos para preparar el informe, se guardan hasta que
              los borramos a mano: cada tres meses repasamos lo guardado y borramos lo que lleve
              más de un año sin mensajes tuyos, si no acabamos trabajando juntos. Los correos que
              nos mandas directamente se quedan en nuestro buzón hasta que los borramos. Si
              acabamos trabajando juntos, lo que dure la relación y los plazos que exija la ley
              después. Puedes pedir que se borren antes y se borran.
            </p>
          </Apartado>

          <Apartado titulo="Tus derechos">
            <p>
              Puedes pedir ver lo que tenemos, corregirlo, borrarlo, limitar su uso, oponerte a él o
              llevártelo a otro sitio. Se hace escribiendo a{" "}
              <a href={`mailto:${site.email}`} className="link-underline text-hueso">
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
                className="link-underline text-hueso"
              >
                aepd.es
              </a>
              ).
            </p>
          </Apartado>

          <Apartado titulo="Cookies">
            <p>
              Esta web no usa cookies ni analítica. Lo único que se guarda en tu navegador es el
              borrador de la auditoría, si abres su formulario (hasta que lo envíes o borres los
              datos de esta web en tu navegador), el hecho de que ya has visto el aviso y, solo
              mientras tengas la pestaña abierta, que ya has visto la animación de entrada, para no
              repetírtela. Nada de eso se nos manda solo: el borrador sale de tu ordenador cuando
              envías el formulario, y no antes.
            </p>
          </Apartado>
        </div>
      </div>
    </div>
  );
}
