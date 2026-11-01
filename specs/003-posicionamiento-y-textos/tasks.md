# 003 · Tareas · Posicionamiento y textos

Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md)

## Cómo trabajar estas tareas

- **Antes de empezar, lee**:
  - la spec entera, con el Anexo A (§3.3) tal como esté;
  - del plan, el «Punto de partida», las decisiones PD-1 a PD-9 y la tabla
    de dueños (§5). Una PD manda sobre la spec donde la concreta;
  - desde T06, `textos.md` aprobado (D-033): es lo único que se copia;
  - `AGENTS.md`: Next 16 no es el que conoces. Lee la guía de
    `node_modules/next/dist/docs/` antes de tocar metadatos.
- **Esta spec cambia la 001 (§3.4, §7, §8) y la 002 (§1, §2, §3.6, §3.7,
  §3.8, §3.9, §3.11, §3.13, §4, §7, §9).** Si una tarea lee esas specs, lee
  también el apartado 8 «Cambios a otras specs» de esta: manda el delta.
- **Ramas (PD-1)**:
  - cada tarea en su worktree (`../subcon-works-web-ptNN`), con rama
    `feat/pt-tNN-…` desde `exp/consultora`;
  - la PR va **contra `exp/consultora`**, nunca contra `main` (publica en
    Pages);
  - no cambies de rama ni toques nada en `subcon-works-web` (está en `main`)
    ni en el worktree del agente de `chore/rd-comprobar-002`.
- **Una tarea = un commit** (o pocos, de la misma tarea). Solo tus ficheros
  (plan §5). Si necesitas uno de otra tarea, dilo en la PR.
- **Tienen que pasar**, en el worktree y tras `npm ci` y `npm run build`:
  - `npm run lint` y `npm test`;
  - `npm run comprobar-textos -- --solo Tnn` con tus comprobaciones
    activadas;
  - ninguna comprobación ya activa pasa a `FALLO`, y lo que estaba `OK` en
    `linea-base.md` sigue `OK` (PD-8).
- **Tests y comprobaciones**: T01 los deja escritos y pendientes. Tu tarea
  pone `pendiente: false` en los suyos y los hace pasar. No cambies los de
  otra tarea; si uno está mal escrito, dilo en la PR.
- **Textos**: se copian de `textos.md` **tal cual** (PD-9). No se mejora ni
  se recorta nada en el código. Si un texto no cabe o choca con otro, para
  y dilo en la PR.
- **Playwright** (reglas de `WEBS NEGOCIOS/CLAUDE.md`): una prueba a la vez
  (mira antes `Get-CimInstance Win32_Process -Filter
  "Name='chrome-headless-shell.exe'"`), un navegador que se cierra en
  `finally`, escala 1, sin capturas por tu cuenta. Para limpiar, mata por
  PID, nunca por nombre.
- **No hay migraciones** ni almacenamiento nuevo.
- **Reglas que más se olvidan**:
  - Nivel C (Anexo A) **no sale** en ningún sitio, ni como «próximamente».
  - Nivel B nunca en presente de producto («tenemos un agente que…»), salvo
    dentro de una maqueta rotulada «Ejemplo».
  - Capacidad, no condiciones: nada de «sin compromiso», «sin coste», «sin
    cuotas», «sin permanencia».
  - Ni «herramienta propia» ni «software propio». Ni «clientes», «casos de
    éxito» o «proyectos realizados».
  - No se tocan: el rótulo «Ejemplo» (D-019), noindex, rutas y slugs
    (D-009), la lógica del diagnóstico (D-001 a D-004, D-013) y las tres
    frases de D-014 («Lo de arriba vende. Lo de abajo trabaja.», «Montamos
    lo que se ve y lo que va debajo.», «Una plantilla de 30.»).
  - Un test que comprueba un texto viejo se **actualiza**, no se borra.
  - `next dev` reescribe un bloque de `AGENTS.md`: si sale en tu diff,
    commitéalo tal cual.

