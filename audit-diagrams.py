#!/usr/bin/env python3
"""
audit-diagrams.py — static layout linter for the hand-authored inline SVG
diagrams used throughout the PsychoPharmRef blog.

It parses every inline <svg>...</svg> block and flags the recurring authoring
mistakes that produce visually broken diagrams:

  1. INVALID_COLOR   fill/stroke set to a non-color like "#bg3" / "#accent2"
                     (renders solid black or is ignored — the black-box bug).
  2. TEXT_OOB        text runs past the SVG viewBox edge (clipped/overflowing).
  3. TEXT_OVERFLOW   text is wider than the box it sits inside.
  4. BOX_OVERLAP     two boxes partially overlap (neither contains the other).
  5. TEXT_OVERLAP    two text labels overlap (overlapping words).

Text widths are measured with real DejaVu font metrics (PIL), scaled to
approximate the browser UI sans-serif, so overflow detection is reliable.

Usage:
    python3 audit-diagrams.py                 # audit blog/*.html + index.html
    python3 audit-diagrams.py blog/foo.html   # audit specific file(s)
    python3 audit-diagrams.py --report out.html
"""

import sys, os, re, glob, math, html as htmllib
import xml.etree.ElementTree as ET
from PIL import ImageFont

# ---- tunables ---------------------------------------------------------------
UI_SCALE = 0.94        # DejaVu -> typical browser UI sans width ratio
OVERFLOW_PAD = 8       # px past a box edge before text counts as overflow
OOB_PAD = 8            # px past the viewBox before text counts as OOB
BOX_MIN_W, BOX_MIN_H = 28, 16   # min size for a rect to count as a "box"
DISPLAY_W = 820        # diagrams are CSS-capped at max-width:820px
MIN_EFF_FONT = 9.0     # flag labels that render smaller than this on screen
OVERLAP_FRAC = 0.12    # min overlap area (fraction of smaller box) to flag
CONTAIN_PAD = 2        # slack when deciding if box A contains box B

FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
_font_cache = {}

VALID_NAMED = set("""black silver gray grey white maroon red purple fuchsia green
lime olive yellow navy blue teal aqua orange none transparent currentcolor
darkgreen darkred crimson steelblue royalblue firebrick forestgreen goldenrod
tomato dimgray dimgrey slategray lightgray lightgrey""".split())


def font_len(text, size, bold=False):
    size = max(4, int(round(size)))
    key = (size, bold)
    f = _font_cache.get(key)
    if f is None:
        f = ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)
        _font_cache[key] = f
    return f.getlength(text) * UI_SCALE


def color_ok(v):
    if v is None:
        return True
    v = v.strip().lower()
    if v == "" or v in VALID_NAMED or v in ("inherit", "context-fill", "context-stroke"):
        return True
    if v.startswith("url(") or v.startswith("rgb") or v.startswith("hsl") or v.startswith("var("):
        return True
    if re.fullmatch(r"#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})", v):
        return True
    return False


def fnum(v, default=0.0):
    if v is None:
        return default
    m = re.match(r"-?\d*\.?\d+", str(v).strip())
    return float(m.group()) if m else default


def local(tag):
    if not isinstance(tag, str):   # lxml comment / PI nodes have callable tags
        return ""
    return tag.split("}")[-1] if "}" in tag else tag


STYLE_PROPS = ("font-size", "text-anchor", "font-weight", "fill", "stroke")


def parse_css(style_text):
    """Parse a <style> block into {class_name: {prop: val}} (simple rules)."""
    cmap = {}
    for sel, body in re.findall(r"\.([\w-]+)\s*\{([^}]*)\}", style_text):
        props = {}
        for pm in re.finditer(r"([\w-]+)\s*:\s*([^;]+)", body):
            p, v = pm.group(1).strip(), pm.group(2).strip()
            if p in STYLE_PROPS:
                props[p] = v
        if props:
            cmap[sel] = props
    return cmap


