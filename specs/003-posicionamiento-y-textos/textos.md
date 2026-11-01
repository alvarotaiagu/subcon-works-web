# 003 · Textos

Spec: [spec.md](spec.md) (§3.6) · Plan: [plan.md](plan.md) (PD-3, PD-9) ·
Tareas: [tasks.md](tasks.md) (T04, T05)

Estado del documento: **propuesta** (T04, 2026-11-01), sobre `exp/consultora` en
`7718dcf` (parte 1) y `23f5723` (parte 2, desde `## /auditoria/`), con el
Anexo A confirmado (D-035). Lo aprueba Álvaro fila a fila en
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
  pinta ninguna ruta de esta rama (la portada vigente, spec §2). Tampoco, y
  cada tabla dice por qué: los datos de las plantillas que no cambian
  (`## /plantillas/`), lo de `diagnostico.ts` que no afirma nada
  (`## /sectores/clinicas-dentales/`) y la nota de anclas del README, que el
  script no lee (`## README`).
- Un texto que en el código va partido por una etiqueta (`<strong>`) lleva una
  fila por trozo: CA-4 busca cada texto seguido.
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
   - No la pinta ninguna ruta de esta rama (solo `Plantillas.tsx`, de la
     portada vigente; `Fondo` pinta otras dos cifras), pero `portada.test.ts`
     la busca por esa etiqueta (lo actualiza T07). Su fila va con las demás de
     `cifras.ts`, en `## /sectores/clinicas-dentales/`.
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
| * | `src/content/site.ts` | `site.nombre` | Undertactics | (igual) | Marca. | aprobada |
| * | `src/content/site.ts` | `site.tagline` | Lo de arriba vende. Lo de abajo trabaja. | (igual) | Frase de D-014; no se toca (C-23). | aprobada |
| * | `src/content/site.ts` | `site.descripcion` | Consultora tecnológica para pymes y autónomos: inteligencia artificial, automatización de procesos, software a medida y desarrollo web. | Hacemos la web, la tienda online y la ficha de Google de tu negocio, y montamos a tu medida lo que va por debajo: automatizaciones, asistentes con IA y programas de gestión. | A45: una sola descripción en todo el sitio, la de la promesa (§3.1). A06, A01, A08 (A, presente); A22, A11, A28, A23 (B, «a tu medida»). Filtro 1: «pymes» y «consultora tecnológica» son jerga para un dueño de negocio. La pintan `description` y OG de todas las rutas sin metadatos propios, y el pie. | aprobada |
| * | `src/content/site.ts` | `site.ubicacion` | Carballo, A Coruña | (igual) | Dato del estudio (A40). | aprobada |
| * | `src/content/site.ts` | `site.email` | alvarot2601@gmail.com | (igual) | Correo de contacto (A44, correo directo). | aprobada |
| * | `src/content/site.ts` | `site.nav[0].label` | Servicios | (igual) | Interfaz: ancla `/#servicios`. | aprobada |
| * | `src/content/site.ts` | `site.nav[1].label` | Soluciones | (igual) | Ancla `/#soluciones`; la sección dice que son ejemplos (A15). | aprobada |
| * | `src/content/site.ts` | `site.nav[2].label` | Proyectos | Webs de ejemplo | Decisión 4: «Proyectos» sugiere trabajos de cliente (§3.2 regla 3, §3.5). A59. | aprobada |
| * | `src/content/site.ts` | `site.nav[3].label` | Herramientas | Productos | Decisión 6: el cliente compra el resultado (§3.4). Lo que queda en `/herramientas/` es nivel A (A01, A03, A29, A50). | aprobada |
| * | `src/content/site.ts` | `site.nav[4].label` | Proceso | (igual) | Interfaz: ancla `/#proceso`. | aprobada |
| * | `src/content/site.ts` | `site.nav[5].label` | Contacto | (igual) | Interfaz: ancla `/#contacto`. | aprobada |
| * | `src/content/site.ts` | `site.cta` | Solicitar diagnóstico | Pedir una propuesta | Nombre de la puerta 1 (P-11, recomendado). «Diagnóstico» queda solo para el diagnóstico rápido (CA-17). A30, A56. | aprobada |
| * | `src/app/layout.tsx` | `metadata.title` | {n} — IA, automatización y software a medida para pymes | {n} — Web, tienda online y automatización a medida | A45 (misma familia que la descripción). A06, A01 (A); A22 (B, «a medida»). Filtro 1: sin «pymes». `{n}` = `site.nombre`. | aprobada |
| * | `src/app/layout.tsx` | `metadata.description` | site.descripcion | (igual) | Sale de `site.descripcion` (fila de arriba): no se escribe aparte (A45). | aprobada |
| * | `src/app/layout.tsx` | `metadata.openGraph.title` | title: site.nombre | (igual) | Marca. | aprobada |
| * | `src/app/layout.tsx` | `metadata.openGraph.description` | site.descripcion | (igual) | Sale de `site.descripcion` (A45). | aprobada |
| * | `src/app/layout.tsx` | `metadata.openGraph.images[0].alt` | Logo de Undertactics: un iceberg con la línea de superficie en lima | (igual) | Accesibilidad: describe la imagen; `og.png` se regenera en P-07, fuera de esta spec. | aprobada |
| * | `src/app/layout.tsx` | `jsx · enlace para saltar` | Saltar al contenido | (igual) | Accesibilidad; no afirma nada. | aprobada |
| * | `src/components/layout/Nav.tsx` | `aria-label` del logo | {n}, inicio | (igual) | Accesibilidad. `{n}` = `site.nombre`. | aprobada |
| * | `src/components/layout/Nav.tsx` | `aria-label` del menú | Navegación principal | (igual) | Accesibilidad. | aprobada |
| * | `src/components/layout/Nav.tsx` | `jsx · botón del menú móvil` | Menú | (igual) | Interfaz. | aprobada |
| * | `src/components/layout/Nav.tsx` | `aria-label` del panel móvil | Menú de navegación | (igual) | Accesibilidad. | aprobada |
| * | `src/components/layout/Nav.tsx` | `jsx · cerrar el menú` | Cerrar | (igual) | Interfaz. | aprobada |
| * | `src/components/layout/Nav.tsx` | `aria-label` del menú móvil | Navegación móvil | (igual) | Accesibilidad. | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · botón bajo el logo` | Solicitar diagnóstico | Pedir una propuesta | El mismo botón que el menú (`site.cta`): nombre de la puerta 1 (P-11). CA-17. Mejor que lo lea de `site.cta` y no lo repita. | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · título de columna` | Contacto | (igual) | Interfaz. | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · título de columna` | Secciones | (igual) | Interfaz. | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · enlace a /plantillas/` | Las {n} plantillas | (igual) | A05: el número sale de `plantillas.length`. | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · enlace a /estudio/` | Quién hace esto | (igual) | A40. | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · enlace a /auditoria/` | Auditoría gratuita | Auditoría de tu negocio | Nombre de la puerta 3 (P-11). A34 corregida (D-035): sin «gratuita»; el precio se dice «no se cobra» donde se explica la auditoría. | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · enlace a /privacidad/` | Privacidad | (igual) | Obligatorio (A44). | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · título de columna` | Hora local | (igual) | A77: la hora sale del reloj. | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · derechos` | © {n} {n}. Todos los derechos reservados. | (igual) | A77: el año sale del reloj. | aprobada |
| * | `src/components/layout/Footer.tsx` | `jsx · aviso de ficticios` | Los negocios de las plantillas son ficticios. Diseñado y construido por {n}. | (igual) | A59 (D-007): obligatorio. | aprobada |
| * | `src/components/layout/AvisoCookies.tsx` | `aria-label` | Aviso sobre el almacenamiento en tu navegador | (igual) | Accesibilidad. | aprobada |
| * | `src/components/layout/AvisoCookies.tsx` | `jsx · texto del aviso` | Sin cookies de seguimiento: solo tu borrador y este aviso. | Sin cookies: tu navegador solo recuerda este aviso, la animación de entrada y, si abres la auditoría, tu borrador. | A93 corregida: el aviso contaba dos cosas y `/privacidad/` tres (borrador y aviso en `localStorage`, la cortina en `sessionStorage`). A94: no hay cookies de ningún tipo, así que sobra «de seguimiento». El borrador solo existe si se abre el formulario de la auditoría (filtro 4); se guarda al cargarlo, aunque no se escriba nada (`FormularioAuditoria.tsx:158-162`, D-037), de ahí «abres» y no «empiezas». | aprobada |
| * | `src/components/layout/AvisoCookies.tsx` | `jsx · enlace` | Detalle | (igual) | Lleva a `/privacidad/`. | aprobada |
| * | `src/components/layout/AvisoCookies.tsx` | `jsx · botón` | Entendido | (igual) | Interfaz. | aprobada |
| * | `src/components/ui/WorkImage.tsx` | `jsx · imagen que no carga` | Imagen no disponible | (igual) | Interfaz. | aprobada |
| * | `src/components/layout/Mando.tsx` | `aria-label` | Dos versiones de la misma web | (igual) | Solo sale con `?revision` (spec 002 §3.16): no llega al cliente. | aprobada |
| * | `src/components/layout/Mando.tsx` | `jsx · rótulo` | Versión | (igual) | Ídem. | aprobada |
| * | `src/components/layout/Mando.tsx` | `jsx · botón` | Por debajo | (igual) | Ídem. | aprobada |
| * | `src/components/layout/Mando.tsx` | `jsx · botón` | Sobria | (igual) | Ídem. | aprobada |

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
| / | `src/content/portada.ts` | `cortePortada[inicio].cota` | Superficie | (igual) | Cota (D-014). | aprobada |
| / | `src/content/portada.ts` | `cortePortada[problemas].cota` | 0 · Lo que pasa | 0 · Lo que suele pasar | Filtro 4: las situaciones son habituales, no hechos sobre quien lee (§3.1). | aprobada |
| / | `src/content/portada.ts` | `cortePortada[servicios].cota` | −1 · Lo que montamos | (igual) | Cota. A06, A22. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[soluciones].cota` | −2 · Soluciones en acción | −2 · Soluciones de ejemplo | «En acción» da a entender que funcionan; son ejemplos de nivel B con datos inventados (A15, A12, A61). | aprobada |
| / | `src/content/portada.ts` | `cortePortada[proceso].cota` | −3 · El proceso | (igual) | Cota. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[plantillas].cota` | −4 · Proyectos y demostraciones | −4 · Webs de ejemplo | Decisión 4 y §3.5: «Proyectos» sugiere trabajos de cliente (§3.2 regla 3). A59. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[equipo].cota` | −5 · Quién está debajo | (igual) | Cota. A40. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[faq].cota` | −6 · Dudas | (igual) | Cota. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[contacto].cota` | Fondo · Contacto | (igual) | Cota. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[problemas].puerta` | (no hay) | Lo que va por debajo | Rótulo de puerta (§3.1, CA-15), decisión 5. Va en la `etiqueta` de `Seccion`. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[servicios].puerta` | (no hay) | Lo que va por debajo | Ídem. Sección mixta: ver decisión 5. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[soluciones].puerta` | (no hay) | Lo que va por debajo | Ídem. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[proceso].puerta` | (no hay) | Lo que va por debajo | Ídem. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[plantillas].puerta` | (no hay) | Lo que ve tu cliente | Ídem. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[equipo].puerta` | (no hay) | Lo que va por debajo | Ídem. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[faq].puerta` | (no hay) | Lo que va por debajo | Ídem. Sección mixta: ver decisión 5. | aprobada |
| / | `src/content/portada.ts` | `cortePortada[contacto].puerta` | (no hay) | Lo que va por debajo | Ídem. Sección mixta: ver decisión 5. | aprobada |
| / | `src/content/consultora.ts` | `hero.linea1` | Lo de arriba vende. | (igual) | Frase de D-014; no se toca (C-23). | aprobada |
| / | `src/content/consultora.ts` | `hero.linea2` | Lo de abajo | (igual) | Ídem. | aprobada |
| / | `src/content/consultora.ts` | `hero.linea2em` | trabaja. | (igual) | Ídem. | aprobada |
| / | `src/content/consultora.ts` | `hero.lema` | Consultoría de IA y automatización | Lo que ve tu cliente | Rótulo de puerta del hero (§3.1, CA-15, decisión 5), en el sitio del lema, junto a «Superficie». El lema era otra descripción del sitio (A45: una sola, la de `site.descripcion`). | aprobada |
| / | `src/content/consultora.ts` | `hero.parrafos[0]` | Arriba está lo que ve tu cliente: la web, el WhatsApp, la atención. Debajo, lo que lo hace funcionar: facturas, citas, avisos y datos que se mueven solos. | Montamos lo que se ve y lo que va debajo. Arriba, lo que ve tu cliente: la web, la tienda online y la ficha de Google de tu negocio. Debajo, lo que lo hace funcionar, montado a tu medida: automatizaciones, asistentes con IA y programas de gestión. | La promesa (§3.1). A06, A01, A08 (A); A22, A11, A28, A23 (B, «a tu medida»). Filtro 4: daba por hecho WhatsApp y atención (CA-9). Filtro 2: «facturas que se mueven solas» rozaba A16 (C). | aprobada |
| / | `src/content/consultora.ts` | `hero.parrafos[1]` | Primero miramos dónde se te van las horas. Luego montamos lo que te las devuelve, con los programas que ya usas y a tu nombre. | Primero nos cuentas qué quieres mejorar y miramos cómo trabajas. Luego te damos una propuesta por escrito, y cada fase se paga cuando la ves funcionando. | A56, A30 (procedimiento confirmado, D-035). Filtro 4: daba por hecho que el dolor es el tiempo y que hay programas (§3.1, CA-9). | aprobada |
| / | `src/content/consultora.ts` | `hero.especialidades[0]` | IA | Web | Por puertas: primero lo que ve tu cliente. A06. | aprobada |
| / | `src/content/consultora.ts` | `hero.especialidades[1]` | Automatización | Tienda online | A01 (nombre recomendado). | aprobada |
| / | `src/content/consultora.ts` | `hero.especialidades[2]` | Software a medida | Ficha de Google | A08. | aprobada |
| / | `src/content/consultora.ts` | `hero.especialidades[3]` | Desarrollo web | Automatización e IA | A22 (B), A11 (A). | aprobada |
| / | `src/content/consultora.ts` | `hero.especialidades[4]` | (no hay) | Software a medida | A23 (B: «a medida»). | aprobada |
| / | `src/content/consultora.ts` | `hero.ctaPrincipal` | Solicitar diagnóstico gratuito | Pedir una propuesta | Nombre de la puerta 1 (P-11). CA-17. A80 corregida: sin «gratuito». A30. | aprobada |
| / | `src/content/consultora.ts` | `hero.ctaSecundario` | Ver qué hay debajo | (igual) | Lleva a `#servicios` (concepto D-014). | aprobada |
| / | `src/components/sections/Hero.tsx` | `aria-label` de los objetos | Lo que ve tu cliente | (igual) | Es la puerta 1 (§3.1). | aprobada |
| / | `src/components/sections/Hero.tsx` | `aria-label` de las paradas | Debajo de {n} | (igual) | Accesibilidad. `{n}` = `rotuloCorto` del flujo. | aprobada |
| / | `src/components/sections/Hero.tsx` | `jsx · rótulo` | Ejemplo | (igual) | D-019, no se toca (§3.8). | aprobada |
| / | `src/components/sections/Hero.tsx` | `jsx · botón de pausa` | Pausar ejemplos | (igual) | D-019 (WCAG 2.2.2). | aprobada |
| / | `src/components/sections/Hero.tsx` | `jsx · botón de pausa, pulsado` | Seguir con los ejemplos | (igual) | Ídem. | aprobada |
| / | `src/components/sections/Hero.tsx` | `textoLectura` | Ejemplo: {n} | (igual) | Lo que leen los lectores de pantalla; lleva «Ejemplo» (D-019). | aprobada |
| / | `src/components/sections/Hero.tsx` | `aria-label` del tirador | Bajar la superficie para ver más instalación | (igual) | Interfaz del concepto (D-014). | aprobada |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[0]` | ¿Tenéis hueco el jueves por la tarde? | (igual) | Dentro del ejemplo del hero (D-019, CA-7). Da a entender A11 y A12. | aprobada |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[0].corto` | ¿Hueco el jueves? | (igual) | Forma corta de móvil (§6). | aprobada |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[1]` | Pagar · Bizum | (igual) | Ejemplo. A02 (Bizum es A). | aprobada |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[2]` | Reseña nueva | (igual) | Ejemplo. A08. | aprobada |
| / | `src/components/sections/Hero.tsx` | `Tarjeta[3]` | Escríbenos | (igual) | Ejemplo. A29. | aprobada |
| / | `src/content/hero.ts` | `flujos[0].rotulo` | WhatsApp · 23:40 | (igual) | Ejemplo rotulado (D-019): la hora es del ejemplo, no una cifra (CA-8 la excluye con `data-ejemplo`). | aprobada |
| / | `src/content/hero.ts` | `flujos[0].rotulo.corto` | WhatsApp | (igual) | Forma corta (§6). | aprobada |
| / | `src/content/hero.ts` | `flujos[0].lectura[0]` | 23:40 · «¿Tenéis hueco el jueves?» | (igual) | Ejemplo (D-019). | aprobada |
| / | `src/content/hero.ts` | `flujos[0].lectura[1]` | contesta el agente | (igual) | Ejemplo: en presente dentro de la escena (§3.2, B). A12. | aprobada |
| / | `src/content/hero.ts` | `flujos[0].lectura[2]` | cita el jueves a las 17:30 | (igual) | Ejemplo. A61. | aprobada |
| / | `src/content/hero.ts` | `flujos[0].lectura[3]` | recordatorio la víspera. | (igual) | Ejemplo. A61. | aprobada |
| / | `src/content/hero.ts` | `flujos[0].paradas[0].texto` | Agente contesta | (igual) | Parada del ejemplo (servicio 05). A12 (B, dentro del ejemplo). | aprobada |
| / | `src/content/hero.ts` | `flujos[0].paradas[1].texto` | Cita en tu agenda | (igual) | Servicio 04, clave «citas». A61. | aprobada |
| / | `src/content/hero.ts` | `flujos[0].paradas[2].texto` | Recordatorio la víspera | (igual) | Servicio 04, clave «Recordatorios». A61. | aprobada |
| / | `src/content/hero.ts` | `flujos[1].rotulo` | Tu tienda | (igual) | A01. | aprobada |
| / | `src/content/hero.ts` | `flujos[1].rotulo.corto` | Tu tienda | (igual) | Forma corta (§6). | aprobada |
| / | `src/content/hero.ts` | `flujos[1].lectura[0]` | Pago con Bizum | (igual) | Ejemplo. A02. | aprobada |
| / | `src/content/hero.ts` | `flujos[1].lectura[1]` | factura emitida sola | pedido en tu panel | A16 es C: la tienda no emite facturas (§3.7). Decisión 1. A01. | aprobada |
| / | `src/content/hero.ts` | `flujos[1].lectura[2]` | aviso de qué reponer. | (igual) | Ejemplo. A01. | aprobada |
| / | `src/content/hero.ts` | `flujos[1].paradas[0].texto` | Cobro con tarjeta o Bizum | (igual) | Servicio 02, clave «Bizum». A02. | aprobada |
| / | `src/content/hero.ts` | `flujos[1].paradas[1].texto` | Factura emitida | Pedido en tu panel | A16 (C) sale (§3.7). Decisión 1. A01. | aprobada |
| / | `src/content/hero.ts` | `flujos[1].paradas[1].servicio` | 04 | 02 | Decisión 1: la parada nueva sale de «Tienda online». | aprobada |
| / | `src/content/hero.ts` | `flujos[1].paradas[1].clave` | facturas | Panel en el móvil | Decisión 1: la clave está en el `incluye` de `servicios.ts` 02 (`hero.test.ts`). | aprobada |
| / | `src/content/hero.ts` | `flujos[1].paradas[2].texto` | Aviso de qué reponer | (igual) | Servicio 02, clave «reponer». A01. | aprobada |
| / | `src/content/hero.ts` | `flujos[2].rotulo` | Google | (igual) | A08. | aprobada |
| / | `src/content/hero.ts` | `flujos[2].rotulo.corto` | Google | (igual) | Forma corta (§6). | aprobada |
| / | `src/content/hero.ts` | `flujos[2].lectura[0]` | Reseña de cinco estrellas | (igual) | Ejemplo: la cifra va dentro de `data-ejemplo` (CA-8). | aprobada |
| / | `src/content/hero.ts` | `flujos[2].lectura[1]` | respuesta con tu tono | (igual) | Ejemplo. A17 (B, dentro de la escena). | aprobada |
| / | `src/content/hero.ts` | `flujos[2].lectura[2]` | entra en el informe del mes. | (igual) | Ejemplo. A17, A22. | aprobada |
| / | `src/content/hero.ts` | `flujos[2].paradas[0].texto` | Respuesta a la reseña | (igual) | Servicio 06, clave «reseña». A17. | aprobada |
| / | `src/content/hero.ts` | `flujos[2].paradas[1].texto` | Ficha de Google al día | (igual) | Servicio 03, clave «Ficha de Google». A08 (a mano). | aprobada |
| / | `src/content/hero.ts` | `flujos[2].paradas[2].texto` | Informe del mes | (igual) | Servicio 04, clave «Informes». A22. | aprobada |
| / | `src/content/hero.ts` | `flujos[3].rotulo` | Tu web | (igual) | A06. | aprobada |
| / | `src/content/hero.ts` | `flujos[3].rotulo.corto` | Tu web | (igual) | Forma corta (§6). | aprobada |
| / | `src/content/hero.ts` | `flujos[3].lectura[0]` | La web vieja | (igual) | Ejemplo (rotulado, §3.1 lo admite). A06. | aprobada |
| / | `src/content/hero.ts` | `flujos[3].lectura[1]` | se rescata sin perder Google | (igual) | Ejemplo. A06 (rescate y 301). | aprobada |
| / | `src/content/hero.ts` | `flujos[3].lectura[2]` | y queda vigilada cada día. | y se cambia cuando lo pidas. | A19 es C (§3.7, CA-3). Decisión 1. A07. | aprobada |
| / | `src/content/hero.ts` | `flujos[3].paradas[0].texto` | Se saca la web vieja | (igual) | Servicio 01, clave «Rescate de webs viejas». A06. | aprobada |
| / | `src/content/hero.ts` | `flujos[3].paradas[1].texto` | Sin perder Google | (igual) | Servicio 01, clave «Redirecciones 301». A06. | aprobada |
| / | `src/content/hero.ts` | `flujos[3].paradas[2].texto` | Vigilada cada día | Cambios cuando los pidas | A19 (C) sale (§3.7). Decisión 1. A07. | aprobada |
| / | `src/content/hero.ts` | `flujos[3].paradas[2].clave` | Vigilancia de caídas | Cambios de contenido | Decisión 1: la clave sigue en el `incluye` de `servicios.ts` 07 (`hero.test.ts`). | aprobada |
| / | `src/content/servicios.ts` | `servicios[0].nombre` | Diseño y desarrollo web | (igual) | A06. | aprobada |
| / | `src/content/servicios.ts` | `servicios[0].descripcion` | Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Es tuya, se puede cambiar y no paga cuota a nadie por seguir existiendo. Y si ya tienes una en WordPress, Wix o Webnode que va lenta o a la que nadie tiene las claves, se saca de ahí sin perder lo que ya te posiciona en Google. | Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima, y a tu nombre. Y si ya tienes una en WordPress, Wix o Webnode que va lenta o a la que nadie tiene las claves, se saca de ahí sin perder lo que ya te posiciona en Google. | A06, A31. Sale «no paga cuota a nadie» (A33, C: condición) y «se puede cambiar» (A55, B: no hay editor para el cliente). | aprobada |
| / | `src/content/servicios.ts` | `servicios[0].incluye[0]` | Diseño propio | Diseño a medida | Decisión 3: sin «propio» en lo que se enseña (§3.4 regla 1). A06. | aprobada |
| / | `src/content/servicios.ts` | `servicios[0].incluye[1]` | Código sin constructores | (igual) | A06. | aprobada |
| / | `src/content/servicios.ts` | `servicios[0].incluye[2]` | Textos incluidos | (igual) | A24. | aprobada |
| / | `src/content/servicios.ts` | `servicios[0].incluye[3]` | Logotipo redibujado | (igual) | A24. | aprobada |
| / | `src/content/servicios.ts` | `servicios[0].incluye[4]` | Avisos legales | (igual) | A24 corregida: se redactan y se revisan contigo. | aprobada |
| / | `src/content/servicios.ts` | `servicios[0].incluye[5]` | Rescate de webs viejas | (igual) | A06. Clave del hero. | aprobada |
| / | `src/content/servicios.ts` | `servicios[0].incluye[6]` | Redirecciones 301 | (igual) | A06. Clave del hero; «301» es un código, no una cifra (no la pinta ninguna ruta de esta rama). | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].nombre` | Tienda online | (igual) | A01. Nombre recomendado (P-11). | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].descripcion` | Te la entregamos con el catálogo subido y cobrando desde el primer día. Después la llevas tú desde el móvil, y te dice qué reponer y qué se mira sin venderse. | Te la entregamos con el catálogo subido y cobrando desde el primer día. Después la llevas tú desde el móvil, y te avisa de qué reponer. | A25, A01. Sale «qué se mira sin venderse»: A26 sigue `por confirmar` (spec §3.3). | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].incluye[0]` | Catálogo cargado | (igual) | A25. | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].incluye[1]` | Tarjeta y Bizum | (igual) | A02. | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].incluye[2]` | Recogida y reparto local | Recogida en tienda | A02 corregida: la recogida es A; el reparto local es B (A64) y no va en lo que incluye. | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].incluye[3]` | Pedidos por WhatsApp | (quitar) | A64: B, nadie lo ha visto funcionar (D-035). | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].incluye[4]` | Panel en el móvil | (igual) | A01. Clave nueva del hero (decisión 1). | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].incluye[5]` | Instagram y Google Shopping | (quitar) | A53 corregida: B, conectarlo es trabajo a medida («podemos conectar», no «se sincroniza»). | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].incluye[6]` | Páginas legales | (igual) | A25. | aprobada |
| / | `src/content/servicios.ts` | `servicios[1].enlace.label` | Ver cómo funciona | (igual) | Lleva a `/herramientas/#tiendas` (A01). | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].nombre` | Aparecer en Google | (igual) | A08. | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].descripcion` | La mitad de los negocios de aquí se buscan por el móvil a dos calles de distancia. Eso se trabaja con la ficha de Google, las reseñas y una web que cargue rápido de verdad. | Que te encuentren en Google se trabaja a mano: con la ficha de Google, las reseñas y una web que cargue rápido de verdad. | A08 corregida (a mano), A09. Sale la cifra sin fuente (A71, §3.2 regla 4). | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].incluye[0]` | Ficha de Google | (igual) | A08. Clave del hero. | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].incluye[1]` | SEO local | (igual) | A08. | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].incluye[2]` | Reseñas | (igual) | A08. | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].incluye[3]` | Datos estructurados | (igual) | A09. | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].incluye[4]` | Core Web Vitals | (igual) | A09. | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].incluye[5]` | Medición sin cookies | (quitar) | A54 sigue `por confirmar` (spec §3.3). | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].enlace.href` | /herramientas/#ficha-google | (quitar) | §3.7: el enlace a la ficha de Google sale con su entrada (A20, C). Sale el enlace entero; su «Ver cómo funciona» se queda en el 02. | aprobada |
| / | `src/content/servicios.ts` | `servicios[2].enlace.label` | Ver cómo funciona | (quitar) | §3.7, A20 (C), CA-2: sale con su `href` (el enlace entero). | aprobada |
| / | `src/content/servicios.ts` | `servicios[3].nombre` | Automatización de procesos | (igual) | A22. | aprobada |
| / | `src/content/servicios.ts` | `servicios[3].descripcion` | Presupuestos, citas, recordatorios, facturas, informes. Lo que hoy copias de un sitio a otro a mano, funcionando solo mientras tú atiendes. | Presupuestos, citas, recordatorios, informes: si algo se copia a mano de un sitio a otro, podemos montar que funcione solo mientras tú atiendes. | A22 (B, «podemos montar»). Filtro 4: «lo que hoy copias» daba por hecho cómo trabaja. Salen «facturas» (A16, C). Sigue «citas», clave del hero. | aprobada |
| / | `src/content/servicios.ts` | `servicios[3].incluye[0]` | Reservas y citas | (igual) | A18, A61 (B, como sustantivo). | aprobada |
| / | `src/content/servicios.ts` | `servicios[3].incluye[1]` | Recordatorios | (igual) | A22. Clave del hero. | aprobada |
| / | `src/content/servicios.ts` | `servicios[3].incluye[2]` | Facturación | (quitar) | A16 (C): no se emiten facturas (§3.7). | aprobada |
| / | `src/content/servicios.ts` | `servicios[3].incluye[3]` | Conexión entre programas | (igual) | A22. | aprobada |
| / | `src/content/servicios.ts` | `servicios[3].incluye[4]` | Informes automáticos | (igual) | A22. Clave del hero. | aprobada |
| / | `src/content/servicios.ts` | `servicios[4].nombre` | Agentes y chatbots con IA | (igual) | A11, A12. | aprobada |
| / | `src/content/servicios.ts` | `servicios[4].descripcion` | Atención en la web, en WhatsApp y al teléfono. Contestan lo de siempre, cogen la cita y te pasan solo lo que de verdad necesita que estés tú. | Un asistente en tu web que contesta lo de siempre, coge la cita y te pasa lo que necesita que estés tú. Y, a tu medida, también en WhatsApp. | A11 (A, presente); A12 (B, «a tu medida»). Sale «al teléfono» (A14, C; §3.7). Sigue «WhatsApp», clave del hero. | aprobada |
| / | `src/content/servicios.ts` | `servicios[4].incluye[0]` | Web y WhatsApp | Web, y WhatsApp a medida | A11 (A), A12 (B: «a tu medida», §3.2 regla 1). Sigue conteniendo «WhatsApp» (clave del hero). | aprobada |
| / | `src/content/servicios.ts` | `servicios[4].incluye[1]` | Fuera de horario | (igual) | A11 («a cualquier hora»). | aprobada |
| / | `src/content/servicios.ts` | `servicios[4].incluye[2]` | Reserva de cita | (igual) | A11. | aprobada |
| / | `src/content/servicios.ts` | `servicios[4].incluye[3]` | Filtra y te avisa | (quitar) | A28: B, y en presente de producto (§3.2 regla 1). | aprobada |
| / | `src/content/servicios.ts` | `servicios[4].incluye[4]` | Habla como tu negocio | (quitar) | A28: B, y en presente de producto (§3.2 regla 1). | aprobada |
| / | `src/content/servicios.ts` | `servicios[5].nombre` | Marketing y contenido con IA | (igual) | A17. | aprobada |
| / | `src/content/servicios.ts` | `servicios[5].descripcion` | Lo que se puede dejar funcionando solo: el correo a tus clientes, las fichas de producto, los textos de la web y la respuesta a cada reseña que entra. | (igual) | A17 (B, ya en «se puede»), A24. | aprobada |
| / | `src/content/servicios.ts` | `servicios[5].incluye[0]` | Email a clientes | (igual) | A17. | aprobada |
| / | `src/content/servicios.ts` | `servicios[5].incluye[1]` | Fichas de producto | (igual) | A17. | aprobada |
| / | `src/content/servicios.ts` | `servicios[5].incluye[2]` | Respuesta a reseñas | (igual) | A17. Clave del hero. | aprobada |
| / | `src/content/servicios.ts` | `servicios[5].incluye[3]` | Textos de la web | (igual) | A24. | aprobada |
| / | `src/content/servicios.ts` | `servicios[5].incluye[4]` | Avisos automáticos | (igual) | A22. | aprobada |
| / | `src/content/servicios.ts` | `servicios[6].nombre` | Mantenimiento y soporte | (igual) | A07. | aprobada |
| / | `src/content/servicios.ts` | `servicios[6].descripcion` | Cambiar la carta, subir precios, abrir los domingos de verano. Se hace y ya está: sin abrir una incidencia, sin esperar tres semanas y sin que se caiga nada por el camino. | Cambiar la carta, subir precios, abrir los domingos de verano: nos lo dices y lo cambiamos. También hacemos las copias de seguridad y las actualizaciones. | A07. Salen el reclamo de condición (A33) y «tres semanas» (A71, cifra sin fuente). | aprobada |
| / | `src/content/servicios.ts` | `servicios[6].incluye[0]` | Cambios de contenido | (igual) | A07. Clave nueva del hero (decisión 1). | aprobada |
| / | `src/content/servicios.ts` | `servicios[6].incluye[1]` | Copias de seguridad | (igual) | A07. | aprobada |
| / | `src/content/servicios.ts` | `servicios[6].incluye[2]` | Actualizaciones | (igual) | A07. | aprobada |
| / | `src/content/servicios.ts` | `servicios[6].incluye[3]` | Vigilancia de caídas | (quitar) | A19 (C), §3.7, CA-2. | aprobada |
| / | `src/content/servicios.ts` | `servicios[6].incluye[4]` | Te lo llevas cuando quieras | Te lo llevas entero | A31 (procedimiento, D-035; salvo la tienda, A60). «Cuando quieras» es un reclamo de condición (A33, regla 2). | aprobada |
| / | `src/content/servicios.ts` | `servicios[6].enlace.href` | /herramientas/#vigilancia | (quitar) | A19 (C), §3.7, CA-2. Sale el enlace entero. | aprobada |
| / | `src/content/servicios.ts` | `servicios[6].enlace.label` | Ver cómo funciona | (quitar) | A19 (C), §3.7, CA-2: sale con su `href` (el enlace entero). | aprobada |
| / | `src/content/consultora.ts` | `problemas.titulo` | ¿Cuánto tiempo pierde tu negocio en tareas que podrían hacerse solas? | ¿Te pasa alguna de estas? | Filtro 4: daba por hecho que el dolor es el tiempo (§3.1, CA-9). Las situaciones van con «si…». | aprobada |
| / | `src/content/consultora.ts` | `problemas.items[0].titulo` | Copias datos de un programa a otro. | Si copias a mano lo mismo en varios sitios. | Filtro 4: como situación, con «si» (§3.1). | aprobada |
| / | `src/content/consultora.ts` | `problemas.items[0].texto` | Facturas, presupuestos, registros: el mismo dato escrito tres veces, a mano. | Facturas, presupuestos o registros: si el mismo dato se escribe a mano en varios sitios, se puede conectar para que se escriba solo. | A22 (B, «se puede»). Sale «tres veces» (A71, cifra sin fuente). | aprobada |
| / | `src/content/consultora.ts` | `problemas.items[1].titulo` | Los mensajes llegan cuando no puedes contestar. | Si te escriben cuando no puedes contestar. | Filtro 4 (§3.1). | aprobada |
| / | `src/content/consultora.ts` | `problemas.items[1].texto` | Consultas fuera de horario, WhatsApps sin responder y clientes que acaban en otro sitio. | Fuera de horario o con las manos ocupadas: un asistente en tu web puede contestar lo de siempre, recoger el contacto y pasarte lo demás. | A11 (A). Filtro 4: daba por hecho WhatsApp (CA-9). Sale «clientes que acaban en otro sitio», que no podemos citar. | aprobada |
| / | `src/content/consultora.ts` | `problemas.items[2].titulo` | Tus programas no se hablan entre ellos. | Si usas programas que no se hablan entre ellos. | Filtro 4: daba por hecho que hay programas (CA-9). | aprobada |
| / | `src/content/consultora.ts` | `problemas.items[2].texto` | El calendario por un lado, las facturas por otro y una hoja de cálculo en medio. | La agenda por un lado y las facturas por otro: se pueden conectar para que lo que entra en uno llegue al otro. | A22 (B, «se pueden»). Filtro 4: sale la hoja de cálculo dada por hecho (CA-9). | aprobada |
| / | `src/content/consultora.ts` | `problemas.cierre` | Eso es lo de abajo. Lo encontramos y lo montamos para que trabaje solo. | Eso es lo de abajo. Si te pasa alguna, miramos tu caso y te decimos qué se puede montar. | A56. «Lo montamos para que trabaje solo» prometía en presente lo que es B (A22). | aprobada |
| / | `src/components/consultora/Problemas.tsx` | `jsx · enlace del cierre` | Ver cómo | (igual) | Lleva a `#servicios`. | aprobada |
| / | `src/content/consultora.ts` | `servicios.titulo` | Cuatro líneas de trabajo. | (igual) | A76: sale de `consultora.servicios.lineas` (4). | aprobada |
| / | `src/content/consultora.ts` | `servicios.em` | Una parte se ve, otra trabaja debajo. | (igual) | Concepto (D-014). | aprobada |
| / | `src/content/consultora.ts` | `servicios.intro` | Cada línea tiene una parte que ve tu cliente y otra que trabaja por debajo. Se contratan por separado o juntas. | Cada línea tiene una parte que ve tu cliente y otra que trabaja por debajo. | Sale «Se contratan por separado o juntas»: es una condición sin fila en el Anexo (§3.2 reglas 2 y 6). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[0].nombre` | IA y automatización de procesos | (igual) | A22, A15. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[0].descripcion` | Lo que hoy copias de un sitio a otro a mano, funcionando solo mientras tú atiendes. Conectamos los programas que ya usas y metemos IA solo donde ahorra trabajo de verdad. | Si algo se hace a mano y se repite, podemos montar que funcione solo mientras tú atiendes: conectar los programas que uses y meter IA solo donde ahorre trabajo de verdad. | A22 (B, «podemos montar»). Filtro 4: «lo que hoy copias» y «los programas que ya usas» daban por hecho cómo trabaja. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[0].incluye[0]` | Facturas que se leen solas | Lectura de facturas | A15 (B): en presente de producto (§3.2 regla 1); pasa a sustantivo. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[0].incluye[1]` | Presupuestos en un clic | (igual) | A15 (B, como sustantivo). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[0].incluye[2]` | Programas conectados | (igual) | A22. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[0].incluye[3]` | Informes y avisos automáticos | (igual) | A22. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[0].enlace.label` | Ver ejemplos | (igual) | Lleva a `/#soluciones`, que son ejemplos (A15). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[1].nombre` | Agentes y asistentes con IA | (igual) | A11, A12. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[1].descripcion` | Contesta en tu web y en WhatsApp cuando tú no puedes, mira tus datos reales en vez de inventar y te pasa la conversación cuando no sabe. Hace solo lo que le dejes hacer. | Un asistente en tu web que contesta lo de siempre, recoge el contacto y te pasa la conversación cuando no sabe. Y, a tu medida, podemos montarlo también en WhatsApp, con tus datos reales y solo con lo que le dejes hacer. | A11 (A, presente); A12, A13, A28 (B, «podemos montarlo»). §3.2 regla 1: lo B no va en presente de producto. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[0]` | Asistente en tu web | (igual) | A11. Nombre recomendado (P-11). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[1]` | Agente de WhatsApp | (igual) | A12 (B, como sustantivo). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[2]` | Reservas y citas | (igual) | A11 (cita), A18 (B). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[3]` | Primer contacto con clientes | Primer contacto con clientes, a tu medida | A28 (B): se quitan «Filtra y te avisa» y «Habla como tu negocio» por la misma razón, así que este lleva «a tu medida» (§3.2 regla 1). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[1].incluye[4]` | Paso a una persona | (igual) | A11. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[1].enlace.label` | Ver un agente en acción | Ver un ejemplo | «En acción» da a entender que funciona; lleva a una maqueta «Ejemplo» (A12, B). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[2].nombre` | Software a medida | (igual) | A23. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[2].descripcion` | Cuando ningún programa encaja con cómo trabajas, lo escribimos para ti: un panel, una agenda o la gestión de pedidos, que llevas desde el móvil. El código, en un repositorio a tu nombre. | Si ningún programa encaja con cómo trabajas, podemos escribirlo para ti: un panel, una agenda o la gestión de pedidos, para llevarlo desde el móvil. El código queda en un repositorio a tu nombre. | A23 (B, «podemos»), A31 (procedimiento, D-035). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[2].incluye[0]` | Paneles de gestión | (igual) | A23. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[2].incluye[1]` | Pedidos e inventario | (igual) | A23. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[2].incluye[2]` | Reservas y agenda | (igual) | A23. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[2].incluye[3]` | Conexión con lo que ya tienes | (igual) | A23. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[2].enlace.label` | Ver nuestro software | (quitar) | Llevaba a la tienda (`/herramientas/#tiendas`), que no es software a medida (A23). Sale el enlace entero. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[3].nombre` | Web y tienda online | (igual) | A06, A01. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[3].descripcion` | Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Rápida, tuya y preparada para que te encuentren en Google a dos calles de distancia. | Una web escrita a mano para tu negocio, no un tema comprado con tu logo encima. Rápida, a tu nombre y preparada para que te encuentren en Google. Y si quieres vender por internet, la tienda online. | A06, A09, A08, A31, A01. Sale «a dos calles de distancia» (A71, cifra sin fuente). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[0]` | Diseño propio, sin constructores | Diseño a medida, sin constructores | Decisión 3: sin «propio» (§3.4 regla 1). A06. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[1]` | Tienda online | (igual) | A01. Nombre recomendado (P-11). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[2]` | Ficha de Google y SEO local | (igual) | A08 (a mano). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[3]` | Formularios y reservas | Formulario de contacto | A29 (nombre recomendado, P-11). Las reservas van aparte: son B (A18) y no se mezclan con un A en la misma etiqueta (§3.2 regla 1). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[5]` | (no hay) | Reservas a tu medida | A18 (B, «a tu medida»): puerta 1 (§3.1). | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[3].incluye[4]` | Mantenimiento | (igual) | A07. | aprobada |
| / | `src/content/consultora.ts` | `servicios.lineas[3].enlace.label` | Ver plantillas | (igual) | Lleva a `/plantillas/` (A57). | aprobada |
| / | `src/components/sections/Servicios.tsx` | `aria-label` de las paradas | Lo que incluye {n} | (igual) | Accesibilidad. `{n}` = nombre de la línea. | aprobada |
| / | `src/content/consultora.ts` | `soluciones.titulo` | Tecnología aplicada | (igual) | Titular: no afirma nada; lo que enseña la sección es B y va como ejemplo (A15). | aprobada |
| / | `src/content/consultora.ts` | `soluciones.em` | a problemas reales. | a problemas habituales. | «Reales» sugiere casos de clientes; son ejemplos con datos inventados (A15, A59; §3.2 regla 3). | aprobada |
| / | `src/content/consultora.ts` | `soluciones.intro` | Descubre algunas de las soluciones que podemos construir para tu negocio. | (igual) | B en condicional («podemos construir»). A15, A12, A61. | aprobada |
| / | `src/components/consultora/Soluciones.tsx` | `jsx · rótulo del aviso` | Aviso | (igual) | Interfaz. | aprobada |
| / | `src/content/consultora.ts` | `soluciones.aviso` | Son ejemplos de lo que se puede montar, con datos inventados. No son clientes ni resultados medidos. | (igual) | A15, A59 (§3.2 regla 3). | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[0].titulo` | Contesta aunque estés con otro cliente | Que se conteste aunque estés con otro cliente | Fuera de la maqueta, B no va en presente de producto (§3.2 regla 1): pasa a lo que se busca. A11, A12. | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[0].texto` | Un agente en tu web y en WhatsApp que responde lo de siempre, recoge los datos y te deja la consulta ordenada. | Un asistente en tu web, y si lo quieres también en WhatsApp, que responda lo de siempre, recoja los datos y te deje la consulta ordenada. | A11 (web, A); A12 (WhatsApp, B, «si lo quieres»). Subjuntivo: es lo que podemos montar, no un producto. | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[0].ideal` | Para alojamientos, clínicas y empresas de servicios. | (igual) | Sectores de D-006. | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[1].titulo` | La factura llega y se apunta sola | Que la factura se apunte sola | §3.2 regla 1. A15 (B). | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[1].texto` | Lee la factura, saca proveedor, fecha e importe, y la deja clasificada donde la busca tu gestoría. | Podemos montar que se lea cada factura que te llega, se saquen proveedor, fecha e importe y quede clasificada donde la necesites. | A15 (B, «podemos montar»). Filtro 4: daba por hecho que hay gestoría. | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[1].ideal` | Para asesorías, comercios y pymes. | Para asesorías, comercios y negocios pequeños. | Filtro 1: «pymes» es jerga para el comprador (§3.1). | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[2].titulo` | Las cuentas, con un audio | (igual) | A15 (B), sin verbo en presente. | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[2].texto` | Dices «vendí tres cajas a 40 euros» en un mensaje de voz y queda apuntado. Luego lo preguntas igual. | Podemos montar que digas lo que has vendido en un mensaje de voz y quede apuntado, y que luego lo preguntes igual. | A15 (B, «podemos montar»). Sale la cifra de ejemplo fuera de la maqueta (A78; no cuadraba con la maqueta, que dice otra venta). | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[2].ideal` | Para autónomos y pequeños negocios. | (igual) | Comprador (§3.1). | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[3].titulo` | Citas que se piden y se recuerdan solas | Que las citas se pidan y se recuerden solas | §3.2 regla 1. A61 (B). | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[3].texto` | El cliente ve los huecos libres, reserva, recibe la confirmación y un recordatorio el día antes. | Podemos montar una agenda en la que tu cliente vea los huecos libres y reserve, y que le mande la confirmación y un recordatorio el día antes. | A61 (B, «podemos montar»). | aprobada |
| / | `src/content/consultora.ts` | `soluciones.casos[3].ideal` | Para clínicas, alojamientos y empresas de servicios. | (igual) | Sectores de D-006. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Marco` · rótulo | Ejemplo | (igual) | D-019, no se toca (§3.8). | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Marco` · `aria-label` | Ejemplo: {n} | (igual) | Lleva «Ejemplo» (D-019). `{n}` = la `descripcion` de cada maqueta. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · `titulo` | WhatsApp · 23:40 | (igual) | Dentro de la maqueta «Ejemplo»: B en presente dentro de la escena (§3.2). A12. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · `descripcion` | una clienta pregunta por un hueco el jueves y el agente le ofrece dos horas, reserva la que elige y crea la cita en la agenda. | (igual) | Ejemplo (D-019). A12, A61. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · mensaje 1 | ¿Tenéis hueco el jueves por la tarde? | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · mensaje 2 | Sí: el jueves tengo libre a las 17:30 y a las 18:15. ¿Cuál te va mejor? | (igual) | Ejemplo: las horas van dentro de `data-ejemplo` (CA-8). | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · mensaje 3 | A las 17:30 | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · mensaje 4 | Reservado. Te escribo la víspera para recordártelo. | (igual) | Ejemplo. A61. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Chat` · estado | Cita creada en la agenda · jueves 17:30 | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · `titulo` | Facturas · bandeja de entrada | (igual) | Ejemplo. A15. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · `descripcion` | una factura en PDF de la que se extraen proveedor, fecha, base, IVA y total, y se clasifica como suministros pendiente de revisar. | (igual) | Ejemplo. A15 (leer y clasificar, no emitir: A16). | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Proveedor | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | Suministros Ejemplo, S.L. | (igual) | Ejemplo: empresa inventada (A59). | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Fecha | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | 14/03/2026 | (igual) | Ejemplo (CA-8 lo excluye). | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Base · IVA 21 % | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | 100,00 € · 21,00 € | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Total | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | 121,00 € | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · campo | Categoría | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · valor | Suministros | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Factura` · marca | Pendiente de revisar | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · `titulo` | Nota de voz | (igual) | Ejemplo. A15. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · `descripcion` | un mensaje de voz de un autónomo se transcribe y se registra como una venta de 120 euros en efectivo. | (igual) | Ejemplo. A15. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · transcripción | «Hoy, tres entradas, ciento veinte euros, en efectivo.» | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · registro | Venta | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · registro | 3 uds. | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · registro | 120,00 € | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · registro | Efectivo | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · consulta | «¿Cuánto llevo vendido esta semana?» | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Voz` · respuesta | → lo lee de tu registro | (igual) | Ejemplo. A13 (B, dentro de la escena). | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · `titulo` | Agenda · semana | (igual) | Ejemplo. A61. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · `descripcion` | una agenda semanal con huecos libres y ocupados, una solicitud nueva el jueves y la confirmación con recordatorio enviada. | (igual) | Ejemplo. A61. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · días | "L", "M", "X", "J", "V" | (igual) | Ejemplo: los días de la agenda, tal cual están en `dias`. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · aviso 1 | Solicitud nueva · jueves, 2.º hueco | (igual) | Ejemplo. | aprobada |
| / | `src/components/consultora/Maquetas.tsx` | `Citas` · aviso 2 | Confirmada y recordatorio enviado | (igual) | Ejemplo. A61. | aprobada |
| / | `src/components/sections/Proceso.tsx` | `Titular` · `arriba` | Un sondeo, | (igual) | Concepto (D-014). | aprobada |
| / | `src/components/sections/Proceso.tsx` | `Titular` · `em` | de la superficie al fondo. | (igual) | Ídem. | aprobada |
| / | `src/components/sections/Proceso.tsx` | `caption` | El proceso, paso a paso: lo que ves tú y lo que hacemos por debajo | (igual) | Accesibilidad. | aprobada |
| / | `src/components/sections/Proceso.tsx` | `th` | Paso | (igual) | Interfaz. | aprobada |
| / | `src/components/sections/Proceso.tsx` | `th` | Lo que ves tú | (igual) | Interfaz (puertas, §3.1). | aprobada |
| / | `src/components/sections/Proceso.tsx` | `th` | Lo que hacemos por debajo | (igual) | Ídem. | aprobada |
| / | `src/components/sections/Proceso.tsx` | `th` | Dato | (igual) | Interfaz. | aprobada |
| / | `src/content/proceso.ts` | `proceso[0].titulo` | Nos cuentas | (igual) | A56. | aprobada |
| / | `src/content/proceso.ts` | `proceso[0].descripcion` | Cinco minutos de formulario, con tus palabras: a qué te dedicas y qué te gustaría quitarte de encima. Lo que no sepas, déjalo en blanco. | Un formulario corto, con tus palabras: a qué te dedicas y qué te gustaría mejorar. | A35: «cinco minutos» sale hasta cronometrarlo (D-035). «Déjalo en blanco» no es verdad en el formulario corto, que pide todos los campos menos el teléfono. «Mejorar», como el formulario (CA-11). | aprobada |
| / | `src/content/proceso.ts` | `proceso[0].dato` | 5 min | con tus palabras | A35 (C hasta cronometrar). `portada.test.ts` pasa a este dato (T07). | aprobada |
| / | `src/content/proceso.ts` | `proceso[0].vesTu` | Un formulario corto | (igual) | A56. | aprobada |
| / | `src/content/proceso.ts` | `proceso[0].debajo` | Leemos lo que nos cuentas y preparamos las preguntas | (igual) | A56. | aprobada |
| / | `src/content/proceso.ts` | `proceso[1].titulo` | Miramos | (igual) | A56. | aprobada |
| / | `src/content/proceso.ts` | `proceso[1].descripcion` | Hablamos contigo y vemos cómo trabajas: qué programas usas, qué se hace a mano y dónde se van las horas cada semana, en horas y en euros. | Hablamos contigo y vemos cómo trabajas: qué usas, qué se hace a mano y qué te gustaría que funcionara de otra manera. | A56. Filtro 4: daba por hecho programas y horas perdidas (§3.1). Sale «en horas y en euros»: A36 sigue `por confirmar`. | aprobada |
| / | `src/content/proceso.ts` | `proceso[1].dato` | horas y euros | cómo trabajas | A36 `por confirmar`. `portada.test.ts` pasa a este dato (T07). | aprobada |
| / | `src/content/proceso.ts` | `proceso[1].vesTu` | Una conversación, y sigues con lo tuyo | (igual) | A39, A56. | aprobada |
| / | `src/content/proceso.ts` | `proceso[1].debajo` | Tus procesos por dentro: programas, datos y tareas a mano | (igual) | A56: es lo que miramos, no lo que das por hecho. | aprobada |
| / | `src/content/proceso.ts` | `proceso[2].titulo` | Te lo contamos | (igual) | A56. | aprobada |
| / | `src/content/proceso.ts` | `proceso[2].descripcion` | El diagnóstico es tuyo, gratis y sin compromiso: qué montaríamos, en qué orden y por cuánto, por escrito. Si con eso te apañas solo, perfecto. | La propuesta, por escrito: qué montaríamos, en qué orden y cuánto cuesta cada fase. No se cobra, y es tuya: si con ella te apañas solo, perfecto. | Nombre de la puerta 1 (P-11), CA-17. A30; A80 corregida («no se cobra», sin «gratis»); sale «sin compromiso» (A33). | aprobada |
| / | `src/content/proceso.ts` | `proceso[2].dato` | gratis | por escrito | D-035: sin «gratis». A30. `portada.test.ts` pasa a este dato (T07). | aprobada |
| / | `src/content/proceso.ts` | `proceso[2].vesTu` | El diagnóstico, tuyo | La propuesta, tuya | Nombre de la puerta 1 (P-11), CA-17. A30. | aprobada |
| / | `src/content/proceso.ts` | `proceso[2].debajo` | Qué montaríamos, en qué orden y por cuánto | (igual) | A30. | aprobada |
| / | `src/content/proceso.ts` | `proceso[3].titulo` | Construimos | (igual) | A37. | aprobada |
| / | `src/content/proceso.ts` | `proceso[3].descripcion` | Por fases, empezando por lo que más horas te quita. Lo primero que funciona llega en semanas y el resto se va sumando, con el precio de cada fase por escrito antes de empezarla. | Por fases, empezando por lo que más te importa. Lo primero que funciona llega en semanas y el resto se va sumando, con el precio de cada fase por escrito antes de empezarla. | A37, A30 (procedimiento, D-035). Filtro 4: daba por hecho que el dolor son las horas (§3.1). | aprobada |
| / | `src/content/proceso.ts` | `proceso[3].dato` | por fases | (igual) | A37. | aprobada |
| / | `src/content/proceso.ts` | `proceso[3].vesTu` | Lo primero, funcionando en semanas | (igual) | A37. | aprobada |
| / | `src/content/proceso.ts` | `proceso[3].debajo` | Conectamos tus programas y montamos la primera fase | Montamos la primera fase | Filtro 4: daba por hecho que hay programas. A37. | aprobada |
| / | `src/content/proceso.ts` | `proceso[4].titulo` | Lo ves funcionando | (igual) | A30. | aprobada |
| / | `src/content/proceso.ts` | `proceso[4].descripcion` | Cada fase la pruebas con tus datos de verdad antes de pagarla. Si no hace lo que esperabas, se ajusta antes de seguir. | (igual) | A30, A39 (procedimiento, D-035). `/estudio/` lo repite (`comoTrabajamos[2]`). | aprobada |
| / | `src/content/proceso.ts` | `proceso[4].dato` | antes de cada pago | (igual) | A30. | aprobada |
| / | `src/content/proceso.ts` | `proceso[4].vesTu` | Lo pruebas con tus datos | (igual) | A30. | aprobada |
| / | `src/content/proceso.ts` | `proceso[4].debajo` | Pruebas, registro de lo que hace y límites a la IA | Pruebas y, si lleva IA, registro de lo que hace y límites | A13 (B): solo cuando se monta con IA; en condicional. | aprobada |
| / | `src/content/proceso.ts` | `proceso[5].titulo` | Lo mantenemos | (igual) | A07. | aprobada |
| / | `src/content/proceso.ts` | `proceso[5].descripcion` | Sigue funcionando, se actualiza y crece contigo. Y como todo está a tu nombre, si un día te vas, te lo llevas entero. | Sigue funcionando, se actualiza y crece contigo. Y como está a tu nombre, si un día te vas, te lo llevas entero. La tienda online es la excepción: va sobre nuestra plataforma, y su código no es tuyo. | A07; A31 corregida (salvo la tienda); A60. «Todo» no era verdad para la tienda. | aprobada |
| / | `src/content/proceso.ts` | `proceso[5].dato` | a tu nombre | (igual) | A31. | aprobada |
| / | `src/content/proceso.ts` | `proceso[5].vesTu` | Crece contigo | (igual) | A07. | aprobada |
| / | `src/content/proceso.ts` | `proceso[5].debajo` | Copias, actualizaciones y vigilancia de caídas | Copias, actualizaciones y cambios de contenido | A19 (C) sale (§3.7, CA-2). A07. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.titulo` | Ideas que se convierten | Webs de ejemplo por sector | §3.5 (el recomendado) y decisión 4. A57, A59. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.em` | en soluciones. | y lo que ya funciona. | Decisión 4: cubre también las bandas B y C, que son nivel A (A01, A03, A29, A50). | aprobada |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · rótulo del aviso` | Aviso | (igual) | Interfaz. El aviso va dentro de la misma `<section>` (§3.5, CA-6) y no en letra menor: hoy lleva `text-sm` (lo cambia T07). | aprobada |
| / | `src/content/consultora.ts` | `proyectos.aviso` | Nada de esto es un trabajo de cliente. Las plantillas son webs de negocios inventados y las herramientas son software propio del estudio, que se enseña funcionando con datos de ejemplo. | Nada de esto es trabajo para un cliente. Los negocios de estas webs son inventados, y la tienda, el informe y el formulario los hemos construido nosotros y se enseñan con datos de ejemplo. | A59 (D-007, §3.5), A50 corregida («lo construimos nosotros», solo para piezas A: A01, A03, A29). Sale «software propio» (CA-1, §3.8). | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].titulo` | Webs y ecommerce | Plantillas por sector | §3.5. Filtro 1: «ecommerce» es jerga; la tienda tiene su banda (C). A57. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].intro` | Plantillas de web terminadas, con contenido de verdad, para ver cómo queda un negocio de tu sector. | Webs terminadas de negocios inventados, con todo su contenido, para ver cómo quedaría la de tu negocio. | A57, A59: «contenido de verdad» al lado de negocios inventados se lee como si fueran reales (§3.5). | aprobada |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · botón de la banda A` | Ver las {n} plantillas | (igual) | A05: el número sale de `plantillas.length`. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].items[0].nombre` | Formularios de contacto propios | Formulario de contacto | Nombre recomendado (P-11); sin «propios» (§3.4 regla 1). A29. Pasa a la banda B (decisión 2). | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].items[0].texto` | Los mensajes de tu web te llegan a ti, sin un formulario de otra empresa incrustado. | Recibe y guarda cada mensaje de tu web, sin el formulario de otra empresa incrustado, esté donde esté tu web. | A29. «Te llegan a ti» daba a entender el aviso por correo, que es C (A04). | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[webs].items[0].etiqueta` | Herramienta propia | Formulario | §3.4 regla 3: la etiqueta dice el tipo de cosa (CA-1). A29. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].titulo` | Automatizaciones e inteligencia artificial | Para la web que ya tienes | Decisión 2. §3.7: con una sola entrada (el informe), el título prometía lo que no hay. A03, A29. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].intro` | Lo que ya funciona por debajo: informes con pruebas, vigilancia diaria y comprobaciones automáticas. | Funcionan hoy: el informe mide la web que tú nos digas, y el formulario recibe y guarda los mensajes esté donde esté alojada tu web. | A03, A29 («esté donde esté alojada la web»); nada del Anexo dice que sirvan en una web que no hayamos hecho nosotros (§3.2 regla 6). Salen «vigilancia diaria» y «comprobaciones automáticas» (A19, C; §3.7). | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[0].nombre` | Informe de mejoras de tu web | (igual) | A03. Nombre recomendado (P-11). | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[0].texto` | Mide, lee y ordena los fallos de tu web por prioridad, cada uno con su prueba. | Mide tu web, lee sus textos y ordena los fallos por prioridad, cada fallo con su prueba. | A03. Filtro 1: «mide, lee y ordena» sin objeto no se entendía. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[0].etiqueta` | Herramienta propia | Informe | §3.4 regla 3 (CA-1). A03. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[1].nombre` | Vigilancia diaria | (quitar) | A19 (C), §3.7, CA-2. Sale la entrada entera (nombre, texto, enlace y etiqueta). | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[1].texto` | Si tu web se cae o caduca algo, nos enteramos nosotros antes que tus clientes. | (quitar) | A19 (C), §3.7. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[1].href` | /herramientas/#vigilancia | (quitar) | A19 (C), §3.7, CA-2. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[2].nombre` | Auditoría de la ficha de Google | (quitar) | A20 (C), §3.7, CA-2, CA-3. Sale la entrada entera. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[2].texto` | Compara lo que dice Google de tu negocio con lo que dice tu web. | (quitar) | A20 (C), §3.7. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[automatizacion].items[2].href` | /herramientas/#ficha-google | (quitar) | A20 (C), §3.7, CA-2. | aprobada |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · pie de la captura del informe` | Informe de ejemplo sobre una plantilla | (igual) | A03 (el que se enseña es sobre una plantilla), A59. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].titulo` | Software y aplicaciones | Para vender por internet | A23: la tienda no es software a medida, y «software y aplicaciones» lo daba a entender. A01. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].intro` | Una plataforma completa con panel de gestión pensado para llevarla desde el móvil. | Una tienda en tu dominio, que cobra con tarjeta y Bizum y que llevas desde el móvil. | A01, A02 corregida, A60 (el dominio es tuyo). Filtro 1: «plataforma» y «panel de gestión» son jerga. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].items[0].nombre` | Plataforma de tiendas | Tienda online | Nombre recomendado (P-11). A01. | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].items[0].texto` | Catálogo, cobro y envíos listos el primer día, y un panel que avisa de qué reponer. | Catálogo, cobro y recogida en tienda listos el primer día, y un panel que avisa de qué reponer. | A01, A25, A02 corregida: «envíos» cubría el reparto local, que es B (A64). | aprobada |
| / | `src/content/consultora.ts` | `proyectos.categorias[software].items[0].etiqueta` | Software propio | Tienda | §3.4 regla 3 (CA-1). A01. | aprobada |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · enlace de cada fila` | Ver | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/Proyectos.tsx` | `jsx · pie de la tienda` | Tienda de ejemplo (una papelería inventada) con pedidos y productos de prueba. | (igual) | A01, A59. | aprobada |
| / | `src/content/consultora.ts` | `quien.titulo` | Dos personas, | (igual) | A40, A76 (fuente: `estudio.ts`, 2 personas). | aprobada |
| / | `src/content/consultora.ts` | `quien.em` | sin intermediarios. | (igual) | A40. | aprobada |
| / | `src/content/consultora.ts` | `quien.texto` | Somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien monta tu automatización, escribe el código o graba tu vídeo. | Somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien hace el trabajo. | A40. Sale «graba tu vídeo» (A21, C: el vídeo no es un servicio). Lo leen ellos antes de publicarlo (A40, spec §5). | aprobada |
| / | `src/content/consultora.ts` | `quien.personas.Álvaro.rol` | Desarrollo, IA y automatización | Web, código y automatización | Decisión 8: el mismo rol que en `/estudio/` (`estudio.ts`). A40: lo confirma Álvaro. | aprobada |
| / | `src/content/consultora.ts` | `quien.personas.Álvaro.texto` | Diseño y desarrollo de webs, aplicaciones y sistemas empresariales. Especializado en conectar tecnología, automatizar procesos y construir soluciones adaptadas a cada negocio. | Diseña y programa las webs y las tiendas, y monta las automatizaciones con IA que se encargan a medida. Si algo del código no te encaja, se lo dices a él. | Decisión 8: un texto por persona; la parte 2 lo repite en `/estudio/`. A40, A06, A01, A22 (B: «que se encargan a medida», por encargo y no como producto, §3.2 regla 1). A40 solo confirma el rol de Yanin: el de Álvaro lo confirma él al leerlo. Filtro 1: «sistemas empresariales» es jerga. Sale «y se cambia» de `/estudio/` (A51, B). Lo lee Álvaro antes de publicarlo. | aprobada |
| / | `src/content/consultora.ts` | `quien.personas.Yanin.rol` | Diseño y contenido audiovisual | Foto, vídeo y redes | A40 corregida (D-035). | aprobada |
| / | `src/content/consultora.ts` | `quien.personas.Yanin.texto` | Fotografía, vídeo y creación de contenido visual para ayudar a las marcas a comunicar mejor y mejorar su presencia digital. | Hace y edita las fotos y los vídeos del estudio. | A40 (rol «Foto, vídeo y redes»). Decisión 8: un texto por persona. Sale el vídeo como servicio para marcas (A21, C), y salen «trabaja con IA» y «lo que mejor se le da»: no tienen fila en el Anexo (§3.2 regla 6). Lo lee Yanin antes de publicarlo (A40). | aprobada |
| / | `src/components/consultora/QuienEstudio.tsx` | `jsx · enlace` | Cómo trabajamos | (igual) | Lleva a `/estudio/`. | aprobada |
| / | `src/components/ui/TarjetaPersona.tsx` | `alt` provisional | Silueta provisional en lugar del retrato de {n} | (igual) | A40 (las fotos son siluetas provisionales). `/estudio/` la cita. | aprobada |
| / | `src/components/ui/TarjetaPersona.tsx` | `alt` definitivo | Retrato de {n} | (igual) | Para cuando lleguen los retratos (A40). | aprobada |
| / | `src/components/sections/Compromisos.tsx` | `Titular` · `arriba` | Lo que construimos, lo manejas tú. | (igual) | A31 (procedimiento, D-035). | aprobada |
| / | `src/content/estudio.ts` | `compromisos[0].titulo` | Abres el código cuando quieras. | (igual) | A31. | aprobada |
| / | `src/content/estudio.ts` | `compromisos[0].texto` | Vive en un repositorio a tu nombre desde el primer día. Lo puedes leer, copiar o enseñárselo a otro programador. | (igual) | A31. | aprobada |
| / | `src/content/estudio.ts` | `compromisos[1].titulo` | Entras en todo con tus claves. | (igual) | A31. | aprobada |
| / | `src/content/estudio.ts` | `compromisos[1].texto` | El dominio, el alojamiento, el correo y las cuentas de Google y de pagos están a tu nombre. Nosotros entramos con el acceso que nos des. | (igual) | A31 (la excepción de la tienda la dice la nota). | aprobada |
| / | `src/content/estudio.ts` | `compromisos[2].titulo` | Te lo llevas entero. | (igual) | A31. | aprobada |
| / | `src/content/estudio.ts` | `compromisos[2].texto` | Le pasas el repositorio y las claves a quien elijas, y esa persona sigue desde donde lo dejamos, sin rehacer nada. | (igual) | A31. | aprobada |
| / | `src/content/estudio.ts` | `notaCompromisos` | La tienda online va sobre nuestra plataforma, que es compartida: ahí el dominio es tuyo, el código de la plataforma no. | La tienda online va sobre nuestra plataforma, que es compartida: ahí el dominio es tuyo y el código de la plataforma no, y la plataforma cobra comisión por venta. | A60 (D-035): la comisión se dice como procedimiento, sin cifra. | aprobada |
| / | `src/content/consultora.ts` | `faq.titulo` | Preguntas | (igual) | Titular. | aprobada |
| / | `src/content/consultora.ts` | `faq.em` | frecuentes. | (igual) | Titular. | aprobada |
| / | `src/components/consultora/Faq.tsx` | `jsx · entradilla` | ¿Tu duda no está aquí? | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/Faq.tsx` | `jsx · enlace` | Cuéntanosla | (igual) | Lleva a `#contacto`. | aprobada |
| / | `src/content/consultora.ts` | `faq.items[0].pregunta` | ¿Necesito cambiar los programas que ya utilizo? | (igual) | Es la pregunta que se hace el lector; la respuesta va con «si» (filtro 4). A22. | aprobada |
| / | `src/content/consultora.ts` | `faq.items[0].respuesta[0]` | En general, no. Lo normal es conectar lo que ya usas: el correo, el calendario, las hojas de cálculo, tu programa de facturación o tu CRM. | En general, no. Si usas correo, calendario, hojas de cálculo, un programa de facturación o un CRM, lo normal es conectarlo a lo que montemos. | A22 (B, «lo que montemos»). Filtro 4: con «si», sin dar por hecho qué usa. | aprobada |
| / | `src/content/consultora.ts` | `faq.items[0].respuesta[1]` | Si alguna herramienta no se puede conectar, te lo decimos en el diagnóstico y te proponemos una alternativa. No cambiamos nada sin que lo decidas tú. | Si algún programa no se puede conectar, te lo decimos en la propuesta y te proponemos otra cosa. No cambiamos nada sin que lo decidas tú. | A39 (procedimiento, D-035). Nombre de la puerta 1 (P-11): «diagnóstico» queda para el diagnóstico rápido (CA-17). | aprobada |
| / | `src/content/consultora.ts` | `faq.items[1].pregunta` | ¿Necesito conocimientos técnicos? | (igual) | Pregunta del lector; la respuesta es A56. | aprobada |
| / | `src/content/consultora.ts` | `faq.items[1].respuesta[0]` | No. La parte técnica la hacemos nosotros. Al ponerlo en marcha te enseñamos a utilizarlo, y debería resultarte tan cotidiano como mandar un mensaje o abrir una hoja de cálculo. | No. La parte técnica la hacemos nosotros. Al ponerlo en marcha te enseñamos a usarlo, y debería resultarte tan cotidiano como mandar un mensaje. | A56. Filtro 4: sale la hoja de cálculo dada por hecho (CA-9). | aprobada |
| / | `src/content/consultora.ts` | `faq.items[2].pregunta` | ¿Cuánto cuesta implementar una solución de IA? | ¿Cuánto cuesta? | La pregunta vale para las dos puertas, no solo para la IA (§3.1). Filtro 1: «implementar una solución» es jerga. | aprobada |
| / | `src/content/consultora.ts` | `faq.items[2].respuesta[0]` | Depende de lo que haya que construir: una automatización concreta no es lo mismo que una aplicación de gestión. Por eso no publicamos una tabla de precios. | Depende de lo que haya que montar: una web no es lo mismo que una aplicación de gestión. Por eso no publicamos una tabla de precios. | A30. Con un ejemplo de cada puerta (§3.1). | aprobada |
| / | `src/content/consultora.ts` | `faq.items[2].respuesta[1]` | Tras el diagnóstico te damos una propuesta con el alcance y el precio de cada fase por escrito, antes de empezar nada. Cada fase se paga cuando la ves funcionando. | Después de hablar contigo te damos la propuesta por escrito, con el alcance y el precio de cada fase, antes de empezar nada. Cada fase se paga cuando la ves funcionando. | A30 (procedimiento, D-035). Nombre de la puerta 1 (P-11), CA-17. | aprobada |
| / | `src/content/consultora.ts` | `faq.items[3].pregunta` | ¿Cuánto tiempo se tarda? | (igual) | A37. | aprobada |
| / | `src/content/consultora.ts` | `faq.items[3].respuesta[0]` | Trabajamos por fases y empezamos por lo que más horas te quita: lo primero que funciona suele estar en semanas. El resto se va sumando. | Trabajamos por fases y empezamos por lo que más te importa: lo primero que funciona suele estar en semanas. El resto se va sumando. | A37 (procedimiento, D-035). Filtro 4: daba por hecho que el dolor son las horas (§3.1). | aprobada |
| / | `src/content/consultora.ts` | `faq.items[3].respuesta[1]` | Un plazo cerrado para todo no te lo damos sin conocer el caso: una automatización sencilla y un sistema de gestión completo no se miden igual. En la propuesta va qué llega en cada fase. | (igual) | A37, A30. Sin cifra de plazo (A32, C). | aprobada |
| / | `src/content/consultora.ts` | `faq.items[4].pregunta` | ¿Hay costes mensuales? | (igual) | A49, A39. | aprobada |
| / | `src/content/consultora.ts` | `faq.items[4].respuesta[0]` | Puede haberlos, según la solución. Algunas piezas de terceros se pagan por uso o por cuota (la inteligencia artificial, la mensajería de WhatsApp, el alojamiento), y el mantenimiento es opcional si prefieres que lo cuidemos nosotros. | Puede haberlos, según lo que se monte. Algunas piezas de terceros se pagan por uso o por cuota (la inteligencia artificial, la mensajería de WhatsApp, el alojamiento), y en la tienda online la plataforma cobra comisión por venta. | A49; A60 (la comisión, como procedimiento y sin cifra, D-035). Sale «el mantenimiento es opcional» (A33, C: condición). | aprobada |
| / | `src/content/consultora.ts` | `faq.items[4].respuesta[1]` | En la propuesta separamos lo que se paga una vez de lo que se paga cada mes, y a nombre de quién va cada cuota. | (igual) | A39 (procedimiento, D-035). | aprobada |
| / | `src/content/consultora.ts` | `faq.items[5].pregunta` | ¿La IA puede cometer errores? | (igual) | A13. | aprobada |
| / | `src/content/consultora.ts` | `faq.items[5].respuesta[0]` | Sí, y no te vamos a prometer lo contrario. Por eso no la dejamos suelta: limitamos qué puede hacer y a qué datos accede, hace que consulte información real en vez de inventarla, te pasa a una persona cuando no sabe, y deja un registro para que puedas revisar lo que ha hecho. | Sí, y no te vamos a prometer lo contrario. Por eso, cuando la montamos, no la dejamos suelta: limitamos qué puede hacer y a qué datos llega, hacemos que consulte información real en vez de inventarla, que te pase a una persona cuando no sabe y que deje un registro de lo que ha hecho para que lo revises. | A13 (B): «cuando la montamos», no como producto (§3.2 regla 1). A11 (pasa a una persona). Arregla la frase («hace que consulte»). | aprobada |
| / | `src/content/consultora.ts` | `faq.items[5].respuesta[1]` | El objetivo es que, cuando se equivoque, se note pronto y cueste poco arreglarlo. | (igual) | A13. | aprobada |
| / | `src/content/consultora.ts` | `contacto.titulo` | ¿Y si tu negocio pudiera | (igual) | Titular (CA-11: casa con la entradilla y el botón). | aprobada |
| / | `src/content/consultora.ts` | `contacto.em` | trabajar de otra manera? | (igual) | Ídem. | aprobada |
| / | `src/content/consultora.ts` | `contacto.texto` | Cuéntanos qué haces, qué problemas encuentras en tu día a día y qué te gustaría mejorar. Analizaremos tu situación y te propondremos soluciones tecnológicas que tengan sentido para tu empresa. | Cuéntanos a qué te dedicas y qué te gustaría mejorar. Lo leemos, hablamos contigo y te damos una propuesta por escrito con lo que tenga sentido para tu negocio. | A56, A30. Nombre de la puerta 1 (P-11): titular, entradilla y botón prometen lo mismo (CA-11). Filtro 1: sin «soluciones tecnológicas». | aprobada |
| / | `src/content/consultora.ts` | `contacto.cta` | Solicitar diagnóstico gratuito | Pedir una propuesta | Nombre de la puerta 1 (P-11), CA-17. A80 corregida: sin «gratuito». | aprobada |
| / | `src/content/consultora.ts` | `contacto.tipos[0]` | Alojamiento u hostelería | (igual) | Comprador (§3.1). | aprobada |
| / | `src/content/consultora.ts` | `contacto.tipos[1]` | Clínica o salud | (igual) | Ídem. | aprobada |
| / | `src/content/consultora.ts` | `contacto.tipos[2]` | Asesoría o despacho | (igual) | Ídem. | aprobada |
| / | `src/content/consultora.ts` | `contacto.tipos[3]` | Comercio o tienda | (igual) | Ídem. | aprobada |
| / | `src/content/consultora.ts` | `contacto.tipos[4]` | Inmobiliaria | (igual) | Ídem. | aprobada |
| / | `src/content/consultora.ts` | `contacto.tipos[5]` | Servicios profesionales | (igual) | Ídem. | aprobada |
| / | `src/content/consultora.ts` | `contacto.tipos[6]` | Otro | (igual) | Ídem. | aprobada |
| / | `src/components/consultora/Contacto.tsx` | `jsx · puerta del correo` | Si prefieres escribir directamente. | (igual) | A44 (correo directo). | aprobada |
| / | `src/components/consultora/Contacto.tsx` | `jsx · enlace a /sectores/` | Diagnóstico rápido | (igual) | Nombre de la puerta 2 (P-11, recomendado). Único con «diagnóstico» (CA-17). | aprobada |
| / | `src/components/consultora/Contacto.tsx` | `jsx · texto de la puerta 2` | Un minuto, en tu navegador: no envía ni guarda nada. | Unas preguntas en tu navegador: no se envía ni se guarda nada, y las respuestas van en la dirección de la página. | A70: «un minuto» sale hasta cronometrarlo (D-035). A95 corregida: se matiza que las respuestas van en la dirección. | aprobada |
| / | `src/components/consultora/Contacto.tsx` | `jsx · enlace a /auditoria/` | Auditoría completa | Auditoría de tu negocio | Nombre de la puerta 3 (P-11, recomendado). | aprobada |
| / | `src/components/consultora/Contacto.tsx` | `jsx · texto de la puerta 3` | 36 preguntas sobre cómo trabajáis, con informe. | 36 preguntas sobre cómo trabajáis, y un informe por correo. La auditoría no se cobra. | A38 (fuente: `TOTAL_PREGUNTAS`), A72 (el informe llega por correo), A34 corregida («no se cobra»). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Nombre | (igual) | A44 (datos del formulario corto). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Empresa | (igual) | A44. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Email | Correo | Filtro 6: castellano, como el resto del formulario («Revisa el correo»). A44. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Teléfono | (igual) | A44 (opcional). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · marca de opcional` | (opcional) | (igual) | A44. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | Tipo de negocio | (igual) | A44. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · opción vacía` | Elige uno… | Elige el más parecido… | PD-6: «uno» cuenta como cifra en CA-8 y aquí no lo es. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · etiqueta` | ¿Qué te gustaría mejorar? | (igual) | A44, A56. Casa con el paso 01 del proceso (CA-11). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · campo trampa` | No rellenes este campo | (igual) | Oculto (`aria-hidden`); solo lo ven los robots. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · nombre | Dinos cómo te llamas. | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · empresa | Dinos cómo se llama tu empresa o negocio. | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · email | Revisa el correo: es donde te vamos a contestar. | (igual) | A56 (contestamos nosotros, no un aviso automático: A04 es C). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · tipo | Elige el tipo de negocio que más se parezca al tuyo. | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · mejorar | Cuéntanos, aunque sea en una frase, qué te gustaría mejorar. | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `validar` · consentimiento | Hace falta que lo aceptes para poder escribirte. | (igual) | A44, A96. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `MENSAJES.ritmo` | Has enviado varias solicitudes seguidas. Espera un minuto y vuelve a probar. | Has enviado varias solicitudes seguidas. Espera unos minutos y vuelve a probar. | A73 (D-035): la función limita a 3 envíos por correo cada 10 min; «un minuto» no cuadraba. Mismo valor que la auditoría («unos minutos»). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `MENSAJES.red` | No hemos podido conectar. Revisa tu conexión y vuelve a probar. | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `MENSAJES.servidor` | Algo ha fallado de nuestra parte y tu solicitud no ha salido. | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `MENSAJES.validacion` | Hay algún dato que no hemos podido aceptar. Revísalo y vuelve a probar. | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · consentimiento` | Acepto que Undertactics use estos datos para contestarme, según la | (igual) | A44, A96 (solo para responder). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enlace del consentimiento` | política de privacidad | (igual) | A44: `/privacidad/` tiene que nombrar este formulario (parte 2, CA-14). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · botón enviando` | Enviando… | (igual) | Interfaz. El botón en reposo es `contacto.cta`. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · bajo el botón` | Sin coste y sin compromiso. | La propuesta no se cobra. | Sale el reclamo de condición (A33, C; CA-16). Queda el precio dicho como D-035 («no se cobra», A80 corregida) con el nombre de la puerta 1 (P-11). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · error de envío` | Si prefieres, escríbenos a | (igual) | A44 (correo directo). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, rótulo` | Recibido | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, titular` | Gracias, {n}. | (igual) | Interfaz. `{n}` = el nombre de pila. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, texto` | Hemos recibido tu solicitud. Vamos a leerla con calma y te contestamos al correo que nos has dado, con lo que veamos y las dudas que nos queden. | (igual) | A29 (se guarda), A56 (contestamos nosotros). No promete aviso automático (A04, C). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, antes del enlace` | Mientras tanto, si quieres adelantar trabajo, la | (igual) | Interfaz. | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, enlace a /auditoria/` | auditoría completa | auditoría de tu negocio | Nombre de la puerta 3 (P-11). | aprobada |
| / | `src/components/consultora/FormularioContacto.tsx` | `jsx · enviado, después del enlace` | nos da el detalle de cómo trabajáis. | (igual) | A52 no se cita: solo dice qué nos das tú. | aprobada |

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
| /auditoria/ | `src/app/auditoria/page.tsx` | `metadata.title` | Auditoría gratuita — {n} | Auditoría de tu negocio — {n} | Nombre de la puerta 3 (P-11). A34 corregida (D-035): sin «gratuita». `{n}` = `site.nombre`. | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `metadata.description` | Cuéntanos cómo trabajáis en diez minutos y te devolvemos un informe con las horas que se van cada semana, lo que cuestan y qué se arregla primero. | Cuéntanos cómo trabajáis, con tus palabras, y te mandamos por correo un informe de tu negocio. La auditoría no se cobra. | A72 (informe por correo), A34 corregida («no se cobra»). Sale «diez minutos» (A35, C hasta cronometrar). Salen «las horas que se van», «lo que cuestan» y «qué se arregla primero»: A36 y A52 siguen `por confirmar`. | aprobada |
| /auditoria/ | `src/content/interiores.ts` | `cotasInterior.auditoria.cota` | Fondo · Auditoría | (igual) | Cota (D-014). | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `CabeceraInterior` · `arriba` | Cómo trabajáis | (igual) | Título del cuestionario del kit 03. No afirma nada. | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `CabeceraInterior` · `em` | por dentro | (igual) | Ídem. | aprobada |
| /auditoria/ | `src/components/ui/CabeceraInterior.tsx` | `jsx · enlace de vuelta` | Volver | (igual) | Interfaz. Lo pintan todas las interiores; la fila va solo aquí. | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · entradilla` | {n} preguntas sobre el día a día del negocio. Se contesta en unos diez minutos, con tus palabras, y no hace falta que sepas nada de tecnología. | {n} preguntas sobre el día a día del negocio. Se contestan con tus palabras, y no hace falta que sepas nada de tecnología. La auditoría no se cobra. | A38 (`{n}` = `TOTAL_PREGUNTAS`), A56, A34 corregida. Sale «unos diez minutos» (A35, C hasta cronometrar). | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[0].titulo` | No contestes lo que no sepas | (igual) | A98: solo es obligatorio el primer paso. | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[0].texto` | Déjalo en blanco. El informe marca los huecos en vez de inventárselos. | Déjalo en blanco. Solo hacen falta el nombre del negocio, el tuyo y tu correo. | A98. Sale «el informe marca los huecos»: A52 sigue `por confirmar`. | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[1].titulo` | Los números a ojo valen | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[1].texto` | «Unas 30 llamadas a la semana» sirve. No busques nada en ningún sitio. | Por ejemplo, «unas 30 llamadas a la semana» sirve. No busques nada en ningún sitio. | A78: una cifra de ejemplo fuera de una maqueta va rotulada como ejemplo (o dentro de `[data-ejemplo]`; T05 la pone en `CIFRAS` con A78). | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[2].titulo` | Puedes parar y seguir | (igual) | A93. | aprobada |
| /auditoria/ | `src/app/auditoria/page.tsx` | `jsx · notas[2].texto` | Lo que escribas se guarda en este navegador. Cierra la pestaña y vuelve cuando quieras. | Lo que escribas se guarda en este navegador hasta que lo envías. Cierra la pestaña y vuelve cuando quieras. | A93 ajustada por D-037: el borrador no caduca (`FormularioAuditoria.tsx:158-162`), así que «cuando quieras» es verdad y sale el «durante 30 días» de la versión anterior. A44: se borra solo si el envío sale bien (`:216-221`). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · borrador recuperado` | Recuperado lo que habías escrito en este navegador | (igual) | A93. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `AvisoPrerrelleno` · inicio | Hemos puesto {n} | (igual) | Interfaz. `{n}` = nº de respuestas prerrellenadas; sigue «respuesta» o «respuestas» según sea una o varias. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `AvisoPrerrelleno` · texto | de tu diagnóstico rápido. | (igual) | Va tras «Hemos puesto {n} respuesta(s)». Nombre de la puerta 2 (P-11): es el diagnóstico rápido, así que CA-17 lo admite (T05 lo pone en `DIAGNOSTICO_PERMITIDO`). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `AvisoPrerrelleno` · una | Revísala y cámbiala si no cuadra. | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `AvisoPrerrelleno` · varias | Revísalas y cámbialas si no cuadran. | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `AvisoPrerrelleno` · saltadas | Las que ya habías escrito no las hemos tocado. | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · campo trampa` | No rellenes este campo | (igual) | Oculto (`aria-hidden`); solo lo ven los robots. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `PasoContacto` · rótulo | Antes de empezar | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `PasoContacto` · titular y `legend` | Tus datos | (igual) | Interfaz. También es la primera etiqueta del índice (`Progreso`). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `PasoContacto` · entradilla | Lo único obligatorio de todo el formulario. El resto puedes dejarlo a medias y mandarlo igual. | (igual) | A98 (la casilla de consentimiento va en este mismo paso). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo negocio` · `etiqueta` | Nombre del negocio | (igual) | A44 (datos de la auditoría). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo sector` · `etiqueta` | A qué os dedicáis | (igual) | A44. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo sector` · `ayuda` | Peluquería, taller, clínica, tienda… | (igual) | Ejemplos de sector; no afirman nada. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo ciudad` · `etiqueta` | Ciudad | (igual) | A44. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo web` · `etiqueta` | Vuestra web, si tenéis | (igual) | A44. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo web` · `ayuda` | Con ella se puede auditar también la mitad de fuera. Si no tenéis, déjalo vacío. | Si no tenéis, déjalo vacío. | Sale «se puede auditar también la mitad de fuera»: «miramos tu web por fuera» es A52, que sigue `por confirmar`. Filtro 1: «la mitad de fuera» no se entendía. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_nombre` · `etiqueta` | Tu nombre | (igual) | A44. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_email` · `etiqueta` | Tu correo | (igual) | A44. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_email` · `ayuda` | Es por donde te llega el informe. | (igual) | A72. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_telefono` · `etiqueta` | Teléfono | (igual) | A44 (opcional). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Campo contacto_telefono` · `ayuda` | Opcional. Solo si prefieres que te llamemos. | (igual) | A44. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · consentimiento` | Acepto que {n} guarde estos datos para preparar el informe y responderme. No se ceden a nadie y puedes pedir que se borren cuando quieras escribiendo a | Acepto que {n} guarde estos datos para preparar el informe y responderme. Los guardamos en Supabase y el informe lo redactamos con la IA de Anthropic; no se ceden a nadie más. Puedes pedir que se borren cuando quieras escribiendo a | A91: la casilla nombra a los dos encargados igual que `/privacidad/` (antes decía «no se ceden a nadie» sin ellos). A90 (Supabase), A96 (para qué), A44. «Cuando quieras» es un derecho (RGPD art. 17), no un reclamo de condición. `{n}` = `site.nombre`. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · consentimiento, final` | . Más detalle en la | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `jsx · enlace del consentimiento` | política de privacidad | (igual) | A44: `/privacidad/` nombra este formulario (CA-14). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `PasoContacto` · rótulo de lo que no se pide | Y lo que no te vamos a pedir | (igual) | A97. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `loQueNoPedimos[0]` | Datos de tus clientes: listados, fichas, historiales, nombres con teléfonos. | (igual) | A97. También lo pinta `Fondo` (`/sectores/<slug>/`). | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `loQueNoPedimos[1]` | Contraseñas, claves ni accesos a tus programas. | (igual) | A97. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `loQueNoPedimos[2]` | Facturas, contabilidad ni exportaciones de tus bases de datos. | (igual) | A97. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `validar` · negocio | Dinos cómo se llama el negocio. | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `validar` · nombre | Necesitamos tu nombre. | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `validar` · correo | Revisa el correo: es por donde te llega el informe. | (igual) | A72. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `validar` · consentimiento | Hace falta que lo aceptes para poder escribirte. | (igual) | A98 (la casilla también es obligatoria). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón | Atrás | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón, paso 0 | Empezar el cuestionario | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón | Siguiente bloque | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón enviando | Enviando… | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón, último paso | Enviar la solicitud | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · botón | Enviar tal como está | (igual) | Interfaz (A98: se puede mandar a medias). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Navegacion` · a medias | Puedes mandarlo a medias: {n} contestadas | (igual) | A98. `{n}` = respuestas contestadas (recuento de la interfaz, no una cifra que afirme algo). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `mensajes.validacion` | Faltan datos obligatorios. Vuelve al primer paso y revísalos. | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `mensajes.ritmo` | Has mandado ya varias solicitudes seguidas. Espera unos minutos y vuelve a intentarlo. | (igual) | A73: «unos minutos» casa con el límite de la función (3 envíos por correo cada 10 min). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `mensajes.red` | No hemos podido conectar. Comprueba la conexión y vuelve a darle a enviar. | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `mensajes.servidor` | Algo ha fallado por nuestro lado. Inténtalo en un rato. | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Error` · antes del correo | Si sigue sin funcionar, escríbenos a | (igual) | A44 (correo directo). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Error` · después del correo | y lo resolvemos por correo. | (igual) | A44. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · rótulo | Recibido | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · titular | Gracias{n}. | (igual) | Interfaz. `{n}` = «, » y el nombre de pila. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · texto | Nos han llegado {n} de las {n} respuestas. Lo primero que hacemos es leerlo entero y mirar tu web por fuera; si falta algo importante te escribimos antes de ponernos. | Nos han llegado {n} de las {n} respuestas. Lo leemos entero y, si falta algo importante, te escribimos antes de ponernos. | A56 (lo leemos nosotros). Sale «mirar tu web por fuera»: A52 sigue `por confirmar`. `{n}` = contestadas y `TOTAL_PREGUNTAS` (A38). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · plazo | El informe tarda unos días y llega por correo. No hay ningún paso siguiente por tu parte. | (igual) | A72 (procedimiento, D-035). | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · botón | Mientras, mira las plantillas | (igual) | A57. | aprobada |
| /auditoria/ | `src/components/auditoria/FormularioAuditoria.tsx` | `Enviado` · botón | Volver al inicio | (igual) | Interfaz. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].titulo` | El negocio | (igual) | Cuestionario del kit 03 (A38). | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[0].etiqueta` | Nombre del negocio | (igual) | P1. Pregunta: no afirma ni presupone (§3.1). | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[1].etiqueta` | A qué os dedicáis, en una frase | (igual) | P2. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[2].etiqueta` | Ciudad | (igual) | P3. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[3].etiqueta` | ¿Cuántas personas trabajáis y qué hace cada una? | (igual) | P4. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[3].ayuda` | Por ejemplo: «3: yo atiendo y hago presupuestos, mi socio produce, y una persona a media jornada en recepción». | (igual) | A78: cifra de ejemplo, ya rotulada «Por ejemplo» (T05 la pone en `CIFRAS` con A78). | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[4].etiqueta` | Horario de atención al público | (igual) | P5. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[0].preguntas[5].etiqueta` | ¿A cuántos clientes atendéis a la semana, más o menos? | (igual) | P6. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].titulo` | Cómo os llegan los clientes | (igual) | Kit 03. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[0].etiqueta` | ¿Por dónde os contactan? | (igual) | P7. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[0].ayuda` | Ordénalo de más a menos: teléfono, WhatsApp, Instagram, formulario de la web, email, gente que entra por la puerta, otros. | Ordénalo de más a menos: teléfono, WhatsApp, Instagram, formulario de la web, correo, gente que entra por la puerta, otros. | Filtro 6: «correo», como en el resto de la web (y en el formulario corto, `## /`). Ofrece opciones, no presupone ninguna (§3.1). | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[1].etiqueta` | ¿Quién responde a esas llamadas y mensajes, y desde qué dispositivo? | (igual) | P8. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[1].ayuda` | Por ejemplo: «la recepcionista, desde su móvil personal» o «un móvil de empresa que está en el mostrador». | (igual) | Ejemplo rotulado. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[2].etiqueta` | ¿Cuánto se tarda normalmente en contestar un mensaje? | (igual) | P9. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[3].etiqueta` | ¿Qué pasa con las llamadas y mensajes que llegan fuera de horario o cuando estáis ocupados? | (igual) | P10. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[3].ayuda` | ¿Sabéis cuántos se quedan sin contestar? | (igual) | P10. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[1].preguntas[4].etiqueta` | ¿Cuántas consultas de clientes nuevos entran a la semana, más o menos? | (igual) | P11. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].titulo` | Agenda y citas | (igual) | Kit 03. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].entradilla` | Si en tu negocio no se trabaja con cita previa, salta este bloque entero: escribe «no trabajamos con cita» en la primera y sigue. | (igual) | Ya va con «si» (§3.1). | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[0].etiqueta` | ¿Dónde apuntáis las citas? | (igual) | P12. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[0].ayuda` | Agenda de papel, Excel, Google Calendar, un programa concreto: dime cuál. | (igual) | P12. Opciones, no supuestos. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[1].etiqueta` | ¿Quién las apunta, y desde dónde se puede consultar la agenda? | (igual) | P13. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[2].etiqueta` | ¿Puede el cliente reservar él solo por internet, sin llamar? | (igual) | P14. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[3].etiqueta` | ¿Cómo le recordáis la cita al cliente? | (igual) | P15. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[3].ayuda` | ¿Quién lo hace, y cuánto tiempo se le va a la semana en eso? | (igual) | P15. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[4].etiqueta` | ¿Cuántas citas se pierden porque el cliente no aparece o cancela a última hora? | (igual) | P16. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[2].preguntas[4].ayuda` | ¿Cuánto factura de media una cita? | (igual) | P16. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].titulo` | Presupuestos, cobro y facturación | (igual) | Kit 03. Pregunta por cómo factura el negocio; no dice que nosotros facturemos (A16). | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[0].etiqueta` | ¿Cómo preparáis un presupuesto y cómo se lo hacéis llegar al cliente? | (igual) | P17. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[1].etiqueta` | ¿Cuántos presupuestos mandáis al mes, y cuántos acaban en trabajo? | (igual) | P18. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[2].etiqueta` | ¿Cómo cobráis? | (igual) | P19. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[2].ayuda` | Efectivo, tarjeta, transferencia, pago por internet, financiación… | (igual) | P19. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[3].etiqueta` | ¿Quién hace las facturas y con qué programa? | (igual) | P20. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[3].ayuda` | ¿Cuánto tiempo al mes os lleva? | (igual) | P20. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[3].preguntas[4].etiqueta` | ¿Tenéis impagos, o pagos pendientes que se os olvida reclamar? | (igual) | P21. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].titulo` | Después de la venta | (igual) | Kit 03. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[0].etiqueta` | Cuando un cliente termina, ¿qué pasa? ¿Volvéis a hablar con él? | (igual) | P22. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[1].etiqueta` | ¿Pedís reseñas? Si sí, ¿cómo? | (igual) | P23. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[1].ayuda` | ¿Cuántas tenéis ahora mismo y con qué nota? | (igual) | P23. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[2].etiqueta` | ¿Vuestros clientes deberían volver cada cierto tiempo (revisión, mantenimiento, retoque, renovación)? | (igual) | P24. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[2].ayuda` | ¿Cómo les avisáis de que les toca? | (igual) | P24. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[3].etiqueta` | ¿Mandáis alguna comunicación cada cierto tiempo (novedades, ofertas, recordatorios)? | (igual) | P25. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[4].preguntas[3].ayuda` | ¿Con qué herramienta? | ¿Con qué programa? | Decisión 6: «herramienta» queda fuera de lo que se enseña, y el resto del formulario dice «programa» (P20, P26). | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].titulo` | Herramientas y datos | Programas y datos | Ídem: casa con P26 («programas y aplicaciones»). | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[0].etiqueta` | Lista de programas y aplicaciones que pagáis | (igual) | P26. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[0].ayuda` | De cada uno: nombre, para qué lo usáis y cuánto cuesta al mes, si lo sabes. | (igual) | P26. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[1].etiqueta` | ¿Dónde está la información de vuestros clientes? | (igual) | P27. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[1].ayuda` | Un programa, un Excel, la agenda de papel, el móvil de alguien, varias cosas a la vez. | (igual) | P27. Opciones, no supuestos. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[2].etiqueta` | ¿Hay copia de seguridad de eso? ¿Quién la hace y cada cuánto? | (igual) | P28. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[3].etiqueta` | ¿Quién tiene acceso a esa información? | (igual) | P29. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[3].ayuda` | Y una pregunta incómoda: si mañana esa persona no viene, ¿el negocio puede seguir funcionando? | (igual) | P29. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[5].preguntas[4].etiqueta` | ¿Qué números miráis cada mes para saber si el negocio va bien? | (igual) | P30. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].titulo` | Tiempo, IA y objetivos | (igual) | Kit 03. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[0].etiqueta` | Las 3 tareas repetitivas que más tiempo os comen | Las tareas repetitivas que más tiempo os comen | Filtro 5 y PD-6: «3» cuenta como cifra y no tiene fila en el Anexo. La ayuda ya dice «de cada una». Si Álvaro prefiere dejar el número (es el formulario del kit 03), T05 la deja `(igual)` y la pone como excepción con motivo. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[0].ayuda` | De cada una, dime cuánto tiempo a la semana, aunque sea a ojo. | (igual) | P31. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[1].etiqueta` | ¿Cuánto cuesta más o menos una hora de trabajo de la persona que hace esas tareas? | (igual) | P32. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[1].ayuda` | Con lo que le cuesta a la empresa, aproximado. Si prefieres no decirlo, no pasa nada. | (igual) | P32. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[2].etiqueta` | ¿Habéis probado alguna herramienta de inteligencia artificial o de automatización? | ¿Habéis probado algún programa de inteligencia artificial o de automatización? | Decisión 6, como P25. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[2].ayuda` | ¿Qué pasó? | (igual) | P33. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[3].etiqueta` | ¿Qué os preocuparía de usar inteligencia artificial con vuestros clientes? | (igual) | P34. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[4].etiqueta` | Si pudieras arreglar una sola cosa del día a día, ¿cuál sería? | (igual) | P35. | aprobada |
| /auditoria/ | `src/content/auditoria.ts` | `bloques[6].preguntas[5].etiqueta` | ¿Qué presupuesto tienes en mente para montarlo? ¿Y para el mantenimiento mensual? | (igual) | P36. | aprobada |