## Base

- [x] **T01 · Rama de integración, línea base y pruebas pendientes.**
  *Modelo: Sonnet 5.5 high.*
  - *Cubre*: PD-1, PD-4, PD-5, PD-8, spec §4 y §7 (forma), CA-10.
  - *Hacer*:
    - En `subcon-works-web-consultora` (rama `exp/consultora`, con la spec,
      el plan y estas tareas commiteados): `git merge main` (sin rebase),
      `git branch --unset-upstream`, `git push -u origin exp/consultora`.
    - **Línea base, antes de tocar código** (PD-8):
      `specs/003-posicionamiento-y-textos/linea-base.md` con fecha, commit y
      la salida resumida de `npm run lint`, `npm test`, `npm run build`,
      `npm run comprobar` y `node scripts/comprobar-consultora.mjs --url
      http://127.0.0.1:4302/` (con `npm run servir`), una tras otra. Una
      línea por comprobación con su `OK`/`FALLO`. Sin rutas de la máquina.
    - `scripts/comprobar-textos.mjs` según PD-4, con
      `"comprobar-textos": "node scripts/comprobar-textos.mjs"` en
      `package.json`. Imita la forma de `scripts/comprobar.mjs` (lista,
      `--solo`, `--estricto`) y reutiliza `crearServidor` de
      `scripts/servir.mjs` en el puerto 4303. Listas de arriba:
      - `FRASES_C` (CA-3): «queda vigilada cada día», «vigilada cada día»,
        «vigilancia de caídas», «avisos de caducidad», «resumen cada
        semana», «la alerta nos llega», «auditoría de la ficha», «al
        teléfono», «factura emitida», «vídeo» como servicio — cada una con
        su id (A14, A16, A19, A20, A21);
      - `EXCEPCIONES_VIGILANCIA` (CA-2) y `EXCEPCIONES_CONDICIONES` (CA-16):
        vacías, cada entrada con fichero y motivo;
      - `VIGILANCIA_EXISTE = false` (CA-2): con `true`, CA-2 no se aplica;
      - `NOMBRES` (CA-5), `CIFRAS` (CA-8) y `DIAGNOSTICO_PERMITIDO` (CA-17):
        vacías; las llena T05;
      - `SELECTORES_EJEMPLO` (CA-7): hero, maquetas de «Tecnología
        aplicada», `ChatEjemplo`, maquetas de sector y capturas de
        `/herramientas/`, cada uno con su ruta.
    - **Comprobaciones, todas `pendiente: true`**, con el `fn` ya escrito:

      | Comprobación | Parte | Tarea |
      |---|---|---|
      | CA-1 · Ni «herramienta propia» ni «software propio» | ficheros | T10 |
      | CA-2 · Sin vigilancia ni ficha de Google (salvo excepciones) | ficheros | T10 |
      | CA-3 · Frases de nivel C: 0 | ficheros | T10 |
      | CA-4 · Filas aprobadas en su fichero · ficheros de T06 | ficheros | T06 |
      | CA-4 · … · ficheros de T07 | ficheros | T07 |
      | CA-4 · … · ficheros de T08 | ficheros | T08 |
      | CA-4 · … · ficheros de T09 | ficheros | T09 |
      | CA-4 · Ninguna fila de `textos.md` sin aprobar | ficheros | T05 |
      | CA-5 · Un nombre por producto; nombres viejos: 0 | página | T10 |
      | CA-6 · Aviso de inventadas en su `<section>` y sin palabras de §3.5 · portada | página | T07 |
      | CA-6 · … · `/plantillas/` | página | T08 |
      | CA-6 · … · `PlantillasSector` | página | T09 |
      | CA-7 · Rótulo «Ejemplo» · hero y `/herramientas/` | página | T06 |
      | CA-7 · … · «Tecnología aplicada» | página | T07 |
      | CA-7 · … · `ChatEjemplo` y maquetas de sector | página | T09 |
      | CA-8 · Toda cifra en `CIFRAS`, un valor por magnitud | página | T10 |
      | CA-10 · Lint, tests y build; nada peor que la línea base | ficheros | T10 |
      | CA-12 · Una tabla por ruta del export y filas `*`; ninguna sin estado | ficheros | T05 |
      | CA-16 · Sin reclamos de condición | ficheros | T10 |
      | CA-17 · «Diagnóstico» solo en el diagnóstico rápido | página | T10 |

      El `id` de cada una empieza por el CA (`CA-4 · … · T06`), para que
      `--solo` funcione con el CA o con la tarea.
    - Marcas de PD-5 en los componentes comunes: `data-numeracion` en
      `ui/Cota.tsx` y en el «404» de `not-found.tsx`. Solo el atributo: ni
      un texto cambia.
    - **Lista «A mano»** al final de esta tarea (abajo), tal cual.
  - *Hecho*:
    - `exp/consultora` en GitHub con `main` mergeado;
    - `linea-base.md` escrito;
    - `npm run comprobar-textos` sale con código 0 y todas en `PENDIENTE`;
      con `--estricto` sale con 1;
    - `npm test` y `npm run build` igual que en la línea base.
  - **A mano** (lo mira T11 con Álvaro y lo repasa T12):
    - CA-3 (paráfrasis) y CA-13: Álvaro lee la web buscando lo que es nivel
      C dicho con otras palabras, y cada fila del Anexo está confirmada o
      corregida.
    - CA-6 (legible): el aviso de inventadas se lee sin esfuerzo y no va en
      letra menor.
    - CA-9: el hero, el titular de problemas y su cierre y las páginas de
      sector no dan por hecho WhatsApp, hojas de cálculo, programas
      desconectados ni web vieja. Álvaro lo lee como una clínica, una tienda
      y un despacho.
    - CA-11: titular, entradilla y botón de cada sección prometen lo mismo.
    - CA-14: `/privacidad/`, el formulario corto y la auditoría dicen lo que
      hace el código (A44): se comprueba contra `FormularioContacto.tsx`,
      `FormularioAuditoria.tsx` y `kit/traer-solicitudes.mjs`.
    - CA-15: cada sección de la portada lleva el rótulo de su puerta («Lo
      que ve tu cliente» o «Lo que va por debajo»), y solo uno.

