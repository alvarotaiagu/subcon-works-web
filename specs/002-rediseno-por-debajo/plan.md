# 002 · Plan · Rediseño «Por debajo»

Spec: [spec.md](spec.md) (aprobada, D-024) · Tareas: [tasks.md](tasks.md)
Estado del plan: **aprobado (D-025)**, con PD-1 a PD-15.

## 1. Punto de partida (leído en el código, 2026-10-12)

- **Ramas.** `spec/rediseno-por-debajo` sale de `main` en `677a3ac` (la 001
  ya está hecha y comprobada en `main`). La carpeta principal
  `subcon-works-web` está en `feat/chatbot` con trabajo sin commitear: no se
  toca (P-05). El push a `main` **publica** en GitHub Pages
  (`.github/workflows/deploy.yml`: Node 20, `npm ci` y `npm run build`, sin
  lint ni tests).
- **Layout** (`src/app/layout.tsx`):
  - letras con `next/font/google` (Instrument Sans, Inter, JetBrains Mono);
  - `viewport` con `themeColor: "#08090a"` y `colorScheme: "dark"`;
  - ningún script en el `<head>`;
  - en el `<body>`, por orden: «Saltar al contenido» (`bg-accent`, l.81),
    `Preloader`, `PageTransition`, `SmoothScroll` (monta `useLenis` y
    `useScrollVelocity`), `Cursor`, `Grain`, `ScrollLine`, `AvisoCookies`,
    `Nav`, `<main id="contenido">` y `Footer`.
- **`next.config.ts`**: `output: "export"`, `trailingSlash: true`;
  `basePath` `/subcon-works-web` y `NEXT_PUBLIC_BASE_PATH` solo con
  `GITHUB_ACTIONS=true`. `withBasePath` vive en `src/lib/utils.ts`.
- **`globals.css`** (395 líneas):
  - tokens viejos en `:root` (`--bg-base`, `--bg-raised`, `--bg-sunken`,
    `--line`, `--text-primary`, `--text-muted`, `--text-faint`, `--accent`,
    `--accent-dim`) y sus `--color-*` en `@theme inline`;
  - clases que salen (`.grain-overlay`, `.umbral`, `.scroll-dot`,
    `.hero-eyebrow`, `.reticula-line`, `.plantilla-img`, `.plantilla-card`,
    `.rueda-rota`, `.cursor-*`);
  - `.mask-line` existe pero no la usa ningún componente.
- **Tokens viejos**: unos 340 usos en 54 ficheros. Los que más:
  `FormularioAuditoria.tsx` (37), `globals.css` (37),
  `herramientas/page.tsx` (32).
- **Lima de relleno escrita a mano** (§3.4), fuera de `Boton`:
  - botones: `estudio/page.tsx:77`, `herramientas/page.tsx:199`,
    `plantillas/page.tsx:55`, `Auditoria.tsx:39`, `Plantillas.tsx:111`,
    `FormularioAuditoria.tsx:653, 670, 729`, `PasoPregunta.tsx:101`,
    `AvisoCookies.tsx:69`, `Footer.tsx:43`, `Nav.tsx:64, 125` y
    `layout.tsx:81`;
  - estados: filtro activo (`CatalogoPlantillas.tsx:34`), casilla marcada
    (`PasoPregunta.tsx:169`), burbuja del cliente (`ChatEjemplo.tsx:86`) y
    punto de paso (`FormularioAuditoria.tsx:380`).
- **Cortina.** `Preloader.tsx` exporta `PRELOADER_SESSION_KEY`
  (`"undertactics-preloader-seen"`), `PRELOADER_DONE_EVENT`,
  `PRELOADER_GONE_EVENT` y `esperarCortina()`, y bloquea el scroll con
  `body.style.overflow`. La importan `Hero.tsx` (DONE y la clave) y
  `Diagnostico.tsx:15` (`esperarCortina`). Usa `gearPath.ts`. `engranaje.ts`
  lo usan `not-found.tsx` y `three/shared.ts`.
