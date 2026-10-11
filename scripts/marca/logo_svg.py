"""Genera los SVG de marca de Undertactics con el texto pasado a curvas.

Uso: python -I logo_svg.py <fuente_variable.ttf> <carpeta_salida>
Reproduce el componente Logo de la web: símbolo de 1,3 em, hueco de 0,35 em,
«under» en 400 y «tactics» en 700, tracking -0,035 em, símbolo centrado a
0,36 em sobre la línea base (lo que da `items-center` con `leading-none`).
"""
import io
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FUENTE, SALIDA = Path(sys.argv[1]), Path(sys.argv[2])
SALIDA.mkdir(parents=True, exist_ok=True)

EM = 100.0  # tamaño de letra en unidades del SVG
TRACK = -0.035 * EM
SIM = 1.3 * EM
HUECO = 0.35 * EM
CENTRO = 0.36 * EM  # centro del símbolo sobre la línea base

PALETAS = {
    "oscuro": {"fg": "#f2f3f4", "muted": "#8a9099", "accent": "#c9f24d"},
    "claro": {"fg": "#0b0c0d", "muted": "#60666e", "accent": "#5f7d00"},
}

SIMBOLO = (
    '<path d="M14 21.5 23 7.5l11 14z" fill="{fg}"/>'
    '<path d="M4 21.5h40" fill="none" stroke="{accent}" stroke-width="{linea}" stroke-linecap="round"/>'
    '<path d="M10 25.5h28l5.5 8.5-9 10.5H17L5.5 33z" fill="{muted}" fill-opacity="{relleno}" '
    'stroke="{muted}" stroke-width="{borde}" stroke-linejoin="round"/>'
)
FINO = {"linea": 2.5, "borde": 2.5, "relleno": 0.16}
GRUESO = {"linea": 4, "borde": 3.5, "relleno": 0.3}  # icono: legible a 16 px


def instancia(peso):
    f = TTFont(FUENTE)
    est = instancer.instantiateVariableFont(f, {"wght": peso, "wdth": 100})
    buf = io.BytesIO()
    est.save(buf)
    return est, buf.getvalue()


def trazar(texto, peso, x0):
    """Devuelve (path_d, x_final) del texto con su línea base en y=0."""
    tt, datos = instancia(peso)
    upem = tt["head"].unitsPerEm
    escala = EM / upem
    face = hb.Face(datos)
    font = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(texto)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": False})
    gs = tt.getGlyphSet()
    orden = tt.getGlyphOrder()
    x = x0
    partes = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        nombre = orden[info.codepoint]
        pen = SVGPathPen(gs)
        gx = x + pos.x_offset * escala
        # y hacia abajo en SVG: invertir el eje de la fuente
        gs[nombre].draw(TransformPen(pen, (escala, 0, 0, -escala, gx, -pos.y_offset * escala)))
        d = pen.getCommands()
        if d:
            partes.append(d)
        x += pos.x_advance * escala + TRACK
    return " ".join(partes), x


def logo(paleta):
    c = PALETAS[paleta]
    x_texto = SIM + HUECO
    d_under, x = trazar("under", 400, x_texto)
    d_tactics, x_fin = trazar("tactics", 700, x)
    ancho = x_fin - TRACK  # el último tracking no ocupa
    # caja vertical: el símbolo (1,3 em) manda sobre la altura del texto
    arriba = -CENTRO - SIM / 2
    alto = SIM
    k = SIM / 48
    sim = SIMBOLO.format(**c, **FINO)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {arriba:.2f} {ancho:.2f} {alto:.2f}" '
        f'width="{ancho:.0f}" height="{alto:.0f}" role="img" aria-label="Undertactics">'
        f"<title>Undertactics</title>"
        f'<g transform="translate(0 {arriba:.2f}) scale({k:.5f})">{sim}</g>'
        f'<path fill="{c["muted"]}" d="{d_under}"/>'
        f'<path fill="{c["fg"]}" d="{d_tactics}"/>'
        "</svg>\n"
    )


def simbolo(paleta):
    c = PALETAS[paleta]
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" '
        'role="img" aria-label="Undertactics"><title>Undertactics</title>'
        + SIMBOLO.format(**c, **FINO)
        + "</svg>\n"
    )


def icono():
    """Símbolo sobre cuadrado oscuro redondeado: favicon, avatar de redes."""
    c = PALETAS["oscuro"]
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">'
        '<rect width="48" height="48" rx="10.5" fill="#08090a"/>'
        '<g transform="translate(3.84 3.84) scale(.84)">' + SIMBOLO.format(**c, **GRUESO) + "</g></svg>\n"
    )


for p in PALETAS:
    (SALIDA / f"undertactics-logo-{p}.svg").write_text(logo(p), encoding="utf-8")
    (SALIDA / f"undertactics-simbolo-{p}.svg").write_text(simbolo(p), encoding="utf-8")
(SALIDA / "undertactics-icono.svg").write_text(icono(), encoding="utf-8")
print("ok", sorted(x.name for x in SALIDA.glob("*.svg")))
