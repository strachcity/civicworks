// Records a five second showcase of the interactive model from the live page.
//   NODE_PATH=$(npm root -g) node video.js [outdir]
// Needs Playwright with Chromium, and ffmpeg. The page runs on a controlled clock and every frame
// is photographed, so the motion is smooth and the same every time. Works on a temporary copy of
// index.html with a small hook added, so the page itself is unchanged. The model is flicked and
// tumbles, settles on a face with its note, steps down a layer and turns, then turns end on to
// the three questions. Writes navigation-showcase.mp4, 1920 x 1080 at 30 frames a second.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const out = process.argv[2] || __dirname;
const FPS = 30, SECONDS = 5;

// what happens, by time in seconds
const SCRIPT = [
  [0.35, 'n.flick(0.25, 2.1)'],
  [2.55, 'n.setLayer(3); n.turn(1)'],
  [3.7, 'n.look("end")']
];

(async () => {
  const src = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const anchor = '  state = fresh();\n  resize();\n';
  if (!src.includes(anchor)) throw new Error('hook anchor not found in index.html');
  const hook = '  window.__nav = { setLayer: setLayer, turn: turn, look: look,\n' +
    '    flick: function (vx, vy) { input(); touch(); hint.classList.add("gone"); view.align = null; view.spin = 0; view.vx = vx; view.vy = vy; view.coasting = true; requestFrame(); } };\n';
  const tmp = path.join(__dirname, '.video.html');
  fs.writeFileSync(tmp, src.replace(anchor, anchor + hook));
  const frames = fs.mkdtempSync(path.join(os.tmpdir(), 'nav-frames-'));
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const b = await chromium.launch({ executablePath: exe });
  try {
    const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5, colorScheme: 'light' });
    await p.clock.install();
    await p.goto('file://' + tmp);
    await p.evaluate(() => document.fonts.ready);
    await p.addStyleTag({ content: '.about { display: none !important; }' });
    await p.clock.runFor(1500); // let the opening settle
    const total = FPS * SECONDS;
    let next = 0;
    for (let f = 0; f < total; f++) {
      const t = f / FPS;
      while (next < SCRIPT.length && SCRIPT[next][0] <= t) { await p.evaluate(code => { const n = window.__nav; eval(code); }, SCRIPT[next][1]); next++; }
      await p.screenshot({ path: path.join(frames, String(f).padStart(4, '0') + '.png') });
      await p.clock.runFor(1000 / FPS);
    }
  } finally {
    await b.close();
    fs.unlinkSync(tmp);
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, '%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart',
    path.join(out, 'navigation-showcase.mp4')]);
  fs.rmSync(frames, { recursive: true, force: true });
})();
