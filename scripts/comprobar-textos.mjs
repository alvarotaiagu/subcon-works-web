/* Comprobación de la spec 003 «Posicionamiento y textos» (§7), plan PD-4.

   Dos partes:
   · FICHEROS (sin navegador): lee `src/**` (.ts, .tsx, .css; sin *.test.ts y sin comentarios),
     `README.md` (sin el bloque `<!-- 003-anclas -->` … `<!-- /003-anclas -->`), `textos.md` y
     `out/` (los .js y .txt). Para CA-1, 2, 3, 4, 10, 12 y 16.
   · PÁGINA (Playwright, con JavaScript desactivado): abre cada `.html` de `out/` servido con
     `crearServidor` y lee el texto visible y los metadatos. Para CA-5, 6, 7, 8 y 17. Sin JS la
     web se lee entera y no hay nada animado que pintar.

   Cada comprobación: { id, tarea, pendiente, fn }. Imprime OK, FALLO o PENDIENTE por línea.
   Sale con 1 si hay algún FALLO; con --estricto, también si queda algún PENDIENTE.
   Cada tarea pone `pendiente: false` en las suyas y las hace pasar; no cambia las de otra ni
   reordena la lista (plan §5). El `id` empieza por el CA («CA-4 · … · T06»), así que --solo
   vale con el CA o con la tarea.

   npm run build && npm run comprobar-textos
   npm run comprobar-textos -- --solo T06       → solo las de la T06 (campo `tarea`)
   npm run comprobar-textos -- --solo CA-4      → las que lleven «CA-4» en el id
   npm run comprobar-textos -- --solo T06,CA-1  → varias
   npm run comprobar-textos -- --puerto 4305    → otro puerto (por defecto 4303; en la oleada 7
                                                  corren cuatro chats a la vez y no lo comparten)
   npm run comprobar-textos -- --estricto       → un PENDIENTE también cuenta como fallo
   npm run comprobar-textos -- --forzar --solo T06
                                                → lanza también las pendientes, para escribirlas
                                                  (no vale para el «Hecho»)

   Normaliza a minúsculas y sin tildes, y colapsa espacios y saltos de línea. Si `out/` es más
   viejo que el fichero más nuevo de `src/`, sale con «FALLO · build viejo» sin probar nada.
   Navegador: uno solo, que se cierra en `finally`; 1280×800, escala 1, movimiento reducido,
   sin capturas. Antes de lanzarlo mira si hay otro `chrome-headless-shell.exe` en marcha y,
   si lo hay, espera (regla de `WEBS NEGOCIOS/CLAUDE.md`).

   Marcas del HTML (plan PD-5): `data-ejemplo` (maqueta o chat rotulado «Ejemplo»),
   `data-numeracion` (cotas, 01-07, P1-P36, 404) y `data-aviso-inventadas` (aviso de negocios
   inventados). T01 solo pone `data-numeracion` en `ui/Cota.tsx`; el resto, cada tarea en lo suyo.
*/
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { argumento, crearServidor, RAIZ_POR_DEFECTO } from "./servir.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SPEC = "specs/003-posicionamiento-y-textos";
const PUERTO_POR_DEFECTO = 4303;

// ─── Listas (arriba, cada entrada con su id del Anexo o su motivo) ─────────────
// T01 las deja con lo que ya se sabe; T05 completa NOMBRES, CIFRAS y DIAGNOSTICO_PERMITIDO.

/**
 * CA-3 · Frases de nivel C (spec §3.2, Anexo A): 0 apariciones. Sin tildes y en minúscula.
 * `patron` sustituye a `frase` cuando una cadena suelta daría falsos positivos; `soloSrc`
 * limita la búsqueda a `src/` (en `out/**` hay código de React que dice «video»).
 */
const FRASES_C = [
  { id: "A19", frase: "queda vigilada cada dia" },
  { id: "A19", frase: "vigilada cada dia" },
  { id: "A19", frase: "vigilancia de caidas" },
  { id: "A19", frase: "avisos de caducidad" },
  { id: "A19", frase: "resumen cada semana" },
  { id: "A19", frase: "la alerta nos llega" },
  { id: "A20", frase: "auditoria de la ficha" },
  { id: "A14", frase: "al telefono" },
  { id: "A16", frase: "factura emitida" },
  { id: "A21", frase: "video (como servicio)", patron: /(?<![<\/\w.-])video(?![\w-])/, soloSrc: true },
];

/**
 * CA-2 · Excepciones a «sin vigilancia ni ficha de Google»: `{ fichero, motivo }`, el fichero
 * relativo a la raíz del repo y con «/». Vacía. Una excepción nueva lleva motivo y la ve T12.
 */
const EXCEPCIONES_VIGILANCIA = [];

/** CA-16 · Excepciones a «sin reclamos de condición»: `{ fichero, motivo }`. Vacía. */
const EXCEPCIONES_CONDICIONES = [];

/** CA-2 · La 004 (vigilancia y ficha de Google) pone esto en `true` al terminar; entonces CA-2 no se aplica. */
const VIGILANCIA_EXISTE = false;

/**
 * CA-5 · Un nombre por producto: `{ producto, nombre, viejos: [..], anexo }`. Lo llena T05 con
 * lo aprobado (D-033, P-11). `viejos` = nombres que no pueden salir (los descriptivos no entran).
 */
