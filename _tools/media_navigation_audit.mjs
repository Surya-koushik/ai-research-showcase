import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8099';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(`${base}/index.html?intro=off&v=13`, { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.locator('#videos').scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);

const result = await page.evaluate(() => {
  const group = (id) => document.querySelector(`[data-group="${id}"]`);
  const videos = [...document.querySelectorAll('#videoGroups video')];
  return {
    nav: [...document.querySelectorAll('#navPills a')].map((link) => link.getAttribute('href')),
    sidebarVisible: getComputedStyle(document.querySelector('#sidebar')).transform === 'none',
    sidebarWidth: Math.round(document.querySelector('#sidebar').getBoundingClientRect().width),
    videoCount: videos.length,
    controlledVideoCount: videos.filter((video) => video.controls).length,
    plottingControlled: Boolean(document.querySelector('[data-hay*="plotting"] video[controls]')),
    masterplanControlled: Boolean(document.querySelector('[data-hay*="masterplan"] video[controls]')),
    dashboardCards: group('dashboard')?.querySelectorAll('.vclip-card').length || 0,
    pluginCards: group('plugin')?.querySelectorAll('.vclip-card').length || 0,
    brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
});

result.consoleErrors = errors;
result.pass = result.sidebarVisible && result.sidebarWidth === 272 &&
  result.videoCount > 0 && result.videoCount === result.controlledVideoCount &&
  result.plottingControlled && result.masterplanControlled &&
  result.dashboardCards === 6 && result.pluginCards === 3 &&
  result.brokenImages.length === 0 && result.horizontalOverflow === 0 && errors.length === 0;

console.log(JSON.stringify(result, null, 2));
await page.screenshot({ path: '_design/audit-2026-08-31/home-media-v13-1440.png' });
await browser.close();
process.exit(result.pass ? 0 : 1);
