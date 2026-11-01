# 003 · Posicionamiento y textos

Estado: aprobada (D-032, 2026-11-01) · Depende de: 001, 002 · Decisiones: D-003, D-005, D-007, D-008, D-009, D-014 (se respeta), D-019, D-026, D-032; sustituye parte de D-027 cuando se apruebe `textos.md` (D-033); concreta, sin cambiarlos, los principios del SDD · Conflictos: C-22 y C-23, resueltos por D-032 · Pendientes: P-08 a P-13 · Cambia: 001 §3.4 §3.8 §7 §8; 002 §1 §2 §3.6 §3.7 §3.8 §3.9 §3.11 §3.13 §4 §7 §9
Plan: [plan.md](plan.md) (aprobado, D-034; PD-1 a PD-9) · Tareas: [tasks.md](tasks.md) (T01-T12)

## 1. Objetivo

La web de Undertactics describe hoy cosas que no existen, usa etiquetas que no
significan nada para quien compra, se contradice entre páginas y presupone cómo
trabaja quien la lee. Esta spec fija **a quién se habla, qué se promete, qué se
puede afirmar y cómo se llama cada producto**, y revisa con eso todos los
textos del sitio.

Lo que la motiva, comprobado en el código el 2026-11-01 (rama `exp/consultora`,
commit 9b37511):

- **Afirmaciones sin nada detrás.** Álvaro confirma el 2026-10-31 que la
  vigilancia diaria no existe y que la auditoría de la ficha de Google
  «creo que no» (P-09). Sin embargo salen descritas como funcionando en
  `herramientas.ts`, `consultora.ts:193,204,210`, `servicios.ts` (07),
  `hero.ts:75,80` («queda vigilada cada día»), `proceso.ts:74`, la
  `description` de `herramientas/page.tsx:15` y el enlace de
  `diagnostico.ts:496`.
- **«Herramienta propia» / «Software propio».** Está en `consultora.ts:186,
  199,205,211,224`, en el aviso de `consultora.ts:174` y en `README.md:185`.
  El cliente compra el resultado (un informe, una tienda), no la herramienta.
- **Contradicciones entre ficheros.**
  - Plazos: `cifras.ts:21` dice «2 sem. desde que dices que sí hasta que está en
    línea» y la FAQ de `consultora.ts:283` dice que no se da un plazo cerrado.
    El formulario dura «cinco minutos» (`proceso.ts:26`) o «10 minutos»
    (`cifras.ts:22`, `auditoria/page.tsx:10`).
  - Servicios: `servicios.ts:82` ofrece atención «al teléfono»; un comentario de
    `consultora.ts:58` dice que no hay voz por teléfono. `consultora.ts:235` y
    `estudio.ts:49` prometen vídeo, que la PR #50 quitó de los servicios.
  - Facturas: `hero.ts:57` («Factura emitida») frente a `herramientas.ts:31` (la
    plataforma «no emite facturas»).
  - Datos: `privacidad/page.tsx:38` dice que solo se recogen datos en el
    formulario de la auditoría; en esta rama el formulario corto de la portada
    también envía a Supabase (`FormularioContacto.tsx`).
- **Un comprador supuesto.** El hero y el titular de problemas dan por hecho que
  el lector depende de WhatsApp, de hojas de cálculo y de programas que no se
  hablan, y que su dolor es el tiempo. El comprador real es un dueño de negocio
  pequeño **sin más rasgos presupuestos**.

**Fuente.** Conversación con Álvaro del 2026-10-31, `src/content/*.ts`,
`src/components/**`, `DECISIONES.md`, spec 002 §3.7 y §3.13, y la revisión de
huecos del 2026-11-01.

## 2. Alcance

**Entra**
- Todo texto visible o indexable del sitio, esté donde esté:
  - `src/content/*.ts` (`consultora`, `hero`, `servicios`, `proceso`, `cifras`,
    `estudio`, `site`, `portada`, `interiores`, `herramientas`, `sectores`,
    `diagnostico`, `auditoria`, `plantillas`);
  - los textos escritos a mano en `src/components/**` (`Servicios.tsx`,
    `Contacto.tsx`, `FormularioContacto.tsx`, `Hero.tsx`, los `aria-label` y
    textos de `Maquetas.tsx`) y en `src/app/**/page.tsx`;
  - metadatos (`title`, `description`, OG `alt`), datos estructurados si los
    hay, 404, `/privacidad/`, preguntas frecuentes y contacto;
  - el `README.md` donde repita lo que dice la web.
- Los tests y scripts que repiten textos: `hero.test.ts`, `portada.test.ts`,
  `plantillas.test.ts`, `sectores.test.ts`, `diagnostico.reglas.test.ts`,
  `comprobar-consultora.mjs`, `comprobar.mjs`.
- Comprador y promesa (§3.1), niveles de afirmación (§3.2, Anexo A), nombres de
  producto (§3.4), presentación de plantillas (§3.5), `textos.md` (§3.6) y lo
  que sale de la web (§3.7).

**Queda fuera**
- **Construir** la vigilancia diaria y la auditoría de la ficha de Google: spec
  004 (P-12). Mientras no esté hecha y comprobada, la web no las cita.
- Diseño y maquetación (carriles 1 y 2): espacio entre secciones, orden de la
  navbar, indicador de scroll, maquetas nuevas de la tienda y del informe,
  animación de las maquetas. Esperan a esta spec solo en lo que lleven texto
  o nombre.
- El texto **propio de la portada vigente** (el que solo ella pinta) hasta
  decidir P-08. Lo compartido (`hero.ts`, `servicios.ts`, `herramientas.ts`,
  páginas interiores, sectores) sí entra, porque lo pintan las dos portadas.
- Precios, plazos y cifras nuevas (§3.2, regla 4). Traducciones: solo
  castellano. Regenerar `og.png` (P-07).

## 3. Comportamiento

### 3.1 Comprador y promesa

**Comprador.** Dueño o responsable de un negocio local pequeño en España, que
decide él mismo. Sectores de partida: los de D-006 y los de `contacto.tipos`
(`consultora.ts`).

**Lo que no se supone.** Ni cómo atiende hoy (WhatsApp), ni que use hojas de
cálculo, ni que tenga una web vieja, ni que su problema sea el tiempo. Una
situación solo sale como pregunta, con «si…», o como ejemplo rotulado «Ejemplo».
Vale también para las páginas de sector, que siguen hablando de los problemas
típicos del sector pero como situaciones habituales, no como hechos sobre quien
lee (P-13).

**Una promesa, dos puertas** (recomendación aceptada el 2026-10-31).
- La promesa común se formula en `textos.md` y no nombra un único dolor.
- Puerta 1, **lo que ve tu cliente**: web, tienda, ficha en Google, reservas.
- Puerta 2, **lo que va por debajo**: automatización, agentes, software a
  medida.
- Cada sección de la portada lleva en su cota el rótulo de su puerta («Lo que ve
  tu cliente» o «Lo que va por debajo»), y solo uno (CA-15). El concepto «Por
  debajo» se conserva (D-014).

### 3.2 Niveles de afirmación

Toda frase que diga qué hace Undertactics o qué hay se apoya en una fila del
Anexo A y respeta su nivel.

| Nivel | Qué es | Cómo se escribe | Dónde puede salir |
|---|---|---|---|
| **A · Existe** | Funciona hoy y se puede enseñar, o es un servicio humano que hacemos hoy (mantenimiento, diseño web) | Presente, con verbos de hacer | Cualquier sitio |
| **B · A medida** | No es un producto: se monta por encargo con piezas que ya sabemos usar | «Podemos montar», «lo montamos según tu caso». Una maqueta de ejemplo, rotulada «Ejemplo» (D-019), sí puede ir en presente dentro de la escena | Hero, servicios, «Tecnología aplicada», FAQ, proceso, diagnóstico y sectores, siempre en condicional fuera de una maqueta |
| **C · No existe** | No hay nada hecho, ni siquiera a medida | No aparece, ni como «próximamente» (decidido el 2026-10-31) | En ninguna parte |

Reglas:

1. Un B nunca se escribe en presente de producto («tenemos un agente que…») ni
   lleva etiqueta de producto propio. Una fila no mezcla niveles: si una cosa
   es A en parte y B en parte, son dos filas.
2. **Capacidad, no condiciones.** Los reclamos de condición («sin compromiso»,
   «sin coste», «no paga cuota a nadie», «sin cuotas») no se escriben aunque
   sean ciertos. Lo que sí se puede es **informar del procedimiento** («te damos
   la propuesta por escrito antes de empezar») cuando Álvaro confirma que es
   su forma de trabajar (P-10) y D-032 lo declara. «A tu nombre» y «te lo llevas
   entero» entran en esa misma lista de confirmación.
3. **Nada de clientes** (no los hay): ni «casos de éxito», ni «proyectos
   realizados», ni testimonios, ni «su primera tienda» si es una persona real.
4. **Cifra** = un número seguido de unidad (`€`, `%`, `min`, `h`, `sem.`,
   días, meses, años) o escrito con letra («diez minutos»), o un recuento
   («36 preguntas»). Ninguna sale sin fila en el Anexo A con su fuente, y una
   misma magnitud tiene un solo valor en todo el sitio. Cae «La mitad de los
   negocios de aquí se buscan por el móvil a dos calles de distancia»
   (`servicios.ts:52`) salvo que se aporte fuente. Los precios («gratis», «0 €»)
   son cifras: entran en el Anexo.
5. Lo que se dice de terceros (Booking, Google, WhatsApp, Airbnb) no lleva
   cifras ni atribuye comportamientos que no podamos citar.
6. Una afirmación nueva exige antes su fila en el Anexo A.

### 3.3 Anexo A · tabla de afirmaciones

La rellena Claude con un nivel propuesto y **Álvaro confirma o corrige cada
fila** (P-09). Mientras una fila esté «por confirmar» no sirve para escribir
texto nuevo. Columnas: id · afirmación · dónde aparece · nivel propuesto ·
motivo · estado (`por confirmar` / `confirmada` / `corregida`). La lista
completa sale de leer cada fichero (§2). La completó T02 el 2026-11-01, sobre
`exp/consultora` en `7472537`; las líneas citadas son las de ese commit.

- **Series.** Cada tabla sigue su serie y, cuando se llena, continúa en otra
  decena:
  - productos y servicios, A01-A29 y A50-A69;
  - condiciones, plazos y cifras, A30-A39 y A70-A89;
  - personas, terceros y datos, A40-A49 y A90-A99.
- **Niveles.**
  - «A (procedimiento)» es información de procedimiento: solo se escribe si
    Álvaro la confirma (regla 2, P-10).
  - «A, obligatorio» es un A que la web tiene que decir por ley y con lo que
    hace el código (§5), aunque el texto de hoy esté mal o incompleto.
  - «C (regla 2: condición)» es un reclamo de condición: no se escribe
    aunque sea cierto.
  - Un A cuyo texto de hoy lleva un valor equivocado sigue siendo A: se puede
    decir, pero con el valor de la fuente.
  - En una cifra, el motivo dice su fuente o «sin fuente». Una cifra sin
    fuente es C: no sale mientras nadie aporte la fuente.
- **Filas partidas.** Si T02 partió una fila por mezclar niveles (regla 1),
  su motivo lo dice.
- **No tienen fila:**
  - cotas y numeración de estructura (01-07, P1-P36, «Paso n de 8»,
    «Pregunta n de m»);
  - el texto de dentro de una maqueta o un chat rotulado «Ejemplo». Lo que
    ese ejemplo da a entender que hacemos sí la tiene (A11, A15, A18…);
  - las suposiciones sobre el lector (§3.1, CA-9);
  - los nombres y etiquetas de producto (§3.4, §3.5).

**Productos y servicios**

