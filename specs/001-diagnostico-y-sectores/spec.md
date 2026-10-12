# 001 · Diagnóstico rápido y páginas por sector

Estado: hecha (comprobada 2026-10-12; aprobada D-011, 2026-10-11) · Depende de: — · Decisiones: D-001 a D-011 · Conflictos: — · Pendientes: P-01, P-02, P-03
Plan: [plan.md](plan.md) (aprobado, D-012) · Tareas: [tasks.md](tasks.md)
Cambiada por: D-012 (2026-10-11, §3.5)

## 1. Objetivo

Hoy la única forma de que un negocio sepa qué le haríamos es la auditoría
gratuita: 36 preguntas y unos días de espera. Mucha gente no llega a empezarla.

Esta spec añade dos cosas:

- Un **diagnóstico rápido**: 6 o 7 preguntas de un toque que, al terminar,
  enseñan en la misma pantalla de 3 a 5 mejoras concretas para ese negocio.
  Las puede montar Undertactics u otra agencia; decirlo da confianza.
  El diagnóstico lleva a la auditoría con las respuestas ya puestas.
- **Páginas por sector**: clínicas dentales, alojamientos rurales, y asesorías
  y despachos. Cada una habla de los problemas reales de su sector, trae el
  diagnóstico con el sector ya elegido y enseña un ejemplo del asistente y
  las plantillas ficticias de ese sector.

El uso principal es **prospectar**: mandar a un negocio el enlace de su
sector, o su diagnóstico ya hecho. La web sigue con noindex, así que esto no
busca tráfico de Google.

## 2. Alcance

**Entra**
- Contenido: `src/content/diagnostico.ts` (preguntas, mejoras y reglas) y
  `src/content/sectores.ts` (las tres páginas).
- Lógica pura en `src/lib/diagnostico.ts`, con sus tests.
- Componente `Diagnostico`, que se usa en la portada y en cada página de sector.
- Rutas `/sectores/` y `/sectores/[slug]/` (export estático con
  `generateStaticParams`).
- Prerrelleno de `/auditoria/` desde la URL.
- Una sección nueva en la portada, «Diagnóstico», con la fila «Por sector».

**Queda fuera**
- Chat en vivo. Va en su propia spec dentro de `recepcionista-ia` (D-008).
- Plantilla dental ficticia (P-01) y alta de las plantillas de asesoría (P-02).
- Analítica de respuestas. Exigiría cookies y consentimiento; si algún día
  se quiere, va en otra spec.
- Más sectores. Se añaden después como entradas nuevas en `sectores.ts`, sin
  tocar código.
- Cambios en el kit 03, en la Edge Function o en la tabla de Supabase. Las
  respuestas prerrellenadas son texto normal en sus P.

## 3. Comportamiento

### 3.1 Preguntas

Todas son de opciones, sin texto libre (D-002). Cada opción tiene un código
corto y estable, que es lo que viaja en la URL, nunca su posición. «No lo sé»
existe donde tiene sentido y nunca dispara mejoras ni prerrelleno.

| Clave URL | Pregunta | Tipo | Opciones (códigos) | Prerrellena |
|---|---|---|---|---|
| `s` | ¿Qué tipo de negocio tienes? | una | `dental`, `rural`, `despachos`, `otro` | P2 y `contacto.sector` (`otro` no rellena) |
| `canales` | ¿Por dónde te llegan los clientes? | varias | `tel`, `wa`, `web`, `email`, `redes`, `puerta`, `plataformas` (solo en `rural`: Booking, Airbnb…) | P7 |
| `reserva` | ¿Cómo se pide una cita o reserva? | una | `llamando` (solo llamando o por mensaje), `online` (reservan solos en internet), `plataformas` (solo `rural`), `sin-cita` | P14 (y P12 con `sin-cita`: «No trabajamos con cita») |
| `fuera` | ¿Qué pasa con los mensajes fuera de horario? | una | `sin-contestar`, `dia-siguiente`, `siempre` (alguien contesta), `no-se` | P10 |
| `web` | ¿Cómo estás en internet? | una | `al-dia` (web y ficha de Google al día), `antigua` (web que nadie toca), `solo-ficha`, `nada`, `no-se` | — |
| `resenas` | ¿Pides reseñas a tus clientes? | una | `siempre`, `a-veces`, `nunca` | P23 |
| `dolor` | Si pudieras quitarte una tarea, ¿cuál sería? | una | `preguntas` (contestar siempre lo mismo), `agenda` (cuadrar citas y recordatorios; no sale si `reserva=sin-cita`), `papeles` (pedir y ordenar documentación), `cobros` (facturas y cobros), `clientes` (que te encuentren clientes nuevos) | P35 |

