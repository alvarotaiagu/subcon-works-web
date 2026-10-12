/* Comprobación en navegador de la spec 002 (§7), con el Playwright del repo, sobre `out/`
   servido por scripts/servir.mjs (plan PD-2).

   Cada comprobación: { id, tarea, pendiente, fn }. Imprime OK, FALLO o PENDIENTE por línea.
   Sale con 1 si hay algún FALLO; con --estricto, también si queda algún PENDIENTE.
   Cada tarea pone `pendiente: false` en las suyas y las hace pasar; no cambia las de otra.

   npm run build && npm run comprobar
   npm run comprobar -- --solo T07              → solo las de la T07 (campo `tarea`)
   npm run comprobar -- --solo Cortina          → las que lleven «Cortina» en el id
   npm run comprobar -- --solo T07,T08          → varias
   npm run comprobar -- --puerto 4301           → otro puerto (por defecto 4302)
   npm run comprobar -- --base /subcon-works-web   (build con GITHUB_ACTIONS=true)
   npm run comprobar -- --estricto              → un PENDIENTE también cuenta como fallo
   npm run comprobar -- --forzar --solo T09     → lanza también las pendientes, para
                                                  escribirlas (no vale para el «Hecho»)

   Reglas de las memorias: con Lenis el scroll se hace con `mouse.wheel`; la cortina se
   prueba en un contexto nuevo cada vez, con el enganche en `addInitScript`; antes de
   probar se mira el <title> de la página servida.

   Selectores del contrato (plan PD-9): [data-hero], [data-superficie], data-capa,
   [data-hilo] (cotas), [data-hilo-fin] (botón del Fondo). Los que la spec no fija van en
   SEL, arriba, marcados con la tarea que los define: esa tarea los ajusta a su marcado.
*/
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import {
  argumento,
  CLAVE_COOKIES,
  CLAVE_CORTINA,
  comprobarTitulo,
  crearServidor,
  PUERTO_POR_DEFECTO,
  RAIZ_POR_DEFECTO,
} from "./servir.mjs";

// ─── Datos de la spec ──────────────────────────────────────────────────────────

/** §3.5: el corte de la portada, en orden. */
const CORTE = [
  { id: "inicio", cota: "Superficie" },
  { id: "servicios", cota: "0 · Lo que montamos" },
  { id: "plantillas", cota: "−1 · La plantilla" },
  { id: "proceso", cota: "−2 · El proceso" },
  { id: "equipo", cota: "−3 · Quién está debajo" },
  { id: "diagnostico", cota: "−4 · Diagnóstico" },
  { id: "auditoria", cota: "Fondo · Auditoría" },
];

/** §3.12: interiores y su cota. La 404 se pide con una ruta que no existe. */
const INTERIORES = [
  { ruta: "herramientas/", cota: "0 · Herramientas" },
  { ruta: "plantillas/", cota: "−1 · Catálogo" },
  { ruta: "estudio/", cota: "−3 · Estudio" },
  { ruta: "auditoria/", cota: "Fondo · Auditoría" },
  { ruta: "sectores/", cota: "−4 · Sectores" },
  { ruta: "privacidad/", cota: "Fondo · Privacidad" },
  { ruta: "no-existe-esta-pagina/", cota: "Sin fondo · 404" },
];
const SECTORES = ["sectores/clinicas-dentales/", "sectores/alojamientos-rurales/", "sectores/asesorias-y-despachos/"];
/** Las ocho páginas (PD-4, contraste): portada y las siete interiores. */
const OCHO = ["", ...INTERIORES.map((i) => i.ruta)];

/** La query completa de la 001 (la de `diagnostico.auditoria.test.ts`). */
const QUERY_001 = "v=1&s=dental&canales=tel,wa&reserva=llamando&fuera=sin-contestar&web=solo-ficha&resenas=nunca&dolor=agenda";

const CLAVE_BORRADOR = "undertactics:auditoria:v1"; // FormularioAuditoria.tsx
const GONE_EVENT = "undertactics:preloader-gone";

/** Colores de §3.1 en rgb, para comparar con getComputedStyle. */
const C = {
  cal: [241, 238, 230],
  tinta: [21, 24, 26],
  tarjeta: [251, 250, 246],
  superficie: [201, 242, 77],
  limaOscuro: [95, 125, 0],
  hondo: [14, 27, 30],
  estrato: [20, 39, 43],
  roca: [10, 20, 22],
  hueso: [228, 236, 232],
  apagadoAbajo: [143, 161, 158],
  apagadoArriba: [92, 98, 95],
  conducto: [58, 81, 86],
  cortinaArriba: [16, 38, 42],
  cortinaAbajo: [8, 17, 19],
};

/**
 * Selectores que la spec no fija. Cada tarea ajusta los suyos a su marcado (y solo los suyos).
 * Las clases de estado siempre con `es-` (§6).
 */
const SEL = {
  logoCabecera: 'header a[aria-label="Undertactics, inicio"] svg', // T05/T07
  objetosHero: '[data-hero] [aria-label="Lo que ve tu cliente"] button', // T07
  pozosHero: "[data-hero] [data-pozo]", // T07: un elemento por pozo, en el orden de los objetos; encendido = .es-activo
  lecturaViva: '[data-hero] [aria-live="polite"]', // T07
  lecturaAuto: "[data-hero] [data-lectura-auto]", // T07: la lectura sin aria-live (cambios automáticos)
  tirador: 'button[aria-label="Bajar la superficie para ver más instalación"]', // T07/T08
  lineaCortina: "[data-cortina] [data-cortina-superficie]", // T09: la línea de la cortina
  testigoBroca: "#proceso [data-broca]", // T12
  testigoEstratos: "#proceso [data-estrato]", // T12: los seis, de arriba abajo
  pasosProceso: "#proceso [data-paso]", // T12: los seis; encendido = .es-activo
  tablaProceso: "#proceso table", // T12: la tabla de dos columnas (está en el HTML)
  hiloTrazo: "[data-hilo-trazo]", // T14: el <path> del conducto
  fondoBoton: 'a[href$="/auditoria/"]:is([data-hilo-fin], [data-fondo-boton])', // T13: «Empezar la auditoría»
  fondoSimbolo: "[data-fondo-simbolo]", // T13: el iceberg junto al botón
  dorsal: "[data-dorsal]", // T11
  mando: "[data-mando]", // T17
};

// ─── Arranque ──────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const puerto = Number(argumento(argv, "puerto", PUERTO_POR_DEFECTO));
const base = argumento(argv, "base", "");
const raiz = argumento(argv, "raiz", RAIZ_POR_DEFECTO);
const solo = argumento(argv, "solo", null);
const estricto = argv.includes("--estricto");
const forzar = argv.includes("--forzar");

// ─── Ayudas de Node ────────────────────────────────────────────────────────────

const igualColor = (a, b, tol = 3) => a && b && a.slice(0, 3).every((v, i) => Math.abs(v - b[i]) <= tol);

/**
 * Enganche que va en `addInitScript` (antes de cualquier script de la página):
 * apunta si `<html>` llegó a tener `cortina-si`, sus clases en el DOMContentLoaded y en el
 * primer fotograma, y si durante 2 s algún fotograma pintó una capa a pantalla completa con
 * los colores de la cortina.
 */
function enganche({ claveCookies, claveCortina, cortina }) {
  try {
    localStorage.setItem(claveCookies, new Date().toISOString());
    if (!cortina) sessionStorage.setItem(claveCortina, "1");
  } catch {}
  const g = (window.__gancho = {
    cortinaVista: false,
    clasesDCL: null,
    clasesPrimerFotograma: null,
    fotogramaConCortina: false,
    lineaCortinaY: null,
    t0: performance.now(),
  });
  const mirar = () => {
    const c = document.documentElement ? document.documentElement.className : "";
    if (/(^|\s)cortina-si(\s|$)/.test(c)) g.cortinaVista = true;
  };
  new MutationObserver(mirar).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
  document.addEventListener("DOMContentLoaded", () => {
    mirar();
    g.clasesDCL = document.documentElement.className;
  }, { once: true });
  const colores = [[16, 38, 42], [8, 17, 19]];
  // Los colores se comparan normalizados con un lienzo: getComputedStyle puede devolver
  // rgb(), oklch() o color(srgb …) según cómo los escriba el CSS.
  const lienzo = document.createElement("canvas");
  lienzo.width = lienzo.height = 1;
  const cx = lienzo.getContext("2d", { willReadFrequently: true });
  const esCortina = (pinta) =>
    (pinta.match(/(?:rgba?|hsla?|oklch|oklab|lch|lab|color)\((?:[^()]|\([^()]*\))*\)/g) || []).some((c) => {
      cx.clearRect(0, 0, 1, 1);
      cx.fillStyle = "rgba(0,0,0,0)";
      cx.fillStyle = c;
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      return d[3] > 0 && colores.some((k) => k.every((v, i) => Math.abs(v - d[i]) <= 3));
    });
  window.__esCortina = esCortina;
  const fin = performance.now() + 2000;
  const fotograma = () => {
    mirar();
    if (g.clasesPrimerFotograma === null && document.body) g.clasesPrimerFotograma = document.documentElement.className;
    if (document.body) {
      const w = innerWidth, h = innerHeight;
      for (const el of document.elementsFromPoint(w / 2, h / 2)) {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
        const r = el.getBoundingClientRect();
        if (r.width < w * 0.9 || r.height < h * 0.9) continue;
        if (esCortina(cs.backgroundColor + " " + cs.backgroundImage)) g.fotogramaConCortina = true;
      }
    }
    if (performance.now() < fin) requestAnimationFrame(fotograma);
  };
  requestAnimationFrame(fotograma);
}

/**
 * Ayudas dentro de la página (window.__c). Van por evaluate, no por addInitScript, para
 * que funcionen también con `javaScriptEnabled: false`.
 */