## /estudio/

Los compromisos, su nota y la tarjeta de persona (`Compromisos.tsx`,
`estudio.ts` `compromisos`/`notaCompromisos`, `TarjetaPersona.tsx`) van en
`## /`. `comoTrabajamos[2].texto` es `proceso[4].descripcion` (en `## /`). Los
textos de persona repiten los de la portada (decisión 8): uno por persona, que
leen Álvaro y Yanin antes de publicarlo (A40).

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /estudio/ | `src/app/estudio/page.tsx` | `metadata.title` | Estudio — {n} | (igual) | `{n}` = `site.nombre`. | aprobada |
| /estudio/ | `src/app/estudio/page.tsx` | `metadata.description` | Quién hace Undertactics, cómo trabajamos y qué queda a nombre de cada negocio: el código, el dominio y las claves. | (igual) | A40, A31 (la excepción de la tienda la dice la nota de los compromisos, A60). | aprobada |
| /estudio/ | `src/content/interiores.ts` | `cotasInterior.estudio.cota` | −3 · Estudio | (igual) | Cota (D-014). | aprobada |
| /estudio/ | `src/app/estudio/page.tsx` | `CabeceraInterior` · `arriba` | Quién hace | (igual) | A40. | aprobada |
| /estudio/ | `src/app/estudio/page.tsx` | `CabeceraInterior` · `em` | esto. | (igual) | Ídem. | aprobada |
| /estudio/ | `src/content/estudio.ts` | `entradaEstudio` | En Undertactics somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien diseña tu web, escribe el código o monta tu vídeo. | En Undertactics somos Álvaro y Yanin, primos. No hay comerciales ni un equipo que no conozcas: quien te contesta el correo es quien hace el trabajo. | A40. Sale «monta tu vídeo» (A21, C: el vídeo no es un servicio). El mismo final que `quien.texto` de la portada (decisión 8). | aprobada |
| /estudio/ | `src/app/estudio/page.tsx` | `jsx · segundo párrafo` | Somos un estudio pequeño a propósito: cada encargo lo llevan las mismas dos personas de principio a fin. | (igual) | A40, A76 (fuente: `estudio.ts`, 2 personas). | aprobada |
| /estudio/ | `src/content/estudio.ts` | `personas[0].nombre` | Álvaro | (igual) | A40. | aprobada |
| /estudio/ | `src/content/estudio.ts` | `personas[0].rol` | Web, código y automatización | (igual) | A40. Decisión 8: la portada pasa a este mismo rol. | aprobada |
| /estudio/ | `src/content/estudio.ts` | `personas[0].texto` | Diseña y programa las webs, las tiendas y las herramientas del estudio, y monta las automatizaciones con IA. Si algo del código no te encaja, se lo dices a él y se cambia. | Diseña y programa las webs y las tiendas, y monta las automatizaciones con IA que se encargan a medida. Si algo del código no te encaja, se lo dices a él. | Decisión 8: el mismo texto que `quien.personas.Álvaro.texto` (`## /`). A40, A06, A01, A22 (B, por encargo). Sale «y se cambia» (A51, B: en la tienda el código no es del cliente) y «las herramientas del estudio» (decisión 6). Lo lee Álvaro antes de publicarlo. | aprobada |
| /estudio/ | `src/content/estudio.ts` | `personas[1].nombre` | Yanin | (igual) | A40. | aprobada |
| /estudio/ | `src/content/estudio.ts` | `personas[1].rol` | Foto, vídeo y redes | (igual) | A40 corregida (D-035). | aprobada |
| /estudio/ | `src/content/estudio.ts` | `personas[1].texto` | Produce y edita las fotos y los vídeos para redes, que es lo que mejor se le da y lo que más le gusta. También trabaja con IA en el día a día del estudio. | Hace y edita las fotos y los vídeos del estudio. | Decisión 8: el mismo texto que `quien.personas.Yanin.texto` (`## /`). «Para redes» al lado de los servicios se lee como servicio de vídeo (A21, C). Salen «lo que mejor se le da» y «trabaja con IA»: sin fila en el Anexo (§3.2 regla 6). Lo lee Yanin antes de publicarlo (A40). | aprobada |
| /estudio/ | `src/app/estudio/page.tsx` | `Titular` · `arriba` | Cómo trabajamos. | (igual) | Titular. | aprobada |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[0].titulo` | Primero miramos, luego hablamos de precio. | (igual) | A56, A30 (procedimiento, D-035). | aprobada |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[0].texto` | La auditoría gratuita son {n} preguntas y te deja un informe que es tuyo, sigas con nosotros o no. | La auditoría de tu negocio son {n} preguntas y un informe que te llega por correo. No se cobra. | Nombre de la puerta 3 (P-11). A38 (`{n}` = `TOTAL_PREGUNTAS`), A72, A34 corregida (sin «gratuita»). Sale «un informe que es tuyo, sigas con nosotros o no»: A52 sigue `por confirmar`. | aprobada |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[1].titulo` | Partimos de una base propia. | No empezamos de cero. | Decisión 3: sin «propia» (§3.4 regla 1). El texto dice de qué se parte. | aprobada |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[1].texto` | {n} plantillas y las herramientas que hemos escrito nosotros. Se adapta a lo tuyo, no se empieza de cero, y por eso lo primero funciona en semanas. | Partimos de {n} plantillas publicadas y de la tienda online, el informe de mejoras de tu web y el formulario de contacto, que hemos construido nosotros. Se adapta a lo tuyo, y por eso lo primero funciona en semanas. | A05 (`{n}` = `plantillas.length`), A50 corregida («lo construimos nosotros», solo para las piezas A: A01, A03, A29), A37 (procedimiento). Nombres recomendados (P-11). Sale «herramientas» (decisión 6). | aprobada |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[2].titulo` | Lo ves funcionando antes de cada pago. | (igual) | A30 (procedimiento, D-035). El texto es `proceso[4].descripcion` (`## /`). | aprobada |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[3].titulo` | Una conversación, no un ticket. | (igual) | A39 (procedimiento, D-035). | aprobada |
| /estudio/ | `src/content/estudio.ts` | `comoTrabajamos[3].texto` | Escribes a quien lo hace y te contesta esa misma persona. | (igual) | A40, A39. | aprobada |
| /estudio/ | `src/app/estudio/page.tsx` | `Titular` · `arriba` del cierre | ¿Hablamos de tu negocio? | (igual) | Titular (CA-11: casa con la entradilla y los botones). | aprobada |
| /estudio/ | `src/app/estudio/page.tsx` | `jsx · entradilla del cierre` | Empieza por la auditoría gratuita: diez minutos de formulario y te decimos qué falta antes de hablar de precio. | Empieza por la auditoría de tu negocio: contestas unas preguntas sobre cómo trabajáis y te mandamos un informe por correo, antes de hablar de precio. La auditoría no se cobra. | Nombre de la puerta 3 (P-11). A34 corregida, A72, A56. Sale «diez minutos» (A35, C). Sale «te decimos qué falta»: lo que lleva el informe es A52, `por confirmar`. | aprobada |
| /estudio/ | `src/app/estudio/page.tsx` | `jsx · botón a /auditoria/` | Pedir la auditoría gratuita | Empezar la auditoría | Forma corta de la puerta 3 («Auditoría»). A34 corregida: sin «gratuita». | aprobada |
| /estudio/ | `src/app/estudio/page.tsx` | `jsx · botón de correo` | Escribir un correo | (igual) | A44 (correo directo). | aprobada |

