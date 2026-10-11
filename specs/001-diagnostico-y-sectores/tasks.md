# 001 · Tareas · Diagnóstico rápido y páginas por sector

Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md)

## Cómo trabajar estas tareas

- **Antes de empezar, lee**:
  - la spec entera;
  - el plan: «Punto de partida» y las decisiones PD-1 a PD-11 (una PD manda
    sobre la spec donde la corrige, p. ej. PD-2 sobre el §3.5);
  - `AGENTS.md`: Next 16 no es el que conoces, así que lee la guía de
    `node_modules/next/dist/docs/` que toque antes de escribir rutas,
    metadatos o lectura de la query.
- **Ramas (PD-1)**:
  - cada tarea en su worktree, con rama propia (`feat/diag-tNN-…`) desde
    `feat/diagnostico-sectores`;
  - la PR va **contra `feat/diagnostico-sectores`**. Nunca contra `main`,
    porque `main` publica en Pages;
  - no cambies de rama en la carpeta principal (`subcon-works-web`, en
    `feat/chatbot` con cambios sin commitear).
- **Una tarea = un commit** (o pocos, de la misma tarea). Solo tus
  ficheros.
- **Tienen que pasar**, en el worktree y tras `npm ci`: `npm run lint`,
  `npm run build` y `npm test` (desde T01).
- **No hay migraciones** ni almacenamiento nuevo.
- **Reglas que más se olvidan**:
  - **Imports.** `src/lib/diagnostico.ts`, `src/content/diagnostico.ts`,
    `src/content/sectores.ts` y los tests se importan entre sí con ruta
    relativa y extensión `.ts`, y los tipos con `import type`. Sin `@/`, sin
    `process.env`, sin enums, sin namespaces y sin parameter properties.
  - **Códigos.** Se validan con `Map`/`Set`/`Object.hasOwn`, nunca con
    `objeto[valor]`.
  - **Enlaces internos** con `Link` o `withBasePath`; nunca un `href="/…"`
    a pelo en un `<a>`.
  - **Noindex** en toda página nueva:
    `robots: { index: false, follow: false }`.
  - **Copy de capacidad**, no de condiciones. Nada falso: ni cifras sin
    fuente ni plantillas que no sean del catálogo. El asistente **no** manda
    recordatorios ni atiende WhatsApp: ningún texto lo puede dar a entender.
  - **Animaciones.** Las nuevas respetan `prefers-reduced-motion`. No se
    añade cursor, Lenis, cortina ni aviso de cookies: ya los pone el layout.
  - **Contenido que cambia** (pregunta ↔ resultado) sin `data-reveal`:
    `useReveal` lo dejaría oculto.

## Base

- [x] **T01 · Rama de integración y ejecutor de tests.**
  - *Cubre*: spec §7 (ejecutor), PD-1, PD-8.
  - *Hacer*:
    - en el worktree `subcon-works-web-diagnostico`: `git fetch`, rebasar
      `spec/diagnostico-sectores` sobre `origin/main` y crear
      `feat/diagnostico-sectores` desde ahí; subirla;
    - en `package.json`, script
      `"test": "node --test --experimental-strip-types \"src/**/*.test.ts\""`;
    - en `tsconfig.json`, `"allowImportingTsExtensions": true`;
    - un test mínimo en `src/lib/diagnostico.reglas.test.ts`
      (`import { test } from "node:test"`) que importe un `src/lib/diagnostico.ts`
      casi vacío con `.ts`, para probar la cadena entera.
  - *Hecho*:
    - `git log origin/main..feat/diagnostico-sectores` enseña solo los
      commits del SDD y este;
    - `npm test` pasa con Node 22.17 en Windows;
    - `npm run build` y `npm run lint` pasan (sin error TS5097).

## Lógica y contenido

T02, T03, T04 y T05 añaden a los mismos dos ficheros
(`src/content/diagnostico.ts` y `src/lib/diagnostico.ts`): **van en serie**.
Cada una tiene su fichero de test (PD-8).

