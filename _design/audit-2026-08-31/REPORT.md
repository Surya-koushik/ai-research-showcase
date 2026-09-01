# Website-wide visual audit — 2026-08-31

Branch: `codex/website-wide-visual-audit`

## Outcome

The shared showcase already had a strong brand direction. This pass kept that direction and fixed the inconsistencies that made parts of the product feel unfinished: inaccessible drawer behavior, weak action feedback, undersized primary controls, a non-actionable empty state, and two embedded dashboards that were desktop canvases rather than responsive interfaces.

Baseline design score: **B**

Final design score: **A-**
AI-slop score: **A** before and after. The site remains intentionally outside the generic SaaS and developer-dark-site patterns named in `PRODUCT.md`.

## Coverage

- 17 rendered routes: home, four data-driven tool pages, H10, media desk, login, tool template, and every standalone embedded project HTML artifact.
- Five viewport widths per route: 390, 768, 1280, 1440, and 1920 CSS pixels.
- 65 baseline captures plus an 85-capture exhaustive final pass.
- Dark-scheme browser preference plus a separate reduced-motion context.
- Interaction flows: drawer open/close/focus return, search empty/reset, scroll-position nav state, invalid tool id, media-desk filtering, two dashboard navigation models, and unavailable-login feedback.

## Findings and resolution

### High impact

1. **Two embedded dashboards overflowed on mobile.** One was effectively fixed at 1080px and overflowed by 690px at 390px; another overflowed by 239px. Both now recompose for mobile with single-column content, horizontally scrollable local navigation, contained tables, and 44px primary controls. **Verified.**
2. **Closed navigation drawers remained tabbable.** The drawer now uses `inert`, moves focus to its close control on open, and returns focus to the menu toggle on close. **Verified.**
3. **The catalogue empty state described an action but offered none.** It now includes a real “Clear filters” action that restores all filter dimensions and returns focus to search. **Verified.**

### Medium impact

4. **Primary controls used inconsistent target heights.** Shared navigation, filters, form controls, gallery arrows, login controls, and representative demo controls now use a practical 44px minimum where the whole component is an action. Dense media-desk slot/copy cells retain compact dimensions because they are secondary table utilities, not primary mobile navigation. **Verified.**
5. **Kind chips reused bright dark-theme accents as light-theme text.** Chip text now mixes each semantic hue toward the brand navy while retaining the hue distinction. Size and weight were raised for scanning. **Verified visually.**
6. **No shared pressed state existed.** Links, buttons, tabs, and summaries now use one restrained 1px press response. It follows the locked no-bounce motion language. **Verified.**

### Deferred concern

- One embedded evidence dashboard still contains legacy project-specific naming that conflicts with the handoff’s confidentiality rule. This is content/domain scope rather than visual styling, so it was not silently rewritten here. It should be anonymized in a dedicated content pass before external publication.

## Measured final state

- Horizontal-overflow records: **4 → 0**.
- Browser console results: **one transient resource-exhaustion warning** after hundreds of sequential loads; the affected route/viewport passed an isolated rerun with **0** errors.
- Reduced-motion active animations on the home page: **0**.
- Interaction checks: **13/13 passed**, **0** console errors.
- Content build: **70 records validated**, single-file bundle generated successfully.
- No layout-property animations were detected in the audited routes.

## Visual direction retained

The final system keeps the strongest existing choices: poster-like first viewport, Evolve wordmark, violet brand accent, technical cyan network field, editorial band pacing, restrained UI surfaces, dense but readable catalogue UI, and independent visual identities for embedded project evidence. The work is consolidation and production polish, not a redesign.

## Evidence

- `baseline.json`, `after-1.json`, `final-exhaustive.json`, and `isolated-rerun.json` contain the route-by-route measurements.
- `baseline/`, `after-1/`, and `final-exhaustive/` contain the corresponding screenshots.
- `_tools/visual_audit.mjs` reproduces the viewport sweep.
- `_tools/interaction_audit.mjs` reproduces the interaction checks.

PR summary: **Visual audit found six fixable cross-site issues and one deferred content concern. Six issues were fixed; responsive overflow records moved from 4 to 0, with 13/13 interaction checks and a clean isolated console rerun.**
