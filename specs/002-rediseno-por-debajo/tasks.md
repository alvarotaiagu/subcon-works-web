# 002 · Tareas · Rediseño «Por debajo»

Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md)

## Cómo trabajar estas tareas

- **Antes de empezar, lee**:
  - la spec entera;
  - del plan, el «Punto de partida» y las decisiones PD-1 a PD-15. Una PD
    manda sobre la spec donde la concreta;
  - `AGENTS.md`: Next 16 no es el que conoces. Lee la guía de
    `node_modules/next/dist/docs/` que toque antes de escribir metadatos,
    `viewport`, scripts en el `<head>` o rutas;
  - la referencia visual de tu zona: `../undertactics-bocetos/bocetos.html`
    (sección A), `css/a.css`, `js/a.js` y `_capturas/a-*`. El boceto se
    puede copiar como punto de partida, pero manda la spec.
- **Esta spec cambia la 001** (§3.5, §3.7, §3.8, §3.9 y §7). Si una tarea lee
  la 001, lee también el apartado 8 «Cambios a otras specs» de esta: manda
  el delta.
- **Ramas (PD-1)**:
  - cada tarea en su worktree (`../subcon-works-web-rdNN`), con rama
    `feat/rd-tNN-…` desde `feat/rediseno-por-debajo`;
  - la PR va **contra `feat/rediseno-por-debajo`**, nunca contra `main`,
    porque `main` publica en Pages;
  - no cambies de rama ni toques nada en la carpeta principal
    `subcon-works-web` (está en `feat/chatbot` con trabajo sin commitear).
- **Una tarea = un commit** (o pocos, de la misma tarea). Solo tus ficheros.
- **Tienen que pasar**, en el worktree y tras `npm ci`:
  - `npm run lint`, `npm run build` y `npm test`;
  - `npm run comprobar -- --solo Tnn` con tus comprobaciones activadas (sobre
    `out/`, servido por `scripts/servir.mjs`);
  - ninguna comprobación que ya estuviera activa puede pasar a `FALLO`.
- **Tests y comprobaciones (PD-2)**: T01 los deja todos escritos y
  pendientes. Tu tarea quita el `skip` de sus tests y pone `pendiente: false`
  en sus comprobaciones. No cambies las de otra tarea. Si una de otra tarea
  está mal escrita, dilo en la PR.
- **CSS (PD-3)**: lo de tu zona va en tu `src/estilos/<zona>.css`. No toques
  la lista de imports de `globals.css`.
- **No hay migraciones** ni almacenamiento nuevo.
- **Reglas que más se olvidan**:
  - **Lima**: solo como línea o como texto sobre oscuro. **Nunca** de fondo
    de un elemento, ni como texto sobre `--cal` o `--tarjeta`. En el logo
    sobre claro, `#5F7D00`.
  - **Nada de opacidad en el texto**: el reposo se pinta con
    `--apagado-abajo` o `--apagado-arriba`.
  - **`--conducto`** nunca es texto ni borde que tenga que leerse.
  - **Estados con prefijo `es-`** (`es-activo`, `es-alcanzada`,
    `es-pasado`). Texto suelto dentro de un grid, siempre en un `<span>`.
  - **Estado inicial oculto** (máscaras, palabras, emersión) solo bajo
    `html.js-si` y con movimiento permitido. Sin JS, la web se lee entera.
  - **Mover sin CLS**: `transform`, nunca `top`, `height` ni `inset`
    animados. `svh`, nunca `innerHeight`. Un `resize` que solo cambia el
    alto no recalcula nada.
  - **GSAP**:
    - `autoRound: false` con `pathLength=1`;
    - `immediateRender: false` en los `fromTo` que no deben pintar el «from»;
    - `svgOrigin` para girar SVG;
    - ningún `transform`, `filter`, `will-change` ni `clip-path` en los
      ancestros de un pin;
    - `overflow: clip`, no `hidden`, junto a sticky.
  - **Playwright con Lenis**: el scroll se hace con `mouse.wheel`, no con
    `scrollTo`. Cortinas: página nueva cada vez, con el enganche en
    `addInitScript`. Puerto propio (4302) y mira el `<title>` antes de
    probar.
  - **Enlaces internos** con `Link` o `withBasePath`. **Noindex** en toda
    página. Copy de capacidad, no de condiciones. Nada falso.
  - `next dev` reescribe un bloque de `AGENTS.md`: si aparece en tu diff,
    puedes commitearlo tal cual.

## Base