| Id | Afirmación | Dónde | Nivel | Motivo | Estado |
|---|---|---|---|---|---|
| A01 | Plataforma de tiendas: catálogo, cobro, envíos, panel móvil, aviso de qué reponer | `herramientas.ts:37-45`, `servicios.ts:35-43`, `consultora.ts:218-224` | A | Hay maqueta; hay que confirmar que **funciona hoy**. Hay una tienda de ejemplo y una «primera tienda» (A41). Cobra comisión; no emite facturas ni escribe fichas desde una foto. Álvaro, 2026-11-01: funciona todo | confirmada |
| A02 | Tarjeta y Bizum, recogida en tienda, reparto local por código postal, enlace de pago, pedidos por WhatsApp o por teléfono | `servicios.ts:38-40`, `herramientas.ts:68-70` | A | No verificado. T02 sacó la sincronización con Instagram, Facebook y Google Shopping a A53. T03: el código de `plataforma-tiendas` tiene las seis piezas (tarjeta y Bizum por Stripe, `pickup`, `local_delivery`, pedidos manuales con enlace de pago que se manda por WhatsApp). Álvaro «diría que tarjeta, Bizum y recogida», pero no lo sabe seguro: falta que lo compruebe | por confirmar |
| A03 | Informe de mejoras de tu web: mide velocidad, accesibilidad y móvil con un navegador de verdad, lee los textos, cada fallo con su prueba, ordenado por prioridad | `herramientas.ts:111-129`, `consultora.ts:196-199`, `diagnostico.ts:516-518`, `Proyectos.tsx:94` | A | Hay informes hechos. Ojo: están en `WEBS NEGOCIOS/informes/` (PDF de negocios reales), no en el repo y no enseñables. El que se enseña es sobre una plantilla | por confirmar |
| A04 | Formulario de contacto: aviso al correo y confirmación a quien escribe | `herramientas.ts:165` | C | Lo que sí se ve en el código es el envío a Supabase de `FormularioContacto.tsx`; `kit/traer-solicitudes.mjs` solo baja las solicitudes, sin correo. El aviso tendría que mandarlo la Edge Function, que no está en el repo; las notas de Álvaro dan el aviso por correo (Resend) como pendiente. Recibir y guardar es A29. §3.4 cita A04 entre los productos a nombrar: si queda en C, el que se nombra es A29. T03: una nota de Álvaro del 2026-10-12 dice que la función `solicitar-auditoria` v2 ya avisa por Resend a `alvarot2601@gmail.com` (probado de punta a punta); nada dice de una confirmación a quien escribe. Falta que Álvaro mande un mensaje de prueba desde la web y diga qué llega | por confirmar |
| A05 | N plantillas de ejemplo (el N sale de `plantillas.ts`) | `consultora.ts`, `cifras.ts:20`, `estudio.ts:91`, `Proyectos.tsx:78`, `Footer.tsx:69`, `plantillas/page.tsx:12,21`, `CatalogoPlantillas.tsx:39,47-49`, `PideTuSector.tsx:22`, README, portada vigente | A | Fuente: `plantillas.length` (hoy 30). Ver P-02 | por confirmar |
| A06 | Diseño y desarrollo web a medida, rescate de webs viejas (WordPress, Wix, Webnode), redirecciones 301 | `servicios.ts:19-27`, `consultora.ts:99-100`, `hero.ts:75-79`, `diagnostico.ts:501-509` | A | Es lo que muestran las plantillas | por confirmar |
| A07 | Mantenimiento: cambios de contenido, copias, actualizaciones | `servicios.ts:110-116`, `consultora.ts:100`, `proceso.ts:71-74` | A | Servicio humano. Sin la línea de vigilancia | por confirmar |
| A08 | Ficha de Google, SEO local y reseñas hechos a mano | `servicios.ts:52-56`, `consultora.ts:100`, `hero.ts:68`, `diagnostico.ts:492-494,567-575` | B | Trabajo nuestro, no herramienta | por confirmar |
| A09 | Core Web Vitals y datos estructurados | `servicios.ts:57-58` | A | Se hacen en las plantillas. T02 sacó «medición sin cookies» y «sin banner de cookies» a A54 | por confirmar |
| A10 | Desistimiento «desde junio de 2026» en la tienda | `herramientas.ts:94` | A | Es legal y lleva fecha. Fuente: Directiva (UE) 2023/2673 (función de desistimiento, aplicable desde el 19-6-2026); confirmar la transposición española y que la tienda tiene el botón | por confirmar |
| A11 | Asistente en la web que contesta lo de siempre a cualquier hora, ofrece horas libres y reserva la cita (dental), recoge el contacto y pasa a una persona lo que no le toca: lo que `recepcionista-ia` hace hoy (D-008) | `consultora.ts:83-84,126`, `servicios.ts:82-88`, `sectores.ts:119-144,190-214,259-283`, `diagnostico.ts:468-476` | A | Confirmar qué hace hoy y que funciona. T02 partió la fila: lo que no hace hoy es A28 (B). Álvaro, 2026-11-01: funciona y se puede enseñar | confirmada |
| A12 | Agente en WhatsApp | `consultora.ts:83-84,126`, `servicios.ts:82-84`, `hero.ts:35-45` | B | Aparte de A11 | por confirmar |
| A13 | «Mira tus datos reales», «deja un registro», «limitamos qué puede hacer y a qué datos accede», «hace solo lo que le dejes hacer» | `consultora.ts:83,296`, `proceso.ts:65` | B | Es cómo se monta un agente a medida, no un producto que se pueda enseñar | por confirmar |
| A14 | Atención al teléfono / voz | `servicios.ts:82` | C | Un comentario de `consultora.ts:58` dice que no está montado | por confirmar |
| A15 | Factura que se lee sola, presupuestos en un clic, cuentas con un audio, citas con recordatorio, embudo | `consultora.ts:72-73,130-150` (maquetas), `Maquetas.tsx` | B | Ejemplos con datos inventados. Embudo y panel están en `Maquetas.tsx` pero no se pintan | por confirmar |
| A16 | «Facturación» como automatización, y «factura emitida» tras una venta | `servicios.ts:72`, `hero.ts:53,57` | C | La plataforma no emite facturas. T02 partió la fila: leer y clasificar facturas es A15 (B) | por confirmar |
| A17 | Marketing con IA: email a clientes, fichas de producto, respuesta a reseñas, «respuesta con tu tono», «informe del mes» | `servicios.ts:96-102`, `hero.ts:64-69` | B | Sin nada que enseñar | por confirmar |
| A18 | Reservas (calendario con fechas, simulado) | plantillas de alojamiento, `consultora.ts:84,92,100` («Reservas y citas», «Formularios y reservas»), `servicios.ts:70,86` | B | Puerta 1 sin fila hasta hoy | por confirmar |
| A19 | Vigilancia diaria, vigilancia de caídas, avisos de caducidad, «resumen cada semana», «la alerta nos llega a nosotros», «comprobaciones automáticas» | `herramientas.ts:80,99,133-144`, `consultora.ts:193,202-205`, `servicios.ts:115,119`, `hero.ts:75,80`, `proceso.ts:74`, `herramientas/page.tsx:15` | **C** | Álvaro: no existe | por confirmar |
| A20 | Auditoría de la ficha de Google como herramienta | `herramientas.ts:147-157`, `consultora.ts:208-211`, `servicios.ts:62`, `herramientas/page.tsx:15` | **C** | Álvaro: «creo que no» (P-09) | por confirmar |
| A21 | Vídeo como servicio | `consultora.ts:235`, `estudio.ts:49` | C | La PR #50 lo quitó | por confirmar |
| A22 | Automatización a medida: conectar los programas que ya usas (correo, calendario, hojas de cálculo, facturación, CRM), presupuestos, citas, recordatorios, informes y avisos automáticos | `consultora.ts:17-18,52,68-76,262`, `servicios.ts:68-74,102`, `hero.ts:46-47,69`, `sectores.ts:85-89,156,225-229`, `sectores/page.tsx:10,19-20` | B | Se monta por encargo; no hay producto que enseñar | por confirmar |
| A23 | Software a medida: paneles de gestión, pedidos e inventario, reservas y agenda, que se llevan desde el móvil | `consultora.ts:89-92` | B | Ídem. La tienda (A01) no cuenta como software a medida | por confirmar |
| A24 | La web incluye los textos (también escritos con IA), el logotipo redibujado y los avisos legales | `servicios.ts:23-25,101` | A | Servicio humano. Confirmar que los avisos legales los redactamos nosotros y cómo se revisan | por confirmar |
| A25 | La tienda se entrega montada: catálogo subido con fotos, tallas y precios, cobro conectado, envíos y recogida decididos contigo, en tu dominio, diseño a partir de tu marca y páginas legales | `servicios.ts:35-37,43`, `herramientas.ts:60-65,84,92-94` | A | Servicio sobre A01 | por confirmar |
| A26 | La tienda avisa de «qué se mira y no se vende» | `servicios.ts:35`, `herramientas.ts:43,78-80` | A | Exige contar visitas por producto (ver A54): confirmar que el panel lo hace | por confirmar |
| A27 | Las fichas de producto, la ficha de Google y el correo a tus clientes «trabajan sobre la misma tienda» | `herramientas.ts:102-104` | B | La plataforma no escribe fichas desde una foto (A01); ficha y correo son A08 y A17 | por confirmar |
| A28 | Agente a medida con lo que `recepcionista-ia` no hace hoy: filtrar y avisar, hablar con el tono del negocio, conectarse a tu agenda real, primer contacto con clientes | `servicios.ts:85-88`, `consultora.ts:84` | B | Parte B de A11 (regla 1) | por confirmar |
| A29 | Formulario propio en la web que recibe y guarda cada mensaje, sin el formulario de otra empresa incrustado, esté donde esté alojada la web | `herramientas.ts:160-166`, `consultora.ts:183-184`, `diagnostico.ts:483-485` | A | Lo hace el formulario de esta web (Edge Function de Supabase, A44). El aviso por correo es A04 | por confirmar |
| A50 | «Lo construimos nosotros»: software escrito por nosotros, «no son programas comprados», y «cada pieza sostiene uno de los servicios» | `herramientas/page.tsx:79-88`, `consultora.ts:174`, `estudio.ts:34,91` | A | Cierto para las piezas que sean A (A01, A03, A29). «Cada pieza sostiene uno de los servicios» no se cumple en automatización, agentes ni marketing. La etiqueta «propio» la quita §3.4 | por confirmar |
| A51 | «Si algo no le encaja a tu negocio, se cambia en el código» | `herramientas/page.tsx:87-88`, `estudio.ts:34` | B | En la plataforma compartida (A60) el código no es del cliente; se cambia por encargo | por confirmar |
| A52 | Informe de la auditoría: las horas que se van y lo que cuestan, «tu web, puntuada», qué automatizar primero, «sin datos» donde dejes en blanco; antes lo leemos y miramos tu web por fuera; el informe es tuyo, sigas o no | `auditoria.ts:266-286`, `auditoria/page.tsx:9-10,32-33`, `FormularioAuditoria.tsx:703-713`, `herramientas.ts:121`, `herramientas/page.tsx:191-192`, `estudio.ts:86`, `Contacto.tsx:41` | A | Lo hace el kit 03 (`kit/LEEME.md`) con IA de Anthropic: confirmar que el informe trae todo eso. Las cifras van en A36, A38 y A81 | por confirmar |
| A53 | Catálogo de la tienda sincronizado solo con Instagram, Facebook y Google Shopping | `servicios.ts:42`, `herramientas.ts:44,87-89` | A | Confirmar que la integración existe; sacada de A02. T03: la plataforma publica `/feeds/google.xml` y `/feeds/meta.xml` (Merchant Center y Meta), que se refrescan en menos de media hora; falta que Álvaro confirme que hay alguna tienda conectada | por confirmar |
| A54 | Medición sin cookies; la tienda va «sin banner de cookies, porque las estadísticas no las usan» | `servicios.ts:59`, `herramientas.ts:94` | A | Confirmar qué mide y con qué (esta web no lleva analítica). Sacada de A09 | por confirmar |
| A55 | Una web que puedes cambiar tú: «cambiar un horario o un texto no depende de nadie», «se puede cambiar» | `diagnostico.ts:501-509`, `servicios.ts:19` | B | Choca con A07, donde los cambios los hacemos nosotros. Si no hay un editor para el cliente, es a medida | por confirmar |
| A56 | Consultoría: miramos dónde se te van las horas, hablamos contigo, analizamos y proponemos; la parte técnica la hacemos nosotros y te enseñamos a usarlo | `consultora.ts:18,263,269,307`, `proceso.ts:24-38`, `FormularioContacto.tsx:118-119` | A | Servicio humano | por confirmar |
| A57 | Catálogo de plantillas: cada una con su idea («ninguna es la anterior con otro color»), demo entera publicada; si tu sector no está, te enseñamos la más cercana o se hace una nueva | `plantillas/page.tsx:12,21-31,51-52`, `PideTuSector.tsx:22-25`, `not-found.tsx:31` | A | Se comprueba abriendo las demos. «Abiertas» (`plantillas/page.tsx:12`) puede leerse como código abierto | por confirmar |
| A58 | Funciones que funcionan dentro de las demos (calculadora de plazos, test que corrige de verdad) | `plantillas.ts:35-36,213-214` | A | Existen en la demo. Reservas, pedidos y cita previa simulados son A18 | por confirmar |
| A59 | Los negocios de las plantillas, las capturas y los ejemplos son inventados y no son clientes | `Footer.tsx:114`, `plantillas/page.tsx:36-38`, `PlantillasSector.tsx:49-53`, `herramientas/page.tsx:95-97`, `consultora.ts:121,174`, `ChatEjemplo.tsx:65`, `Proyectos.tsx:110` | A | D-007; obligatorio (§3.5) | por confirmar |
| A60 | La tienda va sobre una plataforma compartida: el dominio es tuyo y el código de la plataforma no; la plataforma cobra comisión por venta | `estudio.ts:79` (la comisión, solo en el comentario de `herramientas.ts:30`) | A | Excepción a A31. La comisión no sale en la web: decidir si se informa (procedimiento, regla 2) | por confirmar |
| A61 | Mejora «citas sin llamar»: calendario en la web con tus horas libres y un sistema de citas que manda la confirmación y un recordatorio | `diagnostico.ts:445-453`, `sectores.ts:89,229`, `consultora.ts:146-147` | B | `recepcionista-ia` no manda recordatorios hoy (comentario de `diagnostico.ts:433-437`) | por confirmar |
| A62 | Motor de reservas en tu web con el calendario enlazado al de Booking y Airbnb | `diagnostico.ts:459-461`, `sectores.ts:156,160` | B | T02 lo sacó de A42, que es de terceros | por confirmar |
| A63 | Formulario para que el cliente mande su documentación con la lista de lo que falta (ficha del paciente, datos del huésped, papeles del despacho) | `diagnostico.ts:540-552`, `sectores.ts:85,89,225,229` | B | Recoge datos de terceros, de salud en el caso dental: si se monta, lleva su propio análisis de datos | por confirmar |

