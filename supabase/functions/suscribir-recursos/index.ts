// Alta en la lista de recursos de subcon.works, con doble confirmación de Brevo.
//
// Aquí no se apunta a nadie: se le pide a Brevo que mande el correo de
// confirmación, y el contacto solo entra en la lista cuando pulsa el enlace.
// Brevo guarda la lista, la prueba de la confirmación y las bajas.
//
// verify_jwt desactivado, como en solicitar-auditoria: formulario público de
// una web estática. Protección: origen permitido, campo trampa, validación y
// límite por correo y global. El límite usa la tabla intentos_recursos, que
// guarda solo el SHA-256 del correo (nunca el correo) y se vacía a las 24 h.
//
// Secretos de la función (Supabase → Edge Functions → Secrets):
//   BREVO_API_KEY            clave de API de Brevo (SMTP & API → API Keys)
//   BREVO_LISTA_ID           id numérico de la lista «Recursos»
//   BREVO_PLANTILLA_DOI_ID   id de la plantilla de doble confirmación
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Origen permitido → portada a la que vuelve Brevo tras confirmar.
const ORIGENES = new Map([
  ["https://alvarotaiagu.github.io", "https://alvarotaiagu.github.io/subcon-works-web/"],
  ["http://localhost:3000", "http://localhost:3000/"],
  ["http://127.0.0.1:3000", "http://127.0.0.1:3000/"],
]);

function cors(origin: string | null) {
  const permitido = origin && ORIGENES.has(origin) ? origin : "";
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

async function sha256(texto: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(origin) });
  }
  if (req.method !== "POST") {
    return json({ error: "metodo_no_permitido" }, 405, origin);
  }
  const portada = origin ? ORIGENES.get(origin) : undefined;
  if (!origin || !portada) {
    return json({ error: "origen_no_permitido" }, 403, origin);
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return json({ error: "json_invalido" }, 400, origin);
  }

  // Campo trampa: 200 para no enseñarle al bot que ha sido detectado.
  if (typeof cuerpo.direccion_fiscal === "string" && cuerpo.direccion_fiscal.trim()) {
    return json({ ok: true }, 200, origin);
  }

  const email =
    typeof cuerpo.email === "string" ? cuerpo.email.trim().toLowerCase().slice(0, 200) : "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || cuerpo.consentimiento !== true) {
    return json({ error: "campos_invalidos" }, 422, origin);
  }

  // Sin la configuración de Brevo no se gasta cupo: con un id vacío Brevo
  // rechazaría todas las altas y cada intento contaría para el límite.
  const apiKey = Deno.env.get("BREVO_API_KEY");
  const listaId = Number(Deno.env.get("BREVO_LISTA_ID"));
  const plantillaId = Number(Deno.env.get("BREVO_PLANTILLA_DOI_ID"));
  if (!apiKey || !Number.isInteger(listaId) || listaId <= 0 ||
    !Number.isInteger(plantillaId) || plantillaId <= 0) {
    console.error("suscribir-recursos: faltan o no valen los secretos de Brevo");
    return json({ error: "sin_configurar" }, 500, origin);
  }

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Cada correo de confirmación sale a un buzón que no sabemos si es de quien
  // lo escribe: 2 por correo y día, y 60 en total por hora, para que esto no
  // sirva para bombardear a nadie.
  const huella = await sha256(email);
  const hace24h = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
  const hace1h = new Date(Date.now() - 60 * 60_000).toISOString();

  await sb.from("intentos_recursos").delete().lt("creado_en", hace24h);
  const [porCorreo, enTotal] = await Promise.all([
    sb.from("intentos_recursos").select("huella", { count: "exact", head: true })
      .eq("huella", huella),
    sb.from("intentos_recursos").select("huella", { count: "exact", head: true })
      .gte("creado_en", hace1h),
  ]);
  // Si no se puede contar (tabla sin migrar, base caída), no se manda nada:
  // un count nulo como 0 dejaría el límite abierto.
  if (porCorreo.error || enTotal.error) {
    console.error("count intentos_recursos", porCorreo.error ?? enTotal.error);
    return json({ error: "no_comprobado" }, 500, origin);
  }
  if ((porCorreo.count ?? 0) >= 2 || (enTotal.count ?? 0) >= 60) {
    return json({ error: "demasiadas_peticiones" }, 429, origin);
  }

  const inicioIntento = new Date().toISOString();
  const { error: errorIntento } = await sb.from("intentos_recursos").insert({ huella, creado_en: inicioIntento });
  if (errorIntento) {
    console.error("insert intentos_recursos", errorIntento);
    return json({ error: "no_guardado" }, 500, origin);
  }

  const brevo = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      email,
      includeListIds: [listaId],
      templateId: plantillaId,
      redirectionUrl: `${portada}?suscrito=1#recursos`,
    }),
  });

  if (!brevo.ok) {
    const detalle = await brevo.text();
    // Ya estaba en la lista: para quien escribe es lo mismo que un alta, y no
    // se le dice a nadie qué correos están dentro.
    if (brevo.status === 400 && detalle.includes("duplicate_parameter")) {
      return json({ ok: true }, 200, origin);
    }
    console.error("brevo doubleOptinConfirmation", brevo.status, detalle);
    // No ha salido ningún correo: el intento no cuenta, o tras dos fallos de
    // Brevo la persona recibiría un 429 sin haber recibido nada.
    await sb.from("intentos_recursos").delete()
      .eq("huella", huella).eq("creado_en", inicioIntento);
    return json({ error: "no_enviado" }, 502, origin);
  }

  return json({ ok: true }, 201, origin);
});
