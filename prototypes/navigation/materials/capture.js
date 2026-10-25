// Exports a still of the materials model for the essay, cut from the live page so the image and
// the prototype share one drawing.   NODE_PATH=$(npm root -g) node capture.js [outdir]
// Needs Playwright with Chromium. Selects one material, waits for the model to settle, hides the
// page's controls and notes, and adds two leaders in the page's own label style: one to the
// selected material, one to the materials it moves with. Writes materials-depth.png, 1456 px wide
// on white.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || __dirname;
const MATERIAL = 'legislation';
const CLIP = { x: 150, y: 70, width: 1100, height: 720 };

(async () => {
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const b = await chromium.launch({ executablePath: exe });
  const p = await b.newPage({ viewport: { width: 1456, height: 900 }, deviceScaleFactor: 1456 / CLIP.width, colorScheme: 'light' });
  await p.goto('file://' + path.join(__dirname, 'index.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const name = await p.evaluate((id) => {
    const m = window.MATERIALS.find(x => x.id === id);
    [...document.querySelectorAll('#mat-list button')].find(b => b.getAttribute('aria-label').indexOf(m.name) === 0).click();
    return m.name;
  }, MATERIAL);
  await p.waitForTimeout(3500);
  await p.addStyleTag({ content: `
    header.title, .meta, .note, .ctrl, nav.mats, details.about, #hint, svg.leader { display: none !important; }
    .corner small { display: none !important; }
    #essay-labels { position: fixed; inset: 0; pointer-events: none; z-index: 99; font-family: "Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif; }
    #essay-labels svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    #essay-labels .t { position: absolute; color: #a92c17; text-align: right; }
    #essay-labels .name { font-weight: 500; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; }
    #essay-labels .head { font-weight: 500; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: #93402f; margin-bottom: 6px; }
    #essay-labels .list { font-size: 13px; line-height: 1.5; }
  ` });
  await p.evaluate(({ id, name }) => {
    const m = window.MATERIALS.find(x => x.id === id);
    const links = m.links.map(l => window.MATERIALS.find(x => x.id === l).name);
    // a point on one of the drawn arcs, in page coordinates: pick the path, then the point along it
    function anchor(sel, pickPath, score) {
      const best = pickPath([...document.querySelectorAll('#scene ' + sel)]);
      const L = best.getTotalLength(), c = best.getScreenCTM();
      let top = null;
      for (let i = 0; i <= 60; i++) {
        const q = best.getPointAtLength(L * i / 60), pt = { x: c.a * q.x + c.c * q.y + c.e, y: c.b * q.x + c.d * q.y + c.f };
        if (!top || score(pt) > score(top)) top = pt;
      }
      return top;
    }
    const longest = ps => ps.reduce((a, b) => b.getTotalLength() > a.getTotalLength() ? b : a);
    // the top of the selected material's longest arc
    const sel = anchor('.arc-line.first.front', longest, pt => -pt.y);
    // the bottom of the dotted arc nearest the citizen end, a layer the selected material doesn't reach itself
    const dep = anchor('.arc-line.dep.front', ps => ps.reduce((a, b) => b.getBBox().x < a.getBBox().x ? b : a), pt => pt.y);
    const NS = 'http://www.w3.org/2000/svg', wrap = document.createElement('div');
    wrap.id = 'essay-labels';
    const svg = document.createElementNS(NS, 'svg');
    wrap.appendChild(svg);
    function leader(x1, y1, x2, y2) {
      const l = document.createElementNS(NS, 'path');
      l.setAttribute('d', `M${x1} ${y1} L${x2} ${y2}`);
      Object.entries({ stroke: '#d63c23', 'stroke-width': .6, 'stroke-dasharray': '1 3.5', 'stroke-linecap': 'round', fill: 'none' }).forEach(([k, v]) => l.setAttribute(k, v));
      svg.appendChild(l);
      const c = document.createElementNS(NS, 'circle');
      Object.entries({ cx: x2, cy: y2, r: 3.6, fill: '#fff', stroke: '#d63c23', 'stroke-width': .9 }).forEach(([k, v]) => c.setAttribute(k, v));
      svg.appendChild(c);
    }
    function text(html, right, top) {
      const t = document.createElement('div');
      t.className = 't'; t.innerHTML = html;
      t.style.right = (window.innerWidth - right) + 'px'; t.style.top = top + 'px';
      wrap.appendChild(t);
      return t;
    }
    leader(sel.x - 150, sel.y - 46, sel.x - 2, sel.y - 2);
    text(`<div class="name">${name}</div>`, sel.x - 158, sel.y - 55);
    leader(dep.x - 150, dep.y + 56, dep.x - 1, dep.y + 2);
    text(`<div class="head">Moves with</div><div class="list">${links.join('<br>')}</div>`, dep.x - 158, dep.y + 49);
    document.body.appendChild(wrap);
  }, { id: MATERIAL, name });
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(out, 'materials-depth.png'), clip: CLIP });
  await b.close();
})();