- [x] **T02 · Preguntas, códigos y sectores.**
  - *Cubre*: spec §3.1, §3.2 (total de preguntas), §3.4 (`dolor=agenda`
    con `sin-cita`), §6.
  - *Hacer*, en `src/content/diagnostico.ts`:
    - tipos `Sector`, `Clave` (`s`, `canales`, `reserva`, `fuera`, `web`,
      `resenas`, `dolor`), `Respuestas`, `Contexto`
      (`"portada" | "sector"`);
    - las 7 preguntas, con tipo `una`/`varias`, opciones `{ codigo,
      etiqueta: { base, dental?, rural?, despachos? }, soloEn?: Sector[] }`
      y la etiqueta de la pregunta por sector («cita» / «reserva» / «primera
      consulta»);
    - el nombre de cada sector, en dos formas: para el resultado («Lo que
      haríamos en tu clínica dental») y para `contacto.sector` («Clínica
      dental»).

    En `src/lib/diagnostico.ts`:
    - `preguntasPara(sector | undefined, contexto)`: 7 en la portada y 6 en
      un sector; filtra `soloEn`;
    - `opcionesPara(clave, sector, respuestas)`: quita `agenda` si
      `reserva=sin-cita`;
    - `respuestaValida(clave, valor, sector, respuestas)`.
  - *Tests* (en `diagnostico.reglas.test.ts`):
    - totales 7 y 6;
    - `plataformas` solo sale en `rural`;
    - `agenda` desaparece con `sin-cita`;
    - `respuestaValida("reserva", "constructor", …)` es `false`.
  - *Hecho*: tests en verde; ningún texto lleva el número de preguntas
    escrito.

- [x] **T03 · Mejoras, reglas, relleno y `diagnosticar`.**
  - *Cubre*: spec §3.3 (contenido de cada mejora), §3.4, §5 («Nada falso»),
    PD-5.
  - *Hacer*:
    - en `src/content/diagnostico.ts`:
      - el catálogo de 11 mejoras de la tabla del §3.4, con `titulo`,
        `queResuelve`, `enlace?: { portada?, sector? }` y `sectores`;
        `documentacion` con texto por sector;
      - las reglas en forma PD-5, con un `porque` por disparador;
      - el `relleno` por sector y el porqué genérico de cada sector.
    - en `src/lib/diagnostico.ts`:
      - `diagnosticar(sector, respuestas, contexto, { hayPlantillas })`, con
        los 4 pasos del §3.4;
      - `resolverEnlace(enlace, contexto, hayPlantillas)`, que resuelve
        `"plantillas-sector"`.
    - Redacta textos definitivos: los revisa Álvaro en T15 (P-03). Ninguno
      promete recordatorios ni WhatsApp del asistente.
  - *Tests* (`diagnostico.reglas.test.ts`):
    - el **recorrido exhaustivo** de la spec §7, en un solo `test()` con
      bucle que junta los fallos, para los dos contextos y con
      `hayPlantillas` según el sector;
    - todo código citado en una regla existe en su pregunta;
    - el test de **enlaces** con la lista blanca del §7, leyendo los ids de
      `herramientas.ts`;
    - `fuera=no-se`, `web=no-se` y `resenas=siempre` sin canales que
      disparen: sale el relleno.
  - *Hecho*:
    - tests en verde;
    - el recorrido tarda menos de 60 s en local (si tarda más, dilo en la
      PR).

- [ ] **T04 · La URL: `codificar`, `decodificar`, `urlCanonica`.**
  - *Cubre*: spec §3.5 (salvo lo de cliente, que va en T09).
  - *Hacer*, en `src/lib/diagnostico.ts`:
    - `codificar(sector, respuestas)`: siempre lleva `v=1` y `s`; `canales`
      deduplicado y en el orden de la pregunta;
    - `decodificar(search, sectorFijado?)`:
      - sin `v` se trata como 1 y con `v` desconocida no devuelve nada;
      - ignora códigos desconocidos y los `soloEn` de otro sector;
      - ignora `dolor=agenda` con `sin-cita`;
      - el sector fijado gana a `s`;
      - devuelve `{ sector?, respuestas, completa, primeraSinResponder }`;
    - `urlCanonica(sector, respuestas, origen, basePath)`: página del sector
      con `#diagnostico`, o la portada con `s=otro`.

    El mapa código → slug sale de D-009. Si `sectores.ts` aún no existe, va
    como constante en `content/diagnostico.ts` y T06 la importa de ahí.
  - *Tests* (`diagnostico.url.test.ts`): round-trip de todas las
    combinaciones, más la muestra del §7 (incompletas, mezcladas, `canales`
    repetidos y desordenados, basura, `v=2`, sin `v`, `constructor`,
    `__proto__`, `toString`).
  - *Hecho*: tests en verde; ninguna entrada lanza error.

