"""Junta fav-16/32/48.png en un favicon.ico. Uso: python -I favicon_ico.py <tmp> <salida.ico>"""
import sys
from pathlib import Path

from PIL import Image

tmp, salida = Path(sys.argv[1]), Path(sys.argv[2])
imgs = [Image.open(tmp / f"fav-{t}.png").convert("RGBA") for t in (16, 32, 48)]
imgs[-1].save(salida, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[:-1])
print("ok", salida, salida.stat().st_size)