const NOMBRES = [
  { producto: "Plataforma de tiendas", nombre: "Tienda online", viejos: ["Plataforma de tiendas"], anexo: "A01" },
  { producto: "Informe de mejoras", nombre: "Informe de mejoras de tu web", viejos: [], anexo: "A03" },
  { producto: "Formulario de contacto", nombre: "Formulario de contacto", viejos: ["Formularios de contacto propios"], anexo: "A29" },
  { producto: "Asistente de la web", nombre: "Asistente en tu web", viejos: [], anexo: "A11" },
  // Puerta 1 · «Propuesta para tu negocio»: en la web sale como botón, «Pedir una propuesta».
  {
    producto: "Puerta 1 · formulario corto",
    nombre: "Pedir una propuesta",
    viejos: ["Solicitar diagnóstico", "diagnóstico gratuito"],
    anexo: "A30",
  },
  { producto: "Puerta 2 · diagnóstico rápido", nombre: "Diagnóstico rápido", viejos: ["Diagnóstico rápido · un minuto"], anexo: "A95" },
  {
    producto: "Puerta 3 · auditoría",
    nombre: "Auditoría de tu negocio",
    viejos: ["Auditoría gratuita", "Auditoría gratis", "Auditoría completa"],
    anexo: "A34",
  },
];

/**
 * CA-8 · Cifras permitidas: `{ texto, anexo, magnitud? }`. `{n}` = cualquier número. Una entrada
 * sin `anexo` no vale. Una misma `magnitud` (p. ej. «tiempo-formulario») tiene un solo valor en
 * todo el sitio. Las fechas legales (A10) también son entradas. Lo llena T05.
 */
const CIFRAS = [
  // Recuentos que salen de los datos
  { texto: "{n} plantillas", anexo: "A05", magnitud: "plantillas" },
  { texto: "{n} de {n}", anexo: "A05" }, // recuento filtrado de /plantillas/
  { texto: "{n} preguntas", anexo: "A38", magnitud: "preguntas-auditoria" },
  { texto: "{n} contestadas", anexo: "A38" },
  { texto: "nos han llegado {n} de las {n} respuestas", anexo: "A38" },
  // Interfaz y contacto
  { texto: "© {n}", anexo: "A77" },
  { texto: "dos versiones de la misma web", anexo: "A77" }, // `Mando`, solo con ?revision
  { texto: "alvarot2601@gmail.com", anexo: "A44" },
  // Legales y procedimiento
  { texto: "articulo 6.1.b del rgpd", anexo: "A74" },
  { texto: "cada tres meses", anexo: "A75", magnitud: "repaso-datos" },
  { texto: "real decreto 933/2021", anexo: "A47" },
  { texto: "redirecciones 301", anexo: "A06" },
  // Recuentos de la propia web
  { texto: "cuatro lineas de trabajo", anexo: "A76" },
  { texto: "dos personas", anexo: "A76" },
  { texto: "dos sitios", anexo: "A44" },
  { texto: "dos formularios", anexo: "A44" },
  // Ejemplos fuera de maqueta
  { texto: "unas {n} llamadas a la semana", anexo: "A78" },
  { texto: "{n}: yo atiendo", anexo: "A78" },
  // «Uno», «dos» y «mitad» que no cuentan nada
  { texto: "en uno llegue al otro", anexo: "A22" },
  { texto: "el cliente elige uno", anexo: "A61" },
  { texto: "uno a uno", anexo: "A63" },
  { texto: "de cada uno", anexo: "A38" },
  { texto: "en cada uno", anexo: "A70" },
  { texto: "dos veces la misma noche", anexo: "A62" },
  { texto: "para los dos", anexo: "A47" },
  { texto: "en mitad de un tratamiento", anexo: "A11" },
  // Descripciones de las plantillas ficticias (`plantillas.ts`)
  { texto: "{n}/{n}/{n}/{n} dias", anexo: "A79" },
  { texto: "es la mitad, la otra mitad", anexo: "A79" },
  { texto: "3d", anexo: "A79" },
  { texto: "de los {n}° gris verdoso a los {n}° melocoton", anexo: "A79" },
  { texto: "{n} lomos", anexo: "A79" },
  { texto: "siete piezas", anexo: "A79" },
  { texto: "cinco pasos", anexo: "A79" },
  { texto: "cada viaje es uno", anexo: "A79" },
  { texto: "seis sellos", anexo: "A79" },
  { texto: "tres quilometros", anexo: "A79" },
  { texto: "cuatro colmenares", anexo: "A79" },
  { texto: "cuatro tarros", anexo: "A79" },
  { texto: "seis tramos", anexo: "A79" },
  { texto: "dos piezas", anexo: "A79" },
  { texto: "tres tamaños", anexo: "A79" },
  { texto: "cinco veces", anexo: "A79" },
  { texto: "doce simbolos", anexo: "A79" },
  { texto: "seis cortes", anexo: "A79" },
  { texto: "dos minutos", anexo: "A79" },
  { texto: "de {n}:{n} a {n}:{n}", anexo: "A79" },
  { texto: "ocho pasos", anexo: "A79" },
];

/**
 * CA-17 · Dónde «diagnóstico» sí puede salir (el diagnóstico rápido, D-001):
 * `{ ruta, selector?, motivo }`. Sin `selector`, vale toda la página. Lo llena T05.
 */
