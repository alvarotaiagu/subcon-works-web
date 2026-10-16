# 002 · Rediseño «Por debajo»

Estado: aprobada (D-024, 2026-10-12) · Depende de: 001 (la reestila, no cambia su lógica) · Decisiones: D-014 a D-024, D-026 · Conflictos: C-19 · Pendientes: P-04 a P-07 · Cambia: 001 §3.5 §3.7 §3.8 §3.9 §7
Plan: [plan.md](plan.md) (aprobado, D-025) · Tareas: [tasks.md](tasks.md)

## 1. Objetivo

La web del estudio se cambió de nombre a Undertactics con un logo nuevo (el
iceberg con la superficie lima) pero conserva la estética de antes: oscura,
con engranajes en 3D y el kit de movimiento que repiten las ocho webs hermanas
(cortina, marquesina, cursor propio, botones magnéticos, pilas sticky).

Esta spec la rediseña entera con la dirección **A · «Por debajo»**, elegida por
Álvaro el 2026-10-12 (D-014). El concepto sale del logo: **la línea lima es la
superficie**.

- **Arriba, en claro:** el negocio tal como lo ve su cliente (un WhatsApp, la
  tienda, la ficha de Google, un reel).
- **Debajo, en oscuro:** la instalación que hace que eso funcione. Cada cosa
  de arriba tiene su pozo y sus paradas son servicios reales.

La portada baja de cota en cota hasta el fondo, donde está la auditoría. El
posicionamiento no cambia: estudio mixto (web, automatización y vídeo) con los
diez servicios en su orden actual.

**Fuente.** `../undertactics-bocetos/DIRECCION.md` (dirección, tokens, letras,
recursos y movimiento), `bocetos.html` sección A y `_capturas/a-*`. Esta spec
manda sobre `DIRECCION.md`, y `DIRECCION.md` manda sobre el boceto. El boceto es
la referencia visual; su código (`css/a.css`, `js/a.js`) se puede copiar como
punto de partida, no como contrato.

## 2. Alcance

**Entra**
- Tokens de color, letras autoalojadas y escala tipográfica nuevas
  (`globals.css`, `layout.tsx`, `public/fuentes/`).
- Logo de la web a partir de los SVG a curvas de `marca/`.
- Cabecera (`Nav`), pie (`Footer`), aviso de cookies y transición entre páginas.
- Cortina nueva (sustituye a `Preloader`) con la misma API pública.
- Portada entera: hero con los pozos, Servicios, La plantilla, Proceso, Quién
  está debajo, Diagnóstico y Fondo.
- Conducto principal («hilo») de la portada.
- Páginas interiores: `/plantillas/`, `/herramientas/`, `/estudio/`,
  `/auditoria/`, `/sectores/`, `/sectores/<slug>/`, `/privacidad/` y la 404.
- Mando de maqueta tras `?revision`, con la versión «Por debajo» y la «Sobria».
- Reglas de «Nivel» del PLIEGO §5 bis aplicadas a esta web (D-021).
- Presupuesto de rendimiento medido y escrito en el `README.md`.
- Bajas (D-017), que se borran con todo lo que solo usaban ellas:
  - componentes: `Marquee`, `Cifras`, `CtaFinal`, `HeroGears`, `ScrollLine`,
    `Cursor`, `Grain`, `Preloader`, `CifraGauge` y todo
    `src/components/three/`;
  - hooks y librerías: `useMagnetic`, `useCursor`, `useScrollVelocity` (y
    `--scroll-velocity`), `engranaje.ts`, `gearPath.ts`; la prop `magnetico`
    de `Boton`;
  - atributos y clases: los `data-cursor-*`, `.cursor-*`, `cursor: none`,
    `.grain-overlay`, `.umbral`, `.scroll-dot`, `.hero-eyebrow`,
    `.reticula-line`, `.plantilla-img`, `.plantilla-card`, `.rueda-rota`;
  - dependencias: `three`, `@types/three` y `motion` (no se importa en ningún
    sitio).
  - Test (§7): ninguno de esos nombres aparece en `src/` ni en
    `package.json`.

**Queda fuera**
- Lógica del diagnóstico, de la URL y del prerrelleno de la auditoría (001):
  solo cambia su aspecto.
- Contenido de `servicios.ts`, `plantillas.ts`, `proceso.ts`, `estudio.ts`,
  `auditoria.ts` y `sectores.ts`: no se reescribe. Solo se añaden los textos
  nuevos del §3.13.
- Favicon, `apple-icon.png` y `og.png`: no cambian.
- El widget del chatbot (rama `feat/chatbot`): ver P-05.
- El kit de la auditoría (`kit/`) y la numeración P1–P36.
- Versión en otros idiomas: la web es solo en castellano.

## 3. Comportamiento

### 3.1 Tokens de color

En `:root` de `globals.css`, sustituyendo a los actuales (`--bg-base`,
`--accent`…). Los nombres son estos, en castellano; los mapeos de `@theme
inline` de Tailwind v4 se rehacen con ellos (`--color-cal`, `--color-hondo`…).

| Token | Hex | Papel | Contraste |
|---|---|---|---|
| `--cal` | `#F1EEE6` | Fondo de arriba (lo que ve el cliente) | — |
| `--tinta` | `#15181A` | Texto de arriba | 15,4:1 sobre cal |
| `--apagado-arriba` | `#5C625F` | Texto secundario de arriba | 5,4:1 sobre cal |
| `--tarjeta` | `#FBFAF6` | Tarjetas de arriba (objetos del hero) | tinta 17,1:1 · apagado 6,0:1 |
| `--superficie` | `#C9F24D` | Lima del logo: línea y conducto activo | 13,6:1 sobre hondo |
| `--hondo` | `#0E1B1E` | Fondo de debajo (la instalación) | — |
| `--estrato` | `#14272B` | Paneles y bandas bajo la superficie | lima 12,0:1 |
| `--roca` | `#0A1416` | Fondo del corte (pie) | — |
| `--hueso` | `#E4ECE8` | Texto de debajo | 14,6:1 sobre hondo |
| `--apagado-abajo` | `#8FA19E` | Texto secundario de debajo | 6,5:1 sobre hondo |
| `--conducto` | `#3A5156` | Conductos y bordes en reposo | 2,1:1: solo decorativo |
| `--bloque` | `#8A9099` | Gris del logo, para marca y documentos | 5,5:1 sobre hondo |

Los seis estratos del testigo (§3.8) bajan de `#2A4844` a `#111F1F`; se toman
de `css/a.css` del boceto como `--estrato-1` … `--estrato-6`.

**Reglas que se comprueban (§7):**
1. `--superficie` solo como línea (superficie, conducto activo, subrayado) y
   como texto sobre `--hondo`, `--estrato` o `--roca`. **Nunca** de fondo de
   un botón, **nunca** como texto sobre `--cal` o `--tarjeta` (1,1:1).
2. `--conducto` nunca es color de texto ni de un borde que tenga que leerse
   (borde de campo de formulario, de botón).
3. Todo texto de la web cumple 4,5:1 (3:1 si es grande) contra su fondo.

4. **Nada de opacidad en el texto** para «apagarlo» (paradas en reposo,
   números del testigo, cotas no alcanzadas): el estado en reposo se pinta con
   un token que ya cumple (`--apagado-abajo` sobre oscuro, `--apagado-arriba`
   sobre claro). La opacidad solo vale en dibujo (líneas, SVG decorativo).
5. Las etiquetas sobre los estratos del testigo usan `--hueso`, no
   `--apagado-abajo` (sobre `--estrato-1` se queda en 3,7:1).

**Tokens viejos → nuevos.** Hoy hay unas 430 clases en 51 ficheros
(`text-text-primary`, `border-line`, `bg-accent`…) y Tailwind v4 ignora sin
aviso las que no conoce. Los tokens viejos **se borran** (no se dejan alias) y
cada uso se cambia por el nuevo según esta tabla, que vale para las zonas
«debajo» (toda la web menos la mitad de arriba del hero):

| Viejo | Nuevo | Nota |
|---|---|---|
| `--bg-base` | `--hondo` | |
| `--bg-raised` | `--estrato` | |
| `--bg-sunken` | `--roca` | |
| `--line` | `--conducto` si es decorativo; `--apagado-abajo` si es el borde de un campo o de un control | |
| `--text-primary` | `--hueso` | |
| `--text-muted` y `--text-faint` | `--apagado-abajo` | |
| `--accent` | `--superficie` | solo donde cumpla la regla 1; si era relleno de botón, ver §3.4 |
| `--accent-dim` | `--superficie` en línea, o desaparece | hoy solo en hover de botones lima, que dejan de existir |

Se conservan, con los tokens nuevos dentro: `container-max`, `font-mono-label`,
`--space-section` (y el resto de `--space-*`), `--container-max`, `--gutter`,
`--ease-*`, `--dur-*`, `.mask-line`, `.link-underline`, `.nav-link`,
`.menu-movil-item` y `.campo` (con foco nuevo, §3.4). Test (§7): ningún fichero
de `src/` contiene una clase o variable de la columna «Viejo».