def collect(elem, inh, out, counter, cmap=None):
    """Walk the SVG tree, resolving inherited font-size/anchor/weight/fill.
    Precedence (low->high): presentation attr < CSS class < inline style."""
    a = elem.attrib
    cur = dict(inh)
    for k in STYLE_PROPS:
        if k in a:
            cur[k] = a[k]
    # CSS class rules override presentation attributes.
    cls = a.get("class")
    if cls and cmap:
        for c in cls.split():
            for prop, val in cmap.get(c, {}).items():
                cur[prop] = val
    # inline style="" overrides everything.
    style = a.get("style")
    if style:
        for pm in re.finditer(r"([\w-]+)\s*:\s*([^;]+)", style):
            prop, val = pm.group(1).strip(), pm.group(2).strip()
            if prop in STYLE_PROPS:
                cur[prop] = val
    tag = local(elem.tag)
    rec = {"tag": tag, "attr": a, "inh": cur, "order": counter[0],
           "rot": parse_rotate(a.get("transform"))}
    counter[0] += 1

    if tag == "text":
        parts = []
        if elem.text:
            parts.append(elem.text)
        for ch in elem:
            if ch.text:
                parts.append(ch.text)
            if ch.tail:
                parts.append(ch.tail)
        rec["content"] = htmllib.unescape("".join(parts)).strip()
        out.append(rec)
    elif tag in ("rect", "circle", "ellipse", "line", "path", "polygon"):
        out.append(rec)

    for ch in elem:
        collect(ch, cur, out, counter, cmap)


def parse_rotate(tf):
    """Return (angle, cx, cy) for a rotate() transform, else None."""
    if not tf or "rotate" not in tf:
        return None
    m = re.search(r"rotate\(\s*(-?[\d.]+)(?:[ ,]+(-?[\d.]+)[ ,]+(-?[\d.]+))?\s*\)", tf)
    if not m:
        return None
    ang = float(m.group(1))
    cx = float(m.group(2)) if m.group(2) is not None else 0.0
    cy = float(m.group(3)) if m.group(3) is not None else 0.0
    return (ang, cx, cy)


def text_bbox(rec):
    a = rec["attr"]; inh = rec["inh"]
    x = fnum(a.get("x")); y = fnum(a.get("y"))
    fs = fnum(inh.get("font-size"), 12)
    bold = "bold" in str(inh.get("font-weight", "")) or fnum(inh.get("font-weight"), 400) >= 600
    w = font_len(rec["content"], fs, bold)
    anchor = (inh.get("text-anchor") or "start").strip()
    if anchor == "middle":
        x0, x1 = x - w / 2, x + w / 2
    elif anchor == "end":
        x0, x1 = x - w, x
    else:
        x0, x1 = x, x + w
    y0, y1 = y - fs * 0.80, y + fs * 0.22
    rot = rec.get("rot")
    if rot:
        ang, cx, cy = rot
        rad = math.radians(ang)
        cos, sin = math.cos(rad), math.sin(rad)
        xs, ys = [], []
        for px, py in ((x0, y0), (x1, y0), (x1, y1), (x0, y1)):
            dx, dy = px - cx, py - cy
            xs.append(cx + dx * cos - dy * sin)
            ys.append(cy + dx * sin + dy * cos)
        return min(xs), min(ys), max(xs), max(ys), fs
    return x0, y0, x1, y1, fs


def rect_box(rec):
    a = rec["attr"]
    return (fnum(a.get("x")), fnum(a.get("y")),
            fnum(a.get("width")), fnum(a.get("height")))


def overlap_area(a, b):
    ax, ay, aw, ah = a; bx, by, bw, bh = b
    ix = max(0, min(ax + aw, bx + bw) - max(ax, bx))
    iy = max(0, min(ay + ah, by + bh) - max(ay, by))
    return ix * iy


