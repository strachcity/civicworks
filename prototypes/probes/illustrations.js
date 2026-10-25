// Three editorial illustrations for "Experimentation as probes", in the CIVICWORKS drawing
// language: one ink on white, tints and textures instead of colour, three line weights.
//
// Each function draws into an empty <svg> and can be called again with new options:
//   PROBES.weave(svg, { pull: 0.8, arrows: true })      A, pull one thread
//   PROBES.weaveBeforeAfter(svg, { pull: 0.85 })       A, before and after, with arrows
//   PROBES.mobile(svg, { weight: 0.85, ghost: true })    B, rebalance the mobile
//   PROBES.treacle(svg, { seed: 7, reveal: 1 })          C, taste the treacle
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

  window.PROBES = { weave: weave, weaveBeforeAfter: weaveBeforeAfter, mobile: mobile, treacle: treacle, size: { width: W, height: H } };
})();