## Redacción

- [x] **T02 · Anexo A completo.** *Modelo: Opus 5.5 high* — es la base legal
  de la spec (§5, Ley 3/1991).
  - *Cubre*: spec §3.2, §3.3, §5 (datos personales), PD-2.
  - *Depende de*: T01.
  - *Hacer*:
    - Lee cada fichero de la spec §2 (contenido, componentes, páginas,
      metadatos, README) y apunta **cada** frase que diga qué hace
      Undertactics, qué hay, una condición, una cifra o algo de terceros.
      Si es mucho, 2-3 agentes `Explore` (Sonnet) que devuelvan frase ·
      fichero:línea, y tú decides el nivel.
    - En `spec.md` §3.3, y solo ahí: añade la columna **estado** (todas
      `por confirmar`) y las filas nuevas en su serie (A22…, A37…, A46…).
      Una fila no mezcla niveles (§3.2 regla 1). Cada cifra que encuentres
      tiene fila, con su fuente o «sin fuente».
    - Bajo A44, una línea por formulario (corto de la portada, auditoría):
      qué datos, dónde se guardan (Supabase, mira
      `FormularioContacto.tsx`, `FormularioAuditoria.tsx` y
      `kit/traer-solicitudes.mjs`), quién los ve y cuánto tiempo. Si el
      plazo no está decidido, P nueva en `DECISIONES.md` (mira el último
      número justo antes).
    - Para cada fila «por confirmar», una pregunta corta y concreta para
      Álvaro, con la respuesta que recomiendas, en la descripción de la PR.
  - *Hecho*: cada frase de los ficheros de §2 que afirma algo está en una
    fila; ninguna fila sin nivel ni estado; la PR lleva la lista de
    preguntas.