- **Portada** (`src/app/page.tsx`): Hero, Marquee, Servicios, Plantillas,
  Proceso, Equipo, `Compromisos`, DiagnosticoRapido, Auditoria, Cifras y
  CtaFinal.
  - `Hero` parte el H1 con `SplitText` (`mask: "lines"`) y monta
    `HeroGears` (three).
  - `Servicios` usa `NodesScene`, `WorkImage` y el panel que sigue al cursor.
  - `Plantillas` hace un carrusel anclado desde 768 px.
  - `Proceso` hace un pin con scrub desde 768 px.
  - `Equipo`, `Auditoria` y el `aside` de `FormularioAuditoria` llevan
    `lg:sticky` (columna fija, no pila).
  - `useReveal` (opacidad + `y` + desenfoque) lo usan Servicios, Plantillas,
    Equipo y Auditoria.
  - `CtaFinal` la usan la portada y `sectores/[slug]/page.tsx:96`. Nadie
    enlaza a `#contacto`.
- **Contenido.**
  - `cifras.ts` tiene el 30 escrito a mano.
  - `proceso.ts`: `numero`, `titulo`, `descripcion`.
  - `plantillas.ts`: 30 plantillas, 10 destacadas; exporta
    `plantillasDestacadas` y `sectoresPlantillas`.
  - `site.ts`, `cifras.ts`, `proceso.ts`, `plantillas.ts` y `servicios.ts`
    no importan nada, así que los tests de Node los cargan tal cual.
    `estudio.ts` importa con `@/`: ningún test lo puede cargar.
- **Interiores.** Todas con `robots` noindex. Cabecera común escrita a mano
  en cada página: «← Volver» → etiqueta (`font-mono-label`) → H1.
  `/sectores/<slug>/` usa `CabeceraSector`.
  - `/privacidad/`, apartado «Cookies» (l.142): solo menciona el borrador y
    el aviso.
  - `not-found.tsx`: rueda rota con `gearSvgPath` y `pitchRadius`.
- **Glifos fuera del subconjunto latino**:
  - `←` en los seis «← Volver» de las interiores y en «← Atrás» de
    `FormularioAuditoria`;
  - `→` en `FormularioAuditoria.tsx:659` y en `EnlaceMejora.tsx:12` («Más
    sobre esto →»);
  - `★` y `↕` solo en el boceto.

  El subconjunto latino de Google sí trae `−` (U+2212), `·`, `«»`, `…`,
  `↑` y `↓`; no trae `←`, `→`, `★` ni `↕`.
- **Tests**: `npm test` = `node --test --experimental-strip-types
  "src/**/*.test.ts"`, con 4 ficheros de la 001. Los imports van con ruta
  relativa y extensión `.ts`. Node local 22.17.1.
- **Playwright**: no está en el repo. En la máquina hay 1.63.0 (en
  `alvarotaiagu.github.io`), con sus navegadores en
  `%LOCALAPPDATA%\ms-playwright`.
- **Boceto** (`../undertactics-bocetos`):
  - `css/a.css` (226 líneas) lleva los tokens con nombres cortos (`--lima`,
    `--apag`…);
  - **no hay `--estrato-1…6`**: los seis colores van escritos en
    `.a-estratos li:nth-child(n)`, líneas 144-146 (PD-5);
  - `js/a.js` (288 líneas) no usa GSAP ni Lenis (rAF propio y ayudas de
    `js/comun.js`; `partirConcepto` está en `comun.js:113`);
  - su inactividad (4,6 s y 9 s) y su seguro de cortina (7 s) **no** son los
    de la spec: manda la spec (5 s / 15 s / 4,5 s);
  - `vesTu` tiene 4 de 6 filas y `debajo` 3 de 6 (`a.js:213-214`): se
    completan en T12 (P-04);
  - en `fuentes/` están `geologica-oblique.woff2` (48,5 KB) y
    `kode-mono-normal.woff2` (15,8 KB). `scripts/bajar-fuentes.mjs` se queda
    con el bloque `/* latin */` de Google; no hace subconjunto propio.
  - La captura `_capturas/a-390-1-hero.png` pone los cuatro objetos en una
    fila, con un pozo colgando de cada uno (PD-10).