- **Textos de las opciones por sector.** La etiqueta puede cambiar según el
  sector («cita» en `dental`, «reserva» en `rural`, «primera consulta» en
  `despachos`), pero el código no. Las opciones marcadas «solo `rural`» no
  salen en los demás.
- **En una página de sector** no se pregunta `s`: el sector viene fijado por
  la página y gana a cualquier `s` de la URL. Aun así `s` siempre va en la
  query que se genera (ver 3.5), porque la auditoría lo necesita.
- **El texto prerrellenado** está escrito en `diagnostico.ts`, una frase por
  opción y por P, en el tono de quien responde, y **todas acaban en « (del
  diagnóstico rápido)»**. El kit transcribe las P «tal cual las escribió el
  negocio» (`kit/traer-solicitudes.mjs`), y el diagnóstico puede haberlo hecho
  Álvaro por el prospecto. Con la marca, el informe sabe de dónde sale cada
  respuesta, sin tocar el kit. Ejemplos:
  - P14 con `llamando`: «No, solo llamando o por mensaje (del diagnóstico
    rápido)».
  - P14 con `online`: «Sí, reservan solos por internet (…)».
  - P14 con `plataformas`: «Solo a través de plataformas como Booking o
    Airbnb (…)».
  - P14 con `sin-cita`: «No trabajamos con cita (…)», y lo mismo en P12.
  - P7 no puede ordenar de más a menos, porque no se preguntó. Dice: «Por
    estos canales, sin orden: teléfono, WhatsApp y Booking (del diagnóstico
    rápido)».
  - `contacto.sector` lleva el nombre del sector sin marca («Clínica dental»),
    porque es un campo de ficha, no una respuesta.

### 3.2 Cómo se responde

- Una pregunta por pantalla, con «2 de 7» y una barra de progreso. El total
  se calcula según el contexto: 7 en la portada (con `s`) y 6 en una página
  de sector. Ningún texto fijo lleva el número escrito.
- En las de una sola opción, tocar una opción pasa a la siguiente pregunta.
  Las de varias tienen un botón «Seguir», que está activo con al menos una
  marcada.
- «Atrás» vuelve a la pregunta anterior con la respuesta marcada.
- No hay preguntas opcionales: todas se responden, aunque sea con «No lo sé».
- Al cambiar de pregunta, el foco va al título de la nueva pregunta.

### 3.3 Resultado

- Sustituye a las preguntas en el mismo sitio, sin cambiar de página.
- Título: «Lo que haríamos en tu <negocio>», con el nombre del sector.
- Entre 3 y 5 mejoras, ordenadas por prioridad. Cada una tiene:
  - **título** (p. ej. «Que reserven sin llamar»);
  - **qué resuelve**, en una o dos frases;
  - **porqué**, ligado a la respuesta que la dispara, en cursiva y más
    pequeño: «Porque nos dijiste que las citas solo se piden llamando.»;
  - **enlace opcional**, que depende de dónde esté el diagnóstico (ver 3.4).
- Una sola línea para todas las mejoras: «Esto lo podemos montar nosotros o
  cualquier agencia que sepa hacerlo». No se repite en cada una.
- Debajo del resultado, tres acciones:
  - **«Llevar estas respuestas a la auditoría»**: enlace a
    `/auditoria/?<misma query>`. Es el botón principal.
  - **«Copiar el enlace a este diagnóstico»**: copia la **URL canónica** del
    apartado 3.5. No copia `location.href`, así que un diagnóstico de la
    portada con `s=dental` se comparte apuntando a la página dental. La URL se
    construye con el origen y `NEXT_PUBLIC_BASE_PATH`. Si el portapapeles
    falla, enseña la URL seleccionada para copiarla a mano.
  - **«Cambiar respuestas»**: vuelve a la primera pregunta con todo marcado y
    quita la query de la barra de direcciones (`replaceState`).