- [ ] **T05 · Paso a la auditoría: `aRespuestasAuditoria` y `mezclarConBorrador`.**
  - *Cubre*: spec §3.1 (textos prerrellenados), §3.6 (las dos funciones),
    §5 (seguridad del prerrelleno), D-004, D-010.
  - *Hacer*:
    - en `src/content/diagnostico.ts`: una frase por opción y por P, acabada
      en « (del diagnóstico rápido)». P7 sin orden («Por estos canales, sin
      orden: …»). P12 y P14 con `sin-cita`. `contacto.sector` sin marca. Las
      `no-se` no producen nada;
    - en `src/lib/diagnostico.ts`:
      - `aRespuestasAuditoria(sector, respuestas)`;
      - `mezclarConBorrador<C extends { sector: string }>(borrador:
        { respuestas, contacto: C }, prerrelleno)`, que devuelve
        `{ respuestas, contacto, puestas, saltadas }` con las reglas del
        §3.6 (vacío o en blanco → pone; idéntico → no cuenta; otro texto →
        salta).
  - *Tests* (`diagnostico.auditoria.test.ts`):
    - solo claves P que existen en `bloques` de `auditoria.ts`;
    - todas las frases acaban en la marca;
    - con valores-trampa en la query, ningún texto de salida contiene esa
      cadena;
    - la mezcla no pisa nunca un texto, y los recuentos cuadran con valores
      idénticos, vacíos y en blanco.
  - *Hecho*: tests en verde.

- [ ] **T06 · Contenido de las páginas de sector (`sectores.ts`).**
  - *Cubre*: spec §3.8 (contenido), D-006, D-007, D-008, D-009.
  - *Hacer*: `src/content/sectores.ts`, con una entrada por sector:
    - `codigo`, `slug` (D-009, sin tocar) y nombre;
    - etiqueta, titular, entradilla y metadatos (`title`, `description`);
    - 3-4 problemas propios del sector (que no valgan cambiando el nombre);
    - 4-6 ids de mejoras del catálogo;
    - `conversacion: { de: "cliente" | "asistente"; texto }[]`, de 6 a 10
      mensajes;
    - `plantillas: string[]`.

    La conversación:
    - `dental`: imita `C:\Users\alvar\Desktop\Proyectos\recepcionista-ia\src\clients\clinica-demo.json`
      y el guion del README de ese repo: cita con horas, datos mínimos,
      resumen y confirmación, y una urgencia que pasa a una persona sin
      diagnosticar;
    - `rural` y `despachos`: preguntas frecuentes más recogida de contacto.
      Sin disponibilidad ni reservas;
    - datos inventados que no parezcan reales («Clínica Dental Demo»,
      `981 000 000`).

    Plantillas: `rural` → `hotel-rural`; `despachos` → las tres de abogados;
    `dental` → `[]`. Necesita leer un repo fuera de este: **tarea local**,
    no en la nube.
  - *Tests* (`src/content/sectores.test.ts`):
    - todo slug de plantilla existe en `plantillas.ts`;
    - toda mejora existe en el catálogo y aplica al sector;
    - 3 slugs y los de D-009 exactos;
    - de 6 a 10 mensajes por conversación.
  - *Hecho*: tests en verde.

## Cortina y scroll

