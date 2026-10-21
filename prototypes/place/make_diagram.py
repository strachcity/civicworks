"""Builds the "An organisation is a place too" diagram as editable SVG.

The neighbourhood stack is the thesis figure (after Pagh & Cook 2023); the organisation
stack uses the same geometry with different material. Labels and descriptions live in
LAYERS so they're easy to swap.

    python3 make_diagram.py    writes place-diagram-single.svg (the organisation alone),
                               place-diagram.svg (side by side) and place-diagram-mobile.svg (stacked)
"""
from html import escape

# ---- copy. Swap labels here. No colons or em dashes.
LAYERS = [
    # (neighbourhood label, organisation label, organisation description, shifts)
    ("SOCIAL INFRASTRUCTURE", "SOCIAL INFRASTRUCTURE",
     "The relationships, networks and communities of practice that people lean on to get things done together", False),
    ("GOVERNANCE", "GOVERNANCE",
     "The rules, decision rights and assurance that decide what can change, and who gets to say so", False),
    ("PHYSICAL INFRASTRUCTURE", "PHYSICAL INFRASTRUCTURE",
     "The systems, tools, documents and offices that the everyday work flows through", False),
    ("NATURE", "CULTURE",
     "The habits, history and language an organisation grows from. The slowest ground of all", True),
    ("THE NEIGHBOURHOOD SCALE", "THE PLACE OF WORK",
     "Where each of these comes together and becomes lived experience for the people doing the work", True),
]
HEAD_LEFT, HEAD_RIGHT = "A NEIGHBOURHOOD", "AN ORGANISATION"
CREDIT = "Left adapted from Pagh & Cook (2023), illustrated by the author. Right, the author."
CREDIT_STACKED = "Top adapted from Pagh & Cook (2023), illustrated by the author. Bottom, the author."
CREDIT_SINGLE = "Adapted from the author's thesis, after Pagh & Cook (2023)."
# On its own, the organisation keeps one accent, on the layer where the work is lived
SINGLE_ACCENT = {4}

# ---- look, shared with the navigation prototype
FONT = '"Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif'
LINE, TEXT, SOFT = "#1d1d1b", "#1d1d1b", "#55524e"
INK, INK_TEXT, TINT = "#d63c23", "#a92c17", "#f6c6b8"
MUTED = 0.45   # ink opacity for the neighbourhood stack
ISO = 0.44     # diamond height to width, a little flatter than true isometric so it reads wide
DOT = 'stroke-dasharray="1.2 3.2" stroke-linecap="round"'


def diamond(cx, cy, s):
    h = s * ISO
    return f"M{cx - s:.1f} {cy:.1f} L{cx:.1f} {cy - h:.1f} L{cx + s:.1f} {cy:.1f} L{cx:.1f} {cy + h:.1f} Z"


def wrap(text, px, width):
    words, lines, line = text.split(), [], ""
    per = width / (px * 0.5)
    for w in words:
        if line and len(line) + len(w) + 1 > per:
            lines.append(line)
            line = w
        else:
            line = (line + " " + w).strip()
    return lines + [line]


def defs(k):
    """Fill patterns and arrowheads. k scales the pattern grain with the drawing."""
    def pat(name, colour, kind):
        if kind == "stipple":
            g, r = 4 * k, .6 * k
            return (f'<pattern id="{name}" width="{g}" height="{g}" patternUnits="userSpaceOnUse">'
                    f'<circle cx="{g/4}" cy="{g/4}" r="{r}" fill="{colour}"/><circle cx="{3*g/4}" cy="{3*g/4}" r="{r}" fill="{colour}"/></pattern>')
        g = 3.2 * k
        return (f'<pattern id="{name}" width="{g}" height="{g}" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">'
                f'<line x1="0" y1="0" x2="0" y2="{g}" stroke="{colour}" stroke-width="{.55 * k}"/></pattern>')
    arrow = lambda name, colour: (f'<marker id="{name}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="{8 * k}" markerHeight="{8 * k}" '
                                  f'markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0.8 L7 4 L0 7.2 Z" fill="{colour}"/></marker>')
    return "<defs>" + "".join([pat("stipple", LINE, "stipple"), pat("hatch", LINE, "hatch"),
                               pat("stipple-acc", INK, "stipple"), pat("hatch-acc", INK, "hatch"),
                               arrow("arrow", LINE), arrow("arrow-acc", INK)]) + "</defs>"


def shifts():
    return {i for i, layer in enumerate(LAYERS) if layer[3]}