**Condiciones, plazos y cifras**

| Id | Afirmación | Dónde | Nivel | Motivo | Estado |
|---|---|---|---|---|---|
| A30 | Propuesta por escrito antes de empezar; cada fase se paga cuando se ve funcionando | `consultora.ts:276` FAQ, `proceso.ts:14-17,53,57,62-63`, `estudio.ts:94-96` | A (procedimiento) | El comentario de `proceso.ts` dice «Decidido por Álvaro el 2026-10-31»; hay que confirmarlo (P-10) | por confirmar |
| A31 | Código en un repositorio «a tu nombre», «te lo llevas entero»; dominio, alojamiento, correo y cuentas a tu nombre | `consultora.ts:18,91`, `estudio.ts:56-72`, `estudio/page.tsx:13-14`, `proceso.ts:71-72`, `servicios.ts:116` | A (procedimiento) | Condición (P-10). La tienda es la excepción (A60) | por confirmar |
| A32 | «2 sem.»; «en línea en dos semanas» | `cifras.ts:21`, `plantillas/page.tsx:50-51` | C | Sin fuente, y la FAQ (`consultora.ts:283`) dice que no se da plazo cerrado (P-10). T02 partió la fila: «en semanas», sin número, es A37 | por confirmar |
| A33 | «Sin compromiso», «sin coste», «no paga cuota a nadie», mantenimiento opcional, «sin abrir una incidencia, sin esperar…» | `proceso.ts:44`, `FormularioContacto.tsx:262`, `servicios.ts:19,110`, `consultora.ts:289` | C (regla 2: condición) | Se quita | por confirmar |
| A34 | Auditoría gratuita / «0 €» / presupuesto sin coste | `cifras.ts:23`, `auditoria/page.tsx:8`, `plantillas/page.tsx:54`, `estudio/page.tsx:65,69`, `estudio.ts:86`, `herramientas/page.tsx:191,195`, `herramientas.ts:121`, `CabeceraSector.tsx:25`, `Diagnostico.tsx:309`, `Footer.tsx:79`, README | A | Es un precio (regla 4), no un reclamo de condición como «sin coste» (A33). Fuente: lo que decida Álvaro (P-10). T02 sacó el diagnóstico del formulario corto a A80 | por confirmar |
| A35 | Tiempo de rellenar el formulario (5 min / 10 min) | `proceso.ts:26-27`, `cifras.ts:22`, `auditoria/page.tsx:10,25-26`, `estudio/page.tsx:65` | C | Sin fuente: nadie lo ha medido. Ojo: «cinco minutos» es el formulario corto (proceso 01) y «diez minutos» la auditoría, así que son dos magnitudes, no una contradicción. Las 36 preguntas pasan a A38, y las once dimensiones y ocho áreas, a A81 | por confirmar |
| A36 | «Horas… y euros al año» que se ahorran; «horas y euros»; «lo que cuestan» | `auditoria.ts:274-276`, `proceso.ts:35-36`, `auditoria/page.tsx:9-10` | A | Lo calcula el informe del kit 03 «con el cálculo a la vista»: confirmar. No lleva número | por confirmar |
| A37 | «Lo primero que funciona, en semanas»; «trabajamos por fases» | `consultora.ts:282-283`, `proceso.ts:14-17,52-55`, `estudio.ts:91` | A (procedimiento) | Sin número no cuenta como cifra, pero es una promesa de plazo: va con P-10 | por confirmar |
| A38 | 36 preguntas en la auditoría | `Contacto.tsx:41`, `cifras.ts:22`, `auditoria.ts:264`, `auditoria/page.tsx:25`, `estudio.ts:86`, README | A | Fuente: `TOTAL_PREGUNTAS` (36). «Once dimensiones» y «ocho áreas» van en A81 | por confirmar |
| A39 | Otros procedimientos: la propuesta separa pago único y cuotas y a nombre de quién va cada una; si algo no se puede conectar, te lo decimos y proponemos otra cosa; no cambiamos nada sin que lo decidas; si no hace lo que esperabas, se ajusta antes de seguir; «una conversación, no un ticket» | `consultora.ts:263,290`, `proceso.ts:62`, `estudio.ts:99-100` | A (procedimiento) | Regla 2: solo con confirmación (P-10) | por confirmar |
| A70 | «Diagnóstico rápido · un minuto» | `DiagnosticoRapido.tsx:17`, `sectores/[slug]/page.tsx:67`, `Contacto.tsx:35` | C | Sin fuente: son 6 o 7 preguntas y nadie lo ha medido | por confirmar |
| A71 | Cifras sin fuente: «La mitad de los negocios de aquí se buscan por el móvil», «a dos calles de distancia», «el mismo dato escrito tres veces», «sin esperar tres semanas» | `servicios.ts:52,110`, `consultora.ts:39,99` | C | Sin fuente (regla 4). Cada una sale o se reescribe sin número | por confirmar |
| A72 | «El informe tarda unos días y llega por correo» | `FormularioAuditoria.tsx:713` | A (procedimiento) | Plazo sin número; confirmar que se cumple | por confirmar |
| A73 | «Espera un minuto» (formulario corto) y «Espera unos minutos» (auditoría) tras varios envíos | `FormularioContacto.tsx:57`, `FormularioAuditoria.tsx:678` | A | Fuente: el límite de la función (`kit/LEEME.md:97`, 3 envíos por correo cada 10 min y 40 por hora). «Un minuto» no cuadra con él, y es el mismo hecho con dos valores: se dice con el valor de la fuente | por confirmar |
| A74 | Cifras legales de `/privacidad/`: «se contesta en menos de un mes», «artículo 6.1.b del RGPD» | `privacidad/page.tsx:86-87,115-120` | A | Fuente: RGPD, arts. 12.3 y 6.1.b | por confirmar |
| A75 | Conservación: «un año desde que nos escribes, si no acabamos trabajando juntos… puedes pedir que se borren antes y se borran» | `privacidad/page.tsx:107-109` | A | Fuente: P-14. No hay nada que borre las solicitudes (ver A44) | por confirmar |
| A76 | Recuentos de la propia web: «Cuatro líneas de trabajo», «Siete servicios», «los diez servicios» (README), «Dos personas», «las mismas dos personas», «ocho pasos» (README) | `consultora.ts:61,232`, `Servicios.tsx:40`, `estudio/page.tsx:31-32`, `README.md:36,184,201` | A | Fuentes: `consultora.servicios.lineas` (4), `servicios.ts` (7), `estudio.ts` (2 personas), pasos del formulario (8). «Diez servicios» es falso: son 7, y se corrige a la fuente | por confirmar |
| A77 | Números de la interfaz: «© {año}» y la hora local del pie | `Footer.tsx:91-93,111` | A | Fuente: el reloj. No afirman nada, pero CA-8 los ve | por confirmar |
| A78 | Cifras de ejemplo fuera de una maqueta: «Unas 30 llamadas a la semana», el ejemplo de P4 («3: yo atiendo…»), «vendí tres cajas a 40 euros» | `auditoria/page.tsx:36-37`, `auditoria.ts:44`, `consultora.ts:140` | A | Fuente: inventada, es un ejemplo. Para no contar como cifra tienen que ir rotuladas como ejemplo o dentro de `[data-ejemplo]` | por confirmar |
| A79 | Cifras en las descripciones de las plantillas ficticias (p. ej. «Selector de curación (20/90/180/400 días)») | `plantillas.ts:60` y otros `concepto` | A | Fuente: la demo de cada plantilla. Describen negocios inventados (D-007) | por confirmar |
| A80 | «Solicitar diagnóstico gratuito»; «el diagnóstico es tuyo, gratis» (lo que se manda tras el formulario corto) | `consultora.ts:23,308`, `proceso.ts:44-45` | A | Es un precio (regla 4), y distinto de la auditoría (A34). Fuente: P-10. Si el nombre de esta puerta cambia (§3.4, P-11), la fila sigue | por confirmar |
| A81 | «Once dimensiones» (tu web, puntuada) y «ocho áreas puntuadas» del informe de la auditoría | `auditoria.ts:269-281` | A | Fuente: la estructura del informe del kit 03, que no se puede comprobar en el repo. Sin que Álvaro la confirme, no sale | por confirmar |

