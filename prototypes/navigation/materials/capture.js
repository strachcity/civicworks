// Exports a still of the materials model for the essay, cut from the live page so the image and
// the prototype share one drawing.   NODE_PATH=$(npm root -g) node capture.js [outdir]
// Needs Playwright with Chromium. Selects one material and waits for the model to settle, then
// strips the page back to the rings of the layers. On it go the material and the materials it moves
// with, each a point on the ring of a layer it reaches, joined by one dotted loop that runs through
// the layers. Only the materials are named. Writes materials-depth.png, 1456 px wide on white.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || __dirname;
const MATERIAL = 'legislation';
// where each sits: the layer (0 citizen interaction to 4 political and strategic support), and how
// far round the front of that ring, 0 at the top to 1 at the bottom
const PLACE = {
  legislation: [4, 0.24],
  funding: [4, 0.66],
  accountability: [3, 0.86],
  evidence: [1, 0.5],
  'info-governance': [2, 0.14]
};
const CLIP = { x: 300, y: 110, width: 900, height: 600 };

(async () => {
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const b = await chromium.launch({ executablePath: exe });
  const p = await b.newPage({ viewport: { width: 1456, height: 900 }, deviceScaleFactor: 1456 / CLIP.width, colorScheme: 'light' });
  await p.goto('file://' + path.join(__dirname, 'index.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.evaluate((id) => {
    const m = window.MATERIALS.find(x => x.id === id);
    [...document.querySelectorAll('#mat-list button')].find(b => b.getAttribute('aria-label').indexOf(m.name) === 0).click();
  }, MATERIAL);
  await p.waitForTimeout(3500);
  // only the cone and its rings stay
  await p.addStyleTag({ content: `
    header.title, .meta, .note, .ctrl, nav.mats, details.about, #hint, svg.leader, .lbl, #layers { display: none !important; }
    #frame-circle, #g-scale, .tri, .face, .far-tri, .vertex, .tri-dot, .sphere-base, .sphere-dots, .trail, .thread, .thread-end,
    .arc-line, .arc-band, .edge-ext, .axis, .top-disc, .section, #sphere-clip + circle { display: none !important; }
    .layer .ring-front { stroke-width: .75 !important; stroke-dasharray: none !important; opacity: 1 !important; animation: none !important; }
    .layer .ring-back { opacity: .7 !important; }
    .layer .ring-disc { fill: none !important; }
    #essay { position: fixed; inset: 0; pointer-events: none; z-index: 99; }
    #essay svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; font-family: "Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  ` });
  await p.evaluate(({ id, place }) => {
    const NS = 'http://www.w3.org/2000/svg';
    const INK = '#d63c23', TEXT = '#a92c17';
    // the front of each layer's ring, ordered from the citizen end inwards
    const rings = [...document.querySelectorAll('#scene .ring-front')]
      .map(r => { const bb = r.getBBox(); return { r, cx: bb.x + bb.width / 2 }; })
      .sort((a, b) => a.cx - b.cx).map(o => o.r);
    function onRing(layer, t) {
      const r = rings[layer], L = r.getTotalLength(), c = r.getScreenCTM();
      // the path may run either way, so measure from whichever end is higher
      const s = r.getPointAtLength(0), e = r.getPointAtLength(L);
      const q = r.getPointAtLength((s.y < e.y ? t : 1 - t) * L);
      return { x: c.a * q.x + c.c * q.y + c.e, y: c.b * q.x + c.d * q.y + c.f };
    }
    const m = window.MATERIALS.find(x => x.id === id);
    const pts = [id].concat(m.links).map(k => {
      const at = onRing(place[k][0], place[k][1]);
      return { id: k, name: window.MATERIALS.find(x => x.id === k).name, x: at.x, y: at.y };
    });
    // one loop through all of them, in order round their middle, smoothed
    const cx = pts.reduce((s, q) => s + q.x, 0) / pts.length, cy = pts.reduce((s, q) => s + q.y, 0) / pts.length;
    const loop = pts.slice().sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
    const n = loop.length;
    let d = 'M' + loop[0].x + ' ' + loop[0].y;
    for (let i = 0; i < n; i++) {
      const p0 = loop[(i - 1 + n) % n], p1 = loop[i], p2 = loop[(i + 1) % n], p3 = loop[(i + 2) % n];
      d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
    }
    const wrap = document.createElement('div'); wrap.id = 'essay';
    const svg = document.createElementNS(NS, 'svg'); wrap.appendChild(svg);
    function add(tag, attrs) { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); svg.appendChild(e); return e; }
    add('path', { d, fill: 'none', stroke: INK, 'stroke-width': 1.6, 'stroke-dasharray': '2 5', 'stroke-linecap': 'round' });
    pts.forEach(q => {
      if (q.id === id) add('circle', { cx: q.x, cy: q.y, r: 15, fill: 'none', stroke: INK, 'stroke-width': .9, 'stroke-dasharray': '1.5 3', 'stroke-linecap': 'round' });
      add('circle', { cx: q.x, cy: q.y, r: q.id === id ? 7.5 : 6, fill: INK });
      // the name sits outside the loop, away from its middle
      const ux = q.x - cx, uy = q.y - cy, ul = Math.hypot(ux, uy) || 1, off = q.id === id ? 26 : 20;
      const tx = q.x + ux / ul * off, ty = q.y + uy / ul * off + 5;
      const t = add('text', { x: tx, y: ty, 'text-anchor': ux > 12 ? 'start' : ux < -12 ? 'end' : 'middle', fill: TEXT,
        'font-size': 15, 'font-weight': q.id === id ? 500 : 400, stroke: '#fff', 'stroke-width': 6, 'paint-order': 'stroke', 'stroke-linejoin': 'round' });
      t.textContent = q.name;
    });
    document.body.appendChild(wrap);
  }, { id: MATERIAL, place: PLACE });
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(out, 'materials-depth.png'), clip: CLIP });
  await b.close();
})();