- Nada de nota global ni de precios (D-003). Copy de capacidad, no de
  condiciones.

### 3.4 Reglas: de las respuestas a las mejoras

- `diagnostico.ts` tiene un **catálogo de mejoras**: `id`, `titulo`,
  `queResuelve`, `enlace?` y `sectores` donde aplica.
  - `enlace` es `{ portada?: string; sector?: string }`, porque el destino
    cambia según dónde esté el diagnóstico. Por ejemplo, `asistente` apunta a
    `#asistente` en una página de sector y a `/#servicios` en la portada.
  - El valor especial `"plantillas-sector"` se resuelve así: a
    `#plantillas-sector` si esa página de sector tiene el bloque de
    plantillas; si no, a `/plantillas/`.
- También tiene una **lista de reglas**: `mejora`, `si` (condición sobre las
  respuestas), `prioridad` (número, mayor primero) y `porque` (frase).
- **El catálogo describe mejoras que puede montar cualquier agencia, no
  productos nuestros.** Solo se enlaza a algo nuestro (herramientas,
  plantillas, ejemplo del asistente) cuando existe y hace lo que dice el
  texto. Un texto de mejora nunca da a entender que el asistente de
  `recepcionista-ia` ya manda recordatorios o atiende WhatsApp: hoy no hace
  ninguna de las dos cosas (ver su README).
- `diagnosticar(sector, respuestas, contexto)`, con contexto `"portada"` o
  `"sector"` y sabiendo si hay bloque de plantillas:
  1. aplica las reglas que se cumplen y que valen para el sector;
  2. quita las mejoras repetidas y se queda con el porqué de la regla de más
     prioridad;
  3. ordena por prioridad y corta en 5;
  4. si salen menos de 3, completa con la lista `relleno` del sector, en
     orden, sin repetir, **saltándose las mejoras excluidas** (ver abajo) y
     con el porqué genérico del sector («Es de lo que más compensa en una
     clínica dental»).

  Antes del paso 1, `diagnosticar` calcula las **exclusiones** y las aplica
  a las reglas y al relleno.

  Es pura: misma entrada, misma salida.
- Catálogo inicial. El implementador redacta los textos definitivos y Álvaro
  los revisa (P-03).

| Mejora | Sectores | Se dispara con | Enlace (portada / sector) |
|---|---|---|---|
| `reservas-online`: citas sin llamar, con recordatorio | `dental`, `despachos`, `otro` | `reserva=llamando`; `dolor=agenda` | — |
| `reservas-directas`: reservas en tu propia web, sin depender de Booking | `rural` | `reserva=llamando` o `plataformas`; `canales` incluye `plataformas`; `dolor=agenda` | `/plantillas/` / `plantillas-sector` |
| `asistente`: contesta fuera de horario en tu web | todos | `fuera=sin-contestar` o `dia-siguiente`; `dolor=preguntas` | `/#servicios` / `#asistente` |
| `formularios`: formularios propios que llegan ordenados | todos | `canales` incluye `web` o `email` | `/herramientas/#formularios` en los dos |
| `ficha-google`: ficha de Google completa y al día | todos | `web=solo-ficha`, `nada` o `antigua` | `/herramientas/#ficha-google` en los dos |
| `web-nueva`: una web que puedas cambiar tú | todos | `web=nada` o `antigua` | `/plantillas/` / `plantillas-sector` |
| `informe-web`: saber qué falla en la web que ya tienes | todos | `web=al-dia` | `/herramientas/#informe` en los dos |
| `resenas`: pedir la reseña sola tras la visita | todos | `resenas=nunca` o `a-veces` | — |
| `documentacion`: que el cliente mande sus papeles a un sitio ordenado, no por WhatsApp | todos (texto por sector) | `dolor=papeles` | — |
| `cobros`: facturas y recordatorios de cobro automáticos | todos | `dolor=cobros` | `/#servicios` en los dos |
| `clientes-nuevos`: aparecer cuando te buscan | todos | `dolor=clientes` | `/#servicios` en los dos |

