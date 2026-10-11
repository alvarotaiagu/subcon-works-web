/**
 * Origen del servidor del asistente virtual (proyecto `recepcionista-ia`), sin barra final.
 *
 * Solo existe si se define NEXT_PUBLIC_CHATBOT_URL (en local, con `.env.local`; ver
 * `.env.local.example`). En el build de GitHub Pages no está, y entonces la web tiene que
 * salir idéntica a la de siempre: ni widget, ni texto de privacidad sobre el chat.
 *
 * Ojo al usarlo en JSX: un `{chatbotUrl ? x : null}` deja un `null` en el árbol y cambia
 * el HTML exportado aunque no pinte nada. Lo del asistente se cuelga de un nodo que ya
 * existe (`{chatbotUrl ? <>{x}{nodo}</> : nodo}`), y así sin la variable no cambia nada.
 */
export const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL?.replace(/\/+$/, "") || null;
