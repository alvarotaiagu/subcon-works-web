# 003 · Comprobación de la spec (T12)

Spec: [spec.md](spec.md) · Tareas: [tasks.md](tasks.md) (T12) · Línea base: [linea-base.md](linea-base.md)

- **Fecha**: 2026-11-02.
- **Quién**: agente que no ha construido nada de esta spec. Modelo: Opus 5.5 · esfuerzo medio.
  Dos agentes `Explore` (Sonnet 5.5 · medio) leyeron el texto de `out/` y `textos.md`
  contra el Anexo A; sus hallazgos están comprobados aquí antes de apuntarlos.
- **Sobre qué**: `exp/consultora` en `8ee093b` (T01-T11 y el arreglo de CA-6, PR #66),
  `npm ci` y `npm run build` en limpio.
- **Navegador**: un solo script de Playwright, un navegador cerrado en `finally`, escala 1,
  `reducedMotion: 'reduce'`, 390×844 y 1280×800, sin capturas. Rutas: `/`, `/plantillas/`,
  `/herramientas/`, `/sectores/` y sus tres páginas, `/privacidad/`, `/auditoria/`,
  `/estudio/` y `404.html`.

## Resultado

**No cumple.** Hay cuatro puntos que no cumplen, y todos necesitan una decisión de Álvaro o un
cambio en la spec. No se consolidan los deltas y la 003 sigue en `aprobada`.

1. **CA-14 y §5 (datos personales)**: `/privacidad/` enseña dos veces `[PENDIENTE]` en el
   responsable del tratamiento (nombre fiscal, NIF y domicilio), a 390 y a 1280 px. P-15
   sigue abierta, y `DECISIONES.md` dice que bloquea CA-14. El resto de la página coincide
   con el código.
2. **CA-13 (filas del Anexo)**: siguen `por confirmar` A10, A26, A36, A52, A54, A81 y A99.
   Las seis primeras no salen en `out/`. La A99 sí sale (punto 1).
3. **§3.2 regla 1 (una fila no mezcla niveles)**: la A34 junta un precio (A) con
   «presupuesto sin coste», que es un reclamo de condición (C, regla 2, A33). La A52 junta
   el informe (A, por confirmar), un servicio humano y un procedimiento («el informe es tuyo,
   sigas o no», que es A (procedimiento)).
4. **Anexo frente a D-037**: D-037 dice que «A93 se ajusta» y «A75 se ajusta», pero el
   Anexo no se ajustó. A93 sigue diciendo que el borrador «caduca a los 30 días», y A75 da
   «un año desde el último mensaje» como plazo, sin decir que el borrado es a mano. La web
   (`/privacidad/`) y el código sí siguen D-037: el borrador no caduca y el borrado es a
   mano cada tres meses.

## Comandos (paso 2)

| Comando | Resultado | Frente a `linea-base.md` |
|---|---|---|
| `npm run lint` | `OK`, sin avisos | igual |
| `npm test` | `OK`: 75 pruebas, 75 pasan, 0 `skip`, 0 `todo` | mejor (había 66) |
| `npm run build` | `OK`: 16 páginas estáticas | igual |
| `npm run comprobar-textos -- --estricto --puerto 4312` | 20 `OK` · 0 `FALLO` · 0 `PENDIENTE`, sale con 0 | n/a |
| `npm run comprobar -- --puerto 4312` | 17 `OK` · 10 `FALLO` · 0 pendientes | igual, línea a línea: los mismos 10 `FALLO`, ningún `OK` pasa a `FALLO`. `Contraste real` en `OK` (342 s), con 2 textos sin medir en `/` a 390 px y 3 en `/?revision=sobria` |
| `node scripts/comprobar-consultora.mjs --url http://127.0.0.1:4312/` | 19/22 | igual: fallan los mismos 3, «sin errores de consola» a 1440, 768 y 390 |

## Criterios del §7

| Criterio | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| CA-1 · ni «herramienta propia» ni «software propio» | script, y búsqueda en el texto visible de las 11 rutas a 390 y 1280 | cumple | 0 apariciones |
| CA-2 · sin vigilancia ni ficha de Google | script (0 excepciones), texto visible, `herramientas.ts` (solo `tiendas`, `informe` y `formularios`) y `diagnostico.ts:496` (`/#servicios` en los dos) | cumple | Las anclas viejas están anotadas en el README, entre `<!-- 003-anclas -->` |
| CA-3 · frases de nivel C: 0, y paráfrasis | script con 10 frases; lectura de todo el texto de `out/` buscando paráfrasis de A04, A14, A16, A19, A20, A21, A32, A33, A35, A41, A46, A48, A70 y A71 | cumple | No hay paráfrasis de un C. Lo que se acerca y queda como observación: obs. 1 y 2 |
| CA-4 · filas aprobadas en su fichero | script: 181 + 271 + 287 + 168 filas; ninguna sin aprobar | cumple | Las 918 filas de `textos.md` están en `aprobada` |
| CA-5 · un nombre por producto | script; menú visto a 390 y 1280 («Servicios · Soluciones · Webs de ejemplo · Productos · Proceso · Contacto · Pedir una propuesta») | cumple | Los siete nombres son los de D-033 |
| CA-6 · aviso de inventadas en su `<section>`, sin palabras de §3.5 | script; con navegador, el aviso es visible y está dentro de `section` en `/`, `/plantillas/` y los sectores con plantillas | cumple | En `/sectores/clinicas-dentales/` no sale el bloque porque no hay plantillas válidas del sector (P-01): es lo previsto |
| CA-6 · legible, no en letra menor | navegador y clases: el texto del aviso va a 16 px (`text-base`) en la portada, `/plantillas/`, los sectores y `/herramientas/`, que es el tamaño de párrafo más común de esas páginas | cumple | La etiqueta «Aviso» va a 10-12 px, pero es un rótulo y no el aviso. Queda arreglado por la PR #66 |
| CA-7 · rótulo «Ejemplo» | script; con navegador, los `[data-ejemplo]` visibles son 8 en `/`, 2 en `/herramientas/` y 2 en cada sector, y todos llevan «Ejemplo» | cumple | — |
| CA-8 · cifras en `CIFRAS`, un valor por magnitud | script; revisión de la lista (obs. 4) | cumple | — |
| CA-9 · no presupone al lector | lectura del hero, los problemas y su cierre y los tres sectores; lectura de Álvaro en T11 (#65) | cumple | Se habla con «si…» o con ejemplos rotulados. «Se saca la web vieja» va en el hero rotulado «Ejemplo» (A06) |
| CA-10 · tests, build y no peor que la línea base | tabla de comandos | cumple | — |
| CA-11 · titular, entradilla y botón | lectura de las secciones de la portada y de `/herramientas/`; T11 | cumple | Lo que anotó T11 del titular del contacto no es una contradicción |
| CA-12 · una tabla por ruta del export | script | cumple | — |
| CA-13 · paráfrasis de nivel C | lectura entera de `out/` (ver CA-3) | cumple | — |
| CA-13 · cada fila del Anexo confirmada o corregida | `spec.md` §3.3 | **no cumple** | Siguen `por confirmar` A10, A26, A36, A52, A54, A81 y A99. Las seis primeras no salen en `out/`. Además, A93 y A75 no siguen D-037 (punto 4 del resultado) |
| CA-14 · `/privacidad/` y formularios dicen lo que hace el código | texto de `/privacidad/` contra `FormularioContacto.tsx`, `auditoriaApi.ts`, `FormularioAuditoria.tsx` (`localStorage`: se guarda al abrir y se quita al enviar bien, sin caducidad), `AvisoCookies.tsx`, `scriptCabeza.ts` (`sessionStorage`) y la casilla de la auditoría | **no cumple** | Coinciden los campos, los dos formularios, Supabase, quién lo ve, el almacenamiento del navegador y el plazo de D-037. Falla el responsable: `[PENDIENTE]`, P-15 |
| CA-14 · lo que no está en el repo | — | no comprobable | «No guardamos nosotros tu IP», «región de París» y «el informe llega por correo» dependen de la función de Supabase y del kit, que no están en el repo |
| CA-15 · un rótulo de puerta por sección | navegador a 390 y 1280: las 9 secciones de `/` | cumple | Llevan «Lo que ve tu cliente» `inicio` y `plantillas`; las otras siete llevan «Lo que va por debajo». Una sola etiqueta visible en cada una |
| CA-16 · sin reclamos de condición | script (0 excepciones) y texto visible | cumple | — |
| CA-17 · «diagnóstico» solo para el diagnóstico rápido | script; texto visible: solo «Diagnóstico rápido» y sus botones | cumple | — |

## Reglas con número sin comprobación automática

| Regla | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| §3.2 regla 1 · B nunca en presente de producto | lectura de `out/` y de `textos.md` | cumple, con observación | Obs. 1 |
| §3.2 regla 1 · una fila no mezcla niveles | lectura de las 86 filas del Anexo | **no cumple** | A34 y A52 (punto 3 del resultado). A57 y A91 no mezclan niveles: todo es A |
| §3.2 regla 2 · capacidad, no condiciones | CA-16 y lectura | cumple | «La auditoría no se cobra» y «La propuesta no se cobra» son precio (A34 y A80, D-035) |
| §3.2 regla 3 · nada de clientes | lectura; palabras de §3.5 | cumple | Todos los avisos dicen «No son clientes» |
| §3.2 regla 4 · cifras | CA-8 | cumple | — |
| §3.2 regla 5 · terceros | `sectores.ts:164-166` y `diagnostico.ts` | cumple | La comisión de Booking y Airbnb sale «según sus condiciones» y sin cifra. Lo del huésped que repite va con «si…» (A46) |
| §3.2 regla 6 · afirmación nueva con fila | `textos.md`, motivos | cumple, con observación | Obs. 3 |
| §3.3 · una fila `por confirmar` no sirve para escribir | filas por confirmar frente a `out/` | **no cumple** (solo A99) | El texto del responsable sale con `[PENDIENTE]` |
| §3.4 reglas 1-4 · nombres | CA-5 y CA-17; `textos.md` | cumple | Ningún nombre lleva «propio» ni «herramienta». «Diagnóstico» solo sale para la puerta 2 |
| §3.4 regla 6 · marcas (OEPM) | D-033 | cumple | Los siete nombres son descriptivos, así que no hay consulta |
| §3.5 · bloque de plantillas | navegador y `textos.md` | cumple, con observación | El título es «Webs de ejemplo por sector» y el aviso va dentro y es visible. «Proyectos» pasa a «Webs de ejemplo» en el menú y en la cota. Obs. 5 |
| §3.6 · seis filtros, una fila por ruta | CA-4, CA-12 y la lectura de los agentes | cumple, con observación | Obs. 3 |
| §3.7 · lo que sale de la web | código y `out/` | cumple | El hero sigue con 4 flujos de 3 paradas («Cambios cuando los pidas» sustituye a «Vigilada cada día», servicio 07) y `hero.test.ts` pasa |
| §3.8 · lo que no cambia | rótulo «Ejemplo», noindex (está en todas las páginas de `out/`), rutas (las 16 de siempre) y las frases de D-014 | cumple | — |
| §5 · publicidad engañosa | CA-1, 2, 3 y 16 y la lectura | cumple | — |
| §5 · datos personales | CA-14 | **no cumple** | P-15 |
| §5 · personas con nombre | A40 corregida (D-035) | no comprobable | Que Yanin haya leído su texto no se puede ver en el repo |
| §6 · anclas viejas | README | cumple | — |

## Excepciones de las listas del script

| Lista | Entrada | ¿Se sostiene? |
|---|---|---|
| `EXCEPCIONES_NIVEL_C` | A14 «al teléfono» en `diagnostico.ts` | Sí: es «dejas de cuadrar huecos al teléfono» (A61, B) y no dice que atendamos el teléfono. Pero la excepción vale para todo el fichero (obs. 4) |
| `EXCEPCIONES_NIVEL_C` | A21 «vídeo» en `consultora.ts` y `estudio.ts` | Sí: es el rol de Yanin, «Foto, vídeo y redes», y «hace y edita las fotos y los vídeos del estudio» (A40, D-035) |
| `FRASES_C` con `soloSrc` | A14 y A21 no se buscan en `out/` | Sí: `out/` es copia de `src/` |
| `EXCEPCIONES_VIGILANCIA`, `EXCEPCIONES_CONDICIONES` | vacías | — |
| `DIAGNOSTICO_PERMITIDO` | contacto de `/`, `/sectores/` y sus tres páginas, `/auditoria/` y `/privacidad/` | Sí: en todas, «diagnóstico» es el diagnóstico rápido |
| `CIFRAS` | 48 entradas, cada una con su id | Sí. «Unas 30 llamadas a la semana» y «3: yo atiendo» van con «Por ejemplo» (A78). «Dos minutos» solo está en un `concepto` de `plantillas.ts` (A79) |
| `NOMBRES` | siete productos y puertas, con los nombres viejos | Sí, coinciden con D-033 |

## Observaciones (no frenan, para Álvaro)

1. **B en presente bajo «Lo que haríamos»** (`diagnostico.ts`, páginas de sector): «La
   factura se hace al cerrar el trabajo y, si no se paga, el aviso de cobro sale en su fecha»
   (A43), «el sistema de citas le manda la confirmación y un recordatorio» (A61) y «Cada
   cliente sube su documentación…» (A63). Son filas aprobadas, y el condicional lo pone el
   titular del bloque. Para quitar la duda: «podemos montar…». La de las facturas convive con
   A16 (C, «factura emitida»), y si se emiten facturas entra Verifactu.
2. **Chips de la portada**: «Informes y avisos automáticos» (A22, B) y «Presupuestos en un
   clic» y «Lectura de facturas» (A15, B) van como etiquetas, sin verbo, en una línea de
   «lo que montamos». No son un C, pero «avisos automáticos» se lee cerca de A19.
3. **`textos.md`: unas 15 filas con afirmación y sin id en «motivo»**, casi todas por
   «Ídem». Por ejemplo L383 `servicios.intro`, L789 «No empezamos de cero», L926-928
   «Ilustración a medida», L1088 «…que cambiamos cuando nos lo pidas» y L1116-1118 «La
   recomendamos en…». Todas tienen una fila del Anexo que las cubre, pero no la citan.
4. **Script**: las excepciones de CA-3 liberan el fichero entero, no la frase. Un «al
   teléfono» nuevo en `diagnostico.ts` no saltaría. `{n}` acepta `{…}`/`${…}` (lo dijo T10).
5. **«Webs de ejemplo por sector»** también enseña la tienda, el informe y el formulario.
   El nombre es más estrecho que el bloque. Está aprobado así en `textos.md`.
6. **Contraste**: siguen sin medir 5 textos sobre degradado o imagen en `/` a 390 px
   (normal y Sobria), igual que en T10.

## Qué falta para cerrar la 003

- Decidir P-15 (responsable del tratamiento) y poner los datos en `/privacidad/` (A99), o
  decidir que la 003 se cierra con `/privacidad/` sin publicar y CA-14 condicionado a P-15.
- Confirmar A10, A26, A36, A52, A54 y A81, o decidir que una fila `por confirmar` que no
  sale en la web no frena CA-13.
- Partir A34 y A52 en el Anexo (regla 1) y ajustar A93 y A75 a D-037. Es un cambio de
  documento con una D nueva, sin tocar código.
- Después, otra T12: consolidar los deltas en la 001 y la 002 y pasar la 003 a `hecha`.
