# subcon-works-web

Web del estudio **Undertactics** (antes Subcon Works): diseño y desarrollo web, automatización y IA
para negocios pequeños de Galicia.

Next.js 16 con `output: "export"`, publicada como *project site* de GitHub Pages
en `alvarotaiagu.github.io/subcon-works-web/`. Movimiento con GSAP + Lenis, sin
canvas ni WebGL. Diseño: dirección **«Por debajo»** (spec 002): la línea lima del
logo es la superficie; arriba, en claro, lo que ve el cliente del negocio; debajo,
en oscuro, la instalación que lo hace funcionar.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # export estático en out/
npm run lint
npm test           # tests de Node (src/**/*.test.ts)
npm run servir     # sirve out/ como Pages (puerto 4302; --puerto, --base)
npm run comprobar  # comprobaciones en navegador de la spec 002 §7, sobre out/
npm run medir      # presupuesto de rendimiento (abajo), sobre out/
```

El `basePath` solo se activa en el build de CI (`GITHUB_ACTIONS=true`), para que
`next dev` siga sirviendo en la raíz. Para probar ese build:
`npm run comprobar -- --base /subcon-works-web`.

## Qué hay en la web

La portada es un corte: baja de cota en cota, de la superficie al fondo. Cada
sección lleva su cota encima del titular, y un conducto (el «hilo») baja por el
margen izquierdo uniéndolas hasta el botón de la auditoría.

| Cota | Sección | Qué hay |
|---|---|---|
| Superficie | Hero (`#inicio`) | «Lo de arriba vende. Lo de abajo trabaja.» partido por la superficie. Arriba, cuatro cosas que ve el cliente (un WhatsApp, un pago con Bizum, una reseña en Google, un reel); debajo de cada una, su pozo con tres paradas que son servicios reales de `servicios.ts`. Se encienden al tocarlas (y solas, una vuelta, tras 5 s sin tocar nada, con «Pausar ejemplos»). El tirador de la derecha sube la superficie para ver más instalación |
| 0 · Lo que montamos | Servicios (`#servicios`) | Los diez servicios de `servicios.ts`, cada uno con su pozo: lo que incluye, como paradas |
| −1 · La plantilla | La plantilla (`#plantillas`) | Las destacadas, con dorsal del 1 al 10, en tarjetas de corte (portada arriba, concepto debajo), y «¿Tu sector no está?» con un correo ya escrito. Las 30 están en `/plantillas/` |
| −2 · El proceso | Proceso (`#proceso`) | Sección anclada con un testigo de sondeo: una broca baja por seis estratos y cada uno enciende su paso. Con movimiento reducido (y en Sobria), la tabla «Lo que ves tú / Lo que hacemos por debajo» |
| −3 · Quién está debajo | Equipo y compromisos (`#equipo`) | Las personas del estudio, el enlace a `/estudio/` y los compromisos como paradas de un pozo |
| −4 · Diagnóstico | Diagnóstico rápido (`#diagnostico`) | El diagnóstico de un minuto de la spec 001 |
| Fondo · Auditoría | Fondo (`#auditoria`) | Lo que recibes con la auditoría gratuita, «36 preguntas» y «0 €», y el botón «Empezar la auditoría», donde acaba el hilo y se dibuja el iceberg del logo |

También: la cortina de entrada (solo la primera carga de la portada en cada
sesión; la superficie que traza se queda como la del hero) y el mando de maqueta
con `?revision` (densidades «Por debajo» y «Sobria»; sin ese parámetro no se ve).

Páginas: `/` · `/plantillas/` · `/herramientas/` · `/estudio/` · `/auditoria/` ·
`/sectores/` y las tres de sector (`/sectores/<slug>/`) · `/privacidad/` · la 404.
Las interiores empiezan «debajo»: fondo oscuro desde arriba, la superficie bajo la
cabecera y la cota junto al título.

## Nivel

Lo que pide el §5 bis del PLIEGO (D-021), aplicado a esta web:

- **Piezas del kit quitadas**: marquesina, botones magnéticos, pilas sticky,
  cursor propio, grano y hero WebGL. **Pieza propia**: los pozos, con paradas
  que son servicios reales, y el conducto que baja de cota en cota.