def contains(a, b, pad=CONTAIN_PAD):
    ax, ay, aw, ah = a; bx, by, bw, bh = b
    return (ax - pad <= bx and ay - pad <= by and
            ax + aw + pad >= bx + bw and ay + ah + pad >= by + bh)


def audit_svg(svg_text):
    issues = []
    # HTML-tolerant sanitation: turn bare & into &amp;, and resolve named
    # entities (&rarr; &times; ...) that XML doesn't predefine into unicode.
    safe = re.sub(r"&(?!#?\w+;)", "&amp;", svg_text)

    def _ent(m):
        name = m.group(1)
        if name in ("amp", "lt", "gt", "quot", "apos"):
            return m.group(0)
        u = htmllib.unescape("&" + name + ";")
        return u if u != "&" + name + ";" else m.group(0)
    safe = re.sub(r"&([a-zA-Z][a-zA-Z0-9]+);", _ent, safe)

    root = None
    try:
        root = ET.fromstring(safe)
    except ET.ParseError:
        try:
            import lxml.etree as LET
            parser = LET.XMLParser(recover=True)   # tolerates dup attrs etc.
            root = LET.fromstring(safe.encode("utf-8"), parser=parser)
        except Exception as e:
            return [("PARSE_ERROR", f"could not parse SVG: {e}")]
    if root is None:
        return [("PARSE_ERROR", "could not parse SVG")]

    vb = root.attrib.get("viewBox")
    if vb:
        p = [fnum(x) for x in re.split(r"[ ,]+", vb.strip())]
        vminx, vminy, vw, vh = p[0], p[1], p[2], p[3]
    else:
        vminx, vminy = 0, 0
        vw = fnum(root.attrib.get("width"), 0)
        vh = fnum(root.attrib.get("height"), 0)

    cmap = parse_css(safe) if "<style" in safe else None
    elems = []
    collect(root, {}, elems, [0], cmap)
    texts = [e for e in elems if e["tag"] == "text" and e.get("content")]
    rects = [e for e in elems if e["tag"] == "rect"]
    boxes = [(e, rect_box(e)) for e in rects
             if rect_box(e)[2] >= BOX_MIN_W and rect_box(e)[3] >= BOX_MIN_H]

    # 1. invalid colors
    for e in elems:
        for k in ("fill", "stroke"):
            v = e["attr"].get(k)
            if v is not None and not color_ok(v):
                issues.append(("INVALID_COLOR",
                               f'<{e["tag"]}> {k}="{v}" is not a valid color'))

    # text bboxes
    tb = {id(e): text_bbox(e) for e in texts}

    # 1b. text rendered too small. Diagrams display at roughly the article
    # column width, so a large viewBox shrinks every label; we flag by the
    # *effective* on-screen size, not the raw user-unit font-size.
    scale = min(1.0, DISPLAY_W / vw) if vw else 1.0
    small = []
    for e in texts:
        fs = fnum(e["inh"].get("font-size"), 12)
        eff = fs * scale
        if eff < MIN_EFF_FONT:
            small.append((eff, fs, e["content"]))
    if small:
        small.sort()
        eff, fs, content = small[0]
        issues.append(("SMALL_FONT",
                       f'{len(small)} label(s) render < {MIN_EFF_FONT:g}px; '
                       f'smallest "{short(content)}" ~{eff:.1f}px '
                       f'(font-size {fs:g}, viewBox scaled {scale:.2f})'))

    # 2. text out of viewBox
    if vw and vh:
        for e in texts:
            x0, y0, x1, y1, fs = tb[id(e)]
            if x1 > vminx + vw + OOB_PAD or x0 < vminx - OOB_PAD or y1 > vminy + vh + OOB_PAD:
                over = max(x1 - (vminx + vw), (vminx) - x0, y1 - (vminy + vh))
                issues.append(("TEXT_OOB",
                               f'"{short(e["content"])}" runs ~{over:.0f}px past the canvas edge'))

    # 3. text overflow inside its enclosing box
    for e in texts:
        x0, y0, x1, y1, fs = tb[id(e)]
        cx = (x0 + x1) / 2; cy = (y0 + y1) / 2
        best = None
        for be, bb in boxes:
            bx, by, bw, bh = bb
            if bx <= cx <= bx + bw and by <= cy <= by + bh:
                area = bw * bh
                if best is None or area < best[1]:
                    best = (bb, area)
        if best:
            bx, by, bw, bh = best[0]
            out = max(bx - x0, x1 - (bx + bw))   # real px past the box edge
            if out > OVERFLOW_PAD:
                issues.append(("TEXT_OVERFLOW",
                               f'"{short(e["content"])}" is wider than its box (~{out:.0f}px over)'))

    # 4. partially overlapping boxes
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            ba, bb = boxes[i][1], boxes[j][1]
            oa = overlap_area(ba, bb)
            if oa <= 0:
                continue
            if contains(ba, bb) or contains(bb, ba):
                continue
            smaller = min(ba[2] * ba[3], bb[2] * bb[3])
            if smaller > 0 and oa / smaller >= OVERLAP_FRAC:
                issues.append(("BOX_OVERLAP",
                               f'two boxes overlap (~{oa/smaller*100:.0f}% of the smaller one)'))

    # 5. overlapping text labels
    tl = list(texts)
    for i in range(len(tl)):
        for j in range(i + 1, len(tl)):
            a = tb[id(tl[i])]; b = tb[id(tl[j])]
            ix = min(a[2], b[2]) - max(a[0], b[0])
            iy = min(a[3], b[3]) - max(a[1], b[1])
            if ix > 5 and iy > 4:
                issues.append(("TEXT_OVERLAP",
                               f'labels overlap: "{short(tl[i]["content"])}" / "{short(tl[j]["content"])}"'))

    # de-dup while preserving order
    seen = set(); uniq = []
    for it in issues:
        if it not in seen:
            seen.add(it); uniq.append(it)
    return uniq