- **Recetas fuera del repo**:
  - `../marina-spa-zafra-web/scripts/lcp.mjs` (43 líneas: iPhone 13, CDP con
    150 ms y 1,6 Mbps, CPU ×4, mediana de 3, cookies por `addInitScript`)
    importa Playwright por ruta absoluta: se adapta;
  - el hilo de Casa María está en `../casa-maria-olivenza-web/js/main.js`
    (l.406-528, anclas `[data-hilo]`, `ResizeObserver` sobre `main`);
  - `trazoRevelable` y `progresoTramo` están en
    `../biblioteca-movimiento/efectos/util.js` (l.34 y l.132);
  - ninguna web hermana tiene un `servir.mjs` que sirva `out/` bajo un
    `basePath`: se escribe nuevo.

## 2. Decisiones de diseño (aprobar juntas)

- **PD-1 · Ramas y publicación** (D-020).
  - `feat/rediseno-por-debajo` se crea desde `spec/rediseno-por-debajo`, con
    la spec, el plan y las tareas ya commiteados (T01), y se sube.
  - Cada tarea va en su worktree (`../subcon-works-web-rdNN`), con rama
    `feat/rd-tNN-…` desde la de integración, y su PR **contra
    `feat/rediseno-por-debajo`**. Nunca contra `main`.
  - A `main` va una sola PR al final (T21), tras P-04 y la revisión de Álvaro
    con `?revision` (T20).
  - Si `main` avanza mientras tanto (la PR de esta spec, `feat/chatbot`), se
    mergea `main` en la de integración, no se rebasa (hay worktrees colgando
    de ella).
- **PD-2 · Pruebas: dónde vive cada una.**
  - **Playwright `1.63.0` exacto** como `devDependency` (D-023): es la
    versión que ya tiene navegadores en la máquina. Si `npm ci` en CI se pone
    a bajar navegadores, se añade `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` al
    workflow (es el único cambio permitido en CI).
  - **Tests de Node en cuatro ficheros nuevos**, para que las tareas no se
    pisen:
    - `src/content/hero.test.ts`: §3.6;
    - `src/content/portada.test.ts`: §3.5 (cotas y recuento) y §3.9;
    - `src/lib/dorsales.test.ts`: §3.8;
    - `src/lib/limpieza.test.ts`: §3.1, §3.4 y §2.

    Se escriben en T01 con `{ skip: "Tnn" }`. Cada tarea quita el `skip` de
    los suyos.
  - **`limpieza.test.ts`** recorre `src/` (`.ts`, `.tsx`, `.css`) **sin los
    `*.test.ts`**, porque llevan los nombres prohibidos. Para no dar falsos
    positivos:
    - `accent` solo cuenta como clase con prefijo de utilidad
      (`bg-|text-|border-|ring-|fill-|stroke-|outline-|divide-|from-|to-|via-|decoration-|shadow-`),
      como `var(--accent…)` o como `--color-accent…`. `accent-color`
      (propiedad CSS) **no** cuenta. Lo mismo para `line`, `bg-base`,
      `text-primary`…
    - `motion` solo cuenta como `from "motion"` o `"motion/…"`, nunca dentro
      de `prefers-reduced-motion`.
    - Las clases de baja (`umbral`, `grain-overlay`…) cuentan como selector
      `.nombre` en CSS o como palabra dentro de un `className`. Así un
      comentario en castellano («umbral de 5 s») no rompe el test.
    - Los componentes y hooks de baja cuentan como identificador
      (`\bMarquee\b`…) o como ruta de import.
  - **Navegador**: `scripts/servir.mjs`, `scripts/comprobar.mjs` y
    `scripts/medir.mjs`, en `.mjs` sin compilar e importando `playwright` del
    repo. Scripts de `package.json`: `servir`, `comprobar`, `medir`.
    - `servir.mjs` sirve `out/` en el puerto **4302** (o `--puerto`), con
      `--base /subcon-works-web` para el build de CI. Responde 404 con
      `out/404.html` y sirve `.woff2` como `font/woff2`.
    - `comprobar.mjs` tiene una lista de comprobaciones
      `{ id: "§7 · Cortina · …", tarea: "T09", pendiente: true, fn }`.
      Imprime `OK`, `FALLO` o `PENDIENTE` por línea y sale con código 1 si
      hay algún `FALLO`. Con `--estricto`, también si hay algún `PENDIENTE`.
      Antes de probar, comprueba el `<title>` de la página servida. Acepta
      `--solo <texto>` para lanzar solo las que lo contengan.
    - Cada tarea pone `pendiente: false` en las suyas y las hace pasar. Una
      tarea no cambia la lista de otra.