- **Recursos del §2 que quedan** (cinco, D-022):
  - Lenis;
  - char-reveal: los titulares de sección entran palabra a palabra desde la
    superficie de su bloque (el `<h1>` del hero no, por el LCP);
  - máscaras que se abren con el scroll: cada sección se descubre desde una
    línea que baja;
  - sección anclada con scrub: el testigo del proceso (vertical, no galería
    horizontal);
  - hero propio del concepto, en SVG en vez de canvas o WebGL (excepción de
    D-022 por el presupuesto de rendimiento).
- **Gesto táctil**: el tirador del hero (arrastrar con el dedo o el ratón; con
  el teclado, flechas).
- **Final del objeto**: el Fondo. Cuando el botón de la auditoría cruza el 66 %
  de la pantalla, la línea de debajo se enciende y el iceberg se dibuja entero,
  el mismo dibujo que abre la cortina.
- **Foco con la forma del motivo**: un recuadro con una línea de superficie
  debajo (lima sobre oscuro, tinta sobre claro); en el tirador, doble anillo.
- **Presupuesto medido**: la tabla de abajo.
- **Menú: inactividad**. Con el hero en pantalla y sin tocar nada, a los 5 s se
  enciende el siguiente pozo, y así una sola vuelta (los cuatro ejemplos). Son
  5 s en vez de los 15–20 s del PLIEGO (D-019) porque casi nadie se queda 15 s
  mirando un hero. Un gesto da 15 s de silencio, y «Pausar ejemplos» la para
  (WCAG 2.2.2). No guarda nada.

## Presupuesto

Spec 002 §3.15. Medido con `npm run build` y `npm run medir` (Playwright + CDP:
iPhone 13, 4G de 150 ms y 1,6 Mbps, CPU ×4, caché vacía, mediana de 5 cargas en
frío intercaladas entre rutas), el 2026-10-16. La línea base es la de T01: el
`main` de antes del rediseño (engranajes WebGL, `next/font`).

| Medida | Tope | Medido | Línea base (T01) |
|---|---|---|---|
| LCP de la portada, con cortina | ≤ 2,5 s y en el `<h1>` | 1,62 s · `h1 > span.hero-l1` | 1,98 s · `h1` |
| LCP de la portada, sin cortina | ≤ 2,5 s y en el `<h1>` | 1,66 s · `h1 > span.hero-l1` | 1,96 s · `h1` |
| LCP de `/plantillas/` | ≤ 2,5 s | 1,96 s | 1,99 s |
| LCP de `/sectores/alojamientos-rurales/` | ≤ 2,5 s | 1,48 s | 1,86 s |
| CLS de la portada: carga + 1 s de arrastre del tirador + scroll por el hero | ≤ 0,05 | 0,000 | 0,000 (sin tirador) |
| CLS de las interiores medidas | ≤ 0,05 | 0,000 | 0,000 |
| INP del instrumento (tres toques a objetos y 1 s de arrastre) | ≤ 200 ms | 80 ms (la peor carga, 96 ms); fotograma más largo arrastrando, 17-33 ms | sin tirador |
| Letras | 2 ficheros, ≤ 70 KB | 2 ficheros · 62,9 KB | 3 pedidas · 116 KB (15 en `out/`) |
| Tareas largas tras `fonts.ready` | ninguna > 200 ms | **no cumple (C-20)**: 217-398 ms con la máquina lenta, ya con D-028 (en T19, sin D-028: 150-190 ms a toda velocidad, 300-340 ms lenta) | 778 ms (con `three`) |

Las tareas largas que quedan son dos y caen al llegar el JS (unos 5 s con 4G):
el arranque de Next (evaluar `react-dom` y los módulos de la página) y el commit
de la hidratación. Las dos escalan con la velocidad de la máquina que mide, y el
tope solo se cumple cuando va rápida. D-028 sacó GSAP, ScrollTrigger y Lenis del
JS inicial, pero no basta: está abierto C-20 (`DECISIONES.md`).

### Carga diferida (D-028): antes y después

`fix/rd-carga-diferida`, 2026-10-16. Mismo `medir`, con `--raiz` sobre el `out/`
de antes y el de después, intercalados (antes, después, antes, después; 3 cargas
por ruta cada vez). La máquina iba lenta en las cuatro pasadas.

