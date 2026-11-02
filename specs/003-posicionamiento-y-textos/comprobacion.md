# 003 · Comprobación de la spec (T12)

Spec: [spec.md](spec.md) · Tareas: [tasks.md](tasks.md) (T12) · Línea base: [linea-base.md](linea-base.md)

- **Fecha**: 2026-11-02 (segunda vuelta; la primera, PR #67, acabó en BLOQUEADO y se
  arregló en la PR #68 con D-038 y D-039).
- **Quién**: agente que no ha construido nada de esta spec y no ha reutilizado la
  comprobación anterior. Modelo: Opus 5.5 · esfuerzo medio. Tres agentes `Explore`
  (Sonnet 5.5 · medio) recorrieron `textos.md` (en dos mitades) y el Anexo A contra `out/`;
  sus hallazgos se comprobaron aquí en el código antes de apuntarlos.
- **Sobre qué**: `exp/consultora` en `508683c`, con `npm ci` y `npm run build` en limpio.
- **Navegador**: un solo script de Playwright cada vez, un navegador cerrado en `finally`,
  escala 1, `reducedMotion: 'reduce'`, 390×844 y 1280×800, sin capturas, puerto 4312. Rutas:
  `/`, `/auditoria/`, `/estudio/`, `/herramientas/`, `/plantillas/`, `/privacidad/`,
  `/sectores/` y sus tres páginas, y `404.html`.

## Resultado

**Cumple.** Todos los criterios del §7 y las reglas con número cumplen o son «no
comprobable» con motivo. Las dos excepciones aceptadas por Álvaro en D-038 se aplican tal
como están escritas:

- `[PENDIENTE]` en el responsable del tratamiento de `/privacidad/`, por CA-14 y P-15;
- las filas `por confirmar` que no salen en la web, por CA-13.

Lo que no frena pero conviene mirar va en «Observaciones», al final.

## Comandos

| Comando | Resultado | Frente a `linea-base.md` |
|---|---|---|
| `npm run lint` | OK, sin avisos | igual |
| `npm run build` | OK, 16 páginas estáticas | igual |
| `npm test` | 75 pasan, 0 fallan, 0 `skip`, 0 `todo` | antes 66 (T01-T10 añadieron tests) |
| `npm run comprobar-textos -- --estricto --puerto 4312` | 20 OK · 0 FALLO · 0 PENDIENTE (sale con 0) | — (no existía) |
| `npm run comprobar -- --puerto 4312` | 17 OK · 10 FALLO · 0 pendientes | igual línea a línea (fallan T06, T07 360 px, T07 LCP, T13, T14, T16, T17 Mando, T17 Sobria, T18 Glifos, D-028) |
| `node scripts/comprobar-consultora.mjs --url http://127.0.0.1:4312/` | 19/22 | igual (fallan los 3 de consola) |

## Criterios del §7

| Criterio | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| CA-1 | `comprobar-textos` | cumple | 0 apariciones |
| CA-2 | `comprobar-textos`; lista de excepciones | cumple | Lista vacía; `VIGILANCIA_EXISTE = false`. La nota de anclas del README está entre `<!-- 003-anclas -->` (§6) |
| CA-3 (t) | `comprobar-textos`; revisión de las excepciones | cumple | 10 frases, 0 apariciones fuera de excepción. Las tres excepciones se sostienen: A14 en `diagnostico.ts` solo aparece en `queResuelve` de `reservas-online` (l. 449 y 451, A61); A21 en `consultora.ts:238` y `estudio.ts:40` es el rol de Yanin (A40) |
| CA-3 (m), paráfrasis | Agentes sobre `out/**/*.html` y `textos.md`, comprobado aquí | cumple | No aparecen vigilancia, caducidades, auditoría de la ficha, voz o teléfono como servicio, vídeo como servicio, «factura emitida», «primera tienda», plazos ni cifras sin fuente, «próximamente» ni juicios sobre Google |
| CA-4 | `comprobar-textos` | cumple | 907 filas comprobadas en su fichero; ninguna sin aprobar |
| CA-5 | `comprobar-textos` | cumple | Siete nombres de D-033; 0 nombres viejos |
| CA-6 (t) | `comprobar-textos` | cumple | Aviso dentro de su `<section>` en la portada, `/plantillas/` y `PlantillasSector`; 0 palabras de §3.5 |
| CA-6 (m), legible | Playwright, tamaño calculado del aviso a 390 y 1280 px | cumple | 16 px en «Webs de ejemplo por sector», `/plantillas/`, `PlantillasSector` (rural y despachos; dental no tiene bloque, P-01) y `/herramientas/`. El arreglo de la PR #66 está |
| CA-7 | `comprobar-textos`; Playwright: cada `[data-ejemplo]` visible | cumple | Llevan «Ejemplo» todos menos los botones de los objetos del hero (su rótulo «Ejemplo» va junto a la lectura, D-019, y el script lo comprueba) y un `<p>` de lectura vacío |
| CA-8 | `comprobar-textos`; revisión de la lista `CIFRAS` | cumple | Cada entrada lleva su id. Una magnitud, un valor: «unos minutos» (A73) en los dos formularios, 36 preguntas, 30 plantillas. Ver la observación 6 |
| CA-9 | Lectura de `out/` (hero, problemas y su cierre, tres sectores) | cumple | No se da por hecho WhatsApp, hojas de cálculo, programas desconectados ni web vieja. Los problemas van bajo «Lo que suele pasar» y con «si…». Ver la observación 2 |
| CA-10 | Comandos de arriba | cumple | Nada que estaba OK en la línea base pasa a FALLO |
| CA-11 | Playwright: titular, entradilla y botones de cada sección a 1280 px | cumple | Coherentes en la portada, las interiores y los sectores |
| CA-12 | `comprobar-textos` | cumple | Una tabla por ruta del export (con `404`) y `*` |
| CA-13 | `spec.md` §3.3 frente a D-035, D-038 y D-039; los agentes buscaron en `out/` lo que se apoya en filas `por confirmar` | cumple (excepción D-038) | Quedan `por confirmar` A10, A26, A36, A52, A52b, A52c, A54, A81 y A99. Ninguna de las ocho primeras sale en `out/`. A99 sale como `[PENDIENTE]` (CA-14). El resto, confirmada o corregida |
| CA-14 | Código (`privacidad/page.tsx`, `FormularioContacto.tsx`, `FormularioAuditoria.tsx`, `auditoriaApi.ts`, `AvisoCookies.tsx`); Playwright: cookies y almacenamiento por página | cumple (excepción D-038) | `document.cookie` vacío en todas las rutas. En la portada no se guarda nada; `undertactics:auditoria:v1` aparece al abrir `/auditoria/` y solo se quita si el envío sale bien (`res.ok`). Los dos formularios usan la misma función. Plazos según D-037 e IP según A92. `[PENDIENTE]` sale 2 veces (390 y 1280 px): excepción aceptada en D-038, y `/privacidad/` no se publica hasta P-15. **No comprobable desde el repo**: lo que hace la Edge Function (región de París, que no guarde la IP, el límite de envíos), porque su código no está en el repo |
| CA-15 | Playwright: rótulos de puerta visibles por sección | cumple | 9 secciones, un rótulo cada una: hero y «Webs de ejemplo» llevan «Lo que ve tu cliente», las otras siete «Lo que va por debajo». La segunda aparición en el hero es texto de la descripción, no un rótulo |
| CA-16 | `comprobar-textos` | cumple | Lista de excepciones vacía |
| CA-17 | `comprobar-textos`; revisión de `DIAGNOSTICO_PERMITIDO` | cumple | Seis entradas, todas del diagnóstico rápido (enlace del contacto, `/sectores/`, las tres páginas, el aviso de `/auditoria/` y la explicación de `/privacidad/`) |

## Reglas con número sin comprobación automática

| Regla | Cómo se comprobó | Resultado | Nota |
|---|---|---|---|
| §3.1 comprador y dos puertas | Lectura de `out/`; CA-15 | cumple | La promesa es la frase de D-014 y no nombra un dolor |
| §3.2 regla 1, B nunca en presente de producto | Agentes sobre `out/` y `textos.md` | cumple, con observación | Fuera de maquetas, los B usan «podemos montar», «a tu medida» o «si quieres…». Ver la observación 1 (sectores) |
| §3.2 regla 1, una fila no mezcla niveles | Lectura del Anexo A | cumple | A34/A34b y A52/A52b/A52c están partidas (D-039). Ver la observación 4 (A01) |
| §3.2 regla 2, capacidad y no condiciones | CA-16; lectura | cumple, con observación | Ver la observación 3 («cuando quieras») |
| §3.2 regla 3, nada de clientes | CA-6; agentes | cumple | «Cliente» solo como cliente del lector o negado («No son clientes») |
| §3.2 regla 4, cifras | CA-8 | cumple | — |
| §3.2 regla 5, terceros | Lectura de los sectores | cumple | A42 cita «según sus condiciones»; A46 va con «si…» |
| §3.2 regla 6, fila antes de afirmar | Agentes, motivos de `textos.md` | cumple, con observación | Ver la observación 5 (filas sin id) |
| §3.3 Anexo A | Lectura completa | cumple | Todas las filas tienen estado; A75 y A93 dicen lo que D-037 |
| §3.4 reglas 1-4 | CA-1, CA-5 y CA-17 | cumple | — |
| §3.4 reglas 5-6 | D-033 | cumple | Eligió Álvaro; todos los nombres son descriptivos, así que no se miran en la OEPM |
| §3.4 regla 7 | CA-2 | cumple | — |
| §3.5 plantillas | Playwright y CA-6 | cumple | El bloque se llama «Webs de ejemplo por sector y lo que ya funciona», con el aviso visible dentro de la sección. «Proyectos» no sale como texto visible, solo en ids |
| §3.6 `textos.md` | CA-4 y CA-12 | cumple | — |
| §3.7 lo que sale de la web | CA-2 y CA-3; código | cumple | Mejora `ficha-google` → `/#servicios` en los dos (`diagnostico.ts:496`, más un test); `hero.test.ts` pasa con 4×3 paradas |
| §3.8 lo que no cambia | Código y `out/` | cumple | Noindex en los 13 HTML; slugs de D-009; «Ejemplo» en hero y maquetas; las frases de D-014 siguen en `site.ts`, `consultora.ts`, `Servicios.tsx` y `Plantillas.tsx` (este pinta «Una plantilla de N.» con `plantillas.length`) |
| §5 publicidad engañosa | CA-3, regla 1 de §3.2 | cumple | — |
| §5 datos personales | CA-14 | cumple (excepción D-038) | — |
| §5 personas con nombre | A40 corregida | cumple | Rol de Yanin «Foto, vídeo y redes» (D-035) |
| §5 marcas | D-033 | no comprobable | Los nombres son descriptivos y no se consultó la OEPM. Así lo decidió Álvaro en D-033 |
| §6 casos límite | Código | cumple | Ver §3.7 y §3.8; `diagnostico.reglas.test.ts` pasa |

## Observaciones (no frenan)

1. **B en indicativo bajo «Lo que haríamos»** (`MejorasSector`, `diagnostico.ts`
   `queResuelve`), en las tres páginas de sector. Algunas frases:
   - «La factura se hace al cerrar el trabajo y, si no se paga, el aviso de cobro sale en su
     fecha» (A43);
   - «el sistema de citas le manda la confirmación y un recordatorio» (A61);
   - «El paciente nuevo rellena sus datos desde casa…» (A63).

   El condicional lo pone la sección: el rótulo «Lo que haríamos», el titular «Lo que puede
   quedar funcionando solo» y «Esto lo podemos montar nosotros» en el resultado del
   diagnóstico. Álvaro aprobó esas filas una a una (D-033), y el motivo de alguna dice
   «bajo “Lo que haríamos”». Si se quiere la lectura estricta de §3.2 («siempre en
   condicional»), habría que pasarlas a condicional. A43 («facturas y cobros que salen
   solos», B) convive con A16 (C, «factura emitida» por la plataforma). Son filas distintas,
   pero si algún día se monta, entra Verifactu.
2. **Situaciones que se suponen** en mejoras y sectores:
   - «Ya no persigues a nadie»;
   - «en vez de en papel en la sala de espera»;
   - «no hay que pedírselos uno a uno en la entrada».

   No son ninguno de los cuatro rasgos de CA-9, y van bajo «Lo que haríamos» o «Lo que
   suele pasar» (P-13). Lo de despachos sí se corrigió («no repartida entre el correo y el
   WhatsApp»).
3. **«Abres el código cuando quieras.»** (`estudio.ts`, `compromisos[0].titulo`, fila
   `(igual)`). En otra fila, `textos.md` trata «cuando quieras» como reclamo de condición
   (`servicios[6].incluye[4]`, «Te lo llevas cuando quieras» → «Te lo llevas entero»), y
   aquí lo deja. La spec no tiene «cuando quieras» en su lista, así que no incumple, pero las
   dos filas no son coherentes.
4. **A01** pone «envíos» dentro de la plataforma (nivel A), y D-035 dejó el reparto local en
   B (A64). En la web solo sale «decidimos contigo los envíos y la recogida» (A25, servicio),
   que vale.
5. **Filas de `textos.md` sin id del Anexo** aunque afirman algo: unas 40, sobre todo
   titulares de problemas de sector (motivo «P-13» o «Situación habitual») y alguna frase
   suelta («No empezamos de cero», «Para asesorías, comercios y negocios pequeños»).
6. **Cifras escritas a mano que hoy coinciden con la fuente**:
   - «36 preguntas» en `Contacto.tsx:44`, `cifras.ts:22` y el README (fuente
     `TOTAL_PREGUNTAS`);
   - «Cuatro líneas de trabajo» y «Dos personas»;
   - «las 30 plantillas del taller» en el README.

   Además, en `CIFRAS`, «ocho pasos» lleva A79, pero en el README son los pasos del
   formulario (A76).
7. **`/privacidad/` dice que el borrador «se borra cuando lo envías»**, y el código solo lo
   borra si el envío sale bien. Si el envío falla, sigue ahí, que es lo esperable de «no
   enviado».
8. **El aviso de «Tecnología aplicada»** («Son ejemplos de lo que se puede montar, con
   datos inventados…») va a 14 px. No está en el alcance de CA-6, que habla de las webs de
   ejemplo.
9. **`/herramientas/`, tienda**: «listos el primer día» es un plazo sin número y sin fila
   propia (lo cubre A25). Si se quiere, se puede quitar.
10. **El mensaje tras enviar la auditoría** dice «Lo leemos entero…», con A56 de motivo.
    A52b, `por confirmar`, también incluye «lo leemos entero», pero lo que `textos.md` quitó
    es «miramos tu web por fuera». No sale en `out/` (se pinta al enviar).

## No comprobable

- Lo que hace la Edge Function `solicitar-auditoria`: la región, que no guarde la IP, el
  límite de envíos y el correo a Álvaro. Su código no está en el repo y no hay permiso
  sobre el proyecto de Supabase.
- Que el informe del kit 03 traiga lo que dicen A36, A52 y A81: no sale en la web y el kit
  no está en el repo.
- §3.4 regla 6 (OEPM): no se consultó, por decisión de D-033.