- [x] **T01 · Rama de integración, Playwright y pruebas pendientes.**
  - *Cubre*: PD-1, PD-2, D-023, spec §7 (forma), §3.15 (`servir.mjs`,
    `medir.mjs`).
  - *Hacer*:
    - En el worktree `subcon-works-web-spec-002`, con la spec, el plan y las
      tareas ya commiteados en `spec/rediseno-por-debajo`: crea
      `feat/rediseno-por-debajo` desde ahí y súbela.
    - `npm i -D playwright@1.63.0 --save-exact`. Scripts en `package.json`:
      `"servir": "node scripts/servir.mjs"`,
      `"comprobar": "node scripts/comprobar.mjs"` y
      `"medir": "node scripts/medir.mjs"`.
    - `scripts/servir.mjs`: servidor estático de `out/` (PD-2). Exporta
      `crearServidor({ raiz, puerto, base })` y se puede lanzar suelto.
    - `scripts/comprobar.mjs`: la lista entera de «Comprobación en
      navegador» del §7, **todas con `pendiente: true`** y con su tarea:

      | Comprobación (§7) | Tarea |
      |---|---|
      | Portada · siete secciones con cota, sin Marquee/Cifras/CtaFinal | T06 |
      | Portada · letras: nada de Google Fonts, se piden los dos woff2 | T03 |
      | basePath de las letras (build con `GITHUB_ACTIONS=true`) | T03 |
      | Cortina · cuándo sale y cuándo no | T09 |
      | Cortina · ni un fotograma cuando no sale | T09 |
      | Cortina · misma `y` que la superficie (±1 px) | T09 |
      | Cortina · se retira con los chunks abortados | T09 |
      | Sin JS | T12 |
      | Hero · encender cada pozo y «Ejemplo» | T07 |
      | Hero · a 360 px, nada solapado, recortado ni < 12 px | T07 |
      | LCP · área del titular > descripción a 390 px | T07 |
      | Cabecera · logo claro y oscuro | T07 |
      | Hero · inactividad (5 s, una vuelta, 15 s, Pausar) | T08 |
      | Hero · `aria-live` solo tras un gesto | T08 |
      | Hero · tirador táctil y scroll fuera de él | T08 |
      | Foco | T08 |
      | Proceso · broca y pasos; tabla con movimiento reducido | T12 |
      | Fondo · se enciende en la portada y en `/sectores/alojamientos-rurales/` | T13 |
      | Hilo | T14 |
      | Interiores | T15 |
      | Sin scroll horizontal a 360 y 390 px | T15 |
      | 001 sigue cumpliendo | T16 |
      | Mando | T17 |
      | Fondo y proceso en Sobria | T17 |
      | Contraste real | T17 |
      | Glifos: ningún texto visible con `← → ★ ↕` (PD-4) | T18 |

      Cada una con el `fn` ya escrito según el §7, si se puede escribir sin
      la web nueva (selectores del contrato de PD-9: `[data-hero]`,
      `[data-superficie]`, `[data-hilo]`, `[data-hilo-fin]`, `data-capa`).
      Si no, deja un esqueleto con un comentario de lo que tiene que mirar.
    - `scripts/medir.mjs` desde `../marina-spa-zafra-web/scripts/lcp.mjs`,
      con las adaptaciones del §3.15:
      - Playwright del repo y `servir.mjs`;
      - clave de cookies de esta web (léela en `AvisoCookies.tsx`);
      - LCP, CLS (con `hadRecentInput`), INP del instrumento, peso de las
        letras en `out/` y tareas largas tras `document.fonts.ready`;
      - rutas: portada con cortina y sin ella, `/plantillas/` y
        `/sectores/alojamientos-rurales/`.

      Lo que solo existe con el hero nuevo (INP del tirador) sale «sin
      medir» hasta T19.
    - Los cuatro tests de Node de PD-2, con `{ skip: "Tnn" }`:

      | Test (§7) | Fichero | Tarea |
      |---|---|---|
      | §3.6 · Cada parada del hero es un servicio real | `src/content/hero.test.ts` | T07 |
      | §3.5 · Las cotas de la portada | `src/content/portada.test.ts` | T05 |
      | §3.5 · Recuento | `src/content/portada.test.ts` | T06 |
      | §3.9 · Proceso | `src/content/portada.test.ts` | T12 |
      | §3.8 · Dorsales | `src/lib/dorsales.test.ts` | T11 |
      | §3.1 · Tokens viejos | `src/lib/limpieza.test.ts` | T02 |
      | §3.4 · Sin lima de relleno | `src/lib/limpieza.test.ts` | T02 |
      | §2 · Bajas | `src/lib/limpieza.test.ts` | T18 |

      Los que importan ficheros que aún no existen (`hero.ts`,
      `portada.ts`, `dorsales.ts`) los cargan con `await import()` dentro del
      test, para que el fichero cargue en verde.
    - **A mano** (lo mira Álvaro en T20; lo lista T21): los textos de P-04,
      las dos densidades en un móvil de verdad, el aspecto contra
      `_capturas/a-*` y un lector de pantalla por el hero.
    - Línea base: `npm run medir` sobre el `main` de hoy. Pega las cifras en
      la PR (sirven para comparar en T19).
  - *Hecho*:
    - `git log origin/main..feat/rediseno-por-debajo` enseña solo los
      commits del SDD y este;
    - `npm test` en verde, con los tests nuevos en `skip`;
    - `npm run comprobar` sale con 0 y todo `PENDIENTE`; con `--estricto`,
      sale con 1;
    - `npm run medir` da cifras de la web de hoy;
    - lint y build en verde.

- [x] **T02 · Tokens de color y cambio de todas las clases.**
  - *Cubre*: spec §3.1 (entero), §3.4 («Ningún elemento se rellena de lima»,
    como cambio de clases), PD-3, PD-5.
  - *Depende de*: T01.
  - *Hacer*:
    - `globals.css`:
      - `:root` con los tokens de la tabla del §3.1 y `--estrato-1…6`
        (PD-5);
      - `@theme inline` rehecho (`--color-cal`, `--color-hondo`…);
      - **borra** los tokens viejos (sin alias);
      - conserva y repinta `container-max`, `font-mono-label`, `--space-*`,
        `--ease-*`, `--dur-*`, `.mask-line`, `.link-underline`, `.nav-link`,
        `.menu-movil-item` y `.campo`;
      - fondo de `<html>` en `--hondo`.
    - Crea vacíos (con una línea de comentario) los nueve
      `src/estilos/*.css` de PD-3 e impórtalos desde `globals.css`.
    - Cambia los ~340 usos de los 54 ficheros con la tabla «Viejo → Nuevo»:
      - `--line` → `--conducto` si es decorativo, `--apagado-abajo` si es
        borde de campo o de control;
      - todo relleno lima (los botones y estados de la lista del plan, §1)
        pasa ya a los estados del §3.4: primario abajo `bg-hueso
        text-hondo`; filtro activo y opción marcada `bg-hueso text-hondo`
        con línea lima de 2 px debajo; burbuja del cliente `bg-estrato
        text-hueso` con borde izquierdo lima de 2 px; punto de paso, en
        línea.
    - `viewport` del layout: `themeColor: "#0E1B1E"` y `colorScheme:
      "dark"` (la portada lo cambia en T06).
  - *Tests*: activa §3.1 · Tokens viejos y §3.4 · Sin lima de relleno.
  - *Hecho*:
    - tests en verde;
    - en `next dev`, ninguna de las ocho páginas tiene un elemento que se
      haya quedado sin color (fondo transparente donde había un `bg-bg-*`,
      o texto negro por defecto);
    - lint y build en verde.