- **PD-3 · CSS por zonas.** `globals.css` se queda con tokens, `@theme`,
  base y utilidades comunes. Lo de cada zona va en `src/estilos/<zona>.css`:
  `foco`, `cabecera`, `cortina`, `hero`, `portada`, `hilo`, `proceso`,
  `interiores` y `sobria`.
  - T02 crea los nueve ficheros vacíos y los importa desde `globals.css`.
  - Ninguna tarea más toca la lista de imports, y cada tarea escribe solo en
    sus ficheros. Así las tareas en paralelo no chocan en `globals.css`.
- **PD-4 · Glifos en SVG** (§3.2).
  - `←`, `→`, `★` y `↕` se dibujan con un componente `Glifo` (`nombre:
    "izquierda" | "derecha" | "estrella" | "vertical"`), SVG en línea de
    `1em`, `currentColor` y `aria-hidden`.
  - No se amplía el subconjunto de las letras: haría falta subconjunto
    propio y una tercera petición, y el tope es de dos ficheros (§3.15).
  - Comprobación (T18): ningún nodo de texto visible de las ocho páginas
    contiene `← → ★ ↕`.
- **PD-5 · Estratos del testigo.** `--estrato-1` … `--estrato-6` =
  `#2A4844`, `#233F3B`, `#1E3633`, `#192E2C`, `#152725`, `#111F1F` (leídos
  de `a.css:144-146`; DIRECCION dice que están en `a.css`, pero no como
  variables).
- **PD-6 · Titulares.**
  - Componente `Titular` (`nivel: 1 | 2`, `arriba`, `em?`): parte el texto en
    palabras **en el servidor**, cada una en un `span` `inline-block` y
    `nowrap` dentro de una máscara. Sin `SplitText`: así no hay salto al
    hidratar, y sin JS ya está bien.
  - La entrada (`yPercent` 100 → 0, 0,04 s, `expo.out`) la anima un
    `useEffect` solo con `html.js-si` y movimiento permitido.
  - La nitidez va por la variable `--shrp`, que pone la sección
    (`style={{"--shrp": n}}`). Los titulares la leen en
    `font-variation-settings`. Nunca se anima.
  - El H1 del hero **no** usa `Titular` (§3.2): va entero.
- **PD-7 · El corte de la portada.**
  - `src/content/portada.ts` exporta `cortePortada` (siete entradas: `id`,
    `cota`, `shrp`, `fondo`), sin imports.
  - Un componente `Seccion` pinta la `<section>` con su `id`, su fondo, su
    `--shrp` y la `Cota` (`data-hilo`, clase `es-alcanzada` cuando toca).
  - **La entrada por bloque** (máscara que baja desde una línea) la hace
    `Seccion` con un hook `useDescubrir`. Al terminar quita el `clip-path`
    (§3.9: nada de recortes sobre el pin).
  - `useReveal` y todos los `data-reveal` salen: son el fundido suelto que la
    spec quita (§3.5).
  - `page.tsx` se escribe **una vez**, en T06, con las siete secciones en su
    orden y sus nombres definitivos: `Hero`, `Servicios`, `Plantillas`,
    `Proceso`, `QuienDebajo`, `DiagnosticoRapido` y `Fondo`. `QuienDebajo`
    y `Fondo` nacen en T06 como cáscaras que envuelven lo de hoy (`Equipo` y
    `Compromisos`; `Auditoria`). Después cada tarea cambia solo el
    componente de su sección.
- **PD-8 · Un solo script en el `<head>`.** `src/lib/scriptCabeza.ts`
  exporta el código como cadena, que `layout.tsx` pone en línea antes de
  pintar. Hace cuatro cosas:
  1. pone `js-si` en `<html>`;
  2. pone `cortina-si` (§3.14: portada `basePath + "/"`, sin la clave y sin
     movimiento reducido) y arma el seguro de 4,5 s, guardado en
     `window.__cortinaSeguro`;
  3. pone `densidad-sobria` si la URL lleva `revision=sobria` (§3.16);
  4. nada más. Cada línea va en un `try`, para que un fallo de
     `sessionStorage` no deje la cortina puesta.

  El fondo de la portada (cal arriba, para el rebote de iOS) va con
  `body:has([data-hero])`, sin clase: así vale también al navegar sin
  recargar. `<html>` lleva `suppressHydrationWarning`.
