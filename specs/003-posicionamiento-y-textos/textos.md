# 003 · Textos

Spec: [spec.md](spec.md) (§3.6) · Plan: [plan.md](plan.md) (PD-3, PD-9) ·
Tareas: [tasks.md](tasks.md) (T04, T05)

Estado del documento: **propuesta** (T04, 2026-11-01), sobre `exp/consultora` en
`7718dcf` y con el Anexo A confirmado (D-035). Lo aprueba Álvaro fila a fila en
T05 (D-033). Solo T04 escribe este fichero; T05 cambia la columna de estado.

**Cómo se lee.**
- Una tabla por ruta del export y una `*` para lo común. Columnas: ruta ·
  fichero · identificador · texto actual · texto nuevo · motivo · estado.
- `(igual)`: no cambia, y CA-4 comprueba que el texto actual sigue en su
  fichero. `(quitar)`: sale (§3.7), y CA-4 comprueba que ya no está.
- `{n}` es una variable. Un `|` dentro de un texto va como `\|`. Las formas
  cortas (§6) van en su propia fila, con identificador `<clave>.corto`.
- En «motivo», cada afirmación cita su id del Anexo A (spec §3.3). Cuando un
  texto se reescribe, el motivo dice qué filtro del §3.6 lo obliga: (1) jerga,
  (2) Anexo y nivel, (3) condición, (4) presupone, (5) cifra, (6) tono.
- Un identificador `jsx · …` es texto escrito a mano en un componente, sin
  clave: se busca por el texto actual.
- No llevan fila: la numeración de estructura (01-07, A-C de las bandas,
  «Paso n de 8», P1-P36), los comentarios del código y los componentes que no
  pinta ninguna ruta de esta rama (la portada vigente, spec §2).
- Las filas `por confirmar` del Anexo (A10, A26, A36, A52, A54, A81, A99) no
  sirven para escribir (spec §3.3): donde un texto de hoy se apoya en una de
  ellas, el texto nuevo la quita.

## La promesa

> **Montamos lo que se ve y lo que va debajo.**

- Es la frase de D-014 (préstamo de C), que la spec manda respetar (C-23): no se
  inventa otra. Abre el primer párrafo del hero, justo debajo del titular «Lo
  de arriba vende. Lo de abajo trabaja.».
- No nombra un dolor: ni tiempo, ni WhatsApp, ni hojas de cálculo, ni web
  vieja (§3.1). Dice qué hacemos y deja que cada uno entre por su puerta.
- Las dos puertas, como las dice la web:
  - **Lo que ve tu cliente**: la web, la tienda online y la ficha de Google
    (A06, A01, A25, A08, nivel A) y las reservas (A18, nivel B, «a medida»).
  - **Lo que va por debajo**: automatizaciones, asistentes con IA y programas
    de gestión, montados a tu medida (A22, A11, A12, A28, A23). Lo que es B
    va siempre como «a tu medida» o «podemos montar», nunca en presente de
    producto.
- La descripción única del sitio (A45: `site.descripcion`, metadatos, OG y
  pie) es la promesa dicha con las dos puertas: «Hacemos la web, la tienda
  online y la ficha de Google de tu negocio, y montamos a tu medida lo que va
  por debajo: automatizaciones, asistentes con IA y programas de gestión.»

## Nombres

Tres propuestas por producto de nivel A y por puerta, con la recomendada en
negrita. Ninguna lleva «propio» ni «herramienta» (§3.4 regla 1), y solo una
lleva «diagnóstico» (regla 4, CA-17). Álvaro elige y comprueba en la OEPM las
que no son descriptivas (regla 6); una descartada se sustituye por la
descriptiva. **Las tablas de abajo usan ya las recomendadas**: si Álvaro elige
otra, T05 la cambia en sus filas.

| Qué es | Anexo | Propuestas | Recomendado y por qué |
|---|---|---|---|
| Plataforma de tiendas | A01, A25, A60 | 1. **Tienda online** · 2. Tienda online con panel en el móvil · 3. Mostrador | **Tienda online.** Es lo que compra el cliente; «plataforma» es jerga (filtro 1) y la plataforma compartida es cosa nuestra (A60). Ya es el nombre del servicio (`servicios.ts` 02) y de la línea 04, así que queda uno solo en todo el sitio (CA-5). La 2 es larga para una etiqueta; la 3 es nombre de fantasía y obliga a mirar marcas. |
| Informe de mejoras de tu web | A03 | 1. **Informe de mejoras de tu web** · 2. Revisión de tu web · 3. Tu web, fallo a fallo | **Informe de mejoras de tu web.** Dice qué te llevas (un informe) y de qué (tu web), y no se confunde con el informe de la auditoría, que es de tu negocio. Ya está en `consultora.ts` y en `herramientas.ts`. Forma corta, si hace falta: «Informe de tu web». |
| Formulario de contacto | A29 (A04 es C: el aviso por correo no se nombra) | 1. **Formulario de contacto** · 2. Formulario que guarda cada mensaje · 3. Buzón de tu web | **Formulario de contacto.** El de hoy, «Formularios de contacto propios», lleva «propios» (regla 1). Lo que lo distingue (recibe y guarda cada mensaje, sin el formulario de otra empresa, A29) va en el texto y no en el nombre. La 2 es una frase; la 3 suena a correo y daría a entender el aviso por correo, que es C (A04). |
| Asistente de la web (`recepcionista-ia`) | A11 | 1. **Asistente en tu web** · 2. Recepcionista virtual · 3. Asistente con IA | **Asistente en tu web.** Dice dónde está y qué es, y es como ya sale en «Incluye» de la línea 02. La 2 promete más de lo que hace hoy (A28 es B) y choca con marcas de centralitas; la 3 no dice dónde. |
| Puerta 1 · formulario corto de la portada | A56, A30, A80 | 1. **Propuesta para tu negocio** (botón «Pedir una propuesta») · 2. Primera valoración (botón «Pedir una valoración») · 3. Estudio de tu caso (botón «Cuéntanos tu caso») | **Propuesta para tu negocio.** Lo que se llevan es lo que hoy llama «diagnóstico» el paso 03 del proceso: qué montaríamos, en qué orden y cuánto cuesta cada fase, por escrito (A30). Así deja de compartir «diagnóstico» con la puerta 2 (regla 4) y casa con la FAQ, que ya habla de «la propuesta». El precio se dice como «la propuesta no se cobra» (A80, D-035). |
| Puerta 2 · diagnóstico rápido de `/sectores/` | A95, A70 | 1. **Diagnóstico rápido** · 2. Diagnóstico de tu sector · 3. Diagnóstico en tu navegador | **Diagnóstico rápido.** Es el único que se queda con «diagnóstico» (CA-17, D-001) y ya se llama así en la web y en la 001. «Rápido» no lleva cifra (el «un minuto» de hoy es C, A70). La 2 no vale para «Otro negocio»; la 3 es larga. |
| Puerta 3 · auditoría y su informe | A34, A38, A72 | 1. **Auditoría de tu negocio** · 2. Auditoría completa · 3. Informe de tu negocio | **Auditoría de tu negocio.** Dice qué se mira. «Completa» (el de hoy) no dice de qué y, al lado de la puerta 2, suena a «la de pago»; la 3 se confunde con el informe de mejoras de tu web (A03). El precio se dice como «la auditoría no se cobra» (A34, D-035), sin «gratuita». Forma corta: «Auditoría». |

Quedan fuera, a propósito: la vigilancia y la ficha de Google como
herramienta (se nombran en la 004, regla 7) y el catálogo de plantillas, que
se nombra por §3.5 («Webs de ejemplo por sector»).

## Decisiones de redacción

Las que la spec deja a este fichero (§3.4, §3.5, §3.7, plan PD-3), más las que
salen de aplicarlas. Cada una es `propuesta` hasta que Álvaro apruebe sus
filas.

1. **La parada que sustituye a «Vigilada cada día»** (`hero.ts`, flujo «Tu
   web»; spec §3.7, A19).
   - Parada nueva: **«Cambios cuando los pidas»**, del servicio **07
     «Mantenimiento y soporte»**, con clave **«Cambios de contenido»**, que
     sigue en su `incluye` (A07).
   - La lectura cambia a juego: «y queda vigilada cada día.» pasa a «y se
     cambia cuando lo pidas.».
   - Por qué esa: es lo que de verdad pasa después de rescatar una web (la
     cuidamos a mano, A07), sigue siendo del servicio 07 y su clave ya existe.
     `hero.test.ts` sigue con 4 flujos × 3 paradas y cada clave en
     `servicios.ts`. T06 cambia `hero.ts` y `servicios.ts` en el mismo commit.
   - De paso, **«Factura emitida»** (A16, C) del flujo «Tu tienda» pasa a
     **«Pedido en tu panel»**, del servicio **02 «Tienda online»**, con clave
     **«Panel en el móvil»** (A01), y su lectura «factura emitida sola» pasa a
     «pedido en tu panel».
2. **«Automatizaciones e inteligencia artificial»** (`consultora.ts`,
   `proyectos`, banda B; spec §3.7).
   - Tras quitar la vigilancia y la ficha de Google, se quedaría con una sola
     entrada, el informe de mejoras, que no es ni automatización ni IA: el
     título prometería lo que no hay (A50 corregida).
   - **Se queda la banda, con otro título: «Para la web que ya tienes»**. Lleva
     el informe de mejoras (A03) y el formulario de contacto (A29), que pasa
     aquí desde la banda de webs: los dos funcionan hoy y sirven para una web
     que no hayamos hecho nosotros. La captura del informe se queda donde
     está: no cambia la maqueta.
   - La automatización y la IA solo salen como ejemplo (B) en «Tecnología
     aplicada» y como «a tu medida» en servicios y FAQ.
   - Alternativa, si Álvaro la prefiere: quitar la banda B y llevar el informe
     a la banda de webs (cambia la maqueta: es trabajo de T07).
3. **«Plantillas propias»** (`cifras.ts:20`, etiqueta de la cifra; CA-1 lo deja
   a este fichero).
   - **Sale «propias»**, aquí y donde aparezca: la regla 1 de §3.4 no deja
     «propio» en lo que se enseña, y «propias» no añade nada que el cliente
     compre. La etiqueta pasa a «Plantillas publicadas, con su demo entera»
     (A05, A57).
   - La pinta `Fondo` en las páginas de sector, así que su fila va en
     `## /sectores/<slug>/` (parte 2), y `portada.test.ts` la busca por esa
     etiqueta (lo actualiza T07).
   - «Una plantilla de 30.» no se toca (D-014, C-23): solo la pinta la portada
     vigente.
4. **«Proyectos»** (`site.ts:17`, `portada.ts:27`, titular del bloque; §3.5).
   - **Sale de lo que se ve**, porque suena a trabajos hechos para clientes
     (§3.2 regla 3):
     - menú: «Proyectos» → «Webs de ejemplo»;
     - cota: «−4 · Proyectos y demostraciones» → «−4 · Webs de ejemplo»;
     - titular del bloque: «Ideas que se convierten / en soluciones.» →
       «Webs de ejemplo por sector / y lo que ya funciona.» (lo recomendado en
       §3.5, más lo que enseñan las bandas B y C).
   - Los identificadores no cambian: `Proyectos.tsx`, `proyectos` en
     `consultora.ts` y el `id="plantillas"` (lo enlazan otras páginas).
5. **Rótulo de puerta de cada sección de la portada** (§3.1, CA-15). Uno por
   sección, en la etiqueta que `Seccion` pinta detrás de la cota (`etiqueta`);
   en el hero, en el sitio del lema, junto a «Superficie».

   | Sección | Rótulo | Por qué |
   |---|---|---|
   | Superficie · hero | Lo que ve tu cliente | Es la superficie: los cuatro objetos de arriba son lo que ve tu cliente (ya lo dice su `aria-label`). |
   | 0 · problemas | Lo que va por debajo | Las tres situaciones son de lo de abajo, y su cierre dice «Eso es lo de abajo». |
   | −1 · servicios | Lo que va por debajo | Mixta: tres de las cuatro líneas (automatización, agentes, software a medida) son de la puerta 2. La puerta 1 tiene su propio bloque en −4. |
   | −2 · Tecnología aplicada | Lo que va por debajo | Todos los ejemplos son automatización y agentes. |
   | −3 · proceso | Lo que va por debajo | Es cómo trabajamos por dentro; su tabla ya separa «lo que ves tú» y «lo que hacemos por debajo». |
   | −4 · webs de ejemplo | Lo que ve tu cliente | Webs, tienda, formulario e informe de tu web: todo es puerta 1. |
   | −5 · quién | Lo que va por debajo | Quién está debajo (su cota ya lo dice). |
   | −6 · dudas | Lo que va por debajo | Mixta: casi todas las preguntas son de automatización e IA. |
   | Fondo · contacto | Lo que va por debajo | Mixta: es el fondo del corte. |

   Si Álvaro quiere más equilibrio, la que antes cambiaría es −1 (servicios).
6. **«Herramientas» en el menú pasa a «Productos».** No lo pide la spec, pero
   sale de §3.4 (el cliente compra el resultado, no la herramienta) y de la
   decisión 2: tras §3.7, `/herramientas/` solo enseña cosas de nivel A (la
   tienda online, el informe de mejoras de tu web y el formulario de
   contacto, A50). La ruta no cambia (lo enlazan otras páginas). La parte 2 da
   a esa página un H1 y una `description` que casen.
7. **«Gratis» y «gratuito» salen** (D-035): el precio se dice «no se cobra»
   (A34 para la auditoría, A80 para la propuesta).
8. **Un texto por persona.** `consultora.ts` (`quien.personas`) y
   `estudio.ts` (`personas`) describen a Álvaro y a Yanin de dos maneras. En
   `## /` se propone para la portada un texto que la parte 2 tiene que
   repetir en `/estudio/`, para que cada uno tenga uno solo. Lo leen ellos
   antes de publicarlo (A40, spec §5).

