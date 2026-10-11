import Script from "next/script";
import { site } from "@/content/site";

/**
 * Widget del asistente virtual (proyecto `recepcionista-ia`). El layout solo lo importa
 * con NEXT_PUBLIC_CHATBOT_URL, y en perezoso: así ni el widget ni el cargador de
 * `next/script` llegan al build de GitHub Pages. Exportación por defecto por `React.lazy`.
 * `afterInteractive` y no `lazyOnload`: con las escenas WebGL el navegador apenas tiene
 * ratos libres y el botón tardaba en salir (o no salía). El widget solo pinta un botón;
 * el chat no se carga hasta el primer clic.
 *
 * Capas: cursor 88 < botón 89 < aviso de cookies y cortina 90 < transición 95
 * < panel abierto 99 < "Saltar al contenido" 100.
 */
export default function Asistente({ url }: { url: string }) {
  return (
    <Script
      src={`${url}/widget.js`}
      strategy="afterInteractive"
      data-client="subcon-works"
      data-title={`Asistente de ${site.nombre}`}
      data-color="#c9f24d"
      data-color-text="#08090a"
      data-chat-color="#08090a"
      data-z-index="89"
      data-z-index-open="99"
      data-hide-on-hover=".cursor-dot, .cursor-ring"
    />
  );
}