`colorScheme`: `"light dark"` en la portada (su parte de arriba es clara) y
`"dark"` en las interiores. `themeColor`: `#F1EEE6` en la portada y `#0E1B1E`
en las interiores (con `viewport` por página). El fondo de `<html>` es
`--hondo` en toda la web; en la portada, el rebote de iOS por arriba enseña
`--cal` (el `<body>` de la portada lleva un degradado cal→hondo a la altura de
la superficie).

### 3.2 Letras

- **Geologica** (variable: `wght` 100–900, `SHRP` 0–100, `slnt` −12–0,
  `CRSV`), juego latino, woff2 de unos 48 KB. Arriba: titulares y texto
  corrido.
- **Kode Mono** (variable: `wght` 400–700), juego latino, woff2 de unos 16 KB.
  Debajo: segunda línea de los titulares, paradas, cotas, dorsales y datos.
- Las dos van **autoalojadas** en `public/fuentes/` (se copian de
  `../undertactics-bocetos/fuentes/`: `geologica-oblique.woff2` y
  `kode-mono-normal.woff2`), con `@font-face` propio, `font-display: swap`,
  `<link rel="preload" as="font" crossorigin>` de las dos en el `<head>` y un
  fallback por letra con `size-adjust`, `ascent-override` y
  `descent-override` medidos para que el cambio de letra no mueva el titular
  (CLS, §3.15).
  - **basePath**: en GitHub Pages la web vive bajo `/subcon-works-web`. Las
    `url()` del `@font-face` y el `href` del `preload` se escriben en
    `layout.tsx` (un `<style>` en línea) con `process.env.NEXT_PUBLIC_BASE_PATH`
    delante, no en `globals.css` con rutas fijas. Se comprueba con
    `GITHUB_ACTIONS=true npm run build` y buscando `/subcon-works-web/fuentes/`
    en `out/` (§7).
  - **Fallback por plataforma**: `local()` con Arial y Liberation Sans
    (Windows, Linux), Helvetica Neue (Apple) y Roboto (Android), cada uno con
    su `size-adjust`. Las métricas se miden con Geologica a `SHRP` 0 y peso
    300 (el titular del hero).
  - **Glifos**: el subconjunto latino no trae `→`, `★` ni `↕`. Se amplía el
    subconjunto con esos tres (regenerando con `bajar-fuentes.mjs` y
    `unicode-range`) o se dibujan en SVG; el plan elige. Nunca un glifo que
    caiga a la letra del sistema dentro de un titular.
- **No con `next/font`** (precarga toda la lista). Salen `Instrument_Sans`,
  `Inter` y `JetBrains_Mono` de `layout.tsx` y las variables `--font-display`,
  `--font-body` y `--font-mono` pasan a apuntar a las letras nuevas
  (`--font-display` y `--font-body` → Geologica, `--font-mono` → Kode Mono), así
  las clases que ya las usan siguen funcionando.
- Instrument Sans solo queda dentro del logo, que va a curvas (§3.3).

**Escala** (variables en `globals.css`):

| Uso | Letra | Tamaño / interlineado | Otros |
|---|---|---|---|
| Hero, línea de arriba | Geologica 300 | `clamp(2.4rem, 6.1vw, 6.4rem)` / .92 | tracking −.04em |
| Hero, línea de abajo | Kode Mono 500 | `clamp(2rem, 4.9vw, 5.1rem)` / .98 | tracking −.05em |
| H1 de interiores y H2 | Geologica 300 | `clamp(2rem, 4.6vw, 4.1rem)` / 1 | la segunda línea (`em`) en Kode Mono 500 a .82em, lima |
| Número de paso | Geologica 200 | `clamp(4.5rem, 11vw, 9.5rem)` / .85 | `SHRP` 100, lima |
| Texto | Geologica 400 | 1rem / 1.55 | — |
| Etiquetas y datos | Kode Mono 400–500 | .64–.82rem | cotas en mayúsculas espaciadas |

Las líneas con tilde en mayúscula (Geologica 300 a .92) se miran a 390 y 1440
px: si una tilde toca la línea de arriba, el interlineado sube hasta que no
toque.

**Nitidez por cota.** Los titulares (H1, H2 y la línea de arriba del hero)
llevan `font-variation-settings: "SHRP" <n>` según la cota de su sección
(§3.5). **El valor es fijo, no se anima**: el eje `SHRP` cambia el ancho de 19
glifos (la «c» de 1017 a 969 unidades a peso 300), y animarlo recolocaría el
titular y podría cambiar el corte de línea (CLS). La erosión se ve al bajar
porque cada sección está más afilada que la anterior.

**Palabras que emergen** (D-022). Los H2 y los H1 de las interiores entran
palabra a palabra desde la línea de superficie de su sección: cada palabra
sube desde debajo de una máscara a ras de esa línea (`yPercent` de 100 a 0,
escalonado 0,04 s, `expo.out`), una sola vez al entrar en pantalla. Cada
palabra va en un `inline-block` con `white-space: nowrap` (una palabra nunca se
parte). **El H1 del hero no se parte en palabras**: va entero y en un bloque
(es el candidato a LCP). Con movimiento reducido o sin JS, las palabras están
en su sitio desde el principio; el estado inicial oculto solo existe con la
clase `js-si` y movimiento permitido.

### 3.3 Logo

- `src/components/ui/Logo.tsx`: `Logo` deja de componer HTML con la letra de
  la página y pinta los **trazados a curvas** de `marca/undertactics-logo-*.svg`
  en **un solo SVG en línea** (no `<img>`, para que no haya petición ni salto),
  sin `<title>` ni `role` dentro (`aria-hidden="true"`): el nombre accesible
  lo lleva el enlace que lo contiene («Undertactics, inicio»).
- Los rellenos van por variables CSS (`--logo-texto`, `--logo-apagado`,
  `--logo-linea`) y cambian con una clase o con una prop
  `tono: "claro" | "oscuro"`, así el cambio de la cabecera (§3.4) no pinta dos
  logos:
  - **oscuro** (sobre hondo): texto `--hueso`, «under» `--bloque`, línea
    `--superficie`;
  - **claro** (sobre cal): texto `--tinta`, «under» `--apagado-arriba`, línea
    `#5F7D00` (el lima oscuro de la marca). Es la **única excepción** a la
    regla 1 del §3.1: en el logo sobre claro la línea es `#5F7D00`, nunca
    `--superficie`.
- `Simbolo` conserva su geometría, pero cambia sus clases de color
  (`fill-text-primary`, `stroke-accent`, `fill-text-muted`) por las mismas
  variables, con los dos tonos. Es el dibujo de la cortina y del Fondo
  (§3.11, §3.14), así que se prueba sobre `--hondo` y sobre `--roca`.
- Los SVG de `marca/` no cambian (siguen siendo para documentos y redes).
- `marca/LEEME.md` se actualiza: el logo de la web ya sale de los SVG, y la
  geometría del símbolo sigue viviendo en `Simbolo` y en
  `scripts/marca/logo_svg.py`.
- Favicon, `apple-icon.png` y `og.png` no cambian. `og.png` lleva grabado el
  lema viejo, así que el `alt` de Open Graph deja de salir de `site.tagline` y
  pasa a un texto fijo que describe la imagen («Logo de Undertactics: un
  iceberg con la línea de superficie en lima»). Regenerar `og.png` con el lema
  nuevo es P-07.

### 3.4 Cabecera, pie y piezas comunes

**Cabecera (`Nav`).**
- Mismos enlaces (`site.nav`) y CTA (`site.cta`, `/auditoria/`). El menú no
  cambia (D-005).
- Sobre la parte de arriba de la portada: logo `tono="claro"` (texto oscuro) y
  enlaces en `--tinta`. Cuando el borde de abajo de la cabecera cruza la
  superficie del hero, pasa a logo `tono="oscuro"` y enlaces en `--hueso`, con
  fondo `--hondo` al 92 %. En las interiores va siempre en oscuro.
- El CTA es un botón (ver «Botones»), sin efecto magnético.
- Menú móvil: a pantalla completa en `--hondo`, con la cota de la portada al
  lado de cada enlace que va a una sección de la portada (Servicios «0»,
  Plantillas «−1», Proceso «−2», Auditoría «Fondo»). Herramientas, que es una
  página, va sin cota. Ojo: si la cabecera lleva `backdrop-filter`, el panel
  fijo del menú queda atrapado en ella; el panel usa `height: 100dvh` y se
  comprueba en 390 px.