## *

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| * | `src/content/site.ts` | `site.nombre` | Undertactics | (igual) | Marca. | propuesta |
| * | `src/content/site.ts` | `site.tagline` | Lo de arriba vende. Lo de abajo trabaja. | (igual) | Frase de D-014; no se toca (C-23). | propuesta |
| * | `src/content/site.ts` | `site.descripcion` | Consultora tecnológica para pymes y autónomos: inteligencia artificial, automatización de procesos, software a medida y desarrollo web. | Hacemos la web, la tienda online y la ficha de Google de tu negocio, y montamos a tu medida lo que va por debajo: automatizaciones, asistentes con IA y programas de gestión. | A45: una sola descripción en todo el sitio, la de la promesa (§3.1). A06, A01, A08 (A, presente); A22, A11, A28, A23 (B, «a tu medida»). Filtro 1: «pymes» y «consultora tecnológica» son jerga para un dueño de negocio. La pintan `description` y OG de todas las rutas sin metadatos propios, y el pie. | propuesta |
| * | `src/content/site.ts` | `site.ubicacion` | Carballo, A Coruña | (igual) | Dato del estudio (A40). | propuesta |
| * | `src/content/site.ts` | `site.email` | alvarot2601@gmail.com | (igual) | Correo de contacto (A44, correo directo). | propuesta |
| * | `src/content/site.ts` | `site.nav[0].label` | Servicios | (igual) | Interfaz: ancla `/#servicios`. | propuesta |
| * | `src/content/site.ts` | `site.nav[1].label` | Soluciones | (igual) | Ancla `/#soluciones`; la sección dice que son ejemplos (A15). | propuesta |
| * | `src/content/site.ts` | `site.nav[2].label` | Proyectos | Webs de ejemplo | Decisión 4: «Proyectos» sugiere trabajos de cliente (§3.2 regla 3, §3.5). A59. | propuesta |
| * | `src/content/site.ts` | `site.nav[3].label` | Herramientas | Productos | Decisión 6: el cliente compra el resultado (§3.4). Lo que queda en `/herramientas/` es nivel A (A01, A03, A29, A50). | propuesta |
| * | `src/content/site.ts` | `site.nav[4].label` | Proceso | (igual) | Interfaz: ancla `/#proceso`. | propuesta |
| * | `src/content/site.ts` | `site.nav[5].label` | Contacto | (igual) | Interfaz: ancla `/#contacto`. | propuesta |
| * | `src/content/site.ts` | `site.cta` | Solicitar diagnóstico | Pedir una propuesta | Nombre de la puerta 1 (P-11, recomendado). «Diagnóstico» queda solo para el diagnóstico rápido (CA-17). A30, A56. | propuesta |
| * | `src/app/layout.tsx` | `metadata.title` | {n} — IA, automatización y software a medida para pymes | {n} — Web, tienda online y automatización a medida | A45 (misma familia que la descripción). A06, A01 (A); A22 (B, «a medida»). Filtro 1: sin «pymes». `{n}` = `site.nombre`. | propuesta |
| * | `src/app/layout.tsx` | `metadata.description` | site.descripcion | (igual) | Sale de `site.descripcion` (fila de arriba): no se escribe aparte (A45). | propuesta |
| * | `src/app/layout.tsx` | `metadata.openGraph.title` | title: site.nombre | (igual) | Marca. | propuesta |
| * | `src/app/layout.tsx` | `metadata.openGraph.description` | site.descripcion | (igual) | Sale de `site.descripcion` (A45). | propuesta |
| * | `src/app/layout.tsx` | `metadata.openGraph.images[0].alt` | Logo de Undertactics: un iceberg con la línea de superficie en lima | (igual) | Accesibilidad: describe la imagen; `og.png` se regenera en P-07, fuera de esta spec. | propuesta |
| * | `src/app/layout.tsx` | `jsx · enlace para saltar` | Saltar al contenido | (igual) | Accesibilidad; no afirma nada. | propuesta |
| * | `src/components/layout/Nav.tsx` | `aria-label` del logo | {n}, inicio | (igual) | Accesibilidad. `{n}` = `site.nombre`. | propuesta |
| * | `src/components/layout/Nav.tsx` | `aria-label` del menú | Navegación principal | (igual) | Accesibilidad. | propuesta |
| * | `src/components/layout/Nav.tsx` | `jsx · botón del menú móvil` | Menú | (igual) | Interfaz. | propuesta |
| * | `src/components/layout/Nav.tsx` | `aria-label` del panel móvil | Menú de navegación | (igual) | Accesibilidad. | propuesta |
| * | `src/components/layout/Nav.tsx` | `jsx · cerrar el menú` | Cerrar | (igual) | Interfaz. | propuesta |
| * | `src/components/layout/Nav.tsx` | `aria-label` del menú móvil | Navegación móvil | (igual) | Accesibilidad. | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · botón bajo el logo` | Solicitar diagnóstico | Pedir una propuesta | El mismo botón que el menú (`site.cta`): nombre de la puerta 1 (P-11). CA-17. Mejor que lo lea de `site.cta` y no lo repita. | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · título de columna` | Contacto | (igual) | Interfaz. | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · título de columna` | Secciones | (igual) | Interfaz. | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · enlace a /plantillas/` | Las {n} plantillas | (igual) | A05: el número sale de `plantillas.length`. | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · enlace a /estudio/` | Quién hace esto | (igual) | A40. | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · enlace a /auditoria/` | Auditoría gratuita | Auditoría de tu negocio | Nombre de la puerta 3 (P-11). A34 corregida (D-035): sin «gratuita»; el precio se dice «no se cobra» donde se explica la auditoría. | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · enlace a /privacidad/` | Privacidad | (igual) | Obligatorio (A44). | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · título de columna` | Hora local | (igual) | A77: la hora sale del reloj. | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · derechos` | © {n} {n}. Todos los derechos reservados. | (igual) | A77: el año sale del reloj. | propuesta |
| * | `src/components/layout/Footer.tsx` | `jsx · aviso de ficticios` | Los negocios de las plantillas son ficticios. Diseñado y construido por {n}. | (igual) | A59 (D-007): obligatorio. | propuesta |
| * | `src/components/layout/AvisoCookies.tsx` | `aria-label` | Aviso sobre el almacenamiento en tu navegador | (igual) | Accesibilidad. | propuesta |
| * | `src/components/layout/AvisoCookies.tsx` | `jsx · texto del aviso` | Sin cookies de seguimiento: solo tu borrador y este aviso. | Sin cookies: tu navegador solo recuerda este aviso, la animación de entrada y, si empiezas la auditoría, tu borrador. | A93 corregida: el aviso contaba dos cosas y `/privacidad/` tres (borrador y aviso en `localStorage`, la cortina en `sessionStorage`). A94: no hay cookies de ningún tipo, así que sobra «de seguimiento». El borrador solo existe si se empieza la auditoría (filtro 4). | propuesta |
| * | `src/components/layout/AvisoCookies.tsx` | `jsx · enlace` | Detalle | (igual) | Lleva a `/privacidad/`. | propuesta |
| * | `src/components/layout/AvisoCookies.tsx` | `jsx · botón` | Entendido | (igual) | Interfaz. | propuesta |
| * | `src/components/ui/WorkImage.tsx` | `jsx · imagen que no carga` | Imagen no disponible | (igual) | Interfaz. | propuesta |
| * | `src/components/layout/Mando.tsx` | `aria-label` | Dos versiones de la misma web | (igual) | Solo sale con `?revision` (spec 002 §3.16): no llega al cliente. | propuesta |
| * | `src/components/layout/Mando.tsx` | `jsx · rótulo` | Versión | (igual) | Ídem. | propuesta |
| * | `src/components/layout/Mando.tsx` | `jsx · botón` | Por debajo | (igual) | Ídem. | propuesta |
| * | `src/components/layout/Mando.tsx` | `jsx · botón` | Sobria | (igual) | Ídem. | propuesta |

## /

La portada de la consultora entera, de arriba abajo. `page.tsx` no tiene
metadatos propios: usa los de `## *`. Van aquí también las filas de
`servicios.ts`, que en esta rama solo pinta la portada vigente pero que el
hero necesita (sus claves, `hero.test.ts`) y que §3.7 manda limpiar.