const DIAGNOSTICO_PERMITIDO = [
  { ruta: "", selector: '#contacto a[href$="/sectores/"]', motivo: "Puerta 2: el enlace «Diagnóstico rápido» del contacto" },
  { ruta: "sectores/", motivo: "Índice de sectores: cada página trae el diagnóstico rápido" },
  ...["sectores/clinicas-dentales/", "sectores/alojamientos-rurales/", "sectores/asesorias-y-despachos/"].map((ruta) => ({
    ruta,
    motivo: "Página de sector: el diagnóstico rápido, sus botones y su resultado (D-001)",
  })),
  { ruta: "auditoria/", motivo: "Aviso de respuestas que llegan «de tu diagnóstico rápido»" },
  { ruta: "privacidad/", motivo: "Explica qué guarda el diagnóstico rápido (A95)" },
];

/** CA-6 · Palabras de la spec §3.5 que sugieren clientes: 0 apariciones en el bloque de plantillas. */
const PALABRAS_CLIENTES = [
  "ultimos trabajos",
  "nuestros clientes",
  "casos de exito",
  "proyectos realizados",
  "para clientes como tu",
];

/**
 * CA-6 · Los tres bloques que enseñan webs de negocios inventados. `seccion` es el bloque
 * (su `<section>` o `main`), `tarjetas` cada web enseñada, `ruta` relativa a la raíz del export.
 * La tarea dueña ajusta el selector a su marcado.
 */
const BLOQUES_PLANTILLAS = [
  { grupo: "portada", tarea: "T07", rutas: [""], seccion: "#plantillas", tarjetas: "[data-foco-dentro]" },
  { grupo: "plantillas", tarea: "T08", rutas: ["plantillas/"], seccion: "main", tarjetas: "[data-foco-dentro]" },
  {
    grupo: "sector",
    tarea: "T09",
    rutas: ["sectores/clinicas-dentales/", "sectores/alojamientos-rurales/", "sectores/asesorias-y-despachos/"],
    seccion: "#plantillas-sector",
    tarjetas: "[data-foco-dentro]",
    // Sin plantillas válidas en el sector, el bloque no sale ni con título (P-01): no es un fallo.
    opcional: true,
  },
];

/**
 * CA-7 · Lista cerrada de lo que lleva rótulo «Ejemplo». `selector` elige la maqueta, el chat o
 * la captura; cada una tiene que estar dentro de un `[data-ejemplo]` que contenga la palabra
 * «Ejemplo». `minimo` = cuántas tiene que haber (0 = las que haya). `grupo` reparte entre tareas.
 */
const SECTORES_RUTAS = ["sectores/clinicas-dentales/", "sectores/alojamientos-rurales/", "sectores/asesorias-y-despachos/"];
const SELECTORES_EJEMPLO = [
  { grupo: "T06", que: "hero", ruta: "", selector: "[data-hero] .hero-ejemplos", minimo: 1 },
  { grupo: "T06", que: "capturas de /herramientas/", ruta: "herramientas/", selector: 'main img:not([alt=""])', minimo: 1 },
  { grupo: "T07", que: "maquetas de «Tecnología aplicada»", ruta: "", selector: "#soluciones .maqueta", minimo: 1 },
  ...SECTORES_RUTAS.map((ruta) => ({ grupo: "T09", que: "ChatEjemplo", ruta, selector: "#asistente", minimo: 1 })),
  ...SECTORES_RUTAS.map((ruta) => ({ grupo: "T09", que: "maquetas de sector", ruta, selector: "main .maqueta", minimo: 0 })),
];

/** CA-4 · Quién es dueño de cada fichero (plan §5): las filas de `textos.md` se reparten así. */
const DUENOS = {
  T06: [
    "src/content/servicios.ts",
    "src/content/hero.ts",
    "src/content/hero.test.ts",
    "src/content/herramientas.ts",
    "src/app/herramientas/page.tsx",
    "src/components/sections/Hero.tsx",
    "src/components/sections/Servicios.tsx",
  ],
  T07: [
    "src/content/consultora.ts",
    "src/components/consultora/*",
    "src/content/portada.ts",
    "src/content/proceso.ts",
    "src/content/cifras.ts",
    "src/content/portada.test.ts",
    "src/components/sections/Proceso.tsx",
  ],
  T08: [
    "src/content/site.ts",
    "src/app/layout.tsx",
    "src/content/interiores.ts",
    "src/content/estudio.ts",
    "src/content/auditoria.ts",
    "src/content/plantillas.ts",
    "src/content/plantillas.test.ts",
    "src/app/auditoria/page.tsx",
    "src/app/estudio/page.tsx",
    "src/app/plantillas/page.tsx",
    "src/app/privacidad/page.tsx",
    "src/app/not-found.tsx",
    "src/components/layout/*",
    "src/components/auditoria/*",
    "src/components/plantillas/*",
    "src/components/ui/TarjetaPlantilla.tsx",
    "README.md",
  ],
  T09: [
    "src/content/sectores.ts",
    "src/content/diagnostico.ts",
    "src/content/sectores.test.ts",
    "src/content/diagnostico.reglas.test.ts",
    "src/app/sectores/**",
    "src/components/sectores/*",
    "src/components/diagnostico/*",
    "src/components/sections/DiagnosticoRapido.tsx",
  ],
};

/** CA-6 y CA-7: viewport único de las pruebas con navegador. */
const VIEWPORT = { width: 1280, height: 800 };

// ─── Utilidades ────────────────────────────────────────────────────────────────

/** Minúsculas, sin tildes, espacios y saltos de línea colapsados. */
const norm = (t) =>
  String(t)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Quita los comentarios (`//…` y `/* … *\/`), como `sinComentarios()` de `limpieza.test.ts`. */
const sinComentarios = (t) =>
  t.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " ")).replace(/(?<!:)\/\/[^\n]*/g, "");

