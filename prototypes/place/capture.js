// Exports the essay images from the live page, so the images and the page share one drawing.
//   NODE_PATH=$(npm root -g) node capture.js [outdir]
// Needs Playwright with Chromium. Writes place-diagram-single, place-diagram (side by side) and
// place-diagram-mobile (stacked for phones), each as a 1456 px wide PNG on white and as an
// editable SVG with real text and its colours written in. Also writes the alternative drawn as
// separate planes, planes/place-planes.png and .svg.
const { chromium } = require('playwright');
const path = require('path');
const out = process.argv[2] || __dirname;
const page = 'file://' + path.join(__dirname, 'index.html');
const SHOTS = [
  { file: 'place-diagram-single.png', hash: '', w: 728, h: 690, scale: 2 },
  { file: 'place-diagram.png', hash: '#pair', w: 1092, h: 810, scale: 1456 / 1092 },
  { file: 'place-diagram-mobile.png', hash: '#pair', w: 390, h: 844, scale: 1456 / 390, full: true },
];
(async () => {
  const exe = require('fs').existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const b = await chromium.launch({ executablePath: exe });
  for (const s of SHOTS) {
    const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: s.scale, colorScheme: 'light' });
    await p.goto(page + '?capture' + s.hash);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(out, s.file), fullPage: !!s.full });
    const svg = await p.evaluate(() => {
      // copy the drawing with its computed styles written onto each element, so it stands alone
      const src = document.getElementById('scene');
      const copy = src.cloneNode(true);
      const props = ['fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap',
        'stroke-linejoin', 'stroke-opacity', 'opacity', 'font-family', 'font-size', 'font-weight', 'letter-spacing'];
      const a = src.querySelectorAll('*'), b = copy.querySelectorAll('*');
      a.forEach((el, i) => {
        const cs = getComputedStyle(el);
        const style = props.map(k => k + ':' + cs.getPropertyValue(k)).join(';');
        b[i].setAttribute('style', style);
        b[i].removeAttribute('class');
      });
      const box = src.getAttribute('viewBox').split(' ');
      copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      copy.setAttribute('width', box[2]); copy.setAttribute('height', box[3]);
      copy.removeAttribute('id'); copy.removeAttribute('aria-hidden');
      copy.insertAdjacentHTML('afterbegin', '<style>@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&amp;display=swap");</style><rect width="100%" height="100%" fill="#ffffff"/>');
      return copy.outerHTML;
    });
    require('fs').writeFileSync(path.join(out, s.file.replace('.png', '.svg')), svg);
    await p.close();
  }
  // the alternative drawn as separate planes, a fixed 1456 wide drawing on its own page
  const pp = await b.newPage({ viewport: { width: 1456, height: 1480 }, colorScheme: 'light' });
  await pp.goto('file://' + path.join(__dirname, 'planes', 'index.html') + '?capture');
  await pp.evaluate(() => document.fonts.ready);
  await pp.waitForTimeout(400);
  const planesOut = process.argv[2] ? out : path.join(__dirname, 'planes');
  await (await pp.$('#scene')).screenshot({ path: path.join(planesOut, 'place-planes.png') });
  const planesSvg = await pp.evaluate(() => {
    const src = document.getElementById('scene'), copy = src.cloneNode(true);
    const props = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-family', 'font-size', 'font-weight', 'letter-spacing'];
    const a = src.querySelectorAll('*'), c = copy.querySelectorAll('*');
    a.forEach((el, i) => { const cs = getComputedStyle(el); c[i].setAttribute('style', props.map(k => k + ':' + cs.getPropertyValue(k)).join(';')); c[i].removeAttribute('class'); });
    copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); copy.setAttribute('width', '1456'); copy.setAttribute('height', '1480');
    copy.removeAttribute('id'); copy.removeAttribute('role');
    copy.insertAdjacentHTML('afterbegin', '<style>@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&amp;display=swap");</style><rect width="100%" height="100%" fill="#ffffff"/>');
    return copy.outerHTML;
  });
  require('fs').writeFileSync(path.join(planesOut, 'place-planes.svg'), planesSvg);
  await b.close();
})();