def stack(cx, ys, S, k, accent):
    """Five layers: four nested rings growing downward, then the base where they meet.
    accent is the set of layer indices drawn in the accent colour."""
    out = []
    for s in S:
        for x in (cx - s, cx + s):
            out.append(f'<line x1="{x:.1f}" y1="{ys[0]:.1f}" x2="{x:.1f}" y2="{ys[4]:.1f}" stroke="{LINE}" stroke-width="{.6 * k}" {DOT} opacity=".55"/>')
    out.append(f'<line x1="{cx}" y1="{ys[0] - S[3] * ISO:.1f}" x2="{cx}" y2="{ys[4] + S[3] * ISO:.1f}" stroke="{LINE}" stroke-width="{.6 * k}" {DOT} opacity=".55"/>')
    for s in S[1:]:
        out.append(f'<path d="{diamond(cx, ys[0], s)}" fill="none" stroke="{LINE}" stroke-width="{.7 * k}" {DOT} opacity=".7"/>')
    rings = [(None, S[0], "stipple"), (S[0], S[1], "hatch"), (S[1], S[2], "hatch"), (S[2], S[3], "stipple")]
    for i, (inner, outer, fill) in enumerate(rings):
        acc = i in accent
        d = diamond(cx, ys[i], outer) + (" " + diamond(cx, ys[i], inner) if inner else "")
        if acc:
            out.append(f'<path d="{d}" fill="{TINT}" fill-opacity=".45" fill-rule="evenodd"/>')
        out.append(f'<path d="{d}" fill="url(#{fill}{"-acc" if acc else ""})" fill-rule="evenodd" '
                   f'stroke="{INK if acc else LINE}" stroke-width="{.9 * k}" stroke-linejoin="round"/>')
    acc = 4 in accent
    c = INK if acc else LINE
    if acc:
        out.append(f'<path d="{diamond(cx, ys[4], S[3])}" fill="{TINT}" fill-opacity=".25"/>')
    out.append(f'<path d="{diamond(cx, ys[4], S[3])}" fill="none" stroke="{c}" stroke-width="{1.1 * k}" stroke-linejoin="round"/>')
    for s in S[:3]:
        out.append(f'<path d="{diamond(cx, ys[4], s)}" fill="none" stroke="{c}" stroke-width="{.7 * k}" {DOT}/>')
    return out


def outer(S, i):
    return S[min(i, 3)]


def leader(x_from, x_to, y, circle_x, colour, k):
    return (f'<line x1="{x_from:.1f}" y1="{y:.1f}" x2="{x_to:.1f}" y2="{y:.1f}" stroke="{colour}" stroke-width="{.7 * k}" {DOT}/>'
            f'<circle cx="{circle_x:.1f}" cy="{y:.1f}" r="{4.2 * k}" fill="#ffffff" stroke="{colour}" stroke-width="{k}"/>')


def svg_open(W, H, k):
    return [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family=\'{FONT}\'>',
            '<style>@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&amp;display=swap");</style>',
            defs(k), f'<rect width="{W}" height="{H}" fill="#ffffff"/>']


def diptych():
    """Side by side, for desktop and the Substack column."""
    W, H, k = 1456, 1080, 1
    S = [34, 70, 104, 138]
    ys = [210 + i * 175 for i in range(5)]
    CX_L, CX_R, LABEL_L, LABEL_R = 540, 876, 48, 1040
    LAB, DESC = 21, 21
    head = f'font-size="15" font-weight="600" letter-spacing="2.4" fill="{TEXT}"'
    p = svg_open(W, H, k)
    p.append(f'<text x="{CX_L}" y="78" text-anchor="middle" {head} opacity="{MUTED}">{HEAD_LEFT}</text>')
    p.append(f'<text x="{CX_R}" y="78" text-anchor="middle" {head}>{HEAD_RIGHT}</text>')

    p.append(f'<g opacity="{MUTED}">')
    p += stack(CX_L, ys, S, k, set())
    for i, layer in enumerate(LAYERS):
        x = CX_L - outer(S, i)
        p.append(leader(LABEL_L + 330, x + 4, ys[i], x + 9, LINE, k))
        p.append(f'<text x="{LABEL_L}" y="{ys[i] + 7}" font-size="{LAB}" font-weight="600" letter-spacing=".8" fill="{TEXT}">{escape(layer[0])}</text>')
    p.append('</g>')

    # matching layers joined across the clear middle, outside both columns
    for i, layer in enumerate(LAYERS):
        acc = layer[3]
        p.append(f'<line x1="{CX_L + S[3] + 14}" y1="{ys[i]}" x2="{CX_R - S[3] - 14}" y2="{ys[i]}" stroke="{INK if acc else LINE}" '
                 f'stroke-width="{1 if acc else .75}" stroke-dasharray="1.2 3.6" stroke-linecap="round" opacity="{1 if acc else .7}" '
                 f'marker-end="url(#arrow{"-acc" if acc else ""})"/>')

    p += stack(CX_R, ys, S, k, shifts())
    for i, (_, lab, desc, acc) in enumerate(LAYERS):
        x = CX_R + outer(S, i)
        c = INK if acc else LINE
        p.append(leader(x - 4, LABEL_R - 14, ys[i], x - 9, c, k))
        p.append(f'<text x="{LABEL_R}" y="{ys[i] + 7}" font-size="{LAB}" font-weight="600" letter-spacing=".8" fill="{INK_TEXT if acc else TEXT}">{escape(lab)}</text>')
        for n, line in enumerate(wrap(desc, DESC, 370)):
            p.append(f'<text x="{LABEL_R}" y="{ys[i] + 38 + n * 28}" font-size="{DESC}" fill="{SOFT}">{escape(line)}</text>')
    p.append(f'<text x="48" y="{H - 34}" font-size="14" fill="{SOFT}">{escape(CREDIT)}</text>')
    return "\n".join(p + ["</svg>"])


