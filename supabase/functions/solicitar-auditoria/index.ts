// Recibe el formulario de auditoría gratuita de subcon.works y lo guarda.
//
// verify_jwt está desactivado a propósito: es un formulario público de una web
// estática, no hay sesión que presentar. La protección es: origen permitido,
// campo trampa, validación estricta de forma y límite por correo y global.
// La tabla tiene RLS sin políticas, así que solo escribe esta función.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ORIGENES_PERMITIDOS = new Set([
  "https://alvarotaiagu.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const PREGUNTAS = Array.from({ length: 36 }, (_, i) => `P${i + 1}`);
const MAX_RESPUESTA = 4000;

function cors(origin: string | null) {
  const permitido = origin && ORIGENES_PERMITIDOS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": permitido,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...cors(origin) },
  });
}

function texto(valor: unknown, max: number): string | null {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim().slice(0, max);
  return limpio.length ? limpio : null;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(origin) });
  }
  if (req.method !== "POST") {
    return json({ error: "metodo_no_permitido" }, 405, origin);
  }
  if (!origin || !ORIGENES_PERMITIDOS.has(origin)) {
    return json({ error: "origen_no_permitido" }, 403, origin);
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return json({ error: "json_invalido" }, 400, origin);
  }

  // Campo trampa: invisible en el formulario, solo lo rellenan los bots.
  if (texto(cuerpo.direccion_fiscal, 200)) {
    // Se responde 200 para no enseñarle al bot que ha sido detectado.
    return json({ ok: true, id: null }, 200, origin);
  }

  const negocio = texto(cuerpo.negocio, 200);
  const contacto_nombre = texto(cuerpo.contacto_nombre, 160);
  const contacto_email = texto(cuerpo.contacto_email, 200)?.toLowerCase() ?? null;
  const consentimiento = cuerpo.consentimiento === true;

  const faltan: string[] = [];
  if (!negocio || negocio.length < 2) faltan.push("negocio");
  if (!contacto_nombre || contacto_nombre.length < 2) faltan.push("contacto_nombre");
  if (!contacto_email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contacto_email)) {
    faltan.push("contacto_email");
  }
  if (!consentimiento) faltan.push("consentimiento");
  if (faltan.length) return json({ error: "campos_invalidos", faltan }, 422, origin);

  // Solo se aceptan las claves P1..P36: cualquier otra cosa se descarta.
  const entrantes = (cuerpo.respuestas ?? {}) as Record<string, unknown>;
  if (typeof entrantes !== "object" || Array.isArray(entrantes)) {
    return json({ error: "respuestas_invalidas" }, 422, origin);
  }
  const respuestas: Record<string, string> = {};
  for (const clave of PREGUNTAS) {
    const valor = texto(entrantes[clave], MAX_RESPUESTA);
    if (valor) respuestas[clave] = valor;
  }

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Límite sencillo: 3 envíos por correo en 10 minutos y 40 en total por hora.
  const hace10min = new Date(Date.now() - 10 * 60_000).toISOString();
  const hace1h = new Date(Date.now() - 60 * 60_000).toISOString();

  const [porCorreo, enTotal] = await Promise.all([
    sb.from("solicitudes_auditoria").select("id", { count: "exact", head: true })
      .eq("contacto_email", contacto_email).gte("creada_en", hace10min),
    sb.from("solicitudes_auditoria").select("id", { count: "exact", head: true })
      .gte("creada_en", hace1h),
  ]);
  if ((porCorreo.count ?? 0) >= 3 || (enTotal.count ?? 0) >= 40) {
    return json({ error: "demasiadas_peticiones" }, 429, origin);
  }

  const { data, error } = await sb
    .from("solicitudes_auditoria")
    .insert({
      negocio,
      ciudad: texto(cuerpo.ciudad, 120),
      sector: texto(cuerpo.sector, 120),
      web: texto(cuerpo.web, 500),
      contacto_nombre,
      contacto_email,
      contacto_telefono: texto(cuerpo.contacto_telefono, 40),
      respuestas,
      respondidas: Object.keys(respuestas).length,
      consentimiento: true,
      origen: texto(cuerpo.origen, 40) ?? "web",
    })
    .select("id")
    .single();

  if (error) {
    console.error("insert solicitudes_auditoria", error);
    return json({ error: "no_guardado" }, 500, origin);
  }

  return json({ ok: true, id: data.id, respondidas: Object.keys(respuestas).length }, 201, origin);
});
