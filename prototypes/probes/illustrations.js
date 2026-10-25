// Three editorial illustrations for "Experimentation as probes", in the CIVICWORKS drawing
// language: one ink on white, tints and textures instead of colour, three line weights.
//
// Each function draws into an empty <svg> and can be called again with new options:
//   PROBES.weave(svg, { pull: 0.8, arrows: true })      A, pull one thread
//   PROBES.weaveBeforeAfter(svg, { pull: 0.85 })       A, before and after, with arrows
//   PROBES.mobile(svg, { weight: 0.85, ghost: true })    B, rebalance the mobile
//   PROBES.treacle(svg, { seed: 7, reveal: 1 })          C, taste the treacle
//   PROBES.beneath(svg, { pull: 0.8, arrows: true })    D, reach beneath the service
//   PROBES.rearrange(svg, { shift: 1, arrows: true })   E, rearrange the pieces
//   PROBES.push(svg, { depth: 1 })                      F, push through the layers
//   PROBES.reveal(svg, { reveal: 1 })                   G, bring it into view
// Colours are written in, not taken from CSS, so a drawing can be lifted out as a standalone SVG.
(function () {
  "use strict";

  var INK = "#d63c23", INK_TEXT = "#a92c17", MUTED = "#93402f", TINT = "#f6c6b8", PAPER = "#ffffff";
  var FONT = '"Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif';
  var W = 1456, H = 640;
  var NS = "http://www.w3.org/2000/svg";

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function line(pts) { return pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" "); }
  function rng(seed) {
    var a = seed >>> 0;
    return function () { a = (a + 0x6d2b79f5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function start(svg, id, title) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("xmlns", NS);
    svg.setAttribute("font-family", FONT);
    var t = el("title", {}, svg); t.textContent = title;
    var d = el("defs", {}, svg);
    function pattern(name, size, rot) {
      var p = el("pattern", { id: id + "-" + name, width: size, height: size, patternUnits: "userSpaceOnUse" }, d);
      if (rot != null) p.setAttribute("patternTransform", "rotate(" + rot + ")");
      return p;
    }
    el("line", { x1: 0, y1: 0, x2: 0, y2: 3.2, stroke: INK, "stroke-width": .5, opacity: .8 }, pattern("hatch", 3.2, -45));
    el("line", { x1: 0, y1: 0, x2: 0, y2: 3.2, stroke: INK, "stroke-width": .5, opacity: .8 }, pattern("hatch-r", 3.2, 45));
    var x = pattern("cross", 4, 45);
    el("line", { x1: 0, y1: 0, x2: 0, y2: 4, stroke: INK, "stroke-width": .45, opacity: .8 }, x);
    el("line", { x1: 0, y1: 0, x2: 4, y2: 0, stroke: INK, "stroke-width": .45, opacity: .8 }, x);
    var s = pattern("stipple", 4.5);
    el("circle", { cx: 1.1, cy: 1.1, r: .6, fill: INK }, s);
    el("circle", { cx: 3.4, cy: 3.4, r: .6, fill: INK }, s);
    el("rect", { width: W, height: H, fill: PAPER }, svg);
    return function (name) { return "url(#" + id + "-" + name + ")"; };
  }
  function label(svg, text, x, y, anchor, muted) {
    var t = el("text", { x: x, y: y, "text-anchor": anchor || "start", "font-size": 15, "font-weight": 500, "letter-spacing": 2.1, fill: muted ? MUTED : INK_TEXT }, svg);
    t.textContent = text.toUpperCase();
    return t;
  }
  function leader(svg, x1, y1, x2, y2) {
    el("path", { d: line([[x1, y1], [x2, y2]]), stroke: INK, "stroke-width": .6, "stroke-dasharray": "1 3.5", "stroke-linecap": "round", fill: "none" }, svg);
    el("circle", { cx: x2, cy: y2, r: 3.6, fill: PAPER, stroke: INK, "stroke-width": .9 }, svg);
  }
  // the experiment, drawn the way the navigation model draws where an experiment has settled
  function probe(svg, x, y) {
    var g = el("g", { "class": "probe-head" }, svg);
    el("circle", { cx: x, cy: y, r: 13, fill: "none", stroke: INK, "stroke-width": .75, "stroke-dasharray": "1.5 3", "stroke-linecap": "round" }, g);
    el("circle", { cx: x, cy: y, r: 6.5, fill: INK }, g);
    return g;
  }

  // ---- A. Pull one thread.
  // The institution as a cloth woven from materials, each with its own texture. Nobody sits
  // underneath anybody: the threads hold each other up by crossing. The experiment pulls one
  // thread, and the others pucker where they cross it.
  var WEAVE = [
    { name: "Legislation", fill: "tint", stiff: 0.35 },
    { name: "Interpretation", fill: "hatch", stiff: 1 },
    { name: "Practice", fill: "stipple", stiff: 1 },
    { name: "Responsibility", fill: "cross", stiff: 0.7 },
    { name: "Relationships", fill: "blank", stiff: 1 }
  ];
  // an arrow in the drawing's own line: a thin shaft and an open head
  function arrow(parent, x1, y1, x2, y2, w, h) {
    var a = Math.atan2(y2 - y1, x2 - x1), s = 0.48;
    el("path", { d: line([[x1, y1], [x2, y2]]), stroke: INK, "stroke-width": w, "stroke-linecap": "round", fill: "none" }, parent);
    el("path", { d: line([[x2 - h * Math.cos(a - s), y2 - h * Math.sin(a - s)], [x2, y2], [x2 - h * Math.cos(a + s), y2 - h * Math.sin(a + s)]]),
      stroke: INK, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" }, parent);
  }

  // Draws the cloth into g, in the drawing's own coordinates, and returns where things landed so
  // labels can be placed outside a scaled group. o.tail draws the pulled thread out to the
  // experiment; o.arrows adds arrows for how everything moves; o.k thickens arrows when g is scaled.
  function cloth(g, url, p, o) {
    var x0 = 470, x1 = 1060, y0 = 110, y1 = 530, NW = 12, NF = 6, BAND = 17, k = o.k || 1;
    var wx = [], wy = [], i, j;
    for (i = 0; i < NW; i++) wx.push(x0 + (i + 0.5) * (x1 - x0) / NW);
    for (j = 0; j < NF; j++) wy.push(y0 + (j + 0.5) * (y1 - y0) / NF);
    var pulled = 4, yp = wy[pulled]; // an interpretation thread, where the essay finds room
    function warpMat(i) { return WEAVE[i % 5]; }
    function weftMat(j) { return WEAVE[(j + 2) % 5]; }
    // a warp is dragged towards the pull where it crosses the pulled thread, more near the exit,
    // less if its material is stiff
    function warpX(i, y) {
      var reach = 0.35 + 0.65 * (wx[i] - x0) / (x1 - x0);
      return wx[i] + p * 52 * warpMat(i).stiff * reach * Math.exp(-Math.pow(y - yp, 2) / (2 * 75 * 75));
    }
    // neighbouring wefts gather towards the pulled one, more towards the right
    function weftY(j, x) {
      if (j === pulled) return yp;
      var gx = Math.pow(Math.max(0, (x - x0) / (x1 - x0)), 1.6);
      return wy[j] + p * 30 * Math.sign(yp - wy[j]) * Math.exp(-Math.pow(wy[j] - yp, 2) / (2 * 110 * 110)) * gx;
    }
    function warpPts(i, ya, yb) { var a = []; for (var y = ya; y <= yb + 0.1; y += 5) a.push([warpX(i, y), y]); return a; }
    function weftPts(j, xa, xb) { var a = []; for (var x = xa; x <= xb + 0.1; x += 5) a.push([x, weftY(j, x)]); return a; }
    function band(d, m) {
      el("path", { d: d, fill: "none", stroke: INK, "stroke-width": BAND, "stroke-linecap": "butt" }, g);
      el("path", { d: d, fill: "none", stroke: PAPER, "stroke-width": BAND - 1.6, "stroke-linecap": "butt" }, g);
      if (m.fill === "tint") el("path", { d: d, fill: "none", stroke: TINT, "stroke-width": BAND - 1.6 }, g);
      else if (m.fill !== "blank") el("path", { d: d, fill: "none", stroke: url(m.fill), "stroke-width": BAND - 1.6 }, g);
      else el("path", { d: d, fill: "none", stroke: INK, "stroke-width": .6, "stroke-dasharray": "1 3.5", "stroke-linecap": "round" }, g);
    }
    // the pulled thread has been drawn partway out: its tail leaves a gap on the left
    function startX(j) { return j === pulled ? x0 - 22 + p * 150 : x0 - 22; }
    for (i = 0; i < NW; i++) band(line(warpPts(i, y0 - 22, y1 + 22)), warpMat(i));
    for (j = 0; j < NF; j++) band(line(weftPts(j, startX(j), x1 + 22)), weftMat(j));
    // over and under: where a warp should lie on top, draw that short piece of it again
    for (i = 0; i < NW; i++) for (j = 0; j < NF; j++) {
      if ((i + j) % 2) continue;
      if (wx[i] < startX(j)) continue;
      var yc = weftY(j, wx[i]);
      band(line(warpPts(i, yc - BAND * 0.75, yc + BAND * 0.75)), warpMat(i));
    }
    var ex = x1 + 22, px = ex + 90 + p * 170, py = yp + 18 * p;
    if (o.tail) {
      var mid = [ex + (px - ex) * 0.5, yp + (py - yp) * 0.2];
      band("M" + ex + " " + yp + " Q " + mid[0].toFixed(1) + " " + mid[1].toFixed(1) + " " + (px - 16).toFixed(1) + " " + py.toFixed(1), weftMat(pulled));
      probe(g, px, py);
    }
    if (o.arrows && p > 0) {
      // in each gap of the cloth, an arrow for which way that part of it has moved, as long as it moved
      for (i = 0; i < NW - 1; i++) for (j = 0; j < NF - 1; j++) {
        var cx0 = (wx[i] + wx[i + 1]) / 2, cy0 = (wy[j] + wy[j + 1]) / 2;
        var dx = (warpX(i, cy0) - wx[i] + warpX(i + 1, cy0) - wx[i + 1]) / 2;
        var dy = (weftY(j, cx0) - wy[j] + weftY(j + 1, cx0) - wy[j + 1]) / 2;
        var mag = Math.hypot(dx, dy);
        if (mag < 4) continue;
        var L = Math.min(27, 9 + mag * 0.5), ux = dx / mag, uy = dy / mag, cx = cx0 + dx, cy = cy0 + dy;
        arrow(g, cx - ux * L / 2, cy - uy * L / 2, cx + ux * L / 2, cy + uy * L / 2, 1 * k, (5 + L * 0.12) * k);
      }
      // the experiment pulls, and the thread follows it out
      arrow(g, px + 22, py, px + 82, py, 1.1 * k, 8 * k);
      arrow(g, x0 - 22, yp, startX(pulled) - 6, yp, 1.1 * k, 7 * k);
    }
    return {
      labels: WEAVE.map(function (m) { for (var j = 0; j < NF; j++) if (weftMat(j) === m) return { name: m.name, y: wy[j], x: startX(j), pulled: j === pulled }; }),
      px: px, py: py, left: x0 - 22, ex: ex, top: y0 - 22, bottom: y1 + 22,
      stiff: { x: warpX(10, y1 + 22), y: y1 + 22 } // a legislation warp near the exit
    };
  }

  function weaveLabels(svg, c, arrows, X, Y, lx) {
    lx = lx || 340;
    c.labels.forEach(function (l) {
      // with arrows, the pulled thread's leader stops at the cloth's edge and the arrow takes over
      if (arrows && l.pulled) el("path", { d: line([[lx + 20, Y(l.y)], [X(c.left) - 8, Y(l.y)]]), stroke: INK, "stroke-width": .6, "stroke-dasharray": "1 3.5", "stroke-linecap": "round", fill: "none" }, svg);
      else leader(svg, lx + 20, Y(l.y), X(l.x) - 8, Y(l.y));
      label(svg, l.name, lx, Y(l.y) + 5, "end");
    });
  }
  function stiffNote(svg, c, X, Y) {
    var sx = X(c.stiff.x), sy = Y(c.stiff.y);
    leader(svg, sx, sy + 34, sx, sy + 6);
    label(svg, "Legislation bends least", sx, sy + 56, "middle", true);
  }

  function weave(svg, opts) {
    var p = opts && opts.pull != null ? opts.pull : 0.8, arrows = !!(opts && opts.arrows);
    var url = start(svg, "wv", arrows
      ? "One thread pulled from a woven cloth of institutional materials. Arrows show the threads it crosses dragged towards the pull, its neighbours gathering in, and legislation bending least"
      : "One thread pulled from a woven cloth of institutional materials, puckering the threads it crosses");
    var g = el("g", {}, svg);
    var c = cloth(g, url, p, { tail: true, arrows: arrows });
    function id(v) { return v; }
    label(svg, "The experiment", c.px, c.py + 44, "middle", true);
    weaveLabels(svg, c, arrows, id, id);
    if (arrows && p > 0) stiffNote(svg, c, id, id);
  }

  // The same cloth twice, untouched and then pulled, smaller, with the arrows on the second.
  function weaveBeforeAfter(svg, opts) {
    var p = opts && opts.pull != null ? opts.pull : 0.85, s = 0.6, ty = 318 - 320 * s;
    var url = start(svg, "wb", "The woven cloth of institutional materials before and after one thread is pulled. Arrows show how the cloth moves, with legislation bending least");
    var txA = 290 - 448 * s, txB = 810 - 448 * s;
    function place(tx) {
      return { g: el("g", { transform: "translate(" + tx.toFixed(1) + " " + ty.toFixed(1) + ") scale(" + s + ")" }, svg),
        X: function (v) { return tx + v * s; }, Y: function (v) { return ty + v * s; } };
    }
    var A = place(txA), B = place(txB);
    var a = cloth(A.g, url, 0, {});
    var b = cloth(B.g, url, p, { tail: true, arrows: true, k: 1 / s });
    weaveLabels(svg, a, false, A.X, A.Y, 250);
    label(svg, "Before", (A.X(a.left) + A.X(a.ex)) / 2, A.Y(a.top) - 30, "middle");
    label(svg, "After one thread is pulled", (B.X(b.left) + B.X(b.ex)) / 2, B.Y(b.top) - 30, "middle");
    label(svg, "The experiment", B.X(b.px), B.Y(b.py) + 34, "middle", true);
    stiffNote(svg, b, B.X, B.Y);
    arrow(svg, A.X(a.ex) + 28, 318, B.X(b.left) - 28, 318, 1.1, 8);
  }

  // ---- B. Rebalance the mobile.
  // The institution as a hanging mobile, each material a weight in balance with the others. The
  // experiment adds a small weight. Arms on free pivots swing; an arm on a fixed joint doesn't,
  // so the change is taken up elsewhere, and a different arrangement comes into reach.
  function mobile(svg, opts) {
    var w = opts && opts.weight != null ? opts.weight : 0.85;
    var ghost = !(opts && opts.ghost === false);
    var url = start(svg, "mb", "A hanging mobile of institutional materials, rebalanced by a small added weight, with one arm fixed in place");
    function rotate(cx, cy, x, y, deg) {
      var a = deg * Math.PI / 180, dx = x - cx, dy = y - cy;
      return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
    }
    function layout(w) {
      var A = { c: [760, 100], l: [470, 100], r: [1050, 100] };       // the top arm, on a fixed joint at the right
      var tb = -10 * w, tc = 28 * w;                                    // free pivots swing
      var Bc = [A.l[0], 220];
      var B = { c: Bc, l: rotate(Bc[0], Bc[1], Bc[0] - 210, Bc[1], tb), r: rotate(Bc[0], Bc[1], Bc[0] + 210, Bc[1], tb) };
      var Cc = [B.r[0], B.r[1] + 110];
      var C = { c: Cc, l: rotate(Cc[0], Cc[1], Cc[0] - 150, Cc[1], tc), r: rotate(Cc[0], Cc[1], Cc[0] + 150, Cc[1], tc) };
      return {
        A: A, B: B, C: C,
        law: { at: [A.r[0], A.r[1] + 230], r: 84, rod: true, fill: "tint", name: "Legislation" },
        reading: { at: [B.l[0], B.l[1] + 150], r: 58, fill: "hatch", name: "Interpretation" },
        practice: { at: [C.l[0], C.l[1] + 120], r: 46, fill: "stipple", name: "Practice" },
        roles: { at: [C.r[0], C.r[1] + 104], r: 40, fill: "cross", name: "Roles" }
      };
    }
    var before = layout(0), now = layout(w);
    var discs = ["law", "reading", "practice", "roles"];
    // the arrangement that becomes possible, waiting where the roles disc will arrive
    var target = layout(1).roles.at;
    var near = Math.max(0, (w - 0.75) / 0.25);
    el("circle", { cx: target[0], cy: target[1], r: 54, fill: near > 0 ? TINT : "none", "fill-opacity": .35 * near, stroke: INK, "stroke-width": .75, "stroke-dasharray": "2 4", "stroke-linecap": "round" }, svg);
    label(svg, "Another arrangement", target[0], target[1] + 82, "middle", true);
    if (ghost && w > 0.02) {
      var gg = el("g", { opacity: .4 }, svg);
      drawFrame(gg, before, true);
    }
    var g = el("g", {}, svg);
    drawFrame(g, now, false);
    // the experiment hangs from the practice disc
    var pa = now.practice.at, pr = now.practice.r;
    if (w > 0.02) {
      el("line", { x1: pa[0], y1: pa[1] + pr, x2: pa[0], y2: pa[1] + pr + 34, stroke: INK, "stroke-width": .5 }, g);
      probe(g, pa[0], pa[1] + pr + 34 + 8 * w);
      label(svg, "The experiment", pa[0] - 26, pa[1] + pr + 47 + 8 * w, "end", true);
    }
    // labels from each disc, in the current arrangement
    label(svg, now.law.name, now.law.at[0] + now.law.r + 30, now.law.at[1] + 5);
    leader(svg, now.law.at[0] + now.law.r + 24, now.law.at[1], now.law.at[0] + now.law.r - 4, now.law.at[1]);
    label(svg, now.reading.name, now.reading.at[0] - now.reading.r - 30, now.reading.at[1] + 5, "end");
    leader(svg, now.reading.at[0] - now.reading.r - 24, now.reading.at[1], now.reading.at[0] - now.reading.r + 4, now.reading.at[1]);
    label(svg, now.roles.name, now.roles.at[0] + now.roles.r + 30, now.roles.at[1] + 5);
    leader(svg, now.roles.at[0] + now.roles.r + 24, now.roles.at[1], now.roles.at[0] + now.roles.r - 4, now.roles.at[1]);
    label(svg, now.practice.name, now.practice.at[0] - now.practice.r - 30, now.practice.at[1] - 10, "end");
    leader(svg, now.practice.at[0] - now.practice.r - 24, now.practice.at[1] - 15, now.practice.at[0] - now.practice.r + 4, now.practice.at[1] - 15);
    label(svg, "Fixed", now.A.r[0] + 18, now.A.r[1] - 14, "start", true);

    function drawFrame(g, L, isGhost) {
      var dash = isGhost ? { "stroke-dasharray": "2 4", "stroke-linecap": "round" } : {};
      function seg(a, b, wgt) { var o = { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: INK, "stroke-width": wgt }; for (var k in dash) o[k] = dash[k]; el("line", o, g); }
      // the ceiling and the top string
      if (!isGhost) {
        seg([L.A.c[0] - 60, 26], [L.A.c[0] + 60, 26], 1.1);
        for (var hx = -54; hx <= 54; hx += 9) seg([L.A.c[0] + hx, 26], [L.A.c[0] + hx - 7, 18], .5);
      }
      seg([L.A.c[0], 26], L.A.c, .5);
      // arms
      seg(L.A.l, L.A.r, 1.1); seg(L.B.l, L.B.r, 1.1); seg(L.C.l, L.C.r, 1.1);
      // strings from arm ends; the legislation disc hangs on a rigid rod from the fixed joint
      seg(L.A.l, L.B.c, .5); seg(L.B.r, L.C.c, .5);
      seg(L.B.l, [L.reading.at[0], L.reading.at[1] - L.reading.r], .5);
      seg(L.C.l, [L.practice.at[0], L.practice.at[1] - L.practice.r], .5);
      seg(L.C.r, [L.roles.at[0], L.roles.at[1] - L.roles.r], .5);
      seg(L.A.r, [L.law.at[0], L.law.at[1] - L.law.r], 1.6);
      // joints: open circles turn freely, the solid square doesn't turn at all
      if (!isGhost) {
        [L.B.c, L.C.c].forEach(function (c) { el("circle", { cx: c[0], cy: c[1], r: 4.5, fill: PAPER, stroke: INK, "stroke-width": .9 }, g); });
        el("circle", { cx: L.A.c[0], cy: L.A.c[1], r: 4.5, fill: PAPER, stroke: INK, "stroke-width": .9 }, g);
        el("rect", { x: L.A.r[0] - 6, y: L.A.r[1] - 6, width: 12, height: 12, fill: INK }, g);
      }
      discs.forEach(function (k) {
        var d = L[k];
        if (isGhost) { el("circle", { cx: d.at[0], cy: d.at[1], r: d.r, fill: "none", stroke: INK, "stroke-width": .75, "stroke-dasharray": "2 4", "stroke-linecap": "round" }, g); return; }
        el("circle", { cx: d.at[0], cy: d.at[1], r: d.r, fill: d.fill === "tint" ? TINT : PAPER, stroke: "none" }, g);
        if (d.fill !== "tint") el("circle", { cx: d.at[0], cy: d.at[1], r: d.r, fill: url(d.fill) }, g);
        el("circle", { cx: d.at[0], cy: d.at[1], r: d.r, fill: "none", stroke: INK, "stroke-width": .9 }, g);
      });
    }
  }

  // ---- C. Taste the treacle.
  // A probe's path through a field whose density is how thick the institution is there. The path's
  // marks bunch up where it's thick and open out where it isn't. Neat concentric rings are the
  // constraints that protect something, and the path goes round them; tangles are habit and
  // accumulated assumption, and the path pushes through them, slowly.
  function treacle(svg, opts) {
    var seed = opts && opts.seed != null ? opts.seed : 7;
    var reveal = opts && opts.reveal != null ? opts.reveal : 1;
    var R = rng(seed);
    start(svg, "tr", "A probe's path through a thick stippled field, slowing in tangles and going round neat protective rings");
    // protective constraints sit near the route, above and below it
    var rings = [
      { x: 560 + (R() - 0.5) * 60, y: 190 + (R() - 0.5) * 40, n: 5 },
      { x: 1010 + (R() - 0.5) * 60, y: 470 + (R() - 0.5) * 40, n: 4 }
    ];
    // the route: wanders across, bending round the rings
    var pts = [], x = 70, y = 330, phase = R() * 6;
    while (x < 1300) {
      var ty = 330 + 85 * Math.sin(x / 190 + phase) + 30 * Math.sin(x / 61 + phase * 2);
      rings.forEach(function (r) {
        var dx = x - r.x, dy = ty - r.y, d = Math.hypot(dx, dy), clear = 16 * r.n + 40;
        if (d < clear + 60) ty = r.y + (dy >= 0 ? 1 : -1) * Math.max(Math.abs(dy), Math.sqrt(Math.max(0, Math.pow(clear + 10, 2) - dx * dx)));
      });
      y += (ty - y) * 0.18;
      pts.push([x, y]);
      x += 4;
    }
    // tangles sit on the route itself
    var tangles = [0.2, 0.52, 0.8].map(function (t) { var p = pts[Math.floor(t * (pts.length - 1))]; return { x: p[0], y: p[1], r: 52 + R() * 16 }; });
    // thickness: heavy in the tangles, some round the rings, a slow band, a thin background
    function thick(px, py) {
      var f = 0.06;
      tangles.forEach(function (t) { f += 0.9 * Math.exp(-(Math.pow(px - t.x, 2) + Math.pow(py - t.y, 2)) / (2 * Math.pow(t.r * 1.5, 2))); });
      rings.forEach(function (r) { f += 0.35 * Math.exp(-(Math.pow(px - r.x, 2) + Math.pow(py - r.y, 2)) / (2 * Math.pow(14 * r.n + 50, 2))); });
      f += 0.22 * Math.exp(-Math.pow(px - 850, 2) / (2 * 140 * 140));
      return Math.min(1, f);
    }
    // the field, as stipple whose density follows the thickness
    var dots = el("g", { fill: INK }, svg);
    for (var k = 0; k < 22000; k++) {
      var sx = 20 + R() * (W - 40), sy = 20 + R() * (H - 40);
      if (R() < Math.pow(thick(sx, sy), 1.3) * 0.75) el("circle", { cx: sx.toFixed(1), cy: sy.toFixed(1), r: 1.05, opacity: 0.7 }, dots);
    }
    // rings: neat, deliberate, held
    rings.forEach(function (r) {
      el("circle", { cx: r.x, cy: r.y, r: 16 * r.n + 6, fill: PAPER }, svg);
      for (var n = 1; n <= r.n; n++) el("circle", { cx: r.x, cy: r.y, r: 16 * n, fill: n === 1 ? TINT : "none", stroke: INK, "stroke-width": n === 1 ? 1.1 : .75 }, svg);
    });
    // tangles: looping, accumulated, cross-hatched where they knot
    tangles.forEach(function (t) {
      el("circle", { cx: t.x, cy: t.y, r: t.r * 0.66, fill: "url(#tr-cross)" }, svg);
      var a = R() * 6, tp = [];
      for (var s = 0; s < 220; s++) {
        a += 0.21 + (R() - 0.5) * 0.5;
        var rr = t.r * (0.35 + 0.65 * Math.abs(Math.sin(s * 0.07 + R() * 0.4)));
        tp.push([t.x + Math.cos(a) * rr, t.y + Math.sin(a) * rr * 0.8]);
      }
      el("path", { d: line(tp), fill: "none", stroke: INK, "stroke-width": .75, "stroke-linejoin": "round" }, svg);
    });
    // the probe's marks: one every so far along the route, closer together where it's thick, so
    // the route reads as slowing down; inside a tangle it turns a small loop, stuck for a moment
    var marks = [], acc = 0, stuck = {};
    for (var i = 1; i < pts.length; i++) {
      var a0 = pts[i - 1], a1 = pts[i], seg = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]);
      acc += seg;
      var f = thick(a1[0], a1[1]), step = 26 / (1 + 11 * f);
      if (acc >= step) {
        acc = 0;
        var ang = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]);
        marks.push([a1[0], a1[1], ang]);
      }
      tangles.forEach(function (t, ti) {
        if (!stuck[ti] && Math.hypot(a1[0] - t.x, a1[1] - t.y) < 6) {
          stuck[ti] = true;
          for (var q = 1; q <= 26; q++) {
            var qa = ang - Math.PI / 2 + q / 26 * Math.PI * 2;
            marks.push([a1[0] + 13 * Math.cos(qa) + 13 * Math.cos(ang + Math.PI / 2), a1[1] + 13 * Math.sin(qa) + 13 * Math.sin(ang + Math.PI / 2), qa + Math.PI / 2]);
          }
        }
      });
    }
    var shown = Math.max(1, Math.round(marks.length * reveal));
    var mg = el("g", { "class": "marks", stroke: INK, "stroke-width": 1.4, "stroke-linecap": "round" }, svg);
    for (i = 0; i < shown; i++) {
      var m = marks[i], c = Math.cos(m[2]) * 3, s2 = Math.sin(m[2]) * 3;
      el("line", { x1: (m[0] - c).toFixed(1), y1: (m[1] - s2).toFixed(1), x2: (m[0] + c).toFixed(1), y2: (m[1] + s2).toFixed(1) }, mg);
    }
    var head = marks[shown - 1];
    var pg = probe(svg, head[0], head[1]);
    pg.setAttribute("data-x", head[0]); pg.setAttribute("data-y", head[1]);
    return marks;
  }

  // a strand or block in a material's texture, used by D, E and F
  function textured(g, url, attrs, m, width) {
    function a(extra) { var o = {}; for (var k in attrs) o[k] = attrs[k]; for (k in extra) o[k] = extra[k]; return o; }
    if (width) {
      el("path", a({ fill: "none", stroke: INK, "stroke-width": width, "stroke-linecap": "butt" }), g);
      el("path", a({ fill: "none", stroke: PAPER, "stroke-width": width - 1.6, "stroke-linecap": "butt" }), g);
      if (m.fill === "tint") el("path", a({ fill: "none", stroke: TINT, "stroke-width": width - 1.6 }), g);
      else if (m.fill !== "blank") el("path", a({ fill: "none", stroke: url(m.fill), "stroke-width": width - 1.6 }), g);
      else el("path", a({ fill: "none", stroke: INK, "stroke-width": .6, "stroke-dasharray": "1 3.5", "stroke-linecap": "round" }), g);
      return;
    }
    var tag = attrs.d ? "path" : "rect";
    el(tag, a({ fill: m.fill === "tint" ? TINT : PAPER, stroke: "none" }), g);
    if (m.fill !== "tint" && m.fill !== "blank") el(tag, a({ fill: url(m.fill), stroke: "none" }), g);
    el(tag, a({ fill: "none", stroke: INK, "stroke-width": .75, "stroke-linejoin": "round" }), g);
  }
  function halo(g, d, w) { el("path", { d: d, fill: "none", stroke: PAPER, "stroke-width": w, "stroke-linecap": "round" }, g); }

  // ---- D. Reach beneath the service.
  // The service is a surface. Under it the materials lie as threads, tied to each other by short
  // stitches. The experiment reaches through and lifts one thread, the threads tied to it come up
  // too, and the arrangement shows around the place it pulled.
  var BENEATH = [
    { name: "Interpretation", fill: "hatch" },
    { name: "Operations", fill: "stipple" },
    { name: "Relationships", fill: "blank" },
    { name: "Decision rights", fill: "cross" },
    { name: "Legislation", fill: "tint", stiff: true }
  ];
  function beneath(svg, opts) {
    var p = opts && opts.pull != null ? opts.pull : 0.8, arrows = !!(opts && opts.arrows);
    var url = start(svg, "bn", "An experiment reaches beneath the surface of a service and lifts one thread of the materials underneath, bringing the threads tied to it into view");
    var cx = 728, xa = 300, xb = 1170, B = 15, k, i;
    var ly = [300, 358, 416, 474, 532];
    function surf(x) { return 200 + 30 * Math.pow((x - cx) / 470, 2); }
    function lift(k) { var l = 74 * p * Math.pow(0.52, k); return BENEATH[k].stiff ? l * 0.45 : l; }
    function sig(k) { return 110 + 50 * k; }
    function rise(k, x) { return lift(k) * Math.exp(-(x - cx) * (x - cx) / (2 * sig(k) * sig(k))); }
    function rest(k, x) { return ly[k] + 3 * Math.sin(x / 41 + k * 1.9); }
    function y(k, x) { return rest(k, x) - rise(k, x); }
    function pts(k) { var a = []; for (var x = xa; x <= xb + 0.1; x += 5) a.push([x, y(k, x)]); return a; }
    var hy = y(0, cx), py = 128 - 30 * p;

    // what's beneath shows most around the pull, and only faintly further off
    var defs = svg.querySelector("defs");
    var rg = el("radialGradient", { id: "bn-glow", cx: cx, cy: hy + 70, r: 40 + 540 * p, gradientUnits: "userSpaceOnUse" }, defs);
    el("stop", { offset: 0, "stop-color": "#fff" }, rg);
    el("stop", { offset: .45, "stop-color": "#fff" }, rg);
    el("stop", { offset: 1, "stop-color": "#2b2b2b" }, rg);
    var mk = el("mask", { id: "bn-mask", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: W, height: H }, defs);
    el("rect", { width: W, height: H, fill: "url(#bn-glow)" }, mk);

    // the experiment, above the surface, and its line down through it
    el("path", { d: line([[cx, py + 15], [cx, surf(cx)]]), stroke: INK, "stroke-width": .9, "stroke-dasharray": "2 4", "stroke-linecap": "round", fill: "none" }, svg);
    el("path", { d: line([[cx, surf(cx)], [cx, hy + B / 2 + 3]]), stroke: INK, "stroke-width": 1.1, fill: "none" }, svg);

    var g = el("g", { mask: "url(#bn-mask)" }, svg);
    // stitches tie each thread to the next, so lifting one lifts the others
    var r = rng(11);
    for (k = 0; k < 4; k++) {
      var xs = [cx + (k % 2 ? 34 : -40)];
      for (i = 0; i < 6; i++) xs.push(xa + 50 + (xb - xa - 100) * (i + 0.2 + r() * 0.6) / 6);
      xs.forEach(function (x) {
        if (Math.abs(x - cx) < 20) return;
        var x2 = x + (r() - 0.5) * 34, a = [x, y(k, x) + B / 2], b = [x2, y(k + 1, x2) - B / 2];
        el("path", { d: line([a, b]), stroke: INK, "stroke-width": .75, fill: "none" }, g);
        el("circle", { cx: a[0], cy: a[1], r: 1.8, fill: INK }, g);
        el("circle", { cx: b[0], cy: b[1], r: 1.8, fill: INK }, g);
      });
    }
    for (k = BENEATH.length - 1; k >= 0; k--) textured(g, url, { d: line(pts(k)) }, BENEATH[k], B);
    // the hook, under the thread it lifts
    var hb = hy + B / 2 + 3;
    el("path", { d: "M" + cx + " " + hb.toFixed(1) + " C " + cx + " " + (hb + 9).toFixed(1) + " " + (cx - 13) + " " + (hb + 9).toFixed(1) + " " + (cx - 13) + " " + (hb - 1).toFixed(1), stroke: INK, "stroke-width": 1.1, "stroke-linecap": "round", fill: "none" }, svg);

    // the surface of the service, drawn last so it sits on top
    var sp = []; for (var x = xa - 60; x <= xb + 60.1; x += 6) sp.push([x, surf(x)]);
    el("path", { d: line(sp), stroke: INK, "stroke-width": 1.1, fill: "none" }, svg);
    el("circle", { cx: cx, cy: surf(cx), r: 3.6, fill: PAPER, stroke: INK, "stroke-width": .9 }, svg);
    label(svg, "The visible service", xa - 60, surf(xa - 60) - 34, "start");
    probe(svg, cx, py);
    label(svg, "The experiment", cx + 28, py + 5, "start", true);
    BENEATH.forEach(function (m, k) {
      leader(svg, 285, rest(k, xa), xa - 8, rest(k, xa));
      label(svg, m.name, 270, rest(k, xa) + 5, "end");
    });
    label(svg, "The materials behind it", cx, 600, "middle", true);

    if (arrows && p > 0) {
      arrow(svg, cx - 30, py + 22, cx - 30, py - 20, 1.1, 8);
      // where each thread came up from, in the space it left behind
      for (k = 0; k < BENEATH.length; k++) [-1, 1].forEach(function (side) {
        var x = cx + side * (64 + 22 * k), d = rise(k, x);
        if (d < 9) return;
        var y0 = rest(k, x) + B / 2 + 1, y1 = y(k, x) + B / 2 + 4;
        arrow(svg, x, y0, x, y1, 1, 5 + Math.min(3, d * 0.05));
      });
    }
  }

  // ---- E. Rearrange the pieces.
  // The materials as pieces fitted together in rows. As things stand the experiment can't find a
  // way through. Swap two pieces in two rows and the gaps line up into a route. Legislation
  // stays as it was, and already had a gap in the right place.
  var ROWS = [
    { name: "Interpretation", fill: "hatch", joints: [520, 700, 880] },
    { name: "Operations", fill: "stipple", joints: [610, 740, 960] },
    { name: "Decision rights", fill: "cross", joints: [470, 600, 900, 1010], swap: 1 },
    { name: "Relationships", fill: "blank", joints: [560, 690, 880, 990], swap: 2 },
    { name: "Legislation", fill: "tint", joints: [520, 780, 940] }
  ];
  function rearrange(svg, opts) {
    var t = opts && opts.shift != null ? opts.shift : 1, arrows = !!(opts && opts.arrows);
    var url = start(svg, "ra", "Institutional materials as pieces fitted together in rows. Two pieces swap places in two rows, and the gaps line up into a route the experiment can follow");
    var xa = 400, xb = 1080, RH = 60, GAP = 12, top = 140, STEP = 50, k;
    function rowTop(k) { return top + k * (RH + GAP); }
    function ease(v) { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); }
    var g = el("g", {}, svg), joints = [], moved = [];
    ROWS.forEach(function (row, k) {
      var b = [xa].concat(row.joints, [xb]), pieces = [];
      for (var i = 0; i < b.length - 1; i++) pieces.push({ x: b[i] + (i ? GAP / 2 : 0), w: b[i + 1] - b[i] - (i ? GAP / 2 : 0) - (i < b.length - 2 ? GAP / 2 : 0), dy: 0 });
      var tk = row.swap == null ? 0 : ease(k === 2 ? t * 2 : t * 2 - 1), js = row.joints.slice();
      if (row.swap != null) {
        var A = pieces[row.swap], Bp = pieces[row.swap + 1], S = A.x;
        var ax = S + Bp.w + GAP, bx = S, lift = 7 * Math.sin(Math.PI * tk);
        moved.push({ k: k, from: [A.x + A.w / 2, Bp.x + Bp.w / 2], to: [ax + A.w / 2, bx + Bp.w / 2], tk: tk, old: row.joints[row.swap] });
        A.x += (ax - A.x) * tk; A.dy = -lift;
        Bp.x += (bx - Bp.x) * tk; Bp.dy = lift;
        if (tk >= 1) js[row.swap] = S + Bp.w + GAP / 2;
        else if (tk > 0) js.splice(row.swap, 1);
      }
      joints.push(js);
      // the moving pieces go on top
      pieces.slice().sort(function (p, q) { return (p.dy ? 1 : 0) - (q.dy ? 1 : 0); }).forEach(function (pc) {
        textured(g, url, { x: pc.x.toFixed(1), y: (rowTop(k) + pc.dy).toFixed(1), width: pc.w.toFixed(1), height: RH, rx: 3 }, row);
        if (row.fill === "blank") el("rect", { x: (pc.x + 5).toFixed(1), y: rowTop(k) + pc.dy + 5, width: Math.max(0, pc.w - 10).toFixed(1), height: RH - 10, rx: 2, fill: "none", stroke: INK, "stroke-width": .6, "stroke-dasharray": "1 3.5", "stroke-linecap": "round" }, g);
      });
    });

    // the experiment looks for a way down through the gaps, and stops where none lines up
    var x = 700, pts = [[x, 96]], through = true;
    for (k = 0; k < ROWS.length; k++) {
      var best = null;
      joints[k].forEach(function (j) { if (Math.abs(j - x) <= STEP && (best == null || Math.abs(j - x) < Math.abs(best - x))) best = j; });
      var gy = rowTop(k) - GAP / 2;
      if (best == null) { pts.push([x, gy]); through = false; break; }
      pts.push([x, gy], [best, gy], [best, rowTop(k) + RH + GAP / 2]);
      x = best;
    }
    var tx = 780, ty = 562;
    if (through) pts.push([x, ty]);
    el("path", { d: line(pts), stroke: INK, "stroke-width": 1.1, "stroke-dasharray": "1 4.5", "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" }, svg);
    el("circle", { cx: tx, cy: ty, r: 18, fill: "none", stroke: INK, "stroke-width": .75, "stroke-dasharray": "1.5 3", "stroke-linecap": "round" }, svg);
    label(svg, "Another route", tx + 30, ty + 5, "start", true);
    el("circle", { cx: 700, cy: 96, r: 3.6, fill: PAPER, stroke: INK, "stroke-width": .9 }, svg);
    var end = pts[pts.length - 1];
    probe(svg, end[0], end[1]);
    label(svg, "The experiment", 724, 101, "start", true);
    ROWS.forEach(function (row, k) {
      var yy = rowTop(k) + RH / 2;
      leader(svg, 345, yy, xa - 8, yy);
      label(svg, row.name, 330, yy + 5, "end");
    });

    if (arrows) moved.forEach(function (m) {
      if (m.tk < 1) return;
      var yy = rowTop(m.k) + RH / 2;
      // where the gap used to be
      el("path", { d: line([[m.old, rowTop(m.k) + 6], [m.old, rowTop(m.k) + RH - 6]]), stroke: INK, "stroke-width": .9, "stroke-dasharray": "1 3.5", "stroke-linecap": "round" }, svg);
      // one arrow each way, a little apart, so they read as a swap
      [0, 1].forEach(function (i) {
        var ay = yy + (i ? 11 : -11), a = m.from[i], b = m.to[i], d = line([[a, ay], [b, ay]]);
        halo(svg, d, 7);
        arrow(svg, a, ay, b, ay, 1.1, 7);
      });
    });
  }

  // ---- F. Push through the layers.
  // C turned on its side, with the materials named. The probe pushes down and drags each layer
  // with it, more where it's sticky, and its marks bunch up where it slowed. It stops at
  // legislation, which dents and holds.
  var LAYERS = [
    { name: "Interpretation", fill: "hatch", stick: .25 },
    { name: "Operations", fill: "stipple", stick: .55 },
    { name: "Relationships", fill: "blank", stick: .95 },
    { name: "Decision rights", fill: "cross", stick: .7 },
    { name: "Legislation", fill: "tint", firm: true }
  ];
  function push(svg, opts) {
    var d = opts && opts.depth != null ? opts.depth : 1;
    var url = start(svg, "pu", "A probe pushed down through layered institutional materials, dragging each layer with it, most where it's sticky, until it stops at legislation");
    var cx = 700, xa = 300, xb = 1160, HB = 11, k;
    var ly = [190, 270, 350, 430, 510];
    var yt = 112 + d * (ly[4] - HB - 3 - 112);
    function drag(k, x) {
      var m = LAYERS[k], yl = ly[k], dx = x - cx;
      if (m.firm) return 9 * Math.max(0, Math.min(1, (yt - (yl - HB - 40)) / 37)) * Math.exp(-dx * dx / (2 * 60 * 60));
      if (yt < yl - 60) return 0;
      if (yt < yl) return 14 * (yt - (yl - 60)) / 60 * Math.exp(-dx * dx / (2 * Math.pow(50 + 80 * m.stick, 2)));
      return (14 + 46 * m.stick * Math.min(1, (yt - yl) / 150)) * Math.exp(-Math.abs(dx) / (25 + 90 * m.stick));
    }
    function yy(k, x, side) { return ly[k] + 4 * Math.sin(x / 53 + k * 2.3) + drag(k, x) + side * HB; }
    function sticky(y) {
      for (var k = 0; k < 4; k++) if (y > ly[k] - HB && y < yy(k, cx, 1)) return LAYERS[k].stick;
      return 0;
    }
    var g = el("g", {}, svg);
    LAYERS.forEach(function (m, k) {
      var tp = [], bt = [];
      for (var x = xa; x <= xb + 0.1; x += 4) { tp.push([x, yy(k, x, -1)]); bt.push([x, yy(k, x, 1)]); }
      textured(g, url, { d: line(tp.concat(bt.reverse())) + " Z" }, m);
      if (m.fill === "blank") { var mid = []; for (x = xa; x <= xb + 0.1; x += 4) mid.push([x, yy(k, x, 0)]); el("path", { d: line(mid), stroke: INK, "stroke-width": .6, "stroke-dasharray": "1 3.5", "stroke-linecap": "round", fill: "none" }, g); }
    });
    // the rod, and a mark for each moment, so they bunch where it went slowly
    var rod = line([[cx, 70], [cx, yt]]);
    halo(svg, rod, 6);
    el("path", { d: rod, stroke: INK, "stroke-width": 1.1, fill: "none" }, svg);
    for (var y = 84; y < yt - 16; y += 24 / (1 + 9 * sticky(y))) el("path", { d: line([[cx - 6, y], [cx + 6, y]]), stroke: INK, "stroke-width": .75 }, svg);
    probe(svg, cx, yt);
    label(svg, "The experiment", cx + 26, 80, "start", true);
    LAYERS.forEach(function (m, k) {
      var y0 = yy(k, xa, 0);
      leader(svg, 285, y0, xa - 8, y0);
      label(svg, m.name, 270, y0 + 5, "end");
    });
    if (d > 0.95) label(svg, "Holds", cx + 30, ly[4] + 40, "start", true);
  }

  // ---- G. Bring it into view.
  // After the sketch of an experiment that looks small on the surface. The whole system is a
  // circle, and its top edge is the visible service. Where the experiment goes in, a spotlight
  // opens into the system and widens as more comes into view. In the light, the relationships draw
  // out one by one, each one fine line passing over or under the others where they cross. The rest
  // is hatched, the service's dark matter, and what's in it stays hidden.
  var NODES = {
    I: { name: "Interpretation", fill: "hatch", x: 728, y: 258, side: 1 },
    L: { name: "Legislation", fill: "tint", x: 666, y: 330, side: -1 },
    O: { name: "Operations", fill: "stipple", x: 790, y: 330, side: 1 },
    D: { name: "Decision rights", fill: "cross", x: 692, y: 420, side: -1 },
    R: { name: "Relationships", fill: "blank", x: 764, y: 420, side: 1 }
  };
  // from, to, bend, and when it draws out. Listed in the order they're drawn, which decides
  // which line passes over which where they cross.
  var TIES = [
    ["I", "L", 8, .08, .40], ["I", "O", -8, .12, .44], ["L", "D", -7, .54, .76], ["O", "R", 7, .56, .78],
    ["I", "D", 5, .16, .50], ["O", "D", -12, .70, 1], ["L", "R", 12, .66, .95], ["I", "R", -5, .20, .52], ["D", "R", 9, .62, .86]
  ];
  // the rest of the system, not looked at: materials and the lines that run out to them
  var BEYOND = [[556, 258], [540, 392], [576, 520], [728, 560], [880, 520], [916, 392], [900, 258], [614, 444]];
  var BEYOND_TIES = [["L", 0], ["L", 1], ["D", 7], ["D", 3], ["R", 3], ["R", 4], ["O", 5], ["O", 6], ["I", 6], [0, 1], [7, 2], [2, 3], [4, 5]];
  function reveal(svg, opts) {
    var r = opts && opts.reveal != null ? opts.reveal : 1;
    var url = start(svg, "rv", "The whole system as a circle whose top edge is the visible service. Where an experiment goes in, a spotlight opens into the system, and five materials and the relationships between them come into view. Hatching covers the rest, the service's dark matter, where whatever else there is stays hidden");
    var SX = 728, SY = 372, SR = 236, NR = 17, cx = 728;
    function clamp(v) { return Math.max(0, Math.min(1, v)); }
    // the spotlight shines from the experiment, through the visible service, widening and reaching
    // further as it looks
    var k = Math.pow(clamp(r / 0.45), 0.8), half = (3 + 16 * k) * Math.PI / 180, reach = 200 + 214 * k;
    var ax = cx, ay = 64;
    var beam = "M" + ax + " " + ay + " L " + (ax - reach * Math.sin(half)).toFixed(1) + " " + (ay + reach * Math.cos(half)).toFixed(1) +
      " A " + reach + " " + reach + " 0 0 0 " + (ax + reach * Math.sin(half)).toFixed(1) + " " + (ay + reach * Math.cos(half)).toFixed(1) + " Z";
    function shown(id) {
      if (id === "I") return clamp(r / 0.05);
      var v = 0;
      TIES.forEach(function (t) { if (t[1] === id) v = Math.max(v, clamp((r - t[4] + 0.04) / 0.04)); });
      return v;
    }
    function curve(a, b, bend, gapA, gapB) {
      var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), N = 80;
      var qx = (a[0] + b[0]) / 2 - dy / len * bend, qy = (a[1] + b[1]) / 2 + dx / len * bend;
      function at(t) { var u = 1 - t; return [u * u * a[0] + 2 * u * t * qx + t * t * b[0], u * u * a[1] + 2 * u * t * qy + t * t * b[1]]; }
      var t0 = 0, t1 = 1;
      while (Math.hypot(at(t0)[0] - a[0], at(t0)[1] - a[1]) < gapA) t0 += 0.002;
      while (Math.hypot(at(t1)[0] - b[0], at(t1)[1] - b[1]) < gapB) t1 -= 0.002;
      var pts = []; for (var i = 0; i <= N; i++) pts.push(at(t0 + (t1 - t0) * i / N));
      return pts;
    }
    function circ(x, y, rr) { return "M" + (x - rr) + " " + y + " a " + rr + " " + rr + " 0 1 0 " + 2 * rr + " 0 a " + rr + " " + rr + " 0 1 0 " + -2 * rr + " 0 Z"; }
    function pos(id) { return [NODES[id].x, NODES[id].y]; }
    var faint = { stroke: INK, "stroke-width": .6, "stroke-dasharray": "1 3.5", "stroke-linecap": "round", fill: "none" };

    // the dark matter: hatching everywhere in the system outside the light
    var defs = svg.querySelector("defs");
    var hp = el("pattern", { id: "rv-out", width: 4.5, height: 4.5, patternUnits: "userSpaceOnUse", patternTransform: "rotate(-45)" }, defs);
    el("line", { x1: 0, y1: 0, x2: 0, y2: 4.5, stroke: INK, "stroke-width": .5, opacity: .7 }, hp);
    el("clipPath", { id: "rv-sys" }, defs).appendChild(el("path", { d: circ(SX, SY, SR) }));
    var dark = el("g", { "clip-path": "url(#rv-sys)" }, svg);
    el("path", { d: "M0 0 H" + W + " V" + H + " H0 Z " + beam, "fill-rule": "evenodd", fill: "url(#rv-out)" }, dark);
    el("path", { d: beam, fill: PAPER, stroke: "none" }, dark);
    // how far the light reaches, while it still stops short of the far side
    if (ay + reach < SY + SR) el("path", { d: "M" + (ax - reach * Math.sin(half)).toFixed(1) + " " + (ay + reach * Math.cos(half)).toFixed(1) + " A " + reach + " " + reach + " 0 0 0 " + (ax + reach * Math.sin(half)).toFixed(1) + " " + (ay + reach * Math.cos(half)).toFixed(1), stroke: INK, "stroke-width": .6, "stroke-dasharray": "1 3.5", "stroke-linecap": "round", fill: "none" }, dark);
    el("circle", { cx: SX, cy: SY, r: SR, fill: "none", stroke: INK, "stroke-width": .5 }, svg);

    // in the light
    var g = el("g", {}, svg);
    el("clipPath", { id: "rv-win" }, defs).appendChild(el("path", { d: beam }));
    g.setAttribute("clip-path", "url(#rv-win)");
    // what's beyond these five stays hidden unless the light happens to fall on it
    BEYOND.forEach(function (p) { el("circle", Object.assign({ cx: p[0], cy: p[1], r: 12 }, faint), g); });
    BEYOND_TIES.forEach(function (t) {
      var a = typeof t[0] === "number" ? BEYOND[t[0]] : pos(t[0]);
      el("path", Object.assign({ d: line(curve(a, BEYOND[t[1]], 0, typeof t[0] === "number" ? 18 : NR + 10, 18)) }, faint, { opacity: .7 }), g);
    });
    Object.keys(NODES).forEach(function (id) {
      if (shown(id) < 1) el("circle", Object.assign({ cx: NODES[id].x, cy: NODES[id].y, r: NR }, faint, { opacity: .5 }), g);
    });
    TIES.forEach(function (t) {
      var pts = curve(pos(t[0]), pos(t[1]), t[2], NR + 10, NR + 10), N = pts.length - 1;
      var f = clamp((r - t[3]) / (t[4] - t[3])), cut = Math.round(f * N), w = t[0] === "I" ? .95 : .7;
      if (cut < N) el("path", Object.assign({ d: line(pts.slice(cut)) }, faint, { opacity: .5 }), g);
      if (cut < 1) return;
      var seen = pts.slice(0, cut + 1);
      // a band of paper under the middle of the line, so it passes cleanly over anything drawn before it
      var mid = seen.slice(Math.round(N * 0.15), Math.min(seen.length, Math.round(N * 0.85)));
      if (mid.length > 1) el("path", { d: line(mid), stroke: PAPER, "stroke-width": 5, fill: "none" }, g);
      el("path", { d: line(seen), stroke: INK, "stroke-width": w, "stroke-linecap": "round", fill: "none" }, g);
    });
    Object.keys(NODES).forEach(function (id) {
      var n = NODES[id], v = shown(id);
      if (v <= 0) return;
      var ng = el("g", { opacity: v.toFixed(2) }, g);
      el("circle", { cx: n.x, cy: n.y, r: NR + 5, fill: PAPER, stroke: INK, "stroke-width": .5 }, ng);
      textured(ng, url, { d: circ(n.x, n.y, NR) }, n);
      if (n.fill === "blank") el("circle", Object.assign({ cx: n.x, cy: n.y, r: NR - 4 }, faint), ng);
    });

    // the experiment, through the visible service, to what it touches
    var py = 64, sTop = SY - SR, ring = NR + 10, top = NODES.I.y - ring;
    if (r > 0.03) el("circle", { cx: NODES.I.x, cy: NODES.I.y, r: ring, fill: "none", stroke: INK, "stroke-width": .75, "stroke-dasharray": "1.5 3", "stroke-linecap": "round", opacity: clamp(r / 0.05) }, svg);
    // the edges of the light, from the experiment to where they leave the system
    [-1, 1].forEach(function (sd) {
      var ux = sd * Math.sin(half), uy = Math.cos(half), dx = ax - SX, dy = ay - SY, bb = dx * ux + dy * uy;
      var e = Math.min(reach, -bb + Math.sqrt(bb * bb - (dx * dx + dy * dy - SR * SR)));
      el("path", { d: line([[ax, ay], [ax + ux * e, ay + uy * e]]), stroke: INK, "stroke-width": .75, fill: "none" }, svg);
    });
    var shaft = line([[cx, sTop], [cx, sTop + (top - sTop) * clamp(r / 0.05)]]);
    halo(svg, shaft, 4);
    el("path", { d: shaft, stroke: INK, "stroke-width": 1.1, fill: "none" }, svg);
    // the top of the system is the visible service
    var arc = []; for (var a = -150; a <= -30.1; a += 2) arc.push([SX + SR * Math.cos(a * Math.PI / 180), SY + SR * Math.sin(a * Math.PI / 180)]);
    el("path", { d: line(arc), stroke: INK, "stroke-width": 1.1, fill: "none" }, svg);
    el("circle", { cx: cx, cy: sTop, r: 3.6, fill: PAPER, stroke: INK, "stroke-width": .9 }, svg);
    probe(svg, cx, py);
    label(svg, "The experiment", cx + 28, py + 5, "start", true);

    // labels sit outside the system, on leaders, the way the navigation model labels its rings
    var LX = SX - SR - 70, RX = SX + SR + 70;
    function tag(text, x, y, side, muted) {
      leader(svg, side < 0 ? LX + 12 : RX - 12, y, x, y);
      label(svg, text, side < 0 ? LX : RX, y + 5, side < 0 ? "end" : "start", muted);
    }
    var vs = [SX + SR * Math.cos(-140 * Math.PI / 180), SY + SR * Math.sin(-140 * Math.PI / 180)];
    tag("The visible service", vs[0] - 4, vs[1], -1);
    Object.keys(NODES).forEach(function (id) {
      var n = NODES[id];
      if (shown(id) > 0.5) tag(n.name, n.x + n.side * (NR + 9), n.y, n.side);
    });
    tag("Dark matter", SX + SR * Math.cos(25 * Math.PI / 180) - 30, SY + SR * Math.sin(25 * Math.PI / 180), 1);
  }

  window.PROBES = { reveal: reveal, weave: weave, weaveBeforeAfter: weaveBeforeAfter, beneath: beneath, rearrange: rearrange, push: push, mobile: mobile, treacle: treacle, size: { width: W, height: H } };
})();