**Botones (`Boton`).**
- Primario arriba: fondo `--tinta`, texto `--cal`. Primario abajo: fondo
  `--hueso`, texto `--hondo`. Secundario: solo borde de 1,5 px del color del
  texto. Debajo de todo botón primario, una línea de 2 px en `--superficie`
  cuando está en fondo oscuro (en claro, en `--tinta`). Excepción: el botón
  del Fondo, cuya línea descansa en `--conducto` hasta que se enciende
  (§3.11).
- Hover: el primario invierte a secundario (fondo transparente, borde y texto
  del color que tenía de fondo) en `--dur-fast`; el secundario se rellena del
  color de su texto. Sin escalado ni efecto magnético (sale la prop
  `magnetico` de `Boton`).
- **Ningún elemento se rellena de lima.** Hoy hay botones y estados lima
  escritos a mano fuera de `Boton`; todos pasan a usar `Boton` o a estos
  estados:
  - CTA y menú móvil de `Nav`, `Footer`, `AvisoCookies`, `/estudio/`,
    `/herramientas/`, `/plantillas/`, los cuatro de `FormularioAuditoria`,
    «Seguir» de `PasoPregunta`, `Auditoria`, `Plantillas` y el enlace
    «Saltar al contenido» → `Boton` (o sus mismas clases si no puede ser un
    componente);
  - **filtro activo** de `CatalogoPlantillas` y **opción marcada** de
    `PasoPregunta`: fondo `--hueso`, texto `--hondo` y línea lima de 2 px
    debajo;
  - **burbujas de la persona** en `ChatEjemplo`: fondo `--estrato`, texto
    `--hueso`, borde izquierdo lima de 2 px; las del asistente, fondo
    `--hondo` con borde `--apagado-abajo`;
  - **tirador** del hero (§3.6): círculo `--tarjeta` con borde `--tinta` de
    1,5 px y flecha `--tinta`.
  - Test (§7): ninguna clase `bg-superficie` (ni `bg-[#c9f24d]`) en `src/`
    salvo en elementos de línea (`h-px`, `h-[2px]`, `h-[3px]`, `w-px`,
    `w-[2px]`).

**Foco del teclado** (forma del motivo, PLIEGO §5 bis):
- `:focus-visible` dibuja un **recuadro**: `outline` de 2 px (que sobrevive en
  `forced-colors`) más una línea de abajo de 4 px con `box-shadow` (la
  superficie bajo el elemento). En `forced-colors: active` queda solo el
  `outline` con `Highlight`.
- Sobre fondo oscuro: recuadro `--hueso` y línea de abajo `--superficie`.
- Sobre `--cal` o `--tarjeta`: recuadro y línea en `--tinta` (la lima no se ve
  sobre claro).
- **Tirador** (a caballo entre cal y hondo): doble anillo, `--tinta` por
  dentro y `--hueso` por fuera, para que se lea sobre los dos fondos.
- Dentro de contenedores con `overflow: hidden` o `clip` (tarjetas, hero), el
  foco va con `outline-offset` negativo para que no se recorte.
- `.campo:focus { outline: none }` sale de `globals.css`: los campos llevan
  este mismo foco.
- Nunca se quita el foco sin poner este.

**Pie (`Footer`)** en `--roca`: es el «fondo del corte» (§3.11). Conserva el
reloj local (`site.zonaHoraria`), el contacto y las secciones.

**Aviso de cookies.** Mismo comportamiento; colores `--estrato` y `--hueso`,
botones según «Botones».

**Transición entre páginas (`PageTransition`).** Se mantiene, pero en vez de
fundido la página nueva se descubre desde una línea horizontal lima que baja de
arriba abajo (`clip-path` animado con un número, no con `inset()` completo).
Con movimiento reducido, cambio directo.

**Lenis y GSAP** se quedan (`useLenis`, `registerGsap`, `EASE_OUT`,
`EASE_INOUT`). Lenis va desde jsDelivr o desde npm, nunca desde cdnjs.

### 3.5 Portada: el corte

Orden y cotas (D-015). La cota es una etiqueta en Kode Mono mayúscula encima
del titular de cada sección, y es también el ancla `data-hilo` del conducto
(§3.10). Siempre está sobre fondo oscuro: en reposo `--apagado-abajo`;
alcanzada por el conducto, `--superficie`. La del hero («Superficie») va justo
debajo de la línea, sobre `--hondo`. Si la sección ya tenía una etiqueta propia
encima del titular (p. ej. «Diagnóstico rápido · un minuto»), la cota va
primero y la etiqueta debajo, en la misma línea en escritorio separadas por
« · ».

| Orden | Sección | `id` | Cota | `SHRP` | Fondo |
|---|---|---|---|---|---|
| 1 | Hero | `inicio` | «Superficie» | 0 | cal arriba / hondo abajo |
| 2 | Servicios | `servicios` | «0 · Lo que montamos» | 20 | hondo |
| 3 | La plantilla | `plantillas` | «−1 · La plantilla» | 40 | hondo |
| 4 | Proceso | `proceso` | «−2 · El proceso» | 75 | estrato |
| 5 | Quién está debajo | `equipo` (lo enlaza `/estudio/`) | «−3 · Quién está debajo» | 85 | hondo |
| 6 | Diagnóstico | `diagnostico` | «−4 · Diagnóstico» | 95 | estrato |
| 7 | Fondo | `auditoria` | «Fondo · Auditoría» | 100 | roca, y sigue el pie |

- **Salen** de la portada `Marquee`, `Cifras` y `CtaFinal`. Sus componentes se
  borran si nada más los usa (`CtaFinal` lo usa `/sectores/<slug>/`: allí pasa
  a usar el bloque Fondo, §3.12).
- Las cuatro cifras de `cifras.ts` se reparten. Se pintan como valor grande
  (Kode Mono) más su `etiqueta` de `cifras.ts`, sin contador animado:
  - en La plantilla: «30» · «Plantillas propias publicadas y en línea»;
  - en Proceso, bajo el paso 04: «2 semanas» · «Desde que dices que sí hasta
    que está en línea» (el sufijo `" sem."` se escribe entero en esta vista);
  - en el Fondo: «36» · «Preguntas de la auditoría, y las contestas en 10
    minutos» y «0 €» · «Lo que cuesta la auditoría y el presupuesto».
- **El número de plantillas sale siempre de `plantillas.length`**: el valor
  `30` de `cifras.ts` se sustituye por ese cálculo, y lo mismo en todo lo que
  pinta esta spec (título «Una plantilla de N.», recuento de la Sobria). Los
  textos de `servicios.ts` («30 bases vivas», «Treinta bases») no se tocan
  aquí: si cambia el catálogo (P-02), se cambian a mano con P-02. Test (§7).
- Las anclas del menú (`/#servicios`, `/#plantillas`, `/#proceso`,
  `/#auditoria`) siguen funcionando.
- **Transiciones entre secciones**: cada bloque se descubre desde una línea
  horizontal, de arriba abajo (máscara que baja), una sola vez. Nada de
  fundidos sueltos ni pilas sticky.

### 3.6 Hero

**Composición.** Fondo partido por la superficie: `--cal` arriba y `--hondo`
abajo, con la línea lima de 3 px a la altura del nivel.

- **Escritorio** (≥ 768 px): alto `clamp(700px, 100svh, 900px)`, nivel al 50 %.
- **Móvil**: alto `max(100svh, contenido)` (nunca recorta: el hero crece si
  no cabe), nivel fijo en px, medido para que encima quepan los objetos y la
  línea de arriba del titular a 360 px de ancho. Ningún texto del hero baja de
  12 px (los rótulos de los objetos del boceto, a .58–.64rem, suben). Se
  comprueba a 360 y 390 px (§7).
- **Mover la superficie sin CLS**: el nivel base se pinta con el layout; lo que
  la mueve después (scroll, tirador, cortina) son `transform: translateY` en
  las capas (fondo claro, línea, titular, objetos, pozos), nunca `top`,
  `bottom` ni `height`. El SVG de los pozos se dibuja al montar y al
  redimensionar (`ResizeObserver`), no en cada fotograma: al mover la
  superficie se trasladan, no se rehacen.

- **Titular**, un solo `<h1>` en un bloque, partido por la superficie:
  - encima: «Lo de arriba vende.» (Geologica 300, `--tinta`);
  - debajo: «Lo de abajo trabaja.» (Kode Mono 500, `--hueso`) con
    «trabaja.» en `--superficie`.
  - Lector de pantalla: lee la frase seguida. `site.tagline` pasa a ser
    «Lo de arriba vende. Lo de abajo trabaja.».
  - **LCP**: las dos líneas son `<span>` dentro del `<h1>`; el elemento LCP
    puede ser el `<h1>` o cualquiera de sus dos líneas. A 390 px, el área de
    la línea más grande del titular supera a la de la descripción (si no, la
    descripción sería el LCP): se ajusta el tamaño o el ancho de la
    descripción hasta que se cumpla (§7).