- **«No lo sé» no dispara nada** (`fuera=no-se`, `web=no-se`). Si con eso
  salen menos de 3 mejoras, el hueco lo llena `relleno`.
- **`dolor=agenda` no se puede combinar con `reserva=sin-cita`**: la opción
  no sale (3.1). Si llega por URL, `decodificar` la descarta (3.5). Aunque
  llegara a `diagnosticar`, las exclusiones de abajo ya quitan las mejoras de
  reserva que esa respuesta dispararía.
- **Exclusiones por respuesta** (D-013). El diagnóstico nunca propone una
  mejora que contradiga una respuesta. Van como lista de datos
  (`exclusiones`: condición sobre una respuesta + mejoras que quita), no como
  `if` sueltos, y valen para las reglas y para el relleno:
  - `reserva=online`: no salen `reservas-online` ni `reservas-directas`,
    aunque `dolor=agenda` o `canales` incluya `plataformas` las dispararían;
  - `reserva=sin-cita`: tampoco salen `reservas-online` ni `reservas-directas`
    (en `rural`, «no trabajamos con reserva»).
- **`relleno` por sector** (primeras de la lista primero; tiene más de 3 para
  que, saltando las excluidas, nunca salgan menos de 3 mejoras):
  - `dental`: `reservas-online`, `resenas`, `asistente`, `ficha-google`,
    `formularios`;
  - `rural`: `reservas-directas`, `resenas`, `ficha-google`, `asistente`,
    `web-nueva`;
  - `despachos`: `documentacion`, `formularios`, `asistente`, `resenas`,
    `ficha-google`;
  - `otro`: `ficha-google`, `resenas`, `asistente`, `formularios`,
    `web-nueva`.
  Las dos últimas de cada lista son borrador para P-03.

### 3.5 La URL

- Formato: `?v=1&s=dental&canales=tel,wa&reserva=llamando&fuera=sin-contestar&web=solo-ficha&resenas=nunca&dolor=agenda`.
- La query que se genera **siempre lleva `v` y `s`**, también en una página
  de sector.
- `v=1` es la versión. Si un día cambian preguntas o códigos, se sube a `v=2`
  y `decodificar` sigue entendiendo `v=1`, aunque sea ignorando lo que ya no
  existe. Nunca se reutiliza un código para otra cosa.
  - Sin `v`, se trata como `v=1`.
  - Con una `v` desconocida, se ignora la query entera.
- **Validación de códigos.** Un valor solo vale si está en la lista de
  códigos de su pregunta: `Map`, `Set` o `Object.hasOwn`, nunca
  `objeto[valor]` a secas. Así `?reserva=constructor` o `__proto__` no
  devuelven una función del prototipo.
- En `canales`, los códigos repetidos se cuentan una vez y el orden de la URL
  no importa.
- **Al abrir una página con query**:
  - completa y válida: se ve el resultado directamente.
    - El salto a `#diagnostico` se hace **después** de que la cortina de
      entrada se haya retirado (`esperarCortina()` de `Preloader.tsx`, que
      se resuelve con `PRELOADER_GONE_EVENT`), o en el acto si la cortina
      no sale. Se hace con Lenis y cuando el resultado ya está pintado.
    - Mientras tanto el `body` está en `overflow:hidden` y el salto se
      perdería. `PRELOADER_DONE_EVENT` no sirve: llega al contar 100, ~1 s
      antes de que se quite el `overflow:hidden`.
  - incompleta: se ve la primera pregunta sin responder, con las anteriores
    marcadas;
  - con valores desconocidos o basura: se ignoran esos valores y la página
    nunca falla.
- La query solo se escribe en la barra de direcciones al llegar al resultado
  (`history.replaceState`, sin recargar), para que «copiar enlace» y el botón
  Atrás del navegador se comporten bien. Mientras se responde no se toca.
- **URL canónica de un diagnóstico compartido**:
  `<origen><basePath>/sectores/<slug>/?…#diagnostico` si el sector tiene
  página; `<origen><basePath>/?…#diagnostico` con `s=otro`.
