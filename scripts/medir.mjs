/* Presupuesto de rendimiento (spec 002 §3.15). Parte de ../marina-spa-zafra-web/scripts/lcp.mjs:
   Playwright + CDP con iPhone 13, red 4G (150 ms, 1,6 Mbps), CPU ×4, caché vacía y mediana
   de 3 cargas en frío. Adaptaciones del §3.15:
   - Playwright del propio repo (devDependency) y `out/` servido con scripts/servir.mjs;
     antes de medir se mira el <title> (otro servidor podría tener el puerto);
   - el aviso de cookies se da por aceptado con la clave de AvisoCookies.tsx;
   - mide LCP (y su elemento), CLS (todas las entradas `layout-shift`, también las que
     tienen `hadRecentInput`), tareas largas tras `document.fonts.ready` y el peso de las
     letras (en `out/` y las que pide cada página);
   - en la portada, además (T19):
     - INP del instrumento con la Event Timing API: se tocan tres objetos y se arrastra el
       tirador 1 s con toques de CDP. INP = la interacción más lenta (con tan pocas, el
       percentil 98 es la máxima). Las entradas de menos de 16 ms no se registran;
     - CLS total = carga + 1 s de arrastre del tirador + scroll por el hero;
     - control de tareas largas: al final se lanza con `setTimeout` una tarea de 300 ms; si
       el observador no la ve, la cifra de tareas largas no vale y la medida falla;
   - rutas: portada con cortina y sin ella, /plantillas/ y /sectores/alojamientos-rurales/.
     Las cargas se intercalan (ruta 1, 2, 3, 4, ruta 1, 2…) para que un rato lento de la
     máquina no caiga entero en una sola ruta.

   Sale con 1 si una cifra pasa del tope del §3.15.

   npm run build && npm run medir
   npm run medir -- --puerto 4301 --veces 3
   npm run medir -- --base /subcon-works-web       (build con GITHUB_ACTIONS=true)
*/
import fs from "node:fs";
import path from "node:path";
import { chromium, devices } from "playwright";
import {
  argumento,
  CLAVE_COOKIES,
  CLAVE_CORTINA,
  comprobarTitulo,
  crearServidor,
  PUERTO_POR_DEFECTO,
  RAIZ_POR_DEFECTO,
} from "./servir.mjs";

const RUTAS = [
  { nombre: "Portada · con cortina", ruta: "", cortina: true, portada: true },
  { nombre: "Portada · sin cortina", ruta: "", cortina: false, portada: true },
  { nombre: "/plantillas/", ruta: "plantillas/", cortina: false },
  { nombre: "/sectores/alojamientos-rurales/", ruta: "sectores/alojamientos-rurales/", cortina: false },
];

/** Topes del §3.15. */
const TOPE = { lcp: 2500, cls: 0.05, inp: 200, larga: 200, letrasFicheros: 2, letrasBytes: 70 * 1024 };

/** Selectores del instrumento (los mismos que scripts/comprobar.mjs). */
const OBJETOS = '[data-hero] [aria-label="Lo que ve tu cliente"] button';
const TIRADOR = 'button[aria-label="Bajar la superficie para ver más instalación"]';
/** La tarea de control: dura esto y se busca una entrada `longtask` de al menos CONTROL_MIN. */
const CONTROL_MS = 300;
const CONTROL_MIN = 250;

const argv = process.argv.slice(2);
const puerto = Number(argumento(argv, "puerto", PUERTO_POR_DEFECTO));
const base = argumento(argv, "base", "");
const veces = Number(argumento(argv, "veces", 3));
if (!Number.isInteger(veces) || veces < 1) {
  console.error(`--veces tiene que ser un entero de 1 en adelante (llegó «${argumento(argv, "veces", 3)}»)`);
  process.exit(1);
}
const raiz = argumento(argv, "raiz", RAIZ_POR_DEFECTO);

/** Ficheros de letra en out/ (recorre todo). */
function letrasEnOut(dir) {
  const res = [];
  const recorrer = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) recorrer(p);
      else if (/\.(woff2?|ttf|otf)$/i.test(e.name)) res.push({ fichero: path.relative(dir, p), bytes: fs.statSync(p).size });
    }
  };
  recorrer(dir);
  return res;
}