**Personas, terceros y datos**

| Id | Afirmación | Dónde | Nivel | Motivo | Estado |
|---|---|---|---|---|---|
| A40 | «Somos Álvaro y Yanin, primos», sin comerciales; un estudio pequeño, las mismas dos personas de principio a fin; el rol de Yanin | `consultora.ts:231-246` quién, `estudio.ts:29-49`, `estudio/page.tsx:31-32`, `TarjetaPersona.tsx:22-26` | A | `estudio.ts:40` («Foto, vídeo y redes») y `consultora.ts:243` («Diseño y contenido audiovisual») no coinciden. Las fotos son siluetas provisionales | por confirmar |
| A41 | «Se está estrenando con su primera tienda» | `herramientas/page.tsx:93-94` | C | Posible cliente real (regla 3): sale salvo autorización anotada | por confirmar |
| A42 | Booking y Airbnb cobran comisión por reserva, también al huésped que repite | `sectores.ts:164-166`, `diagnostico.ts:461` | A | Regla 5: sin cifra y citando sus condiciones. T02 partió la fila: el comportamiento del huésped es A46 y el calendario enlazado, A62 | por confirmar |
| A43 | Reseña que se pide sola; registro de viajeros en un formulario; facturas y cobros que salen solos | `diagnostico.ts:525-533,550,558-560` | B | Mejoras que el diagnóstico recomienda. Si las facturas se emiten, entra Verifactu (RD 1007/2023). El registro de viajeros recoge el DNI: necesita su propio análisis de datos | por confirmar |
| A44 | Dónde se recogen datos personales: «En esta web solo se recogen datos en un sitio: el formulario de la auditoría» | `privacidad/page.tsx:7,38` | **A, obligatorio** | Debe coincidir con el código (§5). Hoy es falso: también recoge datos el formulario corto (ver debajo) | por confirmar |
| A45 | «Consultora para pymes» y su familia: «Consultoría de IA y automatización», «IA, automatización y software a medida para pymes», «negocios pequeños de Galicia» (README) | `site.ts:7`, `layout.tsx:81-82,96`, `consultora.ts:20-22`, `Footer.tsx:48`, `README.md:3-4` | A | No coincide con la descripción aprobada en D-027. Una sola descripción en todo el sitio | por confirmar |
| A46 | Quien repite «la busca en Booking, porque es donde la encontró»; «la plataforma se queda también con los que ya te conocen» | `sectores.ts:166`, `diagnostico.ts:461` | C | Regla 5: comportamiento que no podemos citar. Puede ir como situación posible («si…», §3.1) | por confirmar |
| A47 | El registro de viajeros es obligatorio: «cada huésped tiene que dar sus datos para el registro» | `sectores.ts:160,179-181`, `diagnostico.ts:203,550` | A | Fuente: RD 933/2021; citarlo si se nombra | por confirmar |
| A48 | Juicios sobre Google y superlativos: la ficha «es lo primero que sale en el mapa», «la ficha de Google se suele quedar igual de atrás», «es de lo que más compensa en…» | `diagnostico.ts:713,731,803-818` | C | Regla 5 y sin fuente | por confirmar |
| A49 | La IA, la mensajería de WhatsApp y el alojamiento se pagan por uso o por cuota | `consultora.ts:289` | A | Es así según las tarifas publicadas de cada proveedor; sin cifras | por confirmar |
| A90 | Los datos están en Supabase, en la UE (región de París); solo se entra con las claves del estudio y la web no puede leer lo que mandan otros | `privacidad/page.tsx:93-95` | A | Proyecto en eu-west-3 (`kit/LEEME.md:94`); tabla con RLS y sin políticas (`README.md:205-208`). T02 no pudo mirarlo en Supabase: le faltan permisos | por confirmar |
| A91 | Anthropic redacta el informe y «no las usa para entrenar sus modelos»; «aparte de esos dos proveedores, no se cede nada a nadie»; casilla de la auditoría: «No se ceden a nadie» | `privacidad/page.tsx:98-101`, `FormularioAuditoria.tsx:509-517` | A | Fuente: condiciones comerciales de Anthropic (citarlas). Un encargado no es una cesión, pero la casilla debería nombrar a los dos encargados igual que la página | por confirmar |
| A92 | «No se recoge tu dirección IP», «ni se guarda de qué página vienes» | `privacidad/page.tsx:63-64` | A | No se puede comprobar en el repo: el código de la Edge Function no está, y Supabase guarda la IP en sus registros técnicos | por confirmar |
| A93 | En el navegador: sin cookies; el borrador de la auditoría y la fecha del aviso en `localStorage`, la cortina en `sessionStorage`. El aviso dice «solo tu borrador y este aviso» | `privacidad/page.tsx:64-66,139-142`, `AvisoCookies.tsx:62-65`, `auditoria/page.tsx:40-42` | A | El aviso cuenta dos cosas y la página tres. El borrador guarda nombre, correo y teléfono, no caduca y solo se borra si el envío sale bien | por confirmar |
| A94 | «Ni hay analítica, ni hay publicidad, ni hay cookies de terceros» | `privacidad/page.tsx:38-39,139` | A | Comprobado: no hay analítica en `src/` y las letras están autoalojadas | por confirmar |
| A95 | Diagnóstico rápido: «No se envía ni se guarda nada» | `DiagnosticoRapido.tsx:29-30`, `sectores/[slug]/page.tsx:75-76`, `Contacto.tsx:35`, `privacidad/page.tsx:74-75` | A | Cierto (D-001), pero las respuestas viajan en la URL y en el enlace copiado, y pasan a la auditoría si se pulsa el botón | por confirmar |
| A96 | Para qué se usan: solo para el informe y para responder; ni boletín ni publicidad, y tus respuestas no salen como ejemplo sin permiso por escrito; si llegan datos de clientes o contraseñas, se borran y te avisamos | `privacidad/page.tsx:69-71,81-83` | A (procedimiento) | Confirmar que se trabaja así | por confirmar |
| A97 | Lo que el formulario nunca pide: datos de tus clientes, contraseñas o accesos, facturas o exportaciones | `auditoria.ts:290-294`, `FormularioAuditoria.tsx:529-533` | A | Cierto en el formulario | por confirmar |
| A98 | «Lo único obligatorio de todo el formulario» (negocio, nombre y correo) | `FormularioAuditoria.tsx:430-431` | A | La casilla de consentimiento también es obligatoria | por confirmar |
| A99 | Responsable del tratamiento: «Undertactics, [PENDIENTE] (nombre fiscal y NIF), con domicilio en [PENDIENTE]» | `privacidad/page.tsx:47-48` | **A, obligatorio** | El formulario ya envía a una función real. P-15 | por confirmar |