| Medida | Antes | Después |
|---|---|---|
| JS inicial de la portada (sin comprimir · gzip) | 839 KB · 272 KB | 702 KB · 221 KB |
| JS inicial de `/plantillas/` | 774 KB · 251 KB | 636 KB · 200 KB |
| JS inicial de `/sectores/alojamientos-rurales/` | 807 KB · 261 KB | 670 KB · 209 KB |
| LCP de la portada, con cortina / sin cortina | 1,62-1,64 s / 1,65-1,68 s · `h1 > span.hero-l1` | 1,63-1,64 s / 1,66-1,68 s · `h1 > span.hero-l1` |
| LCP de `/plantillas/` · de `/sectores/alojamientos-rurales/` | 1,97-2,00 s · 1,48 s | 1,96-1,98 s · 1,47-1,48 s |
| CLS (todas las rutas medidas) | 0,000 | 0,000 |
| INP del instrumento (mediana; con cortina / sin cortina) | 88 ms / 72-88 ms | 96-104 ms / 80-88 ms |
| Tarea más larga por carga, portada con cortina | 230-360 ms | 217-398 ms |
| Tarea más larga por carga, portada sin cortina | 237-354 ms | 212-365 ms |
| Tarea más larga por carga, `/plantillas/` | 224-407 ms | 217-357 ms |
| Tarea más larga por carga, `/sectores/alojamientos-rurales/` | 221-376 ms | 232-352 ms |

Una traza de la portada (CDP, mismas condiciones) explica por qué no baja: GSAP
ya no está en el arranque, pero el arranque sigue en 260-360 ms y el commit de la
hidratación en 250-280 ms; la llegada de GSAP, ya repartida, son tres tareas de
75-97 ms.

## Dos cosas que no se tocan

**Nada se indexa.** `robots.ts` bloquea el rastreo entero y todas las páginas
llevan `meta robots noindex`. Es la norma de la casa mientras no haya nada
vendido.

**No hay clientes.** La web no presenta ningún caso de cliente porque todavía no
los hay. Lo que se enseña son las **30 plantillas** del taller
(`plantillas-negocios-web`), y todas protagonizadas por **negocios inventados**
— eso se dice con todas las letras en la sección, en `/plantillas/` y en el pie.
Cuando entre el primer cliente real, ese es el momento de añadir una sección de
trabajos, no antes.

## El contenido vive en `src/content/`

| Archivo | Qué manda |
|---|---|
| `site.ts` | Nombre, contacto, navegación |
| `portada.ts` | El corte: orden, cota, nitidez y fondo de las siete secciones |
| `interiores.ts` | La cota de cada página interior |
| `hero.ts` | Los cuatro ejemplos del hero y las paradas de cada pozo |
| `servicios.ts` | Los diez servicios y lo que incluye cada uno |
| `herramientas.ts` | El software propio de `/herramientas/`, con sus capturas |
| `plantillas.ts` | El catálogo de 30, con su demo y su captura |
| `proceso.ts` | Los seis pasos, con su dato y las dos columnas de la tabla |
| `cifras.ts` | Las cuatro cifras, repartidas por la portada (sin contador) |
| `estudio.ts` | Las personas y los compromisos |
| `auditoria.ts` | Las 36 preguntas del cuestionario, P1–P36 |

Las capturas de `public/plantillas/*.jpg` son fotos reales de cada demo, tomadas
con Playwright a 1440×960 después de que se retire la cortina de entrada y se
acepte su aviso de cookies.

Los iconos de `public/servicios/*.svg` se generan con
`node scripts/generar-iconos-servicios.mjs`.

## La auditoría gratuita

`/auditoria/` es el cuestionario del kit **`03-kit-auditoria-negocio`** llevado a
la web: las mismas 36 preguntas con la misma numeración, en ocho pasos, con
borrador guardado en el navegador y con la posibilidad de mandarlo a medias.

Al enviarse va a una Edge Function de Supabase (`solicitar-auditoria`) que lo
guarda en una tabla con RLS activo y sin políticas. Después,
`node kit/traer-solicitudes.mjs --bajar` lo escribe en la carpeta `entrada/` del
kit con el formato que este espera, y el informe se genera allí.

El circuito completo, la clave que hace falta y qué pasa si cambias las
preguntas están en [`kit/LEEME.md`](kit/LEEME.md).

## Pendiente antes de recibir una solicitud de verdad

- Completar el nombre fiscal, el NIF y el domicilio en `src/app/privacidad/page.tsx`
  (están como `[PENDIENTE]`; no se inventan).
- Decidir si se publica un teléfono: ahora mismo `site.telefono` es `null` a propósito.
- Enlazar los perfiles sociales reales en `site.redes`, que está vacío.
