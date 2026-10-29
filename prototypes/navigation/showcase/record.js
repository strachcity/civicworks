// Renders the showcase as a video.   NODE_PATH=$(npm root -g) node record.js [outdir]
// Needs Playwright with Chromium, Python 3 and ffmpeg. Serves the prototypes folder locally, runs
// the same choreography as the showcase page (play.js) inside the live page on a controlled clock,
// and photographs every frame, so the motion is smooth and the same every time. Writes navigation-showcase-10s.mp4,
// 1920 x 1080 at 30 frames a second.
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const out = process.argv[2] || path.join(__dirname, '..');
const FPS = 30, SECONDS = 10, PORT = 8000 + Math.floor(Math.random() * 900);
const root = path.join(__dirname, '..', '..');

(async () => {
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  const frames = fs.mkdtempSync(path.join(os.tmpdir(), 'showcase-frames-'));
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const b = await chromium.launch({ executablePath: exe });
  try {
    await new Promise(r => setTimeout(r, 800));
    const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5, colorScheme: 'light' });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    // the choreography runs inside the model's own page, so both share the controlled clock
    await p.clock.install();
    await p.goto(`http://127.0.0.1:${PORT}/navigation/`);
    await p.evaluate(() => document.fonts.ready);
    await p.addScriptTag({ path: path.join(__dirname, 'play.js') });
    // from here time only moves when we move it, so taking a picture doesn't eat into the motion
    await p.clock.pauseAt(await p.evaluate(() => Date.now()) + 600);
    await p.evaluate(() => NavShowcase.start({ doc: document, loop: false }));
    for (let f = 0; f < FPS * SECONDS; f++) {
      await p.clock.runFor(1000 / FPS);
      await p.screenshot({ path: path.join(frames, String(f).padStart(4, '0') + '.png') });
    }
    if (errs.length) console.error(errs.join('\n'));
  } finally {
    await b.close();
    server.kill();
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, '%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart',
    path.join(out, 'navigation-showcase-10s.mp4')]);
  fs.rmSync(frames, { recursive: true, force: true });
})();