- [x] **T07 · Fin de la cortina y salto con Lenis.**
  - *Cubre*: PD-2, PD-3, spec §3.5 (salto).
  - *Hacer*:
    - `Preloader.tsx`: `PRELOADER_GONE_EVENT`, variable del módulo
      `cortinaEnCurso` y `esperarCortina()`, como dice PD-2. No muevas
      `PRELOADER_DONE_EVENT`. Respeta los comentarios
      `eslint-disable` que ya hay (los toca también `feat/chatbot`);
    - `useLenis.ts`: `getLenis()`;
    - `src/lib/irAAncla.ts`: `irAAncla(el)`.
  - *Tests*: sin tests de Node (dependen del DOM). Se comprueba en T14.
  - *Hecho*:
    - lint y build en verde;
    - en `next dev`, en frío (sessionStorage vacío), un
      `esperarCortina().then(() => irAAncla(document.getElementById("auditoria")))`
      desde la consola de la portada baja a Auditoría **después** del
      obturador;
    - con la sesión ya vista, baja en el acto.

## Componente

- [ ] **T08 · `Diagnostico`: las preguntas.**
  - *Cubre*: spec §3.2, §3.9 (aspecto, sin JS), §6 (360 px), PD-6.
  - *Depende de*: T02.
  - *Hacer*: `src/components/diagnostico/Diagnostico.tsx` (cliente) y
    `PasoPregunta.tsx`.
    - Props: `{ contexto: Contexto; sector?: Sector; hayPlantillas?: boolean }`.
    - Una pregunta por pantalla, con «n de N» y barra de progreso. N sale de
      `preguntasPara`.
    - Las de una opción avanzan al tocar. Las de varias, con «Seguir», que
      se activa con al menos una marcada.
    - «Atrás» mantiene lo marcado.
    - El foco va al título de la pregunta nueva (`tabIndex={-1}`).
    - Opciones a ancho completo en móvil.
    - Lleva el `<noscript>` del §3.9.
    - Imita los botones y las etiquetas de `Boton`, `Etiqueta` y el
      `Progreso` de `FormularioAuditoria.tsx`.
    - El resultado queda como un marcador (`Resultado` vacío) hasta T09.
  - *Hecho*:
    - en `next dev`, montado en una página temporal que **no** se commitea,
      se responden 7 preguntas con `contexto="portada"` y 6 con un sector;
    - el teclado llega a todo;
    - el `<noscript>` está en el HTML de `out/`.

- [ ] **T09 · `Diagnostico`: resultado, acciones y URL.**
  - *Cubre*: spec §3.3, §3.4 (uso), §3.5 (cliente), PD-4, PD-10.
  - *Depende de*: T03, T04, T07, T08.
  - *Hacer*: `Resultado.tsx` y el resto de `Diagnostico.tsx`.
    - **El resultado**:
      - título con el nombre del sector, y de 3 a 5 mejoras (título, qué
        resuelve, porqué en cursiva y más pequeño, enlace resuelto);
      - la línea única «Esto lo podemos montar nosotros o cualquier agencia
        que sepa hacerlo»;
      - las tres acciones: auditoría con `Link` a
        `/auditoria/?<codificar>`; copiar la `urlCanonica` con
        `window.location.origin` y `NEXT_PUBLIC_BASE_PATH` (si falla el
        portapapeles, un campo de solo lectura con la URL seleccionada);
        «Cambiar respuestas» (vuelve a la primera con todo marcado y
        `replaceState` sin query).
    - **Al llegar al resultado**: `history.replaceState` con la query.
      Mientras se responde, la URL no se toca.
    - **Al montar** (PD-4): `decodificar(location.search, sector)`.
      - Completa: el resultado directamente, y luego
        `await esperarCortina()`, doble `requestAnimationFrame`,
        `ScrollTrigger.refresh()` e `irAAncla(#diagnostico)`.
      - Incompleta: la primera sin responder, con lo anterior marcado.
    - PD-10: un `ResizeObserver` que llama a `ScrollTrigger.refresh()`, con
      espera de 150 ms.
  - *Hecho*:
    - en `next dev`, responder lleva al resultado y la URL cambia;
    - pegar esa URL en otra pestaña abre el resultado y baja tras la
      cortina;
    - una query a medias abre en la pregunta que falta;
    - `?reserva=__proto__` no rompe nada.