function ayudas() {
  if (window.__c) return;
  const lienzo = document.createElement("canvas");
  lienzo.width = lienzo.height = 1;
  const cx = lienzo.getContext("2d", { willReadFrequently: true });
  /** Cualquier color CSS (rgb, oklch, color-mix…) → [r, g, b, a] con a en 0..1. */
  const rgba = (str) => {
    if (!str || str === "transparent") return [0, 0, 0, 0];
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "rgba(0,0,0,0)";
    cx.fillStyle = str;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const opacidad = (el) => {
    let o = 1;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
    return o;
  };
  const visible = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility !== "visible" || cs.display === "none") return false;
    if (opacidad(el) < 0.05) return false;
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const ca = getComputedStyle(a);
      if (ca.display === "none") return false;
      if (ca.overflow !== "visible" || ca.clipPath !== "none") {
        const ra = a.getBoundingClientRect();
        const ancho = Math.min(r.right, ra.right) - Math.max(r.left, ra.left);
        const alto = Math.min(r.bottom, ra.bottom) - Math.max(r.top, ra.top);
        if (ca.overflow !== "visible" && (ancho < 1 || alto < 1)) return false;
        if (/inset\(\s*(50|100)%|polygon\(0px 0px, 0px 0px|circle\(0/.test(ca.clipPath)) return false;
      }
    }
    return true;
  };
  /** Nodos de texto visibles bajo `raiz`, con sus rectángulos. */
  const textos = (raiz = document.body, { soloEnPantalla = false } = {}) => {
    const res = [];
    const tw = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const el = n.parentElement;
      if (!el || el.closest("script, style, noscript, template, [hidden]")) continue;
      if (!visible(el)) continue;
      const rango = document.createRange();
      rango.selectNodeContents(n);
      const rects = [...rango.getClientRects()].filter((r) => r.width >= 1 && r.height >= 1);
      if (!rects.length) continue;
      if (soloEnPantalla && !rects.some((r) => r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth)) continue;
      res.push({ nodo: n, el, texto: n.nodeValue.replace(/\s+/g, " ").trim(), rects });
    }
    return res;
  };
  const luminancia = ([r, g, b]) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contraste = (a, b) => {
    const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const mezclar = (arriba, abajo) => {
    const a = arriba[3];
    return [0, 1, 2].map((i) => arriba[i] * a + abajo[i] * (1 - a)).concat(1);
  };
  /**
   * Opacidad de `el` relativa a `otro`: el producto de las opacidades desde `el` hacia
   * arriba hasta el primer antecesor común (sin incluirlo). La opacidad de un grupo que
   * contiene a los dos (una sección que entra con un fundido) afecta igual al texto y a su
   * fondo, así que no cuenta para el contraste.
   */
  const opacidadHasta = (el, otro) => {
    let o = 1;
    for (let e = el; e && e.nodeType === 1 && !e.contains(otro); e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
    return o;
  };
  /**
   * Fondo efectivo detrás del punto (x, y), desde `el` hacia abajo en la pila de pintado.
   * Devuelve `{ fondo, capa }` (capa = el elemento del primer fondo pintado), o null si hay
   * un degradado o una imagen antes de llegar a un fondo opaco.
   */
  const fondoDetalle = (x, y, el) => {
    const pila = document.elementsFromPoint(x, y);
    let i = pila.findIndex((p) => p === el || p.contains(el));
    if (i === -1) i = 0;
    const capas = [];
    let capa = document.documentElement;
    for (; i < pila.length; i++) {
      const cs = getComputedStyle(pila[i]);
      if (cs.backgroundImage !== "none") return null;
      const c = rgba(cs.backgroundColor);
      c[3] *= opacidadHasta(pila[i], el);
      if (c[3] > 0) {
        if (!capas.length) capa = pila[i];
        capas.push(c);
      }
      if (c[3] >= 0.99) break;
    }
    let fondo = [255, 255, 255, 1];
    for (let k = capas.length - 1; k >= 0; k--) fondo = mezclar(capas[k], fondo);
    return { fondo, capa };
  };
  const fondoEn = (x, y, el) => fondoDetalle(x, y, el)?.fondo ?? null;
  /** Colores pintados por el elemento y sus ::before/::after (líneas, bordes, sombras). */
  const coloresDe = (el) => {
    const res = [];
    for (const pseudo of [null, "::before", "::after"]) {
      const cs = getComputedStyle(el, pseudo);
      if (pseudo && cs.content === "none") continue;
      res.push(cs.backgroundColor, cs.borderBottomColor, cs.outlineColor);
      for (const m of cs.boxShadow.matchAll(/rgba?\([^)]*\)|oklch\([^)]*\)|color\([^)]*\)/g)) res.push(m[0]);
    }
    return res.map(rgba).filter((c) => c[3] > 0);
  };
  /** fill y stroke calculados de todos los trazados de un SVG. */
  const pinturaSvg = (svg) =>
    [...svg.querySelectorAll("path, rect, circle, line, polyline, polygon, ellipse, use")]
      .flatMap((e) => {
        const cs = getComputedStyle(e);
        return [cs.fill, cs.stroke].filter((v) => v && v !== "none").map(rgba);
      })
      .filter((c) => c[3] > 0);
  const solapan = (a, b, margen = 0.5) =>
    Math.min(a.right, b.right) - Math.max(a.left, b.left) > margen &&
    Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > margen;
  window.__c = { rgba, opacidad, opacidadHasta, visible, textos, contraste, mezclar, fondoEn, fondoDetalle, coloresDe, pinturaSvg, solapan, luminancia };
}

// ─── Contexto de cada comprobación ─────────────────────────────────────────────

/**
 * Ayudas para las `fn`. `h.abrir(ruta, opciones)` crea un contexto nuevo (cada uno con su
 * sessionStorage) y devuelve la página ya cargada.
 */