- **Lectura de la query en cliente.** Es export estático. Leerla con
  `useSearchParams` exige un límite `Suspense`; leer `window.location.search`
  en un efecto no lo exige. Antes de elegir, el implementador lee la guía de
  Next 16 en `node_modules/next/dist/docs/` (hace falta `npm ci` en el
  worktree). Lo prerrenderizado (la primera pregunta) no puede depender de
  la query.

**Slugs de las páginas de sector (D-009).** No se pueden cambiar después,
porque van en enlaces que ya se habrán mandado.

| Código `s` | Slug | Nombre en la página |
|---|---|---|
| `dental` | `clinicas-dentales` | Clínicas dentales |
| `rural` | `alojamientos-rurales` | Casas, apartamentos y hoteles rurales |
| `despachos` | `asesorias-y-despachos` | Asesorías y despachos |

La ruta `src/app/sectores/[slug]/page.tsx` tiene:

- `generateStaticParams` con esos tres slugs;
- `export const dynamicParams = false`, porque el export estático no admite
  rutas dinámicas sin él;
- `generateMetadata`, con `params` como Promise, como pide Next 16.

### 3.6 Prerrelleno de la auditoría (D-004)

- `aRespuestasAuditoria(sector, respuestas)` devuelve
  `{ respuestas: Record<"P2"|…, string>, sector?: string }`, con los textos
  de 3.1.
- `mezclarConBorrador(borrador, prerrelleno)` hace esto, campo por campo:
  - rellena las P y el `contacto.sector` cuyo valor está vacío o en blanco;
  - si el valor ya es idéntico al del prerrelleno (el mismo enlace abierto
    dos veces), no lo cuenta ni como puesto ni como saltado;
  - si tiene otro texto, no lo toca y lo cuenta como saltado.

  Devuelve `{ respuestas, contacto, puestas, saltadas }`.
- **Se hace en el mismo efecto que hoy carga el borrador**
  (`FormularioAuditoria.tsx`, el `useEffect` que lee `undertactics:auditoria:v1`):
  - la mezcla se hace con lo recién leído de `localStorage`, no con el
    estado de React, que en ese momento aún está vacío;
  - la query se lee una sola vez y se guarda en una `ref`, para que el doble
    montaje de StrictMode en `next dev` no aplique la mezcla dos veces ni la
    pise con el borrador viejo;
  - el efecto tiene que ser idempotente.
- Si `puestas > 0`, sale un aviso arriba del formulario, en el estilo del de
  «tenías un borrador»: «Hemos puesto 5 respuestas de tu diagnóstico rápido.
  Revísalas y cámbialas si no cuadran.». Si `saltadas > 0`, añade «Las que
  ya habías escrito no las hemos tocado.».
- Los parámetros del diagnóstico se quitan de la URL (`replaceState`)
  **después** de que el borrador con lo prerrellenado se haya guardado. Así
  recargar no vuelve a poner una respuesta que la persona haya borrado a
  propósito.
- El borrador se guarda como siempre, con lo prerrellenado dentro. No cambia
  la clave `undertactics:auditoria:v1` ni el formato.
- No se detecta si la auditoría «ya se envió» en una visita anterior: no hay
  rastro de eso y no se añade almacenamiento nuevo (apartado 4). Abrir el
  enlace otra vez después de enviar empieza una auditoría nueva prerrellenada,
  igual que si se entrara de nuevo.

### 3.7 Portada

- Sección nueva `<Diagnostico />` con `id="diagnostico"`, justo antes de
  `<Auditoria />`.
- Encabezado del estilo de las demás secciones: «Diagnóstico rápido · un
  minuto», sin número de preguntas.
- Lleva el componente con la pregunta `s` y, debajo, la fila «Por sector»:
  tres enlaces a `/sectores/<slug>/` y uno a `/sectores/`.
- El menú no cambia (D-005).

### 3.8 Páginas de sector

`/sectores/` es un índice corto: titular, una frase y las tres tarjetas, con
enlace a cada una.

`/sectores/<slug>/` lleva, en este orden:

1. **Cabecera**:
   - etiqueta del sector;
   - titular sobre el problema, no sobre nosotros;
   - entradilla;
   - dos botones: «Haz el diagnóstico» (`#diagnostico`) y «Auditoría gratis».