def stacked():
    """Neighbourhood above organisation, for phones. Same drawing, larger type."""
    W, k = 1456, 1.7
    S = [s * k for s in (30, 62, 94, 124)]
    CX, LABEL, LAB, DESC, LH, G = 330, 600, 46, 42, 54, 250
    head = f'font-size="30" font-weight="600" letter-spacing="4.6" fill="{TEXT}"'
    top_a = 260
    ys_a = [top_a + i * 200 for i in range(5)]
    top_b = ys_a[4] + S[3] * ISO + 330
    ys_b = [top_b + i * G for i in range(5)]
    H = int(ys_b[4] + LH * 4 + 160)
    p = svg_open(W, H, k)

    p.append(f'<g opacity="{MUTED}">')
    p.append(f'<text x="{CX}" y="96" text-anchor="middle" {head}>{HEAD_LEFT}</text>')
    p += stack(CX, ys_a, S, k, set())
    for i, layer in enumerate(LAYERS):
        x = CX + outer(S, i)
        p.append(leader(x - 4, LABEL - 20, ys_a[i], x - 12, LINE, k))
        p.append(f'<text x="{LABEL}" y="{ys_a[i] + 15}" font-size="{LAB}" font-weight="600" letter-spacing="1.4" fill="{TEXT}">{escape(layer[0])}</text>')
    p.append('</g>')

    # one join between the two: same layers, carried down
    y1, y2 = ys_a[4] + S[3] * ISO + 50, top_b - S[3] * ISO - 150
    p.append(f'<line x1="{CX}" y1="{y1:.1f}" x2="{CX}" y2="{y2:.1f}" stroke="{LINE}" stroke-width="{1.2}" stroke-dasharray="2 6" stroke-linecap="round" marker-end="url(#arrow)"/>')
    p.append(f'<text x="{CX}" y="{y2 + 90:.1f}" text-anchor="middle" {head}>{HEAD_RIGHT}</text>')

    p += stack(CX, ys_b, S, k, shifts())
    for i, (_, lab, desc, acc) in enumerate(LAYERS):
        x = CX + outer(S, i)
        c = INK if acc else LINE
        p.append(leader(x - 4, LABEL - 20, ys_b[i], x - 12, c, k))
        p.append(f'<text x="{LABEL}" y="{ys_b[i] + 15}" font-size="{LAB}" font-weight="600" letter-spacing="1.4" fill="{INK_TEXT if acc else TEXT}">{escape(lab)}</text>')
        for n, line in enumerate(wrap(desc, DESC, 810)):
            p.append(f'<text x="{LABEL}" y="{ys_b[i] + 15 + LH + n * LH}" font-size="{DESC}" fill="{SOFT}">{escape(line)}</text>')
    p.append(f'<text x="64" y="{H - 60}" font-size="28" fill="{SOFT}">{escape(CREDIT_STACKED)}</text>')
    return "\n".join(p + ["</svg>"])


def single():
    """The organisation on its own: labels on the left as in the thesis original, larger type,
    one accent on the place of work, no panel heading. The caption goes in Substack."""
    # the drawing grows 2.2 times, the line weight only 1.4 times, so it stays a fine drawing
    W, k, kl = 1456, 2.2, 1.4
    S = [s * k for s in (34, 70, 104, 134)]
    CX, LABEL, LAB, DESC, LH, G = 1052, 64, 36, 31, 41, 225
    top = 96 + S[3] * ISO
    ys = [top + i * G for i in range(5)]
    H = int(ys[4] + S[3] * ISO + 150)
    p = svg_open(W, H, kl)
    p += stack(CX, ys, S, kl, SINGLE_ACCENT)
    for i, (_, lab, desc, _) in enumerate(LAYERS):
        acc = i in SINGLE_ACCENT
        x = CX - outer(S, i)
        c = INK if acc else LINE
        p.append(leader(LABEL + 560, x + 6, ys[i], x + 12, c, kl))
        p.append(f'<text x="{LABEL}" y="{ys[i] + 12:.1f}" font-size="{LAB}" font-weight="600" letter-spacing="1.2" fill="{INK_TEXT if acc else TEXT}">{escape(lab)}</text>')
        for n, line in enumerate(wrap(desc, DESC, 560)):
            p.append(f'<text x="{LABEL}" y="{ys[i] + 12 + LH + 4 + n * LH:.1f}" font-size="{DESC}" fill="{SOFT}">{escape(line)}</text>')
    p.append(f'<text x="{LABEL}" y="{H - 52}" font-size="22" fill="{SOFT}">{escape(CREDIT_SINGLE)}</text>')
    return "\n".join(p + ["</svg>"])


if __name__ == "__main__":
    open("place-diagram-single.svg", "w").write(single())
    open("place-diagram.svg", "w").write(diptych())
    open("place-diagram-mobile.svg", "w").write(stacked())