- [x] **T03 · Letras autoalojadas, escala y glifos.**
  - *Cubre*: spec §3.2 (salvo «Palabras que emergen», que va en T06), §3.3
    (`alt` de OG), PD-4.
  - *Depende de*: T02. *En paralelo con*: T04.
  - *Hacer*:
    - Copia `geologica-oblique.woff2` y `kode-mono-normal.woff2` de
      `../undertactics-bocetos/fuentes/` a `public/fuentes/`.
    - En `layout.tsx`:
      - quita `next/font` (Instrument Sans, Inter, JetBrains Mono);
      - un `<style>` en línea con los `@font-face`: `url()` con
        `process.env.NEXT_PUBLIC_BASE_PATH` delante, `font-display: swap` y
        el `unicode-range` del bloque latino;
      - dos `<link rel="preload" as="font" type="font/woff2" crossorigin>`;
      - las familias de fallback con `local()` (Arial, Liberation Sans,
        Helvetica Neue, Roboto) y `size-adjust`, `ascent-override` y
        `descent-override` **medidos**. Mídelos con Playwright: ancho y alto
        de «Lo de arriba vende.» en Geologica 300 `SHRP` 0 frente a cada
        fallback; apunta las cifras en un comentario;
      - el `alt` de Open Graph pasa a «Logo de Undertactics: un iceberg con
        la línea de superficie en lima».
    - En `globals.css`: `--font-display` y `--font-body` → Geologica,
      `--font-mono` → Kode Mono, y las variables de la escala del §3.2.
    - Componente `src/components/ui/Glifo.tsx` (PD-4). Cambia por él los `←`
      de «← Volver» y «← Atrás» y los `→` de `FormularioAuditoria.tsx:659` y
      `EnlaceMejora.tsx:12`.
    - Tildes en mayúscula a .92: mira «Él», «Á» en titulares a 390 y 1440
      px. Si tocan, sube el interlineado (anótalo en la PR).
  - *Comprobaciones*: activa «Portada · letras» y «basePath de las letras».
    Esta última con `GITHUB_ACTIONS=true npm run build` y `servir.mjs --base
    /subcon-works-web`.
  - *Hecho*:
    - las dos comprobaciones en verde;
    - las dos letras suman ≤ 70 KB en `out/`;
    - ningún texto de la web en Instrument Sans, Inter ni JetBrains Mono
      (mira `getComputedStyle` en tres páginas);
    - lint y build en verde.

- [x] **T04 · Logo y símbolo.**
  - *Cubre*: spec §3.3 (salvo OG, que va en T03).
  - *Depende de*: T02. *En paralelo con*: T03.
  - *Hacer*:
    - `Logo` pinta los trazados de `marca/undertactics-logo-*.svg` en un
      solo SVG en línea, `aria-hidden="true"`, sin `<title>` ni `role`.
      Rellenos por `--logo-texto`, `--logo-apagado` y `--logo-linea`, y prop
      `tono: "claro" | "oscuro"` con los colores del §3.3 (claro: línea
      `#5F7D00`).
    - Revisa que cada enlace que contiene el logo lleva el nombre accesible
      «Undertactics, inicio».
    - `Simbolo`: misma geometría (la de `SIMBOLO` en
      `scripts/marca/logo_svg.py`), con las mismas variables y los dos
      tonos.
    - `marca/LEEME.md`: el logo de la web ya sale de los SVG; la geometría
      del símbolo sigue en `Simbolo` y en `logo_svg.py`; los colores de
      marca que cita pasan a los del §3.1.
  - *Hecho*:
    - en `next dev`, el logo en tono claro sobre `--cal` y en tono oscuro
      sobre `--hondo` coincide con `marca/undertactics-logo-claro.svg` y
      `-oscuro.svg` (captura en la PR);
    - `Simbolo` se ve en los dos tonos sobre `--hondo` y `--roca`;
    - no hay petición de red por el logo;
    - lint y build en verde.

## Piezas comunes y el corte

- [x] **T05 · Cabecera, botones, foco, pie, aviso y transición.**
  - *Cubre*: spec §3.4 (entero), PD-9 (cabecera), §3.5 (cotas del menú).
  - *Depende de*: T03, T04.
  - *Hacer*:
    - `src/content/portada.ts` con `cortePortada` (PD-7), sin imports.
    - `ui/Cota.tsx`: la cota en Kode Mono mayúscula, con `data-hilo`, en
      `--apagado-abajo` y con la clase `es-alcanzada` en `--superficie`.
    - `Boton`:
      - sin `useMagnetic` ni la prop `magnetico` (quítala también de donde se
        pase);
      - variantes primario y secundario, `fondo: "claro" | "oscuro"`;
      - línea de 2 px debajo y su excepción `lineaApagada` (para el Fondo);
      - hover invertido en `--dur-fast`, sin escalado.
    - Todos los botones de la lista del plan (§1) pasan a `Boton` o a sus
      clases, incluido el skip-link de `layout.tsx`. Los de
      `FormularioAuditoria` y `PasoPregunta` los deja T16; aquí solo se
      comprueba que no son lima.
    - Foco en `estilos/foco.css`:
      - recuadro de 2 px más línea de 4 px por `box-shadow`, en claro y en
        oscuro;
      - `forced-colors` con `Highlight`;
      - `outline-offset` negativo dentro de los `overflow` recortados;
      - borra `.campo:focus { outline: none }`.

      El doble anillo del tirador lo hace T07.
    - `Nav`:
      - `tono` del logo y color de enlaces según cruce `[data-superficie]`
        (PD-9), con fondo `--hondo` al 92 % tras cruzarla; sin él, siempre
        oscuro;
      - menú móvil en `--hondo`, `height: 100dvh`, con la cota de
        `cortePortada` junto a Servicios, Plantillas, Proceso y Auditoría;
      - CTA con `Boton`.
    - `Footer` en `--roca`, con el reloj, el contacto y las secciones.
    - `AvisoCookies`: `--estrato`, `--hueso`, botones con `Boton`. Mismo
      comportamiento.
    - `PageTransition`: la página nueva se descubre desde una línea lima que
      baja, con `clip-path` animado con un número (no `inset()` completo).
      Con movimiento reducido, cambio directo.
  - *Tests*: activa §3.5 · Las cotas de la portada.
  - *Hecho*:
    - test en verde;
    - a 390 px, el menú móvil ocupa toda la pantalla y lleva sus cotas;
    - tabulando una interior, todo foco tiene recuadro y línea;
    - `useMagnetic` y `magnetico` no aparecen en ningún componente de
      `src/` (el fichero del hook lo borra T18);
    - lint y build en verde.