/** El instrumento del hero: tocar tres objetos y arrastrar el tirador 1 s (con el dedo). */
async function tocarInstrumento(page, cdp) {
  const toque = (tipo, x, y) =>
    cdp.send("Input.dispatchTouchEvent", { type: tipo, touchPoints: tipo === "touchEnd" ? [] : [{ x, y }] });

  const objetos = page.locator(OBJETOS);
  const n = await objetos.count();
  if (n < 2) throw new Error(`hay ${n} objetos en el hero (se esperaban cuatro)`);
  // El pozo 1 ya está encendido al cargar: se tocan los demás, de uno en uno.
  for (let i = 1; i < Math.min(n, 4); i++) {
    await objetos.nth(i).tap();
    await page.waitForTimeout(600);
  }

  const caja = await page.locator(TIRADOR).boundingBox();
  if (!caja) throw new Error("no se ve el tirador");
  const cx = caja.x + caja.width / 2;
  const cy = caja.y + caja.height / 2;
  // Fotograma más largo durante el arrastre (rAF), además del INP de bajar y soltar el dedo,
  // y cuánto llega a subir la superficie (si no se mueve, el arrastre no ha medido nada).
  await page.evaluate(() => {
    const m = window.__medir;
    const sup = document.querySelector("[data-superficie]");
    const y = () => (sup ? sup.getBoundingClientRect().top : 0);
    const y0 = y();
    m.fotograma = 0;
    m.subida = 0;
    m.arrastrando = true;
    let antes = performance.now();
    const paso = (t) => {
      m.fotograma = Math.max(m.fotograma, t - antes);
      m.subida = Math.max(m.subida, y0 - y());
      antes = t;
      if (m.arrastrando) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  });
  await toque("touchStart", cx, cy);
  const t0 = Date.now();
  let i = 0;
  // 1 s de arrastre: sube hasta el tope (160 px) y vuelve a bajar.
  while (Date.now() - t0 < 1000) {
    const fase = ((Date.now() - t0) / 1000) * Math.PI * 2;
    await toque("touchMove", cx, cy - 90 * (1 - Math.cos(fase)));
    await page.waitForTimeout(16);
    i++;
  }
  await toque("touchEnd");
  const { fotograma, subida } = await page.evaluate(() => {
    const m = window.__medir;
    m.arrastrando = false;
    return { fotograma: Math.round(m.fotograma), subida: Math.round(m.subida) };
  });
  if (subida < 30) throw new Error(`arrastrando el tirador la superficie solo sube ${subida} px: el arrastre no ha medido nada`);
  // La vuelta a su sitio dura 0,65 s.
  await page.waitForTimeout(1000);
  return { movimientos: i, fotograma, subida };
}

async function medirUna(nav, url, { cortina, portada }) {
  const ctx = await nav.newContext({ ...devices["iPhone 13"] });
  await ctx.addInitScript(
    ({ cortina, claveCookies, claveCortina }) => {
      try {
        localStorage.setItem(claveCookies, new Date().toISOString());
        if (!cortina) sessionStorage.setItem(claveCortina, "1");
      } catch {}
      const m = (window.__medir = { lcp: [], cls: 0, largas: [], eventos: [], letrasListas: null, cortina: null });
      // ¿Salió la cortina? La pone el script del <head> antes de pintar (§3.14).
      document.addEventListener("DOMContentLoaded", () => (m.cortina = document.documentElement.classList.contains("cortina-si")), {
        once: true,
      });
      const describir = (el) => {
        if (!el) return null;
        const tag = el.tagName.toLowerCase();
        const clase = typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/)[0] : "";
        const enH1 = tag !== "h1" && el.closest("h1") ? "h1 > " : "";
        return enH1 + tag + (el.id ? "#" + el.id : "") + clase;
      };
      const observar = (tipo, fn, extra = {}) => {
        try {
          new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type: tipo, buffered: true, ...extra });
        } catch {}
      };
      observar("largest-contentful-paint", (e) =>
        m.lcp.push({
          t: Math.round(e.startTime),
          el: describir(e.element) || (e.url || "").split("/").pop(),
          enH1: !!(e.element && e.element.closest("h1")),
        }),
      );
      // §3.15: con `hadRecentInput` incluido (el arrastre del tirador también cuenta).
      observar("layout-shift", (e) => (m.cls += e.value));
      observar("longtask", (e) => m.largas.push({ inicio: e.startTime, duracion: e.duration }));
      // Event Timing: solo las interacciones (interactionId > 0), con el umbral mínimo.
      observar(
        "event",
        (e) => e.interactionId && m.eventos.push({ id: e.interactionId, tipo: e.name, duracion: e.duration }),
        { durationThreshold: 16 },
      );
      // «Tras document.fonts.ready»: pedido aquí, `fonts.ready` se resuelve antes de que se
      // pida ninguna letra. Vale la hora a la que termina de cargar la última (`loadingdone`).
      try {
        document.fonts.addEventListener("loadingdone", () => (m.letrasListas = performance.now()));
      } catch {}
    },
    { cortina, claveCookies: CLAVE_COOKIES, claveCortina: CLAVE_CORTINA },
  );
  const page = await ctx.newPage();
  const letras = [];
  let google = 0;
  page.on("request", (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) google++;
  });
  page.on("response", (r) => {
    if (r.request().resourceType() === "font") {
      letras.push({ url: r.url(), bytes: Number(r.headers()["content-length"] || 0) });
    }
  });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.goto(url, { waitUntil: "load", timeout: 90000 });
  // La cortina dura como mucho 3 s (§3.14); el LCP se fija con la primera entrada del
  // usuario, así que se lee antes de tocar nada.
  await page.waitForTimeout(cortina ? 8000 : 6500);
  const lcp = await page.evaluate(() => window.__medir.lcp.at(-1) ?? null);
  const conCortina = await page.evaluate(() => window.__medir.cortina);
  if (conCortina !== cortina) throw new Error(`${url}: se esperaba la cortina ${cortina ? "puesta" : "quitada"} y salió ${conCortina ? "puesta" : "quitada"}`);
  const clsCarga = await page.evaluate(() => window.__medir.cls);

  let instrumento = null;
  let clsArrastre = null;
  let clsTotal = null;
  let bajado = null;
  let inp = null;
  if (portada) {
    instrumento = await tocarInstrumento(page, cdp);
    clsArrastre = await page.evaluate(() => window.__medir.cls);
    // Scroll por el hero con la rueda (Lenis no se entera de scrollTo).
    await page.mouse.move(195, 400);
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 150);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(1200);
    clsTotal = await page.evaluate(() => window.__medir.cls);
    bajado = await page.evaluate(() => Math.round(window.scrollY));
    // Una interacción = varias entradas (pointerdown, pointerup, click…): manda la más larga.
    const eventos = await page.evaluate(() => window.__medir.eventos);
    const porInteraccion = new Map();
    for (const e of eventos) porInteraccion.set(e.id, Math.max(porInteraccion.get(e.id) ?? 0, e.duracion));
    inp = {
      ms: porInteraccion.size ? Math.max(...porInteraccion.values()) : null,
      interacciones: porInteraccion.size,
      peor: eventos.reduce((p, e) => (!p || e.duracion > p.duracion ? e : p), null)?.tipo ?? null,
    };
  }

  // Control: una tarea larga a propósito, lanzada con setTimeout. Si el observador no la ve,
  // el «ninguna tarea larga» no significa nada.
  const inicioControl = await page.evaluate(
    (ms) =>
      new Promise((ok) =>
        setTimeout(() => {
          const t = performance.now();
          while (performance.now() - t < ms) {}
          ok(t);
        }, 0),
      ),
    CONTROL_MS,
  );
  await page.waitForTimeout(500);

  const { largas, letrasListas } = await page.evaluate(() => ({
    largas: window.__medir.largas,
    letrasListas: window.__medir.letrasListas,
  }));
  const esControl = (l) => l.inicio <= inicioControl + 5 && l.inicio + l.duracion >= inicioControl + CONTROL_MIN;
  const control = largas.some((l) => esControl(l) && l.duracion >= CONTROL_MIN);
  const tras = letrasListas == null ? [] : largas.filter((l) => l.inicio >= letrasListas && !esControl(l));
  await ctx.close();
  return {
    lcp,
    clsCarga,
    clsArrastre,
    clsTotal,
    bajado,
    inp,
    instrumento,
    control,
    letrasListas: letrasListas != null,
    largaMax: tras.length ? Math.round(Math.max(...tras.map((l) => l.duracion))) : 0,
    largasMas200: tras.filter((l) => l.duracion > TOPE.larga).length,
    letrasPedidas: letras.length,
    bytesLetras: letras.reduce((s, l) => s + l.bytes, 0),
    google,
  };
}

