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
completa sale de leer cada fichero (§2); estas son las filas ya detectadas.

**Productos y servicios**

| Id | Afirmación | Dónde | Nivel | Motivo |
|---|---|---|---|---|
| A01 | Plataforma de tiendas: catálogo, cobro, envíos, panel móvil, aviso de qué reponer | `herramientas.ts`, `servicios.ts` 02, `consultora.ts` | por confirmar | Hay maqueta; hay que confirmar que **funciona hoy**. Cobra comisión; no emite facturas ni escribe fichas desde una foto |
| A02 | Tarjeta y Bizum, recogida y reparto local, reparto por código postal, enlace de pago, pedidos por WhatsApp, Instagram/Facebook/Google Shopping | `servicios.ts` 02, `herramientas.ts:70` | por confirmar | No verificado |
| A03 | Informe de mejoras de tu web | `herramientas.ts`, `consultora.ts` | A | Hay informes hechos. Ojo: están en `WEBS NEGOCIOS/informes/` (PDF de negocios reales), no en el repo y no enseñables |
| A04 | Formulario de contacto: aviso al correo y confirmación a quien escribe | `herramientas.ts` | por confirmar | Lo sostiene el envío a Supabase de `FormularioContacto.tsx`; `kit/traer-solicitudes.mjs` solo baja las solicitudes de la auditoría |
| A05 | N plantillas de ejemplo (el N sale de `plantillas.ts`) | `consultora.ts`, `cifras.ts`, portada vigente | A | Ver P-02 |
| A06 | Diseño y desarrollo web a medida, rescate de webs viejas, redirecciones 301 | `servicios.ts` 01 | A | Es lo que muestran las plantillas |
| A07 | Mantenimiento: cambios de contenido, copias, actualizaciones | `servicios.ts` 07 | A | Servicio humano. Sin la línea de vigilancia |
| A08 | Ficha de Google, SEO local y reseñas hechos a mano | `servicios.ts` 03 | B | Trabajo nuestro, no herramienta |
| A09 | Medición sin cookies, Core Web Vitals, datos estructurados, «sin banner de cookies» | `servicios.ts` 03, `herramientas.ts:94` | por confirmar | |
| A10 | Desistimiento «desde junio de 2026» en la tienda | `herramientas.ts:94` | por confirmar | Es legal y lleva fecha |
| A11 | Agente en la web que contesta y recoge datos | `consultora.ts`, `servicios.ts` 05, sectores | A para lo que `recepcionista-ia` hace hoy (D-008), si no B | Confirmar qué hace hoy |
| A12 | Agente en WhatsApp | `consultora.ts`, `servicios.ts` 05 | B | Aparte de A11 |
| A13 | «Mira tus datos reales» y «deja un registro» del agente | `consultora.ts:83,296` | por confirmar | |
| A14 | Atención al teléfono / voz | `servicios.ts:82` | C | Un comentario de `consultora.ts:58` dice que no está montado |
| A15 | Factura que se lee sola, presupuestos en un clic, cuentas con un audio, citas con recordatorio, embudo | `consultora.ts` (maquetas) | B | Ejemplos con datos inventados |
| A16 | «Facturación» como automatización, y «factura emitida» tras una venta | `servicios.ts` 04, `hero.ts:57` | C para emitir; B para leer facturas | La plataforma no emite facturas |
| A17 | Marketing con IA: email a clientes, fichas de producto, respuesta a reseñas, «respuesta con tu tono», «informe del mes» | `servicios.ts` 06, `hero.ts:64,69` | por confirmar | Sin nada que enseñar |
| A18 | Reservas (calendario con fechas, simulado) | plantillas de alojamiento | B | Puerta 1 sin fila hasta hoy |
| A19 | Vigilancia diaria, vigilancia de caídas, avisos de caducidad, «resumen cada semana», «la alerta nos llega a nosotros» | `herramientas.ts:80,99`, `consultora.ts`, `servicios.ts` 07, `hero.ts`, `proceso.ts` | **C** | Álvaro: no existe |
| A20 | Auditoría de la ficha de Google como herramienta | `herramientas.ts`, `consultora.ts` | **C** | Álvaro: «creo que no» (P-09) |
| A21 | Vídeo como servicio | `consultora.ts:235`, `estudio.ts:49` | C | La PR #50 lo quitó |

**Condiciones, plazos y cifras**

| Id | Afirmación | Dónde | Nivel | Motivo |
|---|---|---|---|---|
| A30 | Propuesta por escrito antes de empezar; cada fase se paga cuando se ve funcionando | `consultora.ts` FAQ, `proceso.ts:14-17,57` | por confirmar | El comentario de `proceso.ts` dice «Decidido por Álvaro el 2026-10-31»; hay que confirmarlo (P-10) |
| A31 | Código en un repositorio «a tu nombre», «te lo llevas entero» | `consultora.ts`, `estudio.ts:56-72`, `proceso.ts:71`, `servicios.ts:116` | por confirmar | Condición (P-10) |
| A32 | «Lo primero que funciona, en semanas»; «2 sem.» | `consultora.ts` FAQ, `proceso.ts:53`, `estudio.ts:91`, `cifras.ts:21` | por confirmar | Plazo; se contradicen (P-10) |
| A33 | «Sin compromiso», «sin coste», «no paga cuota a nadie», mantenimiento opcional | `proceso.ts:44`, `FormularioContacto.tsx:262`, `servicios.ts:19`, `consultora.ts:289` | condición: se quita (regla 2) | |
| A34 | Auditoría gratuita / «0 €» / presupuesto sin coste | `cifras.ts:23`, `consultora.ts:23`, `plantillas/page.tsx:54`, `estudio/page.tsx:69`, `herramientas/page.tsx:195` | por confirmar | Es un precio |
| A35 | Tiempo de rellenar el formulario (5 min / 10 min), 36 preguntas, once dimensiones, ocho áreas | `proceso.ts:26`, `cifras.ts:22`, `auditoria.ts:266,276`, `auditoria/page.tsx:10` | por confirmar | Un solo valor |
| A36 | «Horas… y euros al año» que se ahorran | `auditoria.ts:271` | por confirmar | |

**Personas, terceros y datos**

| Id | Afirmación | Dónde | Nivel | Motivo |
|---|---|---|---|---|
| A40 | «Somos Álvaro y Yanin, primos», sin comerciales; el rol de Yanin | `consultora.ts` quién, `estudio.ts:34,40` | por confirmar | `estudio.ts:40` («Foto, vídeo y redes») y `consultora.ts:243` («Diseño y contenido audiovisual») no coinciden |
| A41 | «Se está estrenando con su primera tienda» | `herramientas/page.tsx:93` | por confirmar | Posible cliente real (regla 3) |
| A42 | Booking, Airbnb, comisión del huésped que repite, calendario enlazado | `sectores.ts:160,164,171`, `diagnostico.ts:461` | por confirmar | Regla 5 |
| A43 | Reseña que se pide sola; registro de viajeros; facturas y cobros | `diagnostico.ts:527,550,560` | por confirmar | Mejoras que el diagnóstico recomienda |
| A44 | Dónde se recogen datos personales | `privacidad/page.tsx:38` | **A, obligatorio** | Debe coincidir con el código (§5) |
| A45 | «Consultora para pymes» | `site.ts:7`, `layout.tsx:81` | por confirmar | No coincide con la descripción aprobada en D-027 |

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