- [x] **T06 · El corte de la portada.**
  - *Cubre*: spec §3.5 (entero), §3.2 («Palabras que emergen» y «Nitidez por
    cota»), §3.1 (`colorScheme` y `themeColor` de la portada; fondo cal en
    el rebote), PD-6, PD-7.
  - *Depende de*: T05.
  - *Hacer*:
    - `ui/Seccion.tsx` (`id`, fondo, `--shrp`, `Cota`, etiqueta propia) y
      `hooks/useDescubrir.ts`: máscara que baja desde una línea, una vez, y
      quita el `clip-path` al terminar. Sin JS o con movimiento reducido, no
      hace nada.
    - `ui/Titular.tsx` (PD-6): palabras partidas en el servidor; entrada solo
      bajo `html.js-si` y con movimiento permitido.
    - `app/page.tsx` con las siete secciones de PD-7, en orden.
      - Crea las cáscaras `QuienDebajo.tsx` (envuelve `Equipo` y
        `Compromisos`) y `Fondo.tsx` (envuelve lo de `Auditoria`, PD-12).
      - Salen de la portada `Marquee`, `Cifras` y `CtaFinal`. No borres sus
        ficheros: eso es T13 y T18.
      - Cada sección, con su `Seccion`, su cota y su fondo del §3.5. Los
        titulares de las secciones existentes pasan a `Titular`.
    - `useReveal` y los `data-reveal` salen de las secciones de la portada
      (PD-7).
    - `cifras.ts`: el valor de plantillas sale de `plantillas.length`
      (import `./plantillas.ts`).
    - `export const viewport` en `page.tsx`: `themeColor: "#F1EEE6"`,
      `colorScheme: "light dark"`.
    - Fondo del rebote: `body:has([data-hero])` con el degradado cal→hondo
      (PD-8).
    - Las anclas del menú (`/#servicios`, `/#plantillas`, `/#proceso`,
      `/#auditoria`) y `/#equipo` siguen llegando.
  - *Tests*: activa §3.5 · Recuento.
  - *Comprobaciones*: activa «Portada · siete secciones».
  - *Hecho*:
    - test y comprobación en verde;
    - las cinco anclas llegan a su sección desde una interior;
    - sin JS (`javaScriptEnabled: false`), todos los `h2` se ven;
    - lint y build en verde.

## Portada

- [x] **T07 · Hero: composición, pozos y encendido.**
  - *Cubre*: spec §3.6 (composición, titular, LCP, descripción, botones,
    objetos y pozos, rótulo «Ejemplo», encender un pozo, anuncios, «al
    cargar», móvil), §3.13 (`site.tagline`, `site.descripcion`,
    `description` de la portada), PD-9, PD-10.
  - *Depende de*: T06.
  - *Hacer*:
    - `src/content/hero.ts` con `flujos`: los cuatro de la tabla del §3.6,
      cada parada con `servicio` y `clave`. Sin imports con `@/`.
    - `site.ts`: `tagline` y `descripcion` del §3.13. La `description` de
      la portada sale de `site.descripcion`.
    - `Hero.tsx` nuevo (sin `HeroGears`, `SplitText`, `Reticula`,
      `UmbralFondo` ni `scroll-dot`):
      - fondo partido, altos del §3.6 y `--nivel`;
      - `[data-hero]`, `[data-superficie]` y las capas con `data-capa`
        (PD-9);
      - H1 en un bloque con sus dos `span`;
      - descripción y los dos botones;
      - los cuatro objetos (botones, grupo con `aria-label` «Lo que ve tu
        cliente»), con la estrella del Google en `Glifo`;
      - pozos en SVG, dibujados al montar y con `ResizeObserver`;
      - encender por hover, toque o foco, con el pulso de unos 1,4 s;
      - lectura con «Ejemplo» y separadores `Glifo` «derecha»;
      - región `aria-live` que solo se rellena tras un gesto, más otro
        elemento sin `aria-live` para lo automático;
      - pozo 1 encendido en `esperarCortina()`.
    - El tirador **se pinta** aquí (botón con `Glifo` «vertical», círculo
      `--tarjeta`, borde `--tinta`, doble anillo de foco y `aria-label` del
      §3.6), pero no se mueve hasta T08.
    - Miniatura del reel: recorte de `public/plantillas/panaderia.jpg` a unos
      200 px, en `public/hero/reel.webp`.
    - Móvil según PD-10. Si a 360 px algo se corta, para y abre un C-xx con
      capturas.
    - Comprueba a 390 px que el área de la mayor línea del H1 supera a la de
      la descripción; si no, ajusta el ancho de la descripción.
  - *Tests*: activa §3.6 · Cada parada del hero es un servicio real.
  - *Comprobaciones*: activa «Hero · encender», «Hero · 360 px», «LCP ·
    áreas» y «Cabecera · logo claro y oscuro».
  - *Hecho*:
    - test y comprobaciones en verde;
    - capturas a 360, 390 y 1440 px junto a `a-390-1-hero` y `a-1440-1-hero`
      en la PR;
    - lint y build en verde.

