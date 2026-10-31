/* Comprobación de la portada «consultora» (rama exp/consultora). Un solo navegador, que se
   cierra siempre; escala 1; movimiento reducido salvo en la prueba de entrada. Sin capturas
   y sin 3D (esta web no tiene). El `comprobar.mjs` de la spec 002 no vale aquí: da por
   hechas las siete cotas de la portada anterior.

     node scripts/comprobar-consultora.mjs [--url http://localhost:3100/]
*/
import assert from "node:assert/strict";
import { chromium } from "playwright";

const argUrl = process.argv.indexOf("--url");
const URL_BASE = argUrl > -1 ? process.argv[argUrl + 1] : "http://localhost:3100/";
const ENDPOINT = "**/functions/v1/solicitar-auditoria";
const SECCIONES = ["inicio", "problemas", "servicios", "soluciones", "proceso", "plantillas", "equipo", "faq", "contacto"];

const resultados = [];
async function prueba(nombre, fn) {
  try {
    await fn();
    resultados.push({ nombre, ok: true });
    console.log(`  ok  ${nombre}`);
  } catch (e) {
    resultados.push({ nombre, ok: false, error: e.message });
    console.log(`  FALLA  ${nombre}\n        ${e.message.split("\n")[0]}`);
  }
}

const browser = await chromium.launch();
try {
  async function abrir(ancho, alto, { movimiento = "reduce" } = {}) {
    const ctx = await browser.newContext({
      viewport: { width: ancho, height: alto },
      deviceScaleFactor: 1,
      reducedMotion: movimiento,
    });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("undertactics:aviso-cookies:v1", new Date().toISOString());
        sessionStorage.setItem("undertactics-preloader-seen", "1");
      } catch {}
    });
    const page = await ctx.newPage();
    const consola = [];
    page.on("pageerror", (e) => consola.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") consola.push(`console: ${m.text()}`);
    });
    page.on("requestfailed", (r) => consola.push(`requestfailed: ${r.url()}`));
    await page.goto(URL_BASE, { waitUntil: "load" });
    await page.waitForSelector("#contacto");
    return { ctx, page, consola };
  }

  for (const [ancho, alto] of [
    [1440, 900],
    [768, 1024],
    [390, 844],
  ]) {
    console.log(`\n${ancho}×${alto}`);
    const { ctx, page, consola } = await abrir(ancho, alto);

    await prueba(`${ancho}: las nueve secciones, en orden, y un solo H1`, async () => {
      const ids = await page.$$eval("main > section[id], section[id]", (els) => els.map((e) => e.id));
      const orden = SECCIONES.filter((id) => ids.includes(id));
      assert.deepEqual(orden, SECCIONES, `ids encontrados: ${ids.join(", ")}`);
      const tops = await page.evaluate(
        (s) => s.map((id) => document.getElementById(id).getBoundingClientRect().top + scrollY),
        SECCIONES,
      );
      assert.deepEqual([...tops].sort((a, b) => a - b), tops, "las secciones no van en orden de arriba abajo");
      assert.equal(await page.locator("h1").count(), 1, "debe haber un solo H1");
      const h1 = (await page.locator("h1").innerText()).replace(/\s+/g, " ");
      assert.match(h1, /Lo de arriba vende\. Lo de abajo trabaja\./);
    });

    await prueba(`${ancho}: sin desbordamiento horizontal`, async () => {
      const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      assert.ok(sw <= iw, `scrollWidth ${sw} > ${iw}`);
    });

    await prueba(`${ancho}: titular del hero a cada lado de la superficie`, async () => {
      const r = await page.evaluate(() => {
        const sup = document.querySelector(".hero-superficie").getBoundingClientRect();
        const l1 = document.querySelector(".hero-l1").getBoundingClientRect();
        const l2 = document.querySelector(".hero-l2").getBoundingClientRect();
        return { sup: sup.top, l1b: l1.bottom, l2t: l2.top };
      });
      assert.ok(r.l1b <= r.sup + 2, `la línea 1 (${Math.round(r.l1b)}) cruza la superficie (${Math.round(r.sup)})`);
      assert.ok(r.l2t >= r.sup - 2, `la línea 2 (${Math.round(r.l2t)}) queda sobre la superficie (${Math.round(r.sup)})`);
    });

    await prueba(`${ancho}: imágenes con alt y anclas internas que existen`, async () => {
      const sinAlt = await page.$$eval("img", (els) => els.filter((i) => i.getAttribute("alt") === null).map((i) => i.src));
      assert.deepEqual(sinAlt, [], "imágenes sin alt");
      const rotas = await page.$$eval('a[href^="#"], a[href^="/#"]', (els) =>
        els
          .map((a) => a.getAttribute("href").replace(/^\//, ""))
          .filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
      );
      assert.deepEqual(rotas, [], "anclas sin destino");
    });

    await prueba(`${ancho}: FAQ se abre y se cierra con teclado`, async () => {
      const segunda = page.locator(".faq-item summary").nth(1);
      await segunda.scrollIntoViewIfNeeded();
      await segunda.focus();
      await page.keyboard.press("Enter");
      assert.equal(await page.locator(".faq-item").nth(1).getAttribute("open"), "");
      await page.keyboard.press("Enter");
      assert.equal(await page.locator(".faq-item").nth(1).getAttribute("open"), null);
    });

    await prueba(`${ancho}: sin errores de consola`, async () => {
      assert.deepEqual(consola, []);
    });

    await ctx.close();
  }

  console.log("\nFormulario (1280×800, envío simulado: no sale nada a Supabase)");
  {
    const { ctx, page, consola } = await abrir(1280, 800);

    await prueba("vacío: muestra los errores y no envía", async () => {
      let enviado = false;
      await page.route(ENDPOINT, (r) => {
        enviado = true;
        return r.fulfill({ status: 200, body: "{}" });
      });
      await page.locator("#contacto button[type=submit]").scrollIntoViewIfNeeded();
      await page.locator("#contacto button[type=submit]").click();
      const n = await page.locator(".contacto-error").count();
      assert.equal(n, 6, `esperaba 6 errores (nombre, empresa, email, tipo, mejorar y consentimiento), hay ${n}`);
      assert.equal(enviado, false);
      await page.unroute(ENDPOINT);
    });

    await prueba("válido: manda el mapeo esperado y confirma", async () => {
      let cuerpo = null;
      await page.route(ENDPOINT, async (r) => {
        if (r.request().method() === "OPTIONS") return r.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*" } });
        cuerpo = JSON.parse(r.request().postData());
        return r.fulfill({ status: 200, headers: { "access-control-allow-origin": "*" }, contentType: "application/json", body: JSON.stringify({ id: "x" }) });
      });
      await page.fill("#contacto-nombre", "Prueba Uno");
      await page.fill("#contacto-empresa", "Negocio de prueba");
      await page.fill("#contacto-email", "prueba@example.com");
      await page.selectOption("#contacto-tipo", "Clínica o salud");
      await page.fill("#contacto-mejorar", "Las citas por teléfono.");
      await page.check("#contacto-consentimiento");
      await page.locator("#contacto button[type=submit]").click();
      await page.waitForSelector(".contacto-hecho");
      assert.equal(cuerpo.negocio, "Negocio de prueba");
      assert.equal(cuerpo.sector, "Clínica o salud");
      assert.equal(cuerpo.contacto_email, "prueba@example.com");
      assert.equal(cuerpo.consentimiento, true);
      assert.equal(cuerpo.direccion_fiscal, "");
      assert.match(cuerpo.respuestas.P35, /Las citas por teléfono\./);
      assert.match(cuerpo.respuestas.P2, /Clínica o salud/);
      await page.unroute(ENDPOINT);
    });
    await ctx.close();

    // Fallo de red: el aviso sale con la salida por correo y el formulario sigue ahí.
    const { ctx: ctx2, page: p2 } = await abrir(1280, 800);
    await prueba("sin red: aviso con salida por correo y datos conservados", async () => {
      await p2.route(ENDPOINT, (r) => r.abort());
      await p2.fill("#contacto-nombre", "Prueba Dos");
      await p2.fill("#contacto-empresa", "Otro negocio");
      await p2.fill("#contacto-email", "dos@example.com");
      await p2.selectOption("#contacto-tipo", "Otro");
      await p2.fill("#contacto-mejorar", "Todo el papeleo.");
      await p2.check("#contacto-consentimiento");
      await p2.locator("#contacto button[type=submit]").click();
      await p2.waitForSelector(".contacto-aviso:not([hidden])");
      assert.match(await p2.locator(".contacto-aviso").innerText(), /escríbenos a/);
      assert.equal(await p2.inputValue("#contacto-empresa"), "Otro negocio");
    });
    void consola;
    await ctx2.close();
  }

  console.log("\nEntrada con movimiento (1280×800, una sola vez)");
  {
    const { ctx, page } = await abrir(1280, 800, { movimiento: "no-preference" });
    await prueba("los ejemplos terminan a la vista y el proceso llega al paso 06", async () => {
      await page.locator("#soluciones .maqueta").first().scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () => document.querySelector("#soluciones .caso-maqueta")?.classList.contains("es-en-vista"),
        null,
        { timeout: 8000 },
      );
      // El testigo del proceso va anclado (pin de GSAP): se baja con la rueda, como una
      // persona, hasta que el paso encendido es el 06.
      await page.waitForSelector("#proceso.es-con-testigo", { timeout: 8000 });
      await page.mouse.move(640, 400);
      const enElSeis = () =>
        page.evaluate(() => document.querySelector("#proceso .proceso-paso.es-activo .proceso-paso-num")?.textContent === "06");
      for (let i = 0; i < 60 && !(await enElSeis()); i++) {
        await page.mouse.wheel(0, 600);
        await page.waitForTimeout(80);
      }
      assert.ok(await enElSeis(), "el proceso no llega al paso 06 bajando con la rueda");
      const ocultos = await page.$$eval("#soluciones .anim", (els) =>
        els.filter((e) => getComputedStyle(e).opacity === "0" && e.closest(".es-en-vista")).length,
      );
      assert.ok(ocultos <= 12, `piezas todavía a 0 de opacidad: ${ocultos}`);
    });
    await ctx.close();
  }
} finally {
  await browser.close();
}

const fallos = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - fallos.length}/${resultados.length} comprobaciones`);
process.exit(fallos.length ? 1 : 0);