## /herramientas/

La ruta no cambia (D-009; la enlazan otras páginas), pero en el menú pasa a
«Productos» (decisión 6) y la página, con ella: título, cota y `description`
dicen lo mismo que el H1 («Lo construimos nosotros.»). Tras §3.7 quedan tres
piezas, las tres de nivel A: la tienda online (A01), el informe de mejoras de tu
web (A03) y el formulario de contacto (A29). Las entradas `vigilancia` y
`ficha-google` salen enteras (A19, A20; CA-2): sus filas van como `(quitar)`.
Al quedarse el formulario solo en la fila de tarjetas sin captura, la rejilla de
tres columnas tendrá un hueco: es maquetación (T06), no texto.

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /herramientas/ | `src/app/herramientas/page.tsx` | `metadata.title` | Herramientas — {n} | Productos — {n} | Decisión 6: el cliente compra el resultado (§3.4). `{n}` = `site.nombre`. | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `metadata.description` | El software que hemos escrito para sostener cada servicio: la plataforma de tiendas, el informe de mejoras de tu web, la vigilancia diaria, la auditoría de la ficha de Google y los formularios de contacto. | La tienda online, el informe de mejoras de tu web y el formulario de contacto: lo que hemos construido nosotros y funciona hoy, enseñado con datos de ejemplo. | §3.7 (la `description`): salen la vigilancia (A19) y la auditoría de la ficha (A20), los dos C (CA-2, CA-3). A50 corregida: «lo construimos nosotros», solo para las piezas A (A01, A03, A29), y sin «sostener cada servicio». A59. Nombres recomendados (P-11). | propuesta |
| /herramientas/ | `src/content/interiores.ts` | `cotasInterior.herramientas.cota` | 0 · Herramientas | 0 · Productos | Decisión 6, como el menú. | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `CabeceraInterior` · `arriba` | Lo construimos | (igual) | A50 corregida (para las piezas A). Es el H1 de la página. | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `CabeceraInterior` · `em` | nosotros. | (igual) | Ídem. | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `jsx · entradilla` | No son programas comprados ni el panel de otra empresa con nuestro logo encima: es software que hemos escrito nosotros, y cada pieza sostiene uno de los servicios. Si algo no le encaja a tu negocio, se cambia en el código, no se espera a que lo arregle otro. | No son programas comprados ni el panel de otra empresa con nuestro logo encima: la tienda online, el informe de mejoras de tu web y el formulario de contacto los hemos escrito nosotros. Si algo no le encaja a tu negocio, podemos cambiarlo a medida. | A50 corregida: sale «cada pieza sostiene uno de los servicios». A51 (B): «se cambia en el código» pasa a «podemos cambiarlo a medida» (§3.2 regla 1; en la tienda el código no es del cliente, A60). | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `jsx · rótulo del aviso` | Aviso | (igual) | Interfaz. | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `jsx · aviso, primera frase` | La plataforma de tiendas se está estrenando con su | (quitar) | A41 (C, regla 3): posible cliente real sin autorización anotada. Sale la frase entera, con su `<strong>` («primera tienda»). | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `jsx · aviso, <strong>` | primera tienda | (quitar) | A41 (C, regla 3): es el trozo con etiqueta de la frase anterior; sale con ella. El `.` que sigue se une a «Las capturas…». | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `jsx · aviso` | Las capturas de esta página salen de una tienda de ejemplo y de la demo de una de nuestras plantillas: los negocios, los productos, los pedidos y las cifras que aparecen son inventados. | (igual) | A59 (D-007). Las capturas llevan `data-ejemplo` (CA-7, T06). | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `aria-label` del índice | Herramientas de esta página | Productos de esta página | Decisión 6. | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `jsx · rótulo de la primera` | La principal | (igual) | Interfaz. | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `Sostiene` · rótulo | Sostiene | Servicio | A50 corregida: sale «cada pieza sostiene uno de los servicios». El rótulo dice solo de qué servicio forma parte. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].nombre` | Plataforma de tiendas | Tienda online | Nombre recomendado (P-11). Filtro 1: «plataforma» es jerga. A01. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].resuelve` | Vender por internet sin montar ni aprender una tienda: te la damos funcionando y la llevas desde el móvil. | (igual) | A25, A01. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].hace[0]` | Catálogo, cobro y envíos listos el primer día | Catálogo, cobro y recogida en tienda listos el primer día | A02 corregida: «envíos» cubría el reparto local, que es B (A64). Como `proyectos.categorias[software].items[0].texto` (`## /`). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].hace[1]` | Panel pensado para el móvil | (igual) | A01. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].hace[2]` | Avisos de qué reponer y qué no se vende | Avisos de qué reponer | A01. Sale «qué no se vende»: A26 sigue `por confirmar`. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].hace[3]` | Catálogo sincronizado con Instagram, Facebook y Google Shopping | (quitar) | A53 corregida: B, conectarlo es trabajo a medida; no va en la lista de lo que hace (§3.2 regla 1). Se dice como «podemos conectar» en `ventajas.items[5]`. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].sostiene[0].nombre` | Tienda online | (igual) | Enlace al servicio. A01. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].capturas[0].alt` | Novedades de una papelería de ejemplo hecha con la plataforma, en el ordenador. | (igual) | A01, A59. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].capturas[1].alt` | Inicio del panel de la tienda de ejemplo en un móvil: ventas de la semana y la lista «Para hacer» con lo que toca reponer. | (igual) | A01, A59. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[tiendas].ventajas.titulo` | Montada por nosotros, llevada por ti | (igual) | A25, A01. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[0].titulo` | Abre vendiendo, no configurando | (igual) | A25. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[0].texto` | Subimos el catálogo con sus fotos, tallas y precios, conectamos el cobro, decidimos contigo los envíos y la recogida y la ponemos en tu dominio. | (igual) | A25 (confirmada tal cual). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[1].titulo` | Vende como un comercio de aquí | (igual) | A02 corregida. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[1].texto` | Bizum, recogida en tienda, reparto en tu pueblo por código postal y pedidos por WhatsApp o por teléfono, que cobras con un enlace de pago o en mano. | Cobra con tarjeta y Bizum, y tu cliente puede recoger en tienda. Si quieres reparto en tu pueblo o pedidos por WhatsApp o por teléfono con enlace de pago, podemos montarlo. | A02 corregida (tarjeta, Bizum y recogida: A, presente). A64 (reparto local, enlace de pago y pedidos por WhatsApp o teléfono: B, «podemos montarlo»; §3.2 regla 1). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[2].titulo` | Se lleva desde el móvil | (igual) | A01. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[2].texto` | Subir un producto, ocultar lo agotado o marcar un pedido como enviado se hace desde el teléfono, sin encender el ordenador. | (igual) | A01. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[3].titulo` | Te dice qué hacer, no te enseña gráficas | Te avisa de qué reponer | A01. «No te enseña gráficas» no tiene fila en el Anexo (§3.2 regla 6) y el panel enseña las ventas de la semana (ver el `alt` de la captura). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[3].texto` | «Repón la M del vestido de lino.» «Esto se mira mucho y no se vende.» Avisos así, y un resumen cada semana en tu correo. | «Repón la M del vestido de lino.» Avisos así, en tu panel. | A01. Sale «se mira mucho y no se vende» (A26, `por confirmar`) y «un resumen cada semana» (A19, C; está en `FRASES_C`, CA-3). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[4].titulo` | Con la cara de tu tienda | (igual) | A25. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[4].texto` | Diseño propio a partir de tu marca, no un tema que comparten otras tiendas. | Diseño a medida a partir de tu marca. | A25. Decisión 3: sin «propio» (§3.4 regla 1). Sale «no un tema que comparten otras tiendas»: sin fila en el Anexo, y la plataforma sí es compartida (A60). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[5].titulo` | Tu escaparate en Instagram, Facebook y Google Shopping | También en Instagram, Facebook y Google Shopping, a medida | A53 corregida: B, lleva «a medida» (§3.2 regla 1). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[5].texto` | El catálogo se sincroniza solo, y quien ve un producto allí entra a comprarlo en tu tienda. | Podemos conectar tu catálogo a Instagram, Facebook y Google Shopping, para que quien vea un producto allí entre a comprarlo en tu tienda. | A53 corregida: «podemos conectar», no «se sincroniza» (D-035). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[6].titulo` | Lo legal, hecho | (igual) | A25 (páginas legales). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[6].texto` | Aviso legal, privacidad, condiciones, envíos y el botón de desistir que exige la ley desde junio de 2026. Sin banner de cookies, porque las estadísticas no las usan. | Aviso legal, privacidad, condiciones y envíos. | A25. Salen el botón de desistir «desde junio de 2026» (A10) y «sin banner de cookies» (A54): las dos siguen `por confirmar`. Si Álvaro las confirma, vuelven. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[7].titulo` | Alguien detrás que la conoce | (igual) | A40. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[7].texto` | Si un cobro o un aviso falla, la alerta nos llega a nosotros. Y cuando preguntas, te contesta quien la ha hecho. | Cuando preguntas, te contesta quien la ha hecho. | A40. Sale «la alerta nos llega a nosotros» (A19, C; en `FRASES_C`, CA-3). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[8].titulo` | Encaja con lo demás | (igual) | Titular de la ventaja. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `ventajas.items[8].texto` | Las fichas de producto, la ficha de Google y el correo a tus clientes trabajan sobre la misma tienda. | Si te llevamos también la ficha de Google o el correo a tus clientes, podemos montarlos sobre la misma tienda. | A27 (B): en condicional (§3.2 regla 1). A08, A17. Salen «las fichas de producto»: la plataforma no las escribe (A01). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].nombre` | Informe de mejoras de tu web | (igual) | A03. Nombre recomendado (P-11). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].resuelve` | Saber qué falla en tu web y qué arreglar primero, con pruebas y no con opiniones. | (igual) | A03. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].hace[0]` | Mide velocidad, accesibilidad y cómo se ve en el móvil con un navegador de verdad | (igual) | A03. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].hace[1]` | Lee los textos de la portada y de las páginas de dentro | (igual) | A03. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].hace[2]` | Cada fallo trae su prueba: la medida, la frase exacta o la captura | (igual) | A03. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].hace[3]` | Lo que no se puede probar se descarta o se marca como sospecha | (igual) | A03 (cada fallo con su prueba). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].hace[4]` | Ordena los fallos por prioridad: alta, media o baja | (igual) | A03. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].sostiene[0].nombre` | La auditoría gratuita | (quitar) | Sale el enlace entero (con su `href`): que la auditoría parta del informe de tu web es A52, `por confirmar`, y «gratuita» sale por A34 corregida. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].sostiene[1].nombre` | Diseño y desarrollo web | (igual) | Enlace al servicio. A06. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[informe].capturas[0].alt` | Informe de mejoras sobre la demo de una de nuestras plantillas, con los fallos y su prueba. | (igual) | A03 (el que se enseña es sobre una plantilla), A59. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[vigilancia].nombre` | Vigilancia diaria | (quitar) | A19 (C), §3.7, CA-2. Sale la entrada entera: nombre, `resuelve`, `hace`, `sostiene` e icono. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[vigilancia].resuelve` | Que si tu web se cae nos enteremos nosotros antes que tus clientes. | (quitar) | A19 (C), §3.7. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[vigilancia].hace[0]` | Comprueba cada día que la web responde y abre por https | (quitar) | A19 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[vigilancia].hace[1]` | Avisa dos semanas antes de que caduque el certificado | (quitar) | A19 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[vigilancia].hace[2]` | Avisa un mes antes de que caduque el dominio | (quitar) | A19 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[vigilancia].hace[3]` | Detecta si el dominio deja de apuntar a tu web | (quitar) | A19 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[vigilancia].hace[4]` | Comprueba que el servicio del formulario de contacto sigue en pie | (quitar) | A19 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[ficha-google].nombre` | Auditoría de la ficha de Google | (quitar) | A20 (C), §3.7, CA-2, CA-3. Sale la entrada entera. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[ficha-google].resuelve` | Que lo que dice Google de tu negocio coincida con lo que dice tu web. | (quitar) | A20 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[ficha-google].hace[0]` | Compara nombre, teléfono y dirección con los de tu web | (quitar) | A20 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[ficha-google].hace[1]` | Revisa la web enlazada, el horario y el estado de la ficha | (quitar) | A20 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[ficha-google].hace[2]` | Sigue la valoración y las reseñas para ver si suben o bajan | (quitar) | A20 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[ficha-google].hace[3]` | Deja los cambios escritos, listos para pegar en la ficha | (quitar) | A20 (C). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[formularios].nombre` | Formularios de contacto propios | Formulario de contacto | Nombre recomendado (P-11); sin «propios» (§3.4 regla 1). A29. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[formularios].resuelve` | Que los mensajes de tu web te lleguen a ti, sin un formulario de otra empresa incrustado. | Que cada mensaje de tu web se reciba y se guarde, sin un formulario de otra empresa incrustado. | A29. «Te lleguen a ti» daba a entender el aviso por correo, que es C (A04). Como el texto de la portada (`## /`). | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[formularios].hace[0]` | El código que recibe cada mensaje lo hemos escrito nosotros | (igual) | A29, A50 corregida. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[formularios].hace[1]` | Te llega el aviso a tu correo y quien escribe recibe su confirmación | (quitar) | A04 (C): ni el aviso por correo ni la confirmación están probados (D-035). Si Álvaro lo prueba y funciona, A04 sube a A y vuelve. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[formularios].hace[2]` | Funciona igual esté la web donde esté alojada | (igual) | A29. | propuesta |
| /herramientas/ | `src/content/herramientas.ts` | `herramientas[formularios].sostiene[0].nombre` | Diseño y desarrollo web | (igual) | Enlace al servicio. A06. | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `Titular` · `arriba` del cierre | ¿Cuál le hace falta a tu negocio? | (igual) | Titular (CA-11: casa con la entradilla y el botón nuevos). | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `jsx · entradilla del cierre` | Casi nunca son todas. La auditoría gratuita parte del informe de mejoras de tu web y te dice qué falta antes de hablar de precio. | Casi nunca hacen falta todos. Cuéntanos qué te gustaría mejorar y te damos una propuesta por escrito, con el precio de cada fase. La propuesta no se cobra. | Puerta 1 (P-11): lo que enseña esta página es lo que ve tu cliente. A30, A56, A80 corregida («no se cobra»). Sale «la auditoría gratuita parte del informe…» (A52 `por confirmar`, A34 corregida). | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `jsx · botón del cierre` | Pedir la auditoría gratuita | Pedir una propuesta | Nombre de la puerta 1 (P-11), CA-17. Su `href` pasa de `/auditoria/` a `/#contacto` (el formulario corto), para que titular, entradilla y botón prometan lo mismo (CA-11). | propuesta |
| /herramientas/ | `src/app/herramientas/page.tsx` | `jsx · botón de correo` | Escribir un correo | (igual) | A44 (correo directo). | propuesta |