- **PD-9 · Lo que se dicen hero, cortina, cabecera e hilo.**
  - El hero pinta `[data-superficie]` (la línea) y la variable `--nivel` en
    `[data-hero]`. Sus capas llevan `data-capa="arriba" | "abajo"`.
  - La cortina mide `[data-superficie]` antes de empezar y, en el paso 5,
    anima las `data-capa` con `transform`.
  - El hero enciende el pozo 1 en `esperarCortina()`.
  - La cabecera observa `[data-superficie]` con `IntersectionObserver`: sin
    él (interiores) va en oscuro.
  - El hilo une los `[data-hilo]` de las cotas y acaba en `[data-hilo-fin]`
    (el botón del Fondo).
  - Eventos: los dos de siempre (`PRELOADER_DONE_EVENT`,
    `PRELOADER_GONE_EVENT`) y uno nuevo, `undertactics:hilo-medido`, que el
    hilo lanza al recalcular (lo usa el Fondo para no ir por su cuenta).
- **PD-10 · Hero en móvil (360-390 px)**, decidido con
  `_capturas/a-390-1-hero.png`.
  - **Fila de cuatro, sin carril ni rejilla 2×2.** Cada pozo cuelga de su
    objeto: en 2×2 los pozos de arriba cruzarían los objetos de abajo, y un
    carril obliga a mover los pozos con él.
  - Para que quepa a 360 px con todo el texto a ≥ 12 px:
    - la burbuja dice «¿Hueco el jueves?» en vez de la pregunta entera (la
      lectura sigue diciendo la frase completa);
    - el rótulo dice «WhatsApp» sin la hora;
    - la tarjeta de pago y la de Google pierden las líneas de relleno.
  - Si aun así algo se corta a 360 px, T07 **para** y abre un C-xx con
    capturas. No pasa a 2×2 por su cuenta.
- **PD-11 · Reloj del hero.**
  - Un solo bucle `requestAnimationFrame` en `Hero` lleva los pulsos, la
    inactividad (con su propio contador de tiempo, que no cuenta atascos de
    más de 0,1 s) y la medición de fotogramas (bajada de calidad, §3.15).
  - Se para con el hero a menos del 20 % (`IntersectionObserver`) y con
    `visibilitychange`. Nada de `setInterval`.
- **PD-12 · Fondo como componente.** `src/components/sections/Fondo.tsx`,
  con la prop `hilo?: boolean`: con ella el botón lleva `data-hilo-fin`.
  - Lo usan la portada (`hilo`) y `/sectores/<slug>/` (sin `hilo`).
  - `CtaFinal` se borra en T13.
  - El enlace por correo usa `site.email`.
- **PD-13 · Sin GSAP y sin JS** (aclara §6 y §3.14, que dan 2,5 s y 4,5 s).
  - Si `Cortina.tsx` arranca pero GSAP falla, su `catch` retira la cortina
    **en el acto**, lo que cumple los 2,5 s del §6.
  - El seguro de 4,5 s del `<head>` es solo para cuando no corre el bundle,
    y es lo que prueba §7 abortando los chunks.
- **PD-14 · Bajas además de las del §2**, porque solo las usaban ellas:
  - `useReveal` (PD-7);
  - `SmoothScroll` se queda, pero sin `useScrollVelocity`;
  - `SplitText` sale de `registerGsap` si ya no lo usa nadie;
  - `WorkImage` se queda (la usan `BrowserMockup` y `/herramientas/`).

  Los `public/servicios/*.svg` y `scripts/generar-iconos-servicios.mjs` se
  quedan (§3.7).
- **PD-15 · Si un tope del §3.15 no se cumple**, T19 no lo relaja. Abre una
  PR `fix/rd-…` en la zona que lo rompe (o un C-xx si no se puede cumplir sin
  cambiar la spec).

## 3. Orden de construcción