- **Descripción**, debajo de la superficie: «Diseñamos lo que ve tu cliente y
  montamos lo que lo hace funcionar: web, automatización y vídeo para
  negocios.» (`site.descripcion`; P-04).
- **Botones**: «Auditoría gratis» (`/auditoria/`) y «Ver qué hay debajo»
  (`#servicios`).

**Instrumento: los objetos y sus pozos.** Arriba, sobre la superficie, cuatro
objetos (botones) en `--tarjeta`, marcados con `aria-label` del grupo «Lo que
ve tu cliente». Bajo cada uno, un pozo (SVG) que baja en `--conducto` con tres
paradas numeradas por el servicio real (número de `servicios.ts`):

| Objeto | Rótulo | Ejemplo (lectura) | Paradas |
|---|---|---|---|
| Burbuja de WhatsApp «¿Tenéis hueco el jueves por la tarde?» | WhatsApp · 23:40 | 23:40 · «¿Tenéis hueco el jueves?» → contesta el agente → cita el jueves a las 17:30 → recordatorio la víspera. | 07 Agente contesta · 06 Cita en tu agenda · 06 Recordatorio la víspera |
| Botón de pago «Pagar · Bizum» | Tu tienda | Pago con Bizum → factura emitida sola → aviso de qué reponer. | 02 Cobro con tarjeta o Bizum · 06 Factura emitida · 02 Aviso de qué reponer |
| Ficha «★★★★★ Reseña nueva» | Google | Reseña de cinco estrellas → respuesta con tu tono → entra en el informe del mes. | 08 Respuesta a la reseña · 05 Ficha de Google al día · 06 Informe del mes |
| Miniatura de un reel (recorte de la portada de la plantilla `panaderia`, P-06) | Instagram | Lo que hay debajo de un reel: se graba en tu local, se monta con subtítulos y sale programado. | 09 Grabado en tu local · 09 Montaje y subtítulos · 09 Programado en el calendario |

- Los textos van en un fichero de contenido nuevo, `src/content/hero.ts`
  (`flujos`). Cada parada lleva `servicio` (el número) y `clave`: una palabra
  o expresión que aparece tal cual (sin distinguir mayúsculas ni tildes) en la
  `descripcion` o en un `incluye` de ese servicio. Claves de la tabla: 07
  «WhatsApp», 06 «citas», 06 «Recordatorios», 02 «Bizum», 06 «facturas», 02
  «reponer», 08 «reseña», 05 «Ficha de Google», 06 «Informes», 09 «local», 09
  «subtítulos», 09 «Calendario». Test (§7).
- Los ejemplos hablan de lo que ofrece el estudio según `servicios.ts` (el 07
  incluye «Web y WhatsApp» y «Reserva de cita»), no de lo que hace hoy la
  demo de `recepcionista-ia` (D-008 rige solo el bloque `#asistente` de las
  páginas de sector). Revisarlos entra en P-04.
- La miniatura del reel es un recorte de unos 200 px de ancho en WebP, no la
  portada de 1440 px.
- **Rótulo «Ejemplo»** (D-019): en Kode Mono, junto a la lectura de debajo de
  la superficie, siempre visible mientras haya un ejemplo encendido. Los
  ejemplos no son clientes.
- **Encender un pozo**: pasar el ratón, tocar o enfocar con el teclado un
  objeto. Su pozo pasa a `--superficie`, un pulso baja por él (unos 1,4 s) y
  cada parada se enciende al pasar el pulso. La lectura cambia. Solo hay un
  pozo encendido a la vez; al encender otro, el anterior vuelve a reposo.
  Paradas en reposo: número y texto en `--apagado-abajo` (sin opacidad,
  §3.1); encendidas, número en `--superficie` y texto en `--hueso`.
- **Anuncios**: la lectura está en una región `aria-live="polite"` que **solo
  se rellena cuando el cambio lo provoca la persona** (toque, clic, foco). Los
  cambios automáticos actualizan otro elemento sin `aria-live`.
- **Al cargar** (o al retirarse la cortina) se enciende el pozo 1.
- **Inactividad** (D-019): con el hero en pantalla, si nadie lo toca durante
  5 s se enciende el siguiente pozo, y así cada 5 s, **una sola vuelta** (los
  cuatro ejemplos, unos 20 s). Después se para hasta el siguiente gesto en el
  hero o hasta que el hero sale de pantalla y vuelve a entrar.
  - Tocar, pasar el ratón o enfocar un objeto o el tirador corta la secuencia y
    da 15 s de silencio desde el último gesto.
  - Se para con el hero fuera de pantalla (menos del 20 % visible), con la
    pestaña oculta (`visibilitychange`), mientras se arrastra el tirador y con
    movimiento reducido.
  - Control **«Pausar ejemplos»** / «Seguir con los ejemplos» (botón en Kode
    Mono, junto al rótulo «Ejemplo», con `aria-pressed`), para cumplir WCAG
    2.2.2. Pausado, no hay secuencia automática hasta que se pulse otra vez
    (no se guarda entre cargas).
  - Es la pieza del menú «Inactividad» del PLIEGO §5 bis, con 5 s en vez de
    15–20 s (D-019); el README lo dice. No guarda nada.
- **Tirador** (gesto táctil, PLIEGO §5 bis): un botón en la superficie, a la
  derecha, con `aria-label="Bajar la superficie para ver más instalación"`.
  - Con el dedo o el ratón (Pointer Events, `setPointerCapture`), arrastrar en
    vertical sube o baja la superficie: hasta 160 px hacia arriba y 60 px hacia
    abajo en escritorio, 160 px hacia arriba y 0 en móvil. Al soltar vuelve a
    su sitio en 0,65 s (expo out).
  - `touch-action: none` **solo en el tirador**: el resto del hero deja hacer
    scroll vertical normal.
  - Con el teclado: flechas arriba y abajo mueven 24 px; vuelve al perder el
    foco.
- **Scroll**: al bajar la página la superficie sube (la cámara se mete bajo el
  agua): hasta un 22 % del alto del hero en escritorio y un 12 % en móvil.

**En móvil (360–390 px)**: los cuatro objetos en fila con desplazamiento
horizontal o en rejilla de 2×2 (lo que quepa sin cortar texto: se decide en el
plan con capturas). Los pozos se acortan; la lectura va bajo los pozos, a lo
ancho. Si los objetos van en fila con desplazamiento horizontal, ese carril no
ensancha la página (§7: sin scroll horizontal del documento).

### 3.7 Servicios («0 · Lo que montamos»)

- Titular: «Montamos lo que se ve y lo que va debajo.» (préstamo de C). La
  segunda parte («y lo que va debajo.») en Kode Mono lima, según la escala de H2.
- Entradilla (P-04): «Diez servicios. Cada uno tiene una parte que ve tu
  cliente y otra que trabaja por debajo.»
- Los **diez servicios en el orden de `servicios.ts`**. Cada uno es un
  «pozo»:
  - arriba de su línea: número, `nombre` y `descripcion`;
  - debajo, en Kode Mono: los `incluye` como paradas de un pozo vertical;
  - `enlace`, si lo tiene.
- En escritorio, en filas; al pasar el ratón o enfocar un servicio, su pozo se
  enciende (lima) y los demás quedan en `--conducto`. En móvil, lista vertical
  con el pozo encendido al entrar en pantalla.
- Salen de esta sección `NodesScene`, `WorkImage` y el panel que seguía al
  cursor. Los iconos de `/servicios/*.svg` no se usan en la portada (los
  ficheros se quedan).

### 3.8 La plantilla («−1 · La plantilla»)

Préstamo de B. Título: «Una plantilla de 30.» El número sale de
`plantillas.length`: si cambia el catálogo (P-02), dice el número nuevo.

- Aviso, igual que hoy: los negocios son inventados (el mismo texto que en
  `/plantillas/`).
- **Titulares**: las destacadas (`plantillasDestacadas`), en el orden de
  `plantillas.ts`, con **dorsal del 1 al 10**. Cada tarjeta (`TarjetaPlantilla`
  con variante `corte`):
  - arriba, la portada (`/plantillas/<slug>.jpg`, `loading="lazy"`, con
    `width` y `height`);
  - una línea de superficie;
  - debajo, en `--hondo`: `negocio`, `sector · ciudad`, el **nombre** del
    concepto entre comillas en Kode Mono lima (la parte de `concepto` antes
    del primer « — » o «:», como `partirConcepto` del boceto) y, al pasar el
    ratón o enfocar, el `movimiento`;
  - el dorsal en Kode Mono, lima sobre `--hondo`, en una esquina de la parte
    de abajo.
  - El enlace va a `demo`, en pestaña nueva, con `rel="noopener"`.
