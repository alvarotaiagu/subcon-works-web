#!/usr/bin/env node
// Baja las solicitudes de auditoría que ha dejado el formulario de la web y las
// escribe en la carpeta `entrada/` del kit `03-kit-auditoria-negocio`, con el
// mismo formato que tendría el cuestionario devuelto por email: los bloques y
// las preguntas **P1..P36 con su numeración**, que es por donde el informe las
// cita. Después basta con abrir el kit y decirle a Claude "audita este formulario".
//
// Uso:
//   node kit/traer-solicitudes.mjs                     # lista lo que hay pendiente
//   node kit/traer-solicitudes.mjs --bajar             # escribe los .md en entrada/
//   node kit/traer-solicitudes.mjs --bajar --marcar    # ...y las pasa a "en_curso"
//   node kit/traer-solicitudes.mjs --bajar --todas     # incluye las ya marcadas
//   node kit/traer-solicitudes.mjs --bajar --destino "D:/otra/ruta/entrada"
//
// Necesita la clave de servicio del proyecto Supabase, que **no se commitea**:
// ponla en un `.env.local` en la raíz del repo (ya está en .gitignore) como
//   SUPABASE_SERVICE_ROLE_KEY=...
// o pásala por el entorno al lanzar el comando.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const aqui = dirname(fileURLToPath(import.meta.url));
const raizRepo = resolve(aqui, "..");

const PROYECTO = process.env.SUPABASE_URL ?? "https://gotsjhofrcdnyxdwowel.supabase.co";
const DESTINO_POR_DEFECTO = resolve(
  raizRepo,
  "..",
  "..",
  "KITS Claude",
  "03-kit-auditoria-negocio",
  "entrada"
);

// --- El cuestionario, en el orden y con los textos del kit -------------------
// Se repite aquí a propósito: este script tiene que poder ejecutarse sin
// importar nada del build de Next, y el informe cita por número, no por texto.
const BLOQUES = [
  ["El negocio", [
    ["P1", "Nombre del negocio"],
    ["P2", "A qué os dedicáis, en una frase"],
    ["P3", "Ciudad"],
    ["P4", "¿Cuántas personas trabajáis y qué hace cada una?"],
    ["P5", "Horario de atención al público"],
    ["P6", "¿A cuántos clientes atendéis a la semana, más o menos?"],
  ]],
  ["Cómo os llegan los clientes", [
    ["P7", "¿Por dónde os contactan? Ordénalo de más a menos"],
    ["P8", "¿Quién responde a esas llamadas y mensajes, y desde qué dispositivo?"],
    ["P9", "¿Cuánto se tarda normalmente en contestar un mensaje?"],
    ["P10", "¿Qué pasa con las llamadas y mensajes que llegan fuera de horario o cuando estáis ocupados?"],
    ["P11", "¿Cuántas consultas de clientes nuevos entran a la semana, más o menos?"],
  ]],
  ["Agenda y citas", [
    ["P12", "¿Dónde apuntáis las citas?"],
    ["P13", "¿Quién las apunta, y desde dónde se puede consultar la agenda?"],
    ["P14", "¿Puede el cliente reservar él solo por internet, sin llamar?"],
    ["P15", "¿Cómo le recordáis la cita al cliente? ¿Quién lo hace, y cuánto tiempo se le va a la semana?"],
    ["P16", "¿Cuántas citas se pierden por no presentarse o cancelar? ¿Cuánto factura de media una cita?"],
  ]],
  ["Presupuestos, cobro y facturación", [
    ["P17", "¿Cómo preparáis un presupuesto y cómo se lo hacéis llegar al cliente?"],
    ["P18", "¿Cuántos presupuestos mandáis al mes, y cuántos acaban en trabajo?"],
    ["P19", "¿Cómo cobráis?"],
    ["P20", "¿Quién hace las facturas y con qué programa? ¿Cuánto tiempo al mes os lleva?"],
    ["P21", "¿Tenéis impagos, o pagos pendientes que se os olvida reclamar?"],
  ]],
  ["Después de la venta", [
    ["P22", "Cuando un cliente termina, ¿qué pasa? ¿Volvéis a hablar con él?"],
    ["P23", "¿Pedís reseñas? ¿Cuántas tenéis ahora mismo y con qué nota?"],
    ["P24", "¿Vuestros clientes deberían volver cada cierto tiempo? ¿Cómo les avisáis?"],
    ["P25", "¿Mandáis alguna comunicación cada cierto tiempo? ¿Con qué herramienta?"],
  ]],
  ["Herramientas y datos", [
    ["P26", "Lista de programas y aplicaciones que pagáis"],
    ["P27", "¿Dónde está la información de vuestros clientes?"],
    ["P28", "¿Hay copia de seguridad de eso? ¿Quién la hace y cada cuánto?"],
    ["P29", "¿Quién tiene acceso a esa información? Si mañana esa persona no viene, ¿se puede seguir?"],
    ["P30", "¿Qué números miráis cada mes para saber si el negocio va bien?"],
  ]],
  ["Tiempo, IA y objetivos", [
    ["P31", "Las 3 tareas repetitivas que más tiempo os comen"],
    ["P32", "¿Cuánto cuesta más o menos una hora de trabajo de quien hace esas tareas?"],
    ["P33", "¿Habéis probado alguna herramienta de IA o de automatización? ¿Qué pasó?"],
    ["P34", "¿Qué os preocuparía de usar inteligencia artificial con vuestros clientes?"],
    ["P35", "Si pudieras arreglar una sola cosa del día a día, ¿cuál sería?"],
    ["P36", "¿Qué presupuesto tienes en mente para montarlo? ¿Y para el mantenimiento mensual?"],
  ]],
];

