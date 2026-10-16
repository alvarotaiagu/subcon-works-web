/* Servidor estático de `out/` (spec 002 §3.15, plan PD-2). Resuelve como GitHub Pages:
     /                         → out/index.html
     /plantillas/              → out/plantillas/index.html (trailingSlash)
     /plantillas               → 301 a /plantillas/
     lo que no existe          → out/404.html con estado 404
   Con `--base /subcon-works-web` (build con GITHUB_ACTIONS=true) solo sirve lo que cuelga
   de esa base, como Pages; lo demás da 404.

   npm run servir                                  → http://127.0.0.1:4302/
   npm run servir -- --puerto 4301                 → otro puerto
   npm run servir -- --base /subcon-works-web      → build de CI
   npm run servir -- --raiz otra/carpeta
   npm run servir -- --host 0.0.0.0                → visible en la red local (móvil)

   Puerto propio: si ya está ocupado, falla con un error (no se queda con el de otra sesión).
*/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PUERTO_POR_DEFECTO = 4302;
export const RAIZ_POR_DEFECTO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
/** Lo que tiene que decir el `<title>` de la web servida (comprobar.mjs y medir.mjs lo miran). */
export const TITULO_ESPERADO = "Undertactics";
/** Claves de la web que comprobar.mjs y medir.mjs ponen antes de cargar (AvisoCookies.tsx, lib/scriptCabeza.ts). */
export const CLAVE_COOKIES = "undertactics:aviso-cookies:v1";
export const CLAVE_CORTINA = "undertactics-preloader-seen";

export const tipos = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".webmanifest": "application/manifest+json",
};

/** "/subcon-works-web/" → "/subcon-works-web"; "" o "/" → "". */
export function normalizarBase(base) {
  if (!base || base === "/") return "";
  return "/" + base.replace(/^\/+|\/+$/g, "");
}

/**
 * Traduce una URL a un fichero de `raiz`.
 * Devuelve `{ fichero }`, `{ redirigir }` (falta la barra final) o `null` (404).
 */
export function resolver(raiz, base, url) {
  let ruta;
  try {
    ruta = decodeURIComponent(url.split("?")[0].split("#")[0]);
  } catch {
    return null;
  }
  if (base) {
    if (ruta === base) return { redirigir: base + "/" };
    if (!ruta.startsWith(base + "/")) return null;
    ruta = ruta.slice(base.length);
  }
  const destino = path.join(raiz, ruta);
  if (destino !== raiz && !destino.startsWith(raiz + path.sep)) return null;
  if (fs.existsSync(destino) && fs.statSync(destino).isDirectory()) {
    if (!ruta.endsWith("/")) return { redirigir: base + ruta + "/" };
    const indice = path.join(destino, "index.html");
    return fs.existsSync(indice) ? { fichero: indice } : null;
  }
  if (fs.existsSync(destino)) return { fichero: destino };
  if (!path.extname(destino) && fs.existsSync(destino + ".html")) return { fichero: destino + ".html" };
  return null;
}

/**
 * Arranca el servidor y espera a que escuche.
 * @returns {Promise<{ servidor: http.Server, url: string, cerrar: () => Promise<void> }>}
 *          `url` acaba en "/" y ya lleva la base (p. ej. http://127.0.0.1:4302/subcon-works-web/).
 */
export function crearServidor({ raiz = RAIZ_POR_DEFECTO, puerto = PUERTO_POR_DEFECTO, base = "", host = "127.0.0.1" } = {}) {
  const raizAbs = path.resolve(raiz);
  const b = normalizarBase(base);
  if (!fs.existsSync(path.join(raizAbs, "index.html"))) {
    return Promise.reject(new Error(`No hay ${path.join(raizAbs, "index.html")}: ¿falta npm run build?`));
  }
  const pagina404 = path.join(raizAbs, "404.html");

  const servidor = http.createServer((req, res) => {
    const r = resolver(raizAbs, b, req.url || "/");
    if (r && r.redirigir) {
      const i = (req.url || "").indexOf("?");
      const query = i === -1 ? "" : req.url.slice(i);
      res.writeHead(301, { location: r.redirigir + query });
      res.end();
      return;
    }
    if (!r) {
      res.writeHead(404, { "content-type": tipos[".html"], "cache-control": "no-store" });
      res.end(req.method === "HEAD" ? undefined : fs.existsSync(pagina404) ? fs.readFileSync(pagina404) : "404");
      return;
    }
    const datos = fs.readFileSync(r.fichero);
    res.writeHead(200, {
      "content-type": tipos[path.extname(r.fichero).toLowerCase()] || "application/octet-stream",
      "content-length": datos.length,
      "cache-control": "no-store",
    });
    res.end(req.method === "HEAD" ? undefined : datos);
  });

  return new Promise((resolve, reject) => {
    servidor.once("error", (e) =>
      reject(
        e.code === "EADDRINUSE"
          ? new Error(`El puerto ${puerto} está ocupado (¿otra sesión?). Usa --puerto con otro.`)
          : e,
      ),
    );
    servidor.listen(puerto, host, () => {
      resolve({
        servidor,
        url: `http://${host === "0.0.0.0" || host === "::" ? "127.0.0.1" : host.includes(":") ? `[${host}]` : host}:${puerto}${b}/`,
        cerrar: () => new Promise((ok) => servidor.close(() => ok())),
      });
    });
  });
}

/** Pide `url` y comprueba que el `<title>` es el de esta web. Lanza si no. */
export async function comprobarTitulo(url) {
  const res = await fetch(url);
  const html = await res.text();
  const titulo = (/<title[^>]*>([^<]*)<\/title>/i.exec(html) || [])[1] || "";
  if (!titulo.includes(TITULO_ESPERADO)) {
    throw new Error(`En ${url} no está esta web: <title> = «${titulo}» (estado ${res.status}).`);
  }
  return titulo;
}

/** Lee `--nombre valor` de argv. */
export function argumento(argv, nombre, porDefecto) {
  const i = argv.indexOf(`--${nombre}`);
  if (i === -1) return porDefecto;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`Falta el valor de --${nombre}`);
  return v;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const puerto = Number(argumento(argv, "puerto", PUERTO_POR_DEFECTO));
  const base = argumento(argv, "base", "");
  const raiz = argumento(argv, "raiz", RAIZ_POR_DEFECTO);
  const host = argumento(argv, "host", "127.0.0.1");
  try {
    const { url } = await crearServidor({ raiz, puerto, base, host });
    const titulo = await comprobarTitulo(url);
    console.log(`«${titulo}» en ${url}`);
    console.log("Ctrl+C para parar.");
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