def short(s, n=40):
    s = " ".join(s.split())
    return s if len(s) <= n else s[:n - 1] + "…"


SVG_RE = re.compile(r"<svg\b.*?</svg>", re.DOTALL | re.IGNORECASE)


def line_of(text, idx):
    return text.count("\n", 0, idx) + 1


def main():
    report_path = None
    argv = sys.argv[1:]
    args = []
    i = 0
    while i < len(argv):
        if argv[i] == "--report":
            report_path = argv[i + 1]
            i += 2
            continue
        if argv[i].startswith("--"):
            i += 1
            continue
        args.append(argv[i])
        i += 1

    root = os.path.dirname(os.path.abspath(__file__))
    if args:
        files = args
    else:
        files = sorted(glob.glob(os.path.join(root, "blog", "*.html")))
        idx = os.path.join(root, "index.html")
        if os.path.exists(idx):
            files.append(idx)

    SEV = {"INVALID_COLOR": 0, "TEXT_OOB": 1, "BOX_OVERLAP": 2,
           "TEXT_OVERFLOW": 3, "TEXT_OVERLAP": 4, "SMALL_FONT": 5,
           "PARSE_ERROR": 6}
    flagged = []          # (file, line, svg_text, issues)
    counts = {}
    n_svg = 0
    for f in files:
        try:
            txt = open(f, encoding="utf-8").read()
        except Exception:
            continue
        for m in SVG_RE.finditer(txt):
            n_svg += 1
            issues = audit_svg(m.group())
            if issues:
                for k, _ in issues:
                    counts[k] = counts.get(k, 0) + 1
                flagged.append((os.path.relpath(f, root), line_of(txt, m.start()),
                                m.group(), issues))

    flagged.sort(key=lambda r: min(SEV.get(i[0], 9) for i in r[3]))

    print(f"Scanned {n_svg} SVG diagrams in {len(files)} files.")
    print(f"Flagged {len(flagged)} diagrams.\n")
    for k in sorted(counts, key=lambda k: SEV.get(k, 9)):
        print(f"  {k:16s} {counts[k]}")
    print()
    for f, ln, _svg, issues in flagged:
        print(f"{f}:{ln}")
        for k, msg in issues:
            print(f"    [{k}] {msg}")

    if report_path:
        write_report(report_path, n_svg, len(files), flagged, counts, SEV,
                     css_vars=read_css_vars(root))
        print(f"\nVisual report: {report_path}")