- **Sin banquillo** (D-026, sustituye a la lista de las no destacadas): las
  demás solo están en `/plantillas/`. En su lugar, **«¿Tu sector no está?»**:
  «Aquí hay N de las 30 que tenemos publicadas. Escríbenos con tu sector y te
  enseñamos la que más se acerca a lo tuyo, o te preparamos una para él.»
  (P-04) y el botón secundario «Pedir la de mi sector», un `mailto:` a
  `site.email` con asunto y cuerpo ya escritos. La web no guarda nada: no hay
  formulario ni datos personales. El mismo correo sustituye a «Escribir un
  correo» en el cierre de `/plantillas/`.
- El dorsal **no se guarda**: se calcula con el orden de `plantillas.ts`
  (destacadas primero). Solo sale en la portada.
- Debajo: «30 plantillas» (de `cifras.ts`) y un enlace a `/plantillas/`.
- Fuera de B no se trae nada: ni campo, ni fichas, ni Alumni Sans ni Host
  Grotesk.

### 3.9 Proceso («−2 · El proceso»)

Sección anclada (pin de GSAP, unas 4,4 pantallas de recorrido) con un **testigo
de sondeo**: una columna de seis estratos (de `--estrato-1` a `--estrato-6`).
Una broca baja por el testigo con el scroll y cada estrato que pasa enciende su
paso de `proceso.ts`.

- Cada paso enseña su número (escala «Número de paso»), `titulo`,
  `descripcion` y su **dato**, en Kode Mono lima:

  | Paso | Dato |
  |---|---|
  | 01 Nos cuentas | 10 min |
  | 02 Miramos | horas y euros |
  | 03 Te lo contamos | gratis |
  | 04 Construimos | semanas, no meses |
  | 05 Lo ves funcionando | antes de pagar |
  | 06 Lo mantenemos | a tu nombre |

  Los datos van en `proceso.ts` como campo nuevo `dato`.
- «2 semanas» (de `cifras.ts`) sale bajo el paso 04.
- En el paso 05, un pulso baja por el testigo (el mismo pulso del hero).
- Sin pila sticky: solo un pin, **también en móvil** (hoy el proceso solo se
  ancla desde 768 px). En móvil, el testigo va estrecho (unos 56 px) al
  principio de la columna de contenido, después del canal del hilo, y el texto
  del paso a su derecha.
- Ningún ancestro de la sección anclada lleva `transform`, `filter` ni
  `will-change` (la máscara de entrada de la sección se quita al terminar).
  `ScrollTrigger.config({ ignoreMobileResize: true })`.
- **Tabla** (con movimiento reducido y en la versión sobria): dos columnas,
  «Lo que ves tú» y «Lo que hacemos por debajo», una fila por paso con su
  dato. Los textos de las columnas salen de `vesTu` y `debajo` del boceto
  (`js/a.js`), completados para las seis filas (P-04), en `proceso.ts`.

### 3.10 Conducto principal (el hilo)

- Un trazo SVG que baja por el **margen** de toda la portada, desde la
  superficie del hero hasta el botón «Empezar la auditoría» del Fondo. Une las
  anclas `data-hilo` de la cota de cada sección: baja en vertical y entra en
  horizontal a cada cota.
- En reposo, `--conducto`; lo recorrido, `--superficie`. La cabeza del trazo
  va al 66 % del alto de la pantalla. Cuando la cabeza pasa una cota, la cota
  se marca como alcanzada (clase `es-alcanzada`, en lima).
- Nunca pasa por encima de texto ni de controles, salvo en su entrada a cada
  cota (que es su ancla) y en el último tramo, que acaba en el botón del
  Fondo. Va siempre por el margen izquierdo, dentro del `--gutter` del
  contenedor: a la mitad del gutter en ≥ 640 px y a 8 px del borde en
  < 640 px (el gutter es de 24 px a 390). El contenido no se mete en ese
  canal.
- **Durante el pin del proceso** el hilo no avanza: su cabeza se queda en la
  cota «−2» y el recorrido lo hace la broca del testigo. Al soltarse el pin,
  sigue. Las posiciones de las anclas se toman de los `start`/`end` de
  ScrollTrigger (no de `getBoundingClientRect` mientras hay pin).
- Se recalcula con `ResizeObserver` en el `<main>` (cambia de alto al cargar
  imágenes y letras), tras `document.fonts.ready` y al terminar la cortina. Un
  `resize` que solo cambia el alto (barra del navegador en móvil) no lo
  recalcula. Receta: Casa María y `trazoRevelable` / `progresoTramo` de
  `biblioteca-movimiento`.
- Con movimiento reducido: entero y en lima desde el principio.

### 3.11 Quién está debajo, Diagnóstico y Fondo

**«−3 · Quién está debajo»**: Equipo y Compromisos en un solo estrato.
- Primero las personas (`personas`, `TarjetaPersona`, con las siluetas
  provisionales) y `entradaEstudio`, con el enlace a `/estudio/`.
- Debajo, los compromisos (`compromisos`, `notaCompromisos`) como paradas de un
  pozo, en Kode Mono.
- `Compromisos` sigue aceptando `className` porque `/estudio/` lo usa.

**«−4 · Diagnóstico»**: el bloque de la 001 (§3.7 de la 001) con el aspecto
nuevo. Mismo componente, misma lógica, misma fila «Por sector». Su
comportamiento no cambia.

**«Fondo · Auditoría»**: el final del corte y del objeto.
- Lo de hoy de `Auditoria` (`loQueRecibes`, `loQueNoPedimos`,
  `TOTAL_PREGUNTAS`) más «36 preguntas» y «0 €» de `cifras.ts`.
- El botón **«Empezar la auditoría»** (`/auditoria/`), que es donde llega el
  conducto, y el enlace secundario por correo que tenía `CtaFinal`
  (`mailto:site.email`). El formulario de 36 preguntas sigue en
  `/auditoria/`: no se mete en la portada.
- **El objeto se completa** (PLIEGO §5 bis): la línea de 2 px bajo el botón
  descansa en `--conducto` y, cuando el botón cruza el 66 % del alto de la
  pantalla (IntersectionObserver, a la vez que llega la cabeza del conducto
  si lo hay), se enciende en lima y el símbolo del iceberg (`Simbolo`) que hay
  junto a él se dibuja entero, con su superficie en lima: el mismo dibujo que
  abrió la cortina. No depende del hilo: funciona igual en Sobria y en las
  páginas de sector. Con movimiento reducido o sin JS, ya encendido.
- Debajo, el pie en `--roca`.

### 3.12 Páginas interiores (D-016)

Empiezan «debajo»: fondo `--hondo` desde arriba, cabecera en oscuro, la línea
de superficie (lima, 3 px) justo bajo la cabecera y la cota junto al H1. **Sin
cortina.** El H1 usa la escala de H2 (§3.2) y la nitidez de su cota.

| Página | Cota | `SHRP` |
|---|---|---|
| `/herramientas/` | «0 · Herramientas» | 20 |
| `/plantillas/` | «−1 · Catálogo» | 40 |
| `/estudio/` | «−3 · Estudio» | 85 |
| `/sectores/` y `/sectores/<slug>/` | «−4 · Sectores» | 95 |
| `/auditoria/` | «Fondo · Auditoría» | 100 |
| `/privacidad/` | «Fondo · Privacidad» | 100 |
| 404 | «Sin fondo · 404» | 100 |

- `/plantillas/`: todas con la tarjeta de corte (§3.8) **sin dorsal**, con
  los filtros de hoy. La primera fila (las tres primeras) se carga sin
  `lazy`, como hoy (`priority` con `i < 3`).
- `/estudio/`: `Compromisos` sale como en la portada (paradas de un pozo).
  El enlace «/#equipo» sigue valiendo (§3.5).
- **404** (`not-found.tsx`): deja la rueda rota (`gearSvgPath`,
  `pitchRadius`, `.rueda-rota`) y pinta el `Simbolo` sin línea de
  superficie: «no hay nada a esta cota». Así `engranaje.ts` y `gearPath.ts` se
  pueden borrar.
- `/sectores/<slug>/`: el mismo orden de bloques de la 001 (§3.8 de la 001),
  restilados; el cierre pasa de `CtaFinal` al bloque Fondo de la portada
  (§3.11), sin el conducto. El bloque `#asistente` mantiene «Ejemplo · negocio
  inventado».
- `/auditoria/`: el formulario no cambia de lógica; los campos llevan borde en
  `--apagado-abajo` (no `--conducto`, que no se lee) y foco según §3.4.
- `/herramientas/`: `BrowserMockup` y `MovilMockup` se quedan, con los tokens
  nuevos.
- Sin conducto principal en las interiores: el hilo es de la portada.

### 3.13 Textos nuevos

Todos son de capacidad, no de condiciones. Los marcados con P-04 se revisan
antes de publicar.