## /plantillas/

El catálogo se nombra por §3.5: **«Webs de ejemplo por sector»** (el
recomendado) en el título de la página, como el bloque de la portada; dentro,
«plantillas» sigue siendo la palabra común (como en `## *` y `## /`). El aviso
de negocios inventados tiene que ir **dentro de la misma `<section>`** que el
catálogo y sin letra menor (§3.5, CA-6): hoy va en la cabecera y en `text-sm`.
Moverlo, con `data-aviso-inventadas`, es trabajo de T08; el texto es el de
abajo.

**Los datos de cada plantilla** (`plantillas.ts`: `negocio`, `ciudad`,
`sector`, `concepto`, `movimiento` y `etiquetas`, 30 × 8 textos) describen
negocios inventados (A59) y lo que hace cada demo (A57, A58; sus cifras, A79).
Se han leído todos con los seis filtros y **solo cambian los cuatro de
abajo**; el resto queda tal cual y no lleva fila, como el texto de dentro de un
ejemplo (spec §3.3, «No tienen fila»). Si Álvaro quiere una fila por cada uno,
se añaden en T05 sin cambiar nada. Sus cifras («20/90/180/400 días», «46
lomos», «12°»…) las pone T05 en `CIFRAS` con A79. Las tarjetas (`TarjetaPlantilla`)
las pintan también la portada (banda A) y `/sectores/<slug>/`: sus filas van
solo aquí.

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /plantillas/ | `src/app/plantillas/page.tsx` | `metadata.title` | Plantillas — {n} | Webs de ejemplo por sector — {n} | §3.5: el catálogo se nombra «Webs de ejemplo por sector» (recomendado), como el bloque de la portada y el menú («Webs de ejemplo», `## *`). `{n}` = `site.nombre`. | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `metadata.description` | Las {n} bases por sector del taller, publicadas y abiertas. Negocios ficticios: son escaparates de lo que se construye, no clientes. | Las {n} plantillas por sector que hemos publicado, cada una con su demo entera visitable. Los negocios son inventados: enseñan lo que construimos y no son clientes. | A05 (`{n}` = `plantillas.length`), A57 corregida («abiertas» pasa a «visitables»: no es código abierto), A59. Filtro 1: «bases del taller» es jerga. | propuesta |
| /plantillas/ | `src/content/interiores.ts` | `cotasInterior.plantillas.cota` | −1 · Catálogo | (igual) | Cota (D-014). | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `CabeceraInterior` · `arriba` | {n} plantillas, | (igual) | A05: el número sale de `plantillas.length`. | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `CabeceraInterior` · `em` | cada una con una idea distinta. | (igual) | A57. | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `jsx · entradilla` | Ninguna es la anterior con otro color: cambian la estructura, la paleta, la tipografía y lo que se mueve. Pincha en cualquiera y se abre la demo entera, con su scroll y sus animaciones. | (igual) | A57 (se comprueba abriendo las demos). | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `jsx · rótulo del aviso` | Aviso | (igual) | Interfaz. Va con el aviso dentro de la `<section>` del catálogo (CA-6, T08). | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `jsx · aviso, antes del <strong>` | Todos los negocios que aparecen son | (igual) | A59 (D-007, §3.5). Sigue «inventados» en su `<strong>`. Sin letra menor: hoy lleva `text-sm` (CA-6, lo cambia T08). | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `jsx · aviso, <strong>` | inventados | (igual) | A59. | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `jsx · aviso, después del <strong>` | : nombres, direcciones, precios y textos. No son clientes ni existen. Están para enseñar cómo queda una web terminada, con contenido de verdad en vez de «Lorem ipsum». | : nombres, direcciones, precios y textos. No son clientes ni existen. Están para enseñar cómo queda una web terminada, con todo su contenido en vez de «Lorem ipsum». | A59 (§3.5). «Contenido de verdad» al lado de negocios inventados se lee como si fueran reales (como en `proyectos.categorias[webs].intro`, `## /`). | propuesta |
| /plantillas/ | `src/components/plantillas/CatalogoPlantillas.tsx` | `aria` · `legend` | Filtrar plantillas por sector | (igual) | Accesibilidad. | propuesta |
| /plantillas/ | `src/components/plantillas/CatalogoPlantillas.tsx` | `TODOS` | Todos | (igual) | Interfaz. El botón lleva detrás el recuento `({n})` (A05). | propuesta |
| /plantillas/ | `src/components/plantillas/CatalogoPlantillas.tsx` | `jsx · recuento, todas` | {n} plantillas | (igual) | A05 (`plantillas.length`). | propuesta |
| /plantillas/ | `src/components/plantillas/CatalogoPlantillas.tsx` | `jsx · recuento, filtradas` | {n} de {n} | (igual) | A05. Recuento de la interfaz. | propuesta |
| /plantillas/ | `src/components/ui/TarjetaPlantilla.tsx` | `alt` de la portada | Portada de la plantilla {n}, del sector {n} | (igual) | A59. `{n}` = `negocio` y `sector` de la plantilla. Lo pintan también la portada y `/sectores/<slug>/`. | propuesta |
| /plantillas/ | `src/content/plantillas.ts` | `plantillas[queseria].etiquetas[1]` | SVG propio | SVG a medida | Decisión 3: «propio» sale de lo que se enseña, aquí y donde aparezca (§3.4 regla 1). A57. | propuesta |
| /plantillas/ | `src/content/plantillas.ts` | `plantillas[floristeria].etiquetas[0]` | Ilustración propia | Ilustración a medida | Ídem. | propuesta |
| /plantillas/ | `src/content/plantillas.ts` | `plantillas[viajes].etiquetas[1]` | Ilustración propia | Ilustración a medida | Ídem. | propuesta |
| /plantillas/ | `src/content/plantillas.ts` | `plantillas[ceramica].etiquetas[1]` | Ilustración propia | Ilustración a medida | Ídem. | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `Titular` · `arriba` del cierre | ¿Alguna se parece a lo tuyo? | (igual) | Titular (CA-11: casa con la entradilla y el botón nuevos). | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `jsx · entradilla del cierre` | Se adapta con tus datos, tus fotos y tu marca, y está en línea en dos semanas. Y si lo tuyo no está en la lista, se construye una nueva: el catálogo empezó igual. | Se adapta con tus datos, tus fotos y tu marca. Y si lo tuyo no está en la lista, te enseñamos la que más se acerca o preparamos una nueva para tu sector. | A57 corregida (si tu sector no está, la más cercana o una nueva). Sale «en dos semanas» (A32, C: la FAQ dice que no se da plazo cerrado). Sale «el catálogo empezó igual»: sin fila en el Anexo (§3.2 regla 6). | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `jsx · botón del cierre` | Pedir la auditoría gratuita | Pedir una propuesta | Nombre de la puerta 1 (P-11), CA-17; A34 corregida (sin «gratuita»). Adaptar una plantilla es lo que ve tu cliente (puerta 1), así que su `href` pasa de `/auditoria/` a `/#contacto` (CA-11). | propuesta |
| /plantillas/ | `src/app/plantillas/page.tsx` | `jsx · botón de correo` | Pedir la de mi sector | (igual) | A57. Abre el correo (`correoSector`); la web no guarda nada (A44, correo directo). | propuesta |
| /plantillas/ | `src/components/plantillas/PideTuSector.tsx` | `correoSector` · asunto | Plantilla para mi sector | (igual) | Lo lee quien abre el correo. A44 (correo directo). El resto de `PideTuSector` solo lo pinta la portada vigente: no lleva fila. | propuesta |
| /plantillas/ | `src/components/plantillas/PideTuSector.tsx` | `correoSector` · cuerpo | Hola. Mi negocio es de este sector: | (igual) | Ídem. Sigue, tras dos saltos de línea, «Y está en:». | propuesta |
| /plantillas/ | `src/components/plantillas/PideTuSector.tsx` | `correoSector` · cuerpo, final | Y está en: | (igual) | Ídem. | propuesta |

