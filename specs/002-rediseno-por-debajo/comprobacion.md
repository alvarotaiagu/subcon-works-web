# 002 · Comprobación de la spec (T21)

Fecha: 2026-10-16 · Modelo: Claude Opus 5.5 · Rama comprobada: `feat/rediseno-por-debajo` en
`e80a299` (merge de la PR #42, T20), en el worktree `subcon-works-web-rd21`, con `npm ci` propio.
Quien comprueba no ha construido nada de esta spec. No se ha arreglado nada.

## Resultado: NO CUMPLE

| # | Qué no cumple | Regla | Origen probable |
|---|---|---|---|
| 1 | **T19 no está mergeada.** No hay rama `feat/rd-t19-presupuesto` en GitHub; sus dos commits (`fc0183a`, `e954869`) y cambios sin commitear (`README.md`, `DECISIONES.md`, `spec.md`) siguen solo en el worktree local `subcon-works-web-rd19`. | Dependencia de T21 («T01-T20 mergeadas») | — |
| 2 | El `README.md` no tiene la tabla «Presupuesto» con cifras medidas ni el apartado «Nivel». | §3.15, §3.18, §7 «Rendimiento» | T19 |
| 3 | `medir.mjs` de la integración aún dice «sin medir (hasta T19)» en el INP del instrumento y en el CLS del arrastre. Medidos aparte, sí cumplen (ver tabla). | §3.15, §7 | T19 |
| 4 | **Tareas largas tras `document.fonts.ready`**: máx 336 ms (portada con cortina), 387 ms (sin cortina), 308 ms (`/plantillas/`), 258 ms (sector). Tope: ninguna > 200 ms. Causas: hidratación de React con el arranque de módulos (unos 270-310 ms) y los efectos de los componentes con `ScrollTrigger.refresh` y la creación de triggers (unos 340 ms). | §3.15 | T19 (su commit `e954869` toca esto, sin mergear) |
| 5 | **Alto del hero en escritorio** por encima de `clamp(700px, 100svh, 900px)`: 914 px a 1440×900, 814 px a 1440×600 (el clamp da 700), 864 a 1440×800, 809 a 1280×720 y 936 a 1920×1080. Por eso el **nivel no está al 50 %**: va del 41,5 al 49,2 %. Es un `min-height` y la rejilla de debajo lo empuja. | §3.6 «Composición» | T07 |
| 6 | **Sin GSAP**: si GSAP falla, se cae la página entera en el error genérico de Next («This page couldn't load»), sin `<main>`, sin los `h2` y sin la tabla del proceso. La spec pide la cortina retirada y todo el contenido visible. No hay un chunk solo de GSAP (va con la cortina, Lenis y el layout), así que el fallo se simuló reescribiendo el chunk: no es un bloqueo real de un fichero. | §6 «Sin GSAP» | T08/T09/T12 (ningún límite de error) |
| 7 | **Títulos de los compromisos en Geologica**, no en Kode Mono: los `h3.pozo-titulo` de `#equipo` los pisa la regla suelta `h1,h2,h3 { font-family: var(--letra-geologica); … }` de `globals.css` (fuera de capa, gana a `@layer components`). La misma regla deja el tracking de `.titular` en −0,01em en vez de los −0,035em de su CSS, y el de `.proceso-paso-titulo` en −0,48 px con interlineado 1,02 (no 1,05). Estos dos no los fija la spec, pero chocan con el CSS del proyecto. | §3.11 «Quién está debajo» | T13 / T02 |

Hasta que esto se arregle, ni se consolidan los deltas en la 001 ni cambia el estado de la 002.

## Pasos 2 y 3: tests, comprobación y medida

| Qué | Resultado |
|---|---|
| `npm test` | 65 pasan · 0 fallan · 0 `skip` |
| `npm run lint` · `npm run build` | en verde |
| `npm run comprobar -- --estricto` (build normal, puerto 4321) | **26 OK · 0 FALLO · 0 PENDIENTE** |
| `GITHUB_ACTIONS=true` build + `comprobar -- --estricto --base /subcon-works-web` | ver «Pasada de CI», abajo |
| `npm run medir` (iPhone 13, 4G, CPU ×4, mediana de 3) | LCP portada 1,57 s con cortina y 1,71 s sin ella (elemento `h1 > span.hero-l1`); `/plantillas/` 1,95 s; `/sectores/alojamientos-rurales/` 1,45 s. CLS 0,000 en todas (carga y scroll por el hero). Letras: 2 ficheros, 62,9 KB. Tareas largas: **no cumple** (ver la fila 4). INP y CLS del arrastre: «sin medir (hasta T19)». |
| Comparar con el README | No se puede: el README no tiene la tabla «Presupuesto» (fila 2). |

### Pasada de CI

`GITHUB_ACTIONS=true npm run build` en verde, con `/subcon-works-web/fuentes/…` en el
`@font-face` y en el `preload` de `out/`. `comprobar -- --estricto --base /subcon-works-web`:
**25 OK · 1 FALLO · 0 PENDIENTE**. El fallo es «Hero · inactividad», «antes de 5 s quieto ya
cambia de pozo», y se repite en tres pasadas.

**El fallo es de la comprobación, no de la web.** Con `basePath`, el evento `load` llega
(unos 0,2 s) antes de que el hero hidrate y encienda el pozo 1 (unos 0,3 s). Por eso
`registrarCambiosDePozo` empieza con `actual = -1` y cuenta como cambio el encendido inicial
(−1 → 0). Medido aparte, con un observador desde `DOMContentLoaded` (3 cargas): el pozo 1 se
enciende a 284-329 ms y el primer cambio automático llega a 5250-5302 ms, es decir, **4,97 s
después**: cumple los 5 s. Hay que arreglarlo en `comprobar.mjs` (T08): esperar a que haya un
pozo `es-activo` antes de registrar, o no contar el paso desde −1.

Ojo al lanzarlo desde Git Bash: hay que poner `MSYS_NO_PATHCONV=1` delante. Si no, `--base
/subcon-works-web` llega como `C:/Program Files/Git/subcon-works-web` y fallan 20.

## Paso 4: reglas sin test ni comprobación

Comprobadas en `out/` con Playwright a 390 y 1440 px (más anchos donde se dice), con el `<title>`
mirado antes de probar. Cookies aceptadas y cortina dada por vista en `addInitScript`, salvo
en las pruebas que tratan de eso. Con Lenis, el scroll se hace con `mouse.wheel`.

### Hero (§3.6, §3.17)

| Criterio | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| §3.6 Alto en escritorio `clamp(700px, 100svh, 900px)` | `offsetHeight` de `[data-hero]` en 8 tamaños | no cumple | Fila 5 |
| §3.6 Nivel al 50 % en escritorio | Centro de `.hero-superficie` frente al alto real | no cumple | 41,5-49,2 %. Misma causa que la fila de arriba. |
| §3.6 Móvil: alto ≥ 100svh, nada recortado, nivel fijo en px | 390×844 y 360×640: alto, elementos fuera de la caja, `scrollWidth` | cumple | 1003 px; 0 fuera; nivel a 352 px |
| §3.6 Línea lima de 3 px | Rectángulo y color de `.hero-superficie` | cumple | 3 px, #C9F24D |
| §3.6 Tirador: 160/60 px en escritorio, 160/0 en móvil | Arrastre con ratón (1440) y con CDP `Input.dispatchTouchEvent` (390) | cumple | −160/+60 y −160/0 |
| §3.6 Al soltar, vuelve en 0,65 s con expo out | `translateY` por fotograma desde `pointerup` | cumple | 0 a los 679-680 ms, curva expo out |
| §3.6 Flechas a 24 px y vuelta al perder el foco | `focus()` + teclas | cumple | −24, −48, topes; 0 tras `blur` |
| §3.6 `touch-action: none` solo en el tirador | `touchAction` calculado | cumple | Fuera del tirador, el arrastre hace scroll |
| §3.6 `aria-label` del tirador | Atributo | cumple | Literal |
| §3.6 La superficie sube ≤ 22 % (escritorio) y ≤ 12 % (móvil) con el scroll | `translateY` frente a `scrollY` | cumple | 22,00 % y 12,00 % del alto real |
| §3.6 Pulso de unos 1,4 s | Paradas encendidas por fotograma, 3 veces | cumple | El pulso termina a 1402-1411 ms |
| §3.6 Un solo pozo encendido a la vez | `.hero-pozo.es-activo` por fotograma | cumple | Siempre 1 |
| §3.6/§3.1 Colores de las paradas en reposo y encendidas, sin opacidad | Color y opacidad calculados | cumple | Reposo #8FA19E; encendidas #C9F24D / #E4ECE8; opacidad 1 |
| §3.6 Mover la superficie solo con `transform` | MutationObserver de `style` y geometría por fotograma | cumple | Solo se escribe `transform` |
| §3.6 Miniatura del reel en WebP de unos 200 px | `currentSrc` y fichero | cumple | `hero/reel.webp`, 200×356, 10 KB |
| §3.6/§3.13 Un solo `h1`, `site.tagline`, descripción, botones | DOM y `site.ts` | cumple | Textos literales |
| §3.17 Movimiento reducido: pozo 01 quieto, superficie fija, tirador sin vuelta animada | `reducedMotion: "reduce"` | cumple | Sin pulsos ni inactividad; vuelta en el fotograma siguiente |
| §3.2 Tildes en mayúscula a .92 | El titular no lleva mayúsculas con tilde: se calculó en canvas con Geologica 300 | cumple | El interlineado sube a 1,02, como permite el §3.2 |
| §3.2 `SHRP` 0 en la línea de arriba, sin animar | `fontVariationSettings` por fotograma | cumple | Siempre «SHRP» 0 |
| §3.15 Bajada de calidad (< 40 fps durante 2 s) | Trabajo forzado por fotograma (unos 34 fps) y código | cumple | `data-calidad="baja"` a 2,3 s; con 1,5 s no baja |

### Cortina (§3.14, §6)

| Criterio | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| §3.14 Pasos 1-5 en ≤ 3 s | `performance.now` desde el arranque de `Cortina.tsx` hasta `PRELOADER_GONE_EVENT`, 30 cargas, CPU ×1 y ×4 | cumple | ×1: 2,50-2,58 s. ×4: 2,73-**2,997** s, en el borde. Contado desde el `<head>`, con ×4 se ve 3,8-5,1 s (la hidratación tarda 1,1-2,2 s). La spec solo cuenta los pasos 1-5. |
| §3.14 `DONE` antes que `GONE`; scroll bloqueado hasta `GONE` | Eventos con su hora; rueda durante la cortina | cumple | 30 de 30 en orden; `scrollY` 0 hasta `GONE` |
| §3.14 Fondo #10262A / #081113 con el símbolo | Estilos calculados | cumple | |
| §3.14 `expo.inOut` | Código | cumple (por código) | rAF propio con `expoInOut` |
| §3.14 Seguro de 4,5 s en el `<head>`, anulado al arrancar | Script de `out/index.html`; chunk de la cortina abortado | cumple | Retirada a 4509-4511 ms |
| §3.14 El selector de retirada gana | CSS compilado | cumple | Se retira quitando la clase |
| §6 Sin GSAP | Fallo simulado de GSAP | **no cumple** | Fila 6 |
| §3.14 Titular pintado bajo la cortina | `opacity`, `visibility` y área del `h1` por fotograma | cumple | Opacidad 1; área visible mínima del 78 % |
| §3.14 `js-si` siempre; `cortina-si` solo cuando toca; una interior no marca la sesión | Clases al insertar `<body>` y `sessionStorage` | cumple | |
| §6 Abrir `/#proceso` con cortina | `scrollY` por fotograma | cumple | Salta 70 ms después de `GONE` y llega con top 0 |
| §3.16 `densidad-sobria` desde el `<head>` | Clases al insertar `<body>` | cumple | |

### Proceso y resto de la portada (§3.2, §3.5, §3.7-§3.11, §3.16)

| Criterio | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| §3.2/§3.5 `SHRP` por cota (20, 40, 75, 85, 95, 100), sin animar | `fontVariationSettings` por fotograma | cumple | |
| §3.2 Escala del H2, segunda línea y número de paso | Estilos calculados | cumple | Interlineado del H2 en 1,02 (la regla de la tilde) |
| §3.2 Palabras que emergen: `inline-block` + `nowrap`, 100→0, 0,04 s, una vez; el H1 del hero sin partir | Estilos, retardos y MutationObserver | cumple | Transición CSS en vez de `yPercent` de GSAP, con el mismo efecto |
| §3.9 Pin también en móvil, unas 4,4 pantallas | `position` y alto del pin-spacer | cumple | 4,40 en los dos anchos |
| §3.9 Testigo de unos 56 px en móvil, tras el canal | Rectángulos | cumple | |
| §3.9 Ancestros de lo anclado sin `transform`/`filter`/`will-change`/`clip-path`; `overflow` sin `hidden` junto a sticky | Estilos por fotograma durante el pin | cumple | |
| §3.9 `ignoreMobileResize` | Código y bundle | cumple (por código) | |
| §3.9 Datos de los pasos, «2 semanas» bajo el 04, pulso en el 05 | Textos y animaciones | cumple | |
| §3.5 Cota y etiqueta en la misma línea con « · » en escritorio | Rectángulos en `#diagnostico` | cumple | |
| §3.7 Los diez servicios en orden; pozo encendido con hover o foco, el resto en `--conducto` | Nombres y colores | cumple | |
| §3.8 «Una plantilla de N.», dorsales 1-10, `lazy` con `width`/`height`, `noopener`, «¿Tu sector no está?» con `mailto`, «30 plantillas» | DOM frente a `plantillas.ts` | cumple | |
| §3.11 Personas, `entradaEstudio` y enlace a `/estudio/` | DOM | cumple | |
| §3.11 Compromisos como paradas, en Kode Mono | Letra calculada | **no cumple** | Fila 7 |
| §3.11 Fondo: «36», «0 €», botón y `mailto`; encendido con movimiento reducido | DOM y estilos | cumple | |
| §3.16 Sobria: recuento «N sectores · 30 bases · 2 semanas», sin pozos ni dorsales | `?revision=sobria` | cumple | N = 30 = `sectoresPlantillas.length` |
| §3.10 El hilo va por el canal del gutter y el contenido no se mete | x de los tramos a 390, 639, 640 y 1440 | cumple | x = 8 · 8 · 16 · 32 |
| §3.10/§3.17 Hilo entero y en lima con movimiento reducido | `strokeDashoffset` | cumple | |
| §6 Recarga a mitad de página | Recorrido del hilo y cotas por fotograma tras recargar | cumple | No anima desde arriba. Ojo: el navegador restaura a `scrollY` 6840 en vez de 10800, unas 4,4 pantallas más arriba (el relleno del pin). La spec no habla de la posición restaurada. |
| §3.5 Las anclas llegan a su sección | `/#id` en contexto nuevo | cumple | |
| §6 Texto suelto en un grid dentro de `<span>`; estados con `es-` | Recorrido y MutationObserver | cumple | |

### Interiores y piezas comunes (§3.1, §3.3, §3.4, §3.12, §3.13, §5)

| Criterio | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| §3.12 `SHRP` del H1 por página; el H1 usa la escala de H2 | Estilos calculados en las 8 páginas | cumple | |
| §3.12 Línea lima de 3 px bajo la cabecera | Rectángulo y color | cumple | |
| §3.1 `theme-color` y `color-scheme` por página | Meta de los 12 HTML y tras navegar en cliente | cumple | |
| §5 Noindex en todas las páginas | Los 12 HTML de `out/` | cumple | |
| §3.3 `og:image:alt` fijo; §3.13 `description` de la portada | Meta | cumple | |
| §5 Frase de la cortina en `/privacidad/` | Texto | cumple | |
| §3.12 `/plantillas/`: sin dorsal, filtros, tres primeras sin `lazy`, filtro activo hueso/hondo con línea de 2 px, «Pedir la de mi sector» | DOM y estilos | cumple | |
| §3.12/§3.4 `/auditoria/`: bordes en `--apagado-abajo`, foco con recuadro y línea, sin `.campo:focus{outline:none}` | Estilos, 60 Tab, CSS compilado | cumple | |
| §3.12 Sector: cierre con el Fondo sin conducto, `#asistente` con «Ejemplo · negocio inventado», cota y etiqueta con « · », burbujas | DOM y estilos | cumple | La cota del Fondo lleva un `data-hilo` sin hilo: no hace daño |
| §3.4 Cabecera oscura en las interiores; hondo al 92 % en la portada tras cruzar | Estilos | cumple | |
| §3.4 Menú móvil a pantalla completa con sus cotas | 390×844 | cumple | |
| §3.4 Botones: colores, línea de 2 px, el hover invierte sin escalar | Estilos | cumple | |
| §3.4 Hover en `--dur-fast` | — | no comprobable | Se midió el estado final, no la duración |
| §3.4/§3.1 Ningún relleno lima visible | Barrido de 9 páginas × 2 anchos | cumple | |
| §3.4 Foco en las interiores y con `forcedColors` | Tab en 5 páginas | cumple | |
| §3.4 Pie en `--roca`; aviso de cookies en estrato/hueso | Estilos | cumple | |
| §3.4 Transición entre páginas desde una línea lima; directa con movimiento reducido | Muestreo por rAF | cumple | |
| §5 `rel="noopener"`; sin Google Fonts; Lenis desde npm | 45 enlaces, red y bundle | cumple | |

### Rendimiento (§3.15, §2, §4)

| Criterio | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| §3.15 INP del instrumento ≤ 200 ms | Event Timing, iPhone 13, CPU ×4, 4 toques + 1 s de arrastre táctil, 2 tandas de 3 | cumple | Medianas de 104 y 88 ms; máx 112 ms |
| §3.15 CLS de 1 s de arrastre y total ≤ 0,05 | `layout-shift` con `hadRecentInput` | cumple | 0,000 |
| §3.15 Tareas largas ≤ 200 ms | `medir` + traza CDP | **no cumple** | Fila 4 |
| §3.15 Sin canvas ni WebGL | 28 cargas, espía de `getContext` | cumple | |
| §3.15 El bucle del hero y del hilo se para fuera de pantalla y con la pestaña oculta | rAF por fichero | cumple | El ticker de GSAP que mueve Lenis sigue a unos 125 rAF/s también con la pestaña oculta (fuera del criterio) |
| §3.15 Bajada de calidad | CPU ×20 y código | cumple | |
| §2/§4 `package.json` | `git diff main` | cumple | Salen `three`, `@types/three` y `motion`; entra `playwright` fijado |
| §3.15/§3.18 README «Presupuesto» y «Nivel» | Lectura | **no cumple** | Filas 1 y 2 |

## Paso 6: `feat/chatbot` (P-05)

`feat/chatbot` **no está en `main`**: ni siquiera está en GitHub (solo hay una rama local, en
`b15434e`). No se mergea nada. Lo adaptará `feat/chatbot` a los tokens de la 002 cuando se
mergee (P-05).

## Lista «A mano» (§7)

Marcada entera en la PR de integración #41 (T20): textos de P-04, las dos densidades en un móvil
de verdad, el aspecto contra `_capturas/a-*` y el lector de pantalla por el hero.

## Otras notas (no frenan)

- En `tasks.md`, T14 y T18 siguen con `[ ]` aunque están mergeadas (#36 y #40).
- `main` lleva dos merges que no están en la integración (#22, ping a Supabase; #35, CLAUDE.md).
  La PR #41 sale como `MERGEABLE`.
- El interlineado de los H1 y H2 es 1,02 y no 1: es la subida que permite el §3.2 por las tildes.