function crearAyudas(nav, urlBase) {
  const contextos = [];
  const h = {
    url: (ruta = "") => urlBase + ruta.replace(/^\//, ""),
    base,
    raiz,
    /**
     * @param {string} ruta  relativa a la base («», «plantillas/»…)
     * @param {object} o  ancho (1440), alto, cortina (false: la sesión ya la vio),
     *   js (true), reducedMotion, forcedColors, hasTouch, isMobile, espera ("load"),
     *   antes(page) para enganchar rutas antes de ir, permisos
     */
    async abrir(ruta = "", o = {}) {
      const ancho = o.ancho ?? 1440;
      const ctx = await nav.newContext({
        viewport: { width: ancho, height: o.alto ?? (ancho >= 1024 ? 900 : 780) },
        javaScriptEnabled: o.js ?? true,
        reducedMotion: o.reducedMotion ?? "no-preference",
        forcedColors: o.forcedColors ?? "none",
        hasTouch: o.hasTouch ?? false,
        isMobile: o.isMobile ?? false,
        permissions: o.permisos ?? [],
      });
      contextos.push(ctx);
      await ctx.addInitScript(enganche, { claveCookies: CLAVE_COOKIES, claveCortina: CLAVE_CORTINA, cortina: o.cortina ?? false });
      const page = await ctx.newPage();
      page.on("pageerror", (e) => (page.__errores ??= []).push(e.message));
      if (o.antes) await o.antes(page);
      if (ruta !== null) {
        await page.goto(h.url(ruta), { waitUntil: o.espera ?? "load" });
        await page.evaluate(ayudas);
      }
      return page;
    },
    /** Vuelve a instalar las ayudas (tras navegar o recargar). */
    ayudas: (page) => page.evaluate(ayudas),
    /** Scroll con la rueda (Lenis no se entera de scrollTo). */
    async rueda(page, dy, { pasos = Math.max(1, Math.ceil(Math.abs(dy) / 200)), pausa = 60 } = {}) {
      const vp = page.viewportSize();
      await page.mouse.move(vp.width - 12, vp.height / 2);
      for (let i = 0; i < pasos; i++) {
        await page.mouse.wheel(0, dy / pasos);
        await page.waitForTimeout(pausa);
      }
      await page.waitForTimeout(400);
    },
    /** Baja con la rueda hasta que `sel` tenga su borde de arriba por encima de `y` (px). */
    async ruedaHasta(page, sel, y = 0, max = 80) {
      for (let i = 0; i < max; i++) {
        const top = await page.$eval(sel, (e) => e.getBoundingClientRect().top);
        if (top <= y) return;
        await h.rueda(page, Math.min(400, Math.max(60, top - y)), { pasos: 1, pausa: 30 });
      }
      throw new Error(`no llego a ${sel} con la rueda`);
    },
    /** La cortina está puesta (y no retirándose). */
    cortinaPuesta: (page) =>
      page.evaluate(() => {
        const c = document.documentElement.classList;
        return c.contains("cortina-si") && !c.contains("cortina-fuera");
      }),
    async esperarSinCortina(page, ms = 6000) {
      const t = Date.now();
      while (Date.now() - t < ms) {
        if (!(await h.cortinaPuesta(page))) return Date.now() - t;
        await page.waitForTimeout(100);
      }
      throw new Error(`la cortina sigue puesta a los ${ms} ms`);
    },
    gancho: (page) => page.evaluate(() => window.__gancho),
    async cerrarTodo() {
      for (const c of contextos.splice(0)) await c.close().catch(() => {});
    },
  };
  return h;
}

// ─── Piezas que se repiten ─────────────────────────────────────────────────────

/** Índice del pozo encendido en el hero (−1 si ninguno). */
const pozoEncendido = (page) =>
  page.$$eval(SEL.pozosHero, (ps) => ps.findIndex((p) => p.classList.contains("es-activo")));

/** Recoge los cambios de pozo con su momento, en la página (MutationObserver). */
async function registrarCambiosDePozo(page) {
  const n = await page.locator(SEL.pozosHero).count();
  assert.equal(n, 4, `hay ${n} pozos en el hero (${SEL.pozosHero}), no 4`);
  await page.evaluate((sel) => {
    const ps = [...document.querySelectorAll(sel)];
    const r = (window.__cambiosPozo = []);
    let actual = ps.findIndex((p) => p.classList.contains("es-activo"));
    new MutationObserver(() => {
      const i = ps.findIndex((p) => p.classList.contains("es-activo"));
      if (i !== actual && i !== -1) {
        r.push({ t: performance.now(), de: actual, a: i });
        actual = i;
      }
    }).observe(document.querySelector("[data-hero]"), { subtree: true, attributes: true, attributeFilter: ["class"] });
  }, SEL.pozosHero);
}
const cambiosDePozo = (page) => page.evaluate(() => window.__cambiosPozo.length);

/** Comprueba que el Fondo se enciende al llegar el botón al 66 % (portada, sector, Sobria). */
async function fondoSeEnciende(h, ruta, opciones = {}) {
  const page = await h.abrir(ruta, opciones);
  const boton = SEL.fondoBoton;
  assert.ok(await page.$(boton), `${ruta || "/"}: no está el botón del Fondo (${boton})`);
  const encendido = () =>
    page.evaluate(
      ({ boton, simbolo, lima }) => {
        const b = document.querySelector(boton);
        const s = document.querySelector(simbolo);
        const esLima = (c) => c && Math.abs(c[0] - lima[0]) < 4 && Math.abs(c[1] - lima[1]) < 4 && Math.abs(c[2] - lima[2]) < 4;
        return {
          linea: __c.coloresDe(b).some(esLima),
          simbolo: !!s && __c.pinturaSvg(s).some(esLima),
        };
      },
      { boton, simbolo: SEL.fondoSimbolo, lima: C.superficie },
    );
  const antes = await encendido();
  assert.ok(!antes.linea, `${ruta || "/"}: la línea del botón ya está en lima arriba del todo`);
  const alto = page.viewportSize().height;
  await h.ruedaHasta(page, boton, alto * 0.6);
  await page.waitForTimeout(1600);
  const despues = await encendido();
  assert.ok(despues.linea, `${ruta || "/"}: al llegar al 66 %, la línea del botón no se enciende`);
  assert.ok(despues.simbolo, `${ruta || "/"}: al llegar al 66 %, el iceberg no tiene su superficie en lima`);
}

/** Tabla del proceso: visible, con seis filas de datos. */
async function tablaProcesoVisible(page, donde) {
  const r = await page.evaluate((sel) => {
    const t = document.querySelector(sel);
    if (!t) return { existe: false };
    const filas = [...t.querySelectorAll("tbody tr")];
    return { existe: true, visible: __c.visible(t), filas: filas.length, filasVisibles: filas.filter((f) => __c.visible(f)).length };
  }, SEL.tablaProceso);
  assert.ok(r.existe, `${donde}: no hay tabla del proceso (${SEL.tablaProceso})`);
  assert.ok(r.visible, `${donde}: la tabla del proceso no se ve`);
  assert.equal(r.filas, 6, `${donde}: la tabla tiene ${r.filas} filas, no 6`);
  assert.equal(r.filasVisibles, 6, `${donde}: se ven ${r.filasVisibles} filas de 6`);
}

/** Contraste de todos los textos visibles, bajando la página por pantallas. */
async function contrasteDePagina(h, page, donde) {
  const fallos = [];
  let sinFondo = 0;
  const alto = page.viewportSize().height;
  for (let vuelta = 0; vuelta < 60; vuelta++) {
    const r = await page.evaluate(() => {
      const res = { fallos: [], sinFondo: 0 };
      for (const t of __c.textos(document.body, { soloEnPantalla: true })) {
        const rect = t.rects.find((q) => q.bottom > 0 && q.top < innerHeight && q.right > 0 && q.left < innerWidth);
        const x = Math.min(Math.max(rect.left + Math.min(4, rect.width / 2), 0), innerWidth - 1);
        const y = Math.min(Math.max(rect.top + rect.height / 2, 0), innerHeight - 1);
        const d = __c.fondoDetalle(x, y, t.el);
        if (!d) {
          res.sinFondo++;
          continue;
        }
        const { fondo, capa } = d;
        const cs = getComputedStyle(t.el);
        const color = __c.rgba(cs.color);
        color[3] *= __c.opacidadHasta(t.el, capa);
        const efectivo = __c.mezclar(color, fondo);
        const ratio = __c.contraste(efectivo, fondo);
        const px = parseFloat(cs.fontSize);
        const grande = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700);
        const minimo = grande ? 3 : 4.5;
        if (ratio < minimo - 0.01) {
          res.fallos.push(`«${t.texto.slice(0, 40)}» ${ratio.toFixed(2)}:1 (mín. ${minimo}) color ${cs.color} sobre rgb(${fondo.slice(0, 3).map(Math.round).join(", ")})`);
        }
      }
      return res;
    });
    fallos.push(...r.fallos);
    sinFondo += r.sinFondo;
    const fin = await page.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 2);
    if (fin) break;
    await h.rueda(page, alto * 0.8, { pasos: 2 });
  }
  const unicos = [...new Set(fallos)];
  if (unicos.length) throw new Error(`${donde}: ${unicos.length} textos sin contraste: ${unicos.slice(0, 6).join(" · ")}`);
  return sinFondo ? `${donde}: ${sinFondo} textos sobre degradado o imagen sin medir` : "";
}

/** Responde el diagnóstico que esté en pantalla hasta llegar al resultado. */
async function responderDiagnostico(page, raizSel = "#diagnostico") {
  for (let i = 0; i < 14; i++) {
    const hayResultado = await page.locator(`${raizSel} :text("Tu diagnóstico")`).count();
    if (hayResultado) return;
    const grupo = page.locator(`${raizSel} [role="group"]`).first();
    await grupo.waitFor({ timeout: 8000 });
    // Se mira antes de tocar: una de una opción avanza sola y la siguiente puede ser de varias.
    const seguir = page.locator(`${raizSel} button:has-text("Seguir")`);
    const varias = (await seguir.count()) > 0;
    // En las de varias, una sin marcar (si ya estaba marcada, tocarla la desmarca).
    await grupo.locator(varias ? 'button[aria-pressed="false"]' : "button").first().click();
    if (varias && (await seguir.count()) && (await seguir.first().isEnabled())) await seguir.first().click();
    await page.waitForTimeout(250);
  }
  throw new Error("el diagnóstico no llega al resultado en 14 pasos");
}

// ─── Las comprobaciones (§7) ───────────────────────────────────────────────────