/** Traduce `src/a/*`, `src/a/**` o un fichero suelto a RegExp (con «/»). */
function globARegExp(g) {
  const re = esc(g).replace(/\\\*\\\*/g, "\u0000").replace(/\\\*/g, "[^/]*").replace(/\u0000/g, ".*");
  return new RegExp(`^${re}$`);
}

const rel = (f) => path.relative(REPO, f).split(path.sep).join("/");

function recorrer(dir, filtro) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? recorrer(p, filtro) : filtro(p) ? [p] : [];
  });
}

const ficherosSrc = () => recorrer(path.join(REPO, "src"), (f) => /\.(ts|tsx|css)$/.test(f) && !/\.test\.ts$/.test(f));
const ficherosOut = (ext) => recorrer(path.join(REPO, "out"), (f) => ext.test(f));

/** El texto de un fichero tal como lo comprueba cada CA: sin comentarios (código) o sin el bloque de anclas (README). */
function textoDe(fichero) {
  const crudo = fs.readFileSync(path.join(REPO, fichero), "utf8");
  if (fichero === "README.md") return crudo.replace(/<!--\s*003-anclas\s*-->[\s\S]*?<!--\s*\/003-anclas\s*-->/g, "");
  if (/\.(ts|tsx|css)$/.test(fichero)) return sinComentarios(crudo);
  return crudo;
}

