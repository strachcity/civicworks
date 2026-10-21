const { chromium } = require('playwright');
(async () => {
  const [svg, png, w] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: +w, height: 400 }, deviceScaleFactor: 1 });
  const fs = require('fs');
  await p.setContent('<html><body style="margin:0;background:#fff">' + fs.readFileSync(svg, 'utf8') + '</body></html>');
  await p.waitForTimeout(1500);
  const el = await p.$('svg');
  await el.screenshot({ path: png });
  await b.close();
})();