## /privacidad/

Tiene que decir lo que hace el código (A44, spec §5, CA-14). Hoy dice que solo
recoge datos el formulario de la auditoría, y en esta rama también lo hace el
formulario corto de la portada. Lo de abajo sale de leer, el 2026-11-01,
`FormularioContacto.tsx` (envía `negocio`, `sector`, nombre, correo, teléfono
opcional, P2 y P35 con «(formulario corto de la portada)», consentimiento y
`origen: "web"`), `FormularioAuditoria.tsx` (datos de contacto, P1-P36,
consentimiento y el borrador `undertactics:auditoria:v1` en `localStorage`),
`src/lib/auditoriaApi.ts` (los dos por la Edge Function `solicitar-auditoria`,
a la tabla `solicitudes_auditoria`) y `kit/traer-solicitudes.mjs` (baja las
solicitudes con la clave de servicio a `.md` en el disco de Álvaro y solo cambia
su estado; no borra nada). Al copiarlo, T08 lo vuelve a comprobar frase a frase
(tasks.md, T08).

Plazos (D-037, 2026-11-01): no hay borrado automático y no se va a hacer, así
que el texto no promete ninguno. El borrador de la auditoría no caduca: se
guarda desde que se abre el formulario (`FormularioAuditoria.tsx:158-162`) y
solo se quita cuando el envío sale bien (`:216-221`). Nada borra las
solicitudes: ni la Edge Function, ni el kit (`kit/traer-solicitudes.mjs` solo
lee, escribe `.md` y cambia el estado), ni ningún trabajo programado del repo
(el único, `ping-supabase.yml`, solo hace un GET). Las solicitudes y sus `.md` se
guardan hasta que Álvaro los borra a mano; el año de P-14 es el criterio de ese
borrado trimestral, no algo que pase solo. Los correos se quedan en Gmail hasta
que se borran, sin plazo decidido. La base de datos y la Edge Function no se
pudieron mirar desde aquí (sin permiso en Supabase); en el repo no hay ningún
borrado.

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /privacidad/ | `src/app/privacidad/page.tsx` | `metadata.title` | Privacidad — {n} | (igual) | `{n}` = `site.nombre`. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `metadata.description` | Qué datos se recogen en el formulario de auditoría, para qué y durante cuánto. | Qué datos recogen el formulario de la portada y el de la auditoría, para qué, dónde se guardan y durante cuánto. | A44, A, obligatorio: son dos formularios, no uno. | propuesta |
| /privacidad/ | `src/content/interiores.ts` | `cotasInterior.privacidad.cota` | Fondo · Privacidad | (igual) | Cota (D-014). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `CabeceraInterior` · `arriba` | Qué hacemos | (igual) | Titular. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `CabeceraInterior` · `em` | con tus datos | (igual) | Ídem. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `jsx · entradilla` | En esta web solo se recogen datos en un sitio: el formulario de la auditoría. Ni hay analítica, ni hay publicidad, ni hay cookies de terceros. | En esta web se recogen datos en dos sitios: el formulario de la portada para pedir una propuesta y el formulario de la auditoría. Ni hay analítica, ni hay publicidad, ni hay cookies. | A44 (A, obligatorio): hoy era falso, también recoge datos el formulario corto (`FormularioContacto.tsx`). A94: no hay cookies de ningún tipo (como el aviso, `## *`). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Apartado` · título | Quién responde | (igual) | A99. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `PENDIENTE` | [PENDIENTE] | (igual) | A99 (A, obligatorio) sigue `por confirmar` (P-15): nombre fiscal, NIF y domicilio. No se inventan; hay que completarlos **antes de publicar** (los formularios ya envían a una función real). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `jsx · responsable` | (nombre fiscal y NIF), con domicilio en | (igual) | A99. Va entre `{n}` (`site.nombre`), los dos `[PENDIENTE]` y `({n})` (`site.ubicacion`). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `jsx · contacto` | Para cualquier cosa relacionada con esto: | (igual) | A44 (correo directo). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Apartado` · título | Qué se recoge | (igual) | A44. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Qué se recoge` · párrafo nuevo, primero | (no hay) | En el formulario de la portada para pedir una propuesta: tu nombre, el de tu empresa, tu correo, tu teléfono si lo pones, el tipo de negocio y lo que nos cuentes que te gustaría mejorar. | A44, formulario corto: `negocio`, `sector`, `contacto_nombre`, `contacto_email`, `contacto_telefono` (opcional) y el texto libre (P35); el tipo va también como P2. El consentimiento se guarda con ellos. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Qué se recoge` · párrafo de la auditoría | Lo que escribas en el formulario de auditoría: el nombre del negocio, la ciudad, el sector, la dirección de vuestra web si la tenéis, tu nombre, tu correo, tu teléfono si lo pones, y las respuestas a las preguntas del cuestionario. | En el formulario de la auditoría: el nombre del negocio, la ciudad, el sector, la dirección de vuestra web si la tenéis, tu nombre, tu correo, tu teléfono si lo pones, y las respuestas a las preguntas del cuestionario. | A44, auditoría (`FormularioAuditoria.tsx`): coincide campo a campo. Empieza igual que el párrafo del formulario corto. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Qué se recoge` · párrafo nuevo, correo | (no hay) | Si nos escribes directamente al correo, el mensaje llega a nuestro buzón y la web no guarda nada. | A44, correo directo (`mailto:` de «Escribir un correo», «Pedir la de mi sector» y los errores de envío). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Qué se recoge` · párrafo de IP y borrador | No se recoge tu dirección IP, ni se te pone ninguna cookie de seguimiento, ni se guarda de qué página vienes. Lo único que se guarda en tu navegador es el borrador de tus respuestas, para que no las pierdas si cierras la pestaña: eso se queda en tu ordenador y se borra al enviar el formulario. | Nosotros no guardamos tu dirección IP ni te ponemos ninguna cookie. El formulario de la portada no guarda nada en tu navegador. El de la auditoría, desde que lo abres, guarda un borrador con tus datos de contacto y tus respuestas, para que no las pierdas si cierras la pestaña: se queda en tu ordenador y se borra cuando lo envías. No caduca: si no lo envías, sigue ahí hasta que borres los datos de esta web en tu navegador. | A92 corregida: «no guardamos nosotros tu IP», sin afirmar lo que no se ha visto en la función (sale «ni se guarda de qué página vienes»). A94. A93 corregida y ajustada por D-037: el borrador guarda también nombre, correo y teléfono (`FormularioAuditoria.tsx:161`), se crea al abrir el formulario (`:158-162`), solo se quita si el envío sale bien (`:216-221`) y **no caduca**: sale el «caduca a los 30 días» de D-035. A44: el formulario corto no guarda nada en el navegador (`FormularioContacto.tsx` no usa `localStorage`). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Qué se recoge` · lo que no se pide | datos de vuestros clientes, contraseñas ni accesos a vuestros programas. Si llega algo así igualmente, se borra sin usarlo y te avisamos. | (igual) | A97, A96 (procedimiento, D-035). Va tras «El cuestionario **no pide**» (con su `<strong>`). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Qué se recoge` · diagnóstico rápido | El diagnóstico rápido no envía ni guarda tus respuestas; solo pasan a la auditoría si pulsas el botón, y ahí aplica lo de arriba. | El diagnóstico rápido no envía ni guarda tus respuestas: van en la dirección de la página (y en el enlace, si lo copias). Solo pasan a la auditoría si pulsas el botón; allí se quitan de la dirección, pasan al borrador y aplica lo de arriba. | A95 corregida: se matiza que las respuestas van en la dirección. A44 (diagnóstico rápido). Es el diagnóstico rápido: CA-17 lo admite aquí (T05 lo pone en `DIAGNOSTICO_PERMITIDO`). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Apartado` · título | Para qué | (igual) | A96. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Para qué` · párrafo 1 | Para preparar el informe que has pedido y para responderte. Nada más: ni se te apunta a un boletín, ni se te manda publicidad después, ni se usan tus respuestas como ejemplo en ningún sitio sin que nos digas que sí por escrito. | Para responderte y, si has pedido la auditoría, para preparar su informe. Nada más: ni se te apunta a un boletín, ni se te manda publicidad después, ni se usan tus respuestas como ejemplo en ningún sitio sin que nos digas que sí por escrito. | A96 (procedimiento, D-035), para los dos formularios: el corto no lleva informe (A44). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Para qué` · base legal | La base legal es la aplicación de medidas precontractuales a petición tuya (artículo 6.1.b del RGPD): nos lo pides tú rellenando el formulario. | La base legal es la aplicación de medidas precontractuales a petición tuya (artículo 6.1.b del RGPD): nos lo pides tú rellenando cualquiera de los dos formularios. | A74 (fuente: RGPD art. 6.1.b). A44: son dos formularios. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Apartado` · título | Dónde se guardan y quién los ve | (igual) | A44. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Dónde se guardan` · Supabase | En una base de datos de {n}Supabase{n} alojada en servidores de la Unión Europea (región de París). Solo se puede acceder a ella con las claves del estudio: la web no puede leer lo que han mandado otros. | Los dos formularios envían a la misma base de datos de Supabase, alojada en servidores de la Unión Europea (región de París). Solo se puede acceder a ella con las claves del estudio: la web no puede leer lo que han mandado otros. | A90 (eu-west-3, RLS sin políticas), A44 (la misma función y la misma tabla para los dos). Sin `<strong>` dentro: CA-4 busca la frase seguida. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Dónde se guardan` · párrafo nuevo, quién | (no hay) | Las lee Álvaro, que es quien tiene esas claves, y para preparar el informe de la auditoría las copia en su ordenador. | A44: quien tiene la clave de servicio es Álvaro, y `kit/traer-solicitudes.mjs --bajar` copia cada solicitud en un `.md` en su disco. Lo lee Álvaro antes de publicarlo (A40, persona con nombre). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Dónde se guardan` · Anthropic | El informe se redacta con herramientas de IA de {n}Anthropic{n}, que procesa las respuestas para generarlo y no las usa para entrenar sus modelos. Aparte de esos dos proveedores, no se cede nada a nadie. | El informe de la auditoría se redacta con la IA de Anthropic, que procesa las respuestas para generarlo y no las usa para entrenar sus modelos. Los correos que nos mandas directamente están en nuestra cuenta de Gmail, de Google. Aparte de esos proveedores, no se cede nada a nadie. | A91 (fuente: condiciones comerciales de Anthropic). A44 (el correo directo llega a la cuenta de `site.email`, que es de Gmail). Decisión 6: sin «herramientas». Sin `<strong>` dentro, como la de arriba. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Apartado` · título | Cuánto tiempo | (igual) | A75. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Cuánto tiempo` · párrafo | Un año desde que nos escribes, si no acabamos trabajando juntos. Si acabamos trabajando juntos, lo que dure la relación y los plazos que exija la ley después. Puedes pedir que se borren antes y se borran. | En nuestro lado nada se borra solo. Lo que mandes por cualquiera de los dos formularios, y las copias que bajamos para preparar el informe, se guardan hasta que los borramos a mano: cada tres meses repasamos lo guardado y borramos lo que lleve más de un año sin mensajes tuyos, si no acabamos trabajando juntos. Los correos que nos mandas directamente se quedan en nuestro buzón hasta que los borramos. Si acabamos trabajando juntos, lo que dure la relación y los plazos que exija la ley después. Puedes pedir que se borren antes y se borran. | A75 corregida y ajustada por D-037: el año de P-14 deja de ser un plazo que se cumple solo y pasa a ser el criterio del borrado a mano cada trimestre (D-035). Nada borra las solicitudes: la tabla `solicitudes_auditoria` solo recibe filas de la Edge Function (`src/lib/auditoriaApi.ts:1-12`), `kit/traer-solicitudes.mjs` solo lee, escribe el `.md` (`:249-250`) y cambia el estado (`:253-257`), y el único trabajo programado del repo (`.github/workflows/ping-supabase.yml`) hace un GET. A44: también las copias en `.md`. «Cada tres meses» es procedimiento (§3.2 regla 2, D-035): solo vale si Álvaro lo hace. El repaso trimestral de D-035 cubre la fila y el `.md`, no el correo (Gmail): para los correos solo se dice lo que pasa hoy, sin plazo (ver «Pendiente» de la PR). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Apartado` · título | Tus derechos | (igual) | RGPD. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Tus derechos` · párrafo 1 | Puedes pedir ver lo que tenemos, corregirlo, borrarlo, limitar su uso, oponerte a él o llevártelo a otro sitio. Se hace escribiendo a | (igual) | RGPD (arts. 15-21). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Tus derechos` · tras el correo | — sin formularios ni trámites, y se contesta en menos de un mes. | (igual) | A74 (fuente: RGPD art. 12.3). «Sin formularios ni trámites» dice cómo se ejerce el derecho, no es un reclamo comercial (§3.2 regla 2). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Tus derechos` · reclamación | Si crees que no lo estamos haciendo bien, puedes reclamar ante la Agencia Española de Protección de Datos ( | (igual) | Obligatorio (RGPD art. 13.2.d). | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Tus derechos` · enlace | aepd.es | (igual) | Ídem. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Apartado` · título | Cookies | (igual) | A93, A94. | propuesta |
| /privacidad/ | `src/app/privacidad/page.tsx` | `Cookies` · párrafo | Esta web no usa cookies de seguimiento ni analítica. Lo único que se guarda en tu navegador es el borrador del formulario, el hecho de que ya has visto el aviso y, solo mientras tengas la pestaña abierta, que ya has visto la animación de entrada, para no repetírtela. Ninguna de las tres cosas sale de tu ordenador. | Esta web no usa cookies ni analítica. Lo único que se guarda en tu navegador es el borrador de la auditoría, si abres su formulario (hasta que lo envíes o borres los datos de esta web en tu navegador), el hecho de que ya has visto el aviso y, solo mientras tengas la pestaña abierta, que ya has visto la animación de entrada, para no repetírtela. Nada de eso se nos manda solo: el borrador sale de tu ordenador cuando envías el formulario, y no antes. | A93 corregida y ajustada por D-037: borrador de la auditoría (`FormularioAuditoria.tsx:15,158-162`, se quita solo con envío correcto, `:216-221`, y no caduca) y aviso (`AvisoCookies.tsx:44`, sin caducidad) en `localStorage`; la cortina en `sessionStorage` (`scriptCabeza.ts:42-43`). Sale el «como mucho 30 días». «Si abres su formulario»: el borrador se guarda al cargar el formulario, aunque no se escriba nada. A94. «Ninguna sale de tu ordenador» no era exacto: el borrador es lo que se envía. Casa con el aviso de cookies (`## *`). | propuesta |