const mediana = (xs) => {
  const v = xs.filter((x) => x != null).sort((a, b) => a - b);
  return v.length ? v[Math.floor(v.length / 2)] : null;
};
const kb = (b) => (b / 1024).toFixed(1).replace(".", ",") + " KB";
const seg = (ms) => (ms == null ? "—" : (ms / 1000).toFixed(2).replace(".", ",") + " s");
const num = (x, d = 3) => (x == null ? "—" : x.toFixed(d).replace(".", ","));

let srv;
let nav;
try {
  srv = await crearServidor({ raiz, puerto, base });
  const titulo = await comprobarTitulo(srv.url);
  console.log(`Midiendo «${titulo}» en ${srv.url} · iPhone 13, 4G, CPU ×4, mediana de ${veces}, cargas intercaladas\n`);
  nav = await chromium.launch();

  const resultados = RUTAS.map(() => []);
  for (let i = 0; i < veces; i++) {
    for (const [k, r] of RUTAS.entries()) resultados[k].push(await medirUna(nav, srv.url + r.ruta, r));
  }

  const fallos = [];
  const filas = RUTAS.map((r, k) => {
    const rs = resultados[k];
    const fila = {
      nombre: r.nombre,
      portada: !!r.portada,
      lcp: mediana(rs.map((x) => x.lcp?.t)),
      lcps: rs.map((x) => (x.lcp ? x.lcp.t + " ms" : "—")).join(", "),
      elementos: [...new Set(rs.map((x) => x.lcp?.el ?? "—"))].join(" | "),
      lcpEnH1: rs.every((x) => x.lcp?.enH1),
      clsCarga: mediana(rs.map((x) => x.clsCarga)),
      clsArrastre: r.portada ? mediana(rs.map((x) => x.clsArrastre)) : null,
      clsTotal: r.portada ? mediana(rs.map((x) => x.clsTotal)) : mediana(rs.map((x) => x.clsCarga)),
      clsTotalMax: Math.max(...rs.map((x) => (r.portada ? x.clsTotal : x.clsCarga))),
      bajado: r.portada ? mediana(rs.map((x) => x.bajado)) : null,
      inp: r.portada ? mediana(rs.map((x) => x.inp?.ms ?? 0)) : null,
      inpMax: r.portada ? Math.max(...rs.map((x) => x.inp?.ms ?? 0)) : null,
      inpDetalle: r.portada
        ? rs.map((x) => (x.inp?.ms == null ? "< 16" : `${x.inp.ms}`) + ` ms (${x.inp?.interacciones ?? 0} int.)`).join(", ")
        : null,
      fotograma: r.portada ? Math.max(...rs.map((x) => x.instrumento?.fotograma ?? 0)) : null,
      subida: r.portada ? Math.min(...rs.map((x) => x.instrumento?.subida ?? 0)) : null,
      largaMax: Math.max(...rs.map((x) => x.largaMax)),
      largas: rs.map((x) => x.largaMax).join(", "),
      largasMas200: Math.max(...rs.map((x) => x.largasMas200)),
      control: rs.every((x) => x.control),
      letrasListas: rs.every((x) => x.letrasListas),
      letras: `${rs[0].letrasPedidas} · ${kb(rs[0].bytesLetras)}`,
      google: Math.max(...rs.map((x) => x.google)),
    };
    console.log(`${r.nombre.padEnd(34)} LCP ${seg(fila.lcp)} (${fila.lcps}) · ${fila.elementos}`);

    if (fila.lcp == null || fila.lcp > TOPE.lcp) fallos.push(`LCP de ${r.nombre}: ${seg(fila.lcp)} (tope 2,5 s)`);
    if (r.portada && !fila.lcpEnH1) fallos.push(`el elemento LCP de ${r.nombre} no es el <h1> ni una de sus líneas: ${fila.elementos}`);
    if (fila.clsTotalMax > TOPE.cls) fallos.push(`CLS de ${r.nombre}: ${num(fila.clsTotalMax)} en la peor carga (tope 0,05)`);
    if (r.portada && fila.inpMax > TOPE.inp) fallos.push(`INP del instrumento (${r.nombre}): ${fila.inpMax} ms (tope 200 ms)`);
    if (fila.largasMas200) fallos.push(`${r.nombre}: ${fila.largasMas200} tareas largas de más de 200 ms tras fonts.ready (máx ${fila.largaMax} ms)`);
    if (!fila.control) fallos.push(`${r.nombre}: el observador no vio la tarea de control de ${CONTROL_MS} ms; las tareas largas no valen`);
    if (!fila.letrasListas) fallos.push(`${r.nombre}: no llegó a cargar ninguna letra (\`loadingdone\`); las tareas largas no valen`);
    if (fila.google) fallos.push(`${r.nombre}: ${fila.google} peticiones a Google Fonts`);
    return fila;
  });

  const enOut = letrasEnOut(raiz);
  const bytesOut = enOut.reduce((s, l) => s + l.bytes, 0);
  if (enOut.length > TOPE.letrasFicheros || bytesOut > TOPE.letrasBytes) {
    fallos.push(`letras en out/: ${enOut.length} ficheros · ${kb(bytesOut)} (tope 2 ficheros y 70 KB)`);
  }

  const portadas = filas.filter((f) => f.portada);
  console.log("\n| Medida | Ruta | Cifra | Tope |");
  console.log("|---|---|---|---|");
  for (const f of filas) {
    console.log(`| LCP (mediana) | ${f.nombre} | ${seg(f.lcp)} (${f.lcps}) · elemento: \`${f.elementos}\` | ≤ 2,5 s${f.portada ? ", en el `<h1>`" : ""} |`);
  }
  for (const f of portadas) {
    console.log(
      `| CLS (mediana) | ${f.nombre} | ${num(f.clsTotal)} en total: ${num(f.clsCarga)} carga · ${num(f.clsArrastre)} tras 1 s de arrastre del tirador · ${num(f.clsTotal)} tras el scroll por el hero (${f.bajado} px) | ≤ 0,05 |`,
    );
  }
  for (const f of filas.filter((f) => !f.portada)) console.log(`| CLS (mediana) | ${f.nombre} | ${num(f.clsTotal)} | ≤ 0,05 |`);
  for (const f of portadas) {
    console.log(
      `| INP del instrumento (3 toques a objetos + 1 s de arrastre) | ${f.nombre} | ${f.inp ? f.inp + " ms" : "< 16 ms"} (${f.inpDetalle}) · fotograma más largo arrastrando: ${f.fotograma} ms (la superficie sube ${f.subida} px) | ≤ 200 ms |`,
    );
  }
  for (const f of filas) {
    console.log(
      `| Tareas largas tras \`fonts.ready\` | ${f.nombre} | máx ${f.largaMax} ms (por carga: ${f.largas}) · ${f.largasMas200} de más de 200 ms · control con \`setTimeout\`: ${f.control ? "visto" : "NO visto"} | ninguna > 200 ms |`,
    );
  }
  for (const f of filas) {
    console.log(`| Letras pedidas | ${f.nombre} | ${f.letras}${f.google ? ` · ${f.google} peticiones a Google Fonts` : ""} | 2 · ≤ 70 KB |`);
  }
  console.log(`| Letras en \`out/\` | — | ${enOut.length} ficheros · ${kb(bytesOut)} | 2 · ≤ 70 KB |`);

  if (fallos.length) {
    console.log(`\nFuera del tope (§3.15):\n- ${fallos.join("\n- ")}`);
    process.exitCode = 1;
  } else {
    console.log("\nTodas las cifras dentro del tope del §3.15.");
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (nav) await nav.close();
  if (srv) await srv.cerrar();
}