**A44 · qué guarda cada vía de entrada** (leído en el código el 2026-11-01):

- **Formulario corto de la portada** (`FormularioContacto.tsx`, envío en
  `src/lib/auditoriaApi.ts`):
  - **Datos**: empresa, tipo de negocio, nombre, correo, teléfono
    (opcional), «qué te gustaría mejorar» (texto libre, hasta 4000
    caracteres) y el consentimiento. Tipo y texto van además como `P2` y
    `P35`, con «(formulario corto de la portada)»; se añade `origen: "web"`.
  - **Dónde**: Edge Function `solicitar-auditoria` de Supabase y tabla
    `public.solicitudes_auditoria` (eu-west-3), la misma que la auditoría.
    En el navegador no guarda nada.
  - **Quién lo ve**: quien tenga la clave de servicio, es decir, Álvaro.
    `kit/traer-solicitudes.mjs --bajar` lo copia en un `.md` en su disco
    (`KITS Claude/03-kit-auditoria-negocio/entrada`).
  - **Cuánto tiempo**: sin decidir. `/privacidad/` no lo nombra y nada lo
    borra (P-14).
- **Auditoría** (`FormularioAuditoria.tsx`):
  - **Datos**: negocio, a qué os dedicáis, ciudad, web, nombre, correo,
    teléfono (opcional), las respuestas contestadas de P1 a P36 y el
    consentimiento.
  - **Dónde**: la misma función y la misma tabla. Además, un borrador en
    `localStorage` (`undertactics:auditoria:v1`, con los datos de
    contacto), que no caduca y solo se borra si el envío sale bien.
  - **Quién lo ve**: Álvaro, igual que arriba. Anthropic procesa las
    respuestas cuando el kit escribe el informe.
  - **Cuánto tiempo**: `/privacidad/` dice «un año» sin relación, pero
    nada lo aplica ni en Supabase ni en los `.md` (P-14).
- **Correo directo** (`mailto:` de «Escribir un correo», «Pedir la de mi
  sector» y los errores de envío): llega a la cuenta de `site.email`
  (Gmail). Nada de la web lo guarda. Plazo: el de P-14.
- **Diagnóstico rápido**: no envía nada (D-001). Las respuestas van en la
  URL y llegan a la auditoría solo si se pulsa el botón; allí se quitan de
  la URL y pasan al borrador.

### 3.4 Nombres de producto

Cada producto nivel A tiene un nombre propio y estable. A nombrar: la plataforma
de tiendas (A01), el informe de mejoras (A03), el formulario de contacto (A04)
y lo que Álvaro confirme como A. Además hay **tres puertas de entrada que hoy
se confunden** y se nombran distinto:
- el **formulario corto de la portada** (envía una solicitud; hoy el botón dice
  «Solicitar diagnóstico gratuito»);
- el **diagnóstico rápido** de `/sectores/` (D-001: no envía ni guarda nada);
- la **auditoría completa** y su informe.

Reglas:
1. El nombre dice **qué obtiene el cliente**. Nunca lleva «propio/a» ni
   «herramienta».
2. Un solo nombre en todo el sitio, README y metadatos (CA-5).
3. **La etiqueta** «Herramienta propia» / «Software propio» pasa a decir el tipo
   de cosa («Informe», «Tienda», «Servicio»…), sin «propio».
4. Dos cosas distintas no comparten la palabra «diagnóstico» (CA-17).
5. Claude propone tres nombres por producto en `textos.md` y recomienda uno;
   **Álvaro elige** (P-11).
6. Álvaro comprueba que el nombre no choca con una marca registrada (OEPM).
   Un nombre descartado se sustituye por uno descriptivo.
7. La vigilancia y la ficha de Google se nombrarán en la 004, cuando existan.

### 3.5 Plantillas y otras palabras que sugieren clientes

El bloque que enseña plantillas en la portada de la consultora (hoy
«−4 · Proyectos y demostraciones») pasa a llamarse, de más a menos
recomendado, «Webs de ejemplo por sector» o «Algunas de las webs que hemos
diseñado».

- Son webs de negocios inventados (D-007): el aviso de que lo son va dentro de
  la **misma sección**, y visible (no en letra menor).
- Prohibido en ese bloque: «últimos trabajos», «nuestros clientes», «casos de
  éxito», «proyectos realizados», «para clientes como tú».
- «Proyectos» (`site.ts:17`, `portada.ts:27`, cota del bloque) sugiere trabajos
  hechos: se revisa en `textos.md`.
- En la portada vigente, «Una plantilla de 30.» es un préstamo fijado por D-014
  y **no se toca** (C-23).
- Un negocio real solo entra con su autorización anotada en el Anexo A (D-007).

### 3.6 Documento de textos (`textos.md`)

Se redacta primero en `specs/003-posicionamiento-y-textos/textos.md`, y no en
el código. Es una tabla Markdown con **una fila por texto**: ruta · fichero ·
identificador (la clave, o la cadena actual si es JSX sin clave) · texto actual ·
texto nuevo · motivo (regla o id del Anexo) · estado. Una variable se escribe
`{n}`. Los textos comunes a todas las páginas (menú, pie, cookies) llevan ruta
`*`. Álvaro lo aprueba (D-033) y entonces se copia al código tal cual.

Cada texto nuevo pasa seis filtros: (1) lo entiende el comprador sin jerga;
(2) lo que afirma está en el Anexo A y respeta su nivel; (3) capacidad, no
condiciones; (4) no presupone cómo trabaja el lector; (5) sin cifras ni plazos
sin fuente y con un solo valor; (6) castellano, tuteo, mismo tono. Además,
titular, entradilla y botón de cada sección prometen lo mismo.
Hay una fila por **cada ruta** del export, aunque no cambie nada (CA-12).

### 3.7 Lo que sale de la web

Mientras no estén hechas y comprobadas en la 004 (y sin «próximamente»):
- **Vigilancia y ficha de Google** (A19, A20):
  - `herramientas.ts`: entradas `vigilancia` y `ficha-google`.
  - `consultora.ts`: dos de las tres entradas de «Automatizaciones e inteligencia
    artificial» (queda el informe) y la entradilla («vigilancia diaria»).
  - `servicios.ts` 07: la línea «Vigilancia de caídas» y su enlace; `servicios.ts`
    03: el enlace a `#ficha-google`.
  - `hero.ts:75,80`: la parada «Vigilada cada día» del flujo «Tu web». **El
    test `hero.test.ts` exige 4 flujos de 3 paradas y que cada `clave` exista
    en `servicios.ts`**: `textos.md` dice con qué parada se sustituye y de
    qué servicio sale.
  - `proceso.ts:74`: «vigilancia de caídas» de la última fila.
  - `herramientas/page.tsx:15`: la `description` de la página.
  - `diagnostico.ts:496`: la mejora `ficha-google` se queda (es un consejo, no
    una herramienta) y su enlace pasa a `/#servicios`, que está en la lista
    blanca de la 001 §7 (D-003 exige que toda mejora tenga enlace).
