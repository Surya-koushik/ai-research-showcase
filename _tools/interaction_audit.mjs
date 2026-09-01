import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8099';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
await context.addInitScript(() => sessionStorage.setItem('asure.introSeen', '1'));
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));

const checks = {};

await page.goto(`${base}/index.html?intro=off`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
checks.drawerClosedInert = await page.locator('#sidebar').evaluate((node) => node.inert && node.getAttribute('aria-hidden') === 'true');
await page.locator('#navToggle').click();
checks.drawerOpenFocus = await page.evaluate(() => document.activeElement?.id === 'navClose' && !document.querySelector('#sidebar').inert);
await page.keyboard.press('Escape');
checks.drawerCloseReturnFocus = await page.evaluate(() => document.activeElement?.id === 'navToggle' && document.querySelector('#sidebar').inert);
await page.locator('#search').fill('zzzz-no-such-tool');
checks.emptyStateVisible = await page.locator('#empty').isVisible();
await page.locator('#resetFilters').click();
checks.emptyResetWorks = await page.evaluate(() => document.querySelector('#search').value === '' && getComputedStyle(document.querySelector('#empty')).display === 'none');
await page.locator('#search').focus();
checks.searchFocusVisible = await page.locator('#search').evaluate((node) => getComputedStyle(node).outlineStyle !== 'none' || getComputedStyle(node).boxShadow !== 'none');
checks.kindChipContrast = await page.evaluate(() => {
  const rgb = (value) => {
    const channels = (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    return value.startsWith('color(srgb') ? channels.map((channel) => channel * 255) : channels;
  };
  const lum = (value) => {
    const channels = rgb(value).map((channel) => {
      const normal = channel / 255;
      return normal <= .04045 ? normal / 12.92 : ((normal + .055) / 1.055) ** 2.4;
    });
    return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
  };
  return Math.min(...[...document.querySelectorAll('.tr-kind')].map((node) => {
    const style = getComputedStyle(node);
    const a = lum(style.color), b = lum(style.backgroundColor);
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  })) >= 4.5;
});
await page.locator('#roadmap').scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
checks.navActiveState = await page.locator('.nav-pills .nl.is-active').getAttribute('href');

await page.goto(`${base}/tool.html?id=not-a-real-tool`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
checks.invalidToolState = await page.locator('h1').textContent();

await page.goto(`${base}/projects/p25-predictability/html/dashboard.html`, { waitUntil: 'networkidle' });
await page.locator('[data-view="boq"]').click();
checks.predictabilityNavigation = await page.locator('#crumbHere').textContent();

await page.goto(`${base}/projects/tep-dashboard/html/dashboard.html`, { waitUntil: 'networkidle' });
const tepTabs = page.locator('.tab-btn');
if (await tepTabs.count() > 1) {
  await tepTabs.nth(1).click();
  checks.tepTabNavigation = await tepTabs.nth(1).evaluate((node) => node.classList.contains('active'));
}

await page.goto(`${base}/cms.html`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const rowsBefore = await page.locator('#rows .row').count();
await page.locator('#find').fill('CAD3D');
const rowsAfter = await page.locator('#rows .row').count();
checks.mediaDeskSearch = { rowsBefore, rowsAfter };

await page.goto(`${base}/login.html`, { waitUntil: 'networkidle' });
checks.loginUnavailableState = await page.evaluate(() => {
  const button = document.querySelector('#signInBtn');
  const note = document.querySelector('.setup-note');
  return button?.disabled === true && Boolean(note?.textContent.trim());
});

await browser.close();
const passed = Object.entries(checks).filter(([, value]) => value !== false && value !== null && value !== '' && !(typeof value === 'object' && 'rowsAfter' in value && value.rowsAfter >= value.rowsBefore)).length;
const total = Object.keys(checks).length;
console.log(JSON.stringify({ passed, total, errors: errors.length, checks, consoleErrors: errors }));
if (passed !== total || errors.length) process.exitCode = 1;
