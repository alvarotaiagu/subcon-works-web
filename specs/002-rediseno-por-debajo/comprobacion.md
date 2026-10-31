# 002 · Comprobación de la spec (T21), repetida

Fecha: 2026-10-31 · Modelo: Claude Sonnet 5.5 · Commit de `main` comprobado: `cba0ddd`
(merge de la PR #50), en un worktree propio con `npm ci`. Quien comprueba no ha
construido nada de esta spec. No se ha arreglado nada.

## Resultado: NO CUMPLE (3 filas)

De las 7 filas del 2026-10-16, 5 se han arreglado, 1 sigue (con otra cifra) y 1 se ha
reducido a un caso. Aparece además 1 fallo nuevo.

| # | Qué no cumple | Regla | Origen probable |
|---|---|---|---|
| A | **Tareas largas, portada con cortina**: mediana de la tarea más larga tras `fonts.ready` = **316 ms** (tope D-031: 300 ms con CPU ×4); por carga 366, 335, 244, 316, 194. Las otras tres rutas cumplen (274, 251, 215 ms). Sin otro Chrome headless en marcha al empezar, pero con otras sesiones de Claude en el PC; el README ya avisa de que la medida baila entre pasadas (201-422 ms). Repetir `medir` con el PC libre antes de dar el fallo por firme. | §3.15 + D-031 | Hidratación y arranque de módulos de la portada (no se puede partir `react-dom`). Es la fila 4 del 2026-10-16, mucho más cerca. |
| B | **Alto del hero a 1920×1080**: 921 px (clamp = 900), nivel al 48,9 % en vez de 50 %. A 1440×900 sale 900 px y 50,0 %, bien. D-030 dice que a 1440×900 y 1920×1080 «miden 900». | §3.6 «Composición», D-030 | T07 / PR #45 (`b0cf54d`): la rejilla de debajo de la superficie sigue empujando el `min-height` en pantallas grandes. |
| C | **Test «LCP · área del titular > descripción a 390 px»** de `comprobar.mjs`: la mayor línea del titular mide 17200 px² y la descripción 21754 px². Falla en la pasada normal y en la de CI (`--base`), las dos veces. Nuevo: el 2026-10-16 no fallaba. `medir` dice que el LCP real sigue en el `<h1>` (`h1 > span.hero-l1`, 1,48 s y 1,59 s), así que puede ser solo la comprobación o una regresión del reparto de áreas. | §3.6 / §7 «LCP» | Algún cambio del hero entre #43 y #50 (probablemente #45, hero y compromisos). No se ha bisecado. |

Hasta que esto se arregle, ni se consolidan los deltas en la 001 ni cambia el estado
de la 002 (T21, «Si algo no cumple»).

## Resultado anterior (2026-10-16): NO CUMPLE, 7 filas, y qué las arregló

| # | Fila de entonces | Ahora | PR |
|---|---|---|---|
| 1 | T19 sin mergear | arreglada | #43 |
| 2 | README sin «Presupuesto» ni «Nivel» | arreglada (las dos secciones existen y las cifras están) | #43 |
| 3 | `medir.mjs` con «sin medir (hasta T19)» | arreglada: mide INP del instrumento y CLS del arrastre | #43 |
| 4 | Tareas largas > 200 ms | el tope pasó a «mediana ≤ 300 ms» (D-031, aprobada por Álvaro el 2026-10-31); la carga diferida de GSAP/Lenis ayudó. Sigue sin cumplir en una ruta: fila A | #46, #47, #48 |
| 5 | Alto del hero y nivel al 50 % | cumple a 1440×900 (900 px, 50,0 %); en pantallas bajas el hero crece por D-030 (1440×600: 799; 1440×800: 849; 1280×720: 794). Queda 1920×1080: fila B | #45 |
| 6 | Sin GSAP se cae la página | arreglada: test D-028 «Sin GSAP: chunks de GSAP y Lenis abortados» en verde | #45, #46 |
| 7 | Compromisos en Geologica | arreglada: los tres `h3.pozo-titulo` salen en Kode Mono | #45 |

Tampoco ha vuelto a fallar «Hero · inactividad» con `--base` (el fallo de la pasada de CI
del 2026-10-16): pasa en las dos pasadas.

## Tests, comprobación y medida

| Qué | Resultado |
|---|---|
| `npm test` | 66 pasan · 0 fallan · 0 `skip` |
| `npm run lint` · `npm run build` | en verde |
| `npm run comprobar -- --estricto` (build normal, puerto 4322) | 26 OK · **1 FALLO** · 0 PENDIENTE (fila C) |
| `GITHUB_ACTIONS=true` build + `comprobar -- --estricto --base /subcon-works-web` | 26 OK · **1 FALLO** · 0 PENDIENTE (la misma, fila C) |
| `npm run medir` (iPhone 13, 4G, CPU ×4, mediana de 5) | LCP: portada con cortina 1,48 s, sin cortina 1,59 s (ambas `h1 > span.hero-l1`), `/plantillas/` 1,96 s, sector 1,47 s. CLS 0,000 en todo, incluido el arrastre. INP del instrumento 80 ms (con cortina) y 72 ms (sin). Letras: 2 ficheros, 62,9 KB. Tareas largas: 316 / 274 / 251 / 215 ms de mediana; **portada con cortina no cumple** (fila A). |
| Comparación con el README | Cuadra en LCP, CLS, INP y letras. Las tareas largas del README (201-422 ms, «mide con la máquina libre») son del mismo orden. |

## Qué se ha repasado a mano esta vez

Solo lo que tocaban las 7 filas y lo que podían romper los arreglos. El resto de la tabla
del 2026-10-16 (hero, cortina, proceso, interiores, rendimiento) queda cubierto por los
27 tests de `comprobar` y por `medir`, que pasan salvo lo anotado.

| Criterio | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| §3.6 Alto del hero `clamp(700px, 100svh, 900px)` y nivel al 50 % | `getBoundingClientRect` de `[data-hero]` y `.hero-superficie`, 5 tamaños | no cumple en 1920×1080 | Fila B. 1440×900: 900 px, 50,0 %. Por debajo de ~830 px de alto el hero crece (D-030). |
| §3.11 Compromisos en Kode Mono | `fontFamily` calculada de `#equipo h3` | cumple | Los tres `pozo-titulo` |
| §6 Sin GSAP | Test D-028 de `comprobar` | cumple | |
| §3.15 INP ≤ 200 ms, CLS ≤ 0,05, letras ≤ 70 KB | `medir` | cumple | |
| §3.15 Tareas largas (D-031) | `medir` | no cumple (1 ruta) | Fila A |
| README «Presupuesto» y «Nivel» | Lectura | cumple | |

No se ha repetido a mano nada más de la tabla anterior (un fallo ya impide consolidar).
Cuando se arreglen A, B y C y se repita la T21, conviene volver a pasar la tabla entera.

## `feat/chatbot` (P-05)

No se ha mirado de nuevo; sigue como el 2026-10-16 (no está en `main`). El paso 6 de la
T21 (mergear `main` en la integración) ya no aplica: la integración entró en `main` con
la PR #41.

## Lista «A mano» (§7)

Marcada entera en la PR #41 (T20): textos de P-04, las dos densidades en un móvil de
verdad, el aspecto contra `_capturas/a-*` y el lector de pantalla por el hero.