- [x] **T08 · Hero vivo: inactividad, tirador, scroll y bajada de calidad.**
  - *Cubre*: spec §3.6 (inactividad, «Pausar ejemplos», tirador, scroll),
    §3.15 (bucle parado fuera de pantalla, bajada de calidad), §3.17 (hero),
    §6 (toque durante la inactividad, arrastre durante el scroll), PD-11.
  - *Depende de*: T07. *En paralelo con*: T09.
  - *Hacer*, en `Hero.tsx`:
    - el bucle único de PD-11;
    - inactividad: 5 s, una vuelta, 15 s de silencio tras un gesto, paradas
      del §3.6;
    - «Pausar ejemplos» / «Seguir con los ejemplos» con `aria-pressed`;
    - tirador con Pointer Events y `setPointerCapture`:
      - límites del §3.6 y vuelta en 0,65 s `expo.out`;
      - `touch-action: none` solo en él;
      - flechas del teclado, 24 px, y vuelta al perder el foco;
    - la superficie sube con el scroll (22 % y 12 %), solo con `transform`;
    - bajada de calidad: < 40 fps durante 2 s → sin inactividad y paradas
      sin recorrido;
    - movimiento reducido según §3.17.
  - *Comprobaciones*: activa «Hero · inactividad», «Hero · `aria-live`»,
    «Hero · tirador» y «Foco».
  - *Hecho*:
    - las cuatro comprobaciones en verde;
    - con la pestaña oculta o el hero fuera de pantalla, el bucle no corre
      (contador de fotogramas en la consola de `next dev`, que no se
      commitea);
    - lint y build en verde.

- [x] **T09 · Cortina y script del `<head>`.**
  - *Cubre*: spec §3.14 (entero), §3.16 («Sin parpadeo»: la clase
    `densidad-sobria`), §6 (sin GSAP, sin JS), PD-8, PD-13.
  - *Depende de*: T07. *En paralelo con*: T08.
  - *Hacer*:
    - `src/lib/scriptCabeza.ts` (PD-8) y su `<script>` en línea en el
      `<head>` de `layout.tsx`, más `suppressHydrationWarning` en `<html>`.
    - `layout/Cortina.tsx`:
      - misma API que `Preloader` (`PRELOADER_SESSION_KEY` con el mismo
        valor, `PRELOADER_DONE_EVENT`, `PRELOADER_GONE_EVENT`,
        `esperarCortina()`, que lee `html.cortina-si`);
      - los cinco pasos con `expo.inOut`, ≤ 3 s en total;
      - mide `[data-superficie]` antes de empezar;
      - anula el seguro (`window.__cortinaSeguro`) al arrancar y se retira
        en su `catch` (PD-13);
      - reloj que no cuenta atascos (> 0,1 s cuenta 1/30 s);
      - el H1 está pintado desde el primer fotograma.
    - Estilos en `estilos/cortina.css`: la cortina solo se ve con
      `html.cortina-si`, y el selector que la retira gana en especificidad.
    - Cambia `Preloader` por `Cortina` en `layout.tsx` y los imports de
      `Hero.tsx` y `Diagnostico.tsx:15`. Borra `Preloader.tsx` y
      `gearPath.ts` si nada más los usa (`engranaje.ts` sigue hasta T15).
  - *Comprobaciones*: activa las cuatro de «Cortina».
  - *Hecho*:
    - comprobaciones en verde, también con `--base /subcon-works-web`;
    - un diagnóstico abierto en frío por URL (`/?v=1&s=otro&…` completo)
      baja a `#diagnostico` **después** de la cortina;
    - lint y build en verde.

- [x] **T10 · Servicios («0 · Lo que montamos»).**
  - *Cubre*: spec §3.7, §3.13 (titular y entradilla).
  - *Depende de*: T06.
  - *Hacer*:
    - `Servicios.tsx`: `Titular` «Montamos lo que se ve y lo que va debajo.»
      (`em`: «y lo que va debajo.») y la entradilla;
    - los diez en el orden de `servicios.ts`, cada uno como un pozo:
      - arriba de su línea, número, nombre y descripción;
      - debajo, los `incluye` como paradas;
      - el `enlace` si lo tiene;
    - en escritorio, en filas, encendido al pasar el ratón o al enfocar (los
      demás en `--conducto`); en móvil, encendido al entrar en pantalla;
    - fuera `NodesScene`, `WorkImage`, el panel que seguía al cursor y los
      `data-cursor-*`. Los iconos de `/servicios/*.svg` no se usan aquí.
  - *Hecho*:
    - a 390 y 1440 px se ven los diez, sin texto en `--conducto` ni con
      opacidad;
    - el teclado enciende cada pozo;
    - lint y build en verde.

- [x] **T11 · La plantilla («−1») y la tarjeta de corte.**
  - *Cubre*: spec §3.8 (entero), §3.12 (`/plantillas/`: tarjeta sin dorsal,
    filtros, `priority` en las tres primeras), §3.4 (filtro activo), §6
    (catálogo con más de 30 o menos de 10 destacadas), §5 (`rel="noopener"`).
  - *Depende de*: T06.
  - *Hacer*:
    - `src/lib/dorsales.ts`: `conDorsal(plantillas)` → destacadas 1…N en el
      orden de `plantillas.ts` y el resto N+1…total. Más `partirConcepto`
      (copia la regla de `../undertactics-bocetos/js/comun.js:113`). Sin
      `@/`.
    - `TarjetaPlantilla` con `variante: "corte"`:
      - portada arriba con `width`/`height` y `lazy` (salvo `priority`);
      - línea de superficie y, debajo, en `--hondo`: negocio,
        `sector · ciudad`, el nombre del concepto en Kode Mono lima y el
        `movimiento` al pasar el ratón o al enfocar;
      - dorsal opcional;
      - enlace a `demo` con `target="_blank" rel="noopener"`;
      - sin `data-cursor-*`.
    - `Plantillas.tsx` (portada):
      - título «Una plantilla de N.» con `plantillas.length`;
      - aviso de negocios inventados (el texto de `/plantillas/`);
      - titulares con dorsal y banquillo en Kode Mono;
      - recuento y enlace a `/plantillas/`;
      - sin pin ni carrusel.
    - `CatalogoPlantillas`: tarjeta de corte sin dorsal y filtro activo
      según §3.4.
  - *Tests*: activa §3.8 · Dorsales. Añade un caso con 32 plantillas y 7
    destacadas.
  - *Hecho*:
    - test en verde;
    - `/plantillas/` filtra como hoy;
    - a 360 px el banquillo no corta texto;
    - lint y build en verde.

