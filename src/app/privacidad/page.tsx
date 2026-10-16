import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { chatbotUrl } from "@/lib/chatbot";
import { recursosEndpoint } from "@/lib/recursos";

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

/**
 * Solo se pinta con el asistente activo (NEXT_PUBLIC_CHATBOT_URL). Borrador pendiente de
 * revisión: el distintivo [REVISAR] se quita cuando el texto esté aprobado.
 */
function ApartadoAsistente() {
  return (
    <Apartado titulo="El asistente virtual del chat">
      <p>
        <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
          [REVISAR]
        </span>
      </p>
      <p>
        El botón de la esquina abre un asistente virtual con inteligencia artificial. Contesta
        dudas sobre lo que hacemos y, si quieres que te escribamos, te pide tu nombre y un email o
        un teléfono. No es una persona y puede equivocarse: lo que importe te lo confirmamos por
        correo.
      </p>
      <p>
        <strong className="font-medium text-text-primary">Qué se trata:</strong> lo que escribas
        en el chat y, solo si nos los das, tu nombre y tu forma de contacto. No hace falta que le
        cuentes datos de tus clientes, contraseñas ni nada delicado; si llega algo así, no se usa.
        El servidor del chat mira tu dirección IP únicamente para limitar cuántos mensajes se
        pueden mandar por minuto, y no la guarda.
      </p>
      <p>
        <strong className="font-medium text-text-primary">Para qué:</strong> para contestarte
        en esa conversación y, si lo pides, para escribirte. Nada más: no se usa para publicidad,
        ni para hacerte un perfil, ni se te apunta a ningún boletín. La base legal es la misma que
        la del formulario: nos lo pides tú (artículo 6.1.b del RGPD).
      </p>
      <p>
        <strong className="font-medium text-text-primary">Quién lo procesa:</strong> los
        mensajes se envían a <strong className="font-medium text-text-primary">Anthropic</strong>,
        que genera las respuestas como encargado del tratamiento, siguiendo nuestras instrucciones
        y sin usarlos para entrenar sus modelos. Anthropic trabaja desde Estados Unidos, así que
        esos mensajes salen de la Unión Europea con las garantías de su contrato de encargo de
        tratamiento.
      </p>
      <p>
        <strong className="font-medium text-text-primary">Cuánto tiempo:</strong> la
        conversación se guarda en el servidor del chat mientras está abierta y se borra al
        reiniciarlo. Si dejas tu contacto, se guarda como las solicitudes del formulario: un año si
        no acabamos trabajando juntos, y puedes pedir que se borre antes.
      </p>
      <p>
        <strong className="font-medium text-text-primary">En tu navegador:</strong> al abrir el
        chat se guarda un identificador de sesión al azar, para que la conversación siga ahí si
        recargas la página. No lleva ningún dato tuyo, no sirve para seguirte y solo se crea si
        abres el chat. Se borra borrando los datos de este sitio en tu navegador.
      </p>
    </Apartado>
  );
}

/**
 * Solo se pinta con la lista de recursos activa (NEXT_PUBLIC_RECURSOS_ENDPOINT, ver
 * src/lib/recursos.ts). Borrador pendiente de revisión, como el del asistente.
 */
