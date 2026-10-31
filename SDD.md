# SDD · Undertactics (web del estudio)

La web ya funciona y se publicó sin SDD. Este índice empieza con la primera
funcionalidad que se especifica antes de programarla; lo anterior (portada,
plantillas, herramientas, auditoría) no tiene spec y no hace falta escribírsela.

Decisiones, pendientes y conflictos: [DECISIONES.md](DECISIONES.md).

## Principios que no se negocian

- **Nada falso.** No hay clientes todavía: se enseñan plantillas ficticias y se
  dice que lo son. Nunca webs de negocios reales que no lo hayan autorizado.
- **Copy de capacidad, no de condiciones** («lo montamos», no «sin permanencia»).
- **Noindex en todas las páginas** mientras el estudio no tenga dominio propio.
- **La numeración P1–P36 de la auditoría no se toca** (el kit 03 la cita).
- Export estático en GitHub Pages: nada que necesite servidor propio.

## Specs

| Nº | Título | Estado | Depende de | Plan | Tareas |
|---|---|---|---|---|---|
| 001 | [Diagnóstico rápido y páginas por sector](specs/001-diagnostico-y-sectores/spec.md) | hecha | — | [plan](specs/001-diagnostico-y-sectores/plan.md) (aprobado, D-012) | [tareas](specs/001-diagnostico-y-sectores/tasks.md) (T01-T15) |
| 002 | [Rediseño «Por debajo»](specs/002-rediseno-por-debajo/spec.md) | aprobada (D-024) | 001 | [plan](specs/002-rediseno-por-debajo/plan.md) (aprobado, D-025) | [tareas](specs/002-rediseno-por-debajo/tasks.md) (T01-T21) |
| 003 | [Posicionamiento y textos](specs/003-posicionamiento-y-textos/spec.md) | aprobada (D-032) | 001, 002 | [plan](specs/003-posicionamiento-y-textos/plan.md) (aprobado, D-034) | [tareas](specs/003-posicionamiento-y-textos/tasks.md) (T01-T12) |