```
T01 rama + pruebas ─ T02 tokens ─┬─ T03 letras ─┐
                                 └─ T04 logo ───┴─ T05 piezas comunes ─ T06 el corte (page.tsx)
T06 ─┬─ T07 hero ─┬─ T08 hero vivo ──────────────────────────────┐
     │            └─ T09 cortina ──────────────────┐             │
     ├─ T10 servicios ─────────────────────────────┤             │
     ├─ T11 la plantilla ──────────────────────────┤             │
     ├─ T12 proceso ───────────────────────────────┼─ T14 hilo ──┼─ T17 mando y Sobria ─ T18 bajas ─ T19 presupuesto
     ├─ T13 quién, diagnóstico y Fondo ─┬──────────┘             │
     │                                  └─ T15 interiores ───────┤
     └─ T16 formularios y estados ───────────────────────────────┘
T19 ─ T20 textos P-04 y revisión (Álvaro) ─ T21 comprobar la spec y PR a main
```

- **En serie** por fichero que comparten:
  - T01 → T02 → T05 → T06, porque todas tocan `globals.css`, `layout.tsx` o
    `page.tsx`;
  - T03 y T04 van en paralelo (T03: `layout.tsx` y `globals.css`; T04:
    `Logo.tsx` y `marca/LEEME.md`);
  - T07 → T08 (`Hero.tsx`);
  - T13 → T15 (las dos tocan `/sectores/<slug>/`: T13 el cierre, T15
    `CabeceraSector`).
- **En paralelo** tras T06: T07, T10, T11, T12, T13 y T16. Tras T07, T08 y
  T09 a la vez (T09 no toca `Hero.tsx`: usa el contrato de PD-9).
- **Ficheros compartidos que se tocan en una sola línea**: `layout.tsx` en
  T09 (cambiar `Preloader` por `Cortina`) y en T18 (quitar `Cursor`, `Grain`
  y `ScrollLine`); `Diagnostico.tsx:15` en T09 (el import de
  `esperarCortina`). T16 no toca esa línea.

## 4. Datos

Nada de base de datos ni migraciones (spec §4). Contenido:

- `site.ts`: `tagline` y `descripcion` (T07).
- `hero.ts`, nuevo (T07).
- `portada.ts`, nuevo (T05).
- `cifras.ts`: el valor de plantillas importa `plantillas` con
  `./plantillas.ts` (T06).
- `proceso.ts`: `dato`, `vesTu` y `debajo` (T12).
- `package.json`: entra `playwright` (T01); salen `three`, `@types/three` y
  `motion` (T18).

Almacenamiento: nada nuevo. La clave de sesión de la cortina no cambia
(`undertactics-preloader-seen`). La frase de `/privacidad/` la añade T15.

## 5. Partes del código

| Fichero | Qué | Tarea |
|---|---|---|
| `package.json`, `scripts/servir.mjs`, `scripts/comprobar.mjs`, `scripts/medir.mjs`, los cuatro `*.test.ts` nuevos | PD-2 | T01 |
| `globals.css`, `src/estilos/*.css` (vacíos), los 54 ficheros con tokens viejos, `viewport` del layout | §3.1, PD-3, PD-5 | T02 |
| `public/fuentes/`, `layout.tsx` (letras, `alt` de OG), `globals.css` (escala), `Glifo` | §3.2, §3.3 (OG), PD-4 | T03 |
| `ui/Logo.tsx`, `marca/LEEME.md` | §3.3 | T04 |
| `Boton`, `Nav`, `Footer`, `AvisoCookies`, `PageTransition`, skip-link, `estilos/foco.css`, `estilos/cabecera.css`, `content/portada.ts`, `Cota` | §3.4, PD-9 | T05 |
| `app/page.tsx`, `Seccion`, `useDescubrir`, `Titular`, `cifras.ts`, `estilos/portada.css`, cáscaras `QuienDebajo.tsx` y `Fondo.tsx` | §3.2 (palabras), §3.5, PD-6, PD-7 | T06 |
| `sections/Hero.tsx`, `content/hero.ts`, `site.ts`, `public/hero/reel.webp`, `estilos/hero.css` | §3.6 (estático y encendido) | T07 |
| `sections/Hero.tsx` | §3.6 (inactividad, tirador, scroll), §3.15 (bajada de calidad), PD-11 | T08 |
| `layout/Cortina.tsx`, `lib/scriptCabeza.ts`, `layout.tsx`, `estilos/cortina.css`, borrar `Preloader.tsx` | §3.14, PD-8, PD-13 | T09 |
| `sections/Servicios.tsx` | §3.7 | T10 |
| `sections/Plantillas.tsx`, `ui/TarjetaPlantilla.tsx`, `plantillas/CatalogoPlantillas.tsx`, `lib/dorsales.ts` | §3.8, §3.12 (`/plantillas/`) | T11 |
| `sections/Proceso.tsx`, `content/proceso.ts`, `estilos/proceso.css` | §3.9 | T12 |
| `sections/QuienDebajo.tsx`, `Equipo.tsx`, `Compromisos.tsx`, `DiagnosticoRapido.tsx`, `Fondo.tsx`, `sectores/[slug]/page.tsx` (cierre), borrar `CtaFinal` y `Auditoria` | §3.11, PD-12 | T13 |
| `layout/Hilo.tsx`, `estilos/hilo.css` | §3.10 | T14 |
| `CabeceraInterior`, las páginas interiores, `CabeceraSector`, `not-found.tsx`, `privacidad` (frase §5), `estilos/interiores.css` | §3.12, §5 | T15 |
| `FormularioAuditoria`, `PasoPregunta`, `Resultado`, `EnlaceMejora`, `ChatEjemplo`, `BrowserMockup`, `MovilMockup` | §3.4 (estados), §3.12 (`/auditoria/`) | T16 |
| `layout/Mando.tsx`, `estilos/sobria.css`, recuento de Sobria | §3.16, §3.17 | T17 |
| bajas del §2 y de PD-14, `package.json`, `gsap.ts`, `layout.tsx` | §2 | T18 |
| `README.md` («Presupuesto», «Nivel», «Qué hay en la web»), arreglos de rendimiento | §3.15, §3.18 | T19 |