/** El mismo texto, dejando las cadenas de JS como las vería el lector (`\"`, `\'`, `\n`, `{" "}`). */
const comoSeLee = (t) =>
  t
    .replace(/\{\s*(["'`])\s*\1\s*\}/g, " ")
    .replace(/\\(["'`])/g, "$1")
    .replace(/\\n/g, " ");

/** Los ficheros que miran CA-1, 2, 3 y 16: `src/`, README sin anclas y `out/**\/*.{js,txt}`. */
function corpus() {
  const lista = [...ficherosSrc().map(rel)];
  if (fs.existsSync(path.join(REPO, "README.md"))) lista.push("README.md");
  lista.push(...ficherosOut(/\.(js|txt)$/).map(rel));
  return lista.map((fichero) => ({ fichero, texto: norm(comoSeLee(textoDe(fichero))), esSrc: fichero.startsWith("src/") }));
}

function validarExcepciones(lista, nombre) {
  for (const e of lista) {
    if (!e.fichero || !e.motivo) throw new Error(`${nombre}: cada excepción lleva fichero y motivo (${JSON.stringify(e)})`);
  }
}

/** Todas las apariciones de `re` en el corpus, menos las de ficheros con excepción: «fichero · …contexto…». */
function apariciones(ficheros, re, excepciones = [], { soloSrc = false } = {}) {
  validarExcepciones(excepciones, "excepciones");
  const libres = new Set(excepciones.map((e) => e.fichero));
  const global = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  const res = [];
  for (const f of ficheros) {
    if (libres.has(f.fichero) || (soloSrc && !f.esSrc)) continue;
    for (const m of f.texto.matchAll(global)) {
      const ctx = f.texto.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30);
      res.push(`${f.fichero} · …${ctx}…`);
    }
  }
  return res;
}

const lista = (xs) => "\n" + xs.slice(0, 20).map((x) => "  " + x).join("\n") + (xs.length > 20 ? `\n  … y ${xs.length - 20} más` : "");

function exigirVacio(xs, que) {
  if (xs.length) throw new Error(`${que}: ${xs.length} aparición(es)${lista(xs)}`);
}

function exigirLista(valor, nombre) {
  if (!valor.length) throw new Error(`${nombre} está vacía: la llena T05 con lo aprobado`);
}

// ─── textos.md ─────────────────────────────────────────────────────────────────

/**
 * Lee las tablas de `textos.md` (plan PD-3): una por ruta (`## /`, `## /herramientas/`, `## *`,
 * `## README`), con columnas ruta · fichero · identificador · texto actual · texto nuevo ·
 * motivo · estado. Un `|` dentro de un texto va como `\|`.
 */
function leerTextos() {
  const f = path.join(REPO, SPEC, "textos.md");
  if (!fs.existsSync(f)) throw new Error(`No existe ${SPEC}/textos.md (lo escribe T04)`);
  const tablas = [];
  let actual = null;
  for (const linea of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const h = /^##\s+(.+?)\s*$/.exec(linea);
    if (h) {
      actual = { ruta: h[1].replace(/^`|`$/g, ""), filas: [] };
      tablas.push(actual);
      continue;
    }
    if (!actual || !linea.trim().startsWith("|")) continue;
    const celdas = linea
      .trim()
      .replace(/^\||\|$/g, "")
      .split(/(?<!\\)\|/)
      .map((c) => c.trim().replace(/\\\|/g, "|").replace(/^`|`$/g, ""));
    if (celdas.every((c) => /^:?-{2,}:?$/.test(c))) continue; // separador
    if (celdas.length < 7 || /^ruta$/i.test(celdas[0])) continue; // cabecera o fila rota
    const [ruta, fichero, id, actualTxt, nuevo, motivo, estado] = celdas;
    actual.filas.push({ ruta, fichero, id, actual: actualTxt, nuevo, motivo, estado: norm(estado) });
  }
  return tablas;
}

const APROBADA = new Set(["aprobada", "corregida"]);

/**
 * `{n}` es una variable: un número cualquiera o, en el código, la expresión que la pinta
 * (`{plantillas.length}`, `${descripcion}`, `{datos.nombre}`); lo demás se compara tal cual,
 * normalizado.
 */
function regExpDeTexto(t) {
  return new RegExp(
    norm(t)
      .split(/\{n\}/)
      .map(esc)
      .join("(?:[\\d.,]+|\\$?\\{[^{}]+\\})"),
  );
}

/** CA-4 · Cada fila aprobada de los ficheros de `tarea` está en su fichero. */
function filasEnFichero(tarea) {
  const dueno = DUENOS[tarea].map(globARegExp);
  const malas = [];
  let comprobadas = 0;
  for (const tabla of leerTextos()) {
    for (const fila of tabla.filas) {
      if (!dueno.some((re) => re.test(fila.fichero)) || !APROBADA.has(fila.estado)) continue;
      comprobadas++;
      if (!fs.existsSync(path.join(REPO, fila.fichero))) {
        malas.push(`${tabla.ruta} · ${fila.fichero} · ${fila.id}: el fichero no existe`);
        continue;
      }
      const texto = norm(comoSeLee(textoDe(fila.fichero)));
      const quitar = fila.nuevo === "(quitar)";
      const buscado = fila.nuevo === "(igual)" || quitar ? fila.actual : fila.nuevo;
      const esta = regExpDeTexto(buscado).test(texto);
      if (quitar ? esta : !esta) {
        malas.push(`${tabla.ruta} · ${fila.fichero} · ${fila.id}: ${quitar ? "sigue estando" : "no está"} «${buscado.slice(0, 70)}»`);
      }
    }
  }
  if (malas.length) throw new Error(`${malas.length} fila(s) aprobada(s) que no cuadran con el fichero${lista(malas)}`);
  return `${comprobadas} fila(s) aprobada(s) comprobadas`;
}

// ─── Parte de página (Playwright, JS desactivado) ──────────────────────────────

/** `out/**\/*.html` como ruta de la web («», «plantillas/»…). `404/` y `_not-found/` son copias de 404.html. */
function paginasDelExport() {
  return ficherosOut(/\.html$/)
    .map((f) => path.relative(path.join(REPO, "out"), f).split(path.sep).join("/"))
    .filter((f) => !/^(404|_not-found)\//.test(f))
    .map((f) => (f === "index.html" ? "" : f === "404.html" ? "404.html" : f.replace(/index\.html$/, "")))
    .sort();
}

/** Texto visible (nodos de texto de elementos visibles) fuera de lo que se excluye, más los metadatos. La página ya está abierta. */
async function leerPagina(page, { excluir = "" } = {}) {
  return page.evaluate((excluir) => {
    const visibles = [];
    const andador = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = andador.nextNode(); n; n = andador.nextNode()) {
      const el = n.parentElement;
      if (!el || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) continue;
      if (excluir && el.closest(excluir)) continue;
      if (!el.checkVisibility({ visibilityProperty: true })) continue;
      const t = n.textContent.replace(/\s+/g, " ").trim();
      if (t) visibles.push(t);
    }
    const meta = [document.title];
    for (const m of document.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')) {
      meta.push(m.getAttribute("content") || "");
    }
    for (const e of document.querySelectorAll("[alt], [aria-label]")) {
      meta.push(e.getAttribute("alt") || "", e.getAttribute("aria-label") || "");
    }
    return { visible: visibles.join(" "), meta: meta.filter(Boolean).join(" · ") };
  }, excluir);
}

const urlDe = (base, ruta) => new URL(ruta, base).href;

/** CA-6 · El aviso de inventadas está en la misma `<section>` que las webs enseñadas, sin las palabras de §3.5. */
function avisoDeInventadas(grupo) {
  return async (h) => {
    const bloque = BLOQUES_PLANTILLAS.find((b) => b.grupo === grupo);
    const malas = [];
    const omitidas = [];
    for (const ruta of bloque.rutas) {
      const r = await h.pagina(ruta, async (page) =>
        page.evaluate(
          ({ seccion, tarjetas, palabras, opcional }) => {
            const norm = (t) =>
              t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
            const region = document.querySelector(seccion);
            if (!region) return opcional ? { omitida: true } : { fallo: `no hay «${seccion}»` };
            const aviso = region.querySelector("[data-aviso-inventadas]");
            if (!aviso) return { fallo: "falta [data-aviso-inventadas] dentro del bloque" };
            const cards = [...region.querySelectorAll(tarjetas)];
            if (!cards.length) return { fallo: `no hay webs enseñadas («${tarjetas}»)` };
            const sec = aviso.closest("section");
            if (!sec) return { fallo: "el aviso no está dentro de ninguna <section>" };
            const fuera = cards.filter((c) => c.closest("section") !== sec).length;
            if (fuera) return { fallo: `${fuera} web(s) enseñada(s) fuera de la <section> del aviso` };
            const texto = norm(region.textContent || "");
            const dichas = palabras.filter((p) => texto.includes(p));
            if (dichas.length) return { fallo: `palabras de §3.5: ${dichas.join(", ")}` };
            return { fallo: "" };
          },
          { seccion: bloque.seccion, tarjetas: bloque.tarjetas, palabras: PALABRAS_CLIENTES, opcional: !!bloque.opcional },
        ),
      );
      if (r.omitida) omitidas.push(`/${ruta}`);
      else if (r.fallo) malas.push(`/${ruta}: ${r.fallo}`);
    }
    if (malas.length) throw new Error(lista(malas));
    if (omitidas.length) return `sin bloque de plantillas en ${omitidas.join(", ")}`;
  };
}

/** CA-7 · Lo de la lista cerrada de `grupo` lleva `data-ejemplo` con la palabra «Ejemplo» dentro. */
function rotuloEjemplo(...grupos) {
  return async (h) => {
    const malas = [];
    for (const s of SELECTORES_EJEMPLO.filter((x) => grupos.includes(x.grupo))) {
      const r = await h.pagina(s.ruta, async (page) =>
        page.evaluate(({ selector, minimo }) => {
          const els = [...document.querySelectorAll(selector)];
          if (els.length < minimo) return `hay ${els.length} y tiene que haber ${minimo} o más`;
          const sin = els.filter((e) => {
            const marca = e.closest("[data-ejemplo]");
            return !marca || !/ejemplo/i.test(marca.textContent || "");
          }).length;
          return sin ? `${sin} de ${els.length} sin [data-ejemplo] con el rótulo «Ejemplo»` : "";
        }, s),
      );
      if (r) malas.push(`${s.que} · /${s.ruta} · ${s.selector}: ${r}`);
    }
    if (malas.length) throw new Error(lista(malas));
  };
}

const PALABRAS_CIFRA = [
  "uno",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
  "once",
  "doce",
  "quince",
  "veinte",
  "treinta",
  "cien",
  "mil",
  "mitad",
  "gratis",
  "gratuito",
  "gratuita",
];
const RE_CIFRA = new RegExp(`\\d[\\d.,]*|(?<![\\p{L}\\d])(?:${PALABRAS_CIFRA.join("|")})(?![\\p{L}\\d])`, "gu");

// ─── Comprobaciones ────────────────────────────────────────────────────────────

const comprobaciones = [
  {
    id: "CA-1 · Ni «herramienta propia» ni «software propio»",
    tarea: "T10",
    pendiente: true,
    fn: async () => {
      const malas = apariciones(corpus(), /herramientas? propias?|software propio/);
      exigirVacio(malas, "Frases de CA-1");
    },
  },
  {
    id: "CA-2 · Sin vigilancia ni ficha de Google (salvo excepciones)",
    tarea: "T10",
    pendiente: true,
    fn: async () => {
      if (VIGILANCIA_EXISTE) return "VIGILANCIA_EXISTE = true: CA-2 no se aplica (la 004 la dio por hecha)";
      const malas = apariciones(
        corpus(),
        /vigilancia|vigilada|auditoria de la ficha|#vigilancia|#ficha-google/,
        EXCEPCIONES_VIGILANCIA,
      );
      exigirVacio(malas, "Vigilancia / ficha de Google");
      return `${EXCEPCIONES_VIGILANCIA.length} excepción(es)`;
    },
  },
  {
    id: "CA-3 · Frases de nivel C: 0",
    tarea: "T10",
    pendiente: true,
    fn: async () => {
      const ficheros = corpus();
      const malas = FRASES_C.flatMap((c) => {
        if (!c.id) throw new Error(`FRASES_C: «${c.frase}» sin id del Anexo`);
        const re = c.patron ?? new RegExp(esc(c.frase));
        return apariciones(ficheros, re, [], { soloSrc: !!c.soloSrc }).map((x) => `${c.id} «${c.frase}» · ${x}`);
      });
      exigirVacio(malas, "Frases de nivel C");
      return `${FRASES_C.length} frases; las paráfrasis las lee Álvaro (CA-13)`;
    },
  },
  ...["T06", "T07", "T08", "T09"].map((tarea) => ({
    id: `CA-4 · Filas aprobadas en su fichero · ficheros de ${tarea}`,
    tarea,
    pendiente: tarea !== "T07", // T07 hecha; T06, T08 y T09 ponen la suya al terminar
    fn: async () => filasEnFichero(tarea),
  })),
  {
    id: "CA-4 · Ninguna fila de textos.md sin aprobar",
    tarea: "T05",
    pendiente: false,
    fn: async () => {
      const sin = leerTextos().flatMap((t) =>
        t.filas.filter((f) => !APROBADA.has(f.estado)).map((f) => `${t.ruta} · ${f.fichero} · ${f.id}: estado «${f.estado || "vacío"}»`),
      );
      exigirVacio(sin, "Filas sin aprobar");
    },
  },
  {
    id: "CA-5 · Un nombre por producto; nombres viejos: 0",
    tarea: "T10",
    pendiente: true,
    fn: async (h) => {
      exigirLista(NOMBRES, "NOMBRES");
      const textos = [];
      for (const ruta of paginasDelExport()) {
        const p = await h.pagina(ruta, (page) => leerPagina(page));
        textos.push({ donde: `/${ruta}`, texto: norm(`${p.visible} ${p.meta}`) });
      }
      if (fs.existsSync(path.join(REPO, "README.md"))) textos.push({ donde: "README.md", texto: norm(textoDe("README.md")) });
      const malas = [];
      for (const n of NOMBRES) {
        if (!n.nombre || !n.anexo) throw new Error(`NOMBRES: «${n.producto}» sin nombre o sin id del Anexo`);
        if (!textos.some((t) => t.texto.includes(norm(n.nombre)))) malas.push(`${n.producto}: «${n.nombre}» no sale en ninguna parte`);
        for (const viejo of n.viejos ?? []) {
          for (const t of textos.filter((x) => x.texto.includes(norm(viejo)))) malas.push(`${n.producto}: «${viejo}» sigue en ${t.donde}`);
        }
      }
      exigirVacio(malas, "Nombres");
    },
  },
  {
    id: "CA-6 · Aviso de inventadas en su <section> y sin palabras de §3.5 · portada",
    tarea: "T07",
    pendiente: false,
    fn: avisoDeInventadas("portada"),
  },
  {
    id: "CA-6 · … · /plantillas/",
    tarea: "T08",
    pendiente: true,
    fn: avisoDeInventadas("plantillas"),
  },
  {
    id: "CA-6 · … · PlantillasSector",
    tarea: "T09",
    pendiente: true,
    fn: avisoDeInventadas("sector"),
  },
  {
    id: "CA-7 · Rótulo «Ejemplo» · hero y /herramientas/",
    tarea: "T06",
    pendiente: true,
    fn: rotuloEjemplo("T06"),
  },
  {
    id: "CA-7 · … · «Tecnología aplicada»",
    tarea: "T07",
    pendiente: false,
    fn: rotuloEjemplo("T07"),
  },
  {
    id: "CA-7 · … · ChatEjemplo y maquetas de sector",
    tarea: "T09",
    pendiente: true,
    fn: rotuloEjemplo("T09"),
  },
  {
    id: "CA-8 · Toda cifra en CIFRAS, un valor por magnitud",
    tarea: "T10",
    pendiente: true,
    fn: async (h) => {
      exigirLista(CIFRAS, "CIFRAS");
      const sinAnexo = CIFRAS.filter((c) => !c.anexo);
      if (sinAnexo.length) throw new Error(`CIFRAS: entradas sin id del Anexo${lista(sinAnexo.map((c) => c.texto))}`);
      const entradas = CIFRAS.map((c) => ({ ...c, re: new RegExp(regExpDeTexto(c.texto).source, "g") }));
      const sueltas = [];
      const vistas = new Map(); // magnitud → textos de CIFRAS que salen en el sitio
      for (const ruta of paginasDelExport()) {
        const p = await h.pagina(ruta, (page) => leerPagina(page, { excluir: "[data-ejemplo], [data-numeracion]" }));
        const texto = norm(p.visible);
        const cubierto = new Array(texto.length).fill(false);
        for (const e of entradas) {
          for (const m of texto.matchAll(e.re)) {
            cubierto.fill(true, m.index, m.index + m[0].length);
            if (e.magnitud) vistas.set(e.magnitud, new Set([...(vistas.get(e.magnitud) ?? []), e.texto]));
          }
        }
        for (const m of texto.matchAll(RE_CIFRA)) {
          if (!cubierto[m.index]) sueltas.push(`/${ruta} · …${texto.slice(Math.max(0, m.index - 25), m.index + m[0].length + 25)}…`);
        }
      }
      exigirVacio(sueltas, "Cifras sin entrada en CIFRAS");
      const dobles = [...vistas].filter(([, v]) => v.size > 1).map(([mag, v]) => `${mag}: ${[...v].map((x) => `«${x}»`).join(" y ")}`);
      exigirVacio(dobles, "Magnitudes con más de un valor");
    },
  },
  {
    id: "CA-10 · Lint, tests y build; nada peor que la línea base",
    tarea: "T10",
    pendiente: true,
    fn: async () => {
      // Solo lint, tests y build (los tres estaban en OK en la línea base). `comprobar` y
      // `comprobar-consultora` tardan minutos y T10 las compara a mano con linea-base.md.
      // `npm.cmd` en Windows exige shell.
      const npm = process.platform === "win32" ? "npm.cmd" : "npm";
      const malas = [];
      for (const orden of [["run", "lint"], ["test"], ["run", "build"]]) {
        try {
          execFileSync(npm, orden, { cwd: REPO, stdio: "pipe", shell: process.platform === "win32" });
        } catch (e) {
          malas.push(`npm ${orden.join(" ")} sale con ${e.status ?? "error"}`);
        }
      }
      exigirVacio(malas, "En la línea base los tres estaban en OK");
    },
  },
  {
    id: "CA-12 · Una tabla por ruta del export y filas *; ninguna sin estado",
    tarea: "T05",
    pendiente: false,
    fn: async () => {
      const tablas = leerTextos();
      const nombre = (t) => t.ruta.replace(/^\/+|\/+$/g, "");
      const malas = [];
      for (const ruta of paginasDelExport()) {
        const quiere = ruta.replace(/\/$/, "").replace(/\.html$/, "");
        const t = tablas.find((x) => nombre(x) === quiere || (quiere === "404" && /^\/?404(\.html)?$/.test(x.ruta)));
        if (!t) malas.push(`falta la tabla de «/${ruta}»`);
        else if (!t.filas.length) malas.push(`la tabla de «/${ruta}» no tiene filas`);
      }
      const comun = tablas.find((t) => t.ruta === "*");
      if (!comun?.filas.length) malas.push("faltan las filas «*» (lo común: menú, pie, cookies)");
      for (const t of tablas) for (const f of t.filas) if (!f.estado) malas.push(`${t.ruta} · ${f.fichero} · ${f.id}: sin estado`);
      exigirVacio(malas, "textos.md");
    },
  },
  {
    id: "CA-16 · Sin reclamos de condición",
    tarea: "T10",
    pendiente: true,
    fn: async () => {
      const malas = apariciones(
        corpus(),
        /sin compromiso|sin coste|sin cuotas?|sin permanencia|no paga cuota/,
        EXCEPCIONES_CONDICIONES,
      );
      exigirVacio(malas, "Reclamos de condición");
      return `${EXCEPCIONES_CONDICIONES.length} excepción(es)`;
    },
  },
  {
    id: "CA-17 · «Diagnóstico» solo en el diagnóstico rápido",
    tarea: "T10",
    pendiente: true,
    fn: async (h) => {
      exigirLista(DIAGNOSTICO_PERMITIDO, "DIAGNOSTICO_PERMITIDO");
      const malas = [];
      for (const ruta of paginasDelExport()) {
        const permitidos = DIAGNOSTICO_PERMITIDO.filter((d) => d.ruta === ruta || d.ruta === `/${ruta}`);
        if (permitidos.some((d) => !d.selector)) continue;
        const excluir = permitidos.map((d) => d.selector).join(", ");
        const p = await h.pagina(ruta, (page) => leerPagina(page, { excluir }));
        const texto = norm(`${p.visible} · ${p.meta}`);
        for (const m of texto.matchAll(/diagnostic\w*/g)) {
          malas.push(`/${ruta} · …${texto.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30)}…`);
        }
      }
      exigirVacio(malas, "«Diagnóstico» fuera del diagnóstico rápido");
    },
  },
];

// ─── Ejecución ─────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const puerto = Number(argumento(argv, "puerto", PUERTO_POR_DEFECTO));
const solo = argumento(argv, "solo", null);
const estricto = argv.includes("--estricto");
const forzar = argv.includes("--forzar");

const filtros = solo ? solo.split(",").map((s) => s.trim()).filter(Boolean) : null;
/** `--solo T06` = la tarea; `--solo CA-1` = ese CA (no CA-10); lo demás, un trozo del id. */
const casa = (c, f) => c.tarea === f || (/^CA-\d+$/.test(f) ? c.id.startsWith(`${f} `) : c.id.includes(f));
const elegidas = filtros ? comprobaciones.filter((c) => filtros.some((f) => casa(c, f))) : comprobaciones;
if (!elegidas.length) {
  console.error(`Ninguna comprobación casa con --solo ${solo}`);
  process.exit(1);
}

/** Cuántos `chrome-headless-shell.exe` hay en marcha (regla de WEBS NEGOCIOS/CLAUDE.md). Fuera de Windows no se mira. */
function navegadoresEnMarcha() {
  if (process.platform !== "win32") return 0;
  try {
    const salida = execFileSync(
      "powershell.exe",
      ["-NoProfile", "-Command", "(Get-CimInstance Win32_Process -Filter \"Name='chrome-headless-shell.exe'\" | Measure-Object).Count"],
      { encoding: "utf8" },
    );
    return Number(salida.trim()) || 0;
  } catch {
    return 0;
  }
}

/** Si `out/` es más viejo que el fichero más nuevo de `src/`, el build no es de este código. */
function buildViejo() {
  const indice = path.join(REPO, "out", "index.html");
  if (!fs.existsSync(indice)) return "no hay out/index.html: falta npm run build";
  const masNuevo = Math.max(...ficherosSrc().map((f) => fs.statSync(f).mtimeMs));
  return fs.statSync(indice).mtimeMs < masNuevo ? "out/ es más viejo que src/: falta npm run build" : "";
}

/** Las comprobaciones que necesitan navegador son las que reciben `h` (aridad 1). */
const usaNavegador = (c) => c.fn.length > 0;

const activas = elegidas.filter((c) => forzar || !c.pendiente);
let srv;
let nav;
let ctx;
let oks = 0;
let fallos = 0;
let pendientes = 0;
try {
  if (activas.length) {
    const viejo = buildViejo();
    if (viejo) {
      console.log(`FALLO      build viejo\n           ${viejo}`);
      fallos++;
      process.exitCode = 1;
      activas.length = 0;
    }
  }
  if (activas.some(usaNavegador)) {
    for (let i = 0; navegadoresEnMarcha() > 0; i++) {
      if (i === 0) console.log("Hay otro chrome-headless-shell en marcha (¿otra sesión?): espero a que acabe…");
      if (i >= 60) throw new Error("Sigue habiendo otro chrome-headless-shell tras 5 min: no lanzo el mío");
      await new Promise((r) => setTimeout(r, 5000));
    }
    srv = await crearServidor({ raiz: RAIZ_POR_DEFECTO, puerto });
    nav = await chromium.launch();
    ctx = await nav.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, reducedMotion: "reduce", javaScriptEnabled: false });
  }
  /** Ayudas para las comprobaciones de página: abre `ruta` (relativa a la raíz del export) en una pestaña nueva. */
  const h = {
    async pagina(ruta, fn) {
      const page = await ctx.newPage();
      try {
        await page.goto(urlDe(srv.url, ruta), { waitUntil: "load" });
        return await fn(page);
      } finally {
        await page.close();
      }
    },
  };
  for (const c of elegidas) {
    if (c.pendiente && !forzar) {
      pendientes++;
      console.log(`PENDIENTE  ${c.tarea}  ${c.id}`);
      continue;
    }
    if (!activas.includes(c)) continue; // build viejo: no se prueba nada
    const t = Date.now();
    try {
      const nota = await c.fn(h);
      oks++;
      console.log(`OK         ${c.tarea}  ${c.id}  (${((Date.now() - t) / 1000).toFixed(1)} s)${nota ? `\n           ${nota}` : ""}`);
    } catch (e) {
      fallos++;
      const msg = String(e.message).split("\n").slice(0, 14).join("\n           ");
      console.log(`FALLO      ${c.tarea}  ${c.id}\n           ${msg}`);
    }
    if (c.pendiente) pendientes++;
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (ctx) await ctx.close();
  if (nav) await nav.close();
  if (srv) await srv.cerrar();
}

console.log(`\n${oks} OK · ${fallos} FALLO · ${pendientes} PENDIENTE${estricto ? " (estricto)" : ""}`);
if (process.exitCode !== 1) process.exitCode = fallos || (estricto && pendientes) ? 1 : 0;