- [x] **T12 · Proceso («−2») con el testigo.**
  - *Cubre*: spec §3.9 (entero), §3.5 («2 semanas»), §6 (pin y carga
    tardía; sin JS: tabla), §3.17 (proceso como tabla).
  - *Depende de*: T06.
  - *Hacer*:
    - `proceso.ts`: `dato` (tabla del §3.9), `vesTu` y `debajo` en los seis
      pasos.
      - Parte de `../undertactics-bocetos/js/a.js:213-214`.
      - Faltan `vesTu` de los pasos 2 y 4 y `debajo` de los pasos 1, 3 y 5:
        redáctalos (los revisa Álvaro en P-04, T20).
    - `Proceso.tsx`:
      - **la tabla de dos columnas está en el HTML**, y el testigo se monta
        encima solo con JS y movimiento permitido;
      - pin de GSAP de unas 4,4 pantallas, también en móvil (testigo de unos
        56 px tras el canal del hilo);
      - broca, estratos (`--estrato-1…6`) y paso encendido;
      - pulso en el paso 05;
      - «2 semanas» bajo el paso 04;
      - `ScrollTrigger.config({ ignoreMobileResize: true })`;
      - `refresh()` con `ResizeObserver` sobre `<main>` y tras
        `document.fonts.ready`;
      - etiquetas sobre los estratos en `--hueso`.
    - Ningún ancestro con `transform`, `filter`, `will-change` ni
      `clip-path` mientras dura el pin.
  - *Tests*: activa §3.9 · Proceso.
  - *Comprobaciones*: activa «Proceso · broca y pasos; tabla con movimiento
    reducido» y «Sin JS».
  - *Hecho*:
    - test y comprobaciones en verde;
    - el pin funciona a 390 y a 1440 px sin saltos al soltarse;
    - lint y build en verde.

- [x] **T13 · Quién está debajo («−3»), Diagnóstico («−4») y Fondo.**
  - *Cubre*: spec §3.11 (entero), §3.5 (las cifras «36» y «0 €»), §3.12
    (`/sectores/<slug>/` acaba en el Fondo), PD-12.
  - *Depende de*: T06.
  - *Hacer*:
    - `QuienDebajo.tsx`: personas y `entradaEstudio` con el enlace a
      `/estudio/`; debajo, `Compromisos` como paradas de un pozo. Sin
      `useReveal`. `Compromisos` sigue aceptando `className`.
    - `DiagnosticoRapido.tsx`: cota «−4 · Diagnóstico» y detrás «Diagnóstico
      rápido · un minuto», en una línea en escritorio. Sin
      `data-cursor-hover`. La lógica no se toca.
    - `Fondo.tsx` (PD-12):
      - lo de `Auditoria` (`loQueRecibes`, `loQueNoPedimos`,
        `TOTAL_PREGUNTAS`) más «36» y «0 €» de `cifras.ts`;
      - «Empezar la auditoría» con `lineaApagada` y el correo;
      - `Simbolo` que se dibuja entero y la línea que se enciende cuando el
        botón cruza el 66 % (`IntersectionObserver`). No depende del hilo;
      - con movimiento reducido o sin JS, ya encendido.
    - `sectores/[slug]/page.tsx`: el cierre pasa de `CtaFinal` a `<Fondo />`.
    - Borra `CtaFinal.tsx` y `Auditoria.tsx` (las escenas de three que solo
      usaba `CtaFinal` las borra T18).
  - *Comprobaciones*: activa «Fondo · se enciende en la portada y en
    `/sectores/alojamientos-rurales/`».
  - *Hecho*:
    - comprobación en verde;
    - el diagnóstico de la portada y el de una página de sector funcionan
      como antes;
    - lint y build en verde.

- [ ] **T14 · El hilo (conducto principal).**
  - *Cubre*: spec §3.10 (entero), §6 (abrir a mitad de página; barra del
    navegador en móvil), §3.17 (conducto entero), PD-9.
  - *Depende de*: T07, T09, T10, T11, T12, T13.
  - *Hacer*: `layout/Hilo.tsx`, montado solo en la portada. Receta:
    `../casa-maria-olivenza-web/js/main.js` (l.406-528) y `trazoRevelable` /
    `progresoTramo` de `../biblioteca-movimiento/efectos/util.js`.
    - Trazo por el margen (mitad del gutter en ≥ 640 px, a 8 px en < 640
      px), con entrada horizontal a cada `[data-hilo]` y final en
      `[data-hilo-fin]`.
    - Cabeza al 66 %, `es-alcanzada` en las cotas pasadas.
    - Durante el pin del proceso, quieto en «−2»: anclas desde `start`/`end`
      de ScrollTrigger.
    - Recalcula con `ResizeObserver` en `<main>`, tras `fonts.ready` y tras
      la cortina; no con un `resize` que solo cambia el alto. Lanza
      `undertactics:hilo-medido`.
    - Al abrir a mitad de página, pinta el estado que toca sin animar.
    - Bucle parado fuera de pantalla y con la pestaña oculta.
    - Las secciones dejan libre el canal (padding izquierdo en
      `estilos/hilo.css`).
  - *Comprobaciones*: activa «Hilo».
  - *Hecho*:
    - comprobación en verde a 360, 390 y 1440 px;
    - con movimiento reducido, entero y en lima;
    - lint y build en verde.

## Interiores