## /sectores/

El índice de las tres páginas de sector. Las tarjetas (`TarjetaSector`) pintan
`etiqueta`, `nombre` y `titular` de cada sector: sus filas van en la tabla de
cada `/sectores/<slug>/`. `sections/DiagnosticoRapido.tsx` no lo pinta ninguna
ruta de esta rama (no lo importa nadie): no lleva fila.

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /sectores/ | `src/app/sectores/page.tsx` | `metadata.title` | Por sector — {n} | (igual) | `{n}` = `site.nombre`. | propuesta |
| /sectores/ | `src/app/sectores/page.tsx` | `metadata.description` | Clínicas dentales, alojamientos rurales, y asesorías y despachos: lo que se puede automatizar en cada uno, con su diagnóstico rápido y un ejemplo del asistente. | (igual) | A22 (B, «se puede»), A11 (el asistente, como ejemplo). Nombre de la puerta 2 (P-11): CA-17 lo admite aquí (T05 pone `/sectores/` en `DIAGNOSTICO_PERMITIDO`). | propuesta |
| /sectores/ | `src/content/interiores.ts` | `cotasInterior.sectores.cota` | −4 · Sectores | (igual) | Cota (D-014). | propuesta |
| /sectores/ | `src/app/sectores/page.tsx` | `CabeceraInterior` · `arriba` | Lo que se puede automatizar | (igual) | A22 (B, «se puede»). | propuesta |
| /sectores/ | `src/app/sectores/page.tsx` | `CabeceraInterior` · `em` | en tu sector. | (igual) | Ídem. | propuesta |
| /sectores/ | `src/app/sectores/page.tsx` | `jsx · entradilla` | Cada página habla de los problemas de ese tipo de negocio, trae el diagnóstico rápido con el sector ya elegido y enseña cómo contestaría su asistente. | Cada página cuenta situaciones habituales en ese tipo de negocio, trae el diagnóstico rápido con el sector ya elegido y enseña, con un ejemplo, cómo contestaría su asistente. | P-13 y §3.1 (filtro 4): situaciones habituales, no hechos sobre quien lee. A11: el asistente sale como ejemplo rotulado (D-019). | propuesta |
| /sectores/ | `src/components/sectores/TarjetaSector.tsx` | `jsx · enlace` | Ver la página | (igual) | Interfaz. | propuesta |

## /sectores/clinicas-dentales/

Las tres páginas de sector comparten componentes (`[slug]/page.tsx`,
`CabeceraSector`, `ProblemasSector`, `MejorasSector`, `ChatEjemplo`,
`PlantillasSector`, `Fondo`, el diagnóstico rápido y las mejoras de
`diagnostico.ts`). **Sus filas van solo aquí, con ruta `/sectores/<slug>/`**;
las de `sectores.ts` propias de cada sector van en su tabla, con su ruta.

- **Situaciones habituales (P-13).** Los problemas de cada sector se escriben
  como situaciones que suelen pasar («si…», «suele…»), no como hechos sobre
  quien lee (§3.1, delta a la 001 §3.8).
- **`diagnostico.ts` no se reescribe (§6).** Se ha leído entero y solo cambia
  lo que afirma (A42, A43, A48, A55, A04), sus enlaces (§3.7) y lo que
  presupone. Las mejoras van siempre bajo «Lo que haríamos» o «Lo que haríamos
  en tu…», que es el condicional que pide un B (§3.2): describen lo que
  montaríamos, no un producto. Por eso las de nivel B (A43, A61, A62, A63) se
  quedan `(igual)` salvo donde afirman algo de más. Las preguntas, opciones,
  `frasesPrerrelleno`, `nombresCanal` y los «porque» que repiten la respuesta
  no afirman nada ni presuponen (son preguntas, §3.1): no llevan fila. Sí la
  lleva cada mejora y cada «porque» que cambia.
