# Prototypes

Interactive companions to published pieces, served on GitHub Pages. They are artifacts made from the writing, not part of the wiki, and nothing in `wiki/` or `archive/` should point here as a source.

Only this folder is published, by `.github/workflows/pages.yml`, on any push to `main` that touches it.

## What is here

**[navigation/](navigation/)** goes with *Tasting the organisational treacle*. A 3D sketch on one screen. The cone lies on its side, narrow citizen end on the left, and drifts on its own when left alone. Drag it any way, trackball style, and it turns all the way round in that direction; flick it and it tumbles, slows, then brings the nearest of six faces round (value, legitimacy, capacity and the edges between them). A note points at whatever is facing you. A dotted trail records where the experiment has settled, and each thing it turns up swells that layer and stretches that corner of the triangle, which keeps its straight edges, so the drawing ends up a different shape from the one it started as. Layer names sit under their rings, and a pace scale sits just below the drawing like a ruler, reading from an afternoon to a parliament or more; it holds still while the model turns, and both fade end on. End on, the three questions show under their corners. `og.png` is the share image. One self-contained HTML file, no libraries. Earlier versions are kept as snapshots, [v0.1.0](navigation/v0.1.0/), [v0.2.0](navigation/v0.2.0/), [v0.3.0](navigation/v0.3.0/), [v0.4.0](navigation/v0.4.0/) and [v0.5.0](navigation/v0.5.0/).

**[place/](place/)** goes with the same essay's "Experimentation as architecture" section. A static diptych, not an interactive one: the thesis figure of a neighbourhood's five layers (after Pagh & Cook 2023) beside an organisation drawn with the same layers, where nature becomes culture and the neighbourhood scale becomes the place of work. `make_diagram.py` writes both SVGs (side by side, and stacked for phones) with the copy at the top so labels are easy to swap; `render.js` exports the PNGs at 1456 px. `alt.txt` holds the alt text.

## Rules

- A prototype goes with the essay and doesn't argue more than the essay does. If it needs its own explanation, it has become a framework product.
- Examples come from published text only, or are generic. Nothing from internal sources.
- No scoring, ratings or "where is your organisation?" diagnostics.
- No tracking.