- [x] **T15 · Páginas interiores y 404.**
  - *Cubre*: spec §3.12 (entero salvo `/plantillas/` tarjetas, T11, y
    `/auditoria/` campos, T16), §3.2 (H1 de interiores), §5 (frase de
    `/privacidad/`), deltas de la 001 §3.8 («Aspecto»).
  - *Depende de*: T06, T13.
  - *Hacer*:
    - `ui/CabeceraInterior.tsx`: superficie lima de 3 px bajo la cabecera,
      «Volver» con `Glifo`, cota y etiqueta en una línea (« · »), `Titular`
      nivel 1 y `--shrp` de la tabla del §3.12.
    - Úsala en `/herramientas/`, `/plantillas/`, `/estudio/`, `/auditoria/`,
      `/sectores/` y `/privacidad/`. `CabeceraSector` lleva lo mismo, con la
      cota «−4 · Sectores» antes de la etiqueta del sector.
    - `/estudio/`: `Compromisos` como en la portada; el enlace `/#equipo`
      sigue valiendo.
    - `/herramientas/`: `BrowserMockup` y `MovilMockup` con los tokens
      nuevos.
    - `not-found.tsx`: `Simbolo` sin línea de superficie y cota «Sin fondo ·
      404». Fuera la rueda; borra `engranaje.ts` si ya no lo usa nadie
      (`three/shared.ts` lo usa hasta T18: si es así, déjalo y que lo borre
      T18).
    - `/privacidad/`, apartado «Cookies»: la frase del §5.
    - Ninguna interior lleva cortina ni hilo.
  - *Comprobaciones*: activa «Interiores» y «Sin scroll horizontal».
  - *Hecho*:
    - comprobaciones en verde;
    - las siete páginas a 390 y 1440 px, capturas en la PR;
    - lint y build en verde.

- [x] **T16 · Formularios y estados (auditoría, diagnóstico, chat).**
  - *Cubre*: spec §3.4 (botones de `FormularioAuditoria` y «Seguir» de
    `PasoPregunta`; opción marcada; burbujas de `ChatEjemplo`), §3.12
    (`/auditoria/`: bordes en `--apagado-abajo` y foco), §3.11 («−4»: el
    bloque de la 001 con el aspecto nuevo).
  - *Depende de*: T06.
  - *Hacer*:
    - `FormularioAuditoria.tsx`: los cuatro botones con `Boton` o sus
      clases, barra y punto de paso en línea, aviso de éxito sin relleno
      lima, campos con borde `--apagado-abajo` y el foco del §3.4. **No
      cambies la lógica.**
    - `PasoPregunta.tsx`, `Resultado.tsx` y `EnlaceMejora.tsx`: estados del
      §3.4, sin `data-cursor-*`. **No toques el import de `esperarCortina`
      en `Diagnostico.tsx`** (lo cambia T09).
    - `ChatEjemplo.tsx`: burbujas del §3.4. «Ejemplo · negocio inventado»
      se queda.
  - *Comprobaciones*: activa «001 sigue cumpliendo» (diagnóstico, URL,
    prerrelleno, «Copiar enlace», según la comprobación en navegador de la
    001 §7 con sus deltas).
  - *Hecho*:
    - comprobación en verde;
    - `npm test` sigue con los tests de la 001 en verde;
    - lint y build en verde.

## Mando, bajas y presupuesto

- [x] **T17 · Mando de maqueta, Sobria y contraste.**
  - *Cubre*: spec §3.16 (entero), §3.17 (repaso), §3.1 (reglas 3 a 5, con
    la comprobación de contraste real).
  - *Depende de*: T08, T14, T15, T16.
  - *Hacer*:
    - `layout/Mando.tsx`:
      - solo se pinta si la URL lleva `revision`;
      - «Por debajo» y «Sobria» con `aria-pressed`;
      - cambia `densidad-sobria` en `<html>`;
      - `history.replaceState` conservando los demás parámetros y el `#hash`;
      - nada en `localStorage`.
    - `estilos/sobria.css`: sin hilo, sin pozos de tarjetas ni de Servicios
      (lista), sin testigo dibujado (la tabla), sin dorsales. Bajo las
      plantillas, el recuento «N sectores · N bases · 2 semanas», con
      `sectoresPlantillas.size` y `plantillas.length`.
    - Repasa §3.17 en todas las zonas, con `reducedMotion: "reduce"`.
  - *Comprobaciones*: activa «Mando», «Fondo y proceso en Sobria» y
    «Contraste real». La de contraste:
    - portada y siete interiores, a 390 y 1440 px, en las dos densidades;
    - con un pozo encendido y otro en reposo;
    - si falla algo de otra zona, arréglalo aquí y dilo en la PR.
  - *Hecho*:
    - comprobaciones en verde;
    - `?revision=sobria` pinta Sobria desde el primer fotograma (captura
      tras `domcontentloaded`);
    - lint y build en verde.

- [ ] **T18 · Bajas del kit y de three.**
  - *Cubre*: spec §2 («Bajas»), PD-14, PD-4 (comprobación de glifos).
  - *Depende de*: T17 (y con ella, todas las de la portada y las
    interiores).
  - *Hacer*:
    - Borra todo lo de la lista de bajas del §2 y de PD-14 que quede:
      - componentes;
      - `src/components/three/`;
      - hooks;
      - `engranaje.ts` y `gearPath.ts`;
      - las clases de `globals.css`;
      - los `data-cursor-*`;
      - `cursor: none`;
      - `--scroll-velocity`.
    - En `layout.tsx`, fuera `Cursor`, `Grain` y `ScrollLine`.
      `SmoothScroll` se queda sin `useScrollVelocity`.
    - `npm uninstall three @types/three motion`.
    - `SplitText` fuera de `registerGsap` si nadie lo usa.
    - README: quita «tres escenas de Three.js» de la entradilla.
  - *Tests*: activa §2 · Bajas.
  - *Comprobaciones*: activa «Glifos».
  - *Hecho*:
    - test y comprobación en verde;
    - `npm run comprobar` sigue sin `FALLO`;
    - `out/` no tiene ningún chunk con `three`;
    - lint y build en verde.