def read_css_vars(root):
    """Pull :root custom properties from the site stylesheet so the report's
    embedded SVGs (which use fill="var(--accent)" etc.) render in real colors
    instead of falling back to black."""
    css = os.path.join(root, "css", "styles.css")
    pairs = {}
    if os.path.exists(css):
        txt = open(css, encoding="utf-8").read()
        m = re.search(r":root\s*\{(.*?)\}", txt, re.DOTALL)
        block = m.group(1) if m else txt
        for k, v in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", block):
            pairs.setdefault(k.strip(), v.strip())
    return pairs


def write_report(path, n_svg, n_files, flagged, counts, SEV, css_vars=None):
    esc = htmllib.escape
    root_vars = ""
    if css_vars:
        root_vars = ":root{" + "".join(f"{k}:{v};" for k, v in css_vars.items()) + "}"
    cards = []
    for f, ln, svg, issues in flagged:
        tags = "".join(
            f'<div class="iss iss-{k}"><b>{k}</b> {esc(msg)}</div>'
            for k, msg in issues)
        cards.append(f"""<div class="card">
  <div class="hd"><span class="fn">{esc(f)}</span><span class="ln">line {ln}</span></div>
  <div class="issues">{tags}</div>
  <div class="svgwrap">{svg}</div>
</div>""")
    summary = "".join(f'<span class="pill">{esc(k)}: {counts[k]}</span>'
                      for k in sorted(counts, key=lambda k: SEV.get(k, 9)))
    doc = f"""<!doctype html><html><head><meta charset="utf-8">
<title>Diagram Audit</title><style>
 {root_vars}
 body{{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#faf7f0;color:#231e14;margin:0;padding:24px}}
 h1{{color:#4a7c35}}
 .pill{{display:inline-block;background:#ece6db;border:1px solid #cfc8ba;border-radius:12px;padding:3px 10px;margin:3px;font-size:13px}}
 .card{{background:#fff;border:1px solid #cfc8ba;border-radius:8px;margin:18px 0;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.06)}}
 .hd{{display:flex;justify-content:space-between;font-weight:bold;margin-bottom:8px}}
 .fn{{color:#8b6914}} .ln{{color:#6b6050;font-weight:normal}}
 .iss{{font-size:13px;padding:4px 8px;border-radius:4px;margin:3px 0;background:#f6efe2}}
 .iss b{{font-family:monospace;font-size:11px;margin-right:6px}}
 .iss-INVALID_COLOR{{background:#fbe3df}} .iss-BOX_COVERS_TEXT{{background:#fbe3df}}
 .iss-TEXT_OOB{{background:#fdeede}} .iss-BOX_OVERLAP{{background:#fdeede}}
 .svgwrap{{border:1px dashed #cfc8ba;border-radius:6px;padding:8px;margin-top:8px;background:#fdfcf9;overflow:auto}}
 .svgwrap svg{{max-width:100%;height:auto}}
</style></head><body>
<h1>Diagram Audit Report</h1>
<p>Scanned <b>{n_svg}</b> inline SVG diagrams across <b>{n_files}</b> files.
Flagged <b>{len(flagged)}</b> for review.</p>
<p>{summary}</p>
<p style="color:#6b6050;font-size:13px">Heuristic linter — each flagged diagram is rendered below so you can confirm. Text-width checks use font metrics and may occasionally over-flag tight-but-ok labels.</p>
{''.join(cards)}
</body></html>"""
    open(path, "w", encoding="utf-8").write(doc)


if __name__ == "__main__":
    main()