2. **Problemas del sector**: 3 o 4, cada uno con título y un texto concreto
   del sector. No vale un texto que sirva cambiando el nombre del sector.
3. **Lo que haríamos**: de 4 a 6 mejoras del mismo catálogo del diagnóstico,
   elegidas en `sectores.ts`. Así lo que promete la página y lo que da el
   diagnóstico no se contradicen.
4. **Diagnóstico**, con el sector fijado, `id="diagnostico"`.
5. **Asistente**, `id="asistente"`:
   - una conversación de ejemplo fija, de 6 a 10 mensajes, con aspecto de
     chat;
   - encima, la etiqueta «Ejemplo · negocio inventado».
   - Solo puede enseñar lo que `recepcionista-ia` hace hoy (D-008):
     - **`dental`**: pedir cita con horas reales, datos mínimos, resumen y
       confirmación. Ante una urgencia («me duele mucho y tengo la cara
       hinchada»), pasa a una persona y no diagnostica. Ver
       `recepcionista-ia/src/clients/clinica-demo.json` y el guion de
       pruebas de su README.
     - **`rural`** y **`despachos`**: responder preguntas frecuentes y
       recoger un contacto para que llame una persona. **No** consultar
       disponibilidad ni reservar, porque ese motor solo tiene citas.
   - Los nombres, las direcciones y los teléfonos de la conversación son
     inventados y no pueden parecer reales: «Clínica Dental Demo», teléfono
     `981 000 000`.
   - Si el widget real del asistente (rama `feat/chatbot`) está activo, sale
     también en estas páginas, como en toda la web. Hablan de cosas
     distintas: el widget es el asistente de Undertactics y el bloque es el
     ejemplo de una clínica inventada. Por eso el bloque dice «Así
     contestaría el asistente de una clínica» y no «pruébalo».
6. **Plantillas del sector**, `id="plantillas-sector"` (distinto del
   `#plantillas` de la portada): las tarjetas de `TarjetaPlantilla` de los
   slugs de `sectores.ts`. El texto que dice que son ficticias es el mismo que en
   `/plantillas/`. Si la lista está vacía o ningún slug existe en el
   catálogo, el bloque no sale entero, ni su título (D-007, P-01).
   - `rural`: `hotel-rural`.
   - `despachos`: `abogados-trinquete`, `abogados-portico`,
     `abogados-contraluz`, más las de asesoría si se resuelve P-02.
   - `dental`: ninguna por ahora.
7. **Cierre**: llamada a la auditoría, como `CtaFinal`.

**Metadatos**: `title` del tipo «Webs y automatización para clínicas
dentales — Undertactics», `description` propia y
`robots: { index: false, follow: false }`, igual que `/auditoria/`.

### 3.9 Aspecto

- Se usan los componentes y las fichas de la web: `Boton`, `Etiqueta`,
  `Enlace`, `TarjetaPlantilla`, `container-max`, `font-mono-label`,
  `--space-section`.
- El cursor propio, Lenis, la cortina y el aviso de cookies ya los pone el
  layout. No se añade nada de eso.
- Las animaciones nuevas tienen que respetar `prefers-reduced-motion`.
- **Sin JS**: el componente lleva un `<noscript>` con un párrafo y un enlace
  a la auditoría.
  - No se promete más. Hoy la web entera no funciona sin JS, porque la
    cortina de entrada (`Preloader`) se pinta en el HTML y solo la quita el
    JS.
  - Arreglar eso afecta a todo el layout y queda fuera de esta spec.

## 4. Datos

No hay tablas, migraciones ni almacenamiento nuevos.

- El diagnóstico no guarda nada: ni `localStorage` ni cookies.
- Lo único que se guarda es lo que ya guardaba la auditoría: su borrador, con
  lo prerrellenado dentro, y su envío a la Edge Function, igual que hoy.

## 5. Seguridad, privacidad y legal

- **No se recoge ningún dato.**
  - Las respuestas viven en la memoria de la página y en la URL.
  - La URL puede quedar en el historial y en los registros de GitHub Pages.
    Por eso no hay texto libre (D-002): ahí solo hay códigos de sector y de
    hábitos, nada que identifique a nadie.