- [ ] **T19 · Presupuesto y «Nivel» en el README.**
  - *Cubre*: spec §3.15 (entero), §3.18, PD-15.
  - *Depende de*: T18.
  - *Hacer*:
    - Completa `scripts/medir.mjs`: INP del instrumento (tocar un objeto,
      arrastrar el tirador), CLS de carga + scroll por el hero + 1 s de
      arrastre, y tareas largas con el control lanzado con `setTimeout`.
    - Mide con `npm run build` + `servir.mjs` y escribe en el `README.md`:
      - la tabla «Presupuesto» con las cifras **medidas** (y la línea base de
        T01 al lado);
      - el apartado «Nivel» del §3.18;
      - «Qué hay en la web» con las siete secciones nuevas.
    - Si una cifra pasa del tope, PD-15: no se relaja; PR `fix/rd-…` o C-xx.
  - *Hecho*:
    - todas las cifras dentro del tope y escritas en el README;
    - el elemento LCP de la portada es el `<h1>` o una de sus líneas, con
      cortina y sin ella;
    - lint y build en verde.

## Cierre

- [ ] **T20 · Textos (P-04) y revisión con `?revision`.** *Manual, con
  Álvaro.*
  - *Cubre*: P-04, D-020, la lista «A mano» del §7.
  - *Depende de*: T19.
  - *Hacer*:
    - junta en la descripción de la PR de integración los textos de P-04:
      descripción del hero, entradilla de Servicios, cotas, columnas «Lo que
      ves tú» / «Lo que hacemos por debajo» (las seis filas), ejemplos del
      hero y la frase de `/privacidad/`;
    - Álvaro los corrige o los aprueba, y se aplican;
    - Álvaro mira la web con `?revision` en las dos densidades, en un móvil
      de verdad, contra `_capturas/a-*`, y pasa un lector de pantalla por el
      hero;
    - lo que pida cambiar va en PR `fix/rd-…` contra la de integración.
  - *Hecho*:
    - P-04 cerrada en `DECISIONES.md` con fecha;
    - la lista «A mano» marcada en la PR de integración.

- [ ] **T21 · Comprobar la spec.** *Modelo: Opus 5.5 medium*. La comprobación
  de contraste, LCP e INP pide criterio, y la spec toca `/privacidad/` (§5).
  - *Cubre*: spec entera, deltas a la 001, P-05.
  - *Depende de*: T01-T20 mergeadas en `feat/rediseno-por-debajo`. Se hace en
    un chat o agente que **no ha construido nada de esta spec**. No arregla
    nada: comprueba e informa.
  - *Hacer*:
    1. Lee la spec (con sus deltas), este `tasks.md` y la lista «A mano» de
       T01 (marcada en T20).
    2. Ejecuta `npm test` y `npm run comprobar -- --estricto` (también con
       `GITHUB_ACTIONS=true` y `--base /subcon-works-web`). Ninguno puede
       seguir pendiente: un `skip` o un `PENDIENTE` cuenta como «no cumple».
    3. Ejecuta `npm run medir` y compara con el README.
    4. Por cada regla con número de la spec que no tenga test ni
       comprobación, compruébala de verdad en `out/` con Playwright, a 390 y
       1440 px. Ejemplos: los topes del §3.15, los 5 s y 15 s de §3.6, el
       ≤ 3 s de la cortina y las `SHRP` de §3.5 y §3.12. Lo que no se pueda
       ver va como «no comprobable», con el motivo.
    5. Escribe `specs/002-rediseno-por-debajo/comprobacion.md`: fecha, modelo
       y una tabla criterio · cómo se comprobó · cumple / no cumple / no
       comprobable · nota.
    6. Mira si `feat/chatbot` está ya en `main`. Si sí: mergea `main` en la
       de integración y adapta el widget a los tokens (P-05: fondo
       `--estrato`, texto `--hueso`, sin lima de relleno). Si no, apúntalo
       en P-05: lo adaptará `feat/chatbot` al mergearse.
    7. **Si todo cumple** (los «no comprobable» con motivo no frenan):
       - consolida los deltas (pasos de abajo);
       - pasa la 002 a `hecha` en `SDD.md` y en su cabecera;
       - abre la PR `feat/rediseno-por-debajo` → `main` con el resumen de
         `comprobacion.md`. Merge, solo Álvaro: publica (avisar de Ctrl+F5
         por la caché de Pages).

       **Si algo no cumple**: no consolides ni cambies el estado; commitea
       `comprobacion.md`, abre la PR contra la de integración y termina con
       «BLOQUEADO:» y la lista de lo que no cumple.

    **Consolidar deltas** (solo si todo cumple), para la 001:
    1. Aplica cada delta del apartado 8 de esta spec al texto de
       `specs/001-diagnostico-y-sectores/spec.md`: AÑADE y MODIFICA pegan el
       texto nuevo en su §; QUITA lo borra. Si un conflicto (C-xx) abierto
       durante la implementación cambió lo que dice un delta, manda el C-xx:
       escribe lo que se hizo y cítalo.
    2. Si un delta no cuadra con el código y ningún C-xx lo explica, no
       inventes: para y dilo (es un hueco, no una errata).
    3. Cabecera de la 001: quita `Cambios pendientes: 002 (…)` y añade
       `002 (fecha)` a `Cambiada por:`.
    4. Fila de la 001 en `SDD.md`: que no cite la 002.
    5. En esta spec, el bloque «001 · …» del apartado 8 pasa de `—
       pendiente` a `— consolidado AAAA-MM-DD`. No se borra.
  - *Hecho*:
    - `comprobacion.md` escrito;
    - si todo cumple:
      - la 002 está `hecha`;
      - la 001 ya no lleva `Cambios pendientes: 002`, y su fila en `SDD.md`
        no cita la 002;
      - la PR a `main` está abierta;
    - si no, la PR termina en «BLOQUEADO:».