| Dónde | Texto |
|---|---|
| `site.tagline` y titular del hero | «Lo de arriba vende. Lo de abajo trabaja.» |
| `site.descripcion` y descripción del hero (P-04) | «Diseñamos lo que ve tu cliente y montamos lo que lo hace funcionar: web, automatización y vídeo para negocios.» |
| Titular de Servicios | «Montamos lo que se ve y lo que va debajo.» |
| Entradilla de Servicios (P-04) | «Diez servicios. Cada uno tiene una parte que ve tu cliente y otra que trabaja por debajo.» |
| Título de La plantilla | «Una plantilla de 30.» |
| Rótulo de los ejemplos del hero | «Ejemplo» |
| «¿Tu sector no está?» bajo las destacadas (P-04, D-026) | «Aquí hay N de las 30 que tenemos publicadas. Escríbenos con tu sector y te enseñamos la que más se acerca a lo tuyo, o te preparamos una para él.» · botón «Pedir la de mi sector» |
| Cotas | las del §3.5 y §3.12 |
| Tabla del proceso (P-04) | columnas «Lo que ves tú» / «Lo que hacemos por debajo» |

La `description` de los metadatos de la portada pasa a ser la de
`site.descripcion`.

### 3.14 Cortina

Sustituye a `Preloader` (cortina-engranaje). Fichero nuevo
`src/components/layout/Cortina.tsx`, que **exporta la misma API**:
`PRELOADER_SESSION_KEY`, `PRELOADER_DONE_EVENT`, `PRELOADER_GONE_EVENT` y
`esperarCortina()`, con el mismo significado (la 001 los usa). `Preloader.tsx`
y `engranaje.ts`/`gearPath.ts` se borran si nada más los usa.

- **Solo en una carga de documento de la portada**, la primera vez por sesión
  (`sessionStorage`, misma clave). Nunca en las interiores, nunca al navegar
  dentro de la web sin recargar (pulsar el logo desde `/plantillas/` no la
  saca: manda `PageTransition`) y nunca con movimiento reducido. Entrar por una
  interior **no** marca la sesión como vista.
- **La decide el `<head>`**: un script en línea, antes de pintar, pone en
  `<html>`:
  - `js-si` siempre (hay JS);
  - `cortina-si` solo si la ruta es la portada (`basePath + "/"`), la clave no
    está en `sessionStorage` y no hay `prefers-reduced-motion: reduce`.
  La cortina solo se ve con `html.cortina-si`. Sin JS no hay ninguna de las
  dos clases y la web se ve entera. `<html>` lleva `suppressHydrationWarning`.
  El selector que la retira (`html.cortina-si.cortina-fuera`, o quitar la
  clase) gana en especificidad al que la enseña.
- `Cortina.tsx` se monta en el layout y, si no hay `cortina-si`, no hace nada.
  `esperarCortina()` lee esa clase: sin ella, se resuelve en el acto.
- Fondo: `#10262A` arriba y `#081113` abajo (distintos de lo que destapa), con
  el símbolo del iceberg.
- Secuencia, encadenada y con `expo.inOut`:
  1. aparece el símbolo;
  2. la superficie se traza desde el centro hacia los lados;
  3. el terreno se parte por la línea: la mitad de arriba sube con el borde
     combado y la de abajo se hunde (`PRELOADER_DONE_EVENT` aquí);
  4. **la línea se queda: es la superficie del hero**, en su sitio exacto (la
     cortina mide la `y` de la superficie del hero antes de empezar; en móvil,
     el nivel en px del §3.6);
  5. lo de arriba del hero emerge desde la superficie y lo de abajo se hunde
     desde ella (`PRELOADER_GONE_EVENT` cuando se puede hacer scroll).
- **Duración**: la secuencia entera (pasos 1–5) dura como mucho 3 s; el boceto
  se va a unos 3,6 s y se recorta (sobre todo el paso 3).
- **Retirada garantizada**, que no depende del bundle: el mismo script del
  `<head>` arma un temporizador de 4,5 s que quita `cortina-si` y libera el
  scroll. `Cortina.tsx` lo anula al arrancar la secuencia y, si algo falla a
  mitad, la retira en su `catch`. Así, si el JS de la página no carga, la
  cortina se va igual. El reloj de la secuencia no cuenta los atascos (si un
  fotograma tarda más de 0,1 s, cuenta 1/30 s).
- **LCP**: el titular del hero está pintado desde el primer fotograma, aunque
  la cortina lo tape (ni `opacity: 0`, ni `visibility: hidden`, ni recorte a
  área cero). La emergencia del paso 5 se hace con `transform`.

### 3.15 Rendimiento (presupuesto)

Se mide con un `scripts/medir.mjs` nuevo, que parte de
`../marina-spa-zafra-web/scripts/lcp.mjs` (Playwright + CDP: iPhone 13, 4G,
CPU ×4, mediana de 3 cargas en frío) con estas adaptaciones:

- Playwright se importa del propio repo (se añade `playwright` como
  `devDependency`; es la única dependencia nueva, y solo de desarrollo), no
  por ruta absoluta de otro repo.
- Sirve `out/` con un servidor estático propio en un puerto fijo libre
  (`scripts/servir.mjs`), y comprueba el `<title>` antes de medir (otro
  servidor podría tener el puerto).
- Rutas de esta web y la clave de cookies de esta web (el aviso se da por
  aceptado antes de medir).
- Además del LCP, mide CLS y el INP del instrumento.

Las cifras **medidas** se escriben en una tabla «Presupuesto» del `README.md`.

| Medida | Tope | Cómo |
|---|---|---|
| LCP de la portada (móvil), con cortina y sin ella | ≤ 2,5 s, y el elemento LCP es el `<h1>` o una de sus líneas | `medir.mjs` |
| LCP de `/plantillas/` y `/sectores/alojamientos-rurales/` | ≤ 2,5 s | `medir.mjs` |
| CLS de la portada: carga, scroll por el hero y 1 s de arrastre del tirador | ≤ 0,05 en total | `layout-shift` con `hadRecentInput` incluido |
| INP del instrumento (tocar un objeto, arrastrar el tirador) | ≤ 200 ms | `event` timing (Event Timing API) con CPU ×4 |
| Letras | 2 ficheros, ≤ 70 KB entre las dos (con los glifos añadidos) | tamaño en `out/` |
| Tareas largas tras `document.fonts.ready` | ninguna > 200 ms | `longtask`, control lanzado con `setTimeout` |

- Sin canvas ni WebGL en ninguna parte (sale `three`). Pozos, hilo y testigo
  son SVG y CSS.
- El bucle de animación del hero y del hilo se para fuera de pantalla y con la
  pestaña oculta.
- **Bajada de calidad automática**: el hero mide los fotogramas reales; si van
  por debajo de 40 fps durante 2 s seguidos, se apaga la inactividad y los
  pulsos pasan a encender las paradas sin recorrido animado. El resto de la
  web no cambia.

### 3.16 Mando de maqueta (`?revision`)

- Solo se enseña si la URL lleva `?revision` (también `?revision=sobria`). Sin
  ese parámetro no se pinta nada del mando.
- Dos botones: **«Por debajo»** (la cargada, por defecto) y **«Sobria»**, con
  `aria-pressed`. Cambian una clase en `<html>` (`densidad-sobria`) y un bloque
  de CSS; no son dos webs.
- La elección se guarda en la URL (`?revision=sobria`, con
  `history.replaceState`), **no** en `localStorage`: así no hay que tocar el
  aviso de cookies. El `replaceState` conserva los demás parámetros (los del
  diagnóstico, 001 §3.5) y el `#hash`.
- **Sin parpadeo**: el script del `<head>` (§3.14) lee `?revision=sobria` y pone
  `densidad-sobria` en `<html>` antes de pintar.
- Vale **por página**: los enlaces internos no arrastran `?revision`. Para ver
  una interior en Sobria se abre con su propio `?revision=sobria`. El mando
  sale en cualquier página que lleve `?revision`.
- **Sobria**:
  - se queda la superficie y el pozo activo del hero;
  - salen el conducto principal, los pozos de las tarjetas y de Servicios
    (quedan como lista), el testigo dibujado y los dorsales;
  - ganan: el proceso como tabla (§3.9) y, bajo las plantillas, el recuento
    «N sectores · 30 bases · 2 semanas» (sectores contados de
    `sectoresPlantillas`).

### 3.17 Movimiento reducido

Con `prefers-reduced-motion: reduce`: sin cortina, pozo 01 encendido y quieto,
sin inactividad ni pulsos, superficie fija (no sube con el scroll), conducto
entero, proceso como tabla, titulares con su nitidez final y transiciones
entre páginas directas. El tirador sigue funcionando (es un gesto pedido), sin
animación de vuelta.

### 3.18 Nivel (PLIEGO §5 bis, D-021)

El `README.md` lleva un apartado «Nivel» con lo que pide el §5 bis:

- **Piezas del kit quitadas**: marquesina, botones magnéticos, pilas sticky,
  cursor propio, grano y hero WebGL. **Pieza propia**: los pozos con paradas
  que son servicios reales (y el conducto que baja de cota).
