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
| * | `src/content/site.ts` | `site.nav[0].label` | Servicios | (igual) | Ancla `/#servicios`. | propuesta |
| * | `src/content/site.ts` | `site.nav[1].label` | Soluciones | (igual) | Ancla `/#soluciones`; la sección dice que son ejemplos (A15). | propuesta |
| * | `src/content/site.ts` | `site.nav[2].label` | Proyectos | Webs de ejemplo | Decisión 4: «Proyectos» sugiere trabajos de cliente (§3.2 regla 3, §3.5). A59. | propuesta |
| * | `src/content/site.ts` | `site.nav[3].label` | Herramientas | Productos | Decisión 6: el cliente compra el resultado (§3.4). Lo que queda en `/herramientas/` es nivel A (A01, A03, A29, A50). | propuesta |
| * | `src/content/site.ts` | `site.nav[4].label` | Proceso | (igual) | Ancla `/#proceso`. | propuesta |
| * | `src/content/site.ts` | `site.nav[5].label` | Contacto | (igual) | Ancla `/#contacto`. | propuesta |
| * | `src/content/site.ts` | `site.cta` | Solicitar diagnóstico | Pedir una propuesta | Nombre de la puerta 1 (P-11, recomendado). «Diagnóstico» queda solo para el diagnóstico rápido (CA-17). A30, A56. | propuesta |
| * | `src/app/layout.tsx` | `metadata.title` | {n} — IA, automatización y software a medida para pymes | {n} — Web, tienda online y automatización a medida | A45 (misma familia que la descripción). A06, A01 (A); A22 (B, «a medida»). Filtro 1: sin «pymes». `{n}` = `site.nombre`. | propuesta |
| * | `src/app/layout.tsx` | `metadata.description` | (= `site.descripcion`) | (igual) | Sale de `site.descripcion` (fila de arriba): no se escribe aparte (A45). | propuesta |
| * | `src/app/layout.tsx` | `metadata.openGraph.title` | (= `site.nombre`) | (igual) | Marca. | propuesta |
| * | `src/app/layout.tsx` | `metadata.openGraph.description` | (= `site.descripcion`) | (igual) | Sale de `site.descripcion` (A45). | propuesta |
| * | `src/app/layout.tsx` | `metadata.openGraph.images[0].alt` | Logo de Undertactics: un iceberg con la línea de superficie en lima | (igual) | Describe la imagen; `og.png` se regenera en P-07, fuera de esta spec. | propuesta |
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