- **Atención al teléfono** (A14), **vídeo como servicio** (A21) y **«factura
  emitida»** (A16) donde aparezcan como cosa hecha.
- Lo que el Anexo A deje en nivel C y los reclamos de condición (A33).
- Qué pasa con la categoría «Automatizaciones e inteligencia artificial» si se
  queda con una entrada: lo decide `textos.md`.

### 3.8 Lo que no cambia

El rótulo «Ejemplo» de las maquetas (D-019), noindex, la estructura de rutas y
los slugs de sector (D-009), el diagnóstico y su lógica (D-001 a D-004, D-013),
las frases de D-014 (C-23) y el **aviso de que nada es trabajo de cliente**:
conserva su idea, pero no su texto, porque hoy dice «software propio»
(`consultora.ts:174`) y debe cambiar (CA-1).

## 4. Datos

Ninguna tabla ni migración. Se tocan los ficheros de §2. Ficheros nuevos:
`textos.md`, `linea-base.md` (salida de tests, build y comprobaciones **antes**
de la primera tarea de código) y `scripts/comprobar-textos.mjs`.

## 5. Seguridad, privacidad y legal

- **Publicidad engañosa.** Afirmar un servicio que no existe es un acto de
  engaño en la Ley de Competencia Desleal (Ley 3/1991, art. 5), aunque la web
  sea noindex. Los niveles (§3.2) son la defensa. Álvaro aprueba `textos.md`
  antes de publicar.
- **Marcas.** Nombrar un producto con una marca ajena es un riesgo real
  (§3.4, regla 6). Lo comprueba Álvaro.
- **Datos personales.** `/privacidad/` debe decir lo que hace el código. Hoy no
  lo dice: afirma un único formulario que recoge datos y en esta rama hay dos
  (formulario corto de la portada y auditoría). D-026 se apoya en que «la web
  no guarda datos personales». Se corrige `privacidad` y se anota en el Anexo
  (A44) qué guarda cada formulario, quién lo ve y cuánto tiempo. Si eso exige
  una decisión de datos, va como P-xx aparte.
- **Personas con nombre** (Álvaro, Yanin): su aparición y su descripción las
  confirman ellos (A40).
- **Terceros** (Booking, Google, WhatsApp, Airbnb): sin cifras ni juicios que
  no podamos citar (regla 5).

## 6. Casos límite

- **Rama.** La portada de la consultora vive en `exp/consultora`; la vigente,
  en `main` o `feat/rediseno-por-debajo` (D-020). Los ficheros compartidos
  (`servicios.ts`, `herramientas.ts`, `hero.ts`) cambiarían en dos ramas. Hasta
  decidir P-08, la 003 se implementa **solo en `exp/consultora`** y quien
  mergee después lleva la portada vigente a estos mismos textos (tarea aparte).
- Un nombre no cabe en una maqueta o en el menú: `textos.md` define una forma
  corta; no se recorta automáticamente.
- Quedan anclas `/herramientas/#vigilancia` y `#ficha-google` en enlaces ya
  mandados: la ruta sigue, el ancla no encuentra nada, la página abre arriba.
  Se acepta y se anota en el README (entre las marcas
  `<!-- 003-anclas -->`, que el script ignora).
- Álvaro cambia un nivel después de aprobar `textos.md`: una D nueva y se
  reescriben solo las filas que citan ese id.
- Un test existente comprueba un texto viejo: se actualiza al texto aprobado,
  no se borra.
- `hero.test.ts` y `portada.test.ts` (que compara los `dato` de `proceso.ts`)
  pasan a comparar con el texto aprobado.
- `diagnostico.ts` (820 líneas): no se reescribe, se revisa por afirmaciones
  (A42, A43), enlaces (§3.7) y por lo que presupone del lector (§3.1).
- Una frase de nivel C reescrita con otras palabras no la pilla el script:
  la mira Álvaro (CA-13).

## 7. Pruebas

(t) = automatizable con `scripts/comprobar-textos.mjs`; (m) = la mira Álvaro o
quien comprueba. El script lee `src/**`, `README.md` (sin el bloque
`003-anclas`) y todo `out/**/*.{html,js,txt}`, sin distinguir mayúsculas ni
tildes.

- **CA-1 (t).** 0 apariciones de «herramienta(s) propia(s)», «software propio»
  y «el software propio». («Plantillas propias» se decide en `textos.md`, no en
  el script.)
- **CA-2 (t).** 0 apariciones de «vigilancia», «vigilada», «auditoría de la
  ficha», `#vigilancia` y `#ficha-google`, salvo una lista cerrada de excepciones
  con su motivo. Un interruptor `VIGILANCIA_EXISTE=false` en el script lo
  invierte la 004 al terminar.
- **CA-3 (t y m).** Las frases de nivel C que figuran en el script (salen del
  Anexo A) tienen 0 apariciones; las paráfrasis las pilla CA-13.
- **CA-4 (t).** Cada fila de `textos.md` en estado `aprobada` tiene su «texto
  nuevo» en el fichero que indica, normalizando espacios y saltos de línea de
  JSX y tomando `{n}` como comodín. Ninguna fila queda sin aprobar.
- **CA-5 (t).** Cada producto usa su nombre aprobado en todo el sitio, README y
  metadatos. Los nombres viejos que no sean descriptivos tienen 0 apariciones.
- **CA-6 (t y m).** En «Webs de ejemplo por sector», `/plantillas/` y
  `PlantillasSector` el aviso de negocios inventados está dentro de la misma
  `<section>` (t); 0 apariciones de las palabras de §3.5 (t); el aviso es
  legible y no va en letra menor (m).
- **CA-7 (t).** Llevan rótulo «Ejemplo» el hero, las maquetas de «Tecnología
  aplicada», `ChatEjemplo`, las maquetas de las páginas de sector y las
  capturas de `/herramientas/` (lista cerrada de selectores en el script).
- **CA-8 (t).** Toda cifra (definición de §3.2, regla 4) está en una lista de
  cadenas exactas, cada una con su id del Anexo. Quedan fuera: cotas,
  numeración de estructura (01-07, P1-P36, 404), `plantillas.length`,
  `TOTAL_PREGUNTAS` y lo que vaya dentro de una maqueta o un chat «Ejemplo».
  Una misma magnitud (tiempo del formulario, plazo) tiene un solo valor.
- **CA-9 (m).** El hero, el titular de problemas y su cierre, y las páginas de
  sector no dan por hecho WhatsApp, hojas de cálculo, programas desconectados ni
  web vieja. Álvaro lo lee como una clínica, una tienda y un despacho.
- **CA-10 (t).** Pasan los tests de `hero`, `portada`, `plantillas`, `sectores`
  y `diagnostico.reglas`, el build y el export, y `comprobar-consultora.mjs` y
  `comprobar.mjs` no empeoran respecto a `linea-base.md`.
- **CA-11 (m).** Titular, entradilla y botón de cada sección prometen lo mismo.
- **CA-12 (t).** `textos.md` tiene una fila por cada `out/**/*.html` (incluido
  `404.html`) y filas `*` para lo común; ninguna sin estado.
- **CA-13 (m).** Álvaro confirma o corrige cada fila del Anexo A (P-09) y lee la
  web buscando paráfrasis de lo que es nivel C.
- **CA-14 (m).** `/privacidad/`, el formulario corto y la auditoría dicen lo
  que hace el código (A44).
- **CA-15 (m).** Cada sección de la portada lleva el rótulo de su puerta (§3.1).
- **CA-16 (t).** 0 apariciones de «sin compromiso», «sin coste», «sin cuota(s)»,
  «sin permanencia», «no paga cuota» fuera de una lista de excepciones aprobada.
- **CA-17 (t).** «Diagnóstico» solo aparece para el diagnóstico rápido (lista
  de rutas y componentes en el script).

## 8. Cambios a otras specs

