# Marca de Undertactics

Símbolo del iceberg (la punta sobre la superficie lima, el bloque grande debajo)
y el nombre con «under» en Instrument Sans 400 apagado y «tactics» en 700.
El texto está pasado a curvas: los SVG no necesitan la letra instalada.

| Fichero | Para qué |
|---|---|
| `undertactics-logo-oscuro.svg` / `.png` | Logo sobre fondo oscuro (la web, vídeos) |
| `undertactics-logo-claro.svg` / `.png` | Logo sobre fondo claro (facturas, documentos, informes) |
| `undertactics-simbolo-oscuro.svg` / `-claro.svg` | Solo el iceberg, sin fondo |
| `undertactics-icono.svg`, `png/undertactics-icono-512.png` / `-1024.png` | Iceberg en cuadrado oscuro: avatar de redes, WhatsApp Business, Google |

Colores: fondo `#08090a`, texto `#f2f3f4`, apagado `#8a9099`, lima `#c9f24d`
(sobre claro: `#0b0c0d`, `#60666e`, lima oscuro `#5f7d00`).

En la web el logo es el componente `src/components/ui/Logo.tsx` (HTML + SVG en
línea, con la letra de la página). De estos ficheros salen también
`src/app/favicon.ico`, `src/app/apple-icon.png` y `public/og.png`.

## Regenerar

La geometría del símbolo vive en dos sitios que tienen que coincidir:
`src/components/ui/Logo.tsx` y `SIMBOLO` en `scripts/marca/logo_svg.py`. Si cambia,
se cambia en los dos y se vuelve a sacar todo desde la raíz del repo:

```sh
# 1. La letra (variable, de Google Fonts), en una carpeta aparte
mkdir -p /tmp/fuente && curl -sSL -o /tmp/fuente/InstrumentSans.ttf \
  "https://github.com/google/fonts/raw/main/ofl/instrumentsans/InstrumentSans%5Bwdth%2Cwght%5D.ttf"
# 2. SVG con el texto a curvas (pip install fonttools uharfbuzz)
python -I scripts/marca/logo_svg.py /tmp/fuente/InstrumentSans.ttf marca
# 3. PNG, apple-icon.png y public/og.png con el Chromium de Playwright
node scripts/marca/rasterizar.mjs . /tmp/marca-raster
# 4. favicon.ico (16/32/48) con Pillow
python -I scripts/marca/favicon_ico.py /tmp/marca-raster src/app/favicon.ico
```

Después, subir el `?v=` de `og.png` en `src/app/layout.tsx`.
