/**
 * Suscripción a la lista de recursos (skills, plantillas, checklists) por correo.
 *
 * Solo existe si se define NEXT_PUBLIC_RECURSOS_ENDPOINT. Sin ella —como ahora en el build
 * de GitHub Pages— no se pinta la sección de la portada ni su apartado de privacidad: está
 * apagada hasta que el estudio tenga dominio propio, porque Brevo con un remitente de Gmail
 * acaba en spam. Ver `docs/recursos.md`.
 *
 * Mismo cuidado en JSX que con el asistente (ver src/lib/chatbot.ts): colgar lo de los
 * recursos de un nodo que ya existe, nunca dejar un `null` en el árbol.
 *
 * La petición va a la Edge Function `suscribir-recursos`, que pide a Brevo el correo de
 * doble confirmación. Nadie entra en la lista hasta que pulsa el enlace de ese correo.
 */
export const recursosEndpoint = process.env.NEXT_PUBLIC_RECURSOS_ENDPOINT || null;

export type ResultadoSuscripcion =
  | { ok: true }
  | { ok: false; motivo: "validacion" | "ritmo" | "red" | "servidor" };

export async function suscribirRecursos(datos: {
  email: string;
  consentimiento: boolean;
  /** Campo trampa: siempre vacío en un envío humano. */
  direccion_fiscal?: string;
}): Promise<ResultadoSuscripcion> {
  if (!recursosEndpoint) return { ok: false, motivo: "servidor" };

  let respuesta: Response;
  try {
    respuesta = await fetch(recursosEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(datos),
    });
  } catch {
    return { ok: false, motivo: "red" };
  }

  if (respuesta.ok) return { ok: true };
  if (respuesta.status === 429) return { ok: false, motivo: "ritmo" };
  if (respuesta.status === 422) return { ok: false, motivo: "validacion" };
  return { ok: false, motivo: "servidor" };
}