// --- Utilidades --------------------------------------------------------------
function cargarEnvLocal() {
  const ruta = join(raizRepo, ".env.local");
  if (!existsSync(ruta)) return;
  for (const linea of readFileSync(ruta, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(linea);
    if (!m) continue;
    const valor = m[2].replace(/^["']|["']$/g, "");
    if (!process.env[m[1]]) process.env[m[1]] = valor;
  }
}

function sinAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function aSlug(texto) {
  return sinAcentos(texto)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "sin-nombre";
}

function fechaLarga(iso) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  });
}

/** Convierte una fila en el markdown que el kit espera encontrar en entrada/. */
function aMarkdown(fila) {
  const r = fila.respuestas ?? {};
  const contestadas = Object.keys(r).length;
  const sinContestar = [];

  const partes = [
    `# Formulario relleno · ${fila.negocio}`,
    "",
    `Recibido por el formulario de la web el **${fechaLarga(fila.creada_en)}**.`,
    "Se transcribe tal cual lo escribió el negocio, sin corregir ni reordenar.",
    "",
    "## Ficha de contacto",
    "",
    `- **Negocio:** ${fila.negocio}`,
    `- **Sector declarado:** ${fila.sector || "sin indicar"}`,
    `- **Ciudad:** ${fila.ciudad || "sin indicar"}`,
    `- **Web:** ${fila.web || "no tienen o no la han indicado"}`,
    `- **Contacto:** ${fila.contacto_nombre} · ${fila.contacto_email}${
      fila.contacto_telefono ? ` · ${fila.contacto_telefono}` : ""
    }`,
    `- **Respondidas:** ${contestadas} de 36`,
    `- **Referencia:** \`${fila.id}\``,
    "",
    "---",
    "",
  ];

  BLOQUES.forEach(([titulo, preguntas], i) => {
    partes.push(`## Bloque ${i + 1} · ${titulo}`, "");
    for (const [id, etiqueta] of preguntas) {
      const respuesta = (r[id] ?? "").trim();
      // Las que ya acaban en "?" no llevan dos puntos detrás.
      const cierre = /[?:]$/.test(etiqueta) ? "" : ":";
      partes.push(`**${id}.** ${etiqueta}${cierre}`);
      if (respuesta) {
        partes.push(respuesta);
      } else {
        partes.push("_(sin contestar)_");
        sinContestar.push(id);
      }
      partes.push("");
    }
    partes.push("---", "");
  });

  partes.push(
    "## Huecos",
    "",
    sinContestar.length === 0
      ? "Ninguno: contestó las 36."
      : `Sin contestar (${sinContestar.length}): ${sinContestar.join(", ")}. ` +
        "El informe tiene que marcarlas como «sin datos», no rellenarlas por su cuenta.",
    ""
  );

  return partes.join("\n");
}

async function consultar(ruta, opciones = {}) {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!clave) {
    console.error(
      "Falta SUPABASE_SERVICE_ROLE_KEY.\n" +
        "Ponla en un .env.local en la raíz del repo (está en .gitignore) o en el entorno.\n" +
        "Se copia en Supabase → Project Settings → API Keys → service_role."
    );
    process.exit(1);
  }
  const respuesta = await fetch(`${PROYECTO}/rest/v1/${ruta}`, {
    ...opciones,
    headers: {
      apikey: clave,
      Authorization: `Bearer ${clave}`,
      "content-type": "application/json",
      ...(opciones.headers ?? {}),
    },
  });
  if (!respuesta.ok) {
    console.error(`Supabase respondió ${respuesta.status}: ${await respuesta.text()}`);
    process.exit(1);
  }
  return respuesta.status === 204 ? null : respuesta.json();
}

// --- Programa ----------------------------------------------------------------
cargarEnvLocal();

const args = process.argv.slice(2);
const bajar = args.includes("--bajar");
const marcar = args.includes("--marcar");
const todas = args.includes("--todas");
const iDestino = args.indexOf("--destino");
const destino = iDestino !== -1 ? resolve(args[iDestino + 1]) : DESTINO_POR_DEFECTO;

const filtro = todas ? "" : "&estado=eq.nueva";
const filas = await consultar(
  `solicitudes_auditoria?select=*${filtro}&order=creada_en.asc`
);

if (filas.length === 0) {
  console.log(todas ? "No hay ninguna solicitud." : "No hay solicitudes nuevas.");
  process.exit(0);
}

console.log(`${filas.length} solicitud(es):\n`);
for (const fila of filas) {
  const contestadas = Object.keys(fila.respuestas ?? {}).length;
  console.log(
    `  ${fila.creada_en.slice(0, 10)}  ${fila.estado.padEnd(10)}  ` +
      `${contestadas}/36  ${fila.negocio} — ${fila.contacto_email}` +
      (fila.web ? `  (${fila.web})` : "")
  );
}

if (!bajar) {
  console.log("\nAñade --bajar para escribirlas en la carpeta entrada/ del kit.");
  process.exit(0);
}

mkdirSync(destino, { recursive: true });
console.log(`\nEscribiendo en ${destino}\n`);

for (const fila of filas) {
  const nombre = `${fila.creada_en.slice(0, 10)}-${aSlug(fila.negocio)}.md`;
  writeFileSync(join(destino, nombre), aMarkdown(fila), "utf8");
  console.log(`  ✓ ${nombre}`);

  if (marcar && fila.estado === "nueva") {
    await consultar(`solicitudes_auditoria?id=eq.${fila.id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ estado: "en_curso" }),
    });
  }
}

console.log(
  `\nListo. Abre el kit y dile a Claude "audita este formulario".` +
    (marcar ? "" : "\n(Con --marcar además pasan a estado en_curso y no vuelven a salir.)")
);
