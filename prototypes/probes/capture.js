// Exports each illustration from the page as an essay-ready image, so the page and the images
// share one drawing.   NODE_PATH=$(npm root -g) node capture.js [outdir]
// Needs Playwright with Chromium. Writes probe-a-weave (plain, -arrows and -before-after),
// probe-b-mobile, probe-c-treacle, probe-d-beneath (plain and -arrows), probe-e-rearrange,
// probe-f-push and probe-g-reveal (finished and -partway), each
// as a 1456 x 640 PNG on white and as a standalone SVG with real text.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || __dirname;
const SHOTS = [['svg-a', 'probe-a-weave'], ['svg-a-arrows', 'probe-a-weave-arrows'], ['svg-a-ba', 'probe-a-weave-before-after'], ['svg-b', 'probe-b-mobile'], ['svg-c', 'probe-c-treacle'],
  ['svg-d', 'probe-d-beneath'], ['svg-d', 'probe-d-beneath-arrows', "document.getElementById('d-arrows').click()"],
  ['svg-e', 'probe-e-rearrange'], ['svg-f', 'probe-f-push'],
  ['svg-g', 'probe-g-reveal'], ['svg-g', 'probe-g-reveal-partway', "(function () { var r = document.getElementById('seen'); r.value = 0.38; r.dispatchEvent(new Event('input')); })()"]];
(async () => {
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const b = await chromium.launch({ executablePath: exe });
  const p = await b.newPage({ viewport: { width: 1800, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(__dirname, 'index.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.frame { border: 0 !important; } .frame svg { width: 1456px !important; height: 640px !important; }' });
  await p.waitForTimeout(400);
  for (const [id, name, setup] of SHOTS) {
    if (setup) await p.evaluate(setup);
    const box = await (await p.$('#' + id)).boundingBox();
    await p.screenshot({ path: path.join(out, name + '.png'), fullPage: true, clip: { x: Math.round(box.x), y: Math.round(box.y), width: 1456, height: 640 } });
    const svg = await p.evaluate((id) => {
      const s = document.getElementById(id).cloneNode(true);
      s.removeAttribute('id'); s.removeAttribute('role'); s.removeAttribute('style');
      s.setAttribute('width', '1456'); s.setAttribute('height', '640');
      s.insertAdjacentHTML('afterbegin', '<style>@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&amp;display=swap");</style>');
      return s.outerHTML;
    }, id);
    fs.writeFileSync(path.join(out, name + '.svg'), svg);
  }
  await b.close();
})();