- **`Fondo`** (el cierre de las tres páginas) no tiene dueño en el plan §5
  (lo da como solo de la portada vigente, pero lo pintan estas páginas): lo
  copia T09 o T10, lo que diga quien reparta.

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /sectores/<slug>/ | `src/components/sectores/CabeceraSector.tsx` | `jsx · botón a #diagnostico` | Haz el diagnóstico | Haz el diagnóstico rápido | Nombre entero de la puerta 2 (P-11, CA-5): en la misma página está la auditoría, y «el diagnóstico» a secas se confunde. CA-17 lo admite en estas páginas. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/CabeceraSector.tsx` | `jsx · botón a /auditoria/` | Auditoría gratis | Auditoría de tu negocio | Nombre de la puerta 3 (P-11). A34 corregida (D-035): sin «gratis». | propuesta |
| /sectores/<slug>/ | `src/components/sectores/ProblemasSector.tsx` | `jsx · rótulo` | Lo que pasa hoy | Lo que suele pasar | P-13, filtro 4: situaciones habituales, no hechos sobre quien lee. Como la cota de la portada («0 · Lo que suele pasar», `## /`). | propuesta |
| /sectores/<slug>/ | `src/components/sectores/ProblemasSector.tsx` | `jsx · titular` | Dónde se va el tiempo. | Situaciones que se repiten. | §3.1 y filtro 4: daba por hecho que el problema es el tiempo (CA-9). | propuesta |
| /sectores/<slug>/ | `src/components/sectores/MejorasSector.tsx` | `jsx · rótulo` | Lo que haríamos | (igual) | Condicional (§3.2, B). | propuesta |
| /sectores/<slug>/ | `src/components/sectores/MejorasSector.tsx` | `jsx · titular` | Lo que puede quedar funcionando solo. | (igual) | A22 (B, «puede»). | propuesta |
| /sectores/<slug>/ | `src/components/sectores/MejorasSector.tsx` | `jsx · entradilla` | Son las mismas que puede darte el diagnóstico de más abajo. Cuáles van primero depende de cómo trabajéis. | Son las mismas que puede darte el diagnóstico rápido de más abajo. Cuáles van primero depende de cómo trabajéis. | Nombre entero de la puerta 2 (P-11, CA-5). | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/EnlaceMejora.tsx` | `texto` | Más sobre esto | (igual) | Interfaz. | propuesta |
| /sectores/<slug>/ | `src/app/sectores/[slug]/page.tsx` | `jsx · rótulo del diagnóstico` | Diagnóstico rápido · un minuto | Diagnóstico rápido | A70 (C hasta cronometrarlo, D-035): sale «un minuto». Nombre de la puerta 2 (P-11). | propuesta |
| /sectores/<slug>/ | `src/app/sectores/[slug]/page.tsx` | `jsx · titular del diagnóstico` | Lo primero que haríamos en tu caso. | (igual) | Condicional (§3.2). | propuesta |
| /sectores/<slug>/ | `src/app/sectores/[slug]/page.tsx` | `jsx · entradilla del diagnóstico` | Unas preguntas de un toque sobre cómo trabajáis y, al acabar, las mejoras que más sentido tienen para vosotros. No se envía ni se guarda nada. | Unas preguntas de un toque sobre cómo trabajáis y, al acabar, las mejoras que más sentido tienen para vosotros. No se envía ni se guarda nada: las respuestas van en la dirección de la página. | A95 corregida (D-035): se matiza que las respuestas van en la dirección. Como el texto de la puerta 2 en la portada (`## /`). | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/PasoPregunta.tsx` | `aria-label` de la barra | Progreso del diagnóstico | (igual) | Accesibilidad. Es el diagnóstico rápido (CA-17 lo admite). | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/PasoPregunta.tsx` | `jsx · botón` | Atrás | (igual) | Interfaz. | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/PasoPregunta.tsx` | `jsx · botón` | Seguir | (igual) | Interfaz. | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/Diagnostico.tsx` | `noscript` · texto | El diagnóstico rápido necesita JavaScript para ir pregunta a pregunta. Si lo tienes desactivado, puedes pedirnos directamente la | (igual) | Interfaz. Sigue el enlace de abajo. | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/Diagnostico.tsx` | `noscript` · enlace a /auditoria/ | auditoría gratuita | auditoría de tu negocio | Nombre de la puerta 3 (P-11). A34 corregida: sin «gratuita». | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/Resultado.tsx` | `jsx · rótulo` | Tu diagnóstico | (igual) | Es el resultado del diagnóstico rápido (CA-17 lo admite). | propuesta |
| /sectores/<slug>/ | `src/lib/diagnostico.ts` | `tituloResultado` | Lo que haríamos en tu {n} | (igual) | Condicional (§3.2). `{n}` = `nombresSector[].negocio` o «negocio». | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/Resultado.tsx` | `jsx · tras las mejoras` | Esto lo podemos montar nosotros o cualquier agencia que sepa hacerlo. | (igual) | B en condicional («podemos montar», §3.2). | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/Resultado.tsx` | `jsx · botón` | Llevar estas respuestas a la auditoría | (igual) | A95: las respuestas pasan a la auditoría solo con este botón (A44). | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/Resultado.tsx` | `jsx · botón` | Copiar el enlace a este diagnóstico | (igual) | A95 (las respuestas van en el enlace). | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/Resultado.tsx` | `jsx · botón` | Cambiar respuestas | (igual) | Interfaz. | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/Resultado.tsx` | `jsx · copiado` | Enlace copiado | (igual) | Interfaz. | propuesta |
| /sectores/<slug>/ | `src/components/diagnostico/Resultado.tsx` | `jsx · copia a mano` | No hemos podido copiarlo. Cópialo desde aquí: | (igual) | Interfaz. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[reservas-online].titulo.base` | Que pidan cita sin llamar | (igual) | A61 (B), bajo «Lo que haríamos». | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[reservas-online].titulo.despachos` | Que pidan la primera consulta sin llamar | (igual) | A61 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[reservas-online].queResuelve.base` | Un calendario en tu web con tus horas libres de verdad: el cliente elige la suya y el sistema de citas le manda la confirmación y un recordatorio antes de venir. Tú dejas de cuadrar huecos al teléfono. | (igual) | A61 (B): describe lo que montaríamos, bajo «Lo que haríamos». No dice que lo haga el asistente (A11 no manda recordatorios). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[reservas-online].queResuelve.dental` | Un calendario en tu web con las horas libres de verdad: el paciente elige la suya y el sistema de citas le manda la confirmación y un recordatorio antes de venir. Recepción deja de cuadrar huecos al teléfono. | (igual) | A61 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[reservas-online].queResuelve.despachos` | Un calendario en tu web con los huecos que guardas para primeras consultas: el cliente elige uno, cuenta en una línea de qué va su asunto y el sistema de citas le manda la confirmación y un recordatorio. | (igual) | A61 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[reservas-directas].titulo.base` | Reservas en tu propia web | (igual) | A62 (B). «Propia» es la web del cliente, no un producto nuestro (§3.4 regla 1 no aplica). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[reservas-directas].queResuelve.base` | Un motor de reservas en tu web, con el calendario enlazado al de Booking y Airbnb para no vender dos veces la misma noche. Quien ya te conoce reserva contigo, y las plataformas quedan para que te encuentren los nuevos. | Un motor de reservas en tu web, con el calendario enlazado al de Booking y Airbnb para no vender dos veces la misma noche. Así, quien ya te conoce puede reservar contigo, y las plataformas quedan para que te encuentren los nuevos. | A62 (B). «Quien ya te conoce reserva contigo» atribuía un comportamiento al huésped (A46, C): pasa a posibilidad («puede», §3.1). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[asistente].titulo.base` | Que alguien conteste fuera de horario | (igual) | A11. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[asistente].queResuelve.base` | Un asistente en tu web que contesta lo de siempre a cualquier hora y recoge los datos de quien necesita hablar contigo, para que le llames tú. | (igual) | A11 (A). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[asistente].queResuelve.dental` | Un asistente en tu web que contesta lo de siempre a cualquier hora, ofrece las horas libres para pedir cita y pasa a una persona lo que no le toca, como una urgencia. No da consejos clínicos. | (igual) | A11 (A: en dental ofrece horas y reserva). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[asistente].queResuelve.rural` | Un asistente en tu web que contesta a cualquier hora lo que siempre se pregunta (cómo llegar, a qué hora es la entrada, si se admiten mascotas) y te deja el contacto de quien quiere que le llames. | (igual) | A11. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[asistente].queResuelve.despachos` | Un asistente en tu web que contesta a cualquier hora lo que siempre se pregunta (horario, qué llevar a la primera consulta, qué asuntos lleváis) y recoge el contacto para que llame una persona. | (igual) | A11. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[formularios].titulo.base` | Mensajes de la web que llegan ordenados | (igual) | A29. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[formularios].queResuelve.base` | Un formulario propio en tu web que te deja cada mensaje en tu correo, con los mismos datos siempre, y le confirma a quien escribe que lo has recibido. Sin el formulario de otra empresa incrustado. | Un formulario en tu web que recibe y guarda cada mensaje, con los mismos datos siempre y sin el formulario de otra empresa incrustado. | A29. Salen el aviso a tu correo y la confirmación a quien escribe (A04, C) y «propio» (§3.4 regla 1). Su enlace (`/herramientas/#formularios`) sigue: el ancla existe. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[ficha-google].titulo.base` | Tu ficha de Google, completa y al día | (igual) | A08 (a mano): es un consejo, no una herramienta (§3.7). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[ficha-google].queResuelve.base` | Horario, teléfono, dirección y enlace a la web revisados y coherentes con lo que dice tu web, para que quien te busca en el mapa sepa a qué atenerse antes de llamarte. | (igual) | A08 (lo hacemos a mano). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[ficha-google].enlace.portada` | /herramientas/#ficha-google | /#servicios | §3.7: la mejora se queda (D-003 exige enlace) y el enlace pasa a `/#servicios` (delta a la 001 §3.4). CA-2. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[ficha-google].enlace.sector` | /herramientas/#ficha-google | /#servicios | Ídem, en los dos sitios. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[web-nueva].titulo.base` | Una web que puedas cambiar tú | Una web rápida y al día | A55 (B): no hay un editor para el cliente; los cambios los hacemos nosotros (A07). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[web-nueva].queResuelve.base` | Una web rápida en el móvil, que cuenta lo que haces y cómo contactarte, y en la que cambiar un horario o un texto no depende de nadie. | Una web rápida en el móvil, que cuenta lo que haces y cómo contactarte, y que cambiamos cuando nos lo pidas. | A06, A07 (A). Sale «cambiar un horario o un texto no depende de nadie» (A55, B en presente). Como la parada nueva del hero («Cambios cuando los pidas», decisión 1). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[web-nueva].queResuelve.dental` | Una web rápida en el móvil, con tus tratamientos, tu equipo y cómo pedir cita, en la que cambiar un horario o un texto no depende de nadie. | Una web rápida en el móvil, con tus tratamientos, tu equipo y cómo pedir cita, que cambiamos cuando nos lo pidas. | Ídem. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[web-nueva].queResuelve.rural` | Una web rápida en el móvil, con tus fotos, tus habitaciones y la zona, en la que cambiar una tarifa o un texto no depende de nadie. | Una web rápida en el móvil, con tus fotos, tus habitaciones y la zona, que cambiamos cuando nos lo pidas. | Ídem. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[web-nueva].queResuelve.despachos` | Una web rápida en el móvil, que explica qué asuntos llevas y cómo se trabaja contigo, y en la que cambiar un texto no depende de nadie. | Una web rápida en el móvil, que explica qué asuntos llevas y cómo se trabaja contigo, y que cambiamos cuando nos lo pidas. | Ídem. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[informe-web].titulo.base` | Saber qué falla en tu web | (igual) | A03. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[informe-web].queResuelve.base` | Un repaso con pruebas de la velocidad, el móvil, la accesibilidad y los textos, con cada fallo ordenado por prioridad para arreglar primero lo que más pesa. | (igual) | A03. Su enlace (`/herramientas/#informe`) sigue. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[resenas].titulo.base` | Que la reseña se pida sola | (igual) | A43 (B), bajo «Lo que haríamos». | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[resenas].queResuelve.base` | Después de cada servicio, el cliente recibe un correo con el enlace directo a tu ficha de Google. Se pide a todos y en el momento bueno, sin que tengas que acordarte. | (igual) | A43 (B): describe lo que montaríamos. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[resenas].queResuelve.dental` | Después de la visita, el paciente recibe un correo con el enlace directo a tu ficha de Google. Se pide a todos y en el momento bueno, sin que recepción tenga que acordarse. | (igual) | A43 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[resenas].queResuelve.rural` | Al acabar la estancia, el huésped recibe un correo con el enlace directo a tu ficha de Google. Se pide a todos y en el momento bueno, sin que tengas que acordarte. | (igual) | A43 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[resenas].queResuelve.despachos` | Al cerrar un asunto, el cliente recibe un correo con el enlace directo a tu ficha de Google. Se pide a todos y en el momento bueno, sin que tengas que acordarte. | (igual) | A43 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[documentacion].titulo.base` | Los papeles, en un sitio ordenado | (igual) | A63 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[documentacion].titulo.dental` | La ficha del paciente, antes de la primera visita | (igual) | A63 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[documentacion].titulo.rural` | Los datos del huésped, antes de que llegue | (igual) | A63 (B), A43. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[documentacion].titulo.despachos` | La documentación, ordenada y no por WhatsApp | La documentación, ordenada en un solo sitio | A63 (B). Filtro 4: daba por hecho que hoy llega por WhatsApp (CA-9). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[documentacion].queResuelve.base` | Un formulario donde el cliente te manda lo que le pides, con la lista de lo que falta a la vista. Todo llega junto y con su nombre, no repartido entre el correo y el móvil. | (igual) | A63 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[documentacion].queResuelve.dental` | El paciente nuevo rellena sus datos desde casa antes de venir y te llegan completos y legibles, en vez de en papel en la sala de espera. | (igual) | A63 (B; datos de salud: si se monta, lleva su propio análisis de datos). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[documentacion].queResuelve.rural` | El huésped deja los datos del registro de viajeros en un formulario antes de llegar, y no hay que pedírselos uno a uno en la entrada. | (igual) | A43, A63 (B; el registro recoge el DNI: si se monta, lleva su propio análisis de datos). A47. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[documentacion].queResuelve.despachos` | Cada cliente sube su documentación a un formulario con la lista de lo que falta. Llega junta y con su nombre, no repartida entre el correo y el WhatsApp. | Cada cliente sube su documentación a un formulario con la lista de lo que falta. Llega junta y con su nombre, en vez de repartida entre varios sitios. | A63 (B). Filtro 4: daba por hecho el correo y el WhatsApp (CA-9). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[cobros].titulo.base` | Facturas y cobros que salen solos | (igual) | A43 (B), bajo «Lo que haríamos». Si se monta y emite facturas, entra Verifactu (RD 1007/2023): no se dice aquí. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[cobros].queResuelve.base` | La factura se hace al cerrar el trabajo y, si no se paga, el aviso de cobro sale en su fecha. Ya no persigues a nadie y ves de un vistazo qué falta por cobrar. | (igual) | A43 (B). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[clientes-nuevos].titulo.base` | Aparecer cuando te buscan | (igual) | A08, A09. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[clientes-nuevos].queResuelve.base` | La ficha de Google, las reseñas y una web rápida trabajando juntas para que te encuentre quien busca lo tuyo cerca. | (igual) | A08, A09. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[clientes-nuevos].queResuelve.dental` | La ficha de Google, las reseñas y una web rápida trabajando juntas para que te encuentre quien busca dentista cerca de casa. | (igual) | A08, A09. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[clientes-nuevos].queResuelve.rural` | La ficha de Google, las reseñas y una web rápida trabajando juntas para que te encuentre quien busca dónde dormir por la zona. | (igual) | A08, A09. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `mejoras[clientes-nuevos].queResuelve.despachos` | La ficha de Google, las reseñas y una web rápida trabajando juntas para que te encuentre quien busca asesoría o abogado en tu zona. | (igual) | A08, A09. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `reglas[13] (ficha-google).porque.base` | Porque nos dijiste que tampoco tienes ficha de Google, y es lo primero que sale en el mapa. | Porque nos dijiste que tampoco tienes ficha de Google. | A48 (C): juicio sobre Google sin fuente (§3.2 regla 5). | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `reglas[16] (ficha-google).porque.base` | Porque nos dijiste que tu web no la toca nadie, y la ficha de Google se suele quedar igual de atrás. | Porque nos dijiste que tu web no la toca nadie: conviene revisar también la ficha de Google. | A48 (C): «se suele quedar igual de atrás» es un juicio sin fuente; pasa a consejo nuestro. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `relleno[dental].porque` | Es de lo que más compensa en una clínica dental. | La recomendamos en cualquier clínica dental. | A48 (C): superlativo sin fuente; pasa a recomendación nuestra. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `relleno[rural].porque` | Es de lo que más compensa en un alojamiento rural. | La recomendamos en cualquier alojamiento rural. | Ídem. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `relleno[despachos].porque` | Es de lo que más compensa en una asesoría o un despacho. | La recomendamos en cualquier asesoría o despacho. | Ídem. | propuesta |
| /sectores/<slug>/ | `src/content/diagnostico.ts` | `relleno[otro].porque` | Es de lo que más compensa en casi cualquier negocio. | La recomendamos en casi cualquier negocio. | Ídem. | propuesta |
| /sectores/<slug>/ | `src/app/sectores/[slug]/page.tsx` | `aria-label` del ejemplo | Ejemplo del asistente | (igual) | Lleva «Ejemplo» (D-019). | propuesta |
| /sectores/<slug>/ | `src/components/sectores/ChatEjemplo.tsx` | `Etiqueta` | Ejemplo · negocio inventado | (igual) | D-019, no se toca (§3.8). A59. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/ChatEjemplo.tsx` | `jsx · titular` | Así contestaría el asistente de {n} | (igual) | A11, en condicional. `{n}` = `ejemplo.de` del sector. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/ChatEjemplo.tsx` | `jsx · cabecera del chat` | Asistente virtual | (igual) | Dentro del ejemplo. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/ChatEjemplo.tsx` | `sr-only` · asistente | Asistente: | (igual) | Accesibilidad. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/ChatEjemplo.tsx` | `sr-only` · cliente | Cliente: | (igual) | Accesibilidad. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/PlantillasSector.tsx` | `jsx · rótulo` | Plantillas del sector | (igual) | A57. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/PlantillasSector.tsx` | `jsx · titular` | Así puede quedar la web. | (igual) | A57, condicional. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/PlantillasSector.tsx` | `jsx · rótulo del aviso` | Aviso | (igual) | Interfaz. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/PlantillasSector.tsx` | `jsx · aviso, antes del <strong>` | Todos los negocios que aparecen son | (igual) | A59 (§3.5). El aviso ya va dentro de la `<section>`; falta `data-aviso-inventadas` y quitar la letra menor (`text-sm`): CA-6, T09. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/PlantillasSector.tsx` | `jsx · aviso, <strong>` | inventados | (igual) | A59. | propuesta |
| /sectores/<slug>/ | `src/components/sectores/PlantillasSector.tsx` | `jsx · aviso, después del <strong>` | : nombres, direcciones, precios y textos. No son clientes ni existen. Están para enseñar cómo queda una web terminada, con contenido de verdad en vez de «Lorem ipsum». | : nombres, direcciones, precios y textos. No son clientes ni existen. Están para enseñar cómo queda una web terminada, con todo su contenido en vez de «Lorem ipsum». | A59. El mismo texto que en `/plantillas/`. | propuesta |
| /sectores/<slug>/ | `src/components/sections/Fondo.tsx` | `Titular` · `arriba` | Antes de venderte nada, te decimos qué te está costando dinero. | Antes de hablar de precio, miramos cómo trabajáis. | A56. «Qué te está costando dinero» se apoya en A36 y A52 (`por confirmar`) y da por hecho una pérdida (filtro 4). Como `/estudio/` («Primero miramos, luego hablamos de precio.»). | propuesta |
| /sectores/<slug>/ | `src/components/sections/Fondo.tsx` | `jsx · entradilla` | Contestas {n} preguntas sobre cómo trabajáis —diez minutos, con tus palabras— y te devolvemos un informe con las horas que se van cada semana, lo que cuestan al año y qué se arregla primero. | Contestas {n} preguntas sobre cómo trabajáis, con tus palabras, y te mandamos por correo un informe de tu negocio. | A38 (`{n}` = `TOTAL_PREGUNTAS`), A72. Sale «diez minutos» (A35, C). Salen las horas, lo que cuestan y qué se arregla primero: A36 y A52 siguen `por confirmar`. | propuesta |
| /sectores/<slug>/ | `src/components/sections/Fondo.tsx` | `jsx · segundo párrafo` | Sin coste, sin compromiso y sin que tengas que darnos acceso a nada. Si con el informe te apañas por tu cuenta, nos parece bien: al menos ya sabes por dónde ibas sangrando. | La auditoría no se cobra, y no te pedimos acceso a ninguno de tus programas. | A34 corregida («no se cobra»), A97. Salen «sin coste, sin compromiso» (A33, C; CA-16). Sale «si con el informe te apañas…»: que el informe es tuyo sigas o no es A52, `por confirmar`. Filtro 4 y 6: «por dónde ibas sangrando» daba por hecho una pérdida. | propuesta |
| /sectores/<slug>/ | `src/content/auditoria.ts` | `loQueRecibes[0].titulo` | Tu web, puntuada | (quitar) | A52 y A81 siguen `por confirmar`. Sale la entrada entera. Si Álvaro las confirma en T05, vuelve `(igual)`. Solo la pinta `Fondo`. | propuesta |
| /sectores/<slug>/ | `src/content/auditoria.ts` | `loQueRecibes[0].texto` | Once dimensiones con la prueba delante: qué carga lento, qué no se ve en el móvil, qué te está costando posiciones en Google y qué falla de accesibilidad. | (quitar) | A81 («once dimensiones») y A52, `por confirmar`. | propuesta |
| /sectores/<slug>/ | `src/content/auditoria.ts` | `loQueRecibes[1].titulo` | Las horas que se van | (quitar) | A36 y A52, `por confirmar`. | propuesta |
| /sectores/<slug>/ | `src/content/auditoria.ts` | `loQueRecibes[1].texto` | Lo que tú nos cuentas, convertido en horas a la semana y en euros al año. Con el cálculo a la vista para que puedas discutirlo. | (quitar) | A36, `por confirmar`. | propuesta |
| /sectores/<slug>/ | `src/content/auditoria.ts` | `loQueRecibes[2].titulo` | Qué automatizar primero | (quitar) | A52, `por confirmar`. | propuesta |
| /sectores/<slug>/ | `src/content/auditoria.ts` | `loQueRecibes[2].texto` | Ocho áreas puntuadas y una lista ordenada por lo que más compensa, no por lo que más nos gustaría vender. | (quitar) | A81 («ocho áreas») y A52, `por confirmar`. | propuesta |
| /sectores/<slug>/ | `src/content/auditoria.ts` | `loQueRecibes[3].titulo` | Lo que no sabemos | (quitar) | A52, `por confirmar`. | propuesta |
| /sectores/<slug>/ | `src/content/auditoria.ts` | `loQueRecibes[3].texto` | Lo que dejes en blanco sale marcado como «sin datos». Un informe con huecos sinceros vale más que uno relleno de suposiciones. | (quitar) | A52 («sin datos» donde dejes en blanco), `por confirmar`. | propuesta |
| /sectores/<slug>/ | `src/components/sections/Fondo.tsx` | `jsx · rótulo de lo que no se pide` | Lo que no te vamos a pedir | (igual) | A97. La lista es `loQueNoPedimos` (filas en `## /auditoria/`). | propuesta |
| /sectores/<slug>/ | `src/components/sections/Fondo.tsx` | `jsx · nota de lo que no se pide` | La auditoría se hace sobre cómo trabajáis, no entrando en vuestros sistemas. Si algo de eso llega igualmente, se devuelve sin abrirlo. | La auditoría se hace sobre cómo trabajáis, sin entrar en vuestros programas. Si aun así nos llega algo de eso, lo borramos y te avisamos. | A97. A96 (procedimiento, D-035): lo que llega se borra y te avisamos; «se devuelve sin abrirlo» no era lo confirmado (y casa con `/privacidad/`). | propuesta |
| /sectores/<slug>/ | `src/content/cifras.ts` | `cifras[0].etiqueta` | Plantillas propias publicadas y en línea | Plantillas publicadas, con su demo entera | Decisión 3: sale «propias». A05, A57. No la pinta ninguna ruta de esta rama (solo `Plantillas.tsx`, de la portada vigente), pero `portada.test.ts` la busca por esta etiqueta: T07 cambia los dos juntos. | propuesta |
| /sectores/<slug>/ | `src/content/cifras.ts` | `cifras[1].etiqueta` | Desde que dices que sí hasta que está en línea | (quitar) | A32 (C): «2 sem.» no tiene fuente y la FAQ dice que no se da plazo cerrado. Sale la entrada entera (valor 2 y sufijo «sem.»). Ojo: `plazo` y `Plantillas.tsx` (portada vigente) la usan: T07 ve cómo queda el código. | propuesta |
| /sectores/<slug>/ | `src/content/cifras.ts` | `cifras[2].etiqueta` | Preguntas de la auditoría, y las contestas en 10 minutos | Preguntas de la auditoría | A38 (el valor, 36, sale de la fuente). Sale «10 minutos» (A35, C hasta cronometrar). `Fondo` la sigue encontrando (busca por «Preguntas de la auditoría»). | propuesta |
| /sectores/<slug>/ | `src/content/cifras.ts` | `cifras[3].etiqueta` | Lo que cuesta la auditoría y el presupuesto | (quitar) | A34 y A80 corregidas (D-035): el precio se dice «no se cobra», sin «0 €». Sale la entrada entera (valor 0 y sufijo «€»). `Fondo` la exige hoy (lanza un error si falta): el cambio de código es de quien copie `Fondo` (la fila de la cifra se queda con una sola). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].nombre` | Clínicas dentales | (igual) | Sector de D-006. También lo pinta la tarjeta de `/sectores/`. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].etiqueta` | Clínicas dentales | (igual) | Ídem. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].titular` | Que el teléfono no saque a nadie del gabinete | (igual) | Es lo que se busca, no un hecho sobre quien lee (P-13). Lo pinta también la tarjeta de `/sectores/`. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].entradilla` | Citas, preguntas de siempre, reseñas y la ficha del paciente nuevo: lo que puede quedar funcionando solo para que recepción atienda a quien ya está en la clínica. | (igual) | B en condicional («puede»): A61, A11, A43, A63. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].metadatos.title` | Webs y automatización para clínicas dentales — {n} | (igual) | A06, A22. `{n}` = `site.nombre`. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].metadatos.description` | Citas sin llamar, respuestas a cualquier hora y la ficha del paciente antes de la primera visita. Lo que se puede automatizar en una clínica dental, con un ejemplo del asistente. | (igual) | A61, A11, A63; B en condicional («se puede»). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].problemas[0].titulo` | El teléfono suena en mitad de un tratamiento | (igual) | Situación habitual (P-13). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].problemas[0].texto` | Quien coge el teléfono también ayuda en el gabinete o esteriliza instrumental. Si suena en ese momento, la llamada se pierde, y el paciente que no vuelve a llamar pide cita en otra clínica. | Si quien coge el teléfono también ayuda en el gabinete o esteriliza instrumental, la llamada que entra en ese momento se pierde, y puede que ese paciente no vuelva a llamar. | P-13, filtro 4: con «si», no como hecho sobre la clínica que lee. Sale «pide cita en otra clínica»: comportamiento que no podemos citar (§3.2 regla 5). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].problemas[1].titulo` | Una hora de sillón que se queda vacía | (igual) | Situación habitual (P-13). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].problemas[1].texto` | Un paciente que cancela la víspera deja el gabinete parado. Si las horas libres solo se saben llamando a la clínica, ese hueco no lo coge nadie, aunque haya quien lo quisiera. | Si un paciente cancela la víspera, el gabinete se queda parado. Y si las horas libres solo se saben llamando a la clínica, ese hueco no lo coge nadie, aunque haya quien lo quisiera. | P-13, filtro 4. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].problemas[2].titulo` | Las mismas preguntas, todos los días | (igual) | Situación habitual (P-13). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].problemas[2].texto` | Si trabajáis con tal seguro, si la primera visita se paga, si la ortodoncia se puede pagar a plazos. Son siempre las mismas, y cada una corta lo que se estaba haciendo. | Si trabajáis con tal seguro, si la primera visita se paga, si la ortodoncia se puede pagar a plazos. Suelen ser las mismas, y cada una corta lo que se estaba haciendo. | P-13: habitual («suelen»), no un hecho («son siempre»). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].problemas[3].titulo` | Un dolor de muela un domingo por la noche | (igual) | Situación habitual (P-13). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].problemas[3].texto` | Llega por el formulario de la web o por un mensaje en redes, nadie lo lee hasta el lunes y el paciente no sabe a quién llamar. Una urgencia tiene que llegar a una persona, y rápido. | Si llega por la web o por un mensaje en redes y nadie lo lee hasta el lunes, el paciente no sabe a quién llamar. Una urgencia tiene que llegar a una persona, y rápido. | P-13, filtro 4: daba por hecho que la clínica tiene formulario y redes (CA-9). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].ejemplo.de` | una clínica | (igual) | Va en «Así contestaría el asistente de {n}». | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].ejemplo.negocio` | Clínica Dental Demo | (igual) | Negocio inventado (A59), dentro del ejemplo. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[0].texto` | Hola, soy la asistente virtual de Clínica Dental Demo. Puedo resolver dudas y pedirte cita. ¿En qué te ayudo? | (igual) | Dentro del chat «Ejemplo» (D-019, CA-7). A11 (en dental reserva la cita). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[1].texto` | Quiero una limpieza el jueves por la tarde. | (igual) | Ejemplo. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[2].texto` | El jueves por la tarde tengo libres las 16:30, las 17:00 y las 18:30. ¿Cuál te viene mejor? | (igual) | Ejemplo: las horas van dentro de `data-ejemplo` (CA-8). A11. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[3].texto` | Las 17:00. | (igual) | Ejemplo. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[4].texto` | Perfecto. Para reservarla solo necesito tu nombre y un teléfono de contacto. | (igual) | Ejemplo. A11. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[5].texto` | Ana Ejemplo, 600 000 000. | (igual) | Ejemplo: datos inventados. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[6].texto` | Te resumo: limpieza dental el jueves a las 17:00, a nombre de Ana Ejemplo, con el teléfono 600 000 000. ¿La reservo? | (igual) | Ejemplo. A11. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[7].texto` | Sí. Y otra cosa: me duele muchísimo una muela y tengo la cara hinchada. | (igual) | Ejemplo. | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[8].texto` | Reservada la limpieza del jueves a las 17:00. Lo del dolor no puedo valorarlo yo: tiene que verlo el equipo cuanto antes. Llama ahora a la clínica al 981 000 000 y te dirán qué hacer. | (igual) | Ejemplo. A11 (pasa a una persona lo que no le toca; no da consejos clínicos). | propuesta |
| /sectores/clinicas-dentales/ | `src/content/sectores.ts` | `paginas[dental].conversacion[9].texto` | Vale, llamo ahora. Gracias. | (igual) | Ejemplo. | propuesta |

## /sectores/alojamientos-rurales/

Lo común a las tres páginas de sector va en `## /sectores/clinicas-dentales/`.

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].nombre` | Casas, apartamentos y hoteles rurales | (igual) | Sector de D-006. También lo pinta la tarjeta de `/sectores/`. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].etiqueta` | Alojamientos rurales | (igual) | Ídem. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].titular` | Que no todas las reservas tengan que pasar por Booking | (igual) | Lo que se busca, no un hecho sobre quien lee (P-13). Lo pinta también la tarjeta de `/sectores/`. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].entradilla` | Una web con reservas propias, las respuestas de siempre a cualquier hora y los datos del huésped antes de que llegue, para que las plataformas sean una vía más y no la única. | Una web donde te puedan reservar directamente, las respuestas de siempre a cualquier hora y los datos del huésped antes de que llegue: lo que podemos montar para que las plataformas sean una vía más y no la única. | A62, A63 (B, «podemos montar», §3.2 regla 1), A11. Decisión 3: sin «propias». | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].metadatos.title` | Webs y automatización para alojamientos rurales — {n} | (igual) | A06, A22. `{n}` = `site.nombre`. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].metadatos.description` | Reservas en tu propia web, respuestas a cualquier hora y el registro de viajeros antes de la llegada. Lo que se puede automatizar en una casa o un hotel rural, con un ejemplo del asistente. | (igual) | A62, A11, A43; B en condicional («se puede»). «Propia» es la web del cliente. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].problemas[0].titulo` | La comisión, también del huésped que repite | (igual) | A42. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].problemas[0].texto` | Quien ya estuvo en la casa y quiere volver la busca en Booking, porque es donde la encontró, y esa noche vuelve a pagar comisión. Sin una web donde reservar contigo, la plataforma se queda también con los que ya te conocen. | Según sus condiciones, Booking y Airbnb cobran comisión por cada reserva, también por la de quien ya estuvo en la casa. Si quien quiere volver la busca en la plataforma donde la encontró, esa noche vuelve a pagar comisión. | A42 (A, de terceros: sin cifra y citando sus condiciones, §3.2 regla 5). A46 (C): el comportamiento del huésped pasa a situación posible, con «si» (§3.1). Sale «la plataforma se queda también con los que ya te conocen» (A46). | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].problemas[1].titulo` | Calendarios que no se hablan | (igual) | Situación habitual (P-13). | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].problemas[1].texto` | Las reservas por teléfono en una libreta o en el móvil; las de Booking y Airbnb, cada una en su panel. Cada reserva nueva obliga a cerrar a mano las mismas fechas en los demás sitios, y un descuido vende dos veces la misma noche. | Si las reservas por teléfono van en una libreta o en el móvil, y las de Booking y Airbnb cada una en su panel, cada reserva nueva obliga a cerrar a mano las mismas fechas en los demás sitios, y un descuido vende dos veces la misma noche. | P-13, filtro 4: con «si», sin dar por hecho cómo lleva las reservas quien lee. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].problemas[2].titulo` | Las preguntas llegan cuando estás limpiando | Las preguntas llegan cuando hay más trabajo | Filtro 4: daba por hecho qué hace quien lee. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].problemas[2].texto` | Cómo se llega por la pista, si hay cobertura, si se admiten perros, a qué hora se entrega la llave. Llegan de noche y en fin de semana, que es justo cuando hay huéspedes entrando y saliendo. | Cómo se llega por la pista, si hay cobertura, si se admiten perros, a qué hora se entrega la llave. Suelen llegar de noche y en fin de semana, que es justo cuando hay huéspedes entrando y saliendo. | P-13: habitual («suelen»), no un hecho. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].problemas[3].titulo` | El registro de viajeros, uno a uno en la entrada | (igual) | A47. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].problemas[3].texto` | Cada huésped tiene que dar sus datos para el registro, y pedírselos a la llegada, con las maletas en la puerta, es lento para los dos. Con un grupo, más. | Cada huésped tiene que dar sus datos para el registro de viajeros (lo exige el Real Decreto 933/2021). Si se piden a la llegada, con las maletas en la puerta, es lento para los dos, y con un grupo, más. | A47 (A): fuente RD 933/2021, que se cita al nombrarlo. P-13: con «si». «933/2021» es el número de la norma, no una cifra (T05 lo pone en `CIFRAS` con A47). | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].ejemplo.de` | un alojamiento | (igual) | Va en «Así contestaría el asistente de {n}». | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].ejemplo.negocio` | Casa Rural Demo | (igual) | Negocio inventado (A59), dentro del ejemplo. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].conversacion[0].texto` | Hola, soy el asistente virtual de Casa Rural Demo. Puedo resolver dudas sobre la casa y, si quieres reservar, dejar tu contacto para que te llame quien lleva las reservas. ¿En qué te ayudo? | (igual) | Dentro del chat «Ejemplo» (D-019, CA-7). A11 (recoge el contacto; no reserva). | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].conversacion[1].texto` | ¿Admitís perros? | (igual) | Ejemplo. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].conversacion[2].texto` | Sí, avisando al hacer la reserva. Pueden estar en las zonas comunes y en el jardín, pero no en los dormitorios. | (igual) | Ejemplo. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].conversacion[3].texto` | ¿Y a qué hora se puede entrar? Llegaríamos tarde, sobre las diez de la noche. | (igual) | Ejemplo (las horas van dentro de `data-ejemplo`, CA-8). | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].conversacion[4].texto` | La entrada es a partir de las cuatro de la tarde. Si llegáis más tarde se os puede dejar la llave preparada, pero hay que acordarlo antes con la casa. | (igual) | Ejemplo. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].conversacion[5].texto` | ¿Tenéis libre el puente de diciembre para cuatro personas y el perro? | (igual) | Ejemplo. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].conversacion[6].texto` | Las fechas libres no las veo yo: las confirma la persona que lleva las reservas. Si me dejas tu nombre y un teléfono o un correo, te llama para cerrarlo. | (igual) | Ejemplo. A11 (no ve la disponibilidad: lo que no hace es A28). | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].conversacion[7].texto` | Marta Ejemplo, 600 000 000. | (igual) | Ejemplo: datos inventados. | propuesta |
| /sectores/alojamientos-rurales/ | `src/content/sectores.ts` | `paginas[rural].conversacion[8].texto` | Apuntado: Marta Ejemplo, 600 000 000, puente de diciembre, cuatro personas y un perro. Te llamarán de Casa Rural Demo para decirte si hay sitio y el precio. | (igual) | Ejemplo. A11. | propuesta |

