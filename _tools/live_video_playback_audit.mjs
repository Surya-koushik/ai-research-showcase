import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = (process.argv[2] || 'https://surya-koushik.github.io/ai-research-showcase').replace(/\/$/, '');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const consoleErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => consoleErrors.push(error.message));

await page.goto(`${base}/index.html?intro=off&playback-audit=1`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForSelector('#videoGroups video', { timeout: 15000 });

const count = await page.locator('#videoGroups video').count();
const results = [];
for (let index = 0; index < count; index += 1) {
  const video = page.locator('#videoGroups video').nth(index);
  await video.scrollIntoViewIfNeeded();
  const before = await video.evaluate((element) => ({
    source: element.currentSrc || element.querySelector('source')?.src || '',
    label: element.getAttribute('aria-label') || element.closest('article')?.innerText?.split('\n')[0] || `video-${index + 1}`,
  }));
  const outcome = await video.evaluate(async (element) => {
    element.muted = true;
    element.currentTime = 0;
    try {
      await element.play();
      const startedAt = element.currentTime;
      await new Promise((resolve) => setTimeout(resolve, 900));
      const advanced = element.currentTime > startedAt + 0.12;
      const result = {
        ok: advanced && !element.error,
        advanced,
        duration: Number.isFinite(element.duration) ? element.duration : null,
        currentTime: element.currentTime,
        readyState: element.readyState,
        networkState: element.networkState,
        error: element.error ? `${element.error.code}:${element.error.message}` : null,
      };
      element.pause();
      return result;
    } catch (error) {
      return { ok: false, advanced: false, duration: null, currentTime: element.currentTime, readyState: element.readyState, networkState: element.networkState, error: `${error.name}: ${error.message}` };
    }
  });
  results.push({ ...before, ...outcome });
}

const failures = results.filter((result) => !result.ok);
await page.locator('#heroFilmPlay').scrollIntoViewIfNeeded();
await page.locator('#heroFilmPlay').click();
await page.waitForTimeout(900);
const hero = await page.locator('#heroFilmVideo').evaluate((element) => ({
  ok: element.controls && !element.paused && element.currentTime > 0.1 && !element.error,
  controls: element.controls,
  paused: element.paused,
  currentTime: element.currentTime,
  error: element.error ? `${element.error.code}:${element.error.message}` : null,
}));
if (!hero.ok) failures.push({ label: 'Expanded hero film', ...hero });
const report = { base, tested: results.length + 1, passed: results.length + 1 - failures.length, failed: failures.length, hero, failures, consoleErrors };
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(failures.length || consoleErrors.length ? 1 : 0);
