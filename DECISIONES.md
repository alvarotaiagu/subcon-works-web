# Decisiones · Undertactics

Una decisión vigente solo se cambia con otra D nueva que diga a cuál sustituye.
Si una spec choca con una decisión, se abre un conflicto (C-xx) y se para hasta
que Álvaro lo resuelva; no se resuelve en silencio.

## Vigentes

| Nº | Decisión | Origen | Fecha |
|---|---|---|---|
| D-001 | El diagnóstico rápido corre entero en el navegador, con reglas fijas y sin IA. No envía nada, no guarda nada y no pide correo para ver el resultado. | 001 | 2026-10-11 |
| D-002 | El diagnóstico no tiene ningún campo de texto libre: solo opciones. Así las respuestas pueden viajar en la URL sin llevar datos personales. | 001 | 2026-10-11 |
| D-003 | El resultado enseña de 3 a 5 mejoras con su porqué y su enlace. Ni nota global ni precios. | 001 | 2026-10-11 |
| D-004 | Paso a la auditoría por URL: el formulario rellena solo las preguntas vacías, avisa de cuántas ha puesto y quita los parámetros de la URL. Lo escrito por la persona manda. | 001 | 2026-10-11 |
| D-005 | Páginas por sector en `/sectores/<slug>/` con un índice en `/sectores/`. No entran en el menú: se enlazan desde la sección del diagnóstico de la portada. | 001 | 2026-10-11 |
| D-006 | Primeros sectores: clínicas dentales, alojamientos rurales (casas, apartamentos, hotel rural) y asesorías y despachos (asesoría y abogacía juntas). En la portada, además, «Otro negocio». | 001 | 2026-10-11 |
| D-007 | Una página de sector solo enseña plantillas ficticias del catálogo (`src/content/plantillas.ts`). Si el sector no tiene ninguna, el bloque no sale. Nunca webs de negocios reales. | 001 | 2026-10-11 |
| D-008 | El asistente aparece en las páginas de sector como una conversación de ejemplo fija, marcada como ejemplo, y solo muestra lo que `recepcionista-ia` sabe hacer hoy. El chat en vivo va en su propia spec dentro de `recepcionista-ia`. | 001 | 2026-10-11 |
| D-009 | Slugs fijos de las páginas de sector: `dental` → `clinicas-dentales`, `rural` → `alojamientos-rurales`, `despachos` → `asesorias-y-despachos`. No se cambian: van en enlaces ya mandados. | 001 | 2026-10-11 |
| D-010 | Las respuestas que el diagnóstico pone en la auditoría acaban en « (del diagnóstico rápido)», para que el informe del kit sepa que no las escribió el negocio. El kit no se toca. | 001 | 2026-10-11 |
| D-011 | Spec 001 (diagnóstico rápido y páginas por sector) aprobada por Álvaro tal como está, con D-001 a D-010 y los pendientes P-01 a P-03. | 001 | 2026-10-11 |
| D-012 | Plan de la 001 aprobado con PD-1 a PD-11 (`specs/001-diagnostico-y-sectores/plan.md`). PD-2 corrige el §3.5: el salto a `#diagnostico` espera a que la cortina se retire (`esperarCortina()`), no a `PRELOADER_DONE_EVENT`, que llega ~1 s antes de que se quite `overflow:hidden`. Todo va a la rama de integración `feat/diagnostico-sectores` y a `main` solo tras P-03. | 001 | 2026-10-11 |
| D-013 | El diagnóstico nunca propone una mejora que contradiga una respuesta: una lista de exclusiones por respuesta (`reserva=online` o `sin-cita` quitan `reservas-online` y `reservas-directas`) se aplica a las reglas y al relleno. El relleno de cada sector se alarga a 5 mejoras para que siempre salgan al menos 3. `documentacion` pierde el enlace a `/herramientas/#formularios`. Spec §3.4 actualizada. | 001 | 2026-10-11 |
| D-014 | Rediseño de la web con la dirección A «Por debajo» (la línea lima del logo es la superficie: arriba lo que ve el cliente, debajo la instalación), con dos préstamos: «Una plantilla de 30» de B y la frase «Montamos lo que se ve y lo que va debajo.» de C. Entrada: `../undertactics-bocetos/DIRECCION.md`; la spec 002 manda sobre ella. | 002 | 2026-10-12 |
| D-015 | Portada en siete cotas: Hero (Superficie) · Servicios (0) · La plantilla (−1) · Proceso (−2) · Quién está debajo, Equipo y Compromisos juntos (−3) · Diagnóstico (−4) · Fondo, la auditoría. Salen Marquee, Cifras y CtaFinal; las cuatro cifras se reparten entre Plantilla, Proceso y Fondo. | 002 | 2026-10-12 |
| D-016 | Las páginas interiores empiezan «debajo» (fondo hondo, superficie bajo la cabecera, cota junto al H1) y no llevan cortina. Lo claro solo existe en la portada. | 002 | 2026-10-12 |
| D-017 | Salen del kit: cortina-engranaje (`Preloader`), `HeroGears`, `ScrollLine`, `Marquee`, botones magnéticos (`useMagnetic`), pilas sticky, cursor propio, `Grain` y todo `three` (con la dependencia). Se quedan Lenis, GSAP y `PageTransition` (rehecha). | 002 | 2026-10-12 |
| D-018 | Letras Geologica y Kode Mono autoalojadas con `@font-face` propio y fallback con `size-adjust`, no con `next/font`. Instrument Sans, Inter y JetBrains Mono salen del texto; Instrument Sans queda solo dentro del logo, a curvas. | 002 | 2026-10-12 |
| D-019 | Los ejemplos del hero llevan el rótulo «Ejemplo». Si nadie toca el hero, baja un ejemplo a los 5 s y luego cada 5 s, una sola vuelta (los cuatro), con un control «Pausar ejemplos» (WCAG 2.2.2); tras un gesto, 15 s de silencio; parado fuera de pantalla, con la pestaña oculta y con movimiento reducido. Solo se anuncia por `aria-live` lo que activa la persona. | 002 | 2026-10-12 |
| D-020 | El rediseño va a la rama de integración `feat/rediseno-por-debajo` y a `main` de una vez, tras P-04 y la revisión de Álvaro con `?revision`. | 002 | 2026-10-12 |
| D-021 | La web cumple las cinco obligatorias del §5 bis «Nivel» del PLIEGO (con la inactividad como pieza del menú) y lo escribe en su README. El PLIEGO no se toca. | 002 | 2026-10-12 |
| D-022 | Para tener los cinco recursos del PLIEGO §2 tras quitar piezas del kit: los H2 (y los H1 de las interiores) entran palabra a palabra desde la superficie de su sección (el H1 del hero no, por el LCP). El hero de pozos en SVG cuenta como «hero propio del concepto» aunque no sea canvas ni WebGL: excepción por el presupuesto de rendimiento. | 002 | 2026-10-12 |
| D-023 | `playwright` entra como `devDependency` del repo, solo para medir el rendimiento y comprobar en navegador (`scripts/medir.mjs`, `scripts/comprobar.mjs`). No entra ninguna dependencia de ejecución nueva. | 002 | 2026-10-12 |
| D-024 | Spec 002 (rediseño «Por debajo») aprobada por Álvaro tal como está, con D-014 a D-023 y los pendientes P-04 a P-07. | 002 | 2026-10-12 |
| D-025 | Plan de la 002 aprobado por Álvaro con PD-1 a PD-15 (`specs/002-rediseno-por-debajo/plan.md`). | 002 | 2026-10-12 |
| D-026 | La portada solo enseña las plantillas destacadas: sale el banquillo (spec 002 §3.8) y en su lugar va «¿Tu sector no está?», con un correo (`mailto:`) para pedir la de su sector. Sin formulario: la web no guarda datos personales. `/plantillas/` sigue con el catálogo entero. | 002 | 2026-10-16 |
| D-027 | Álvaro aprueba tal cual los textos nuevos de la 002 (P-04 cerrada): descripción del hero, entradilla de Servicios, cotas, las seis filas del proceso, ejemplos del hero y la frase de `/privacidad/` sobre la cortina. Los textos viven donde dice la PR de integración (#41). | 002 | 2026-10-16 |
| D-028 | El tope «ninguna tarea larga > 200 ms» (§3.15) se mantiene y se cumple bajando el JS inicial: GSAP, ScrollTrigger y Lenis se cargan con `import()` tras hidratar (PR `fix/rd-carga-diferida`). No se relaja el tope ni se mide solo a máquina rápida. Hasta que esa PR entre, el README lo marca «no cumple todavía». Resuelve C-19. | 002 | 2026-10-16 |

## Pendientes

| Nº | Pendiente | Quién | Bloquea |
|---|---|---|---|
| P-01 | Plantilla dental ficticia. Hasta que exista y entre en el catálogo, `/sectores/clinicas-dentales/` sale sin bloque de plantillas. Se encarga aparte en `plantillas-negocios-web`. | Álvaro | No |
| P-02 | ¿Se dan de alta en el catálogo las cuatro plantillas de asesoría que hay en local (`casillas`, `cinta-sumadora`, `expediente`, `sello`)? No están en `plantillas.ts` ni en el `REGISTRO.md` del taller. Si entran, el contador «30 plantillas» de la web cambia. | Álvaro | No |
| P-03 | Revisar los textos de las tres páginas de sector y del catálogo de mejoras antes de publicar. Los redacta el implementador. | Álvaro | Publicar |
| P-05 | Widget del chatbot (`feat/chatbot`): lo que se mergee segundo lo adapta a los tokens de la 002. | Álvaro | No |
| P-06 | Miniatura del reel del hero: portada de `panaderia` por ahora; cambiar por un fotograma real del estudio cuando exista. | Álvaro | No |
| P-07 | ¿Se regenera `og.png` con el lema nuevo? Lleva grabado el viejo y la paleta vieja; DIRECCION dice «sin cambios». Mientras tanto, el `alt` de OG va fijo. | Álvaro | No |

## Conflictos

C-19 (tope de tareas largas, §3.15) resuelto el 2026-10-16 con la opción (a): D-028.

| Nº | Conflicto | Opciones | Spec | Abierto |
|---|---|---|---|---|
| C-20 | Con D-028 aplicado (GSAP, ScrollTrigger y Lenis por `import()` tras hidratar; JS inicial de la portada de 839 a 702 KB), el tope «ninguna tarea larga > 200 ms» del §3.15 **sigue sin cumplirse**: la tarea más larga de cada carga da **217-398 ms** (A/B intercalado del 2026-10-16 con la máquina lenta; sin D-028, 230-407 ms: la diferencia no sale del ruido). Las tareas que pasan de 200 ms ya no son de GSAP: el arranque de Next (evaluar `react-dom` y los módulos de la página, 260-360 ms) y el commit de la hidratación (250-280 ms). La llegada de GSAP va en tres tareas de 75-97 ms. | (a) Partir la hidratación: `<Suspense>` alrededor de las zonas de cliente de debajo del hero (Diagnóstico, formulario de la auditoría, Proceso, Hilo) para que React las hidrate en tareas separadas, o cargarlas con `next/dynamic` para bajar el arranque. La ganancia hay que medirla (PR `fix/rd-…`). (b) Mantener el tope y medir solo con la máquina a toda velocidad, con una tarea de calibración. (c) Cambiar el tope de la spec (p. ej. 400 ms) o contar solo lo que pasa después de hidratar. | 002 §3.15 | 2026-10-16 |
