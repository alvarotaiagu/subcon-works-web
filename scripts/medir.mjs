/* Presupuesto de rendimiento (spec 002 §3.15). Parte de ../marina-spa-zafra-web/scripts/lcp.mjs:
   Playwright + CDP con iPhone 13, red 4G (150 ms, 1,6 Mbps), CPU ×4, caché vacía y mediana
   de 3 cargas en frío. Adaptaciones del §3.15:
   - Playwright del propio repo (devDependency) y `out/` servido con scripts/servir.mjs;
     antes de medir se mira el <title> (otro servidor podría tener el puerto);
   - el aviso de cookies se da por aceptado con la clave de AvisoCookies.tsx;
   - mide LCP (y su elemento), CLS (todas las entradas `layout-shift`, también las que
     tienen `hadRecentInput`), tareas largas tras `document.fonts.ready` y el peso de las
     letras (en `out/` y las que pide cada página);
   - rutas: portada con cortina y sin ella, /plantillas/ y /sectores/alojamientos-rurales/.

   Lo que solo existe con el hero nuevo sale «sin medir» hasta T19: INP del instrumento
   (tocar un objeto, arrastrar el tirador), el segundo de arrastre en el CLS y el control
   de tareas largas lanzado con `setTimeout`.

   npm run build && npm run medir
   npm run medir -- --puerto 4301 --veces 3
   npm run medir -- --base /subcon-works-web       (build con GITHUB_ACTIONS=true)
*/
import fs from "node:fs";
import path from "node:path";
import { chromium, devices } from "playwright";
import {
  argumento,
  comprobarTitulo,
  crearServidor,
  PUERTO_POR_DEFECTO,
  RAIZ_POR_DEFECTO,
} from "./servir.mjs";

/** Las mismas claves que la web (AvisoCookies.tsx y Preloader/Cortina). */
const CLAVE_COOKIES = "undertactics:aviso-cookies:v1";
const CLAVE_CORTINA = "undertactics-preloader-seen";

const RUTAS = [
  { nombre: "Portada · con cortina", ruta: "", cortina: true, scrollHero: true },
  { nombre: "Portada · sin cortina", ruta: "", cortina: false, scrollHero: true },
  { nombre: "/plantillas/", ruta: "plantillas/", cortina: false },
  { nombre: "/sectores/alojamientos-rurales/", ruta: "sectores/alojamientos-rurales/", cortina: false },
];

const argv = process.argv.slice(2);
const puerto = Number(argumento(argv, "puerto", PUERTO_POR_DEFECTO));
const base = argumento(argv, "base", "");
const veces = Number(argumento(argv, "veces", 3));
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

