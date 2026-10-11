# Decisiones · Subcon Works

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

## Pendientes

| Nº | Pendiente | Quién | Bloquea |
|---|---|---|---|
| P-01 | Plantilla dental ficticia. Hasta que exista y entre en el catálogo, `/sectores/clinicas-dentales/` sale sin bloque de plantillas. Se encarga aparte en `plantillas-negocios-web`. | Álvaro | No |
| P-02 | ¿Se dan de alta en el catálogo las cuatro plantillas de asesoría que hay en local (`casillas`, `cinta-sumadora`, `expediente`, `sello`)? No están en `plantillas.ts` ni en el `REGISTRO.md` del taller. Si entran, el contador «30 plantillas» de la web cambia. | Álvaro | No |
| P-03 | Revisar los textos de las tres páginas de sector y del catálogo de mejoras antes de publicar. Los redacta el implementador. | Álvaro | Publicar |

## Conflictos

Ninguno abierto.