## Páginas

- [ ] **T10 · `ChatEjemplo`.**
  - *Cubre*: spec §3.8.5, §5 (dental y salud).
  - *Depende de*: T06.
  - *Hacer*: `src/components/sectores/ChatEjemplo.tsx`, que recibe la
    `conversacion` de `sectores.ts`.
    - Aspecto de chat: burbujas a izquierda y derecha, que no desbordan a
      360 px.
    - Encima, la etiqueta «Ejemplo · negocio inventado» y el título «Así
      contestaría el asistente de una clínica» (o de un alojamiento, o de un
      despacho).
    - Si anima la entrada de los mensajes, con reduced-motion salen todos de
      golpe.
    - No es interactivo: nada de «pruébalo».
  - *Hecho*: se ve bien a 360 y a 1440 px; con reduced-motion no hay
    movimiento.

- [ ] **T11 · `/sectores/` y `/sectores/[slug]/`.**
  - *Cubre*: spec §3.5 (ruta), §3.8, §3.9, D-005, D-007, PD-6, PD-7.
  - *Depende de*: T06, T09, T10.
  - *Hacer*:
    - `src/app/sectores/page.tsx`: titular, frase y tres `TarjetaSector`;
    - `src/app/sectores/[slug]/page.tsx`:
      - `generateStaticParams` con los tres slugs;
      - `export const dynamicParams = false`;
      - `generateMetadata` con `params` como Promise, `title`,
        `description` y `robots` noindex;
      - los 7 bloques del §3.8 en orden, con `id="diagnostico"`,
        `id="asistente"` e `id="plantillas-sector"`;
    - `PlantillasSector` no se pinta entero (ni el título) si no queda
      ninguna plantilla válida. Su aviso de «ficticias» copia el texto de
      `/plantillas/`;
    - el cierre es `<CtaFinal />`;
    - imita la cabecera de `src/app/plantillas/page.tsx` y `src/app/auditoria/page.tsx`.

    Lee antes la guía de rutas dinámicas y metadatos de Next 16.
  - *Hecho*:
    - `npm run build` genera `out/sectores/index.html` y las tres
      `out/sectores/<slug>/index.html`;
    - las cuatro llevan `noindex`;
    - en `clinicas-dentales` no existe `#plantillas-sector`;
    - en las tres, el diagnóstico no pregunta el sector.

- [ ] **T12 · Sección de la portada.**
  - *Cubre*: spec §3.7, D-005.
  - *Depende de*: T06, T09.
  - *Hacer*:
    - `src/components/sections/DiagnosticoRapido.tsx`: `<section
      id="diagnostico">` con el encabezado «Diagnóstico rápido · un minuto»
      (estilo de `Auditoria.tsx`), `<Diagnostico contexto="portada" />` y
      la fila «Por sector» (tres `Link` a `/sectores/<slug>/` y uno a
      `/sectores/`);
    - en `src/app/page.tsx`, la sección justo antes de `<Auditoria />`.
      Hoy eso es después de `<Compromisos …/>`.

    El menú no cambia. `feat/chatbot` también toca `page.tsx`: cambia solo
    las dos líneas (import y JSX).
  - *Hecho*:
    - la portada enseña la sección entre Compromisos y Auditoría;
    - los cuatro enlaces llevan a páginas que existen (con T11 mergeada);
    - lint y build en verde.

## Auditoría

