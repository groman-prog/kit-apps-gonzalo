# Genera las fuentes del kit en public/fonts/ a partir de Lexend (OFL, google/fonts).
# Uso: pip install fonttools brotli && python3 scripts/generar-fuentes.py
# Salida: lexend-latin.woff2, lexend-latin-ext.woff2 (variables, eje wght completo),
#         cifras-gr-400/500/600.woff2 (solo 0-9 a ancho fijo) y OFL-Lexend.txt
import os, urllib.request
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(RAIZ, "public", "fonts"); os.makedirs(OUT, exist_ok=True)
BASE = "https://github.com/google/fonts/raw/main/ofl/lexend/"
SRC = os.path.join(OUT, "_Lexend.ttf")
urllib.request.urlretrieve(BASE + "Lexend%5Bwght%5D.ttf", SRC)
urllib.request.urlretrieve(BASE + "OFL.txt", os.path.join(OUT, "OFL-Lexend.txt"))

def rangos(txt):
    u = set()
    for p in txt.split(","):
        p = p.strip().replace("U+", "")
        if "-" in p:
            a, b = p.split("-"); u.update(range(int(a, 16), int(b, 16) + 1))
        else:
            u.add(int(p, 16))
    return u

LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
LATIN_EXT = "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF"

for nombre, r in (("lexend-latin", LATIN), ("lexend-latin-ext", LATIN_EXT)):
    f = TTFont(SRC)
    o = subset.Options(); o.flavor = "woff2"; o.layout_features = ["*"]; o.name_IDs = ["*"]
    s = subset.Subsetter(o); s.populate(unicodes=rangos(r)); s.subset(f)
    f.flavor = "woff2"; f.save(os.path.join(OUT, nombre + ".woff2")); print(nombre)

for w in (400, 500, 600):
    f = instantiateVariableFont(TTFont(SRC), {"wght": w})
    cm = f.getBestCmap(); nombres = [cm[ord(c)] for c in "0123456789"]
    hm = f["hmtx"]; glyf = f["glyf"]; W = max(hm[n][0] for n in nombres)
    for n in nombres:
        adv, lsb = hm[n]; dx = (W - adv) // 2; g = glyf[n]
        if g.isComposite():
            for c in g.components: c.x += dx
        elif g.numberOfContours > 0:
            g.coordinates.translate((dx, 0))
        g.recalcBounds(glyf); hm[n] = (W, getattr(g, "xMin", lsb + dx))
    o = subset.Options(); o.flavor = "woff2"; o.layout_features = []; o.name_IDs = ["*"]
    s = subset.Subsetter(o); s.populate(unicodes=[ord(c) for c in "0123456789"]); s.subset(f)
    for rec in f["name"].names:
        if rec.nameID in (1, 4, 16): rec.string = "Cifras GR"
        elif rec.nameID == 6: rec.string = f"CifrasGR-{w}"
        elif rec.nameID == 3: rec.string = f"CifrasGR-{w}-1.0"
    f.flavor = "woff2"; f.save(os.path.join(OUT, f"cifras-gr-{w}.woff2")); print("cifras", w, W)
os.remove(SRC)