No se repiten aquí, porque se pintan también en otra ruta y van en su tabla
(parte 2): las tarjetas de plantilla de la banda A (`plantillas.ts`,
`ui/TarjetaPlantilla.tsx`, en `## /plantillas/`) y los `alt` de las capturas
de las bandas B y C (`herramientas.ts`, en `## /herramientas/`). Al revés: los
compromisos y la nota de la tienda (`estudio.ts`, `sections/Compromisos.tsx`)
y la tarjeta de persona (`ui/TarjetaPersona.tsx`) van aquí, y `/estudio/` los
cita sin repetirlos.

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| / | `src/content/portada.ts` | `cortePortada[inicio].cota` | Superficie | (igual) | Cota (D-014). | propuesta |
| / | `src/content/portada.ts` | `cortePortada[problemas].cota` | 0 · Lo que pasa | 0 · Lo que suele pasar | Filtro 4: las situaciones son habituales, no hechos sobre quien lee (§3.1). | propuesta |
| / | `src/content/portada.ts` | `cortePortada[servicios].cota` | −1 · Lo que montamos | (igual) | Cota. A06, A22. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[soluciones].cota` | −2 · Soluciones en acción | −2 · Soluciones de ejemplo | «En acción» da a entender que funcionan; son ejemplos de nivel B con datos inventados (A15, A12, A61). | propuesta |
| / | `src/content/portada.ts` | `cortePortada[proceso].cota` | −3 · El proceso | (igual) | Cota. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[plantillas].cota` | −4 · Proyectos y demostraciones | −4 · Webs de ejemplo | Decisión 4 y §3.5: «Proyectos» sugiere trabajos de cliente (§3.2 regla 3). A59. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[equipo].cota` | −5 · Quién está debajo | (igual) | Cota. A40. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[faq].cota` | −6 · Dudas | (igual) | Cota. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[contacto].cota` | Fondo · Contacto | (igual) | Cota. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[problemas].puerta` | (no hay) | Lo que va por debajo | Rótulo de puerta (§3.1, CA-15), decisión 5. Va en la `etiqueta` de `Seccion`. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[servicios].puerta` | (no hay) | Lo que va por debajo | Ídem. Sección mixta: ver decisión 5. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[soluciones].puerta` | (no hay) | Lo que va por debajo | Ídem. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[proceso].puerta` | (no hay) | Lo que va por debajo | Ídem. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[plantillas].puerta` | (no hay) | Lo que ve tu cliente | Ídem. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[equipo].puerta` | (no hay) | Lo que va por debajo | Ídem. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[faq].puerta` | (no hay) | Lo que va por debajo | Ídem. Sección mixta: ver decisión 5. | propuesta |
| / | `src/content/portada.ts` | `cortePortada[contacto].puerta` | (no hay) | Lo que va por debajo | Ídem. Sección mixta: ver decisión 5. | propuesta |
| / | `src/content/consultora.ts` | `hero.linea1` | Lo de arriba vende. | (igual) | Frase de D-014; no se toca (C-23). | propuesta |
| / | `src/content/consultora.ts` | `hero.linea2` | Lo de abajo | (igual) | Ídem. | propuesta |
| / | `src/content/consultora.ts` | `hero.linea2em` | trabaja. | (igual) | Ídem. | propuesta |
| / | `src/content/consultora.ts` | `hero.lema` | Consultoría de IA y automatización | Lo que ve tu cliente | Rótulo de puerta del hero (§3.1, CA-15, decisión 5), en el sitio del lema, junto a «Superficie». El lema era otra descripción del sitio (A45: una sola, la de `site.descripcion`). | propuesta |
| / | `src/content/consultora.ts` | `hero.parrafos[0]` | Arriba está lo que ve tu cliente: la web, el WhatsApp, la atención. Debajo, lo que lo hace funcionar: facturas, citas, avisos y datos que se mueven solos. | Montamos lo que se ve y lo que va debajo. Arriba, lo que ve tu cliente: la web, la tienda online y la ficha de Google de tu negocio. Debajo, lo que lo hace funcionar, montado a tu medida: automatizaciones, asistentes con IA y programas de gestión. | La promesa (§3.1). A06, A01, A08 (A); A22, A11, A28, A23 (B, «a tu medida»). Filtro 4: daba por hecho WhatsApp y atención (CA-9). Filtro 2: «facturas que se mueven solas» rozaba A16 (C). | propuesta |
| / | `src/content/consultora.ts` | `hero.parrafos[1]` | Primero miramos dónde se te van las horas. Luego montamos lo que te las devuelve, con los programas que ya usas y a tu nombre. | Primero nos cuentas qué quieres mejorar y miramos cómo trabajas. Luego te damos una propuesta por escrito, y cada fase se paga cuando la ves funcionando. | A56, A30 (procedimiento confirmado, D-035). Filtro 4: daba por hecho que el dolor es el tiempo y que hay programas (§3.1, CA-9). | propuesta |
| / | `src/content/consultora.ts` | `hero.especialidades[0]` | IA | Web | Por puertas: primero lo que ve tu cliente. A06. | propuesta |
| / | `src/content/consultora.ts` | `hero.especialidades[1]` | Automatización | Tienda online | A01 (nombre recomendado). | propuesta |
| / | `src/content/consultora.ts` | `hero.especialidades[2]` | Software a medida | Ficha de Google | A08. | propuesta |
| / | `src/content/consultora.ts` | `hero.especialidades[3]` | Desarrollo web | Automatización e IA | A22 (B), A11 (A). | propuesta |
| / | `src/content/consultora.ts` | `hero.especialidades[4]` | (no hay) | Software a medida | A23 (B: «a medida»). | propuesta |
| / | `src/content/consultora.ts` | `hero.ctaPrincipal` | Solicitar diagnóstico gratuito | Pedir una propuesta | Nombre de la puerta 1 (P-11). CA-17. A80 corregida: sin «gratuito». A30. | propuesta |
| / | `src/content/consultora.ts` | `hero.ctaSecundario` | Ver qué hay debajo | (igual) | Lleva a `#servicios` (concepto D-014). | propuesta |
| / | `src/components/sections/Hero.tsx` | `aria-label` de los objetos | Lo que ve tu cliente | (igual) | Es la puerta 1 (§3.1). | propuesta |
| / | `src/components/sections/Hero.tsx` | `aria-label` de las paradas | Debajo de {n} | (igual) | Accesibilidad. `{n}` = `rotuloCorto` del flujo. | propuesta |
| / | `src/components/sections/Hero.tsx` | `jsx · rótulo` | Ejemplo | (igual) | D-019, no se toca (§3.8). | propuesta |
| / | `src/components/sections/Hero.tsx` | `jsx · botón de pausa` | Pausar ejemplos | (igual) | D-019 (WCAG 2.2.2). | propuesta |
| / | `src/components/sections/Hero.tsx` | `jsx · botón de pausa, pulsado` | Seguir con los ejemplos | (igual) | Ídem. | propuesta |
| / | `src/components/sections/Hero.tsx` | `textoLectura` | Ejemplo: {n} | (igual) | Lo que leen los lectores de pantalla; lleva «Ejemplo» (D-019). | propuesta |
| / | `src/components/sections/Hero.tsx` | `aria-label` del tirador | Bajar la superficie para ver más instalación | (igual) | Interfaz del concepto (D-014). | propuesta |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[0]` | ¿Tenéis hueco el jueves por la tarde? | (igual) | Dentro del ejemplo del hero (D-019, CA-7). Da a entender A11 y A12. | propuesta |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[0].corto` | ¿Hueco el jueves? | (igual) | Forma corta de móvil (§6). | propuesta |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[1]` | Pagar · Bizum | (igual) | Ejemplo. A02 (Bizum es A). | propuesta |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[2]` | Reseña nueva | (igual) | Ejemplo. A08. | propuesta |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[3]` | Escríbenos | (igual) | Ejemplo. A29. | propuesta |
| / | `src/content/hero.ts` | `flujos[0].rotulo` | WhatsApp · 23:40 | (igual) | Ejemplo rotulado (D-019): la hora es del ejemplo, no una cifra (CA-8 la excluye con `data-ejemplo`). | propuesta |
| / | `src/content/hero.ts` | `flujos[0].rotulo.corto` | WhatsApp | (igual) | Forma corta (§6). | propuesta |
| / | `src/content/hero.ts` | `flujos[0].lectura[0]` | 23:40 · «¿Tenéis hueco el jueves?» | (igual) | Ejemplo (D-019). | propuesta |
| / | `src/content/hero.ts` | `flujos[0].lectura[1]` | contesta el agente | (igual) | Ejemplo: en presente dentro de la escena (§3.2, B). A12. | propuesta |
| / | `src/content/hero.ts` | `flujos[0].lectura[2]` | cita el jueves a las 17:30 | (igual) | Ejemplo. A61. | propuesta |
| / | `src/content/hero.ts` | `flujos[0].lectura[3]` | recordatorio la víspera. | (igual) | Ejemplo. A61. | propuesta |
| / | `src/content/hero.ts` | `flujos[0].paradas[0].texto` | Agente contesta | (igual) | Parada del ejemplo (servicio 05). A12 (B, dentro del ejemplo). | propuesta |
| / | `src/content/hero.ts` | `flujos[0].paradas[1].texto` | Cita en tu agenda | (igual) | Servicio 04, clave «citas». A61. | propuesta |
| / | `src/content/hero.ts` | `flujos[0].paradas[2].texto` | Recordatorio la víspera | (igual) | Servicio 04, clave «Recordatorios». A61. | propuesta |
| / | `src/content/hero.ts` | `flujos[1].rotulo` | Tu tienda | (igual) | A01. | propuesta |
| / | `src/content/hero.ts` | `flujos[1].rotulo.corto` | Tu tienda | (igual) | Forma corta (§6). | propuesta |
| / | `src/content/hero.ts` | `flujos[1].lectura[0]` | Pago con Bizum | (igual) | Ejemplo. A02. | propuesta |
| / | `src/content/hero.ts` | `flujos[1].lectura[1]` | factura emitida sola | pedido en tu panel | A16 es C: la tienda no emite facturas (§3.7). Decisión 1. A01. | propuesta |
| / | `src/content/hero.ts` | `flujos[1].lectura[2]` | aviso de qué reponer. | (igual) | Ejemplo. A01. | propuesta |
| / | `src/content/hero.ts` | `flujos[1].paradas[0].texto` | Cobro con tarjeta o Bizum | (igual) | Servicio 02, clave «Bizum». A02. | propuesta |
| / | `src/content/hero.ts` | `flujos[1].paradas[1].texto` | Factura emitida | Pedido en tu panel | A16 (C) sale (§3.7). Decisión 1. A01. | propuesta |
| / | `src/content/hero.ts` | `flujos[1].paradas[1].servicio` | 04 | 02 | Decisión 1: la parada nueva sale de «Tienda online». | propuesta |
| / | `src/content/hero.ts` | `flujos[1].paradas[1].clave` | facturas | Panel en el móvil | Decisión 1: la clave está en el `incluye` de `servicios.ts` 02 (`hero.test.ts`). | propuesta |
| / | `src/content/hero.ts` | `flujos[1].paradas[2].texto` | Aviso de qué reponer | (igual) | Servicio 02, clave «reponer». A01. | propuesta |
| / | `src/content/hero.ts` | `flujos[2].rotulo` | Google | (igual) | A08. | propuesta |
| / | `src/content/hero.ts` | `flujos[2].rotulo.corto` | Google | (igual) | Forma corta (§6). | propuesta |
| / | `src/content/hero.ts` | `flujos[2].lectura[0]` | Reseña de cinco estrellas | (igual) | Ejemplo: la cifra va dentro de `data-ejemplo` (CA-8). | propuesta |
| / | `src/content/hero.ts` | `flujos[2].lectura[1]` | respuesta con tu tono | (igual) | Ejemplo. A17 (B, dentro de la escena). | propuesta |
| / | `src/content/hero.ts` | `flujos[2].lectura[2]` | entra en el informe del mes. | (igual) | Ejemplo. A17, A22. | propuesta |
| / | `src/content/hero.ts` | `flujos[2].paradas[0].texto` | Respuesta a la reseña | (igual) | Servicio 06, clave «reseña». A17. | propuesta |
| / | `src/content/hero.ts` | `flujos[2].paradas[1].texto` | Ficha de Google al día | (igual) | Servicio 03, clave «Ficha de Google». A08 (a mano). | propuesta |
| / | `src/content/hero.ts` | `flujos[2].paradas[2].texto` | Informe del mes | (igual) | Servicio 04, clave «Informes». A22. | propuesta |
| / | `src/content/hero.ts` | `flujos[3].rotulo` | Tu web | (igual) | A06. | propuesta |
| / | `src/content/hero.ts` | `flujos[3].rotulo.corto` | Tu web | (igual) | Forma corta (§6). | propuesta |
| / | `src/content/hero.ts` | `flujos[3].lectura[0]` | La web vieja | (igual) | Ejemplo (rotulado, §3.1 lo admite). A06. | propuesta |
| / | `src/content/hero.ts` | `flujos[3].lectura[1]` | se rescata sin perder Google | (igual) | Ejemplo. A06 (rescate y 301). | propuesta |
| / | `src/content/hero.ts` | `flujos[3].lectura[2]` | y queda vigilada cada día. | y se cambia cuando lo pidas. | A19 es C (§3.7, CA-3). Decisión 1. A07. | propuesta |
| / | `src/content/hero.ts` | `flujos[3].paradas[0].texto` | Se saca la web vieja | (igual) | Servicio 01, clave «Rescate de webs viejas». A06. | propuesta |
| / | `src/content/hero.ts` | `flujos[3].paradas[1].texto` | Sin perder Google | (igual) | Servicio 01, clave «Redirecciones 301». A06. | propuesta |
| / | `src/content/hero.ts` | `flujos[3].paradas[2].texto` | Vigilada cada día | Cambios cuando los pidas | A19 (C) sale (§3.7). Decisión 1. A07. | propuesta |
| / | `src/content/hero.ts` | `flujos[3].paradas[2].clave` | Vigilancia de caídas | Cambios de contenido | Decisión 1: la clave sigue en el `incluye` de `servicios.ts` 07 (`hero.test.ts`). | propuesta |
| / | `src/content/servicios.ts` | `servicios[0].nombre` | Diseño y desarrollo web | (igual) | A06. | propuesta |
| / | `src/content/servicios.ts` | `servicios[0].descripcion` | Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Es tuya, se puede cambiar y no paga cuota a nadie por seguir existiendo. Y si ya tienes una en WordPress, Wix o Webnode que va lenta o a la que nadie tiene las claves, se saca de ahí sin perder lo que ya te posiciona en Google. | Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima, y a tu nombre. Y si ya tienes una en WordPress, Wix o Webnode que va lenta o a la que nadie tiene las claves, se saca de ahí sin perder lo que ya te posiciona en Google. | A06, A31. Sale «no paga cuota a nadie» (A33, C: condición) y «se puede cambiar» (A55, B: no hay editor para el cliente). | propuesta |
| / | `src/content/servicios.ts` | `servicios[0].incluye[0]` | Diseño propio | Diseño a medida | Decisión 3: sin «propio» en lo que se enseña (§3.4 regla 1). A06. | propuesta |
| / | `src/content/servicios.ts` | `servicios[0].incluye[1]` | Código sin constructores | (igual) | A06. | propuesta |
| / | `src/content/servicios.ts` | `servicios[0].incluye[2]` | Textos incluidos | (igual) | A24. | propuesta |
| / | `src/content/servicios.ts` | `servicios[0].incluye[3]` | Logotipo redibujado | (igual) | A24. | propuesta |
| / | `src/content/servicios.ts` | `servicios[0].incluye[4]` | Avisos legales | (igual) | A24 corregida: se redactan y se revisan contigo. | propuesta |
| / | `src/content/servicios.ts` | `servicios[0].incluye[5]` | Rescate de webs viejas | (igual) | A06. Clave del hero. | propuesta |
| / | `src/content/servicios.ts` | `servicios[0].incluye[6]` | Redirecciones 301 | (igual) | A06. Clave del hero; «301» es un código, no una cifra (no la pinta ninguna ruta de esta rama). | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].nombre` | Tienda online | (igual) | A01. Nombre recomendado (P-11). | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].descripcion` | Te la entregamos con el catálogo subido y cobrando desde el primer día. Después la llevas tú desde el móvil, y te dice qué reponer y qué se mira sin venderse. | Te la entregamos con el catálogo subido y cobrando desde el primer día. Después la llevas tú desde el móvil, y te avisa de qué reponer. | A25, A01. Sale «qué se mira sin venderse»: A26 sigue `por confirmar` (spec §3.3). | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].incluye[0]` | Catálogo cargado | (igual) | A25. | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].incluye[1]` | Tarjeta y Bizum | (igual) | A02. | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].incluye[2]` | Recogida y reparto local | Recogida en tienda | A02 corregida: la recogida es A; el reparto local es B (A64) y no va en lo que incluye. | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].incluye[3]` | Pedidos por WhatsApp | (quitar) | A64: B, nadie lo ha visto funcionar (D-035). | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].incluye[4]` | Panel en el móvil | (igual) | A01. Clave nueva del hero (decisión 1). | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].incluye[5]` | Instagram y Google Shopping | (quitar) | A53 corregida: B, conectarlo es trabajo a medida («podemos conectar», no «se sincroniza»). | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].incluye[6]` | Páginas legales | (igual) | A25. | propuesta |
| / | `src/content/servicios.ts` | `servicios[1].enlace.label` | Ver cómo funciona | (igual) | Lleva a `/herramientas/#tiendas` (A01). | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].nombre` | Aparecer en Google | (igual) | A08. | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].descripcion` | La mitad de los negocios de aquí se buscan por el móvil a dos calles de distancia. Eso se trabaja con la ficha de Google, las reseñas y una web que cargue rápido de verdad. | Que te encuentren en Google se trabaja a mano: con la ficha de Google, las reseñas y una web que cargue rápido de verdad. | A08 corregida (a mano), A09. Sale la cifra sin fuente (A71, §3.2 regla 4). | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].incluye[0]` | Ficha de Google | (igual) | A08. Clave del hero. | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].incluye[1]` | SEO local | (igual) | A08. | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].incluye[2]` | Reseñas | (igual) | A08. | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].incluye[3]` | Datos estructurados | (igual) | A09. | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].incluye[4]` | Core Web Vitals | (igual) | A09. | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].incluye[5]` | Medición sin cookies | (quitar) | A54 sigue `por confirmar` (spec §3.3). | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].enlace.href` | /herramientas/#ficha-google | (quitar) | §3.7: el enlace a la ficha de Google sale con su entrada (A20, C). Sale el enlace entero; su «Ver cómo funciona» se queda en el 02. | propuesta |
| / | `src/content/servicios.ts` | `servicios[2].enlace.label` | Ver cómo funciona | (quitar) | §3.7, A20 (C), CA-2: sale con su `href` (el enlace entero). | propuesta |
| / | `src/content/servicios.ts` | `servicios[3].nombre` | Automatización de procesos | (igual) | A22. | propuesta |
| / | `src/content/servicios.ts` | `servicios[3].descripcion` | Presupuestos, citas, recordatorios, facturas, informes. Lo que hoy copias de un sitio a otro a mano, funcionando solo mientras tú atiendes. | Presupuestos, citas, recordatorios, informes: si algo se copia a mano de un sitio a otro, podemos montar que funcione solo mientras tú atiendes. | A22 (B, «podemos montar»). Filtro 4: «lo que hoy copias» daba por hecho cómo trabaja. Salen «facturas» (A16, C). Sigue «citas», clave del hero. | propuesta |
| / | `src/content/servicios.ts` | `servicios[3].incluye[0]` | Reservas y citas | (igual) | A18, A61 (B, como sustantivo). | propuesta |
| / | `src/content/servicios.ts` | `servicios[3].incluye[1]` | Recordatorios | (igual) | A22. Clave del hero. | propuesta |
| / | `src/content/servicios.ts` | `servicios[3].incluye[2]` | Facturación | (quitar) | A16 (C): no se emiten facturas (§3.7). | propuesta |
| / | `src/content/servicios.ts` | `servicios[3].incluye[3]` | Conexión entre programas | (igual) | A22. | propuesta |
| / | `src/content/servicios.ts` | `servicios[3].incluye[4]` | Informes automáticos | (igual) | A22. Clave del hero. | propuesta |
| / | `src/content/servicios.ts` | `servicios[4].nombre` | Agentes y chatbots con IA | (igual) | A11, A12. | propuesta |
| / | `src/content/servicios.ts` | `servicios[4].descripcion` | Atención en la web, en WhatsApp y al teléfono. Contestan lo de siempre, cogen la cita y te pasan solo lo que de verdad necesita que estés tú. | Un asistente en tu web que contesta lo de siempre, coge la cita y te pasa lo que necesita que estés tú. Y, a tu medida, también en WhatsApp. | A11 (A, presente); A12 (B, «a tu medida»). Sale «al teléfono» (A14, C; §3.7). Sigue «WhatsApp», clave del hero. | propuesta |
| / | `src/content/servicios.ts` | `servicios[4].incluye[0]` | Web y WhatsApp | Web, y WhatsApp a medida | A11 (A), A12 (B: «a tu medida», §3.2 regla 1). Sigue conteniendo «WhatsApp» (clave del hero). | propuesta |
| / | `src/content/servicios.ts` | `servicios[4].incluye[1]` | Fuera de horario | (igual) | A11 («a cualquier hora»). | propuesta |
| / | `src/content/servicios.ts` | `servicios[4].incluye[2]` | Reserva de cita | (igual) | A11. | propuesta |
| / | `src/content/servicios.ts` | `servicios[4].incluye[3]` | Filtra y te avisa | (quitar) | A28: B, y en presente de producto (§3.2 regla 1). | propuesta |
| / | `src/content/servicios.ts` | `servicios[4].incluye[4]` | Habla como tu negocio | (quitar) | A28: B, y en presente de producto (§3.2 regla 1). | propuesta |
| / | `src/content/servicios.ts` | `servicios[5].nombre` | Marketing y contenido con IA | (igual) | A17. | propuesta |
| / | `src/content/servicios.ts` | `servicios[5].descripcion` | Lo que se puede dejar funcionando solo: el correo a tus clientes, las fichas de producto, los textos de la web y la respuesta a cada reseña que entra. | (igual) | A17 (B, ya en «se puede»), A24. | propuesta |
| / | `src/content/servicios.ts` | `servicios[5].incluye[0]` | Email a clientes | (igual) | A17. | propuesta |
| / | `src/content/servicios.ts` | `servicios[5].incluye[1]` | Fichas de producto | (igual) | A17. | propuesta |
| / | `src/content/servicios.ts` | `servicios[5].incluye[2]` | Respuesta a reseñas | (igual) | A17. Clave del hero. | propuesta |
| / | `src/content/servicios.ts` | `servicios[5].incluye[3]` | Textos de la web | (igual) | A24. | propuesta |
| / | `src/content/servicios.ts` | `servicios[5].incluye[4]` | Avisos automáticos | (igual) | A22. | propuesta |
| / | `src/content/servicios.ts` | `servicios[6].nombre` | Mantenimiento y soporte | (igual) | A07. | propuesta |
| / | `src/content/servicios.ts` | `servicios[6].descripcion` | Cambiar la carta, subir precios, abrir los domingos de verano. Se hace y ya está: sin abrir una incidencia, sin esperar tres semanas y sin que se caiga nada por el camino. | Cambiar la carta, subir precios, abrir los domingos de verano: nos lo dices y lo cambiamos. También hacemos las copias de seguridad y las actualizaciones. | A07. Salen el reclamo de condición (A33) y «tres semanas» (A71, cifra sin fuente). | propuesta |
| / | `src/content/servicios.ts` | `servicios[6].incluye[0]` | Cambios de contenido | (igual) | A07. Clave nueva del hero (decisión 1). | propuesta |
| / | `src/content/servicios.ts` | `servicios[6].incluye[1]` | Copias de seguridad | (igual) | A07. | propuesta |
| / | `src/content/servicios.ts` | `servicios[6].incluye[2]` | Actualizaciones | (igual) | A07. | propuesta |
| / | `src/content/servicios.ts` | `servicios[6].incluye[3]` | Vigilancia de caídas | (quitar) | A19 (C), §3.7, CA-2. | propuesta |
| / | `src/content/servicios.ts` | `servicios[6].incluye[4]` | Te lo llevas cuando quieras | Te lo llevas entero | A31 (procedimiento, D-035; salvo la tienda, A60). «Cuando quieras» es un reclamo de condición (A33, regla 2). | propuesta |
| / | `src/content/servicios.ts` | `servicios[6].enlace.href` | /herramientas/#vigilancia | (quitar) | A19 (C), §3.7, CA-2. Sale el enlace entero. | propuesta |
| / | `src/content/servicios.ts` | `servicios[6].enlace.label` | Ver cómo funciona | (quitar) | A19 (C), §3.7, CA-2: sale con su `href` (el enlace entero). | propuesta |
| / | `src/content/consultora.ts` | `problemas.titulo` | ¿Cuánto tiempo pierde tu negocio en tareas que podrían hacerse solas? | ¿Te pasa alguna de estas? | Filtro 4: daba por hecho que el dolor es el tiempo (§3.1, CA-9). Las situaciones van con «si…». | propuesta |
| / | `src/content/consultora.ts` | `problemas.items[0].titulo` | Copias datos de un programa a otro. | Si copias a mano lo mismo en varios sitios. | Filtro 4: como situación, con «si» (§3.1). | propuesta |
| / | `src/content/consultora.ts` | `problemas.items[0].texto` | Facturas, presupuestos, registros: el mismo dato escrito tres veces, a mano. | Facturas, presupuestos o registros: si el mismo dato se escribe a mano en varios sitios, se puede conectar para que se escriba solo. | A22 (B, «se puede»). Sale «tres veces» (A71, cifra sin fuente). | propuesta |
| / | `src/content/consultora.ts` | `problemas.items[1].titulo` | Los mensajes llegan cuando no puedes contestar. | Si te escriben cuando no puedes contestar. | Filtro 4 (§3.1). | propuesta |
| / | `src/content/consultora.ts` | `problemas.items[1].texto` | Consultas fuera de horario, WhatsApps sin responder y clientes que acaban en otro sitio. | Fuera de horario o con las manos ocupadas: un asistente en tu web puede contestar lo de siempre, recoger el contacto y pasarte lo demás. | A11 (A). Filtro 4: daba por hecho WhatsApp (CA-9). Sale «clientes que acaban en otro sitio», que no podemos citar. | propuesta |
| / | `src/content/consultora.ts` | `problemas.items[2].titulo` | Tus programas no se hablan entre ellos. | Si usas programas que no se hablan entre ellos. | Filtro 4: daba por hecho que hay programas (CA-9). | propuesta |
| / | `src/content/consultora.ts` | `problemas.items[2].texto` | El calendario por un lado, las facturas por otro y una hoja de cálculo en medio. | La agenda por un lado y las facturas por otro: se pueden conectar para que lo que entra en uno llegue al otro. | A22 (B, «se pueden»). Filtro 4: sale la hoja de cálculo dada por hecho (CA-9). | propuesta |
| / | `src/content/consultora.ts` | `problemas.cierre` | Eso es lo de abajo. Lo encontramos y lo montamos para que trabaje solo. | Eso es lo de abajo. Si te pasa alguna, miramos tu caso y te decimos qué se puede montar. | A56. «Lo montamos para que trabaje solo» prometía en presente lo que es B (A22). | propuesta |
| / | `src/components/consultora/Problemas.tsx` | `jsx · enlace del cierre` | Ver cómo | (igual) | Lleva a `#servicios`. | propuesta |
| / | `src/content/consultora.ts` | `servicios.titulo` | Cuatro líneas de trabajo. | (igual) | A76: sale de `consultora.servicios.lineas` (4). | propuesta |
| / | `src/content/consultora.ts` | `servicios.em` | Una parte se ve, otra trabaja debajo. | (igual) | Concepto (D-014). | propuesta |
| / | `src/content/consultora.ts` | `servicios.intro` | Cada línea tiene una parte que ve tu cliente y otra que trabaja por debajo. Se contratan por separado o juntas. | Cada línea tiene una parte que ve tu cliente y otra que trabaja por debajo. | Sale «Se contratan por separado o juntas»: es una condición sin fila en el Anexo (§3.2 reglas 2 y 6). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[0].nombre` | IA y automatización de procesos | (igual) | A22, A15. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[0].descripcion` | Lo que hoy copias de un sitio a otro a mano, funcionando solo mientras tú atiendes. Conectamos los programas que ya usas y metemos IA solo donde ahorra trabajo de verdad. | Si algo se hace a mano y se repite, podemos montar que funcione solo mientras tú atiendes: conectar los programas que uses y meter IA solo donde ahorre trabajo de verdad. | A22 (B, «podemos montar»). Filtro 4: «lo que hoy copias» y «los programas que ya usas» daban por hecho cómo trabaja. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[0].incluye[0]` | Facturas que se leen solas | Lectura de facturas | A15 (B): en presente de producto (§3.2 regla 1); pasa a sustantivo. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[0].incluye[1]` | Presupuestos en un clic | (igual) | A15 (B, como sustantivo). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[0].incluye[2]` | Programas conectados | (igual) | A22. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[0].incluye[3]` | Informes y avisos automáticos | (igual) | A22. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[0].enlace.label` | Ver ejemplos | (igual) | Lleva a `/#soluciones`, que son ejemplos (A15). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[1].nombre` | Agentes y asistentes con IA | (igual) | A11, A12. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[1].descripcion` | Contesta en tu web y en WhatsApp cuando tú no puedes, mira tus datos reales en vez de inventar y te pasa la conversación cuando no sabe. Hace solo lo que le dejes hacer. | Un asistente en tu web que contesta lo de siempre, recoge el contacto y te pasa la conversación cuando no sabe. Y, a tu medida, podemos montarlo también en WhatsApp, con tus datos reales y solo con lo que le dejes hacer. | A11 (A, presente); A12, A13, A28 (B, «podemos montarlo»). §3.2 regla 1: lo B no va en presente de producto. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[0]` | Asistente en tu web | (igual) | A11. Nombre recomendado (P-11). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[1]` | Agente de WhatsApp | (igual) | A12 (B, como sustantivo). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[2]` | Reservas y citas | (igual) | A11 (cita), A18 (B). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[3]` | Primer contacto con clientes | Primer contacto con clientes, a tu medida | A28 (B): se quitan «Filtra y te avisa» y «Habla como tu negocio» por la misma razón, así que este lleva «a tu medida» (§3.2 regla 1). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[4]` | Paso a una persona | (igual) | A11. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[1].enlace.label` | Ver un agente en acción | Ver un ejemplo | «En acción» da a entender que funciona; lleva a una maqueta «Ejemplo» (A12, B). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[2].nombre` | Software a medida | (igual) | A23. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[2].descripcion` | Cuando ningún programa encaja con cómo trabajas, lo escribimos para ti: un panel, una agenda o la gestión de pedidos, que llevas desde el móvil. El código, en un repositorio a tu nombre. | Si ningún programa encaja con cómo trabajas, podemos escribirlo para ti: un panel, una agenda o la gestión de pedidos, para llevarlo desde el móvil. El código queda en un repositorio a tu nombre. | A23 (B, «podemos»), A31 (procedimiento, D-035). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[2].incluye[0]` | Paneles de gestión | (igual) | A23. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[2].incluye[1]` | Pedidos e inventario | (igual) | A23. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[2].incluye[2]` | Reservas y agenda | (igual) | A23. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[2].incluye[3]` | Conexión con lo que ya tienes | (igual) | A23. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[2].enlace.label` | Ver nuestro software | (quitar) | Llevaba a la tienda (`/herramientas/#tiendas`), que no es software a medida (A23). Sale el enlace entero. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[3].nombre` | Web y tienda online | (igual) | A06, A01. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[3].descripcion` | Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Rápida, tuya y preparada para que te encuentren en Google a dos calles de distancia. | Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Rápida, a tu nombre y preparada para que te encuentren en Google. Y si quieres vender por internet, la tienda online. | A06, A09, A08, A31, A01. Sale «a dos calles de distancia» (A71, cifra sin fuente). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[0]` | Diseño propio, sin constructores | Diseño a medida, sin constructores | Decisión 3: sin «propio» (§3.4 regla 1). A06. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[1]` | Tienda online | (igual) | A01. Nombre recomendado (P-11). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[2]` | Ficha de Google y SEO local | (igual) | A08 (a mano). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[3]` | Formularios y reservas | Formulario de contacto | A29 (nombre recomendado, P-11). Las reservas van aparte: son B (A18) y no se mezclan con un A en la misma etiqueta (§3.2 regla 1). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[5]` | (no hay) | Reservas a tu medida | A18 (B, «a tu medida»): puerta 1 (§3.1). | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[4]` | Mantenimiento | (igual) | A07. | propuesta |
| / | `src/content/consultora.ts` | `servicios.lineas[3].enlace.label` | Ver plantillas | (igual) | Lleva a `/plantillas/` (A57). | propuesta |
| / | `src/components/sections/Servicios.tsx` | `aria-label` de las paradas | Lo que incluye {n} | (igual) | Accesibilidad. `{n}` = nombre de la línea. | propuesta |
| / | `src/content/consultora.ts` | `soluciones.titulo` | Tecnología aplicada | (igual) | Titular: no afirma nada; lo que enseña la sección es B y va como ejemplo (A15). | propuesta |
| / | `src/content/consultora.ts` | `soluciones.em` | a problemas reales. | a problemas habituales. | «Reales» sugiere casos de clientes; son ejemplos con datos inventados (A15, A59; §3.2 regla 3). | propuesta |
| / | `src/content/consultora.ts` | `soluciones.intro` | Descubre algunas de las soluciones que podemos construir para tu negocio. | (igual) | B en condicional («podemos construir»). A15, A12, A61. | propuesta |
| / | `src/components/consultora/Soluciones.tsx` | `jsx · rótulo del aviso` | Aviso | (igual) | Interfaz. | propuesta |
| / | `src/content/consultora.ts` | `soluciones.aviso` | Son ejemplos de lo que se puede montar, con datos inventados. No son clientes ni resultados medidos. | (igual) | A15, A59 (§3.2 regla 3). | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[0].titulo` | Contesta aunque estés con otro cliente | Que se conteste aunque estés con otro cliente | Fuera de la maqueta, B no va en presente de producto (§3.2 regla 1): pasa a lo que se busca. A11, A12. | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[0].texto` | Un agente en tu web y en WhatsApp que responde lo de siempre, recoge los datos y te deja la consulta ordenada. | Un asistente en tu web, y si lo quieres también en WhatsApp, que responda lo de siempre, recoja los datos y te deje la consulta ordenada. | A11 (web, A); A12 (WhatsApp, B, «si lo quieres»). Subjuntivo: es lo que podemos montar, no un producto. | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[0].ideal` | Para alojamientos, clínicas y empresas de servicios. | (igual) | Sectores de D-006. | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[1].titulo` | La factura llega y se apunta sola | Que la factura se apunte sola | §3.2 regla 1. A15 (B). | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[1].texto` | Lee la factura, saca proveedor, fecha e importe, y la deja clasificada donde la busca tu gestoría. | Podemos montar que se lea cada factura que te llega, se saquen proveedor, fecha e importe y quede clasificada donde la necesites. | A15 (B, «podemos montar»). Filtro 4: daba por hecho que hay gestoría. | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[1].ideal` | Para asesorías, comercios y pymes. | Para asesorías, comercios y negocios pequeños. | Filtro 1: «pymes» es jerga para el comprador (§3.1). | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[2].titulo` | Las cuentas, con un audio | (igual) | A15 (B), sin verbo en presente. | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[2].texto` | Dices «vendí tres cajas a 40 euros» en un mensaje de voz y queda apuntado. Luego lo preguntas igual. | Podemos montar que digas lo que has vendido en un mensaje de voz y quede apuntado, y que luego lo preguntes igual. | A15 (B, «podemos montar»). Sale la cifra de ejemplo fuera de la maqueta (A78; no cuadraba con la maqueta, que dice otra venta). | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[2].ideal` | Para autónomos y pequeños negocios. | (igual) | Comprador (§3.1). | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[3].titulo` | Citas que se piden y se recuerdan solas | Que las citas se pidan y se recuerden solas | §3.2 regla 1. A61 (B). | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[3].texto` | El cliente ve los huecos libres, reserva, recibe la confirmación y un recordatorio el día antes. | Podemos montar una agenda en la que tu cliente vea los huecos libres y reserve, y que le mande la confirmación y un recordatorio el día antes. | A61 (B, «podemos montar»). | propuesta |
| / | `src/content/consultora.ts` | `soluciones.casos[3].ideal` | Para clínicas, alojamientos y empresas de servicios. | (igual) | Sectores de D-006. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Marco` · rótulo | Ejemplo | (igual) | D-019, no se toca (§3.8). | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Marco` · `aria-label` | Ejemplo: {n} | (igual) | Lleva «Ejemplo» (D-019). `{n}` = la `descripcion` de cada maqueta. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · `titulo` | WhatsApp · 23:40 | (igual) | Dentro de la maqueta «Ejemplo»: B en presente dentro de la escena (§3.2). A12. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · `descripcion` | una clienta pregunta por un hueco el jueves y el agente le ofrece dos horas, reserva la que elige y crea la cita en la agenda. | (igual) | Ejemplo (D-019). A12, A61. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · mensaje 1 | ¿Tenéis hueco el jueves por la tarde? | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · mensaje 2 | Sí: el jueves tengo libre a las 17:30 y a las 18:15. ¿Cuál te va mejor? | (igual) | Ejemplo: las horas van dentro de `data-ejemplo` (CA-8). | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · mensaje 3 | A las 17:30 | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · mensaje 4 | Reservado. Te escribo la víspera para recordártelo. | (igual) | Ejemplo. A61. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · estado | Cita creada en la agenda · jueves 17:30 | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · `titulo` | Facturas · bandeja de entrada | (igual) | Ejemplo. A15. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · `descripcion` | una factura en PDF de la que se extraen proveedor, fecha, base, IVA y total, y se clasifica como suministros pendiente de revisar. | (igual) | Ejemplo. A15 (leer y clasificar, no emitir: A16). | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Proveedor | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | Suministros Ejemplo, S.L. | (igual) | Ejemplo: empresa inventada (A59). | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Fecha | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | 14/03/2026 | (igual) | Ejemplo (CA-8 lo excluye). | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Base · IVA 21 % | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | 100,00 € · 21,00 € | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Total | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | 121,00 € | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Categoría | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | Suministros | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · marca | Pendiente de revisar | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · `titulo` | Nota de voz | (igual) | Ejemplo. A15. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · `descripcion` | un mensaje de voz de un autónomo se transcribe y se registra como una venta de 120 euros en efectivo. | (igual) | Ejemplo. A15. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · transcripción | «Hoy, tres entradas, ciento veinte euros, en efectivo.» | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · registro | Venta | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · registro | 3 uds. | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · registro | 120,00 € | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · registro | Efectivo | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · consulta | «¿Cuánto llevo vendido esta semana?» | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · respuesta | → lo lee de tu registro | (igual) | Ejemplo. A13 (B, dentro de la escena). | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · `titulo` | Agenda · semana | (igual) | Ejemplo. A61. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · `descripcion` | una agenda semanal con huecos libres y ocupados, una solicitud nueva el jueves y la confirmación con recordatorio enviada. | (igual) | Ejemplo. A61. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · días | "L", "M", "X", "J", "V" | (igual) | Ejemplo: los días de la agenda, tal cual están en `dias`. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · aviso 1 | Solicitud nueva · jueves, 2.º hueco | (igual) | Ejemplo. | propuesta |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · aviso 2 | Confirmada y recordatorio enviado | (igual) | Ejemplo. A61. | propuesta |
| / | `src/components/sections/Proceso.tsx` | `Titular` · `arriba` | Un sondeo, | (igual) | Concepto (D-014). | propuesta |
| / | `src/components/sections/Proceso.tsx` | `Titular` · `em` | de la superficie al fondo. | (igual) | Ídem. | propuesta |
| / | `src/components/sections/Proceso.tsx` | `caption` | El proceso, paso a paso: lo que ves tú y lo que hacemos por debajo | (igual) | Accesibilidad. | propuesta |
| / | `src/components/sections/Proceso.tsx` | `th` | Paso | (igual) | Interfaz. | propuesta |
| / | `src/components/sections/Proceso.tsx` | `th` | Lo que ves tú | (igual) | Interfaz (puertas, §3.1). | propuesta |
| / | `src/components/sections/Proceso.tsx` | `th` | Lo que hacemos por debajo | (igual) | Ídem. | propuesta |
| / | `src/components/sections/Proceso.tsx` | `th` | Dato | (igual) | Interfaz. | propuesta |
| / | `src/content/proceso.ts` | `proceso[0].titulo` | Nos cuentas | (igual) | A56. | propuesta |
| / | `src/content/proceso.ts` | `proceso[0].descripcion` | Cinco minutos de formulario, con tus palabras: a qué te dedicas y qué te gustaría quitarte de encima. Lo que no sepas, déjalo en blanco. | Un formulario corto, con tus palabras: a qué te dedicas y qué te gustaría mejorar. | A35: «cinco minutos» sale hasta cronometrarlo (D-035). «Déjalo en blanco» no es verdad en el formulario corto, que pide todos los campos menos el teléfono. «Mejorar», como el formulario (CA-11). | propuesta |
| / | `src/content/proceso.ts` | `proceso[0].dato` | 5 min | con tus palabras | A35 (C hasta cronometrar). `portada.test.ts` pasa a este dato (T07). | propuesta |
| / | `src/content/proceso.ts` | `proceso[0].vesTu` | Un formulario corto | (igual) | A56. | propuesta |
| / | `src/content/proceso.ts` | `proceso[0].debajo` | Leemos lo que nos cuentas y preparamos las preguntas | (igual) | A56. | propuesta |
| / | `src/content/proceso.ts` | `proceso[1].titulo` | Miramos | (igual) | A56. | propuesta |
| / | `src/content/proceso.ts` | `proceso[1].descripcion` | Hablamos contigo y vemos cómo trabajas: qué programas usas, qué se hace a mano y dónde se van las horas cada semana, en horas y en euros. | Hablamos contigo y vemos cómo trabajas: qué usas, qué se hace a mano y qué te gustaría que funcionara de otra manera. | A56. Filtro 4: daba por hecho programas y horas perdidas (§3.1). Sale «en horas y en euros»: A36 sigue `por confirmar`. | propuesta |
| / | `src/content/proceso.ts` | `proceso[1].dato` | horas y euros | cómo trabajas | A36 `por confirmar`. `portada.test.ts` pasa a este dato (T07). | propuesta |
| / | `src/content/proceso.ts` | `proceso[1].vesTu` | Una conversación, y sigues con lo tuyo | (igual) | A39, A56. | propuesta |
| / | `src/content/proceso.ts` | `proceso[1].debajo` | Tus procesos por dentro: programas, datos y tareas a mano | (igual) | A56: es lo que miramos, no lo que das por hecho. | propuesta |
| / | `src/content/proceso.ts` | `proceso[2].titulo` | Te lo contamos | (igual) | A56. | propuesta |
| / | `src/content/proceso.ts` | `proceso[2].descripcion` | El diagnóstico es tuyo, gratis y sin compromiso: qué montaríamos, en qué orden y por cuánto, por escrito. Si con eso te apañas solo, perfecto. | La propuesta, por escrito: qué montaríamos, en qué orden y cuánto cuesta cada fase. No se cobra, y es tuya: si con ella te apañas solo, perfecto. | Nombre de la puerta 1 (P-11), CA-17. A30; A80 corregida («no se cobra», sin «gratis»); sale «sin compromiso» (A33). | propuesta |
| / | `src/content/proceso.ts` | `proceso[2].dato` | gratis | por escrito | D-035: sin «gratis». A30. `portada.test.ts` pasa a este dato (T07). | propuesta |
| / | `src/content/proceso.ts` | `proceso[2].vesTu` | El diagnóstico, tuyo | La propuesta, tuya | Nombre de la puerta 1 (P-11), CA-17. A30. | propuesta |
| / | `src/content/proceso.ts` | `proceso[2].debajo` | Qué montaríamos, en qué orden y por cuánto | (igual) | A30. | propuesta |
| / | `src/content/proceso.ts` | `proceso[3].titulo` | Construimos | (igual) | A37. | propuesta |
| / | `src/content/proceso.ts` | `proceso[3].descripcion` | Por fases, empezando por lo que más horas te quita. Lo primero que funciona llega en semanas y el resto se va sumando, con el precio de cada fase por escrito antes de empezarla. | Por fases, empezando por lo que más te importa. Lo primero que funciona llega en semanas y el resto se va sumando, con el precio de cada fase por escrito antes de empezarla. | A37, A30 (procedimiento, D-035). Filtro 4: daba por hecho que el dolor son las horas (§3.1). | propuesta |
| / | `src/content/proceso.ts` | `proceso[3].dato` | por fases | (igual) | A37. | propuesta |
| / | `src/content/proceso.ts` | `proceso[3].vesTu` | Lo primero, funcionando en semanas | (igual) | A37. | propuesta |
| / | `src/content/proceso.ts` | `proceso[3].debajo` | Conectamos tus programas y montamos la primera fase | Montamos la primera fase | Filtro 4: daba por hecho que hay programas. A37. | propuesta |
| / | `src/content/proceso.ts` | `proceso[4].titulo` | Lo ves funcionando | (igual) | A30. | propuesta |
| / | `src/content/proceso.ts` | `proceso[4].descripcion` | Cada fase la pruebas con tus datos de verdad antes de pagarla. Si no hace lo que esperabas, se ajusta antes de seguir. | (igual) | A30, A39 (procedimiento, D-035). `/estudio/` lo repite (`comoTrabajamos[2]`). | propuesta |
| / | `src/content/proceso.ts` | `proceso[4].dato` | antes de cada pago | (igual) | A30. | propuesta |
| / | `src/content/proceso.ts` | `proceso[4].vesTu` | Lo pruebas con tus datos | (igual) | A30. | propuesta |
| / | `src/content/proceso.ts` | `proceso[4].debajo` | Pruebas, registro de lo que hace y límites a la IA | Pruebas y, si lleva IA, registro de lo que hace y límites | A13 (B): solo cuando se monta con IA; en condicional. | propuesta |
| / | `src/content/proceso.ts` | `proceso[5].titulo` | Lo mantenemos | (igual) | A07. | propuesta |
| / | `src/content/proceso.ts` | `proceso[5].descripcion` | Sigue funcionando, se actualiza y crece contigo. Y como todo está a tu nombre, si un día te vas, te lo llevas entero. | Sigue funcionando, se actualiza y crece contigo. Y como está a tu nombre, si un día te vas, te lo llevas entero. La tienda online es la excepción: va sobre nuestra plataforma, y su código no es tuyo. | A07; A31 corregida (salvo la tienda); A60. «Todo» no era verdad para la tienda. | propuesta |
| / | `src/content/proceso.ts` | `proceso[5].dato` | a tu nombre | (igual) | A31. | propuesta |
| / | `src/content/proceso.ts` | `proceso[5].vesTu` | Crece contigo | (igual) | A07. | propuesta |
| / | `src/content/proceso.ts` | `proceso[5].debajo` | Copias, actualizaciones y vigilancia de caídas | Copias, actualizaciones y cambios de contenido | A19 (C) sale (§3.7, CA-2). A07. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.titulo` | Ideas que se convierten | Webs de ejemplo por sector | §3.5 (el recomendado) y decisión 4. A57, A59. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.em` | en soluciones. | y lo que ya funciona. | Decisión 4: cubre también las bandas B y C, que son nivel A (A01, A03, A29, A50). | propuesta |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · rótulo del aviso` | Aviso | (igual) | Interfaz. El aviso va dentro de la misma `<section>` (§3.5, CA-6) y no en letra menor: hoy lleva `text-sm` (lo cambia T07). | propuesta |
| / | `src/content/consultora.ts` | `proyectos.aviso` | Nada de esto es un trabajo de cliente. Las plantillas son webs de negocios inventados y las herramientas son software propio del estudio, que se enseña funcionando con datos de ejemplo. | Nada de esto es trabajo para un cliente. Los negocios de estas webs son inventados, y la tienda, el informe y el formulario los hemos construido nosotros y se enseñan con datos de ejemplo. | A59 (D-007, §3.5), A50 corregida («lo construimos nosotros», solo para piezas A: A01, A03, A29). Sale «software propio» (CA-1, §3.8). | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].titulo` | Webs y ecommerce | Plantillas por sector | §3.5. Filtro 1: «ecommerce» es jerga; la tienda tiene su banda (C). A57. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].intro` | Plantillas de web terminadas, con contenido de verdad, para ver cómo queda un negocio de tu sector. | Webs terminadas de negocios inventados, con todo su contenido, para ver cómo quedaría la de tu negocio. | A57, A59: «contenido de verdad» al lado de negocios inventados se lee como si fueran reales (§3.5). | propuesta |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · botón de la banda A` | Ver las {n} plantillas | (igual) | A05: el número sale de `plantillas.length`. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].items[0].nombre` | Formularios de contacto propios | Formulario de contacto | Nombre recomendado (P-11); sin «propios» (§3.4 regla 1). A29. Pasa a la banda B (decisión 2). | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].items[0].texto` | Los mensajes de tu web te llegan a ti, sin un formulario de otra empresa incrustado. | Recibe y guarda cada mensaje de tu web, sin el formulario de otra empresa incrustado, esté donde esté tu web. | A29. «Te llegan a ti» daba a entender el aviso por correo, que es C (A04). | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].items[0].etiqueta` | Herramienta propia | Formulario | §3.4 regla 3: la etiqueta dice el tipo de cosa (CA-1). A29. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].titulo` | Automatizaciones e inteligencia artificial | Para la web que ya tienes | Decisión 2. §3.7: con una sola entrada (el informe), el título prometía lo que no hay. A03, A29. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].intro` | Lo que ya funciona por debajo: informes con pruebas, vigilancia diaria y comprobaciones automáticas. | Funcionan hoy: el informe mide la web que tú nos digas, y el formulario recibe y guarda los mensajes esté donde esté alojada tu web. | A03, A29 («esté donde esté alojada la web»); nada del Anexo dice que sirvan en una web que no hayamos hecho nosotros (§3.2 regla 6). Salen «vigilancia diaria» y «comprobaciones automáticas» (A19, C; §3.7). | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[0].nombre` | Informe de mejoras de tu web | (igual) | A03. Nombre recomendado (P-11). | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[0].texto` | Mide, lee y ordena los fallos de tu web por prioridad, cada uno con su prueba. | Mide tu web, lee sus textos y ordena los fallos por prioridad, cada fallo con su prueba. | A03. Filtro 1: «mide, lee y ordena» sin objeto no se entendía. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[0].etiqueta` | Herramienta propia | Informe | §3.4 regla 3 (CA-1). A03. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[1].nombre` | Vigilancia diaria | (quitar) | A19 (C), §3.7, CA-2. Sale la entrada entera (nombre, texto, enlace y etiqueta). | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[1].texto` | Si tu web se cae o caduca algo, nos enteramos nosotros antes que tus clientes. | (quitar) | A19 (C), §3.7. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[1].href` | /herramientas/#vigilancia | (quitar) | A19 (C), §3.7, CA-2. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[2].nombre` | Auditoría de la ficha de Google | (quitar) | A20 (C), §3.7, CA-2, CA-3. Sale la entrada entera. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[2].texto` | Compara lo que dice Google de tu negocio con lo que dice tu web. | (quitar) | A20 (C), §3.7. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[2].href` | /herramientas/#ficha-google | (quitar) | A20 (C), §3.7, CA-2. | propuesta |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · pie de la captura del informe` | Informe de ejemplo sobre una plantilla | (igual) | A03 (el que se enseña es sobre una plantilla), A59. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].titulo` | Software y aplicaciones | Para vender por internet | A23: la tienda no es software a medida, y «software y aplicaciones» lo daba a entender. A01. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].intro` | Una plataforma completa con panel de gestión pensado para llevarla desde el móvil. | Una tienda en tu dominio, que cobra con tarjeta y Bizum y que llevas desde el móvil. | A01, A02 corregida, A60 (el dominio es tuyo). Filtro 1: «plataforma» y «panel de gestión» son jerga. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].items[0].nombre` | Plataforma de tiendas | Tienda online | Nombre recomendado (P-11). A01. | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].items[0].texto` | Catálogo, cobro y envíos listos el primer día, y un panel que avisa de qué reponer. | Catálogo, cobro y recogida en tienda listos el primer día, y un panel que avisa de qué reponer. | A01, A25, A02 corregida: «envíos» cubría el reparto local, que es B (A64). | propuesta |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].items[0].etiqueta` | Software propio | Tienda | §3.4 regla 3 (CA-1). A01. | propuesta |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · enlace de cada fila` | Ver | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · pie de la tienda` | Tienda de ejemplo (una papelería inventada) con pedidos y productos de prueba. | (igual) | A01, A59. | propuesta |
| / | `src/content/consultora.ts` | `quien.titulo` | Dos personas, | (igual) | A40, A76 (fuente: `estudio.ts`, 2 personas). | propuesta |
| / | `src/content/consultora.ts` | `quien.em` | sin intermediarios. | (igual) | A40. | propuesta |
| / | `src/content/consultora.ts` | `quien.texto` | Somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien monta tu automatización, escribe el código o graba tu vídeo. | Somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien hace el trabajo. | A40. Sale «graba tu vídeo» (A21, C: el vídeo no es un servicio). Lo leen ellos antes de publicarlo (A40, spec §5). | propuesta |
| / | `src/content/consultora.ts` | `quien.personas.Álvaro.rol` | Desarrollo, IA y automatización | Web, código y automatización | Decisión 8: el mismo rol que en `/estudio/` (`estudio.ts`). A40: lo confirma Álvaro. | propuesta |
| / | `src/content/consultora.ts` | `quien.personas.Álvaro.texto` | Diseño y desarrollo de webs, aplicaciones y sistemas empresariales. Especializado en conectar tecnología, automatizar procesos y construir soluciones adaptadas a cada negocio. | Diseña y programa las webs y las tiendas, y monta las automatizaciones con IA que se encargan a medida. Si algo del código no te encaja, se lo dices a él. | Decisión 8: un texto por persona; la parte 2 lo repite en `/estudio/`. A40, A06, A01, A22 (B: «que se encargan a medida», por encargo y no como producto, §3.2 regla 1). A40 solo confirma el rol de Yanin: el de Álvaro lo confirma él al leerlo. Filtro 1: «sistemas empresariales» es jerga. Sale «y se cambia» de `/estudio/` (A51, B). Lo lee Álvaro antes de publicarlo. | propuesta |
| / | `src/content/consultora.ts` | `quien.personas.Yanin.rol` | Diseño y contenido audiovisual | Foto, vídeo y redes | A40 corregida (D-035). | propuesta |
| / | `src/content/consultora.ts` | `quien.personas.Yanin.texto` | Fotografía, vídeo y creación de contenido visual para ayudar a las marcas a comunicar mejor y mejorar su presencia digital. | Hace y edita las fotos y los vídeos del estudio. | A40 (rol «Foto, vídeo y redes»). Decisión 8: un texto por persona. Sale el vídeo como servicio para marcas (A21, C), y salen «trabaja con IA» y «lo que mejor se le da»: no tienen fila en el Anexo (§3.2 regla 6). Lo lee Yanin antes de publicarlo (A40). | propuesta |
| / | `src/components/consultora/QuienEstudio.tsx` | `jsx · enlace` | Cómo trabajamos | (igual) | Lleva a `/estudio/`. | propuesta |
| / | `src/components/ui/TarjetaPersona.tsx` | `alt` provisional | Silueta provisional en lugar del retrato de {n} | (igual) | A40 (las fotos son siluetas provisionales). `/estudio/` la cita. | propuesta |
| / | `src/components/ui/TarjetaPersona.tsx` | `alt` definitivo | Retrato de {n} | (igual) | Para cuando lleguen los retratos (A40). | propuesta |
| / | `src/components/sections/Compromisos.tsx` | `Titular` · `arriba` | Lo que construimos, lo manejas tú. | (igual) | A31 (procedimiento, D-035). | propuesta |
| / | `src/content/estudio.ts` | `compromisos[0].titulo` | Abres el código cuando quieras. | (igual) | A31. | propuesta |
| / | `src/content/estudio.ts` | `compromisos[0].texto` | Vive en un repositorio a tu nombre desde el primer día. Lo puedes leer, copiar o enseñárselo a otro programador. | (igual) | A31. | propuesta |
| / | `src/content/estudio.ts` | `compromisos[1].titulo` | Entras en todo con tus claves. | (igual) | A31. | propuesta |
| / | `src/content/estudio.ts` | `compromisos[1].texto` | El dominio, el alojamiento, el correo y las cuentas de Google y de pagos están a tu nombre. Nosotros entramos con el acceso que nos des. | (igual) | A31 (la excepción de la tienda la dice la nota). | propuesta |
| / | `src/content/estudio.ts` | `compromisos[2].titulo` | Te lo llevas entero. | (igual) | A31. | propuesta |
| / | `src/content/estudio.ts` | `compromisos[2].texto` | Le pasas el repositorio y las claves a quien elijas, y esa persona sigue desde donde lo dejamos, sin rehacer nada. | (igual) | A31. | propuesta |
| / | `src/content/estudio.ts` | `notaCompromisos` | La tienda online va sobre nuestra plataforma, que es compartida: ahí el dominio es tuyo, el código de la plataforma no. | La tienda online va sobre nuestra plataforma, que es compartida: ahí el dominio es tuyo y el código de la plataforma no, y la plataforma cobra comisión por venta. | A60 (D-035): la comisión se dice como procedimiento, sin cifra. | propuesta |
| / | `src/content/consultora.ts` | `faq.titulo` | Preguntas | (igual) | Titular. | propuesta |
| / | `src/content/consultora.ts` | `faq.em` | frecuentes. | (igual) | Titular. | propuesta |
| / | `src/components/consultora/Faq.tsx` | `jsx · entradilla` | ¿Tu duda no está aquí? | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/Faq.tsx` | `jsx · enlace` | Cuéntanosla | (igual) | Lleva a `#contacto`. | propuesta |
| / | `src/content/consultora.ts` | `faq.items[0].pregunta` | ¿Necesito cambiar los programas que ya utilizo? | (igual) | Es la pregunta que se hace el lector; la respuesta va con «si» (filtro 4). A22. | propuesta |
| / | `src/content/consultora.ts` | `faq.items[0].respuesta[0]` | En general, no. Lo normal es conectar lo que ya usas: el correo, el calendario, las hojas de cálculo, tu programa de facturación o tu CRM. | En general, no. Si usas correo, calendario, hojas de cálculo, un programa de facturación o un CRM, lo normal es conectarlo a lo que montemos. | A22 (B, «lo que montemos»). Filtro 4: con «si», sin dar por hecho qué usa. | propuesta |
| / | `src/content/consultora.ts` | `faq.items[0].respuesta[1]` | Si alguna herramienta no se puede conectar, te lo decimos en el diagnóstico y te proponemos una alternativa. No cambiamos nada sin que lo decidas tú. | Si algún programa no se puede conectar, te lo decimos en la propuesta y te proponemos otra cosa. No cambiamos nada sin que lo decidas tú. | A39 (procedimiento, D-035). Nombre de la puerta 1 (P-11): «diagnóstico» queda para el diagnóstico rápido (CA-17). | propuesta |
| / | `src/content/consultora.ts` | `faq.items[1].pregunta` | ¿Necesito conocimientos técnicos? | (igual) | Pregunta del lector; la respuesta es A56. | propuesta |
| / | `src/content/consultora.ts` | `faq.items[1].respuesta[0]` | No. La parte técnica la hacemos nosotros. Al ponerlo en marcha te enseñamos a utilizarlo, y debería resultarte tan cotidiano como mandar un mensaje o abrir una hoja de cálculo. | No. La parte técnica la hacemos nosotros. Al ponerlo en marcha te enseñamos a usarlo, y debería resultarte tan cotidiano como mandar un mensaje. | A56. Filtro 4: sale la hoja de cálculo dada por hecho (CA-9). | propuesta |
| / | `src/content/consultora.ts` | `faq.items[2].pregunta` | ¿Cuánto cuesta implementar una solución de IA? | ¿Cuánto cuesta? | La pregunta vale para las dos puertas, no solo para la IA (§3.1). Filtro 1: «implementar una solución» es jerga. | propuesta |
| / | `src/content/consultora.ts` | `faq.items[2].respuesta[0]` | Depende de lo que haya que construir: una automatización concreta no es lo mismo que una aplicación de gestión. Por eso no publicamos una tabla de precios. | Depende de lo que haya que montar: una web no es lo mismo que una aplicación de gestión. Por eso no publicamos una tabla de precios. | A30. Con un ejemplo de cada puerta (§3.1). | propuesta |
| / | `src/content/consultora.ts` | `faq.items[2].respuesta[1]` | Tras el diagnóstico te damos una propuesta con el alcance y el precio de cada fase por escrito, antes de empezar nada. Cada fase se paga cuando la ves funcionando. | Después de hablar contigo te damos la propuesta por escrito, con el alcance y el precio de cada fase, antes de empezar nada. Cada fase se paga cuando la ves funcionando. | A30 (procedimiento, D-035). Nombre de la puerta 1 (P-11), CA-17. | propuesta |
| / | `src/content/consultora.ts` | `faq.items[3].pregunta` | ¿Cuánto tiempo se tarda? | (igual) | A37. | propuesta |
| / | `src/content/consultora.ts` | `faq.items[3].respuesta[0]` | Trabajamos por fases y empezamos por lo que más horas te quita: lo primero que funciona suele estar en semanas. El resto se va sumando. | Trabajamos por fases y empezamos por lo que más te importa: lo primero que funciona suele estar en semanas. El resto se va sumando. | A37 (procedimiento, D-035). Filtro 4: daba por hecho que el dolor son las horas (§3.1). | propuesta |
| / | `src/content/consultora.ts` | `faq.items[3].respuesta[1]` | Un plazo cerrado para todo no te lo damos sin conocer el caso: una automatización sencilla y un sistema de gestión completo no se miden igual. En la propuesta va qué llega en cada fase. | (igual) | A37, A30. Sin cifra de plazo (A32, C). | propuesta |
| / | `src/content/consultora.ts` | `faq.items[4].pregunta` | ¿Hay costes mensuales? | (igual) | A49, A39. | propuesta |
| / | `src/content/consultora.ts` | `faq.items[4].respuesta[0]` | Puede haberlos, según la solución. Algunas piezas de terceros se pagan por uso o por cuota (la inteligencia artificial, la mensajería de WhatsApp, el alojamiento), y el mantenimiento es opcional si prefieres que lo cuidemos nosotros. | Puede haberlos, según lo que se monte. Algunas piezas de terceros se pagan por uso o por cuota (la inteligencia artificial, la mensajería de WhatsApp, el alojamiento), y en la tienda online la plataforma cobra comisión por venta. | A49; A60 (la comisión, como procedimiento y sin cifra, D-035). Sale «el mantenimiento es opcional» (A33, C: condición). | propuesta |
| / | `src/content/consultora.ts` | `faq.items[4].respuesta[1]` | En la propuesta separamos lo que se paga una vez de lo que se paga cada mes, y a nombre de quién va cada cuota. | (igual) | A39 (procedimiento, D-035). | propuesta |
| / | `src/content/consultora.ts` | `faq.items[5].pregunta` | ¿La IA puede cometer errores? | (igual) | A13. | propuesta |
| / | `src/content/consultora.ts` | `faq.items[5].respuesta[0]` | Sí, y no te vamos a prometer lo contrario. Por eso no la dejamos suelta: limitamos qué puede hacer y a qué datos accede, hace que consulte información real en vez de inventarla, te pasa a una persona cuando no sabe, y deja un registro para que puedas revisar lo que ha hecho. | Sí, y no te vamos a prometer lo contrario. Por eso, cuando la montamos, no la dejamos suelta: limitamos qué puede hacer y a qué datos llega, hacemos que consulte información real en vez de inventarla, que te pase a una persona cuando no sabe y que deje un registro de lo que ha hecho para que lo revises. | A13 (B): «cuando la montamos», no como producto (§3.2 regla 1). A11 (pasa a una persona). Arregla la frase («hace que consulte»). | propuesta |
| / | `src/content/consultora.ts` | `faq.items[5].respuesta[1]` | El objetivo es que, cuando se equivoque, se note pronto y cueste poco arreglarlo. | (igual) | A13. | propuesta |
| / | `src/content/consultora.ts` | `contacto.titulo` | ¿Y si tu negocio pudiera | (igual) | Titular (CA-11: casa con la entradilla y el botón). | propuesta |
| / | `src/content/consultora.ts` | `contacto.em` | trabajar de otra manera? | (igual) | Ídem. | propuesta |
| / | `src/content/consultora.ts` | `contacto.texto` | Cuéntanos qué haces, qué problemas encuentras en tu día a día y qué te gustaría mejorar. Analizaremos tu situación y te propondremos soluciones tecnológicas que tengan sentido para tu empresa. | Cuéntanos a qué te dedicas y qué te gustaría mejorar. Lo leemos, hablamos contigo y te damos una propuesta por escrito con lo que tenga sentido para tu negocio. | A56, A30. Nombre de la puerta 1 (P-11): titular, entradilla y botón prometen lo mismo (CA-11). Filtro 1: sin «soluciones tecnológicas». | propuesta |
| / | `src/content/consultora.ts` | `contacto.cta` | Solicitar diagnóstico gratuito | Pedir una propuesta | Nombre de la puerta 1 (P-11), CA-17. A80 corregida: sin «gratuito». | propuesta |
| / | `src/content/consultora.ts` | `contacto.tipos[0]` | Alojamiento u hostelería | (igual) | Comprador (§3.1). | propuesta |
| / | `src/content/consultora.ts` | `contacto.tipos[1]` | Clínica o salud | (igual) | Ídem. | propuesta |
| / | `src/content/consultora.ts` | `contacto.tipos[2]` | Asesoría o despacho | (igual) | Ídem. | propuesta |
| / | `src/content/consultora.ts` | `contacto.tipos[3]` | Comercio o tienda | (igual) | Ídem. | propuesta |
| / | `src/content/consultora.ts` | `contacto.tipos[4]` | Inmobiliaria | (igual) | Ídem. | propuesta |
| / | `src/content/consultora.ts` | `contacto.tipos[5]` | Servicios profesionales | (igual) | Ídem. | propuesta |
| / | `src/content/consultora.ts` | `contacto.tipos[6]` | Otro | (igual) | Ídem. | propuesta |
| / | `src/components/consultora/Contacto.tsx` | `jsx · puerta del correo` | Si prefieres escribir directamente. | (igual) | A44 (correo directo). | propuesta |
| / | `src/components/consultora/Contacto.tsx` | `jsx · enlace a /sectores/` | Diagnóstico rápido | (igual) | Nombre de la puerta 2 (P-11, recomendado). Único con «diagnóstico» (CA-17). | propuesta |
| / | `src/components/consultora/Contacto.tsx` | `jsx · texto de la puerta 2` | Un minuto, en tu navegador: no envía ni guarda nada. | Unas preguntas en tu navegador: no se envía ni se guarda nada, y las respuestas van en la dirección de la página. | A70: «un minuto» sale hasta cronometrarlo (D-035). A95 corregida: se matiza que las respuestas van en la dirección. | propuesta |
| / | `src/components/consultora/Contacto.tsx` | `jsx · enlace a /auditoria/` | Auditoría completa | Auditoría de tu negocio | Nombre de la puerta 3 (P-11, recomendado). | propuesta |
| / | `src/components/consultora/Contacto.tsx` | `jsx · texto de la puerta 3` | 36 preguntas sobre cómo trabajáis, con informe. | 36 preguntas sobre cómo trabajáis, y un informe por correo. La auditoría no se cobra. | A38 (fuente: `TOTAL_PREGUNTAS`), A72 (el informe llega por correo), A34 corregida («no se cobra»). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Nombre | (igual) | A44 (datos del formulario corto). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Empresa | (igual) | A44. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Email | Correo | Filtro 6: castellano, como el resto del formulario («Revisa el correo»). A44. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Teléfono | (igual) | A44 (opcional). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · marca de opcional` | (opcional) | (igual) | A44. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Tipo de negocio | (igual) | A44. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · opción vacía` | Elige uno… | Elige el más parecido… | PD-6: «uno» cuenta como cifra en CA-8 y aquí no lo es. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | ¿Qué te gustaría mejorar? | (igual) | A44, A56. Casa con el paso 01 del proceso (CA-11). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · campo trampa` | No rellenes este campo | (igual) | Oculto (`aria-hidden`); solo lo ven los robots. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · nombre | Dinos cómo te llamas. | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · empresa | Dinos cómo se llama tu empresa o negocio. | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · email | Revisa el correo: es donde te vamos a contestar. | (igual) | A56 (contestamos nosotros, no un aviso automático: A04 es C). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · tipo | Elige el tipo de negocio que más se parezca al tuyo. | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · mejorar | Cuéntanos, aunque sea en una frase, qué te gustaría mejorar. | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · consentimiento | Hace falta que lo aceptes para poder escribirte. | (igual) | A44, A96. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `MENSAJES.ritmo` | Has enviado varias solicitudes seguidas. Espera un minuto y vuelve a probar. | Has enviado varias solicitudes seguidas. Espera unos minutos y vuelve a probar. | A73 (D-035): la función limita a 3 envíos por correo cada 10 min; «un minuto» no cuadraba. Mismo valor que la auditoría («unos minutos»). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `MENSAJES.red` | No hemos podido conectar. Revisa tu conexión y vuelve a probar. | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `MENSAJES.servidor` | Algo ha fallado de nuestra parte y tu solicitud no ha salido. | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `MENSAJES.validacion` | Hay algún dato que no hemos podido aceptar. Revísalo y vuelve a probar. | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · consentimiento` | Acepto que Undertactics use estos datos para contestarme, según la | (igual) | A44, A96 (solo para responder). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enlace del consentimiento` | política de privacidad | (igual) | A44: `/privacidad/` tiene que nombrar este formulario (parte 2, CA-14). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · botón enviando` | Enviando… | (igual) | Interfaz. El botón en reposo es `contacto.cta`. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · bajo el botón` | Sin coste y sin compromiso. | La propuesta no se cobra. | Sale el reclamo de condición (A33, C; CA-16). Queda el precio dicho como D-035 («no se cobra», A80 corregida) con el nombre de la puerta 1 (P-11). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · error de envío` | Si prefieres, escríbenos a | (igual) | A44 (correo directo). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, rótulo` | Recibido | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, titular` | Gracias, {n}. | (igual) | Interfaz. `{n}` = el nombre de pila. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, texto` | Hemos recibido tu solicitud. Vamos a leerla con calma y te contestamos al correo que nos has dado, con lo que veamos y las dudas que nos queden. | (igual) | A29 (se guarda), A56 (contestamos nosotros). No promete aviso automático (A04, C). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, antes del enlace` | Mientras tanto, si quieres adelantar trabajo, la | (igual) | Interfaz. | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, enlace a /auditoria/` | auditoría completa | auditoría de tu negocio | Nombre de la puerta 3 (P-11). | propuesta |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, después del enlace` | nos da el detalle de cómo trabajáis. | (igual) | A52 no se cita: solo dice qué nos das tú. | propuesta |