- [ ] **T13 · Prerrelleno en el formulario y línea de privacidad.**
  - *Cubre*: spec §3.6 (componente), §5 (privacidad), D-004, PD-4, PD-11.
  - *Depende de*: T05.
  - *Hacer*:
    - en `FormularioAuditoria.tsx`, **dentro del `useEffect` que lee
      `subcon:auditoria:v1`**:
      - lee la query una vez y guárdala en una `ref`;
      - `decodificar` → `aRespuestasAuditoria` → `mezclarConBorrador`, con
        lo recién leído de `localStorage` (o vacío si no hay o si falla);
      - pon el estado y guarda `{ puestas, saltadas }` para el aviso;
      - el efecto tiene que ser idempotente;
    - en el efecto de guardado, después del `setItem` (o de su fallo), quita
      los parámetros del diagnóstico con `replaceState` si hay una marca
      pendiente. Mantén el hash y cualquier otro parámetro;
    - el aviso (PD-11), en el estilo de «Recuperado…»: «Hemos puesto N
      respuestas de tu diagnóstico rápido. Revísalas y cámbialas si no
      cuadran.», y si `saltadas > 0`, «Las que ya habías escrito no las
      hemos tocado.» No uses `display:flex` con `[hidden]`;
    - en `src/app/privacidad/page.tsx`, la línea del §5, en el apartado que
      habla de la auditoría. `feat/chatbot` reescribe esta página: añade
      solo esa línea.
  - *Hecho*:
    - en `next dev` (StrictMode) y en `out/`:
      `/auditoria/?v=1&s=dental&canales=tel,wa&reserva=llamando&fuera=sin-contestar&web=solo-ficha&resenas=nunca&dolor=agenda`
      rellena P7, P10, P14, P23, P35, P2 y el sector, avisa con el número
      correcto y deja la URL sin query;
    - recargar tras borrar P7 no la vuelve a poner;
    - con P7 escrita antes, P7 queda intacta y sale «no las hemos tocado».

## Pruebas

- [ ] **T14 · Comprobación en navegador.**
  - *Cubre*: spec §7 («Comprobación en navegador»), §6, PD-9.
  - *Depende de*: T09, T11, T12, T13 mergeadas en `feat/diagnostico-sectores`.
  - *Hacer*: un script de Playwright **fuera del repo** (scratchpad) con la
    lista entera del §7, a 390 y 1440 px.
    - Scroll con `mouse.wheel`, no con `scrollTo` (Lenis).
    - Cortina en frío: contexto nuevo, con el enganche puesto en
      `addInitScript`.
    - Sirve `out/` en un puerto propio y comprueba el `<title>` antes de
      probar (puede haber otra sesión en el puerto de siempre).
    - Haz dos pasadas: una con `out/` normal y otra con un build con
      `GITHUB_ACTIONS=true` servido bajo `/subcon-works-web/`, para ver que
      la URL copiada y los enlaces llevan el prefijo.
    - Comprueba también que no hay scroll horizontal a 360 px en las páginas
      nuevas.

    Lo que falle se arregla en su tarea (o en una PR `fix/diag-…`), no en
    esta.
  - *Hecho*: el resumen de cada punto (OK / fallo con captura) está pegado
    en la PR de integración. `npm run lint`, `npm run build` y `npm test`
    pasan sobre `feat/diagnostico-sectores`.

## Cierre

- [ ] **T15 · Textos (P-03) y PR a `main`.** *Manual, con Álvaro.*
  - *Cubre*: P-03, PD-1, spec §8 (coordinación).
  - *Hacer*:
    - junta en la descripción de la PR de integración todos los textos
      nuevos para que Álvaro los revise de una vez: catálogo de mejoras,
      porqués, frases de prerrelleno y las tres páginas con sus
      conversaciones;
    - Álvaro los corrige o los aprueba y se aplican los cambios;
    - mira si `feat/chatbot` se ha mergeado ya: si sí, rebasa y resuelve
      `page.tsx`, `privacidad`, `tsconfig.json` y `Preloader.tsx`;
    - abre la PR `feat/diagnostico-sectores` → `main`;
    - al mergear: P-03 cerrada en `DECISIONES.md`, la 001 pasa a `hecha` en
      `SDD.md` y se avisa de Ctrl+F5 por la caché de Pages.
  - *Hecho*:
    - P-03 cerrada con fecha;
    - `/sectores/clinicas-dentales/` publicado responde en Pages;
    - la fila de la 001 en `SDD.md` dice `hecha`.

La spec no cambia otras specs: no hay tarea de «Consolidar deltas».
