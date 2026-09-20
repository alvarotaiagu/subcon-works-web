/**
 * Envío del formulario de auditoría.
 *
 * El sitio es un export estático en GitHub Pages: no hay servidor propio donde
 * recibir un POST. La solicitud va a una Edge Function de Supabase
 * (`solicitar-auditoria`), que valida, limita el ritmo y escribe en una tabla
 * con RLS activo y sin políticas — de forma que ni la clave publicable ni nadie
 * desde el navegador puede leer lo que han mandado otros.
 *
 * La URL no es un secreto (un endpoint público lo es por definición): está en
 * `NEXT_PUBLIC_AUDITORIA_ENDPOINT` solo para poder apuntar a otro proyecto sin
 * tocar el código.
 */
const ENDPOINT =
  process.env.NEXT_PUBLIC_AUDITORIA_ENDPOINT ??
  "https://gotsjhofrcdnyxdwowel.supabase.co/functions/v1/solicitar-auditoria";

export interface SolicitudAuditoria {
  negocio: string;
  ciudad?: string;
  sector?: string;
  web?: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_telefono?: string;
  consentimiento: boolean;
  /** { "P1": "…", "P7": "…" } — solo las contestadas. */
  respuestas: Record<string, string>;
  /** Campo trampa: siempre vacío en un envío humano. */
  direccion_fiscal?: string;
}

export type ResultadoEnvio =
  | { ok: true; id: string | null }
  | { ok: false; motivo: "validacion" | "ritmo" | "red" | "servidor"; detalle?: string[] };

export async function enviarSolicitud(datos: SolicitudAuditoria): Promise<ResultadoEnvio> {
  let respuesta: Response;
  try {
    respuesta = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...datos, origen: "web" }),
    });
  } catch {
    return { ok: false, motivo: "red" };
  }

  if (respuesta.ok) {
    const cuerpo = (await respuesta.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: cuerpo.id ?? null };
  }
  if (respuesta.status === 429) return { ok: false, motivo: "ritmo" };
  if (respuesta.status === 422) {
    const cuerpo = (await respuesta.json().catch(() => ({}))) as { faltan?: string[] };
    return { ok: false, motivo: "validacion", detalle: cuerpo.faltan };
  }
  return { ok: false, motivo: "servidor" };
}