Pendientes hasta que esta spec esté hecha y comprobada (tarea «Comprobar la spec»).
Hasta entonces, quien lea una de estas specs lee también este apartado.

### 002 · Rediseño «Por debajo» — pendiente

- **MODIFICA §1, «con los diez servicios en su orden actual»** — sustituye por:
  > con los servicios de `servicios.ts` en su orden (hoy siete; la PR #50 los
  > bajó de diez y el vídeo dejó de ser uno de ellos)
- **AÑADE al final de §2, «Queda fuera»:**
  > Desde la 003 el contenido de `servicios.ts`, `sectores.ts`, `diagnostico.ts`
  > y `herramientas.ts` sí se revisa, solo en afirmaciones, enlaces y lo que
  > presupone del lector (003 §3.7 y §6).
- **AÑADE al final de §3.6:**
  > Descripción del hero, lecturas, paradas (incluido «Factura emitida» y
  > «Vigilada cada día») y botones se rigen por la 003. Se mantienen cuatro
  > flujos de tres paradas y que cada parada exista en `servicios.ts` (§7).
- **MODIFICA §3.7, «Entradilla (P-04): «Diez servicios. Cada uno tiene una
  parte que ve tu cliente y otra que trabaja por debajo.»»** — sustituye por:
  > Entradilla: la de `specs/003-posicionamiento-y-textos/textos.md` (D-033).
  > El número de servicios sale de `servicios.ts`, no se escribe a mano en
  > ningún texto.
- **MODIFICA §3.7, «Los **diez servicios en el orden de `servicios.ts`**.»** —
  sustituye solo esas palabras por «Los servicios de `servicios.ts`, en su
  orden (hoy siete)». Se conserva el resto de la línea y sus subpuntos.
- **AÑADE al final de §3.7:**
  > Este apartado describe la portada vigente. La portada de `exp/consultora`
  > pinta `consultora.servicios` (cuatro líneas), no `servicios.ts` (P-08).
- **AÑADE al final de §3.8:**
  > El título «Una plantilla de 30.» se mantiene (D-014). El aviso, «¿Tu sector
  > no está?» y el título del bloque equivalente de la portada de la consultora
  > se rigen por la 003 §3.5.
- **AÑADE al final de §3.9 y de §3.11:**
  > Los datos «10 min», «semanas, no meses», «2 semanas», «36 preguntas» y «0 €»
  > se rigen por la 003 (§3.2 regla 4, CA-8): una sola cifra por magnitud y
  > con fila en el Anexo A.
- **AÑADE al final de §3.13** (con la 003 §3.5, y fuera de ella las tres
  frases de D-014 — «Lo de arriba vende. Lo de abajo trabaja.», «Montamos lo
  que se ve y lo que va debajo.» y «Una plantilla de 30.»):
  > Los textos de la tabla anterior, salvo el rótulo de los ejemplos del hero,
  > las cotas y las tres frases de D-014, quedan sustituidos por los de
  > `specs/003-posicionamiento-y-textos/textos.md` desde que se aprueba (D-033).
  > Las reglas de este apartado siguen valiendo y se concretan en la 003 §3.2.
- **AÑADE al final de §4** (donde dice que `servicios.ts` y `diagnostico.ts`
  quedan sin cambios):
  > Salvo lo que cambie la 003 en afirmaciones y enlaces.
- **AÑADE al final de §7:**
  > Los tests de §3.6 (paradas), de §3.9 (los `dato` literales de `proceso.ts`)
  > y de dorsales de §3.8 se actualizan a los textos aprobados en la 003, sin
  > borrarse.
- **AÑADE al final de §9, P-04:**
  > Cerrada por D-027. Los textos que figuren en la 003 `textos.md` la
  > sustituyen (C-22).

### 001 · Diagnóstico rápido y páginas por sector — pendiente

- **MODIFICA §3.4, tabla de mejoras, fila `ficha-google`, columna de enlaces:**
  sustituye «`/herramientas/#ficha-google` en los dos» por
  > `/#servicios` en los dos (003 §3.7)
- **AÑADE al final de §3.8:**
  > Los problemas de cada sector se escriben como situaciones habituales, no
  > como hechos sobre quien lee (003 §3.1). Sujeto a P-13.
- **MODIFICA §7, «Hecho cuando», «Álvaro ha revisado los textos (P-03).»** —
  sustituye por:
  > Álvaro ha revisado los textos (P-03, absorbido por la 003, D-033).
- **MODIFICA §8, P-03, al final:**
  > Absorbido por la 003: se cierra con D-033.

(El índice `SDD.md` pasa a decir que la 003 depende de 001 y 002.)

## 9. Decisiones propuestas y pendientes

**Conflictos que abre**
- **C-22.** La 003 sustituye textos que D-027 aprobó «tal cual». Propuesta:
  D-033 sustituye a D-027 solo para los textos de `textos.md` aprobado.
- **C-23.** El §3.13 de la 002 contiene frases fijadas por D-014. Propuesta
  aplicada: la 003 las **respeta**. Si Álvaro quiere cambiar alguna, una D
  nueva dice que sustituye a D-014 en eso.

**Decisiones que se proponen al aprobar**
- **D-032** · Spec 003 aprobada. Resuelve C-22 y C-23 como arriba. Lee el
  principio «Copy de capacidad, no de condiciones» así: los reclamos de
  condición no se escriben; la información de procedimiento confirmada por
  Álvaro (P-10) sí.
- **D-033** · `textos.md` aprobado fila a fila. Cierra P-03 de la 001 y
  sustituye a D-027 en lo que figure en él.

**Pendientes**
- **P-08** · ¿Qué portada se publica, la vigente o la de la consultora? ¿En qué
  rama se integra la 003? Hasta decidirlo, solo `exp/consultora` y lo compartido.
  Quien: Álvaro. Bloquea: llevar los textos a la portada vigente.
- **P-09** · Confirmar el Anexo A fila por fila, en especial A01, A02, A04, A11,
  A14, A16, A17, A19, A20, A40. Quien: Álvaro. Bloquea: `textos.md`.
- **P-10** · Condiciones y plazos (A30 a A36). Un comentario de `proceso.ts`
  dice que Álvaro decidió el 2026-10-31 las fases y el pago por fase; confirmar
  que es así y decidir el resto: «a tu nombre», plazos, «gratis», tiempo del
  formulario. Quien: Álvaro. Bloquea: FAQ, proceso, estudio y cifras.
- **P-11** · Elegir nombres (producto y las tres puertas de entrada) y
  comprobar marcas (OEPM). Quien: Álvaro. Bloquea: aprobar `textos.md`.
- **P-12** · Spec 004 «Vigilancia diaria y auditoría de la ficha de Google»:
  cómo se construirían y dónde correrían (la web es estática en GitHub Pages).
  La escribe Claude tras aprobar la 003. No bloquea.
- **P-13** · ¿La regla de §3.1 (no presuponer) vale también para las tres
  páginas de sector, o ahí se admite hablar de los problemas típicos del
  sector como hechos? Recomendado: vale, escritos como situaciones habituales.
  Quien: Álvaro. Bloquea: textos de sector.

## 10. Para el plan

- Orden: `linea-base.md` → Anexo A confirmado (P-09, P-10) → `textos.md`
  redactado → aprobado (D-033) → código por fichero → script de comprobación →
  «Comprobar la spec».
- `textos.md` es trabajo de redacción delicado (§5): se recomienda Opus y que
  solo un chat toque ese fichero.
- Tareas de código por fichero. `consultora.ts`, `herramientas.ts`,
  `servicios.ts`, `hero.ts` y `proceso.ts` son los que más crecen y no pueden ir
  dos chats a la vez; sus tests (`hero.test.ts`, `portada.test.ts`) van con
  ellos.
- T01: `scripts/comprobar-textos.mjs` con los CA (t), marcados pendientes hasta
  activar cada bloque.
- Playwright: una sola prueba a la vez y sin capturas por cuenta propia (reglas
  de `WEBS NEGOCIOS/CLAUDE.md`).
- Los carriles 1 y 2 no esperan a esta spec salvo en el texto de las maquetas.
