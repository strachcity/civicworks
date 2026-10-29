// Exports the essay images for "Experimentation as navigation" from the live page, so the images
// and the prototype share one drawing.   NODE_PATH=$(npm root -g) node capture.js [outdir]
// Needs Playwright with Chromium. Works on a temporary copy of index.html with a small hook added
// to turn the model, so the page itself is unchanged. Walks a short route first so the model
// carries some learning, then writes three 1456 px wide PNGs on white:
//   navigation-1-model     three quarters on, no pace ruler
//   navigation-2-end-on    end on, the three questions under their corners
//   navigation-3-side-on   side on, the layers and the pace ruler
// and the article's thumbnail, navigation-thumbnail-light and -dark, 2400 x 1260 (needs ffmpeg).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const out = process.argv[2] || __dirname;
const VIEW = { width: 1092, height: 728 }, SCALE = 1456 / 1092;
const CLEAN = '.note, .ctrl, .about, .meta, .hint, svg.leader, .title { display: none !important; }';

(async () => {
  const src = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const anchor = '  state = fresh();\n  resize();\n';
  if (!src.includes(anchor)) throw new Error('capture hook anchor not found in index.html');
  const tmp = path.join(__dirname, '.capture.html');
  fs.writeFileSync(tmp, src.replace(anchor, anchor + '  window.__nav = { view: view, fromAngles: fromAngles, req: requestFrame, setLayer: setLayer, turn: turn, look: look, still: function () { idle = function () { return false; }; } };\n'));
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const b = await chromium.launch({ executablePath: exe });
  try {
    const p = await b.newPage({ viewport: VIEW, deviceScaleFactor: SCALE, colorScheme: 'light' });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + tmp);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    // a short route, so corners pull, rings swell and the trail shows where it has been
    await p.evaluate(async () => {
      const n = window.__nav, wait = ms => new Promise(r => setTimeout(r, ms));
      n.still(); // no drifting while it's photographed
      n.turn(0); await wait(900);
      for (const [layer, steps] of [[1, 2], [2, 2], [3, 1]]) { n.setLayer(layer); await wait(500); n.turn(steps); await wait(1300); }
    });
    async function orient(yaw, pitch) {
      await p.evaluate(([y, q]) => { const n = window.__nav; n.view.align = null; n.view.spin = 0; n.view.M = n.fromAngles(y, q); n.req(); }, [yaw, pitch]);
      await p.waitForTimeout(500);
    }
    async function look(which) { await p.evaluate(w => window.__nav.look(w), which); await p.waitForTimeout(2400); }
    const shot = name => p.screenshot({ path: path.join(out, name + '.png') });

    await p.addStyleTag({ content: CLEAN + ' #g-scale { display: none !important; }' });
    await orient(-38, 24);
    await shot('navigation-1-model');

    await p.addStyleTag({ content: '#layers { display: none !important; }' });
    await look('end');
    await shot('navigation-2-end-on');

    await p.addStyleTag({ content: '#layers { display: block !important; } #g-scale { display: inline !important; } .corner small { display: none !important; }' });
    await look('side');
    await orient(-14, 10);
    await shot('navigation-3-side-on');
    if (errs.length) console.error(errs.join('\n'));

    // the article's thumbnail, light and dark, at share card proportions, cropped to the model and its labels
    for (const scheme of ['light', 'dark']) {
      const q = await b.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 3, colorScheme: scheme });
      await q.goto('file://' + tmp);
      await q.evaluate(() => document.fonts.ready);
      await q.waitForTimeout(400);
      await q.evaluate(async () => {
        const n = window.__nav, wait = ms => new Promise(r => setTimeout(r, ms));
        n.still(); n.turn(0); await wait(900);
        for (const [layer, steps] of [[1, 2], [2, 2], [3, 1]]) { n.setLayer(layer); await wait(500); n.turn(steps); await wait(1300); }
      });
      await q.addStyleTag({ content: CLEAN + ' #g-scale, .corner small { display: none !important; }' });
      await q.evaluate(() => { const n = window.__nav; n.view.align = null; n.view.spin = 0; n.view.M = n.fromAngles(-38, 24); n.req(); });
      await q.waitForTimeout(600);
      const c = await q.evaluate(() => {
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        const els = [...document.querySelectorAll('#scene *:not(#frame-circle):not(g):not(defs):not(defs *):not(clipPath):not(clipPath *)'), ...document.querySelectorAll('.lbl, .layer-btn span')];
        els.forEach(e => {
          const cs = getComputedStyle(e);
          if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
          const r = e.getBoundingClientRect();
          if ((!r.width && !r.height) || r.right < 0 || r.left > innerWidth || r.bottom < 0 || r.top > innerHeight) return;
          x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
        });
        return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
      });
      const h = Math.max(c.h * 1.14, c.w * 1.14 / 1.905), w = h * 1.905;
      const raw = path.join(out, '.thumb-' + scheme + '.png');
      await q.screenshot({ path: raw, clip: { x: c.x - w / 2, y: c.y - h / 2, width: w, height: h } });
      await q.close();
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-vf', 'scale=2400:1260:flags=lanczos', path.join(out, 'navigation-thumbnail-' + scheme + '.png')]);
      fs.unlinkSync(raw);
    }
  } finally {
    await b.close();
    fs.unlinkSync(tmp);
  }
})();