## /sectores/asesorias-y-despachos/

Lo común a las tres páginas de sector va en `## /sectores/clinicas-dentales/`.

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].nombre` | Asesorías y despachos | (igual) | Sector de D-006. También lo pinta la tarjeta de `/sectores/`. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].etiqueta` | Asesorías y despachos | (igual) | Ídem. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].titular` | Menos llamadas de «¿lleváis esto?» y menos papeles por WhatsApp | Menos llamadas de «¿lleváis esto?» y menos papeles sueltos | Filtro 4: daba por hecho que los papeles llegan por WhatsApp (CA-9). Lo pinta también la tarjeta de `/sectores/`. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].entradilla` | Las primeras preguntas, la documentación de cada cliente y las citas pueden ir solas, para que el tiempo del despacho se vaya en los asuntos y no en lo que los rodea. | (igual) | B en condicional («pueden»): A11, A63, A61. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].metadatos.title` | Webs y automatización para asesorías y despachos — {n} | (igual) | A06, A22. `{n}` = `site.nombre`. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].metadatos.description` | Documentación que llega ordenada, primeras consultas sin llamar y respuestas a cualquier hora. Lo que se puede automatizar en una asesoría o un despacho de abogados, con un ejemplo del asistente. | (igual) | A63, A61, A11; B en condicional («se puede»). | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].problemas[0].titulo` | Llamadas para saber si lleváis su asunto | (igual) | Situación habitual (P-13). | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].problemas[0].texto` | Antes de ser cliente, la gente llama para preguntar si lleváis herencias, despidos o la renta de un autónomo, y cuánto cuesta la primera consulta. Cada llamada saca a alguien de un expediente. | Antes de ser cliente, es habitual llamar para preguntar si lleváis herencias, despidos o la renta de un autónomo, y cuánto cuesta la primera consulta. Cada llamada saca a alguien de un expediente. | P-13: situación habitual, no un hecho sobre el despacho que lee. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].problemas[1].titulo` | La documentación llega en fotos por WhatsApp | La documentación llega por todas partes | Filtro 4: daba por hecho el WhatsApp (CA-9). | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].problemas[1].texto` | Nóminas, escrituras, facturas del trimestre: llegan en fotos torcidas por WhatsApp, en correos sueltos y en mano. Juntarlas en cada expediente y ver qué falta es trabajo que no se factura. | Nóminas, escrituras, facturas del trimestre: si llegan en fotos por WhatsApp, en correos sueltos y en mano, juntarlas en cada expediente y ver qué falta es trabajo que no se factura. | P-13, filtro 4: con «si». | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].problemas[2].titulo` | Todo el mundo, el último día | (igual) | Situación habitual (P-13). | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].problemas[2].texto` | En la campaña de la renta y en cada cierre de trimestre, los papeles llegan a la vez y a última hora. Ir avisando cliente por cliente de lo que le falta se come los días que más trabajo hay. | En la campaña de la renta y en cada cierre de trimestre, los papeles suelen llegar a la vez y a última hora. Ir avisando cliente por cliente de lo que le falta se come los días que más trabajo hay. | P-13: habitual («suelen»). | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].problemas[3].titulo` | La carta de Hacienda se lee de noche | (igual) | Situación habitual (P-13). | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].problemas[3].texto` | Quien recibe un requerimiento o una carta de despido busca ayuda esa misma noche. Si la web solo tiene un teléfono, espera a la mañana siguiente, y puede que llame antes a otro despacho. | Quien recibe un requerimiento o una carta de despido suele buscar ayuda esa misma noche. Si la web solo tiene un teléfono, espera a la mañana siguiente, y puede que llame antes a otro despacho. | P-13: habitual («suele»), no un hecho. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].ejemplo.de` | un despacho | (igual) | Va en «Así contestaría el asistente de {n}». | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].ejemplo.negocio` | Despacho Demo | (igual) | Negocio inventado (A59), dentro del ejemplo. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].conversacion[0].texto` | Hola, soy el asistente virtual de Despacho Demo. Puedo contarte qué asuntos llevamos y cómo trabajamos, y dejar tu contacto para que te llame una persona del despacho. ¿En qué te ayudo? | (igual) | Dentro del chat «Ejemplo» (D-019, CA-7). A11. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].conversacion[1].texto` | Me ha llegado una carta de Hacienda por la renta del año pasado. ¿Lleváis eso? | (igual) | Ejemplo. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].conversacion[2].texto` | Sí, el despacho lleva requerimientos y comprobaciones de Hacienda. Qué dice tu carta y qué conviene hacer lo valora una persona del despacho: yo no puedo asesorarte sobre tu caso. | (igual) | Ejemplo. A11 (pasa a una persona lo que no le toca). | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].conversacion[3].texto` | ¿Qué tengo que llevar a la primera consulta? | (igual) | Ejemplo. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].conversacion[4].texto` | La carta, la declaración de ese año y tu DNI. Si no tienes la declaración a mano, en la consulta te ayudan a sacarla. | (igual) | Ejemplo. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].conversacion[5].texto` | ¿Me podéis dar hora para mañana? | (igual) | Ejemplo. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].conversacion[6].texto` | Las citas no las doy yo. Si me dejas tu nombre y un teléfono o un correo, una persona del despacho te contacta para darte hora. | (igual) | Ejemplo. A11. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].conversacion[7].texto` | Jorge Ejemplo, jorge@ejemplo.com. | (igual) | Ejemplo: datos inventados. | propuesta |
| /sectores/asesorias-y-despachos/ | `src/content/sectores.ts` | `paginas[despachos].conversacion[8].texto` | Apuntado: Jorge Ejemplo, jorge@ejemplo.com, por una carta de Hacienda sobre la renta. Te escribirán de Despacho Demo para darte hora. | (igual) | Ejemplo. A11. | propuesta |

## /404

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| /404 | `src/app/not-found.tsx` | `metadata.title` | Página no encontrada — {n} | (igual) | `{n}` = `site.nombre`. | propuesta |
| /404 | `src/content/interiores.ts` | `cotasInterior.error404.cota` | Sin fondo · 404 | (igual) | Cota (D-014). «404» es numeración (`data-numeracion`, PD-5), no una cifra. | propuesta |
| /404 | `src/app/not-found.tsx` | `CabeceraInterior` · `arriba` | No hay nada | (igual) | Concepto (D-014, spec 002 §3.12). | propuesta |
| /404 | `src/app/not-found.tsx` | `CabeceraInterior` · `em` | a esta cota. | (igual) | Ídem. | propuesta |
| /404 | `src/app/not-found.tsx` | `jsx · texto` | La página que buscas no existe o ha cambiado de sitio. Vuelve al principio o mira las plantillas. | (igual) | A57. También es lo que ve quien llegue con un ancla vieja que ya no existe (spec §6): ahí la ruta sí existe y abre arriba, no da 404. | propuesta |
| /404 | `src/app/not-found.tsx` | `jsx · botón` | Ir al inicio | (igual) | Interfaz. | propuesta |
| /404 | `src/app/not-found.tsx` | `jsx · botón` | Ver plantillas | (igual) | A57. | propuesta |

## README

Solo lo que repite lo que dice la web (spec §2), no la documentación técnica.
El README describe aún la portada vigente (la de `main`): llevarlo a la de la
consultora es de P-08, no de esta spec. Aquí se corrigen las afirmaciones, los
nombres y los recuentos.

**La nota de anclas** (spec §6) va entre `<!-- 003-anclas -->` y
`<!-- /003-anclas -->`, justo después del párrafo «Páginas: …» de «Qué hay en la
web». No lleva fila porque `comprobar-textos.mjs` ignora ese bloque (también
CA-4, que no la encontraría). Estado: `propuesta`. Texto:

```markdown
<!-- 003-anclas -->
**Anclas que ya no existen.** Hasta la spec 003, `/herramientas/` tenía las
secciones `#vigilancia` y `#ficha-google`, y algún enlace ya mandado puede
llevarlas. La 003 las quitó: la vigilancia diaria y la auditoría de la ficha de
Google no existen todavía (A19 y A20, nivel C) y se nombrarán en la spec 004,
cuando estén hechas. La ruta sigue: el ancla no encuentra nada y la página se
abre arriba. Se acepta así (spec 003 §6).
<!-- /003-anclas -->
```

| ruta | fichero | identificador | texto actual | texto nuevo | motivo | estado |
|---|---|---|---|---|---|---|
| README | `README.md` | entradilla (líneas 3-4) | diseño y desarrollo web, automatización y IA para negocios pequeños de Galicia. | hacemos la web, la tienda online y la ficha de Google de tu negocio, y montamos a tu medida lo que va por debajo: automatizaciones, asistentes con IA y programas de gestión. | A45: una sola descripción en todo el sitio, README incluido; es `site.descripcion` (`## *`). Va tras «Web del estudio **Undertactics** (antes Subcon Works):». | propuesta |
| README | `README.md` | «Qué hay en la web», fila `0 · Lo que montamos` | Los diez servicios de `servicios.ts`, cada uno con su pozo: lo que incluye, como paradas | Los siete servicios de `servicios.ts`, cada uno con su pozo: lo que incluye, como paradas | A76 (fuente: `servicios.ts`, 7). «Diez» era falso desde la PR #50. | propuesta |
| README | `README.md` | «Qué hay en la web», fila `−4 · Diagnóstico` | El diagnóstico de un minuto de la spec 001 | El diagnóstico rápido de la spec 001 | A70 (C hasta cronometrarlo): sale «un minuto». Nombre de la puerta 2 (P-11). | propuesta |
| README | `README.md` | «Qué hay en la web», fila `Fondo · Auditoría` | Lo que recibes con la auditoría gratuita, «36 preguntas» y «0 €», y el botón «Empezar la auditoría», donde acaba el hilo y se dibuja el iceberg del logo | La auditoría de tu negocio: lo que no se pide, «36 preguntas» y el botón «Empezar la auditoría», donde acaba el hilo y se dibuja el iceberg del logo | Nombre de la puerta 3 (P-11). A34 corregida (sin «gratuita» ni «0 €»), A38. «Lo que recibes» sale con `loQueRecibes` (A52, `por confirmar`). | propuesta |
| README | `README.md` | «No hay clientes» | Lo que se enseña son las **30 plantillas** del taller | (igual) | A05, A59. | propuesta |
| README | `README.md` | tabla de `src/content/`, fila `servicios.ts` | Los diez servicios y lo que incluye cada uno | Los siete servicios y lo que incluye cada uno | A76. | propuesta |
| README | `README.md` | tabla de `src/content/`, fila `herramientas.ts` | El software propio de `/herramientas/`, con sus capturas | Los productos de `/herramientas/` (tienda online, informe de mejoras de tu web y formulario de contacto), con sus capturas | CA-1: sin «software propio» (spec §1 cita `README.md:185`). Decisión 6 y nombres recomendados (P-11). A01, A03, A29. | propuesta |
| README | `README.md` | tabla de `src/content/`, fila `cifras.ts` | Las cuatro cifras, repartidas por la portada (sin contador) | Las cifras que quedan (plantillas publicadas y preguntas de la auditoría), sin contador | A76: tras quitar el plazo (A32) y el «0 €» (A34) quedan dos. | propuesta |
| README | `README.md` | título de apartado | La auditoría gratuita | La auditoría de tu negocio | Nombre de la puerta 3 (P-11). A34 corregida. | propuesta |
| README | `README.md` | «La auditoría…», primer párrafo | las mismas 36 preguntas con la misma numeración, en ocho pasos, con borrador guardado en el navegador y con la posibilidad de mandarlo a medias. | las mismas 36 preguntas con la misma numeración, en ocho pasos, con borrador guardado en el navegador hasta que se envía (no caduca) y con la posibilidad de mandarlo a medias. | A38, A76 (ocho pasos), A93 ajustada por D-037: el borrador no caduca y solo se quita si el envío sale bien (`FormularioAuditoria.tsx:158-162,216-221`). | propuesta |
| README | `README.md` | «Pendiente antes de recibir una solicitud de verdad» | Completar el nombre fiscal, el NIF y el domicilio en `src/app/privacidad/page.tsx` | (igual) | A99 (P-15). | propuesta |
| README | `README.md` | «Pendiente…», punto nuevo | (no hay) | Cada tres meses, borrar a mano las solicitudes que lleven más de un año sin mensajes y sin trabajo con ese negocio: la fila de Supabase y su `.md` de `entrada/`. Anotar la fecha en `kit/LEEME.md`. Nada lo hace solo, tampoco el kit (P-14, D-037). | A75 ajustada por D-037: `/privacidad/` ya no promete un borrado automático, pero sí el repaso trimestral (procedimiento, D-035). `kit/traer-solicitudes.mjs` no tiene opción de borrar. | propuesta |