const comprobaciones = [
  {
    id: "§7 · Portada · siete secciones con cota, sin Marquee/Cifras/CtaFinal",
    tarea: "T06",
    pendiente: true,
    async fn(h) {
      for (const ancho of [390, 1440]) {
        const page = await h.abrir("", { ancho });
        const r = await page.evaluate(() => {
          const main = document.querySelector("main");
          const secciones = [...main.querySelectorAll("section")].filter((s) => !s.parentElement.closest("section"));
          return {
            secciones: secciones.map((s) => ({
              id: s.id,
              cota: (s.querySelector("[data-hilo]")?.textContent || "").replace(/\s+/g, " ").trim(),
            })),
            contacto: !!document.getElementById("contacto"),
            marquesina: !!main.querySelector('[aria-hidden="true"] .w-max.whitespace-nowrap'),
          };
        });
        assert.deepEqual(
          r.secciones.map((s) => s.id),
          CORTE.map((c) => c.id),
          `${ancho} px: las secciones de <main> son ${r.secciones.map((s) => s.id || "(sin id)").join(", ")}`,
        );
        r.secciones.forEach((s, i) =>
          assert.ok(s.cota.includes(CORTE[i].cota), `${ancho} px: #${s.id} lleva la cota «${s.cota}», no «${CORTE[i].cota}»`),
        );
        assert.ok(!r.contacto, `${ancho} px: sigue CtaFinal (#contacto)`);
        assert.ok(!r.marquesina, `${ancho} px: sigue la marquesina`);
      }
    },
  },
  {
    id: "§7 · Portada · letras: nada de Google Fonts, se piden los dos woff2",
    tarea: "T03",
    pendiente: false,
    async fn(h) {
      const pedidas = [];
      const page = await h.abrir("", {
        antes: (p) =>
          p.on("response", (r) => pedidas.push({ url: r.url(), estado: r.status(), tipo: r.headers()["content-type"] || "" })),
      });
      await page.waitForTimeout(500);
      const google = pedidas.filter((p) => /fonts\.(googleapis|gstatic)\.com/.test(p.url));
      assert.equal(google.length, 0, `peticiones a Google Fonts: ${google.map((g) => g.url).join(", ")}`);
      for (const f of ["geologica-oblique.woff2", "kode-mono-normal.woff2"]) {
        const p = pedidas.find((x) => new URL(x.url).pathname.endsWith(`${h.base}/fuentes/${f}`));
        assert.ok(p, `no se pide ${h.base}/fuentes/${f}`);
        assert.equal(p.estado, 200, `${f}: estado ${p.estado}`);
        assert.ok(p.tipo.startsWith("font/woff2"), `${f}: content-type ${p.tipo}`);
      }
      const otras = pedidas.filter((p) => /\.(woff2?|ttf|otf)(\?|$)/.test(p.url) && !/\/fuentes\//.test(p.url));
      assert.equal(otras.length, 0, `se piden otras letras: ${otras.map((o) => o.url).join(", ")}`);
    },
  },
  {
    id: "§7 · basePath de las letras (build con GITHUB_ACTIONS=true)",
    tarea: "T03",
    pendiente: false,
    async fn(h) {
      // Se lanza sobre un build con GITHUB_ACTIONS=true y `--base /subcon-works-web`. Sin
      // --base mira lo mismo con la base vacía (el build normal).
      const html = fs.readFileSync(path.join(h.raiz, "index.html"), "utf8");
      const esperado = `${h.base}/fuentes/`;
      const caras = [...html.matchAll(/@font-face\s*{[^}]*}/g)].map((m) => m[0]);
      assert.ok(caras.length >= 2, `index.html lleva ${caras.length} @font-face en línea`);
      for (const f of ["geologica-oblique.woff2", "kode-mono-normal.woff2"]) {
        assert.ok(
          caras.some((c) => c.includes(`url(${esperado}${f})`) || c.includes(`url("${esperado}${f}")`) || c.includes(`url('${esperado}${f}')`)),
          `ningún @font-face apunta a ${esperado}${f}`,
        );
        const precarga = new RegExp(`<link[^>]*rel="preload"[^>]*href="${esperado.replace(/\//g, "\\/")}${f}"[^>]*>`);
        const precarga2 = new RegExp(`<link[^>]*href="${esperado.replace(/\//g, "\\/")}${f}"[^>]*rel="preload"[^>]*>`);
        assert.ok(precarga.test(html) || precarga2.test(html), `no hay <link rel="preload"> a ${esperado}${f}`);
        const res = await fetch(h.url(`fuentes/${f}`));
        assert.equal(res.status, 200, `${h.url(`fuentes/${f}`)} da ${res.status}`);
      }
      return h.base ? "" : "sin --base: mirado con la base vacía; falta la pasada con GITHUB_ACTIONS=true";
    },
  },
  {
    id: "§7 · Cortina · cuándo sale y cuándo no",
    tarea: "T09",
    pendiente: true,
    async fn(h) {
      // 1. Primera carga de la portada en la sesión: sale.
      const p1 = await h.abrir("", { cortina: true, espera: "domcontentloaded" });
      assert.ok((await h.gancho(p1)).cortinaVista, "primera carga de la portada: no sale");
      await h.esperarSinCortina(p1, 6000);
      // 2. Segunda carga en la misma pestaña: no sale.
      await p1.reload({ waitUntil: "load" });
      assert.ok(!(await h.gancho(p1)).cortinaVista, "segunda carga de la sesión: sale otra vez");
      // 3. En /plantillas/: no sale, y entrar por una interior no marca la sesión.
      const p2 = await h.abrir("plantillas/", { cortina: true });
      assert.ok(!(await h.gancho(p2)).cortinaVista, "/plantillas/: sale");
      await p2.goto(h.url(""), { waitUntil: "domcontentloaded" });
      assert.ok((await h.gancho(p2)).cortinaVista, "portada tras entrar por /plantillas/: no sale (la interior marcó la sesión)");
      // 4. Con movimiento reducido: no sale.
      const p3 = await h.abrir("", { cortina: true, reducedMotion: "reduce" });
      assert.ok(!(await h.gancho(p3)).cortinaVista, "con movimiento reducido: sale");
      // 5. De /plantillas/ a la portada pulsando el logo (sin recargar): no sale.
      const p4 = await h.abrir("plantillas/", { cortina: true });
      await p4.evaluate(() => (window.__mismoDocumento = true));
      await p4.click('header a[aria-label="Undertactics, inicio"]');
      await p4.waitForURL((u) => u.pathname === `${h.base}/`, { timeout: 8000 });
      await p4.waitForTimeout(800);
      assert.ok(await p4.evaluate(() => window.__mismoDocumento === true), "el logo recargó la página");
      assert.ok(!(await h.cortinaPuesta(p4)), "de /plantillas/ a la portada con el logo: sale");
    },
  },
  {
    id: "§7 · Cortina · ni un fotograma cuando no sale",
    tarea: "T09",
    pendiente: true,
    async fn(h) {
      const casos = [
        { nombre: "segunda carga", ruta: "", o: { cortina: false } },
        { nombre: "/plantillas/", ruta: "plantillas/", o: { cortina: true } },
        { nombre: "movimiento reducido", ruta: "", o: { cortina: true, reducedMotion: "reduce" } },
      ];
      for (const ancho of [390, 1440]) {
        for (const c of casos) {
          const page = await h.abrir(c.ruta, { ...c.o, ancho, espera: "domcontentloaded" });
          await page.waitForTimeout(2100); // el enganche mira cada fotograma durante 2 s
          const g = await h.gancho(page);
          assert.ok(!g.cortinaVista, `${ancho} px, ${c.nombre}: <html> llegó a tener cortina-si`);
          assert.ok(!g.fotogramaConCortina, `${ancho} px, ${c.nombre}: algún fotograma pintó la cortina`);
        }
        // Del logo a la portada, sin recargar.
        const p = await h.abrir("plantillas/", { ancho, cortina: true });
        await p.evaluate(() => {
          window.__conCortina = false;
          const fin = performance.now() + 2500;
          const mirar = () => {
            for (const el of document.elementsFromPoint(innerWidth / 2, innerHeight / 2)) {
              const cs = getComputedStyle(el);
              const r = el.getBoundingClientRect();
              if (r.width < innerWidth * 0.9 || r.height < innerHeight * 0.9 || Number(cs.opacity) === 0) continue;
              if (window.__esCortina(cs.backgroundColor + " " + cs.backgroundImage)) window.__conCortina = true;
            }
            if (performance.now() < fin) requestAnimationFrame(mirar);
          };
          requestAnimationFrame(mirar);
        });
        // En móvil el logo está en la cabecera igual; el menú no hace falta.
        await p.click('header a[aria-label="Undertactics, inicio"]');
        await p.waitForTimeout(2600);
        assert.ok(!(await p.evaluate(() => window.__conCortina)), `${ancho} px, logo desde /plantillas/: algún fotograma pintó la cortina`);
      }
    },
  },
  {
    id: "§7 · Cortina · misma y que la superficie (±1 px)",
    tarea: "T09",
    pendiente: true,
    async fn(h) {
      for (const ancho of [360, 390, 1440]) {
        const page = await h.abrir(null, { ancho, cortina: true });
        // Guarda la última `y` de la línea de la cortina mientras existe.
        await page.addInitScript(
          ({ sel, evento }) => {
            const g = () => window.__gancho;
            const seguir = () => {
              const l = document.querySelector(sel);
              if (l) {
                const r = l.getBoundingClientRect();
                if (r.height > 0) g().lineaCortinaY = r.top + r.height / 2;
              }
              if (!g().gone) requestAnimationFrame(seguir);
            };
            requestAnimationFrame(seguir);
            addEventListener(evento, () => (g().gone = true));
          },
          { sel: SEL.lineaCortina, evento: GONE_EVENT },
        );
        await page.goto(h.url(""), { waitUntil: "domcontentloaded" });
        assert.ok((await h.gancho(page)).cortinaVista, `${ancho} px: la cortina no sale`);
        await h.esperarSinCortina(page, 6000);
        const { lineaCortinaY } = await h.gancho(page);
        assert.ok(lineaCortinaY != null, `${ancho} px: no se encontró la línea de la cortina (${SEL.lineaCortina})`);
        const yHero = await page.$eval("[data-superficie]", (s) => {
          const r = s.getBoundingClientRect();
          return r.top + r.height / 2;
        });
        assert.ok(Math.abs(lineaCortinaY - yHero) <= 1, `${ancho} px: la cortina acaba en ${lineaCortinaY.toFixed(1)} y la superficie está en ${yHero.toFixed(1)}`);
      }
    },
  },
  {
    id: "§7 · Cortina · se retira con los chunks abortados",
    tarea: "T09",
    pendiente: true,
    async fn(h) {
      for (const ancho of [390, 1440]) {
        const page = await h.abrir("", {
          ancho,
          cortina: true,
          espera: "domcontentloaded",
          antes: (p) => p.route(/\/_next\/static\/chunks\/.*\.js(\?.*)?$/, (r) => r.abort()),
        });
        const t0 = Date.now();
        assert.ok((await h.gancho(page)).cortinaVista, `${ancho} px: sin chunks, la cortina ni siquiera sale (¿el script del <head>?)`);
        const tarda = await h.esperarSinCortina(page, 4500 - (Date.now() - t0) + 300);
        const bloqueado = await page.evaluate(
          () => getComputedStyle(document.body).overflow === "hidden" || getComputedStyle(document.documentElement).overflow === "hidden",
        );
        assert.ok(!bloqueado, `${ancho} px: la cortina se fue pero el scroll sigue bloqueado`);
        await h.rueda(page, 600);
        const y = await page.evaluate(() => scrollY);
        assert.ok(y > 0, `${ancho} px: tras retirarse (${tarda} ms) no se puede hacer scroll`);
      }
    },
  },
  {
    id: "§7 · Sin JS",
    tarea: "T12",
    pendiente: true,
    async fn(h) {
      for (const ancho of [360, 390, 1440]) {
        const page = await h.abrir("", { ancho, js: false, cortina: true });
        const r = await page.evaluate((selTabla) => {
          const h1 = document.querySelector("h1");
          const h2 = [...document.querySelectorAll("main h2")];
          const t = document.querySelector(selTabla);
          return {
            cortina: document.documentElement.classList.contains("cortina-si"),
            h1: !!h1 && __c.visible(h1),
            h2: h2.length,
            h2Ocultos: h2.filter((x) => !__c.visible(x)).map((x) => x.textContent.trim().slice(0, 40)),
            tabla: !!t && __c.visible(t),
            filas: t ? t.querySelectorAll("tbody tr").length : 0,
          };
        }, SEL.tablaProceso);
        assert.ok(!r.cortina, `${ancho} px: sin JS hay cortina`);
        assert.ok(r.h1, `${ancho} px: sin JS no se ve el titular`);
        assert.ok(r.h2 >= 6, `${ancho} px: solo hay ${r.h2} h2 en <main>`);
        assert.deepEqual(r.h2Ocultos, [], `${ancho} px: sin JS no se ven estos h2`);
        assert.ok(r.tabla, `${ancho} px: sin JS no se ve la tabla del proceso`);
        assert.equal(r.filas, 6, `${ancho} px: la tabla del proceso tiene ${r.filas} filas`);
      }
    },
  },
  {
    id: "§7 · Hero · encender cada pozo y «Ejemplo»",
    tarea: "T07",
    pendiente: true,
    async fn(h) {
      for (const ancho of [390, 1440]) {
        const page = await h.abrir("", { ancho, hasTouch: ancho < 768 });
        const objetos = page.locator(SEL.objetosHero);
        assert.equal(await objetos.count(), 4, `${ancho} px: hay ${await objetos.count()} objetos en el hero`);
        assert.equal(await page.locator(SEL.pozosHero).count(), 4, `${ancho} px: no hay cuatro pozos (${SEL.pozosHero})`);
        const lecturas = [];
        for (let i = 0; i < 4; i++) {
          if (ancho < 768) await objetos.nth(i).tap();
          else await objetos.nth(i).click();
          await page.waitForTimeout(1600); // el pulso baja en unos 1,4 s
          assert.equal(await pozoEncendido(page), i, `${ancho} px: tras tocar el objeto ${i + 1}, el pozo encendido es otro`);
          const r = await page.evaluate((selViva) => {
            const viva = document.querySelector(selViva);
            const hero = document.querySelector("[data-hero]");
            const ejemplo = [...hero.querySelectorAll("*")].find(
              (e) => e.children.length === 0 && e.textContent.trim() === "Ejemplo" && __c.visible(e),
            );
            return { lectura: viva ? viva.textContent.replace(/\s+/g, " ").trim() : null, ejemplo: !!ejemplo };
          }, SEL.lecturaViva);
          assert.ok(r.lectura, `${ancho} px: tras tocar el objeto ${i + 1}, la lectura está vacía`);
          assert.ok(r.ejemplo, `${ancho} px: no se ve «Ejemplo» junto a la lectura`);
          lecturas.push(r.lectura);
        }
        assert.equal(new Set(lecturas).size, 4, `${ancho} px: la lectura no cambia con cada objeto`);
      }
    },
  },
  {
    id: "§7 · Hero · a 360 px, nada solapado, recortado ni < 12 px",
    tarea: "T07",
    pendiente: true,
    async fn(h) {
      for (const ancho of [360, 390]) {
        const page = await h.abrir("", { ancho });
        await page.waitForTimeout(1600);
        assert.ok(await page.$("[data-hero]"), `${ancho} px: no hay [data-hero]`);
        const r = await page.evaluate(() => {
          const hero = document.querySelector("[data-hero]");
          const hr = hero.getBoundingClientRect();
          const ts = __c.textos(hero);
          const pequenos = [];
          const recortados = [];
          for (const t of ts) {
            const px = parseFloat(getComputedStyle(t.el).fontSize);
            if (px < 12) pequenos.push(`«${t.texto.slice(0, 30)}» ${px} px`);
            for (const q of t.rects) {
              if (q.left < -0.5 || q.right > innerWidth + 0.5 || q.top < hr.top - 0.5 || q.bottom > hr.bottom + 0.5) {
                recortados.push(`«${t.texto.slice(0, 30)}» fuera del hero o de la pantalla`);
              }
            }
            for (let a = t.el; a && a !== hero.parentElement; a = a.parentElement) {
              const cs = getComputedStyle(a);
              if (cs.overflow === "visible" && cs.textOverflow !== "ellipsis") continue;
              if (a.scrollWidth > a.clientWidth + 1 && cs.overflowX !== "visible" && cs.overflowX !== "auto" && cs.overflowX !== "scroll") {
                recortados.push(`«${t.texto.slice(0, 30)}» cortado por <${a.tagName.toLowerCase()} class="${a.className}">`);
                break;
              }
            }
          }
          const solapes = [];
          for (let i = 0; i < ts.length; i++) {
            for (let j = i + 1; j < ts.length; j++) {
              if (ts[i].el === ts[j].el || ts[i].el.contains(ts[j].el) || ts[j].el.contains(ts[i].el)) continue;
              if (ts[i].rects.some((a) => ts[j].rects.some((b) => __c.solapan(a, b, 1)))) {
                solapes.push(`«${ts[i].texto.slice(0, 20)}» con «${ts[j].texto.slice(0, 20)}»`);
              }
            }
          }
          return { pequenos, recortados: [...new Set(recortados)], solapes };
        });
        assert.deepEqual(r.pequenos, [], `${ancho} px: textos del hero por debajo de 12 px`);
        assert.deepEqual(r.recortados, [], `${ancho} px: textos del hero recortados`);
        assert.deepEqual(r.solapes, [], `${ancho} px: textos del hero que se solapan`);
      }
    },
  },
  {
    id: "§7 · LCP · área del titular > descripción a 390 px",
    tarea: "T07",
    pendiente: true,
    async fn(h) {
      const page = await h.abrir("", { ancho: 390, alto: 844 });
      const r = await page.evaluate(() => {
        const area = (el) => {
          const rango = document.createRange();
          rango.selectNodeContents(el);
          const q = rango.getBoundingClientRect();
          const w = Math.max(0, Math.min(q.right, innerWidth) - Math.max(q.left, 0));
          const hgt = Math.max(0, Math.min(q.bottom, innerHeight) - Math.max(q.top, 0));
          return w * hgt;
        };
        const h1 = document.querySelector("[data-hero] h1");
        const lineas = h1 ? [...h1.querySelectorAll(":scope > span")] : [];
        const desc = [...document.querySelectorAll("[data-hero] p")].find((p) => p.textContent.trim().startsWith("Diseñamos"));
        return {
          lineas: lineas.length,
          mayor: Math.max(0, ...lineas.map(area)),
          desc: desc ? area(desc) : null,
        };
      });
      assert.equal(r.lineas, 2, `el <h1> del hero tiene ${r.lineas} líneas <span>, no 2`);
      assert.ok(r.desc != null, "no se encuentra la descripción del hero («Diseñamos…»)");
      assert.ok(r.mayor > r.desc, `la mayor línea del titular mide ${Math.round(r.mayor)} px² y la descripción ${Math.round(r.desc)} px²`);
    },
  },
  {
    id: "§7 · Cabecera · logo claro y oscuro",
    tarea: "T07",
    pendiente: true,
    async fn(h) {
      for (const ancho of [390, 1440]) {
        const page = await h.abrir("", { ancho });
        const pintura = () =>
          page.$eval(SEL.logoCabecera, (svg) => __c.pinturaSvg(svg).map((c) => c.slice(0, 3)));
        const tiene = (lista, color) => lista.some((c) => igualColor(c, color));
        const arriba = await pintura();
        assert.ok(tiene(arriba, C.tinta), `${ancho} px: arriba, el logo no tiene texto en --tinta`);
        assert.ok(tiene(arriba, C.limaOscuro), `${ancho} px: arriba, la línea del logo no es #5F7D00`);
        assert.ok(!tiene(arriba, C.superficie), `${ancho} px: arriba, el logo lleva --superficie sobre claro`);
        const bajoCabecera = await page.$eval("header", (e) => e.getBoundingClientRect().bottom);
        await h.ruedaHasta(page, "[data-superficie]", bajoCabecera - 20);
        await page.waitForTimeout(600);
        const abajo = await pintura();
        assert.ok(tiene(abajo, C.hueso), `${ancho} px: tras cruzar la superficie, el texto del logo no es --hueso`);
        assert.ok(tiene(abajo, C.superficie), `${ancho} px: tras cruzar la superficie, la línea no es --superficie`);
        assert.ok(!tiene(abajo, C.tinta), `${ancho} px: tras cruzar la superficie, queda --tinta en el logo`);
      }
    },
  },
  {
    id: "§7 · Hero · inactividad (5 s, una vuelta, 15 s, Pausar)",
    tarea: "T08",
    pendiente: true,
    async fn(h) {
      // Quieto: a los 5 s cambia de pozo, y así hasta cuatro cambios; después se para.
      const page = await h.abrir("", { ancho: 1440 });
      await page.mouse.move(5, 5); // lejos del hero (pasar el ratón cuenta como gesto)
      await registrarCambiosDePozo(page);
      await page.waitForTimeout(4300);
      assert.equal(await cambiosDePozo(page), 0, "antes de 5 s quieto ya cambia de pozo");
      await page.waitForTimeout(1500);
      assert.equal(await cambiosDePozo(page), 1, "a los 5 s quieto no cambia de pozo");
      await page.waitForTimeout(16000);
      assert.equal(await cambiosDePozo(page), 4, `tras una vuelta hay ${await cambiosDePozo(page)} cambios, no 4`);
      await page.waitForTimeout(7000);
      assert.equal(await cambiosDePozo(page), 4, "tras la vuelta sigue cambiando de pozo");

      // Tras tocar, 15 s sin cambios automáticos.
      const p2 = await h.abrir("", { ancho: 1440 });
      await p2.mouse.move(5, 5);
      await p2.locator(SEL.objetosHero).nth(2).click();
      await p2.mouse.move(5, 5);
      await registrarCambiosDePozo(p2);
      await p2.waitForTimeout(14500);
      assert.equal(await cambiosDePozo(p2), 0, "tras tocar un objeto cambia solo antes de 15 s");

      // Con «Pausar ejemplos» pulsado, nada en 20 s.
      const p3 = await h.abrir("", { ancho: 1440 });
      const pausar = p3.getByRole("button", { name: "Pausar ejemplos" });
      await pausar.click();
      await p3.mouse.move(5, 5);
      assert.equal(
        await p3.getByRole("button", { name: /Seguir con los ejemplos|Pausar ejemplos/ }).getAttribute("aria-pressed"),
        "true",
        "«Pausar ejemplos» no queda con aria-pressed=true",
      );
      await registrarCambiosDePozo(p3);
      await p3.waitForTimeout(20000);
      assert.equal(await cambiosDePozo(p3), 0, "con los ejemplos pausados cambia de pozo");
    },
  },
  {
    id: "§7 · Hero · aria-live solo tras un gesto",
    tarea: "T08",
    pendiente: true,
    async fn(h) {
      const page = await h.abrir("", { ancho: 1440 });
      await page.mouse.move(5, 5);
      assert.equal(await page.locator(SEL.lecturaViva).count(), 1, `no hay una región aria-live en el hero (${SEL.lecturaViva})`);
      assert.equal(await page.locator(SEL.lecturaAuto).count(), 1, `no hay lectura automática en el hero (${SEL.lecturaAuto})`);
      await page.evaluate(({ viva, auto }) => {
        const v = document.querySelector(viva);
        const a = document.querySelector(auto);
        window.__vivos = { viva: 0, auto: 0 };
        const obs = (el, k) =>
          el && new MutationObserver(() => window.__vivos[k]++).observe(el, { subtree: true, childList: true, characterData: true });
        obs(v, "viva");
        obs(a, "auto");
      }, { viva: SEL.lecturaViva, auto: SEL.lecturaAuto });
      await page.waitForTimeout(11000); // dos cambios automáticos
      const quieto = await page.evaluate(() => window.__vivos);
      assert.ok(quieto.auto > 0, `la lectura automática (${SEL.lecturaAuto}) no cambia sola`);
      assert.equal(quieto.viva, 0, "la región aria-live cambia sin que nadie toque el hero");
      await page.locator(SEL.objetosHero).nth(1).click();
      await page.waitForTimeout(800);
      const tocado = await page.evaluate(() => window.__vivos);
      assert.ok(tocado.viva > 0, "tras tocar un objeto, la región aria-live no cambia");
    },
  },
  {
    id: "§7 · Hero · tirador táctil y scroll fuera de él",
    tarea: "T08",
    pendiente: true,
    async fn(h) {
      const page = await h.abrir("", { ancho: 390, alto: 844, hasTouch: true, isMobile: true });
      const cdp = await page.context().newCDPSession(page);
      const toque = async (tipo, x, y) =>
        cdp.send("Input.dispatchTouchEvent", { type: tipo, touchPoints: tipo === "touchEnd" ? [] : [{ x, y }] });
      const ySup = () => page.$eval("[data-superficie]", (s) => s.getBoundingClientRect().top);
      const caja = await page.locator(SEL.tirador).boundingBox();
      assert.ok(caja, "no se ve el tirador");
      const y0 = await ySup();
      const cx = caja.x + caja.width / 2;
      const cy = caja.y + caja.height / 2;
      await toque("touchStart", cx, cy);
      for (let i = 1; i <= 10; i++) {
        await toque("touchMove", cx, cy - i * 12);
        await page.waitForTimeout(16);
      }
      const yArrastre = await ySup();
      assert.ok(Math.abs(yArrastre - y0) > 30, `arrastrando el tirador la superficie solo se mueve ${Math.round(yArrastre - y0)} px`);
      assert.equal(await page.evaluate(() => scrollY), 0, "arrastrar el tirador hace scroll de la página");
      await toque("touchEnd");
      await page.waitForTimeout(1000);
      assert.ok(Math.abs((await ySup()) - y0) <= 1, "al soltar el tirador la superficie no vuelve a su sitio");
      // Un arrastre vertical sobre el hero, lejos del tirador, hace scroll de la página.
      const hx = 40;
      const hy = Math.min(700, y0 + 120);
      await toque("touchStart", hx, hy);
      for (let i = 1; i <= 10; i++) {
        await toque("touchMove", hx, hy - i * 25);
        await page.waitForTimeout(16);
      }
      await toque("touchEnd");
      await page.waitForTimeout(800);
      assert.ok((await page.evaluate(() => scrollY)) > 50, "un arrastre vertical sobre el hero, fuera del tirador, no hace scroll");
    },
  },
  {
    id: "§7 · Foco",
    tarea: "T08",
    pendiente: true,
    async fn(h) {
      const revisar = async (page, forzado) => {
        const fallos = [];
        let vistos = 0;
        for (let i = 0; i < 120; i++) {
          await page.keyboard.press("Tab");
          const r = await page.evaluate(
            ({ selTirador, C }) => {
              const el = document.activeElement;
              if (!el || el === document.body) return { fin: true };
              const cs = getComputedStyle(el);
              const nombre = `<${el.tagName.toLowerCase()}> «${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30)}»`;
              const res = { nombre, fallos: [] };
              const ancho = parseFloat(cs.outlineWidth);
              if (cs.outlineStyle === "none" || ancho < 2) res.fallos.push(`outline ${cs.outlineStyle} ${cs.outlineWidth}`);
              if (window.matchMedia("(forced-colors: active)").matches) return res;
              const r = el.getBoundingClientRect();
              const fondo = __c.fondoEn(Math.max(0, Math.min(innerWidth - 1, r.left + r.width / 2)), Math.max(0, Math.min(innerHeight - 1, r.top + r.height / 2)), el);
              const claro = fondo ? __c.luminancia(fondo) > 0.5 : false;
              const sombras = (cs.boxShadow.match(/rgba?\([^)]*\)/g) || []).map(__c.rgba);
              const es = (c, k) => c && Math.abs(c[0] - C[k][0]) < 4 && Math.abs(c[1] - C[k][1]) < 4 && Math.abs(c[2] - C[k][2]) < 4;
              const outline = __c.rgba(cs.outlineColor);
              if (el.matches(selTirador)) {
                if (!(sombras.some((c) => es(c, "tinta")) || es(outline, "tinta")) || !(sombras.some((c) => es(c, "hueso")) || es(outline, "hueso"))) {
                  res.fallos.push("el tirador no lleva el doble anillo tinta + hueso");
                }
                return res;
              }
              if (!sombras.length) res.fallos.push("sin la línea de abajo (box-shadow)");
              if (claro) {
                if (!es(outline, "tinta")) res.fallos.push(`sobre claro el recuadro es ${cs.outlineColor}`);
                if (sombras.length && !sombras.some((c) => es(c, "tinta"))) res.fallos.push("sobre claro la línea no es --tinta");
              } else {
                if (!es(outline, "hueso")) res.fallos.push(`sobre oscuro el recuadro es ${cs.outlineColor}`);
                if (sombras.length && !sombras.some((c) => es(c, "superficie"))) res.fallos.push("sobre oscuro la línea no es lima");
              }
              return res;
            },
            { selTirador: SEL.tirador, C },
          );
          if (r.fin) break;
          vistos++;
          if (r.fallos.length) fallos.push(`${r.nombre}: ${r.fallos.join(", ")}`);
        }
        assert.ok(vistos > 10, `${forzado}: solo ${vistos} elementos enfocables`);
        assert.deepEqual([...new Set(fallos)], [], `${forzado}: focos sin el recuadro y la línea`);
      };
      await revisar(await h.abrir("", { ancho: 1440 }), "normal");
      await revisar(await h.abrir("", { ancho: 1440, forcedColors: "active" }), "forced-colors");
    },
  },
  {
    id: "§7 · Proceso · broca y pasos; tabla con movimiento reducido",
    tarea: "T12",
    pendiente: true,
    async fn(h) {
      for (const ancho of [390, 1440]) {
        const page = await h.abrir("", { ancho });
        await h.ruedaHasta(page, "#proceso", 0);
        const vistos = new Set();
        for (let paso = 0; paso < 80 && vistos.size < 6; paso++) {
          const r = await page.evaluate(
            ({ broca, estratos, pasos }) => {
              const b = document.querySelector(broca);
              const es = [...document.querySelectorAll(estratos)];
              const ps = [...document.querySelectorAll(pasos)];
              if (!b || es.length !== 6 || ps.length !== 6) return { error: `broca ${!!b}, ${es.length} estratos, ${ps.length} pasos` };
              const rb = b.getBoundingClientRect();
              const punta = rb.bottom;
              const i = es.findIndex((e) => {
                const q = e.getBoundingClientRect();
                return punta >= q.top + 2 && punta <= q.bottom - 2;
              });
              return { i, activos: ps.map((p, k) => (p.classList.contains("es-activo") ? k : -1)).filter((k) => k >= 0) };
            },
            { broca: SEL.testigoBroca, estratos: SEL.testigoEstratos, pasos: SEL.pasosProceso },
          );
          assert.ok(!r.error, `${ancho} px: ${r.error}`);
          if (r.i >= 0) {
            assert.deepEqual(r.activos, [r.i], `${ancho} px: con la broca en el estrato ${r.i + 1}, los pasos encendidos son ${r.activos.map((k) => k + 1).join(", ") || "ninguno"}`);
            vistos.add(r.i);
          }
          await h.rueda(page, 120, { pasos: 1, pausa: 30 });
        }
        assert.equal(vistos.size, 6, `${ancho} px: la broca solo pasa por ${vistos.size} estratos`);
        const red = await h.abrir("", { ancho, reducedMotion: "reduce" });
        await tablaProcesoVisible(red, `${ancho} px, movimiento reducido`);
      }
    },
  },
  {
    id: "§7 · Fondo · se enciende en la portada y en /sectores/alojamientos-rurales/",
    tarea: "T13",
    pendiente: true,
    async fn(h) {
      for (const ancho of [390, 1440]) {
        await fondoSeEnciende(h, "", { ancho });
        await fondoSeEnciende(h, "sectores/alojamientos-rurales/", { ancho });
      }
    },
  },
  {
    id: "§7 · Hilo",
    tarea: "T14",
    pendiente: true,
    async fn(h) {
      for (const ancho of [360, 390, 1440]) {
        const page = await h.abrir("", { ancho });
        const alto = page.viewportSize().height;
        const fallos = [];
        let pinVisto = false;
        for (let vuelta = 0; vuelta < 200; vuelta++) {
          const r = await page.evaluate(
            ({ trazo, cabeza }) => {
              const cotas = [...document.querySelectorAll("[data-hilo]")].map((c) => ({
                texto: c.textContent.replace(/\s+/g, " ").trim(),
                top: c.getBoundingClientRect().top,
                alcanzada: c.classList.contains("es-alcanzada"),
              }));
              const proceso = document.getElementById("proceso");
              if (!proceso) return { error: "no hay #proceso" };
              const pr = proceso.getBoundingClientRect();
              const enPin = pr.top <= 1 && pr.bottom >= innerHeight - 1;
              // El trazo no pisa texto ni controles, salvo las cotas y el botón del Fondo.
              const p = document.querySelector(trazo);
              const pisa = [];
              if (p && p.getTotalLength) {
                const largo = p.getTotalLength();
                const m = p.getScreenCTM();
                const prohibidos = [
                  ...__c.textos(document.querySelector("main"), { soloEnPantalla: true })
                    .filter((t) => !t.el.closest("[data-hilo], [data-hilo-fin]"))
                    .flatMap((t) => t.rects.map((q) => ({ q, n: t.texto }))),
                  ...[...document.querySelectorAll("main a, main button, main input, main select, main textarea")]
                    .filter((e) => !e.closest("[data-hilo], [data-hilo-fin]") && __c.visible(e))
                    .map((e) => ({ q: e.getBoundingClientRect(), n: e.textContent.trim() || e.tagName })),
                ];
                for (let d = 0; d <= largo; d += 6) {
                  const pt = p.getPointAtLength(d).matrixTransform(m);
                  if (pt.y < 0 || pt.y > innerHeight) continue;
                  const tocado = prohibidos.find(({ q }) => pt.x >= q.left && pt.x <= q.right && pt.y >= q.top && pt.y <= q.bottom);
                  if (tocado) pisa.push(`«${tocado.n.slice(0, 25)}»`);
                }
              }
              return { cotas, enPin, cabezaY: innerHeight * cabeza, hayTrazo: !!p, pisa: [...new Set(pisa)] };
            },
            { trazo: SEL.hiloTrazo, cabeza: 0.66 },
          );
          assert.ok(!r.error, `${ancho} px: ${r.error}`);
          assert.ok(r.hayTrazo, `${ancho} px: no hay trazo del hilo (${SEL.hiloTrazo})`);
          fallos.push(...r.pisa.map((n) => `${ancho} px: el trazo pisa ${n}`));
          const iProceso = r.cotas.findIndex((c) => c.texto.includes("−2"));
          assert.ok(iProceso >= 0, `${ancho} px: ninguna cota [data-hilo] lleva «−2»`);
          for (const [i, c] of r.cotas.entries()) {
            if (Math.abs(c.top - r.cabezaY) < 12) continue; // justo en la cabeza: cualquiera vale
            const debe = r.enPin ? i <= iProceso : c.top < r.cabezaY;
            if (c.alcanzada !== debe) fallos.push(`${ancho} px: «${c.texto}» ${c.alcanzada ? "alcanzada" : "sin alcanzar"} con la cota a ${Math.round(c.top)} px${r.enPin ? " durante el pin" : ""}`);
          }
          if (r.enPin) {
            pinVisto = true;
            const pasadas = r.cotas.filter((c, i) => i > iProceso && c.alcanzada);
            if (pasadas.length) fallos.push(`${ancho} px: durante el pin la cabeza pasa de «−2»`);
          }
          const fin = await page.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 2);
          if (fin) break;
          await h.rueda(page, alto * 0.25, { pasos: 1, pausa: 40 });
        }
        assert.ok(pinVisto, `${ancho} px: no se vio el pin del proceso`);
        assert.deepEqual([...new Set(fallos)].slice(0, 10), [], `${ancho} px: el hilo no cumple`);
      }
    },
  },
  {
    id: "§7 · Interiores",
    tarea: "T15",
    pendiente: true,
    async fn(h) {
      const paginas = [...INTERIORES, ...SECTORES.map((ruta) => ({ ruta, cota: "−4 · Sectores" }))];
      for (const ancho of [390, 1440]) {
        for (const pg of paginas) {
          const page = await h.abrir(pg.ruta, { ancho, cortina: true });
          await page.waitForTimeout(300);
          const r = await page.evaluate(() => {
            const main = document.querySelector("main");
            const cab = document.querySelector("header").getBoundingClientRect();
            const fondo = __c.fondoEn(innerWidth / 2, Math.min(innerHeight - 1, cab.bottom + 8), main);
            return { fondo, texto: main.textContent.replace(/\s+/g, " ") };
          });
          assert.ok((await h.gancho(page)).cortinaVista === false, `${ancho} px, /${pg.ruta}: sale la cortina`);
          assert.ok(r.fondo && igualColor(r.fondo, C.hondo), `${ancho} px, /${pg.ruta}: bajo la cabecera el fondo no es --hondo`);
          assert.ok(r.texto.includes(pg.cota), `${ancho} px, /${pg.ruta}: no lleva la cota «${pg.cota}»`);
        }
        // /sectores/alojamientos-rurales/ acaba en el bloque Fondo.
        const sector = await h.abrir("sectores/alojamientos-rurales/", { ancho });
        const ultimo = await sector.evaluate(() => {
          const main = document.querySelector("main");
          const ultima = [...main.querySelectorAll("section")].filter((s) => !s.parentElement.closest("section")).at(-1);
          return ultima ? ultima.textContent.includes("Empezar la auditoría") : false;
        });
        assert.ok(ultimo, `${ancho} px: /sectores/alojamientos-rurales/ no acaba en el Fondo`);
        // /estudio/ → «/#equipo» llega a la sección.
        const estudio = await h.abrir("estudio/", { ancho });
        await estudio.locator('main a[href$="/#equipo"]').first().click();
        await estudio.waitForURL((u) => u.hash === "#equipo", { timeout: 8000 });
        await estudio.waitForTimeout(2500);
        const top = await estudio.$eval("#equipo", (e) => e.getBoundingClientRect().top);
        assert.ok(top > -5 && top < 220, `${ancho} px: /estudio/ → /#equipo deja la sección a ${Math.round(top)} px`);
        // 404: iceberg sin superficie.
        const p404 = await h.abrir("no-existe-esta-pagina/", { ancho });
        const iceberg = await p404.evaluate((lima) => {
          const svgs = [...document.querySelectorAll("main svg")].filter((s) => __c.visible(s) && s.getBoundingClientRect().width > 60);
          return {
            hay: svgs.length > 0,
            lima: svgs.some((s) => __c.pinturaSvg(s).some((c) => Math.abs(c[0] - lima[0]) < 4 && Math.abs(c[1] - lima[1]) < 4 && Math.abs(c[2] - lima[2]) < 4)),
          };
        }, C.superficie);
        assert.ok(iceberg.hay, `${ancho} px: la 404 no pinta el iceberg`);
        assert.ok(!iceberg.lima, `${ancho} px: el iceberg de la 404 lleva la superficie lima`);
      }
    },
  },
  {
    id: "§7 · Sin scroll horizontal a 360 y 390 px",
    tarea: "T15",
    pendiente: true,
    async fn(h) {
      const rutas = ["", ...INTERIORES.map((i) => i.ruta), ...SECTORES];
      const fallos = [];
      for (const ancho of [360, 390]) {
        for (const ruta of rutas) {
          const page = await h.abrir(ruta, { ancho });
          await page.waitForTimeout(400);
          const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth }));
          if (r.sw > r.w) fallos.push(`${ancho} px /${ruta}: scrollWidth ${r.sw}`);
        }
      }
      assert.deepEqual(fallos, [], "páginas con scroll horizontal");
    },
  },
  {
    id: "§7 · 001 sigue cumpliendo",
    tarea: "T16",
    pendiente: true,
    async fn(h) {
      // 001 §7, con los deltas de la 002 §8.
      for (const ancho of [390, 1440]) {
        // Portada: responder las 7, de 3 a 5 mejoras y la query en la URL.
        const page = await h.abrir("", { ancho, permisos: ["clipboard-read", "clipboard-write"] });
        const totalPortada = await page.$eval('#diagnostico [role="progressbar"]', (e) => e.getAttribute("aria-valuemax"));
        assert.equal(totalPortada, "7", `${ancho} px: el diagnóstico de la portada tiene ${totalPortada} preguntas`);
        await responderDiagnostico(page);
        const mejoras = await page.locator("#diagnostico ol > li").count();
        assert.ok(mejoras >= 3 && mejoras <= 5, `${ancho} px: ${mejoras} mejoras`);
        const url = new URL(page.url());
        assert.ok(url.searchParams.get("v") && url.searchParams.get("s"), `${ancho} px: la URL no lleva v y s (${url.search})`);

        // La misma URL en una pestaña nueva: el resultado sale directamente.
        const otra = await h.abrir(url.pathname.replace(h.base, "").replace(/^\//, "") + url.search, { ancho });
        await otra.locator('#diagnostico :text("Tu diagnóstico")').waitFor({ timeout: 10000 });

        // La query completa de la 001 (s=dental) en la portada: resultado directo.
        const dental = await h.abrir(`?${QUERY_001}`, { ancho, permisos: ["clipboard-read", "clipboard-write"] });
        await dental.locator('#diagnostico :text("Tu diagnóstico")').waitFor({ timeout: 10000 });

        // «Copiar el enlace» da la URL de la página dental, y al abrirla el resultado sale
        // directamente, sin cortina y con la página en #diagnostico (delta 002 §8).
        await dental.getByRole("button", { name: "Copiar el enlace a este diagnóstico" }).click();
        await dental.waitForTimeout(300);
        const copiada = await dental.evaluate(() => navigator.clipboard.readText());
        assert.ok(copiada.includes(`${h.base}/sectores/clinicas-dentales/`), `${ancho} px: el enlace copiado es ${copiada}`);
        assert.ok(copiada.includes("#diagnostico"), `${ancho} px: el enlace copiado no lleva #diagnostico`);
        const u2 = new URL(copiada);
        const abierta = await h.abrir(u2.pathname.replace(h.base, "").replace(/^\//, "") + u2.search + u2.hash, { ancho, cortina: true });
        await abierta.locator('#diagnostico :text("Tu diagnóstico")').waitFor({ timeout: 10000 });
        await abierta.waitForTimeout(2500);
        assert.ok(!(await h.gancho(abierta)).cortinaVista, `${ancho} px: la página de sector saca la cortina`);
        const top = await abierta.$eval("#diagnostico", (e) => e.getBoundingClientRect().top);
        assert.ok(top > -5 && top < 220, `${ancho} px: la página de sector no queda en #diagnostico (${Math.round(top)} px)`);

        // «Llevar a la auditoría»: aviso, campos rellenos y URL sin parámetros.
        await dental.getByRole("link", { name: "Llevar estas respuestas a la auditoría" }).click();
        await dental.waitForURL((u) => u.pathname.endsWith("/auditoria/"), { timeout: 10000 });
        await dental.waitForTimeout(1200);
        // El formulario va por pasos: los campos se leen del borrador que guarda.
        const aud = await dental.evaluate((clave) => {
          let respuestas = {};
          try {
            respuestas = JSON.parse(localStorage.getItem(clave) || "{}").respuestas || {};
          } catch {}
          return {
            query: location.search,
            aviso: /Hemos puesto \d+ respuestas?/.test(document.body.textContent),
            sinMarca: ["P2", "P7", "P14", "P35"].filter((p) => !String(respuestas[p] || "").endsWith(" (del diagnóstico rápido)")),
          };
        }, CLAVE_BORRADOR);
        assert.equal(aud.query, "", `${ancho} px: /auditoria/ se queda con «${aud.query}»`);
        assert.ok(aud.aviso, `${ancho} px: /auditoria/ no avisa de las respuestas puestas`);
        assert.deepEqual(aud.sinMarca, [], `${ancho} px: campos de la auditoría sin rellenar desde el diagnóstico`);
      }
      // Las tres páginas de sector: sin pregunta de sector, «Ejemplo» en #asistente y el
      // bloque de plantillas en rural y despachos, no en dental.
      for (const ruta of SECTORES) {
        const page = await h.abrir(ruta, { ancho: 1440 });
        const r = await page.evaluate(() => ({
          total: document.querySelector('#diagnostico [role="progressbar"]')?.getAttribute("aria-valuemax"),
          ejemplo: /Ejemplo/.test(document.getElementById("asistente")?.textContent || ""),
          plantillas: !!document.getElementById("plantillas-sector"),
          noscript: [...document.querySelectorAll("#diagnostico noscript")].some((n) => /auditoria/.test(n.textContent)),
        }));
        assert.equal(r.total, "6", `/${ruta}: el diagnóstico tiene ${r.total} preguntas, no 6`);
        assert.ok(r.ejemplo, `/${ruta}: #asistente sin «Ejemplo»`);
        assert.equal(r.plantillas, !ruta.includes("dentales"), `/${ruta}: bloque de plantillas ${r.plantillas ? "sí" : "no"}`);
      }
      // noindex en toda página.
      for (const ruta of ["", ...INTERIORES.map((i) => i.ruta), ...SECTORES]) {
        const page = await h.abrir(ruta, { ancho: 1440, js: false });
        const robots = await page.$eval('meta[name="robots"]', (m) => m.content).catch(() => "");
        assert.ok(/noindex/.test(robots), `/${ruta}: sin noindex`);
      }
    },
  },
  {
    id: "§7 · Mando",
    tarea: "T17",
    pendiente: true,
    async fn(h) {
      const sinMando = await h.abrir("", { ancho: 1440 });
      assert.equal(await sinMando.locator(SEL.mando).count(), 0, "sin ?revision el mando está en el DOM");
      assert.equal(await sinMando.getByRole("button", { name: "Sobria" }).count(), 0, "sin ?revision hay un botón «Sobria»");

      const page = await h.abrir("?revision&x=1#servicios", { ancho: 1440 });
      const porDebajo = page.getByRole("button", { name: "Por debajo" });
      const sobria = page.getByRole("button", { name: "Sobria" });
      assert.equal(await porDebajo.getAttribute("aria-pressed"), "true", "«Por debajo» no sale pulsado");
      await sobria.click();
      await page.waitForTimeout(300);
      let u = new URL(page.url());
      assert.ok(await page.evaluate(() => document.documentElement.classList.contains("densidad-sobria")), "«Sobria» no pone densidad-sobria");
      assert.equal(await sobria.getAttribute("aria-pressed"), "true", "«Sobria» no queda pulsado");
      assert.equal(u.searchParams.get("revision"), "sobria", `la URL no dice revision=sobria (${u.search})`);
      assert.equal(u.searchParams.get("x"), "1", "el cambio pierde los demás parámetros");
      assert.equal(u.hash, "#servicios", "el cambio pierde el #hash");
      await porDebajo.click();
      await page.waitForTimeout(300);
      u = new URL(page.url());
      assert.ok(!(await page.evaluate(() => document.documentElement.classList.contains("densidad-sobria"))), "«Por debajo» no quita densidad-sobria");
      assert.ok(u.searchParams.has("revision") && u.searchParams.get("revision") !== "sobria", `volver a «Por debajo» deja ${u.search}`);
      assert.equal(u.searchParams.get("x"), "1", "volver a «Por debajo» pierde los demás parámetros");
      assert.equal(u.hash, "#servicios", "volver a «Por debajo» pierde el #hash");

      // ?revision=sobria pinta Sobria desde el primer fotograma, sin dorsales ni conducto y con el recuento.
      for (const ancho of [390, 1440]) {
        const s = await h.abrir("?revision=sobria", { ancho });
        const g = await h.gancho(s);
        assert.ok(/densidad-sobria/.test(g.clasesDCL || ""), `${ancho} px: en el DOMContentLoaded no hay densidad-sobria`);
        assert.ok(/densidad-sobria/.test(g.clasesPrimerFotograma || ""), `${ancho} px: el primer fotograma no es Sobria`);
        const r = await s.evaluate(
          ({ dorsal, hilo }) => ({
            dorsales: [...document.querySelectorAll(dorsal)].filter((d) => __c.visible(d)).length,
            hilo: [...document.querySelectorAll(hilo)].filter((d) => __c.visible(d)).length,
            recuento: /\d+ sectores · \d+ bases · 2 semanas/.test(document.body.textContent.replace(/\s+/g, " ")),
          }),
          { dorsal: SEL.dorsal, hilo: SEL.hiloTrazo },
        );
        assert.equal(r.dorsales, 0, `${ancho} px: en Sobria se ven ${r.dorsales} dorsales`);
        assert.equal(r.hilo, 0, `${ancho} px: en Sobria se ve el conducto`);
        assert.ok(r.recuento, `${ancho} px: en Sobria no está «N sectores · N bases · 2 semanas»`);
      }
    },
  },
  {
    id: "§7 · Fondo y proceso en Sobria",
    tarea: "T17",
    pendiente: true,
    async fn(h) {
      for (const ancho of [390, 1440]) {
        const page = await h.abrir("?revision=sobria", { ancho });
        await tablaProcesoVisible(page, `${ancho} px, Sobria`);
        await fondoSeEnciende(h, "?revision=sobria", { ancho });
      }
    },
  },
  {
    id: "§7 · Contraste real",
    tarea: "T17",
    pendiente: true,
    async fn(h) {
      const notas = [];
      for (const ancho of [390, 1440]) {
        for (const densidad of ["", "?revision=sobria"]) {
          for (const ruta of OCHO) {
            const page = await h.abrir(ruta + densidad, { ancho });
            if (ruta === "") {
              // Un pozo encendido (el 2) y los demás en reposo.
              const objetos = page.locator(SEL.objetosHero);
              if (await objetos.count()) {
                await objetos.nth(1).click();
                await page.mouse.move(5, 5);
                await page.waitForTimeout(1600);
              }
            }
            const nota = await contrasteDePagina(h, page, `${ancho} px /${ruta}${densidad}`);
            if (nota) notas.push(nota);
            await page.context().close();
          }
        }
      }
      return notas.join(" · ");
    },
  },
  {
    id: "§7 · Glifos: ningún texto visible con ← → ★ ↕ (PD-4)",
    tarea: "T18",
    pendiente: true,
    async fn(h) {
      const fallos = [];
      for (const ancho of [390, 1440]) {
        for (const ruta of OCHO) {
          const page = await h.abrir(ruta, { ancho });
          const r = await page.evaluate(() =>
            __c
              .textos(document.body)
              .filter((t) => /[←→★↕]/.test(t.texto))
              .map((t) => t.texto.slice(0, 40)),
          );
          fallos.push(...r.map((t) => `${ancho} px /${ruta}: «${t}»`));
          await page.context().close();
        }
      }
      assert.deepEqual([...new Set(fallos)], [], "textos visibles con glifos fuera del subconjunto");
    },
  },
];

// ─── Ejecución ─────────────────────────────────────────────────────────────────

const filtros = solo ? solo.split(",").map((s) => s.trim()).filter(Boolean) : null;
const elegidas = filtros
  ? comprobaciones.filter((c) => filtros.some((f) => c.tarea === f || c.id.includes(f)))
  : comprobaciones;
if (!elegidas.length) {
  console.error(`Ninguna comprobación casa con --solo ${solo}`);
  process.exit(1);
}

const activas = elegidas.filter((c) => forzar || !c.pendiente);
let srv;
let nav;
let urlBase;
let oks = 0;
let fallos = 0;
let pendientes = 0;
try {
  if (activas.length) {
    srv = await crearServidor({ raiz, puerto, base });
    const titulo = await comprobarTitulo(srv.url);
    urlBase = srv.url;
    console.log(`Comprobando «${titulo}» en ${urlBase}${forzar ? " (con --forzar: también las pendientes)" : ""}\n`);
    nav = await chromium.launch();
  }
  for (const c of elegidas) {
    if (c.pendiente && !forzar) {
      pendientes++;
      console.log(`PENDIENTE  ${c.tarea}  ${c.id}`);
      continue;
    }
    const h = crearAyudas(nav, urlBase);
    const t = Date.now();
    try {
      const nota = await c.fn(h);
      oks++;
      console.log(`OK         ${c.tarea}  ${c.id}  (${((Date.now() - t) / 1000).toFixed(1)} s)${nota ? `\n           ${nota}` : ""}`);
    } catch (e) {
      fallos++;
      const msg = String(e.message).split("\n").slice(0, 14).join("\n           ");
      console.log(`FALLO      ${c.tarea}  ${c.id}\n           ${msg}`);
    } finally {
      await h.cerrarTodo();
    }
    if (c.pendiente) pendientes++;
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (nav) await nav.close();
  if (srv) await srv.cerrar();
}

console.log(`\n${oks} OK · ${fallos} FALLO · ${pendientes} PENDIENTE${estricto ? " (estricto)" : ""}`);
if (process.exitCode !== 1) process.exitCode = fallos || (estricto && pendientes) ? 1 : 0;
