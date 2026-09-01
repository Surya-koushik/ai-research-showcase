import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://127.0.0.1:8099';
const outDir = path.resolve(process.argv[3] || '_design/audit-2026-08-31');
const phase = process.argv[4] || 'baseline';
const widths = process.env.AUDIT_WIDTHS
  ? process.env.AUDIT_WIDTHS.split(',').map(Number).filter(Number.isFinite)
  : [390, 768, 1280, 1440, 1920];

await mkdir(path.join(outDir, phase), { recursive: true });

const browser = await chromium.launch({ headless: true });
const seed = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await seed.goto(`${base}/index.html?intro=off`, { waitUntil: 'networkidle' });
const toolHrefs = await seed.locator('a[href^="tool.html?id="]').evaluateAll((links) =>
  [...new Set(links.map((link) => link.getAttribute('href')).filter(Boolean))].slice(0, 4)
);
await seed.close();

const allRoutes = [
  ['home', '/index.html?intro=off'],
  ...toolHrefs.map((href, index) => [`tool-${index + 1}`, `/${href}`]),
  ['feature-h10', '/h10.html'],
  ['media-desk', '/cms.html'],
  ['login', '/login.html'],
  ['tool-template', '/tool_template.html'],
  ['demo-ai-team-hub', '/projects/ai-team-hub/html/index.html'],
  ['demo-tep', '/projects/tep-dashboard/html/dashboard.html'],
  ['demo-build-tracker', '/projects/ads-ai-bim-build-tracker/html/dashboard.html'],
  ['demo-predictability', '/projects/p25-predictability/html/dashboard.html'],
  ['demo-h10-dashboard', '/projects/h10-dashboard/html/dashboard.html'],
  ['deck-bim-ai-ladders', '/projects/deck-bim-ai-ladders/html/deck.html'],
  ['deck-summit-pitch', '/projects/deck-summit-pitch/html/deck.html'],
  ['deck-project-pitch', '/projects/deck-phoenix-client/html/deck.html'],
];
const routes = process.env.AUDIT_ROUTE
  ? allRoutes.filter(([name]) => name === process.env.AUDIT_ROUTE)
  : allRoutes;

const results = [];
for (const [name, route] of routes) {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: width <= 390 ? 844 : width <= 768 ? 1024 : 1000 },
      reducedMotion: 'no-preference',
      colorScheme: 'dark',
    });
    await context.addInitScript(() => sessionStorage.setItem('asure.introSeen', '1'));
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.evaluate(async () => {
      const root = document.querySelector('.a-view') || document.scrollingElement;
      const max = Math.max(0, root.scrollHeight - root.clientHeight);
      for (let y = 0; y <= max; y += Math.max(480, Math.floor(root.clientHeight * .8))) {
        root.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 28));
      }
      root.scrollTo(0, 0);
    });
    await page.waitForTimeout(120);
    const metrics = await page.evaluate(() => {
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      };
      const interactive = [...document.querySelectorAll('a,button,input,select,textarea,[role="button"],[tabindex]')].filter(visible);
      const undersized = interactive.map((element) => {
        const rect = element.getBoundingClientRect();
        return { tag: element.tagName, label: (element.getAttribute('aria-label') || element.textContent || element.getAttribute('placeholder') || '').trim().slice(0, 50), width: Math.round(rect.width), height: Math.round(rect.height) };
      }).filter((item) => item.width < 44 || item.height < 44);
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).map((heading) => ({
        tag: heading.tagName,
        text: heading.textContent.trim().slice(0, 80),
        size: getComputedStyle(heading).fontSize,
        weight: getComputedStyle(heading).fontWeight,
      }));
      const styles = [...document.querySelectorAll('*')].slice(0, 700).map((element) => getComputedStyle(element));
      const colors = [...new Set(styles.flatMap((style) => [style.color, style.backgroundColor]).filter((color) => color !== 'rgba(0, 0, 0, 0)'))];
      const fonts = [...new Set(styles.map((style) => style.fontFamily))];
      const animatedLayoutProperties = [...document.getAnimations()].flatMap((animation) => {
        const effect = animation.effect;
        if (!effect || typeof effect.getKeyframes !== 'function') return [];
        return effect.getKeyframes().flatMap((frame) => Object.keys(frame).filter((key) => ['width','height','top','right','bottom','left','margin','padding'].some((property) => key.startsWith(property))));
      });
      return {
        title: document.title,
        h1: document.querySelector('h1')?.textContent.trim() || '',
        documentHidden: document.hidden,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        headings,
        fonts,
        colors,
        interactiveCount: interactive.length,
        undersized,
        animatedLayoutProperties: [...new Set(animatedLayoutProperties)],
      };
    });
    const screenshot = path.join(outDir, phase, `${name}-${width}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    results.push({ name, route, width, status: response?.status() || 0, consoleErrors, screenshot, ...metrics });
    await context.close();
  }
}

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', colorScheme: 'dark' });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(`${base}/index.html?intro=off`, { waitUntil: 'networkidle' });
await reducedPage.waitForTimeout(250);
const reducedMotion = await reducedPage.evaluate(() => ({
  matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
  animations: document.getAnimations().map((animation) => ({ playState: animation.playState, name: animation.animationName || '' })),
}));
await reducedContext.close();
await browser.close();

await writeFile(path.join(outDir, `${phase}.json`), JSON.stringify({ generatedAt: new Date().toISOString(), base, routes, widths, reducedMotion, results }, null, 2));
console.log(JSON.stringify({ phase, routes: routes.length, widths: widths.length, captures: results.length, overflows: results.filter((item) => item.overflow > 0).length, consoleErrors: results.reduce((sum, item) => sum + item.consoleErrors.length, 0), reducedAnimations: reducedMotion.animations.length }));