- **Recursos del §2 que quedan** (al menos cinco, D-022): Lenis; char-reveal
  (palabras que emergen de la superficie, §3.2); máscaras que se abren con el
  scroll (los bloques que se descubren desde una línea, §3.5); sección anclada
  con scrub (el testigo, §3.9; vertical, no galería horizontal); y el hero
  propio del concepto, en SVG en vez de canvas o WebGL (excepción registrada en
  D-022 por el presupuesto del §3.15).
- **Gesto táctil**: el tirador (§3.6).
- **Final del objeto**: el Fondo (§3.11).
- **Foco con la forma del motivo**: §3.4.
- **Presupuesto medido**: §3.15.
- **Menú**: inactividad (§3.6), con 5 s y una vuelta en vez de 15–20 s
  (D-019), y el porqué: casi nadie se queda 15 s mirando un hero.

El PLIEGO no se toca.

## 4. Datos

No hay base de datos ni migraciones. Cambios en el contenido:

- `site.ts`: `tagline` y `descripcion` nuevas (§3.13).
- `proceso.ts`: campos nuevos `dato`, `vesTu` y `debajo` en cada paso.
- `hero.ts` (nuevo): `flujos` del §3.6.
- `cifras.ts`: el valor de las plantillas pasa a salir de
  `plantillas.length`; los demás, sin cambios. Se lee desde tres secciones.
- `package.json`: salen `three`, `@types/three` y `motion`; entra
  `playwright` como `devDependency` (solo para medir y comprobar, §3.15).
- `plantillas.ts`, `servicios.ts`, `estudio.ts`, `auditoria.ts`,
  `sectores.ts`, `diagnostico.ts`: sin cambios.

## 5. Seguridad, privacidad y legal

- Nada nuevo se guarda en el navegador: el mando va por URL y la inactividad no
  guarda nada. La cortina sigue con su clave de `sessionStorage`
  (`undertactics-preloader-seen`), que **hoy `/privacidad/` no menciona**
  (dice que solo se guardan el borrador del formulario y el aviso). Se añade
  en el apartado «Cookies» de `/privacidad/`: «y, solo mientras tengas la
  pestaña abierta, que ya has visto la animación de entrada, para no
  repetírtela». El aviso de cookies no cambia.
- Letras autoalojadas: deja de haber peticiones a Google Fonts (ya no las
  había con `next/font`, que también las sirve en local).
- Noindex en todas las páginas, como hoy.
- **Nada falso**: los ejemplos del hero llevan «Ejemplo»; las plantillas, el
  aviso de que los negocios son inventados; la ficha de Google del hero es un
  dibujo sin nombre de negocio ni recuento de reseñas.
- Los enlaces externos (`demo`) llevan `rel="noopener"`.

## 6. Casos límite

- **Barra del navegador en móvil**: el hero no salta al aparecer o
  desaparecer la barra al hacer scroll. Un `resize` que solo cambia el alto no
  recalcula el nivel ni el hilo; se usa `svh` y nunca `innerHeight`.
- **Abrir la portada con un ancla** (`/#proceso`, o un diagnóstico con query,
  001 §3.5): el salto espera a `esperarCortina()` y se hace con Lenis.
- **Abrir la portada a mitad de página** (recarga con scroll restaurado): el
  hilo y la nitidez se pintan en el estado que toca a esa altura, sin animar
  desde arriba.
- **Pin del proceso y carga tardía**: el `end` del pin se recalcula con
  `ScrollTrigger.refresh()` cuando cambia el alto del `<main>`
  (`ResizeObserver`), y tras `document.fonts.ready`.
- **Toque sobre un objeto mientras corre la inactividad**: manda el toque; el
  pulso en curso se corta y empieza el del objeto tocado.
- **Arrastrar el tirador mientras se hace scroll**: el arrastre manda hasta
  soltar; después la superficie vuelve a la posición que toca al scroll.
- **Sin GSAP** (bloqueado o fallido): cortina retirada a los 2,5 s, todo el
  contenido visible, proceso como tabla, conducto entero.
- **Sin JS**: la web se lee entera. Todo estado inicial oculto (máscaras de
  las secciones, palabras de los H2, emersión del hero, cortina) existe solo
  bajo `html.js-si`; sin JS no hay cortina, el pozo 01 está en reposo y el
  proceso sale como tabla (la tabla está en el HTML y el testigo se monta
  encima solo con JS).
- **Catálogo con más de 30 plantillas o con menos de 10 destacadas** (P-02):
  el título y el recuento salen de los datos; si hay menos de 10 destacadas,
  los titulares son las que haya.
- **Estado y bloque con el mismo nombre**: las clases de estado van con
  prefijo `es-` (`es-activo`, `es-alcanzada`, `es-pasado`).
- **Texto suelto en un grid** (paradas, datos): siempre dentro de un `<span>`.
- **Tilde en mayúscula** en los titulares a interlineado .92: ver §3.2.

## 7. Pruebas

**Tests (`npm test`)**, con el `node --test` del proyecto:

- **§3.6 · Cada parada del hero es un servicio real**: para cada parada de
  `hero.ts`, `servicio` existe en `servicios.ts` y `clave` aparece (sin
  distinguir mayúsculas ni tildes) en la `descripcion` o en un `incluye` de ese
  servicio.
- **§3.5 · Las cotas de la portada**: la lista de secciones de la portada sale
  de un array (`cortePortada`) con siete entradas en el orden, `id`, cota y
  `SHRP` del §3.5.
- **§3.8 · Dorsales**: la función que asigna dorsales da 1–N a las destacadas
  y N+1–total a las demás, sin huecos ni repetidos, y el título usa
  `plantillas.length`.
- **§3.5 · Recuento**: la cifra de plantillas de `cifras.ts` es
  `plantillas.length`.
- **§3.9 · Proceso**: los seis pasos tienen `dato`, `vesTu` y `debajo` no
  vacíos.
- **§3.1 · Tokens viejos**: ningún fichero de `src/` contiene `bg-base`,
  `bg-raised`, `bg-sunken`, `text-primary`, `text-muted`, `text-faint`,
  `accent` como clase o variable (`--accent`, `text-accent`, `bg-accent`,
  `border-accent`, `accent-dim`…), ni `border-line`/`--line`.
- **§3.4 · Sin lima de relleno**: ninguna clase `bg-superficie` ni
  `bg-[#c9f24d]` (sin distinguir mayúsculas) en `src/` salvo en un elemento que
  también lleve `h-px`, `h-[2px]`, `h-[3px]`, `w-px` o `w-[2px]`.
- **§2 · Bajas**: ninguno de los nombres de la lista de bajas del §2 aparece en
  `src/`, y `package.json` no tiene `three`, `@types/three` ni `motion`.

**Comprobación en navegador** (`scripts/comprobar.mjs`, con el Playwright del
repo), sobre `out/` servido con `scripts/servir.mjs`, a **360, 390 y 1440 px**.
Con Lenis, el scroll se hace con `mouse.wheel`. La cortina se prueba en una
página nueva cada vez, con el enganche en `addInitScript`.

- **Portada**: siete secciones con su cota, en orden; no existen `Marquee`,
  `Cifras` ni `CtaFinal`; ninguna petición a Google Fonts; se piden los dos
  woff2 de `fuentes/`.
- **basePath**: un build con `GITHUB_ACTIONS=true` deja en `out/` las rutas
  `/subcon-works-web/fuentes/…` en el `@font-face` y en el `preload`.
- **Cortina**:
  - sale la primera vez, no en la segunda carga de la sesión, no en
    `/plantillas/`, no con `reducedMotion: "reduce"` y no al ir de
    `/plantillas/` a la portada pulsando el logo;
  - en esos casos tampoco aparece ni un fotograma (captura justo tras
    `domcontentloaded`);
  - la superficie de la cortina acaba en la misma `y` (±1 px) que la del hero;
  - abortando todos los `/_next/static/chunks/*.js`, la cortina se retira
    antes de 4,5 s y se puede hacer scroll.
- **Sin JS** (`javaScriptEnabled: false`): sin cortina; se ven el titular, todos
  los `h2` (visibles y con `getBoundingClientRect` no vacío) y la tabla del
  proceso.
- **Hero**:
  - al tocar cada objeto se enciende su pozo y la lectura cambia; junto a la
    lectura está «Ejemplo»;
  - quieto 5 s, cambia de pozo; tras cuatro cambios, se para; tras tocar, no
    cambia en 15 s; con «Pausar ejemplos» pulsado, no cambia en 20 s;
  - la región `aria-live` solo cambia tras un gesto;
  - arrastre táctil del tirador con CDP `Input.dispatchTouchEvent` (contexto
    con `hasTouch`): la superficie se mueve y al soltar vuelve; un arrastre
    vertical sobre el hero fuera del tirador hace scroll de la página;
  - a 360 px, ningún texto del hero se solapa con otro ni queda recortado, y
    ninguno baja de 12 px.