- **`/privacidad/` no cambia en lo que se recoge.** Se añade una línea:
  «El diagnóstico rápido no envía ni guarda tus respuestas; solo pasan a la
  auditoría si pulsas el botón, y ahí aplica lo de arriba.». El aviso de
  cookies no cambia.
- **Seguridad del prerrelleno.** Los valores de la query solo se usan para
  buscar códigos conocidos. El texto que llega al formulario sale siempre de
  `diagnostico.ts`, nunca de la URL. Así nadie puede inyectar texto en la
  auditoría de otra persona con un enlace preparado.
- **Nada falso.**
  - Plantillas: solo las ficticias del catálogo, marcadas (D-007).
  - Conversación: marcada como ejemplo, con datos inventados que no parecen
    reales.
  - Ninguna cifra inventada sobre resultados («+40 % de reservas») ni sobre
    el sector, salvo que tenga fuente citada en la página.
- **Dental y salud.** El ejemplo del asistente nunca da consejo clínico. Ante
  una urgencia deriva a una persona, igual que hace el motor real.

## 6. Casos límite

- Query con `s` desconocido en la portada: se pregunta el sector como si no
  hubiera `s`.
- Query con `s` distinto del de la página de sector: manda la página y el `s`
  se ignora.
- `canales` vacío o con todos los códigos desconocidos: la pregunta cuenta
  como no respondida.
- Un código que solo vale en `rural` (`plataformas`) llega en otro sector: se
  ignora.
- Con menos de 3 mejoras disparadas (p. ej. `fuera=no-se`, `web=no-se`,
  `resenas=siempre`, sin canales que disparen), se completa con `relleno`.
  Nunca sale un resultado vacío ni con menos de 3.
- `dolor=agenda` con `reserva=sin-cita` por URL: `dolor` se ignora y cuenta
  como no respondida.
- Prerrelleno con un borrador que ya tiene P7 escrita: P7 no se toca y cuenta
  en `saltadas`. Si lo escrito es idéntico al prerrelleno, no cuenta en
  ninguna de las dos.
- La persona vuelve a `/auditoria/` sin query después del prerrelleno: el
  borrador ya lo lleva, así que no pasa nada nuevo.
- `localStorage` bloqueado (ventana privada): el prerrelleno funciona igual
  para esa visita. Solo se pierde el borrador, como hoy.
- Un slug de plantilla en `sectores.ts` que ya no está en el catálogo: se
  ignora en silencio, y el test de 7 lo detecta.
- Una ruta `/sectores/<slug>/` que no existe: la 404 de la web (export
  estático).
- `basePath` en Pages: todos los enlaces internos van con `Link` o
  `NEXT_PUBLIC_BASE_PATH`, y la URL copiada incluye el prefijo.
- Móvil a 360 px: opciones a ancho completo, sin scroll horizontal. Las
  burbujas del chat no desbordan.

## 7. Pruebas

**Tests de lógica.** El repo no tiene ejecutor de tests y no se añaden
dependencias. Se usa `node --test --experimental-strip-types` (Node 22),
desde un script `"test"` en `package.json`. La revisión lo comprobó con Node
22.17, y para que funcione hacen falta tres cosas:

- **Imports relativos con extensión `.ts`**, sin `@/`. Vale para
  `src/lib/diagnostico.ts`, `src/content/diagnostico.ts`,
  `src/content/sectores.ts` y el test. Sin extensión, Node da
  `ERR_MODULE_NOT_FOUND`.
- **`"allowImportingTsExtensions": true`** en `tsconfig.json`. Si no, `tsc`
  da el error TS5097. Se puede porque `noEmit` ya es `true`. Ojo: la carpeta
  principal (`feat/chatbot`) tiene `tsconfig.json` modificado sin commitear.
- **Los tipos se importan con `import type`.** Si no, Node falla con «does
  not provide an export named…».
- Sin enums, namespaces ni parameter properties, que strip-types no admite.

`npm test` se pasa **en local**: el CI despliega con Node 20, que no tiene
strip-types, y no se cambia el workflow.

Lo que tienen que comprobar:

- **Recorrido exhaustivo.** Todas las combinaciones de respuestas válidas de
  cada sector y contexto dan entre 3 y 5 mejoras, sin repetir, todas
  aplicables al sector y con `porque` no vacío.
  - Son unas 320.000 por contexto, contando los subconjuntos de `canales`.
  - Van en **un solo `test()`** que recorre un bucle y junta los fallos, no
    en subtests.
- **Enlaces.** Todo enlace de mejora, una vez resuelto, está en una lista
  blanca: `/plantillas/`, `/auditoria/`, `/#servicios`, y
  `/herramientas/#<id>` con un `id` que existe en `herramientas.ts`. Las
  anclas `#asistente` y `#plantillas-sector` solo valen en contexto
  `"sector"`, y la segunda solo si el bloque existe.
- **Plantillas.** Todo slug de plantilla de `sectores.ts` existe en
  `plantillas.ts`.
- **URL.** `codificar` → `decodificar` devuelve lo mismo para todas las
  combinaciones. Además, una muestra de casos que no lanzan error y dan lo
  que dice 3.5:
  - queries incompletas o mezcladas;
  - `canales` repetidos y desordenados;
  - basura, `v` desconocida o sin `v`;
  - `constructor`, `__proto__` y `toString` como valores.
- **Textos para la auditoría.** `aRespuestasAuditoria` solo produce claves P
  que existen en `auditoria.ts`, nunca copia texto de la query, y todas sus
  frases acaban en « (del diagnóstico rápido)».
- **Mezcla con el borrador.** `mezclarConBorrador` no pisa nunca una P ni un
  `contacto.sector` con texto. Los recuentos `puestas` y `saltadas` cuadran,
  también con valores idénticos al prerrelleno.

**Comprobación en navegador**, con Playwright, a 390 px y a 1440 px. Con
Lenis, el scroll se hace con `mouse.wheel`, no con `scrollTo`.

- Portada: responder las 7 preguntas, ver de 3 a 5 mejoras y que la URL lleve
  la query.
- Abrir esa URL en una pestaña nueva: el resultado sale directamente.
- «Llevar a la auditoría», en build (`out/`) y también en `next dev`, por el
  doble montaje de StrictMode:
  - aviso con el número de respuestas puestas;
  - P7, P14, P35 y «A qué os dedicáis» rellenos, y que sigan rellenos;
  - la URL de `/auditoria/` sin parámetros después;
  - recargar no los vuelve a poner si se han borrado.
- Un diagnóstico de la portada con `s=dental`: «Copiar enlace» da la URL de
  `/sectores/clinicas-dentales/`, y al abrirla el resultado sale después de
  la cortina, con la página ya en `#diagnostico`.
- Con un borrador previo que tiene P7 escrita: P7 intacta y el aviso dice que
  no se ha tocado.
- Las tres páginas de sector:
  - el diagnóstico no pregunta el sector;
  - `#asistente` lleva la etiqueta «Ejemplo»;
  - el bloque de plantillas sale en `rural` y `despachos`, y no existe en
    `dental`.
- En el HTML de `out/`, el componente del diagnóstico lleva su `<noscript>`
  con el enlace a la auditoría.
- Las páginas nuevas llevan `noindex`.

**Hecho cuando**:

- `npm run lint`, `npm run build` y `npm test` pasan.
- Todo lo de arriba se cumple.
- Álvaro ha revisado los textos (P-03).

## 8. Pendientes

- **P-01** · Plantilla dental ficticia. No bloquea: el bloque sale solo
  cuando exista.
- **P-02** · Alta en el catálogo de las plantillas de asesoría. No bloquea.
- **P-03** · Revisión de textos por Álvaro. Bloquea la publicación, no la
  implementación. Comprobar en especial que ninguna mejora prometa lo que el
  asistente aún no hace (recordatorios, WhatsApp) y que las marcas « (del
  diagnóstico rápido)» se lean bien en el informe.

**Coordinación con otras ramas.** `feat/chatbot` (carpeta principal, con
cambios sin commitear) y `feat/en-persona` también tocan
`src/app/page.tsx`, `src/app/privacidad/page.tsx`, `tsconfig.json` y la portada. El conflicto
será de pocas líneas, pero la tarea que añada la sección a la portada tiene
que mirar en qué orden se mergean.