## 6. Riesgos y cómo se cubren

| Riesgo | Cobertura |
|---|---|
| Tailwind v4 ignora sin aviso una clase de token que no existe | T02 cambia todo de una vez y activa el test §3.1 |
| Las tareas en paralelo chocan en `globals.css` o en `page.tsx` | PD-3 y PD-7: cada zona en su fichero y `page.tsx` escrito una vez |
| La cortina no se va (falla el JS, `sessionStorage` bloqueado, GSAP) | PD-8, PD-13; §7 abortando los chunks |
| El LCP pasa a la descripción o se retrasa por la cortina | H1 pintado desde el primer fotograma (§3.14); comprobación de áreas a 390 px en T07; medir con cortina y sin ella en T19 |
| CLS al cambiar de letra o al mover la superficie | fallback con `size-adjust` medido (T03); la superficie se mueve solo con `transform` (§3.6); `SHRP` fijo (PD-6) |
| El pin del proceso se rompe por un `transform` o un `clip-path` de un ancestro | `useDescubrir` quita el recorte al terminar (PD-7); `ScrollTrigger.refresh()` con `ResizeObserver` y tras `fonts.ready` (§6) |
| El hilo mide mal durante el pin o tras cargar imágenes | anclas desde `start`/`end` de ScrollTrigger y `ResizeObserver` sobre `<main>` (§3.10) |
| El arrastre del tirador bloquea el scroll en móvil | `touch-action: none` solo en el tirador; prueba con `Input.dispatchTouchEvent` (§7) |
| El texto queda por debajo de 4,5:1 en algún estado | la comprobación de contraste real de §7, en las dos densidades y con un pozo encendido y otro en reposo (T17) |
| Rutas de letras sin `basePath` en Pages | `@font-face` en línea con `NEXT_PUBLIC_BASE_PATH`; pasada con `GITHUB_ACTIONS=true` y `--base` (T03) |
| `feat/chatbot` se mergea antes y su widget usa los tokens viejos | P-05; T21 mira el orden de merge y adapta el widget si entra primero |
| Un test de limpieza falla por una palabra en castellano | patrones de PD-2 |
| La 001 se rompe al cambiarle el aspecto | T16 activa «001 sigue cumpliendo»; los tests de la 001 siguen en `npm test` |

## 7. Queda fuera

Lo de la spec §2 («Queda fuera»): lógica de la 001, contenido de los
ficheros de `src/content/` salvo los del §4, favicon, `apple-icon.png`,
`og.png` (P-07), el widget del chatbot (P-05), el kit y otros idiomas. Y
también, de este plan: cambiar el CI, salvo lo que diga PD-2 sobre los
navegadores.