async function medirUna(nav, url, { cortina, scrollHero }) {
  const ctx = await nav.newContext({ ...devices["iPhone 13"] });
  await ctx.addInitScript(
    ({ cortina, claveCookies, claveCortina }) => {
      try {
        localStorage.setItem(claveCookies, new Date().toISOString());
        if (!cortina) sessionStorage.setItem(claveCortina, "1");
      } catch {}
      const m = (window.__medir = { lcp: [], cls: 0, desplazamientos: 0, largas: [], eventos: [], letrasListas: null });
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
        m.lcp.push({ t: Math.round(e.startTime), el: describir(e.element) || (e.url || "").split("/").pop() }),
      );
      // §3.15: con `hadRecentInput` incluido (el arrastre del tirador también cuenta).
      observar("layout-shift", (e) => {
        m.cls += e.value;
        m.desplazamientos++;
      });
      observar("longtask", (e) => m.largas.push({ inicio: e.startTime, duracion: e.duration }));
      observar("event", (e) => m.eventos.push({ nombre: e.name, duracion: e.duration }), { durationThreshold: 16 });
      try {
        document.fonts.ready.then(() => (m.letrasListas = performance.now()));
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
  // La cortina de hoy tarda unos segundos en irse; el LCP se fija con la primera entrada
  // del usuario, así que se lee antes de hacer scroll.
  await page.waitForTimeout(cortina ? 8000 : 6500);
  const lcp = await page.evaluate(() => window.__medir.lcp.at(-1) ?? null);
  const clsCarga = await page.evaluate(() => window.__medir.cls);

  let clsScroll = null;
  let bajado = null;
  if (scrollHero) {
    // Scroll por el hero con la rueda (Lenis no se entera de scrollTo).
    await page.mouse.move(195, 400);
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 150);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(1200);
    clsScroll = await page.evaluate(() => window.__medir.cls);
    bajado = await page.evaluate(() => Math.round(window.scrollY));
  }

  const { largas, letrasListas } = await page.evaluate(() => ({
    largas: window.__medir.largas,
    letrasListas: window.__medir.letrasListas,
  }));
  const tras = letrasListas == null ? [] : largas.filter((l) => l.inicio >= letrasListas);
  await ctx.close();
  return {
    lcp,
    clsCarga,
    clsScroll,
    bajado,
    largaMax: tras.length ? Math.round(Math.max(...tras.map((l) => l.duracion))) : 0,
    largasMas200: tras.filter((l) => l.duracion > 200).length,
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
  console.log(`Midiendo «${titulo}» en ${srv.url} · iPhone 13, 4G, CPU ×4, mediana de ${veces}\n`);
  nav = await chromium.launch();

  const filas = [];
  for (const r of RUTAS) {
    const rs = [];
    for (let i = 0; i < veces; i++) rs.push(await medirUna(nav, srv.url + r.ruta, r));
    const fila = {
      nombre: r.nombre,
      lcp: mediana(rs.map((x) => x.lcp?.t)),
      elementos: [...new Set(rs.map((x) => x.lcp?.el ?? "—"))].join(" | "),
      clsCarga: mediana(rs.map((x) => x.clsCarga)),
      clsScroll: r.scrollHero ? mediana(rs.map((x) => x.clsScroll)) : null,
      bajado: r.scrollHero ? mediana(rs.map((x) => x.bajado)) : null,
      largaMax: Math.max(...rs.map((x) => x.largaMax)),
      largasMas200: Math.max(...rs.map((x) => x.largasMas200)),
      letras: `${rs[0].letrasPedidas} · ${kb(rs[0].bytesLetras)}`,
      google: Math.max(...rs.map((x) => x.google)),
    };
    filas.push(fila);
    console.log(
      `${r.nombre.padEnd(34)} LCP ${seg(fila.lcp)} (${rs.map((x) => (x.lcp ? x.lcp.t + " ms" : "—")).join(", ")}) · ${fila.elementos}`,
    );
  }

  const enOut = letrasEnOut(raiz);
  console.log("\n| Medida | Ruta | Cifra |");
  console.log("|---|---|---|");
  for (const f of filas) {
    console.log(`| LCP (mediana) | ${f.nombre} | ${seg(f.lcp)} · elemento: \`${f.elementos}\` |`);
  }
  for (const f of filas) {
    const cls = f.clsScroll == null ? num(f.clsCarga) : `${num(f.clsCarga)} carga · ${num(f.clsScroll)} con scroll por el hero (${f.bajado} px)`;
    console.log(`| CLS (mediana) | ${f.nombre} | ${cls} |`);
  }
  console.log("| CLS · 1 s de arrastre del tirador | Portada | sin medir (hasta T19) |");
  console.log("| INP del instrumento (tocar un objeto, arrastrar el tirador) | Portada | sin medir (hasta T19) |");
  for (const f of filas) {
    console.log(`| Tareas largas tras \`fonts.ready\` | ${f.nombre} | máx ${f.largaMax} ms · ${f.largasMas200} de más de 200 ms |`);
  }
  for (const f of filas) {
    console.log(`| Letras pedidas | ${f.nombre} | ${f.letras}${f.google ? ` · ${f.google} peticiones a Google Fonts` : ""} |`);
  }
  console.log(`| Letras en \`out/\` | — | ${enOut.length} ficheros · ${kb(enOut.reduce((s, l) => s + l.bytes, 0))} |`);
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (nav) await nav.close();
  if (srv) await srv.cerrar();
}