## /auditoria/

La puerta 3, «Auditoría de tu negocio» (P-11, recomendado). Las filas
`por confirmar` del Anexo pesan aquí: lo que el informe lleva dentro (A52, A36,
A81) no se puede escribir hasta que Álvaro las confirme. Donde un texto de hoy
se apoya en ellas, sale o se reescribe sin ellas; si Álvaro las confirma en T05,
esas filas pueden volver a `(igual)` (estado `corregida`).

`loQueNoPedimos` (`auditoria.ts`) va aquí y `/sectores/<slug>/` lo cita. Las
preguntas P1-P36 llevan fila aunque casi no cambien: son el formulario del kit
03 y el informe las cita por su número (no se renumeran). La numeración
(«Paso n de 8», «Bloque n de 7», «n / 36», P1-P36) no lleva fila.

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /auditoria/ | `src/app/auditoria/page.tsx` | `metadata.title` | Auditoría gratuita — {n} | Auditoría de tu negocio — {n} | Nombre de la puerta 3 (P-11). A34 corregida (D-035): sin «gratuita». `{n}` = `site.nombre`. | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `metadata.description` | Cuéntanos cómo trabajáis en diez minutos y te devolvemos un informe con las horas que se van cada semana, lo que cuestan y qué se arregla primero. | Cuéntanos cómo trabajáis, con tus palabras, y te mandamos por correo un informe de tu negocio. La auditoría no se cobra. | A72 (informe por correo), A34 corregida («no se cobra»). Sale «diez minutos» (A35, C hasta cronometrar). Salen «las horas que se van», «lo que cuestan» y «qué se arregla primero»: A36 y A52 siguen `por confirmar`. | propuesta |
| /auditoria/ | `src/content/interiores.ts` | `cotasInterior.auditoria.cota` | Fondo · Auditoría | (igual) | Cota (D-014). | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `CabeceraInterior` · `arriba` | Cómo trabajáis | (igual) | Título del cuestionario del kit 03. No afirma nada. | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `CabeceraInterior` · `em` | por dentro | (igual) | Ídem. | propuesta |
| /auditoria/ | `src/components/ui/CabeceraInterior.tsx` | `jsx · enlace de vuelta` | Volver | (igual) | Interfaz. Lo pintan todas las interiores; la fila va solo aquí. | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · entradilla` | {n} preguntas sobre el día a día del negocio. Se contesta en unos diez minutos, con tus palabras, y no hace falta que sepas nada de tecnología. | {n} preguntas sobre el día a día del negocio. Se contestan con tus palabras, y no hace falta que sepas nada de tecnología. La auditoría no se cobra. | A38 (`{n}` = `TOTAL_PREGUNTAS`), A56, A34 corregida. Sale «unos diez minutos» (A35, C hasta cronometrar). | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[0].titulo` | No contestes lo que no sepas | (igual) | A98: solo es obligatorio el primer paso. | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[0].texto` | Déjalo en blanco. El informe marca los huecos en vez de inventárselos. | Déjalo en blanco. Solo hacen falta el nombre del negocio, el tuyo y tu correo. | A98. Sale «el informe marca los huecos»: A52 sigue `por confirmar`. | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[1].titulo` | Los números a ojo valen | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[1].texto` | «Unas 30 llamadas a la semana» sirve. No busques nada en ningún sitio. | Por ejemplo, «unas 30 llamadas a la semana» sirve. No busques nada en ningún sitio. | A78: una cifra de ejemplo fuera de una maqueta va rotulada como ejemplo (o dentro de `[data-ejemplo]`; T05 la pone en `CIFRAS` con A78). | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[2].titulo` | Puedes parar y seguir | (igual) | A93. | propuesta |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[2].texto` | Lo que escribas se guarda en este navegador. Cierra la pestaña y vuelve cuando quieras. | Lo que escribas se guarda en este navegador durante 30 días, y se borra al enviarlo. Cierra la pestaña y vuelve cuando te venga bien. | A93 corregida (D-035): el borrador caduca a los 30 días, así que «cuando quieras» no era verdad. A44: se borra si el envío sale bien. Ojo: hoy el borrador **no caduca** (A44); T08 tiene que hacer que caduque antes de copiar este texto. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · borrador recuperado` | Recuperado lo que habías escrito en este navegador | (igual) | A93. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `AvisoPrerrelleno` · texto | de tu diagnóstico rápido. | (igual) | Va tras «Hemos puesto {n} respuesta(s)». Nombre de la puerta 2 (P-11): es el diagnóstico rápido, así que CA-17 lo admite (T05 lo pone en `DIAGNOSTICO_PERMITIDO`). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `AvisoPrerrelleno` · una | Revísala y cámbiala si no cuadra. | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `AvisoPrerrelleno` · varias | Revísalas y cámbialas si no cuadran. | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `AvisoPrerrelleno` · saltadas | Las que ya habías escrito no las hemos tocado. | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · campo trampa` | No rellenes este campo | (igual) | Oculto (`aria-hidden`); solo lo ven los robots. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `PasoContacto` · rótulo | Antes de empezar | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `PasoContacto` · titular y `legend` | Tus datos | (igual) | Interfaz. También es la primera etiqueta del índice (`Progreso`). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `PasoContacto` · entradilla | Lo único obligatorio de todo el formulario. El resto puedes dejarlo a medias y mandarlo igual. | (igual) | A98 (la casilla de consentimiento va en este mismo paso). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo negocio` · `etiqueta` | Nombre del negocio | (igual) | A44 (datos de la auditoría). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo sector` · `etiqueta` | A qué os dedicáis | (igual) | A44. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo sector` · `ayuda` | Peluquería, taller, clínica, tienda… | (igual) | Ejemplos de sector; no afirman nada. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo ciudad` · `etiqueta` | Ciudad | (igual) | A44. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo web` · `etiqueta` | Vuestra web, si tenéis | (igual) | A44. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo web` · `ayuda` | Con ella se puede auditar también la mitad de fuera. Si no tenéis, déjalo vacío. | Si no tenéis, déjalo vacío. | Sale «se puede auditar también la mitad de fuera»: «miramos tu web por fuera» es A52, que sigue `por confirmar`. Filtro 1: «la mitad de fuera» no se entendía. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_nombre` · `etiqueta` | Tu nombre | (igual) | A44. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_email` · `etiqueta` | Tu correo | (igual) | A44. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_email` · `ayuda` | Es por donde te llega el informe. | (igual) | A72. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_telefono` · `etiqueta` | Teléfono | (igual) | A44 (opcional). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_telefono` · `ayuda` | Opcional. Solo si prefieres que te llamemos. | (igual) | A44. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · consentimiento` | Acepto que {n} guarde estos datos para preparar el informe y responderme. No se ceden a nadie y puedes pedir que se borren cuando quieras escribiendo a | Acepto que {n} guarde estos datos para preparar el informe y responderme. Los guardamos en Supabase y el informe lo redactamos con la IA de Anthropic; no se ceden a nadie más. Puedes pedir que se borren cuando quieras escribiendo a | A91: la casilla nombra a los dos encargados igual que `/privacidad/` (antes decía «no se ceden a nadie» sin ellos). A90 (Supabase), A96 (para qué), A44. «Cuando quieras» es un derecho (RGPD art. 17), no un reclamo de condición. `{n}` = `site.nombre`. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · consentimiento, final` | . Más detalle en la | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · enlace del consentimiento` | política de privacidad | (igual) | A44: `/privacidad/` nombra este formulario (CA-14). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `PasoContacto` · rótulo de lo que no se pide | Y lo que no te vamos a pedir | (igual) | A97. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `loQueNoPedimos[0]` | Datos de tus clientes: listados, fichas, historiales, nombres con teléfonos. | (igual) | A97. También lo pinta `Fondo` (`/sectores/<slug>/`). | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `loQueNoPedimos[1]` | Contraseñas, claves ni accesos a tus programas. | (igual) | A97. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `loQueNoPedimos[2]` | Facturas, contabilidad ni exportaciones de tus bases de datos. | (igual) | A97. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `validar` · negocio | Dinos cómo se llama el negocio. | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `validar` · nombre | Necesitamos tu nombre. | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `validar` · correo | Revisa el correo: es por donde te llega el informe. | (igual) | A72. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `validar` · consentimiento | Hace falta que lo aceptes para poder escribirte. | (igual) | A98 (la casilla también es obligatoria). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón | Atrás | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón, paso 0 | Empezar el cuestionario | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón | Siguiente bloque | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón enviando | Enviando… | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón, último paso | Enviar la solicitud | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón | Enviar tal como está | (igual) | Interfaz (A98: se puede mandar a medias). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · a medias | Puedes mandarlo a medias: {n} contestadas | (igual) | A98. `{n}` = respuestas contestadas (recuento de la interfaz, no una cifra que afirme algo). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `mensajes.validacion` | Faltan datos obligatorios. Vuelve al primer paso y revísalos. | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `mensajes.ritmo` | Has mandado ya varias solicitudes seguidas. Espera unos minutos y vuelve a intentarlo. | (igual) | A73: «unos minutos» casa con el límite de la función (3 envíos por correo cada 10 min). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `mensajes.red` | No hemos podido conectar. Comprueba la conexión y vuelve a darle a enviar. | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `mensajes.servidor` | Algo ha fallado por nuestro lado. Inténtalo en un rato. | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Error` · antes del correo | Si sigue sin funcionar, escríbenos a | (igual) | A44 (correo directo). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Error` · después del correo | y lo resolvemos por correo. | (igual) | A44. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · rótulo | Recibido | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · titular | Gracias{n}. | (igual) | Interfaz. `{n}` = «, » y el nombre de pila. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · texto | Nos han llegado {n} de las {n} respuestas. Lo primero que hacemos es leerlo entero y mirar tu web por fuera; si falta algo importante te escribimos antes de ponernos. | Nos han llegado {n} de las {n} respuestas. Lo leemos entero y, si falta algo importante, te escribimos antes de ponernos. | A56 (lo leemos nosotros). Sale «mirar tu web por fuera»: A52 sigue `por confirmar`. `{n}` = contestadas y `TOTAL_PREGUNTAS` (A38). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · plazo | El informe tarda unos días y llega por correo. No hay ningún paso siguiente por tu parte. | (igual) | A72 (procedimiento, D-035). | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · botón | Mientras, mira las plantillas | (igual) | A57. | propuesta |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · botón | Volver al inicio | (igual) | Interfaz. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].titulo` | El negocio | (igual) | Cuestionario del kit 03 (A38). | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[0].etiqueta` | Nombre del negocio | (igual) | P1. Pregunta: no afirma ni presupone (§3.1). | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[1].etiqueta` | A qué os dedicáis, en una frase | (igual) | P2. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[2].etiqueta` | Ciudad | (igual) | P3. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[3].etiqueta` | ¿Cuántas personas trabajáis y qué hace cada una? | (igual) | P4. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[3].ayuda` | Por ejemplo: «3: yo atiendo y hago presupuestos, mi socio produce, y una persona a media jornada en recepción». | (igual) | A78: cifra de ejemplo, ya rotulada «Por ejemplo» (T05 la pone en `CIFRAS` con A78). | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[4].etiqueta` | Horario de atención al público | (igual) | P5. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[5].etiqueta` | ¿A cuántos clientes atendéis a la semana, más o menos? | (igual) | P6. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].titulo` | Cómo os llegan los clientes | (igual) | Kit 03. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[0].etiqueta` | ¿Por dónde os contactan? | (igual) | P7. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[0].ayuda` | Ordénalo de más a menos: teléfono, WhatsApp, Instagram, formulario de la web, email, gente que entra por la puerta, otros. | Ordénalo de más a menos: teléfono, WhatsApp, Instagram, formulario de la web, correo, gente que entra por la puerta, otros. | Filtro 6: «correo», como en el resto de la web (y en el formulario corto, `## /`). Ofrece opciones, no presupone ninguna (§3.1). | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[1].etiqueta` | ¿Quién responde a esas llamadas y mensajes, y desde qué dispositivo? | (igual) | P8. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[1].ayuda` | Por ejemplo: «la recepcionista, desde su móvil personal» o «un móvil de empresa que está en el mostrador». | (igual) | Ejemplo rotulado. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[2].etiqueta` | ¿Cuánto se tarda normalmente en contestar un mensaje? | (igual) | P9. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[3].etiqueta` | ¿Qué pasa con las llamadas y mensajes que llegan fuera de horario o cuando estáis ocupados? | (igual) | P10. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[3].ayuda` | ¿Sabéis cuántos se quedan sin contestar? | (igual) | P10. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[4].etiqueta` | ¿Cuántas consultas de clientes nuevos entran a la semana, más o menos? | (igual) | P11. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].titulo` | Agenda y citas | (igual) | Kit 03. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].entradilla` | Si en tu negocio no se trabaja con cita previa, salta este bloque entero: escribe «no trabajamos con cita» en la primera y sigue. | (igual) | Ya va con «si» (§3.1). | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[0].etiqueta` | ¿Dónde apuntáis las citas? | (igual) | P12. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[0].ayuda` | Agenda de papel, Excel, Google Calendar, un programa concreto: dime cuál. | (igual) | P12. Opciones, no supuestos. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[1].etiqueta` | ¿Quién las apunta, y desde dónde se puede consultar la agenda? | (igual) | P13. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[2].etiqueta` | ¿Puede el cliente reservar él solo por internet, sin llamar? | (igual) | P14. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[3].etiqueta` | ¿Cómo le recordáis la cita al cliente? | (igual) | P15. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[3].ayuda` | ¿Quién lo hace, y cuánto tiempo se le va a la semana en eso? | (igual) | P15. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[4].etiqueta` | ¿Cuántas citas se pierden porque el cliente no aparece o cancela a última hora? | (igual) | P16. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[4].ayuda` | ¿Cuánto factura de media una cita? | (igual) | P16. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].titulo` | Presupuestos, cobro y facturación | (igual) | Kit 03. Pregunta por cómo factura el negocio; no dice que nosotros facturemos (A16). | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[0].etiqueta` | ¿Cómo preparáis un presupuesto y cómo se lo hacéis llegar al cliente? | (igual) | P17. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[1].etiqueta` | ¿Cuántos presupuestos mandáis al mes, y cuántos acaban en trabajo? | (igual) | P18. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[2].etiqueta` | ¿Cómo cobráis? | (igual) | P19. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[2].ayuda` | Efectivo, tarjeta, transferencia, pago por internet, financiación… | (igual) | P19. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[3].etiqueta` | ¿Quién hace las facturas y con qué programa? | (igual) | P20. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[3].ayuda` | ¿Cuánto tiempo al mes os lleva? | (igual) | P20. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[4].etiqueta` | ¿Tenéis impagos, o pagos pendientes que se os olvida reclamar? | (igual) | P21. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].titulo` | Después de la venta | (igual) | Kit 03. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[0].etiqueta` | Cuando un cliente termina, ¿qué pasa? ¿Volvéis a hablar con él? | (igual) | P22. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[1].etiqueta` | ¿Pedís reseñas? Si sí, ¿cómo? | (igual) | P23. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[1].ayuda` | ¿Cuántas tenéis ahora mismo y con qué nota? | (igual) | P23. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[2].etiqueta` | ¿Vuestros clientes deberían volver cada cierto tiempo (revisión, mantenimiento, retoque, renovación)? | (igual) | P24. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[2].ayuda` | ¿Cómo les avisáis de que les toca? | (igual) | P24. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[3].etiqueta` | ¿Mandáis alguna comunicación cada cierto tiempo (novedades, ofertas, recordatorios)? | (igual) | P25. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[3].ayuda` | ¿Con qué herramienta? | ¿Con qué programa? | Decisión 6: «herramienta» queda fuera de lo que se enseña, y el resto del formulario dice «programa» (P20, P26). | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].titulo` | Herramientas y datos | Programas y datos | Ídem: casa con P26 («programas y aplicaciones»). | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[0].etiqueta` | Lista de programas y aplicaciones que pagáis | (igual) | P26. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[0].ayuda` | De cada uno: nombre, para qué lo usáis y cuánto cuesta al mes, si lo sabes. | (igual) | P26. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[1].etiqueta` | ¿Dónde está la información de vuestros clientes? | (igual) | P27. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[1].ayuda` | Un programa, un Excel, la agenda de papel, el móvil de alguien, varias cosas a la vez. | (igual) | P27. Opciones, no supuestos. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[2].etiqueta` | ¿Hay copia de seguridad de eso? ¿Quién la hace y cada cuánto? | (igual) | P28. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[3].etiqueta` | ¿Quién tiene acceso a esa información? | (igual) | P29. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[3].ayuda` | Y una pregunta incómoda: si mañana esa persona no viene, ¿el negocio puede seguir funcionando? | (igual) | P29. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[4].etiqueta` | ¿Qué números miráis cada mes para saber si el negocio va bien? | (igual) | P30. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].titulo` | Tiempo, IA y objetivos | (igual) | Kit 03. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[0].etiqueta` | Las 3 tareas repetitivas que más tiempo os comen | Las tareas repetitivas que más tiempo os comen | Filtro 5 y PD-6: «3» cuenta como cifra y no tiene fila en el Anexo. La ayuda ya dice «de cada una». Si Álvaro prefiere dejar el número (es el formulario del kit 03), T05 la deja `(igual)` y la pone como excepción con motivo. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[0].ayuda` | De cada una, dime cuánto tiempo a la semana, aunque sea a ojo. | (igual) | P31. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[1].etiqueta` | ¿Cuánto cuesta más o menos una hora de trabajo de la persona que hace esas tareas? | (igual) | P32. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[1].ayuda` | Con lo que le cuesta a la empresa, aproximado. Si prefieres no decirlo, no pasa nada. | (igual) | P32. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[2].etiqueta` | ¿Habéis probado alguna herramienta de inteligencia artificial o de automatización? | ¿Habéis probado algún programa de inteligencia artificial o de automatización? | Decisión 6, como P25. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[2].ayuda` | ¿Qué pasó? | (igual) | P33. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[3].etiqueta` | ¿Qué os preocuparía de usar inteligencia artificial con vuestros clientes? | (igual) | P34. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[4].etiqueta` | Si pudieras arreglar una sola cosa del día a día, ¿cuál sería? | (igual) | P35. | propuesta |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[5].etiqueta` | ¿Qué presupuesto tienes en mente para montarlo? ¿Y para el mantenimiento mensual? | (igual) | P36. | propuesta |

## /estudio/

Los compromisos, su nota y la tarjeta de persona (`Compromisos.tsx`,
`estudio.ts` `compromisos`/`notaCompromisos`, `TarjetaPersona.tsx`) van en
`## /`. `comoTrabajamos[2].texto` es `proceso[4].descripcion` (en `## /`). Los
textos de persona repiten los de la portada (decisión 8): uno por persona, que
leen Álvaro y Yanin antes de publicarlo (A40).

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /estudio/ | `src/app/estudio/page.tsx` | `metadata.title` | Estudio — {n} | (igual) | `{n}` = `site.nombre`. | propuesta |
| /estudio/ | `src/app/estudio/page.tsx` | `metadata.description` | Quién hace Undertactics, cómo trabajamos y qué queda a nombre de cada negocio: el código, el dominio y las claves. | (igual) | A40, A31 (la excepción de la tienda la dice la nota de los compromisos, A60). | propuesta |
| /estudio/ | `src/content/interiores.ts` | `cotasInterior.estudio.cota` | −3 · Estudio | (igual) | Cota (D-014). | propuesta |
| /estudio/ | `src/app/estudio/page.tsx` | `CabeceraInterior` · `arriba` | Quién hace | (igual) | A40. | propuesta |
| /estudio/ | `src/app/estudio/page.tsx` | `CabeceraInterior` · `em` | esto. | (igual) | Ídem. | propuesta |
| /estudio/ | `src/content/estudio.ts` | `entradaEstudio` | En Undertactics somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien diseña tu web, escribe el código o monta tu vídeo. | En Undertactics somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien hace el trabajo. | A40. Sale «monta tu vídeo» (A21, C: el vídeo no es un servicio). El mismo final que `quien.texto` de la portada (decisión 8). | propuesta |
| /estudio/ | `src/app/estudio/page.tsx` | `jsx · segundo párrafo` | Somos un estudio pequeño a propósito: cada encargo lo llevan las mismas dos personas de principio a fin. | (igual) | A40, A76 (fuente: `estudio.ts`, 2 personas). | propuesta |
| /estudio/ | `src/content/estudio.ts` | `personas[0].nombre` | Álvaro | (igual) | A40. | propuesta |
| /estudio/ | `src/content/estudio.ts` | `personas[0].rol` | Web, código y automatización | (igual) | A40. Decisión 8: la portada pasa a este mismo rol. | propuesta |
| /estudio/ | `src/content/estudio.ts` | `personas[0].texto` | Diseña y programa las webs, las tiendas y las herramientas del estudio, y monta las automatizaciones con IA. Si algo del código no te encaja, se lo dices a él y se cambia. | Diseña y programa las webs y las tiendas, y monta las automatizaciones con IA que se encargan a medida. Si algo del código no te encaja, se lo dices a él. | Decisión 8: el mismo texto que `quien.personas.Álvaro.texto` (`## /`). A40, A06, A01, A22 (B, por encargo). Sale «y se cambia» (A51, B: en la tienda el código no es del cliente) y «las herramientas del estudio» (decisión 6). Lo lee Álvaro antes de publicarlo. | propuesta |
| /estudio/ | `src/content/estudio.ts` | `personas[1].nombre` | Yanin | (igual) | A40. | propuesta |
| /estudio/ | `src/content/estudio.ts` | `personas[1].rol` | Foto, vídeo y redes | (igual) | A40 corregida (D-035). | propuesta |
| /estudio/ | `src/content/estudio.ts` | `personas[1].texto` | Produce y edita las fotos y los vídeos para redes, que es lo que mejor se le da y lo que más le gusta. También trabaja con IA en el día a día del estudio. | Hace y edita las fotos y los vídeos del estudio. | Decisión 8: el mismo texto que `quien.personas.Yanin.texto` (`## /`). «Para redes» al lado de los servicios se lee como servicio de vídeo (A21, C). Salen «lo que mejor se le da» y «trabaja con IA»: sin fila en el Anexo (§3.2 regla 6). Lo lee Yanin antes de publicarlo (A40). | propuesta |
| /estudio/ | `src/app/estudio/page.tsx` | `Titular` · `arriba` | Cómo trabajamos. | (igual) | Titular. | propuesta |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[0].titulo` | Primero miramos, luego hablamos de precio. | (igual) | A56, A30 (procedimiento, D-035). | propuesta |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[0].texto` | La auditoría gratuita son {n} preguntas y te deja un informe que es tuyo, sigas con nosotros o no. | La auditoría de tu negocio son {n} preguntas y un informe que te llega por correo. No se cobra. | Nombre de la puerta 3 (P-11). A38 (`{n}` = `TOTAL_PREGUNTAS`), A72, A34 corregida (sin «gratuita»). Sale «un informe que es tuyo, sigas con nosotros o no»: A52 sigue `por confirmar`. | propuesta |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[1].titulo` | Partimos de una base propia. | No empezamos de cero. | Decisión 3: sin «propia» (§3.4 regla 1). El texto dice de qué se parte. | propuesta |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[1].texto` | {n} plantillas y las herramientas que hemos escrito nosotros. Se adapta a lo tuyo, no se empieza de cero, y por eso lo primero funciona en semanas. | Partimos de {n} plantillas publicadas y de la tienda online, el informe de mejoras de tu web y el formulario de contacto, que hemos construido nosotros. Se adapta a lo tuyo, y por eso lo primero funciona en semanas. | A05 (`{n}` = `plantillas.length`), A50 corregida («lo construimos nosotros», solo para las piezas A: A01, A03, A29), A37 (procedimiento). Nombres recomendados (P-11). Sale «herramientas» (decisión 6). | propuesta |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[2].titulo` | Lo ves funcionando antes de cada pago. | (igual) | A30 (procedimiento, D-035). El texto es `proceso[4].descripcion` (`## /`). | propuesta |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[3].titulo` | Una conversación, no un ticket. | (igual) | A39 (procedimiento, D-035). | propuesta |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[3].texto` | Escribes a quien lo hace y te contesta esa misma persona. | (igual) | A40, A39. | propuesta |
| /estudio/ | `src/app/estudio/page.tsx` | `Titular` · `arriba` del cierre | ¿Hablamos de tu negocio? | (igual) | Titular (CA-11: casa con la entradilla y los botones). | propuesta |
| /estudio/ | `src/app/estudio/page.tsx` | `jsx · entradilla del cierre` | Empieza por la auditoría gratuita: diez minutos de formulario y te decimos qué falta antes de hablar de precio. | Empieza por la auditoría de tu negocio: contestas unas preguntas sobre cómo trabajáis y te mandamos un informe por correo, antes de hablar de precio. La auditoría no se cobra. | Nombre de la puerta 3 (P-11). A34 corregida, A72, A56. Sale «diez minutos» (A35, C). Sale «te decimos qué falta»: lo que lleva el informe es A52, `por confirmar`. | propuesta |
| /estudio/ | `src/app/estudio/page.tsx` | `jsx · botón a /auditoria/` | Pedir la auditoría gratuita | Empezar la auditoría | Forma corta de la puerta 3 («Auditoría»). A34 corregida: sin «gratuita». | propuesta |
| /estudio/ | `src/app/estudio/page.tsx` | `jsx · botón de correo` | Escribir un correo | (igual) | A44 (correo directo). | propuesta |

pendiente: parte 2 — faltan las tablas `## /herramientas/`, `## /plantillas/`, `## /privacidad/`, `## /sectores/`, las tres `## /sectores/<slug>/`, `## /404` y `## README`. Lo sigue el mismo chat (o el que reciba su prompt de continuación).