function ApartadoRecursos() {
  return (
    <Apartado titulo="La lista de recursos por correo">
      <p>
        <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
          [REVISAR]
        </span>
      </p>
      <p>
        En la portada puedes dejar tu correo para recibir skills, plantillas y checklists. Es
        independiente del formulario de auditoría: pedir el informe no te apunta a esta lista, y
        apuntarte a la lista no te obliga a nada más.
      </p>
      <p>
        <strong className="font-medium text-text-primary">Qué se trata:</strong> tu correo y la
        fecha en que confirmas la suscripción. Al apuntarte te llega un correo con un enlace, y
        hasta que no lo pulsas no entras en la lista.
      </p>
      <p>
        <strong className="font-medium text-text-primary">Para qué:</strong> para mandarte esos
        recursos y, de vez en cuando, novedades del estudio, lo que incluye nuestros servicios. La
        base legal es tu consentimiento (artículo 6.1.a del RGPD y artículo 21 de la Ley 34/2002 de
        servicios de la sociedad de la información), que das al marcar la casilla y confirmar el
        correo.
      </p>
      <p>
        <strong className="font-medium text-text-primary">Quién lo procesa:</strong> la lista
        vive en <strong className="font-medium text-text-primary">Brevo</strong> (Sendinblue SAS,
        Francia), que envía los correos como encargado del tratamiento desde servidores de la
        Unión Europea. Para evitar que alguien apunte correos ajenos una y otra vez, la web guarda
        durante un día una huella del correo (su resumen SHA-256), no el correo escrito tal cual,
        en la misma base de datos de Supabase del formulario.
      </p>
      <p>
        <strong className="font-medium text-text-primary">Cuánto tiempo y cómo salir:</strong>{" "}
        hasta que te des de baja. Cada correo lleva un enlace para hacerlo con un clic, y también
        vale escribir a{" "}
        <a href={`mailto:${site.email}`} className="link-underline text-text-primary">
          {site.email}
        </a>
        . Después de la baja solo se guarda tu correo marcado como baja, para no volver a
        escribirte.
      </p>
    </Apartado>
  );
}

function ApartadoCookies() {
  return chatbotUrl ? (
    <Apartado titulo="Cookies">
      <p>
        Esta web no usa cookies de seguimiento ni analítica. Lo único que se guarda en tu
        navegador es el borrador del formulario, el hecho de que ya has visto el aviso y, si abres
        el chat, su identificador de sesión. Los dos primeros no salen de tu ordenador; el
        identificador viaja con cada mensaje del chat para que el servidor sepa a qué conversación
        pertenece, y para nada más.
      </p>
    </Apartado>
  ) : (
    <Apartado titulo="Cookies">
      <p>
        Esta web no usa cookies de seguimiento ni analítica. Lo único que se guarda en tu navegador
        es el borrador del formulario y el hecho de que ya has visto el aviso, y ninguna de las dos
        cosas sale de tu ordenador.
      </p>
    </Apartado>
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
          {chatbotUrl && recursosEndpoint
            ? "En esta web se recogen datos en tres sitios: el formulario de la auditoría, el chat del asistente virtual si lo abres y la lista de recursos por correo si te apuntas. Ni hay analítica, ni hay anuncios, ni hay cookies de terceros."
            : recursosEndpoint
              ? "En esta web se recogen datos en dos sitios: el formulario de la auditoría y, si te apuntas, la lista de recursos por correo. Ni hay analítica, ni hay anuncios, ni hay cookies de terceros."
              : chatbotUrl
                ? "En esta web se recogen datos en dos sitios: el formulario de la auditoría y, si lo abres, el chat del asistente virtual. Ni hay analítica, ni hay publicidad, ni hay cookies de terceros."
                : "En esta web solo se recogen datos en un sitio: el formulario de la auditoría. Ni hay analítica, ni hay publicidad, ni hay cookies de terceros."}
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
            <p>
              El diagnóstico rápido no envía ni guarda tus respuestas; solo pasan a la auditoría si
              pulsas el botón, y ahí aplica lo de arriba.
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

          {/* Con el asistente o la lista de recursos activos, sus apartados van delante de
              Cookies (ver src/lib/chatbot.ts y src/lib/recursos.ts). */}
          {chatbotUrl || recursosEndpoint ? (
            <>
              {chatbotUrl ? <ApartadoAsistente /> : null}
              {recursosEndpoint ? <ApartadoRecursos /> : null}
              <ApartadoCookies />
            </>
          ) : (
            <ApartadoCookies />
          )}
        </div>
      </div>
    </div>
  );
}
