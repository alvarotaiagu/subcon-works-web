@AGENTS.md

## SDD

Las funcionalidades nuevas grandes se especifican antes de programarlas: índice en `SDD.md`, decisiones (D-xxx), pendientes (P-xx) y conflictos (C-xx) en `DECISIONES.md`, specs en `specs/NNN-nombre/`.

## Seguimiento en los documentos

Al mergear una PR que cierra una idea o tarea, márcala en el documento «Ideas · Undertactics» (https://claude.ai/code/artifact/d3f6e511-659f-4b67-8c17-de0191d9df5b, columna Estado) y en el «Plan · …» que corresponda: `hecho · PR #n · fecha`. Solo si está mergeada y comprobada, y con un cambio pequeño por búsqueda de texto, sin releer el documento entero. Si el documento no se puede editar, dilo en vez de saltarlo.

## Documentos vivos

- Ideas · Undertactics (estado de cada idea): https://claude.ai/code/artifact/d3f6e511-659f-4b67-8c17-de0191d9df5b
- Plan · spec 002 «Rediseño Por debajo» (oleadas, prompts, estado de T01-T21): https://claude.ai/artifact/SoxrAJeexnVnjGziPygcKo
- Plan · spec 001 «Diagnóstico y sectores» (hecha): https://claude.ai/artifact/G9nsiV1meqaZN7wHkhvTaX
- Logos: https://claude.ai/artifact/W2LZLX345zgtxaUHaYJRRs

El rediseño se integra en `feat/rediseno-por-debajo`; nada de ello llega a `main` (y a Pages) hasta T21.