- [x] **T03 · Álvaro confirma el Anexo A.** *Manual, con Álvaro; el chat que
  lo apunta, Sonnet 5.5 medium.*
  - *Cubre*: P-09, P-10, P-13.
  - *Depende de*: T02.
  - *Hacer*:
    - Álvaro contesta las preguntas de la PR de T02 (con AskUserQuestion,
      4 por tanda, recomendada primero) y comprueba A01, A02, A04 y A11 en
      lo que funciona hoy;
    - el chat pasa cada fila a `confirmada` o `corregida` (con el nivel
      nuevo) en §3.3;
    - en `DECISIONES.md`: D nueva «Anexo A confirmado» que cierra P-09,
      P-10 (con lo decidido sobre fases, «a tu nombre», plazos, «gratis» y
      tiempo del formulario) y P-13.
  - *Hecho*: ninguna fila `por confirmar`; P-09, P-10 y P-13 cerradas con
    fecha.

- [ ] **T04 · `textos.md`.** *Modelo: Opus 5.5 high* — redacción delicada
  (spec §5 y §10); **un solo chat** escribe este fichero.
  - *Cubre*: spec §3.1, §3.4, §3.5, §3.6, §3.7, §6 (formas cortas), PD-3.
  - *Depende de*: T03.
  - *Hacer*:
    - `specs/003-posicionamiento-y-textos/textos.md` con el formato de PD-3:
      primero la promesa (una, sin un único dolor), los nombres (tres por
      producto nivel A y por cada una de las tres puertas, con el
      recomendado y por qué; ninguno con «propio» ni «herramienta»; dos
      cosas distintas no comparten «diagnóstico») y las decisiones de
      redacción (parada del hero que sustituye a «Vigilada cada día» y de
      qué servicio de `servicios.ts` sale; la categoría «Automatizaciones e
      inteligencia artificial»; «Plantillas propias»; «Proyectos»).
    - Luego una tabla por ruta del export (`out/**/*.html`, incluido
      `404.html`), una `*` y una `README`. Cada texto pasa los seis filtros
      del §3.6; cada afirmación cita su id del Anexo en «motivo». Todo en
      estado `propuesta`.
    - Incluye: el rótulo de puerta de cada sección de la portada (§3.1,
      CA-15), el bloque de plantillas («Webs de ejemplo por sector» como
      recomendado, con el aviso dentro, §3.5), todo lo que sale por §3.7
      como `(quitar)`, la `description` de `/herramientas/`, el texto de
      `/privacidad/` según A44 y la nota del README entre
      `<!-- 003-anclas -->`.
    - Commitea al acabar cada `##`. Si el chat se va a resumir, para en un
      `##` terminado y deja el prompt para seguir (plan §6).
  - *Hecho*: `npm run comprobar-textos -- --solo CA-12` en `OK` (actívala
    solo para mirarla; la deja activa T05); cada fila con motivo.
  - parte 1 hecha (PR #57): cabecera, `## *` y `## /`. Falta la parte 2
    (resto de rutas y `README`).

- [ ] **T05 · Aprobación de `textos.md` y listas del script.** *Manual, con
  Álvaro; el chat que lo aplica, Sonnet 5.5 medium.*
  - *Cubre*: P-11, D-033, CA-4 (filas), CA-12.
  - *Depende de*: T04.
  - *Hacer*:
    - Álvaro elige los nombres y comprueba en la OEPM que no chocan con una
      marca; si uno choca, va el descriptivo (§3.4 regla 6). Revisa
      `textos.md` y cambia el estado de cada fila a `aprobada` o
      `corregida`.
    - El chat completa las listas de arriba de `comprobar-textos.mjs` con
      lo aprobado: `NOMBRES` (aprobado y viejos), `CIFRAS` (cada una con su
      id y su magnitud), `DIAGNOSTICO_PERMITIDO`, y las excepciones que
      `textos.md` haya justificado.
    - Activa CA-4 «ninguna fila sin aprobar» y CA-12.
    - `DECISIONES.md`: D-033 («`textos.md` aprobado fila a fila; cierra
      P-03 de la 001 y P-11, sustituye a D-027 en lo que figura en él»).
  - *Hecho*: D-033 en `DECISIONES.md`; P-11 cerrada; ninguna fila
    `propuesta`; CA-4 (filas) y CA-12 en `OK`.

## Código (en paralelo: T06, T07, T08 y T09)

- [ ] **T06 · Servicios, hero y herramientas.** *Modelo: Sonnet 5.5 high.*
  - *Cubre*: spec §3.7 (vigilancia, ficha, teléfono, «factura emitida»),
    §3.4 (etiquetas), CA-4 y CA-7 de T06; deltas 002 §3.6 y §7.
  - *Depende de*: T05.
  - *Ficheros*: `servicios.ts`, `hero.ts`, `hero.test.ts`,
    `herramientas.ts`, `herramientas/page.tsx`, `sections/Hero.tsx`,
    `sections/Servicios.tsx`.
  - *Hacer*:
    - copia las filas de `textos.md` de estos ficheros; quita las
      entradas `vigilancia` y `ficha-google` de `herramientas.ts` y lo de
      §3.7 en `servicios.ts` (07 y el enlace de 03);
    - cambia la parada «Vigilada cada día» por la de `textos.md` en
      `hero.ts` y su servicio en `servicios.ts`, en el mismo commit;
      `hero.test.ts` sigue exigiendo 4 × 3 y cada clave en `servicios.ts`;
    - `data-ejemplo` en los contenedores de los ejemplos del hero y en las
      capturas de `/herramientas/`; `data-numeracion` en el 01-07 si lo
      pinta `Servicios.tsx`.
  - *Hecho*: activa y pasan CA-4 · T06 y CA-7 · hero y `/herramientas/`;
    `npm test` en verde.

- [ ] **T07 · Portada de la consultora.** *Modelo: Sonnet 5.5 high.*
  - *Cubre*: spec §3.1 (rótulos de puerta), §3.5, §3.7 (`consultora.ts`,
    `proceso.ts:74`), §3.8 (aviso sin «software propio»), CA-4, CA-6 y CA-7
    de T07; deltas 002 §3.9 y §7.
  - *Depende de*: T05.
  - *Ficheros*: `consultora.ts`, `components/consultora/*`, `portada.ts`,
    `proceso.ts`, `cifras.ts`, `portada.test.ts`, `sections/Proceso.tsx`.
  - *Hacer*:
    - copia las filas de `textos.md`: problemas, servicios, «Tecnología
      aplicada», el bloque de plantillas con su aviso dentro de la misma
      `<section>` y con `data-aviso-inventadas`, proceso, quién, FAQ,
      contacto y el formulario corto (botón y textos con el nombre
      aprobado de esa puerta);
    - el rótulo de puerta en la cota de cada sección (§3.1);
    - `data-ejemplo` en las maquetas de `Maquetas.tsx`/`Soluciones.tsx`;
    - `portada.test.ts` compara con los `dato` aprobados de `proceso.ts`.
  - *Hecho*: activa y pasan CA-4 · T07, CA-6 · portada y CA-7 · «Tecnología
    aplicada»; `npm test` en verde; `comprobar-consultora.mjs` no peor que
    la línea base.

- [ ] **T08 · Interiores, metadatos, privacidad y README.** *Modelo: Opus
  5.5 medium* — toca `/privacidad/` (datos personales, §5).
  - *Cubre*: spec §3.4 (A45, nombres en metadatos), §3.5 (`/plantillas/`),
    §5 (datos personales), §6 (anclas en el README), CA-4 y CA-6 de T08;
    deltas 002 §3.11.
  - *Depende de*: T05.
  - *Ficheros*: los de T08 en el plan §5.
  - *Hacer*:
    - copia las filas de `textos.md` de estos ficheros, incluidas las `*`
      (menú, pie, cookies) y los `title`/`description`/OG `alt`;
    - `/privacidad/`: copia el texto aprobado y **comprueba** que dice lo
      que hace el código (los dos formularios, Supabase, quién lo ve,
      plazo). Si no cuadra, para y dilo en la PR: no lo arregles
      redactando;
    - aviso de inventadas en `/plantillas/` dentro de su `<section>`, con
      `data-aviso-inventadas`;
    - README: lo que repite la web, con los textos aprobados, y la nota de
      anclas viejas entre `<!-- 003-anclas -->`.
  - *Hecho*: activa y pasan CA-4 · T08 y CA-6 · `/plantillas/`; la PR dice,
    frase a frase, de dónde sale cada dato de `/privacidad/` en el código.

- [ ] **T09 · Sectores y diagnóstico.** *Modelo: Sonnet 5.5 high.*
  - *Cubre*: spec §3.1 (situaciones habituales, P-13), §3.7
    (`diagnostico.ts:496`), §6 (`diagnostico.ts` no se reescribe), CA-4,
    CA-6 y CA-7 de T09; deltas 001 §3.4 y §3.8.
  - *Depende de*: T05.
  - *Ficheros*: los de T09 en el plan §5.
  - *Hacer*:
    - copia las filas de `textos.md`; en `diagnostico.ts` solo
      afirmaciones (A42, A43), enlaces y lo que presupone del lector;
    - el enlace de la mejora `ficha-google` pasa a `/#servicios` en los
      dos sitios (delta a la 001 §3.4; D-003 exige enlace);
    - `data-ejemplo` en `ChatEjemplo` y en las maquetas de sector; aviso de
      inventadas en `PlantillasSector` con `data-aviso-inventadas`;
    - `sectores.test.ts` y `diagnostico.reglas.test.ts` actualizados a los
      textos aprobados, sin borrar ninguno.
  - *Hecho*: activa y pasan CA-4 · T09, CA-6 · `PlantillasSector` y CA-7 ·
    `ChatEjemplo` y maquetas; `npm test` en verde.

## Cierre

- [ ] **T10 · Barrido y comprobaciones globales.** *Modelo: Sonnet 5.5
  medium.*
  - *Cubre*: CA-1, 2, 3, 5, 8, 10, 16, 17.
  - *Depende de*: T06-T09 mergeadas en `exp/consultora`.
  - *Hacer*:
    - `npm run build` y activa las comprobaciones de T10;
    - lo que falle en un fichero con dueño (plan §5) es un fallo de esa
      tarea: arréglalo copiando de `textos.md` y dilo en la PR; lo que
      falle en un fichero sin dueño, igual. Si el texto que haría falta no
      está en `textos.md`, para: es una fila que falta (T05 reabierta);
    - una excepción nueva solo con motivo, y se lista en la PR.
  - *Hecho*: `npm run comprobar-textos -- --estricto` sale con código 0;
    lint, test y build en verde; `comprobar.mjs` y `comprobar-consultora.mjs`
    no peor que `linea-base.md`.

- [ ] **T11 · Lectura de Álvaro.** *Manual, con Álvaro.*
  - *Cubre*: la lista «A mano» de T01 (CA-3 paráfrasis, CA-6 legible, CA-9,
    CA-11, CA-13, CA-14, CA-15).
  - *Depende de*: T10.
  - *Hacer*: Álvaro recorre la web de `exp/consultora` en local
    (`npm run build` y `npm run servir`) en móvil y escritorio, con la lista
    «A mano» delante. Lo que pida cambiar: corrección en `textos.md` (con
    su estado) y PR `fix/pt-…` contra `exp/consultora`. Un nivel que cambie
    después de D-033 lleva D nueva y solo se reescriben las filas de ese id
    (spec §6).
  - *Hecho*: la lista «A mano» marcada en la PR de T10, con fecha.

- [ ] **T12 · Comprobar la spec.** *Modelo: Opus 5.5 medium* — la spec toca
  datos personales (`/privacidad/`) y legal (publicidad engañosa, §5).
  - *Cubre*: spec entera y sus deltas a la 001 y la 002.
  - *Depende de*: T01-T11 mergeadas en `exp/consultora`. Se hace en un chat
    o agente que **no ha construido nada de esta spec**. No arregla nada:
    comprueba e informa.
  - *Hacer*:
    1. Lee la spec (con sus deltas), este `tasks.md` y la lista «A mano»
       de T01 (marcada en T11).
    2. `npm run build`; ejecuta `npm test` y `npm run comprobar-textos --
       --estricto`. Ninguno puede seguir pendiente: un `skip` o un
       `PENDIENTE` cuenta como «no cumple». Compara `npm run comprobar` y
       `comprobar-consultora.mjs` con `linea-base.md`.
    3. Por cada criterio del §7 y cada regla con número de la spec que no
       tenga comprobación, compruébalo de verdad en `out/` con Playwright
       (390 y 1280 px, una prueba a la vez): p. ej. §3.2 regla 1 (ninguna
       fila mezcla niveles), §3.4 regla 2, §3.5 (el aviso visible) y CA-14
       contra el código. Revisa también cada excepción de las listas del
       script: ¿tiene motivo y se sostiene? Lo que no se pueda ver va como
       «no comprobable», con el motivo.
    4. Escribe `specs/003-posicionamiento-y-textos/comprobacion.md`: fecha,
       modelo y una tabla criterio · cómo se comprobó · cumple / no cumple /
       no comprobable · nota.
    5. **Si todo cumple** (los «no comprobable» con motivo no frenan):
       - consolida los deltas (pasos de abajo);
       - pasa la 003 a `hecha` en `SDD.md` y en su cabecera;
       - abre la PR con el resumen de `comprobacion.md` contra
         `exp/consultora`, y di en ella que la portada vigente de `main`
         sigue con los textos viejos hasta decidir P-08.

       **Si algo no cumple**: no consolides ni cambies el estado; commitea
       `comprobacion.md`, abre la PR contra `exp/consultora` y termina con
       «BLOQUEADO:» y la lista de lo que no cumple.

    **Consolidar deltas** (solo si todo cumple), para la 001 y la 002:
    1. Aplica cada delta del apartado 8 de esta spec al texto de
       `specs/001-diagnostico-y-sectores/spec.md` y de
       `specs/002-rediseno-por-debajo/spec.md`: AÑADE y MODIFICA pegan el
       texto nuevo en su §; QUITA lo borra. Si un conflicto (C-xx) abierto
       durante la implementación cambió lo que dice un delta, manda el C-xx:
       escribe lo que se hizo y cítalo.
    2. Si un delta no cuadra con el código y ningún C-xx lo explica, no
       inventes: para y dilo (es un hueco, no una errata).
    3. Cabecera de cada spec afectada: quita `Cambios pendientes: 003 (…)`
       y añade `003 (fecha)` a `Cambiada por:` (créala si no existe).
    4. Fila de cada spec afectada en `SDD.md`: que no cite la 003.
    5. En esta spec, cada bloque del apartado 8 pasa de `— pendiente` a
       `— consolidado AAAA-MM-DD`. No se borra.
  - *Hecho*:
    - `comprobacion.md` escrito;
    - si todo cumple:
      - la 003 está `hecha`;
      - ni la 001 ni la 002 llevan `Cambios pendientes: 003`, y sus filas
        en `SDD.md` no citan la 003;
      - la PR está abierta;
    - si no, la PR termina en «BLOQUEADO:».
