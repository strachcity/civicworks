// Exports the essay images for "Experimentation as navigation" from the live page, so the images
// and the prototype share one drawing.   NODE_PATH=$(npm root -g) node capture.js [outdir]
// Needs Playwright with Chromium. Works on a temporary copy of index.html with a small hook added
// to turn the model, so the page itself is unchanged. Walks a short route first so the model
// carries some learning, then writes three 1456 px wide PNGs on white:
//   navigation-1-model     three quarters on, no pace ruler
//   navigation-2-end-on    end on, the three questions under their corners
//   navigation-3-side-on   side on, the layers and the pace ruler
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
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
  } finally {
    await b.close();
    fs.unlinkSync(tmp);
  }
})();