- **LCP**: a 390 px, el área de la mayor línea del titular supera a la de la
  descripción.
- **Cabecera**: logo claro arriba y oscuro tras cruzar la superficie (se mira el
  color calculado de los trazados del SVG, no solo la clase).
- **Contraste real**: en la portada y en las siete interiores, a 390 y 1440 px y
  en las dos densidades, para cada nodo de texto visible se calcula el color
  efectivo (con la opacidad de los ancestros) contra el fondo efectivo de
  detrás; todos cumplen 4,5:1 (3:1 a partir de 24 px, o 18,66 px en negrita).
  Se repite con un pozo encendido y otro en reposo.
- **Foco**: tabular por la portada; cada elemento enfocado lleva `outline` de
  2 px y la línea de abajo, en lima sobre oscuro y en tinta sobre claro; el
  tirador, el doble anillo. Con `forcedColors: "active"`, el `outline` sigue.
- **Hilo**: con la cabeza al 66 %, las cotas pasadas llevan `es-alcanzada`;
  durante el pin del proceso la cabeza no pasa de la cota «−2»; el trazo no
  se solapa con el rectángulo de ningún texto ni control, **salvo** el de
  cada cota (su ancla) y el botón del Fondo (su final).
- **Fondo**: al llegar el botón al 66 % de la pantalla, su línea y el iceberg
  se encienden; también en Sobria y en `/sectores/alojamientos-rurales/`.
- **Proceso**: con la broca en cada estrato, su paso está encendido; con
  `reducedMotion` y en Sobria, se ve la tabla de seis filas.
- **Mando**: sin `?revision` no existe en el DOM; con `?revision` cambia entre
  «Por debajo» y «Sobria» y la URL lo refleja sin perder otros parámetros ni
  el `#hash`; abrir con `?revision=sobria` pinta Sobria desde el primer
  fotograma. En Sobria no hay dorsales ni conducto y sí el recuento.
- **Interiores**: las siete páginas del §3.12 empiezan en `--hondo`, llevan su
  cota y no tienen cortina; `/sectores/alojamientos-rurales/` acaba en el
  bloque Fondo; `/estudio/` → «/#equipo» llega a la sección; la 404 pinta el
  iceberg sin superficie.
- **001 sigue cumpliendo**: se repasa la comprobación en navegador de la 001
  §7 (diagnóstico, URL, prerrelleno, «Copiar enlace»).
- **Rendimiento**: `scripts/medir.mjs` da las cifras del §3.15 y están
  escritas en el `README.md`, todas dentro del tope.
- **Sin scroll horizontal** a 360 y 390 px en ninguna página
  (`documentElement.scrollWidth` = ancho de la ventana).

**A mano** (Álvaro, antes de publicar):
- Textos de P-04.
- Ver las dos densidades en un móvil de verdad.
- Revisar el aspecto contra `_capturas/a-*`.
- Pasar un lector de pantalla por el hero (que los ejemplos automáticos no se
  anuncien).

## 8. Cambios a otras specs

Pendientes hasta que esta spec esté hecha y comprobada (tarea «Comprobar la
spec»). Hasta entonces, quien lea la 001 lee también este apartado.

### 001 · Diagnóstico rápido y páginas por sector — pendiente

- **MODIFICA §3.5, «El salto a `#diagnostico` se hace **después**…»** —
  sustituye `esperarCortina()` de `Preloader.tsx` por:
  > El salto a `#diagnostico` se hace **después** de que la cortina de
  > entrada se haya retirado (`esperarCortina()` de `Cortina.tsx`, que se
  > resuelve con `PRELOADER_GONE_EVENT`), o en el acto si la cortina no sale.
  > La cortina solo sale en la portada (002 §3.14). Se hace con Lenis y cuando
  > el resultado ya está pintado.
- **MODIFICA §3.5, subpunto «Mientras tanto el `body` está en
  `overflow:hidden` y el salto se perdería…»** — sustituye el subpunto por:
  > Mientras tanto el scroll está bloqueado y el salto se perdería.
  > `PRELOADER_DONE_EVENT` no sirve: llega cuando el terreno se parte (paso 3
  > de la cortina, 002 §3.14), antes de que se libere el scroll.
- **MODIFICA §3.7, primer punto** («Sección nueva `<Diagnostico />` con
  `id="diagnostico"`, justo antes de `<Auditoria />`») — sustituye por:
  > Sección `<Diagnostico />` con `id="diagnostico"`, cota «−4 · Diagnóstico»,
  > justo antes del Fondo (la auditoría). Ver el corte de la portada en 002
  > §3.5.
- **MODIFICA §3.7, segundo punto** («Encabezado del estilo de las demás
  secciones…») — sustituye por:
  > Encabezado del estilo de las demás secciones (002 §3.5): encima del
  > titular, la cota «−4 · Diagnóstico» y, detrás, la etiqueta «Diagnóstico
  > rápido · un minuto», sin número de preguntas. El titular no cambia.
- **MODIFICA §3.8, punto 7** («**Cierre**: llamada a la auditoría, como
  `CtaFinal`.») — sustituye por:
  > 7. **Cierre**: el bloque Fondo de la portada (002 §3.11), sin el conducto
  >    principal.
- **AÑADE §3.8, tras «**Metadatos**…»:**
  > **Aspecto**: las páginas de sector empiezan «debajo», con la cota «−4 ·
  > Sectores» y sin cortina (002 §3.12). En la cabecera, la cota va primero y
  > la etiqueta del sector detrás, separadas por « · ».
- **MODIFICA §3.9, primer punto** («Se usan los componentes y las fichas de la
  web: `Boton`, `Etiqueta`, …») — sustituye por:
  > Se usan los componentes y los tokens de la web (002 §3.1–§3.4): `Boton`,
  > `Etiqueta`, `Enlace`, `TarjetaPlantilla` (variante `corte`),
  > `container-max`, `font-mono-label`, `--space-section`.
- **MODIFICA §3.9, segundo punto** («El cursor propio, Lenis, la cortina y el
  aviso de cookies ya los pone el layout…») — sustituye por:
  > Lenis, la cortina y el aviso de cookies ya los pone el layout (la
  > cortina solo sale en cargas de la portada, 002 §3.14). No se añade nada
  > de eso. (El cursor propio ya no existe: 002.)
- **MODIFICA §3.9, cuarto punto** («**Sin JS**: el componente lleva un
  `<noscript>`…» y sus dos subpuntos) — sustituye los subpuntos por:
  > - No se promete más que eso en el componente. Desde la 002, la web se lee
  >   sin JS: la cortina solo se pinta si un script del `<head>` pone la
  >   clase `js-si`.
- **MODIFICA §7, «Comprobación en navegador», punto «Un diagnóstico de la
  portada con `s=dental`…»** — sustituye «y al abrirla el resultado sale
  después de la cortina» por:
  > y al abrirla el resultado sale directamente (las páginas de sector no
  > tienen cortina, 002 §3.12), con la página ya en `#diagnostico`.

## 9. Pendientes

- **P-04** · Revisar los textos nuevos antes de publicar: descripción del
  hero, entradilla de Servicios, cotas, columnas «Lo que ves tú» / «Lo que
  hacemos por debajo» del proceso, los ejemplos del hero y la frase nueva de
  `/privacidad/` sobre la cortina (§5). Bloquea: publicar
  (merge de `feat/rediseno-por-debajo` a `main`).
- **P-05** · Widget del chatbot (rama `feat/chatbot`). Lo que se mergee
  segundo adapta el widget a los tokens de esta spec (fondo `--estrato`, texto
  `--hueso`, sin lima de relleno). No bloquea.
- **P-06** · Plantilla de la miniatura del reel del hero: se usa la portada de
  `panaderia` como en el boceto. Si Álvaro prefiere un fotograma de vídeo
  real del estudio cuando exista, se cambia. No bloquea.
- **P-07** · `og.png` lleva grabado el lema viejo y la paleta vieja. ¿Se
  regenera con el lema nuevo (`scripts/marca/rasterizar.mjs`, y subir el `?v=`
  en `layout.tsx`)? DIRECCION §4 dice «sin cambios»; mientras tanto, el `alt`
  va fijo (§3.3). No bloquea.

## 10. Para el plan

- **Publicación** (D-020): todo va a la rama de integración
  `feat/rediseno-por-debajo`, y a `main` de una vez, tras P-04 y la revisión
  de Álvaro con `?revision`.
- Orden sugerido: tokens, letras y logo → piezas comunes (cabecera, botones,
  foco, pie, transición) → cortina → hero → secciones de la portada → hilo →
  interiores → mando y Sobria → bajas del kit y de `three` → presupuesto.
- La 001 sigue viva en `main` (y su comprobación en
  `chore/comprobar-spec-001`): las tareas que toquen `Diagnostico.tsx`,
  `sectores/[slug]/page.tsx` o `page.tsx` parten del `main` del momento.
