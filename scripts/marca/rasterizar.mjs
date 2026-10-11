// Rasteriza los SVG de marca/ con Chromium (Playwright del repo).
// Uso: node rasterizar.mjs <carpeta-del-repo> <carpeta-temporal>
import { createRequire } from "node:module";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [repo, tmp] = process.argv.slice(2);
const require = createRequire(join(repo, "package.json"));
const { chromium } = require("playwright");

const marca = join(repo, "marca");
const png = join(marca, "png");
mkdirSync(png, { recursive: true });
mkdirSync(tmp, { recursive: true });

const leer = (f) => readFileSync(join(marca, f), "utf8");

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function svgA(svg, ancho, alto, salida, fondo = "transparent") {
  await page.setViewportSize({ width: ancho, height: alto });
  const cuerpo = svg.replace(/width="[^"]*" height="[^"]*"/, `width="${ancho}" height="${alto}"`);
  await page.setContent(
    `<html><body style="margin:0;background:${fondo}">${cuerpo}</body></html>`
  );
  await page.screenshot({ path: salida, omitBackground: fondo === "transparent", clip: { x: 0, y: 0, width: ancho, height: alto } });
}

// Logos a 2000 px de ancho, fondo transparente
for (const p of ["oscuro", "claro"]) {
  const svg = leer(`undertactics-logo-${p}.svg`);
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
  const alto = Math.round((2000 * h) / w);
  await svgA(svg, 2000, alto, join(png, `undertactics-logo-${p}.png`));
}

// Icono (símbolo en cuadrado oscuro): redes y favicons
const icono = leer("undertactics-icono.svg");
for (const t of [1024, 512]) await svgA(icono, t, t, join(png, `undertactics-icono-${t}.png`));
for (const t of [16, 32, 48]) await svgA(icono, t, t, join(tmp, `fav-${t}.png`));

// Apple pone su propia máscara: cuadrado sin esquinas redondeadas
await svgA(icono.replace('rx="10.5"', 'rx="0"'), 180, 180, join(repo, "src", "app", "apple-icon.png"));

// Imagen para compartir (Open Graph) 1200×630
const logoOscuro = leer("undertactics-logo-oscuro.svg").replace(/width="[^"]*" height="[^"]*"/, 'width="640"');
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<html><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@500&family=JetBrains+Mono:wght@400&display=block">
</head><body style="margin:0;width:1200px;height:630px;background:#08090a;display:flex;flex-direction:column;justify-content:center;padding:0 96px;box-sizing:border-box;gap:44px">
${logoOscuro}
<p style="margin:0;font:500 46px/1.15 'Instrument Sans',sans-serif;letter-spacing:-.02em;color:#f2f3f4;max-width:20ch">Lo que hace funcionar tu negocio, por debajo.</p>
<p style="margin:0;font:400 18px/1 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:#8a9099">Auditoría · Web · Automatización · Vídeo</p>
</body></html>`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready.then(() => 0));
await page.screenshot({ path: join(repo, "public", "og.png") });

await browser.close();
writeFileSync(join(tmp, "hecho.txt"), "ok");
console.log("ok");
